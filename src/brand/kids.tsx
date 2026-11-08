// Constantes de l'enfant : bébé assis de face (`Baby` : respiration avec le ventre, signes de lutte, nez bouché,
// tremblements, hypotonie, bonnet, stéthoscope, capteur au pied, fièvre), plante du pied avec les zones de la piqûre
// au talon (`BabyFoot`), couche et balance (`Diaper`, `KitchenScale`), brassards de trois tailles (`Cuff`), courbes
// « le cœur accélère d'abord, la tension baisse en dernier » (`CompChart`), thermomètre électronique (`ThermoStick`),
// biberon (`Bottle`), courbe de pouls du saturomètre (`Pleth`), moniteur (`KidMonitor`), cartes des 3 âges (`AgeTable`).
// Couleurs de la marque uniquement.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Kid} from './pain';
import {Patient} from './patient';
import {alpha, FONT, LPI, SHADOW} from './theme';
import {clamp} from './ui';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.1 * Math.exp(-(frame - t0) / 5) * Math.cos((frame - t0) * 0.55) - Math.exp(-(frame - t0) / 3.2));

/** Peau (blanc cassé + voile rose), comme le `Patient`. */
const Skin: React.FC<{children: (fill: string, o: number) => React.ReactNode}> = ({children}) => (
	<>
		{children(LPI.paper, 1)}
		{children(LPI.pink, 0.3)}
	</>
);

/* ───────────── le bébé ───────────── */

export type BabyProps = {
	size?: number;
	/** respiration avec le ventre (0 → 1) */
	breath?: number;
	mood?: 'calme' | 'content' | 'pleure' | 'mal';
	/** ailes du nez qui battent */
	flare?: number;
	/** tirage : la peau se creuse sous les côtes */
	retract?: number;
	/** geignement (petites ondes à la bouche) */
	moan?: number;
	/** nez bouché */
	snot?: number;
	/** tremblements */
	shake?: number;
	/** tout mou (hypotonie) */
	limp?: number;
	/** bonnet */
	bonnet?: number;
	/** pavillon du stéthoscope sur la poitrine */
	steth?: number;
	/** capteur de saturation enroulé autour du pied droit (à droite de l'écran) */
	sensor?: number;
	/** joues rouges (fièvre) */
	fever?: number;
};

