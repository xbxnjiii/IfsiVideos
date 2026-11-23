// Briques « l'ordre des tubes » (vidéo n° 61). Les bouchons sont aux VRAIES couleurs des tubes de laboratoire
// (exception à la palette, nécessaire : on apprend justement ces couleurs) et le sang est rouge (objet réel).
// Codes couleur les plus courants en France (ils peuvent varier selon les fabricants : la vidéo le dit).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Vraies couleurs des bouchons. */
export const CAP = {
	citrate: '#7CC4EA',
	sec: '#D63B3B',
	gel: '#EFC02C',
	hepar: '#3FA34D',
	edta: '#8E5CC0',
	fluor: '#9AA0A6',
	purge: '#F1F1EC',
};
/** Flacons d'hémoculture : aérobie bouchon vert, anaérobie bouchon orange (vraies couleurs). */
export const HEMO_CAP = {aero: '#2F9E6E', anaero: '#EE7A2B'};
export const BLOOD = '#A3172B';
export const BLOOD_DARK = '#6E0E1C';
export const SERUM = '#F1CF6E';
export type TubeKind = keyof typeof CAP;

/** L'ordre, case par case (0 = hémocultures). */
export const ORDER: {key: 'hemoc' | TubeKind; name: string; additive: string}[] = [
	{key: 'hemoc', name: 'Hémocultures', additive: 'hémoc.'},
	{key: 'citrate', name: 'Bleu', additive: 'bleu'},
	{key: 'gel', name: 'Jaune', additive: 'jaune'},
	{key: 'sec', name: 'Rouge', additive: 'rouge'},
	{key: 'hepar', name: 'Vert', additive: 'vert'},
	{key: 'edta', name: 'Violet', additive: 'violet'},
	{key: 'fluor', name: 'Gris', additive: 'gris'},
];

