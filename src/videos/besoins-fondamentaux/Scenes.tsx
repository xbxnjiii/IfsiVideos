// Scènes de la vidéo « Les 14 besoins fondamentaux » : accroche, escalier des 3 étapes, gabarit d'un
// besoin (numéro qui s'écrase, titre, illustration vivante, gags, puces cochées) et récap final.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckChip, GroupProgress, Stamp, Sticker, Strike, TypingBubble, usePop} from '../../brand/kit';
import {Burst, Camera, ChapterSlam, Confetti, LiveBackground, Stage} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Kicker, Title} from '../../brand/ui';
import {NEEDS, NeedTitle, STAGES, stageOf} from './data';
import {HeartBeat, Mini, NEED_ICONS} from './icons';
import {at, SCENE_IDS, SceneId, TL} from './timeline';

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const LAY = {
	badge: {x: 136, y: 318, d: 128},
	titleX: 240,
	tileY: 500,
	tileH: 500,
	chipsY: 1036,
	/** centre de la zone des gags (moitié droite du socle) */
	gag: {x: 770, y: 740},
};

/* ───────────────────────── titre d'une notion ───────────────────────── */

const fitKey = (key: string) => Math.min(100, 740 / (key.length * 0.56));

export const NeedTitleBlock: React.FC<{t: NeedTitle; at: number; y?: number}> = ({t, at: t0, y}) => {
	const top = y ?? (t.pre ? 236 : 262);
	const key = t.key
		.split(' ')
		.map((w) => `*${w}*`)
		.join(' ');
	return (
		<div style={{position: 'absolute', left: LAY.titleX, top, width: 1008 - LAY.titleX}}>
			{t.pre ? <Title at={t0} text={t.pre} size={52} stagger={2} brush={false} /> : null}
			<Title at={t0 + (t.pre ? 4 : 0)} text={key} size={fitKey(t.key)} stagger={2} />
			{t.sub ? (
				<div style={{marginTop: 4}}>
					<Title at={t0 + 10} text={t.sub} size={36} stagger={2} brush={false} color={alpha(LPI.navy, 0.7)} />
				</div>
			) : null}
		</div>
	);
};

/* ───────────────────────── gabarit d'un besoin ───────────────────────── */

export type ChipDef = {at: number; label: React.ReactNode; sub?: React.ReactNode};

