import React from 'react';
import {Composition} from 'remotion';
import {MascotCardsTest} from './brand/MascotCardsTest';
import {Constantes, ConstantesProps} from './videos/constantes/Constantes';
import {TL as CONSTANTES_TL} from './videos/constantes/timeline';

// Format vertical 9:16 pour TikTok / Reels / Shorts.
const W = 1080;
const H = 1920;

export const RemotionRoot: React.FC = () => (
	<>
		{/* 02 · Les 5 constantes (v5 : mascotte libre, symptômes, repères adultes) */}
		<Composition
			id="Constantes"
			component={Constantes}
			durationInFrames={CONSTANTES_TL.total}
			fps={CONSTANTES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ConstantesProps}
		/>
		{/* contrôle : toutes les images d'une catégorie de la mascotte (cat = expressions, symptomes…) */}
		<Composition
			id="Mascotte-Planche"
			component={MascotCardsTest}
			durationInFrames={1}
			fps={30}
			width={W}
			height={H}
			defaultProps={{cat: 'expressions', mode: 'free' as const}}
		/>
	</>
);
