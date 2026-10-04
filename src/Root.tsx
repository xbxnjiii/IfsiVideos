import React from 'react';
import {Composition} from 'remotion';
import {PriseDeSang, PriseDeSangProps} from './videos/prise-de-sang/PriseDeSang';
import {FPS, TOTAL} from './videos/prise-de-sang/timeline';
import './theme';

// Format vertical 9:16 pour TikTok / Reels / Shorts.
const W = 1080;
const H = 1920;

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="PriseDeSang"
			component={PriseDeSang}
			durationInFrames={TOTAL}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{sfx: true} satisfies PriseDeSangProps}
		/>
	</>
);
