import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {At, clamp, Pop, usePop, Words} from '../../components/motion';
import {Character} from '../../components/med/Character';
import {SoftBackground} from '../../components/med/SoftBackground';
import {Sfx} from '../../components/Sfx';
import {BODY, C, TITLE} from '../../theme';
import {cue, TRANSITION} from './cues';
import {Ring, RING, ringPos} from './Ring';
import {Abbr, CONST} from './shared';

const CHAR_W = 440;

const CenteredCharacter: React.FC<{opacity?: number; scale?: number; y?: number}> = ({
	opacity = 1,
	scale = 1,
	y = 0,
}) => {
	const frame = useCurrentFrame();
	const breath = (Math.sin(frame / 20) + 1) / 2;
	return (
		<div
			style={{
				position: 'absolute',
				left: RING.x - CHAR_W / 2,
				top: RING.y - (CHAR_W * 800) / 600 / 2 + y,
				opacity,
				transform: `scale(${scale})`,
				filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))',
			}}
		>
			<Character width={CHAR_W} breath={breath * 0.6} />
		</div>
	);
};

/* ------------------------------------------------------------------ */
/* INTRO                                                               */
/* ------------------------------------------------------------------ */
export const Intro: React.FC<{duration: number}> = ({duration}) => {
	const frame = useCurrentFrame();
	const appear = usePop(0, 14, 120);
	const tTitle = cue('intro', 'voici');
	const tBadges = cue('intro', '5');
	const tSub = cue('intro', 'absolument');
	const zoomStart = duration - TRANSITION - 20;
	const zoom = interpolate(frame, [zoomStart, duration], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const first = ringPos(0);
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.cyan} />
			<AbsoluteFill style={{transform: `scale(${1 + 0.32 * zoom})`, transformOrigin: `${first.x}px ${first.y}px`}}>
				<At top={238}>
					<Words text={'LES *5* CONSTANTES'} delay={tTitle} stagger={4} size={78} accent={C.cyan} maxWidth={1000} />
				</At>
				<At top={350}>
					<Pop delay={tSub} from="scale">
						<div
							style={{
								fontFamily: BODY,
								fontWeight: 700,
								fontSize: 40,
								color: C.white,
								padding: '12px 30px',
								borderRadius: 999,
								background: 'rgba(255,255,255,0.07)',
								border: `2px solid ${C.cyan}66`,
							}}
						>
							À connaître en <span style={{color: C.cyan, fontWeight: 800}}>IFSI</span>
						</div>
					</Pop>
				</At>
				<div style={{opacity: appear, transform: `translateY(${(1 - appear) * 60}px)`}}>
					<CenteredCharacter />
				</div>
				<Ring appearAt={tBadges} />
			</AbsoluteFill>
			{CONST.map((_, k) => (
				<Sfx key={k} name="pop" at={tBadges + k * 6} volume={0.16} />
			))}
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* CONCLUSION                                                          */
/* ------------------------------------------------------------------ */
const LIST_X = 200;
const listPos = (k: number) => ({x: LIST_X, y: 560 + k * 166});

export const Outro: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tAppear = cue('outro', 'alors');
	const tT = cue('outro', 'température');
	const tFC = cue('outro', 'fréquence');
	const tFR = cue('outro', 'fréquence', 2);
	const tPA = cue('outro', 'pression');
	const tSp = cue('outro', 'saturation');
	const tList = cue('outro', 'oxygène') + 18;
	const toList = spring({frame: frame - tList, fps, config: {damping: 18, stiffness: 110}});
	const charIn = usePop(0, 16, 120);
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.violet} />
			<CenteredCharacter opacity={charIn * (1 - toList)} scale={1 - 0.2 * toList} y={toList * 120} />
			<Ring appearAt={tAppear} stagger={3} highlight={[tT, tFC, tFR, tPA, tSp]} listAt={tList} listPos={listPos} />
			<At top={236}>
				<div style={{opacity: interpolate(toList, [0.3, 1], [0, 1], clamp)}}>
					<Words text={'LES *5* CONSTANTES'} delay={tList + 4} stagger={4} size={92} accent={C.cyan} />
				</div>
			</At>
			{CONST.map((c, k) => {
				const p = listPos(k);
				const s = spring({frame: frame - tList - 10 - k * 5, fps, config: {damping: 16, stiffness: 150}});
				return (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: LIST_X + 90,
							top: p.y - 58,
							opacity: s,
							transform: `translateX(${(1 - s) * 60}px)`,
						}}
					>
						<div style={{fontFamily: TITLE, fontWeight: 900, fontSize: 64, color: c.color, lineHeight: 1.05}}>
							<Abbr i={k} />
						</div>
						<div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, color: C.muted}}>{c.name}</div>
					</div>
				);
			})}
			<At top={1355}>
				<Pop delay={tList + 46} from="scale">
					<div
						style={{
							fontFamily: TITLE,
							fontWeight: 800,
							fontSize: 46,
							color: C.dark,
							background: `linear-gradient(90deg, ${C.cyan}, ${C.blue})`,
							padding: '14px 40px',
							borderRadius: 999,
							boxShadow: `0 0 60px ${C.cyan}55`,
						}}
					>
						À retenir pour l'IFSI
					</div>
				</Pop>
			</At>
			{[tT, tFC, tFR, tPA, tSp].map((t, k) => (
				<Sfx key={k} name="pop" at={t} volume={0.14} />
			))}
			<Sfx name="whoosh" at={tList} volume={0.2} />
			<Sfx name="ding" at={tList + 46} volume={0.22} />
		</AbsoluteFill>
	);
};
