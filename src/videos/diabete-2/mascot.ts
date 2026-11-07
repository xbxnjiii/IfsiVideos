// Jeu de la mascotte (diabète, partie 2) : pouce sur « en pleine forme », surprise sur « et pourtant », un symptôme par
// organe abîmé (yeux, reins), « chut » sur « aucun bruit », loupe sur « repérer » ; puis un geste au mot près par notion
// (toilettes sur « urines », chut sur « silencieux », lit le document sur la glycémie, conseil sur l'alimentation,
// seringue sur l'insuline, loupe sur les pieds, malaise sur « hypo »…). Elle reste en bas et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche : il va très bien… ── */
	{at: abs('intro', 'soif'), via: 'pop', key: 'expressions/joyeuse', ...R},
	{at: abs('intro', 'forme'), key: 'expressions/pouce', ...R},
	{at: abs('intro', 'pourtant'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'yeux'), key: 'symptomes/frotte-yeux', ...R},
	{at: abs('intro', 'reins'), key: 'symptomes/mal-dos', ...R},
	{at: abs('intro', 'pieds'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'bruit'), key: 'gestes/chut', ...R},
	{at: abs('intro', 'repérer'), key: 'expressions/loupe', ...R},
	// elle plonge (zoomInto)
	{at: start('serie') - 4, dur: 16, key: 'expressions/loupe', x: 540, y: 700, size: 0},

	/* ── la série ── */
	{at: abs('serie', 'partie'), via: 'pop', key: 'gestes/bonjour', ...R},
	{at: abs('serie', "aujourd'hui"), key: 'situations/a-retenir', ...R},
	{at: abs('serie', 'soigner'), key: 'accessoires/seringue', ...R},
	// sortie à gauche avec le panoramique
	{at: start('diag') - 1, dur: 12, key: 'accessoires/seringue', x: -420, y: 1500, size: 230},

	/* ── le découvrir ── */
	{at: abs('diag', 'soif'), via: 'pop', key: 'symptomes/coup-de-chaud', ...L},
	{at: abs('diag', "d'urines"), key: 'symptomes/toilettes', ...L},
	{at: abs('diag', 'fatigue'), key: 'symptomes/epuisee', ...L},
	{at: abs('diag', 'silencieux'), key: 'gestes/chut', ...L},
	{at: abs('diag', 'révèle'), key: 'expressions/eureka', ...L},
	{at: abs('diag', 'glycémie'), key: 'situations/lit-document', ...L},
	{at: abs('diag', 'prises'), key: 'gestes/important', ...L},
	...runAcross('compli'),

	/* ── les complications ── */
	{at: abs('compli', 'abîme'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('compli', 'yeux'), key: 'symptomes/frotte-yeux', ...R},
	{at: abs('compli', 'reins'), key: 'symptomes/mal-dos', ...R},
	{at: abs('compli', 'cœur'), key: 'symptomes/douleur-poitrine', ...R},
	{at: abs('compli', 'cerveau'), key: 'symptomes/mal-de-tete', ...R},
	{at: abs('compli', 'pieds'), key: 'expressions/loupe', ...R},
	{at: abs('compli', "l'amputation"), key: 'expressions/alerte', fx: 'shake', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('trait') + 2, dur: 14, key: 'expressions/alerte', x: 540, y: -520, size: 230},

	/* ── le traitement ── */
	{at: abs('trait', 'alimentation'), via: 'pop', key: 'situations/donne-conseil', ...L},
	{at: abs('trait', "l'activité"), key: 'gestes/motivee', ...L},
	{at: abs('trait', 'comprimés'), key: 'situations/medicament', ...L},
	{at: abs('trait', 'un'), key: 'accessoires/seringue', ...L},
	{at: abs('trait', 'suivi'), key: 'situations/prend-notes', ...L},
	{at: abs('trait', 'trois'), key: 'situations/a-retenir', ...L},
	// elle plonge (zoomInto)
	{at: start('role') - 4, dur: 16, key: 'situations/a-retenir', x: 540, y: 700, size: 0},

	/* ── ton rôle ── */
	{at: abs('role', 'rôle') + 3, via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('role', 'glycémies'), key: 'situations/checklist', ...R},
	{at: abs('role', 'injections'), key: 'accessoires/seringue', ...R},
	{at: abs('role', 'changeant'), key: 'gestes/astuce', ...R},
	{at: abs('role', 'pieds'), key: 'expressions/loupe', ...R},
	{at: abs('role', "d'hypoglycémie"), key: 'symptomes/malaise', fx: 'shake', ...R},
	{at: abs('role', 'vidéo'), key: 'situations/montre-document', ...R},
	{at: abs('role', 'resucre'), key: 'gestes/bonne-reponse', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'gestes/bonne-reponse', ...L},

	/* ── récap ── */
	{at: abs('outro', 'silencieux'), key: 'situations/recapitule', ...L},
	{at: abs('outro', 'abîme'), key: 'expressions/inquiete', ...R},
	{at: abs('outro', 'soigne'), key: 'situations/checklist', ...L},
	{at: abs('outro', 'rôle'), key: 'situations/valide', ...R},
	{at: abs('outro', 'voilà'), via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
