// Vérifie le jeu de la mascotte d'une vidéo : départs / atterrissages, temps de pose, chevauchements.
// Usage : npm run check:mascot -- <dossier de la vidéo>   ex. npm run check:mascot -- besoins-fondamentaux
// (une ligne par étape ; « CHEVAUCHE » = à corriger)
import {planBeats} from '../../src/brand/MascotActor';
import * as constantes from '../../src/videos/constantes/mascot';
import * as constantesTL from '../../src/videos/constantes/timeline';
import * as besoins from '../../src/videos/besoins-fondamentaux/mascot';
import * as besoinsTL from '../../src/videos/besoins-fondamentaux/timeline';
import * as fc from '../../src/videos/frequence-cardiaque/mascot';
import * as fcTL from '../../src/videos/frequence-cardiaque/timeline';
import * as fr from '../../src/videos/frequence-respiratoire/mascot';
import * as frTL from '../../src/videos/frequence-respiratoire/timeline';
import * as temp from '../../src/videos/temperature/mascot';
import * as tempTL from '../../src/videos/temperature/timeline';
import * as ta from '../../src/videos/tension-arterielle/mascot';
import * as taTL from '../../src/videos/tension-arterielle/timeline';
import * as gly from '../../src/videos/glycemie/mascot';
import * as glyTL from '../../src/videos/glycemie/timeline';
import * as diu from '../../src/videos/diurese/mascot';
import * as diuTL from '../../src/videos/diurese/timeline';
import * as avc from '../../src/videos/avc/mascot';
import * as avcTL from '../../src/videos/avc/timeline';
import * as acr from '../../src/videos/arret-cardiaque/mascot';
import * as acrTL from '../../src/videos/arret-cardiaque/timeline';
import * as spo from '../../src/videos/spo2/mascot';
import * as spoTL from '../../src/videos/spo2/timeline';
import * as ep from '../../src/videos/embolie-pulmonaire/mascot';
import * as epTL from '../../src/videos/embolie-pulmonaire/timeline';
import * as avch from '../../src/videos/avc-histoire/mascot';
import * as avchTL from '../../src/videos/avc-histoire/timeline';
import * as pl1 from '../../src/videos/plaies-1/mascot';
import * as pl1TL from '../../src/videos/plaies-1/timeline';
import * as pl2 from '../../src/videos/plaies-2/mascot';
import * as pl2TL from '../../src/videos/plaies-2/timeline';
import * as pl3 from '../../src/videos/plaies-3/mascot';
import * as pl3TL from '../../src/videos/plaies-3/timeline';
import * as bpco from '../../src/videos/bpco/mascot';
import * as bpcoTL from '../../src/videos/bpco/timeline';
import * as prisedesang from '../../src/videos/prise-de-sang/mascot';
import * as prisedesangTL from '../../src/videos/prise-de-sang/timeline';
import * as hygienemains from '../../src/videos/hygiene-mains/mascot';
import * as hygienemainsTL from '../../src/videos/hygiene-mains/timeline';
import * as precautionsstandard from '../../src/videos/precautions-standard/mascot';
import * as precautionsstandardTL from '../../src/videos/precautions-standard/timeline';
import * as insuffisancecardiaque from '../../src/videos/insuffisance-cardiaque/mascot';
import * as insuffisancecardiaqueTL from '../../src/videos/insuffisance-cardiaque/timeline';
import * as douleur1 from '../../src/videos/douleur-1/mascot';
import * as douleur1TL from '../../src/videos/douleur-1/timeline';
import * as douleur2 from '../../src/videos/douleur-2/mascot';
import * as douleur2TL from '../../src/videos/douleur-2/timeline';
import * as quizconstantes from '../../src/videos/quiz-constantes/mascot';
import * as quizconstantesTL from '../../src/videos/quiz-constantes/timeline';
import * as diabete1 from '../../src/videos/diabete-1/mascot';
import * as diabete1TL from '../../src/videos/diabete-1/timeline';
import * as diabete2 from '../../src/videos/diabete-2/mascot';
import * as diabete2TL from '../../src/videos/diabete-2/timeline';
import * as constantesenfant from '../../src/videos/constantes-enfant/mascot';
import * as constantesenfantTL from '../../src/videos/constantes-enfant/timeline';
import * as suppositoire from '../../src/videos/suppositoire/mascot';
import * as suppositoireTL from '../../src/videos/suppositoire/timeline';
import * as objetplante from '../../src/videos/objet-plante/mascot';
import * as objetplanteTL from '../../src/videos/objet-plante/timeline';
import * as plaieprofondeur from '../../src/videos/plaie-profondeur/mascot';
import * as plaieprofondeurTL from '../../src/videos/plaie-profondeur/timeline';
import * as plaiecontuse from '../../src/videos/plaie-contuse/mascot';
import * as plaiecontuseTL from '../../src/videos/plaie-contuse/timeline';
import * as plaiepiqure from '../../src/videos/plaie-piqure/mascot';
import * as plaiepiqureTL from '../../src/videos/plaie-piqure/timeline';
import * as plaiemorsure from '../../src/videos/plaie-morsure/mascot';
import * as plaiemorsureTL from '../../src/videos/plaie-morsure/timeline';
import * as plaiechronique from '../../src/videos/plaie-chronique/mascot';
import * as plaiechroniqueTL from '../../src/videos/plaie-chronique/timeline';
import * as escarre from '../../src/videos/escarre/mascot';
import * as escarreTL from '../../src/videos/escarre/timeline';
import * as pieddiabetique from '../../src/videos/pied-diabetique/mascot';
import * as pieddiabetiqueTL from '../../src/videos/pied-diabetique/timeline';
import * as troussesecours from '../../src/videos/trousse-secours/mascot';
import * as troussesecoursTL from '../../src/videos/trousse-secours/timeline';
import * as pansement from '../../src/videos/pansement/mascot';
import * as pansementTL from '../../src/videos/pansement/timeline';
import * as brulure from '../../src/videos/brulure/mascot';
import * as brulureTL from '../../src/videos/brulure/timeline';
import * as echarde from '../../src/videos/echarde/mascot';
import * as echardeTL from '../../src/videos/echarde/timeline';
import * as tique from '../../src/videos/tique/mascot';
import * as tiqueTL from '../../src/videos/tique/timeline';
import * as saignementnez from '../../src/videos/saignement-nez/mascot';
import * as saignementnezTL from '../../src/videos/saignement-nez/timeline';
import * as piqureabeille from '../../src/videos/piqure-abeille/mascot';
import * as piqureabeilleTL from '../../src/videos/piqure-abeille/timeline';
import * as entorse from '../../src/videos/entorse/mascot';
import * as entorseTL from '../../src/videos/entorse/timeline';
import * as brulure1 from '../../src/videos/brulure-1/mascot';
import * as brulure1TL from '../../src/videos/brulure-1/timeline';
import * as brulure2 from '../../src/videos/brulure-2/mascot';
import * as brulure2TL from '../../src/videos/brulure-2/timeline';
import * as brulure3 from '../../src/videos/brulure-3/mascot';
import * as brulure3TL from '../../src/videos/brulure-3/timeline';
import * as cancerprostate from '../../src/videos/cancer-prostate/mascot';
import * as cancerprostateTL from '../../src/videos/cancer-prostate/timeline';
import * as cancersein from '../../src/videos/cancer-sein/mascot';
import * as cancerseinTL from '../../src/videos/cancer-sein/timeline';
import * as cancerpoumon from '../../src/videos/cancer-poumon/mascot';
import * as cancerpoumonTL from '../../src/videos/cancer-poumon/timeline';
import * as cancercolorectal from '../../src/videos/cancer-colorectal/mascot';
import * as cancercolorectalTL from '../../src/videos/cancer-colorectal/timeline';
import * as cancervessie from '../../src/videos/cancer-vessie/mascot';
import * as cancervessieTL from '../../src/videos/cancer-vessie/timeline';
import * as cancerpancreas from '../../src/videos/cancer-pancreas/mascot';
import * as cancerpancreasTL from '../../src/videos/cancer-pancreas/timeline';
import * as cancerestomac from '../../src/videos/cancer-estomac/mascot';
import * as cancerestomacTL from '../../src/videos/cancer-estomac/timeline';
import * as cancerrein from '../../src/videos/cancer-rein/mascot';
import * as cancerreinTL from '../../src/videos/cancer-rein/timeline';
import * as cancerfoie from '../../src/videos/cancer-foie/mascot';
import * as cancerfoieTL from '../../src/videos/cancer-foie/timeline';
import * as canceroesophage from '../../src/videos/cancer-oesophage/mascot';
import * as canceroesophageTL from '../../src/videos/cancer-oesophage/timeline';
import * as canceranus from '../../src/videos/cancer-anus/mascot';
import * as canceranusTL from '../../src/videos/cancer-anus/timeline';
import * as cancervoiesbiliaires from '../../src/videos/cancer-voies-biliaires/mascot';
import * as cancervoiesbiliairesTL from '../../src/videos/cancer-voies-biliaires/timeline';
import * as tubesprelevement from '../../src/videos/tubes-prelevement/mascot';
import * as tubesprelevementTL from '../../src/videos/tubes-prelevement/timeline';
import * as tubeviolet from '../../src/videos/tube-violet/mascot';
import * as tubevioletTL from '../../src/videos/tube-violet/timeline';
import * as tubejaune from '../../src/videos/tube-jaune/mascot';
import * as tubejauneTL from '../../src/videos/tube-jaune/timeline';
import * as tubejaunerenal from '../../src/videos/tube-jaune-renal/mascot';
import * as tubejaunerenalTL from '../../src/videos/tube-jaune-renal/timeline';
import * as tubepurge from '../../src/videos/tube-purge/mascot';
import * as tubepurgeTL from '../../src/videos/tube-purge/timeline';
import * as ordretubes from '../../src/videos/ordre-tubes/mascot';
import * as ordretubesTL from '../../src/videos/ordre-tubes/timeline';
import * as nfsglobulesrouges from '../../src/videos/nfs-globules-rouges/mascot';
import * as nfsglobulesrougesTL from '../../src/videos/nfs-globules-rouges/timeline';
import * as nfsglobulesblancs from '../../src/videos/nfs-globules-blancs/mascot';
import * as nfsglobulesblancsTL from '../../src/videos/nfs-globules-blancs/timeline';
import * as hba1c from '../../src/videos/hba1c/mascot';
import * as hba1cTL from '../../src/videos/hba1c/timeline';
import * as groupesanguin from '../../src/videos/groupe-sanguin/mascot';
import * as groupesanguinTL from '../../src/videos/groupe-sanguin/timeline';
import * as chargevirale from '../../src/videos/charge-virale/mascot';
import * as chargeviraleTL from '../../src/videos/charge-virale/timeline';
import * as antirejet from '../../src/videos/anti-rejet/mascot';
import * as antirejetTL from '../../src/videos/anti-rejet/timeline';
import * as tubegrisglycemie from '../../src/videos/tube-gris-glycemie/mascot';
import * as tubegrisglycemieTL from '../../src/videos/tube-gris-glycemie/timeline';
import * as tubegrisalcoolemie from '../../src/videos/tube-gris-alcoolemie/mascot';
import * as tubegrisalcoolemieTL from '../../src/videos/tube-gris-alcoolemie/timeline';
import * as tubebleutpinr from '../../src/videos/tube-bleu-tp-inr/mascot';
import * as tubebleutpinrTL from '../../src/videos/tube-bleu-tp-inr/timeline';
import * as tubebleutca from '../../src/videos/tube-bleu-tca/mascot';
import * as tubebleutcaTL from '../../src/videos/tube-bleu-tca/timeline';
import * as tubebleufacteurs from '../../src/videos/tube-bleu-facteurs/mascot';
import * as tubebleufacteursTL from '../../src/videos/tube-bleu-facteurs/timeline';
import * as tubejaunereins from '../../src/videos/tube-jaune-reins/mascot';
import * as tubejaunereinsTL from '../../src/videos/tube-jaune-reins/timeline';
import * as tubejaunefer from '../../src/videos/tube-jaune-fer/mascot';
import * as tubejauneferTL from '../../src/videos/tube-jaune-fer/timeline';
import * as tubejaunefoie from '../../src/videos/tube-jaune-foie/mascot';
import * as tubejaunefoieTL from '../../src/videos/tube-jaune-foie/timeline';
import * as tubejaunelipides from '../../src/videos/tube-jaune-lipides/mascot';
import * as tubejaunelipidesTL from '../../src/videos/tube-jaune-lipides/timeline';
import * as tubejauneenzymes from '../../src/videos/tube-jaune-enzymes/mascot';
import * as tubejauneenzymesTL from '../../src/videos/tube-jaune-enzymes/timeline';
import * as tubejauneions from '../../src/videos/tube-jaune-ions/mascot';
import * as tubejauneionsTL from '../../src/videos/tube-jaune-ions/timeline';
import * as tubejauneions2 from '../../src/videos/tube-jaune-ions-2/mascot';
import * as tubejauneions2TL from '../../src/videos/tube-jaune-ions-2/timeline';
import * as tubejauneinflammation from '../../src/videos/tube-jaune-inflammation/mascot';
import * as tubejauneinflammationTL from '../../src/videos/tube-jaune-inflammation/timeline';
import * as tubejauneproteines from '../../src/videos/tube-jaune-proteines/mascot';
import * as tubejauneproteinesTL from '../../src/videos/tube-jaune-proteines/timeline';
import * as tubejauneelectrophorese from '../../src/videos/tube-jaune-electrophorese/mascot';
import * as tubejauneelectrophoreseTL from '../../src/videos/tube-jaune-electrophorese/timeline';
import * as tubejaunecoeur from '../../src/videos/tube-jaune-coeur/mascot';
import * as tubejaunecoeurTL from '../../src/videos/tube-jaune-coeur/timeline';
import * as tubejaunemarqueurs from '../../src/videos/tube-jaune-marqueurs/mascot';
import * as tubejaunemarqueursTL from '../../src/videos/tube-jaune-marqueurs/timeline';
import * as tubejaunehormones from '../../src/videos/tube-jaune-hormones/mascot';
import * as tubejaunehormonesTL from '../../src/videos/tube-jaune-hormones/timeline';
import * as tubejaunehormones2 from '../../src/videos/tube-jaune-hormones-2/mascot';
import * as tubejaunehormones2TL from '../../src/videos/tube-jaune-hormones-2/timeline';
import * as tubejauneserologies from '../../src/videos/tube-jaune-serologies/mascot';
import * as tubejauneserologiesTL from '../../src/videos/tube-jaune-serologies/timeline';
import * as tubejauneserologies2 from '../../src/videos/tube-jaune-serologies-2/mascot';
import * as tubejauneserologies2TL from '../../src/videos/tube-jaune-serologies-2/timeline';
import * as tubejauneserologies3 from '../../src/videos/tube-jaune-serologies-3/mascot';
import * as tubejauneserologies3TL from '../../src/videos/tube-jaune-serologies-3/timeline';
import * as tubejauneallergologie from '../../src/videos/tube-jaune-allergologie/mascot';
import * as tubejauneallergologieTL from '../../src/videos/tube-jaune-allergologie/timeline';
import * as tubejaunemedicaments from '../../src/videos/tube-jaune-medicaments/mascot';
import * as tubejaunemedicamentsTL from '../../src/videos/tube-jaune-medicaments/timeline';
import * as tubejauneautoimmunite from '../../src/videos/tube-jaune-auto-immunite/mascot';
import * as tubejauneautoimmuniteTL from '../../src/videos/tube-jaune-auto-immunite/timeline';
import * as tubejauneautoimmunite2 from '../../src/videos/tube-jaune-auto-immunite-2/mascot';
import * as tubejauneautoimmunite2TL from '../../src/videos/tube-jaune-auto-immunite-2/timeline';
import * as tubejaunevitamines from '../../src/videos/tube-jaune-vitamines/mascot';
import * as tubejaunevitaminesTL from '../../src/videos/tube-jaune-vitamines/timeline';

