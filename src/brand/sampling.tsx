// Matériel de soins (prise de sang) : aiguille Vacutainer (2 pointes, manchon), corps de prélèvement (porte-tube),
// unité à ailettes (épicrânienne), tube sous vide (bouchon coloré, sang qui monte), solution hydroalcoolique, main
// (nue ou gantée), flacon d'antiseptique, compresse (stérile : sachet), pansement, collecteur à OPCT, sac DASRI, et
// le bras (veine, garrot, point de ponction, désinfection, compresse qui appuie, aiguille, pansement).
// Couleurs de la marque uniquement (le sang = rose, les bouchons = bleu, bleu clair, rose, bleu nuit).
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const svg = (w: number, vw: number, vh: number, children: React.ReactNode) => (
	<svg width={w} height={(w * vh) / vw} viewBox={`0 0 ${vw} ${vh}`} style={{overflow: 'visible', display: 'block'}}>
		{children}
	</svg>
);

/** Aiguille Vacutainer (400 × 100) : à gauche la pointe côté tube sous son manchon, le pas de vis, à droite la pointe côté veine. */
export const VacuNeedle: React.FC<{size?: number; cap?: number; glowVein?: number; glowTube?: number}> = ({size = 400, cap = 0, glowVein = 0, glowTube = 0}) =>
	svg(
		size,
		400,
		100,
		<>
			{glowTube > 0 ? <ellipse cx={70} cy={50} rx={60} ry={34} fill={alpha(LPI.sky, 0.6 * glowTube)} /> : null}
			{glowVein > 0 ? <ellipse cx={360} cy={50} rx={56} ry={30} fill={alpha(LPI.pink, 0.6 * glowVein)} /> : null}
			{/* côté tube : pointe courte sous un manchon de caoutchouc */}
			<line x1={34} y1={50} x2={150} y2={50} stroke={N} strokeWidth={4} />
			<rect x={58} y={39} width={94} height={22} rx={11} fill={alpha(LPI.pink, 0.75)} stroke={N} strokeWidth={4} />
			{/* pas de vis + embase */}
			<path d="M150 26 H212 V74 H150 Z" fill={LPI.blue} {...SK} />
			{[160, 172, 184].map((x) => (
				<line key={x} x1={x} y1={28} x2={x} y2={72} stroke={alpha(LPI.paper, 0.7)} strokeWidth={4} />
			))}
			<path d="M212 36 L240 44 V56 L212 64 Z" fill={LPI.sky} {...SK} />
			{/* côté veine : longue pointe biseautée */}
			<line x1={240} y1={50} x2={380} y2={50} stroke={N} strokeWidth={6} strokeLinecap="round" />
			<line x1={244} y1={48} x2={372} y2={48} stroke={LPI.sky} strokeWidth={2} />
			<path d="M372 46 L396 50 L372 54 Z" fill={N} />
			{cap > 0 ? <rect x={228} y={34} width={176} height={32} rx={16} fill={alpha(LPI.sky, 0.55 * cap)} stroke={alpha(N, cap)} strokeWidth={4} /> : null}
		</>,
	);

/** Corps de prélèvement / porte-tube (300 × 140) : cylindre transparent, collerette à gauche, embout vissé à droite. */
export const Holder: React.FC<{size?: number}> = ({size = 300}) =>
	svg(
		size,
		300,
		140,
		<>
			<path d="M34 34 H262 Q278 34 280 52 V88 Q278 106 262 106 H34 Z" fill={alpha(LPI.sky, 0.55)} {...SK} />
			<path d="M280 56 H300 V84 H280" fill={LPI.sky} {...SK} />
			<rect x={14} y={8} width={26} height={124} rx={12} fill={LPI.sky} {...SK} />
			<line x1={60} y1={46} x2={250} y2={46} stroke={alpha(LPI.paper, 0.9)} strokeWidth={6} strokeLinecap="round" />
		</>,
	);

