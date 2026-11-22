// Jeu de la mascotte : discrète en bas de l'écran, sous les cartes de normes.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'anémie'), via: 'pop', key: 'expressions/inquiete', ...R, ...LOW},
	{at: abs('intro', 'lire'), via: 'cut', key: 'expressions/reflechit', ...R, ...LOW},
	{at: start('hematies') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('hemoglobine') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...R, ...LOW},
	{at: abs('hemoglobine', 'anémie'), via: 'cut', key: 'expressions/inquiete', ...R, ...LOW},
	{at: start('hematocrite') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: start('vgm') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: abs('vgm', 'fer'), via: 'cut', key: 'gestes/important', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
