// Jeu de la mascotte (frames absolues) : une expression par mot clé, elle joue chaque besoin
// (elle tousse, se mouche, va aux toilettes, a mal au dos, bâille, grelotte…), monte l'escalier
// des 3 étapes, porte les transitions (plongée, course, envol, sortie latérale).
import type {Beat} from '../../brand/MascotActor';
import {RUN_WIPE} from '../../brand/motion4';
import {gridSlot, stepTop} from './Scenes';
import {abs, SceneId, start, TL} from './timeline';

type Spot = Pick<Beat, 'x' | 'y' | 'size'>;

/** places dans une scène « besoin » : à côté des puces (droite), en bas (gauche / centre / droite) */
const S = {
	home: {x: 870, y: 1210, size: 300} as Spot,
	low: {x: 540, y: 1700, size: 470} as Spot,
	lowL: {x: 300, y: 1700, size: 440} as Spot,
	lowR: {x: 790, y: 1700, size: 440} as Spot,
};
/** en pied, posée au sol */
const ground = (x: number, size = 620): Spot => ({x, y: 1900, size});
/** en pied, sur la marche de l'étape k */
const onStep = (k: number, size = 520): Spot => ({...stepTop(k), size});

/** traversée en courant pendant la transition `runWipe` vers `id` */
const runAcross = (id: SceneId): Beat[] => {
	const s = start(id);
	const run = {key: 'poses/course', y: 1830, size: 620} as const;
	return [
		{...run, at: s - 6, via: 'pop', x: RUN_WIPE.x0 + 60},
		{...run, at: s + Math.round(TL.transition / 2), via: 'run', dur: TL.transition, x: RUN_WIPE.x1 + 60},
	];
};
/** s'envole avec le panoramique vers le haut */
const flyUp = (id: SceneId, key: Beat['key']): Beat => ({at: start(id) + 2, dur: 14, key, x: 540, y: -520, size: 260});
/** file à gauche avec le panoramique horizontal */
const exitLeft = (id: SceneId, key: Beat['key'], dur = 12): Beat => ({at: start(id) + 1, dur, key, x: -420, y: 1500, size: 300});

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: 4, key: 'poses/course', x: -280, y: 1900, size: 620},
	{at: 18, via: 'run', dur: 20, key: 'poses/presente', ...ground(560)},
	{at: abs('intro', 'quatorze', 2), via: 'pop', key: 'expressions/surprise', ...S.low},
	{at: abs('intro', 'oui'), key: 'expressions/pouce', ...S.low},
	{at: abs('intro', 'douze'), key: 'gestes/erreur', x: 260, y: 1700, size: 400},
	{at: abs('intro', 'quinze'), key: 'gestes/erreur', x: 820, y: 1700, size: 400},
	{at: abs('intro', 'quatorze', 3), via: 'pop', key: 'expressions/youpi', fx: 'bounce', ...S.low},
	{at: abs('intro', 'ensemble'), key: 'gestes/motivee', x: 540, y: 1720, size: 440},
	// elle saute dans la case 1 de la grille (la caméra plonge avec elle)
	{at: start('e1') - 4, dur: 16, key: 'gestes/motivee', ...gridSlot(0), size: 0},

	/* ── étape 1 : mode survie ── */
	{at: abs('e1', 'un'), via: 'pop', key: 'poses/main-levee', ...onStep(0)},
	{at: abs('e1', 'survie'), key: 'poses/mains-hanches', ...onStep(0)},

	/* 1 · respirer */
	{at: start('b1') + 8, key: 'poses/mains-hanches', ...ground(800)},
	{at: abs('b1', 'respirer'), via: 'pop', key: 'symptomes/souffle', ...S.low},
	{at: abs('b1', 'bah'), key: 'expressions/pouce', ...S.lowL},
	{at: abs('b1', 'mieux'), key: 'expressions/clin-doeil', ...S.lowL},
	exitLeft('b2', 'expressions/clin-doeil'),

	/* 2 · boire et manger */
	{at: abs('b2', 'boire'), via: 'pop', key: 'symptomes/cernes', ...S.lowR},
	{at: abs('b2', 'manger'), key: 'expressions/joyeuse', ...S.lowR},
	{at: abs('b2', 'corps'), key: 'situations/explique', ...S.home},
	{at: abs('b2', 'wifi'), key: 'gestes/erreur', ...S.home},
	...runAcross('b3'),

	/* 3 · éliminer */
	{at: abs('b3', 'éliminer'), via: 'pop', key: 'symptomes/toilettes', ...S.lowR},
	{at: abs('b3', 'pipi'), key: 'expressions/genee', ...S.lowR},
	{at: abs('b3', 'caca'), key: 'expressions/cache-visage', ...S.lowR},
	{at: abs('b3', 'transmissions'), key: 'expressions/ecrit', ...S.lowL},
	{at: abs('b3', 'aha'), key: 'expressions/clin-doeil', ...S.lowL},
	flyUp('b4', 'expressions/clin-doeil'),

	/* 4 · se mouvoir, posture */
	{at: abs('b4', 'mouvoir'), via: 'pop', key: 'poses/marche', ...ground(280)},
	{at: abs('b4', 'posture'), key: 'poses/mains-hanches', ...ground(800)},
	{at: abs('b4', 'formateur'), key: 'situations/donne-conseil', ...S.home},
	{at: abs('b4', 'dos'), key: 'symptomes/mal-dos', ...S.lowR},
	{at: abs('b4', 'retraite'), key: 'expressions/youpi', fx: 'bounce', ...S.lowL},

	/* 5 · dormir */
	{at: abs('b5', 'dormir'), via: 'pop', key: 'symptomes/dort-oreiller', ...S.low},
	{at: abs('b5', 'patient'), key: 'symptomes/baille', ...S.lowL},
	{at: abs('b5', 'douze'), key: 'symptomes/cernes', fx: 'slow', ...S.lowL},
	{at: abs('b5', 'toi'), key: 'symptomes/epuisee', fx: 'slow', ...S.lowR},
	// elle plonge dans la lune (transition zoomInto vers l'étape 2)
	{at: start('e2') - 4, dur: 16, key: 'symptomes/epuisee', x: 322, y: 750, size: 0},

	/* ── étape 2 : on se protège ── */
	{at: abs('e2', 'deux'), via: 'pop', key: 'poses/bras-croises', ...onStep(1)},

	/* 6 · se vêtir */
	{at: start('b6') + 8, key: 'poses/bras-croises', ...ground(800)},
	{at: abs('b6', 'vêtir'), via: 'pop', key: 'poses/presente', ...ground(300)},
	{at: abs('b6', 'pyjama'), key: 'symptomes/baille', ...S.lowR},
	{at: abs('b6', 'officielle'), key: 'expressions/pouce', ...S.lowR},
	{at: abs('b6', 'vérifier'), key: 'situations/checklist', ...S.home},
	{at: abs('b6', 'changer'), key: 'expressions/ok', ...S.home},
	exitLeft('b7', 'expressions/ok'),

	/* 7 · température */
	{at: abs('b7', 'maintenir'), via: 'pop', key: 'situations/explique', ...S.low},
	{at: abs('b7', 'couvertures'), key: 'symptomes/coup-de-chaud', fx: 'pant', ...S.lowL},
	{at: abs('b7', 'fenêtre'), key: 'symptomes/grelotte', fx: 'shiver', ...S.lowL},
	{at: abs('b7', 'prend'), key: 'expressions/loupe', ...S.low},
	{at: abs('b7', 'température', 2) + 12, key: 'situations/valide', ...S.low},
	...runAcross('b8'),

	/* 8 · propre, peau */
	{at: abs('b8', 'propre'), via: 'pop', key: 'expressions/ok', ...S.home},
	{at: abs('b8', 'peau'), key: 'expressions/coeur-mains', ...S.home},
	{at: abs('b8', 'essentiel'), key: 'situations/a-retenir', ...S.low},
	flyUp('b9', 'situations/a-retenir'),

	/* 9 · éviter les dangers */
	{at: abs('b9', 'dangers'), via: 'pop', key: 'gestes/attention', ...S.lowR},
	{at: abs('b9', 'sécurise'), key: 'situations/checklist', ...S.home},
	{at: abs('b9', 'freins'), key: 'expressions/loupe', ...S.home},
	{at: abs('b9', 'obstacles'), key: 'expressions/surprise', ...S.lowL},
	{at: abs('b9', 'enquête'), key: 'expressions/cache-visage', ...S.low},
	// elle plonge dans le bouclier (zoomInto vers l'étape 3)
	{at: start('e3') - 4, dur: 16, key: 'expressions/cache-visage', x: 540, y: 750, size: 0},

	/* ── étape 3 : psycho-sociale ── */
	{at: abs('e3', 'trois'), via: 'pop', key: 'poses/presente', ...onStep(2)},
	{at: abs('e3', 'soins'), key: 'expressions/coeur-mains', x: 852, y: 1060, size: 300},

	/* 10 · communiquer */
	{at: abs('b10', 'communiquer'), via: 'pop', key: 'situations/explique', ...S.lowR},
	{at: abs('b10', 'écouter'), key: 'situations/pose-question', ...S.home},
	{at: abs('b10', 'comprendre'), key: 'expressions/reflechit', ...S.home},
	{at: abs('b10', 'transmettre'), key: 'situations/prend-notes', ...S.home},
	{at: abs('b10', 'ça'), key: 'expressions/genee', ...S.lowL},
	{at: abs('b10', 'suffisante'), key: 'gestes/erreur', ...S.lowL},
	exitLeft('b11', 'gestes/erreur'),

	/* 11 · croyances, valeurs */
	{at: abs('b11', 'croyances'), via: 'pop', key: 'expressions/coeur-mains', ...S.lowL},
	{at: abs('b11', 'habitudes'), key: 'expressions/reflechit', ...S.lowR},
	{at: abs('b11', 'écoute'), key: 'expressions/neutre', ...S.home},
	{at: abs('b11', 'respecte'), key: 'expressions/coeur-mains', ...S.home},
	{at: abs('b11', 'adapte'), key: 'gestes/ok', ...S.home},
	...runAcross('b12'),

	/* 12 · se réaliser */
	{at: abs('b12', "s'occuper"), via: 'pop', key: 'situations/travaille', ...S.low},
	{at: abs('b12', 'objectifs'), key: 'gestes/montre-haut', ...S.home},
	{at: abs('b12', 'sens'), key: 'expressions/eureka', ...S.home},
	{at: abs('b12', 'plafond'), key: 'situations/pensive', ...S.lowL},
	{at: abs('b12', 'projet'), key: 'gestes/question', ...S.lowL},
	flyUp('b13', 'gestes/question'),

	/* 13 · se récréer */
	{at: abs('b13', 'récréer'), via: 'pop', key: 'poses/course-joie', ...ground(300)},
	{at: abs('b13', 'jeu'), key: 'expressions/youpi', fx: 'bounce', ...S.home},
	{at: abs('b13', 'musique'), key: 'expressions/joyeuse', ...S.home},
	{at: abs('b13', 'visite'), key: 'gestes/bras-ouverts', ...S.home},
	{at: abs('b13', 'plaisir'), key: 'expressions/coeur-mains', ...S.lowL},
	exitLeft('b14', 'expressions/coeur-mains', 8),

	/* 14 · apprendre (roulement de tambour sous le projecteur) */
	{at: abs('b14', 'enfin'), via: 'pop', key: 'expressions/inquiete', fx: 'shiver', ...S.low},
	{at: abs('b14', 'tambour'), key: 'expressions/cache-visage', fx: 'shiver', ...S.low},
	{at: abs('b14', 'apprendre'), via: 'pop', key: 'expressions/eureka', fx: 'bounce', ...S.lowR},
	{at: abs('b14', 'expliquer'), key: 'situations/medicament', ...S.home},
	{at: abs('b14', 'conseils'), key: 'gestes/astuce', ...S.home},
	{at: abs('b14', 'vérifier'), key: 'situations/question-tablette', ...S.home},
	{at: abs('b14', 'métier'), key: 'gestes/bonne-reponse', ...S.lowL},
	{at: abs('b14', 'bonbons'), key: 'expressions/en-colere', fx: 'shake', ...S.lowL},

	/* ── récap ── */
	{at: abs('outro', 'voilà'), dur: 16, key: 'gestes/bravo', x: 830, y: 1660, size: 420},
	{at: abs('outro', 'quatorze'), key: 'expressions/youpi', fx: 'bounce', x: 830, y: 1660, size: 420},
	{at: abs('outro', 'révision'), key: 'situations/valide', x: 830, y: 1660, size: 420},
	{at: abs('outro', 'commentaire'), key: 'situations/pose-question', x: 300, y: 1690, size: 420},
	{at: abs('outro', 'vidéo'), key: 'gestes/au-revoir', x: 300, y: 1690, size: 420},
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1850, size: 600},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1850, size: 600},
];
