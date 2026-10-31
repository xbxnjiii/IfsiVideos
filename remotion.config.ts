import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// conteneur de travail : navigateur sans interface préinstallé, 4 rendus en parallèle (`npm run render:…` sans options)
const HEADLESS = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (fs.existsSync(HEADLESS)) {
	Config.setBrowserExecutable(HEADLESS);
	Config.setConcurrency(4);
}