/** Bébé assis de face (400 × 440) : grosse tête, mèche, grenouillère bleu clair, ventre qui se soulève. */
export const Baby: React.FC<BabyProps> = ({size = 400, breath = 0, mood = 'calme', flare = 0, retract = 0, moan = 0, snot = 0, shake = 0, limp = 0, bonnet = 0, steth = 0, sensor = 0, fever = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const jx = Math.sin(frame * 2.6) * 5 * shake;
	const jy = Math.cos(frame * 3.1) * 2 * shake;
	const blink = frame % 84 < 4 ? 0.15 : 1;
	const eyeOpen = Math.min(blink, 1 - 0.65 * limp);
	const tilt = 14 * limp;
	const armDrop = 16 * limp;
	const belly = 1 + 0.09 * breath;
	const cry = mood === 'pleure';
	const mouth = cry
		? 'M184 200 Q200 226 216 200 Q200 192 184 200 Z'
		: mood === 'content'
			? 'M182 196 Q200 214 218 196'
			: mood === 'mal'
				? 'M186 206 Q200 196 214 206'
				: 'M188 200 Q200 208 212 200';
	const fl = flare * (0.6 + 0.4 * Math.sin(frame / 2.2));
	const sens = sensor > 0 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
	return (
		<svg width={size} height={(size * 440) / 400} viewBox="0 0 400 440" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id={`bb${id}`}>
					<path d="M130 250 C108 272 102 330 110 372 C130 398 270 398 290 372 C298 330 292 272 270 250 C250 238 150 238 130 250 Z" />
				</clipPath>
			</defs>
			<g transform={`translate(${jx} ${jy})`}>
				{/* jambes + pieds (assis, pieds en avant) */}
				{[
					[166, 370, 126, 404],
					[234, 370, 274, 404],
				].map(([x1, y1, x2, y2], i) => (
					<g key={i}>
						<path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={N} strokeWidth={50} strokeLinecap="round" />
						<path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={LPI.sky} strokeWidth={36} strokeLinecap="round" />
						<Skin>{(f, o) => <ellipse cx={i ? 290 : 110} cy={414} rx={30} ry={20} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={6} />}</Skin>
					</g>
				))}
				{/* capteur de saturation enroulé autour du pied droit */}
				{sensor > 0 ? (
					<g opacity={sensor}>
						<path d="M292 434 C330 440 370 430 400 408" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
						<rect x={276} y={396} width={36} height={36} rx={9} fill={LPI.blue} stroke={N} strokeWidth={5} />
						<circle cx={294} cy={414} r={7 + 3 * sens} fill={LPI.pink} />
						<circle cx={294} cy={414} r={16 + 8 * sens} fill={alpha(LPI.pink, 0.25 * sens)} />
					</g>
				) : null}
				{/* grenouillère + ventre */}
				<path d="M130 250 C108 272 102 330 110 372 C130 398 270 398 290 372 C298 330 292 272 270 250 C250 238 150 238 130 250 Z" fill={LPI.sky} {...SK} />
				<g clipPath={`url(#bb${id})`}>
					<ellipse cx={200} cy={328} rx={66 * belly} ry={50 * belly} fill={alpha(LPI.paper, 0.55)} />
					{/* tirage : la peau se creuse sous les côtes, à chaque inspiration */}
					{retract > 0 ? (
						<g opacity={retract} fill="none" stroke={N} strokeWidth={4.5} strokeLinecap="round">
							{[0, 1].map((k) => (
								<path key={k} d={`M${142 + k * 10} ${300 + k * 14} Q200 ${300 + k * 14 - 16 - 14 * breath} ${258 - k * 10} ${300 + k * 14}`} opacity={0.9 - k * 0.25} />
							))}
						</g>
					) : null}
				</g>
				<path d="M200 252 V384" stroke={alpha(N, 0.25)} strokeWidth={4} />
				{retract > 0
					? [-1, 1].map((sd) => (
							<g key={sd} transform={`translate(${200 + sd * (96 - 8 * breath)} 306)`} opacity={retract}>
								<path d={`M${sd * 26} 0 H${sd * 4} M${sd * 12} -9 L${sd * 2} 0 L${sd * 12} 9`} fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
							</g>
						))
					: null}
				{[290, 320, 350].map((y) => (
					<circle key={y} cx={200} cy={y} r={4} fill={alpha(N, 0.35)} />
				))}
				{/* bras (manches longues), qui tombent si le bébé est tout mou */}
				{[
					[138, 268, 92, 344 + armDrop],
					[262, 268, 308, 344 + armDrop],
				].map(([x1, y1, x2, y2], i) => (
					<g key={i}>
						<path d={`M${x1} ${y1} Q${i ? 300 : 100} ${290} ${x2} ${y2}`} fill="none" stroke={N} strokeWidth={40} strokeLinecap="round" />
						<path d={`M${x1} ${y1} Q${i ? 300 : 100} ${290} ${x2} ${y2}`} fill="none" stroke={LPI.sky} strokeWidth={27} strokeLinecap="round" />
						<Skin>{(f, o) => <circle cx={x2} cy={y2 + 12} r={17} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={5} />}</Skin>
					</g>
				))}
				{/* stéthoscope : le pavillon posé sur la poitrine, la tubulure part vers la droite */}
				{steth > 0 ? (
					<g opacity={steth}>
						<path d="M226 296 C270 300 300 250 340 230 C370 216 392 200 404 170" fill="none" stroke={N} strokeWidth={10} strokeLinecap="round" />
						<path d="M226 296 C270 300 300 250 340 230 C370 216 392 200 404 170" fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" />
						<circle cx={214} cy={298} r={21} fill={LPI.paper} stroke={N} strokeWidth={6} />
						<circle cx={214} cy={298} r={10} fill={LPI.sky} stroke={N} strokeWidth={3} />
					</g>
				) : null}
				{/* tête */}
				<g transform={`rotate(${tilt} 200 236) translate(0 ${6 * limp})`}>
					<Skin>
						{(f, o) => (
							<g opacity={o}>
								<ellipse cx={94} cy={150} rx={16} ry={22} fill={f} stroke={o === 1 ? N : 'none'} strokeWidth={6} />
								<ellipse cx={306} cy={150} rx={16} ry={22} fill={f} stroke={o === 1 ? N : 'none'} strokeWidth={6} />
								<circle cx={200} cy={140} r={108} fill={f} stroke={o === 1 ? N : 'none'} strokeWidth={8} />
							</g>
						)}
					</Skin>
					{/* mèche */}
					{bonnet < 0.5 ? <path d="M188 36 C178 18 200 6 214 18 C222 26 214 40 202 36" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" /> : null}
					{/* bonnet */}
					{bonnet > 0 ? (
						<g opacity={Math.min(1, bonnet * 1.4)} transform={`translate(0 ${(1 - bonnet) * -40})`}>
							<path d="M92 128 C92 50 150 26 200 26 C250 26 308 50 308 128 Z" fill={LPI.pink} {...SK} />
							<rect x={86} y={112} width={228} height={30} rx={15} fill={alpha(LPI.paper, 0.9)} stroke={N} strokeWidth={6} />
							{[110, 140, 170, 200, 230, 260, 290].map((x) => (
								<path key={x} d={`M${x} 116 V138`} stroke={alpha(N, 0.25)} strokeWidth={4} />
							))}
							<circle cx={200} cy={22} r={20} fill={alpha(LPI.paper, 0.95)} stroke={N} strokeWidth={6} />
						</g>
					) : null}
					{/* joues */}
					<ellipse cx={140} cy={186} rx={20} ry={12} fill={LPI.pink} opacity={0.55 + 0.4 * fever} />
					<ellipse cx={260} cy={186} rx={20} ry={12} fill={LPI.pink} opacity={0.55 + 0.4 * fever} />
					{/* yeux */}
					{cry ? (
						<g fill="none" stroke={N} strokeWidth={7} strokeLinecap="round">
							<path d="M148 150 L172 158 L148 166" />
							<path d="M252 150 L228 158 L252 166" />
						</g>
					) : (
						<g transform={`translate(0 150) scale(1 ${eyeOpen}) translate(0 -150)`}>
							<circle cx={162} cy={150} r={11} fill={N} />
							<circle cx={238} cy={150} r={11} fill={N} />
							<circle cx={166} cy={146} r={3.5} fill={LPI.paper} />
							<circle cx={242} cy={146} r={3.5} fill={LPI.paper} />
						</g>
					)}
					{mood === 'mal' || limp > 0.3 ? <path d="M146 128 L176 134 M254 128 L224 134" stroke={N} strokeWidth={5} strokeLinecap="round" /> : null}
					{/* nez + ailes du nez qui battent */}
					<path d="M192 176 Q200 184 208 176" fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
					{flare > 0 ? (
						<g fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" opacity={Math.min(1, flare * 1.5)}>
							<path d={`M${186 - 6 * fl} 170 Q${180 - 8 * fl} 178 ${186 - 6 * fl} 186`} />
							<path d={`M${214 + 6 * fl} 170 Q${220 + 8 * fl} 178 ${214 + 6 * fl} 186`} />
						</g>
					) : null}
					{/* nez bouché */}
					{snot > 0 ? (
						<g opacity={snot}>
							<path d="M193 184 q-4 10 0 16 q5 -6 0 -16" fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={2.5} />
							<path d="M207 184 q-4 8 0 12 q4 -4 0 -12" fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={2.5} />
						</g>
					) : null}
					{/* bouche */}
					<path d={mouth} fill={cry ? alpha(N, 0.85) : 'none'} stroke={N} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
					{/* geignement : petites ondes à chaque expiration */}
					{moan > 0
						? [0, 1].map((k) => {
								const t = ((frame / 26 + k / 2) % 1) as number;
								return <path key={k} d={`M${226 + 22 * t} ${196 - 12} q${10} 12 0 24`} fill="none" stroke={LPI.blue} strokeWidth={5} strokeLinecap="round" opacity={moan * (1 - t)} transform={`translate(${t * 14} 0)`} />;
							})
						: null}
					{/* larmes */}
					{cry ? (
						<g fill={alpha(LPI.sky, 0.95)} stroke={N} strokeWidth={2.5}>
							<path d={`M140 ${172 + ((frame * 2) % 24)} q-6 10 0 14 q6 -4 0 -14`} />
							<path d={`M260 ${172 + ((frame * 2 + 12) % 24)} q-6 10 0 14 q6 -4 0 -14`} />
						</g>
					) : null}
				</g>
			</g>
		</svg>
	);
};

/* ───────────── la plante du pied (piqûre au talon) ───────────── */

/** Plante du pied d'un nouveau-né (260 × 420, orteils en haut, talon en bas) : `zones` 0 → 1 = les deux côtés du
 * talon s'allument (là où on pique), le milieu est barré ; `prick` 0 → 1 = la lancette pique sur le côté ; `drop`
 * 0 → 1 = une goutte de sang se forme. */
export const BabyFoot: React.FC<{width?: number; zones?: number; prick?: number; drop?: number}> = ({width = 260, zones = 0, prick = 0, drop = 0}) => {
	const frame = useCurrentFrame();
	const id = React.useId().replace(/:/g, '');
	const SOLE = 'M130 66 C204 66 230 118 226 190 C222 250 210 300 208 340 C206 394 174 416 130 416 C86 416 54 394 52 340 C50 300 38 250 34 190 C30 118 56 66 130 66 Z';
	return (
		<svg width={width} height={(width * 420) / 260} viewBox="0 0 260 420" style={{overflow: 'visible'}}>
			<defs>
				<clipPath id={`f${id}`}>
					<path d={SOLE} />
				</clipPath>
			</defs>
			{/* orteils */}
			{[
				[66, 66, 22],
				[102, 42, 19],
				[136, 34, 18],
				[170, 40, 16],
				[200, 58, 14],
			].map(([x, y, r]) => (
				<Skin key={x}>{(f, o) => <circle cx={x} cy={y} r={r} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={5} />}</Skin>
			))}
			<Skin>{(f, o) => <path d={SOLE} fill={f} opacity={o} stroke={o === 1 ? N : 'none'} strokeWidth={7} strokeLinejoin="round" />}</Skin>
			{/* zones de ponction : les côtés du talon */}
			{zones > 0 ? (
				<g clipPath={`url(#f${id})`} opacity={zones}>
					<rect x={30} y={300} width={46} height={130} fill={alpha(LPI.pink, 0.75)} />
					<rect x={184} y={300} width={46} height={130} fill={alpha(LPI.pink, 0.75)} />
					<path d="M106 326 L154 380 M154 326 L106 380" stroke={N} strokeWidth={8} strokeLinecap="round" opacity={0.85} />
				</g>
			) : null}
			{/* lancette (côté du talon) */}
			{prick > 0 ? (
				<g transform={`translate(${262 - 26 * Math.min(1, prick * 1.4)} ${350})`} opacity={Math.min(1, prick * 3)}>
					<rect x={0} y={-16} width={70} height={32} rx={10} fill={LPI.blue} stroke={N} strokeWidth={5} />
					<path d="M0 0 H-16" stroke={N} strokeWidth={4} strokeLinecap="round" />
				</g>
			) : null}
			{drop > 0 ? (
				<g transform={`translate(206 ${346 + 3 * Math.sin(frame / 6)}) scale(${drop})`}>
					<path d="M0 -18 C10 -4 14 4 14 10 A14 14 0 0 1 -14 10 C-14 4 -10 -4 0 -18 Z" fill={LPI.pink} stroke={N} strokeWidth={4} />
				</g>
			) : null}
		</svg>
	);
};

/* ───────────── la couche et la balance ───────────── */

/** Couche de face (240 × 180) : `wet` 0 → 1 = la tache d'urine (bleu clair) s'étend. */
export const Diaper: React.FC<{width?: number; wet?: number}> = ({width = 240, wet = 0}) => (
	<svg width={width} height={(width * 180) / 240} viewBox="0 0 240 180" style={{overflow: 'visible'}}>
		<path d="M14 20 H226 C224 70 196 110 160 126 C150 150 140 168 120 168 C100 168 90 150 80 126 C44 110 16 70 14 20 Z" fill={LPI.paper} {...SK} />
		{wet > 0 ? <ellipse cx={120} cy={110} rx={62 * wet} ry={40 * wet} fill={alpha(LPI.sky, 0.95)} /> : null}
		<path d="M14 20 H226 C224 70 196 110 160 126 C150 150 140 168 120 168 C100 168 90 150 80 126 C44 110 16 70 14 20 Z" fill="none" {...SK} />
		<rect x={6} y={16} width={36} height={26} rx={8} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<rect x={198} y={16} width={36} height={26} rx={8} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<path d="M60 40 Q120 52 180 40" fill="none" stroke={alpha(N, 0.3)} strokeWidth={4} />
	</svg>
);

/** Balance de cuisine (360 × 200) avec écran (grammes) ; `children` = ce qui est posé sur le plateau. */
export const KitchenScale: React.FC<{width?: number; grams: number; children?: React.ReactNode; tone?: string}> = ({width = 360, grams, children, tone = N}) => {
	const k = width / 360;
	return (
		<div style={{position: 'relative', width, height: 230 * k}}>
			<svg width={width} height={230 * k} viewBox="0 0 360 230" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<rect x={30} y={70} width={300} height={22} rx={11} fill={LPI.sky} {...SK} />
				<path d="M60 92 L40 210 H320 L300 92 Z" fill={LPI.paper} {...SK} />
				<rect x={110} y={130} width={140} height={56} rx={12} fill={N} />
			</svg>
			<div style={{position: 'absolute', left: 110 * k, top: 130 * k, width: 140 * k, height: 56 * k, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40 * k, color: tone === N ? LPI.sky : tone}}>
				{Math.round(grams)} g
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: (230 - 74) * k, display: 'flex', justifyContent: 'center'}}>{children}</div>
		</div>
	);
};

