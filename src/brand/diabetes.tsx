// Diabète : vaisseau rempli de sucres (`BloodBand`), cellule à porte cadenassée qui a faim ou qui mange (`GCell`), clé
// « INSULINE » qui tourne, coince ou manque (`InsulinKey`), pancréas qui fabrique des clés… ou plus du tout (`Pancreas`),
// stylo à insuline (`InsulinPen`), sites d'injection sur le ventre (`InjectionSites`), globule rouge « sucré »
// (hémoglobine glyquée, `GlycatedCell`), assiette équilibrée (`Plate`), reins (`KidneysIcon`), carte « ▶ vidéo
// glycémie » (`VideoLink`). Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {SugarCube} from './glyco';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/* ───────────── le sang plein de sucre ───────────── */

/** Vaisseau horizontal (largeur × hauteur) : plasma rose, globules, morceaux de sucre qui défilent (`sugar` 0 → 1 = de
 * quelques-uns à plein) ; `piles` : sucres qui attendent, entassés contre la paroi du bas (x = centre du tas). */
export const BloodBand: React.FC<{width: number; height?: number; sugar: number; piles?: {x: number; n: number}[]; speed?: number}> = ({width, height = 220, sugar, piles = [], speed = 3}) => {
	const frame = useCurrentFrame();
	const n = Math.round(4 + 22 * sugar);
	return (
		<div style={{position: 'relative', width, height, overflow: 'hidden', borderRadius: 30, background: alpha(LPI.pink, 0.3), boxShadow: `inset 0 0 0 8px ${N}`}}>
			{Array.from({length: 7}, (_, i) => {
				const x = ((random(`gb${i}`) * (width + 120) + frame * speed * 0.8) % (width + 120)) - 60;
				return <div key={`g${i}`} style={{position: 'absolute', left: x, top: 24 + random(`gby${i}`) * (height - 90), width: 54, height: 40, borderRadius: '50%', background: LPI.pink, border: `5px solid ${N}`, opacity: 0.85}} />;
			})}
			{Array.from({length: n}, (_, i) => {
				const x = ((random(`sb${i}`) * (width + 80) + frame * speed) % (width + 80)) - 40;
				const y = 18 + random(`sby${i}`) * (height - 70);
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y}}>
						<SugarCube size={38} rot={frame * 2 + i * 37} />
					</div>
				);
			})}
			{piles.map((p, k) =>
				Array.from({length: p.n}, (_, i) => {
					const row = i < 4 ? 0 : i < 7 ? 1 : 2;
					const col = row === 0 ? i : row === 1 ? i - 4 : i - 7;
					const per = row === 0 ? 4 : row === 1 ? 3 : 2;
					const x = p.x - (per * 40) / 2 + col * 40 + row * 0;
					return (
						<div key={`p${k}-${i}`} style={{position: 'absolute', left: x, top: height - 50 - row * 36}}>
							<SugarCube size={38} rot={((i * 23) % 20) - 10 + Math.sin(frame / 4 + i) * 4} />
						</div>
					);
				}),
			)}
		</div>
	);
};

/* ───────────── la cellule ───────────── */

/** Cellule (240 × 240) avec une porte en haut : `door` 0 → 1 (fermée → ouverte), `lock` (cadenas), `energy` 0 → 1 (jauge
 * intérieure : rose et clignotante quand elle est vide), `hungry` (visage triste), `fed` 0 → 1 (un sucre entre, elle sourit),
 * `reject` (croix rose sur la porte). */
