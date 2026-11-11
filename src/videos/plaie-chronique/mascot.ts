// Jeu de la mascotte (à gauche dans l'accroche, le petit est à droite) : douleur quand ils s'écorchent, réfléchit
// pendant les semaines, bravo sur « guéri », surprise sur « toujours là » ; OK pour
// la plaie aiguë ; inquiète sur la plaie chronique, triste sur « bloquée » ; elle présente les 3 exemples ; chute :
// loupe sur « on cherche pourquoi ». En bas à droite (le contenu s'arrête vers y 1460).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'blessent'), via: 'pop', key: 'symptomes/douleur', fx: 'shake', ...L},
	{at: abs('intro', 'six'), key: 'situations/reflexion', ...L},
	{at: abs('intro', 'guéri'), key: 'gestes/bravo', fx: 'bounce', ...L},
	{at: abs('intro', 'toujours'), key: 'expressions/surprise', fx: 'shake', ...L},
	{at: start('aigue') - 4, dur: 16, key: 'expressions/surprise', x: 904, y: 1288, size: 0},
	{at: start('aigue') + 14, via: 'pop', key: 'gestes/ok', ...R},

	/* ── aiguë ── */
	{at: abs('aigue', 'guérit'), via: 'pop', key: 'gestes/ok', ...R},
	{at: abs('aigue', 'comme'), key: 'situations/explique', ...R},
	{at: start('chronique') - 1, dur: 12, key: 'situations/explique', x: -420, y: 1500, size: 230},

	/* ── chronique ── */
	{at: abs('chronique', 'chronique'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('chronique', 'bloquée,'), key: 'expressions/triste', fx: 'shake', ...R},
	{at: abs('chronique', 'six'), key: 'gestes/important', ...R},

	/* ── exemples ── */
	{at: abs('exemples', 'exemples'), key: 'gestes/presente', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'normal'), via: 'pop', key: 'gestes/attention', fx: 'shake', ...R},
	{at: abs('fin', 'cherche'), key: 'expressions/loupe', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
