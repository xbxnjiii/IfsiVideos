// Jeu de la mascotte, discret (format histoire) : elle reste sous le cadre, à gauche ou à droite, et réagit à
// l'histoire au mot près (surprise quand le rasoir glisse, inquiète sur « désordre », alerte sur « pas la fatigue »,
// loupe sur « le corps », téléphone sur « le 15 ») ; elle n'apparaît qu'après l'accroche et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {abs, start} from './timeline';

const L = {x: 220, y: 1730, size: 330};
const R = {x: 860, y: 1730, size: 330};

export const MASCOT: Beat[] = [
	/* ── accroche : elle arrive quand le rasoir glisse ── */
	{at: abs('intro', 'glissé') + 6, via: 'pop', key: 'expressions/surprise', ...R},
	// elle plonge avec la caméra
	{at: start('histoire') - 4, dur: 16, key: 'expressions/surprise', x: 540, y: 1000, size: 0},

	/* ── l'histoire ── */
	{at: abs('histoire', 'désordre'), via: 'pop', key: 'expressions/inquiete', ...L},
	{at: abs('histoire', 'fatigue'), key: 'expressions/reflechit', ...L},
	{at: abs('histoire', 'passer'), key: 'gestes/erreur', ...L},
	// sortie à gauche avec le panoramique
	{at: start('revele') - 1, dur: 12, key: 'gestes/erreur', x: -420, y: 1730, size: 260},

	/* ── la révélation ── */
	{at: abs('revele', 'fatigue'), via: 'pop', key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('revele', 'boucher'), key: 'expressions/stressee', ...R},
	{at: abs('revele', 'avc'), key: 'situations/explique', ...R},
	{at: abs('revele', 'neurones'), key: 'expressions/inquiete', ...R},
	// elle plonge dans le cerveau
	{at: start('signes') - 4, dur: 16, key: 'expressions/inquiete', x: 540, y: 1000, size: 0},

	/* ── on regarde le corps ── */
	{at: abs('signes', 'voit'), via: 'pop', key: 'expressions/questionnement', ...L},
	{at: abs('signes', 'corps'), key: 'expressions/loupe', ...L},
	{at: abs('signes', 'vite'), key: 'gestes/important', fx: 'bounce', ...L},
	// elle s'envole avec le panoramique vers le haut
	{at: start('vite') + 2, dur: 14, key: 'gestes/important', x: 540, y: -520, size: 260},

	/* ── V, I, T ── */
	{at: abs('vite', 'visage'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('vite', 'tombe'), key: 'expressions/inquiete', ...R},
	{at: abs('vite', 'levez'), key: 'gestes/montre-haut', ...R},
	{at: abs('vite', 'retombe'), key: 'expressions/surprise', ...R},
	{at: abs('vite', 'répéter'), key: 'gestes/presente', ...R},
	{at: abs('vite', 'mélangent'), key: 'expressions/stressee', ...R},
	// elle plonge dans la lettre E
	{at: start('urgence') - 4, dur: 16, key: 'expressions/stressee', x: 540, y: 290, size: 0},

	/* ── E comme en urgence ── */
	{at: abs('urgence', 'appelez'), via: 'pop', key: 'accessoires/telephone', fx: 'bounce', ...L},
	{at: abs('urgence', 'disparaissent'), key: 'gestes/attention', ...L},
	{at: abs('urgence', "l'heure"), key: 'gestes/important', ...L},
	// sortie à gauche avec le panoramique
	{at: start('pourquoi') - 1, dur: 12, key: 'gestes/important', x: -420, y: 1730, size: 260},

	/* ── pourquoi d'un seul côté ── */
	{at: abs('pourquoi', 'seul'), via: 'pop', key: 'gestes/question', ...R},
	{at: abs('pourquoi', 'commande'), key: 'situations/explique', ...R},
	{at: abs('pourquoi', "s'éteint"), key: 'expressions/triste', ...R},
	// elle plonge avec la caméra
	{at: start('fin') - 4, dur: 16, key: 'expressions/triste', x: 540, y: 1000, size: 0},

	/* ── fin ── */
	{at: abs('fin', 'soigné'), via: 'pop', key: 'expressions/joyeuse', ...L},
	{at: abs('fin', 'lettres'), key: 'expressions/coeur-mains', fx: 'bounce', ...L},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