/** Unité à ailettes / épicrânienne (420 × 200) : aiguille, deux ailettes souples (`flap` les fait battre), tubulure. */
export const Butterfly: React.FC<{size?: number; flap?: number}> = ({size = 420, flap = 0}) => {
	const frame = useCurrentFrame();
	const w = 1 - 0.35 * flap * (0.5 + 0.5 * Math.sin(frame / 2.2));
	return svg(
		size,
		420,
		200,
		<>
			<path d="M262 100 C200 100 190 40 140 40 C80 40 110 150 60 150 C40 150 30 120 30 100" fill="none" stroke={N} strokeWidth={14} strokeLinecap="round" />
			<path d="M262 100 C200 100 190 40 140 40 C80 40 110 150 60 150 C40 150 30 120 30 100" fill="none" stroke={LPI.sky} strokeWidth={8} strokeLinecap="round" />
			<rect x={4} y={86} width={34} height={28} rx={6} fill={LPI.blue} {...SK} />
			<g transform={`translate(285 100) scale(1 ${w}) translate(-285 -100)`}>
				<path d="M268 92 C250 60 262 14 292 14 C318 14 316 60 300 92 Z" fill={alpha(LPI.sky, 0.9)} {...SK} />
				<path d="M268 108 C250 140 262 186 292 186 C318 186 316 140 300 108 Z" fill={alpha(LPI.sky, 0.9)} {...SK} />
			</g>
			<rect x={258} y={88} width={52} height={24} rx={10} fill={LPI.blue} {...SK} />
			<line x1={310} y1={100} x2={400} y2={100} stroke={N} strokeWidth={5} strokeLinecap="round" />
			<path d="M396 97 L414 100 L396 103 Z" fill={N} />
		</>,
	);
};

