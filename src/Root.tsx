import React from 'react';
import {Composition} from 'remotion';
import {PriseDeSang, PriseDeSangProps} from './videos/prise-de-sang/PriseDeSang';
import {FPS, TOTAL} from './videos/prise-de-sang/timeline';
import {Constantes, ConstantesProps} from './videos/constantes/Constantes';
import {FPS as FPS_CONST, TOTAL as TOTAL_CONST} from './videos/constantes/cues';
import {LpiConstantes, LpiConstantesProps} from './videos/lpi-constantes/LpiConstantes';
import {TL as LPI_TL} from './videos/lpi-constantes/timeline';
import {LpiConstantesV3, LpiConstantesV3Props} from './videos/lpi-constantes-v3/LpiConstantesV3';
import {TL as LPI3_TL} from './videos/lpi-constantes-v3/timeline';
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
		<Composition
			id="Constantes"
			component={Constantes}
			durationInFrames={TOTAL_CONST}
			fps={FPS_CONST}
			width={W}
			height={H}
			defaultProps={{voice: true, music: true, sfx: true, captions: true} satisfies ConstantesProps}
		/>
		{/* La Petite IDE — nouvelle direction artistique (référence pour la série) */}
		<Composition
			id="LPI-Constantes"
			component={LpiConstantes}
			durationInFrames={LPI_TL.total}
			fps={LPI_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true, decor: 'none'} satisfies LpiConstantesProps}
		/>
		{/* v3 : voix IA, motion design « moderne » (mascotte planche v2, termes qui claquent, caméra) */}
		<Composition
			id="LPI-Constantes-V3"
			component={LpiConstantesV3}
			durationInFrames={LPI3_TL.total}
			fps={LPI3_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies LpiConstantesV3Props}
		/>
	</>
);