export const NeedScene: React.FC<{
	n: number;
	numberAt: number;
	titleAt: number;
	icon: React.ReactNode;
	/** l'illustration glisse à gauche pour laisser la place aux gags */
	shiftAt?: number;
	chips?: ChipDef[];
	gags?: React.ReactNode;
	overlay?: React.ReactNode;
	punches?: number[];
	shakes?: number[];
	layers?: {color: string; level: number}[];
	bumps?: number[];
	sfx?: React.ReactNode;
}> = ({n, numberAt, titleAt, icon, shiftAt, chips = [], gags, overlay, punches = [], shakes = [], layers, bumps = [], sfx}) => {
	const frame = useCurrentFrame();
	const st = stageOf(n);
	const need = NEEDS[n - 1];
	const tA = Math.max(titleAt, numberAt + 18);
	const iconPop = usePop(tA + 2);
	const shift = shiftAt !== undefined ? interpolate(frame, [shiftAt, shiftAt + 12], [0, 1], {...clamp, easing: ease}) : 0;
	const iconX = interpolate(shift, [0, 1], [468, 250]);
	const tag = usePop(numberAt + 20);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[numberAt + 2, tA + 6, ...chips.map((c) => c.at + 1), ...punches]} shakes={[numberAt + 3, ...shakes]}>
				<Stage y={LAY.tileY} h={LAY.tileH} at={numberAt + 16} layers={layers} bumps={[...chips.map((c) => c.at + 2), ...bumps]}>
					<div
						style={{
							position: 'absolute',
							right: 26,
							top: 22,
							padding: '8px 20px',
							borderRadius: 999,
							background: st.color,
							color: st.ink,
							fontFamily: FONT.body,
							fontWeight: 800,
							fontSize: 24,
							letterSpacing: '0.12em',
							textTransform: 'uppercase',
							opacity: Math.min(1, tag * 1.5),
							transform: `translateX(${(1 - tag) * 30}px)`,
						}}
					>
						Étape {st.n} · {st.name}
					</div>
					<div
						style={{
							position: 'absolute',
							left: iconX - 200,
							top: 50,
							width: 400,
							height: 400,
							transform: `scale(${iconPop}) rotate(${(1 - iconPop) * -12}deg)`,
						}}
					>
						{icon}
					</div>
				</Stage>
				<NeedTitleBlock t={need.title} at={tA} />
				<div style={{position: 'absolute', left: 72, top: LAY.chipsY, width: 700, display: 'flex', flexWrap: 'wrap', gap: 14}}>
					{chips.map((c, i) => (
						<CheckChip key={i} at={c.at} label={c.label} sub={c.sub} color={n >= 10 ? LPI.blue : n >= 6 ? LPI.blue : LPI.pink} />
					))}
				</div>
				{gags}
				<ChapterSlam n={n} at={numberAt} from={{x: 540, y: LAY.tileY + LAY.tileH / 2}} to={{x: LAY.badge.x, y: LAY.badge.y}} size={LAY.badge.d} />
			</Camera>
			{overlay}
			<Sfx name="impact" at={numberAt} volume={0.08} />
			<Sfx name="whoosh" at={numberAt + 15} volume={0.04} />
			{chips.map((c, i) => (
				<Sfx key={i} name="pop" at={c.at} volume={0.1} />
			))}
			{sfx}
		</AbsoluteFill>
	);
};

/* ───────────────────────── accroche ───────────────────────── */

const GRID14 = {y: 1060, size: 104, gap: 16};
export const gridSlot = (i: number) => {
	const row = Math.floor(i / 7);
	const col = i % 7;
	const w = 7 * GRID14.size + 6 * GRID14.gap;
	return {x: (1080 - w) / 2 + col * (GRID14.size + GRID14.gap) + GRID14.size / 2, y: GRID14.y + row * (GRID14.size + GRID14.gap) + GRID14.size / 2};
};