export const darker = (hex: string, k = 0.22) => {
	const n = parseInt(hex.slice(1), 16);
	const f = (v: number) => Math.round(v * (1 - k));
	return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`;
};

/**
 * Tube sous vide (repère 100 × 400) : bouchon de couleur réelle, verre, étiquette. `level` 0 → 1 : sang ; `serum` 0 → 1 :
 * le caillot se tasse en bas et le sérum jaune paille apparaît au-dessus (`gel` : une couche de gel entre les deux) ;
 * `mark` : trait de remplissage ; `additive` 0 → 1 : grains d'additif qui brillent au fond ; `taint` : micro-goutte d'un
 * autre additif (couleur `taintColor`) qui se répand ; `cells` 0 → 1 : cellules intactes dessinées dans le sang.
 */
export const Tube: React.FC<{
	size?: number;
	cap: string;
	level?: number;
	serum?: number;
	gel?: boolean;
	mark?: number;
	markAt?: number;
	additive?: number;
	taint?: number;
	taintColor?: string;
	label?: string;
	bad?: number;
	/** part du sérum (plasma) au-dessus des globules quand `serum` = 1 (0,48 ≈ hématocrite de 52 %) */
	split?: number;
}> = ({size = 100, cap, level = 0, serum = 0, gel = false, split = 0.48, mark = 0, markAt = 0.72, additive = 0, taint = 0, taintColor = CAP.edta, label, bad = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const body = 'M16 80 H84 V350 Q84 392 50 392 Q16 392 16 350 Z';
	const H = 300;
	const top = 392 - H * level;
	const clotTop = 392 - H * level * (1 - split * serum);
	const gelH = gel ? 20 * serum : 0;
	const wob = 3 * Math.sin(frame / 4);
	return (
		<svg width={size} height={size * 4} viewBox="0 0 100 400" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id={`tc${id}`}>
					<path d={body} />
				</clipPath>
				<linearGradient id={`tg${id}`} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#fff" stopOpacity={0.55} />
					<stop offset="0.5" stopColor="#fff" stopOpacity={0.12} />
					<stop offset="1" stopColor="#fff" stopOpacity={0.4} />
				</linearGradient>
			</defs>
			<path d={body} fill="#EEF3F8" />
			<g clipPath={`url(#tc${id})`}>
				{additive > 0
					? [...Array(14)].map((_, i) => (
							<circle key={i} cx={24 + ((i * 37) % 52)} cy={382 - ((i * 23) % 26)} r={3.2} fill={cap} stroke={N} strokeWidth={1.2} opacity={additive * (0.6 + 0.4 * Math.sin(frame / 5 + i))} />
						))
					: null}
				{level > 0 ? (
					<>
						<path d={`M0 ${top} Q25 ${top - wob} 50 ${top} T100 ${top} V400 H0 Z`} fill={serum > 0 ? SERUM : BLOOD} opacity={1} />
						{serum > 0 ? <rect x={0} y={clotTop - gelH} width={100} height={gelH + 1} fill="#E4E9EE" /> : null}
						{serum > 0 ? <path d={`M0 ${clotTop} Q30 ${clotTop + 6 * serum} 50 ${clotTop + 2} T100 ${clotTop} V400 H0 Z`} fill={BLOOD_DARK} /> : null}
						{serum <= 0 ? <rect x={0} y={top + 6} width={100} height={400} fill={BLOOD_DARK} opacity={0.18} /> : null}
					</>
				) : null}
				{gel && level <= 0 ? <path d="M16 330 Q50 316 84 330 V400 H16 Z" fill="#E4E9EE" stroke={alpha(N, 0.35)} strokeWidth={2} /> : null}
				{taint > 0
					? [...Array(16)].map((_, i) => {
							const a = (i / 16) * Math.PI * 2;
							const r = 6 + 70 * taint * (0.4 + 0.6 * ((i * 7) % 5) / 5);
							return <circle key={i} cx={50 + Math.cos(a) * r * 0.45} cy={Math.max(top, 120) + 40 + Math.abs(Math.sin(a)) * r} r={4.5} fill={taintColor} stroke={N} strokeWidth={1.4} opacity={Math.min(1, taint * 2)} />;
						})
					: null}
				<rect x={16} y={150} width={68} height={110} fill="#FFFFFF" opacity={0.96} />
				<rect x={16} y={150} width={68} height={16} fill={cap} />
				{label ? (
					<text x={50} y={206} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={label.length > 5 ? 15 : 19} fill={N}>
						{label}
					</text>
				) : null}
				{[226, 240].map((y) => (
					<line key={y} x1={26} x2={74} y1={y} y2={y} stroke={alpha(N, 0.28)} strokeWidth={3} />
				))}
				<rect x={16} y={80} width={68} height={320} fill={`url(#tg${id})`} />
			</g>
			{mark > 0 ? (
				<g opacity={mark}>
					<line x1={2} x2={98} y1={392 - H * markAt} y2={392 - H * markAt} stroke={N} strokeWidth={4} strokeDasharray="8 6" />
					<path d={`M-6 ${392 - H * markAt - 9} l12 9 l-12 9 Z`} fill={LPI.pink} stroke={N} strokeWidth={2.5} />
				</g>
			) : null}
			<path d={body} fill="none" {...SK} />
			<line x1={26} y1={96} x2={26} y2={340} stroke="#fff" strokeOpacity={0.8} strokeWidth={5} strokeLinecap="round" />
			{/* bouchon */}
			<rect x={10} y={56} width={80} height={30} rx={6} fill={darker(cap, 0.12)} {...SK} />
			<path d="M4 18 Q4 4 18 4 H82 Q96 4 96 18 V62 H4 Z" fill={cap} {...SK} />
			{[18, 30, 42, 54].map((x) => (
				<line key={x} x1={x + 4} x2={x + 4} y1={12} y2={56} stroke={darker(cap, 0.3)} strokeWidth={3} opacity={0.55} />
			))}
			<path d="M14 14 Q16 8 26 8" stroke="#fff" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round" />
			{bad > 0 ? (
				<g opacity={bad} transform="translate(50 230)">
					<circle r={34} fill={LPI.paper} stroke={N} strokeWidth={4} />
					<path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" />
				</g>
			) : null}
		</svg>
	);
};

