// Jeu de la mascotte : absente du début de l'accroche (la scène sans texte d'abord), puis discrète en bas de l'écran
// (elle ne cache ni la tête au centre ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	// accroche
	{at: abs('intro', 'saigne !'), via: 'pop', key: 'expressions/surprise', ...R, ...LOW},
	{at: abs('intro', 'arrière ?'), key: 'expressions/questionnement', ...R, ...LOW},
	// idée reçue
	{at: start('idees') + 6, via: 'hop', dur: 18, key: 'gestes/erreur', ...R, ...LOW},
	{at: abs('idees', 'vomir.'), key: 'symptomes/nausee', ...R, ...LOW},
	// le bon geste
	{at: start('methode') + 8, via: 'hop', dur: 18, key: 'gestes/bonne-reponse', ...R, ...LOW},
	{at: abs('methode', 'mouche-toi'), key: 'symptomes/mouche', ...R, ...LOW},
	{at: abs('methode', 'tiens'), key: 'gestes/important', ...R, ...LOW},
	// après
	{at: start('apres') + 8, via: 'hop', dur: 18, key: 'gestes/attention', ...R},
	// quand consulter
	{at: start('consulter') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: abs('consulter', 'appelle'), key: 'gestes/important', ...L, ...LOW},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/joyeuse', ...R, ...LOW},
	{at: abs('fin', 'pince !'), key: 'gestes/bravo', ...R, ...LOW},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
