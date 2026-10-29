// « La fréquence cardiaque » : une vidéo par constante (≈ 1 min 10). Accroche-question, définition,
// prise du pouls radial, norme adulte, tachycardie, bradycardie, rythme et force du pouls, quiz, récap.
// Même DA que Constantes (tempo, physique, mascotte libre) ; voix de la marque (scripts/voice/tts_voix.py).
import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {linearTiming, TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {beatMoves, MascotActor} from '../../brand/MascotActor';
import {wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {Sfx, SfxEnabled, SfxName} from '../../brand/Sfx';
import {GRID, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {MASCOT} from './mascot';
import {Brady, Definition, EndCard, Hook, Mesure, Norme, Outro, Quiz, Rythme, Tachy} from './Scenes';
import {SCENE_IDS, SceneId, TL} from './timeline';

export type FrequenceCardiaqueProps = {voice: boolean; sfx: boolean};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook,
	def: Definition,
	mesure: Mesure,
	norme: Norme,
	tachy: Tachy,
	brady: Brady,
	rythme: Rythme,
	quiz: Quiz,
	outro: Outro,
	end: EndCard,
};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée ; la mascotte la porte (mascot.ts). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, {p: TransitionPresentation<any>; sfx: SfxName}> = {
	// on plonge dans le cœur de l'accroche
	def: {p: zoomInto({x: 540, y: 850}), sfx: 'whoosh'},
	mesure: {p: whip('left'), sfx: 'whoosh'},
	// la mascotte traverse en courant et tire la scène
	norme: {p: runWipe(), sfx: 'run'},
	tachy: {p: whip('up'), sfx: 'whoosh'},
	brady: {p: wave({x: 540, y: 700}), sfx: 'whoosh'},
	rythme: {p: whip('left'), sfx: 'whoosh'},
	quiz: {p: runWipe(), sfx: 'run'},
	outro: {p: wave({x: 540, y: 330}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 1050, color: LPI.sky}), sfx: 'whoosh'},
};

/** Progression des 7 notions (définition → quiz), centrée en haut. */
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = TL;
	const n = 7;
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const opacity = interpolate(frame, [starts[1], starts[1] + transition], [0, 1], clamp) * interpolate(frame, [starts[n + 1], starts[n + 1] + transition], [1, 0], clamp);
	if (opacity <= 0) return null;
	const current = Math.min(n - 1, Math.max(0, s - 1));
	const p = interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: GRID.header + 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, opacity}}>
			{Array.from({length: n}, (_, i) => (
				<div key={i} style={{width: i === current ? 100 : 36, height: 12, borderRadius: 6, background: i < current ? LPI.blue : LPI.sky, overflow: 'hidden'}}>
					{i === current ? <div style={{width: `${p * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} /> : null}
				</div>
			))}
		</div>
	);
};

const MascotSfx: React.FC = () => (
	<>
		{beatMoves(MASCOT).map((m, i) =>
			m.x < -100 || m.x > 1180 ? null : m.via === 'hop' ? (
				<Sfx key={i} name="hop" at={m.at} volume={0.06} />
			) : m.via === 'pop' ? (
				<Sfx key={i} name="pop" at={m.at} volume={0.045} />
			) : null,
		)}
	</>
);

export const FrequenceCardiaque: React.FC<FrequenceCardiaqueProps> = ({voice, sfx}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<TransitionSeries>
				{SCENE_IDS.map((id, i) => {
					const Scene = SCENES[id];
					return (
						<React.Fragment key={id}>
							{id !== 'intro' ? (
								<TransitionSeries.Transition presentation={TRANSITIONS[id].p} timing={linearTiming({durationInFrames: TL.transition})} />
							) : null}
							<TransitionSeries.Sequence durationInFrames={TL.durations[i]}>
								<Scene />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Progress />
			<MascotActor beats={MASCOT} busts="free" />
			{voice ? (
				<Sequence from={TL.offset} layout="none">
					<Html5Audio src={staticFile('voix/frequence-cardiaque/voix.wav')} />
				</Sequence>
			) : null}
			{SCENE_IDS.slice(1).map((id, i) => (
				<Sfx key={id} name={TRANSITIONS[id as Exclude<SceneId, 'intro'>].sfx} at={TL.starts[i + 1]} volume={0.11} />
			))}
			<MascotSfx />
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
