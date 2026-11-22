// Jeu de la mascotte : discrète en bas de l'écran.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'film'), via: 'pop', key: 'gestes/presente', ...R, ...LOW},
	{at: start('quoi') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: start('mois') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: start('objectif') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...L, ...LOW},
	{at: abs('objectif', 'complications'), via: 'cut', key: 'expressions/inquiete', ...L, ...LOW},
	{at: start('pratique') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
