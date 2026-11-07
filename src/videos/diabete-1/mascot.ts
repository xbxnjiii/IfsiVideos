// Jeu de la mascotte (diabète, partie 1) : accroche de la v1 (surprise, ventre qui crie famine, « non » sur « impossible
// d'entrer », elle cherche la clé, eurêka, alerte) ; puis un geste au mot près : inquiète quand les défenses attaquent,
// « important » sur « insulinodépendant », seringue sur « sans insuline », cœur sur « vivre » ; « problème » quand la
// clé coince ; cœur sur « grossesse », loupe sur le dépistage, surprise sur le bébé trop gros. Elle reste en bas, du
// côté libre (les pastilles sont à gauche dans les types 1 et 2), et porte les transitions.
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
	{at: start('serie') - 4, dur: 16, key: 'expressions/alerte', x: 540, y: 700, size: 0},

	/* ── la série ── */
	{at: abs('serie', 'partie'), via: 'pop', key: 'gestes/bonjour', ...R},
	{at: abs('serie', "aujourd'hui"), key: 'situations/a-retenir', ...R},
	{at: abs('serie', 'trois'), key: 'gestes/presente', ...R},
	// sortie à gauche avec le panoramique
	{at: start('def') - 1, dur: 12, key: 'gestes/presente', x: -420, y: 1500, size: 230},

	/* ── le principe ── */
	{at: abs('def', 'vidéo'), via: 'pop', key: 'situations/montre-document', ...L},
	{at: abs('def', 'carburant'), key: 'expressions/joyeuse', ...L},
	{at: abs('def', 'clé'), key: 'situations/idee', ...L},
	{at: abs('def', "l'insuline"), key: 'situations/explique', ...L},
	{at: abs('def', 'pancréas'), key: 'situations/montre-digestif', ...L},
	// saut par-dessus la vague
	{at: start('type1') + 8, dur: 18, key: 'situations/montre-digestif', ...R},

	/* ── type 1 ── */
	{at: abs('type1', 'défenses'), key: 'expressions/surprise', ...R},
	{at: abs('type1', 'attaquent'), key: 'expressions/inquiete', fx: 'shake', ...R},
	{at: abs('type1', 'manque'), key: 'expressions/triste', ...R},
	{at: abs('type1', 'insulinodépendant'), key: 'gestes/important', ...R},
	{at: abs('type1', 'sans'), key: 'accessoires/seringue', ...R},
	{at: abs('type1', 'vivre'), key: 'expressions/coeur-mains', ...R},
	{at: abs('type1', 'enfants'), key: 'expressions/clin-doeil', ...R},
	{at: abs('type1', 'toute'), key: 'situations/a-retenir', ...R},
	...runAcross('type2'),

	/* ── type 2 ── */
	{at: abs('type2', 'fréquent'), via: 'pop', key: 'gestes/hausse', ...R},
	{at: abs('type2', 'fabrique'), key: 'situations/montre-digestif', ...R},
	{at: abs('type2', 'marche'), key: 'gestes/probleme', fx: 'shake', ...R},
	{at: abs('type2', 'insulinodépendant'), key: 'gestes/important', ...R},
	{at: abs('type2', 'passer'), key: 'situations/donne-conseil', ...R},
	{at: abs('type2', 'adultes'), key: 'gestes/regardez', ...R},
	{at: abs('type2', 'surpoids'), key: 'expressions/genee', ...R},
	{at: abs('type2', 'peu'), key: 'symptomes/lasse', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('gesta') + 2, dur: 14, key: 'symptomes/lasse', x: 540, y: -520, size: 230},

	/* ── diabète gestationnel ── */
	{at: abs('gesta', 'gestationnel'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('gesta', 'grossesse'), key: 'expressions/coeur-mains', ...R},
	{at: abs('gesta', 'hormones'), key: 'situations/montre-schema', ...R},
	{at: abs('gesta', 'empêchent'), key: 'gestes/probleme', ...R},
	{at: abs('gesta', 'recherche'), key: 'expressions/loupe', ...R},
	{at: abs('gesta', 'prise'), key: 'accessoires/seringue', ...R},
	{at: abs('gesta', 'gros'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('gesta', 'disparaît'), key: 'expressions/ok', ...R},
	{at: abs('gesta', 'maman'), key: 'gestes/attention', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'gestes/attention', x: -420, y: 1500, size: 230},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...R},
	{at: abs('outro', 'un'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'gestationnel'), key: 'expressions/coeur-mains', ...R},
	{at: abs('outro', 'dans'), key: 'gestes/montre-haut', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
