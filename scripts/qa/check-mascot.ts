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

const VIDEOS: Record<string, [typeof constantes.MASCOT, typeof constantesTL.TL]> = {
	constantes: [constantes.MASCOT, constantesTL.TL],
	'besoins-fondamentaux': [besoins.MASCOT, besoinsTL.TL],
	'frequence-cardiaque': [fc.MASCOT, fcTL.TL],
	'frequence-respiratoire': [fr.MASCOT, frTL.TL],
	temperature: [temp.MASCOT, tempTL.TL],
	'tension-arterielle': [ta.MASCOT, taTL.TL],
	glycemie: [gly.MASCOT, glyTL.TL],
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
