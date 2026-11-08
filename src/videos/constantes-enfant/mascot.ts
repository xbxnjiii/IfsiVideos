// Jeu de la mascotte (constantes de l'enfant) : inquiète puis stressée devant le moniteur rose, téléphone sur « Tu
// appelles le médecin ? », elle réfléchit pendant le silence, « OK » sur « Pas besoin ! », croix sur « miniature » ;
// puis un geste au mot près : stéthoscope, « attention » sur un cœur qui ralentit, elle se mouche sur « nez bouché »,
// essoufflée sur le tirage, tensiomètre, fièvre, grelotte quand le nouveau-né se refroidit, malaise sur l'hypo, loupe
// sur la courbe, eurêka sur la couche pesée. Elle reste en bas, du côté libre, et porte les transitions.
import type {Beat} from '../../brand/MascotActor';
import {runAcross as run, SPOT} from '../../brand/episode';
import {abs, SceneId, start, TL} from './timeline';

const {L, R} = SPOT;
const runAcross = (id: SceneId) => run(TL, start(id));

export const MASCOT: Beat[] = [
	/* ── accroche : le piège ── */
	{at: abs('intro', 'bébé'), via: 'pop', key: 'expressions/surprise', ...R},
	{at: abs('intro', 'quarante-cinq'), key: 'expressions/inquiete', ...R},
	{at: abs('intro', 'cent'), key: 'expressions/stressee', fx: 'shake', ...R},
	{at: abs('intro', 'médecin'), key: 'accessoires/telephone', ...R},
	{at: abs('intro', 'médecin') + 30, key: 'situations/reflexion', ...R},
	{at: abs('intro', 'pas'), key: 'gestes/ok', ...R},
	{at: abs('intro', 'miniature'), key: 'gestes/erreur', fx: 'shake', ...R},
	{at: abs('intro', 'naissance'), key: 'gestes/presente', ...R},
	{at: abs('intro', 'change'), key: 'expressions/questionnement', ...R},
	// elle plonge (zoomInto)
	{at: start('ages') - 4, dur: 16, key: 'expressions/questionnement', x: 540, y: 700, size: 0},

	/* ── les 3 âges + la règle d'or ── */
	{at: abs('ages', 'bébé'), via: 'pop', key: 'expressions/coeur-mains', ...R},
	{at: abs('ages', "l'ado"), key: 'gestes/regardez', ...R},
	{at: abs('ages', 'règle'), key: 'situations/a-retenir', ...R},
	{at: abs('ages', 'cœur'), key: 'gestes/hausse', ...R},
	{at: abs('ages', 'basse'), key: 'gestes/baisse', ...R},
	// sortie à gauche avec le panoramique
	{at: start('fc') - 1, dur: 12, key: 'gestes/baisse', x: -420, y: 1500, size: 230},

	/* ── le cœur ── */
	{at: abs('fc', 'cent'), via: 'pop', key: 'gestes/presente', ...L},
	{at: abs('fc', 'poignet'), key: 'gestes/erreur', ...L},
	{at: abs('fc', 'stéthoscope'), key: 'accessoires/stethoscope', ...L},
	{at: abs('fc', 'attention'), key: 'gestes/attention', ...L},
	{at: abs('fc', 'grave'), key: 'expressions/alerte', fx: 'shake', ...L},
	{at: abs('fc', "d'oxygène"), key: 'symptomes/essoufflee', ...L},
	// saut par-dessus la vague
	{at: start('fr') + 8, dur: 18, key: 'symptomes/essoufflee', ...R},

	/* ── la respiration ── */
	{at: abs('fr', 'ventre'), key: 'situations/explique', ...R},
	{at: abs('fr', 'irrégulière'), key: 'expressions/questionnement', ...R},
	{at: abs('fr', 'compte'), key: 'situations/a-retenir', ...R},
	{at: abs('fr', 'bouché'), key: 'symptomes/mouche', ...R},
	{at: abs('fr', 'lutte'), key: 'gestes/attention', ...R},
	{at: abs('fr', 'tirage'), key: 'symptomes/essoufflee', ...R},
	{at: abs('fr', 'geignement'), key: 'symptomes/oppression', ...R},
	...runAcross('ta'),

	/* ── la tension ── */
	{at: abs('ta', 'systolique'), via: 'pop', key: 'accessoires/tensiometre', ...R},
	{at: abs('ta', 'brassard'), key: 'situations/montre-schema', ...R},
	{at: abs('ta', 'trop'), key: 'gestes/probleme', ...R},
	{at: abs('ta', 'dernier'), key: 'situations/a-retenir', ...R},
	{at: abs('ta', 'accélère'), key: 'gestes/hausse', ...R},
	{at: abs('ta', 'grave'), key: 'expressions/alerte', fx: 'shake', ...R},
	// elle s'envole avec le panoramique vers le haut
	{at: start('temp') + 2, dur: 14, key: 'expressions/alerte', x: 540, y: -520, size: 230},

	/* ── la température ── */
	{at: abs('temp', 'chiffres'), via: 'pop', key: 'gestes/ok', ...R},
	{at: abs('temp', 'fièvre'), key: 'symptomes/fievre', ...R},
	{at: abs('temp', 'mesure'), key: 'situations/explique', ...R},
	{at: abs('temp', 'refroidit'), key: 'symptomes/grelotte', ...R},
	{at: abs('temp', 'bonnet'), key: 'expressions/coeur-mains', ...R},
	{at: abs('temp', 'gravité'), key: 'gestes/attention', ...R},
	{at: abs('temp', 'avis'), key: 'accessoires/telephone', ...R},
	// elle plonge (zoomInto)
	{at: start('gly') - 4, dur: 16, key: 'accessoires/telephone', x: 540, y: 700, size: 0},

	/* ── la glycémie ── */
	{at: abs('gly', "l'adulte"), via: 'pop', key: 'gestes/ok', ...L},
	{at: abs('gly', 'nouveau-né'), key: 'expressions/surprise', ...L},
	{at: abs('gly', 'doigt'), key: 'gestes/erreur', ...L},
	{at: abs('gly', 'talon'), key: 'gestes/bonne-reponse', ...L},
	{at: abs('gly', 'hypoglycémie'), key: 'symptomes/malaise', ...L},
	{at: abs('gly', 'tremble'), key: 'expressions/inquiete', fx: 'shake', ...L},
	{at: abs('gly', 'mou'), key: 'symptomes/lasse', ...L},
	// sortie à gauche avec le panoramique
	{at: start('spo2') - 1, dur: 12, key: 'symptomes/lasse', x: -420, y: 1500, size: 230},

	/* ── la saturation ── */
	{at: abs('spo2', 'norme'), via: 'pop', key: 'gestes/ok', ...L},
	{at: abs('spo2', 'pied'), key: 'gestes/regardez', ...L},
	{at: abs('spo2', 'pleure'), key: 'expressions/surprise', ...L},
	{at: abs('spo2', 'fausse'), key: 'gestes/probleme', ...L},
	{at: abs('spo2', 'courbe'), key: 'expressions/loupe', ...L},
	{at: abs('spo2', 'régulière'), key: 'gestes/bonne-reponse', ...L},
	// saut par-dessus la vague
	{at: start('diurese') + 8, dur: 18, key: 'gestes/bonne-reponse', ...R},

	/* ── la diurèse ── */
	{at: abs('diurese', 'poids'), key: 'situations/explique', ...R},
	{at: abs('diurese', 'deux'), key: 'gestes/presente', ...R},
	{at: abs('diurese', 'pèse'), key: 'situations/prend-notes', ...R},
	{at: abs('diurese', 'gramme'), key: 'expressions/eureka', ...R},
	{at: abs('diurese', 'millilitre'), key: 'gestes/bonne-reponse', ...R},
	...runAcross('outro'),

	/* ── récap ── */
	{at: abs('outro', 'récap') + 8, via: 'pop', key: 'situations/recapitule', ...L},
	{at: abs('outro', 'stéthoscope'), key: 'accessoires/stethoscope', ...R},
	{at: abs('outro', 'thermomètre'), key: 'situations/checklist', ...L},
	{at: abs('outro', 'couche'), key: 'expressions/clin-doeil', ...R},
	{at: abs('outro', "l'ado"), via: 'pop', key: 'gestes/bravo', fx: 'bounce', x: 540, y: 1735, size: 390},
	// elle repart en courant avant le logo
	{at: start('end') - 6, via: 'pop', key: 'poses/course', x: 640, y: 1890, size: 480},
	{at: start('end') + 10, via: 'run', dur: 16, key: 'poses/course', x: 1460, y: 1890, size: 480},
];