const VIDEOS: Record<string, [typeof constantes.MASCOT, typeof constantesTL.TL]> = {
	constantes: [constantes.MASCOT, constantesTL.TL],
	'besoins-fondamentaux': [besoins.MASCOT, besoinsTL.TL],
	'frequence-cardiaque': [fc.MASCOT, fcTL.TL],
	'frequence-respiratoire': [fr.MASCOT, frTL.TL],
	temperature: [temp.MASCOT, tempTL.TL],
	'tension-arterielle': [ta.MASCOT, taTL.TL],
	glycemie: [gly.MASCOT, glyTL.TL],
	diurese: [diu.MASCOT, diuTL.TL],
	avc: [avc.MASCOT, avcTL.TL],
	'arret-cardiaque': [acr.MASCOT, acrTL.TL],
	spo2: [spo.MASCOT, spoTL.TL],
	'embolie-pulmonaire': [ep.MASCOT, epTL.TL],
	'avc-histoire': [avch.MASCOT, avchTL.TL],
	'plaies-1': [pl1.MASCOT, pl1TL.TL],
	'plaies-2': [pl2.MASCOT, pl2TL.TL],
	'plaies-3': [pl3.MASCOT, pl3TL.TL],
	bpco: [bpco.MASCOT, bpcoTL.TL],
	'prise-de-sang': [prisedesang.MASCOT, prisedesangTL.TL],
	'hygiene-mains': [hygienemains.MASCOT, hygienemainsTL.TL],
	'precautions-standard': [precautionsstandard.MASCOT, precautionsstandardTL.TL],
	'insuffisance-cardiaque': [insuffisancecardiaque.MASCOT, insuffisancecardiaqueTL.TL],
	'douleur-1': [douleur1.MASCOT, douleur1TL.TL],
	'douleur-2': [douleur2.MASCOT, douleur2TL.TL],
	'quiz-constantes': [quizconstantes.MASCOT, quizconstantesTL.TL],
	'diabete-1': [diabete1.MASCOT, diabete1TL.TL],
	'diabete-2': [diabete2.MASCOT, diabete2TL.TL],
	'constantes-enfant': [constantesenfant.MASCOT, constantesenfantTL.TL],
	'suppositoire': [suppositoire.MASCOT, suppositoireTL.TL],
	'objet-plante': [objetplante.MASCOT, objetplanteTL.TL],
	'plaie-profondeur': [plaieprofondeur.MASCOT, plaieprofondeurTL.TL],
	'plaie-contuse': [plaiecontuse.MASCOT, plaiecontuseTL.TL],
	'plaie-piqure': [plaiepiqure.MASCOT, plaiepiqureTL.TL],
	'plaie-morsure': [plaiemorsure.MASCOT, plaiemorsureTL.TL],
	'plaie-chronique': [plaiechronique.MASCOT, plaiechroniqueTL.TL],
	'escarre': [escarre.MASCOT, escarreTL.TL],
	'pied-diabetique': [pieddiabetique.MASCOT, pieddiabetiqueTL.TL],
	'trousse-secours': [troussesecours.MASCOT, troussesecoursTL.TL],
	'pansement': [pansement.MASCOT, pansementTL.TL],
	'brulure': [brulure.MASCOT, brulureTL.TL],
	'echarde': [echarde.MASCOT, echardeTL.TL],
	'tique': [tique.MASCOT, tiqueTL.TL],
	'saignement-nez': [saignementnez.MASCOT, saignementnezTL.TL],
	'piqure-abeille': [piqureabeille.MASCOT, piqureabeilleTL.TL],
	'entorse': [entorse.MASCOT, entorseTL.TL],
	'brulure-1': [brulure1.MASCOT, brulure1TL.TL],
	'brulure-2': [brulure2.MASCOT, brulure2TL.TL],
	'brulure-3': [brulure3.MASCOT, brulure3TL.TL],
	'cancer-prostate': [cancerprostate.MASCOT, cancerprostateTL.TL],
	'cancer-sein': [cancersein.MASCOT, cancerseinTL.TL],
	'cancer-poumon': [cancerpoumon.MASCOT, cancerpoumonTL.TL],
	'cancer-colorectal': [cancercolorectal.MASCOT, cancercolorectalTL.TL],
	'cancer-vessie': [cancervessie.MASCOT, cancervessieTL.TL],
	'cancer-pancreas': [cancerpancreas.MASCOT, cancerpancreasTL.TL],
	'cancer-estomac': [cancerestomac.MASCOT, cancerestomacTL.TL],
	'cancer-rein': [cancerrein.MASCOT, cancerreinTL.TL],
	'cancer-foie': [cancerfoie.MASCOT, cancerfoieTL.TL],
	'cancer-oesophage': [canceroesophage.MASCOT, canceroesophageTL.TL],
	'cancer-anus': [canceranus.MASCOT, canceranusTL.TL],
	'cancer-voies-biliaires': [cancervoiesbiliaires.MASCOT, cancervoiesbiliairesTL.TL],
	'tubes-prelevement': [tubesprelevement.MASCOT, tubesprelevementTL.TL],
	'tube-violet': [tubeviolet.MASCOT, tubevioletTL.TL],
	'tube-jaune': [tubejaune.MASCOT, tubejauneTL.TL],
	'tube-jaune-renal': [tubejaunerenal.MASCOT, tubejaunerenalTL.TL],
	'tube-purge': [tubepurge.MASCOT, tubepurgeTL.TL],
	'ordre-tubes': [ordretubes.MASCOT, ordretubesTL.TL],
	'nfs-globules-rouges': [nfsglobulesrouges.MASCOT, nfsglobulesrougesTL.TL],
	'nfs-globules-blancs': [nfsglobulesblancs.MASCOT, nfsglobulesblancsTL.TL],
	'hba1c': [hba1c.MASCOT, hba1cTL.TL],
	'groupe-sanguin': [groupesanguin.MASCOT, groupesanguinTL.TL],
	'charge-virale': [chargevirale.MASCOT, chargeviraleTL.TL],
	'anti-rejet': [antirejet.MASCOT, antirejetTL.TL],
	'tube-gris-glycemie': [tubegrisglycemie.MASCOT, tubegrisglycemieTL.TL],
	'tube-gris-alcoolemie': [tubegrisalcoolemie.MASCOT, tubegrisalcoolemieTL.TL],
	'tube-bleu-tp-inr': [tubebleutpinr.MASCOT, tubebleutpinrTL.TL],
	'tube-bleu-tca': [tubebleutca.MASCOT, tubebleutcaTL.TL],
	'tube-bleu-facteurs': [tubebleufacteurs.MASCOT, tubebleufacteursTL.TL],
	'tube-jaune-reins': [tubejaunereins.MASCOT, tubejaunereinsTL.TL],
	'tube-jaune-fer': [tubejaunefer.MASCOT, tubejauneferTL.TL],
	'tube-jaune-foie': [tubejaunefoie.MASCOT, tubejaunefoieTL.TL],
	'tube-jaune-lipides': [tubejaunelipides.MASCOT, tubejaunelipidesTL.TL],
	'tube-jaune-enzymes': [tubejauneenzymes.MASCOT, tubejauneenzymesTL.TL],
	'tube-jaune-ions': [tubejauneions.MASCOT, tubejauneionsTL.TL],
	'tube-jaune-ions-2': [tubejauneions2.MASCOT, tubejauneions2TL.TL],
	'tube-jaune-inflammation': [tubejauneinflammation.MASCOT, tubejauneinflammationTL.TL],
	'tube-jaune-proteines': [tubejauneproteines.MASCOT, tubejauneproteinesTL.TL],
	'tube-jaune-electrophorese': [tubejauneelectrophorese.MASCOT, tubejauneelectrophoreseTL.TL],
	'tube-jaune-coeur': [tubejaunecoeur.MASCOT, tubejaunecoeurTL.TL],
	'tube-jaune-marqueurs': [tubejaunemarqueurs.MASCOT, tubejaunemarqueursTL.TL],
	'tube-jaune-hormones': [tubejaunehormones.MASCOT, tubejaunehormonesTL.TL],
	'tube-jaune-hormones-2': [tubejaunehormones2.MASCOT, tubejaunehormones2TL.TL],
	'tube-jaune-serologies': [tubejauneserologies.MASCOT, tubejauneserologiesTL.TL],
	'tube-jaune-serologies-2': [tubejauneserologies2.MASCOT, tubejauneserologies2TL.TL],
	'tube-jaune-serologies-3': [tubejauneserologies3.MASCOT, tubejauneserologies3TL.TL],
	'tube-jaune-allergologie': [tubejauneallergologie.MASCOT, tubejauneallergologieTL.TL],
	'tube-jaune-medicaments': [tubejaunemedicaments.MASCOT, tubejaunemedicamentsTL.TL],
	'tube-jaune-auto-immunite': [tubejauneautoimmunite.MASCOT, tubejauneautoimmuniteTL.TL],
	'tube-jaune-auto-immunite-2': [tubejauneautoimmunite2.MASCOT, tubejauneautoimmunite2TL.TL],
	'tube-jaune-vitamines': [tubejaunevitamines.MASCOT, tubejaunevitaminesTL.TL],
};
const name = process.argv[2] ?? 'constantes';
const [MASCOT, TL] = VIDEOS[name];

// le chargement des polices (navigateur) échoue sous Node : sans importance ici
process.on('unhandledRejection', () => undefined);

const plan = planBeats(MASCOT);
let bad = 0;
plan.forEach((b, i) => {
	const hold = i > 0 ? b.start - plan[i - 1].land : 0;
	const overlap = i > 0 && hold < 0;
	if (overlap) bad++;
	console.log(
		`${String(i).padStart(2)} ${b.via.padEnd(4)} départ ${b.start} mot ${b.at} posée ${b.land} · pose précédente ${hold} fr · ${b.key}${overlap ? '  <<< CHEVAUCHE' : ''}`,
	);
});
console.log(`scènes : ${TL.starts.join(' ')} · ${plan.length} étapes · ${bad} chevauchement(s)`);
process.exitCode = bad ? 1 : 0;
