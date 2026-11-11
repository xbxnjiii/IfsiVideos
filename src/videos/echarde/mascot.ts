// Jeu de la mascotte : discrète en bas de l'écran (elle ne cache ni le doigt ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	// accroche
	{at: abs('intro', 'aïe !'), via: 'pop', key: 'expressions/surprise', ...R, ...LOW},
	{at: abs('intro', 'écharde,'), key: 'symptomes/douleur', ...R, ...LOW},
	// les ongles
	{at: start('ongles') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L, ...LOW},
	{at: abs('ongles', 'mauvaise'), key: 'gestes/erreur', ...L, ...LOW},
	{at: abs('ongles', 'casser'), key: 'expressions/inquiete', ...L, ...LOW},
	// la bonne méthode
	{at: start('methode') + 8, via: 'hop', dur: 18, key: 'gestes/bonne-reponse', ...R, ...LOW},
	{at: abs('methode', 'tire'), key: 'situations/explique', ...R, ...LOW},
	// après
	{at: start('apres') + 8, via: 'hop', dur: 18, key: 'gestes/ok', ...L},
	// consulter
	{at: start('consulter') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R},
	{at: abs('consulter', 'vaccin'), key: 'accessoires/seringue', ...R},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/youpi', ...L},
	{at: abs('fin', 'bout !'), key: 'gestes/bravo', ...L},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
