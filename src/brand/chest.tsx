// Le thorax « couche par couche » (demandé : une image simple par étape, comme si on enlevait un calque à chaque fois).
// Tout est dessiné dans le repère du `Patient` (400 × 560) : chaque couche se pose exactement sur lui, à la même taille.
//   1. le patient (habillé : c'est le `Patient` lui-même)
//   2. `RibsLayer`      la cage thoracique (côtes, sternum, clavicules), les poumons devinés derrière
//   3. `LungsOutLayer`  les poumons vus de l'extérieur (lobes, plèvre brillante, trachée, cœur, diaphragme)
//   4. `LungsInLayer`   à l'intérieur : la trachée, les bronches, les bronchioles et les grappes d'alvéoles
//   5. `AlveoliZoom` (lungs.tsx)  au bout d'une bronchiole : les alvéoles
//   6. `AlveolusExchange`         une alvéole et son vaisseau : l'O₂ passe dans le sang, le CO₂ ressort
// `ChestPeel` empile 2 → 4 sur le patient : `peel` 0 → 3, chaque unité enlève une couche (la ligne de la « radio »
// descend et découvre la couche du dessous). `ChestStep` montre une étape seule, cadrée sur le thorax (planches).
// BPCO : `copd` sur chaque couche (poumons distendus, plus sombres, bulles à la surface ; bronches enflammées + mucus).
import React, {useId} from 'react';
import {useCurrentFrame} from 'remotion';
import {BULLAE, FISSURES, LUNG_L, LUNG_R, LUNGS_IN_PATIENT, MAIN, PLUGS, segPath, TREE, Tube} from './lungs';
import {Patient, TORSO} from './patient';
import {alpha, LPI} from './theme';

const N = LPI.navy;
const {x: LX, y: LY, s: LS} = LUNGS_IN_PATIENT;
const XMAP = `translate(${LX} ${LY}) scale(${LS})`;
/** Cadrage du thorax (planches, gros plans). */
export const CHEST_BOX = {x: 84, y: 150, w: 232, h: 290};

/* ═══════════════════════════════ 2 · LA CAGE THORACIQUE ═══════════════════════════════ */
const RIB_YS = [236, 256, 277, 298, 319, 340, 361, 382, 402];
const rib = (y: number, s: number, i: number) => {
	const out = 70 + i * 2.2;
	return `M${200 + s * 13} ${y} C${200 + s * 44} ${y - 10} ${200 + s * (out + 4)} ${y - 6} ${200 + s * (out + 12)} ${y + 20 + i * 1.5}`;
};

