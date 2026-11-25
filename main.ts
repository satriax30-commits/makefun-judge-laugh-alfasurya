import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "My out-of-office reply says 'I'm away from my desk' — the only email I've written all year that isn't a lie.";

const MAX_CHARS = 200;

function validate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `joke must be 1-${MAX_CHARS} characters, got ${text.length}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("joke must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("joke must be a single line");
  }
}

function main(): void {
  validate(JOKE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, JOKE, "utf8");
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== JOKE) {
    throw new Error("read-back mismatch: entry.txt differs from the joke");
  }
  validate(roundTrip);
  console.log(`wrote ${JOKE.length} characters to ${outPath}`);
}

main();
