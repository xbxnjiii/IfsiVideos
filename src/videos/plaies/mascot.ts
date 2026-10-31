// Jeu de la mascotte : une étape par mot clé (« aïe » sur la coupure, inquiète sur l'escarre, loupe quand la plaie
// s'enfonce, coup de chaud sur la brûlure, elle dort sur l'escarre, « chut » sur « en silence », se cache le visage sur
// « visage », seringue sur le tétanos) ; elle reste d'un côté quand les pastilles apparaissent et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));
/** sous les 3 cartes de termes (brûlures) : un peu plus bas et plus petite */
const RL = {x: 860, y: 1760, size: 320};

export const MASCOT: Beat[] = [
	/* ── accroche : les cartes vont jusqu'à y 1150 ── */
	{at: abs('intro', 'coupure'), via: 'pop', key: 'symptomes/douleur', ...L},
	{at: abs('intro', 'jours'), key: 'expressions/ok', ...L},
	{at: abs('intro', 'escarre'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'mois'), key: 'expressions/fatiguee', ...R},
	{at: abs('intro', 'plaies'), key: 'gestes/attention', ...R},
	{at: abs('intro', 'types'), key: 'gestes/question', ...R},
	// elle plonge dans la peau (zoomInto)
	{at: start('def') - 4, dur: 16, key: 'gestes/question', x: 540, y: 1000, size: 0},

	/* ── définition ── */
	{at: abs('def', 'plaie'), via: 'pop', key: 'situations/explique', ...R},
	{at: abs('def', 'microbes'), key: 'expressions/stressee', ...R},
	{at: abs('def', 'profonde'), key: 'expressions/loupe', ...R},
	{at: abs('def', "l'os"), key: 'expressions/surprise', fx: 'shake', ...R},
	// sortie à gauche avec le panoramique
	{at: start('familles') - 1, dur: 12, key: 'expressions/surprise', x: -420, y: 1500, size: 230},

	/* ── deux familles ── */
	{at: abs('familles', 'aiguës'), via: 'pop', key: 'gestes/ok', ...L},
	{at: abs('familles', 'chroniques'), key: 'expressions/fatiguee', ...L},
	{at: abs('familles', 'quatre'), key: 'gestes/important', ...L},
	// saut par-dessus la vague
	{at: start('aigues') + 8, dur: 18, key: 'gestes/important', ...R},

	/* ── plaies aiguës (pastilles sur 2 colonnes jusqu'à y 1330) ── */
	{at: abs('aigues', "l'excoriation"), key: 'symptomes/douleur', ...R},
	{at: abs('aigues', 'coupure'), key: 'expressions/surprise', ...R},
	{at: abs('aigues', 'lacération'), key: 'expressions/stressee', ...R},
	{at: abs('aigues', 'profonde'), key: 'gestes/attention', ...R},
	{at: abs('aigues', 'morsure'), key: 'expressions/alerte', fx: 'shake', ...R},
	{at: abs('aigues', 'microbes'), key: 'symptomes/masque', ...R},
	{at: abs('aigues', 'bloc'), key: 'situations/valide', ...R},
	...runAcross('brulures'),

	/* ── brûlures (3 cartes de termes jusqu'à y 1510) ── */
	{at: abs('brulures', 'premier'), via: 'pop', key: 'symptomes/coup-de-chaud', ...RL},
	{at: abs('brulures', 'cloques'), key: 'expressions/surprise', ...RL},
	{at: abs('brulures', 'troisième'), key: 'expressions/alerte', fx: 'shake', ...RL},
	{at: abs('brulures', 'nerfs'), key: 'situations/explique', ...RL},
	// elle plonge dans le socle (zoomInto)
	{at: start('chroniques') - 4, dur: 16, key: 'situations/explique', x: 540, y: 700, size: 0},

	/* ── plaies chroniques ── */
	{at: abs('chroniques', "l'escarre"), via: 'pop', key: 'symptomes/dort', ...R},
	{at: abs('chroniques', 'matelas'), key: 'symptomes/mal-dos', ...R},
	{at: abs('chroniques', "l'ulcère"), key: 'expressions/inquiete', ...R},
	{at: abs('chroniques', 'diabétique'), key: 'expressions/reflechit', ...R},
	{at: abs('chroniques', 'silence'), key: 'gestes/chut', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('escarre') + 2, dur: 14, key: 'gestes/chut', x: 540, y: -520, size: 230},

	/* ── 4 stades (rangée de 4 cartes jusqu'à y 1260) ── */
	{at: abs('escarre', 'stades'), via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('escarre', 'appuie'), key: 'gestes/regardez', ...L},
	{at: abs('escarre', 'Stade 2'), key: 'expressions/inquiete', ...L},
	{at: abs('escarre', 'Stade 3'), key: 'expressions/stressee', ...L},
	{at: abs('escarre', 'Stade 4'), key: 'expressions/alerte', fx: 'shake', ...L},
	// saut par-dessus la vague
	{at: start('gravite') + 8, dur: 18, key: 'expressions/alerte', ...R},

	/* ── signes de gravité ── */
	{at: abs('gravite', 'profonde'), key: 'expressions/loupe', ...R},
	{at: abs('gravite', 'souillée'), key: 'expressions/genee', ...R},
	{at: abs('gravite', 'visage'), key: 'expressions/cache-visage', ...R},
	{at: abs('gravite', 'avis'), key: 'accessoires/stethoscope', ...R},
	{at: abs('gravite', 'tétanos'), key: 'accessoires/seringue', fx: 'bounce', ...R},
	// sortie à gauche avec le panoramique
	{at: start('outro') - 1, dur: 12, key: 'accessoires/seringue', x: -420, y: 1500, size: 230},

	/* ── récap rapide ── une pose par ligne */
	{at: abs('outro', 'plaie'), via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'aiguë'), key: 'expressions/ok', ...R},
	{at: abs('outro', 'chronique'), key: 'expressions/fatiguee', ...L},
	{at: abs('outro', 'signes'), key: 'gestes/attention', ...R},
	{at: abs('outro', 'gravité') + 26, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
