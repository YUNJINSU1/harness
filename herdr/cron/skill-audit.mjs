#!/usr/bin/env bun
import { lstat, readFile, readdir, realpath, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, relative, resolve, sep } from "node:path";

const DAY_MS = 86_400_000;
const DEFAULT_NEW_DAYS = 14;

function missing(error) {
	return error?.code === "ENOENT" || error?.code === "ENOTDIR";
}

function unquote(value) {
	if (value.startsWith('"') && value.endsWith('"')) {
		try {
			return JSON.parse(value);
		} catch {
			return value.slice(1, -1);
		}
	}
	if (value.startsWith("'") && value.endsWith("'"))
		return value.slice(1, -1).replaceAll("''", "'");
	return value;
}

export function descriptionFromSkill(contents) {
	const lines = contents.replaceAll("\r\n", "\n").split("\n");
	if (lines[0]?.trim() !== "---") return "";
	const end = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
	if (end < 0) return "";
	for (let index = 1; index < end; index += 1) {
		const match = lines[index].match(/^description:\s*(.*)$/);
		if (!match) continue;
		const value = match[1].trim();
		if (!/^[>|][+-]?$/.test(value)) return unquote(value);
		const block = [];
		for (index += 1; index < end; index += 1) {
			const line = lines[index];
			if (line && !/^\s/.test(line)) break;
			block.push(line);
		}
		const indents = block
			.filter(Boolean)
			.map((line) => line.match(/^\s*/)[0].length);
		const indent = indents.length ? Math.min(...indents) : 0;
		const normalized = block.map((line) => line.slice(indent));
		return value.startsWith(">")
			? normalized.join(" ").replace(/\s+/g, " ").trim()
			: normalized.join("\n").trimEnd();
	}
	return "";
}

function within(path, root) {
	const offset = relative(root, path);
	return (
		offset === "" ||
		(offset !== ".." && !offset.startsWith(`..${sep}`) && !isAbsolute(offset))
	);
}

async function canonical(path) {
	try {
		return await realpath(path);
	} catch (error) {
		if (missing(error)) return resolve(path);
		throw error;
	}
}

export async function collectInstalledSkills({
	home = homedir(),
	skillsDir = join(home, ".claude", "skills"),
	managedRoot = join(home, "harness", "skills"),
} = {}) {
	let entries;
	try {
		entries = await readdir(skillsDir, { withFileTypes: true });
	} catch (error) {
		if (missing(error)) return [];
		throw error;
	}
	const canonicalManagedRoot = await canonical(managedRoot);
	const skills = [];
	for (const entry of entries) {
		const installedPath = join(skillsDir, entry.name);
		const skillFile = join(installedPath, "SKILL.md");
		let contents;
		let installed;
		let source;
		try {
			[contents, installed, source] = await Promise.all([
				readFile(skillFile, "utf8"),
				lstat(installedPath),
				realpath(installedPath),
			]);
		} catch (error) {
			if (missing(error)) continue;
			throw error;
		}
		const description = descriptionFromSkill(contents);
		skills.push({
			name: entry.name,
			managed: within(source, canonicalManagedRoot),
			descriptionChars: [...description].length,
			installedAt: installed.mtime,
		});
	}
	return skills;
}

// Plugin-provided skills load exactly like the ones in the skills directory
// and cost the same always-loaded description, but they live in the plugin
// cache, so auditing only the skills directory hides them — and the worst
// offender found so far (six skills, zero calls in six months) was a plugin.
// Only user-scope installs are counted: a project-scope plugin loads only
// inside its own project and carries no cost in unrelated sessions.
//
// A plugin manifest may declare its skill roots; the ones that do not follow
// the `skills/` convention. Declared roots are trusted over what is on disk,
// because a directory the manifest does not name is never loaded.
export async function collectPluginSkills({
	home = homedir(),
	pluginsFile = join(home, ".claude", "plugins", "installed_plugins.json"),
} = {}) {
	let manifest;
	try {
		manifest = JSON.parse(await readFile(pluginsFile, "utf8"));
	} catch (error) {
		if (missing(error)) return [];
		throw error;
	}
	const skills = [];
	for (const [id, installs] of Object.entries(manifest?.plugins ?? {})) {
		const install = (installs ?? []).find((entry) => entry?.scope === "user");
		if (!install?.installPath) continue;
		let roots = [join(install.installPath, "skills")];
		try {
			const plugin = JSON.parse(
				await readFile(
					join(install.installPath, ".claude-plugin", "plugin.json"),
					"utf8",
				),
			);
			if (Array.isArray(plugin?.skills) && plugin.skills.length)
				roots = plugin.skills.map((path) => resolve(install.installPath, path));
		} catch (error) {
			if (!missing(error)) throw error;
		}
		for (const root of roots) {
			for (const path of await skillDirectories(root)) {
				let contents;
				let installed;
				try {
					[contents, installed] = await Promise.all([
						readFile(join(path, "SKILL.md"), "utf8"),
						lstat(path),
					]);
				} catch (error) {
					if (missing(error)) continue;
					throw error;
				}
				skills.push({
					name: path.split(sep).at(-1),
					managed: false,
					plugin: id,
					descriptionChars: [...descriptionFromSkill(contents)].length,
					installedAt: installed.mtime,
				});
			}
		}
	}
	return skills;
}

