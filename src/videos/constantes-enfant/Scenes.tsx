// « Les constantes de l'enfant » (0 – 2 · 2 – 11 · 12 – 17 ans) : un condensé des 7 constantes qui ne garde que ce qui
// CHANGE chez l'enfant (demandé : ne pas répéter ce qu'on a déjà dit dans les vidéos adultes). Accroche « le piège »
// (choisie par le propriétaire) : « Ce bébé respire quarante-cinq fois par minute… et son cœur bat à cent quarante. Tu
// appelles le médecin ? » (moniteur rose qui clignote, deux boutons, chrono 3 · 2 · 1 pendant un vrai silence) →
// « Pas besoin ! » (tout repasse au bleu, tampon NORMAL) → pas un adulte en miniature → frise 0 → 17 ans.
// Puis les 3 âges + la règle d'or, et une scène par constante : les valeurs par âge dans 3 cartes (`AgeTable`), puis
// ce qui change (geste, matériel, signe d'alerte). Valeurs validées par le propriétaire (PALS 2015, référentiel des
// pédiatres universitaires) : FC 100–160 / 70–120 / 60–100 ; FR 30–50 / 18–30 / 12–20 ; PAS 70–100 / 90–120 / 110–130 ;
// diurèse ≈ 2 / 1 / 0,5–1 mL/kg/h ; T° et SpO₂ : mêmes seuils que l'adulte. Briques : src/brand/kids.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CauseChip, Head, Pill, RecapScene, Stopwatch} from '../../brand/episode';
import {AgeTable, Baby, BabyFoot, Bottle, CompChart, Cuff, Diaper, KidMonitor, KitchenScale, Pleth, ThermoStick} from '../../brand/kids';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 10) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.1 * Math.exp(-(frame - t0) / 5) * Math.cos((frame - t0) * 0.55) - Math.exp(-(frame - t0) / 3.2));
/** respiration (0 → 1) à `perMin` cycles par minute */
const breathAt = (frame: number, perMin: number) => 0.5 - 0.5 * Math.cos((frame / ((30 * 60) / perMin)) * Math.PI * 2);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; max?: number; color?: string}> = ({at: t0, max = 0.4, color = LPI.pink}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 18], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 4}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 8) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: interpolate(frame, [to, to + 8], [1, 0], clamp)}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Pastille qui « pop » à `from` et s'efface à `to` (posée en x, y). */
const PillAt: React.FC<{from: number; to?: number; x: number; y: number; color?: string; size?: number; children: React.ReactNode}> = ({from, to = 1e9, x, y, color = LPI.pink, size = 38, children}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 8) return null;
	const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, opacity: out, transform: `scale(${0.8 + 0.2 * out})`, transformOrigin: 'left center', whiteSpace: 'nowrap'}}>
			<Pill at={from} size={size} color={color}>
				{children}
			</Pill>
		</div>
	);
};

/** Élément qui « pop » à `from` et s'efface à `to`. */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'center'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 8) return null;
	const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.75 + 0.25 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

