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
