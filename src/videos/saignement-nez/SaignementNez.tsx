// « Saignement de nez : tête en arrière ou en avant ? » — format court (≈ 52 s, voix gratuite d'abord, Laura une fois
// validée, sans barre de progression). Accroche sans texte au début : il lit, une goutte de sang tombe sur la page, son
// nez saigne… et il bascule la tête en arrière. Idée reçue (le sang file dans la gorge : vu en coupe), le bon geste (assis,
// tête en avant, comprimer la partie molle (mouchoir ou compresse) 5 – 15 min, mèche en respirant par la bouche), après, quand consulter
// (20 min, choc sur la tête, traitement qui fluidifie le sang, le 15), chute. Storyboard : docs/lpi/storyboard-saignement-nez.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Apres, Consulter, Fin, Hook, Idees, Meche, Methode} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type SaignementNezProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, idees: Idees, methode: Methode, meche: Meche, apres: Apres, consulter: Consulter, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	idees: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	methode: {p: whip('left'), sfx: 'whoosh'},
	meche: {p: zoomInto({x: 760, y: 1000}), sfx: 'whoosh'},
	apres: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	consulter: {p: runWipe(), sfx: 'run'},
	fin: {p: whip('up'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const SaignementNez: React.FC<SaignementNezProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/saignement-nez/voix.wav' : null} sfx={sfx} />
);
