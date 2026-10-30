// Briques « arrêt cardiaque » réutilisables : moniteur ECG (rythme normal, fibrillation ventriculaire, tracé plat,
// choc), défibrillateur (DAE) et électrodes, mains du sauveteur qui massent + jauge de profondeur, bascule de la
// tête en arrière (vue de profil : main sur le front, deux doigts sous le menton).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';
import {clamp} from './ui';

const N = LPI.navy;

export type Rhythm = 'sinus' | 'fv' | 'flat' | 'shock';

/** Valeur du tracé (−1 → 1) à l'instant t (frames) pour un rythme donné. */
const wave = (r: Rhythm, t: number, period: number) => {
	if (r === 'flat') return 0.02 * Math.sin(t * 0.4);
	if (r === 'shock') return Math.round(t) % 2 === 0 ? 1.35 : -1.35;
	if (r === 'fv') {
		const a = 0.75 + 0.25 * Math.sin(t / 9);
		return a * (0.5 * Math.sin(t * 0.95) + 0.3 * Math.sin(t * 1.73 + 1) + 0.22 * Math.sin(t * 2.9 + 2));
	}
	const p = (((t % period) + period) % period) / period;
	const bump = (c: number, w: number, h: number) => h * Math.exp(-(((p - c) / w) ** 2));
	return bump(0.12, 0.035, 0.14) - bump(0.27, 0.012, 0.18) + bump(0.3, 0.014, 1) - bump(0.33, 0.014, 0.32) + bump(0.58, 0.06, 0.26);
};

/** Moniteur ECG : `rhythm(t)` donne le rythme à chaque instant ; la tête d'écriture balaie de gauche à droite. */
export const EcgMonitor: React.FC<{
	rhythm: (t: number) => Rhythm;
	width?: number;
	height?: number;
	period?: number;
	/** valeur affichée en haut à droite (« 72 », « FV », « 0 ») */
	readout?: string;
	alert?: number;
}> = ({rhythm, width = 900, height = 360, period = 25, readout = '', alert = 0}) => {
	const frame = useCurrentFrame();
	const speed = 9;
	const mid = height * 0.58;
	const amp = height * 0.32;
	const pts: string[] = [];
	for (let x = 0; x <= width - 40; x += 4) {
		const t = frame - (width - 40 - x) / speed;
		pts.push(`${x + 20},${mid - wave(rhythm(t), t, period) * amp}`);
	}
	const head = pts[pts.length - 1].split(',').map(Number);
	return (
		<div style={{position: 'relative', width, height, borderRadius: 40, background: N, boxShadow: `0 20px 50px ${alpha(N, 0.3)}`, overflow: 'hidden'}}>
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: Math.ceil(width / 40)}, (_, i) => (
					<path key={`v${i}`} d={`M${i * 40} 0 V${height}`} stroke={alpha(LPI.sky, 0.12)} strokeWidth={2} />
				))}
				{Array.from({length: Math.ceil(height / 40)}, (_, i) => (
					<path key={`h${i}`} d={`M0 ${i * 40} H${width}`} stroke={alpha(LPI.sky, 0.12)} strokeWidth={2} />
				))}
				<polyline points={pts.join(' ')} fill="none" stroke={alert > 0.5 ? LPI.pink : LPI.sky} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
				<circle cx={head[0]} cy={head[1]} r={12} fill={LPI.paper} />
			</svg>
			<div style={{position: 'absolute', left: 26, top: 18, fontFamily: FONT.body, fontWeight: 800, fontSize: 28, letterSpacing: '0.12em', color: alpha(LPI.sky, 0.8)}}>ECG</div>
			<div style={{position: 'absolute', right: 30, top: 10, fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: alert > 0.5 ? LPI.pink : LPI.paper, lineHeight: 1}}>{readout}</div>
			{alert > 0 ? <div style={{position: 'absolute', inset: 0, border: `10px solid ${alpha(LPI.pink, alert * (0.6 + 0.4 * Math.sin(frame / 2)))}`, borderRadius: 40}} /> : null}
		</div>
	);
};

