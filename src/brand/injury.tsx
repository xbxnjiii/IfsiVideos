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

/* ───────────── plaie vue de dessus ───────────── */

/**
 * Repère 700 × 420 : un carré de peau vu de dessus, avec une plaie franche (`clean` : fente droite, bords nets) ou
 * contuse (`ragged` : bords déchiquetés). `open` 0 → 1 ouverture ; `sutures` 0 → 1 ; `bruise` : tissus écrasés autour
 * (bleuté) ; `necrosis` : îlots bleu nuit qui gagnent les bords ; `edges` : les bords surlignés (repère visuel).
 */
export const WoundTop: React.FC<{width?: number; kind: 'clean' | 'ragged'; open?: number; sutures?: number; bruise?: number; necrosis?: number; edges?: number; heal?: number}> = ({width = 700, kind, open = 1, sutures = 0, bruise = 0, necrosis = 0, edges = 0, heal = 0}) => {
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
				{/* la plaie (elle s'efface quand elle guérit : `heal`, il reste une fine cicatrice) */}
				<g opacity={1 - cl(heal)}>
					<path d={d} fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
					<path d={d} fill={alpha(N, 0.12)} transform={`translate(0 ${6 * o})`} />
				</g>
				{heal > 0 ? <path d={`M140 ${cy} H560`} stroke={alpha(LPI.pink, 0.8)} strokeWidth={8} strokeLinecap="round" opacity={cl(heal)} /> : null}
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

/* ───────────── clou, moustique, carnet de vaccination, stéthoscope ───────────── */

/** Repère 520 × 220 : planche de bois avec un clou qui dépasse, pointe en l'air (pointe à x 260, y 30). */
export const NailBoard: React.FC<{width?: number}> = ({width = 520}) => (
	<svg width={width} height={(width * 220) / 520} viewBox="0 0 520 220" style={{overflow: 'visible', display: 'block'}}>
		<rect x={10} y={130} width={500} height={80} rx={18} fill={LPI.sky} {...S} />
		<path d="M40 160 C140 150 220 176 320 162 C400 150 450 168 490 160 M60 190 C160 182 300 198 470 186" fill="none" stroke={alpha(N, 0.3)} strokeWidth={4} strokeLinecap="round" />
		<path d="M252 132 V58 L260 26 L268 58 V132 Z" fill={LPI.paper} {...S} strokeWidth={6} />
		<path d="M236 132 H284" stroke={N} strokeWidth={10} strokeLinecap="round" />
	</svg>
);

/** Moustique (repère 200 × 160), ailes qui battent. */
export const Mosquito: React.FC<{size?: number}> = ({size = 200}) => {
	const frame = useCurrentFrame();
	const flap = Math.sin(frame * 2.2) * 18;
	return (
		<svg width={size} height={(size * 160) / 200} viewBox="0 0 200 160" style={{overflow: 'visible', display: 'block'}}>
			<g transform={`rotate(${-20 + flap} 100 70)`}>
				<ellipse cx={80} cy={40} rx={50} ry={20} fill={alpha(LPI.sky, 0.8)} stroke={N} strokeWidth={5} />
			</g>
			<g transform={`rotate(${20 - flap} 100 70)`}>
				<ellipse cx={128} cy={38} rx={46} ry={18} fill={alpha(LPI.sky, 0.8)} stroke={N} strokeWidth={5} />
			</g>
			<path d="M60 92 L30 140 M90 96 L80 150 M120 96 L140 150 M140 90 L176 132" stroke={N} strokeWidth={5} strokeLinecap="round" fill="none" />
			<ellipse cx={100} cy={82} rx={52} ry={18} fill={LPI.blue} {...S} strokeWidth={6} />
			<circle cx={156} cy={74} r={16} fill={LPI.blue} {...S} strokeWidth={6} />
			<path d="M170 80 L198 104" stroke={N} strokeWidth={5} strokeLinecap="round" />
			<circle cx={160} cy={70} r={4} fill={LPI.paper} />
		</svg>
	);
};

/** Carnet de vaccination (repère 260 × 200) avec une ligne cochée à `check` (0 → 1). */
export const VaxBook: React.FC<{size?: number; check?: number}> = ({size = 260, check = 0}) => (
	<svg width={size} height={(size * 200) / 260} viewBox="0 0 260 200" style={{overflow: 'visible', display: 'block'}}>
		<rect x={20} y={10} width={220} height={180} rx={16} fill={LPI.pink} {...S} />
		<rect x={40} y={30} width={180} height={140} rx={10} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<path d="M60 64 H160 M60 100 H160 M60 136 H140" stroke={alpha(N, 0.35)} strokeWidth={8} strokeLinecap="round" />
		<rect x={170} y={84} width={34} height={34} rx={8} fill={check > 0 ? LPI.blue : LPI.paper} stroke={N} strokeWidth={5} />
		<path d="M176 100 L186 110 L200 90" fill="none" stroke={LPI.paper} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${cl(check)} 1`} />
	</svg>
);

/** Stéthoscope (consulter un médecin), repère 220 × 220. */
export const Stetho: React.FC<{size?: number}> = ({size = 220}) => (
	<svg width={size} height={size} viewBox="0 0 220 220" style={{overflow: 'visible', display: 'block'}}>
		<path d="M60 20 V90 C60 140 150 140 150 90 V20" fill="none" stroke={N} strokeWidth={12} strokeLinecap="round" />
		<path d="M105 130 V160 C105 200 170 200 170 160 V140" fill="none" stroke={LPI.blue} strokeWidth={14} strokeLinecap="round" />
		<circle cx={170} cy={124} r={26} fill={LPI.sky} {...S} />
		<circle cx={170} cy={124} r={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
		<circle cx={60} cy={20} r={10} fill={LPI.pink} stroke={N} strokeWidth={5} />
		<circle cx={150} cy={20} r={10} fill={LPI.pink} stroke={N} strokeWidth={5} />
	</svg>
);

/* ───────────── animaux qui mordent, main mordue ───────────── */

/** Tête de chat (repère 320 × 300) : `open` 0 → 1 la gueule s'ouvre (crocs), `angry` : yeux plissés, oreilles en arrière. */
export const Cat: React.FC<{size?: number; open?: number; angry?: number}> = ({size = 320, open = 0, angry = 0}) => {
	const frame = useCurrentFrame();
	const blink = frame % 90 < 4 && angry < 0.5 ? 0.15 : 1;
	const ear = -14 * angry;
	return (
		<svg width={size} height={(size * 300) / 320} viewBox="0 0 320 300" style={{overflow: 'visible', display: 'block'}}>
			<g transform={`rotate(${ear} 90 90)`}>
				<path d="M44 120 L60 20 L130 80 Z" fill={LPI.sky} {...S} />
				<path d="M64 96 L70 48 L106 82 Z" fill={LPI.pink} />
			</g>
			<g transform={`rotate(${-ear} 230 90)`}>
				<path d="M276 120 L260 20 L190 80 Z" fill={LPI.sky} {...S} />
				<path d="M256 96 L250 48 L214 82 Z" fill={LPI.pink} />
			</g>
			<ellipse cx={160} cy={170} rx={130} ry={112} fill={LPI.sky} {...S} />
			<path d="M120 76 Q160 66 200 76" fill="none" stroke={alpha(N, 0.35)} strokeWidth={6} strokeLinecap="round" />
			{/* yeux */}
			{[110, 210].map((x, i) => (
				<g key={x} transform={`translate(${x} 150) scale(1 ${blink * (1 - 0.55 * angry)})`}>
					<ellipse rx={22} ry={26} fill={LPI.paper} stroke={N} strokeWidth={5} />
					<ellipse rx={8} ry={20} fill={N} />
				</g>
			))}
			{angry > 0 ? <path d="M84 118 L136 132 M236 118 L184 132" stroke={N} strokeWidth={7 * angry} strokeLinecap="round" /> : null}
			{/* nez, bouche, crocs */}
			<path d="M148 188 H172 L160 202 Z" fill={LPI.pink} stroke={N} strokeWidth={4} strokeLinejoin="round" />
			<path d={`M160 202 V210 M160 210 Q140 ${226 + 30 * open} 120 ${212 + 10 * open} M160 210 Q180 ${226 + 30 * open} 200 ${212 + 10 * open}`} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			{open > 0 ? (
				<g>
					<path d={`M128 ${216 + 6 * open} Q160 ${226 + 70 * open} 192 ${216 + 6 * open} Z`} fill={LPI.pink} stroke={N} strokeWidth={5} strokeLinejoin="round" />
					<path d={`M134 ${218 + 6 * open} l8 ${26 * open} l6 ${-24 * open} Z M186 ${218 + 6 * open} l-8 ${26 * open} l-6 ${-24 * open} Z`} fill={LPI.paper} stroke={N} strokeWidth={3} strokeLinejoin="round" />
				</g>
			) : null}
			{/* moustaches */}
			<path d="M40 196 L110 202 M44 222 L112 212 M280 196 L210 202 M276 222 L208 212" stroke={N} strokeWidth={4} strokeLinecap="round" />
		</svg>
	);
};

/** Tête de chien (repère 320 × 300), oreilles tombantes, langue. */
export const Dog: React.FC<{size?: number}> = ({size = 320}) => (
	<svg width={size} height={(size * 300) / 320} viewBox="0 0 320 300" style={{overflow: 'visible', display: 'block'}}>
		<path d="M70 70 C20 70 10 180 50 210 C70 200 80 140 96 110 Z" fill={LPI.blue} {...S} />
		<path d="M250 70 C300 70 310 180 270 210 C250 200 240 140 224 110 Z" fill={LPI.blue} {...S} />
		<ellipse cx={160} cy={150} rx={110} ry={110} fill={LPI.paper} {...S} />
		<ellipse cx={160} cy={210} rx={66} ry={50} fill={LPI.sky} stroke={N} strokeWidth={6} />
		<ellipse cx={120} cy={140} rx={14} ry={18} fill={N} />
		<ellipse cx={200} cy={140} rx={14} ry={18} fill={N} />
		<circle cx={124} cy={134} r={4} fill={LPI.paper} />
		<circle cx={204} cy={134} r={4} fill={LPI.paper} />
		<ellipse cx={160} cy={190} rx={22} ry={15} fill={N} />
		<path d="M160 206 V222 M136 228 Q160 244 184 228" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
		<path d="M150 236 Q160 270 172 236 Z" fill={LPI.pink} stroke={N} strokeWidth={4} />
	</svg>
);

/**
 * Dos de la main (repère 300 × 400, doigts en haut). `marks` 0 → 1 : deux petits trous de crocs ; `swell` 0 → 1 : la
 * main gonfle (plus grosse, rose, chaude) ; `heat` : ondes de chaleur.
 */
export const BittenHand: React.FC<{width?: number; marks?: number; swell?: number}> = ({width = 300, marks = 0, swell = 0}) => {
	const frame = useCurrentFrame();
	const sw = cl(swell);
	const fat = 1 + 0.32 * sw;
	const fingers = [
		[96, 150, 118],
		[136, 120, 140],
		[176, 126, 136],
		[214, 160, 112],
	];
	return (
		<svg width={width} height={(width * 400) / 300} viewBox="0 0 300 400" style={{overflow: 'visible', display: 'block'}}>
			{sw > 0 ? <ellipse cx={156} cy={250} rx={150 * fat} ry={130 * fat} fill={alpha(LPI.pink, 0.35 * sw)} /> : null}
			<g transform={`translate(156 260) scale(${fat} ${1 + 0.12 * sw}) translate(-156 -260)`}>
				{/* pouce */}
				<path d="M74 280 C40 260 26 220 40 196 C52 176 78 190 90 214 L110 250 Z" fill={LPI.paper} {...S} />
				{fingers.map(([x, top, len], i) => (
					<rect key={i} x={x - 18 - 3 * sw} y={top} width={36 + 6 * sw} height={len + 40} rx={18 + 3 * sw} fill={LPI.paper} {...S} />
				))}
				<path d="M72 250 C70 200 90 190 156 190 C222 190 240 210 236 260 L230 380 L84 380 Z" fill={LPI.paper} {...S} />
				<path d="M72 250 C70 200 90 190 156 190 C222 190 240 210 236 260 L230 380 L84 380 Z" fill={alpha(LPI.pink, 0.2 + 0.55 * sw)} />
				{fingers.map(([x, top], i) => (
					<path key={i} d={`M${x - 10} ${top + 26} q10 6 20 0`} fill="none" stroke={alpha(N, 0.3)} strokeWidth={4} strokeLinecap="round" />
				))}
				{/* traces de crocs */}
				{marks > 0
					? [
							[134, 270],
							[184, 262],
						].map(([x, y], i) => (
							<g key={i} transform={`translate(${x} ${y}) scale(${cl(marks * 2 - i * 0.5)})`}>
								<circle r={11 + 4 * sw} fill={alpha(LPI.pink, 0.6)} />
								<circle r={6} fill={N} />
							</g>
						))
					: null}
			</g>
			{sw > 0.3
				? [0, 1, 2].map((i) => {
						const t = (frame * 0.04 + i / 3) % 1;
						return <path key={i} d={`M${100 + i * 56} ${120 - t * 60} q12 -14 0 -28 q-12 -14 0 -28`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" opacity={(sw - 0.3) * (1 - t)} />;
					})
				: null}
		</svg>
	);
};

/* ───────────── frise des semaines ───────────── */

/**
 * Frise 0 → `max` semaines (largeur 960) : zone colorée [`zone`], curseur à `pos` semaines (rond + étiquette), cadenas
 * sur le curseur quand `lock` > 0 (la cicatrisation bloque).
 */
export const WeeksBar: React.FC<{pos: number; max?: number; zone?: [number, number, string]; lock?: number; width?: number}> = ({pos, max = 8, zone, lock = 0, width = 960}) => {
	const x = (w: number) => 40 + (cl(w, 0, max) / max) * (width - 80);
	return (
		<svg width={width} height={210} viewBox={`0 0 ${width} 210`} style={{overflow: 'visible', display: 'block'}}>
			<rect x={20} y={70} width={width - 40} height={56} rx={28} fill={LPI.paper} {...S} />
			{zone ? <rect x={x(zone[0])} y={78} width={x(zone[1]) - x(zone[0])} height={40} rx={20} fill={zone[2]} /> : null}
			{Array.from({length: max + 1}, (_, i) => (
				<g key={i}>
					<line x1={x(i)} x2={x(i)} y1={126} y2={i % 2 ? 142 : 152} stroke={N} strokeWidth={5} strokeLinecap="round" />
					{i % 2 === 0 ? (
						<text x={x(i)} y={192} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={34} fill={N}>
							{i}
						</text>
					) : null}
				</g>
			))}
			<text x={width - 20} y={36} textAnchor="end" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={alpha(N, 0.7)}>
				semaines
			</text>
			<g transform={`translate(${x(pos)} 98)`}>
				<circle r={36} fill={LPI.pink} {...S} />
				{lock > 0 ? (
					<g opacity={cl(lock)} transform={`scale(${0.6 + 0.4 * cl(lock)})`}>
						<rect x={-18} y={-6} width={36} height={28} rx={6} fill={N} />
						<path d="M-11 -6 V-16 A11 11 0 0 1 11 -16 V-6" fill="none" stroke={N} strokeWidth={6} />
					</g>
				) : null}
			</g>
		</svg>
	);
};

/* ───────────── prévention de l'escarre ───────────── */

/** Matelas à air (repère 360 × 160) : les boudins se gonflent l'un après l'autre (pression alternée). */
export const AirMattress: React.FC<{width?: number}> = ({width = 360}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={width} height={(width * 160) / 360} viewBox="0 0 360 160" style={{overflow: 'visible', display: 'block'}}>
			<rect x={6} y={96} width={348} height={50} rx={16} fill={LPI.blue} {...S} strokeWidth={6} />
			{Array.from({length: 8}, (_, i) => {
				const up = 0.5 + 0.5 * Math.sin(frame / 6 + (i % 2) * Math.PI);
				return <rect key={i} x={14 + i * 42} y={64 - 18 * up} width={38} height={46 + 18 * up} rx={19} fill={i % 2 ? LPI.sky : LPI.paper} stroke={N} strokeWidth={5} />;
			})}
		</svg>
	);
};

/** Deux flèches qui tournent (changer de position), repère 200 × 200. */
export const TurnArrows: React.FC<{size?: number}> = ({size = 200}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible', display: 'block'}}>
			<g transform={`rotate(${frame * 3} 100 100)`}>
				<path d="M40 100 A60 60 0 0 1 150 66" fill="none" stroke={LPI.blue} strokeWidth={18} strokeLinecap="round" />
				<path d="M136 40 L162 70 L124 82 Z" fill={LPI.blue} stroke={N} strokeWidth={5} strokeLinejoin="round" />
				<path d="M160 100 A60 60 0 0 1 50 134" fill="none" stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
				<path d="M64 160 L38 130 L76 118 Z" fill={LPI.pink} stroke={N} strokeWidth={5} strokeLinejoin="round" />
			</g>
		</svg>
	);
};

/* ───────────── pied vu de dessus / de dessous ───────────── */

/**
 * Pied droit vu de dessus (`view` 'top') ou de dessous (`view` 'sole'), repère 260 × 400, orteils en haut. `sore` :
 * petite plaie sous l'avant du pied ; `gaps` 0 → 1 : les espaces entre les orteils s'allument (on regarde aussi là).
 */
export const FootTop: React.FC<{width?: number; view?: 'top' | 'sole'; sore?: number; gaps?: number}> = ({width = 260, view = 'top', sore = 0, gaps = 0}) => {
	const FOOT = 'M70 120 C60 70 90 56 130 58 C190 60 220 90 216 150 C212 220 196 270 196 320 C196 370 170 392 132 392 C92 392 72 366 76 320 C80 270 78 190 70 120 Z';
	const toes: [number, number, number][] = [
		[96, 52, 26],
		[138, 38, 19],
		[170, 42, 17],
		[196, 56, 15],
		[216, 76, 13],
	];
	return (
		<svg width={width} height={(width * 400) / 260} viewBox="0 0 260 400" style={{overflow: 'visible', display: 'block'}}>
			<path d={FOOT} fill={LPI.paper} {...S} />
			<path d={FOOT} fill={alpha(LPI.pink, view === 'sole' ? 0.38 : 0.22)} />
			{toes.map(([x, y, r], i) => (
				<g key={i}>
					<ellipse cx={x} cy={y} rx={r} ry={r * 1.25} fill={LPI.paper} {...S} strokeWidth={6} />
					{view === 'top' ? <ellipse cx={x} cy={y - r * 0.45} rx={r * 0.55} ry={r * 0.45} fill={alpha(LPI.sky, 0.9)} stroke={N} strokeWidth={3} /> : <ellipse cx={x} cy={y} rx={r} ry={r * 1.25} fill={alpha(LPI.pink, 0.3)} />}
				</g>
			))}
			{gaps > 0
				? toes.slice(0, 4).map(([x, y, r], i) => {
						const [x2, y2] = toes[i + 1];
						return <circle key={i} cx={(x + x2) / 2 + 2} cy={(y + y2) / 2 + r} r={9} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={cl(gaps * 4 - i)} />;
					})
				: null}
			{view === 'top' ? <path d="M110 150 C130 170 150 230 140 320" fill="none" stroke={alpha(N, 0.2)} strokeWidth={5} strokeLinecap="round" /> : <path d="M100 330 C120 350 160 350 176 324" fill="none" stroke={alpha(N, 0.25)} strokeWidth={5} strokeLinecap="round" />}
			{sore > 0 && view === 'sole' ? (
				<g transform={`translate(150 130) scale(${sore})`}>
					<ellipse rx={26} ry={20} fill={LPI.pink} stroke={N} strokeWidth={5} />
					<ellipse rx={10} ry={8} fill={N} opacity={0.6} />
				</g>
			) : null}
		</svg>
	);
};

/* ───────────── le garçon à vélo ───────────── */

const SKIN_FILL = LPI.paper;
const limb = (pts: [number, number][], w: number, fill: string, key?: string) => (
	<g key={key}>
		<polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={N} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" />
		<polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
	</g>
);
/** Genou par cinématique inverse (cuisse et jambe de longueur L), plié vers l'avant (x croissant). */
const kneeIK = (h: [number, number], p: [number, number], L = 118): [number, number] => {
	const dx = p[0] - h[0];
	const dy = p[1] - h[1];
	const d = Math.min(Math.hypot(dx, dy), 2 * L - 1);
	const a = d / 2;
	const hh = Math.sqrt(Math.max(0, L * L - a * a));
	const bx = h[0] + (a * dx) / d;
	const by = h[1] + (a * dy) / d;
	const px = -dy / d;
	const py = dx / d;
	const k1: [number, number] = [bx + hh * px, by + hh * py];
	const k2: [number, number] = [bx - hh * px, by - hh * py];
	return k1[0] > k2[0] ? k1 : k2;
};
const Head: React.FC<{x: number; y: number; cry?: number; rot?: number; hair?: 'kid' | 'man' | 'old'; chin?: number; r?: number; skin?: string}> = ({x, y, cry = 0, rot = 0, hair = 'kid', chin = 0, r = 46, skin = SKIN_FILL}) => {
	const frame = useCurrentFrame();
	return (
		<g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 46})`}>
			<circle r={46} fill={skin} stroke={N} strokeWidth={6} />
			<circle r={46} fill={alpha(LPI.pink, 0.22)} />
			{/* cheveux */}
			{hair === 'kid' ? <path d="M-44 -6 C-50 -50 10 -66 40 -30 C30 -40 10 -42 -4 -34 C-14 -22 -30 -18 -44 -6 Z" fill={N} /> : null}
			{hair === 'man' ? <path d="M-46 0 C-52 -46 0 -60 38 -36 C34 -30 20 -30 4 -30 C-16 -28 -30 -20 -46 0 Z" fill={N} /> : null}
			{hair === 'old' ? (
				<>
					<path d="M-46 4 C-50 -20 -40 -34 -26 -38 C-30 -24 -34 -10 -36 8 Z" fill={LPI.sky} stroke={N} strokeWidth={4} />
					<path d="M14 26 Q26 20 40 26" fill="none" stroke={LPI.sky} strokeWidth={9} strokeLinecap="round" />
					<circle cx={22} cy={-2} r={13} fill="none" stroke={N} strokeWidth={4} />
				</>
			) : null}
			{chin > 0 ? (
				<g transform={`translate(30 38) scale(${chin})`}>
					<ellipse rx={14} ry={10} fill={LPI.pink} stroke={N} strokeWidth={3} />
					<path d="M-8 -2 L8 -4 M-6 4 L6 2" stroke={alpha(N, 0.5)} strokeWidth={2.5} strokeLinecap="round" />
				</g>
			) : null}
			<circle cx={-26} cy={8} r={10} fill={skin} stroke={N} strokeWidth={4} />
			{/* œil, bouche */}
			{cry > 0.5 ? <path d="M14 -6 l14 6 M14 6 l14 -6" stroke={N} strokeWidth={5} strokeLinecap="round" /> : <circle cx={22} cy={-2} r={5.5} fill={N} />}
			{cry > 0.5 ? <ellipse cx={26} cy={24} rx={10} ry={8} fill={N} /> : <path d="M16 22 Q26 30 36 20" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />}
			<circle cx={10} cy={14} r={7} fill={alpha(LPI.pink, 0.6)} />
			{cry > 0
				? [0, 1].map((i) => {
						const t = ((frame * 0.06 + i * 0.5) % 1) as number;
						return <path key={i} d="M0 0 q6 10 0 16 q-6 -6 0 -16 Z" transform={`translate(${30 + i * 6} ${4 + t * 40})`} fill={LPI.sky} stroke={N} strokeWidth={2.5} opacity={cry * (1 - t)} />;
					})
				: null}
		</g>
	);
};