/** Flacon d'hémoculture (repère 160 × 340) : bouillon jaune clair, capsule, étiquette ; `o2` bulles d'oxygène, `noO2` O₂ barré. */
export const HemoFlask: React.FC<{size?: number; cap?: string; label: string; o2?: number; noO2?: number; level?: number}> = ({size = 160, cap = LPI.blue, label, o2 = 0, noO2 = 0, level = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const body = 'M52 70 H108 V96 Q148 112 148 160 V300 Q148 332 116 332 H44 Q12 332 12 300 V160 Q12 112 52 96 Z';
	return (
		<svg width={size} height={(size * 340) / 160} viewBox="0 0 160 340" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id={`hf${id}`}>
					<path d={body} />
				</clipPath>
			</defs>
			<path d={body} fill="#EEF3F8" />
			<g clipPath={`url(#hf${id})`}>
				<rect x={0} y={190} width={160} height={150} fill="#F2DE9A" />
				{level > 0 ? <rect x={0} y={190 - 50 * level} width={160} height={50 * level + 2} fill={BLOOD} opacity={0.85} /> : null}
				<rect x={12} y={200} width={136} height={92} fill="#fff" opacity={0.95} />
				<rect x={12} y={200} width={136} height={18} fill={cap} />
				<text x={80} y={262} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={label.length > 5 ? 25 : 30} fill={N}>
					{label}
				</text>
				{o2 > 0
					? [0, 1, 2, 3].map((k) => {
							const t = (frame / 40 + k / 4) % 1;
							return (
								<g key={k} opacity={o2 * Math.sin(t * Math.PI)} transform={`translate(${40 + k * 26} ${180 - t * 60})`}>
									<circle r={11} fill="#fff" stroke={LPI.blue} strokeWidth={3} />
								</g>
							);
						})
					: null}
			</g>
			<path d={body} fill="none" {...SK} />
			<path d="M26 150 Q30 118 56 108" stroke="#fff" strokeOpacity={0.8} strokeWidth={6} fill="none" strokeLinecap="round" />
			<rect x={44} y={34} width={72} height={40} rx={8} fill={cap} {...SK} />
			<circle cx={80} cy={34} r={20} fill="#C9D2DC" {...SK} />
			<circle cx={80} cy={34} r={8} fill="#8C98A6" />
			{o2 > 0 ? (
				<text x={150} y={80} fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={LPI.blue} opacity={o2}>
					O₂
				</text>
			) : null}
			{noO2 > 0 ? (
				<g opacity={noO2} transform="translate(160 66)">
					<text x={0} y={14} fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N} textAnchor="middle">
						O₂
					</text>
					<circle r={34} fill="none" stroke={LPI.pink} strokeWidth={7} />
					<line x1={-24} y1={24} x2={24} y2={-24} stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
				</g>
			) : null}
		</svg>
	);
};

/** Petit tube ou paire de flacons pour une case de la frise (repère libre, hauteur ≈ 150). */
export const SlotArt: React.FC<{k: number; first?: 'hemoc' | 'purge' | 'both'}> = ({k, first = 'hemoc'}) => {
	if (k === 0)
		return (
			<div style={{display: 'flex', gap: 3, alignItems: 'flex-end'}}>
				{first !== 'purge' ? <HemoFlask size={first === 'both' ? 34 : 46} label="" cap={HEMO_CAP.aero} /> : null}
				{first !== 'purge' ? <HemoFlask size={first === 'both' ? 34 : 46} label="" cap={HEMO_CAP.anaero} /> : null}
				{first !== 'hemoc' ? <Tube size={first === 'both' ? 26 : 36} cap={CAP.purge} /> : null}
			</div>
		);
	const key = ORDER[k].key as TubeKind;
	return <Tube size={38} cap={CAP[key]} />;
};

/**
 * La frise de l'ordre (6 cases numérotées) : chaque case se remplit à `fill[i]` (pop), la case `cur` est surlignée en rose,
 * les cases passées se cochent. Centrée sur `y`.
 */