/** Défibrillateur automatisé externe : boîtier rose, cœur + éclair, petit écran qui parle (`msg`), bouton de choc. */
export const Aed: React.FC<{msg?: string; ready?: number; press?: number; size?: number}> = ({msg = '', ready = 0, press = 0, size = 300}) => {
	const frame = useCurrentFrame();
	const k = size / 300;
	return (
		<div style={{position: 'relative', width: 300 * k, height: 340 * k}}>
			<div style={{position: 'absolute', left: 90 * k, top: 0, width: 120 * k, height: 50 * k, borderRadius: 24 * k, border: `${10 * k}px solid ${N}`, borderBottom: 'none', boxSizing: 'border-box'}} />
			<div style={{position: 'absolute', left: 0, top: 34 * k, width: 300 * k, height: 306 * k, borderRadius: 46 * k, background: LPI.pink, border: `${8 * k}px solid ${N}`, boxSizing: 'border-box', boxShadow: `0 ${18 * k}px ${44 * k}px ${alpha(N, 0.28)}`}}>
				<svg width={120 * k} height={110 * k} viewBox="0 0 120 110" style={{position: 'absolute', left: 90 * k, top: 18 * k}}>
					<path d="M60 100 C10 66 4 30 30 18 C46 10 58 20 60 30 C62 20 74 10 90 18 C116 30 110 66 60 100 Z" fill={LPI.paper} stroke={N} strokeWidth={7} />
					<path d="M66 28 L48 60 H62 L54 86 L76 52 H62 Z" fill={LPI.blue} stroke={N} strokeWidth={4} strokeLinejoin="round" />
				</svg>
				<div style={{position: 'absolute', left: 24 * k, right: 24 * k, top: 140 * k, height: 62 * k, borderRadius: 16 * k, background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: (msg.length > 16 ? 20 : 26) * k, color: LPI.sky, whiteSpace: 'nowrap'}}>
					{msg}
				</div>
				<div style={{position: 'absolute', left: 26 * k, bottom: 22 * k, fontFamily: FONT.title, fontWeight: 900, fontSize: 40 * k, color: N}}>DAE</div>
				<div
					style={{
						position: 'absolute',
						right: 26 * k,
						bottom: 18 * k,
						width: 74 * k,
						height: 74 * k,
						borderRadius: 37 * k,
						background: ready > 0 ? (frame % 12 < 6 ? LPI.paper : LPI.sky) : LPI.sky,
						border: `${7 * k}px solid ${N}`,
						boxSizing: 'border-box',
						boxShadow: ready > 0 ? `0 0 ${30 * k * ready}px ${alpha(LPI.paper, ready)}` : 'none',
						transform: `scale(${1 - 0.15 * press})`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<svg width={36 * k} height={36 * k} viewBox="0 0 40 40">
						<path d="M24 2 L8 22 H20 L14 38 L32 16 H20 Z" fill={N} />
					</svg>
				</div>
			</div>
		</div>
	);
};

/** Électrode collée sur le torse (dans l'espace du `Patient`, viewBox 400 × 560). */
export const Pad: React.FC<{x: number; y: number; rot?: number; on: number}> = ({x, y, rot = 0, on}) =>
	on > 0 ? (
		<g transform={`translate(${x} ${y - (1 - on) * 40}) rotate(${rot})`} opacity={Math.min(1, on * 2)}>
			<rect x={-34} y={-46} width={68} height={92} rx={14} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={-20} y={-30} width={40} height={60} rx={8} fill={alpha(LPI.pink, 0.8)} />
		</g>
	) : null;

/** Mains croisées du sauveteur, bras tendus depuis le côté droit (il est agenouillé à côté ; espace du `Patient`) : `press` 0 → 1 enfonce. */
export const CprHands: React.FC<{press: number; on?: number}> = ({press, on = 1}) => {
	if (on <= 0) return null;
	const hx = 206;
	const hy = 296;
	const s = 1 - 0.1 * press;
	return (
		<g opacity={Math.min(1, on * 1.5)} transform={`translate(${(1 - on) * 220} 0)`}>
			{/* ondes de compression */}
			{press > 0.2 ? <circle cx={hx} cy={hy} r={60 + 30 * press} fill="none" stroke={LPI.pink} strokeWidth={6} opacity={press * 0.7} /> : null}
			{/* bras tendus (manches bleues) */}
			{[-1, 1].map((k) => (
				<g key={k}>
					<path d={`M${hx + 10} ${hy + 8 * k} L${560} ${hy - 40 + 46 * k}`} stroke={N} strokeWidth={62} strokeLinecap="round" />
					<path d={`M${hx + 10} ${hy + 8 * k} L${560} ${hy - 40 + 46 * k}`} stroke={LPI.blue} strokeWidth={48} strokeLinecap="round" />
				</g>
			))}
			{/* mains l'une sur l'autre */}
			<g transform={`translate(${hx} ${hy}) scale(${s})`}>
				<ellipse rx={58} ry={46} fill={LPI.paper} stroke={N} strokeWidth={7} />
				<ellipse rx={58} ry={46} fill={alpha(LPI.pink, 0.3)} />
				<ellipse cx={8} cy={-10} rx={50} ry={38} fill={LPI.paper} stroke={N} strokeWidth={7} />
				<ellipse cx={8} cy={-10} rx={50} ry={38} fill={alpha(LPI.pink, 0.3)} />
				<path d="M-24 -18 Q-10 -26 4 -22 M-20 -2 Q-6 -10 10 -6 M-14 14 Q0 6 16 10" fill="none" stroke={alpha(N, 0.4)} strokeWidth={5} strokeLinecap="round" />
			</g>
		</g>
	);
};

/** Jauge de profondeur « 5 – 6 cm » : le curseur descend avec `press`. */
export const DepthGauge: React.FC<{press: number; height?: number}> = ({press, height = 300}) => {
	const y = interpolate(press, [0, 1], [20, height - 60], clamp);
	return (
		<svg width={150} height={height} style={{overflow: 'visible'}}>
			<rect x={20} y={10} width={34} height={height - 20} rx={17} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<rect x={24} y={height - 100} width={26} height={70} rx={8} fill={alpha(LPI.pink, 0.8)} />
			<path d={`M60 ${height - 100} H80 M60 ${height - 30} H80`} stroke={N} strokeWidth={5} strokeLinecap="round" />
			<text x={86} y={height - 58} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
				5–6
			</text>
			<text x={86} y={height - 28} fontFamily={FONT.title} fontWeight={800} fontSize={24} fill={LPI.blue}>
				cm
			</text>
			<path d={`M4 ${y} L18 ${y + 10} L4 ${y + 20} Z`} fill={LPI.blue} />
			<rect x={20} y={10} width={34} height={Math.max(0, y)} rx={17} fill={alpha(LPI.blue, 0.35)} />
		</svg>
	);
};

/** Peau de la marque : blanc cassé + rose 30 % (le calque rose est groupé : pas de surimpression entre formes). */
const Skin: React.FC<{children: (p: React.SVGProps<SVGElement>) => React.ReactNode}> = ({children}) => (
	<>
		{children({fill: N, stroke: N, strokeWidth: 14, strokeLinejoin: 'round'})}
		{children({fill: LPI.paper})}
		<g opacity={0.3}>{children({fill: LPI.pink})}</g>
	</>
);

/** Bras + main du sauveteur (manche bleue ; paume à plat avec pouce, ou deux doigts) : de `from` (hors champ) à la main en `to`, orientée `rot`°. */
const RescuerHand: React.FC<{from: [number, number]; to: [number, number]; rot: number; fingers?: 'flat' | 'two'}> = ({from, to, rot, fingers = 'flat'}) => {
	const [fx, fy] = from;
	const [tx, ty] = to;
	const len = Math.hypot(tx - fx, ty - fy);
	const cuff = [tx - ((tx - fx) / len) * 38, ty - ((ty - fy) / len) * 38];
	return (
		<g>
			<path d={`M${fx} ${fy} L${cuff[0]} ${cuff[1]}`} stroke={N} strokeWidth={44} strokeLinecap="round" />
			<path d={`M${fx} ${fy} L${cuff[0]} ${cuff[1]}`} stroke={LPI.blue} strokeWidth={30} strokeLinecap="round" />
			<g transform={`translate(${tx} ${ty}) rotate(${rot})`}>
				<Skin>
					{(p) =>
						fingers === 'flat' ? (
							<>
								<rect x={-40} y={-17} width={80} height={34} rx={17} {...(p as React.SVGProps<SVGRectElement>)} />
								<ellipse cx={-6} cy={-20} rx={16} ry={9} transform="rotate(-24 -6 -20)" {...(p as React.SVGProps<SVGEllipseElement>)} />
							</>
						) : (
							<>
								<ellipse cx={18} cy={0} rx={24} ry={20} {...(p as React.SVGProps<SVGEllipseElement>)} />
								<rect x={-34} y={-14} width={52} height={13} rx={6.5} {...(p as React.SVGProps<SVGRectElement>)} />
								<rect x={-30} y={2} width={48} height={13} rx={6.5} {...(p as React.SVGProps<SVGRectElement>)} />
							</>
						)
					}
				</Skin>
				{fingers === 'flat' ? <path d="M-34 -5 H-4 M-34 6 H-4" stroke={alpha(N, 0.45)} strokeWidth={4} strokeLinecap="round" /> : null}
			</g>
		</g>
	);
};

/**
 * Bascule de la tête en arrière, vue de profil : patient allongé sur le dos (tête à gauche, visage vers le haut).
 * Le sauveteur pose une main sur le front et relève le menton avec deux doigts ; `tilt` 0 → 1 bascule la tête.
 * viewBox 420 × 246, largeur `width` px.
 */
export const HeadTilt: React.FC<{tilt: number; width?: number}> = ({tilt, width = 888}) => {
	const a = -32 * tilt;
	const C = [140, 158] as const;
	const rot = (x: number, y: number): [number, number] => {
		const r = (a * Math.PI) / 180;
		const dx = x - C[0];
		const dy = y - C[1];
		return [C[0] + dx * Math.cos(r) - dy * Math.sin(r), C[1] + dx * Math.sin(r) + dy * Math.cos(r)];
	};
	const throat = rot(196, 144);
	const nape = rot(168, 222);
	const forehead = rot(86, 94);
	const chin = rot(234, 158);
	const head = (p: React.SVGProps<SVGElement>) => (
		<>
			<circle cx={140} cy={158} r={66} {...(p as React.SVGProps<SVGCircleElement>)} />
			<path d="M146 100 L168 66 Q175 59 180 67 L182 104 Z" {...(p as React.SVGProps<SVGPathElement>)} />
			<circle cx={186} cy={110} r={10} {...(p as React.SVGProps<SVGCircleElement>)} />
			<ellipse cx={194} cy={130} rx={18} ry={16} {...(p as React.SVGProps<SVGEllipseElement>)} />
		</>
	);
	return (
		<svg width={width} height={(width * 246) / 420} viewBox="0 0 420 246" style={{overflow: 'visible'}}>
			{/* sol */}
			<path d="M-20 232 H440" stroke={alpha(N, 0.22)} strokeWidth={6} strokeLinecap="round" />
			{/* cou (il s'étire quand la tête bascule) */}
			<Skin>{(p) => <path d={`M${throat[0]} ${throat[1]} L270 138 L270 230 L${nape[0]} ${nape[1]} Z`} {...(p as React.SVGProps<SVGPathElement>)} />}</Skin>
			{/* tronc allongé (tunique) */}
			<path d="M266 134 C292 122 340 120 440 122 V230 H262 C254 200 256 160 266 134 Z" fill={LPI.blue} stroke={N} strokeWidth={7} strokeLinejoin="round" />
			<path d="M262 138 L292 166 L300 128" fill="none" stroke={N} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
			{/* tête de profil */}
			<g transform={`rotate(${a} ${C[0]} ${C[1]})`}>
				<Skin>{head}</Skin>
				{/* cheveux */}
				<path d="M89.4 115.6 A66 66 0 0 0 97.6 208.6 C116 190 108 150 126 124 C116 114 100 110 89.4 115.6 Z" fill={N} stroke={N} strokeWidth={4} strokeLinejoin="round" />
				{/* oreille, œil fermé, sourcil, bouche, joue */}
				<Skin>{(p) => <ellipse cx={130} cy={168} rx={10} ry={14} {...(p as React.SVGProps<SVGEllipseElement>)} strokeWidth={p.strokeWidth ? 10 : undefined} />}</Skin>
				<path d="M133 161 Q125 168 133 175" fill="none" stroke={alpha(N, 0.45)} strokeWidth={4} strokeLinecap="round" />
				<path d="M140 110 Q150 116 160 108" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				<path d="M134 98 Q146 90 160 94" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
				<path d="M194 116 L184 122" stroke={N} strokeWidth={5} strokeLinecap="round" />
				<ellipse cx={178} cy={132} rx={9} ry={6} fill={LPI.pink} opacity={0.5} />
			</g>
			{/* mains du sauveteur : paume sur le front, deux doigts sous le menton */}
			<RescuerHand from={[-30, -60]} to={forehead} rot={-40 + a} />
			<RescuerHand from={[330, -60]} to={chin} rot={a + 18} fingers="two" />
			{/* flèche de bascule (le nez part vers l'arrière) */}
			<g opacity={Math.min(1, tilt * 3) * (1 - Math.max(0, tilt - 0.9) * 4)}>
				<path d="M190 44 A118 118 0 0 0 116 40" fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.min(1, tilt * 1.4)} 1`} />
				{tilt > 0.6 ? <path d="M130 28 L114 40 L132 50" fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" /> : null}
			</g>
		</svg>
	);
};
