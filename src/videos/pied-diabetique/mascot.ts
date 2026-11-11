// Jeu de la mascotte : inquiète devant le trou, surprise sur « il ne sent rien », alerte quand il marche dessus ;
// explique les nerfs, triste sur « en silence », loupe sur le mal perforant ; regarde l'ulcère, astuce sur « mixte » ;
// chute : loupe sur les pieds, OK sur les orteils. En bas à droite (le contenu s'arrête vers y 1420).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'trou'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'rien.'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'continue'), key: 'expressions/alerte', ...R},
	{at: start('pied') - 4, dur: 16, key: 'expressions/alerte', x: 420, y: 1150, size: 0},

	/* ── les nerfs ── */
	{at: abs('pied', 'nerfs'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('pied', 'silence.'), key: 'expressions/triste', ...R},
	{at: abs('pied', 'mal'), key: 'expressions/loupe', ...R},
	{at: start('ulcere') - 1, dur: 12, key: 'expressions/loupe', x: -420, y: 1500, size: 230},

	/* ── ulcère ── */
	{at: abs('ulcere', 'ulcère'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('ulcere', 'mixte.'), key: 'gestes/astuce', fx: 'bounce', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'regardes'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('fin', 'orteils'), key: 'gestes/ok', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
