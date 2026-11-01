// Jeu de la mascotte : inquiète devant le patient qui tousse, « ok » pour celui en pleine forme, questionnement, choc sur
// « les deux ! », loupe sur « impossible de le voir » ; puis un geste au mot près par réflexe (masque sur « masque »,
// erreur sur « jamais », « aïe » sur la piqûre, toilettes sur les selles, stressée quand ça éclabousse…) ; elle reste en
// bas (le suivi des 6 réflexes occupe y 1110 – 1260) et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche ── */
	{at: abs('intro', 'tousse'), via: 'pop', key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'forme'), key: 'gestes/ok', ...R},
	{at: abs('intro', 'lequel'), key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'deux', 2), key: 'expressions/surprise', fx: 'shake', ...R},
	{at: abs('intro', 'voir'), key: 'expressions/loupe', ...R},
	{at: abs('intro', 'règles'), key: 'gestes/important', ...R},
	{at: abs('intro', 'précautions'), key: 'situations/a-retenir', ...R},
	// elle plonge (zoomInto)
	{at: start('regle') - 4, dur: 16, key: 'situations/a-retenir', x: 540, y: 700, size: 0},

	/* ── 6 réflexes pour tous ── */
	{at: abs('regle', 'six') + 4, via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('regle', 'même'), key: 'expressions/clin-doeil', ...L},
	{at: abs('regle', 'patient'), key: 'expressions/coeur-mains', ...L},
	{at: abs('regle', 'toi'), key: 'situations/pouce', ...L},
	// sortie à gauche avec le panoramique
	{at: start('mains') - 1, dur: 12, key: 'situations/pouce', x: -420, y: 1500, size: 230},

	/* ── 1 · mains ── */
	{at: abs('mains', 'friction'), via: 'pop', key: 'expressions/joyeuse', fx: 'bounce', ...R},
	{at: abs('mains', 'dégagés'), key: 'gestes/regardez', ...R},
	{at: abs('mains', 'vernis'), key: 'gestes/attention', ...R},
	{at: abs('mains', 'bijou'), key: 'gestes/erreur', fx: 'shake', ...R},
	// saut par-dessus la vague
	{at: start('epi') + 8, dur: 18, key: 'gestes/erreur', ...L},

	/* ── 2 · protections ── */
	{at: abs('epi', 'gants'), key: 'gestes/presente', ...L},
	{at: abs('epi', 'tablier'), key: 'gestes/regardez', ...L},
	{at: abs('epi', 'masque'), key: 'symptomes/masque', ...L},
	{at: abs('epi', 'gicler'), key: 'expressions/surprise', fx: 'shake', ...L},
	...runAcross('toux'),

	/* ── 3 · toux ── */
	{at: abs('toux', 'tousse'), via: 'pop', key: 'symptomes/toux', ...R},
	{at: abs('toux', 'masque'), key: 'symptomes/masque', ...R},
	{at: abs('toux', 'coude'), key: 'gestes/important', ...R},
	{at: abs('toux', 'mouchoir'), key: 'gestes/ok', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('aes') + 2, dur: 14, key: 'gestes/ok', x: 540, y: -520, size: 230},

	/* ── 4 · piqûres ── */
	{at: abs('aes', 'jamais'), via: 'pop', key: 'gestes/erreur', fx: 'shake', ...L},
	{at: abs('aes', 'collecteur'), key: 'gestes/presente', ...L},
	{at: abs('aes', 'piques'), key: 'symptomes/douleur', fx: 'shake', ...L},
	{at: abs('aes', 'consultes'), key: 'accessoires/telephone', ...L},
	// elle plonge (zoomInto)
	{at: start('excreta') - 4, dur: 16, key: 'accessoires/telephone', x: 540, y: 700, size: 0},

	/* ── 5 · excreta ── */
	{at: abs('excreta', 'selles'), via: 'pop', key: 'symptomes/toilettes', ...R},
	{at: abs('excreta', 'gants'), key: 'gestes/presente', ...R},
	{at: abs('excreta', 'jamais'), key: 'gestes/erreur', ...R},
	{at: abs('excreta', 'éclabousse'), key: 'expressions/stressee', fx: 'shake', ...R},
	// sortie à gauche avec le panoramique
	{at: start('env') - 1, dur: 12, key: 'expressions/stressee', x: -420, y: 1500, size: 230},

	/* ── 6 · environnement ── */
	{at: abs('env', 'surfaces'), via: 'pop', key: 'gestes/regardez', ...R},
	{at: abs('env', 'désinfectés'), key: 'situations/valide', ...R},
	{at: abs('env', 'déchets'), key: 'gestes/presente', ...R},
	{at: abs('env', 'filière'), key: 'expressions/ok', ...R},
	// saut par-dessus la vague
	{at: start('outro') + 8, dur: 18, key: 'expressions/ok', ...L},

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, key: 'situations/recapitule', ...L},
	{at: abs('outro', 'aiguilles'), key: 'situations/checklist', ...R},
	{at: abs('outro', 'environnement'), key: 'expressions/ok', ...L},
	{at: abs('outro', 'réflexes') + 10, via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