// A declared root is either the skill directory itself or a directory of
// them, so both shapes have to be accepted.
async function skillDirectories(root) {
	try {
		await stat(join(root, "SKILL.md"));
		return [root];
	} catch (error) {
		if (!missing(error)) throw error;
	}
	let entries;
	try {
		entries = await readdir(root, { withFileTypes: true });
	} catch (error) {
		if (missing(error)) return [];
		throw error;
	}
	return entries
		.filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
		.map((entry) => join(root, entry.name));
}

function escapedAlternatives(names) {
	return [...names]
		.sort((left, right) => right.length - left.length || left.localeCompare(right))
		.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|");
}

export function countUsage(contents, names) {
	const counts = Object.fromEntries(
		names.map((name) => [name, { calls: 0, mentions: 0 }]),
	);
	if (!names.length) return counts;
	// A single longest-first alternation assigns every overlap to its most specific skill.
	const alternatives = escapedAlternatives(names);
	const mentions = new RegExp(`(${alternatives})`, "gu");
	const calls = new RegExp(
		`(?:skill://(?<uri>${alternatives})(?![A-Za-z0-9_-])|/skills/(?<path>${alternatives})/SKILL\\.md|"(?:name|skill)"\\s*:\\s*"(?<field>${alternatives})")`,
		"gu",
	);
	for (const match of contents.matchAll(mentions)) counts[match[1]].mentions += 1;
	for (const match of contents.matchAll(calls)) {
		const name = match.groups.uri ?? match.groups.path ?? match.groups.field;
		counts[name].calls += 1;
	}
	return counts;
}

async function transcriptFiles(path, seen = new Set()) {
	let metadata;
	try {
		metadata = await stat(path);
	} catch (error) {
		if (missing(error)) return [];
		throw error;
	}
	if (metadata.isFile()) return /\.jsonl?$/i.test(path) ? [path] : [];
	if (!metadata.isDirectory()) return [];
	const source = await realpath(path);
	if (seen.has(source)) return [];
	seen.add(source);
	const entries = await readdir(path);
	const nested = await Promise.all(
		entries.map((entry) => transcriptFiles(join(path, entry), seen)),
	);
	return nested.flat();
}

export function defaultScanPaths(home = homedir()) {
	return [
		join(home, ".claude", "projects"),
		join(home, ".omp", "agent", "sessions"),
		join(home, ".codex", "sessions"),
		join(home, ".config", "herdr", "session-history.json"),
	];
}

