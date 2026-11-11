// Série courte « Les plaies » (30 – 40 s par vidéo, une situation vécue en accroche) : objets et corps du quotidien.
// Vélo qui chute (`Bike`, `Stone`), genou de face qui se râpe (`Knee`), jauges qui se remplissent (`Meter`), tendon /
// nerf / vaisseau posés dans la coupe de peau de wound.tsx (`DeepBits`, repère SKIN 900 × 500), règle de profondeur
// (`DepthRuler`), pastille de jours (`DayChip`). Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {SKIN} from './wound';

const N = LPI.navy;
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const S = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/* ───────────── vélo ───────────── */

/** Repère 520 × 330 : vélo de profil (avance vers la droite) ; `spin` en degrés fait tourner les rayons. */
export const Bike: React.FC<{width?: number; spin?: number}> = ({width = 520, spin = 0}) => {
	const wheel = (cx: number) => (
		<g transform={`translate(${cx} 240)`}>
			<circle r={86} fill={alpha(LPI.paper, 0.6)} {...S} strokeWidth={10} />
			<circle r={70} fill="none" stroke={alpha(N, 0.25)} strokeWidth={4} />
			<g transform={`rotate(${spin})`}>
				{[0, 45, 90, 135].map((a) => (
					<line key={a} x1={-70} x2={70} y1={0} y2={0} transform={`rotate(${a})`} stroke={alpha(N, 0.55)} strokeWidth={4} />
				))}
			</g>
			<circle r={12} fill={LPI.pink} {...S} strokeWidth={5} />
		</g>
	);
	return (
		<svg width={width} height={(width * 330) / 520} viewBox="0 0 520 330" style={{overflow: 'visible', display: 'block'}}>
			{wheel(110)}
			{wheel(420)}
			{/* cadre */}
			<path d="M110 240 L210 120 L370 120 L250 240 Z M210 120 L190 80 M370 120 L420 240 M370 120 L382 66" fill="none" stroke={LPI.blue} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" />
			<path d="M110 240 L210 120 L370 120 L250 240 Z M210 120 L190 80 M370 120 L420 240 M370 120 L382 66" fill="none" stroke={N} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" opacity={0.5} />
			{/* selle, guidon, pédalier */}
			<path d="M156 74 H224" stroke={N} strokeWidth={16} strokeLinecap="round" />
			<path d="M360 66 H404 Q420 66 420 52" fill="none" stroke={N} strokeWidth={10} strokeLinecap="round" />
			<circle cx={250} cy={240} r={22} fill={LPI.paper} {...S} strokeWidth={6} />
			<g transform={`translate(250 240) rotate(${spin * 0.6})`}>
				<line x1={0} y1={0} x2={0} y2={-40} stroke={N} strokeWidth={8} strokeLinecap="round" />
				<rect x={-16} y={-48} width={32} height={10} rx={4} fill={LPI.pink} stroke={N} strokeWidth={3} />
			</g>
		</svg>
	);
};

/** Caillou (repère 140 × 90). */
export const Stone: React.FC<{size?: number}> = ({size = 140}) => (
	<svg width={size} height={(size * 90) / 140} viewBox="0 0 140 90" style={{overflow: 'visible', display: 'block'}}>
		<path d="M10 84 C6 50 30 18 70 14 C110 12 136 46 130 84 Z" fill={LPI.sky} {...S} />
		<path d="M44 44 Q60 32 78 36" fill="none" stroke={LPI.paper} strokeWidth={7} strokeLinecap="round" />
	</svg>
);

/* ───────────── genou de face ───────────── */

/**
 * Repère 400 × 560 : jambe de face (short en haut), rotule au centre. `scrape` 0 → 1 : la peau se râpe de gauche à
 * droite ; `blood` : petits points de sang ; `pain` : éclairs ; `heal` 0 → 1 : ça se referme (croûte puis peau neuve).
 */
