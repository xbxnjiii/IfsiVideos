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
