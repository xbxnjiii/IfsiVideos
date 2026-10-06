import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';
import {clamp} from './ui';

const NAVY = LPI.navy;
const SW = 6; // épaisseur de trait standard des pictos

type P = {size?: number; color?: string};

/* ─────────── pictogrammes « ligne » (badges, listes) ─────────── */

const Line: React.FC<P & {children: React.ReactNode}> = ({size = 72, color = NAVY, children}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={color}
		strokeWidth={SW}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{children}
	</svg>
);

export const ThermoPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<path d="M42 62 V20 A8 8 0 0 1 58 20 V62 A16 16 0 1 1 42 62 Z" />
		<circle cx="50" cy="75" r="6" fill={p.color ?? NAVY} stroke="none" />
		<path d="M50 70 V42" />
	</Line>
);

export const HeartPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<path d="M50 84 C14 60 10 36 24 24 C36 14 48 22 50 32 C52 22 64 14 76 24 C90 36 86 60 50 84 Z" />
		<path d="M28 50 H40 L45 40 L53 60 L58 50 H72" />
	</Line>
);

export const LungsPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<path d="M50 14 V44 M50 44 C44 46 42 50 42 56 M50 44 C56 46 58 50 58 56" />
		<path d="M38 30 C24 30 14 50 14 70 C14 82 22 86 32 84 C40 82 42 76 42 66 V40 C42 34 41 30 38 30 Z" />
		<path d="M62 30 C76 30 86 50 86 70 C86 82 78 86 68 84 C60 82 58 76 58 66 V40 C58 34 59 30 62 30 Z" />
	</Line>
);

export const GaugePicto: React.FC<P> = (p) => (
	<Line {...p}>
		<path d="M14 66 A36 36 0 0 1 86 66" />
		<path d="M50 66 L66 42" />
		<circle cx="50" cy="66" r="5" fill={p.color ?? NAVY} stroke="none" />
		<path d="M30 82 H70" />
	</Line>
);

export const O2Picto: React.FC<P> = ({size = 72, color = NAVY}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx="36" cy="48" r="19" fill="none" stroke={color} strokeWidth={SW} />
		<circle cx="64" cy="48" r="19" fill="none" stroke={color} strokeWidth={SW} />
		<text x="74" y="92" fill={color} fontFamily={FONT.title} fontWeight={900} fontSize="30">
			2
		</text>
	</svg>
);

export const BodyPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<circle cx="50" cy="20" r="10" />
		<path d="M30 40 H70 M50 34 V64 M50 64 L36 90 M50 64 L64 90 M30 40 L22 62 M70 40 L78 62" />
	</Line>
);

export const DropPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<path d="M50 12 C50 12 78 46 78 64 A28 28 0 0 1 22 64 C22 46 50 12 50 12 Z" fill={LPI.pink} />
	</Line>
);

export const ArteryPicto: React.FC<P> = (p) => (
	<Line {...p}>
		<rect x="8" y="30" width="84" height="40" rx="20" fill={LPI.sky} />
		<path d="M14 50 H86" stroke={LPI.pink} strokeWidth="12" />
	</Line>
);

export const FlamePicto: React.FC<{size?: number}> = ({size = 60}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path
			d="M50 8 C58 28 80 38 80 62 A30 30 0 0 1 20 62 C20 46 30 38 36 28 C38 40 44 44 48 44 C46 30 46 18 50 8 Z"
			fill={LPI.pink}
			stroke={NAVY}
			strokeWidth="6"
			strokeLinejoin="round"
		/>
	</svg>
);

export const SnowPicto: React.FC<{size?: number}> = ({size = 60}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 100 100"
		fill="none"
		stroke={LPI.blue}
		strokeWidth="8"
		strokeLinecap="round"
	>
		{[0, 60, 120].map((r) => (
			<g key={r} transform={`rotate(${r} 50 50)`}>
				<path d="M50 12 V88 M40 22 L50 32 L60 22 M40 78 L50 68 L60 78" />
			</g>
		))}
	</svg>
);

/** Badge rond : pictogramme sur pastille bleu clair. */
export const PictoBadge: React.FC<{size?: number; on?: number; children: React.ReactNode}> = ({
	size = 120,
	on = 0,
	children,
}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: 999,
			background: on > 0.5 ? LPI.blue : LPI.sky,
			border: `4px solid ${on > 0.5 ? LPI.blue : LPI.paper}`,
			boxShadow: `0 10px 26px ${alpha(LPI.navy, 0.12)}`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		{children}
	</div>
);