export async function auditSkills({
	home = homedir(),
	skillsDir = join(home, ".claude", "skills"),
	managedRoot = join(home, "harness", "skills"),
	pluginsFile = join(home, ".claude", "plugins", "installed_plugins.json"),
	scanPaths = defaultScanPaths(home),
	newDays = DEFAULT_NEW_DAYS,
	now = new Date(),
} = {}) {
	if (!Number.isFinite(newDays) || newDays < 0)
		throw new Error("newDays must be a non-negative number");
	const generatedAt = new Date(now);
	if (Number.isNaN(generatedAt.getTime())) throw new Error("now must be a valid date");
	const [directorySkills, pluginSkills] = await Promise.all([
		collectInstalledSkills({ home, skillsDir, managedRoot }),
		collectPluginSkills({ home, pluginsFile }),
	]);
	// A name can appear in both places; the directory entry is the one the
	// agent resolves, so it wins and the plugin copy is dropped rather than
	// counted twice.
	const seen = new Set(directorySkills.map((skill) => skill.name));
	const installed = [
		...directorySkills,
		...pluginSkills.filter((skill) => !seen.has(skill.name)),
	];
	const names = installed.map((skill) => skill.name);
	const totals = Object.fromEntries(
		names.map((name) => [name, { calls: 0, mentions: 0 }]),
	);
	const paths = (
		await Promise.all(scanPaths.map((path) => transcriptFiles(resolve(path))))
	).flat();
	for (const path of paths) {
		const counts = countUsage(await readFile(path, "utf8"), names);
		for (const name of names) {
			totals[name].calls += counts[name].calls;
			totals[name].mentions += counts[name].mentions;
		}
	}
	const skills = installed.map((skill) => {
		const ageMs = generatedAt.getTime() - skill.installedAt.getTime();
		const isNew = ageMs <= newDays * DAY_MS;
		return {
			name: skill.name,
			managed: skill.managed,
			plugin: skill.plugin ?? null,
			descriptionChars: skill.descriptionChars,
			installedAt: skill.installedAt.toISOString(),
			ageDays: Math.max(0, Math.floor(ageMs / DAY_MS)),
			new: isNew,
			calls: totals[skill.name].calls,
			mentions: totals[skill.name].mentions,
			unused: totals[skill.name].calls === 0 && !isNew,
		};
	});
	skills.sort(
		(left, right) =>
			Number(left.calls !== 0) - Number(right.calls !== 0) ||
			right.mentions - left.mentions ||
			left.name.localeCompare(right.name),
	);
	const unused = skills.filter((skill) => skill.unused);
	return {
		generatedAt: generatedAt.toISOString(),
		newDays,
		scanPaths: scanPaths.map((path) => resolve(path)),
		skills,
		summary: {
			totalSkills: skills.length,
			unusedSkills: unused.length,
			unusedDescriptionChars: unused.reduce(
				(total, skill) => total + skill.descriptionChars,
				0,
			),
		},
	};
}

function table(rows) {
	const widths = rows[0].map((_, column) =>
		Math.max(...rows.map((row) => String(row[column]).length)),
	);
	return rows
		.map((row, rowIndex) =>
			row
				.map((cell, column) => {
					const value = String(cell);
					if (rowIndex === 1) return value.repeat(widths[column]);
					return value.padEnd(widths[column]);
				})
				.join("  ")
				.trimEnd(),
		)
		.join("\n");
}

export function renderTable(report) {
	const rows = [
		["스킬", "상태", "범위", "호출", "언급", "설명 문자", "설치일"],
		["-", "-", "-", "-", "-", "-", "-"],
		...report.skills.map((skill) => [
			skill.name,
			skill.new ? "new" : skill.unused ? "unused" : "used",
			skill.plugin ? `plugin:${skill.plugin.split("@")[0]}` : skill.managed ? "managed" : "external",
			skill.calls,
			skill.mentions,
			skill.descriptionChars,
			skill.installedAt.slice(0, 10),
		]),
	];
	return `${table(rows)}\n\n요약: 전체 ${report.summary.totalSkills}개, 미사용 ${report.summary.unusedSkills}개, 미사용 description ${report.summary.unusedDescriptionChars}문자`;
}

function requiredValue(argv, index, option) {
	const value = argv[index + 1];
	if (value === undefined) throw new Error(`${option} requires a value`);
	return value;
}

export function parseArgs(argv, home = homedir()) {
	const options = {
		json: false,
		newDays: DEFAULT_NEW_DAYS,
		skillsDir: join(home, ".claude", "skills"),
		managedRoot: join(home, "harness", "skills"),
		scanPaths: [],
		help: false,
	};
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--json") options.json = true;
		else if (argument === "--help" || argument === "-h") options.help = true;
		else if (argument === "--new-days") {
			options.newDays = Number(requiredValue(argv, index, argument));
			index += 1;
		} else if (argument === "--skills-dir") {
			options.skillsDir = requiredValue(argv, index, argument);
			index += 1;
		} else if (argument === "--managed-root") {
			options.managedRoot = requiredValue(argv, index, argument);
			index += 1;
		} else if (argument === "--scan") {
			options.scanPaths.push(requiredValue(argv, index, argument));
			index += 1;
		} else if (argument === "--") {
			options.scanPaths.push(...argv.slice(index + 1));
			break;
		} else if (argument.startsWith("-")) {
			throw new Error(`unknown option: ${argument}`);
		} else options.scanPaths.push(argument);
	}
	if (!options.scanPaths.length) options.scanPaths = defaultScanPaths(home);
	return options;
}

export async function main(argv = process.argv.slice(2)) {
	const options = parseArgs(argv);
	if (options.help) {
		console.log(
			"usage: bun herdr/cron/skill-audit.mjs [--json] [--new-days N] [--skills-dir PATH] [--managed-root PATH] [--scan PATH ...] [PATH ...]",
		);
		return;
	}
	const report = await auditSkills(options);
	console.log(options.json ? JSON.stringify(report, null, 2) : renderTable(report));
}

if (import.meta.main) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
