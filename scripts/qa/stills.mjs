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
// navigateur sans interface préinstallé, quelle que soit sa version (BROWSER=… pour en forcer un autre)
const findHeadless = () => {
	const root = '/opt/pw-browsers';
	if (!fs.existsSync(root)) return null;
	for (const d of fs.readdirSync(root).filter((n) => n.startsWith('chromium_headless_shell-')).sort().reverse()) {
		for (const exe of ['chrome-linux/headless_shell', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
			if (fs.existsSync(`${root}/${d}/${exe}`)) return `${root}/${d}/${exe}`;
		}
	}
	return null;
};
const browserExecutable = process.env.BROWSER ?? findHeadless();
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id, browserExecutable});
for (const frame of frames) {
	await renderStill({composition, serveUrl, frame, output: `${out}/f${String(frame).padStart(4, '0')}.png`, browserExecutable, scale});
	console.log('ok', frame);
}
