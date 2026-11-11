// Jeu de la mascotte : discrète en bas de l'écran (elle ne cache ni le doigt ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	// accroche : elle grimace avec lui, puis se pose la question
	{at: abs('intro', 'aïe !'), via: 'pop', key: 'symptomes/douleur', ...R},
	{at: abs('intro', 'chauffe,'), key: 'symptomes/coup-de-chaud', ...R},
	{at: abs('intro', 'alors,'), key: 'expressions/questionnement', ...R},
	// idées reçues
	{at: start('idees') + 8, via: 'hop', dur: 18, key: 'expressions/reflechit', ...L},
	{at: abs('idees', 'surtout'), key: 'gestes/erreur', ...L},
	{at: abs('idees', 'reste'), key: 'gestes/attention', ...L},
	// l'eau
	{at: start('eau') + 8, via: 'hop', dur: 18, key: 'gestes/bonne-reponse', ...R, ...LOW},
	{at: abs('eau', 'retiens'), key: 'situations/a-retenir', ...R, ...LOW},
	// protéger
	{at: start('proteger') + 8, via: 'hop', dur: 18, key: 'gestes/chut', ...L},
	{at: abs('proteger', 'couvre'), key: 'situations/donne-conseil', ...L},
	{at: abs('proteger', 'paracétamol'), key: 'situations/medicament', ...R},
	// consulter
	{at: start('consulter') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...R},
	{at: abs('consulter', 'enfant,'), key: 'expressions/inquiete', ...R},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/joyeuse', ...L},
	{at: abs('fin', 'merci !'), key: 'expressions/youpi', ...L},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
