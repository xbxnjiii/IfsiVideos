import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {Grain} from '../../components/Background';
import {Captions} from '../../components/med/Captions';
import {softZoom} from '../../components/med/softZoom';
import {clamp} from '../../components/motion';
import {Sfx, SfxEnabled} from '../../components/Sfx';
import {C} from '../../theme';
import {CUE_LEAD, DURATIONS, FPS, SCENES, SceneId, STARTS, TRANSITION, VOICE_OFFSET, WORDS} from './cues';
import {Intro, Outro} from './IntroOutro';
import {CONST} from './shared';
import {Cardiaque, Respiratoire, Temperature} from './Vitals1';
import {Pression, Saturation} from './Vitals2';

export type ConstantesProps = {
	voice: boolean;
	music: boolean;
	sfx: boolean;
	captions: boolean;
};

const COMPONENTS: Record<SceneId, React.FC<{duration: number}>> = {
	intro: Intro,
	temp: Temperature,
	fc: Cardiaque,
	fr: Respiratoire,
	pa: Pression,
	spo2: Saturation,
	outro: Outro,
};

const ACCENT_BY_SCENE = [C.cyan, ...CONST.map((c) => c.color), C.cyan];

const accentAt = (sec: number) => {
	const f = sec * FPS;
	let i = 0;
	while (i < STARTS.length - 1 && f >= STARTS[i + 1] + TRANSITION / 2) i++;
	return ACCENT_BY_SCENE[i];
};

/** 5 segments en haut : un par constante. */
const Progress: React.FC = () => {
	const frame = useCurrentFrame();
	const first = STARTS[1];
	const outro = STARTS[SCENES.length - 1];
	const opacity =
		interpolate(frame, [first, first + 10], [0, 1], clamp) * interpolate(frame, [outro, outro + 10], [1, 0], clamp);
	if (opacity <= 0) return null;
	return (
		<div style={{position: 'absolute', top: 196, left: 150, right: 150, display: 'flex', gap: 12, opacity}}>
			{CONST.map((c, i) => {
				const s = i + 1;
				const p = interpolate(frame, [STARTS[s], STARTS[s] + DURATIONS[s] - TRANSITION], [0, 1], clamp);
				return (
					<div
						key={c.abbr}
						style={{flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.14)', overflow: 'hidden'}}
					>
						<div
							style={{width: `${p * 100}%`, height: '100%', background: c.color, boxShadow: `0 0 14px ${c.color}`}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export const Constantes: React.FC<ConstantesProps> = ({voice, music, sfx, captions}) => (
	<SfxEnabled.Provider value={sfx}>
		<AbsoluteFill style={{backgroundColor: '#060A1A'}}>
			<TransitionSeries>
				{SCENES.map((id, i) => {
					const Scene = COMPONENTS[id];
					return (
						<React.Fragment key={id}>
							{i > 0 ? (
								<TransitionSeries.Transition
									presentation={softZoom()}
									timing={linearTiming({durationInFrames: TRANSITION})}
								/>
							) : null}
							<TransitionSeries.Sequence durationInFrames={DURATIONS[i]}>
								<Scene duration={DURATIONS[i]} />
							</TransitionSeries.Sequence>
						</React.Fragment>
					);
				})}
			</TransitionSeries>
			<Progress />
			{captions ? <Captions words={WORDS} offsetFrames={VOICE_OFFSET - CUE_LEAD} accentAt={accentAt} /> : null}
			<Grain opacity={0.05} />
			{voice ? (
				<Sequence from={VOICE_OFFSET} layout="none">
					<Html5Audio src={staticFile('voix/constantes/voix.wav')} />
				</Sequence>
			) : null}
			{music ? <Html5Audio src={staticFile('music/constantes.mp3')} volume={0.9} /> : null}
			{STARTS.slice(1).map((s) => (
				<Sfx key={s} name="whoosh" at={s} volume={0.13} />
			))}
		</AbsoluteFill>
	</SfxEnabled.Provider>
);
