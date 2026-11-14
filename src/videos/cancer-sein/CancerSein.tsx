// « Le cancer du sein » (n° 50, format pathologie, voix gratuite d'abord, sans barre de progression). Accroche sans
// texte, réaliste : le matin dans la salle de bain, ta mère sent une petite boule dans son sein, « ce n'est rien » ;
// plongée vers le sein. Puis le sein (schéma fourni par le propriétaire, sans annotations), le cancer, les signes, le
// dépistage, les examens, les risques, les traitements, chute « la palpation chaque mois, la mammographie dès 50 ans ».
// Storyboard : docs/lpi/storyboard-cancer-sein.md.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Cancer, Depistage, Examens, Fin, Hook, Risques, Sein, Signes, Traitement} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type CancerSeinProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, sein: Sein, cancer: Cancer, signes: Signes, depistage: Depistage, examens: Examens, risques: Risques, traitement: Traitement, fin: Fin, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	sein: {p: zoomInto({x: 540, y: 1150, color: LPI.navy}), sfx: 'whoosh'},
	cancer: {p: whip('left'), sfx: 'whoosh'},
	signes: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	depistage: {p: runWipe(), sfx: 'run'},
	examens: {p: whip('up'), sfx: 'whoosh'},
	risques: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	traitement: {p: whip('left'), sfx: 'whoosh'},
	fin: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const CancerSein: React.FC<CancerSeinProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} progress={false} voice={voice ? 'voix/cancer-sein/voix.wav' : null} sfx={sfx} />
);
