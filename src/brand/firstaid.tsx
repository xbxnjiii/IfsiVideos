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

/** Planche à découper avec une tomate (en tranches au fil du couteau : `sliced` 0 → 1). Repère 700 × 300. */
export const CuttingBoard: React.FC<{width?: number; sliced?: number}> = ({width = 700, sliced = 0}) => (
	<svg width={width} height={(width * 300) / 700} viewBox="0 0 700 300" style={{overflow: 'visible', display: 'block'}}>
		<rect x={10} y={150} width={680} height={130} rx={36} fill={LPI.sky} {...S} />
		<circle cx={640} cy={215} r={18} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<path d="M60 200 H560 M60 240 H520" stroke={alpha(N, 0.15)} strokeWidth={6} strokeLinecap="round" />
		<circle cx={300} cy={120} r={90} fill={LPI.pink} {...S} strokeWidth={7} />
		<path d="M270 40 Q300 20 330 40 L300 55 Z" fill={LPI.blue} stroke={N} strokeWidth={5} />
		<path d="M250 90 Q262 76 278 74" fill="none" stroke={LPI.paper} strokeWidth={9} strokeLinecap="round" />
		{sliced > 0
			? [0, 1, 2].map((i) => (
					<g key={i} opacity={cl(sliced * 3 - i)}>
						<ellipse cx={420 + i * 46} cy={190} rx={20} ry={44} fill={LPI.pink} stroke={N} strokeWidth={5} />
						<ellipse cx={420 + i * 46} cy={190} rx={9} ry={28} fill={alpha(LPI.paper, 0.6)} />
					</g>
				))
			: null}
	</svg>
);

/** Cadenas (hors de portée), repère 200 × 200. */
export const Padlock: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}}>
		<path d="M60 96 V66 A40 40 0 0 1 140 66 V96" fill="none" stroke={N} strokeWidth={18} strokeLinecap="round" />
		<rect x={36} y={92} width={128} height={96} rx={20} fill={LPI.pink} {...S} />
		<circle cx={100} cy={132} r={12} fill={N} />
		<rect x={95} y={136} width={10} height={28} rx={4} fill={N} />
	</svg>
);

/* ───────────── gros plan vu du dessus : la planche, la tomate, les deux mains, le couteau ───────────── */

const SKIN_C = '#F8F9FC';
/** Point de l'index (bout du doigt) où le couteau dérape, dans le repère 1000 × 1000 de `CuttingCloseUp`. */
export const CUT_TIP = {x: 452, y: 352};

/**
 * Gros plan vu du dessus (repère 1000 × 1000) : planche à découper, tomate et ses tranches (`slices` 0 → 4), main gauche
 * en griffe qui tient la tomate, couteau tenu par la main droite (`knifeX` position de la lame, `saw` va-et-vient).
 * `slip` 0 → 1 : la lame dérape sur le bout de l'index ; `cut` l'entaille ; `jerk` 0 → 1 la main recule ; `bleed`
 * gouttes et petite flaque ; `plaster` 0 → 1 un pansement vient se coller sur le doigt (et le sang s'en va).
 */
