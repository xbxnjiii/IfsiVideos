// Jeu de la mascotte : douleur quand le pied se plante, question sur « rien de grave ? » ; loupe sous la peau, alerte
// sur « très loin », inquiète pour les microbes ; elle présente les causes, astuce sur « iatrogène » ; le bon réflexe :
// présente, téléphone pour consulter. En bas à droite, elle porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'clou.') + 2, via: 'pop', key: 'symptomes/douleur', fx: 'shake', ...R},
	{at: abs('intro', 'rien'), key: 'gestes/question', ...R},
	{at: start('dessous') - 4, dur: 16, key: 'gestes/question', x: 830, y: 640, size: 0},

	/* ── sous la peau ── */
	{at: abs('dessous', 'minuscule,'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('dessous', 'loin.'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('dessous', 'microbes'), key: 'expressions/inquiete', ...R},
	{at: start('piqure') - 1, dur: 12, key: 'expressions/inquiete', x: -420, y: 1500, size: 230},

	/* ── les piqûres ── */
	{at: abs('piqure', 'objet'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('piqure', 'iatrogène'), key: 'gestes/astuce', fx: 'bounce', ...R},
	...runAcross('fin'),

	/* ── le bon réflexe ── */
	{at: abs('fin', 'lave,'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('fin', 'vaccin'), key: 'accessoires/seringue', ...R},
	{at: abs('fin', 'consulte.'), key: 'accessoires/stethoscope', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
