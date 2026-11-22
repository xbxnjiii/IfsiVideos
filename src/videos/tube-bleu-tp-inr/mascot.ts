// Jeu de la mascotte : discrète en bas de l'écran.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'faux…'), via: 'pop', key: 'expressions/surprise', ...L, ...LOW},
	{at: abs('intro', 'lire'), via: 'cut', key: 'expressions/reflechit', ...L, ...LOW},
	{at: start('remplir') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('tp') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('inr') + 8, via: 'hop', dur: 18, key: 'gestes/attention', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
