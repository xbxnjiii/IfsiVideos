// Jeu de la mascotte : absente du début de l'accroche (le patient et le téléphone d'abord), puis discrète en bas de
// l'écran, sous la frise de l'ordre.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'ordre'), via: 'pop', key: 'expressions/reflechit', ...R, ...LOW},
	{at: abs('intro', 'trompes,'), via: 'cut', key: 'gestes/attention', ...R, ...LOW},
	{at: abs('intro', 'sept', 2), via: 'cut', key: 'expressions/surprise', ...R, ...LOW},
	{at: start('pourquoi') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: abs('pourquoi', 'voilà'), via: 'cut', key: 'expressions/surprise', ...L, ...LOW},
	{at: start('hemoc') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('purge') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: start('bleu') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: start('secs') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('suite') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('gestes') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...R, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
