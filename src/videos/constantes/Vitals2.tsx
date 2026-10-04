import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Drop} from '../../components/icons';
import {At, clamp, Pop, usePop} from '../../components/motion';
import {Badge, BodyIcon, HeartIcon, LungsIcon, O2, SpO2} from '../../components/med/MedIcons';
import {SoftBackground} from '../../components/med/SoftBackground';
import {Sfx} from '../../components/Sfx';
import {BODY, C, TITLE} from '../../theme';
import {cue} from './cues';
import {ConstantTitle, Readout, Tag, useOn} from './shared';

const BEAT = 25;

const Arrow: React.FC<{color?: string; size?: number}> = ({color = C.muted, size = 44}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth="10"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M16 50 H80 M58 28 L82 50 L58 72" />
	</svg>
);

const ArteryIcon: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x="6" y="26" width="88" height="48" rx="24" fill={C.violet} />
		<rect x="6" y="38" width="88" height="24" rx="12" fill={C.blood} />
		<ellipse cx="34" cy="50" rx="9" ry="5" fill="#FF5A72" />
		<ellipse cx="64" cy="50" rx="9" ry="5" fill="#FF5A72" />
	</svg>
);

/* ------------------------------------------------------------------ */
/* 4 — PRESSION ARTÉRIELLE                                             */
/* ------------------------------------------------------------------ */
const CELLS = Array.from({length: 18}, (_, i) => ({
	x0: random(`cx${i}`) * 960,
	y: 100 + random(`cy${i}`) * 100,
	r: random(`cr${i}`) * 40 - 20,
}));

const Artery: React.FC<{arrowsAt: number}> = ({arrowsAt}) => {
	const frame = useCurrentFrame();
	const k = frame % BEAT;
	const pulse = Math.exp(-k / 5);
	// distance parcourue = vitesse de base + poussée à chaque systole (intégrale de la pulsation)
	const dist = 5 * frame + 12 * (Math.floor(frame / BEAT) * 5 * (1 - Math.exp(-5)) + 5 * (1 - Math.exp(-k / 5)));
	const arrows = interpolate(frame, [arrowsAt, arrowsAt + 10], [0, 1], clamp);
	const labelOn = interpolate(frame, [arrowsAt, arrowsAt + 8], [0, 1], clamp);
	return (
		<svg width={880} height={300} viewBox="0 0 880 300" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="pa-wall-top" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#7C4DDB" />
					<stop offset="100%" stopColor="#C4A5FF" />
				</linearGradient>
				<linearGradient id="pa-wall-bot" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#C4A5FF" />
					<stop offset="100%" stopColor="#7C4DDB" />
				</linearGradient>
				<linearGradient id="pa-lumen" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#7A0A1E" />
					<stop offset="50%" stopColor="#B3122E" />
					<stop offset="100%" stopColor="#7A0A1E" />
				</linearGradient>
				<clipPath id="pa-clip">
					<rect x="0" y="0" width="880" height="300" rx="40" />
				</clipPath>
			</defs>
			<g clipPath="url(#pa-clip)">
				<rect x="0" y={84 - 6 * pulse} width="880" height={132 + 12 * pulse} fill="url(#pa-lumen)" />
				{CELLS.map((c, i) => {
					const x = ((c.x0 + dist) % 960) - 40;
					return (
						<g key={i} transform={`translate(${x} ${c.y}) rotate(${c.r})`}>
							<ellipse rx="24" ry="12" fill="#E8324F" />
							<ellipse rx="11" ry="4.5" fill="#A8132E" />
						</g>
					);
				})}
				<g transform={`translate(0 ${-6 * pulse})`}>
					<rect x="0" y="30" width="880" height="56" fill="url(#pa-wall-top)" />
					<rect x="0" y="80" width="880" height="6" fill="rgba(255,255,255,0.35)" />
				</g>
				<g transform={`translate(0 ${6 * pulse})`}>
					<rect x="0" y="214" width="880" height="56" fill="url(#pa-wall-bot)" />
					<rect x="0" y="214" width="880" height="6" fill="rgba(255,255,255,0.35)" />
				</g>
				{[130, 330, 530, 730].map((x) => (
					<g
						key={x}
						opacity={arrows * (0.55 + 0.45 * pulse)}
						stroke="white"
						strokeWidth="7"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
					>
						<path
							d={`M${x} 136 V${102 - 8 * pulse} M${x - 14} ${116 - 8 * pulse} L${x} ${100 - 8 * pulse} L${x + 14} ${116 - 8 * pulse}`}
						/>
						<path
							d={`M${x} 164 V${198 + 8 * pulse} M${x - 14} ${184 + 8 * pulse} L${x} ${200 + 8 * pulse} L${x + 14} ${184 + 8 * pulse}`}
						/>
					</g>
				))}
			</g>
			<g opacity={labelOn}>
				<path d="M760 -6 L760 30" stroke={C.violet} strokeWidth="5" strokeLinecap="round" />
				<text x="760" y="-18" textAnchor="middle" fill={C.violet} fontFamily={TITLE} fontWeight={800} fontSize="36">
					paroi
				</text>
			</g>
		</svg>
	);
};

