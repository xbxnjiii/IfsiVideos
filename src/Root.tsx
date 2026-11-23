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
import {Brulure, BrulureProps} from './videos/brulure/Brulure';
import {TL as BRULURE_TL} from './videos/brulure/timeline';
import {Echarde, EchardeProps} from './videos/echarde/Echarde';
import {TL as ECHARDE_TL} from './videos/echarde/timeline';
import {Tique, TiqueProps} from './videos/tique/Tique';
import {TL as TIQUE_TL} from './videos/tique/timeline';
import {SaignementNez, SaignementNezProps} from './videos/saignement-nez/SaignementNez';
import {TL as SAIGNEMENT_NEZ_TL} from './videos/saignement-nez/timeline';
import {PiqureAbeille, PiqureAbeilleProps} from './videos/piqure-abeille/PiqureAbeille';
import {TL as PIQURE_ABEILLE_TL} from './videos/piqure-abeille/timeline';
import {Entorse, EntorseProps} from './videos/entorse/Entorse';
import {TL as ENTORSE_TL} from './videos/entorse/timeline';
import {Brulure1, Brulure1Props} from './videos/brulure-1/Brulure1';
import {TL as BRULURE_1_TL} from './videos/brulure-1/timeline';
import {Brulure2, Brulure2Props} from './videos/brulure-2/Brulure2';
import {TL as BRULURE_2_TL} from './videos/brulure-2/timeline';
import {Brulure3, Brulure3Props} from './videos/brulure-3/Brulure3';
import {TL as BRULURE_3_TL} from './videos/brulure-3/timeline';
import {CancerProstate, CancerProstateProps} from './videos/cancer-prostate/CancerProstate';
import {TL as CANCER_PROSTATE_TL} from './videos/cancer-prostate/timeline';
import {CancerSein, CancerSeinProps} from './videos/cancer-sein/CancerSein';
import {TL as CANCER_SEIN_TL} from './videos/cancer-sein/timeline';
import {CancerPoumon, CancerPoumonProps} from './videos/cancer-poumon/CancerPoumon';
import {TL as CANCER_POUMON_TL} from './videos/cancer-poumon/timeline';
import {CancerColorectal, CancerColorectalProps} from './videos/cancer-colorectal/CancerColorectal';
import {TL as CANCER_COLORECTAL_TL} from './videos/cancer-colorectal/timeline';
import {CancerVessie, CancerVessieProps} from './videos/cancer-vessie/CancerVessie';
import {TL as CANCER_VESSIE_TL} from './videos/cancer-vessie/timeline';
import {CancerPancreas, CancerPancreasProps} from './videos/cancer-pancreas/CancerPancreas';
import {TL as CANCER_PANCREAS_TL} from './videos/cancer-pancreas/timeline';
import {CancerEstomac, CancerEstomacProps} from './videos/cancer-estomac/CancerEstomac';
import {TL as CANCER_ESTOMAC_TL} from './videos/cancer-estomac/timeline';
import {CancerRein, CancerReinProps} from './videos/cancer-rein/CancerRein';
import {TL as CANCER_REIN_TL} from './videos/cancer-rein/timeline';
import {CancerFoie, CancerFoieProps} from './videos/cancer-foie/CancerFoie';
import {TL as CANCER_FOIE_TL} from './videos/cancer-foie/timeline';
import {CancerOesophage, CancerOesophageProps} from './videos/cancer-oesophage/CancerOesophage';
import {TL as CANCER_OESOPHAGE_TL} from './videos/cancer-oesophage/timeline';
import {CancerAnus, CancerAnusProps} from './videos/cancer-anus/CancerAnus';
import {TL as CANCER_ANUS_TL} from './videos/cancer-anus/timeline';
import {CancerVoiesBiliaires, CancerVoiesBiliairesProps} from './videos/cancer-voies-biliaires/CancerVoiesBiliaires';
import {TL as CANCER_VOIES_BILIAIRES_TL} from './videos/cancer-voies-biliaires/timeline';
import {TubesPrelevement, TubesPrelevementProps} from './videos/tubes-prelevement/TubesPrelevement';
import {TL as TUBES_PRELEVEMENT_TL} from './videos/tubes-prelevement/timeline';
import {TubeViolet, TubeVioletProps} from './videos/tube-violet/TubeViolet';
import {TL as TUBE_VIOLET_TL} from './videos/tube-violet/timeline';
import {TubeJaune, TubeJauneProps} from './videos/tube-jaune/TubeJaune';
import {TL as TUBE_JAUNE_TL} from './videos/tube-jaune/timeline';
import {TubeJauneRenal, TubeJauneRenalProps} from './videos/tube-jaune-renal/TubeJauneRenal';
import {TL as TUBE_JAUNE_RENAL_TL} from './videos/tube-jaune-renal/timeline';
import {TubePurge, TubePurgeProps} from './videos/tube-purge/TubePurge';
import {TL as TUBE_PURGE_TL} from './videos/tube-purge/timeline';
import {OrdreTubes, OrdreTubesProps} from './videos/ordre-tubes/OrdreTubes';
import {TL as ORDRE_TUBES_TL} from './videos/ordre-tubes/timeline';
import {NfsGlobulesRouges, NfsGlobulesRougesProps} from './videos/nfs-globules-rouges/NfsGlobulesRouges';
import {TL as NFS_GLOBULES_ROUGES_TL} from './videos/nfs-globules-rouges/timeline';
import {NfsGlobulesBlancs, NfsGlobulesBlancsProps} from './videos/nfs-globules-blancs/NfsGlobulesBlancs';
import {TL as NFS_GLOBULES_BLANCS_TL} from './videos/nfs-globules-blancs/timeline';
import {Hba1cVideo, Hba1cVideoProps} from './videos/hba1c/Hba1cVideo';
import {TL as HBA1C_TL} from './videos/hba1c/timeline';
import {GroupeSanguin, GroupeSanguinProps} from './videos/groupe-sanguin/GroupeSanguin';
import {TL as GROUPE_SANGUIN_TL} from './videos/groupe-sanguin/timeline';
import {ChargeVirale, ChargeViraleProps} from './videos/charge-virale/ChargeVirale';
import {TL as CHARGE_VIRALE_TL} from './videos/charge-virale/timeline';
import {AntiRejet, AntiRejetProps} from './videos/anti-rejet/AntiRejet';
import {TL as ANTI_REJET_TL} from './videos/anti-rejet/timeline';
import {TubeGrisGlycemie, TubeGrisGlycemieProps} from './videos/tube-gris-glycemie/TubeGrisGlycemie';
import {TL as TUBE_GRIS_GLYCEMIE_TL} from './videos/tube-gris-glycemie/timeline';
import {TubeGrisAlcoolemie, TubeGrisAlcoolemieProps} from './videos/tube-gris-alcoolemie/TubeGrisAlcoolemie';
import {TL as TUBE_GRIS_ALCOOLEMIE_TL} from './videos/tube-gris-alcoolemie/timeline';
import {TubeBleuTpInr, TubeBleuTpInrProps} from './videos/tube-bleu-tp-inr/TubeBleuTpInr';
import {TL as TUBE_BLEU_TP_INR_TL} from './videos/tube-bleu-tp-inr/timeline';
import {TubeBleuTca, TubeBleuTcaProps} from './videos/tube-bleu-tca/TubeBleuTca';
import {TL as TUBE_BLEU_TCA_TL} from './videos/tube-bleu-tca/timeline';
import {TubeBleuFacteurs, TubeBleuFacteursProps} from './videos/tube-bleu-facteurs/TubeBleuFacteurs';
import {TL as TUBE_BLEU_FACTEURS_TL} from './videos/tube-bleu-facteurs/timeline';
import {TubeJauneReins, TubeJauneReinsProps} from './videos/tube-jaune-reins/TubeJauneReins';
import {TL as TUBE_JAUNE_REINS_TL} from './videos/tube-jaune-reins/timeline';
import {TubeJauneFer, TubeJauneFerProps} from './videos/tube-jaune-fer/TubeJauneFer';
import {TL as TUBE_JAUNE_FER_TL} from './videos/tube-jaune-fer/timeline';
import {TubeJauneFoie, TubeJauneFoieProps} from './videos/tube-jaune-foie/TubeJauneFoie';
import {TL as TUBE_JAUNE_FOIE_TL} from './videos/tube-jaune-foie/timeline';
import {TubeJauneLipides, TubeJauneLipidesProps} from './videos/tube-jaune-lipides/TubeJauneLipides';
import {TL as TUBE_JAUNE_LIPIDES_TL} from './videos/tube-jaune-lipides/timeline';
import {TubeJauneEnzymes, TubeJauneEnzymesProps} from './videos/tube-jaune-enzymes/TubeJauneEnzymes';
import {TL as TUBE_JAUNE_ENZYMES_TL} from './videos/tube-jaune-enzymes/timeline';
import {TubeJauneIons, TubeJauneIonsProps} from './videos/tube-jaune-ions/TubeJauneIons';
import {TL as TUBE_JAUNE_IONS_TL} from './videos/tube-jaune-ions/timeline';
import {TubeJauneIons2, TubeJauneIons2Props} from './videos/tube-jaune-ions-2/TubeJauneIons2';
import {TL as TUBE_JAUNE_IONS_2_TL} from './videos/tube-jaune-ions-2/timeline';
import {TubeJauneInflammation, TubeJauneInflammationProps} from './videos/tube-jaune-inflammation/TubeJauneInflammation';
import {TL as TUBE_JAUNE_INFLAMMATION_TL} from './videos/tube-jaune-inflammation/timeline';
import {TubeJauneProteines, TubeJauneProteinesProps} from './videos/tube-jaune-proteines/TubeJauneProteines';
import {TL as TUBE_JAUNE_PROTEINES_TL} from './videos/tube-jaune-proteines/timeline';
import {TubeJauneElectrophorese, TubeJauneElectrophoreseProps} from './videos/tube-jaune-electrophorese/TubeJauneElectrophorese';
import {TL as TUBE_JAUNE_ELECTROPHORESE_TL} from './videos/tube-jaune-electrophorese/timeline';
import {TubeJauneCoeur, TubeJauneCoeurProps} from './videos/tube-jaune-coeur/TubeJauneCoeur';
import {TL as TUBE_JAUNE_COEUR_TL} from './videos/tube-jaune-coeur/timeline';
import {TubeJauneMarqueurs, TubeJauneMarqueursProps} from './videos/tube-jaune-marqueurs/TubeJauneMarqueurs';
import {TL as TUBE_JAUNE_MARQUEURS_TL} from './videos/tube-jaune-marqueurs/timeline';
import {TubeJauneHormones, TubeJauneHormonesProps} from './videos/tube-jaune-hormones/TubeJauneHormones';
import {TL as TUBE_JAUNE_HORMONES_TL} from './videos/tube-jaune-hormones/timeline';
import {TubeJauneHormones2, TubeJauneHormones2Props} from './videos/tube-jaune-hormones-2/TubeJauneHormones2';
import {TL as TUBE_JAUNE_HORMONES_2_TL} from './videos/tube-jaune-hormones-2/timeline';

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
		{/* 40 · Brulure */}
		<Composition
			id="Brulure"
			component={Brulure}
			durationInFrames={BRULURE_TL.total}
			fps={BRULURE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies BrulureProps}
		/>
		{/* 41 · Echarde */}
		<Composition
			id="Echarde"
			component={Echarde}
			durationInFrames={ECHARDE_TL.total}
			fps={ECHARDE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies EchardeProps}
		/>
		{/* 42 · Tique */}
		<Composition
			id="Tique"
			component={Tique}
			durationInFrames={TIQUE_TL.total}
			fps={TIQUE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TiqueProps}
		/>
		{/* 43 · Saignement-Nez */}
		<Composition
			id="Saignement-Nez"
			component={SaignementNez}
			durationInFrames={SAIGNEMENT_NEZ_TL.total}
			fps={SAIGNEMENT_NEZ_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies SaignementNezProps}
		/>
		{/* 44 · Piqure-Abeille */}
		<Composition
			id="Piqure-Abeille"
			component={PiqureAbeille}
			durationInFrames={PIQURE_ABEILLE_TL.total}
			fps={PIQURE_ABEILLE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies PiqureAbeilleProps}
		/>
		{/* 45 · Entorse */}
		<Composition
			id="Entorse"
			component={Entorse}
			durationInFrames={ENTORSE_TL.total}
			fps={ENTORSE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies EntorseProps}
		/>
		{/* 46 · Brulure-1 */}
		<Composition
			id="Brulure-1"
			component={Brulure1}
			durationInFrames={BRULURE_1_TL.total}
			fps={BRULURE_1_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Brulure1Props}
		/>
		{/* 47 · Brulure-2 */}
		<Composition
			id="Brulure-2"
			component={Brulure2}
			durationInFrames={BRULURE_2_TL.total}
			fps={BRULURE_2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Brulure2Props}
		/>
		{/* 48 · Brulure-3 */}
		<Composition
			id="Brulure-3"
			component={Brulure3}
			durationInFrames={BRULURE_3_TL.total}
			fps={BRULURE_3_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Brulure3Props}
		/>
		{/* 49 · Cancer-Prostate */}
		<Composition
			id="Cancer-Prostate"
			component={CancerProstate}
			durationInFrames={CANCER_PROSTATE_TL.total}
			fps={CANCER_PROSTATE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerProstateProps}
		/>
		{/* 50 · Cancer-Sein */}
		<Composition
			id="Cancer-Sein"
			component={CancerSein}
			durationInFrames={CANCER_SEIN_TL.total}
			fps={CANCER_SEIN_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerSeinProps}
		/>
		{/* 51 · Cancer-Poumon */}
		<Composition
			id="Cancer-Poumon"
			component={CancerPoumon}
			durationInFrames={CANCER_POUMON_TL.total}
			fps={CANCER_POUMON_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerPoumonProps}
		/>
		{/* 52 · Cancer-Colorectal */}
		<Composition
			id="Cancer-Colorectal"
			component={CancerColorectal}
			durationInFrames={CANCER_COLORECTAL_TL.total}
			fps={CANCER_COLORECTAL_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerColorectalProps}
		/>
		{/* 53 · CancerVessie */}
		<Composition
			id="Cancer-Vessie"
			component={CancerVessie}
			durationInFrames={CANCER_VESSIE_TL.total}
			fps={CANCER_VESSIE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerVessieProps}
		/>
		{/* 54 · Cancer-Pancreas */}
		<Composition
			id="Cancer-Pancreas"
			component={CancerPancreas}
			durationInFrames={CANCER_PANCREAS_TL.total}
			fps={CANCER_PANCREAS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerPancreasProps}
		/>
		{/* 55 · Cancer-Estomac */}
		<Composition
			id="Cancer-Estomac"
			component={CancerEstomac}
			durationInFrames={CANCER_ESTOMAC_TL.total}
			fps={CANCER_ESTOMAC_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerEstomacProps}
		/>
		{/* 56 · Cancer-Rein */}
		<Composition
			id="Cancer-Rein"
			component={CancerRein}
			durationInFrames={CANCER_REIN_TL.total}
			fps={CANCER_REIN_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerReinProps}
		/>
		{/* 57 · Cancer-Foie */}
		<Composition
			id="Cancer-Foie"
			component={CancerFoie}
			durationInFrames={CANCER_FOIE_TL.total}
			fps={CANCER_FOIE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerFoieProps}
		/>
		{/* 58 · Cancer-Oesophage */}
		<Composition
			id="Cancer-Oesophage"
			component={CancerOesophage}
			durationInFrames={CANCER_OESOPHAGE_TL.total}
			fps={CANCER_OESOPHAGE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerOesophageProps}
		/>
		{/* 59 · Cancer-Anus */}
		<Composition
			id="Cancer-Anus"
			component={CancerAnus}
			durationInFrames={CANCER_ANUS_TL.total}
			fps={CANCER_ANUS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerAnusProps}
		/>
		{/* 60 · Cancer-Voies-Biliaires */}
		<Composition
			id="Cancer-Voies-Biliaires"
			component={CancerVoiesBiliaires}
			durationInFrames={CANCER_VOIES_BILIAIRES_TL.total}
			fps={CANCER_VOIES_BILIAIRES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies CancerVoiesBiliairesProps}
		/>
		{/* 61 · Tubes-Prelevement */}
		<Composition
			id="Tubes-Prelevement"
			component={TubesPrelevement}
			durationInFrames={TUBES_PRELEVEMENT_TL.total}
			fps={TUBES_PRELEVEMENT_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubesPrelevementProps}
		/>
		{/* 62 · Tube-Violet */}
		<Composition
			id="Tube-Violet"
			component={TubeViolet}
			durationInFrames={TUBE_VIOLET_TL.total}
			fps={TUBE_VIOLET_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeVioletProps}
		/>
		{/* 63 · Tube-Jaune */}
		<Composition
			id="Tube-Jaune"
			component={TubeJaune}
			durationInFrames={TUBE_JAUNE_TL.total}
			fps={TUBE_JAUNE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneProps}
		/>
		{/* 64 · Tube-Jaune-Renal */}
		<Composition
			id="Tube-Jaune-Renal"
			component={TubeJauneRenal}
			durationInFrames={TUBE_JAUNE_RENAL_TL.total}
			fps={TUBE_JAUNE_RENAL_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneRenalProps}
		/>
		{/* 65 · Tube-Purge */}
		<Composition
			id="Tube-Purge"
			component={TubePurge}
			durationInFrames={TUBE_PURGE_TL.total}
			fps={TUBE_PURGE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubePurgeProps}
		/>
		{/* 66 · Ordre-Tubes */}
		<Composition
			id="Ordre-Tubes"
			component={OrdreTubes}
			durationInFrames={ORDRE_TUBES_TL.total}
			fps={ORDRE_TUBES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies OrdreTubesProps}
		/>
		{/* 67 · NFS-Globules-Rouges */}
		<Composition
			id="NFS-Globules-Rouges"
			component={NfsGlobulesRouges}
			durationInFrames={NFS_GLOBULES_ROUGES_TL.total}
			fps={NFS_GLOBULES_ROUGES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies NfsGlobulesRougesProps}
		/>
		{/* 68 · NFS-Globules-Blancs */}
		<Composition
			id="NFS-Globules-Blancs"
			component={NfsGlobulesBlancs}
			durationInFrames={NFS_GLOBULES_BLANCS_TL.total}
			fps={NFS_GLOBULES_BLANCS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies NfsGlobulesBlancsProps}
		/>
		{/* 69 · HbA1c */}
		<Composition
			id="HbA1c"
			component={Hba1cVideo}
			durationInFrames={HBA1C_TL.total}
			fps={HBA1C_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies Hba1cVideoProps}
		/>
		{/* 70 · Groupe-Sanguin */}
		<Composition
			id="Groupe-Sanguin"
			component={GroupeSanguin}
			durationInFrames={GROUPE_SANGUIN_TL.total}
			fps={GROUPE_SANGUIN_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies GroupeSanguinProps}
		/>
		{/* 71 · Charge-Virale */}
		<Composition
			id="Charge-Virale"
			component={ChargeVirale}
			durationInFrames={CHARGE_VIRALE_TL.total}
			fps={CHARGE_VIRALE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies ChargeViraleProps}
		/>
		{/* 72 · Anti-Rejet */}
		<Composition
			id="Anti-Rejet"
			component={AntiRejet}
			durationInFrames={ANTI_REJET_TL.total}
			fps={ANTI_REJET_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies AntiRejetProps}
		/>
		{/* 73 · Tube-Gris-Glycemie */}
		<Composition
			id="Tube-Gris-Glycemie"
			component={TubeGrisGlycemie}
			durationInFrames={TUBE_GRIS_GLYCEMIE_TL.total}
			fps={TUBE_GRIS_GLYCEMIE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeGrisGlycemieProps}
		/>
		{/* 74 · Tube-Gris-Alcoolemie */}
		<Composition
			id="Tube-Gris-Alcoolemie"
			component={TubeGrisAlcoolemie}
			durationInFrames={TUBE_GRIS_ALCOOLEMIE_TL.total}
			fps={TUBE_GRIS_ALCOOLEMIE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeGrisAlcoolemieProps}
		/>
		{/* 75 · Tube-Bleu-TP-INR */}
		<Composition
			id="Tube-Bleu-TP-INR"
			component={TubeBleuTpInr}
			durationInFrames={TUBE_BLEU_TP_INR_TL.total}
			fps={TUBE_BLEU_TP_INR_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeBleuTpInrProps}
		/>
		{/* 76 · Tube-Bleu-TCA */}
		<Composition
			id="Tube-Bleu-TCA"
			component={TubeBleuTca}
			durationInFrames={TUBE_BLEU_TCA_TL.total}
			fps={TUBE_BLEU_TCA_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeBleuTcaProps}
		/>
		{/* 77 · Tube-Bleu-Facteurs */}
		<Composition
			id="Tube-Bleu-Facteurs"
			component={TubeBleuFacteurs}
			durationInFrames={TUBE_BLEU_FACTEURS_TL.total}
			fps={TUBE_BLEU_FACTEURS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeBleuFacteursProps}
		/>
		{/* 78 · Tube-Jaune-Reins */}
		<Composition
			id="Tube-Jaune-Reins"
			component={TubeJauneReins}
			durationInFrames={TUBE_JAUNE_REINS_TL.total}
			fps={TUBE_JAUNE_REINS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneReinsProps}
		/>
		{/* 79 · Tube-Jaune-Fer */}
		<Composition
			id="Tube-Jaune-Fer"
			component={TubeJauneFer}
			durationInFrames={TUBE_JAUNE_FER_TL.total}
			fps={TUBE_JAUNE_FER_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneFerProps}
		/>
		{/* 80 · Tube-Jaune-Foie */}
		<Composition
			id="Tube-Jaune-Foie"
			component={TubeJauneFoie}
			durationInFrames={TUBE_JAUNE_FOIE_TL.total}
			fps={TUBE_JAUNE_FOIE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneFoieProps}
		/>
		{/* 81 · Tube-Jaune-Lipides */}
		<Composition
			id="Tube-Jaune-Lipides"
			component={TubeJauneLipides}
			durationInFrames={TUBE_JAUNE_LIPIDES_TL.total}
			fps={TUBE_JAUNE_LIPIDES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneLipidesProps}
		/>
		{/* 82 · Tube-Jaune-Enzymes */}
		<Composition
			id="Tube-Jaune-Enzymes"
			component={TubeJauneEnzymes}
			durationInFrames={TUBE_JAUNE_ENZYMES_TL.total}
			fps={TUBE_JAUNE_ENZYMES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneEnzymesProps}
		/>
		{/* 83 · Tube-Jaune-Ions */}
		<Composition
			id="Tube-Jaune-Ions"
			component={TubeJauneIons}
			durationInFrames={TUBE_JAUNE_IONS_TL.total}
			fps={TUBE_JAUNE_IONS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneIonsProps}
		/>
		{/* 84 · Tube-Jaune-Ions-2 */}
		<Composition
			id="Tube-Jaune-Ions-2"
			component={TubeJauneIons2}
			durationInFrames={TUBE_JAUNE_IONS_2_TL.total}
			fps={TUBE_JAUNE_IONS_2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneIons2Props}
		/>
		{/* 85 · Tube-Jaune-Inflammation */}
		<Composition
			id="Tube-Jaune-Inflammation"
			component={TubeJauneInflammation}
			durationInFrames={TUBE_JAUNE_INFLAMMATION_TL.total}
			fps={TUBE_JAUNE_INFLAMMATION_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneInflammationProps}
		/>
		{/* 86 · Tube-Jaune-Proteines */}
		<Composition
			id="Tube-Jaune-Proteines"
			component={TubeJauneProteines}
			durationInFrames={TUBE_JAUNE_PROTEINES_TL.total}
			fps={TUBE_JAUNE_PROTEINES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneProteinesProps}
		/>
		{/* 87 · Tube-Jaune-Electrophorese */}
		<Composition
			id="Tube-Jaune-Electrophorese"
			component={TubeJauneElectrophorese}
			durationInFrames={TUBE_JAUNE_ELECTROPHORESE_TL.total}
			fps={TUBE_JAUNE_ELECTROPHORESE_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneElectrophoreseProps}
		/>
		{/* 88 · Tube-Jaune-Coeur */}
		<Composition
			id="Tube-Jaune-Coeur"
			component={TubeJauneCoeur}
			durationInFrames={TUBE_JAUNE_COEUR_TL.total}
			fps={TUBE_JAUNE_COEUR_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneCoeurProps}
		/>
		{/* 89 · Tube-Jaune-Marqueurs */}
		<Composition
			id="Tube-Jaune-Marqueurs"
			component={TubeJauneMarqueurs}
			durationInFrames={TUBE_JAUNE_MARQUEURS_TL.total}
			fps={TUBE_JAUNE_MARQUEURS_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneMarqueursProps}
		/>
		{/* 90 · Tube-Jaune-Hormones */}
		<Composition
			id="Tube-Jaune-Hormones"
			component={TubeJauneHormones}
			durationInFrames={TUBE_JAUNE_HORMONES_TL.total}
			fps={TUBE_JAUNE_HORMONES_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneHormonesProps}
		/>
		{/* 91 · Tube-Jaune-Hormones-2 */}
		<Composition
			id="Tube-Jaune-Hormones-2"
			component={TubeJauneHormones2}
			durationInFrames={TUBE_JAUNE_HORMONES_2_TL.total}
			fps={TUBE_JAUNE_HORMONES_2_TL.fps}
			width={W}
			height={H}
			defaultProps={{voice: true, sfx: true} satisfies TubeJauneHormones2Props}
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
