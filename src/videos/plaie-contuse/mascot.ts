// Jeu de la mascotte : surprise au couteau, douleur à la portière, question sur « laquelle est la pire ? » ; elle
// explique la plaie franche, OK sur « facilement » ; inquiète quand ça écrase, stressée sur « mourir » ; pouce sur
// « la portière ! », important sur « plus grave ». En bas à droite, elle porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'couteau') + 6, via: 'pop', key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'portière') + 4, key: 'symptomes/douleur', fx: 'shake', ...R},
	{at: abs('intro', 'laquelle'), key: 'gestes/question', ...R},
	{at: start('franche') - 4, dur: 16, key: 'gestes/question', x: 540, y: 680, size: 0},

	/* ── franche ── */
	{at: abs('franche', 'franche'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('franche', 'facilement'), key: 'gestes/ok', fx: 'bounce', ...R},
	{at: start('contuse') - 1, dur: 12, key: 'gestes/ok', x: -420, y: 1500, size: 230},

	/* ── contuse ── */
	{at: abs('contuse', 'écrase.'), via: 'pop', key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('contuse', 'irréguliers,'), key: 'expressions/loupe', ...R},
	{at: abs('contuse', 'mourir.'), key: 'expressions/stressee', fx: 'shake', ...R},
	...runAcross('fin'),

	/* ── chute ── */
	{at: abs('fin', 'portière'), via: 'pop', key: 'gestes/bonne-reponse', fx: 'bounce', ...R},
	{at: abs('fin', 'grave'), key: 'gestes/important', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