export const Pression: React.FC<{duration: number}> = () => {
	const L = cue('pa', 'quatrième');
	const T = cue('pa', 'pression');
	const M = cue('pa', 'mesure');
	const P2 = cue('pa', 'pression', 2);
	const X = cue('pa', 'exercée');
	const S = cue('pa', 'sang');
	const W = cue('pa', 'paroi');
	const artery = usePop(M - 4, 18, 120);
	const reading = usePop(P2, 14, 160);
	const sys = useOn(X);
	const dia = useOn(S);
	const chain = [
		{at: 6, label: 'Cœur', color: C.red, icon: <HeartIcon size={64} color={C.red} />},
		{at: 16, label: 'Sang', color: C.red, icon: <Drop size={52} />},
		{at: 26, label: 'Artères', color: C.violet, icon: <ArteryIcon size={70} />},
	];
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.violet} />
			<ConstantTitle n={4} title={'PRESSION\n*ARTÉRIELLE*'} color={C.violet} labelAt={L} titleAt={T} />
			<At top={520}>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					{chain.map((c, i) => (
						<React.Fragment key={c.label}>
							{i > 0 ? (
								<Pop delay={c.at - 4} from="left" distance={30}>
									<Arrow />
								</Pop>
							) : null}
							<Pop delay={c.at} from="scale">
								<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
									<Badge color={c.color} size={104}>
										{c.icon}
									</Badge>
									<div style={{fontFamily: BODY, fontWeight: 800, fontSize: 32, color: C.white}}>{c.label}</div>
								</div>
							</Pop>
						</React.Fragment>
					))}
				</div>
			</At>
			<At top={700}>
				<div style={{opacity: artery, transform: `scaleX(${0.7 + 0.3 * artery})`}}>
					<Artery arrowsAt={W} />
				</div>
			</At>
			<At top={1030}>
				<div style={{opacity: reading, transform: `scale(${0.7 + 0.3 * reading})`}}>
					<Readout
						value={
							<>
								<span style={{color: sys > 0.5 ? C.violet : C.white}}>120</span>
								<span style={{color: C.muted}}> / </span>
								<span style={{color: dia > 0.5 ? '#C4A5FF' : C.white}}>80</span>
							</>
						}
						unit="mmHg"
						color={C.violet}
						size={128}
					/>
				</div>
			</At>
			<At top={1196}>
				<div style={{display: 'flex', gap: 22}}>
					<Pop delay={X} from="scale">
						<Tag color={C.violet} on={sys} size={34}>
							120 = systolique
						</Tag>
					</Pop>
					<Pop delay={S} from="scale">
						<Tag color="#C4A5FF" on={dia} size={34}>
							80 = diastolique
						</Tag>
					</Pop>
				</div>
			</At>
			{chain.map((c) => (
				<Sfx key={c.label} name="pop" at={c.at} volume={0.13} />
			))}
			<Sfx name="whoosh" at={M - 4} volume={0.14} />
			<Sfx name="pop" at={P2} volume={0.15} />
			<Sfx name="tick" at={W} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* 5 — SATURATION (SpO2)                                               */
