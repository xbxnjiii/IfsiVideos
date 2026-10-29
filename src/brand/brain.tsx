// Briques « cerveau / AVC » réutilisables : cerveau de profil (artères où le sang circule, neurones qui scintillent,
// zone privée de sang où les neurones s'éteignent, caillot, hémorragie) et gros plan d'artère (globules qui
// circulent, caillot qui bouche, rupture de la paroi, thrombolyse qui dissout, thrombectomie qui retire).
import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {alpha, LPI} from './theme';
import {clamp} from './ui';

const N = LPI.navy;

/* ═════════════ cerveau de profil (viewBox 500 × 420, face vers la gauche) ═════════════ */
const CEREBRUM = 'M70 232 C46 160 88 78 170 52 C240 30 332 38 392 80 C452 122 474 192 444 252 C424 292 372 302 332 294 C300 312 250 314 210 302 C150 302 92 292 70 232 Z';
const STEM = 'M266 290 C270 330 268 362 260 406 L306 406 C300 364 300 330 310 290 Z';
const GYRI = [
	'M146 222 C196 202 258 196 312 216',
	'M262 58 C250 110 272 150 250 200',
	'M116 120 C148 98 170 130 202 108',
	'M332 98 C362 118 350 160 382 172',
	'M106 182 C138 170 150 202 182 190',
	'M300 262 C330 250 362 262 394 246',
	'M180 70 C190 100 214 96 222 130',
	'M402 120 C420 150 410 190 430 210',
];
/** artères : tronc, branches avant / milieu (coupée en 2 au niveau du caillot) / arrière */
const TRUNK = 'M262 404 C258 344 250 300 245 262';
const FRONT = 'M245 262 C200 240 150 212 108 150';
const MID1 = 'M245 262 C252 244 258 232 264 220';
const MID2 = 'M264 220 C282 186 304 148 334 106';
const MID3 = 'M296 166 C318 170 344 164 368 150';
const BACK = 'M245 262 C300 252 350 232 412 200';
/** zone irriguée par la branche du milieu (privée de sang si caillot) */
export const BRAIN_ZONE = {cx: 322, cy: 138, rx: 84, ry: 62};
export const BRAIN_CLOT = {x: 264, y: 220};
export const BRAIN_BLEED = {x: 352, y: 230};

const NEURONS = (() => {
	const pts: {x: number; y: number; k: number}[] = [];
	for (let gx = 0; gx < 11; gx++) {
		for (let gy = 0; gy < 7; gy++) {
			const x = 100 + gx * 31 + (random(`nx${gx}-${gy}`) - 0.5) * 18;
			const y = 72 + gy * 31 + (random(`ny${gx}-${gy}`) - 0.5) * 18;
			const e = ((x - 258) / 172) ** 2 + ((y - 168) / 104) ** 2;
			if (e < 1) pts.push({x, y, k: random(`nk${gx}-${gy}`)});
		}
	}
	return pts;
})();
const inZone = (x: number, y: number) => ((x - BRAIN_ZONE.cx) / BRAIN_ZONE.rx) ** 2 + ((y - BRAIN_ZONE.cy) / BRAIN_ZONE.ry) ** 2;

const Vessel: React.FC<{d: string; on?: number; flow: number; empty?: number}> = ({d, on = 1, flow, empty = 0}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<g opacity={on}>
			<path d={d} fill="none" stroke={N} strokeWidth={15} strokeLinecap="round" />
			<path d={d} fill="none" stroke={empty > 0 ? alpha(LPI.sky, 1) : LPI.pink} strokeWidth={8} strokeLinecap="round" />
			{empty < 1 ? <path d={d} fill="none" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" opacity={1 - empty} /> : null}
			<path d={d} fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 20" strokeDashoffset={-frame * 3 * flow} opacity={flow * (1 - empty)} />
		</g>
	);
};

