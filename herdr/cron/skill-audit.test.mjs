// Contract regression tests for herdr/cron/skill-audit.mjs.
//
// Every skill installation and transcript lives below a fresh temporary HOME.
// This prevents the audit from reading real session history or attributing a
// developer's actual skill usage to the fixtures.
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
	lutimesSync,
	mkdirSync,
	mkdtempSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { auditSkills } from "./skill-audit.mjs";

const script = join(dirname(fileURLToPath(import.meta.url)), "skill-audit.mjs");
const DAY_MS = 86_400_000;
const NOW = new Date("2026-09-14T12:00:00.000Z");

function write(path, contents) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, contents);
}

describe("herdr/cron/skill-audit contract", () => {
	let home;

	beforeEach(() => {
		home = mkdtempSync(join(tmpdir(), "skill-audit-home-"));
		mkdirSync(join(home, ".claude", "skills"), { recursive: true });
		mkdirSync(join(home, "harness", "skills"), { recursive: true });
	});

	afterEach(() => {
		rmSync(home, { recursive: true, force: true });
	});

	function installSkill(name, description, ageDays = 30) {
		const source = join(home, "harness", "skills", name);
		const installed = join(home, ".claude", "skills", name);
		mkdirSync(source, { recursive: true });
		writeFileSync(
			join(source, "SKILL.md"),
			`---\nname: ${name}\ndescription: ${JSON.stringify(description)}\n---\n`,
		);
		symlinkSync(source, installed, "dir");
		const installedAt = new Date(NOW.getTime() - ageDays * DAY_MS);
		lutimesSync(installed, installedAt, installedAt);
	}

	test("counts calls and mentions with longest overlapping skill name first", async () => {
		installSkill("ponytail", "short skill");
		installSkill("ponytail-audit", "long skill");
		const sessions = join(home, "sessions");
		write(
			join(sessions, "usage.jsonl"),
			[
				'{"text":"ponytail ponytail-audit ponytail-audit"}',
				'{"ref":"skill://ponytail-audit"}',
				'{"name":"ponytail-audit"}',
				'{"skill":"ponytail"}',
				'{"path":"/skills/ponytail/SKILL.md"}',
			].join("\n"),
		);

		const report = await auditSkills({
			home,
			scanPaths: [sessions],
			now: NOW,
		});
		const byName = Object.fromEntries(
			report.skills.map((skill) => [skill.name, skill]),
		);

		expect(byName.ponytail).toMatchObject({ calls: 2, mentions: 3 });
		expect(byName["ponytail-audit"]).toMatchObject({
			calls: 2,
			mentions: 4,
		});
	});

	test("marks a recently installed zero-call skill as new rather than unused", async () => {
		installSkill("established", "old description", 30);
		installSkill("recent", "new description", 3);

		const report = await auditSkills({
			home,
			scanPaths: [],
			newDays: 14,
			now: NOW,
		});
		const byName = Object.fromEntries(
			report.skills.map((skill) => [skill.name, skill]),
		);

		expect(byName.established).toMatchObject({ new: false, unused: true });
		expect(byName.recent).toMatchObject({ new: true, unused: false });
		expect(report.summary).toEqual({
			totalSkills: 2,
			unusedSkills: 1,
			unusedDescriptionChars: "old description".length,
		});
	});

	test("silently skips scan paths that do not exist", async () => {
		installSkill("missing-safe", "description");

		const report = await auditSkills({
			home,
			scanPaths: [join(home, "not-created")],
			now: NOW,
		});

		expect(report.skills[0]).toMatchObject({
			name: "missing-safe",
			calls: 0,
			mentions: 0,
		});
	});

	test("--json prints valid machine-readable output using only the fixture HOME", () => {
		installSkill("cli-skill", "CLI fixture", 30);
		write(
			join(home, ".claude", "projects", "project", "session.jsonl"),
			'{"skill":"cli-skill"}\n',
		);

		const result = spawnSync("bun", [script, "--json"], {
			env: { ...process.env, HOME: home },
			encoding: "utf8",
		});

		expect(result.status).toBe(0);
		expect(result.stderr).toBe("");
		const output = JSON.parse(result.stdout);
		expect(output.skills[0]).toMatchObject({
			name: "cli-skill",
			managed: true,
			calls: 1,
			mentions: 1,
		});
	});
});
