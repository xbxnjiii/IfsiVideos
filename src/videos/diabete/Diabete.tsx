// Diabète (format « pathologie », ≈ 1 min 35) : accroche « le paradoxe » (son sang est plein de sucre… et ses
// cellules meurent de faim : la porte est fermée, il manque la clé insuline), lien rapide vers la vidéo glycémie,
// type 1 / type 2, diagnostic (souvent silencieux, ≥ 1,26 g/L à jeun deux fois), complications (yeux, reins, cœur,
// cerveau, pieds), traitement + HbA1c, rôle infirmier (glycémies, insuline en changeant de site, pieds, resucrer),
// récap. Briques : src/brand/diabetes.tsx.
import React from 'react';
import {EndCard, Episode, EpisodeTransition} from '../../brand/episode';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {LPI} from '../../brand/theme';
import {MASCOT} from './mascot';
import {Compli, Def, Diag, Hook, Outro, Role, Trait, Types} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type DiabeteProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {intro: Hook, def: Def, types: Types, diag: Diag, compli: Compli, trait: Trait, role: Role, outro: Outro, end: EndCard};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, EpisodeTransition> = {
	def: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	types: {p: whip('left'), sfx: 'whoosh'},
	diag: {p: wave({x: 540, y: 760}), sfx: 'whoosh'},
	compli: {p: runWipe(), sfx: 'run'},
	trait: {p: whip('up'), sfx: 'whoosh'},
	role: {p: zoomInto({x: 540, y: 700}), sfx: 'whoosh'},
	outro: {p: whip('left'), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1260, color: LPI.sky}), sfx: 'whoosh'},
};

export const Diabete: React.FC<DiabeteProps> = ({voice, sfx}) => (
	<Episode tl={TL} ids={SCENE_IDS} scenes={SCENES} transitions={TRANSITIONS} mascot={MASCOT} voice={voice ? 'voix/diabete/voix.wav' : null} sfx={sfx} />
);
