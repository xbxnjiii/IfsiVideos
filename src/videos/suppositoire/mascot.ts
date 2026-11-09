// Jeu de la mascotte : perplexe devant le match pointe / plat, tablette sur « internet », choc sur « la guerre » ;
// sceptique devant l'équipe plat, loupe sur « étude », erreur sur « jamais confirmée », corrige l'idée reçue ; lit la
// notice, bonne réponse sur « la pointe », montre la fusée qui décolle ; gênée sur « on pousse », clin d'œil sur
// « les fesses » ; youpi au décollage. Elle reste en bas (le contenu s'arrête vers y = 1420 ; à gauche pendant la fusée, qui décolle à droite) et porte les transitions
// (plongée, panoramique, vague, panoramique vers le haut).
import type {Beat} from '../../brand/MascotActor';
import {SPOT} from '../../brand/episode';
import {abs, start} from './timeline';

const {L, R} = SPOT;

export const MASCOT: Beat[] = [
	/* ── accroche : le match ── */
	{at: abs('intro', 'pointu'), via: 'pop', key: 'expressions/questionnement', ...R},
	{at: abs('intro', 'plat'), key: 'expressions/reflechit', ...R},
	{at: abs('intro', 'internet'), key: 'situations/question-tablette', ...R},
	{at: abs('intro', 'guerre'), key: 'expressions/surprise', fx: 'shake', ...R},
	// elle plonge avec la caméra (zoomInto)
	{at: start('mythe') - 4, dur: 16, key: 'expressions/surprise', x: 540, y: 700, size: 0},

	/* ── l'idée reçue ── */
	{at: abs('mythe', 'jure'), via: 'pop', key: 'expressions/reflechit', ...L},
	{at: abs('mythe', 'sauf'), key: 'gestes/attention', ...L},
	{at: abs('mythe', 'étude'), key: 'expressions/loupe', ...L},
	{at: abs('mythe', 'jamais'), key: 'gestes/erreur', ...L},
	{at: abs('mythe', 'idée'), key: 'situations/corrige-erreur', fx: 'shake', ...L},
	// sortie à gauche avec le panoramique
	{at: start('verite') - 1, dur: 12, key: 'situations/corrige-erreur', x: -420, y: 1500, size: 230},

	/* ── on suit la notice ── */
	{at: abs('verite', 'quoi'), via: 'pop', key: 'expressions/questionnement', ...L},
	{at: abs('verite', 'notice'), key: 'situations/lit-document', ...L},
	{at: abs('verite', 'pointe'), key: 'gestes/bonne-reponse', ...L},
	{at: abs('verite', 'fusée'), key: 'expressions/joyeuse', ...L},
	{at: abs('verite', 'devant'), key: 'gestes/montre-haut', ...L},
	// saut par-dessus la vague
	{at: start('geste') + 8, dur: 18, key: 'gestes/montre-haut', ...R},

	/* ── le bon geste ── */
	{at: abs('geste', 'patient'), key: 'gestes/presente', ...R},
	{at: abs('geste', 'pousse'), key: 'expressions/genee', ...R},
	{at: abs('geste', 'fesses'), key: 'expressions/clin-doeil', ...R},
	{at: abs('geste', 'minutes'), key: 'gestes/ok', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('fin') + 2, dur: 14, key: 'gestes/ok', x: 540, y: -520, size: 230},

	/* ── décollage réussi ── */
	{at: abs('fin', 'décollage'), via: 'pop', key: 'expressions/youpi', ...R},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