/* ------------------------------------------------------------------ */
const Oximeter: React.FC<{on: number; value: number}> = ({on, value}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const finger = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 90}});
	const clip = spring({frame: frame - 30, fps, config: {damping: 12, stiffness: 160}});
	const beat = Math.exp(-(frame % BEAT) / 4);
	return (
		<svg width={880} height={320} viewBox="0 0 880 320" style={{overflow: 'visible'}}>
			<defs>
				<linearGradient id="sp-finger" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#F6CDB2" />
					<stop offset="100%" stopColor="#DE9F82" />
				</linearGradient>
			</defs>
			<g transform={`translate(${(1 - finger) * -600} 0)`}>
				<rect x="-80" y="118" width="680" height="124" rx="62" fill="url(#sp-finger)" />
				<path
					d="M200 128 Q190 180 200 232 M320 128 Q310 180 320 232"
					stroke="#D08C70"
					strokeWidth="5"
					fill="none"
					strokeLinecap="round"
				/>
				<rect x="500" y="130" width="84" height="56" rx="24" fill="#FBE3D6" />
				<rect x="512" y="138" width="40" height="10" rx="5" fill="rgba(255,255,255,0.7)" />
				<ellipse
					cx="520"
					cy="180"
					rx="80"
					ry="40"
					fill="#FF2E4D"
					opacity={0.45 * on * (0.6 + 0.4 * beat)}
					style={{filter: 'blur(10px)'}}
				/>
			</g>
			<g transform={`translate(0 ${(1 - clip) * -260})`} opacity={Math.min(1, clip * 2)}>
				<rect
					x="360"
					y="14"
					width="380"
					height="130"
					rx="50"
					fill="#1C2541"
					stroke="rgba(255,255,255,0.18)"
					strokeWidth="3"
				/>
				<rect x="392" y="34" width="316" height="92" rx="18" fill="#04060E" />
				<text x="412" y="70" fill={C.blue} fontFamily={BODY} fontWeight={800} fontSize="26" opacity={on}>
					SpO
					<tspan fontSize="17" dy="6">
						2
					</tspan>
				</text>
				<text x="500" y="112" fill={C.white} fontFamily={TITLE} fontWeight={900} fontSize="72" opacity={on}>
					{Math.round(value)}
					<tspan fontSize="34" fill={C.blue}>
						{' '}
						%
					</tspan>
				</text>
				<path
					d="M0 6 C-11 -3 -7 -13 0 -8 C7 -13 11 -3 0 6 Z"
					transform={`translate(668 64) scale(${1.6 + 0.5 * beat})`}
					fill={C.red}
					opacity={on}
				/>
				{[0, 1, 2, 3, 4].map((i) => (
					<rect
						key={i}
						x={414 + i * 14}
						y={104 - 18 * Math.max(0.15, Math.exp(-(((frame - i * 3) % BEAT) / 5)))}
						width="8"
						height={18 * Math.max(0.15, Math.exp(-(((frame - i * 3) % BEAT) / 5)))}
						rx="3"
						fill={C.green}
						opacity={on}
					/>
				))}
			</g>
			<g transform={`translate(0 ${(1 - clip) * 200})`} opacity={Math.min(1, clip * 2)}>
				<rect x="360" y="216" width="380" height="84" rx="42" fill="#2A3560" />
				<rect x="700" y="96" width="50" height="170" rx="25" fill="#1C2541" />
			</g>
		</svg>
	);
};

const NODES = [80, 313, 547, 780];
const NODE_Y = 100;

const RbcIcon: React.FC<{size?: number; o2?: number}> = ({size = 70, o2 = 0}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
			<ellipse rx="38" ry="26" fill="#E8324F" />
			<ellipse rx="18" ry="9" fill="#A8132E" />
			{[0, 1, 2, 3].map((i) => {
				const a = frame / 10 + (i * Math.PI) / 2;
				return <circle key={i} cx={Math.cos(a) * 44} cy={Math.sin(a) * 30} r={9} fill="#7FDBFF" opacity={o2} />;
			})}
		</svg>
	);
};

