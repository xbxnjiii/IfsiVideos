import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// conteneur de travail : navigateur sans interface préinstallé (quelle que soit sa version), 4 rendus en parallèle
// (`npm run render:…` sans options)
const findHeadless = (): string | null => {
	const root = '/opt/pw-browsers';
	if (!fs.existsSync(root)) return null;
	for (const d of fs.readdirSync(root).filter((n) => n.startsWith('chromium_headless_shell-')).sort().reverse()) {
		for (const exe of ['chrome-linux/headless_shell', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
			const p = `${root}/${d}/${exe}`;
			if (fs.existsSync(p)) return p;
		}
	}
	return null;
};
const HEADLESS = findHeadless();
if (HEADLESS) {
	Config.setBrowserExecutable(HEADLESS);
	Config.setConcurrency(4);
}