export const OrderRail: React.FC<{y: number; at: number; fill: number[]; cur?: number; check?: number[]; scale?: number; out?: number; labels?: number[]; first?: 'hemoc' | 'purge' | 'both'; only?: number[]}> = ({y, at: t0, fill, cur = -1, check = [], scale = 1, out = 1e9, labels = [], first = 'hemoc', only}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > out + 8) return null;
	const keep = only ?? ORDER.map((_, i) => i);
	const o = Math.min(1, (frame - t0) / 6) * Math.max(0, Math.min(1, (out + 8 - frame) / 8));
	const W = 130;
	const G = 10;
	const x0 = 540 - (keep.length * W + (keep.length - 1) * G) / 2;
	const pop = (t: number) => (frame < t ? 0 : 1 + 0.12 * Math.exp(-(frame - t) / 3) * Math.cos((frame - t) * 0.9) - Math.exp(-(frame - t) / 2));
	return (
		<div style={{position: 'absolute', left: 0, top: y - 125, width: 1080, height: 250, opacity: o, transform: `scale(${scale})`, transformOrigin: '540px 125px'}}>
			{keep.map((k, i) => {
				const it = ORDER[k];
				const f = fill[i] ?? 1e9;
				const on = frame >= f;
				const isCur = i === cur;
				const ck = check[i] !== undefined && frame >= check[i];
				const lab = labels[i] !== undefined && frame >= labels[i];
				return (
					<div
						key={it.key}
						style={{
							position: 'absolute',
							left: x0 + i * (W + G),
							top: isCur ? 4 : 18,
							width: W,
							height: 210,
							boxSizing: 'border-box',
							borderRadius: 28,
							background: on ? LPI.paper : alpha(LPI.paper, 0.5),
							border: on ? `5px solid ${N}` : `5px dashed ${alpha(N, 0.45)}`,
							boxShadow: isCur ? `0 0 0 7px ${LPI.pink}` : on ? `0 8px 0 ${alpha(N, 0.12)}` : 'none',
						}}
					>
						<div style={{position: 'absolute', left: 8, top: 8, width: 44, height: 44, borderRadius: 22, background: on ? LPI.pink : alpha(LPI.paper, 0.8), border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N, zIndex: 2}}>{i + 1}</div>
						{on ? (
							<div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(f)})`}}>
								<SlotArt k={k} first={first} />
							</div>
						) : null}
						{lab ? <div style={{position: 'absolute', left: -10, right: -10, bottom: -50, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: N, whiteSpace: 'nowrap', transform: `scale(${pop(labels[i])})`}}>{it.additive}</div> : null}
						{ck ? (
							<div style={{position: 'absolute', right: -12, top: -14, width: 50, height: 50, borderRadius: 25, background: LPI.blue, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(check[i])})`}}>
								<svg width={30} height={30} viewBox="0 0 100 100">
									<path d="M22 52 L42 72 L78 30" fill="none" stroke={LPI.paper} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

/** Aiguille de prélèvement vue de profil, pointe vers le haut (repère 60 × 300), avec gaine de caoutchouc ; `drop` micro-goutte. */
export const NeedleUp: React.FC<{size?: number; drop?: number; dropColor?: string}> = ({size = 60, drop = 0, dropColor = CAP.edta}) => (
	<svg width={size} height={size * 5} viewBox="0 0 60 300" style={{overflow: 'visible'}}>
		<rect x={26} y={20} width={8} height={200} fill="#C9D2DC" stroke={N} strokeWidth={3} />
		<path d="M26 20 L30 0 L34 20 Z" fill="#C9D2DC" stroke={N} strokeWidth={3} strokeLinejoin="round" />
		<rect x={18} y={60} width={24} height={110} rx={12} fill="#E8E1D6" stroke={N} strokeWidth={3} opacity={0.9} />
		<rect x={4} y={210} width={52} height={90} rx={8} fill={LPI.blue} stroke={N} strokeWidth={4} />
		{drop > 0 ? <ellipse cx={30} cy={-4} rx={9 * drop} ry={11 * drop} fill={dropColor} stroke={N} strokeWidth={2.5} /> : null}
	</svg>
);

/** Globule rouge (disque biconcave) ; `mouth` 0 → 1 bouche ouverte qui croque ; `blocked` cadenas. */
export const RedCell: React.FC<{size?: number; mouth?: number; broken?: number}> = ({size = 120, mouth = 0, broken = 0}) => (
	<svg width={size} height={size} viewBox="0 0 120 120" style={{overflow: 'visible'}}>
		{broken > 0 ? (
			<g opacity={broken}>
				{[0, 1, 2, 3, 4].map((k) => (
					<path key={k} d={`M60 60 l${Math.cos(k * 1.26) * 54} ${Math.sin(k * 1.26) * 54}`} stroke={BLOOD} strokeWidth={10} strokeLinecap="round" />
				))}
			</g>
		) : null}
		<g opacity={1 - broken}>
			<circle cx={60} cy={60} r={50} fill="#D43A44" stroke={N} strokeWidth={5} />
			<ellipse cx={60} cy={60} rx={26} ry={22} fill="#B32634" />
			<path d="M32 40 Q40 28 56 26" stroke="#fff" strokeOpacity={0.55} strokeWidth={6} fill="none" strokeLinecap="round" />
			<circle cx={46} cy={54} r={6} fill={N} />
			<circle cx={74} cy={54} r={6} fill={N} />
			{mouth > 0 ? <ellipse cx={60} cy={80} rx={13} ry={11 * mouth} fill={N} /> : <path d="M48 78 Q60 86 72 78" stroke={N} strokeWidth={5} fill="none" strokeLinecap="round" />}
		</g>
	</svg>
);

/** Globule blanc (pour la NFS) ; `kind` : noyau d'un polynucléaire (en lobes), d'un lymphocyte (rond, gros) ou d'un monocyte (en haricot). */
export const WhiteCell: React.FC<{size?: number; kind?: 'pnn' | 'lympho' | 'mono' | 'eo' | 'baso'}> = ({size = 120, kind = 'pnn'}) => (
	<svg width={size} height={size} viewBox="0 0 120 120" style={{overflow: 'visible'}}>
		<circle cx={60} cy={60} r={50} fill="#F4F1FA" stroke={N} strokeWidth={5} />
		{kind === 'pnn' ? (
			<g fill="#9C7BD0" stroke={N} strokeWidth={3}>
				<circle cx={40} cy={52} r={13} />
				<circle cx={62} cy={42} r={13} />
				<circle cx={80} cy={60} r={13} />
				<circle cx={58} cy={74} r={12} />
				<path d="M48 50 L56 46 M72 50 L76 56 M66 70 L74 66" stroke="#9C7BD0" strokeWidth={6} />
			</g>
		) : kind === 'eo' ? (
			<g>
				{[[34, 40], [50, 82], [84, 44], [86, 76], [62, 30], [30, 70], [70, 90]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={7} fill="#F0A07E" stroke={N} strokeWidth={1.5} />
				))}
				<circle cx={46} cy={58} r={16} fill="#9C7BD0" stroke={N} strokeWidth={3} />
				<circle cx={74} cy={60} r={16} fill="#9C7BD0" stroke={N} strokeWidth={3} />
			</g>
		) : kind === 'baso' ? (
			<g>
				<path d="M40 50 Q50 36 66 44 Q82 52 74 68 Q62 80 46 70 Q34 62 40 50 Z" fill="#9C7BD0" stroke={N} strokeWidth={3} />
				{[[34, 36], [56, 30], [82, 40], [90, 64], [72, 86], [44, 86], [28, 62], [60, 58], [50, 66], [70, 54]].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r={6} fill={N} />
				))}
			</g>
		) : kind === 'lympho' ? (
			<circle cx={60} cy={60} r={36} fill="#8A68C2" stroke={N} strokeWidth={3} />
		) : (
			<path d="M34 46 Q50 30 74 38 Q88 44 84 60 Q78 70 66 62 Q56 58 52 72 Q40 82 32 66 Q28 56 34 46 Z" fill="#9C7BD0" stroke={N} strokeWidth={3} />
		)}
	</svg>
);
export const Platelet: React.FC<{size?: number}> = ({size = 80}) => (
	<svg width={size} height={size} viewBox="0 0 80 80">
		<path d="M14 40 Q10 20 32 16 Q52 8 64 24 Q74 42 60 58 Q44 72 26 62 Q12 56 14 40 Z" fill="#E9B7C9" stroke={N} strokeWidth={4} />
		{[[32, 34], [48, 30], [42, 48]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={4} fill="#B66A8A" />
		))}
	</svg>
);

