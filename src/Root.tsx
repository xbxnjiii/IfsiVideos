import React from 'react';
import {Composition} from 'remotion';
import {MascotCardsTest} from './brand/MascotCardsTest';
import {Constantes, ConstantesProps} from './videos/constantes/Constantes';
import {TL as CONSTANTES_TL} from './videos/constantes/timeline';
import {Besoins, BesoinsProps} from './videos/besoins-fondamentaux/Besoins';
import {IconsSheet} from './videos/besoins-fondamentaux/IconsSheet';
import {TL as BESOINS_TL} from './videos/besoins-fondamentaux/timeline';
import {FrequenceCardiaque, FrequenceCardiaqueProps} from './videos/frequence-cardiaque/FrequenceCardiaque';
import {TL as FC_TL} from './videos/frequence-cardiaque/timeline';
import {FrequenceRespiratoire, FrequenceRespiratoireProps} from './videos/frequence-respiratoire/FrequenceRespiratoire';
import {TL as FR_TL} from './videos/frequence-respiratoire/timeline';
import {Temperature, TemperatureProps} from './videos/temperature/Temperature';
import {TL as TEMP_TL} from './videos/temperature/timeline';
import {TensionArterielle, TensionArterielleProps} from './videos/tension-arterielle/TensionArterielle';
import {TL as TA_TL} from './videos/tension-arterielle/timeline';

// Format vertical 9:16 pour TikTok / Reels / Shorts.
const W = 1080;
const H = 1920;

export const RemotionRoot: React.FC = () => (
	<>
		{/* 02 · Les 7 constantes (v7 : + glycémie et diurèse, normes adultes, mascotte libre) */}
		<Composition
			id="Constantes"
			component={Constantes}
			durationInFrames={CONSTANTES_TL.total}
			fps={CONSTANTES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ConstantesProps}
		/>
		{/* 03 · Les 14 besoins fondamentaux (Virginia Henderson) */}
		<Composition
			id="Besoins-Fondamentaux"
			component={Besoins}
			durationInFrames={BESOINS_TL.total}
			fps={BESOINS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies BesoinsProps}
		/>
		{/* 04 · La fréquence cardiaque (une vidéo par constante) */}
		<Composition
			id="Frequence-Cardiaque"
			component={FrequenceCardiaque}
			durationInFrames={FC_TL.total}
			fps={FC_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies FrequenceCardiaqueProps}
		/>
		{/* 05 · La fréquence respiratoire */}
		<Composition
			id="Frequence-Respiratoire"
			component={FrequenceRespiratoire}
			durationInFrames={FR_TL.total}
			fps={FR_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies FrequenceRespiratoireProps}
		/>
		{/* 06 · La température corporelle */}
		<Composition
			id="Temperature"
			component={Temperature}
			durationInFrames={TEMP_TL.total}
			fps={TEMP_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TemperatureProps}
		/>
		{/* 07 · La tension artérielle */}
		<Composition
			id="Tension-Arterielle"
			component={TensionArterielle}
			durationInFrames={TA_TL.total}
			fps={TA_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TensionArterielleProps}
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
		{/* contrôle : illustrations et gags de la vidéo des 14 besoins */}
		<Composition id="Besoins-Illustrations" component={IconsSheet} durationInFrames={60} fps={30} width={W} height={H} />
	</>
);
