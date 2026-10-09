import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sign, SignKind} from '../../brand/learn';
import {Burst, Camera, Confetti, LiveBackground, Odometer, TapRipple} from '../../brand/motion3';
import {GaugePicto, HeartPicto, LungsPicto, O2Picto, PictoBadge, ThermoPicto} from '../../brand/pictos';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Kicker, Title} from '../../brand/ui';
import {Sfx} from '../../components/Sfx';
import {at} from './timeline';

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const Sub2: React.FC = () => <sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>;

export const CONSTANTES = [
	{abbr: 'T°', Picto: ThermoPicto, terms: ['Fébrile', 'Apyrétique', 'Hypothermie']},
	{abbr: 'FC', Picto: HeartPicto, terms: ['Tachycardie', 'Bradycardie', 'Arythmie']},
	{abbr: 'FR', Picto: LungsPicto, terms: ['Tachypnée', 'Bradypnée', 'Dyspnée']},
	{abbr: 'PA', Picto: GaugePicto, terms: ['Systolique', 'Diastolique', 'HTA', 'Hypotension']},
	{abbr: 'SpO2', Picto: O2Picto, terms: ['Désaturation', 'Hypoxémie', 'Oxymètre']},
] as const;

const Abbr: React.FC<{i: number}> = ({i}) =>
	i === 4 ? (
		<span>
			SpO
			<Sub2 />
		</span>
	) : (
		<>{CONSTANTES[i].abbr}</>
	);

/** Rangée des 5 pictos de l'accroche (la vague vers la 1re constante part du picto T°). */
export const HOOK_ROW = {y: 640, size: 124, xs: [0, 1, 2, 3, 4].map((k) => 72 + (936 * (k + 0.5)) / 5)};

const MARQUEE: [string, SignKind][][] = [
	[
		['Fébrile', 'up'],
		['Tachycardie', 'up'],
		['Dyspnée', 'alert'],
		['Systolique', 'squeeze'],
		['Hypoxémie', 'empty'],
		['Apyrétique', 'check'],
		['Bradypnée', 'down'],
		['Hypotension', 'down'],
	],
	[
		['Arythmie', 'wave'],
		['Désaturation', 'down'],
		['Hypothermie', 'down'],
		['Tachypnée', 'up'],
		['Diastolique', 'relax'],
		['Bradycardie', 'down'],
		['Hypertension', 'up'],
		['Oxymètre de pouls', 'device'],
	],
];

