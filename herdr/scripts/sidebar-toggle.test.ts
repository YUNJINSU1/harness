// Contract regression tests for herdr/scripts/sidebar-toggle.sh.
//
// Every case injects a fake herdr executable and gives the script a fresh
// HOME and TMPDIR. The real herdr server, the user's panes, the user's HOME,
// and the host-wide sidebar lock are therefore outside this test boundary.
import { expect, test } from "bun:test";
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const sidebarScript =
	process.env.SIDEBAR_TOGGLE_SCRIPT ?? join(import.meta.dir, "sidebar-toggle.sh");

interface Pane {
	pane_id: string;
	label: string;
}

interface Fixture {
	root: string;
	callsPath: string;
	closedPath: string;
	env: NodeJS.ProcessEnv;
}

function makeFixture(panes: Pane[] = []): Fixture {
	const root = realpathSync(mkdtempSync(join(tmpdir(), "sidebar-toggle-")));
	const home = join(root, "home");
	const privateTmp = join(root, "tmp");
	mkdirSync(home);
	mkdirSync(privateTmp);

	const callsPath = join(root, "calls");
	const closedPath = join(root, "closed");
	const executable = join(root, "herdr");
	writeFileSync(callsPath, "");
	writeFileSync(closedPath, "");
	writeFileSync(
		join(root, "panes.json"),
		JSON.stringify({ result: { panes } }),
	);
	writeFileSync(
		executable,
		`#!/usr/bin/env bash
set -euo pipefail

{
	printf '%s\\037' "$@"
	printf '\\n'
} >> "$FAKE_HERDR_CALLS"

case "\${1:-}:\${2:-}" in
	pane:list)
		if [[ "\${FAKE_BLOCK_ON_PANE_LIST:-0}" == 1 && ! -e "$FAKE_HERDR_DIR/pane-list-blocked" ]]; then
			touch "$FAKE_HERDR_DIR/pane-list-blocked"
			printf 'fake-pane-list-blocked\n' >&2
			IFS= read -r _
		fi
		cat "$FAKE_HERDR_DIR/panes.json"
		;;
	plugin:pane)
		case "\${3:-}" in
			open)
				plugin=""
				while (( $# )); do
					if [[ "$1" == --plugin ]]; then
						plugin="$2"
						break
					fi
					shift
				done
				case "$plugin" in
					huketo.sheep) pane_id="sheep-new" ;;
					usagebar) pane_id="usage-new" ;;
					*) printf 'unexpected plugin: %s\\n' "$plugin" >&2; exit 1 ;;
				esac
				printf '{"result":{"plugin_pane":{"pane":{"pane_id":"%s"}}}}\\n' "$pane_id"
				;;
			close)
				if [[ "\${FAKE_PLUGIN_CLOSE_FAILURE:-}" == plugin_pane_not_found ]]; then
					printf '{"error":{"code":"plugin_pane_not_found"}}\\n' >&2
					exit 1
				fi
				printf 'plugin:%s\\n' "$4" >> "$FAKE_HERDR_CLOSED"
				printf '{"result":{}}\\n'
				;;
			*) printf 'unexpected fake plugin pane call: %s\\n' "$*" >&2; exit 1 ;;
		esac
		;;
	pane:close)
		printf 'pane:%s\\n' "$3" >> "$FAKE_HERDR_CLOSED"
		printf '{"result":{}}\\n'
		;;
	pane:layout)
		printf '{"result":{"layout":{"panes":[{"pane_id":"%s","rect":{"width":80,"height":20}}],"area":{"width":100,"height":40}}}}\\n' "$4"
		;;
	pane:resize)
		direction="$6"
		counter="$FAKE_HERDR_DIR/resize-$direction"
		count=$(cat "$counter" 2>/dev/null || printf '0')
		count=$((count + 1))
		printf '%s' "$count" > "$counter"
		width=64
		height=14
		case "$direction" in
			right) [[ "$count" -eq 1 ]] && width=70 ;;
			up) [[ "$count" -eq 1 ]] && height=16 ;;
			*) printf 'unexpected resize direction: %s\\n' "$direction" >&2; exit 1 ;;
		esac
		printf '{"result":{"resize":{"layout":{"panes":[{"pane_id":"%s","rect":{"width":%s,"height":%s}}],"area":{"width":100,"height":40}}}}}\\n' "$4" "$width" "$height"
		;;
	*)
		printf 'unexpected fake herdr call: %s\\n' "$*" >&2
		exit 1
		;;
esac
`,
		{ mode: 0o755 },
	);

	return {
		root,
		callsPath,
		closedPath,
		env: {
			...process.env,
			HOME: home,
			TMPDIR: privateTmp,
			HERDR_BIN_PATH: executable,
			FAKE_HERDR_CALLS: callsPath,
			FAKE_HERDR_CLOSED: closedPath,
			FAKE_HERDR_DIR: root,
		},
	};
}