const Flow: React.FC<{at: number; hbAt: number; moveAt: number}> = ({at, hbAt, moveAt}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const line = interpolate(frame, [at, at + 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const o2 = interpolate(frame, [hbAt, hbAt + 10], [0, 1], clamp);
	const move = frame >= moveAt;
	const nodes = [
		{label: 'Poumons', color: C.cyan, icon: <LungsIcon size={70} color={C.cyan} />},
		{label: 'Globules\nrouges', color: C.red, icon: <RbcIcon size={70} o2={o2} />},
		{label: 'Cœur', color: C.red, icon: <HeartIcon size={66} color={C.red} />},
		{label: 'Corps', color: C.white, icon: <BodyIcon size={70} color={C.white} />},
	];
	// un globule arrive au « corps » toutes les 20 frames une fois le flux établi
	const bodyGlow = move && frame > moveAt + 50 ? 0.35 + 0.65 * Math.exp(-((frame - moveAt) % 20) / 6) : 0;
	return (
		<div style={{position: 'relative', width: 880, height: 300}}>
			<svg width={880} height={300} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<clipPath id="spo2-flow-line">
						<rect x={NODES[0]} y={NODE_Y - 10} width={line * (NODES[3] - NODES[0])} height={20} />
					</clipPath>
				</defs>
				<path
					d={`M${NODES[0]} ${NODE_Y} H${NODES[3]}`}
					stroke="rgba(255,255,255,0.25)"
					strokeWidth="6"
					strokeDasharray="14 14"
					strokeLinecap="round"
					clipPath="url(#spo2-flow-line)"
				/>
				{/* O2 : poumons -> globules rouges */}
				{frame >= at + 10
					? Array.from({length: 6}, (_, i) => {
							const u = ((frame - at - 10) / 30 + i / 6) % 1;
							const x = NODES[0] + u * (NODES[1] - NODES[0]);
							return (
								<circle
									key={i}
									cx={x}
									cy={NODE_Y + Math.sin(u * Math.PI * 2) * 14}
									r={9}
									fill="#7FDBFF"
									opacity={Math.sin(u * Math.PI)}
								/>
							);
						})
					: null}
				{/* globules chargés d'O2 : -> cœur -> corps */}
				{move
					? Array.from({length: 4}, (_, i) => {
							const u = ((frame - moveAt) / 80 + i / 4) % 1;
							const x = NODES[1] + u * (NODES[3] - NODES[1]);
							return (
								<g key={i} transform={`translate(${x} ${NODE_Y})`} opacity={Math.sin(u * Math.PI)}>
									<ellipse rx="22" ry="14" fill="#FF4D66" />
									<circle cx="-14" cy="-14" r="7" fill="#7FDBFF" />
									<circle cx="14" cy="-14" r="7" fill="#7FDBFF" />
								</g>
							);
						})
					: null}
			</svg>
			{nodes.map((n, i) => {
				const s = spring({frame: frame - at - i * 6, fps, config: {damping: 14, stiffness: 160}});
				const glow = i === 1 ? o2 : i === 3 ? bodyGlow : 0;
				return (
					<div
						key={n.label}
						style={{
							position: 'absolute',
							left: NODES[i] - 70,
							top: NODE_Y - 70,
							width: 140,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transform: `scale(${s})`,
							opacity: Math.min(1, s * 2),
						}}
					>
						<Badge color={n.color} size={140} glow={glow}>
							{n.icon}
						</Badge>
						<div
							style={{
								marginTop: 12,
								fontFamily: BODY,
								fontWeight: 800,
								fontSize: 28,
								color: C.white,
								textAlign: 'center',
								lineHeight: 1.15,
								whiteSpace: 'pre-line',
							}}
						>
							{n.label}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Saturation: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const L = cue('spo2', 'et');
	const T = cue('spo2', 'saturation');
	const S = cue('spo2', 'spo2');
	const E = cue('spo2', 'elle');
	const P = cue('spo2', 'pourcentage');
	const H = cue('spo2', "d'hémoglobine");
	const M = cue('spo2', 'transporte');
	const on = interpolate(frame, [T - 4, T + 4], [0, 1], clamp);
	const value = interpolate(frame, [T, T + 30], [60, 98], {...clamp, easing: Easing.out(Easing.cubic)});
	const big = usePop(S, 14, 170);
	const device = usePop(6, 18, 120);
	const pct = frame >= P ? 1 + 0.08 * Math.exp(-(frame - P) / 8) : 1;
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.blue} />
			<ConstantTitle
				n={5}
				title={'SATURATION\nEN *OXYGÈNE*'}
				color={C.blue}
				labelAt={L}
				titleAt={T}
				size={88}
				out={S - 6}
			/>
			<At top={250}>
				<div
					style={{
						opacity: big,
						transform: `scale(${0.6 + 0.4 * big})`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<div
						style={{
							fontFamily: TITLE,
							fontWeight: 900,
							fontSize: 170,
							lineHeight: 1,
							color: C.blue,
							textShadow: `0 0 60px ${C.blue}66`,
						}}
					>
						<SpO2 />
					</div>
					<div style={{fontFamily: BODY, fontWeight: 700, fontSize: 40, color: C.muted, marginTop: 6}}>
						Saturation en oxygène
					</div>
				</div>
			</At>
			<At top={520}>
				<div style={{opacity: device, transform: `scale(${pct})`}}>
					<Oximeter on={on} value={value} />
				</div>
			</At>
			<At top={890}>
				<Flow at={Math.min(E, S + 12)} hbAt={H} moveAt={M} />
			</At>
			<At top={1238}>
				<Pop delay={P} from="scale">
					<Tag color={C.blue} on={useOn(H)} size={34}>
						98 % de l'hémoglobine transporte de l'
						<O2 />
					</Tag>
				</Pop>
			</At>
			<Sfx name="pop" at={30} volume={0.12} />
			<Sfx name="tick" at={T} volume={0.2} />
			<Sfx name="pop" at={S} volume={0.16} />
			<Sfx name="whoosh" at={E} volume={0.14} />
			<Sfx name="pop" at={P} volume={0.13} />
		</AbsoluteFill>
	);
};