const MarqueeRow: React.FC<{items: [string, SignKind][]; y: number; dir: 1 | -1; at: number}> = ({items, y, dir, at: t0}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - t0, fps, config: {damping: 16, stiffness: 160}});
	if (frame < t0) return null;
	const shift = dir < 0 ? 40 - (frame - t0) * 6 : -1700 + (frame - t0) * 6;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: y,
				width: 1080,
				height: 84,
				overflow: 'hidden',
				opacity: s,
				WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 88%, transparent)',
				maskImage: 'linear-gradient(90deg, transparent, black 8%, black 88%, transparent)',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: shift + (1 - s) * 300 * -dir,
					display: 'flex',
					gap: 18,
					whiteSpace: 'nowrap',
				}}
			>
				{items.map(([t, k]) => (
					<div
						key={t}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 14,
							height: 76,
							padding: '0 26px 0 10px',
							borderRadius: 999,
							background: LPI.paper,
							border: `4px solid ${LPI.sky}`,
							boxShadow: SHADOW,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 38,
							color: LPI.navy,
						}}
					>
						<Sign kind={k} size={54} />
						{t}
					</div>
				))}
			</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const FIVE = at('intro', '5');
	const C = at('intro', 'constantes');
	const A = at('intro', 'à');
	const S = at('intro', 'surtout');
	const Q = at('intro', 'quand');
	const AV = at('intro', 'avec');
	const TECH = at('intro', 'techniques');
	const ABS = at('intro', 'absolument');

	// 1) gros « 5 » au centre, 2) il file dans le coin quand « constantes » arrive
	const pop = spring({frame: frame + 4, fps, config: {damping: 10, stiffness: 200, mass: 0.7}});
	const fly = interpolate(frame, [C - 2, C + 12], [0, 1], {...clamp, easing: ease});
	const d = interpolate(fly, [0, 1], [460, 180]);
	const cx = interpolate(fly, [0, 1], [540, 72 + 90]);
	const cy = interpolate(fly, [0, 1], [800, 320]);
	const ring = 1 - fly;
	const les = interpolate(frame, [0, 4, C - 2, C + 6], [0, 1, 1, 0], clamp);
	const count = interpolate(frame, [TECH, TECH + 28], [0, 16], {...clamp, easing: ease});
	const chip = spring({frame: frame - TECH + 2, fps, config: {damping: 12, stiffness: 190}});
	const absPunch = frame >= ABS ? Math.exp(-(frame - ABS) / 6) * Math.sin((frame - ABS) * 0.8) : 0;

	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[2, S + 1, TECH + 1, ABS + 1]} strength={0.04}>
				{/* « Les » au-dessus du gros 5 (disparaît quand le 5 rejoint le titre) */}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 470,
						textAlign: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: 88,
						color: LPI.navy,
						opacity: les,
						transform: `translateY(${(1 - les) * -20}px)`,
					}}
				>
					Les
				</div>
				<Burst at={FIVE} x={540} y={800} r={280} n={14} />
				{/* anneau pointillé qui tourne autour du 5 */}
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: ring}}>
					<circle
						cx={540}
						cy={800}
						r={268}
						fill="none"
						stroke={LPI.sky}
						strokeWidth={10}
						strokeDasharray="4 30"
						strokeLinecap="round"
						transform={`rotate(${frame * 2} 540 800)`}
					/>
				</svg>
				<div
					style={{
						position: 'absolute',
						left: cx - d / 2,
						top: cy - d / 2,
						width: d,
						height: d,
						borderRadius: 999,
						background: LPI.blue,
						boxShadow: `0 24px 60px ${alpha(LPI.blue, 0.35)}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT.title,
						fontWeight: 900,
						fontSize: d * 0.66,
						color: LPI.paper,
						transform: `scale(${0.3 + 0.7 * pop}) rotate(${(1 - pop) * -30}deg)`,
					}}
				>
					5
				</div>
				<div style={{position: 'absolute', left: 276, top: 252}}>
					<Title at={C + 4} text="constantes" size={112} stagger={1} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 440, width: 960}}>
					<Title at={A} text="à ne *surtout* pas oublier" size={70} stagger={7} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 538, width: 936}}>
					<Title at={Q} text="quand tu es *étudiant* *infirmier*" size={46} stagger={4} brush={false} color={alpha(LPI.navy, 0.75)} />
				</div>
				{CONSTANTES.map((c, k) => (
					<div
						key={c.abbr}
						style={{
							position: 'absolute',
							left: HOOK_ROW.xs[k] - HOOK_ROW.size / 2,
							top: HOOK_ROW.y,
							width: HOOK_ROW.size,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 10,
						}}
					>
						<Enter at={C + 10 + k * 3} distance={50} bounce>
							<div style={{transform: `rotate(${Math.sin(frame / 18 + k) * 4}deg)`}}>
								<PictoBadge size={HOOK_ROW.size}>
									<c.Picto size={72} color={LPI.navy} />
								</PictoBadge>
							</div>
						</Enter>
						<Enter at={C + 13 + k * 3} distance={10}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: LPI.navy}}>
								<Abbr i={k} />
							</div>
						</Enter>
					</div>
				))}
				<MarqueeRow items={MARQUEE[0]} y={872} dir={-1} at={AV} />
				<MarqueeRow items={MARQUEE[1]} y={970} dir={1} at={AV + 4} />
				<div
					style={{
						position: 'absolute',
						left: 72,
						top: 1090,
						opacity: Math.min(1, chip * 1.5),
						transform: `translateY(${(1 - chip) * 40}px) scale(${(0.8 + 0.2 * chip) * (1 + 0.08 * absPunch)})`,
						transformOrigin: 'left center',
					}}
				>
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 14,
							padding: '14px 34px',
							borderRadius: 999,
							background: LPI.blue,
							color: LPI.paper,
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 50,
							whiteSpace: 'nowrap',
							boxShadow: `0 18px 44px ${alpha(LPI.blue, 0.35)}`,
						}}
					>
						+
						<Odometer value={count} places={2} size={56} color={LPI.paper} />
						termes techniques
					</div>
				</div>
				<Burst at={ABS} x={400} y={1130} r={260} n={12} />
			</Camera>
			<Sfx name="impact" at={FIVE} volume={0.1} />
			<Sfx name="whoosh" at={C} volume={0.06} />
			{CONSTANTES.map((_, k) => (
				<Sfx key={k} name="pop" at={C + 10 + k * 3} volume={0.09} />
			))}
			<Sfx name="pop" at={S} volume={0.1} />
			<Sfx name="whoosh" at={AV} volume={0.06} />
			{[0, 7, 14, 21].map((k) => (
				<Sfx key={k} name="tick" at={TECH + k} volume={0.09} />
			))}
			<Sfx name="ding" at={ABS} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + APPEL ═══════════════════════════════ */
const ROW_Y = 420;
const ROW_H = 112;
const ROW_GAP = 16;

const Bookmark: React.FC<{fill: string}> = ({fill}) => (
	<svg width={50} height={50} viewBox="0 0 100 100">
		<path d="M28 12 H72 A6 6 0 0 1 78 18 V90 L50 70 L22 90 V18 A6 6 0 0 1 28 12 Z" fill={fill} stroke={LPI.paper} strokeWidth={8} strokeLinejoin="round" />
	</svg>
);

/** Bulle de commentaire : « … » qui s'agite, puis la question s'écrit. */
const CommentBubble: React.FC<{at: number; text: string}> = ({at: t0, text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - t0, fps, config: {damping: 12, stiffness: 190}});
	if (frame < t0) return null;
	const typing = frame - t0 < 12;
	const n = Math.floor(interpolate(frame, [t0 + 12, t0 + 12 + text.length * 0.9], [0, text.length], clamp));
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: 16,
				padding: '20px 30px',
				borderRadius: '34px 34px 34px 8px',
				background: LPI.paper,
				border: `4px solid ${LPI.sky}`,
				boxShadow: SHADOW,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: 29,
				color: LPI.navy,
				whiteSpace: 'nowrap',
				opacity: Math.min(1, s * 1.5),
				transform: `scale(${0.6 + 0.4 * s})`,
				transformOrigin: 'left bottom',
				minHeight: 92,
			}}
		>
			{typing ? (
				<div style={{display: 'flex', gap: 10, padding: '0 6px'}}>
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							style={{
								width: 16,
								height: 16,
								borderRadius: 99,
								background: LPI.blue,
								transform: `translateY(${Math.sin((frame - t0) / 2 - i) * 6}px)`,
							}}
						/>
					))}
				</div>
			) : (
				<span>
					{text.slice(0, n)}
					<span style={{opacity: n < text.length ? 1 : 0, color: LPI.blue}}>|</span>
				</span>
			)}
		</div>
	);
};

export const Recap3: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const R = at('outro', 'récapitulons');
	const named = [
		at('outro', 'température'),
		at('outro', 'fréquence'),
		at('outro', 'fréquence', 2),
		at('outro', 'pression'),
		at('outro', 'spo2'),
	];
	const SAVE = at('outro', 'enregistre');
	const COM = at('outro', 'commentaire');
	const DONE = named[4] + 16;
	const tap = SAVE + 12;
	const saved = interpolate(frame, [tap + 2, tap + 6], [0, 1], clamp);
	const savePop = frame >= tap ? Math.exp(-(frame - tap) / 5) * Math.sin((frame - tap) * 0.9) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[R + 2, ...named.map((t) => t + 1), DONE, tap]} strength={0.03}>
				<div style={{position: 'absolute', left: 72, top: 236}}>
					<Kicker at={R}>Récap</Kicker>
				</div>
				<div style={{position: 'absolute', left: 72, top: 286, width: 936}}>
					<Title at={R + 2} text={'Les *5* constantes'} size={92} stagger={2} />
				</div>
				{CONSTANTES.map((c, k) => {
					const s = spring({frame: frame - named[k], fps, config: {damping: 13, stiffness: 200, mass: 0.8}});
					const current = frame >= named[k] && (k === 4 ? frame < SAVE : frame < named[k + 1]);
					const sweep = interpolate(frame, [named[k], named[k] + 12], [0, 1], {...clamp, easing: ease});
					const done = k < 4 ? frame >= named[k + 1] : frame >= DONE;
					const check = spring({frame: frame - (k < 4 ? named[k + 1] : DONE), fps, config: {damping: 9, stiffness: 240}});
					if (frame < named[k]) return null;
					return (
						<div
							key={c.abbr}
							style={{
								position: 'absolute',
								left: 72,
								top: ROW_Y + k * (ROW_H + ROW_GAP),
								width: 936,
								height: ROW_H,
								borderRadius: 30,
								overflow: 'hidden',
								background: LPI.paper,
								border: `4px solid ${current ? LPI.blue : LPI.sky}`,
								boxShadow: current ? `0 18px 44px ${alpha(LPI.blue, 0.25)}` : SHADOW,
								opacity: Math.min(1, s * 1.6),
								transform: `translateX(${(1 - s) * 140}px) rotate(${(1 - s) * 3}deg) scale(${current ? 1.02 : 1})`,
							}}
						>
							<div
								style={{
									position: 'absolute',
									inset: 0,
									width: `${sweep * 100}%`,
									background: alpha(LPI.sky, current ? 0.6 : 0.3),
								}}
							/>
							<div style={{position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px'}}>
								<div style={{position: 'relative'}}>
									<PictoBadge size={78} on={current ? 1 : 0}>
										<c.Picto size={48} color={current ? LPI.paper : LPI.navy} />
									</PictoBadge>
									{done ? (
										<div style={{position: 'absolute', right: -12, top: -10, transform: `scale(${check})`}}>
											<Sign kind="check" size={40} />
										</div>
									) : null}
								</div>
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: current ? LPI.blue : LPI.navy, minWidth: 100}}>
									<Abbr i={k} />
								</div>
								<div style={{display: 'flex', gap: 8}}>
									{c.terms.map((t, j) => {
										const ts = spring({frame: frame - named[k] - 5 - j * 3, fps, config: {damping: 11, stiffness: 220}});
										return (
											<div
												key={t}
												style={{
													opacity: Math.min(1, ts * 1.5),
													transform: `translateY(${(1 - ts) * 20}px) scale(${0.7 + 0.3 * ts})`,
													fontFamily: FONT.body,
													fontWeight: 700,
													fontSize: 26,
													color: LPI.navy,
													background: current ? LPI.paper : alpha(LPI.sky, 0.6),
													padding: '7px 13px',
													borderRadius: 999,
													whiteSpace: 'nowrap',
												}}
											>
												{t}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					);
				})}
				<Confetti at={DONE} x={540} y={760} n={50} />
				<div style={{position: 'absolute', left: 72, top: 1092}}>
					<Enter at={SAVE} from="left" bounce distance={60}>
						<div
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 18,
								padding: '18px 30px',
								borderRadius: 30,
								background: LPI.blue,
								color: LPI.paper,
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 30,
								whiteSpace: 'nowrap',
								boxShadow: `0 16px 40px ${alpha(LPI.blue, 0.3)}`,
							}}
						>
							<div style={{transform: `scale(${1 + 0.25 * savePop})`}}>
								<Bookmark fill={saved > 0.5 ? LPI.pink : LPI.blue} />
							</div>
							Enregistre pour tes révisions
						</div>
					</Enter>
				</div>
				<TapRipple at={tap} x={72 + 30 + 25} y={1092 + 18 + 25 + 6} />
				<div style={{position: 'absolute', left: 72, top: 1208}}>
					<CommentBubble at={COM} text="Quel mot tu ne connaissais pas ?" />
				</div>
			</Camera>
			{named.map((t, k) => (
				<Sfx key={k} name="pop" at={t} volume={0.11} />
			))}
			<Sfx name="ding" at={DONE} volume={0.1} />
			<Sfx name="pop" at={SAVE} volume={0.12} />
			<Sfx name="tick" at={tap} volume={0.14} />
			<Sfx name="pop" at={COM} volume={0.12} />
		</AbsoluteFill>
	);
};