const BigNum: React.FC<{n: number; at: number; x: number; y: number; strikeAt?: number; size?: number; out?: number}> = ({n, at: t0, x, y, strikeAt, size = 190, out}) => {
	const frame = useCurrentFrame();
	const p = usePop(t0);
	if (frame < t0) return null;
	const leave = out !== undefined ? interpolate(frame, [out, out + 8], [0, 1], {...clamp, easing: (t) => t * t}) : 0;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - size / 2,
				top: y - size / 2,
				width: size,
				height: size,
				borderRadius: 999,
				background: LPI.sky,
				border: `6px solid ${LPI.paper}`,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: size * 0.55,
				color: LPI.navy,
				transform: `scale(${p * (1 - leave)}) rotate(${(1 - p) * 30 + leave * 40}deg) translateY(${leave * 300}px)`,
			}}
		>
			{n}
			{strikeAt !== undefined ? <Strike at={strikeAt} width={size * 1.1} thick={size * 0.09} /> : null}
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const Q1 = at('intro', 'quatorze');
	const B = at('intro', 'besoins');
	const Q2 = at('intro', 'quatorze', 2);
	const OUI = at('intro', 'oui');
	const D = at('intro', 'douze');
	const QZ = at('intro', 'quinze');
	const Q3 = at('intro', 'quatorze', 3);
	const ENS = at('intro', 'et');
	const pop = spring({frame: frame - Q1 + 2, fps, config: {damping: 9, stiffness: 200, mass: 0.7}});
	const punch = (t0: number, k = 0.22) => (frame >= t0 ? k * Math.exp(-(frame - t0) / 6) * Math.cos((frame - t0) * 0.7) : 0);
	const up = interpolate(frame, [ENS, ENS + 14], [0, 1], {...clamp, easing: ease});
	const numY = interpolate(up, [0, 1], [610, 560]);
	const numS = (0.3 + 0.7 * pop) * (1 + punch(Q2) + punch(Q3, 0.3)) * interpolate(up, [0, 1], [1, 0.82]);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q1, Q2, Q3, ENS + 4]} shakes={[Q2 + 1, Q3 + 1]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 236}}>
					<Kicker at={B + 6}>Le modèle de Virginia Henderson</Kicker>
				</div>
				{/* « 14 » géant */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: numY - 250,
						textAlign: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 460,
						lineHeight: 1,
						letterSpacing: '-0.04em',
						color: LPI.blue,
						textShadow: `10px 12px 0 ${LPI.pink}, 0 30px 60px ${alpha(LPI.blue, 0.3)}`,
						transform: `scale(${numS}) rotate(${(1 - pop) * -14}deg)`,
						opacity: frame < Q1 - 2 ? 0 : 1,
					}}
				>
					14
				</div>
				<Burst at={Q1} x={540} y={600} r={330} n={14} />
				<Burst at={Q2} x={540} y={600} r={380} n={16} />
				<div style={{position: 'absolute', left: 72, right: 72, top: 880 - up * 60}}>
					<Title at={B} text="besoins *fondamentaux*" size={94} stagger={3} align="center" />
				</div>
				<BigNum n={12} at={D - 3} x={250} y={1210} strikeAt={D + 4} out={ENS - 4} />
				<BigNum n={15} at={QZ - 3} x={830} y={1210} strikeAt={QZ + 4} out={ENS - 2} />
				<Stamp at={Q3} x={540} y={1210} text="Quatorze !" size={70} rot={-6} out={ENS - 1} />
				<Burst at={Q3 + 1} x={540} y={1210} r={260} n={12} />
				{/* grille des 14 cases à remplir */}
				{Array.from({length: 14}, (_, i) => {
					const s = spring({frame: frame - ENS - 6 - i * 1.5, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
					const {x, y} = gridSlot(i);
					if (frame < ENS + 6) return null;
					const glow = i === 0 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x - GRID14.size / 2,
								top: y - GRID14.size / 2,
								width: GRID14.size,
								height: GRID14.size,
								borderRadius: 28,
								border: `5px dashed ${i === 0 ? LPI.blue : LPI.sky}`,
								background: i === 0 ? alpha(LPI.sky, 0.5 + 0.4 * glow) : alpha(LPI.paper, 0.9),
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 44,
								color: i === 0 ? LPI.blue : alpha(LPI.navy, 0.35),
								transform: `scale(${s}) translateY(${(1 - s) * 60}px)`,
							}}
						>
							{i + 1}
						</div>
					);
				})}
			</Camera>
			<Sfx name="impact" at={Q1} volume={0.1} />
			<Sfx name="impact" at={Q2} volume={0.1} />
			<Sfx name="pop" at={OUI} volume={0.06} />
			<Sfx name="pop" at={D - 3} volume={0.1} />
			<Sfx name="buzz" at={D + 4} volume={0.05} />
			<Sfx name="pop" at={QZ - 3} volume={0.1} />
			<Sfx name="buzz" at={QZ + 4} volume={0.05} />
			<Sfx name="stamp" at={Q3} volume={0.12} />
			{[0, 4, 8, 12].map((k) => (
				<Sfx key={k} name="tick" at={ENS + 6 + k * 1.5 * 3} volume={0.06} />
			))}
		</AbsoluteFill>
	);
};

/* ───────────────────────── écran d'étape : l'escalier ───────────────────────── */

