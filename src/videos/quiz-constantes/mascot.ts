// Jeu de la mascotte (promo quiz) : elle présente le jeu, réfléchit pendant chaque chrono (comme le spectateur), réagit
// à chaque réponse (bonne réponse, essoufflée sur la tachycardie, clin d'œil sur le piège, malaise sur l'hypo) ; puis
// youpi sur « bonne nouvelle », valide la 7e vidéo, tablette pour le quiz du site, montre le haut sur « lien en bio »,
// motivée sur « Va vite te tester ! ». Elle reste en bas (le contenu s'arrête vers y 1440) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;

export const MASCOT: Beat[] = [
	/* ── le quiz éclair ── */
	{at: abs('intro', 'quatre'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('intro', 'prêt'), key: 'gestes/motivee', ...R},
	{at: abs('intro', 'fièvre'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'oui'), key: 'gestes/bonne-reponse', ...R},
	{at: abs('intro', 'repos'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'tachycardie'), key: 'symptomes/essoufflee', ...R},
	{at: abs('intro', 'cent', 3), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'piège'), key: 'expressions/clin-doeil', ...R},
	{at: abs('intro', 'litre'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'hypoglycémie'), key: 'symptomes/malaise', fx: 'shake', ...R},
	{at: abs('intro', 'resucre'), key: 'gestes/bonne-reponse', ...R},
	// elle plonge (zoomInto)
	{at: start('serie') - 4, dur: 16, key: 'gestes/bonne-reponse', x: 540, y: 700, size: 0},

	/* ── les 7 vidéos ── */
	{at: abs('serie', 'bonne'), via: 'pop', key: 'expressions/youpi', ...L},
	{at: abs('serie', 'sept'), key: 'gestes/presente', ...L},
	{at: abs('serie', 'température'), key: 'situations/checklist', ...L},
	{at: abs('serie', 'diurèse'), key: 'situations/valide', ...L},
	// sortie à gauche avec le panoramique
	{at: start('quiz') - 1, dur: 12, key: 'situations/valide', x: -420, y: 1500, size: 230},

	/* ── le quiz du site ── */
	{at: abs('quiz', 'test'), via: 'pop', key: 'situations/question-tablette', ...R},
	{at: abs('quiz', 'gratuit'), key: 'expressions/joyeuse', ...R},
	{at: abs('quiz', 'site'), key: 'accessoires/tablette', ...R},
	{at: abs('quiz', 'bio'), key: 'gestes/montre-haut', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'gestes/montre-haut', ...L},

	/* ── le défi ── */
	{at: abs('outro', 'combien'), key: 'expressions/questionnement', ...L},
	{at: abs('outro', 'tester'), key: 'gestes/motivee', fx: 'bounce', ...L},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