/* ───────────── les brassards ───────────── */

/** Brassard à tension (largeur variable) : poche bleu clair, tuyau, étiquette. */
export const Cuff: React.FC<{width: number; label?: string; tone?: string}> = ({width, label, tone = LPI.sky}) => {
	const h = width * 0.42;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
			<svg width={width} height={h + 40} viewBox={`0 0 ${width} ${h + 40}`} style={{overflow: 'visible'}}>
				<path d={`M${width * 0.6} 8 C${width * 0.6} -20 ${width * 0.9} -20 ${width * 0.95} -36`} fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
				<rect x={4} y={8} width={width - 8} height={h} rx={h * 0.28} fill={tone} stroke={N} strokeWidth={6} />
				<rect x={width * 0.42} y={8 + h * 0.25} width={width * 0.18} height={h * 0.5} rx={6} fill={LPI.blue} />
			</svg>
			{label ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, marginTop: -24}}>{label}</div> : null}
		</div>
	);
};

/* ───────────── le cœur compense, la tension tombe en dernier ───────────── */

/** Courbes dans le temps (600 × 320) : FC (rose) qui monte dès le début, PA (bleu) qui tient puis chute à la fin.
 * `t` 0 → 1 = le temps avance (les courbes se tracent) ; `fall` 0 → 1 = la chute de la tension se dessine. */