/** Morceau de sucre. */
export const SugarCube: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 70 70">
		<path d="M10 24 L36 12 L62 24 L62 52 L36 64 L10 52 Z" fill="#fff" stroke={N} strokeWidth={4} strokeLinejoin="round" />
		<path d="M10 24 L36 36 L62 24 M36 36 V64" fill="none" stroke={N} strokeWidth={3} strokeLinejoin="round" />
		{[[22, 40], [48, 44], [30, 26], [46, 22]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={2.2} fill={alpha(N, 0.4)} />
		))}
	</svg>
);

/** Ion en pastille (« K⁺ », « Ca²⁺ », « Na⁺ »). */
export const Ion: React.FC<{label: string; tone?: string; size?: number; fs?: number}> = ({label, tone = LPI.sky, size = 90, fs = 0.36}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: tone, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * fs, color: N, boxSizing: 'border-box'}}>{label}</div>
);

/** Fiche de résultat du labo : une ligne « K⁺ 7,0 mmol/L » qui clignote en rose ; `fake` tampon FAUX barré. */
export const LabSheet: React.FC<{width?: number; value?: string; alarm?: number; fake?: number; lines?: string[][]; hot?: number}> = ({width = 520, value = '', alarm = 0, fake = 0, lines, hot = 1}) => {
	const frame = useCurrentFrame();
	const blink = alarm > 0 ? 0.5 + 0.5 * Math.sin(frame / 2.2) : 0;
	const rows = lines ?? [
		['Sodium', '140', 'mmol/L'],
		['Potassium', value, 'mmol/L'],
		['Créatinine', '75', 'µmol/L'],
	];
	return (
		<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: '#fff', border: `6px solid ${N}`, padding: '22px 26px', boxShadow: `0 14px 0 ${alpha(N, 0.15)}`}}>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.14em', color: alpha(N, 0.7)}}>LABORATOIRE · RÉSULTATS</div>
			{rows.map(([a, b, c], i) => {
				const isHot = i === hot && alarm > 0;
				return (
					<div key={a} style={{marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 14px', borderRadius: 16, background: isHot ? alpha(LPI.pink, 0.35 + 0.5 * blink) : alpha(LPI.sky, 0.35), position: 'relative'}}>
						<div style={{flex: 1, fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: N}}>{a}</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: isHot ? 52 : 36, color: N}}>{b}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: alpha(N, 0.7)}}>{c}</div>
						{isHot ? <div style={{position: 'absolute', right: -16, top: -16, width: 44, height: 44, borderRadius: 22, background: LPI.pink, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>!</div> : null}
						{i === hot && fake > 0 ? <div style={{position: 'absolute', left: 8, right: 8, top: '50%', height: 8, borderRadius: 4, background: LPI.pink, transform: `scaleX(${fake})`, transformOrigin: 'left'}} /> : null}
					</div>
				);
			})}
		</div>
	);
};

