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
};
export const BLOOD = '#A3172B';
export const BLOOD_DARK = '#6E0E1C';
export const SERUM = '#F1CF6E';
export type TubeKind = keyof typeof CAP;

/** L'ordre, case par case (0 = hémocultures). */
export const ORDER: {key: 'hemoc' | TubeKind; name: string; additive: string}[] = [
	{key: 'hemoc', name: 'Hémocultures', additive: 'flacons'},
	{key: 'citrate', name: 'Bleu clair', additive: 'citrate'},
	{key: 'sec', name: 'Rouge / jaune', additive: 'sec'},
	{key: 'hepar', name: 'Vert', additive: 'héparine'},
	{key: 'edta', name: 'Violet', additive: 'EDTA'},
	{key: 'fluor', name: 'Gris', additive: 'fluorure'},
];

const darker = (hex: string, k = 0.22) => {
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
}> = ({size = 100, cap, level = 0, serum = 0, gel = false, mark = 0, markAt = 0.72, additive = 0, taint = 0, taintColor = CAP.edta, label, bad = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const body = 'M16 80 H84 V350 Q84 392 50 392 Q16 392 16 350 Z';
	const H = 300;
	const top = 392 - H * level;
	const clotTop = 392 - H * level * (1 - 0.48 * serum);
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
export const SlotArt: React.FC<{k: number}> = ({k}) => {
	if (k === 0)
		return (
			<div style={{display: 'flex', gap: 4, alignItems: 'flex-end'}}>
				<HemoFlask size={50} label="" cap={LPI.blue} />
				<HemoFlask size={50} label="" cap={N} />
			</div>
		);
	if (k === 2)
		return (
			<div style={{display: 'flex', gap: 6}}>
				<Tube size={34} cap={CAP.sec} />
				<Tube size={34} cap={CAP.gel} />
			</div>
		);
	const key = ORDER[k].key as TubeKind;
	return <Tube size={38} cap={CAP[key]} />;
};

/**
 * La frise de l'ordre (6 cases numérotées) : chaque case se remplit à `fill[i]` (pop), la case `cur` est surlignée en rose,
 * les cases passées se cochent. Centrée sur `y`.
 */
export const OrderRail: React.FC<{y: number; at: number; fill: number[]; cur?: number; check?: number[]; scale?: number; out?: number; labels?: number[]}> = ({y, at: t0, fill, cur = -1, check = [], scale = 1, out = 1e9, labels = []}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > out + 8) return null;
	const o = Math.min(1, (frame - t0) / 6) * Math.max(0, Math.min(1, (out + 8 - frame) / 8));
	const W = 150;
	const G = 14;
	const x0 = 540 - (6 * W + 5 * G) / 2;
	const pop = (t: number) => (frame < t ? 0 : 1 + 0.12 * Math.exp(-(frame - t) / 3) * Math.cos((frame - t) * 0.9) - Math.exp(-(frame - t) / 2));
	return (
		<div style={{position: 'absolute', left: 0, top: y - 125, width: 1080, height: 250, opacity: o, transform: `scale(${scale})`, transformOrigin: '540px 125px'}}>
			{ORDER.map((it, i) => {
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
								<SlotArt k={i} />
							</div>
						) : null}
						{lab ? <div style={{position: 'absolute', left: -10, right: -10, bottom: -50, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 25, color: N, whiteSpace: 'nowrap', transform: `scale(${pop(labels[i])})`}}>{it.additive}</div> : null}
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

/** Globule blanc et plaquette (pour la NFS). */
export const WhiteCell: React.FC<{size?: number}> = ({size = 120}) => (
	<svg width={size} height={size} viewBox="0 0 120 120">
		<circle cx={60} cy={60} r={50} fill="#F4F1FA" stroke={N} strokeWidth={5} />
		<path d="M40 52 Q46 34 62 42 Q76 30 82 50 Q90 66 72 72 Q60 84 46 72 Q32 66 40 52 Z" fill="#9C7BD0" stroke={N} strokeWidth={3} />
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
export const Ion: React.FC<{label: string; tone?: string; size?: number}> = ({label, tone = LPI.sky, size = 90}) => (
	<div style={{width: size, height: size, borderRadius: size / 2, background: tone, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.36, color: N, boxSizing: 'border-box'}}>{label}</div>
);

/** Fiche de résultat du labo : une ligne « K⁺ 7,0 mmol/L » qui clignote en rose ; `fake` tampon FAUX barré. */
export const LabSheet: React.FC<{width?: number; value: string; alarm?: number; fake?: number}> = ({width = 520, value, alarm = 0, fake = 0}) => {
	const frame = useCurrentFrame();
	const blink = alarm > 0 ? 0.5 + 0.5 * Math.sin(frame / 2.2) : 0;
	const rows = [
		['Sodium', '140', 'mmol/L'],
		['Potassium', value, 'mmol/L'],
		['Créatinine', '75', 'µmol/L'],
	];
	return (
		<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: '#fff', border: `6px solid ${N}`, padding: '22px 26px', boxShadow: `0 14px 0 ${alpha(N, 0.15)}`}}>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.14em', color: alpha(N, 0.7)}}>LABORATOIRE · RÉSULTATS</div>
			{rows.map(([a, b, c], i) => {
				const hot = i === 1 && alarm > 0;
				return (
					<div key={a} style={{marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12, padding: '8px 14px', borderRadius: 16, background: hot ? alpha(LPI.pink, 0.35 + 0.5 * blink) : alpha(LPI.sky, 0.35), position: 'relative'}}>
						<div style={{flex: 1, fontFamily: FONT.body, fontWeight: 800, fontSize: 32, color: N}}>{a}</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: hot ? 52 : 36, color: N}}>{b}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 22, color: alpha(N, 0.7)}}>{c}</div>
						{hot ? <div style={{position: 'absolute', right: -16, top: -16, width: 44, height: 44, borderRadius: 22, background: LPI.pink, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N}}>!</div> : null}
						{i === 1 && fake > 0 ? <div style={{position: 'absolute', left: 8, right: 8, top: '50%', height: 8, borderRadius: 4, background: LPI.pink, transform: `scaleX(${fake})`, transformOrigin: 'left'}} /> : null}
					</div>
				);
			})}
		</div>
	);
};