export const RibsLayer: React.FC<{copd?: number}> = ({copd = 0}) => {
	const id = useId().replace(/:/g, '');
	return (
		<g>
			<defs>
				<clipPath id={`rb${id}`}>
					<path d={TORSO} />
				</clipPath>
			</defs>
			<g clipPath={`url(#rb${id})`}>
				<path d={TORSO} fill={LPI.paper} />
				<path d={TORSO} fill={LPI.pink} opacity={0.22} />
				{/* les poumons devinés derrière les côtes */}
				<g transform={XMAP} opacity={0.4}>
					{[LUNG_R, LUNG_L].map((d) => (
						<path
							key={d}
							d={d}
							fill={LPI.pink}
							transform={`translate(300 340) scale(${1 + 0.06 * copd}) translate(-300 -340)`}
						/>
					))}
				</g>
				{/* colonne (derrière) */}
				{Array.from({length: 13}, (_, i) => (
					<rect key={i} x={193} y={214 + i * 18} width={14} height={13} rx={4} fill={alpha(N, 0.12)} />
				))}
				{/* côtes : os (blanc) + cartilage (bleu clair) près du sternum */}
				{RIB_YS.map((y, i) =>
					[-1, 1].map((s) => (
						<g key={`${i}${s}`} fill="none" strokeLinecap="round">
							<path d={rib(y, s, i)} stroke={N} strokeWidth={11} />
							<path d={rib(y, s, i)} stroke={LPI.paper} strokeWidth={6.5} />
							<path d={`M${200 + s * 13} ${y} L${200 + s * 26} ${y - 3}`} stroke={LPI.sky} strokeWidth={6.5} />
						</g>
					)),
				)}
				{/* rebord des côtes (arc sous le sternum) */}
				{[-1, 1].map((s) => (
					<g key={`a${s}`} fill="none" strokeLinecap="round">
						<path
							d={`M${200 + s * 6} 338 C${200 + s * 24} 360 ${200 + s * 52} 392 ${200 + s * 82} 418`}
							stroke={N}
							strokeWidth={11}
						/>
						<path
							d={`M${200 + s * 6} 338 C${200 + s * 24} 360 ${200 + s * 52} 392 ${200 + s * 82} 418`}
							stroke={LPI.sky}
							strokeWidth={6.5}
						/>
					</g>
				))}
				{/* sternum */}
				<path
					d="M188 214 Q200 208 212 214 L210 232 L208 334 Q200 346 192 334 L190 232 Z"
					fill={LPI.paper}
					stroke={N}
					strokeWidth={4.5}
					strokeLinejoin="round"
				/>
				{/* clavicules */}
				{[-1, 1].map((s) => (
					<g key={`c${s}`} fill="none" strokeLinecap="round">
						<path
							d={`M${200 + s * 10} 216 C${200 + s * 38} 208 ${200 + s * 66} 216 ${200 + s * 92} 206`}
							stroke={N}
							strokeWidth={12}
						/>
						<path
							d={`M${200 + s * 10} 216 C${200 + s * 38} 208 ${200 + s * 66} 216 ${200 + s * 92} 206`}
							stroke={LPI.paper}
							strokeWidth={7.5}
						/>
					</g>
				))}
			</g>
			<path d={TORSO} fill="none" stroke={N} strokeWidth={8} strokeLinejoin="round" />
		</g>
	);
};

/* ═══════════════════════════════ 3 · LES POUMONS (EXTÉRIEUR) ═══════════════════════════════ */
const Heart: React.FC<{o?: number}> = ({o = 1}) => (
	<g opacity={o} transform="translate(214 356) rotate(-16)">
		<path
			d="M0 44 C-52 8 -50 -40 -14 -40 C-4 -40 0 -32 0 -26 C0 -32 6 -42 20 -42 C56 -40 52 6 0 44 Z"
			fill={LPI.pink}
			stroke={N}
			strokeWidth={4.5}
			strokeLinejoin="round"
		/>
		<path
			d="M0 44 C-52 8 -50 -40 -14 -40 C-4 -40 0 -32 0 -26 C0 -32 6 -42 20 -42 C56 -40 52 6 0 44 Z"
			fill={N}
			opacity={0.14}
		/>
		<path d="M-6 -36 C-4 -50 10 -58 20 -56" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
		<path d="M-6 -36 C-4 -50 10 -58 20 -56" fill="none" stroke={LPI.pink} strokeWidth={4} strokeLinecap="round" />
	</g>
);
const Diaphragm: React.FC<{o?: number; flat?: number}> = ({o = 1, flat = 0}) => {
	const d = `M98 ${424 + 4 * flat} C140 ${396 + 10 * flat} 182 ${394 + 10 * flat} 200 ${410 + 4 * flat} C218 ${394 + 10 * flat} 260 ${396 + 10 * flat} 302 ${424 + 4 * flat}`;
	return (
		<g opacity={o} fill="none" strokeLinecap="round">
			<path d={d} stroke={N} strokeWidth={13} />
			<path d={d} stroke={LPI.pink} strokeWidth={7.5} />
		</g>
	);
};
const Trachea: React.FC = () => (
	<g transform={XMAP}>
		<rect x={278} y={-30} width={44} height={290} rx={20} fill={LPI.paper} stroke={N} strokeWidth={9} />
		{Array.from({length: 13}, (_, i) => (
			<rect
				key={i}
				x={282}
				y={-14 + i * 20}
				width={36}
				height={10}
				rx={5}
				fill={LPI.sky}
				stroke={N}
				strokeWidth={3.5}
			/>
		))}
		{/* larynx */}
		<path
			d="M262 -78 Q300 -96 338 -78 L330 -30 Q300 -20 270 -30 Z"
			fill={LPI.sky}
			stroke={N}
			strokeWidth={9}
			strokeLinejoin="round"
		/>
	</g>
);

