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
import {Plaies1, Plaies1Props} from './videos/plaies-1/Plaies1';
import {TL as PL1_TL} from './videos/plaies-1/timeline';
import {Plaies2, Plaies2Props} from './videos/plaies-2/Plaies2';
import {TL as PL2_TL} from './videos/plaies-2/timeline';
import {Plaies3, Plaies3Props} from './videos/plaies-3/Plaies3';
import {TL as PL3_TL} from './videos/plaies-3/timeline';
import {Bpco, BpcoProps} from './videos/bpco/Bpco';
import {TL as BPCO_TL} from './videos/bpco/timeline';
import {PriseDeSang, PriseDeSangProps} from './videos/prise-de-sang/PriseDeSang';
import {TL as PRISE_DE_SANG_TL} from './videos/prise-de-sang/timeline';
import {HygieneMains, HygieneMainsProps} from './videos/hygiene-mains/HygieneMains';
import {TL as HYGIENE_MAINS_TL} from './videos/hygiene-mains/timeline';
import {PrecautionsStandard, PrecautionsStandardProps} from './videos/precautions-standard/PrecautionsStandard';
import {TL as PRECAUTIONS_STANDARD_TL} from './videos/precautions-standard/timeline';
import {InsuffisanceCardiaque, InsuffisanceCardiaqueProps} from './videos/insuffisance-cardiaque/InsuffisanceCardiaque';
import {TL as INSUFFISANCE_CARDIAQUE_TL} from './videos/insuffisance-cardiaque/timeline';
import {Douleur1, Douleur1Props} from './videos/douleur-1/Douleur1';
import {TL as DOULEUR_1_TL} from './videos/douleur-1/timeline';
import {Douleur2, Douleur2Props} from './videos/douleur-2/Douleur2';
import {TL as DOULEUR_2_TL} from './videos/douleur-2/timeline';
import {PlancheEnfant} from './videos/planches/PlancheEnfant';
import {PlanchePoumons} from './videos/planches/PlanchePoumons';
import {QuizConstantes, QuizConstantesProps} from './videos/quiz-constantes/QuizConstantes';
import {TL as QUIZ_CONSTANTES_TL} from './videos/quiz-constantes/timeline';
import {Diabete1, Diabete1Props} from './videos/diabete-1/Diabete1';
import {TL as DIABETE_1_TL} from './videos/diabete-1/timeline';
import {Diabete2, Diabete2Props} from './videos/diabete-2/Diabete2';
import {TL as DIABETE_2_TL} from './videos/diabete-2/timeline';
import {ConstantesEnfant, ConstantesEnfantProps} from './videos/constantes-enfant/ConstantesEnfant';
import {TL as CONSTANTES_ENFANT_TL} from './videos/constantes-enfant/timeline';
import {Suppositoire, SuppositoireProps} from './videos/suppositoire/Suppositoire';
import {TL as SUPPOSITOIRE_TL} from './videos/suppositoire/timeline';
import {ObjetPlante, ObjetPlanteProps} from './videos/objet-plante/ObjetPlante';
import {TL as OBJET_PLANTE_TL} from './videos/objet-plante/timeline';
import {PlaieProfondeur, PlaieProfondeurProps} from './videos/plaie-profondeur/PlaieProfondeur';
import {TL as PLAIE_PROFONDEUR_TL} from './videos/plaie-profondeur/timeline';
import {PlaieContuse, PlaieContuseProps} from './videos/plaie-contuse/PlaieContuse';
import {TL as PLAIE_CONTUSE_TL} from './videos/plaie-contuse/timeline';
import {PlaiePiqure, PlaiePiqureProps} from './videos/plaie-piqure/PlaiePiqure';
import {TL as PLAIE_PIQURE_TL} from './videos/plaie-piqure/timeline';
import {PlaieMorsure, PlaieMorsureProps} from './videos/plaie-morsure/PlaieMorsure';
import {TL as PLAIE_MORSURE_TL} from './videos/plaie-morsure/timeline';
import {PlaieChronique, PlaieChroniqueProps} from './videos/plaie-chronique/PlaieChronique';
import {TL as PLAIE_CHRONIQUE_TL} from './videos/plaie-chronique/timeline';
import {Escarre, EscarreProps} from './videos/escarre/Escarre';
import {TL as ESCARRE_TL} from './videos/escarre/timeline';
import {PiedDiabetique, PiedDiabetiqueProps} from './videos/pied-diabetique/PiedDiabetique';
import {TL as PIED_DIABETIQUE_TL} from './videos/pied-diabetique/timeline';
import {TrousseSecours, TrousseSecoursProps} from './videos/trousse-secours/TrousseSecours';
import {TL as TROUSSE_SECOURS_TL} from './videos/trousse-secours/timeline';
import {Pansement, PansementProps} from './videos/pansement/Pansement';
import {TL as PANSEMENT_TL} from './videos/pansement/timeline';

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
		{/* 17 · Série « Les plaies », partie 1 / 3 : les bases */}
		<Composition
			id="Plaies-1"
			component={Plaies1}
			durationInFrames={PL1_TL.total}
			fps={PL1_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Plaies1Props}
		/>
		{/* 18 · Série « Les plaies », partie 2 / 3 : les plaies aiguës */}
		<Composition
			id="Plaies-2"
			component={Plaies2}
			durationInFrames={PL2_TL.total}
			fps={PL2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Plaies2Props}
		/>
		{/* 19 · Série « Les plaies », partie 3 / 3 : les plaies chroniques */}
		<Composition
			id="Plaies-3"
			component={Plaies3}
			durationInFrames={PL3_TL.total}
			fps={PL3_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Plaies3Props}
		/>
		{/* 20 · Prise-De-Sang */}
		<Composition
			id="Prise-De-Sang"
			component={PriseDeSang}
			durationInFrames={PRISE_DE_SANG_TL.total}
			fps={PRISE_DE_SANG_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PriseDeSangProps}
		/>
		{/* 21 · Hygiene-Mains */}
		<Composition
			id="Hygiene-Mains"
			component={HygieneMains}
			durationInFrames={HYGIENE_MAINS_TL.total}
			fps={HYGIENE_MAINS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies HygieneMainsProps}
		/>
		{/* 22 · Precautions-Standard */}
		<Composition
			id="Precautions-Standard"
			component={PrecautionsStandard}
			durationInFrames={PRECAUTIONS_STANDARD_TL.total}
			fps={PRECAUTIONS_STANDARD_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PrecautionsStandardProps}
		/>
		{/* 23 · Insuffisance-Cardiaque */}
		<Composition
			id="Insuffisance-Cardiaque"
			component={InsuffisanceCardiaque}
			durationInFrames={INSUFFISANCE_CARDIAQUE_TL.total}
			fps={INSUFFISANCE_CARDIAQUE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies InsuffisanceCardiaqueProps}
		/>
		{/* 24 · Douleur-1 */}
		<Composition
			id="Douleur-1"
			component={Douleur1}
			durationInFrames={DOULEUR_1_TL.total}
			fps={DOULEUR_1_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Douleur1Props}
		/>
		{/* 25 · Douleur-2 */}
		<Composition
			id="Douleur-2"
			component={Douleur2}
			durationInFrames={DOULEUR_2_TL.total}
			fps={DOULEUR_2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Douleur2Props}
		/>
		{/* 27 · Quiz-Constantes */}
		<Composition
			id="Quiz-Constantes"
			component={QuizConstantes}
			durationInFrames={QUIZ_CONSTANTES_TL.total}
			fps={QUIZ_CONSTANTES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies QuizConstantesProps}
		/>
		{/* 26 · Diabete-1 */}
		<Composition
			id="Diabete-1"
			component={Diabete1}
			durationInFrames={DIABETE_1_TL.total}
			fps={DIABETE_1_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Diabete1Props}
		/>
		{/* 26 · Diabete-2 */}
		<Composition
			id="Diabete-2"
			component={Diabete2}
			durationInFrames={DIABETE_2_TL.total}
			fps={DIABETE_2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Diabete2Props}
		/>
		{/* 28 · Constantes-Enfant */}
		<Composition
			id="Constantes-Enfant"
			component={ConstantesEnfant}
			durationInFrames={CONSTANTES_ENFANT_TL.total}
			fps={CONSTANTES_ENFANT_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ConstantesEnfantProps}
		/>
		{/* 29 · Suppositoire */}
		<Composition
			id="Suppositoire"
			component={Suppositoire}
			durationInFrames={SUPPOSITOIRE_TL.total}
			fps={SUPPOSITOIRE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies SuppositoireProps}
		/>
		{/* 30 · Objet-Plante */}
		<Composition
			id="Objet-Plante"
			component={ObjetPlante}
			durationInFrames={OBJET_PLANTE_TL.total}
			fps={OBJET_PLANTE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ObjetPlanteProps}
		/>
		{/* 31 · Plaie-Profondeur */}
		<Composition
			id="Plaie-Profondeur"
			component={PlaieProfondeur}
			durationInFrames={PLAIE_PROFONDEUR_TL.total}
			fps={PLAIE_PROFONDEUR_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PlaieProfondeurProps}
		/>
		{/* 32 · Plaie-Contuse */}
		<Composition
			id="Plaie-Contuse"
			component={PlaieContuse}
			durationInFrames={PLAIE_CONTUSE_TL.total}
			fps={PLAIE_CONTUSE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PlaieContuseProps}
		/>
		{/* 33 · Plaie-Piqure */}
		<Composition
			id="Plaie-Piqure"
			component={PlaiePiqure}
			durationInFrames={PLAIE_PIQURE_TL.total}
			fps={PLAIE_PIQURE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PlaiePiqureProps}
		/>
		{/* 34 · Plaie-Morsure */}
		<Composition
			id="Plaie-Morsure"
			component={PlaieMorsure}
			durationInFrames={PLAIE_MORSURE_TL.total}
			fps={PLAIE_MORSURE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PlaieMorsureProps}
		/>
		{/* 35 · Plaie-Chronique */}
		<Composition
			id="Plaie-Chronique"
			component={PlaieChronique}
			durationInFrames={PLAIE_CHRONIQUE_TL.total}
			fps={PLAIE_CHRONIQUE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PlaieChroniqueProps}
		/>
		{/* 36 · Escarre */}
		<Composition
			id="Escarre"
			component={Escarre}
			durationInFrames={ESCARRE_TL.total}
			fps={ESCARRE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies EscarreProps}
		/>
		{/* 37 · Pied-Diabetique */}
		<Composition
			id="Pied-Diabetique"
			component={PiedDiabetique}
			durationInFrames={PIED_DIABETIQUE_TL.total}
			fps={PIED_DIABETIQUE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PiedDiabetiqueProps}
		/>
		{/* 38 · Trousse-Secours */}
		<Composition
			id="Trousse-Secours"
			component={TrousseSecours}
			durationInFrames={TROUSSE_SECOURS_TL.total}
			fps={TROUSSE_SECOURS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TrousseSecoursProps}
		/>
		{/* 39 · Pansement */}
		<Composition
			id="Pansement"
			component={Pansement}
			durationInFrames={PANSEMENT_TL.total}
			fps={PANSEMENT_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PansementProps}
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
		{/* contrôle : planche anatomique des poumons (page 1 : anatomie, sain / BPCO, alvéoles ; page 2 : bronche, radio, loupe) */}
		<Composition id="Planche-Poumons" component={PlanchePoumons} durationInFrames={60} fps={30} width={W} height={H} defaultProps={{page: 1}} />
		<Composition id="Planche-Enfant" component={PlancheEnfant} durationInFrames={60} fps={30} width={W} height={H} defaultProps={{page: 1}} />
		{/* contrôle : illustrations et gags de la vidéo des 14 besoins */}
		<Composition id="Besoins-Illustrations" component={IconsSheet} durationInFrames={60} fps={30} width={W} height={H} />
	</>
);