/** Mégacaryocyte (très grosse cellule de la moelle) : noyau en lobes ; `shed` 0 → 1 : des plaquettes s'en détachent à droite. */
export const Megakaryocyte: React.FC<{size?: number; shed?: number}> = ({size = 320, shed = 0}) => (
	<svg width={size * 1.6} height={size} viewBox="0 0 480 300" style={{overflow: 'visible'}}>
		<path d="M150 20 Q240 14 270 90 Q300 160 262 230 Q220 292 140 282 Q50 272 26 190 Q6 110 60 56 Q96 22 150 20 Z" fill="#EBD3F0" stroke={N} strokeWidth={6} />
		{[[90, 90], [200, 80], [110, 220], [210, 210], [70, 160], [240, 150], [160, 260]].map(([x, y], i) => (
			<circle key={i} cx={x} cy={y} r={4} fill="#C17BB0" />
		))}
		<g fill="#8A68C2" stroke={N} strokeWidth={4}>
			<circle cx={120} cy={130} r={34} />
			<circle cx={170} cy={110} r={30} />
			<circle cx={180} cy={170} r={34} />
			<circle cx={128} cy={186} r={28} />
		</g>
		{[0, 1, 2, 3, 4].map((k) => {
			const t = Math.min(1, Math.max(0, shed * 5 - k));
			if (t <= 0) return null;
			return <ellipse key={k} cx={270 + t * (60 + k * 32)} cy={70 + k * 42 + Math.sin(k) * 10} rx={24} ry={16} fill="#E9B7C9" stroke={N} strokeWidth={3} />;
		})}
	</svg>
);