export const LungsOutLayer: React.FC<{copd?: number; breath?: number; bg?: boolean}> = ({
	copd = 0,
	breath = 0,
	bg = true,
}) => {
	const k = 1 + 0.035 * breath + 0.07 * copd;
	return (
		<g>
			{bg ? (
				<>
					<path d={TORSO} fill={LPI.paper} />
					<path d={TORSO} fill={LPI.sky} opacity={0.35} />
				</>
			) : null}
			<Trachea />
			{/* bronches souches qui entrent dans les poumons (derrière) */}
			<g transform={XMAP}>
				{MAIN.slice(0, 2).map((s, i) => (
					<Tube key={i} d={segPath(s.pts)} w={s.w} prog={1} copd={copd} />
				))}
			</g>
			<Heart />
			<Diaphragm flat={copd} />
			<g transform={`${XMAP} translate(300 340) scale(${k}) translate(-300 -340)`}>
				{[LUNG_R, LUNG_L].map((d) => (
					<g key={d}>
						<path d={d} fill={LPI.paper} />
						<path d={d} fill={LPI.pink} opacity={0.72} />
						<path d={d} fill={N} opacity={0.17 * copd} />
						<path d={d} fill="none" stroke={N} strokeWidth={26} opacity={0.07} />
					</g>
				))}
				{/* plèvre brillante (reflets) */}
				<path
					d="M150 150 C120 200 100 280 96 360"
					fill="none"
					stroke={LPI.paper}
					strokeWidth={16}
					strokeLinecap="round"
					opacity={0.55}
				/>
				<path
					d="M448 150 C478 200 498 280 502 360"
					fill="none"
					stroke={LPI.paper}
					strokeWidth={16}
					strokeLinecap="round"
					opacity={0.55}
				/>
				<ellipse cx={176} cy={176} rx={16} ry={26} fill={LPI.paper} opacity={0.6} transform="rotate(18 176 176)" />
				<ellipse cx={424} cy={176} rx={16} ry={26} fill={LPI.paper} opacity={0.6} transform="rotate(-18 424 176)" />
				{/* scissures (limites des lobes) */}
				{FISSURES.map((d) => (
					<path key={d} d={d} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" opacity={0.55} />
				))}
				{/* BPCO : bulles d'emphysème à la surface */}
				{copd > 0
					? BULLAE.map(([x, y, r], i) => (
							<g key={i} opacity={Math.min(1, copd * 1.6 - i * 0.08)}>
								<circle cx={x} cy={y} r={r * copd} fill={alpha(LPI.paper, 0.75)} stroke={N} strokeWidth={4} />
								<ellipse
									cx={x - r * 0.3 * copd}
									cy={y - r * 0.35 * copd}
									rx={r * 0.25 * copd}
									ry={r * 0.15 * copd}
									fill={LPI.paper}
								/>
							</g>
						))
					: null}
				{[LUNG_R, LUNG_L].map((d) => (
					<path key={`o${d}`} d={d} fill="none" stroke={N} strokeWidth={9} strokeLinejoin="round" />
				))}
			</g>
		</g>
	);
};

/* ═══════════════════════════════ 4 · À L'INTÉRIEUR : LES BRONCHES ═══════════════════════════════ */
/** Bronchioles gardées pour la vue intérieure (assez pour remplir, pas trop pour rester lisible). */
const IN_TWIGS = TREE.segs.filter((s) => s.lvl <= 4);
const IN_TIPS = (() => {
	const starts = new Set(IN_TWIGS.map((s) => `${Math.round(s.pts[0])},${Math.round(s.pts[1])}`));
	return IN_TWIGS.filter((s) => !starts.has(`${Math.round(s.pts[4])},${Math.round(s.pts[5])}`)).map(
		(s) => [s.pts[4], s.pts[5]] as [number, number],
	);
})();

