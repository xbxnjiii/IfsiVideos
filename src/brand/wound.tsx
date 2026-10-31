// Plaies : coupe de peau en couches (épiderme, derme, hypoderme, muscle, os) où l'on creuse une plaie de forme et de
// profondeur variables (éraflure, coupure, déchirure, piqûre, morsure, cratère d'escarre, incision suturée), brûlure
// par degrés (rougeur, phlyctène, peau carbonisée), nerfs et douleur, microbes qui entrent, doigt qui appuie ;
// escarre écrasée entre l'os et le matelas (`Squeeze`), patient couché et ses points d'appui (`LyingBody`), jambe
// de profil (varices, ulcère, plaie du pied diabétique, escarre du talon : `LowerLeg`), doigt et coupure de papier
// (`Finger`), objets qui blessent (`WoundTool`) et petits pictos de gravité. Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ───────────── coupe de peau ───────────── */

/** Coupe de peau (repère 900 × 500) : surface à y 60, puis épiderme, derme, hypoderme, muscle, os. */
export const SKIN = {w: 900, h: 500, top: 60, epi: 85, derm: 180, hypo: 300, musc: 400, bone: 500, cx: 450};
/** profondeur 0 → 5 (rien, épiderme, derme, hypoderme, muscle, os) → y du fond de la plaie */
export const depthY = (d: number) => {
	const ys = [SKIN.top, SKIN.epi, SKIN.derm, SKIN.hypo, SKIN.musc, 468];
	const i = Math.min(4, Math.floor(cl(d, 0, 5)));
	return ys[i] + (ys[i + 1] - ys[i]) * (cl(d, 0, 5) - i);
};
export const LAYERS = [
	{name: 'épiderme', y0: SKIN.top, y1: SKIN.epi},
	{name: 'derme', y0: SKIN.epi, y1: SKIN.derm},
	{name: 'hypoderme (graisse)', y0: SKIN.derm, y1: SKIN.hypo},
	{name: 'muscle', y0: SKIN.hypo, y1: SKIN.musc},
	{name: 'os', y0: SKIN.musc, y1: SKIN.bone},
];

export type WoundShape = 'scrape' | 'cut' | 'tear' | 'pin' | 'bite' | 'crater';

/** Contour de la cavité (centre cx, surface y0, fond yb, demi-largeur hw). */
const cavity = (shape: WoundShape, d: number, open: number, cx = SKIN.cx): string[] => {
	const y0 = SKIN.top - 2;
	const yb = depthY(d);
	if (d <= 0.02) return [];
	const zig = (n: number, x0: number, x1: number, y: number, a: number) =>
		Array.from({length: n + 1}, (_, i) => `L${x0 + ((x1 - x0) * i) / n} ${y + (i % 2 ? a : -a)}`).join(' ');
	switch (shape) {
		case 'scrape': {
			const hw = 250 * open;
			return [`M${cx - hw} ${y0} C${cx - hw + 30} ${yb} ${cx - hw + 40} ${yb} ${cx - hw + 60} ${yb} ${zig(14, cx - hw + 60, cx + hw - 60, yb, 4)} C${cx + hw - 40} ${yb} ${cx + hw - 30} ${yb} ${cx + hw} ${y0} Z`];
		}
		case 'cut': {
			const hw = (14 + 6 * d) * open;
			return [`M${cx - hw} ${y0} L${cx - 3 * open} ${yb} L${cx + 3 * open} ${yb} L${cx + hw} ${y0} Z`];
		}
		case 'tear': {
			const hw = (50 + 8 * d) * open;
			const steps = 6;
			const left = Array.from({length: steps}, (_, i) => {
				const t = (i + 1) / steps;
				return `L${cx - hw * (1 - t) + (i % 2 ? -14 : 10) * (1 - t)} ${y0 + (yb - y0) * t}`;
			}).join(' ');
			const right = Array.from({length: steps}, (_, i) => {
				const t = 1 - (i + 1) / steps;
				return `L${cx + hw * (1 - t) + (i % 2 ? 12 : -10) * (1 - t)} ${y0 + (yb - y0) * t}`;
			}).join(' ');
			return [`M${cx - hw} ${y0} ${left} ${right} L${cx + hw} ${y0} Z`];
		}
		case 'pin': {
			const hw = 9 * open;
			return [`M${cx - hw} ${y0} L${cx - hw * 0.5} ${yb} L${cx + hw * 0.5} ${yb} L${cx + hw} ${y0} Z`];
		}
		case 'bite':
			return [-120, 0, 120].map((dx, i) => {
				const yy = depthY(d * (i === 1 ? 0.8 : 1));
				const hw = 16 * open;
				return `M${cx + dx - hw} ${y0} L${cx + dx - 4} ${yy} L${cx + dx + 4} ${yy} L${cx + dx + hw} ${y0} Z`;
			});
		case 'crater': {
			const hw = (60 + 26 * d) * open;
			const c = y0 + (yb - y0) / 0.75;
			return [`M${cx - hw} ${y0} C${cx - hw * 0.92} ${c} ${cx + hw * 0.92} ${c} ${cx + hw} ${y0} Z`];
		}
	}
};

