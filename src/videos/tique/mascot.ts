// Jeu de la mascotte : discrète en bas de l'écran (elle ne cache ni la peau au centre ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	// accroche
	{at: abs('intro', 'quoi ?'), via: 'pop', key: 'expressions/questionnement', ...R, ...LOW},
	{at: abs('intro', 'tique !'), key: 'expressions/surprise', ...R, ...LOW},
	// idée reçue
	{at: start('idees') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: abs('idees', 'surtout'), key: 'gestes/erreur', ...L, ...LOW},
	// le tire-tique
	{at: start('methode') + 8, via: 'hop', dur: 18, key: 'gestes/bonne-reponse', ...R, ...LOW},
	{at: abs('methode', 'tête.'), key: 'gestes/bravo', ...R, ...LOW},
	// après
	{at: start('apres') + 8, via: 'hop', dur: 18, key: 'situations/prend-notes', ...R},
	// surveiller
	{at: start('surveiller') + 8, via: 'hop', dur: 18, key: 'situations/cherche-info', ...L, ...LOW},
	{at: abs('surveiller', 'fièvre,'), key: 'symptomes/fievre', ...L, ...LOW},
	{at: abs('surveiller', 'consulte'), key: 'gestes/important', ...L, ...LOW},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/joyeuse', ...R},
	{at: abs('fin', 'rentrant !'), key: 'expressions/youpi', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