export type BrainProps = {
	size?: number;
	/** artères visibles (0 → 1) */
	vessels?: number;
	/** sang qui circule (0 → 1) */
	flow?: number;
	/** neurones visibles (0 → 1) */
	neurons?: number;
	/** caillot sur la branche du milieu (0 → 1) */
	clot?: number;
	/** la branche du milieu ne laisse plus passer le sang, sans montrer de caillot (0 → 1) */
	cut?: number;
	/** zone privée de sang (0 → 1) */
	ischemia?: number;
	/** part des neurones éteints dans la zone (0 → 1, vague depuis le centre) ; `everywhere` les éteint partout */
	dead?: number;
	everywhere?: boolean;
	/** hémorragie : tache de sang qui s'étend (0 → 1) */
	bleed?: number;
	/** halo d'alerte autour du cerveau (0 → 1) */
	alert?: number;
};

export const Brain: React.FC<BrainProps> = ({size = 500, vessels = 1, flow = 1, neurons = 1, clot = 0, cut = 0, ischemia = 0, dead = 0, everywhere = false, bleed = 0, alert = 0}) => {
	const frame = useCurrentFrame();
	const blocked = Math.max(cut, Math.min(1, clot * 1.4));
	return (
		<svg width={size} height={size * 0.84} viewBox="0 0 500 420" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="lpi-cerebrum">
					<path d={CEREBRUM} />
				</clipPath>
			</defs>
			{alert > 0 ? <ellipse cx={258} cy={180} rx={250 + 14 * Math.sin(frame / 3)} ry={190 + 10 * Math.sin(frame / 3)} fill={alpha(LPI.pink, 0.28 * alert)} /> : null}
			{/* tronc cérébral + cervelet (derrière) */}
			<path d={STEM} fill={LPI.paper} stroke={N} strokeWidth={8} strokeLinejoin="round" />
			<g>
				<ellipse cx={374} cy={298} rx={68} ry={44} fill={LPI.paper} stroke={N} strokeWidth={8} />
				<ellipse cx={374} cy={298} rx={68} ry={44} fill={alpha(LPI.pink, 0.4)} />
				{[0, 1, 2].map((k) => (
					<path key={k} d={`M${318 + k * 6} ${284 + k * 14} C350 ${278 + k * 14} 400 ${278 + k * 14} ${432 - k * 8} ${288 + k * 14}`} fill="none" stroke={alpha(N, 0.35)} strokeWidth={5} strokeLinecap="round" />
				))}
			</g>
			{/* cerveau */}
			<path d={CEREBRUM} fill={LPI.paper} />
			<path d={CEREBRUM} fill={alpha(LPI.pink, 0.42)} />
			<g clipPath="url(#lpi-cerebrum)">
				{/* zone privée de sang */}
				{ischemia > 0 ? (
					<ellipse cx={BRAIN_ZONE.cx} cy={BRAIN_ZONE.cy} rx={BRAIN_ZONE.rx * (0.7 + 0.3 * ischemia)} ry={BRAIN_ZONE.ry * (0.7 + 0.3 * ischemia)} fill={alpha(LPI.sky, 0.95 * ischemia)} stroke={N} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={frame} opacity={1} />
				) : null}
				{GYRI.map((d) => (
					<path key={d} d={d} fill="none" stroke={alpha(N, 0.28)} strokeWidth={6} strokeLinecap="round" />
				))}
				{/* hémorragie */}
				{bleed > 0 ? (
					<g transform={`translate(${BRAIN_BLEED.x} ${BRAIN_BLEED.y}) scale(${bleed})`}>
						<path d="M0 -54 C30 -56 58 -30 54 0 C62 26 34 52 6 50 C-24 60 -58 36 -52 6 C-62 -22 -34 -52 0 -54 Z" fill={LPI.pink} stroke={N} strokeWidth={6} transform={`rotate(${frame})`} />
						<path d="M-18 -18 C-6 -26 10 -24 18 -12" fill="none" stroke={alpha(LPI.paper, 0.8)} strokeWidth={6} strokeLinecap="round" />
					</g>
				) : null}
				{/* neurones */}
				{neurons > 0
					? NEURONS.map((p, i) => {
							const z = inZone(p.x, p.y);
							const off = everywhere ? dead > p.k : z < 1 && dead > z * 0.7 + p.k * 0.3;
							const tw = 0.65 + 0.35 * Math.sin(frame / 5 + p.k * 20);
							return off ? (
								<circle key={i} cx={p.x} cy={p.y} r={5} fill={alpha(N, 0.3)} opacity={neurons} />
							) : (
								<g key={i} opacity={neurons}>
									<circle cx={p.x} cy={p.y} r={11} fill={alpha(LPI.blue, 0.22 * tw)} />
									<circle cx={p.x} cy={p.y} r={5.5} fill={LPI.blue} opacity={tw} />
								</g>
							);
						})
					: null}
			</g>
			<path d={CEREBRUM} fill="none" stroke={N} strokeWidth={9} strokeLinejoin="round" />
			{/* artères */}
			<g opacity={vessels}>
				<Vessel d={TRUNK} flow={flow} />
				<Vessel d={FRONT} flow={flow} />
				<Vessel d={BACK} flow={flow} />
				<Vessel d={MID1} flow={flow} />
				<Vessel d={MID2} flow={flow} empty={blocked} />
				<Vessel d={MID3} flow={flow} empty={blocked} />
			</g>
			{/* caillot */}
			{clot > 0 ? (
				<g transform={`translate(${BRAIN_CLOT.x} ${BRAIN_CLOT.y}) scale(${clot * (1 + 0.06 * Math.sin(frame / 4))})`}>
					<circle r={26} fill={alpha(LPI.blue, 0.25)} />
					<path d="M-14 -12 C-6 -20 12 -18 16 -6 C22 6 12 18 0 16 C-14 18 -22 4 -14 -12 Z" fill={LPI.blue} stroke={N} strokeWidth={5} />
					<path d="M-8 -4 L8 6 M-6 8 L6 -8" stroke={alpha(N, 0.5)} strokeWidth={3} strokeLinecap="round" />
				</g>
			) : null}
		</svg>
	);
};

