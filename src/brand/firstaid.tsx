// Trousse de secours de la maison : la trousse (couvercle qui s'ouvre, cases qui se remplissent, vide avec un papillon
// de nuit et de la poussière), les objets à mettre dedans (`KitItem`), la cuisine de l'accroche (planche, tomate) et la
// carte des numéros d'urgence. Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Hand, AntisepticBottle, Gauze, Plaster} from './sampling';
import {ThermoStick} from './kids';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const S = {stroke: N, strokeWidth: 6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export type KitKind = 'serum' | 'antiseptic' | 'gauze' | 'plaster' | 'bandage' | 'tape' | 'gloves' | 'scissors' | 'tweezers' | 'thermo' | 'paracetamol' | 'blanket' | 'numbers';

/** Un objet de la trousse, centré dans un carré de `size` px. */
export const KitItem: React.FC<{kind: KitKind; size?: number}> = ({kind, size = 200}) => {
	const box = (child: React.ReactNode) => <div style={{width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{child}</div>;
	const svg = (child: React.ReactNode) => (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}}>
			{child}
		</svg>
	);
	switch (kind) {
		case 'antiseptic':
			return box(<AntisepticBottle size={size * 0.75} />);
		case 'gauze':
			return box(<Gauze size={size * 0.85} sterile />);
		case 'plaster':
			return box(<Plaster size={size * 0.95} />);
		case 'gloves':
			return box(<Hand size={size * 0.85} gloved={1} />);
		case 'thermo':
			return box(<ThermoStick width={size} value="37,0" />);
		case 'serum':
			return svg(
				<>
					{[40, 100, 160].map((x, i) => (
						<g key={i} transform={`translate(${x} ${110 + (i % 2) * 6})`}>
							<rect x={-22} y={-50} width={44} height={96} rx={16} fill={alpha(LPI.sky, 0.9)} {...S} />
							<path d="M-10 -50 V-66 H10 V-50 M-14 -66 H14" fill={LPI.paper} {...S} strokeWidth={5} />
							<rect x={-14} y={-14} width={28} height={30} rx={6} fill={LPI.paper} stroke={N} strokeWidth={3} />
							<path d="M-7 0 H7 M0 -7 V7" stroke={LPI.blue} strokeWidth={4} strokeLinecap="round" />
						</g>
					))}
				</>,
			);
		case 'bandage':
			return svg(
				<>
					{/* rouleau de bande vu de côté + la bande qui se déroule */}
					<path d="M70 120 H186 V160 H70 Z" fill={LPI.paper} {...S} strokeWidth={5} />
					<path d="M86 132 H180 M86 146 H180" stroke={alpha(LPI.sky, 0.9)} strokeWidth={4} />
					<rect x={40} y={50} width={90} height={100} rx={14} fill={LPI.paper} {...S} />
					<ellipse cx={130} cy={100} rx={18} ry={50} fill={LPI.paper} {...S} />
					<ellipse cx={130} cy={100} rx={6} ry={18} fill={alpha(N, 0.3)} />
					{[70, 90, 110].map((x) => (
						<line key={x} x1={x} x2={x} y1={56} y2={144} stroke={alpha(LPI.sky, 0.9)} strokeWidth={5} />
					))}
				</>,
			);
		case 'tape':
			return svg(
				<>
					{/* rouleau de sparadrap : anneau épais, le ruban qui pend */}
					<rect x={90} y={136} width={106} height={34} rx={4} fill={LPI.paper} {...S} strokeWidth={5} />
					<path d="M196 136 l-8 8 l8 8 l-8 9 l8 9" fill="none" stroke={N} strokeWidth={4} />
					<circle cx={90} cy={96} r={74} fill={LPI.pink} {...S} />
					<circle cx={90} cy={96} r={30} fill={LPI.paper} {...S} />
					<circle cx={90} cy={96} r={52} fill="none" stroke={alpha(LPI.paper, 0.55)} strokeWidth={7} />
				</>,
			);
		case 'scissors':
			return svg(
				<>
					<path d="M92 104 L176 40 Q186 46 180 56 L104 114 Z" fill={LPI.paper} {...S} />
					<path d="M92 96 L176 160 Q186 154 180 144 L104 86 Z" fill={LPI.paper} {...S} />
					<circle cx={180} cy={48} r={8} fill={LPI.paper} stroke={N} strokeWidth={4} />
					<circle cx={180} cy={152} r={8} fill={LPI.paper} stroke={N} strokeWidth={4} />
					<circle cx={52} cy={64} r={30} fill="none" stroke={LPI.pink} strokeWidth={14} />
					<circle cx={52} cy={136} r={30} fill="none" stroke={LPI.pink} strokeWidth={14} />
					<circle cx={52} cy={64} r={30} fill="none" stroke={N} strokeWidth={4} />
					<circle cx={52} cy={136} r={30} fill="none" stroke={N} strokeWidth={4} />
					<path d="M78 80 L100 100 L78 120" fill="none" stroke={N} strokeWidth={10} strokeLinecap="round" />
					<circle cx={100} cy={100} r={7} fill={N} />
				</>,
			);
		case 'tweezers':
			return svg(
				<>
					<path d="M30 92 L180 82 L182 90 L40 100 Z" fill={LPI.sky} {...S} strokeWidth={5} />
					<path d="M30 108 L180 118 L182 110 L40 100 Z" fill={LPI.sky} {...S} strokeWidth={5} />
					<rect x={18} y={90} width={26} height={20} rx={6} fill={LPI.blue} stroke={N} strokeWidth={5} />
				</>,
			);
		case 'paracetamol':
			return svg(
				<>
					<rect x={20} y={50} width={130} height={100} rx={12} fill={LPI.paper} {...S} />
					<rect x={20} y={50} width={130} height={30} rx={12} fill={LPI.blue} {...S} />
					<path d="M60 110 H110 M85 92 V128" stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" />
					<rect x={110} y={96} width={80} height={70} rx={10} fill={alpha(LPI.sky, 0.95)} {...S} strokeWidth={5} />
					{[0, 1, 2, 3].map((i) => (
						<circle key={i} cx={130 + (i % 2) * 40} cy={116 + Math.floor(i / 2) * 30} r={11} fill={LPI.paper} stroke={N} strokeWidth={4} />
					))}
				</>,
			);
		case 'blanket':
			return svg(
				<>
					<rect x={30} y={50} width={140} height={100} rx={10} fill={LPI.sky} {...S} />
					<path d="M30 80 H170 M30 110 H170 M80 50 V150 M120 50 V150" stroke={alpha(N, 0.35)} strokeWidth={4} />
					<path d="M44 62 L70 62 M126 124 L156 124" stroke={LPI.paper} strokeWidth={8} strokeLinecap="round" />
					<path d="M30 50 L170 150" stroke={alpha(LPI.paper, 0.8)} strokeWidth={10} strokeLinecap="round" />
				</>,
			);
		case 'numbers':
			return <EmergencyCard width={size * 1.1} />;
	}
};

/** Carte des numéros d'urgence. `on` 0 → 4 : les lignes s'allument une à une. */
export const EmergencyCard: React.FC<{width?: number; on?: number}> = ({width = 420, on = 4}) => {
	const rows: [string, string][] = [
		['15', 'SAMU'],
		['18', 'pompiers'],
		['112', 'urgences (UE)'],
		['☎', 'antipoison'],
	];
	const k = width / 420;
	return (
		<div style={{width, boxSizing: 'border-box', padding: 18 * k, borderRadius: 26 * k, background: LPI.paper, border: `${6 * k}px solid ${N}`, display: 'flex', flexDirection: 'column', gap: 10 * k}}>
			{rows.map(([n, l], i) => (
				<div key={n} style={{display: 'flex', alignItems: 'center', gap: 14 * k, opacity: cl(on - i) * 0.85 + 0.15}}>
					<div style={{minWidth: 96 * k, padding: `${4 * k}px ${10 * k}px`, borderRadius: 999, background: i % 2 ? LPI.sky : LPI.pink, border: `${4 * k}px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 38 * k, color: N, textAlign: 'center'}}>{n}</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34 * k, color: N, whiteSpace: 'nowrap'}}>{l}</div>
				</div>
			))}
		</div>
	);
};

/** Les cases de la trousse (5 × 3), dans le repère de `FirstAidKit` (900 × 640). */
export const KIT_SLOTS = Array.from({length: 15}, (_, i) => ({x: 120 + (i % 5) * 165, y: 290 + Math.floor(i / 5) * 118}));

/**
 * Trousse de secours (repère 900 × 640) : boîte rose à croix blanche ; `open` 0 → 1 le couvercle se lève (on voit
 * l'intérieur) ; `items` posés dans les cases ; `empty` : vide (poussière, papillon de nuit qui s'envole) ; `shake`.
 */
export const FirstAidKit: React.FC<{width?: number; open?: number; items?: KitKind[]; empty?: number; shine?: number}> = ({width = 900, open = 0, items = [], empty = 0, shine = 0}) => {
	const frame = useCurrentFrame();
	const o = cl(open);
	const lidH = 46;
	return (
		<div style={{position: 'relative', width, height: (width * 640) / 900}}>
			<svg width={width} height={(width * 640) / 900} viewBox="0 0 900 640" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{/* poignée */}
				<path d="M370 150 V112 Q370 90 392 90 H508 Q530 90 530 112 V150" fill="none" stroke={N} strokeWidth={24} strokeLinecap="round" transform={`translate(0 ${-150 * o})`} />
				{/* corps */}
				<rect x={30} y={170} width={840} height={450} rx={50} fill={LPI.pink} {...S} strokeWidth={8} />
				{/* intérieur */}
				<rect x={70} y={210} width={760} height={370} rx={30} fill={o > 0 ? LPI.paper : LPI.pink} stroke={N} strokeWidth={6} opacity={o > 0 ? 1 : 0} />
				{o > 0 ? (
					<g opacity={o}>
						{[1, 2, 3, 4].map((i) => (
							<line key={i} x1={70 + i * 152} x2={70 + i * 152} y1={220} y2={570} stroke={alpha(N, 0.12)} strokeWidth={4} />
						))}
						{[1, 2].map((i) => (
							<line key={i} x1={80} x2={820} y1={210 + i * 123} y2={210 + i * 123} stroke={alpha(N, 0.12)} strokeWidth={4} />
						))}
					</g>
				) : null}
				{/* poussière (trousse vide) */}
				{empty > 0
					? Array.from({length: 10}, (_, i) => {
							const t = ((frame * 0.02 + i / 10) % 1) as number;
							return <circle key={i} cx={140 + ((i * 89) % 640)} cy={540 - t * 260} r={6 + (i % 3) * 4} fill={alpha(N, 0.18)} opacity={empty * (1 - t)} />;
						})
					: null}
				{/* couvercle */}
				<g>
					<rect x={30} y={170 - lidH} width={840} height={lidH} rx={40} fill={LPI.pink} {...S} strokeWidth={8} />
				</g>
				{/* croix sur le corps quand c'est fermé */}
				{o < 0.05 ? (
					<g transform="translate(450 395)">
						<rect x={-110} y={-36} width={220} height={72} rx={14} fill={LPI.paper} stroke={N} strokeWidth={7} />
						<rect x={-36} y={-110} width={72} height={220} rx={14} fill={LPI.paper} stroke={N} strokeWidth={7} />
						<rect x={-103} y={-29} width={206} height={58} rx={10} fill={LPI.paper} />
					</g>
				) : null}
				{shine > 0
					? [0, 1, 2, 3, 4].map((i) => {
							const a = (i / 5) * Math.PI * 2 + frame / 20;
							return <path key={i} d={`M${450 + 360 * Math.cos(a)} ${390 + 220 * Math.sin(a)} l10 -24 l10 24 l24 10 l-24 10 l-10 24 l-10 -24 l-24 -10 Z`} fill={LPI.paper} stroke={N} strokeWidth={4} opacity={shine * (0.5 + 0.5 * Math.sin(frame / 4 + i))} />;
						})
					: null}
			</svg>
			{/* objets rangés */}
			{o > 0.5
				? items.map((kind, i) => {
						const s = KIT_SLOTS[i];
						return (
							<div key={i} style={{position: 'absolute', left: ((s.x - 60) * width) / 900, top: ((s.y - 60) * width) / 900}}>
								<KitItem kind={kind} size={(120 * width) / 900} />
							</div>
						);
					})
				: null}
			{/* papillon de nuit qui s'envole */}
			{empty > 0 ? <Moth x={(450 + 160 * Math.sin(frame / 9)) * (width / 900)} y={(380 - (frame % 120) * 3) * (width / 900)} o={empty} /> : null}
		</div>
	);
};

const Moth: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => {
	const frame = useCurrentFrame();
	const f = Math.sin(frame * 1.4) * 0.6;
	return (
		<svg width={120} height={90} viewBox="-60 -45 120 90" style={{position: 'absolute', left: x - 60, top: y - 45, opacity: o, overflow: 'visible'}}>
			<g transform={`scale(1 ${1 - Math.abs(f) * 0.5})`}>
				<path d="M0 0 C-30 -40 -60 -20 -50 10 C-40 30 -10 20 0 0 Z" fill={LPI.sky} stroke={N} strokeWidth={4} />
				<path d="M0 0 C30 -40 60 -20 50 10 C40 30 10 20 0 0 Z" fill={LPI.sky} stroke={N} strokeWidth={4} />
			</g>
			<ellipse rx={8} ry={20} fill={N} />
			<path d="M-4 -18 Q-14 -34 -20 -30 M4 -18 Q14 -34 20 -30" fill="none" stroke={N} strokeWidth={3} />
		</svg>
	);
};

/** Cadenas (hors de portée), repère 200 × 200. */
export const Padlock: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}}>
		<path d="M60 96 V66 A40 40 0 0 1 140 66 V96" fill="none" stroke={N} strokeWidth={18} strokeLinecap="round" />
		<rect x={36} y={92} width={128} height={96} rx={20} fill={LPI.pink} {...S} />
		<circle cx={100} cy={132} r={12} fill={N} />
		<rect x={95} y={136} width={10} height={28} rx={4} fill={N} />
	</svg>
);

/* ───────────── gros plan « vu par celui qui coupe » : planche, tomate, main en griffe, couteau ───────────── */

/** Peau dans la palette : blanc cassé teinté de rose (dégradés), contours bleu nuit fins. */
const LINE = {stroke: alpha(LPI.navy, 0.72), strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
/** Tomate : centre et rayons (repère 1000 × 1000). */
const TOM = {x: 470, y: 520, rx: 170, ry: 150};
/** Plans de coupe successifs (x) : 3 tranches, puis la 4e coupe… qui dérape. */
const CUTS = [600, 572, 544, 516];
/** Recul de la main gauche quand elle sursaute (à `jerk` = 1). */
const JERK = {x: -60, y: 40};
/** Phalange de l'index (côté lame) dans la main au repos. */
const KNUCKLE = {x: 500, y: 614};
/** Point de l'entaille sur l'index une fois la main reculée (`jerk` 0,5), repère 1000 × 1000 de `CuttingCloseUp`. */
export const CUT_TIP = {x: KNUCKLE.x + JERK.x / 2, y: KNUCKLE.y + JERK.y / 2};

/** Mélange opaque de deux couleurs de la marque (une couleur de la marque posée en transparence sur une autre). */
const mix = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const SKIN_HI = LPI.paper;
const SKIN_LO = mix(LPI.paper, LPI.pink, 0.55);
const chord = (x: number) => TOM.ry * Math.sqrt(Math.max(0, 1 - ((x - TOM.x) / TOM.rx) ** 2));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (v: number, a: number, b: number) => cl((v - a) / (b - a));

/** Une tranche posée à plat, face coupée vers le haut (peau, chair, loges et pépins, cœur). */
const Slice: React.FC<{r: number; id: string}> = ({r, id}) => (
	<g>
		<ellipse rx={r} ry={r * 0.58} fill={`url(#skin-t${id})`} {...LINE} />
		<ellipse rx={r * 0.86} ry={r * 0.5} fill={`url(#flesh${id})`} />
		{[0, 1, 2, 3].map((i) => {
			const a = (i * Math.PI) / 2 + Math.PI / 4;
			const cx = Math.cos(a) * r * 0.46;
			const cy = Math.sin(a) * r * 0.27;
			return (
				<g key={i} transform={`translate(${cx} ${cy})`}>
					<ellipse rx={r * 0.24} ry={r * 0.14} fill={alpha(LPI.pink, 0.75)} transform={`rotate(${(a * 180) / Math.PI} 0 0) scale(1 0.9)`} />
					{[-1, 0, 1].map((k) => (
						<ellipse key={k} cx={k * r * 0.09} cy={k * r * 0.02} rx={r * 0.035} ry={r * 0.022} fill={LPI.paper} opacity={0.9} />
					))}
				</g>
			);
		})}
		<ellipse rx={r * 0.16} ry={r * 0.1} fill={alpha(LPI.paper, 0.85)} />
		<ellipse cx={-r * 0.3} cy={-r * 0.3} rx={r * 0.3} ry={r * 0.06} fill={alpha(LPI.paper, 0.55)} />
	</g>
);

/** Doigt replié vu de dessus : de l'articulation de la main (`a`) à la 2e phalange (`b`), le bout rentré dessous. */
const Finger: React.FC<{a: [number, number]; b: [number, number]; w: number; id: string}> = ({a, b, w, id}) => {
	const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
	const len = Math.hypot(b[0] - a[0], b[1] - a[1]) + w * 0.55;
	return (
		<g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
			<rect x={-w * 0.4} y={-w / 2} width={len + w * 0.4} height={w} rx={w / 2} fill={`url(#skin-f${id})`} {...LINE} />
			{/* pli de la 2e articulation + petit relief de la phalange */}
			<path d={`M${len - w * 0.62} ${-w * 0.3} q${w * 0.1} ${w * 0.3} 0 ${w * 0.6}`} fill="none" stroke={alpha(LPI.navy, 0.3)} strokeWidth={2.5} strokeLinecap="round" />
			<path d={`M${len - w * 0.78} ${-w * 0.22} q${w * 0.08} ${w * 0.22} 0 ${w * 0.44}`} fill="none" stroke={alpha(LPI.navy, 0.2)} strokeWidth={2} strokeLinecap="round" />
			<path d={`M${w * 0.1} ${-w * 0.32} L${len - w * 0.4} ${-w * 0.34}`} stroke={alpha(LPI.paper, 0.85)} strokeWidth={w * 0.16} strokeLinecap="round" />
		</g>
	);
};

/**
 * Gros plan « comme si c'était tes mains » (repère 1000 × 1000, vue de haut en perspective) : plan de travail, planche
 * en bois, tomate qui se coupe en tranches (`slices` 0 → 3 : la lame descend, la tranche tombe à plat), main gauche en
 * griffe qui recule à chaque coupe, couteau tenu par la main droite (`saw` va-et-vient). `slip` 0 → 1 : à la 4e coupe la
 * lame dérape sur la phalange de l'index ; `cut` l'entaille ; `jerk` 0 → 1 la main sursaute et recule (0,5 = au repos,
 * entaille en `CUT_TIP`) ; `bleed` la goutte qui perle puis tombe sur la planche ; `plaster` le pansement autour du doigt.
 */
export const CuttingCloseUp: React.FC<{width?: number; slices?: number; saw?: number; slip?: number; cut?: number; jerk?: number; bleed?: number; plaster?: number}> = ({width = 1000, slices = 0, saw = 0, slip = 0, cut = 0, jerk = 0, bleed = 0, plaster = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const sl = cl(slip);
	const k = Math.min(3, Math.floor(slices));
	const u = slices >= 3 ? 0 : slices - k;
	const done = Math.min(3, Math.floor(slices + 0.2));
	// la lame : passe d'un plan de coupe au suivant (u 0 → 0,15), descend (→ 0,8), remonte pendant que la tranche tombe
	const kxBase = k === 0 ? CUTS[0] : lerp(CUTS[k - 1], CUTS[k], seg(u, 0, 0.15));
	const depth = slices >= 3 ? 0 : u < 0.15 ? 0 : u < 0.8 ? seg(u, 0.15, 0.8) : 1 - seg(u, 0.8, 1);
	const j = cl(jerk);
	// après le dérapage, le couteau est retiré (il ne cache plus le doigt)
	const back = cl(j * 1.6);
	const kx = kxBase - 34 * sl + 110 * back;
	const ky = -46 + 46 * depth + 8 * saw + 40 * sl - 90 * back;
	const krot = -8 * sl + 10 * back;
	// la main gauche suit les coupes (elle recule de 28 px par tranche), puis sursaute
	const handDx = interpolate3(slices) + JERK.x * j;
	const handDy = JERK.y * j;
	const handRot = -6 * j;
	const blood = cl(bleed) * (1 - cl(plaster));
	const cutX = done > 0 ? CUTS[done - 1] : TOM.x + TOM.rx + 10;
	const slicesPos: [number, number, number][] = [
		[712, 640, chord(CUTS[0]) * 0.72],
		[690, 760, chord(CUTS[1]) * 0.72],
		[742, 860, chord(CUTS[2]) * 0.7],
	];
	// goutte : elle perle sur la phalange (dans la main), puis une goutte tombe et s'étale sur la planche
	const bead = 1.4 * cl(blood * 1.6);
	const dropT = seg(blood, 0.45, 0.8);
	const puddle = seg(blood, 0.75, 1);
	const tipNow = {x: KNUCKLE.x + handDx, y: KNUCKLE.y + handDy};
	return (
		<svg width={width} height={width} viewBox="0 0 1000 1000" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<filter id={`soft${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="10" />
				</filter>
				<filter id={`soft2${id}`} x="-30%" y="-30%" width="160%" height="160%">
					<feGaussianBlur stdDeviation="4" />
				</filter>
				<linearGradient id={`counter${id}`} x1="0" y1="0" x2="0.3" y2="1">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={alpha(LPI.sky, 0.55)} />
				</linearGradient>
				<linearGradient id={`board${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={mix(LPI.paper, LPI.sky, 0.7)} />
					<stop offset="1" stopColor={LPI.sky} />
				</linearGradient>
				<radialGradient id={`tom${id}`} cx="0.36" cy="0.3" r="0.8">
					<stop offset="0" stopColor={mix(LPI.paper, LPI.pink, 0.45)} />
					<stop offset="0.45" stopColor={LPI.pink} />
					<stop offset="1" stopColor={LPI.pink} />
				</radialGradient>
				<radialGradient id={`tomShade${id}`} cx="0.36" cy="0.3" r="0.85">
					<stop offset="0.55" stopColor={alpha(LPI.navy, 0)} />
					<stop offset="1" stopColor={alpha(LPI.navy, 0.28)} />
				</radialGradient>
				<radialGradient id={`flesh${id}`} cx="0.5" cy="0.5" r="0.6">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="1" stopColor={mix(LPI.paper, LPI.pink, 0.6)} />
				</radialGradient>
				<linearGradient id={`skin-t${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={LPI.pink} />
					<stop offset="1" stopColor={mix(LPI.pink, LPI.navy, 0.12)} />
				</linearGradient>
				<linearGradient id={`skin-f${id}`} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={SKIN_HI} />
					<stop offset="1" stopColor={SKIN_LO} />
				</linearGradient>
				<linearGradient id={`skin${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={SKIN_HI} />
					<stop offset="1" stopColor={SKIN_LO} />
				</linearGradient>
				<linearGradient id={`steel${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="0.35" stopColor={mix(LPI.paper, LPI.sky, 0.7)} />
					<stop offset="0.75" stopColor={LPI.sky} />
					<stop offset="1" stopColor={mix(LPI.sky, LPI.blue, 0.55)} />
				</linearGradient>
				<linearGradient id={`handle${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={mix(LPI.navy, LPI.blue, 0.3)} />
					<stop offset="0.4" stopColor={LPI.navy} />
					<stop offset="1" stopColor={LPI.navy} />
				</linearGradient>
				<linearGradient id={`sleeve${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={LPI.blue} />
					<stop offset="1" stopColor={mix(LPI.blue, LPI.navy, 0.2)} />
				</linearGradient>
				<clipPath id={`cut${id}`}>
					<rect x={0} y={0} width={cutX} height={1000} />
				</clipPath>
			</defs>

			{/* mur carrelé, plan de travail */}
			<rect x={-200} y={-500} width={1400} height={620} fill={alpha(LPI.sky, 0.5)} />
			{Array.from({length: 12}, (_, i) => (
				<line key={`v${i}`} x1={-200 + i * 120} y1={-500} x2={-200 + i * 120} y2={120} stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} />
			))}
			{Array.from({length: 6}, (_, i) => (
				<line key={`h${i}`} x1={-200} y1={-500 + i * 120} x2={1200} y2={-500 + i * 120} stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} />
			))}
			<rect x={-200} y={110} width={1400} height={1500} fill={`url(#counter${id})`} />
			<rect x={-200} y={106} width={1400} height={10} fill={alpha(LPI.navy, 0.12)} />

			{/* planche en bois : ombre, chant, dessus, veines */}
			<path d="M170 270 L870 270 L970 860 L70 860 Z" fill={alpha(LPI.navy, 0.22)} filter={`url(#soft${id})`} transform="translate(14 24)" />
			<path d="M60 820 L940 820 L940 856 Q940 866 930 866 L70 866 Q60 866 60 856 Z" fill={alpha(LPI.blue, 0.55)} {...LINE} />
			<path d="M160 250 L840 250 Q856 250 858 264 L940 806 Q942 820 926 820 L74 820 Q58 820 60 806 L142 264 Q144 250 160 250 Z" fill={`url(#board${id})`} {...LINE} />
			{Array.from({length: 10}, (_, i) => {
				const y = 284 + i * 56;
				return <path key={i} d={`M${150 - i * 8} ${y} C${360} ${y - 14} ${600} ${y + 18} ${852 + i * 8} ${y - 4}`} fill="none" stroke={alpha(LPI.blue, 0.16)} strokeWidth={3} strokeLinecap="round" />;
			})}

			{/* tranches posées à plat (elles basculent depuis le plan de coupe) */}
			{slicesPos.map(([x, y, r], i) => {
				const p = seg(slices, i + 0.8, i + 1);
				if (p <= 0) return null;
				const sx = lerp(CUTS[i] + 10, x, p);
				const sy = lerp(TOM.y, y, p);
				return (
					<g key={i} transform={`translate(${sx} ${sy}) rotate(${lerp(-70, (i - 1) * 8, p)}) scale(${lerp(0.25, 1, p)} 1)`}>
						<ellipse cx={10} cy={14} rx={r} ry={r * 0.58} fill={alpha(LPI.navy, 0.2)} filter={`url(#soft2${id})`} />
						<Slice r={r} id={id} />
					</g>
				);
			})}

			{/* la tomate : ombre portée, sphère ombrée, tranche nette du côté de la lame */}
			<ellipse cx={TOM.x + 30} cy={TOM.y + TOM.ry - 6} rx={TOM.rx * 0.95} ry={34} fill={alpha(LPI.navy, 0.3)} filter={`url(#soft${id})`} />
			<g clipPath={`url(#cut${id})`}>
				<ellipse cx={TOM.x} cy={TOM.y} rx={TOM.rx} ry={TOM.ry} fill={`url(#tom${id})`} />
				<ellipse cx={TOM.x} cy={TOM.y} rx={TOM.rx} ry={TOM.ry} fill={`url(#tomShade${id})`} {...LINE} />
				<ellipse cx={TOM.x - 70} cy={TOM.y - 78} rx={46} ry={20} fill={alpha(LPI.paper, 0.75)} transform={`rotate(-24 ${TOM.x - 70} ${TOM.y - 78})`} />
				<ellipse cx={TOM.x - 100} cy={TOM.y - 46} rx={10} ry={6} fill={alpha(LPI.paper, 0.8)} />
				{/* là où était la tige : petite cicatrice étoilée */}
				<g transform={`translate(${TOM.x - 40} ${TOM.y - 104})`}>
					{[0, 72, 144, 216, 288].map((a) => (
						<path key={a} d="M0 0 L12 0" stroke={alpha(LPI.navy, 0.25)} strokeWidth={3} strokeLinecap="round" transform={`rotate(${a}) scale(1 0.6)`} />
					))}
					<ellipse rx={7} ry={5} fill={mix(LPI.pink, LPI.navy, 0.3)} />
				</g>
			</g>
			{done > 0 ? (
				<g>
					<ellipse cx={cutX} cy={TOM.y} rx={13} ry={chord(cutX)} fill={`url(#flesh${id})`} {...LINE} />
					<ellipse cx={cutX + 2} cy={TOM.y - chord(cutX) * 0.3} rx={4} ry={chord(cutX) * 0.18} fill={alpha(LPI.pink, 0.7)} />
					<ellipse cx={cutX + 2} cy={TOM.y + chord(cutX) * 0.32} rx={4} ry={chord(cutX) * 0.18} fill={alpha(LPI.pink, 0.7)} />
				</g>
			) : null}

			{/* une goutte de sang tombée sur la planche */}
			{puddle > 0 ? (
				<g>
					<ellipse cx={CUT_TIP.x + 6} cy={CUT_TIP.y + 128} rx={26 * puddle} ry={14 * puddle} fill={LPI.pink} stroke={alpha(LPI.navy, 0.55)} strokeWidth={2.5} />
					<ellipse cx={CUT_TIP.x - 2} cy={CUT_TIP.y + 124} rx={8 * puddle} ry={3 * puddle} fill={alpha(LPI.paper, 0.7)} />
				</g>
			) : null}

			{/* main gauche en griffe */}
			<g transform={`translate(${handDx} ${handDy}) rotate(${handRot} 230 620)`}>
				{/* ombre de la main sur la tomate et la planche */}
				<path d="M240 470 C300 430 380 420 420 446 L520 470 L530 640 L420 690 C330 720 250 720 210 680 Z" fill={alpha(LPI.navy, 0.2)} filter={`url(#soft${id})`} transform="translate(16 22)" />
				{/* avant-bras + manche */}
				<path d="M250 482 L-240 860 L-110 1120 L262 700 Z" fill={`url(#skin${id})`} {...LINE} />
				<path d="M60 640 L-240 860 L-110 1120 L130 860 Z" fill={`url(#sleeve${id})`} {...LINE} />
				<path d="M60 640 L130 860" stroke={alpha(LPI.paper, 0.5)} strokeWidth={6} strokeLinecap="round" />
				{/* pouce, rentré du côté de la planche */}
				<g transform="translate(262 692) rotate(-4)">
					<rect x={0} y={-24} width={150} height={48} rx={24} fill={`url(#skin-f${id})`} {...LINE} />
					<path d="M110 -15 q24 0 30 15 q-6 15 -30 15 Z" fill={alpha(LPI.paper, 0.95)} stroke={alpha(LPI.navy, 0.4)} strokeWidth={2} />
				</g>
				{/* doigts repliés : auriculaire (au fond) → index (devant), phalanges contre la lame */}
				<Finger a={[372, 456]} b={[438, 452]} w={42} id={id} />
				<Finger a={[392, 504]} b={[470, 500]} w={50} id={id} />
				<Finger a={[402, 556]} b={[484, 556]} w={54} id={id} />
				<Finger a={[398, 614]} b={[476, 618]} w={52} id={id} />
				{/* dos de la main, articulations en relief */}
				<path d="M236 470 C280 440 340 426 372 434 C394 440 402 470 404 500 C410 520 414 540 412 560 C416 590 418 610 410 640 C396 668 330 690 262 700 C220 660 206 540 236 470 Z" fill={`url(#skin${id})`} {...LINE} />
				{[[380, 452], [398, 502], [408, 556], [404, 612]].map(([x, y], i) => (
					<g key={i}>
						<ellipse cx={x - 8} cy={y - 8} rx={12} ry={6} fill={alpha(LPI.paper, 0.6)} />
						<path d={`M${x - 14} ${y + 10} q10 4 18 -2`} fill="none" stroke={alpha(LPI.navy, 0.22)} strokeWidth={2.5} strokeLinecap="round" />
					</g>
				))}
				{[[372, 456], [392, 506], [400, 558], [394, 612]].map(([x, y], i) => (
					<path key={i} d={`M${x - 26} ${y + 2} Q${x - 60} ${y + (600 - y) * 0.2} 306 ${560 + i * 22}`} fill="none" stroke={alpha(LPI.navy, 0.07)} strokeWidth={3} strokeLinecap="round" />
				))}
				{/* l'entaille sur la phalange de l'index */}
				{cut > 0 ? (
					<g opacity={cl(cut) * (1 - cl(plaster))}>
						<ellipse cx={KNUCKLE.x - 2} cy={KNUCKLE.y} rx={16} ry={26} fill={alpha(LPI.pink, 0.6)} />
						<path d={`M${KNUCKLE.x - 7} ${KNUCKLE.y - 21} L${KNUCKLE.x + 3} ${KNUCKLE.y + 21}`} stroke={mix(LPI.pink, LPI.navy, 0.15)} strokeWidth={10} strokeLinecap="round" />
						<path d={`M${KNUCKLE.x - 7} ${KNUCKLE.y - 21} L${KNUCKLE.x + 3} ${KNUCKLE.y + 21}`} stroke={alpha(LPI.navy, 0.8)} strokeWidth={3} strokeLinecap="round" />
					</g>
				) : null}
				{/* la goutte qui perle */}
				{bead > 0 ? (
					<g transform={`translate(${KNUCKLE.x + 8} ${KNUCKLE.y + 10})`}>
						<path d={`M0 ${-14 * bead} C${12 * bead} ${-2 * bead} ${12 * bead} ${12 * bead} 0 ${14 * bead} C${-12 * bead} ${12 * bead} ${-12 * bead} ${-2 * bead} 0 ${-14 * bead} Z`} fill={LPI.pink} stroke={alpha(LPI.navy, 0.6)} strokeWidth={2.5} />
						<ellipse cx={-4 * bead} cy={-2 * bead} rx={3 * bead} ry={5 * bead} fill={alpha(LPI.paper, 0.85)} />
					</g>
				) : null}
				{/* pansement enroulé autour de l'index */}
				{plaster > 0 ? (
					<g transform={`translate(${KNUCKLE.x - 14} ${KNUCKLE.y + 2}) scale(${0.7 + 0.3 * cl(plaster)})`} opacity={cl(plaster * 2)}>
						<rect x={-24} y={-34} width={48} height={68} rx={12} fill={alpha(LPI.pink, 0.9)} {...LINE} />
						<rect x={-14} y={-20} width={28} height={40} rx={6} fill={LPI.paper} stroke={alpha(LPI.navy, 0.4)} strokeWidth={2} />
						{[-27, 27].map((y) => [-12, 0, 12].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r={2} fill={alpha(LPI.navy, 0.35)} />))}
					</g>
				) : null}
			</g>

			{/* la goutte qui tombe de la phalange sur la planche */}
			{dropT > 0 && dropT < 1 ? (
				<ellipse cx={lerp(tipNow.x + 8, CUT_TIP.x + 6, dropT)} cy={lerp(tipNow.y + 24, CUT_TIP.y + 124, dropT * dropT)} rx={7} ry={10} fill={LPI.pink} stroke={alpha(LPI.navy, 0.6)} strokeWidth={2} />
			) : null}

			{/* le couteau et la main droite (elle vient d'en bas à droite) */}
			<g transform={`translate(${kx} ${ky}) rotate(${krot} 10 760)`}>
				<path d="M-14 250 L44 1200 L80 1200 L30 250 Z" fill={alpha(LPI.navy, 0.18)} filter={`url(#soft2${id})`} transform="translate(22 30)" />
				{/* lame : face visible, tranchant à gauche, dos à droite */}
				<path d="M8 236 C-10 270 -30 330 -34 420 L-32 640 L16 640 L14 252 Q13 240 8 236 Z" fill={`url(#steel${id})`} {...LINE} />
				<path d="M-28 430 L-27 632" stroke={alpha(LPI.paper, 0.95)} strokeWidth={3} strokeLinecap="round" />
				<path d="M10 270 L12 630" stroke={alpha(LPI.paper, 0.9)} strokeWidth={3} strokeLinecap="round" />
				{/* mitre et manche, qui sort du cadre vers toi (la main droite est hors champ) */}
				<rect x={-38} y={634} width={58} height={30} rx={8} fill={mix(LPI.blue, LPI.sky, 0.3)} {...LINE} />
				<path d="M-34 662 L18 662 L60 1200 L-6 1200 Z" fill={`url(#handle${id})`} {...LINE} />
				<path d="M-22 676 L18 1190" stroke={alpha(LPI.paper, 0.25)} strokeWidth={5} strokeLinecap="round" />
				{[730, 830].map((y) => (
					<circle key={y} cx={-8 + (y - 662) * 0.075} cy={y} r={6} fill={mix(LPI.paper, LPI.sky, 0.4)} stroke={alpha(LPI.navy, 0.5)} strokeWidth={2} />
				))}
			</g>
		</svg>
	);
};

/** Recul progressif de la main gauche pendant les coupes : 84 → 0 px pour 0 → 3 tranches. */
function interpolate3(s: number) {
	return lerp(84, 0, cl(s / 3));
}
