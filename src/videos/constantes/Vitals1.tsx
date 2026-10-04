import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {At, clamp, Pop, usePop} from '../../components/motion';
import {Character} from '../../components/med/Character';
import {FlameIcon, fr1, SnowIcon, thermoColor, Thermometer, Viewport} from '../../components/med/MedIcons';
import {SoftBackground} from '../../components/med/SoftBackground';
import {Sfx} from '../../components/Sfx';
import {BODY, C, TITLE} from '../../theme';
import {cue} from './cues';
import {ConstantTitle, Readout, Tag, useOn} from './shared';

/* ------------------------------------------------------------------ */
/* 1 — TEMPÉRATURE                                                     */
/* ------------------------------------------------------------------ */
export const Temperature: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const L = cue('temp', 'première');
	const T = cue('temp', 'température');
	const E = cue('temp', "l'état");
	const H = cue('temp', 'hyperthermie');
	const A = cue('temp', 'alors');
	const Y = cue('temp', 'hypothermie');
	const ease = Easing.inOut(Easing.cubic);
	const value = interpolate(frame, [12, 40, H - 8, H + 18, A, Y + 4], [34.2, 36.7, 36.7, 39.2, 39.2, 35.0], {
		...clamp,
		easing: ease,
	});
	const hot = interpolate(value, [37.6, 39.0], [0, 1], clamp);
	const cold = interpolate(value, [35.2, 36.3], [1, 0], clamp);
	const color = thermoColor(value);
	const view = usePop(6, 18, 120);
	const status = hot > 0.5 ? 'hot' : cold > 0.5 ? 'cold' : 'none';
	const statusPop = usePop(status === 'hot' ? H + 10 : Y, 12, 180);
	const snow = Array.from({length: 10}, (_, i) => {
		const x = 40 + ((i * 97) % 600);
		const y = ((frame * (2 + (i % 3)) + i * 70) % 680) - 40;
		return <circle key={i} cx={x} cy={y} r={5 + (i % 3) * 2} fill="#CFE9FF" opacity={0.75 * cold} />;
	});
	return (
		<AbsoluteFill>
			<SoftBackground accent={color} />
			<ConstantTitle n={1} title="*TEMPÉRATURE*" color={C.orange} labelAt={L} titleAt={T} size={100} />
			<At top={460}>
				<div style={{opacity: view, transform: `translateY(${(1 - view) * 80}px) scale(${0.94 + 0.06 * view})`}}>
					<Viewport height={640} color={color}>
						<div style={{position: 'absolute', left: -70, top: -96}}>
							<Character width={760} hot={hot} cold={cold} />
						</div>
						<svg width={880} height={640} style={{position: 'absolute', inset: 0}}>
							{snow}
						</svg>
						<div style={{position: 'absolute', right: 40, top: 36}}>
							<Thermometer value={value} height={560} />
						</div>
						{hot > 0.05 ? (
							<div
								style={{
									position: 'absolute',
									left: 520,
									top: 40 + Math.sin(frame / 6) * 8,
									opacity: hot,
									transform: `scale(${0.6 + 0.4 * hot})`,
								}}
							>
								<FlameIcon size={110} />
							</div>
						) : null}
					</Viewport>
				</div>
			</At>
			<At top={1128}>
				<div style={{display: 'flex', alignItems: 'center', gap: 30, opacity: view}}>
					<Readout value={`${fr1(value)}`} unit="°C" color={color} size={124} />
					{status !== 'none' ? (
						<div
							style={{
								transform: `scale(${statusPop})`,
								opacity: statusPop,
								display: 'flex',
								alignItems: 'center',
								gap: 12,
							}}
						>
							{status === 'hot' ? <FlameIcon size={70} /> : <SnowIcon size={70} />}
							<div
								style={{
									fontFamily: TITLE,
									fontWeight: 900,
									fontSize: 44,
									color: status === 'hot' ? '#FF6B35' : '#8FD3FF',
								}}
							>
								{status === 'hot' ? 'Fièvre' : 'Hypothermie'}
							</div>
						</div>
					) : null}
				</div>
			</At>
			<At top={1280}>
				<Pop delay={E} from="scale">
					<Tag color={C.orange} on={useOn(E)} size={36}>
						État thermique
					</Tag>
				</Pop>
			</At>
			<Sfx name="pop" at={E} volume={0.14} />
			<Sfx name="whoosh" at={H - 8} volume={0.12} />
			<Sfx name="whoosh" at={A} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* 2 — FRÉQUENCE CARDIAQUE                                             */
/* ------------------------------------------------------------------ */
const BEAT = 25; // 72 bpm à 30 fps
const BEAT_START = 6;

const beatPulse = (frame: number) => {
	if (frame < BEAT_START) return 0;
	return Math.exp(-((frame - BEAT_START) % BEAT) / 4);
};

/** Tracé symbolique (bosses arrondies), volontairement non réaliste. */
const PulseLine: React.FC<{color: string; width: number; y: number}> = ({color, width, y}) => {
	const frame = useCurrentFrame();
	const spacing = 220;
	const speed = spacing / BEAT;
	const shift = (frame - BEAT_START) * speed;
	const pts = Array.from({length: Math.ceil(width / 6) + 1}, (_, i) => {
		const x = i * 6;
		const local = ((((x + shift - width / 2) % spacing) + spacing) % spacing) - spacing / 2;
		const bump = -70 * Math.exp(-((local / 16) ** 2)) + 18 * Math.exp(-(((local - 30) / 14) ** 2));
		return `${x},${y + bump}`;
	}).join(' ');
	return (
		<polyline
			points={pts}
			fill="none"
			stroke={color}
			strokeWidth={6}
			strokeLinecap="round"
			strokeLinejoin="round"
			opacity={0.35}
		/>
	);
};

export const Cardiaque: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const L = cue('fc', 'deuxième');
	const T = cue('fc', 'fréquence');
	const N = cue('fc', 'nombre');
	const B = cue('fc', 'battements');
	const beat = beatPulse(frame);
	const zoom = interpolate(frame, [0, 34], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const scale = interpolate(zoom, [0, 1], [0.95, 1.25]);
	const top = interpolate(zoom, [0, 1], [-170, -520]);
	const left = 430 - 300 * scale;
	const xray = interpolate(frame, [18, 38], [0, 1], clamp);
	const view = usePop(4, 18, 120);
	const counter = usePop(N, 14, 170);
	const beatsSince = frame < N ? 0 : Math.floor((frame - BEAT_START) / BEAT) - Math.floor((N - BEAT_START) / BEAT);
	const bpm = Math.min(72, 70 + Math.max(0, beatsSince));
	const boum = (k: number) => {
		const f = frame - (BEAT_START + BEAT * (k + 1));
		return f < 0 || f > 18 ? 0 : 1 - f / 18;
	};
	const beats = Array.from({length: 9}, (_, k) => BEAT_START + BEAT * k).filter((f) => f > 0);
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.red} />
			<ConstantTitle n={2} title={'FRÉQUENCE\n*CARDIAQUE*'} color={C.red} labelAt={L} titleAt={T} />
			<At top={530}>
				<div style={{opacity: view, transform: `translateY(${(1 - view) * 80}px)`}}>
					<Viewport height={560} color={C.red}>
						<svg width={880} height={560} style={{position: 'absolute', inset: 0}}>
							<PulseLine color={C.red} width={880} y={300} />
						</svg>
						<div style={{position: 'absolute', left, top}}>
							<Character width={600 * scale} xray={xray} showHeart beat={beat} />
						</div>
						{[0, 1, 2].map((k) => (
							<div
								key={k}
								style={{
									position: 'absolute',
									left: 600 + k * 30,
									top: 120 + k * 70,
									fontFamily: TITLE,
									fontWeight: 900,
									fontSize: 54,
									color: C.red,
									opacity: boum(k),
									transform: `scale(${1 + 0.4 * (1 - boum(k))})`,
									letterSpacing: '0.05em',
								}}
							>
								BOUM
							</div>
						))}
					</Viewport>
				</div>
			</At>
			<At top={1124}>
				<div style={{display: 'flex', alignItems: 'center', gap: 36}}>
					<div style={{opacity: counter, transform: `scale(${(0.6 + 0.4 * counter) * (1 + 0.05 * beat)})`}}>
						<Readout value={bpm} unit="bpm" color={C.red} size={132} />
					</div>
					<Pop delay={B} from="scale">
						<Tag color={C.red} on={useOn(B)} size={36}>
							Battements / minute
						</Tag>
					</Pop>
				</div>
			</At>
			{beats.map((f) => (
				<Sfx key={f} name="heartbeat" at={f} volume={0.22} />
			))}
			<Sfx name="pop" at={N} volume={0.14} />
		</AbsoluteFill>
	);
};

