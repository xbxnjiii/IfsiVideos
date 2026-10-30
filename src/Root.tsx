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
import {Glycemie, GlycemieProps} from './videos/glycemie/Glycemie';
import {TL as GLY_TL} from './videos/glycemie/timeline';
import {Diurese, DiureseProps} from './videos/diurese/Diurese';
import {TL as DIU_TL} from './videos/diurese/timeline';
import {Avc, AvcProps} from './videos/avc/Avc';
import {TL as AVC_TL} from './videos/avc/timeline';
import {ArretCardiaque, ArretCardiaqueProps} from './videos/arret-cardiaque/ArretCardiaque';
import {TL as ACR_TL} from './videos/arret-cardiaque/timeline';
import {Spo2, Spo2Props} from './videos/spo2/Spo2';
import {TL as SPO_TL} from './videos/spo2/timeline';
import {EmboliePulmonaire, EmboliePulmonaireProps} from './videos/embolie-pulmonaire/EmboliePulmonaire';
import {TL as EP_TL} from './videos/embolie-pulmonaire/timeline';
import {AvcHistoire, AvcHistoireProps} from './videos/avc-histoire/AvcHistoire';
import {TL as AVCH_TL} from './videos/avc-histoire/timeline';
import {Bpco, BpcoProps} from './videos/bpco/Bpco';
import {TL as BPCO_TL} from './videos/bpco/timeline';

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
		{/* 08 · La glycémie */}
		<Composition
			id="Glycemie"
			component={Glycemie}
			durationInFrames={GLY_TL.total}
			fps={GLY_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies GlycemieProps}
		/>
		{/* 09 · La diurèse */}
		<Composition
			id="Diurese"
			component={Diurese}
			durationInFrames={DIU_TL.total}
			fps={DIU_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies DiureseProps}
		/>
		{/* 10 · C'est quoi un AVC */}
		<Composition
			id="AVC"
			component={Avc}
			durationInFrames={AVC_TL.total}
			fps={AVC_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies AvcProps}
		/>
		{/* 11 · L'arrêt cardiaque chez l'adulte */}
		<Composition
			id="Arret-Cardiaque"
			component={ArretCardiaque}
			durationInFrames={ACR_TL.total}
			fps={ACR_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ArretCardiaqueProps}
		/>
		{/* 12 · C'est quoi la SpO₂ */}
		<Composition
			id="SpO2"
			component={Spo2}
			durationInFrames={SPO_TL.total}
			fps={SPO_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Spo2Props}
		/>
		{/* 13 · C'est quoi une embolie pulmonaire */}
		<Composition
			id="Embolie-Pulmonaire"
			component={EmboliePulmonaire}
			durationInFrames={EP_TL.total}
			fps={EP_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies EmboliePulmonaireProps}
		/>
		{/* 15 · AVC, format histoire (mystérieux) : l'histoire de Michel */}
		<Composition
			id="AVC-Histoire"
			component={AvcHistoire}
			durationInFrames={AVCH_TL.total}
			fps={AVCH_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies AvcHistoireProps}
		/>
		{/* 16 · C'est quoi la BPCO */}
		<Composition
			id="BPCO"
			component={Bpco}
			durationInFrames={BPCO_TL.total}
			fps={BPCO_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies BpcoProps}
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
