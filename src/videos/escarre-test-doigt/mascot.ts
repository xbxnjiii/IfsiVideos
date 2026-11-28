// Jeu de la mascotte : en haut à gauche, jamais pixelisée ; une réaction par moment clé. Elle sort avant la dernière
// image (boucle).
import type {Beat} from '../../brand/MascotActor';
import {abs, start} from './timeline';

const P = {x: 175, y: 470, size: 270};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'doigt'), via: 'pop', key: 'gestes/question', ...P},
	{at: start('geste') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...P},
	{at: abs('geste', 'regardes'), via: 'cut', key: 'expressions/loupe', ...P},
	{at: start('blanchit') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...P},
	{at: abs('blanchit', 'surveille'), via: 'cut', key: 'gestes/astuce', ...P},
	{at: start('rouge') + 8, via: 'hop', dur: 18, key: 'expressions/inquiete', ...P},
	{at: abs('rouge', 'de'), via: 'cut', key: 'gestes/attention', ...P},
	{at: start('foncee') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...P},
	{at: abs('foncee', 'chaude'), via: 'cut', key: 'gestes/important', ...P},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/stressee', ...P},
	{at: abs('fin', 'prochaine'), via: 'cut', key: 'gestes/regardez', ...P},
	{at: start('end') - 14, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 1, via: 'run', dur: 12, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