export const CuttingCloseUp: React.FC<{width?: number; slices?: number; knifeX?: number; saw?: number; slip?: number; cut?: number; jerk?: number; bleed?: number; plaster?: number}> = ({width = 1000, slices = 0, knifeX = 700, saw = 0, slip = 0, cut = 0, jerk = 0, bleed = 0, plaster = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const sl = cl(slip);
	// la lame : verticale, à droite de la tomate ; au dérapage elle part vers le bout de l'index en pivotant
	const kx = knifeX + (CUT_TIP.x + 40 - knifeX) * sl;
	const ky = saw * 14 + (CUT_TIP.y - 330) * sl;
	const krot = -28 * sl;
	const hx = -46 * cl(jerk);
	const hy = 18 * cl(jerk);
	const blood = cl(bleed) * (1 - cl(plaster));
	const fingers: [number, number, number, number][] = [
		// y, longueur, largeur, angle
		[352, 150, 62, -10],
		[424, 158, 66, -3],
		[494, 150, 62, 4],
		[558, 126, 52, 12],
	];
	return (
		<svg width={width} height={width} viewBox="0 0 1000 1000" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<linearGradient id={`tom${id}`} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={alpha(LPI.pink, 0.75)} />
					<stop offset="1" stopColor={LPI.pink} />
				</linearGradient>
				<linearGradient id={`bl${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor={LPI.paper} />
					<stop offset="0.55" stopColor={LPI.paper} />
					<stop offset="1" stopColor={alpha(LPI.sky, 0.95)} />
				</linearGradient>
			</defs>
			{/* plan de travail + planche */}
			<rect x={-200} y={-200} width={1400} height={1400} fill={alpha(LPI.sky, 0.35)} />
			<rect x={90} y={150} width={860} height={720} rx={48} fill={alpha(N, 0.12)} transform="translate(12 16)" />
			<rect x={90} y={150} width={860} height={720} rx={48} fill={LPI.sky} stroke={N} strokeWidth={8} />
			{Array.from({length: 9}, (_, i) => (
				<path key={i} d={`M${130 + i * 6} ${200 + i * 74} C${380} ${190 + i * 76} ${620} ${214 + i * 72} ${910 - i * 4} ${196 + i * 74}`} fill="none" stroke={alpha(N, 0.1)} strokeWidth={4} strokeLinecap="round" />
			))}
			<circle cx={890} cy={810} r={22} fill={alpha(LPI.paper, 0.9)} stroke={N} strokeWidth={6} />
			{/* tranches déjà coupées (à droite) */}
			{Array.from({length: 4}, (_, i) => {
				const o = cl(slices - i);
				if (o <= 0) return null;
				const cx = 760 + i * 40;
				return (
					<g key={i} opacity={o} transform={`translate(${cx} 470) rotate(${(i % 2 ? 1 : -1) * 6})`}>
						<ellipse rx={26} ry={128} fill={LPI.pink} stroke={N} strokeWidth={5} />
						<ellipse rx={12} ry={100} fill={alpha(LPI.paper, 0.75)} />
						{[-60, -20, 20, 60].map((y) => (
							<ellipse key={y} cx={0} cy={y} rx={4} ry={7} fill={alpha(LPI.pink, 0.9)} />
						))}
					</g>
				);
			})}
			{/* la tomate (coupée net du côté droit) */}
			<g>
				<path d="M600 330 C540 300 440 316 420 400 C400 480 430 590 520 612 C570 624 600 612 612 600 Z" fill={`url(#tom${id})`} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M612 334 V600" stroke={N} strokeWidth={8} strokeLinecap="round" />
				<path d="M598 352 V584" stroke={alpha(LPI.paper, 0.7)} strokeWidth={10} strokeLinecap="round" />
				<path d="M470 380 Q490 352 526 346" fill="none" stroke={alpha(LPI.paper, 0.85)} strokeWidth={12} strokeLinecap="round" />
				{/* pédoncule */}
				<g transform="translate(520 460)">
					{[0, 72, 144, 216, 288].map((a) => (
						<path key={a} d="M0 0 Q10 -14 0 -34 Q-10 -14 0 0" fill={LPI.blue} stroke={N} strokeWidth={3} transform={`rotate(${a})`} />
					))}
					<circle r={7} fill={N} />
				</g>
			</g>
			{/* main gauche en griffe : avant-bras qui vient d'en bas à gauche, dos de la main, doigts repliés sur la tomate */}
			<g transform={`translate(${hx} ${hy})`}>
				<path d="M-120 1040 C40 860 150 720 230 610 L330 650 C260 760 170 900 60 1080 Z" fill={SKIN_C} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M-120 1040 C40 860 150 720 230 610 L330 650 C260 760 170 900 60 1080 Z" fill={alpha(LPI.pink, 0.22)} />
				<path d="M130 760 C170 720 210 690 260 660" fill="none" stroke={alpha(N, 0.15)} strokeWidth={6} strokeLinecap="round" />
				{/* pouce, sous la tomate */}
				<g transform="translate(300 600) rotate(28)">
					<rect x={0} y={-30} width={150} height={60} rx={30} fill={SKIN_C} stroke={N} strokeWidth={7} />
					<rect x={0} y={-30} width={150} height={60} rx={30} fill={alpha(LPI.pink, 0.22)} />
					<rect x={102} y={-20} width={36} height={40} rx={14} fill={alpha(LPI.paper, 0.9)} stroke={alpha(N, 0.5)} strokeWidth={3} />
				</g>
				{/* dos de la main */}
				<path d="M196 330 C270 300 330 320 340 380 C350 450 352 540 336 610 C320 660 250 670 210 640 C170 600 160 480 168 400 C172 360 180 340 196 330 Z" fill={SKIN_C} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M196 330 C270 300 330 320 340 380 C350 450 352 540 336 610 C320 660 250 670 210 640 C170 600 160 480 168 400 C172 360 180 340 196 330 Z" fill={alpha(LPI.pink, 0.22)} />
				{[400, 460, 520].map((y) => (
					<path key={y} d={`M226 ${y} C250 ${y - 4} 280 ${y - 2} 310 ${y + 4}`} fill="none" stroke={alpha(N, 0.12)} strokeWidth={5} strokeLinecap="round" />
				))}
				{/* doigts repliés (on voit le dessus des phalanges) */}
				{fingers.map(([y, len, w, a], i) => (
					<g key={i} transform={`translate(306 ${y}) rotate(${a})`}>
						<rect x={0} y={-w / 2} width={len} height={w} rx={w / 2} fill={SKIN_C} stroke={N} strokeWidth={7} />
						<rect x={0} y={-w / 2} width={len} height={w} rx={w / 2} fill={alpha(LPI.pink, 0.24)} />
						<path d={`M${len * 0.42} ${-w / 2 + 8} Q${len * 0.46} 0 ${len * 0.42} ${w / 2 - 8}`} fill="none" stroke={alpha(N, 0.28)} strokeWidth={4} strokeLinecap="round" />
						<path d={`M${len * 0.74} ${-w / 2 + 10} Q${len * 0.78} 0 ${len * 0.74} ${w / 2 - 10}`} fill="none" stroke={alpha(N, 0.22)} strokeWidth={4} strokeLinecap="round" />
						<circle cx={len * 0.18} cy={0} r={w * 0.16} fill={alpha(N, 0.08)} />
					</g>
				))}
				{/* l'entaille au bout de l'index */}
				{cut > 0 ? (
					<g opacity={cl(cut) * (1 - cl(plaster))}>
						<ellipse cx={CUT_TIP.x - 6} cy={CUT_TIP.y} rx={30} ry={40} fill={alpha(LPI.pink, 0.45)} />
						<path d={`M${CUT_TIP.x - 22} ${CUT_TIP.y - 32} L${CUT_TIP.x + 8} ${CUT_TIP.y + 32}`} stroke={LPI.pink} strokeWidth={20} strokeLinecap="round" />
						<path d={`M${CUT_TIP.x - 22} ${CUT_TIP.y - 32} L${CUT_TIP.x + 8} ${CUT_TIP.y + 32}`} stroke={N} strokeWidth={5} strokeLinecap="round" />
					</g>
				) : null}
				{/* le pansement */}
				{plaster > 0 ? (
					<g transform={`translate(${CUT_TIP.x - 6} ${CUT_TIP.y}) rotate(-80) scale(${0.6 + 0.4 * cl(plaster)})`} opacity={cl(plaster * 2)}>
						<rect x={-80} y={-34} width={160} height={68} rx={34} fill={LPI.pink} stroke={N} strokeWidth={6} />
						<rect x={-34} y={-26} width={68} height={52} rx={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
						{[-58, 58].map((x) => [-12, 0, 12].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill={alpha(N, 0.4)} />))}
					</g>
				) : null}
			</g>
			{/* gouttes de sang et petite flaque sur la planche */}
			{blood > 0 ? (
				<g opacity={blood}>
					<ellipse cx={CUT_TIP.x + 30} cy={CUT_TIP.y - 60} rx={70 * blood} ry={36 * blood} fill={LPI.pink} stroke={N} strokeWidth={5} />
					<circle cx={CUT_TIP.x + 100} cy={CUT_TIP.y - 40} r={14 * blood} fill={LPI.pink} stroke={N} strokeWidth={4} />
					{[0, 1, 2].map((i) => {
						const t = ((frame * 0.05 + i / 3) % 1) as number;
						return <circle key={i} cx={CUT_TIP.x - 10 - i * 10} cy={CUT_TIP.y - 20 - t * 50} r={10 - t * 4} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={1 - t} />;
					})}
				</g>
			) : null}
			{/* douleur */}
			{cut > 0 && plaster < 1
				? [0, 1, 2].map((i) => {
						const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 2);
						const a = (-150 + i * 40) * (Math.PI / 180);
						const x = CUT_TIP.x + 90 * Math.cos(a) + hx;
						const y = CUT_TIP.y + 90 * Math.sin(a) + hy;
						return <path key={i} d={`M${x} ${y} l${14 * Math.cos(a)} ${14 * Math.sin(a) - 10} l10 8 l${16 * Math.cos(a)} ${16 * Math.sin(a) - 12}`} fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={cl(cut) * (1 - cl(plaster)) * (0.4 + 0.6 * f)} />;
					})
				: null}
			{/* le couteau (lame verticale) et la main droite qui tient le manche, en haut */}
			<g transform={`translate(${kx} ${ky}) rotate(${krot} 0 330)`}>
				<path d="M-6 330 L-6 650 Q-6 700 30 700 L34 700 L40 330 Z" fill={`url(#bl${id})`} stroke={N} strokeWidth={7} strokeLinejoin="round" />
				<path d="M6 360 V640" stroke={alpha(LPI.paper, 0.9)} strokeWidth={6} strokeLinecap="round" />
				<rect x={-14} y={140} width={62} height={200} rx={20} fill={N} />
				{[190, 250, 300].map((y) => (
					<circle key={y} cx={17} cy={y} r={7} fill={alpha(LPI.paper, 0.85)} />
				))}
				{/* avant-bras qui monte hors du cadre */}
				<path d="M-36 120 L-56 -400 L104 -400 L84 120 Z" fill={SKIN_C} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M-36 120 L-56 -400 L104 -400 L84 120 Z" fill={alpha(LPI.pink, 0.22)} />
				{/* main droite : poing fermé sur le manche */}
				<path d="M-60 120 C-80 170 -70 250 -40 290 L90 290 C110 250 116 170 96 120 C80 80 -40 80 -60 120 Z" fill={SKIN_C} stroke={N} strokeWidth={8} strokeLinejoin="round" />
				<path d="M-60 120 C-80 170 -70 250 -40 290 L90 290 C110 250 116 170 96 120 C80 80 -40 80 -60 120 Z" fill={alpha(LPI.pink, 0.22)} />
				{[160, 200, 240].map((y) => (
					<path key={y} d={`M-50 ${y} Q20 ${y + 10} 92 ${y}`} fill="none" stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" />
				))}
				{/* pouce posé le long du manche */}
				<rect x={66} y={150} width={44} height={120} rx={22} fill={SKIN_C} stroke={N} strokeWidth={7} />
				<rect x={74} y={232} width={28} height={30} rx={10} fill={alpha(LPI.paper, 0.9)} stroke={alpha(N, 0.5)} strokeWidth={3} />
			</g>
		</svg>
	);
};
