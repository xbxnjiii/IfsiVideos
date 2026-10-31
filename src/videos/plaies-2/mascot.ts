// Jeu de la mascotte (série plaies, partie 2) : loupe sur le petit trou, surprise quand il se révèle profond, « aïe »
// sur l'excoriation, masque sur les microbes, coup de chaud sur la brûlure, « chut » sur « qu'on ne sent même pas » ;
// plus petite et plus bas sous les 3 cartes de termes ; elle porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));
/** sous les 3 cartes de termes : un peu plus bas et plus petite */
const RL = {x: 860, y: 1760, size: 320};

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'trou'), via: 'pop', key: 'expressions/loupe', ...R},
	{at: abs('intro', 'dangereux'), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'pourquoi'), key: 'gestes/question', ...R},
	// saut par-dessus la vague
	{at: start('serie') + 8, dur: 18, key: 'gestes/question', ...L},

	/* ── la série ── */
	{at: abs('serie', 'partie'), key: 'gestes/bonjour', ...L},
	{at: abs('serie', 'aiguës'), key: 'gestes/presente', ...L},
	{at: abs('serie', 'semaines'), key: 'expressions/ok', ...L},
	// elle plonge (zoomInto)
	{at: start('trauma1') - 4, dur: 16, key: 'expressions/ok', x: 540, y: 700, size: 0},

	/* ── excoriation, coupure, lacération ── */
	{at: abs('trauma1', "l'excoriation"), via: 'pop', key: 'symptomes/douleur', ...RL},
	{at: abs('trauma1', 'coupure'), key: 'expressions/surprise', ...RL},
	{at: abs('trauma1', 'lacération'), key: 'expressions/stressee', ...RL},
	// sortie à gauche avec le panoramique
	{at: start('trauma2') - 1, dur: 12, key: 'expressions/stressee', x: -420, y: 1600, size: 230},

	/* ── piqûre, morsure, plaie chirurgicale ── */
	{at: abs('trauma2', 'pointu'), via: 'pop', key: 'gestes/attention', ...RL},
	{at: abs('trauma2', 'profond'), key: 'expressions/surprise', ...RL},
	{at: abs('trauma2', 'dangereux'), key: 'gestes/important', fx: 'shake', ...RL},
	{at: abs('trauma2', 'morsure'), key: 'expressions/alerte', ...RL},
	{at: abs('trauma2', "s'infecte"), key: 'symptomes/masque', ...RL},
	{at: abs('trauma2', 'bloc'), key: 'situations/valide', ...RL},
	...runAcross('brulures'),

	/* ── brûlures ── */
	{at: abs('brulures', 'premier'), via: 'pop', key: 'symptomes/coup-de-chaud', ...RL},
	{at: abs('brulures', 'cloques'), key: 'expressions/surprise', ...RL},
	{at: abs('brulures', 'troisième'), key: 'expressions/alerte', fx: 'shake', ...RL},
	{at: abs('brulures', 'nerfs'), key: 'situations/explique', ...RL},
	{at: abs('brulures', 'grave'), key: 'gestes/important', ...RL},
	// elle s'envole avec le panoramique vers le haut
	{at: start('outro') + 2, dur: 14, key: 'gestes/important', x: 540, y: -520, size: 230},

	/* ── récap + à suivre ── */
	{at: abs('outro', 'excoriation'), via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'brûlure'), key: 'symptomes/coup-de-chaud', ...L},
	{at: abs('outro', 'dans'), key: 'gestes/regardez', ...R},
	{at: abs('outro', 'sent'), key: 'gestes/chut', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
