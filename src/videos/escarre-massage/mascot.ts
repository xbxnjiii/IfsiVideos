// Jeu de la mascotte : en haut à gauche, posée sur l'os (zone sans information), jamais pixelisée ; une réaction par moment clé
// (inquiète quand la jauge passe au rose, fière à la décharge). Elle sort avant la dernière image (boucle).
import type {Beat} from '../../brand/MascotActor';
import {abs, start} from './timeline';

const LOW = {y: 470, size: 270};
const L2 = {x: 175};
const R2 = {x: 175};

export const MASCOT: Beat[] = [
	{at: abs('intro', 'escarre'), via: 'pop', key: 'expressions/inquiete', ...L2, ...LOW},
	{at: abs('intro', 'masses'), via: 'cut', key: 'gestes/question', ...L2, ...LOW},
	{at: start('regle') + 8, via: 'hop', dur: 18, key: 'gestes/erreur', ...R2, ...LOW},
	{at: abs('regle', 'supprime'), via: 'cut', key: 'gestes/important', ...R2, ...LOW},
	{at: start('pression') + 8, via: 'hop', dur: 18, key: 'gestes/presente', ...L2, ...LOW},
	{at: abs('pression', 'sang'), via: 'cut', key: 'expressions/inquiete', ...L2, ...LOW},
	{at: abs('pression', 'premier'), via: 'cut', key: 'gestes/attention', ...L2, ...LOW},
	{at: start('massage') + 8, via: 'hop', dur: 18, key: 'expressions/stressee', ...R2, ...LOW},
	{at: abs('massage', 'proscrire'), via: 'cut', key: 'gestes/erreur', ...R2, ...LOW},
	{at: start('soulager') + 8, via: 'hop', dur: 18, key: 'gestes/astuce', ...L2, ...LOW},
	{at: abs('soulager', 'revient'), via: 'cut', key: 'gestes/bravo', ...L2, ...LOW},
	{at: start('fin') + 8, via: 'hop', dur: 18, key: 'gestes/question', ...R2, ...LOW},
	{at: abs('fin', 'prochaine'), via: 'cut', key: 'gestes/regardez', ...R2, ...LOW},
	// elle sort en courant : la dernière image est la première (sans mascotte)
	{at: start('end') - 14, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 1, via: 'run', dur: 12, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