/* ------------------------------------------------------------------ */
/* 3 — FRÉQUENCE RESPIRATOIRE                                          */
/* ------------------------------------------------------------------ */
const BREATH = 84;
const BREATH_START = 10;

// trajet de l'air dans la fenêtre (personnage à l'échelle 0.95, décalé de 145 / -266)
const sx = 0.95;
const ox = 145;
const oy = -266;
const P = (x: number, y: number) => ({x: ox + x * sx, y: oy + y * sx});
const MOUTH = P(300, 404);
const TRACHEA = P(300, 560);
const FORK = P(300, 600);
const LUNG_L = P(228, 690);
const LUNG_R = P(372, 690);

const along = (pts: {x: number; y: number}[], u: number) => {
	const seg = pts.length - 1;
	const t = Math.min(0.9999, Math.max(0, u)) * seg;
	const i = Math.floor(t);
	const f = t - i;
	return {x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, y: pts[i].y + (pts[i + 1].y - pts[i].y) * f};
};

const AirParticles: React.FC<{phase: number; inspiring: boolean; q: number}> = ({inspiring, q}) => {
	const N = 14;
	return (
		<svg width={880} height={560} style={{position: 'absolute', inset: 0}}>
			{Array.from({length: N}, (_, i) => {
				const side = i % 2 === 0 ? LUNG_L : LUNG_R;
				const start = {x: MOUTH.x + ((i % 5) - 2) * 26, y: MOUTH.y - 120 - (i % 3) * 20};
				const path = [start, MOUTH, TRACHEA, FORK, side];
				const o = i / N;
				const u = Math.min(1, Math.max(0, q * 1.5 - o * 0.5));
				const pos = along(path, inspiring ? u : 1 - u);
				const visible = u > 0 && u < 1 ? 1 : 0;
				return (
					<circle
						key={i}
						cx={pos.x}
						cy={pos.y}
						r={9}
						fill={inspiring ? '#7FDBFF' : '#C9D3E8'}
						opacity={0.9 * visible}
						style={{filter: `drop-shadow(0 0 8px ${inspiring ? '#2EE6D6' : '#FFFFFF'})`}}
					/>
				);
			})}
		</svg>
	);
};

