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