function runSidebar(fixture: Fixture, args: string[] = []) {
	return Bun.spawnSync(["bash", sidebarScript, ...args], {
		env: fixture.env,
		stdout: "pipe",
		stderr: "pipe",
	});
}

function recordedCalls(fixture: Fixture): string[][] {
	return readFileSync(fixture.callsPath, "utf8")
		.split("\n")
		.filter(Boolean)
		.map((line) => line.split("\u001f").filter(Boolean));
}

function pluginOpenCalls(calls: string[][]): string[][] {
	return calls.filter(
		(call) => call[0] === "plugin" && call[1] === "pane" && call[2] === "open",
	);
}


function removeFixture(fixture: Fixture): void {
	rmSync(fixture.root, { recursive: true, force: true });
}

test("toggle opens the pasture first and splits usage below that pane", () => {
	const fixture = makeFixture();
	try {
		const result = runSidebar(fixture);
		expect(result.exitCode).toBe(0);
		expect(result.stderr.toString()).toBe("");

		const calls = recordedCalls(fixture);
		const opens = pluginOpenCalls(calls);
		expect(opens).toEqual([
			[
				"plugin",
				"pane",
				"open",
				"--plugin",
				"huketo.sheep",
				"--entrypoint",
				"pasture",
				"--placement",
				"split",
				"--direction",
				"right",
				"--no-focus",
			],
			[
				"plugin",
				"pane",
				"open",
				"--plugin",
				"usagebar",
				"--entrypoint",
				"limits",
				"--placement",
				"split",
				"--target-pane",
				"sheep-new",
				"--direction",
				"down",
				"--no-focus",
			],
		]);
		const resizes = calls.filter(
			(call) => call[0] === "pane" && call[1] === "resize",
		);
		expect(resizes.map((call) => call[5])).toEqual([
			"right",
			"right",
			"up",
			"up",
		]);
	} finally {
		removeFixture(fixture);
	}
});

test("toggle closes an existing pane without opening a new sidebar", () => {
	const fixture = makeFixture([
		{ pane_id: "usage-existing", label: "Agent Usage" },
	]);
	try {
		const result = runSidebar(fixture, ["--toggle"]);
		expect(result.exitCode).toBe(0);

		const calls = recordedCalls(fixture);
		expect(
			calls.filter(
				(call) => call[0] === "plugin" && call[1] === "pane" && call[2] === "close",
			),
		).toEqual([["plugin", "pane", "close", "usage-existing"]]);
		expect(pluginOpenCalls(calls)).toEqual([]);
	} finally {
		removeFixture(fixture);
	}
});

test("rebuild closes an existing pane before opening a fresh sidebar", () => {
	const fixture = makeFixture([
		{ pane_id: "sheep-existing", label: "Sheep pasture" },
	]);
	try {
		const result = runSidebar(fixture, ["--rebuild"]);
		expect(result.exitCode).toBe(0);

		const calls = recordedCalls(fixture);
		const closeIndex = calls.findIndex(
			(call) => call.join(" ") === "plugin pane close sheep-existing",
		);
		const openIndex = calls.findIndex(
			(call) => call.join(" ").startsWith("plugin pane open "),
		);
		expect(closeIndex).toBeGreaterThanOrEqual(0);
		expect(openIndex).toBeGreaterThan(closeIndex);
		expect(pluginOpenCalls(calls)).toHaveLength(2);
	} finally {
		removeFixture(fixture);
	}
});

