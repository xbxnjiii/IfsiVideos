// Jeu de la mascotte : discrète en bas, hors de la fenêtre pixel (jamais pixelisée) ; une réaction par moment clé
// (inquiète quand la jauge passe au rose, fière à la décharge). Elle sort avant la dernière image (boucle).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;
const LOW = {y: 1790, size: 300};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'escarre'), via: 'pop', key: 'expressions/inquiete', ...L, ...LOW},
	{at: abs('intro', 'masses'), via: 'cut', key: 'gestes/question', ...L, ...LOW},
	{at: start('regle') + 8, via: 'hop', dur: 18, key: 'gestes/erreur', ...R, ...LOW},
	{at: abs('regle', 'supprime'), via: 'cut', key: 'gestes/important', ...R, ...LOW},
	{at: start('pression') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L, ...LOW},
	{at: abs('pression', 'sang'), via: 'cut', key: 'expressions/inquiete', ...L, ...LOW},
	{at: abs('pression', 'premier'), via: 'cut', key: 'gestes/attention', ...L, ...LOW},
	{at: start('massage') + 8, via: 'hop', dur: 18, key: 'expressions/stressee', ...R, ...LOW},
	{at: abs('massage', 'proscrire'), via: 'cut', key: 'gestes/erreur', ...R, ...LOW},
	{at: start('soulager') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L, ...LOW},
	{at: abs('soulager', 'revient'), via: 'cut', key: 'gestes/bravo', ...L, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/question', ...R, ...LOW},
	{at: abs('fin', 'prochaine'), via: 'cut', key: 'gestes/regardez', ...R, ...LOW},
	// elle sort en courant : la dernière image est la première (sans mascotte)
	{at: start('end') - 14, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 1, via: 'run', dur: 12, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