export const CompChart: React.FC<{width?: number; t: number; fall: number}> = ({width = 600, t, fall}) => {
	const W = 520;
	const fc = (x: number) => 200 - 120 * Math.min(1, x / 0.75);
	const pa = (x: number) => (x < 0.7 ? 110 : 110 + 140 * Math.min(1, (x - 0.7) / 0.3) ** 1.6);
	const pts = (f: (x: number) => number, until: number) =>
		Array.from({length: 41}, (_, i) => i / 40)
			.filter((x) => x <= until)
			.map((x) => `${60 + x * W},${f(x)}`)
			.join(' ');
	const paUntil = Math.min(t, 0.7 + 0.3 * fall);
	return (
		<svg width={width} height={(width * 320) / 600} viewBox="0 0 600 320" style={{overflow: 'visible'}}>
			<path d="M60 20 V280 H590" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M580 272 L594 280 L580 288" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
			<text x={590} y={312} textAnchor="end" fontFamily={FONT.body} fontWeight={900} fontSize={24} fill={alpha(N, 0.7)}>
				le temps
			</text>
			<polyline points={pts(fc, t)} fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
			<polyline points={pts(pa, paUntil)} fill="none" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
			{t > 0.3 ? (
				<text x={330} y={64} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={N}>
					FC ↑ d'abord
				</text>
			) : null}
			{t > 0.5 ? (
				<text x={80} y={92} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={LPI.blue}>
					la PA tient…
				</text>
			) : null}
			{fall > 0.6 ? (
				<text x={200} y={250} fontFamily={FONT.title} fontWeight={900} fontSize={30} fill={LPI.blue}>
					PA ↓ en dernier
				</text>
			) : null}
		</svg>
	);
};