/** Carte des normes adultes (repère discret mais visible) : lignes [qui, valeur]. */
export const NormCard: React.FC<{rows: string[][]; width?: number; note?: string}> = ({rows, width = 900, note}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: LPI.paper, border: `5px solid ${N}`, boxShadow: `0 10px 0 ${alpha(N, 0.12)}`, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 20}}>
		<div style={{padding: '8px 16px', borderRadius: 999, background: LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.08em', color: N, whiteSpace: 'nowrap'}}>NORMES</div>
		<div style={{flex: 1}}>
			{rows.map(([who, v]) => (
				<div key={who + v} style={{display: 'flex', alignItems: 'baseline', gap: 14, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N, lineHeight: 1.25}}>
					{who ? <span style={{fontFamily: FONT.body, fontSize: 28, color: alpha(N, 0.75), minWidth: 110}}>{who}</span> : null}
					<span>{v}</span>
				</div>
			))}
			{note ? <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: alpha(N, 0.7)}}>{note}</div> : null}
		</div>
	</div>
);

/* ───────────── aiguille à ailettes + tubulure (vidéo n° 65, le tube de purge) ───────────── */

const cubic = (p: number[][], t: number) => {
	const u = 1 - t;
	return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
};
/** Points de la tubulure (repère 1100 × 520), de l'aiguille (début) au corps de pompe (fin). */
export const LINE_PTS: number[][] = (() => {
	const a = [
		[250, 262],
		[400, 262],
		[390, 450],
		[560, 450],
	];
	const b = [
		[560, 450],
		[730, 450],
		[700, 262],
		[830, 262],
	];
	const out: number[][] = [];
	for (let i = 0; i <= 60; i++) out.push(cubic(a, i / 60));
	for (let i = 1; i <= 60; i++) out.push(cubic(b, i / 60));
	return out;
})();

/**
 * Prélèvement avec une aiguille à ailettes (repère 1100 × 520) : la peau et la veine à gauche, les ailettes, la longue
 * tubulure et, à droite, le corps de pompe avec un tube couché. `blood` 0 → 1 : le sang avance dans la tubulure ;
 * `bubbles` : bulles d'air poussées vers le tube ; `tubeCap` / `tubeLevel` / `tubeMark` (trait de remplissage) /
 * `tubeIn` (le tube glisse dans le corps de pompe) ; `tubeBad` : croix rose sur le tube mal rempli.
 */