/* ─────────── illustrations pédagogiques ─────────── */

const T_MIN = 34;
const T_MAX = 41;

/** Couleur du liquide : bleu clair (froid) → bleu (référence) → rose (chaud). */
export const tempColor = (t: number) => interpolateColors(t, [35, 36.7, 39.2], [LPI.sky, LPI.blue, LPI.pink]);

export const Thermometer: React.FC<{value: number; height?: number}> = ({value, height = 440}) => {
	const top = 34;
	const bottom = 400;
	const y = interpolate(value, [T_MIN, T_MAX], [bottom, top]);
	const fill = tempColor(value);
	const w = (170 / 520) * height;
	return (
		<svg width={w} height={height} viewBox="0 0 170 520" style={{overflow: 'visible'}}>
			<rect x="48" y="12" width="64" height="420" rx="32" fill={LPI.paper} stroke={NAVY} strokeWidth="7" />
			<circle cx="80" cy="458" r="52" fill={LPI.paper} stroke={NAVY} strokeWidth="7" />
			<rect x="64" y={y} width="32" height={448 - y} rx="16" fill={fill} />
			<circle cx="80" cy="458" r="38" fill={fill} />
			<rect x="70" y="40" width="7" height="360" rx="3.5" fill={alpha(LPI.paper, 0.9)} />
			{Array.from({length: T_MAX - T_MIN + 1}, (_, i) => {
				const t = T_MIN + i;
				const ty = interpolate(t, [T_MIN, T_MAX], [bottom, top]);
				return (
					<g key={t}>
						<path
							d={`M120 ${ty} H${t % 2 === 1 ? 140 : 132}`}
							stroke={alpha(NAVY, 0.55)}
							strokeWidth="5"
							strokeLinecap="round"
						/>
						{t % 2 === 1 ? (
							<text x="146" y={ty + 8} fill={alpha(NAVY, 0.6)} fontFamily={FONT.body} fontWeight={700} fontSize="22">
								{t}
							</text>
						) : null}
					</g>
				);
			})}
		</svg>
	);
};

/** 36.7 → « 36,7 » */
export const fr1 = (v: number) => v.toFixed(1).replace('.', ',');

const HEART = 'M0 22 C-34 -6 -22 -40 0 -24 C22 -40 34 -6 0 22 Z';

export const Heart: React.FC<{size?: number; beat: number}> = ({size = 300, beat}) => (
	<svg width={size} height={size} viewBox="-60 -60 120 120" style={{overflow: 'visible'}}>
		{[0, 1].map((k) => (
			<circle
				key={k}
				r={36 + (k + 1) * 10 * beat}
				fill="none"
				stroke={LPI.sky}
				strokeWidth={4}
				opacity={(1 - beat) * 0.9}
			/>
		))}
		<g transform={`scale(${2.1 * (1 + 0.1 * beat)})`}>
			<path d={HEART} fill={LPI.pink} stroke={NAVY} strokeWidth={2.6} strokeLinejoin="round" />
			<path d="M-14 -18 C-20 -16 -24 -10 -24 -4" stroke={LPI.paper} strokeWidth="3" fill="none" strokeLinecap="round" />
		</g>
	</svg>
);