export const LungsInLayer: React.FC<{
	copd?: number;
	air?: number | null;
	trapped?: number;
	alveoli?: number;
	bg?: boolean;
}> = ({copd = 0, air = null, trapped = 0, alveoli = 1, bg = true}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const k = 1 + 0.07 * copd;
	return (
		<g>
			{bg ? (
				<>
					<path d={TORSO} fill={LPI.paper} />
					<path d={TORSO} fill={LPI.sky} opacity={0.35} />
				</>
			) : null}
			<Heart o={0.35} />
			<Diaphragm o={0.45} flat={copd} />
			<g transform={XMAP}>
				<defs>
					<clipPath id={`in${id}`}>
						<path d={LUNG_R} />
						<path d={LUNG_L} />
					</clipPath>
				</defs>
				<g transform={`translate(300 340) scale(${k}) translate(-300 -340)`}>
					{/* poumons ouverts : intérieur clair */}
					{[LUNG_R, LUNG_L].map((d) => (
						<g key={d}>
							<path d={d} fill={LPI.paper} />
							<path d={d} fill={LPI.pink} opacity={0.24} />
							<path d={d} fill={N} opacity={0.08 * copd} />
						</g>
					))}
					<g clipPath={`url(#in${id})`}>
						{IN_TWIGS.map((s, i) => (
							<Tube key={i} d={segPath(s.pts)} w={Math.max(3, s.w * 1.15)} prog={1} copd={copd} />
						))}
						{alveoli > 0
							? IN_TIPS.map(([x, y], i) =>
									copd > 0.5 && i % 2 ? null : (
										<g key={`a${i}`} opacity={alveoli}>
											{Array.from({length: copd > 0.5 ? 2 : 4}, (_, j) => {
												const n = copd > 0.5 ? 2 : 4;
												const r = copd > 0.5 ? 11 : 7.5;
												const a = (j / n) * Math.PI * 2 + i;
												return (
													<circle
														key={j}
														cx={x + Math.cos(a) * r}
														cy={y + Math.sin(a) * r}
														r={r}
														fill={copd > 0.5 ? alpha(LPI.paper, 0.85) : LPI.pink}
														stroke={N}
														strokeWidth={3}
													/>
												);
											})}
										</g>
									),
								)
							: null}
						{copd > 0
							? PLUGS.map(([x, y], i) => (
									<ellipse
										key={`m${i}`}
										cx={x}
										cy={y}
										rx={11 * copd}
										ry={8 * copd}
										fill={LPI.sky}
										stroke={N}
										strokeWidth={3.5}
									/>
								))
							: null}
						{trapped > 0
							? IN_TIPS.filter((_, i) => i % 3 === 0).map(([x, y], i) => (
									<circle
										key={`t${i}`}
										cx={x + 6 + Math.sin(frame / 6 + i) * 3}
										cy={y - 8 + Math.cos(frame / 7 + i) * 3}
										r={8}
										fill={LPI.paper}
										stroke={LPI.blue}
										strokeWidth={4}
										opacity={Math.min(1, Math.max(0, trapped * 12 - i))}
									/>
								))
							: null}
					</g>
					{/* trachée + bronches principales (par-dessus) */}
					<rect x={280} y={-20} width={40} height={270} rx={18} fill={LPI.paper} stroke={N} strokeWidth={8} />
					{Array.from({length: 12}, (_, i) => (
						<rect
							key={i}
							x={284}
							y={-4 + i * 20}
							width={32}
							height={9}
							rx={4.5}
							fill={LPI.sky}
							stroke={N}
							strokeWidth={3}
						/>
					))}
					{MAIN.map((s, i) => (
						<Tube key={`m${i}`} d={segPath(s.pts)} w={s.w * 1.1} prog={1} copd={copd} />
					))}
					{/* l'air qui descend */}
					{air !== null
						? MAIN.map((s, i) => (
								<path
									key={`ai${i}`}
									d={segPath(s.pts)}
									fill="none"
									stroke={LPI.blue}
									strokeWidth={Math.max(3, s.w * 0.3)}
									strokeLinecap="round"
									strokeDasharray="0.05 0.13"
									pathLength={1}
									strokeDashoffset={-(air * (1 - 0.6 * copd)) / 50}
								/>
							))
						: null}
					{[LUNG_R, LUNG_L].map((d) => (
						<path
							key={`o${d}`}
							d={d}
							fill="none"
							stroke={N}
							strokeWidth={8}
							strokeLinejoin="round"
							strokeDasharray="22 10"
						/>
					))}
				</g>
			</g>
		</g>
	);
};