/* ───────────── objets ───────────── */

/** Thermomètre électronique flexible (320 × 90) : écran (valeur), embout souple. */
export const ThermoStick: React.FC<{width?: number; value?: string}> = ({width = 320, value = '38,0'}) => (
	<svg width={width} height={(width * 90) / 320} viewBox="0 0 320 90" style={{overflow: 'visible'}}>
		<path d="M14 45 H86" stroke={N} strokeWidth={20} strokeLinecap="round" />
		<path d="M14 45 H86" stroke={LPI.paper} strokeWidth={10} strokeLinecap="round" />
		<rect x={80} y={14} width={226} height={62} rx={26} fill={LPI.sky} {...SK} />
		<rect x={128} y={26} width={120} height={38} rx={10} fill={N} />
		<text x={188} y={56} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={LPI.sky}>
			{value}
		</text>
		<circle cx={276} cy={45} r={10} fill={LPI.pink} stroke={N} strokeWidth={4} />
	</svg>
);

/** Biberon (90 × 200). */
export const Bottle: React.FC<{width?: number; level?: number}> = ({width = 90, level = 0.7}) => (
	<svg width={width} height={(width * 200) / 90} viewBox="0 0 90 200" style={{overflow: 'visible'}}>
		<path d="M45 6 C36 6 34 18 34 30 H56 C56 18 54 6 45 6 Z" fill={LPI.pink} stroke={N} strokeWidth={5} />
		<rect x={24} y={30} width={42} height={18} rx={6} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<rect x={14} y={48} width={62} height={144} rx={18} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<rect x={18} y={52 + 136 * (1 - level)} width={54} height={136 * level} rx={14} fill={alpha(LPI.paper, 1)} stroke="none" />
		<rect x={18} y={52 + 136 * (1 - level)} width={54} height={136 * level} rx={14} fill={alpha(LPI.sky, 0.55)} />
		{[80, 110, 140].map((y) => (
			<path key={y} d={`M60 ${y} H70`} stroke={N} strokeWidth={4} />
		))}
	</svg>
);

