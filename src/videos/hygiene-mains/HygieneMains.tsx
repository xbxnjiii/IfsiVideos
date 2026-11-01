// Hygiene-Mains : « Les 5 indications de l'hygiène des mains ». Accroche-choc (des milliers de microbes invisibles, la
// loupe les montre, ils passent au patient), règle « 2 avant · 3 après », une scène par indication, le bon geste, récap.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cinq, Deux, Geste, Hook, Outro, Quatre, Regle, Trois, Un} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type HygieneMainsProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, regle: Regle, un: Un, deux: Deux, trois: Trois, quatre: Quatre, cinq: Cinq, geste: Geste, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	regle: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	un: {p: whip('left'), sfx: 'whoosh'},
	deux: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	trois: {p: runWipe(), sfx: 'run'},
	quatre: {p: whip('up'), sfx: 'whoosh'},
	cinq: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	geste: {p: whip('left'), sfx: 'whoosh'},
	outro: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const HygieneMains: React.FC<HygieneMainsProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/hygiene-mains/voix.wav' : null} sfx={sfx} />
);