/* ═══════════════════════════════ 6 · UNE ALVÉOLE ET SON VAISSEAU ═══════════════════════════════ */
/**
 * Une alvéole (grand sac d'air) collée à un vaisseau sanguin (viewBox 400 × 400) : l'O₂ (bleu) passe de l'air au
 * sang et s'accroche aux globules rouges, le CO₂ (bleu nuit) fait le chemin inverse. `phase` : frames ; `emph` : la
 * paroi est cassée, moins d'échanges.
 */
export const AlveolusExchange: React.FC<{size?: number; phase?: number; emph?: number}> = ({
	size = 400,
	phase = 0,
	emph = 0,
}) => {
	const sac = 'M70 210 C60 120 130 60 210 66 C300 72 344 140 330 214 C318 280 260 318 196 312 C124 306 78 268 70 210 Z';
	const vessel = 'M-20 352 C80 300 180 360 260 330 C330 304 380 330 430 312';
	const n = Math.round(6 * (1 - 0.6 * emph));
	return (
		<svg width={size} height={size} viewBox="0 0 400 400" style={{overflow: 'visible', display: 'block'}}>
			{/* bronchiole qui arrive */}
			<path d="M200 -30 L204 72" stroke={N} strokeWidth={44} strokeLinecap="round" />
			<path d="M200 -30 L204 72" stroke={LPI.paper} strokeWidth={34} strokeLinecap="round" />
			<path d="M200 -30 L204 72" stroke={LPI.sky} strokeWidth={12} strokeLinecap="round" />
			{/* l'alvéole */}
			<path d={sac} fill={LPI.paper} stroke={N} strokeWidth={10} />
			<path d={sac} fill={LPI.pink} opacity={0.35 * (1 - 0.5 * emph)} />
			<ellipse cx={150} cy={130} rx={40} ry={22} fill={LPI.paper} opacity={0.7} transform="rotate(-30 150 130)" />
			{emph > 0 ? (
				<path
					d="M250 110 l14 18 l-10 10 l16 16"
					fill="none"
					stroke={N}
					strokeWidth={6}
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity={emph}
				/>
			) : null}
			{/* le vaisseau sanguin */}
			<path d={vessel} fill="none" stroke={N} strokeWidth={62} strokeLinecap="round" />
			<path d={vessel} fill="none" stroke={LPI.pink} strokeWidth={50} strokeLinecap="round" />
			{/* globules rouges qui avancent */}
			{Array.from({length: 7}, (_, i) => {
				const t = (((phase / 90 + i / 7) % 1) + 1) % 1;
				const x = -20 + 450 * t;
				const y = 352 - 40 * Math.sin(Math.PI * t * 1.2) + (x > 260 ? (x - 260) * -0.1 : 0);
				return <ellipse key={i} cx={x} cy={y - 8} rx={16} ry={11} fill={LPI.pink} stroke={N} strokeWidth={4} />;
			})}
			{/* O₂ : de l'air vers le sang ; CO₂ : du sang vers l'air */}
			{Array.from({length: n}, (_, i) => {
				const t = (((phase / 34 + i / n) % 1) + 1) % 1;
				const x0 = 120 + i * 30;
				return (
					<g key={`o${i}`} opacity={Math.sin(Math.PI * t)}>
						<circle cx={x0} cy={170 + 150 * t} r={11} fill={LPI.blue} stroke={LPI.paper} strokeWidth={3} />
					</g>
				);
			})}
			{Array.from({length: n}, (_, i) => {
				const t = (((phase / 34 + i / n + 0.5) % 1) + 1) % 1;
				const x0 = 135 + i * 30;
				return (
					<circle
						key={`c${i}`}
						cx={x0}
						cy={320 - 150 * t}
						r={9}
						fill={N}
						stroke={LPI.paper}
						strokeWidth={3}
						opacity={Math.sin(Math.PI * t) * 0.85}
					/>
				);
			})}
		</svg>
	);
};