const STEP = {w: 312, tops: [1580, 1410, 1240]};
export const stepTop = (k: number) => ({x: 72 + k * STEP.w + STEP.w / 2, y: STEP.tops[k]});

const STEP_TITLES: NeedTitle[] = [
	{pre: 'Le mode', key: 'survie'},
	{pre: 'On se', key: 'protège'},
	{pre: 'La dimension', key: 'psycho-sociale'},
];

const Staircase: React.FC<{k: number; at: number}> = ({k, at: t0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<>
			{STAGES.map((s, i) => {
				const cur = i === k;
				const done = i < k;
				const rise = cur ? spring({frame: frame - t0, fps, config: {damping: 11, stiffness: 180, mass: 0.7}}) : 1;
				const enter = spring({frame: frame + 6 - i * 2, fps, config: {damping: 14, stiffness: 160}});
				const top = STEP.tops[i] + (1 - rise) * 120 + (1 - enter) * 300;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 72 + i * STEP.w + 6,
							top,
							width: STEP.w - 12,
							height: 1920 - top + 40,
							borderRadius: '34px 34px 0 0',
							background: cur ? s.color : done ? alpha(LPI.sky, 0.9) : alpha(LPI.paper, 0.9),
							border: cur ? `6px solid ${LPI.paper}` : done ? 'none' : `5px dashed ${LPI.sky}`,
							boxShadow: cur ? `0 -10px 40px ${alpha(LPI.navy, 0.18)}` : 'none',
							padding: '22px 26px',
							color: cur ? s.ink : alpha(LPI.navy, done ? 0.8 : 0.45),
						}}
					>
						<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 84, lineHeight: 1}}>{s.n}</span>
							{done ? (
								<svg width={54} height={54} viewBox="0 0 40 40">
									<circle cx="20" cy="20" r="19" fill={LPI.blue} />
									<path d="M11 21 L17.5 27 L29 14" fill="none" stroke={LPI.paper} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							) : null}
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, marginTop: 6}}>{s.name}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 25, marginTop: 4, opacity: 0.8}}>
							besoins {s.needs[0]} → {s.needs[s.needs.length - 1]}
						</div>
					</div>
				);
			})}
		</>
	);
};

export const StepScene: React.FC<{k: number; id: SceneId; numWord: string; titleWord: string; extra?: React.ReactNode}> = ({
	k,
	id,
	numWord,
	titleWord,
	extra,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const N = at(id, numWord);
	const T = Math.max(at(id, titleWord), N + 8);
	const st = STAGES[k];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[N + 2, T + 4]} shakes={[N + 3]}>
				<div style={{position: 'absolute', left: LAY.titleX, top: 232}}>
					<Kicker at={Math.max(0, N - 10)}>
						Étape {k + 1} / 3
					</Kicker>
				</div>
				<NeedTitleBlock t={STEP_TITLES[k]} at={T} y={276} />
				{/* aperçu des besoins de l'étape */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 486, display: 'flex', justifyContent: 'center', gap: 18}}>
					{st.needs.map((n, i) => {
						const s = spring({frame: frame - T - 6 - i * 3, fps, config: {damping: 10, stiffness: 220, mass: 0.6}});
						const Icon = NEED_ICONS[n - 1];
						return (
							<div key={n} style={{position: 'relative', transform: `scale(${s}) translateY(${(1 - s) * 50}px)`, opacity: Math.min(1, s * 2)}}>
								<div
									style={{
										width: 128,
										height: 128,
										borderRadius: 999,
										background: alpha(LPI.sky, 0.85),
										border: `5px solid ${LPI.paper}`,
										boxShadow: SHADOW,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Mini size={86}>
										<Icon size={86} />
									</Mini>
								</div>
								<div
									style={{
										position: 'absolute',
										right: -6,
										top: -6,
										minWidth: 44,
										height: 44,
										borderRadius: 22,
										background: st.color,
										color: st.ink,
										border: `4px solid ${LPI.paper}`,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: FONT.title,
										fontWeight: 900,
										fontSize: 24,
									}}
								>
									{n}
								</div>
							</div>
						);
					})}
				</div>
				{extra}
				<Staircase k={k} at={N} />
				<ChapterSlam n={k + 1} at={N} from={{x: 540, y: 700}} to={{x: LAY.badge.x, y: 330}} size={LAY.badge.d} />
			</Camera>
			<Sfx name="impact" at={N} volume={0.1} />
			<Sfx name="whoosh" at={N + 15} volume={0.05} />
			{st.needs.map((n, i) => (
				<Sfx key={n} name="pop" at={T + 6 + i * 3} volume={0.05} />
			))}
		</AbsoluteFill>
	);
};

