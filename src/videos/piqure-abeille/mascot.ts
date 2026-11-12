// Jeu de la mascotte : absente du début de l'accroche (la scène sans texte d'abord), puis discrète en bas de l'écran
// (elle ne cache ni la peau au centre ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	// accroche
	{at: abs('intro', 'aïe !'), via: 'pop', key: 'expressions/surprise', ...R, ...LOW},
	{at: abs('intro', 'dard'), key: 'expressions/questionnement', ...R, ...LOW},
	// idée reçue
	{at: start('idees') + 6, via: 'hop', dur: 18, key: 'expressions/reflechit', ...R, ...LOW},
	{at: abs('idees', 'surtout'), key: 'gestes/erreur', ...R, ...LOW},
	// le bon geste
	{at: start('methode') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L, ...LOW},
	{at: abs('methode', 'sort'), key: 'gestes/bravo', ...L, ...LOW},
	// soins
	{at: start('soins') + 8, via: 'hop', dur: 18, key: 'gestes/bonne-reponse', ...R, ...LOW},
	// normal
	{at: start('normal') + 8, via: 'hop', dur: 18, key: 'symptomes/douleur', ...R, ...LOW},
	{at: abs('normal', 'normal.'), key: 'gestes/ok', ...R, ...LOW},
	// urgence
	{at: start('urgence') + 8, via: 'hop', dur: 18, key: 'gestes/attention', ...L, ...LOW},
	{at: abs('urgence', 'appelle'), key: 'gestes/important', ...L, ...LOW},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/questionnement', ...L, ...LOW},
	{at: abs('fin', 'gratter !'), key: 'expressions/youpi', ...L, ...LOW},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