test("rebuild closes every pane carrying either sidebar label", () => {
	const fixture = makeFixture([
		{ pane_id: "usage-1", label: "Agent Usage" },
		{ pane_id: "usage-2", label: "Agent Usage" },
		{ pane_id: "sheep-1", label: "Sheep pasture" },
		{ pane_id: "sheep-2", label: "Sheep pasture" },
	]);
	try {
		const result = runSidebar(fixture, ["-r"]);
		expect(result.exitCode).toBe(0);

		const closed = recordedCalls(fixture)
			.filter(
				(call) => call[0] === "plugin" && call[1] === "pane" && call[2] === "close",
			)
			.map((call) => call[3]);
		expect(closed).toEqual(["usage-1", "usage-2", "sheep-1", "sheep-2"]);
	} finally {
		removeFixture(fixture);
	}
});

test("a stale plugin pane falls back to the generic pane close command", () => {
	const fixture = makeFixture([
		{ pane_id: "stale-usage", label: "Agent Usage" },
	]);
	fixture.env.FAKE_PLUGIN_CLOSE_FAILURE = "plugin_pane_not_found";
	try {
		const result = runSidebar(fixture);
		expect(result.exitCode).toBe(0);

		const closeCalls = recordedCalls(fixture).filter(
			(call) => call[1] === "close" || call[2] === "close",
		);
		expect(closeCalls).toEqual([
			["plugin", "pane", "close", "stale-usage"],
			["pane", "close", "stale-usage"],
		]);
		expect(readFileSync(fixture.closedPath, "utf8")).toBe(
			"pane:stale-usage\n",
		);
	} finally {
		removeFixture(fixture);
	}
});

test("an overlapping invocation is dropped quietly instead of opening duplicates", async () => {
	const fixture = makeFixture();
	fixture.env.FAKE_BLOCK_ON_PANE_LIST = "1";
	const first = Bun.spawn(["bash", sidebarScript], {
		env: fixture.env,
		stdin: "pipe",
		stdout: "pipe",
		stderr: "pipe",
	});
	const firstStderr = first.stderr.getReader();
	try {
		// The fake's signal is emitted only after the first process owns the lock.
		const blocked = await firstStderr.read();
		expect(new TextDecoder().decode(blocked.value)).toContain(
			"fake-pane-list-blocked",
		);

		const second = Bun.spawn(["bash", sidebarScript], {
			env: fixture.env,
			stdout: "pipe",
			stderr: "pipe",
		});
		const [secondExit, secondStdout, secondStderr] = await Promise.all([
			second.exited,
			new Response(second.stdout).text(),
			new Response(second.stderr).text(),
		]);
		expect(secondExit).toBe(0);
		expect(secondStdout).toBe("");
		expect(secondStderr).toBe("");

		first.stdin.write("release\n");
		first.stdin.end();
		const [firstExit, firstStdout] = await Promise.all([
			first.exited,
			new Response(first.stdout).text(),
		]);
		expect(firstExit).toBe(0);
		expect(firstStdout).toBe("");
		expect(pluginOpenCalls(recordedCalls(fixture))).toHaveLength(2);
	} finally {
		first.stdin.end();
		await first.exited;
		removeFixture(fixture);
	}
}, 10_000);

test("an invalid argument prints usage to stderr and exits 2", () => {
	const fixture = makeFixture();
	try {
		const result = runSidebar(fixture, ["--invalid"]);
		expect(result.exitCode).toBe(2);
		expect(result.stdout.toString()).toBe("");
		expect(result.stderr.toString()).toContain(
			"usage: sidebar-toggle.sh [--toggle|--rebuild]",
		);
		expect(recordedCalls(fixture)).toEqual([]);
	} finally {
		removeFixture(fixture);
	}
});