/** Tube sous vide (80 × 300) : bouchon coloré, étiquette, sang (rose) jusqu'à `level`, flèches du vide (`vacuum`). */
export const BloodTube: React.FC<{size?: number; cap?: string; level?: number; vacuum?: number; mark?: number}> = ({size = 80, cap = LPI.blue, level = 0, vacuum = 0, mark = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const body = 'M12 58 H68 V262 Q68 292 40 292 Q12 292 12 262 Z';
	const top = 292 - 230 * level;
	return svg(
		size,
		80,
		300,
		<>
			<defs>
				<clipPath id={`tb${id}`}>
					<path d={body} />
				</clipPath>
			</defs>
			<path d={body} fill={alpha(LPI.paper, 0.95)} />
			<g clipPath={`url(#tb${id})`}>
				{level > 0 ? <rect x={0} y={top} width={80} height={300} fill={LPI.pink} /> : null}
				{level > 0 ? <path d={`M0 ${top} Q20 ${top - 5 * Math.sin(frame / 3)} 40 ${top} T80 ${top}`} fill={LPI.pink} /> : null}
				<rect x={12} y={128} width={56} height={70} fill={alpha(LPI.paper, 0.85)} stroke={alpha(N, 0.35)} strokeWidth={3} />
				{[146, 160, 174].map((y) => (
					<line key={y} x1={20} x2={58} y1={y} y2={y} stroke={alpha(N, 0.3)} strokeWidth={3} />
				))}
			</g>
			{mark > 0 ? <line x1={4} x2={76} y1={110} y2={110} stroke={N} strokeWidth={4} strokeDasharray="8 6" opacity={mark} /> : null}
			<path d={body} fill="none" {...SK} />
			<line x1={22} y1={74} x2={22} y2={250} stroke={alpha(LPI.paper, 0.9)} strokeWidth={5} strokeLinecap="round" />
			{vacuum > 0
				? [0, 1].map((k) => {
						const t = ((frame / 14 + k / 2) % 1) as number;
						return <path key={k} d={`M40 ${70 + t * 50} l-10 -12 M40 ${70 + t * 50} l10 -12`} fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" opacity={vacuum * (1 - t)} />;
					})
				: null}
			<rect x={4} y={2} width={72} height={60} rx={12} fill={cap} {...SK} />
			{[18, 30, 42].map((y) => (
				<line key={y} x1={12} x2={68} y1={y} y2={y} stroke={alpha(N, 0.35)} strokeWidth={3} />
			))}
		</>,
	);
};

/** Flacon de solution hydroalcoolique (160 × 280). */
export const ShaBottle: React.FC<{size?: number; press?: number}> = ({size = 160, press = 0}) =>
	svg(
		size,
		160,
		280,
		<>
			<g transform={`translate(0 ${10 * press})`}>
				<path d="M50 18 H120 V36 H50 Z" fill={N} />
				<path d="M120 22 H148 V32 H120" fill={N} />
				<rect x={70} y={36} width={22} height={34} fill={LPI.blue} {...SK} />
			</g>
			<path d="M34 92 Q34 70 60 70 H102 Q128 70 128 92 V256 Q128 274 110 274 H52 Q34 274 34 256 Z" fill={LPI.sky} {...SK} />
			<rect x={46} y={136} width={70} height={74} rx={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<text x={81} y={186} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
				SHA
			</text>
			<line x1={48} y1={100} x2={48} y2={250} stroke={alpha(LPI.paper, 0.85)} strokeWidth={6} strokeLinecap="round" />
		</>,
	);

/** Main ouverte (200 × 260) ; `gloved` : gant à usage unique (bleu clair). */
export const Hand: React.FC<{size?: number; gloved?: number}> = ({size = 200, gloved = 0}) => {
	const fill = gloved > 0.5 ? alpha(LPI.sky, 0.95) : LPI.paper;
	return svg(
		size,
		200,
		260,
		<>
			{[48, 78, 108, 138].map((x, i) => (
				<rect key={x} x={x} y={[34, 14, 20, 44][i]} width={28} height={130} rx={14} fill={fill} {...SK} />
			))}
			<rect x={4} y={112} width={30} height={92} rx={15} fill={fill} {...SK} transform="rotate(-38 19 158)" />
			<path d="M40 116 H170 V214 Q170 250 132 250 H78 Q40 250 40 214 Z" fill={fill} {...SK} />
			{gloved > 0.5 ? null : <path d="M40 116 H170 V214 Q170 250 132 250 H78 Q40 250 40 214 Z" fill={alpha(LPI.pink, 0.28)} />}
			{gloved > 0.5 ? <rect x={46} y={232} width={118} height={26} rx={8} fill={LPI.sky} {...SK} /> : null}
		</>,
	);
};

/** Flacon d'antiseptique cutané (140 × 260). */
export const AntisepticBottle: React.FC<{size?: number}> = ({size = 140}) =>
	svg(
		size,
		140,
		260,
		<>
			<path d="M58 6 H82 L88 40 H52 Z" fill={N} />
			<rect x={44} y={40} width={52} height={30} rx={6} fill={LPI.blue} {...SK} />
			<path d="M22 96 Q22 70 50 70 H90 Q118 70 118 96 V238 Q118 254 102 254 H38 Q22 254 22 238 Z" fill={alpha(LPI.pink, 0.75)} {...SK} />
			<rect x={34} y={124} width={72} height={86} rx={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<path d="M70 140 V194 M43 167 H97" stroke={LPI.blue} strokeWidth={14} strokeLinecap="round" />
		</>,
	);

/** Compresse (160 × 160) ; `sterile` : dans son sachet. */
export const Gauze: React.FC<{size?: number; sterile?: boolean}> = ({size = 160, sterile = false}) =>
	svg(
		size,
		160,
		160,
		<>
			{sterile ? <rect x={2} y={2} width={156} height={156} rx={16} fill={alpha(LPI.sky, 0.45)} stroke={LPI.pink} strokeWidth={5} strokeDasharray="12 8" /> : null}
			<rect x={22} y={22} width={116} height={116} rx={8} fill={LPI.paper} {...SK} />
			{[44, 66, 88, 110].map((p) => (
				<g key={p}>
					<line x1={p} y1={26} x2={p} y2={134} stroke={alpha(LPI.sky, 0.95)} strokeWidth={3} />
					<line x1={26} y1={p} x2={134} y2={p} stroke={alpha(LPI.sky, 0.95)} strokeWidth={3} />
				</g>
			))}
			<path d="M108 138 L138 108 V130 Q138 138 130 138 Z" fill={alpha(N, 0.12)} />
		</>,
	);

/** Pansement (240 × 100). */
export const Plaster: React.FC<{size?: number}> = ({size = 240}) =>
	svg(
		size,
		240,
		100,
		<>
			<rect x={6} y={18} width={228} height={64} rx={32} fill={alpha(LPI.pink, 0.8)} {...SK} />
			<rect x={88} y={26} width={64} height={48} rx={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
			{[30, 48, 192, 210].map((x) => (
				<g key={x}>
					<circle cx={x} cy={40} r={3} fill={alpha(N, 0.4)} />
					<circle cx={x} cy={60} r={3} fill={alpha(N, 0.4)} />
				</g>
			))}
		</>,
	);

/** Collecteur à OPCT (240 × 280) ; `drop` 0 → 1 : une aiguille tombe dans la fente. */
export const SharpsBox: React.FC<{size?: number; drop?: number}> = ({size = 240, drop = 0}) =>
	svg(
		size,
		240,
		280,
		<>
			{drop > 0 && drop < 1 ? (
				<g transform={`translate(${120} ${-150 + 210 * drop * drop}) rotate(80)`}>
					<VacuNeedleGlyph />
				</g>
			) : null}
			<path d="M30 92 H210 L196 268 H44 Z" fill={LPI.sky} {...SK} />
			<path d="M20 62 H220 V96 H20 Z" fill={LPI.pink} {...SK} />
			<rect x={78} y={70} width={84} height={14} rx={7} fill={N} />
			<rect x={56} y={134} width={128} height={88} rx={12} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<text x={120} y={192} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>
				OPCT
			</text>
		</>,
	);

/** Petite aiguille (pour le collecteur et les pictos). */
const VacuNeedleGlyph: React.FC = () => (
	<g>
		<rect x={-40} y={-10} width={34} height={20} rx={6} fill={LPI.blue} stroke={N} strokeWidth={4} />
		<line x1={-6} y1={0} x2={60} y2={0} stroke={N} strokeWidth={5} strokeLinecap="round" />
	</g>
);

/** Sac DASRI (240 × 280) ; `fill` : déchets qui tombent dedans. */
export const DasriBag: React.FC<{size?: number; fill?: number}> = ({size = 240, fill = 0}) =>
	svg(
		size,
		240,
		280,
		<>
			{fill > 0 && fill < 1 ? (
				<g transform={`translate(${100} ${-120 + 200 * fill * fill}) rotate(${fill * 120})`} opacity={1 - fill * 0.6}>
					<rect x={-26} y={-26} width={52} height={52} rx={6} fill={LPI.paper} stroke={N} strokeWidth={4} />
					<circle cx={4} cy={2} r={10} fill={LPI.pink} />
				</g>
			) : null}
			<path d="M60 60 Q120 40 180 60 L214 236 Q218 272 184 272 H56 Q22 272 26 236 Z" fill={alpha(LPI.pink, 0.8)} {...SK} />
			<path d="M88 64 Q120 20 152 64" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
			<rect x={58} y={132} width={124} height={84} rx={12} fill={LPI.paper} stroke={N} strokeWidth={4} />
			<text x={120} y={186} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={38} fill={N}>
				DASRI
			</text>
		</>,
	);

/* ───────────── le bras ───────────── */

/** Repère 900 × 300 : bras tendu (épaule à gauche, main à droite), pli du coude vers x 450. */
export const ARM_PT = {point: [450, 152], tourniquet: [300, 150], hand: [860, 150]} as const;

export const Arm: React.FC<{
	width?: number;
	/** garrot posé (0 → 1) et serré (`tight`) */
	tourniquet?: number;
	tight?: number;
	/** la veine gonfle */
	swell?: number;
	/** cible sur le point de ponction */
	mark?: number;
	/** zone désinfectée (cercle) */
	wipe?: number;
	/** aiguille dans la veine (0 → 1) */
	needle?: number;
	/** compresse posée / pansement posé */
	gauze?: number;
	plaster?: number;
}> = ({width = 900, tourniquet = 0, tight = 0, swell = 0, mark = 0, wipe = 0, needle = 0, gauze = 0, plaster = 0}) => {
	const frame = useCurrentFrame();
	const ARM = 'M0 58 C120 52 300 56 430 76 C560 92 700 96 800 104 C860 96 900 120 900 150 C900 180 860 204 800 196 C700 204 560 208 430 222 C300 240 120 248 0 242 Z';
	const [px, py] = ARM_PT.point;
	const vw = 9 + 13 * swell;
	return svg(
		width,
		900,
		300,
		<>
			<path d={ARM} fill={LPI.paper} />
			<path d={ARM} fill={alpha(LPI.pink, 0.26)} />
			{wipe > 0 ? <ellipse cx={px} cy={py} rx={100 * wipe} ry={70 * wipe} fill={alpha(LPI.sky, 0.55)} stroke={LPI.blue} strokeWidth={4} strokeDasharray="10 8" /> : null}
			{/* la veine (plus large quand le garrot est serré) */}
			<path d="M840 156 C700 160 560 150 450 152 C330 154 200 146 0 150" fill="none" stroke={alpha(LPI.blue, 0.8)} strokeWidth={vw} strokeLinecap="round" />
			<path d="M840 156 C700 160 560 150 450 152 C330 154 200 146 0 150" fill="none" stroke={alpha(LPI.paper, 0.45)} strokeWidth={vw * 0.3} strokeLinecap="round" />
			{/* pli du coude */}
			<path d="M440 92 Q456 112 448 132" fill="none" stroke={alpha(N, 0.35)} strokeWidth={5} strokeLinecap="round" />
			<path d={ARM} fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round" />
			{mark > 0 ? (
				<g transform={`translate(${px} ${py})`} opacity={mark}>
					<circle r={34 + 4 * Math.sin(frame / 4)} fill="none" stroke={LPI.pink} strokeWidth={6} strokeDasharray="10 7" />
					<circle r={7} fill={LPI.pink} />
				</g>
			) : null}
			{/* garrot : bande qui serre le bras au-dessus du point de ponction */}
			{tourniquet > 0 ? (
				<g opacity={Math.min(1, tourniquet * 2)} transform={`translate(0 ${-40 * (1 - tourniquet)})`}>
					<rect x={278 + 6 * tight} y={46} width={48 - 12 * tight} height={214} rx={12} fill={LPI.blue} {...SK} />
					<rect x={286} y={20} width={32} height={40} rx={8} fill={N} />
					<path d="M326 40 Q360 20 372 -10" fill="none" stroke={LPI.blue} strokeWidth={22} strokeLinecap="round" />
				</g>
			) : null}
			{/* aiguille + porte-tube qui entrent dans la veine (depuis la main) */}
			{needle > 0 ? (
				<g transform={`translate(${px + 220 - 200 * needle} ${py - 70 + 64 * needle}) rotate(-18)`}>
					<line x1={-30} y1={0} x2={60} y2={0} stroke={N} strokeWidth={5} strokeLinecap="round" />
					<rect x={60} y={-26} width={200} height={52} rx={14} fill={alpha(LPI.sky, 0.85)} {...SK} />
					<rect x={256} y={-38} width={20} height={76} rx={8} fill={LPI.sky} {...SK} />
				</g>
			) : null}
			{gauze > 0 ? (
				<g transform={`translate(${px} ${py}) scale(${gauze}) rotate(-8)`}>
					<rect x={-58} y={-58} width={116} height={116} rx={8} fill={LPI.paper} {...SK} />
					{[-30, 0, 30].map((p) => (
						<g key={p}>
							<line x1={p} y1={-54} x2={p} y2={54} stroke={LPI.sky} strokeWidth={3} />
							<line x1={-54} y1={p} x2={54} y2={p} stroke={LPI.sky} strokeWidth={3} />
						</g>
					))}
				</g>
			) : null}
			{plaster > 0 ? (
				<g transform={`translate(${px} ${py}) scale(${plaster}) rotate(-6)`}>
					<rect x={-110} y={-32} width={220} height={64} rx={32} fill={alpha(LPI.pink, 0.9)} {...SK} />
					<rect x={-32} y={-24} width={64} height={48} rx={10} fill={LPI.paper} stroke={N} strokeWidth={4} />
				</g>
			) : null}
		</>,
	);
};

/** Garrot seul (260 × 90) : bande élastique et boucle à clip. */
export const TourniquetStrap: React.FC<{size?: number}> = ({size = 260}) =>
	svg(
		size,
		260,
		90,
		<>
			<path d="M10 45 C60 20 200 20 250 45" fill="none" stroke={N} strokeWidth={36} strokeLinecap="round" />
			<path d="M10 45 C60 20 200 20 250 45" fill="none" stroke={LPI.blue} strokeWidth={26} strokeLinecap="round" />
			<rect x={104} y={14} width={52} height={44} rx={10} fill={N} />
			<rect x={116} y={24} width={28} height={24} rx={6} fill={LPI.sky} />
		</>,
	);
