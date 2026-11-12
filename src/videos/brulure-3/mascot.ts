// Jeu de la mascotte : absente de l'accroche (la scène sans texte d'abord), puis discrète en bas de l'écran.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'bras.'), via: 'pop', key: 'expressions/alerte', ...R, ...LOW},
	{at: start('couche') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: start('aspect') + 8, via: 'hop', dur: 18, key: 'expressions/inquiete', ...L, ...LOW},
	{at: start('douleur') + 8, via: 'hop', dur: 18, key: 'gestes/attention', ...L, ...LOW},
	{at: start('gravite') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...L, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/erreur', ...L, ...LOW},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