/** e3 : « un patient, ce n'est pas juste des constantes, des médicaments et un dossier de soins ! » */
export const NotJust: React.FC = () => {
	const frame = useCurrentFrame();
	const P = at('e3', 'patient');
	const items: [string, number][] = [
		['des constantes', at('e3', 'constantes')],
		['des médicaments', at('e3', 'médicaments')],
		['un dossier de soins', at('e3', 'dossier')],
	];
	const S = at('e3', 'soins');
	const lbl = usePop(P);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					left: 72,
					top: 690,
					fontFamily: FONT.title,
					fontWeight: 900,
					fontSize: 42,
					color: LPI.navy,
					opacity: Math.min(1, lbl * 2),
					transform: `translateY(${(1 - lbl) * 20}px)`,
				}}
			>
				Un patient, ce n'est pas <span style={{color: LPI.blue}}>juste…</span>
			</div>
			{items.map(([t, a], i) => {
				const p = spring({frame: frame - a, fps: 30, config: {damping: 10, stiffness: 220, mass: 0.6}});
				if (frame < a) return null;
				return (
					<div
						key={t}
						style={{
							position: 'absolute',
							left: 72 + i * 26,
							top: 762 + i * 84,
							padding: '12px 28px',
							borderRadius: 999,
							background: LPI.paper,
							border: `4px solid ${LPI.sky}`,
							boxShadow: SHADOW,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 40,
							color: LPI.navy,
							whiteSpace: 'nowrap',
							transform: `scale(${p}) rotate(${(1 - p) * -10}deg)`,
							transformOrigin: 'left center',
						}}
					>
						{t}
						<Strike at={S + 3 + i * 3} width={t.length * 24} rot={-4} thick={10} />
					</div>
				);
			})}
			<Sticker at={S + 12} x={640} y={830} rot={8}>
				<HeartBeat />
			</Sticker>
		</>
	);
};

/* ───────────────────────── récap ───────────────────────── */

