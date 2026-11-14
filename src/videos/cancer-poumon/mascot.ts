// Jeu de la mascotte : absente de l'accroche (la scène sans texte d'abord), puis discrète en bas de l'écran.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'peut-être'), via: 'pop', key: 'expressions/questionnement', ...L, ...LOW},
	{at: start('poumons') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: start('cancer') + 8, via: 'hop', dur: 18, key: 'expressions/inquiete', ...L, ...LOW},
	{at: abs('cancer', 'tue'), via: 'cut', key: 'gestes/attention', ...L, ...LOW},
	{at: start('tabac') + 8, via: 'hop', dur: 18, key: 'expressions/stressee', ...R, ...LOW},
	{at: start('signes') + 8, via: 'hop', dur: 18, key: 'expressions/loupe', ...L, ...LOW},
	{at: start('examens') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...R, ...LOW},
	{at: start('risques') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...L, ...LOW},
	{at: start('traitement') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
