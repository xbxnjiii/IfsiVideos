// v5 « Les 5 constantes » : la vidéo pilote v4 (même tempo, même physique) regénérée avec les nouvelles
// planches de la mascotte (bustes LIBRES, sans cadre) + repères adultes discrets (normes, seuils).
// Les règles de tempo / physique sont documentées dans docs/lpi/charte-video.md (« Tempo et physique »).
import React from 'react';
import {AbsoluteFill, Html5Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionPresentation, TransitionSeries} from '@remotion/transitions';
import {beatMoves, MascotActor} from '../../brand/MascotActor';
import {Burst, LiveBackground, wave} from '../../brand/motion3';
import {runWipe, whip, zoomInto} from '../../brand/motion4';
import {GRID, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Sfx, SfxEnabled, SfxName} from '../../components/Sfx';
import {HOOK_ROW, Hook3, Recap3} from './Bookends5';
import {Cardiaque, Pression, Respiratoire, Saturation, Temperature} from './Lessons5';
import {MASCOT} from './mascot';
import {SCENE_IDS, SceneId, TL} from './timeline';
import '../../brand/theme';

// Pas de musique (ajoutée sur TikTok), pas de sous-titres, pas de filigrane.
export type LpiConstantesV5Props = {voice: boolean; sfx: boolean};

/** Carte de fin : logo principal qui rebondit + éclats. */
const EndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - 6, fps, config: {damping: 11, stiffness: 160, mass: 0.8}});
	return (
		<AbsoluteFill>
			<LiveBackground deco={false} />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 120}}>
				<Img
					src={staticFile('brand/logo/logo-principal.webp')}
					style={{width: 800, height: 'auto', opacity: Math.min(1, s * 1.5), transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * -6}deg)`}}
				/>
			</AbsoluteFill>
			<Burst at={8} x={540} y={840} r={360} n={14} />
		</AbsoluteFill>
	);
};

const SCENES: Record<SceneId, React.FC> = {
	intro: Hook3,
	temp: Temperature,
	fc: Cardiaque,
	fr: Respiratoire,
	pa: Pression,
	spo2: Saturation,
	outro: Recap3,
	end: EndCard,
};

/** Transition VERS chaque scène : jamais deux fois la même d'affilée. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: Record<Exclude<SceneId, 'intro'>, {p: TransitionPresentation<any>; sfx: SfxName}> = {
	// la mascotte plonge dans le picto T° : on plonge avec elle
	temp: {p: zoomInto({x: HOOK_ROW.xs[0], y: HOOK_ROW.y + HOOK_ROW.size / 2}), sfx: 'whoosh'},
	// la mascotte traverse en courant et tire la scène suivante
	fc: {p: runWipe(), sfx: 'run'},
	// panoramique éclair vers le haut (elle s'envole avec)
	fr: {p: whip('up'), sfx: 'whoosh'},
	pa: {p: runWipe(), sfx: 'run'},
	// panoramique éclair vers la gauche
	spo2: {p: whip('left'), sfx: 'whoosh'},
	// vague de marque depuis le titre du récap
	outro: {p: wave({x: 540, y: 330}), sfx: 'whoosh'},
	end: {p: zoomInto({x: 540, y: 840, color: LPI.sky}), sfx: 'whoosh'},
};

/** Progression 1 → 5, centrée en haut, visible pendant les 5 constantes. */
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = TL;
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const opacity =
		interpolate(frame, [starts[1], starts[1] + transition], [0, 1], clamp) *
		interpolate(frame, [starts[6], starts[6] + transition], [1, 0], clamp);
	if (opacity <= 0) return null;
	const current = Math.min(4, Math.max(0, s - 1));
	const p = interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: GRID.header + 20, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10, opacity}}>
			{Array.from({length: 5}, (_, i) => (
				<div
					key={i}
					style={{
						width: i === current ? 110 : 40,
						height: 12,
						borderRadius: 6,
						background: i < current ? LPI.blue : LPI.sky,
						overflow: 'hidden',
					}}
				>
					{i === current ? <div style={{width: `${p * 100}%`, height: '100%', background: LPI.blue, borderRadius: 6}} /> : null}
				</div>
			))}
		</div>
	);
};

/** Petits bruitages de la mascotte (très bas : la voix reste devant). */
const MascotSfx: React.FC = () => (
	<>
		{beatMoves(MASCOT).map((m, i) =>
			m.x < -100 || m.x > 1180 ? null : m.via === 'hop' ? (
				<Sfx key={i} name="hop" at={m.at} volume={0.07} />
			) : m.via === 'pop' ? (
				<Sfx key={i} name="pop" at={m.at} volume={0.05} />
			) : null,
		)}
	</>
);

export const LpiConstantesV5: React.FC<LpiConstantesV5Props> = ({voice, sfx}) => (
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
					<Html5Audio src={staticFile('voix/lpi-constantes-v3/voix.wav')} />
				</Sequence>
			) : null}
			{SCENE_IDS.slice(1).map((id, i) => (
				<Sfx key={id} name={TRANSITIONS[id as Exclude<SceneId, 'intro'>].sfx} at={TL.starts[i + 1]} volume={0.12} />
			))}
			<MascotSfx />
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