/* ═════════════ gros plan d'artère (viewBox 900 × 300) ═════════════ */
const CELLS = Array.from({length: 16}, (_, i) => ({x0: random(`ac${i}`) * 960, y: 112 + random(`acy${i}`) * 76, r: random(`acr${i}`) * 60 - 30}));
const X = 470;

export type ArteryZoomProps = {
	width?: number;
	/** caillot présent (0 → 1) */
	clot?: number;
	/** thrombolyse : le caillot se dissout en morceaux (0 → 1) */
	dissolve?: number;
	/** thrombectomie : sonde qui avance, accroche le caillot et le retire (0 → 1) */
	retrieve?: number;
	/** rupture de la paroi (0 → 1) et sang qui s'échappe (0 → 1) */
	rupture?: number;
	spill?: number;
};

export const ArteryZoom: React.FC<ArteryZoomProps> = ({width = 900, clot = 0, dissolve = 0, retrieve = 0, rupture = 0, spill = 0}) => {
	const frame = useCurrentFrame();
	const pull = interpolate(retrieve, [0.55, 1], [0, 1], clamp);
	const reach = interpolate(retrieve, [0, 0.4], [0, 1], clamp);
	const grip = interpolate(retrieve, [0.38, 0.55], [0, 1], clamp);
	const present = clot * (1 - dissolve) * (1 - pull);
	const block = Math.min(1, present * 1.3);
	const cx = X - pull * 560;
	const k = width / 900;
	return (
		<svg width={width} height={300 * k} viewBox="0 0 900 300" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id="lpi-azoom">
					<rect x="0" y="0" width="900" height="300" rx="40" />
				</clipPath>
			</defs>
			{/* sang qui sort par la brèche */}
			{spill > 0 ? (
				<g>
					<path d={`M${X - 40} 34 C${X - 130 * spill} ${10 - 30 * spill} ${X - 150 * spill} ${-60 * spill} ${X - 90 * spill} ${-90 * spill} C${X - 50 * spill} ${-130 * spill} ${X - 10 * spill} ${-100 * spill} ${X} ${-122 * spill} C${X + 30 * spill} ${-142 * spill} ${X + 100 * spill} ${-122 * spill} ${X + 112 * spill} ${-72 * spill} C${X + 162 * spill} ${-42 * spill} ${X + 132 * spill} ${10 - 20 * spill} ${X + 40} 34 Z`} fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
					{[0, 1, 2, 3].map((i) => {
						const t = ((frame + i * 9) % 30) / 30;
						return <circle key={i} cx={X + (i - 1.5) * 50 * t * 2} cy={20 - 120 * t * spill} r={9 * (1 - t)} fill={LPI.pink} stroke={N} strokeWidth={3} opacity={spill} />;
					})}
				</g>
			) : null}
			<g clipPath="url(#lpi-azoom)">
				{/* lumière */}
				<rect x="0" y="84" width="900" height="132" fill={alpha(LPI.pink, 0.3)} />
				{/* globules : ils ralentissent et s'entassent devant le caillot, plus rien après */}
				{CELLS.map((c, i) => {
					let x = ((c.x0 + frame * 6) % 960) - 30;
					let o = 1;
					if (block > 0) {
						const stop = cx - 44;
						const squeezed = stop * (1 - Math.exp((-3 * Math.max(0, x)) / stop)) / (1 - Math.exp(-3));
						if (x > stop) o = 1 - block;
						x = x * (1 - block) + Math.min(x, squeezed) * block;
					}
					return (
						<g key={i} transform={`translate(${x} ${c.y}) rotate(${c.r})`} opacity={o}>
							<ellipse rx="26" ry="14" fill={LPI.pink} stroke={N} strokeWidth="4" />
							<ellipse rx="10" ry="4" fill={alpha(N, 0.22)} />
						</g>
					);
				})}
				{/* parois */}
				<rect x="-10" y="28" width="920" height="58" fill={LPI.sky} stroke={N} strokeWidth="6" />
				<rect x="-10" y="214" width="920" height="58" fill={LPI.sky} stroke={N} strokeWidth="6" />
				{/* brèche dans la paroi du haut */}
				{rupture > 0 ? (
					<g>
						<rect x={X - 40 * rupture} y="24" width={80 * rupture} height="66" fill={alpha(LPI.pink, 0.9)} />
						<path d={`M${X - 50} 30 L${X - 24} 56 L${X - 36} 70 L${X - 6} 86 M${X + 50} 30 L${X + 22} 52 L${X + 38} 66 L${X + 8} 86`} fill="none" stroke={N} strokeWidth={6} strokeLinejoin="round" opacity={rupture} />
					</g>
				) : null}
				{/* sonde de thrombectomie + stent qui accroche le caillot */}
				{retrieve > 0 ? (
					<g transform={`translate(${-pull * 560} 0)`}>
						<path d={`M-20 150 H${-20 + (X + 60) * reach}`} stroke={N} strokeWidth={8} strokeLinecap="round" />
						{grip > 0 ? (
							<path
								d={Array.from({length: 9}, (_, i) => `${i === 0 ? 'M' : 'L'}${X - 60 + i * 15} ${150 + (i % 2 === 0 ? -1 : 1) * 54 * grip}`).join(' ')}
								fill="none"
								stroke={LPI.navy}
								strokeWidth={5}
								strokeLinejoin="round"
							/>
						) : null}
					</g>
				) : null}
				{/* caillot (et ses morceaux quand il se dissout) */}
				{clot > 0 && dissolve < 1 ? (
					<g transform={`translate(${cx} 150) scale(${clot * (1 - 0.5 * dissolve)})`} opacity={1 - dissolve * 0.6}>
						<path d="M-44 -60 C-10 -70 34 -64 48 -30 C60 0 52 44 20 62 C-12 72 -50 58 -56 22 C-62 -14 -66 -48 -44 -60 Z" fill={LPI.blue} stroke={N} strokeWidth={7} />
						<path d="M-30 -30 L26 22 M-24 26 L28 -26 M-40 0 H40" stroke={alpha(N, 0.45)} strokeWidth={5} strokeLinecap="round" />
					</g>
				) : null}
				{dissolve > 0
					? Array.from({length: 10}, (_, i) => {
							const t = dissolve;
							const x = X + 20 + t * (120 + random(`df${i}`) * 300);
							const y = 110 + random(`dfy${i}`) * 80;
							return <circle key={i} cx={x} cy={y} r={10 * (1 - t) + 2} fill={LPI.blue} stroke={N} strokeWidth={3} opacity={1 - t} />;
						})
					: null}
			</g>
			<rect x="0" y="0" width="900" height="300" rx="40" fill="none" stroke={N} strokeWidth="8" />
		</svg>
	);
};
