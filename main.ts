// Entry for make.fun's "Post the Meme, Win the Feed" bounty (Node 22, standard library only).
// It copies POST.json from the repository root to /output/POST.json, where the gate reads it.
// That is all the program has to do: the entry is the post itself. An AI agent made the meme
// ("My agent works while I sleep"), the post goes up on X from a public account with @_myronera
// and one play code in its text, and POST.json names the post. Nothing this program writes
// about the post is scored: the house reads the post's counts from X itself.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // Read first so a malformed POST.json fails loudly instead of copying garbage.
  const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('POST.json must be a JSON object with a string "url" field');
  }
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
