// Leonida Legend — the hand-in program for the GTA 6 Trophy Guide entry.
// Node 22, standard library only. The entry itself is the app/ folder beside
// this file: plain static files (HTML, CSS, ES modules, JSON) with no build
// step, fully offline. This program copies app/ and screenshots/ into the
// output directory and writes dossier.json there with the vendored make.fun
// library, so the judge gets the app, the screenshots and the summary in one
// place. vendor/makefun-frontend.ts stays untouched: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// Run it locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader's container MAKEFUN_OUTPUT_DIR stands in for /output).
// Serve the app while developing with: node serve.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the rest refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