/** Courbe de pouls du saturomètre (largeur × 120) : régulière, ou brouillée (`noise` 0 → 1 : il bouge, il pleure). */
export const Pleth: React.FC<{width?: number; noise?: number; color?: string}> = ({width = 420, noise = 0, color = LPI.blue}) => {
	const frame = useCurrentFrame();
	const H = 120;
	const pts = Array.from({length: 85}, (_, i) => {
		const x = (i / 84) * width;
		const ph = ((i * 5 + frame * 4) % 60) / 60;
		const clean = ph < 0.25 ? Math.sin((ph / 0.25) * Math.PI * 0.5) : ph < 0.4 ? 1 - ((ph - 0.25) / 0.15) * 0.45 + 0.12 * Math.sin(((ph - 0.25) / 0.15) * Math.PI) : 0.55 * (1 - (ph - 0.4) / 0.6);
		const n = noise * (Math.sin(i * 1.7 + frame * 0.9) * 0.45 + Math.sin(i * 0.53 - frame * 0.4) * 0.35);
		return `${x},${H - 14 - (clean * (1 - 0.6 * noise) + n + 0.2) * (H - 40)}`;
	}).join(' ');
	return (
		<svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} style={{overflow: 'visible'}}>
			<polyline points={pts} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

/* ───────────── le moniteur de l'accroche ───────────── */

/** Moniteur (420 × 300) : FR et FC du bébé, chiffres roses qui clignotent (`alarm`) puis bleus (`ok`). */
export const KidMonitor: React.FC<{fr: number; fc: number; showFc?: number; alarm?: number; ok?: number; width?: number}> = ({fr, fc, showFc = 1, alarm = 0, ok = 0, width = 420}) => {
	const frame = useCurrentFrame();
	const k = width / 420;
	const blink = alarm > 0 && ok < 0.5 ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.55) : 1;
	const tone = ok > 0.5 ? LPI.sky : alarm > 0 ? LPI.pink : LPI.paper;
	const Row: React.FC<{label: string; value: number; unit: string; show: number}> = ({label, value, unit, show}) => (
		<div style={{display: 'flex', alignItems: 'baseline', gap: 12 * k, opacity: show}}>
			<div style={{width: 74 * k, fontFamily: FONT.body, fontWeight: 900, fontSize: 30 * k, color: alpha(LPI.paper, 0.7)}}>{label}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 92 * k, color: tone, opacity: blink, lineHeight: 1}}>{value}</div>
			<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 26 * k, color: alpha(LPI.paper, 0.7)}}>{unit}</div>
		</div>
	);
	return (
		<div style={{width, borderRadius: 34 * k, background: N, border: `7px solid ${N}`, boxShadow: `${SHADOW}${alarm > 0 && ok < 0.5 ? `, 0 0 ${30 * blink}px ${alpha(LPI.pink, 0.9)}` : ''}`, padding: `${18 * k}px ${26 * k}px`, boxSizing: 'border-box'}}>
			<Row label="FR" value={fr} unit="/min" show={1} />
			<div style={{height: 2, background: alpha(LPI.paper, 0.15), margin: `${10 * k}px 0`}} />
			<Row label="FC" value={fc} unit="/min" show={showFc} />
		</div>
	);
};

