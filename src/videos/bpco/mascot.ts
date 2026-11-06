// Jeu de la mascotte (BPCO v2, en cours d'écriture).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {start} from './timeline';

const {R} = SPOT;

export const MASCOT: Beat[] = [
	{at: 4, via: 'pop', key: 'expressions/surprise', ...R},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
