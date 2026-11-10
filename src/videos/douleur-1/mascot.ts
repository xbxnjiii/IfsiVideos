// Jeu de la mascotte (partie 1, v2) : perplexe devant les trois avis (gênée sur « il exagère »), elle interroge sur
// « Et lui ? », se prend la tête sur « personne ne lui a demandé », a mal avec lui, puis cherche comment mesurer ;
// ensuite un geste au mot près : elle POSE la question de l'échelle numérique (sa bulle est juste au-dessus d'elle) et
// note la réponse, se cache les yeux sur « sans voir de chiffres », médicament sur « soulagée », téléphone sur
// « médecin », prend des notes… Elle reste en bas (le contenu s'arrête vers y 1420 ; quand un patient ou l'enfant est
// en bas à gauche, elle est à droite) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));
const C = {x: 540, y: 1735, size: 390};

export const MASCOT: Beat[] = [
	/* ── accroche : trois soignants, trois avis ── */
	{at: abs('intro', "l'un,"), via: 'pop', key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'exagère.'), key: 'expressions/genee', ...R},
	{at: abs('intro', 'troisième,'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'et'), key: 'gestes/question', ...R},
	{at: abs('intro', 'demandé'), key: 'gestes/facepalm', fx: 'shake', ...R},
	{at: abs('intro', 'douleur,'), key: 'symptomes/douleur', ...R},
	{at: abs('intro', 'alors,'), key: 'expressions/questionnement', ...R},
	// elle plonge (zoomInto)
	{at: start('serie') - 4, dur: 16, key: 'expressions/questionnement', x: 540, y: 700, size: 0},

	/* ── la série ── */
	{at: abs('serie', 'un'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('serie', 'répondre.'), key: 'situations/a-retenir', ...R},
	// sortie à gauche avec le panoramique
	{at: start('auto') - 1, dur: 12, key: 'situations/a-retenir', x: -420, y: 1500, size: 230},

	/* ── principe ── */
	{at: abs('auto', 'ressent'), via: 'pop', key: 'symptomes/douleur', ...L},
	{at: abs('auto', "s'exprimer,"), key: 'situations/explique', ...L},
	{at: abs('auto', "l'évalue."), key: 'gestes/erreur', ...L},
	{at: abs('auto', "l'auto-évaluation,"), key: 'situations/a-retenir', ...L},
	{at: abs('auto', 'croit,'), key: 'expressions/coeur-mains', fx: 'bounce', ...L},
	// saut par-dessus la vague
	{at: start('en') + 8, dur: 18, key: 'expressions/coeur-mains', ...R},

	/* ── échelle numérique : c'est elle qui pose la question ── */
	{at: abs('en', 'combien'), key: 'situations/pose-question', ...R},
	{at: abs('en', 'zéro,', 2), key: 'expressions/joyeuse', ...R},
	{at: abs('en', 'pire'), key: 'symptomes/douleur', fx: 'shake', ...R},
	{at: abs('en', 'imaginable.') + 16, key: 'situations/prend-notes', ...R},
	...runAcross('eva'),

	/* ── EVA ── */
	{at: abs('eva', 'réglette.'), via: 'pop', key: 'gestes/presente', ...R},
	{at: abs('eva', 'glisser'), key: 'gestes/regardez', ...R},
	{at: abs('eva', 'sans'), key: 'expressions/cache-visage', ...R},
	{at: abs('eva', 'soignant,'), key: 'situations/lit-document', ...R},
	{at: abs('eva', 'score,'), key: 'situations/valide', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('evs') + 2, dur: 14, key: 'situations/valide', x: 540, y: -520, size: 230},

	/* ── EVS ── */
	{at: abs('evs', 'difficiles,'), via: 'pop', key: 'expressions/genee', ...R},
	{at: abs('evs', 'mots'), key: 'gestes/astuce', ...R},
	{at: abs('evs', 'modérée,'), key: 'expressions/inquiete', ...R},
	{at: abs('evs', 'extrêmement'), key: 'symptomes/douleur', fx: 'shake', ...R},
	{at: abs('evs', 'intense', 2) + 14, key: 'situations/valide', ...R},
	// elle plonge (zoomInto)
	{at: start('visages') - 4, dur: 16, key: 'situations/valide', x: 540, y: 700, size: 0},

	/* ── visages ── */
	{at: abs('visages', "l'enfant,"), via: 'pop', key: 'expressions/coeur-mains', ...R},
	{at: abs('visages', 'quatre'), key: 'gestes/important', ...R},
	{at: abs('visages', 'montre'), key: 'gestes/regardez', ...R},
	{at: abs('visages', 'aussi'), key: 'situations/valide', ...R},
	// sortie à gauche avec le panoramique
	{at: start('seuil') - 1, dur: 12, key: 'situations/valide', x: -420, y: 1500, size: 230},

	/* ── seuil ── */
	{at: abs('seuil', 'quatre'), via: 'pop', key: 'gestes/important', ...R},
	{at: abs('seuil', 'soulagée'), key: 'situations/medicament', ...R},
	{at: abs('seuil', 'prévient'), key: 'accessoires/telephone', ...R},
	{at: abs('seuil', 'réévalue'), key: 'situations/checklist', ...R},
	{at: abs('seuil', 'note'), key: 'situations/prend-notes', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'situations/prend-notes', ...L},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, key: 'situations/recapitule', ...L},
	{at: abs('outro', 'réglette,'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'visages'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'réévalue.') + 20, via: 'pop', key: 'gestes/bravo', fx: 'bounce', ...C},
	{at: abs('outro', 'comment'), key: 'expressions/questionnement', ...C},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