/* ═══════════════════════════════ LA PILE DE COUCHES ═══════════════════════════════ */
/** Bord de la couche qu'on enlève (ligne de radio) pour une progression locale q (0 → 1). */
const edgeY = (q: number) => (q <= 0 ? -1e4 : q >= 1 ? 1e4 : 170 + q * 290);

/**
 * Les couches du thorax posées sur le `Patient` (même `size`, même position) : `peel` 0 → 3 enlève une couche par
 * unité (0 : rien, le patient habillé ; 1 : la cage thoracique ; 2 : les poumons ; 3 : l'intérieur).
 */
export const ChestPeel: React.FC<{
	size?: number;
	peel: number;
	copd?: number;
	air?: number | null;
	trapped?: number;
	breath?: number;
}> = ({size = 360, peel, copd = 0, air = null, trapped = 0, breath = 0}) => {
	const frame = useCurrentFrame();
	const id = useId().replace(/:/g, '');
	const layers = [
		<RibsLayer key="r" copd={copd} />,
		<LungsOutLayer key="o" copd={copd} breath={breath} />,
		<LungsInLayer key="i" copd={copd} air={air} trapped={trapped} />,
	];
	return (
		<svg width={size} height={size * 1.4} viewBox="0 0 400 560" style={{overflow: 'visible', display: 'block'}}>
			<defs>
				<clipPath id={`pt${id}`}>
					<path d={TORSO} />
				</clipPath>
				{layers.map((_, k) => (
					<clipPath key={k} id={`pk${id}${k}`}>
						<rect x={0} y={0} width={400} height={Math.max(0, Math.min(560, edgeY(peel - k)))} />
					</clipPath>
				))}
			</defs>
			<g clipPath={`url(#pt${id})`}>
				{layers.map((L, k) =>
					peel - k > 0 ? (
						<g key={k} clipPath={`url(#pk${id}${k})`}>
							{L}
						</g>
					) : null,
				)}
				{/* la ligne de la radio qui enlève la couche */}
				{layers.map((_, k) => {
					const q = peel - k;
					if (q <= 0 || q >= 1) return null;
					const y = edgeY(q);
					return (
						<g key={`e${k}`}>
							<rect x={0} y={y} width={400} height={16} fill={alpha(N, 0.18)} />
							<rect x={0} y={y - 10} width={400} height={10} fill={alpha(LPI.sky, 0.5)} />
							<rect x={0} y={y - 3} width={400} height={5} fill={LPI.sky} />
							<rect x={0} y={y - 1} width={400} height={2} fill={LPI.paper} opacity={0.6 + 0.4 * Math.sin(frame)} />
						</g>
					);
				})}
			</g>
		</svg>
	);
};

/** Une étape seule (planches, gros plans) : 1 patient, 2 côtes, 3 poumons, 4 intérieur ; cadrée sur le thorax. */
export const ChestStep: React.FC<{
	step: 1 | 2 | 3 | 4;
	width?: number;
	copd?: number;
	air?: number | null;
	trapped?: number;
}> = ({step, width = 400, copd = 0, air = null, trapped = 0}) => {
	// le patient : cadré plus large (tête comprise), même proportion que le thorax
	const b = step === 1 ? {x: 40, y: 10, w: 320, h: 400} : CHEST_BOX;
	return (
		<svg width={width} height={(width * b.h) / b.w} viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`} style={{display: 'block'}}>
			{step === 1 ? (
				<foreignObject x={0} y={0} width={400} height={560}>
					<Patient size={400} />
				</foreignObject>
			) : step === 2 ? (
				<RibsLayer copd={copd} />
			) : step === 3 ? (
				<LungsOutLayer copd={copd} />
			) : (
				<LungsInLayer copd={copd} air={air} trapped={trapped} />
			)}
		</svg>
	);
};
