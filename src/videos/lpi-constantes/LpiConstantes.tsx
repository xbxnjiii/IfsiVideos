import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {EndCard} from '../../brand/EndCard';
import {Captions, circleReveal} from '../../brand/motion';
import {LPI} from '../../brand/theme';
import {clamp, Progress, Watermark} from '../../brand/ui';
import {Sfx, SfxEnabled} from '../../components/Sfx';
import {Cardiaque, INTRO_BADGES, Intro, Respiratoire, Temperature} from './Scenes1';
import {Conclusion, Pression, Saturation} from './Scenes2';
import {SCENE_IDS, SceneId, TL} from './timeline';
import '../../brand/theme';

export type LpiConstantesProps = {voice: boolean; music: boolean; sfx: boolean; captions: boolean};

const SCENES: Record<SceneId, React.FC> = {
	intro: Intro,
	temp: Temperature,
	fc: Cardiaque,
	fr: Respiratoire,
	pa: Pression,
	spo2: Saturation,
	outro: Conclusion,
	end: EndCard,
};

/** Point de départ du cercle de transition vers chaque scène (élément clé de la scène suivante). */
const ORIGINS: Record<SceneId, {x: number; y: number}> = {
	intro: {x: 540, y: 960},
	temp: {x: INTRO_BADGES.xs[0], y: INTRO_BADGES.y},
	fc: {x: 290, y: 760},
	fr: {x: 540, y: 880},
	pa: {x: 540, y: 865},
	spo2: {x: 640, y: 700},
	outro: {x: 360, y: 650},
	end: {x: 540, y: 900},
};

const Chrome: React.FC = () => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = TL;
	const endStart = starts[starts.length - 1];
	const wm = interpolate(frame, [endStart, endStart + transition], [1, 0], clamp);
	// constante en cours (scènes 1 à 5)
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const showProgress = s >= 1 && s <= 5;
	const p = showProgress ? interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp) : 0;
	const progressOpacity =
		interpolate(frame, [starts[1], starts[1] + transition], [0, 1], clamp) *
		interpolate(frame, [starts[6], starts[6] + transition], [1, 0], clamp);
	return (
		<>
			{wm > 0 ? <Watermark opacity={wm} /> : null}
			{progressOpacity > 0 ? (
				<Progress count={5} current={Math.min(4, Math.max(0, s - 1))} progress={p} opacity={progressOpacity} />
			) : null}
		</>
	);
};

export const LpiConstantes: React.FC<LpiConstantesProps> = ({voice, music, sfx, captions}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: LPI.paper}}>
			<TransitionSeries>
				{SCENE_IDS.map((id, i) => {
					const Scene = SCENES[id];
					return (
						<React.Fragment key={id}>
							{i > 0 ? (
								<TransitionSeries.Transition
									presentation={circleReveal(ORIGINS[id])}
									timing={linearTiming({durationInFrames: TL.transition})}
								/>
							) : null}
							<TransitionSeries.Sequence durationInFrames={TL.durations[i]}>
								<Scene />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Chrome />
			{captions ? (
				<Captions words={TL.words} offsetFrames={TL.offset - TL.lead} hideAfter={TL.starts[TL.starts.length - 1]} />
			) : null}
			{voice ? (
				<Sequence from={TL.offset} layout="none">
					<Html5Audio src={staticFile('voix/lpi-constantes/voix.wav')} />
				</Sequence>
			) : null}
			{music ? <Html5Audio src={staticFile('music/lpi-constantes.mp3')} volume={0.85} /> : null}
			{TL.starts.slice(1).map((s) => (
				<Sfx key={s} name="whoosh" at={s} volume={0.09} />
			))}
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