export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const V = at('outro', 'voilà');
	const Q = at('outro', 'quatorze');
	const E = at('outro', 'trois');
	const R = at('outro', 'révision');
	const C = at('outro', 'commentaire');
	const col = (s: number) => (s === 2 ? {x: 552, y: 420} : s === 0 ? {x: 72, y: 420} : {x: 72, y: 420 + 70 + 5 * 74 + 26});
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[V + 2, Q + 1, E + 1, R + 2, C + 1]} shakes={[R + 3]} strength={0.03}>
				<div style={{position: 'absolute', left: 72, top: 232}}>
					<Kicker at={V}>Récap</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: 282, width: 936}}>
					<Title at={V + 2} text="Les *14* besoins" size={96} stagger={2} />
				</div>
				{STAGES.map((s, g) => {
					const {x, y} = col(g);
					const hp = spring({frame: frame - Q - g * 4, fps, config: {damping: 11, stiffness: 200}});
					const pulse = frame >= E + g * 5 ? Math.exp(-(frame - E - g * 5) / 6) * Math.sin((frame - E - g * 5) * 0.8) : 0;
					return (
						<React.Fragment key={g}>
							<div
								style={{
									position: 'absolute',
									left: x,
									top: y,
									padding: '8px 20px',
									borderRadius: 999,
									background: s.color,
									color: s.ink,
									fontFamily: FONT.body,
									fontWeight: 800,
									fontSize: 26,
									letterSpacing: '0.1em',
									textTransform: 'uppercase',
									opacity: Math.min(1, hp * 2),
									transform: `translateX(${(1 - hp) * -40}px) scale(${1 + 0.12 * pulse})`,
									transformOrigin: 'left center',
								}}
							>
								{s.n} · {s.name}
							</div>
							{s.needs.map((n, i) => {
								const ip = spring({frame: frame - Q - 2 - (n - 1) * 1.6, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
								const Icon = NEED_ICONS[n - 1];
								return (
									<div
										key={n}
										style={{
											position: 'absolute',
											left: x,
											top: y + 64 + i * 74,
											display: 'flex',
											alignItems: 'center',
											gap: 14,
											opacity: Math.min(1, ip * 2),
											transform: `translateX(${(1 - ip) * 80}px)`,
										}}
									>
										<div
											style={{
												width: 62,
												height: 62,
												borderRadius: 999,
												background: alpha(LPI.sky, 0.85),
												border: `3px solid ${LPI.paper}`,
												boxShadow: SHADOW,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<Mini size={44}>
												<Icon size={44} />
											</Mini>
										</div>
										<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 24, color: LPI.blue, minWidth: 30}}>{n}</span>
										<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 32, color: LPI.navy, whiteSpace: 'nowrap'}}>{NEEDS[n - 1].short}</span>
									</div>
								);
							})}
						</React.Fragment>
					);
				})}
				<Stamp at={R} x={760} y={1010} text="Révisé ✓" size={60} rot={-8} color={LPI.blue} />
				<Confetti at={R + 1} x={540} y={760} n={46} />
				<div style={{position: 'absolute', left: 552, top: 1120}}>
					<TypingBubble at={C} text="Ton prochain sujet ?" size={34} />
				</div>
			</Camera>
			<Sfx name="pop" at={Q} volume={0.08} />
			{[0, 5, 10].map((k) => (
				<Sfx key={k} name="tick" at={Q + 2 + k * 1.6} volume={0.05} />
			))}
			<Sfx name="stamp" at={R} volume={0.12} />
			<Sfx name="ding" at={R + 2} volume={0.08} />
			<Sfx name="pop" at={C} volume={0.1} />
		</AbsoluteFill>
	);
};

export const EndCard: React.FC = () => {
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

/* ───────────────────────── progression globale (14 segments, 3 étapes) ───────────────────────── */

export const Progress14: React.FC = () => {
	const frame = useCurrentFrame();
	const {starts, durations, transition} = TL;
	let s = 0;
	while (s < starts.length - 1 && frame >= starts[s + 1] + transition / 2) s++;
	const id = SCENE_IDS[s];
	const i1 = SCENE_IDS.indexOf('e1');
	const iOut = SCENE_IDS.indexOf('outro');
	const opacity =
		interpolate(frame, [starts[i1], starts[i1] + transition], [0, 1], clamp) * interpolate(frame, [starts[iOut], starts[iOut] + transition], [1, 0], clamp);
	if (opacity <= 0) return null;
	const p = interpolate(frame, [starts[s], starts[s] + durations[s] - transition], [0, 1], clamp);
	let current = -1;
	let group = -1;
	if (id.startsWith('b')) current = Number(id.slice(1)) - 1;
	if (id.startsWith('e')) {
		group = Number(id.slice(1)) - 1;
		current = STAGES[group].needs[0] - 1;
	}
	return (
		<GroupProgress
			groups={[5, 4, 5]}
			current={current}
			group={group}
			progress={id.startsWith('b') ? p : 0}
			colors={STAGES.map((st) => st.color)}
			opacity={opacity}
		/>
	);
};