/**
 * Garçon (vue de profil, vers la droite) dans le repère du vélo `Bike` (520 × 330, sol à y 326).
 * `pose` : 'ride' (sur le vélo : pédale avec `spin`, à poser par-dessus `Bike`), 'fly' (éjecté, bras en avant),
 * 'sit' (assis par terre, se tient le genou écorché ; genou à x 330, y 190). `scrape`, `cry`, `pain` pour 'sit'.
 */
export const Boy: React.FC<{width?: number; pose: 'ride' | 'fly' | 'sit'; spin?: number; scrape?: number; cry?: number; pain?: number}> = ({width = 520, pose, spin = 0, scrape = 0, cry = 0, pain = 0}) => {
	const frame = useCurrentFrame();
	const SHIRT = LPI.sky;
	const SHORTS = LPI.blue;
	let body: React.ReactNode;
	if (pose === 'sit') {
		const H: [number, number] = [214, 292];
		const K: [number, number] = [330, 188];
		const F: [number, number] = [424, 300];
		const S2: [number, number] = [236, 156];
		body = (
			<>
				{/* jambe du fond, allongée */}
				{limb([H, [330, 304], [440, 312]], 30, alpha(LPI.pink, 0.45))}
				<ellipse cx={458} cy={312} rx={26} ry={13} fill={N} />
				{/* torse */}
				{limb([H, S2], 70, SHIRT)}
				{/* jambe : cuisse (short) puis jambe */}
				{limb([H, [272, 240]], 46, SHORTS)}
				{limb([[268, 244], K, F], 30, SKIN_FILL)}
				<ellipse cx={F[0] + 16} cy={F[1] + 6} rx={30} ry={15} fill={N} />
				{/* éraflure sur le genou */}
				{scrape > 0 ? (
					<g transform={`translate(${K[0] + 4} ${K[1] - 4}) scale(${scrape})`}>
						<ellipse rx={24} ry={18} fill={LPI.pink} stroke={N} strokeWidth={3} />
						<path d="M-14 -6 L12 -10 M-16 4 L14 0 M-10 12 L10 9" stroke={alpha(N, 0.5)} strokeWidth={3} strokeLinecap="round" />
					</g>
				) : null}
				{/* bras : les mains tiennent la jambe sous le genou */}
				{limb([S2, [292, 226], [356, 236]], 24, SKIN_FILL)}
				<circle cx={360} cy={236} r={15} fill={SKIN_FILL} stroke={N} strokeWidth={5} />
				<Head x={250} y={98} cry={cry} rot={8} />
				{pain > 0
					? [0, 1, 2].map((i) => {
							const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 2);
							const a = (-80 + i * 50) * (Math.PI / 180);
							const x = K[0] + 54 * Math.cos(a);
							const y = K[1] + 54 * Math.sin(a);
							return <path key={i} d={`M${x} ${y} l${10 * Math.cos(a)} ${10 * Math.sin(a) - 12} l8 10 l${12 * Math.cos(a)} ${12 * Math.sin(a) - 12}`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={pain * (0.4 + 0.6 * f)} />;
						})
					: null}
			</>
		);
	} else {
		const th = ((pose === 'ride' ? spin * 0.6 : 40) * Math.PI) / 180;
		const H: [number, number] = [196, 64];
		const S2: [number, number] = [288, -34];
		const crank = (s: number): [number, number] => [250 + s * 40 * Math.sin(th), 240 - s * 40 * Math.cos(th)];
		const Pn = crank(1);
		const Pf = crank(-1);
		const Kn = kneeIK(H, Pn);
		const Kf = kneeIK(H, Pf);
		const hand: [number, number] = pose === 'ride' ? [400, 54] : [430, -60];
		const elbow: [number, number] = pose === 'ride' ? [352, 8] : [362, -60];
		body = (
			<>
				{/* jambe et bras du fond */}
				{limb([Kf, Pf], 26, alpha(LPI.pink, 0.45))}
				{limb([H, Kf], 40, alpha(SHORTS, 0.7))}
				<ellipse cx={Pf[0] + 10} cy={Pf[1] + 4} rx={24} ry={12} fill={N} />
				{limb([S2, [elbow[0] - 10, elbow[1] + 10], [hand[0] - 14, hand[1] + 6]], 20, alpha(LPI.pink, 0.45))}
				{/* torse */}
				{limb([H, S2], 66, SHIRT)}
				{/* jambe du devant */}
				{limb([Kn, Pn], 28, SKIN_FILL)}
				{limb([H, [H[0] + (Kn[0] - H[0]) * 0.75, H[1] + (Kn[1] - H[1]) * 0.75]], 44, SHORTS)}
				<circle cx={Kn[0]} cy={Kn[1]} r={15} fill={SKIN_FILL} stroke={N} strokeWidth={5} />
				<ellipse cx={Pn[0] + 10} cy={Pn[1] + 4} rx={26} ry={13} fill={N} />
				{/* bras du devant */}
				{limb([S2, elbow, hand], 22, SKIN_FILL)}
				<circle cx={hand[0]} cy={hand[1]} r={13} fill={SKIN_FILL} stroke={N} strokeWidth={5} />
				<Head x={322} y={-96} cry={pose === 'fly' ? 1 : 0} />
			</>
		);
	}
	return (
		<svg width={width} height={(width * 330) / 520} viewBox="0 0 520 330" style={{overflow: 'visible', display: 'block'}}>
			{body}
		</svg>
	);
};

