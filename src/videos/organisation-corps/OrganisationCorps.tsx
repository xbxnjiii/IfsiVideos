// Organisation-Corps : (décrire l'accroche et le déroulé).
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Appareil, Cellule, Fin, Hook, Organe, Organisme, Tissu} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type OrganisationCorpsProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, cellule: Cellule, tissu: Tissu, organe: Organe, appareil: Appareil, organisme: Organisme, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	cellule: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	tissu: {p: whip('left'), sfx: 'whoosh'},
	organe: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	appareil: {p: runWipe(), sfx: 'run'},
	organisme: {p: whip('up'), sfx: 'whoosh'},
	fin: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const OrganisationCorps: React.FC<OrganisationCorpsProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/organisation-corps/voix.wav' : null} sfx={sfx} />
);