export const Respiratoire: React.FC<{duration: number}> = () => {
	const frame = useCurrentFrame();
	const L = cue('fr', 'troisième');
	const T = cue('fr', 'fréquence');
	const N = cue('fr', 'nombre');
	const R = cue('fr', 'respirations');
	const local = Math.max(0, frame - BREATH_START);
	const phase = (local % BREATH) / BREATH;
	const breath = frame < BREATH_START ? 0 : 0.5 - 0.5 * Math.cos(phase * Math.PI * 2);
	const inspiring = phase < 0.5;
	const q = inspiring ? phase / 0.5 : (phase - 0.5) / 0.5;
	const xray = interpolate(frame, [12, 32], [0, 1], clamp);
	const view = usePop(4, 18, 120);
	const counter = usePop(N, 14, 170);
	return (
		<AbsoluteFill>
			<SoftBackground accent={C.cyan} />
			<ConstantTitle n={3} title={'FRÉQUENCE\n*RESPIRATOIRE*'} color={C.cyan} labelAt={L} titleAt={T} size={86} />
			<At top={530}>
				<div style={{opacity: view, transform: `translateY(${(1 - view) * 80}px)`}}>
					<Viewport height={560} color={C.cyan}>
						<div style={{position: 'absolute', left: ox, top: oy}}>
							<Character width={600 * sx} xray={xray} showLungs breath={breath} />
						</div>
						{frame >= BREATH_START ? <AirParticles phase={phase} inspiring={inspiring} q={q} /> : null}
						<div style={{position: 'absolute', left: 36, top: 30, display: 'flex', flexDirection: 'column', gap: 12}}>
							{['Inspiration', 'Expiration'].map((label, i) => {
								const active = frame >= BREATH_START && (i === 0) === inspiring;
								return (
									<div
										key={label}
										style={{
											fontFamily: BODY,
											fontWeight: 800,
											fontSize: 32,
											color: active ? C.dark : C.muted,
											background: active ? C.cyan : 'rgba(255,255,255,0.06)',
											padding: '8px 22px',
											borderRadius: 999,
											transition: 'none',
										}}
									>
										{label}
									</div>
								);
							})}
						</div>
					</Viewport>
				</div>
			</At>
			<At top={1124}>
				<div style={{display: 'flex', alignItems: 'center', gap: 36}}>
					<div style={{opacity: counter, transform: `scale(${0.6 + 0.4 * counter})`}}>
						<Readout value={16} unit="/ min" color={C.cyan} size={132} />
					</div>
					<Pop delay={R} from="scale">
						<Tag color={C.cyan} on={useOn(R)} size={36}>
							Respirations / minute
						</Tag>
					</Pop>
				</div>
			</At>
			<Sfx name="pop" at={N} volume={0.14} />
		</AbsoluteFill>
	);
};
