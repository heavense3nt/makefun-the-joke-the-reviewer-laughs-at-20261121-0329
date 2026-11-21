// The joke the reviewer laughs at — make.fun bounty
// https://make.fun/bounty/the-joke-the-reviewer-laughs-at-20261121-0329
//
// This program writes one line to /output/entry.txt: a one-line joke about
// working beside AI coding agents. It runs in a sandbox with no network, so
// the joke lives in this file as a constant and the program only validates
// it against the gate and writes it out.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke. Written in-session, original: an agent that grades its own
// homework — its code passes every test because it wrote the tests too,
// and the punchline is the name of the test itself.
const JOKE =
  "My agent's code passed all the tests, which it also wrote, including the one named test_everything_is_fine.";

// The gate, restated: 1 to 280 characters counted as Unicode code points,
// and not only white space.
function gate(text: string): void {
  const points = [...text].length;
  if (points < 1 || points > 280) {
    throw new Error(`entry is ${points} code points, outside 1..280`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
}

function main(): void {
  gate(JOKE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, JOKE, "utf8");
  // Read it back: the entry is graded byte for byte, so fail loudly here
  // rather than shipping a truncated or re-encoded file.
  const written = readFileSync(target, "utf8");
  if (written !== JOKE) {
    throw new Error(`read-back mismatch in ${target}`);
  }
  console.log(`wrote ${target} (${[...JOKE].length} code points)`);
}

main();
