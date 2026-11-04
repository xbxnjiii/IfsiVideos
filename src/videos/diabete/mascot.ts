// Jeu de la mascotte : surprise devant le sang « rempli de sucre », ventre qui crie famine sur « faim », « non »
// sur « impossible d'entrer », elle cherche la clé, eurêka sur « l'insuline », alerte sur « diabète » ; puis un geste
// au mot près par notion (document sur « la vidéo », seringue sur « l'insuline », baskets sur « activité », toilettes
// sur « urines », chut sur « silencieux », un symptôme par organe abîmé, loupe sur les pieds, malaise sur « hypo »…).
// Elle reste en bas (le contenu s'arrête vers y 1340) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche : le paradoxe ── */
	{at: abs('intro', 'Son'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'faim'), key: 'symptomes/mal-ventre', ...R},
	{at: abs('intro', 'porte'), key: 'gestes/regardez', ...R},
	{at: abs('intro', 'impossible'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: abs('intro', 'manque'), key: 'situations/cherche-info', ...R},
	{at: abs('intro', "l'insuline"), key: 'expressions/eureka', ...R},
	{at: abs('intro', 'diabète'), key: 'expressions/alerte', fx: 'shake', ...R},
	// elle plonge (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'expressions/alerte', x: 540, y: 700, size: 0},

	/* ── le principe ── */
	{at: abs('def', 'vidéo'), via: 'pop', key: 'situations/montre-document', ...R},
	{at: abs('def', 'carburant'), key: 'expressions/joyeuse', ...R},
	{at: abs('def', 'clé'), key: 'situations/idee', ...R},
	{at: abs('def', "l'insuline"), key: 'situations/explique', ...R},
	{at: abs('def', 'pancréas'), key: 'situations/montre-digestif', ...R},
	// sortie à gauche avec le panoramique
	{at: start('types') - 1, dur: 12, key: 'situations/montre-digestif', x: -420, y: 1500, size: 230},

	/* ── type 1 / type 2 ── */
	{at: abs('types', 'type'), via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('types', 'manque'), key: 'expressions/inquiete', ...L},
	{at: abs('types', 'jeunes'), key: 'expressions/clin-doeil', ...L},
	{at: abs('types', "l'insuline"), key: 'accessoires/seringue', ...L},
	{at: abs('types', 'vie'), key: 'gestes/important', ...L},
	{at: abs('types', 'deux'), key: 'gestes/regardez', ...R},
	{at: abs('types', 'fréquent'), key: 'gestes/hausse', ...R},
	{at: abs('types', 'mal'), key: 'gestes/probleme', ...R},
	{at: abs('types', "d'activité"), key: 'gestes/motivee', ...R},
	// saut par-dessus la vague
	{at: start('diag') + 8, dur: 18, key: 'gestes/motivee', ...L},

	/* ── le diagnostic ── */
	{at: abs('diag', 'soif'), key: 'symptomes/coup-de-chaud', ...L},
	{at: abs('diag', "d'urines"), key: 'symptomes/toilettes', ...L},
	{at: abs('diag', 'fatigue'), key: 'symptomes/epuisee', ...L},
	{at: abs('diag', 'silencieux'), key: 'gestes/chut', ...L},
	{at: abs('diag', 'révèle'), key: 'expressions/eureka', ...L},
	{at: abs('diag', 'glycémie'), key: 'situations/lit-document', ...L},
	{at: abs('diag', 'fois'), key: 'gestes/important', ...L},
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
	{at: abs('trait', "l'insuline"), key: 'accessoires/seringue', ...L},
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
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'gestes/bonne-reponse', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'type'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'abîme'), key: 'expressions/inquiete', ...L},
	{at: abs('outro', 'rôle'), key: 'situations/valide', ...R},
	{at: abs('outro', "d'hypo") + 20, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
