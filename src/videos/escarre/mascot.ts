// Jeu de la mascotte : fatiguée sur « allongé », endormie pendant les heures, alerte sur « mourir » ; loupe sous la
// peau, stressée quand les cellules meurent ; elle montre les points d'appui ; le bon geste : présente, astuce sur le
// matelas, regardez sur « surveille la peau » ; chute : attention. En bas à droite (contenu jusqu'à y 1440).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'allongé'), via: 'pop', key: 'symptomes/dort', ...R},
	{at: abs('intro', 'pourtant,'), key: 'expressions/surprise', ...R},
	{at: abs('intro', 'mourir.'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: start('pression') - 4, dur: 16, key: 'expressions/alerte', x: 540, y: 1000, size: 0},

	/* ── sous la peau ── */
	{at: abs('pression', 'tissus'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('pression', 'meurent.'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: start('ou') - 1, dur: 12, key: 'expressions/stressee', x: -420, y: 1500, size: 230},

	/* ── où ── */
	{at: abs('ou', 'talons,'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: start('geste') + 8, dur: 18, key: 'gestes/regardez', ...L},

	/* ── l'éviter ── */
	{at: abs('geste', 'change'), key: 'gestes/presente', ...L},
	{at: abs('geste', 'matelas'), key: 'gestes/astuce', fx: 'bounce', ...L},
	{at: abs('geste', 'surveille'), key: 'expressions/loupe', ...L},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'appuie'), via: 'pop', key: 'expressions/questionnement', ...R},
	{at: abs('fin', 'alerte'), key: 'gestes/attention', fx: 'shake', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
