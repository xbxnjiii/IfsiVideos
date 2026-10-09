// Vérifie le jeu de la mascotte d'une vidéo : départs / atterrissages, temps de pose, chevauchements.
// Usage : npm run check:mascot -- <dossier de la vidéo>   ex. npm run check:mascot -- besoins-fondamentaux
// (une ligne par étape ; « CHEVAUCHE » = à corriger)
import {planBeats} from '../../src/brand/MascotActor';
import * as constantes from '../../src/videos/constantes/mascot';
import * as constantesTL from '../../src/videos/constantes/timeline';
import * as besoins from '../../src/videos/besoins-fondamentaux/mascot';
import * as besoinsTL from '../../src/videos/besoins-fondamentaux/timeline';

const VIDEOS: Record<string, [typeof constantes.MASCOT, typeof constantesTL.TL]> = {
	constantes: [constantes.MASCOT, constantesTL.TL],
	'besoins-fondamentaux': [besoins.MASCOT, besoinsTL.TL],
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