/* ───────────── un adulte qui marche (profil) ───────────── */

/** Pieds du marcheur (repère 300 × 600, hanche en 150, 330) pour une phase de marche donnée (radians). */
/** Mélange opaque de deux couleurs de la marque. */
const mix2 = (a: string, b: string, t: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const [x, y] = [p(a), p(b)];
	return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

/** Bras du côté visible du `Walker` en marche (épaule, coude, main), repère 300 × 600. */
export const walkerArm = (phase: number): [number, number][] => {
	const S2: [number, number] = [160, 176];
	const sw = 0.45 * Math.sin(phase);
	const E: [number, number] = [S2[0] + 92 * Math.sin(-sw), S2[1] + 92 * Math.cos(-sw)];
	const Hd: [number, number] = [E[0] + 84 * Math.sin(-sw + 0.5), E[1] + 84 * Math.cos(-sw + 0.5)];
	return [S2, E, Hd];
};

export const walkerLegs = (phase: number) => {
	const H: [number, number] = [150, 330];
	const L = 130;
	const leg = (ph: number) => {
		const a = 0.5 * Math.sin(ph);
		const b = 0.45 * Math.max(0, -Math.cos(ph));
		const K: [number, number] = [H[0] + L * Math.sin(a), H[1] + L * Math.cos(a)];
		const F: [number, number] = [K[0] + L * Math.sin(a - b), K[1] + L * Math.cos(a - b)];
		return {K, F};
	};
	return {H, front: leg(phase), back: leg(phase + Math.PI)};
};

/**
 * Adulte de profil (vers la droite), repère 300 × 600 (pieds au sol à y ≈ 590). `pose` : 'walk' (marche, `phase` en
 * radians), 'hop' (sautille sur un pied et tient l'autre : il s'est planté un clou), 'fall' (bras en avant, il tombe :
 * à faire pivoter par le parent). `hair` : 'man' | 'old' | 'kid' ; `cry` ; `chin` : plaie au menton ; `legWound` : plaie
 * sur le tibia avant ; `tee` t-shirt à manches courtes, `jeans` jean jusqu'aux chaussures, `skin` vraie couleur de peau ; `size` : 1 = adulte, 0.75 = enfant (tout rapetisse, la tête reste grosse).
 */
export const Walker: React.FC<{width?: number; pose?: 'walk' | 'hop' | 'fall'; phase?: number; hair?: 'man' | 'old' | 'kid'; cry?: number; chin?: number; pain?: number; legWound?: number; shirt?: string; jeans?: boolean; tee?: boolean; skin?: string}> = ({skin,width = 300, pose = 'walk', phase = 0, hair = 'man', cry = 0, chin = 0, pain = 0, legWound = 0, shirt = LPI.sky, jeans = false, tee = false}) => {
	const frame = useCurrentFrame();
	// `skin` : vraie couleur de peau (mise en situation réaliste) ; sinon blanc cassé de la marque
	const SKIN = skin ?? SKIN_FILL;
	const FAR = skin ? mix2(skin, N, 0.18) : alpha(LPI.pink, 0.45);
	const SHORTS = hair === 'old' ? N : LPI.blue;
	const S2: [number, number] = [160, 176];
	let legs: React.ReactNode;
	let arms: React.ReactNode;
	let farArm: React.ReactNode = null;
	const shoe = (F: [number, number], dark = false, rot = 0) => <ellipse cx={F[0] + 14} cy={F[1] + 2} rx={36} ry={16} fill={dark ? alpha(N, 0.7) : N} transform={`rotate(${rot} ${F[0]} ${F[1]})`} />;
	if (pose === 'hop') {
		const H: [number, number] = [150, 330];
		const K: [number, number] = [232, 404];
		const F: [number, number] = [196, 500];
		legs = (
			<>
				{limb([H, [152, 460], [150, 586]], 44, SKIN)}
				{limb([H, [151, 410]], 64, SHORTS)}
				{shoe([150, 588])}
				{limb([H, K, F], 44, SKIN)}
				{limb([H, [H[0] + (K[0] - H[0]) * 0.6, H[1] + (K[1] - H[1]) * 0.6]], 64, SHORTS)}
				{/* plante du pied levée : un point rouge (le clou) */}
				<ellipse cx={F[0] - 6} cy={F[1] + 10} rx={30} ry={14} fill={SKIN} stroke={N} strokeWidth={6} transform={`rotate(-30 ${F[0]} ${F[1]})`} />
				<circle cx={F[0] - 10} cy={F[1] + 16} r={6} fill={LPI.pink} stroke={N} strokeWidth={3} />
			</>
		);
		arms = (
			<>
				{limb([S2, [214, 280], [200, 470]], 32, SKIN)}
				<circle cx={200} cy={474} r={15} fill={SKIN} stroke={N} strokeWidth={5} />
			</>
		);
		farArm = limb([S2, [110, 120], [80, 70]], 28, FAR);
	} else if (pose === 'fall') {
		const H: [number, number] = [150, 330];
		legs = (
			<>
				{limb([H, [100, 440], [40, 540]], 44, FAR)}
				{limb([H, [170, 450], [120, 570]], 44, SKIN)}
				{limb([H, [160, 410]], 64, SHORTS)}
				{shoe([120, 572])}
			</>
		);
		arms = (
			<>
				{limb([S2, [236, 110], [270, 40]], 32, SKIN)}
				<circle cx={272} cy={36} r={14} fill={SKIN} stroke={N} strokeWidth={5} />
			</>
		);
		farArm = limb([S2, [226, 96], [250, 24]], 28, FAR);
	} else {
		const {H, front, back} = walkerLegs(phase);
		const sw = 0.45 * Math.sin(phase);
		const arm = (s: number): [number, number][] => {
			const E: [number, number] = [S2[0] + 92 * Math.sin(-s * sw), S2[1] + 92 * Math.cos(-s * sw)];
			const Hd: [number, number] = [E[0] + 84 * Math.sin(-s * sw + 0.5), E[1] + 84 * Math.cos(-s * sw + 0.5)];
			return [S2, E, Hd];
		};
		const JEAN = mix2(LPI.blue, N, 0.25);
		const legDraw = (l: {K: [number, number]; F: [number, number]}, far: boolean) =>
			jeans ? (
				<>
					{limb([H, l.K, l.F], 54, far ? mix2(JEAN, N, 0.35) : JEAN)}
					{!far ? <polyline points={[H, l.K, l.F].map((p) => `${p[0] + 10},${p[1]}`).join(' ')} fill="none" stroke={alpha(LPI.paper, 0.22)} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
					{shoe(l.F, far)}
				</>
			) : (
				<>
					{limb([l.K, l.F], 44, far ? FAR : SKIN)}
					{limb([H, [H[0] + (l.K[0] - H[0]) * 0.7, H[1] + (l.K[1] - H[1]) * 0.7]], 64, far ? alpha(SHORTS, 0.7) : SHORTS)}
					{shoe(l.F, far)}
				</>
			);
		legs = (
			<>
				{legDraw(back, true)}
				{legDraw(front, false)}
				{legWound > 0 ? (
					<g transform={`translate(${(front.K[0] + front.F[0]) / 2 + 6} ${(front.K[1] + front.F[1]) / 2}) scale(${legWound})`}>
						<ellipse rx={20} ry={14} fill={LPI.pink} stroke={N} strokeWidth={3} />
						<ellipse rx={8} ry={5} fill={alpha(N, 0.45 * legWound)} />
					</g>
				) : null}
			</>
		);
		const fa = arm(-1);
		const half = (a: [number, number][]): [number, number][] => [a[0], [a[0][0] + (a[1][0] - a[0][0]) * 0.6, a[0][1] + (a[1][1] - a[0][1]) * 0.6]];
		farArm = (
			<>
				{limb(fa, 28, FAR)}
				{tee ? limb(half(fa), 40, mix2(shirt, N, 0.3)) : null}
			</>
		);
		const na = arm(1);
		arms = (
			<>
				{limb(na, 32, SKIN)}
				{tee ? limb(half(na), 44, shirt) : null}
				<circle cx={na[2][0]} cy={na[2][1]} r={14} fill={SKIN} stroke={N} strokeWidth={5} />
			</>
		);
	}
	return (
		<svg width={width} height={width * 2} viewBox="0 0 300 600" style={{overflow: 'visible', display: 'block'}}>
			{farArm}
			{legs}
			{limb([[150, 330], S2], 100, shirt)}
			{arms}
			<Head x={172} y={100} cry={cry} hair={hair} chin={chin} r={60} rot={pose === 'fall' ? 10 : 0} skin={SKIN} />
			{pain > 0 && pose === 'hop'
				? [0, 1, 2].map((i) => {
						const f = 0.5 + 0.5 * Math.sin(frame * 0.9 + i * 2);
						return <path key={i} d={`M${160 + i * 34} ${560 - i * 10} l10 -24 l10 10 l10 -26`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={pain * (0.4 + 0.6 * f)} />;
					})
				: null}
		</svg>
	);
};