export const Knee: React.FC<{width?: number; scrape?: number; blood?: number; pain?: number; heal?: number}> = ({width = 400, scrape = 0, blood = 0, pain = 0, heal = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const LEG = 'M96 120 C90 220 104 280 112 330 C118 380 106 440 112 560 L292 560 C298 440 284 380 290 330 C298 280 312 220 306 120 Z';
	const PATCH = 'M128 270 C150 238 250 230 276 262 C296 292 286 350 256 364 C214 380 160 372 138 346 C118 320 116 292 128 270 Z';
	const sc = scrape * (1 - heal);
	return (
		<svg width={width} height={(width * 560) / 400} viewBox="0 0 400 560" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`kn${id}`}>
					<rect x={0} y={0} width={110 + 200 * cl(scrape)} height={560} />
				</clipPath>
			</defs>
			<path d={LEG} fill={LPI.paper} {...S} />
			<path d={LEG} fill={alpha(LPI.pink, 0.22)} />
			{/* rotule */}
			<path d="M150 262 C170 236 232 236 252 262 M146 340 C170 364 232 364 256 340" fill="none" stroke={alpha(N, 0.35)} strokeWidth={5} strokeLinecap="round" />
			{/* short */}
			<path d="M70 0 H330 L322 136 C260 150 140 150 80 136 Z" fill={LPI.blue} {...S} />
			<path d="M200 10 V138" stroke={alpha(N, 0.4)} strokeWidth={5} />
			{/* éraflure */}
			{scrape > 0 ? (
				<g clipPath={`url(#kn${id})`}>
					<path d={PATCH} fill={alpha(LPI.pink, 0.95 * (1 - heal) + 0.25 * heal)} stroke={alpha(N, 0.6 * (1 - heal))} strokeWidth={4} />
					{Array.from({length: 7}, (_, i) => (
						<path key={i} d={`M${136 + (i % 2) * 10} ${276 + i * 13} L${270 - (i % 3) * 12} ${270 + i * 13}`} stroke={alpha(N, 0.5 * sc)} strokeWidth={3.5} strokeLinecap="round" />
					))}
					{Array.from({length: 9}, (_, i) => (
						<circle key={i} cx={150 + ((i * 47) % 120)} cy={284 + ((i * 31) % 70)} r={4 + (i % 3) * 2.5} fill={LPI.pink} stroke={N} strokeWidth={2.5} opacity={blood * (1 - heal)} />
					))}
				</g>
			) : null}
			{/* croûte, puis peau neuve */}
			{heal > 0 ? <path d={PATCH} fill={alpha(N, 0.4 * cl(heal * 2) * cl(2 - heal * 2))} /> : null}
			{/* douleur */}
			{pain > 0
				? [
						[92, 250, -1],
						[312, 250, 1],
						[90, 360, -1],
						[314, 360, 1],
					].map(([x, y, s], i) => {
						const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 1.7);
						return <path key={i} d={`M${x} ${y} l${s * -26} 14 l${s * 12} 10 l${s * -28} 18`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={pain * (0.4 + 0.6 * f)} transform={`translate(${s * 4 * f} 0)`} />;
					})
				: null}
		</svg>
	);
};

/* ───────────── jauge ───────────── */

