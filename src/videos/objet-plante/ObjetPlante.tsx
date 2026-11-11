// « Pourquoi ne faut-il jamais retirer un objet planté ? » — format court info (≈ 45 s, sans barre de progression),
// accroche « la vaisselle », vrais bruitages. Storyboard : docs/lpi/storyboard-objet-plante.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Fin, Geste, Hook, Nuance, Pourquoi} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type ObjetPlanteProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, pourquoi: Pourquoi, nuance: Nuance, geste: Geste, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	pourquoi: {p: zoomInto({x: 523, y: 835, color: LPI.pink}), sfx: 'whoosh'}, // on plonge sous la peau, là où l'éclat est planté
	nuance: {p: whip('left'), sfx: 'whoosh'},
	geste: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	fin: {p: runWipe(), sfx: 'run'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const ObjetPlante: React.FC<ObjetPlanteProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/objet-plante/voix.wav' : null} sfx={sfx} />
);