/** Tracé de pouls symbolique (bosses arrondies, volontairement non réaliste). */
export const PulseLine: React.FC<{width: number; beatFrames: number; startAt: number; y?: number}> = ({
	width,
	beatFrames,
	startAt,
	y = 60,
}) => {
	const frame = useCurrentFrame();
	const spacing = 230;
	const shift = (frame - startAt) * (spacing / beatFrames);
	const pts = Array.from({length: Math.ceil(width / 6) + 1}, (_, i) => {
		const x = i * 6;
		const local = ((((x + shift - width / 2) % spacing) + spacing) % spacing) - spacing / 2;
		const bump = -56 * Math.exp(-((local / 18) ** 2)) + 14 * Math.exp(-(((local - 34) / 16) ** 2));
		return `${x},${y + bump}`;
	}).join(' ');
	return (
		<svg width={width} height={y + 40} style={{overflow: 'visible'}}>
			<polyline
				points={pts}
				fill="none"
				stroke={LPI.blue}
				strokeWidth={7}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

/** Poumons qui se gonflent (breath 0→1) + flèches d'air entrantes / sortantes. */
export const Lungs: React.FC<{breath: number; inspiring: boolean; q: number; size?: number}> = ({
	breath,
	inspiring,
	q,
	size = 420,
}) => {
	const s = 1 + 0.1 * breath;
	const arrow = Math.sin(Math.min(1, q) * Math.PI);
	return (
		<svg width={size} height={size} viewBox="0 0 400 400" style={{overflow: 'visible'}}>
			<g transform={`translate(0 ${inspiring ? 24 - q * 24 : q * 24})`} opacity={arrow}>
				<path
					d={inspiring ? 'M200 -24 V22 M184 6 L200 24 L216 6' : 'M200 24 V-22 M184 -6 L200 -24 L216 -6'}
					stroke={LPI.blue}
					strokeWidth="10"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<path d="M200 30 V130" stroke={NAVY} strokeWidth="16" strokeLinecap="round" />
			<path
				d="M200 130 Q178 142 156 166 M200 130 Q222 142 244 166"
				stroke={NAVY}
				strokeWidth="12"
				fill="none"
				strokeLinecap="round"
			/>
			{[-1, 1].map((side) => (
				<g key={side} transform={`translate(${200 + side * 70} 250) scale(${s}) translate(${-(200 + side * 70)} -250)`}>
					<path
						d={
							side < 0
								? 'M178 120 C120 110 64 170 58 250 C52 320 84 356 140 354 C176 352 186 318 186 268 V150 C186 132 184 122 178 120 Z'
								: 'M222 120 C280 110 336 170 342 250 C348 320 316 356 260 354 C224 352 214 318 214 268 V150 C214 132 216 122 222 120 Z'
						}
						fill={LPI.sky}
						stroke={NAVY}
						strokeWidth="8"
						strokeLinejoin="round"
					/>
					<path
						d={
							side < 0
								? 'M156 170 C130 196 116 236 116 280 M140 220 L112 236'
								: 'M244 170 C270 196 284 236 284 280 M260 220 L288 236'
						}
						stroke={LPI.blue}
						strokeWidth="7"
						fill="none"
						strokeLinecap="round"
					/>
				</g>
			))}
		</svg>
	);
};

const CELLS = Array.from({length: 14}, (_, i) => ({
	x0: (i * 263) % 960,
	y: 104 + ((i * 37) % 92),
	r: ((i * 53) % 40) - 20,
}));

/** Artère en coupe : sang qui circule par à-coups, flèches de pression sur la paroi. */
export const Artery: React.FC<{width?: number; arrows: number; beatFrames?: number}> = ({
	width = 900,
	arrows,
	beatFrames = 25,
}) => {
	const frame = useCurrentFrame();
	const k = frame % beatFrames;
	const pulse = Math.exp(-k / 5);
	const dist = 4 * frame + 10 * (Math.floor(frame / beatFrames) * 5 * (1 - Math.exp(-5)) + 5 * (1 - Math.exp(-k / 5)));
	return (
		<svg width={width} height={300} viewBox={`0 0 ${width} 300`} style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="lpi-artery">
					<rect x="0" y="0" width={width} height="300" rx="40" />
				</clipPath>
			</defs>
			<g clipPath="url(#lpi-artery)">
				<rect x="0" y={84 - 5 * pulse} width={width} height={132 + 10 * pulse} fill={alpha(LPI.pink, 0.35)} />
				{CELLS.map((c, i) => {
					const x = ((c.x0 + dist) % (width + 60)) - 30;
					return (
						<g key={i} transform={`translate(${x} ${c.y}) rotate(${c.r})`}>
							<ellipse rx="24" ry="13" fill={LPI.pink} stroke={NAVY} strokeWidth="3.5" />
							<ellipse rx="9" ry="3.5" fill={alpha(NAVY, 0.22)} />
						</g>
					);
				})}
				<g transform={`translate(0 ${-5 * pulse})`}>
					<rect x="-10" y="28" width={width + 20} height="58" fill={LPI.sky} stroke={NAVY} strokeWidth="6" />
				</g>
				<g transform={`translate(0 ${5 * pulse})`}>
					<rect x="-10" y="214" width={width + 20} height="58" fill={LPI.sky} stroke={NAVY} strokeWidth="6" />
				</g>
				{[150, 370, 590, 810]
					.filter((x) => x < width)
					.map((x) => (
						<g
							key={x}
							opacity={arrows * (0.6 + 0.4 * pulse)}
							stroke={LPI.blue}
							strokeWidth="8"
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						>
							<path
								d={`M${x} 138 V${104 - 6 * pulse} M${x - 14} ${118 - 6 * pulse} L${x} ${102 - 6 * pulse} L${x + 14} ${118 - 6 * pulse}`}
							/>
							<path
								d={`M${x} 162 V${196 + 6 * pulse} M${x - 14} ${182 + 6 * pulse} L${x} ${198 + 6 * pulse} L${x + 14} ${182 + 6 * pulse}`}
							/>
						</g>
					))}
			</g>
		</svg>
	);
};

/** Saturomètre sur un doigt (doigt au trait, palette uniquement). */
export const Oximeter: React.FC<{on: number; value: number; enter: number; clip: number; beatFrames?: number}> = ({
	on,
	value,
	enter,
	clip,
	beatFrames = 25,
}) => {
	const frame = useCurrentFrame();
	const beat = Math.exp(-(frame % beatFrames) / 4);
	return (
		<svg width={880} height={300} viewBox="0 0 880 300" style={{overflow: 'visible'}}>
			<g transform={`translate(${(1 - enter) * -500} 0)`} opacity={Math.min(1, enter * 1.5)}>
				<rect x="-40" y="112" width="640" height="122" rx="61" fill={LPI.paper} stroke={NAVY} strokeWidth="7" />
				<path
					d="M190 124 Q182 172 190 222 M310 124 Q302 172 310 222"
					stroke={alpha(NAVY, 0.4)}
					strokeWidth="5"
					fill="none"
					strokeLinecap="round"
				/>
				<rect x="500" y="126" width="80" height="52" rx="22" fill={LPI.sky} stroke={NAVY} strokeWidth="5" />
			</g>
			<g transform={`translate(0 ${(1 - clip) * -220})`} opacity={Math.min(1, clip * 2)}>
				<rect x="360" y="14" width="380" height="124" rx="48" fill={NAVY} />
				<rect x="390" y="32" width="320" height="88" rx="20" fill={LPI.paper} />
				<text x="410" y="66" fill={LPI.blue} fontFamily={FONT.body} fontWeight={800} fontSize="24" opacity={on}>
					SpO
					<tspan fontSize="16" dy="6">
						2
					</tspan>
				</text>
				<text x="498" y="108" fill={NAVY} fontFamily={FONT.title} fontWeight={900} fontSize="68" opacity={on}>
					{Math.round(value)}
					<tspan fontSize="32" fill={LPI.blue}>
						{' '}
						%
					</tspan>
				</text>
				<path d={HEART} transform={`translate(672 62) scale(${0.5 + 0.12 * beat})`} fill={LPI.pink} opacity={on} />
				{[0, 1, 2, 3].map((i) => {
					const h = 16 * Math.max(0.2, Math.exp(-(((frame - i * 3) % beatFrames) / 5)));
					return <rect key={i} x={412 + i * 13} y={104 - h} width="8" height={h} rx="3" fill={LPI.blue} opacity={on} />;
				})}
			</g>
			<g transform={`translate(0 ${(1 - clip) * 180})`} opacity={Math.min(1, clip * 2)}>
				<rect x="360" y="214" width="380" height="80" rx="40" fill={NAVY} />
				<rect x="704" y="94" width="48" height="160" rx="24" fill={NAVY} />
			</g>
		</svg>
	);
};

/** Globule rouge (rose) qui porte éventuellement de l'O2 (points bleus). */
export const Rbc: React.FC<{o2?: number; size?: number}> = ({o2 = 0, size = 70}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
			<ellipse rx="36" ry="25" fill={LPI.pink} stroke={NAVY} strokeWidth="5" />
			<ellipse rx="15" ry="7" fill={alpha(NAVY, 0.2)} />
			{[0, 1, 2, 3].map((i) => {
				const a = frame / 12 + (i * Math.PI) / 2;
				return <circle key={i} cx={Math.cos(a) * 44} cy={Math.sin(a) * 30} r={8} fill={LPI.blue} opacity={o2} />;
			})}
		</svg>
	);
};

export const drawOn = (frame: number, at: number, len = 20) => interpolate(frame, [at, at + len], [0, 1], clamp);
