// Jeu de la mascotte : discrète en bas de l'écran (le patient pâle et le tube occupent l'accroche).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'verdict'), via: 'pop', key: 'expressions/inquiete', ...R, ...LOW},
	{at: abs('intro', 'anémie'), via: 'cut', key: 'expressions/surprise', ...R, ...LOW},
	{at: start('edta') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('nfs') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('rouges') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L, ...LOW},
	{at: start('blancs') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: start('plaquettes') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: start('autres') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('piege') + 8, via: 'hop', dur: 18, key: 'gestes/attention', ...L, ...LOW},
	{at: start('gestes') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