/** Jauge horizontale (largeur 900) : étiquette à gauche, barre qui se remplit (`value` 0 → 1), mot à droite. */
export const Meter: React.FC<{label: string; value: number; tone?: string; word?: string; width?: number}> = ({label, value, tone = LPI.pink, word, width = 900}) => (
	<div style={{width, display: 'flex', alignItems: 'center', gap: 22, padding: '18px 26px', boxSizing: 'border-box', borderRadius: 36, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
		<div style={{width: 250, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>{label}</div>
		<div style={{flex: 1, height: 58, borderRadius: 29, border: `5px solid ${N}`, background: alpha(LPI.sky, 0.45), overflow: 'hidden', position: 'relative'}}>
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${cl(value) * 100}%`, background: tone, borderRight: value > 0.02 && value < 0.99 ? `5px solid ${N}` : undefined}} />
			{[0.25, 0.5, 0.75].map((t) => (
				<div key={t} style={{position: 'absolute', left: `${t * 100}%`, top: 8, bottom: 8, width: 4, background: alpha(N, 0.25)}} />
			))}
		</div>
		{word ? <div style={{minWidth: 120, textAlign: 'right', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N}}>{word}</div> : null}
	</div>
);

/* ───────────── sous la plaie profonde ───────────── */

/**
 * Calque sur `SkinBlock` (même repère 900 × 500) : vaisseau (dans le derme profond), nerf (hypoderme), tendon (muscle).
 * Chacun 0 → 1 (apparition) ; `cut` : coupés là où passe la plaie (x = cx) ; `gush` : le sang sort du vaisseau coupé.
 */
export const DeepBits: React.FC<{width?: number; vessel?: number; nerve?: number; tendon?: number; cut?: number; gush?: number}> = ({width = 900, vessel = 0, nerve = 0, tendon = 0, cut = 0, gush = 0}) => {
	const frame = useCurrentFrame();
	const {w, h, cx, derm, hypo, musc} = SKIN;
	const gap = 34 * cut;
	const seg = (y: number, draw: (x0: number, x1: number) => React.ReactNode) => (
		<>
			{draw(0, cx - gap)}
			{draw(cx + gap, w)}
		</>
	);
	const yV = derm + 26;
	const yN = (derm + hypo) / 2 + 30;
	const yT = (hypo + musc) / 2 + 10;
	return (
		<svg width={width} height={(width * h) / w} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			{tendon > 0 ? (
				<g opacity={tendon}>
					{seg(yT, (a, b) => (
						<g key={a}>
							<rect x={a} y={yT - 20} width={b - a} height={40} rx={20} fill={LPI.paper} stroke={N} strokeWidth={5} />
							{Array.from({length: Math.max(0, Math.floor((b - a) / 40))}, (_, i) => (
								<line key={i} x1={a + 20 + i * 40} x2={a + 40 + i * 40} y1={yT - 8} y2={yT + 8} stroke={alpha(N, 0.3)} strokeWidth={3} />
							))}
						</g>
					))}
				</g>
			) : null}
			{nerve > 0 ? (
				<g opacity={nerve}>
					{seg(yN, (a, b) => (
						<path key={a} d={`M${a} ${yN} ${Array.from({length: 8}, (_, i) => `Q${a + ((b - a) * (i + 0.5)) / 8} ${yN + (i % 2 ? 12 : -12)} ${a + ((b - a) * (i + 1)) / 8} ${yN}`).join(' ')}`} fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" />
					))}
					{Array.from({length: 3}, (_, k) => {
						const t = (frame * 0.025 + k / 3) % 1;
						const x = t * w;
						return Math.abs(x - cx) > gap + 10 ? <circle key={k} cx={x} cy={yN} r={9} fill={LPI.sky} stroke={N} strokeWidth={3} /> : null;
					})}
				</g>
			) : null}
			{vessel > 0 ? (
				<g opacity={vessel}>
					{seg(yV, (a, b) => (
						<rect key={a} x={a} y={yV - 15} width={b - a} height={30} rx={15} fill={LPI.pink} stroke={N} strokeWidth={5} />
					))}
					{Array.from({length: 6}, (_, k) => {
						const t = (frame * 0.03 + k / 6) % 1;
						const x = t * w;
						return Math.abs(x - cx) > gap + 12 ? <circle key={k} cx={x} cy={yV} r={7} fill={LPI.paper} opacity={0.85} /> : null;
					})}
				</g>
			) : null}
			{gush > 0
				? Array.from({length: 10}, (_, k) => {
						const t = (frame * 0.05 + k / 10) % 1;
						const side = k % 2 ? 1 : -1;
						const x = cx + side * (6 + 30 * t);
						const y = yV - t * (yV - 30) - Math.sin(t * Math.PI) * 40;
						return <circle key={k} cx={x} cy={y} r={11 - 6 * t} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={gush * (1 - t * 0.6)} />;
					})
				: null}
		</svg>
	);
};

/* ───────────── règle de profondeur ───────────── */

/** Règle verticale graduée (hauteur h) avec une flèche qui descend jusqu'à `k` (0 → 1). */
export const DepthRuler: React.FC<{h?: number; k: number}> = ({h = 420, k}) => (
	<svg width={150} height={h + 60} viewBox={`0 0 150 ${h + 60}`} style={{overflow: 'visible', display: 'block'}}>
		<rect x={20} y={10} width={56} height={h} rx={14} fill={LPI.paper} {...S} />
		{Array.from({length: 11}, (_, i) => (
			<line key={i} x1={20} x2={i % 5 === 0 ? 60 : 46} y1={10 + (i * h) / 10} y2={10 + (i * h) / 10} stroke={N} strokeWidth={4} />
		))}
		<rect x={26} y={14} width={44} height={Math.max(0, (h - 8) * cl(k))} rx={10} fill={alpha(LPI.pink, 0.8)} />
		<path d={`M96 ${10 + h * cl(k)} l40 -24 v48 Z`} fill={LPI.pink} {...S} strokeWidth={5} />
	</svg>
);

/* ───────────── pastille de jours ───────────── */

/** Pastille ronde « J + n » (calendrier) qui saute à chaque changement. */
export const DayChip: React.FC<{text: string; tone?: string; size?: number}> = ({text, tone = LPI.sky, size = 200}) => (
	<div style={{width: size, height: size, borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
		<div style={{height: size * 0.28, background: tone, borderBottom: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: size * 0.22}}>
			<div style={{width: 14, height: 14, borderRadius: 7, background: N}} />
			<div style={{width: 14, height: 14, borderRadius: 7, background: N}} />
		</div>
		<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.3, color: N, whiteSpace: 'nowrap'}}>{text}</div>
	</div>
);

/* ───────────── portière qui se referme sur les doigts ───────────── */

/**
 * Repère 600 × 520 : montant de la voiture à droite, portière qui arrive de la gauche (`close` 0 → 1) et des doigts
 * glissés dans l'interstice ; `crush` 0 → 1 : les doigts s'écrasent (rose), éclairs de douleur.
 */
export const CarDoor: React.FC<{width?: number; close: number; crush?: number}> = ({width = 600, close, crush = 0}) => {
	const frame = useCurrentFrame();
	const edge = 120 + 300 * cl(close);
	const fingers = [150, 230, 310, 390];
	return (
		<svg width={width} height={(width * 520) / 600} viewBox="0 0 600 520" style={{overflow: 'visible', display: 'block'}}>
			{/* carrosserie (montant) */}
			<rect x={440} y={20} width={140} height={480} rx={26} fill={LPI.blue} {...S} />
			<rect x={466} y={50} width={88} height={160} rx={16} fill={LPI.sky} stroke={N} strokeWidth={5} />
			{/* doigts (main à droite, derrière le montant) */}
			{fingers.map((y, i) => {
				const sq = crush * (0.55 - i * 0.04);
				const x0 = Math.max(edge - 30, 320);
				return (
					<g key={i} transform={`translate(0 ${y})`}>
						<rect x={x0 + 40 * sq} y={-26 - 6 * sq} width={480 - x0 - 40 * sq} height={52 + 12 * sq} rx={26 - 10 * sq} fill={LPI.paper} {...S} strokeWidth={6} />
						<rect x={x0 + 40 * sq} y={-26 - 6 * sq} width={60} height={52 + 12 * sq} rx={20} fill={alpha(LPI.pink, 0.25 + 0.7 * crush)} />
						<path d={`M${x0 + 20 + 40 * sq} ${-12} q10 12 0 24`} fill="none" stroke={alpha(N, 0.35)} strokeWidth={4} />
					</g>
				);
			})}
			{/* portière */}
			<g transform={`translate(${edge - 420} 0)`}>
				<path d="M0 30 H400 Q420 30 420 50 V480 Q420 500 400 500 H0 Z" fill={LPI.blue} {...S} />
				<path d="M40 60 H370 Q390 60 390 80 V220 H40 Z" fill={LPI.sky} stroke={N} strokeWidth={5} />
				<path d="M90 90 L170 190 M150 80 L240 190" stroke={alpha(LPI.paper, 0.8)} strokeWidth={10} strokeLinecap="round" />
				<rect x={280} y={290} width={90} height={26} rx={13} fill={LPI.paper} stroke={N} strokeWidth={5} />
			</g>
			{/* douleur */}
			{crush > 0
				? [0, 1, 2].map((i) => {
						const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 2);
						return <path key={i} d={`M${edge + 20 + i * 30} ${110 + i * 120} l24 -26 l6 18 l26 -24`} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={crush * (0.4 + 0.6 * f)} />;
					})
				: null}
		</svg>
	);
};

/* ───────────── plaie vue de dessus ───────────── */

/**
 * Repère 700 × 420 : un carré de peau vu de dessus, avec une plaie franche (`clean` : fente droite, bords nets) ou
 * contuse (`ragged` : bords déchiquetés). `open` 0 → 1 ouverture ; `sutures` 0 → 1 ; `bruise` : tissus écrasés autour
 * (bleuté) ; `necrosis` : îlots bleu nuit qui gagnent les bords ; `edges` : les bords surlignés (repère visuel).
 */
export const WoundTop: React.FC<{width?: number; kind: 'clean' | 'ragged'; open?: number; sutures?: number; bruise?: number; necrosis?: number; edges?: number}> = ({width = 700, kind, open = 1, sutures = 0, bruise = 0, necrosis = 0, edges = 0}) => {
	const id = React.useId().replace(/:/g, '');
	const o = cl(open);
	const cx = 350;
	const cy = 210;
	const top: [number, number][] = kind === 'clean' ? [[130, 0], [570, 0]] : [[120, 0], [170, -18], [210, 6], [260, -30], [300, -4], [350, -40], [390, -8], [440, -34], [490, 2], [530, -22], [580, 0]];
	const bot: [number, number][] = kind === 'clean' ? [[570, 0], [130, 0]] : [[580, 0], [540, 24], [500, 4], [450, 38], [400, 10], [350, 44], [300, 12], [250, 36], [200, 4], [160, 22], [120, 0]];
	const amp = kind === 'clean' ? 34 : 1;
	const pt = ([x, d]: [number, number], s: number) => {
		const bulge = Math.sin(((x - 120) / 460) * Math.PI);
		return `${x} ${cy + s * (amp * bulge * o + Math.abs(d) * o * (kind === 'ragged' ? 1 : 0) + (kind === 'ragged' ? 18 * bulge * o : 0))}`;
	};
	const d = `M${top.map((p) => pt(p, -1)).join(' L')} L${bot.map((p) => pt(p, 1)).join(' L')} Z`;
	return (
		<svg width={width} height={(width * 420) / 700} viewBox="0 0 700 420" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`wt${id}`}>
					<rect x={10} y={10} width={680} height={400} rx={60} />
				</clipPath>
			</defs>
			<g clipPath={`url(#wt${id})`}>
				<rect x={10} y={10} width={680} height={400} fill={LPI.paper} />
				<rect x={10} y={10} width={680} height={400} fill={alpha(LPI.pink, 0.24)} />
				{Array.from({length: 18}, (_, i) => (
					<path key={i} d={`M${40 + ((i * 97) % 620)} ${40 + ((i * 61) % 340)} l14 4`} stroke={alpha(N, 0.12)} strokeWidth={4} strokeLinecap="round" />
				))}
				{/* tissus écrasés autour */}
				{bruise > 0 ? (
					<>
						<ellipse cx={cx} cy={cy} rx={300} ry={150} fill={alpha(LPI.blue, 0.28 * bruise)} />
						<ellipse cx={cx} cy={cy} rx={250} ry={110} fill={alpha(LPI.blue, 0.3 * bruise)} />
					</>
				) : null}
				{/* la plaie */}
				<path d={d} fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
				<path d={d} fill={alpha(N, 0.12)} transform={`translate(0 ${6 * o})`} />
				{/* nécrose : îlots bleu nuit sur les bords */}
				{necrosis > 0
					? [180, 260, 340, 420, 500].map((x, i) => (
							<ellipse key={x} cx={x} cy={cy + (i % 2 ? 1 : -1) * (30 + (i % 3) * 6) * o} rx={26 * necrosis} ry={14 * necrosis} fill={N} opacity={0.9} />
						))
					: null}
				{/* bords surlignés */}
				{edges > 0 ? <path d={d} fill="none" stroke={kind === 'clean' ? LPI.blue : LPI.paper} strokeWidth={12} strokeLinejoin="round" opacity={edges} strokeDasharray={kind === 'clean' ? undefined : '18 12'} /> : null}
				{/* points de suture */}
				{sutures > 0
					? [190, 270, 350, 430, 510].map((x, i) => {
							const s = cl(sutures * 5 - i);
							return s > 0 ? <path key={x} d={`M${x} ${cy - 48} V${cy + 48}`} stroke={N} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${s} 1`} /> : null;
						})
					: null}
			</g>
			<rect x={10} y={10} width={680} height={400} rx={60} fill="none" {...S} />
		</svg>
	);
};