export type SkinBlockProps = {
	width?: number;
	/** profondeur de la plaie 0 → 5 */
	depth?: number;
	shape?: WoundShape;
	/** ouverture (largeur) 0 → 1 (1 = normale ; > 1 = plaie étendue) */
	open?: number;
	/** points de suture qui referment la plaie 0 → 1 */
	sutured?: number;
	/** étiquettes des couches : nombre visible (0 → 5) et couche en rose */
	labels?: number;
	focus?: number;
	/** microbes qui entrent 0 → 1 (0 : ils tournent au-dessus de la peau intacte) ; `germs` : opacité */
	germs?: number;
	microbes?: number;
	/** saleté (grains) dans la plaie */
	dirt?: number;
	/** nerfs visibles, douleur (éclairs), nerfs détruits */
	nerves?: number;
	pain?: number;
	nervesBurnt?: number;
	/** brûlure 0 → 3 (1er, 2e, 3e degré) */
	burn?: number;
	/** cloque (phlyctène) 0 → 1 */
	blister?: number;
	/** rougeur de surface (escarre stade 1) et doigt qui appuie */
	redness?: number;
	press?: number;
	/** cicatrisation : la plaie se referme 0 → 1 */
	heal?: number;
};

/** Coupe de peau animée. */
export const SkinBlock: React.FC<SkinBlockProps> = ({
	width = 900,
	depth = 0,
	shape = 'crater',
	open = 1,
	sutured = 0,
	labels = 0,
	focus = -1,
	germs = 0,
	microbes = 0,
	dirt = 0,
	nerves = 0,
	pain = 0,
	nervesBurnt = 0,
	burn = 0,
	blister = 0,
	redness = 0,
	press = 0,
	heal = 0,
}) => {
	const frame = useCurrentFrame();
	const {w, h, top, epi, derm, hypo, musc, cx} = SKIN;
	const id = React.useId().replace(/:/g, '');
	const o = open * (1 - 0.92 * sutured) * (1 - heal);
	const d = depth * (1 - 0.5 * heal);
	const holes = cavity(shape, d, Math.max(0.04, o));
	const b1 = cl(burn);
	const b2 = cl(burn - 1);
	const b3 = cl(burn - 2);
	const bl = Math.max(blister, b2) * (1 - b3);
	const yb = depthY(d);
	const nerveX = [250, 640, 760];
	return (
		<svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`blk${id}`}>
					<path d={`M0 ${top} H${w} V${h - 30} Q${w} ${h} ${w - 30} ${h} H30 Q0 ${h} 0 ${h - 30} Z`} />
				</clipPath>
				<mask id={`hole${id}`}>
					<rect x={-50} y={-50} width={w + 100} height={h + 100} fill="#fff" />
					{holes.map((p, i) => (
						<path key={i} d={p} fill="#000" />
					))}
				</mask>
			</defs>
			<g clipPath={`url(#blk${id})`}>
				<g mask={`url(#hole${id})`}>
					{/* os */}
					<rect x={0} y={musc} width={w} height={h - musc} fill={LPI.paper} />
					{Array.from({length: 26}, (_, i) => (
						<circle key={i} cx={20 + ((i * 137) % 870)} cy={musc + 22 + ((i * 53) % 70)} r={6 + (i % 3) * 3} fill="none" stroke={alpha(N, 0.22)} strokeWidth={3} />
					))}
					{/* muscle */}
					<rect x={0} y={hypo} width={w} height={musc - hypo} fill={alpha(LPI.blue, 0.5)} />
					{Array.from({length: 6}, (_, i) => (
						<path key={i} d={`M0 ${hypo + 14 + i * 16} C${w * 0.3} ${hypo + 8 + i * 16} ${w * 0.6} ${hypo + 22 + i * 16} ${w} ${hypo + 12 + i * 16}`} fill="none" stroke={alpha(N, 0.2)} strokeWidth={3} />
					))}
					{/* hypoderme : lobules de graisse */}
					<rect x={0} y={derm} width={w} height={hypo - derm} fill={LPI.paper} />
					{Array.from({length: 40}, (_, i) => {
						const row = Math.floor(i / 10);
						return <circle key={i} cx={(i % 10) * 92 + (row % 2) * 46 + 20} cy={derm + 18 + row * 30} r={17} fill={alpha(LPI.sky, 0.75)} stroke={alpha(N, 0.25)} strokeWidth={3} />;
					})}
					{/* derme : rose, petits vaisseaux */}
					<rect x={0} y={epi} width={w} height={derm - epi} fill={alpha(LPI.pink, 0.45)} />
					{Array.from({length: 7}, (_, i) => (
						<path key={i} d={`M${40 + i * 130} ${derm - 6} C${40 + i * 130} ${epi + 20} ${100 + i * 130} ${epi + 20} ${100 + i * 130} ${derm - 6}`} fill="none" stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" />
					))}
					{/* épiderme */}
					<rect x={0} y={top} width={w} height={epi - top} fill={LPI.paper} />
					<rect x={0} y={top} width={w} height={epi - top} fill={alpha(LPI.pink, 0.22)} />
					{/* séparations des couches */}
					{[epi, derm, hypo, musc].map((y) => (
						<line key={y} x1={0} x2={w} y1={y} y2={y} stroke={alpha(N, 0.3)} strokeWidth={3} />
					))}
					{/* nerfs : de l'hypoderme jusque sous l'épiderme */}
					{nerves > 0
						? nerveX.map((x, i) => (
								<g key={i} opacity={nerves * (1 - 0.65 * nervesBurnt)}>
									<path d={`M${x - 30} ${hypo - 4} C${x - 10} ${derm + 10} ${x + 20} ${derm - 30} ${x} ${epi + 14}`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" strokeDasharray={nervesBurnt > 0.5 ? '10 12' : undefined} />
									<circle cx={x} cy={epi + 12} r={8} fill={LPI.sky} stroke={N} strokeWidth={4} />
								</g>
							))
						: null}
					{/* brûlure */}
					{b1 > 0 ? <rect x={150} y={top} width={600} height={epi - top + 40} fill={alpha(LPI.pink, 0.75 * b1 * (1 - b3))} /> : null}
					{b2 > 0 ? <rect x={220} y={epi} width={460} height={derm - epi} fill={alpha(LPI.pink, 0.4 * b2 * (1 - b3))} /> : null}
					{b3 > 0 ? (
						<g opacity={b3}>
							<path d={`M180 ${top} H720 V${derm + 10} ${Array.from({length: 12}, (_, i) => `L${720 - (i + 1) * 45} ${derm + 30 + (i % 2 ? 14 : -6)}`).join(' ')} L180 ${derm + 10} Z`} fill={N} />
							{[230, 330, 450, 560, 660].map((x, i) => (
								<path key={x} d={`M${x} ${top + 8} l${18 - i * 4} 36 l-14 30 l20 40`} fill="none" stroke={alpha(LPI.paper, 0.6)} strokeWidth={4} strokeLinecap="round" />
							))}
						</g>
					) : null}
					{/* rougeur (escarre stade 1) */}
					{redness > 0 ? (
						<>
							<ellipse cx={cx} cy={top + 12} rx={170} ry={26} fill={alpha(LPI.pink, 0.9 * redness)} />
							<ellipse cx={cx} cy={epi + 26} rx={150} ry={36} fill={alpha(LPI.pink, 0.55 * redness)} />
						</>
					) : null}
				</g>
				{/* cavité : tissu à vif sur les bords, fond rosé */}
				{holes.map((p, i) => (
					<g key={i}>
						<path d={p} fill={alpha(LPI.pink, 0.16)} />
						<path d={p} fill="none" stroke={LPI.pink} strokeWidth={12} strokeLinejoin="round" />
						<path d={p} fill="none" stroke={N} strokeWidth={4} strokeLinejoin="round" />
					</g>
				))}
				{/* saleté dans la plaie */}
				{dirt > 0
					? Array.from({length: 12}, (_, i) => <circle key={i} cx={cx - 70 + ((i * 47) % 140)} cy={Math.min(yb - 6, top + 14 + ((i * 29) % Math.max(10, yb - top - 10)))} r={5 + (i % 3) * 3} fill={N} opacity={dirt} />)
					: null}
			</g>
			{/* contour du bloc */}
			<path d={`M0 ${top} V${h - 30} Q0 ${h} 30 ${h} H${w - 30} Q${w} ${h} ${w} ${h - 30} V${top}`} fill="none" stroke={N} strokeWidth={6} strokeLinejoin="round" />
			<path d={`M0 ${top} H${w}`} stroke={N} strokeWidth={5} mask={`url(#hole${id})`} />
			{/* cloque (phlyctène) : l'épiderme se soulève, du liquide dessous */}
			{bl > 0 ? (
				<g>
					<path d={`M300 ${top + 1} Q${cx} ${top - 150 * bl} 600 ${top + 1} Z`} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={5} />
					<path d={`M300 ${top + 1} Q${cx} ${top - 150 * bl} 600 ${top + 1}`} fill="none" stroke={alpha(LPI.pink, 0.8)} strokeWidth={9} />
					<path d={`M370 ${top - 36 * bl} Q405 ${top - 62 * bl} 440 ${top - 68 * bl}`} fill="none" stroke={LPI.paper} strokeWidth={8} strokeLinecap="round" opacity={bl} />
				</g>
			) : null}
			{/* points de suture */}
			{sutured > 0
				? [-1, 0, 1].map((k) => {
						const s = cl(sutured * 3 - (k + 1));
						return s > 0 ? <path key={k} d={`M${cx - 34} ${top + 30 + k * 0} C${cx - 30} ${top - 26} ${cx + 30} ${top - 26} ${cx + 34} ${top + 30}`} transform={`translate(${k * 70} 0)`} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${s} 1`} /> : null;
					})
				: null}
			{/* douleur : éclairs autour des terminaisons nerveuses */}
			{pain > 0 && nerves > 0
				? nerveX.map((x, i) => {
						const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 2);
						return <path key={i} d={`M${x - 26} ${epi - 34} l12 14 l-10 6 l16 16 M${x + 26} ${epi - 38} l-10 16 l12 4 l-12 18`} fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={pain * (0.4 + 0.6 * f)} />;
					})
				: null}
			{/* doigt qui appuie */}
			{press > 0 ? (
				<g transform={`translate(${cx} ${top - 4 - (1 - press) * 120})`} opacity={cl(press * 3)}>
					<path d="M-52 -170 V-40 C-52 4 52 4 52 -40 V-170" fill={LPI.paper} stroke={N} strokeWidth={6} />
					<path d="M-52 -170 V-40 C-52 4 52 4 52 -40 V-170" fill={alpha(LPI.pink, 0.28)} />
					<path d="M-30 -112 Q0 -100 30 -112 M-30 -126 Q0 -114 30 -126" fill="none" stroke={alpha(N, 0.35)} strokeWidth={4} strokeLinecap="round" />
				</g>
			) : null}
			{/* microbes : ils tournent au-dessus de la peau, puis plongent dans la plaie */}
			{germs > 0
				? Array.from({length: 7}, (_, i) => {
						const t = cl(microbes * 1.4 - i * 0.06);
						const x0 = 120 + i * 110;
						const y0 = top - 34 - (i % 3) * 16 + Math.sin(frame / 6 + i) * 8;
						const tx = cx + ((i % 3) - 1) * 18 * open;
						const ty = Math.max(top + 10, yb - 18 - (i % 3) * 14);
						const x = x0 + (tx - x0) * t + Math.sin(frame / 5 + i) * 6 * (1 - t);
						const y = y0 + (ty - y0) * t * t;
						return (
							<g key={i} transform={`translate(${x} ${y}) rotate(${frame * 3 + i * 50})`} opacity={germs}>
								<path d="M-14 0 q-8 -6 -14 0 M14 0 q8 6 14 0 M0 -9 q-4 -8 0 -14" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" />
								<ellipse rx={14} ry={9} fill={LPI.blue} stroke={N} strokeWidth={4} />
								<circle cx={-4} cy={-2} r={2.5} fill={LPI.paper} />
							</g>
						);
					})
				: null}
		</svg>
	);
};

/** Étiquettes des couches (à poser par-dessus le bloc, mêmes x / y / largeur). */
export const SkinLabels: React.FC<{width: number; labels: number; focus?: number; side?: 'left' | 'right'}> = ({width, labels, focus = -1, side = 'left'}) => {
	const k = width / SKIN.w;
	return (
		<>
			{LAYERS.map((l, i) => {
				const o = cl(labels - i);
				if (o <= 0) return null;
				const on = i === focus;
				return (
					<div
						key={l.name}
						style={{
							position: 'absolute',
							[side]: 16 * k,
							top: ((l.y0 + l.y1) / 2) * k,
							transform: `translateY(-50%) scale(${0.7 + 0.3 * o * (on ? 1.08 : 1)})`,
							transformOrigin: side === 'left' ? 'left center' : 'right center',
							opacity: o,
							padding: '4px 16px',
							borderRadius: 999,
							background: on ? LPI.pink : alpha(LPI.paper, 0.94),
							border: `4px solid ${N}`,
							fontFamily: 'inherit',
							fontWeight: 900,
							fontSize: Math.max(22, 30 * k),
							color: N,
							whiteSpace: 'nowrap',
						}}
					>
						{l.name}
					</div>
				);
			})}
		</>
	);
};

/* ───────────── escarre : la peau écrasée entre l'os et le matelas ───────────── */

/** Repère 900 × 500 : os (sacrum) en haut qui appuie, tissus écrasés, matelas en bas. */
export const Squeeze: React.FC<{width?: number; press: number; dead: number; flow?: number}> = ({width = 900, press, dead, flow = 1}) => {
	const frame = useCurrentFrame();
	const tip = 190 + 46 * press;
	const mat = 370 + 22 * press;
	const vessel = (y: number, i: number) => {
		// les petits vaisseaux s'aplatissent sous la pointe de l'os
		const pts = Array.from({length: 31}, (_, k) => {
			const x = k * 30;
			const near = Math.exp(-(((x - 450) / 170) ** 2));
			const yy = y + Math.sin(k * 0.9 + i) * 10 * (1 - near * press) + near * press * (i === 0 ? 30 : i === 2 ? -24 : 0);
			return `${k ? 'L' : 'M'}${x} ${yy}`;
		});
		return pts.join(' ');
	};
	return (
		<svg width={width} height={(width * 500) / 900} viewBox="0 0 900 500" style={{overflow: 'visible', display: 'block'}}>
			{/* matelas */}
			<path d={`M0 ${mat - 20 * press} Q450 ${mat + 26 * press} 900 ${mat - 20 * press} V490 H0 Z`} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={6} />
			{[150, 300, 450, 600, 750].map((x) => (
				<line key={x} x1={x} x2={x} y1={mat + 24} y2={480} stroke={alpha(N, 0.3)} strokeWidth={4} strokeDasharray="10 10" />
			))}
			{/* tissus mous (peau + graisse) entre l'os et le matelas */}
			<path d={`M0 160 Q260 ${160 + 10 * press} 330 ${150 + 30 * press} Q450 ${tip + 6} 570 ${150 + 30 * press} Q640 ${160 + 10 * press} 900 160 V${mat - 20 * press} Q450 ${mat + 26 * press} 0 ${mat - 20 * press} Z`} fill={alpha(LPI.pink, 0.42)} stroke={N} strokeWidth={5} />
			{[0, 1, 2].map((i) => (
				<g key={i}>
					<path d={vessel(220 + i * 46, i)} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
					{/* globules qui circulent, sauf sous la zone écrasée */}
					{Array.from({length: 8}, (_, k) => {
						const x = ((frame * 4 * flow + k * 115 + i * 40) % 900) as number;
						const near = Math.exp(-(((x - 450) / 150) ** 2));
						return <circle key={k} cx={x} cy={220 + i * 46 + Math.sin(x / 30 + i) * 6 * (1 - near * press)} r={6} fill={N} opacity={(1 - near * press) * 0.7} />;
					})}
				</g>
			))}
			{/* zone qui meurt faute de sang */}
			{dead > 0 ? <path d={`M330 ${tip + 10} C340 ${tip + 120} 560 ${tip + 120} 570 ${tip + 10} C520 ${tip - 6} 380 ${tip - 6} 330 ${tip + 10} Z`} fill={alpha(N, 0.85 * dead)} /> : null}
			{/* os (sacrum) */}
			<path d={`M250 0 H650 V60 C650 120 540 ${tip - 40} 450 ${tip} C360 ${tip - 40} 250 120 250 60 Z`} fill={LPI.paper} stroke={N} strokeWidth={6} transform={`translate(0 ${-30 + 30 * press})`} />
			{Array.from({length: 10}, (_, i) => (
				<circle key={i} cx={300 + ((i * 83) % 300)} cy={20 + ((i * 37) % 80) + 30 * press} r={7} fill="none" stroke={alpha(N, 0.25)} strokeWidth={3} />
			))}
			{[
				['os (sacrum)', 450, 56 + 30 * press, LPI.paper],
				['peau et graisse', 150, 200, alpha(LPI.paper, 0.9)],
				['matelas', 760, 446, alpha(LPI.paper, 0.9)],
			].map(([t, x, y, bg]) => (
				<g key={t as string} transform={`translate(${x} ${y})`}>
					<rect x={-((t as string).length * 9 + 18)} y={-22} width={(t as string).length * 18 + 36} height={44} rx={22} fill={bg as string} stroke={N} strokeWidth={4} />
					<text textAnchor="middle" y={10} fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>
						{t}
					</text>
				</g>
			))}
		</svg>
	);
};

/* ───────────── patient couché : points d'appui ───────────── */

/** Repère 900 × 300 : patient couché sur le dos (de profil), tête à gauche. */
export const LYING_PTS = {occiput: [96, 214], scapula: [255, 218], sacrum: [515, 222], heel: [848, 214]} as const;
export type LyingPoint = keyof typeof LYING_PTS;

export const LyingBody: React.FC<{width?: number; points?: number; focus?: LyingPoint[]}> = ({width = 900, points = 0, focus = []}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 300) / 900} viewBox="0 0 900 300" style={{overflow: 'visible', display: 'block'}}>
			{/* matelas */}
			<rect x={10} y={222} width={880} height={56} rx={22} fill={alpha(LPI.sky, 0.85)} stroke={N} strokeWidth={6} />
			<rect x={30} y={186} width={150} height={40} rx={18} fill={LPI.paper} stroke={N} strokeWidth={5} />
			{/* jambes */}
			<path d="M520 150 C600 140 700 160 820 168 C850 170 860 196 846 218 C780 222 640 222 540 222 Z" fill={LPI.paper} stroke={N} strokeWidth={6} strokeLinejoin="round" />
			<path d="M520 150 C600 140 700 160 820 168 C850 170 860 196 846 218 C780 222 640 222 540 222 Z" fill={alpha(LPI.pink, 0.25)} />
			{/* pied (orteils vers le haut) */}
			<path d="M830 170 C836 130 856 112 872 120 C884 128 878 170 866 212 C858 222 842 222 834 214 Z" fill={LPI.paper} stroke={N} strokeWidth={6} />
			{/* tronc (blouse bleue) */}
			<path d="M170 140 C260 118 420 118 520 132 C560 140 574 190 552 222 L190 224 C160 210 156 160 170 140 Z" fill={LPI.blue} stroke={N} strokeWidth={6} strokeLinejoin="round" />
			{/* bras le long du corps */}
			<path d="M230 168 C320 170 400 176 470 182" fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
			<path d="M230 168 C320 170 400 176 470 182" fill="none" stroke={LPI.paper} strokeWidth={18} strokeLinecap="round" />
			{/* tête */}
			<circle cx={110} cy={166} r={56} fill={LPI.paper} stroke={N} strokeWidth={6} />
			<circle cx={110} cy={166} r={56} fill={alpha(LPI.pink, 0.22)} />
			<path d="M60 150 C70 100 140 94 164 130 C140 120 100 120 70 168 Z" fill={N} />
			<path d="M130 176 Q140 182 150 176" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			<path d="M126 150 L144 150" stroke={N} strokeWidth={5} strokeLinecap="round" />
			{/* points d'appui */}
			{points > 0
				? (Object.keys(LYING_PTS) as LyingPoint[]).map((k, i) => {
						const [x, y] = LYING_PTS[k];
						const on = focus.includes(k);
						const p = 0.5 + 0.5 * Math.sin(frame / 4 + i);
						return (
							<g key={k} opacity={points}>
								<circle cx={x} cy={y} r={(on ? 34 : 22) + 8 * p} fill={alpha(LPI.pink, on ? 0.45 : 0.25)} />
								<circle cx={x} cy={y} r={on ? 16 : 11} fill={LPI.pink} stroke={N} strokeWidth={4} />
							</g>
						);
					})
				: null}
		</svg>
	);
};

/* ───────────── jambe de profil ───────────── */

/** Repère 500 × 700 : jambe droite de profil (orteils à droite). */
export const LEG_PTS = {calf: [150, 260], ankle: [214, 470], heel: [128, 628], sole: [372, 662], toes: [462, 620]} as const;

export const LowerLeg: React.FC<{
	width?: number;
	/** varices et sang qui stagne */
	veins?: number;
	stasis?: number;
	/** ulcère à la cheville */
	ulcer?: number;
	/** petite plaie sous le pied, qui grandit (`grow`) et s'infecte en silence (`silent`) */
	footSore?: number;
	grow?: number;
	silent?: number;
	/** le message de douleur ne remonte plus */
	numb?: number;
	nerve?: number;
	/** escarre du talon */
	heelSore?: number;
}> = ({width = 500, veins = 0, stasis = 0, ulcer = 0, footSore = 0, grow = 0, silent = 0, numb = 0, nerve = 0, heelSore = 0}) => {
	const frame = useCurrentFrame();
	const LEG = 'M150 0 C96 120 84 260 140 420 C160 470 150 540 120 590 C98 640 130 664 182 662 L404 662 C456 662 482 640 470 614 C458 590 420 584 382 570 C322 546 292 502 282 462 C270 380 280 200 292 0 Z';
	const sore = footSore * (1 + 0.9 * grow);
	return (
		<svg width={width} height={(width * 700) / 500} viewBox="0 0 500 700" style={{overflow: 'visible', display: 'block'}}>
			<path d={LEG} fill={LPI.paper} stroke={N} strokeWidth={7} strokeLinejoin="round" />
			<path d={LEG} fill={alpha(LPI.pink, 0.25)} />
			{/* malléole */}
			<path d="M196 460 C206 444 232 444 240 462" fill="none" stroke={alpha(N, 0.5)} strokeWidth={5} strokeLinecap="round" />
			{/* orteils */}
			<path d="M440 600 L446 640 M418 594 L424 640" stroke={alpha(N, 0.4)} strokeWidth={4} strokeLinecap="round" />
			{/* varices + sang qui ralentit */}
			{veins > 0 ? (
				<g opacity={veins}>
					<path d="M200 60 C170 110 230 150 196 200 C164 248 226 286 190 330 C160 370 214 400 200 440" fill="none" stroke={LPI.blue} strokeWidth={14} strokeLinecap="round" />
					<circle cx={186} cy={176} r={16} fill={LPI.blue} />
					<circle cx={206} cy={300} r={14} fill={LPI.blue} />
					{Array.from({length: 6}, (_, k) => {
						const speed = 1 - 0.85 * stasis;
						const t = ((frame * 0.012 * speed + k / 6) % 1) as number;
						const y = 440 - t * 380;
						return <circle key={k} cx={200 + Math.sin(y / 40) * 22} cy={y} r={6} fill={LPI.paper} opacity={0.9} />;
					})}
				</g>
			) : null}
			{/* ulcère de jambe (au-dessus de la malléole) */}
			{ulcer > 0 ? (
				<g transform={`translate(214 410) scale(${ulcer})`}>
					<ellipse rx={48} ry={30} fill={LPI.pink} stroke={N} strokeWidth={6} />
					<ellipse rx={28} ry={16} cx={4} cy={2} fill={alpha(N, 0.35)} />
				</g>
			) : null}
			{/* escarre du talon */}
			{heelSore > 0 ? (
				<g transform={`translate(126 618) scale(${heelSore})`}>
					<ellipse rx={30} ry={38} fill={LPI.pink} stroke={N} strokeWidth={6} />
					<ellipse rx={16} ry={22} fill={N} opacity={0.85} />
				</g>
			) : null}
			{/* nerf : la douleur remonte… ou pas */}
			{nerve > 0 ? (
				<g opacity={nerve}>
					<path d="M372 650 C330 600 270 560 250 470 C236 380 250 200 250 10" fill="none" stroke={N} strokeWidth={5} strokeDasharray="14 10" />
					{Array.from({length: 4}, (_, k) => {
						const t = ((frame * 0.03 + k / 4) % 1) as number;
						const stop = 0.32;
						if (numb > 0.5 && t > stop) return null;
						const y = 650 - t * 640;
						const x = t < 0.3 ? 372 - t * 400 : 252;
						return <circle key={k} cx={x} cy={y} r={10} fill={LPI.pink} stroke={N} strokeWidth={3} />;
					})}
					{numb > 0 ? (
						<g transform="translate(252 440)" opacity={numb}>
							<circle r={34} fill={LPI.paper} stroke={LPI.pink} strokeWidth={7} />
							<path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
						</g>
					) : null}
				</g>
			) : null}
			{/* plaie sous le pied (mal perforant) qui s'infecte en silence */}
			{footSore > 0 ? (
				<g transform={`translate(372 660)`}>
					{silent > 0 ? <ellipse rx={70 * sore} ry={34 * sore} fill={alpha(N, 0.25 * silent)} /> : null}
					<ellipse rx={24 * sore} ry={12 * sore} fill={LPI.pink} stroke={N} strokeWidth={5} />
					<ellipse rx={10 * sore} ry={5 * sore} fill={N} opacity={0.6 * silent} />
				</g>
			) : null}
		</svg>
	);
};

/* ───────────── doigt et coupure de papier ───────────── */

/** Repère 520 × 260 : index tendu vers la droite ; `cut` : coupure de papier ; `heal` : elle se referme. */
export const Finger: React.FC<{width?: number; cut: number; heal?: number}> = ({width = 520, cut, heal = 0}) => {
	const F = 'M0 64 L360 56 C460 52 512 96 508 140 C504 190 452 208 372 204 L0 198 Z';
	const o = cut * (1 - heal);
	return (
		<svg width={width} height={(width * 260) / 520} viewBox="0 0 520 260" style={{overflow: 'visible', display: 'block'}}>
			<path d={F} fill={LPI.paper} stroke={N} strokeWidth={7} strokeLinejoin="round" />
			<path d={F} fill={alpha(LPI.pink, 0.3)} />
			<path d="M392 60 C450 58 486 84 492 112 L418 116 C404 104 396 84 392 60 Z" fill={LPI.paper} stroke={N} strokeWidth={5} />
			<path d="M150 70 Q160 130 150 194 M168 70 Q178 130 168 194 M290 62 Q300 130 290 200" fill="none" stroke={alpha(N, 0.25)} strokeWidth={4} />
			{o > 0 ? (
				<g opacity={o}>
					<path d="M318 186 L392 128" stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" />
					<path d="M318 186 L392 128" stroke={N} strokeWidth={4} strokeLinecap="round" />
					<circle cx={330} cy={204} r={7} fill={LPI.pink} opacity={cl(cut * 2 - 1)} />
					<circle cx={346} cy={220} r={5} fill={LPI.pink} opacity={cl(cut * 2 - 1)} />
				</g>
			) : null}
			{heal > 0 ? <path d="M318 186 L392 128" stroke={alpha(LPI.pink, 0.35 * (1 - heal * 0.6))} strokeWidth={4} strokeLinecap="round" /> : null}
		</svg>
	);
};

/* ───────────── objets qui blessent ───────────── */

export type ToolKind = 'gravel' | 'knife' | 'tear' | 'nail' | 'teeth' | 'scalpel';

/** Objet (repère 200 × 200, centré). `bite` : la mâchoire se referme (dents). */
export const WoundTool: React.FC<{kind: ToolKind; size?: number; bite?: number}> = ({kind, size = 200, bite = 0}) => {
	const s = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
	const body = {
		gravel: (
			<>
				<path d="M40 66 H150 M134 50 L152 66 L134 82" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
				<path d="M8 120 H48 M0 146 H36 M14 170 H44" stroke={alpha(N, 0.4)} strokeWidth={7} strokeLinecap="round" />
				<path d="M58 176 L64 140 L92 126 L114 146 L108 178 Z" fill={LPI.sky} {...s} />
				<path d="M114 178 L122 150 L148 144 L162 166 L152 180 Z" fill={LPI.paper} {...s} />
				<path d="M162 180 L170 160 L190 158 L198 180 Z" fill={LPI.sky} {...s} />
			</>
		),
		knife: (
			<>
				<path d="M20 110 L130 82 C160 76 186 84 192 96 L40 128 Z" fill={LPI.paper} {...s} />
				<rect x={-50} y={104} width={80} height={34} rx={12} fill={LPI.blue} transform="rotate(-12 0 120)" {...s} />
				<circle cx={-24} cy={126} r={5} fill={LPI.paper} />
				<circle cx={2} cy={120} r={5} fill={LPI.paper} />
			</>
		),
		tear: (
			<>
				<path d="M100 30 L88 60 L112 84 L90 112 L114 140 L96 170" fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
				<path d="M70 100 H16 M30 84 L14 100 L30 116" fill="none" {...s} />
				<path d="M130 100 H184 M170 84 L186 100 L170 116" fill="none" {...s} />
			</>
		),
		nail: (
			<>
				<rect x={60} y={10} width={80} height={22} rx={8} fill={LPI.sky} {...s} />
				<path d="M88 32 H112 L104 176 L100 192 L96 176 Z" fill={LPI.paper} {...s} />
			</>
		),
		teeth: (
			<>
				<path d="M10 60 Q100 -10 190 60 L180 78 Q100 20 20 78 Z" fill={LPI.pink} {...s} />
				{[34, 66, 100, 134, 166].map((x, i) => (
					<path key={i} d={`M${x - 15} ${68 - (i === 2 ? 14 : i % 2 ? 8 : 0)} L${x} ${106 + bite * 30} L${x + 15} ${68 - (i === 2 ? 14 : i % 2 ? 8 : 0)} Z`} fill={LPI.paper} {...s} strokeWidth={5} />
				))}
			</>
		),
		scalpel: (
			<>
				<rect x={10} y={88} width={110} height={26} rx={10} fill={LPI.sky} {...s} />
				<path d="M120 92 L180 80 C196 84 196 104 176 112 L120 112 Z" fill={LPI.paper} {...s} />
			</>
		),
	}[kind];
	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}}>
			{body}
		</svg>
	);
};

/* ───────────── pictos de gravité ───────────── */

export const DepthGlyph: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 30 H86 M30 30 L50 82 L70 30" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
export const WideGlyph: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M14 50 H86 M28 36 L14 50 L28 64 M72 36 L86 50 L72 64" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
export const GermGlyph: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M50 18 V30 M50 70 V82 M18 50 H30 M70 50 H82 M28 28 L36 36 M64 64 L72 72 M72 28 L64 36 M36 64 L28 72" stroke={N} strokeWidth={7} strokeLinecap="round" />
		<circle cx={50} cy={50} r={20} fill={LPI.blue} stroke={N} strokeWidth={7} />
	</svg>
);
export const ZoneGlyph: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={32} fill="none" stroke={N} strokeWidth={8} />
		<circle cx={50} cy={50} r={13} fill={LPI.pink} stroke={N} strokeWidth={6} />
	</svg>
);

/* ───────────── mise en place dans un socle ───────────── */

/** Coupe de peau posée en (x, y), largeur w. */
export type SkinBox = {x: number; y: number; w: number};
/** point de la coupe (repère 900 × 500) → coordonnées du socle */
export const skinPt = (b: SkinBox, x: number, y: number) => ({x: b.x + (x * b.w) / SKIN.w, y: b.y + (y * b.w) / SKIN.w});
export const SkinAt: React.FC<{b: SkinBox} & SkinBlockProps> = ({b, ...p}) => (
	<div style={{position: 'absolute', left: b.x, top: b.y}}>
		<SkinBlock width={b.w} {...p} />
	</div>
);
