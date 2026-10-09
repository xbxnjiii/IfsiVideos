// Rend quelques images d'une composition (contrôle qualité image par image).
// Usage : OUT=dossier COMP=Constantes node scripts/qa/stills.mjs 10 30 60 …
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const frames = process.argv.slice(2).map(Number);
const out = process.env.OUT ?? 'out/stills';
const id = process.env.COMP ?? "Constantes";
const scale = Number(process.env.SCALE ?? 0.4);
const browserExecutable = process.env.BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const frame of frames) {
	await renderStill({composition, serveUrl, frame, output: `${out}/f${String(frame).padStart(4, '0')}.png`, browserExecutable, scale});
	console.log('ok', frame);
}
