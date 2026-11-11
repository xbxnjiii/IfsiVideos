// Jeu de la mascotte : une étape par mot clé ; elle porte les transitions (voir src/videos/bpco/mascot.ts).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;

export const MASCOT: Beat[] = [
	{at: abs('intro', 'marches'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: start('dessous') + 8, dur: 18, key: 'expressions/surprise', ...L},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