export const GCell: React.FC<{size?: number; door?: number; lock?: number; energy?: number; hungry?: number; fed?: number; reject?: number}> = ({size = 240, door = 0, lock = 0, energy = 0.5, hungry = 0, fed = 0, reject = 0}) => {
	const frame = useCurrentFrame();
	const wob = (k: number) => 98 + 4 * Math.sin(frame / 8 + k);
	const low = energy < 0.25;
	const blink = low ? 0.55 + 0.45 * Math.round(0.5 + 0.5 * Math.cos(frame / 4)) : 1;
	const sad = hungry > 0.5 && fed < 0.5;
	return (
		<svg width={size} height={size} viewBox="-120 -125 240 240" style={{overflow: 'visible'}}>
			{fed > 0 ? <circle r={104 + 12 * fed} fill={alpha(LPI.sky, 0.6 * fed)} /> : null}
			<ellipse rx={wob(0)} ry={wob(2)} fill={alpha(LPI.sky, 0.9)} stroke={N} strokeWidth={8} />
			{/* porte dans la membrane (en haut) */}
			<rect x={-30} y={-112} width={60} height={30} rx={8} fill={alpha(N, 0.85)} />
			<g transform={`translate(-26 -108) scale(${1 - 0.85 * door} 1)`}>
				<rect width={52} height={22} rx={6} fill={LPI.blue} stroke={N} strokeWidth={4} />
			</g>
			{lock > 0 ? (
				<g transform="translate(0 -96)" opacity={lock}>
					<path d="M-10 -8 V-16 A10 10 0 0 1 10 -16 V-8" fill="none" stroke={N} strokeWidth={5} />
					<rect x={-15} y={-9} width={30} height={22} rx={5} fill={LPI.pink} stroke={N} strokeWidth={4} />
					<circle cy={2} r={3.5} fill={N} />
				</g>
			) : null}
			{reject > 0 ? <path d="M-22 -122 L22 -84 M22 -122 L-22 -84" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" opacity={reject} /> : null}
			{/* visage */}
			<circle cx={-28} cy={-16} r={9} fill={N} />
			<circle cx={28} cy={-16} r={9} fill={N} />
			{sad ? (
				<>
					<path d="M-44 -38 L-16 -30 M44 -38 L16 -30" stroke={N} strokeWidth={6} strokeLinecap="round" />
					<path d="M-22 22 Q0 6 22 22" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" />
					<path d={`M50 -4 q-6 10 0 16 q6 -6 0 -16 Z`} fill={LPI.sky} stroke={N} strokeWidth={3} transform={`translate(0 ${(frame % 20) * 0.6})`} />
				</>
			) : (
				<path d={fed > 0.5 ? 'M-24 10 Q0 34 24 10' : 'M-18 16 H18'} fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" />
			)}
			<ellipse cx={-46} cy={8} rx={12} ry={7} fill={LPI.pink} opacity={0.6} />
			<ellipse cx={46} cy={8} rx={12} ry={7} fill={LPI.pink} opacity={0.6} />
			{/* jauge d'énergie */}
			<g transform="translate(-36 46)">
				<rect width={66} height={30} rx={8} fill={LPI.paper} stroke={N} strokeWidth={5} />
				<rect x={66} y={9} width={7} height={12} rx={2} fill={N} />
				<rect x={5} y={5} width={56 * Math.max(0.05, energy)} height={20} rx={4} fill={low ? LPI.pink : LPI.blue} opacity={blink} />
			</g>
			{/* un sucre entre par la porte */}
			{fed > 0 && fed < 1 ? (
				<g transform={`translate(-14 ${-140 + 120 * fed})`} opacity={1 - fed * 0.8}>
					<rect width={28} height={28} rx={6} fill={LPI.paper} stroke={N} strokeWidth={5} />
				</g>
			) : null}
		</svg>
	);
};

/* ───────────── la clé « insuline » ───────────── */

/** Clé (220 × 90) : `turn` 0 → 1 (elle tourne dans la serrure), `jam` 0 → 1 (elle coince : tremble, croix), `ghost` :
 * seulement le contour en pointillés (la clé qui manque), `label` : « INSULINE » sur l'anneau. */
export const InsulinKey: React.FC<{width?: number; turn?: number; jam?: number; ghost?: boolean; label?: boolean}> = ({width = 220, turn = 0, jam = 0, ghost = false, label = true}) => {
	const frame = useCurrentFrame();
	const shake = jam > 0 ? Math.sin(frame * 2.3) * 8 * jam : 0;
	const fill = ghost ? 'none' : LPI.blue;
	const stroke = ghost ? alpha(N, 0.55) : N;
	return (
		<svg width={width} height={(width * 90) / 220} viewBox="0 0 220 90" style={{overflow: 'visible'}}>
			<g transform={`rotate(${shake} 200 45) scale(1 ${Math.max(0.15, Math.abs(Math.cos(turn * Math.PI * 0.5)))})`} style={{transformOrigin: '110px 45px'}}>
				<circle cx={45} cy={45} r={38} fill={fill} stroke={stroke} strokeWidth={7} strokeDasharray={ghost ? '10 8' : undefined} />
				<circle cx={45} cy={45} r={14} fill={ghost ? 'none' : LPI.paper} stroke={stroke} strokeWidth={6} strokeDasharray={ghost ? '6 6' : undefined} />
				<path d="M82 38 H206 V52 H190 V70 H176 V52 H164 V64 H150 V52 H82 Z" fill={fill} stroke={stroke} strokeWidth={7} strokeLinejoin="round" strokeDasharray={ghost ? '10 8' : undefined} />
			</g>
			{label ? (
				<text x={45} y={-10} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={24} fill={ghost ? alpha(N, 0.6) : LPI.blue}>
					INSULINE
				</text>
			) : null}
			{jam > 0.5 ? <path d="M212 18 L236 42 M236 18 L212 42" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" /> : null}
		</svg>
	);
};

/* ───────────── le pancréas ───────────── */

/** Pancréas (300 × 150) avec ses îlots : `make` 0 → 1 = des petites clés en sortent ; `dead` 0 → 1 = il s'éteint (type 1 :
 * plus de clés, îlots barrés). */
export const Pancreas: React.FC<{width?: number; make?: number; dead?: number}> = ({width = 300, make = 0, dead = 0}) => {
	const frame = useCurrentFrame();
	const SHAPE = 'M20 92 C10 66 40 50 80 56 C120 62 150 40 190 30 C230 20 268 30 282 58 C296 88 274 118 240 112 C210 106 196 120 170 126 C130 136 90 120 60 118 C36 116 26 108 20 92 Z';
	return (
		<svg width={width} height={(width * 150) / 300} viewBox="0 0 300 150" style={{overflow: 'visible'}}>
			<path d={SHAPE} fill={LPI.paper} {...SK} />
			<path d={SHAPE} fill={alpha(LPI.pink, 0.55 * (1 - dead))} />
			<path d={SHAPE} fill={alpha(N, 0.18 * dead)} />
			{[
				[70, 90],
				[130, 92],
				[190, 72],
				[240, 66],
			].map(([x, y], i) => (
				<g key={i}>
					<circle cx={x} cy={y} r={13} fill={dead > 0.5 ? alpha(N, 0.25) : LPI.sky} stroke={N} strokeWidth={4} />
					{dead > 0.5 ? <path d={`M${x - 9} ${y - 9} L${x + 9} ${y + 9}`} stroke={LPI.pink} strokeWidth={5} strokeLinecap="round" /> : null}
				</g>
			))}
			{make > 0
				? [0, 1, 2].map((i) => {
						const t = ((frame * 0.025 + i / 3) % 1) as number;
						return (
							<g key={i} transform={`translate(${150 + i * 40 + t * 60} ${40 - t * 90}) scale(0.32) rotate(-20)`} opacity={make * (1 - t)}>
								<circle cx={45} cy={45} r={38} fill={LPI.blue} stroke={N} strokeWidth={10} />
								<path d="M82 38 H206 V52 H190 V70 H176 V52 H150 V52 H82 Z" fill={LPI.blue} stroke={N} strokeWidth={10} />
							</g>
						);
					})
				: null}
		</svg>
	);
};

/* ───────────── soins ───────────── */

/** Stylo à insuline (440 × 110) : capuchon retiré, aiguille, molette de dose ; `press` 0 → 1 = on appuie. */
export const InsulinPen: React.FC<{width?: number; press?: number}> = ({width = 440, press = 0}) => (
	<svg width={width} height={(width * 110) / 440} viewBox="0 0 440 110" style={{overflow: 'visible'}}>
		<path d="M4 55 H40" stroke={N} strokeWidth={4} strokeLinecap="round" />
		<rect x={40} y={40} width={30} height={30} rx={6} fill={LPI.paper} {...SK} strokeWidth={5} />
		<rect x={70} y={26} width={250} height={58} rx={22} fill={LPI.blue} {...SK} />
		<rect x={110} y={38} width={90} height={34} rx={10} fill={alpha(LPI.sky, 0.9)} stroke={N} strokeWidth={5} />
		<text x={155} y={63} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={22} fill={N}>
			UI
		</text>
		<rect x={320} y={34} width={46} height={42} rx={10} fill={LPI.pink} {...SK} strokeWidth={5} />
		<rect x={366 + 20 * press} y={42} width={60 - 20 * press} height={26} rx={8} fill={LPI.paper} {...SK} strokeWidth={5} />
	</svg>
);

/** Ventre vu de face (360 × 300) avec les sites d'injection : `done` = nombre de sites déjà utilisés (petits points),
 * `active` = le site du jour (rose, entouré). On tourne autour du nombril, sans piquer au même endroit. */
export const InjectionSites: React.FC<{width?: number; done: number; active: number}> = ({width = 360, done, active}) => {
	const frame = useCurrentFrame();
	const SITES = [
		[110, 120],
		[250, 120],
		[110, 200],
		[250, 200],
		[150, 245],
		[210, 245],
	];
	return (
		<svg width={width} height={(width * 300) / 360} viewBox="0 0 360 300" style={{overflow: 'visible'}}>
			<path d="M40 10 C40 120 30 220 60 296 H300 C330 220 320 120 320 10 Z" fill={LPI.paper} {...SK} />
			<path d="M40 10 C40 120 30 220 60 296 H300 C330 220 320 120 320 10 Z" fill={alpha(LPI.pink, 0.22)} />
			<ellipse cx={180} cy={165} rx={9} ry={12} fill={alpha(N, 0.35)} />
			<circle cx={180} cy={165} r={36} fill="none" stroke={alpha(N, 0.25)} strokeWidth={3} strokeDasharray="6 6" />
			{SITES.map(([x, y], i) => {
				const used = i < done;
				const on = i === active;
				return (
					<g key={i}>
						{on ? <circle cx={x} cy={y} r={22 + 4 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={5} /> : null}
						<circle cx={x} cy={y} r={on ? 11 : 8} fill={on ? LPI.pink : used ? LPI.blue : 'transparent'} stroke={used || on ? N : alpha(N, 0.3)} strokeWidth={3} strokeDasharray={used || on ? undefined : '4 4'} />
					</g>
				);
			})}
		</svg>
	);
};

/** Globule rouge (180 × 140) qui se couvre de sucres (`coat` 0 → 1) : l'hémoglobine « glyquée ». */
export const GlycatedCell: React.FC<{width?: number; coat: number}> = ({width = 180, coat}) => {
	const pts = [
		[30, 40],
		[90, 18],
		[150, 40],
		[160, 92],
		[100, 118],
		[36, 100],
	];
	const n = Math.round(coat * pts.length);
	return (
		<svg width={width} height={(width * 140) / 180} viewBox="0 0 180 140" style={{overflow: 'visible'}}>
			<ellipse cx={90} cy={70} rx={80} ry={58} fill={LPI.pink} {...SK} />
			<ellipse cx={90} cy={70} rx={40} ry={24} fill={alpha(N, 0.15)} />
			{pts.slice(0, n).map(([x, y], i) => (
				<rect key={i} x={x - 13} y={y - 13} width={26} height={26} rx={6} fill={LPI.paper} stroke={N} strokeWidth={4} transform={`rotate(${(i * 27) % 40 - 20} ${x} ${y})`} />
			))}
		</svg>
	);
};

/** Assiette équilibrée (vue de dessus, 220 × 220) : légumes ½, féculents ¼, protéines ¼. */
export const Plate: React.FC<{size?: number}> = ({size = 220}) => (
	<svg width={size} height={size} viewBox="0 0 220 220">
		<circle cx={110} cy={110} r={100} fill={LPI.paper} {...SK} />
		<circle cx={110} cy={110} r={80} fill="none" stroke={alpha(LPI.sky, 0.95)} strokeWidth={5} />
		<path d="M110 110 L110 34 A76 76 0 0 0 110 186 Z" fill={alpha(LPI.blue, 0.75)} stroke={N} strokeWidth={4} />
		<path d="M110 110 L110 34 A76 76 0 0 1 186 110 Z" fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={4} />
		<path d="M110 110 L186 110 A76 76 0 0 1 110 186 Z" fill={alpha(LPI.pink, 0.75)} stroke={N} strokeWidth={4} />
	</svg>
);

/** Deux reins (icône 100 × 100). */
export const KidneysIcon: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		{[30, 70].map((x, i) => (
			<path key={x} d="M0 -26 C18 -26 26 -12 24 2 C22 18 12 28 -2 26 C-12 24 -10 12 -6 4 C-2 -4 -12 -8 -14 -14 C-18 -24 -10 -26 0 -26 Z" transform={`translate(${x} 50) scale(${i ? -1 : 1} 1)`} fill={alpha(LPI.pink, 0.7)} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		))}
	</svg>
);

/** Cerveau (icône 100 × 100). */
export const BrainIcon: React.FC<{size?: number}> = ({size = 56}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M50 20 C40 12 20 16 18 34 C8 40 10 60 22 64 C24 78 40 84 50 76 C60 84 76 78 78 64 C90 60 92 40 82 34 C80 16 60 12 50 20 Z" fill={alpha(LPI.pink, 0.6)} stroke={N} strokeWidth={6} strokeLinejoin="round" />
		<path d="M50 22 V74 M34 36 Q42 44 34 52 M66 36 Q58 44 66 52" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
	</svg>
);

/** Carte « ▶ vidéo » (renvoi vers une autre vidéo de la marque), qui pop à `at`. */
export const VideoLink: React.FC<{at: number; title: string; until?: number; scale?: number}> = ({at: t0, title, until = 1e9, scale = 1}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > until + 8) return null;
	const out = interpolate(frame, [until, until + 8], [1, 0], clamp);
	return (
		<div style={{display: 'inline-flex', alignItems: 'center', gap: 18 * scale, padding: `${12 * scale}px ${30 * scale}px ${12 * scale}px ${12 * scale}px`, borderRadius: 999, background: N, boxShadow: SHADOW, transform: `scale(${popAt(frame, t0) * (0.6 + 0.4 * out)})`, opacity: out, transformOrigin: 'left center'}}>
			<div style={{width: 76 * scale, height: 76 * scale, borderRadius: 38 * scale, background: LPI.pink, border: `5px solid ${LPI.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<svg width={30 * scale} height={30 * scale} viewBox="0 0 30 30">
					<path d="M8 4 L26 15 L8 26 Z" fill={N} />
				</svg>
			</div>
			<div>
				<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24 * scale, letterSpacing: '0.16em', color: LPI.sky}}>DÉJÀ VU EN VIDÉO</div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44 * scale, color: LPI.paper, lineHeight: 1.05, whiteSpace: 'nowrap'}}>{title}</div>
			</div>
		</div>
	);
};

/* ───────────── série « Le diabète » (2 parties) ───────────── */

/** Petite clé (icône des tuiles de série). */
const KeyIcon: React.FC<{size?: number}> = ({size = 74}) => (
	<div style={{transform: 'rotate(-30deg)'}}>
		<InsulinKey width={size} label={false} />
	</div>
);
/** Petit stylo (icône des tuiles de série). */
const PenIcon: React.FC<{size?: number}> = ({size = 74}) => (
	<div style={{transform: 'rotate(-40deg)'}}>
		<InsulinPen width={size * 1.1} />
	</div>
);
export const DIABETE_PARTS = [
	{title: 'Les 3 types', icon: <KeyIcon size={78} />},
	{title: 'Découvrir et soigner', icon: <PenIcon size={78} />},
];

/* ───────────── type 1 : les défenses attaquent le pancréas ───────────── */

/** Une « défense » du corps (globule blanc, 100 × 100) : ronde, noyau en lobes, sourcils froncés ; `angry` 0 → 1. */
export const Defender: React.FC<{size?: number; angry?: number}> = ({size = 80, angry = 1}) => {
	const frame = useCurrentFrame();
	const wob = Math.sin(frame / 4) * 3;
	return (
		<svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
			<path d={`M0 -42 C24 -${42 + wob} 44 -22 42 0 C40 24 22 ${42 - wob} 0 42 C-24 42 -${42 + wob} 22 -42 0 C-42 -24 -24 -42 0 -42 Z`} fill={LPI.paper} {...SK} strokeWidth={6} />
			{[
				[-14, 12],
				[2, 18],
				[16, 10],
			].map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={9} fill={LPI.sky} stroke={alpha(N, 0.5)} strokeWidth={3} />
			))}
			<circle cx={-12} cy={-10} r={5} fill={N} />
			<circle cx={12} cy={-10} r={5} fill={N} />
			<path d={`M-22 ${-24 + 6 * (1 - angry)} L-6 ${-18}`} stroke={N} strokeWidth={5} strokeLinecap="round" />
			<path d={`M22 ${-24 + 6 * (1 - angry)} L6 ${-18}`} stroke={N} strokeWidth={5} strokeLinecap="round" />
		</svg>
	);
};

/* ───────────── diabète gestationnel : la future maman ───────────── */

/** Peau (blanc cassé + voile rose), comme le `Patient`. */
const Skin: React.FC<{d?: string; children?: (fill: string, o: number) => React.ReactNode}> = ({children}) => (
	<>
		{children?.(LPI.paper, 1)}
		{children?.(LPI.pink, 0.3)}
	</>
);

/** Future maman de profil (320 × 560, tournée vers la droite) : robe bleu clair, chignon, main sur le ventre.
 * `belly` 0 → 1.2 = le ventre s'arrondit ; `inside` 0 → 1 = on voit dedans (utérus, bébé tête en bas, placenta et
 * cordon) ; `big` 0 → 1 = le bébé grossit (macrosomie) ; `hormones` 0 → 1 = des hormones (petits ronds roses) sortent
 * du placenta et filent vers `to` (repère de la maman) ; `born` 0 → 1 = après l'accouchement (ventre plat, bébé dans
 * les bras). */
export const MomToBe: React.FC<{width?: number; belly?: number; inside?: number; big?: number; hormones?: number; to?: {x: number; y: number}; born?: number; mood?: 'calme' | 'inquiete' | 'content'}> = ({
	width = 320,
	belly = 1,
	inside = 0,
	big = 0,
	hormones = 0,
	to = {x: 520, y: 240},
	born = 0,
	mood = 'calme',
}) => {
	const frame = useCurrentFrame();
	const b = Math.max(0, belly + 0.18 * big) * (1 - born);
	const blink = frame % 90 < 4 ? 0.15 : 1;
	const body = `M124 164 C140 154 166 154 178 162 C194 172 202 196 198 214 C196 228 192 236 194 244 C${200 + 60 * b} 250 ${200 + 100 * b} 290 ${198 + 98 * b} 334 C${196 + 96 * b} 380 ${196 + 60 * b} 414 ${192 + 30 * b} 424 C${206 + 14 * b} 434 214 446 214 456 Q156 468 92 456 C96 400 102 340 106 300 C110 240 110 196 124 164 Z`;
	// la fenêtre sur le ventre (suit sa taille)
	const win = {cx: 196 + 42 * b, cy: 330, rx: 22 + 34 * b, ry: 40 + 42 * b};
	const bs = 0.85 + 0.3 * big; // taille du bébé
	// bras le long du corps (le ventre reste visible), puis elle berce le bébé
	const hand = {x: 150 + 58 * born, y: 326 - 64 * born};
	const mouth = mood === 'inquiete' ? 'M192 122 Q199 116 206 121' : mood === 'content' ? 'M188 114 Q198 128 208 114' : 'M190 117 Q198 124 206 116';
	const id = React.useId().replace(/:/g, '');
	return (
		<svg width={width} height={(width * 560) / 320} viewBox="0 0 320 560" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id={`w${id}`}>
					<ellipse cx={win.cx} cy={win.cy} rx={win.rx} ry={win.ry} />
				</clipPath>
				<clipPath id={`b${id}`}>
					<path d={body} />
				</clipPath>
			</defs>
			{/* jambes et chaussures */}
			{[146, 180].map((x) => (
				<g key={x}>
					<path d={`M${x} 450 V532`} stroke={N} strokeWidth={30} strokeLinecap="round" />
					<Skin>{(f, o) => <path d={`M${x} 450 V532`} stroke={f} strokeWidth={17} strokeLinecap="round" opacity={o} />}</Skin>
					<path d={`M${x - 8} 540 H${x + 26}`} stroke={N} strokeWidth={20} strokeLinecap="round" />
				</g>
			))}
			{/* cou */}
			<Skin>{(f, o) => <rect x={144} y={130} width={30} height={40} rx={10} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={6} />}</Skin>
			{/* robe (avec le ventre) */}
			<path d={body} fill={LPI.sky} {...SK} />
			<path d="M128 214 C150 222 176 222 196 214" fill="none" stroke={alpha(N, 0.35)} strokeWidth={5} strokeLinecap="round" />
			{/* dedans : utérus, placenta, cordon, bébé */}
			{inside > 0 && b > 0.3 ? (
				<g opacity={inside} clipPath={`url(#b${id})`}>
					<ellipse cx={win.cx} cy={win.cy} rx={win.rx} ry={win.ry} fill={LPI.paper} />
					<g clipPath={`url(#w${id})`}>
						<ellipse cx={win.cx} cy={win.cy} rx={win.rx - 6} ry={win.ry - 6} fill={alpha(LPI.pink, 0.28)} stroke={alpha(LPI.pink, 0.9)} strokeWidth={6} />
						{/* placenta, contre la paroi du haut, à gauche */}
						<ellipse cx={win.cx - win.rx * 0.45} cy={win.cy - win.ry * 0.62} rx={26} ry={13} transform={`rotate(-28 ${win.cx - win.rx * 0.45} ${win.cy - win.ry * 0.62})`} fill={LPI.pink} stroke={N} strokeWidth={4} />
						<path d={`M${win.cx - win.rx * 0.52} ${win.cy - win.ry * 0.66} l10 6 M${win.cx - win.rx * 0.4} ${win.cy - win.ry * 0.7} l2 10`} stroke={alpha(N, 0.5)} strokeWidth={3} strokeLinecap="round" />
						<g transform={`translate(${win.cx + 4} ${win.cy + 6}) scale(${bs}) rotate(-12)`}>
							{/* cordon */}
							<path d={`M${-win.rx * 0.45 / bs} ${-win.ry * 0.5 / bs} C-30 -30 -10 -24 2 -6`} fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
							{/* bébé recroquevillé, tête en bas */}
							<Skin>{(f, o) => <ellipse cx={8} cy={-14} rx={24} ry={32} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={4} />}</Skin>
							<Skin>{(f, o) => <circle cx={-6} cy={34} r={22} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={4} />}</Skin>
							<path d="M14 -36 C34 -30 34 -8 20 0" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
							<path d="M-14 4 C-24 10 -22 20 -14 22" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
							<path d="M-14 36 q5 4 10 0" fill="none" stroke={N} strokeWidth={3.5} strokeLinecap="round" />
							<ellipse cx={-16} cy={42} rx={5} ry={3} fill={LPI.pink} opacity={0.8} />
						</g>
					</g>
					<ellipse cx={win.cx} cy={win.cy} rx={win.rx} ry={win.ry} fill="none" stroke={N} strokeWidth={5} strokeDasharray="12 9" />
				</g>
			) : null}
			{/* hormones du placenta qui filent vers la cellule */}
			{hormones > 0 && b > 0.3
				? Array.from({length: 7}, (_, i) => {
						const t = (frame * 0.022 + i / 7) % 1;
						const sx = win.cx - win.rx * 0.45;
						const sy = win.cy - win.ry * 0.62;
						const x = sx + (to.x - sx) * t;
						const y = sy + (to.y - sy) * t - Math.sin(t * Math.PI) * 50;
						return <circle key={i} cx={x} cy={y} r={9} fill={LPI.pink} stroke={N} strokeWidth={3.5} opacity={hormones * Math.min(1, (1 - t) * 4, t * 8)} />;
					})
				: null}
			{/* bébé dans les bras, après l'accouchement */}
			{born > 0 ? (
				<g opacity={born} transform={`translate(214 250) scale(${0.6 + 0.4 * born})`}>
					<ellipse cx={0} cy={10} rx={46} ry={26} fill={LPI.paper} {...SK} strokeWidth={5} />
					<Skin>{(f, o) => <circle cx={30} cy={-8} r={20} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={4} />}</Skin>
					<path d="M24 -10 q4 3 8 0" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" />
				</g>
			) : null}
			{/* bras, main posée sur le ventre (ou qui berce le bébé) */}
			<path d={`M150 180 C148 236 ${hand.x - 4 - 20 * born} ${hand.y - 40} ${hand.x} ${hand.y}`} fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
			<Skin>{(f, o) => <path d={`M150 180 C148 236 ${hand.x - 4 - 20 * born} ${hand.y - 40} ${hand.x} ${hand.y}`} fill="none" stroke={f} strokeWidth={17} strokeLinecap="round" opacity={o} />}</Skin>
			<path d="M150 176 L151 204" stroke={N} strokeWidth={38} strokeLinecap="round" />
			<path d="M150 176 L151 204" stroke={LPI.sky} strokeWidth={25} strokeLinecap="round" />
			{/* tête de profil */}
			<Skin>{(f, o) => <circle cx={164} cy={92} r={54} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={7} />}</Skin>
			<Skin>{(f, o) => <path d="M214 84 q14 8 2 18" fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}</Skin>
			<path d="M112 100 C102 48 142 28 172 32 C200 36 216 52 214 70 C198 62 180 60 168 68 C152 78 142 98 136 122 C124 124 114 114 112 100 Z" fill={N} />
			<circle cx={112} cy={58} r={24} fill={N} />
			<Skin>{(f, o) => <ellipse cx={146} cy={100} rx={9} ry={13} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={5} />}</Skin>
			<path d="M180 70 Q190 64 200 70" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
			<g transform={`translate(0 84) scale(1 ${blink}) translate(0 -84)`}>
				<circle cx={192} cy={84} r={6.5} fill={N} />
			</g>
			<ellipse cx={188} cy={104} rx={11} ry={7} fill={LPI.pink} opacity={0.7} />
			<path d={mouth} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
		</svg>
	);
};

/** Frise de la grossesse (largeur × 150) : semaines 0 → 40 SA, fenêtre 24 – 28 SA en rose ; `fill` 0 → 1 = le curseur
 * avance ; `win` 0 → 1 = la fenêtre s'allume. */
export const WeeksBar: React.FC<{width?: number; fill: number; win: number}> = ({width = 880, fill, win}) => {
	const frame = useCurrentFrame();
	const W = 800;
	const x = (w: number) => 40 + (w / 40) * W;
	return (
		<svg width={width} height={(width * 150) / 880} viewBox="0 0 880 150" style={{overflow: 'visible'}}>
			<rect x={40} y={56} width={W} height={34} rx={17} fill={LPI.paper} {...SK} strokeWidth={6} />
			<rect x={40} y={56} width={Math.max(0, W * fill)} height={34} rx={17} fill={alpha(LPI.sky, 0.9)} />
			<rect x={x(24)} y={48} width={x(28) - x(24)} height={50} rx={12} fill={alpha(LPI.pink, win)} stroke={N} strokeWidth={5 * win} opacity={Math.min(1, win * 2)} />
			<rect x={40} y={56} width={W} height={34} rx={17} fill="none" {...SK} strokeWidth={6} />
			{[0, 12, 24, 28, 40].map((w) => (
				<g key={w}>
					<path d={`M${x(w)} 92 V108`} stroke={N} strokeWidth={4} />
					<text x={x(w)} y={138} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={w === 24 || w === 28 ? N : alpha(N, 0.6)}>
						{w}
					</text>
				</g>
			))}
			<text x={850} y={84} fontFamily={FONT.body} fontWeight={900} fontSize={26} fill={alpha(N, 0.7)}>
				SA
			</text>
			{/* le curseur (un petit ventre rond) */}
			<g transform={`translate(${40 + W * fill} 30) scale(${1 + 0.06 * Math.sin(frame / 5)})`}>
				<circle r={20} fill={LPI.pink} {...SK} strokeWidth={5} />
				<path d="M0 20 V30" stroke={N} strokeWidth={5} />
			</g>
		</svg>
	);
};

/** Verre de boisson sucrée (200 × 260) : liquide bleu clair, paille, sucres qui fondent (`melt` 0 → 1), `level` 1 → 0
 * = on le boit. */
export const SweetDrink: React.FC<{width?: number; level?: number; melt?: number}> = ({width = 200, level = 1, melt = 0}) => {
	const frame = useCurrentFrame();
	const top = 70 + (1 - level) * 160;
	return (
		<svg width={width} height={(width * 260) / 200} viewBox="0 0 200 260" style={{overflow: 'visible'}}>
			<path d="M128 10 L110 150" stroke={N} strokeWidth={16} strokeLinecap="round" />
			<path d="M128 10 L110 150" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
			<path d={`M44 ${top} L156 ${top} L146 236 Q100 246 54 236 Z`} fill={alpha(LPI.sky, 0.95)} />
			{level > 0.2
				? [0, 1, 2].map((i) => (
						<g key={i} transform={`translate(${70 + i * 30} ${top + 40 + i * 20 + Math.sin(frame / 8 + i) * 4}) rotate(${i * 20 + frame})`} opacity={1 - melt}>
							<rect x={-10} y={-10} width={20} height={20} rx={4} fill={LPI.paper} stroke={N} strokeWidth={3} />
						</g>
					))
				: null}
			<path d="M36 50 L50 238 Q100 252 150 238 L164 50" fill="none" {...SK} />
			<path d="M60 70 L68 210" stroke={alpha(LPI.paper, 0.8)} strokeWidth={8} strokeLinecap="round" />
		</svg>
	);
};
