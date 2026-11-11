// Jeu de la mascotte : joyeuse avec le chat, douleur quand il mord, « rien de méchant » : ok ; surprise quand la main
// gonfle ; loupe sur les microbes, alerte quand les crocs les enfoncent ; risque élevé : attention ; le bon réflexe :
// présente puis stéthoscope ; chute : important. En bas à droite (la jauge et les cartes s'arrêtent avant y 1480).
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'chat'), via: 'pop', key: 'expressions/joyeuse', ...L},
	{at: abs('intro', 'mordu.'), key: 'symptomes/douleur', fx: 'shake', ...L},
	{at: abs('intro', 'rien'), key: 'gestes/ok', ...L},
	{at: abs('intro', 'doublé'), key: 'expressions/surprise', fx: 'shake', ...L},
	{at: start('pourquoi') - 4, dur: 16, key: 'expressions/surprise', x: 711, y: 1159, size: 0},

	/* ── pourquoi ── */
	{at: abs('pourquoi', 'microbes.'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('pourquoi', 'enfoncés'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: start('risque') - 1, dur: 12, key: 'expressions/alerte', x: -420, y: 1500, size: 230},

	/* ── risque ── */
	{at: abs('risque', 'élevé,'), via: 'pop', key: 'gestes/attention', fx: 'shake', ...R},
	{at: abs('risque', 'petite.'), key: 'gestes/important', ...R},
	{at: start('geste') + 8, dur: 18, key: 'gestes/important', ...L},

	/* ── le bon réflexe ── */
	{at: abs('geste', 'lave'), key: 'gestes/presente', ...L},
	{at: abs('geste', 'consulte'), key: 'accessoires/stethoscope', fx: 'bounce', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'humain'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('fin', 'médecin'), key: 'gestes/important', fx: 'bounce', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
