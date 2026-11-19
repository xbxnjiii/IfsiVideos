// Jeu de la mascotte : discrète en bas de l'écran, sous les cartes de normes.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'fatiguer'), via: 'pop', key: 'expressions/inquiete', ...L, ...LOW},
	{at: abs('intro', 'bilan'), via: 'cut', key: 'gestes/presente', ...L, ...LOW},
	{at: start('reins') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R, ...LOW},
	{at: start('uree') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L, ...LOW},
	{at: start('creat') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: start('dfg') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: abs('dfg', 'retiens'), via: 'cut', key: 'gestes/important', ...L, ...LOW},
	{at: start('stades') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...R, ...LOW},
	{at: abs('stades', 'terminale'), via: 'cut', key: 'gestes/attention', ...R, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