/** Croix rose (« pas comme ça »). */
const Cross: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={44} fill={LPI.pink} stroke={N} strokeWidth={7} />
		<path d="M32 32 L68 68 M68 32 L32 68" stroke={N} strokeWidth={11} strokeLinecap="round" />
	</svg>
);
/** Coche bleue. */
const Tick: React.FC<{size?: number}> = ({size = 70}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<circle cx={50} cy={50} r={44} fill={LPI.sky} stroke={N} strokeWidth={7} />
		<path d="M28 52 L44 68 L74 34" fill="none" stroke={N} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
/** Petit cœur qui bat (période en images). */
const HeartBeat: React.FC<{size?: number; period: number}> = ({size = 120, period}) => {
	const frame = useCurrentFrame();
	const b = Math.exp(-(frame % Math.max(4, Math.round(period))) / 4);
	return (
		<svg width={size} height={size} viewBox="-60 -60 120 120" style={{overflow: 'visible'}}>
			<circle r={42 + 14 * b} fill={alpha(LPI.pink, 0.3 * (1 - b))} />
			<path d="M0 30 C-48 -6 -34 -54 0 -28 C34 -54 48 -6 0 30 Z" fill={LPI.pink} stroke={N} strokeWidth={7} strokeLinejoin="round" transform={`scale(${1 + 0.14 * b})`} />
		</svg>
	);
};

/** Bulle « O₂ » qui se vide (manque d'oxygène). */
const O2Bubble: React.FC<{size?: number; fill: number}> = ({size = 120, fill}) => (
	<svg width={size} height={size} viewBox="0 0 120 120">
		<circle cx={60} cy={60} r={52} fill={LPI.paper} stroke={N} strokeWidth={7} />
		<clipPath id="o2c">
			<circle cx={60} cy={60} r={48} />
		</clipPath>
		<rect x={0} y={112 - 104 * fill} width={120} height={104 * fill} fill={LPI.sky} clipPath="url(#o2c)" />
		<text x={60} y={74} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={40} fill={N}>
			O₂
		</text>
	</svg>
);

/* ═══════════════════════════════ ACCROCHE « LE PIÈGE » ═══════════════════════════════ */
// Image 0 : « Tu appelles le médecin ? », le bébé respire vite, le moniteur clignote en rose (FR 45 · FC 140). Deux
// boutons, chrono 3 · 2 · 1 pendant le silence ; « Pas besoin ! » : le bouton « c'est normal » s'allume, le moniteur
// repasse au bleu, tampon NORMAL ; « pas un adulte en miniature » : un adulte rapetissé, barré ; frise 0 → 17 ans ;
// « qu'est-ce qui change vraiment ? ».
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const QC = at('intro', 'quarante-cinq');
	const CENT = at('intro', 'cent');
	const APPEL = at('intro', 'appelles');
	const MED = at('intro', 'médecin');
	const PAS = at('intro', 'pas');
	const ENFANT = at('intro', 'enfant');
	const ADULTE = at('intro', 'adulte');
	const MINI = at('intro', 'miniature');
	const ALORS = at('intro', 'alors');
	const NAISS = at('intro', 'naissance');
	const DIXS = at('intro', 'dix-sept');
	const CHANGE = at('intro', 'change');
	const c0 = MED + 14;
	const c1 = PAS - 4;
	const chrono = frame >= c0 && frame < PAS + 6 ? Math.max(1, 3 - Math.floor(((frame - c0) / (c1 - c0)) * 3)) : 0;
	const ok = fadeIn(frame, PAS, 6);
	const scene1 = 1 - fadeIn(frame, ALORS - 8, 10);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[QC + 1, CENT + 1, PAS + 1, MINI + 1, CHANGE + 1]} shakes={[PAS + 2]} strength={0.03}>
				{scene1 > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: scene1}}>
						{/* le bébé (respire à 45 / min) */}
						<div style={{position: 'absolute', left: 40, top: 520, transform: `translateX(${interpolate(frame, [ENFANT - 6, ENFANT + 10], [0, -20], ease)}px)`}}>
							<Baby size={470} breath={breathAt(frame, 45)} mood={frame >= PAS ? 'content' : 'calme'} />
						</div>
						{/* le moniteur, rose qui clignote, puis bleu */}
						<div style={{position: 'absolute', left: 590, top: 560, opacity: 1 - fadeIn(frame, ENFANT - 6, 8), transform: `scale(${1 + 0.06 * Math.exp(-Math.max(0, frame - QC) / 5) * (frame >= QC ? 1 : 0) + 0.06 * Math.exp(-Math.max(0, frame - CENT) / 5) * (frame >= CENT ? 1 : 0)})`, transformOrigin: 'center'}}>
							<KidMonitor fr={45} fc={140} alarm={1} ok={ok} width={420} />
						</div>
						<Stamp at={PAS + 4} x={800} y={760} text="NORMAL ✓" size={62} rot={-8} color={LPI.blue} out={ENFANT - 8} />
						{/* les deux réponses */}
						{frame >= APPEL - 2 && frame < ENFANT ? (
							<div style={{position: 'absolute', left: 72, top: 1110, width: 936, display: 'flex', gap: 24, opacity: 1 - fadeIn(frame, ENFANT - 8, 8)}}>
								{[
									{label: "J'appelle !", good: false},
									{label: "C'est normal", good: true},
								].map((b, i) => {
									const t0 = APPEL - 2 + i * 5;
									const lit = frame >= PAS ? (b.good ? 1 : -1) : 0;
									return (
										<div key={b.label} style={{flex: 1, height: 120, borderRadius: 40, background: lit === 1 ? LPI.blue : lit === -1 ? alpha(LPI.pink, 0.55) : LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: lit === 1 ? LPI.paper : N, transform: `scale(${popAt(frame, t0) * (lit === 1 ? 1 + 0.06 * Math.exp(-(frame - PAS) / 6) : 1)})`, opacity: lit === -1 ? 0.75 : 1}}>
											{b.label}
											{lit === 1 ? <Tick size={64} /> : lit === -1 ? <Cross size={64} /> : null}
										</div>
									);
								})}
							</div>
						) : null}
						{/* chrono 3 · 2 · 1 pendant le silence */}
						{chrono > 0 && frame < PAS ? (
							<div style={{position: 'absolute', left: 470, top: 960, width: 140, height: 140, borderRadius: 70, background: N, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: LPI.paper, transform: `scale(${1 + 0.15 * Math.exp(-(((frame - c0) % ((c1 - c0) / 3)) as number) / 4)})`}}>
								{chrono}
							</div>
						) : null}
						{/* pas un adulte en miniature */}
						{frame >= ADULTE - 6 ? (
							<div style={{position: 'absolute', left: 640, top: 600, transform: `scale(${popAt(frame, ADULTE - 6)})`, transformOrigin: '50% 100%'}}>
								<div style={{position: 'relative', width: 300, height: 420}}>
									<div style={{position: 'absolute', left: 50, top: 60}}>
										<Patient size={200} />
									</div>
									<div style={{position: 'absolute', left: 0, top: 340, width: 300, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>un adulte « en petit » ?</div>
									{frame >= MINI ? (
										<svg width={300} height={340} viewBox="0 0 300 340" style={{position: 'absolute', left: 0, top: 0}}>
											<circle cx={150} cy={190} r={130} fill="none" stroke={LPI.pink} strokeWidth={18} opacity={fadeIn(frame, MINI, 6)} />
											<path d="M60 280 L240 100" stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" strokeDasharray={260} strokeDashoffset={260 * (1 - fadeIn(frame, MINI + 2, 8))} />
										</svg>
									) : null}
								</div>
							</div>
						) : null}
						{frame >= ADULTE - 6 ? (
							<div style={{position: 'absolute', left: 500, top: 760, fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: LPI.pink, WebkitTextStroke: `5px ${N}`, transform: `scale(${popAt(frame, ADULTE - 2)})`}}>≠</div>
						) : null}
					</div>
				) : null}
				{/* frise 0 → 17 ans */}
				{frame >= ALORS - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 760, width: 936, opacity: fadeIn(frame, ALORS - 4, 8)}}>
						<div style={{position: 'relative', height: 200}}>
							{[
								{from: 0, to: 2, tone: LPI.pink, label: 'bébé', t: NAISS - 2},
								{from: 2, to: 11, tone: LPI.sky, label: 'enfant', t: NAISS + 6},
								{from: 12, to: 17, tone: LPI.blue, label: 'ado', t: DIXS - 2},
							].map((seg) => {
								const x0 = (seg.from / 17) * 936;
								const w = ((seg.to - seg.from) / 17) * 936;
								return (
									<div key={seg.label} style={{position: 'absolute', left: x0, top: 40, width: Math.max(w, 120), opacity: fadeIn(frame, seg.t, 6), transform: `scaleX(${interpolate(frame, [seg.t, seg.t + 10], [0.2, 1], ease)})`, transformOrigin: 'left center'}}>
										<div style={{height: 70, borderRadius: 35, background: seg.tone, border: `6px solid ${N}`}} />
										<div style={{marginTop: 10, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, textAlign: 'center'}}>{seg.label}</div>
									</div>
								);
							})}
							<div style={{position: 'absolute', left: 0, top: -12, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: alpha(N, 0.7)}}>naissance</div>
							<div style={{position: 'absolute', right: 0, top: -12, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: alpha(N, 0.7), opacity: fadeIn(frame, DIXS - 2, 6)}}>17 ans</div>
						</div>
					</div>
				) : null}
				{/* les 7 constantes au programme */}
				<div style={{position: 'absolute', left: 72, top: 1060, width: 936, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center'}}>
					{['FC', 'FR', 'TA', 'T°', 'Glycémie', 'SpO₂', 'Diurèse'].map((c, i) => {
						const t0 = CHANGE - 6 + i * 3;
						return frame >= t0 ? (
							<div key={c} style={{padding: '12px 26px', borderRadius: 999, background: [LPI.pink, LPI.sky, LPI.paper][i % 3], border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, transform: `scale(${popAt(frame, t0)})`}}>
								{c}
							</div>
						) : null;
					})}
				</div>
				{/* titres */}
				<TitleAt from={-60} to={PAS - 6} text={'Tu appelles\nle *médecin* ?'} size={104} stagger={0} />
				<TitleAt from={PAS - 2} to={ENFANT - 8} text={'*Pas* besoin !'} size={110} />
				<TitleAt from={ENFANT - 4} to={ALORS - 8} text={"Pas un adulte\nen *miniature*"} size={100} />
				<TitleAt from={ALORS - 2} text={"Qu'est-ce qui\n*change* vraiment ?"} size={100} />
				<Burst at={CHANGE} x={540} y={900} r={340} n={16} />
			</Camera>
			<Flash at={PAS} max={0.3} color={LPI.sky} />
			<Sfx name="heartbeat" at={0} volume={0.07} />
			<Sfx name="buzz" at={QC} volume={0.04} dur={10} />
			<Sfx name="buzz" at={CENT} volume={0.04} dur={10} />
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={APPEL - 2 + i * 5} volume={0.08} />
			))}
			{[0, 1, 2].map((i) => (
				<Sfx key={`t${i}`} name="tick" at={c0 + Math.round(((c1 - c0) / 3) * i)} volume={0.1} />
			))}
			<Sfx name="ding" at={PAS} volume={0.1} />
			<Sfx name="stamp" at={PAS + 4} volume={0.1} />
			<Sfx name="pop" at={ADULTE - 6} volume={0.08} />
			<Sfx name="buzz" at={MINI} volume={0.05} dur={12} />
			<Sfx name="whoosh" at={ALORS - 4} volume={0.06} />
			<Sfx name="impact" at={CHANGE} volume={0.1} />
			{[0, 3, 6].map((i) => (
				<Sfx key={`c${i}`} name="pop" at={CHANGE - 6 + i * 3} volume={0.06} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 3 ÂGES + LA RÈGLE D'OR ═══════════════════════════════ */
const GoldRow: React.FC<{at: number; icon: React.ReactNode; text: React.ReactNode; arrow: 'up' | 'down'}> = ({at: t0, icon, text, arrow}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const bob = Math.sin(frame / 6) * 5;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${popAt(frame, t0)})`, transformOrigin: 'left center'}}>
			<div style={{width: 84, height: 84, borderRadius: 42, background: LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, flex: 1}}>{text}</div>
			<svg width={64} height={74} viewBox="0 0 64 74" style={{transform: `translateY(${arrow === 'up' ? -bob : bob}px) rotate(${arrow === 'up' ? 0 : 180}deg)`}}>
				<path d="M32 6 L58 36 H42 V68 H22 V36 H6 Z" fill={arrow === 'up' ? LPI.pink : LPI.blue} stroke={N} strokeWidth={5} strokeLinejoin="round" />
			</svg>
		</div>
	);
};

const LungIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<path d="M50 10 V44 M50 44 L36 56 M50 44 L64 56" stroke={N} strokeWidth={8} strokeLinecap="round" fill="none" />
		<path d="M40 30 C22 30 12 56 12 76 C12 90 26 92 36 86 C42 82 44 74 44 64 Z M60 30 C78 30 88 56 88 76 C88 90 74 92 64 86 C58 82 56 74 56 64 Z" fill={LPI.sky} stroke={N} strokeWidth={6} strokeLinejoin="round" />
	</svg>
);
const CuffIco: React.FC = () => (
	<svg width={60} height={60} viewBox="0 0 100 100">
		<rect x={14} y={30} width={60} height={40} rx={10} fill={LPI.sky} stroke={N} strokeWidth={7} />
		<path d="M74 50 C88 50 90 30 86 20" fill="none" stroke={N} strokeWidth={6} strokeLinecap="round" />
		<rect x={36} y={40} width={16} height={20} rx={3} fill={LPI.blue} />
	</svg>
);

export const Ages: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('ages', 'trois');
	const BEBE = at('ages', 'bébé');
	const ENF = at('ages', "l'enfant");
	const ADO = at('ages', "l'ado");
	const REGLE = at('ages', 'règle');
	const PETIT = at('ages', 'petit');
	const COEUR = at('ages', 'cœur');
	const RESP = at('ages', 'respiration');
	const TENS = at('ages', 'tension');
	const BASSE = at('ages', 'basse');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[BEBE + 1, ENF + 1, ADO + 1, REGLE + 1, BASSE + 1]} strength={0.025}>
				<Head kicker="3 âges à retenir" kAt={2} title="Bébé · enfant · *ado*" tAt={TROIS - 4} size={96} />
				<AgeTable y={420} h={400} portrait={220} noRange at={[BEBE - 3, ENF - 3, ADO - 3]} values={['0 – 2 ans', '2 – 11 ans', '12 – 17 ans']} valueSize={48} />
				{/* la règle d'or */}
				{frame >= REGLE - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 860, width: 936, boxSizing: 'border-box', borderRadius: 44, background: LPI.paper, border: `7px solid ${LPI.blue}`, boxShadow: SHADOW, padding: '24px 34px', transform: `scale(${popAt(frame, REGLE - 4)})`}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.14em', color: LPI.blue}}>LA RÈGLE D'OR</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N, marginTop: 4, opacity: fadeIn(frame, PETIT - 6, 8)}}>
							Plus il est <span style={{color: LPI.pink}}>petit</span>…
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 18}}>
							<GoldRow at={COEUR - 3} icon={<HeartBeat size={56} period={10} />} text="son cœur bat plus vite" arrow="up" />
							<GoldRow at={RESP - 3} icon={<LungIco />} text="il respire plus vite" arrow="up" />
							<GoldRow at={TENS - 3} icon={<CuffIco />} text="sa tension est plus basse" arrow="down" />
						</div>
					</div>
				) : null}
			</Camera>
			{[BEBE, ENF, ADO].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="whoosh" at={REGLE - 4} volume={0.06} />
			{[COEUR, RESP, TENS].map((t) => (
				<Sfx key={`g${t}`} name="tick" at={t - 3} volume={0.08} />
			))}
			<Sfx name="ding" at={BASSE} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE CŒUR ═══════════════════════════════ */
// Les 3 valeurs ; « pas au poignet » (croix) ; le stéthoscope sur la poitrine du bébé + chrono « 1 minute entière » ;
// « un cœur qui ralentit, c'est grave » : le cœur ralentit, la bulle d'O₂ se vide.
export const Fc: React.FC = () => {
	const frame = useCurrentFrame();
	const CENT = at('fc', 'cent');
	const S70 = at('fc', 'soixante-dix');
	const S60 = at('fc', 'soixante', 2);
	const BEBE2 = at('fc', 'bébé', 2);
	const POULS = at('fc', 'pouls');
	const POIG = at('fc', 'poignet');
	const ECOUTE = at('fc', 'écoute');
	const STETH = at('fc', 'stéthoscope');
	const MIN = at('fc', 'minute', 2);
	const ATT = at('fc', 'attention');
	const RAL = at('fc', 'ralentit');
	const GRAVE = at('fc', 'grave');
	const MANQ = at('fc', 'manque');
	const slow = interpolate(frame, [RAL - 4, GRAVE + 20], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[CENT + 1, S70 + 1, S60 + 1, POIG + 1, STETH + 1, GRAVE + 1]} strength={0.025}>
				<Head kicker="1 · La fréquence cardiaque" kAt={2} title="Le *cœur*" tAt={8} size={96} />
				<AgeTable at={[CENT - 3, S70 - 3, S60 - 3]} values={['100 – 160', '70 – 120', '60 – 100']} unit="battements par minute" unitAt={CENT + 20} />
				<Stage y={780} h={640} at={BEBE2 - 6} bumps={[POIG, STETH, GRAVE]}>
					<div style={{position: 'absolute', left: 30, top: 70}}>
						<Baby size={420} breath={breathAt(frame, 40)} steth={fadeIn(frame, ECOUTE - 4, 10)} mood={frame >= RAL ? 'mal' : 'calme'} />
					</div>
					<Pop from={POULS - 4} to={MIN - 10} x={500} y={80} origin="left center">
						<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
							<Cross size={84} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N, lineHeight: 1.05}}>
								pas de pouls
								<br />
								au <span style={{color: LPI.pink}}>poignet</span>
							</div>
						</div>
					</Pop>
					{/* stéthoscope + 1 minute entière */}
					{frame >= MIN - 6 && frame < ATT ? (
						<div style={{position: 'absolute', left: 560, top: 60, transform: `scale(${popAt(frame, MIN - 6)})`, opacity: 1 - fadeIn(frame, ATT - 8, 8)}}>
							<Stopwatch progress={interpolate(frame, [MIN - 4, ATT - 8], [0, 1], clamp)} count={Math.round(interpolate(frame, [MIN - 4, ATT - 8], [0, 132], clamp))} size={300} label="1 minute entière" />
						</div>
					) : null}
					<PillAt from={STETH - 2} to={ATT - 6} x={30} y={560} color={LPI.sky}>
						on écoute le cœur au stéthoscope
					</PillAt>
					{/* un cœur qui ralentit : alerte, souvent un manque d'O₂ */}
					{frame >= ATT - 4 ? (
						<div style={{position: 'absolute', left: 520, top: 60, display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${popAt(frame, ATT - 4)})`}}>
							<HeartBeat size={170} period={interpolate(slow, [0, 1], [11, 34])} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 80, color: LPI.blue, opacity: fadeIn(frame, RAL, 6)}}>↓</div>
						</div>
					) : null}
					{frame >= MANQ - 4 ? (
						<div style={{position: 'absolute', left: 620, top: 270, transform: `scale(${popAt(frame, MANQ - 4)})`}}>
							<O2Bubble size={150} fill={interpolate(frame, [MANQ, MANQ + 30], [0.85, 0.15], ease)} />
						</div>
					) : null}
					<PillAt from={RAL - 2} x={30} y={560} color={LPI.pink}>
						un cœur qui ralentit = alerte
					</PillAt>
				</Stage>
				<Stamp at={GRAVE + 2} x={830} y={1250} text="GRAVE !" size={60} rot={-8} />
				<PillAt from={MANQ - 2} x={72} y={1434} color={LPI.paper} size={34}>
					souvent : un manque d'oxygène
				</PillAt>
			</Camera>
			{[CENT, S70, S60].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="buzz" at={POIG} volume={0.05} dur={12} />
			<Sfx name="pop" at={STETH - 2} volume={0.08} />
			<Sfx name="tick" at={MIN} volume={0.08} />
			<Sfx name="heartbeat" at={ATT} volume={0.08} />
			<Sfx name="stamp" at={GRAVE + 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LA RESPIRATION ═══════════════════════════════ */
/** Tracé d'une respiration irrégulière (largeur × 150) : des cycles inégaux et une pause ; défile. */
const IrregularTrace: React.FC<{width?: number; on: number}> = ({width = 420, on}) => {
	const frame = useCurrentFrame();
	const pts = Array.from({length: 120}, (_, i) => {
		const x = (i / 119) * width;
		const t = i / 8 + frame / 9;
		const pause = Math.sin(t / 3.1) > 0.75 ? 0.15 : 1;
		const y = Math.sin(t) * (0.6 + 0.4 * Math.sin(t / 2.3)) * pause;
		return `${x},${75 - y * 55}`;
	}).join(' ');
	return (
		<svg width={width} height={150} viewBox={`0 0 ${width} 150`} style={{opacity: on}}>
			<rect x={0} y={0} width={width} height={150} rx={20} fill={N} />
			<polyline points={pts} fill="none" stroke={LPI.sky} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
		</svg>
	);
};

export const Fr: React.FC = () => {
	const frame = useCurrentFrame();
	const T30 = at('fr', 'trente');
	const D18 = at('fr', 'dix-huit');
	const D12 = at('fr', 'douze');
	const BEBE2 = at('fr', 'bébé', 2);
	const VENTRE = at('fr', 'ventre');
	const IRREG = at('fr', 'irrégulière');
	const COMPTE = at('fr', 'compte');
	const MIN = at('fr', 'minute', 2);
	const MOIS = at('fr', 'mois');
	const NEZ = at('fr', 'nez');
	const BOUCHE = at('fr', 'bouché');
	const SIGNES = at('fr', 'signes');
	const LUTTE = at('fr', 'lutte');
	const TIRAGE = at('fr', 'tirage');
	const AILES = at('fr', 'ailes');
	const GEIGN = at('fr', 'geignement');
	const irregular = frame < BOUCHE ? breathAt(frame + 6 * Math.sin(frame / 23), 40) * (Math.sin(frame / 27) > 0.8 ? 0.2 : 1) : breathAt(frame, 50);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[T30 + 1, D18 + 1, D12 + 1, VENTRE + 1, NEZ + 1, LUTTE + 1]} strength={0.025}>
				<Head kicker="2 · La fréquence respiratoire" kAt={2} title="La *respiration*" tAt={8} size={96} />
				<AgeTable at={[T30 - 3, D18 - 3, D12 - 3]} values={['30 – 50', '18 – 30', '12 – 20']} unit="respirations par minute" unitAt={T30 + 20} />
				<Stage y={780} h={640} at={BEBE2 - 6} bumps={[VENTRE, NEZ, LUTTE]}>
					<div style={{position: 'absolute', left: 20, top: 40}}>
						<Baby size={420} breath={irregular} snot={fadeIn(frame, BOUCHE - 4, 8) * (1 - fadeIn(frame, SIGNES - 6, 8))} retract={fadeIn(frame, TIRAGE - 2, 8)} flare={fadeIn(frame, AILES - 2, 8)} moan={fadeIn(frame, GEIGN - 2, 8)} mood={frame >= SIGNES ? 'mal' : 'calme'} />
					</div>
					{/* il respire avec le ventre, de façon irrégulière : 1 minute entière */}
					<PillAt from={VENTRE - 2} to={MOIS - 8} x={30} y={560} color={LPI.sky}>
						il respire avec le ventre
					</PillAt>
					{frame >= IRREG - 4 && frame < MOIS ? (
						<div style={{position: 'absolute', left: 470, top: 50, opacity: 1 - fadeIn(frame, MOIS - 8, 8), transform: `scale(${popAt(frame, IRREG - 4)})`, transformOrigin: 'left top'}}>
							<IrregularTrace width={420} on={1} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, marginTop: 6}}>irrégulière</div>
						</div>
					) : null}
					{frame >= COMPTE - 4 && frame < MOIS ? (
						<div style={{position: 'absolute', left: 560, top: 270, transform: `scale(${popAt(frame, COMPTE - 4) * 0.8})`, transformOrigin: 'left top', opacity: 1 - fadeIn(frame, MOIS - 8, 8)}}>
							<Stopwatch progress={interpolate(frame, [MIN - 4, MOIS - 8], [0, 1], clamp)} count={Math.round(interpolate(frame, [MIN - 4, MOIS - 8], [0, 42], clamp))} size={300} label="1 minute entière" />
						</div>
					) : null}
					{/* par le nez */}
					<PillAt from={MOIS - 2} to={SIGNES - 8} x={470} y={80} color={LPI.sky}>
						les premiers mois :
					</PillAt>
					<PillAt from={NEZ - 2} to={SIGNES - 8} x={470} y={160} color={LPI.paper}>
						il respire par le nez
					</PillAt>
					<PillAt from={BOUCHE - 2} to={SIGNES - 8} x={470} y={240} color={LPI.pink}>
						nez bouché = vraie gêne
					</PillAt>
					{/* les signes de lutte */}
					<PillAt from={LUTTE - 2} x={30} y={560} color={LPI.pink}>
						signes de lutte : il se bat pour respirer
					</PillAt>
				</Stage>
				<div style={{position: 'absolute', left: 540, top: 820, display: 'flex', flexDirection: 'column', gap: 16}}>
					<CauseChip at={TIRAGE - 3} icon={<RetractIco />} label="tirage" />
					<CauseChip at={AILES - 3} icon={<NoseIco />} label="ailes du nez" />
					<CauseChip at={GEIGN - 3} icon={<MoanIco />} label="geignement" />
				</div>
				<PillAt from={TIRAGE + 4} to={AILES - 6} x={72} y={1434} color={LPI.paper} size={32}>
					tirage = la peau se creuse entre les côtes
				</PillAt>
				<PillAt from={AILES + 4} to={GEIGN - 6} x={72} y={1434} color={LPI.paper} size={32}>
					les narines s'ouvrent à chaque inspiration
				</PillAt>
				<PillAt from={GEIGN + 4} x={72} y={1434} color={LPI.paper} size={32}>
					geignement = une plainte quand il souffle
				</PillAt>
			</Camera>
			{[T30, D18, D12].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="whoosh" at={VENTRE - 2} volume={0.05} />
			<Sfx name="tick" at={MIN} volume={0.08} />
			<Sfx name="pop" at={NEZ - 2} volume={0.07} />
			<Sfx name="buzz" at={BOUCHE} volume={0.04} dur={10} />
			{[TIRAGE, AILES, GEIGN].map((t) => (
				<Sfx key={`l${t}`} name="pop" at={t - 3} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

const RetractIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<path d="M18 40 Q50 64 82 40 M24 62 Q50 82 76 62" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
		<path d="M8 50 H26 M92 50 H74" stroke={LPI.pink} strokeWidth={8} strokeLinecap="round" />
	</svg>
);
const NoseIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<path d="M50 14 C46 40 34 56 34 66 C34 76 44 78 50 74 C56 78 66 76 66 66 C66 56 54 40 50 14" fill="none" stroke={N} strokeWidth={7} strokeLinejoin="round" />
		<path d="M24 56 Q16 66 24 76 M76 56 Q84 66 76 76" fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
	</svg>
);
const MoanIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<circle cx={36} cy={50} r={16} fill={alpha(N, 0.85)} />
		<path d="M62 34 Q74 50 62 66 M76 24 Q94 50 76 76" fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" />
	</svg>
);

/* ═══════════════════════════════ 3 · LA TENSION ═══════════════════════════════ */
// Les 3 valeurs (systolique) ; trois brassards de tailles différentes, le trop petit donne une tension trop haute ;
// courbes : le cœur accélère d'abord, la tension tombe en dernier → tampon « déjà grave ».
export const Ta: React.FC = () => {
	const frame = useCurrentFrame();
	const SYST = at('ta', 'systolique');
	const S70 = at('ta', 'soixante-dix');
	const Q90 = at('ta', 'quatre-vingt-dix');
	const C110 = at('ta', 'cent', 3);
	const BRAS = at('ta', 'brassard');
	const ADAPT = at('ta', 'adapté');
	const TROP = at('ta', 'trop');
	const HAUTE = at('ta', 'haute');
	const ENF = at('ta', "l'enfant", 2);
	const BAISSE = at('ta', 'baisse');
	const DERN = at('ta', 'dernier');
	const ACCEL = at('ta', 'accélère');
	const BASSE = at('ta', 'basse');
	const GRAVE = at('ta', 'grave');
	const cuffsOut = fadeIn(frame, ENF - 8, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[S70 + 1, Q90 + 1, C110 + 1, ADAPT + 1, HAUTE + 1, DERN + 1, GRAVE + 1]} strength={0.025}>
				<Head kicker="3 · La pression artérielle" kAt={2} title="La *tension*" tAt={8} size={96} />
				<AgeTable at={[S70 - 3, Q90 - 3, C110 - 3]} values={['70 – 100', '90 – 120', '110 – 130']} unit="mmHg · la systolique (le chiffre du haut)" unitAt={SYST - 2} />
				<Stage y={780} h={660} at={BRAS - 6} bumps={[ADAPT, HAUTE, DERN]}>
					{/* les brassards */}
					{cuffsOut < 1 ? (
						<div style={{position: 'absolute', left: 40, top: 110, display: 'flex', alignItems: 'flex-end', gap: 40, opacity: 1 - cuffsOut}}>
							{[
								{w: 150, label: 'bébé', t: BRAS - 2},
								{w: 210, label: 'enfant', t: BRAS + 6},
								{w: 280, label: 'adulte', t: ADAPT - 2},
							].map((c) =>
								frame >= c.t ? (
									<div key={c.label} style={{transform: `scale(${popAt(frame, c.t)})`, transformOrigin: '50% 100%'}}>
										<Cuff width={c.w} label={c.label} tone={c.label === 'bébé' ? LPI.pink : LPI.sky} />
									</div>
								) : null,
							)}
						</div>
					) : null}
					<PillAt from={ADAPT - 2} to={TROP - 6} x={30} y={560} color={LPI.sky}>
						un brassard adapté à son bras
					</PillAt>
					<PillAt from={TROP - 2} to={ENF - 8} x={30} y={560} color={LPI.pink}>
						trop petit → tension trop haute
					</PillAt>
					{frame >= HAUTE - 4 && frame < ENF ? (
						<div style={{position: 'absolute', left: 620, top: 380, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${popAt(frame, HAUTE - 4)})`, opacity: 1 - cuffsOut}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: LPI.pink, WebkitTextStroke: `3px ${N}`}}>↑</div>
							<div style={{padding: '8px 22px', borderRadius: 22, background: N, fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: LPI.pink}}>faux !</div>
						</div>
					) : null}
					{/* la tension tombe en dernier */}
					{frame >= ENF - 4 ? (
						<div style={{position: 'absolute', left: 150, top: 60, opacity: fadeIn(frame, ENF - 4, 10)}}>
							<CompChart width={640} t={interpolate(frame, [ENF - 2, BAISSE + 10], [0, 1], ease)} fall={interpolate(frame, [BAISSE, DERN + 20], [0, 1], ease)} />
						</div>
					) : null}
					<PillAt from={ACCEL - 2} to={BASSE - 8} x={30} y={560} color={LPI.pink}>
						le cœur accélère d'abord pour compenser
					</PillAt>
				</Stage>
				<Stamp at={GRAVE - 2} x={540} y={1330} text="Tension basse = déjà grave !" size={44} rot={-4} />
			</Camera>
			{[S70, Q90, C110].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			{[BRAS - 2, BRAS + 6, ADAPT - 2].map((t) => (
				<Sfx key={`c${t}`} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="buzz" at={HAUTE} volume={0.05} dur={12} />
			<Sfx name="whoosh" at={ENF - 4} volume={0.06} />
			<Sfx name="heartbeat" at={ACCEL} volume={0.07} />
			<Sfx name="stamp" at={GRAVE - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LA TEMPÉRATURE ═══════════════════════════════ */
// « les chiffres ne changent pas » : une seule pastille « fièvre ≥ 38 °C » pour les 3 âges ; ce qui change : le
// thermomètre rectal (la référence chez le bébé), le bonnet du nouveau-né qui se refroidit vite, et la fièvre avant
// 3 mois = signe de gravité (tampon « avis médical »).
const Snow: React.FC<{on: number}> = ({on}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={420} height={300} viewBox="0 0 420 300" style={{position: 'absolute', left: 0, top: 0, opacity: on}}>
			{Array.from({length: 9}, (_, i) => {
				const x = (i * 47 + 20) % 420;
				const y = ((frame * 2 + i * 37) % 300) as number;
				return <text key={i} x={x} y={y} fontSize={34} fill={LPI.sky} stroke={N} strokeWidth={1.5}>❄</text>;
			})}
		</svg>
	);
};

export const Temp: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIFF = at('temp', 'chiffres');
	const CHANG = at('temp', 'changent');
	const T38 = at('temp', 'trente-huit');
	const MESURE = at('temp', 'mesure');
	const REF = at('temp', 'référence');
	const THERMO = at('temp', 'thermomètre');
	const RECT = at('temp', 'rectal');
	const NN = at('temp', 'nouveau-né');
	const FROID = at('temp', 'refroidit');
	const BONNET = at('temp', 'bonnet');
	const FIEV2 = at('temp', 'fièvre', 2);
	const MOIS = at('temp', 'mois');
	const GRAV = at('temp', 'gravité');
	const AVIS = at('temp', 'avis');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[T38 + 1, MESURE + 1, RECT + 1, BONNET + 1, GRAV + 1]} strength={0.025}>
				<Head kicker="4 · La température" kAt={2} title="La *température*" tAt={8} size={96} />
				<AgeTable at={[CHIFF - 4, CHIFF, CHIFF + 4]} values={['', '', '']} same={{text: 'fièvre ≥ 38 °C', at: T38 - 3}} />
				<PillAt from={CHANG - 2} x={72} y={730} color={LPI.sky}>
					ça, ça ne change pas !
				</PillAt>
				<Stage y={820} h={620} at={MESURE - 6} bumps={[RECT, BONNET, GRAV]}>
					{/* le thermomètre rectal */}
					{frame >= THERMO - 6 && frame < FIEV2 ? (
						<div style={{position: 'absolute', left: 20, top: 90, transform: `scale(${popAt(frame, THERMO - 6)}) rotate(-8deg)`, opacity: 1 - fadeIn(frame, FIEV2 - 8, 8)}}>
							<ThermoStick width={420} value="37,2" />
						</div>
					) : null}
					<PillAt from={REF - 2} to={FIEV2 - 8} x={30} y={260} color={LPI.blue}>
						chez le bébé : la référence
					</PillAt>
					<PillAt from={RECT - 2} to={FIEV2 - 8} x={30} y={340} color={LPI.paper}>
						thermomètre rectal
					</PillAt>
					{/* le nouveau-né se refroidit : bonnet */}
					{frame >= NN - 6 ? (
						<div style={{position: 'absolute', left: 500, top: 50, transform: `scale(${popAt(frame, NN - 6)})`, transformOrigin: '50% 100%'}}>
							<div style={{position: 'relative'}}>
								<Baby size={360} shake={frame < BONNET ? fadeIn(frame, FROID, 8) * 0.6 : 0} bonnet={fadeIn(frame, BONNET - 4, 10)} mood={frame >= BONNET + 6 ? 'content' : 'calme'} fever={frame >= FIEV2 ? 1 : 0} />
								<Snow on={fadeIn(frame, FROID - 2, 8) * (1 - fadeIn(frame, BONNET + 4, 10))} />
							</div>
						</div>
					) : null}
					<PillAt from={FROID - 2} to={FIEV2 - 8} x={470} y={480} color={LPI.sky}>
						il se refroidit très vite
					</PillAt>
					{/* fièvre avant 3 mois */}
					{frame >= FIEV2 - 4 ? (
						<div style={{position: 'absolute', left: 30, top: 70, display: 'flex', flexDirection: 'column', gap: 18, transform: `scale(${popAt(frame, FIEV2 - 4)})`, transformOrigin: 'left top'}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<ThermoStick width={300} value="38,4" />
							</div>
							{frame >= MOIS - 4 ? (
								<div style={{padding: '14px 26px', borderRadius: 30, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N, transform: `scale(${popAt(frame, MOIS - 4)})`, transformOrigin: 'left center', alignSelf: 'flex-start'}}>avant 3 mois</div>
							) : null}
						</div>
					) : null}
					<PillAt from={GRAV - 2} x={30} y={480} color={LPI.pink}>
						= signe de gravité
					</PillAt>
				</Stage>
				<Stamp at={AVIS - 2} x={540} y={1360} text="Avis médical sans attendre !" size={44} rot={-4} />
			</Camera>
			<Sfx name="pop" at={T38 - 3} volume={0.1} />
			<Sfx name="ding" at={CHANG} volume={0.07} />
			<Sfx name="pop" at={THERMO - 6} volume={0.08} />
			<Sfx name="pop" at={NN - 6} volume={0.08} />
			<Sfx name="whoosh" at={FROID} volume={0.05} />
			<Sfx name="pop" at={BONNET - 4} volume={0.08} />
			<Sfx name="buzz" at={GRAV} volume={0.05} dur={12} />
			<Sfx name="stamp" at={AVIS - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · LA GLYCÉMIE ═══════════════════════════════ */
// Enfant et ado : comme l'adulte ; le nouveau-né, les premiers jours : ses propres seuils, plus bas ; on pique sur le
// côté du talon (pas au doigt) ; une hypo chez lui : il tremble, tète mal, devient tout mou.
export const Gly: React.FC = () => {
	const frame = useCurrentFrame();
	const ENF = at('gly', "l'enfant");
	const ADO = at('gly', "l'ado");
	const ADULTE = at('gly', "l'adulte");
	const NN = at('gly', 'nouveau-né');
	const SEUILS = at('gly', 'seuils');
	const PIQUE = at('gly', 'pique');
	const DOIGT = at('gly', 'doigt');
	const COTE = at('gly', 'côté');
	const TALON = at('gly', 'talon');
	const HYPO = at('gly', 'hypoglycémie');
	const TREMB = at('gly', 'tremble');
	const TETE = at('gly', 'tète');
	const MOU = at('gly', 'mou');
	const footOut = fadeIn(frame, HYPO - 8, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ADULTE + 1, SEUILS + 1, DOIGT + 1, TALON + 1, TREMB + 1, TETE + 1, MOU + 1]} strength={0.025}>
				<Head kicker="5 · La glycémie" kAt={2} title="La *glycémie*" tAt={8} size={96} />
				<AgeTable at={[NN - 3, ENF - 3, ADO - 3]} values={['ses seuils\nà lui', '= adulte', '= adulte']} valueSize={44} dim={[0, 0, 0]} />
				<PillAt from={SEUILS - 2} x={72} y={730} color={LPI.pink} size={34}>
					nouveau-né, premiers jours : seuils plus bas
				</PillAt>
				<Stage y={820} h={620} at={PIQUE - 8} bumps={[DOIGT, TALON, MOU]}>
					{/* au talon, pas au doigt */}
					{footOut < 1 && frame >= PIQUE - 6 ? (
						<div style={{position: 'absolute', left: 60, top: 40, transform: `scale(${popAt(frame, PIQUE - 6)})`, opacity: 1 - footOut}}>
							<BabyFoot width={250} zones={fadeIn(frame, COTE - 2, 8)} prick={interpolate(frame, [TALON - 2, TALON + 8], [0, 1], clamp)} drop={fadeIn(frame, TALON + 8, 10)} />
						</div>
					) : null}
					{frame >= DOIGT - 4 && footOut < 1 ? (
						<div style={{position: 'absolute', left: 470, top: 80, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${popAt(frame, DOIGT - 4)})`, opacity: 1 - footOut, transformOrigin: 'left center'}}>
							<Cross size={84} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>pas au doigt</div>
						</div>
					) : null}
					{frame >= COTE - 4 && footOut < 1 ? (
						<div style={{position: 'absolute', left: 470, top: 230, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${popAt(frame, COTE - 4)})`, opacity: 1 - footOut, transformOrigin: 'left center'}}>
							<Tick size={84} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N, lineHeight: 1.05}}>
								sur le côté
								<br />
								du <span style={{color: LPI.pink}}>talon</span>
							</div>
						</div>
					) : null}
					{/* une hypo chez le nouveau-né */}
					{frame >= HYPO - 4 ? (
						<div style={{position: 'absolute', left: 40, top: 40, transform: `scale(${popAt(frame, HYPO - 4)})`, transformOrigin: '50% 100%'}}>
							<Baby size={400} shake={frame >= TREMB - 2 && frame < TETE - 4 ? 1 : 0} limp={fadeIn(frame, MOU - 4, 12)} mood={frame >= TREMB ? 'mal' : 'calme'} />
						</div>
					) : null}
					{frame >= TETE - 4 && frame < MOU + 40 ? (
						<div style={{position: 'absolute', left: 470, top: 60, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${popAt(frame, TETE - 4)}) rotate(-10deg)`}}>
							<Bottle width={100} level={0.85} />
							<Cross size={70} />
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 540, top: 1150, display: 'flex', flexDirection: 'column', gap: 16}}>
					<CauseChip at={TREMB - 3} icon={<TremorIco />} label="il tremble" />
					<CauseChip at={TETE - 3} icon={<Bottle width={34} />} label="il tète mal" />
					<CauseChip at={MOU - 3} icon={<LimpIco />} label="il est tout mou" />
				</div>
			</Camera>
			{[NN, ENF, ADO].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="buzz" at={DOIGT} volume={0.05} dur={10} />
			<Sfx name="ding" at={COTE} volume={0.07} />
			<Sfx name="tick" at={TALON + 6} volume={0.09} />
			<Sfx name="whoosh" at={HYPO - 4} volume={0.06} />
			{[TREMB, TETE, MOU].map((t) => (
				<Sfx key={`h${t}`} name="pop" at={t - 3} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

const TremorIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<rect x={36} y={22} width={28} height={56} rx={12} fill={LPI.paper} stroke={N} strokeWidth={7} />
		<path d="M20 30 L12 40 L20 50 L12 60 M80 30 L88 40 L80 50 L88 60" fill="none" stroke={LPI.pink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
const LimpIco: React.FC = () => (
	<svg width={56} height={56} viewBox="0 0 100 100">
		<path d="M14 70 C30 40 50 40 50 60 C50 80 70 80 86 50" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
		<path d="M70 20 H88 M70 20 L88 36 H70" fill="none" stroke={LPI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

/* ═══════════════════════════════ 6 · LA SATURATION ═══════════════════════════════ */
// Même norme pour tous ; le capteur s'enroule autour du pied (lumière qui pulse) ; s'il pleure : la courbe se brouille,
// « valeur fausse ? » ; on vérifie une courbe régulière.
export const Spo2: React.FC = () => {
	const frame = useCurrentFrame();
	const NORME = at('spo2', 'norme');
	const P95 = at('spo2', '95');
	const CAPT = at('spo2', 'capteur');
	const ENROUL = at('spo2', "s'enroule");
	const PIED = at('spo2', 'pied');
	const BOUGE = at('spo2', 'bouge');
	const PLEURE = at('spo2', 'pleure');
	const FAUSSE = at('spo2', 'fausse');
	const VERIF = at('spo2', 'vérifie');
	const COURBE = at('spo2', 'courbe');
	const REG = at('spo2', 'régulière');
	const noisy = frame >= BOUGE - 2 && frame < VERIF ? 1 : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[P95 + 1, CAPT + 1, PIED + 1, PLEURE + 1, REG + 1]} strength={0.025}>
				<Head kicker="6 · La saturation" kAt={2} title="La *SpO₂*" tAt={8} size={96} />
				<AgeTable at={[NORME - 4, NORME, NORME + 4]} values={['', '', '']} same={{text: '95 – 100 %', at: P95 - 3}} />
				<PillAt from={NORME + 4} x={72} y={730} color={LPI.sky}>
					même norme que l'adulte
				</PillAt>
				<Stage y={820} h={620} at={CAPT - 6} bumps={[PIED, PLEURE, REG]}>
					<div style={{position: 'absolute', left: 20, top: 60}}>
						<Baby size={420} sensor={fadeIn(frame, ENROUL - 4, 10)} mood={frame >= PLEURE - 2 && frame < VERIF ? 'pleure' : 'calme'} shake={frame >= BOUGE - 2 && frame < VERIF ? 0.6 : 0} />
					</div>
					<PillAt from={PIED - 2} to={BOUGE - 6} x={30} y={520} color={LPI.sky}>
						autour du pied ou de la main
					</PillAt>
					{/* l'écran du saturomètre */}
					{frame >= CAPT - 4 ? (
						<div style={{position: 'absolute', left: 470, top: 70, width: 430, borderRadius: 30, background: N, padding: '20px 18px', boxSizing: 'border-box', transform: `scale(${popAt(frame, CAPT - 4)})`, transformOrigin: 'left top'}}>
							<div style={{display: 'flex', alignItems: 'baseline', gap: 10, fontFamily: FONT.title, fontWeight: 900, color: noisy ? LPI.pink : LPI.sky}}>
								<span style={{fontSize: 30, color: alpha(LPI.paper, 0.7)}}>SpO₂</span>
								<span style={{fontSize: 90, lineHeight: 1}}>{noisy ? (frame % 20 < 10 ? 86 : 91) : 98}</span>
								<span style={{fontSize: 34}}>%</span>
							</div>
							<div style={{marginTop: 10}}>
								<Pleth width={390} noise={noisy} color={noisy ? LPI.pink : LPI.sky} />
							</div>
						</div>
					) : null}
					<PillAt from={BOUGE - 2} to={VERIF - 6} x={30} y={520} color={LPI.paper}>
						il bouge, il pleure…
					</PillAt>
					<PillAt from={FAUSSE - 2} to={VERIF - 6} x={470} y={430} color={LPI.pink}>
						valeur fausse ?
					</PillAt>
					<PillAt from={COURBE - 2} x={30} y={520} color={LPI.blue}>
						courbe régulière = valeur fiable
					</PillAt>
				</Stage>
			</Camera>
			<Sfx name="pop" at={P95 - 3} volume={0.1} />
			<Sfx name="pop" at={CAPT - 4} volume={0.08} />
			<Sfx name="tick" at={PIED} volume={0.07} />
			<Sfx name="buzz" at={FAUSSE} volume={0.05} dur={12} />
			<Sfx name="ding" at={REG} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 7 · LA DIURÈSE ═══════════════════════════════ */
// En mL / kg / h (selon le poids) : ≈ 2 · ≈ 1 · 0,5 – 1 ; on pèse la couche : sèche 30 g, mouillée 75 g → + 45 g
// ≈ 45 mL d'urine.
export const Diurese: React.FC = () => {
	const frame = useCurrentFrame();
	const POIDS = at('diurese', 'poids');
	const ML = at('diurese', 'millilitres');
	const DEUX = at('diurese', 'deux');
	const UN = at('diurese', 'un');
	const DEMI = at('diurese', 'demi');
	const COUCHE = at('diurese', 'couche');
	const PESE = at('diurese', 'pèse');
	const GRAMME = at('diurese', 'gramme');
	const PLUS = at('diurese', 'plus');
	const MILLI = at('diurese', 'millilitre');
	const URINE = at('diurese', "d'urine");
	const wet = fadeIn(frame, GRAMME - 30, 16);
	const grams = frame < PESE ? 0 : frame < GRAMME - 30 ? interpolate(frame, [PESE, PESE + 12], [0, 30], clamp) : interpolate(frame, [GRAMME - 30, GRAMME], [30, 75], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ML + 1, DEUX + 1, UN + 1, DEMI + 1, PESE + 1, GRAMME + 1]} strength={0.025}>
				<Head kicker="7 · La diurèse" kAt={2} title="La *diurèse*" tAt={8} size={96} />
				<AgeTable at={[DEUX - 3, UN - 3, DEMI - 4]} values={['≈ 2', '≈ 1', '0,5 – 1']} unit="mL / kg / h (millilitres par kilo et par heure)" unitAt={ML - 2} />
				<PillAt from={POIDS - 2} to={DEUX - 6} x={72} y={760} color={LPI.pink}>
					on calcule selon le poids
				</PillAt>
				<Stage y={820} h={620} at={COUCHE - 6} bumps={[PESE, GRAMME, MILLI]}>
					{frame >= COUCHE - 4 ? (
						<div style={{position: 'absolute', left: 60, top: 80, transform: `scale(${popAt(frame, COUCHE - 4)})`, transformOrigin: '50% 100%'}}>
							<KitchenScale width={460} grams={grams} tone={frame >= GRAMME ? LPI.pink : N}>
								<div style={{transform: `translateY(${interpolate(frame, [PESE - 6, PESE + 4], [-160, 0], {...clamp, easing: Easing.in(Easing.quad)})}px)`, opacity: fadeIn(frame, COUCHE - 4, 6)}}>
									<Diaper width={240} wet={wet} />
								</div>
							</KitchenScale>
						</div>
					) : null}
					<PillAt from={PESE + 6} to={GRAMME - 32} x={580} y={140} color={LPI.sky}>
						couche sèche : 30 g
					</PillAt>
					<PillAt from={GRAMME - 2} x={580} y={140} color={LPI.pink}>
						mouillée : 75 g
					</PillAt>
					{frame >= PLUS - 2 ? (
						<div style={{position: 'absolute', left: 580, top: 260, transform: `scale(${popAt(frame, PLUS - 2)})`, transformOrigin: 'left center'}}>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, lineHeight: 1.05}}>
								+ 45 g
								<br />
								<span style={{color: LPI.blue, opacity: fadeIn(frame, MILLI - 2, 6)}}>≈ 45 mL</span>
							</div>
						</div>
					) : null}
				</Stage>
				<PillAt from={URINE} x={72} y={1434} color={LPI.paper} size={34}>
					1 g de plus ≈ 1 mL d'urine
				</PillAt>
			</Camera>
			{[DEUX, UN, DEMI].map((t) => (
				<Sfx key={t} name="pop" at={t - 3} volume={0.08} />
			))}
			<Sfx name="pop" at={COUCHE - 4} volume={0.08} />
			<Sfx name="impact" at={PESE + 4} volume={0.06} />
			<Sfx name="tick" at={GRAMME} volume={0.08} />
			<Sfx name="ding" at={MILLI} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const ADO = at('outro', "l'ado");
	return (
		<AbsoluteFill>
			<RecapScene
				title="Chez *l'enfant*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'balance') + 14}
				rows={[
					[at('outro', 'petit') - 3, 'up', 'Plus il est petit', 'FC et FR ↑ · tension ↓'],
					[at('outro', 'stéthoscope') - 3, 'check', 'Cœur', 'stéthoscope, 1 minute entière'],
					[at('outro', 'brassard') - 3, 'check', 'Tension', 'brassard adapté'],
					[at('outro', 'thermomètre') - 3, 'check', 'Température', 'thermomètre rectal'],
					[at('outro', 'talon') - 3, 'check', 'Glycémie', 'au talon'],
					[at('outro', 'capteur') - 3, 'check', 'SpO₂', 'capteur au pied'],
					[at('outro', 'couche') - 3, 'check', 'Diurèse', 'on pèse la couche'],
				]}
			/>
			<PillAt from={ADO - 2} x={72} y={1340} color={LPI.blue} size={44}>
				l'ado ≈ presque comme l'adulte !
			</PillAt>
			<Sfx name="ding" at={ADO} volume={0.07} />
		</AbsoluteFill>
	);
};
