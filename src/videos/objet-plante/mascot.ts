// Jeu de la mascotte : joyeuse à la vaisselle, surprise quand le verre éclate, douleur quand l'éclat se plante, erreur
// sur « Stop ! » ; loupe sous la peau, astuce sur « bouchon », stressée sur « hémorragie » ; OK pour la petite écharde,
// important pour l'éclat planté ; elle présente le bon geste, téléphone sur « le 15 » ; clin d'œil sur « cuisine ».
// Elle reste en bas à droite (le contenu s'arrête vers y 1460) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'vaisselle,'), via: 'pop', key: 'expressions/joyeuse', ...R},
	{at: abs('intro', 'éclate'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'plante'), key: 'symptomes/douleur', ...R},
	{at: abs('intro', 'retirer.'), key: 'gestes/question', ...R},
	{at: abs('intro', 'stop'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: start('pourquoi') - 4, dur: 16, key: 'gestes/erreur', x: 523, y: 835, size: 0},

	/* ── pourquoi ── */
	{at: abs('pourquoi', 'coupé'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('pourquoi', 'bouchon.'), key: 'gestes/astuce', ...R},
	{at: abs('pourquoi', 'hémorragie.'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('pourquoi', 'abîmer'), key: 'expressions/inquiete', ...R},
	{at: start('nuance') - 1, dur: 12, key: 'expressions/inquiete', x: -420, y: 1500, size: 230},

	/* ── nuance ── */
	{at: abs('nuance', 'écharde,'), via: 'pop', key: 'gestes/ok', ...R},
	{at: abs('nuance', 'planté'), key: 'gestes/important', ...R},
	{at: start('geste') + 8, dur: 18, key: 'gestes/important', ...L},

	/* ── le bon geste ── */
	{at: abs('geste', 'cale'), key: 'gestes/presente', ...L},
	{at: abs('geste', "s'assoit,"), key: 'situations/valide', ...R},
	{at: abs('geste', 'appelle'), key: 'accessoires/telephone', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'retire.'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('fin', 'cuisine'), key: 'expressions/clin-doeil', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