/* ───────────── les 3 âges ───────────── */

export const AGES = [
	{key: 'bebe', label: 'BÉBÉ', range: '0 – 2 ans', tone: LPI.pink},
	{key: 'enfant', label: 'ENFANT', range: '2 – 11 ans', tone: LPI.sky},
	{key: 'ado', label: 'ADO', range: '12 – 17 ans', tone: LPI.blue},
] as const;

/** Le portrait de chaque âge : bébé, enfant (`Kid`), ado (`Patient`). */
export const AgePortrait: React.FC<{age: 0 | 1 | 2; size: number}> = ({age, size}) => {
	const frame = useCurrentFrame();
	const breath = 0.5 - 0.5 * Math.cos((frame / 60) * Math.PI * 2);
	if (age === 0) return <Baby size={size} breath={breath} mood="content" />;
	if (age === 1)
		return (
			<div style={{width: size, display: 'flex', justifyContent: 'center'}}>
				<Kid size={size * 0.86} />
			</div>
		);
	return (
		<div style={{width: size, display: 'flex', justifyContent: 'center'}}>
			<Patient size={size * 0.82} breath={breath} />
		</div>
	);
};

/** Trois cartes côte à côte (bébé · enfant · ado) : le portrait en haut, l'âge, puis la valeur qui claque au mot
 * (`values[i]`, `at[i]`) ; `unit` sous la rangée ; `same` = une seule valeur pour les trois (elle s'étend sur toute la
 * largeur : « ça ne change pas »). */
export const AgeTable: React.FC<{y?: number; at: number[]; values: string[]; unit?: string; unitAt?: number; same?: {text: string; at: number}; portrait?: number; dim?: number[]; h?: number; noRange?: boolean; valueSize?: number}> = ({y = 420, at, values, unit, unitAt = 1e9, same, portrait = 120, dim = [0, 0, 0], h = 290, noRange = false, valueSize}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936}}>
			<div style={{display: 'flex', gap: 24}}>
				{AGES.map((a, i) => {
					const t0 = at[i] ?? 0;
					const on = frame >= t0;
					return (
						<div key={a.key} style={{width: 296, height: h, boxSizing: 'border-box', borderRadius: 36, background: LPI.paper, border: `6px solid ${on ? N : alpha(N, 0.2)}`, boxShadow: SHADOW, overflow: 'hidden', position: 'relative', opacity: 1 - 0.55 * (dim[i] ?? 0)}}>
							<div style={{height: 56, background: a.tone, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: a.tone === LPI.blue ? LPI.paper : N}}>
								{a.label}
								{noRange ? null : <span style={{fontFamily: FONT.body, fontSize: 22, opacity: 0.85}}>{a.range}</span>}
							</div>
							<div style={{position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center', height: portrait, overflow: 'hidden'}}>
								<div style={{transform: `scale(${portrait / 300})`, transformOrigin: '50% 0'}}>
									<AgePortrait age={i as 0 | 1 | 2} size={300} />
								</div>
							</div>
							{!same && on ? (
								<div style={{position: 'absolute', left: 0, right: 0, bottom: 18, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: valueSize ?? (values[i].length > 9 ? 44 : 54), color: N, lineHeight: 1.05, whiteSpace: 'pre-line', transform: `scale(${popAt(frame, t0)})`}}>{values[i]}</div>
							) : null}
						</div>
					);
				})}
			</div>
			{same && frame >= same.at ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: h - 90, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, same.at)})`}}>
					<div style={{padding: '10px 40px', borderRadius: 999, background: N, color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 58, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>{same.text}</div>
				</div>
			) : null}
			{unit && frame >= unitAt ? (
				<div style={{marginTop: 12, textAlign: 'center', fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: alpha(N, 0.7), opacity: interpolate(frame, [unitAt, unitAt + 8], [0, 1], clamp)}}>{unit}</div>
			) : null}
		</div>
	);
};
