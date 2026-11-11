// Jeu de la mascotte : discrète en bas de l'écran (elle ne cache ni le doigt ni les cartes), une étape par mot clé.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;

export const MASCOT: Beat[] = [
	// accroche : elle regarde… et se cache le visage
	{at: abs('intro', 'coupure'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'raté !'), key: 'gestes/facepalm', ...R},
	{at: abs('intro', 'carré'), key: 'gestes/regardez', ...R},
	// préparer
	{at: start('prep') + 8, via: 'hop', dur: 18, key: 'gestes/important', ...L, y: 1740},
	{at: abs('prep', 'désinfecte'), key: 'situations/medicament', ...L, y: 1740},
	{at: abs('prep', 'sèche'), key: 'gestes/ok', ...L, y: 1740},
	// poser
	{at: start('pose') + 8, via: 'hop', dur: 18, key: 'situations/explique', ...R},
	{at: abs('pose', 'toucher'), key: 'gestes/attention', ...R},
	{at: abs('pose', 'plaie.', 2), key: 'expressions/ok', ...R},
	{at: abs('pose', 'retire'), key: 'situations/explique', ...R},
	{at: abs('pose', 'bords.'), key: 'gestes/bravo', ...R},
	// le garder
	{at: start('garder') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L},
	{at: abs('garder', 'sale.'), key: 'expressions/clin-doeil', ...L},
	// chute
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'expressions/youpi', ...R},
	{at: abs('fin', 'pas'), key: 'gestes/bravo', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
