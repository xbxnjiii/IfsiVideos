// Jeu de la mascotte : discrète en bas de l'écran (écrit par scripts/brand/lab_mascot.py).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: start('intro') + 40, via: 'pop', key: 'expressions/surprise', ...R, ...LOW},
	{at: start('intro') + 150, via: 'cut', key: 'expressions/reflechit', ...R, ...LOW},
	{at: start('vitd') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('b12') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: start('cdt') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...L, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...R, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