export const WingedLine: React.FC<{width?: number; blood?: number; bubbles?: number; tubeCap?: string; tubeLevel?: number; tubeMark?: number; tubeIn?: number; tubeBad?: number}> = ({
	width = 1000,
	blood = 0,
	bubbles = 0,
	tubeCap = CAP.purge,
	tubeLevel = 0,
	tubeMark = 0,
	tubeIn = 1,
	tubeBad = 0,
}) => {
	const frame = useCurrentFrame();
	const n = LINE_PTS.length;
	const k = Math.max(0, Math.min(n, Math.round(blood * n)));
	const pts = (arr: number[][]) => arr.map((p) => p.join(',')).join(' ');
	const tx = 880 + (1 - tubeIn) * 160;
	const len = 200;
	return (
		<svg width={width} height={(width / 1100) * 520} viewBox="0 0 1100 520" style={{overflow: 'visible'}}>
			{/* peau + veine */}
			<rect x={0} y={150} width={250} height={230} rx={60} fill="#F1C9A5" stroke={N} strokeWidth={6} />
			<path d="M0 262 H250" stroke="#7E97C6" strokeWidth={30} strokeLinecap="round" />
			<path d="M0 262 H250" stroke={BLOOD} strokeWidth={14} strokeLinecap="round" opacity={0.75} />
			{/* tubulure : air (clair) puis sang qui avance */}
			<polyline points={pts(LINE_PTS)} fill="none" stroke={N} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
			<polyline points={pts(LINE_PTS)} fill="none" stroke={alpha(LPI.paper, 0.95)} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
			{k > 1 ? <polyline points={pts(LINE_PTS.slice(0, k))} fill="none" stroke={BLOOD} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /> : null}
			{bubbles > 0
				? [0, 1, 2, 3, 4].map((i) => {
						const span = n - k;
						if (span < 4) return null;
						const idx = Math.min(n - 1, k + Math.floor((((frame * 0.9 + i * span) / 5) % span)));
						const [x, y] = LINE_PTS[idx];
						return <circle key={i} cx={x} cy={y} r={6} fill={LPI.sky} stroke={N} strokeWidth={2.5} opacity={bubbles} />;
					})
				: null}
			{/* aiguille + ailettes */}
			<path d="M120 262 H250" stroke="#9AA4B5" strokeWidth={6} strokeLinecap="round" />
			<g transform="translate(250 262)">
				<path d="M0 -10 L-40 -70 Q-10 -84 26 -66 L22 -10 Z" fill={LPI.blue} stroke={N} strokeWidth={5} strokeLinejoin="round" />
				<path d="M0 10 L-40 70 Q-10 84 26 66 L22 10 Z" fill={LPI.blue} stroke={N} strokeWidth={5} strokeLinejoin="round" />
				<rect x={-10} y={-14} width={42} height={28} rx={10} fill={LPI.sky} stroke={N} strokeWidth={5} />
			</g>
			{/* corps de pompe */}
			<rect x={830} y={222} width={130} height={80} rx={16} fill={alpha(LPI.sky, 0.6)} stroke={N} strokeWidth={6} />
			{/* le tube couché, bouchon à gauche dans le corps de pompe */}
			<g transform={`translate(${tx} 262)`} opacity={Math.min(1, tubeIn * 2)}>
				<rect x={0} y={-30} width={50} height={60} rx={10} fill={tubeCap} stroke={N} strokeWidth={5} />
				<path d={`M50 -24 H${50 + len - 24} Q${50 + len} -24 ${50 + len} 0 Q${50 + len} 24 ${50 + len - 24} 24 H50 Z`} fill={alpha('#FFFFFF', 0.85)} stroke={N} strokeWidth={5} />
				{tubeLevel > 0 ? <path d={`M${50 + len - len * tubeLevel} -18 H${50 + len - 24} Q${50 + len - 6} -18 ${50 + len - 6} 0 Q${50 + len - 6} 18 ${50 + len - 24} 18 H${50 + len - len * tubeLevel} Z`} fill={BLOOD} /> : null}
				{tubeMark > 0 ? <path d={`M${50 + len * 0.18} -32 V32`} stroke={N} strokeWidth={5} strokeDasharray="8 6" opacity={tubeMark} /> : null}
				{tubeBad > 0 ? (
					<g transform={`translate(${50 + len / 2} -70) scale(${tubeBad})`}>
						<circle r={30} fill={LPI.pink} stroke={N} strokeWidth={5} />
						<path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke={N} strokeWidth={7} strokeLinecap="round" />
					</g>
				) : null}
			</g>
		</svg>
	);
};
