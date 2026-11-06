// Scènes de « Quiz-Constantes » (promo : les 7 vidéos des paramètres vitaux sont sorties, quiz gratuit sur
// lapetiteide.fr). Accroche « quiz éclair » : 4 questions, 3 secondes chacune (le spectateur répond dans sa tête
// pendant le compte à rebours, la voix laisse un vrai silence `[pause 2.6]`), réponse + explication au mot près.
// Puis les 7 vidéos qui se cochent, le téléphone qui ouvre le quiz du site (une réponse tapée, juste), « lien en bio »,
// et le défi final « tu vas en avoir combien ? ».
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BeatingHeart} from '../../brand/cardio';
import {Head} from '../../brand/episode';
import {Glucometer, SugarCube} from '../../brand/glyco';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground} from '../../brand/motion3';
import {PulseOx} from '../../brand/oxygen';
import {GaugePicto, GlucosePicto, HeartPicto, JarPicto, LungsPicto, O2Picto, ThermoPicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {ThermoReadout} from '../../brand/thermo';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number; color?: string; max?: number}> = ({at: t0, color = LPI.pink, max = 0.4}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 14], [0, max, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(color, o * 0.4)} 20%, ${alpha(color, o)} 100%)`}} />;
};

/** Pastille (fond coloré, bord bleu nuit) qui « pop ». */
const Chip: React.FC<{at: number; to?: number; x: number; y: number; size?: number; tone?: string; ink?: string; children: React.ReactNode; center?: boolean}> = ({at: t0, to = 1e9, x, y, size = 40, tone = LPI.sky, ink = N, children, center = false}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 6) return null;
	const o = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `${center ? 'translateX(-50%) ' : ''}scale(${popAt(frame, t0) * (0.8 + 0.2 * o)})`, transformOrigin: center ? '50% 50%' : 'left center', opacity: o}}>
			<div style={{padding: `${size * 0.28}px ${size * 0.62}px`, borderRadius: 999, background: tone, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: ink, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: size * 0.3}}>{children}</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE QUIZ ÉCLAIR ═══════════════════════════════ */
// Image 0 : « 4 questions · 3 secondes » + 4 cartes « ? » en éventail + chrono « 3 ». Chaque question : la carte
// arrive (glisse), l'illustration (thermomètre qui monte à 38,5 °C, cœur qui bat à 120, saturomètre 98 %, lecteur
// 0,55 g/L), deux réponses ; pendant le silence le chrono fait 3 · 2 · 1 (tic) ; la bonne réponse s'allume (bleu ✓),
// l'autre s'efface (rose ✕), l'explication s'affiche ; la pastille du score se remplit.
type QDef = {
	n: number;
	kicker: string;
	text: string;
	choices: [string, string];
	good: 0 | 1;
	explain: string;
	enter: number;
	reveal: number;
	explainAt: number;
	leave: number;
	art: (frame: number) => React.ReactNode;
};

/** Chrono 3 · 2 · 1 (anneau qui se vide) qui finit sur la réponse. */
const Countdown: React.FC<{end: number; size?: number}> = ({end, size = 190}) => {
	const frame = useCurrentFrame();
	const start = end - 84;
	if (frame < start - 4 || frame >= end + 4) return null;
	const t = interpolate(frame, [start, end], [0, 1], clamp);
	const n = Math.max(1, 3 - Math.floor((frame - start) / 28));
	const since = (frame - start) % 28;
	const r = size / 2 - 14;
	const c = 2 * Math.PI * r;
	return (
		<div style={{width: size, height: size, position: 'relative', transform: `scale(${popAt(frame, start - 4)})`}}>
			<svg width={size} height={size} style={{position: 'absolute', inset: 0}}>
				<circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill={N} />
				<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LPI.pink} strokeWidth={14} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * t} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
			</svg>
			<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.55, color: LPI.paper, transform: `scale(${1 + 0.35 * Math.exp(-since / 3)})`}}>{n}</div>
		</div>
	);
};

/** Bouton de réponse : neutre, puis juste (bleu ✓) ou faux (rose pâle ✕). */
const Answer: React.FC<{x: number; y: number; label: string; good: boolean; at: number; reveal: number}> = ({x, y, label, good, at: t0, reveal}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const done = frame >= reveal;
	const k = done ? popAt(frame, reveal) : 1;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: 448,
				height: 132,
				borderRadius: 40,
				boxSizing: 'border-box',
				border: `7px solid ${N}`,
				background: done ? (good ? LPI.blue : alpha(LPI.pink, 0.35)) : LPI.paper,
				boxShadow: SHADOW,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 18,
				fontFamily: FONT.title,
				fontWeight: 900,
				fontSize: label.length > 9 ? 46 : 58,
				color: done && good ? LPI.paper : N,
				opacity: done && !good ? 0.55 : 1,
				transform: `scale(${popAt(frame, t0) * (done && good ? 1 + 0.08 * k : 1)})`,
			}}
		>
			{done ? (
				<div style={{width: 64, height: 64, borderRadius: 32, background: good ? LPI.paper : LPI.pink, color: N, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, flexShrink: 0}}>{good ? '✓' : '✕'}</div>
			) : null}
			{label}
		</div>
	);
};

const QuestionBlock: React.FC<{q: QDef}> = ({q}) => {
	const frame = useCurrentFrame();
	if (frame < q.enter - 2 || frame > q.leave + 12) return null;
	const xin = interpolate(frame, [q.enter, q.enter + 10], [1100, 0], ease);
	const xout = interpolate(frame, [q.leave, q.leave + 10], [0, -1100], ease);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${xin + xout}px)`}}>
			{/* la carte */}
			<div style={{position: 'absolute', left: 72, top: 380, width: 936, height: 600, borderRadius: 48, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, overflow: 'hidden'}}>
				<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 84, background: N, display: 'flex', alignItems: 'center', paddingLeft: 40, gap: 18, fontFamily: FONT.body, fontWeight: 900, fontSize: 32, letterSpacing: '0.12em', color: LPI.sky}}>
					QUESTION {q.n} / 4 <span style={{color: LPI.pink}}>· {q.kicker}</span>
				</div>
				<div style={{position: 'absolute', left: 40, right: 40, top: 110, fontFamily: FONT.title, fontWeight: 900, fontSize: 66, lineHeight: 1.08, color: N}}>{q.text}</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 270, height: 310, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{q.art(frame)}</div>
			</div>
			{/* le chrono, sur le coin de la carte */}
			<div style={{position: 'absolute', left: 840, top: 300}}>
				<Countdown end={q.reveal} />
			</div>
			<Answer x={72} y={1010} label={q.choices[0]} good={q.good === 0} at={q.enter + 8} reveal={q.reveal} />
			<Answer x={560} y={1010} label={q.choices[1]} good={q.good === 1} at={q.enter + 12} reveal={q.reveal} />
			<Chip at={q.explainAt} x={540} y={1180} size={44} tone={LPI.sky} center>
				{q.explain}
			</Chip>
		</div>
	);
};

/** Les 4 pastilles du score (en haut à droite) qui se remplissent à chaque réponse. */
const ScoreDots: React.FC<{reveals: number[]; from: number}> = ({reveals, from}) => {
	const frame = useCurrentFrame();
	if (frame < from) return null;
	return (
		<div style={{position: 'absolute', right: 72, top: 236, display: 'flex', gap: 14, transform: `scale(${popAt(frame, from)})`, transformOrigin: 'right center'}}>
			{reveals.map((r, i) => (
				<div key={i} style={{width: 46, height: 46, borderRadius: 23, border: `5px solid ${N}`, background: frame >= r ? LPI.blue : LPI.paper, transform: `scale(${frame >= r ? 1 + 0.3 * Math.exp(-(frame - r) / 4) : 1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 26}}>
					{frame >= r ? '✓' : i + 1}
				</div>
			))}
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const SEC = at('intro', 'secondes');
	const PRET = at('intro', 'prêt');
	const PREM = at('intro', 'première');
	const DEMI = at('intro', 'demi');
	const OUI = at('intro', 'oui');
	const DES = at('intro', 'dès');
	const Q2 = at('intro', 'question', 2);
	const COEUR = at('intro', 'cœur');
	const TACHY = at('intro', 'tachycardie');
	const AUDESSUS = at('intro', 'au-dessus');
	const Q3 = at('intro', 'question', 3);
	const SAT = at('intro', 'saturation');
	const EH = at('intro', 'eh');
	const PIEGE = at('intro', 'piège');
	const NORMAL = at('intro', 'normal');
	const DERN = at('intro', 'dernière');
	const ZERO = at('intro', 'zéro');
	const HYPO = at('intro', 'hypoglycémie');
	const RESUC = at('intro', 'resucre');
	const QS: QDef[] = [
		{
			n: 1,
			kicker: 'TEMPÉRATURE',
			text: '38,5 °C : fièvre ou pas ?',
			choices: ['OUI', 'NON'],
			good: 0,
			explain: 'fièvre dès 38 °C',
			enter: PREM - 6,
			reveal: OUI - 1,
			explainAt: DES - 2,
			leave: Q2 - 10,
			art: (f) => <ThermoReadout value={interpolate(f, [PREM + 8, DEMI + 6], [37, 38.5], ease)} height={260} numSize={120} />,
		},
		{
			n: 2,
			kicker: 'FRÉQUENCE CARDIAQUE',
			text: 'Un cœur à 120 / min, au repos ?',
			choices: ['normal', 'tachycardie'],
			good: 1,
			explain: 'au-dessus de 100 / min : trop rapide',
			enter: Q2 - 4,
			reveal: TACHY - 2,
			explainAt: AUDESSUS - 2,
			leave: Q3 - 10,
			art: () => (
				<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
					<BeatingHeart beats={Array.from({length: 40}, (_, i) => COEUR - 6 + i * 15)} size={230} />
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N, lineHeight: 1}}>
						120<span style={{fontSize: 46, color: LPI.blue}}> /min</span>
					</div>
				</div>
			),
		},
		{
			n: 3,
			kicker: 'SATURATION',
			text: 'Une SpO₂ à 98 % ?',
			choices: ['trop basse', 'normale'],
			good: 1,
			explain: 'normale : 95 à 100 %',
			enter: Q3 - 4,
			reveal: EH - 1,
			explainAt: NORMAL - 2,
			leave: DERN - 12,
			art: (f) => (
				<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
					<div style={{width: 420, height: 230, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<div style={{transform: 'scale(0.5)'}}>
							<PulseOx value={Math.round(interpolate(f, [SAT, SAT + 20], [90, 98], clamp))} width={900} light={1} />
						</div>
					</div>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 150, color: N, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
						{Math.round(interpolate(f, [SAT, SAT + 20], [90, 98], clamp))}
						<span style={{fontSize: 70, color: LPI.blue}}> %</span>
					</div>
				</div>
			),
		},
		{
			n: 4,
			kicker: 'GLYCÉMIE',
			text: '0,55 g/L de sucre dans le sang ?',
			choices: ['hypoglycémie', 'hyperglycémie'],
			good: 0,
			explain: 'moins de 0,70 g/L : on resucre !',
			enter: DERN - 6,
			reveal: HYPO - 1,
			explainAt: RESUC - 4,
			leave: 1e9,
			art: (f) => (
				<div style={{display: 'flex', alignItems: 'center', gap: 30, transform: 'scale(0.95)'}}>
					<Glucometer value={interpolate(f, [ZERO - 4, ZERO + 26], [0, 0.55], ease)} strip={1} blood={1} tone={f >= HYPO ? LPI.pink : null} beep={0} />
					{f >= RESUC - 4 ? (
						<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
							{[0, 1, 2].map((i) => (
								<div key={i} style={{transform: `scale(${popAt(f, RESUC - 4 + i * 4)})`}}>
									<SugarCube size={52} rot={i * 14 - 12} />
								</div>
							))}
						</div>
					) : null}
				</div>
			),
		},
	];
	const intro = 1 - fadeIn(frame, PREM - 8, 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SEC + 1, PRET + 1, ...QS.map((q) => q.reveal + 1)]} shakes={[PIEGE + 2]} strength={0.035}>
				{/* bandeau du quiz */}
				<div style={{position: 'absolute', left: 72, top: 236, padding: '10px 26px', borderRadius: 999, background: N, color: LPI.paper, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, letterSpacing: '0.14em', display: 'flex', gap: 12}}>
					QUIZ ÉCLAIR <span style={{color: LPI.pink}}>· CONSTANTES</span>
				</div>
				<ScoreDots reveals={QS.map((q) => q.reveal)} from={-30} />
				{/* image 0 : la règle du jeu */}
				{intro > 0 ? (
					<div style={{position: 'absolute', inset: 0, opacity: intro}}>
						<div style={{position: 'absolute', left: 60, top: 340, width: 960}}>
							<Title at={-60} text={'*4* questions\n*3* secondes'} size={134} align="center" stagger={0} />
						</div>
						{/* 4 cartes « ? » en éventail */}
						{[0, 1, 2, 3].map((i) => (
							<div key={i} style={{position: 'absolute', left: 300 + i * 110, top: 760 + Math.abs(i - 1.5) * 26, width: 190, height: 260, borderRadius: 30, background: i % 2 ? LPI.sky : LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, transform: `rotate(${(i - 1.5) * 12 + Math.sin(frame / 9 + i) * 2}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N}}>
								?
							</div>
						))}
						{/* chrono « 3 » (image 0) */}
						<div style={{position: 'absolute', left: 445, top: 1060, width: 190, height: 190, borderRadius: 95, background: N, border: `12px solid ${LPI.pink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 110, color: LPI.paper, transform: `scale(${1 + 0.06 * Math.sin(frame / 4) + (frame >= SEC ? 0.2 * Math.exp(-(frame - SEC) / 4) : 0)})`, opacity: 1 - fadeIn(frame, PRET - 6, 4)}}>
							3
						</div>
						{frame >= PRET - 2 ? (
							<div style={{position: 'absolute', left: 0, right: 0, top: 1100, display: 'flex', justifyContent: 'center'}}>
								<div style={{padding: '14px 44px', borderRadius: 999, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, transform: `scale(${popAt(frame, PRET - 2)}) rotate(-4deg)`}}>Tu es prêt ?</div>
							</div>
						) : null}
					</div>
				) : null}
				{QS.map((q) => (
					<QuestionBlock key={q.n} q={q} />
				))}
				<Stamp at={PIEGE} x={700} y={560} text="PIÈGE !" size={70} rot={-10} out={NORMAL + 20} />
				<Burst at={OUI} x={300} y={1076} r={220} n={12} />
				<Burst at={TACHY - 2} x={784} y={1076} r={220} n={12} />
				<Burst at={EH} x={784} y={1076} r={220} n={12} />
				<Burst at={HYPO} x={300} y={1076} r={220} n={12} />
			</Camera>
			<Flash at={PIEGE} max={0.3} color={LPI.sky} />
			<Sfx name="whoosh" at={0} volume={0.06} />
			<Sfx name="pop" at={SEC} volume={0.08} />
			<Sfx name="stamp" at={PRET - 2} volume={0.09} />
			{QS.map((q) => (
				<React.Fragment key={q.n}>
					<Sfx name="whoosh" at={q.enter} volume={0.08} />
					{[84, 56, 28].map((d) => (
						<Sfx key={d} name="tick" at={q.reveal - d} volume={0.14} />
					))}
					<Sfx name="ding" at={q.reveal} volume={0.12} />
				</React.Fragment>
			))}
			<Sfx name="buzz" at={PIEGE} volume={0.05} dur={12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LES 7 VIDÉOS SONT SORTIES ═══════════════════════════════ */
// « bonne nouvelle » ; « les sept paramètres vitaux ont tous leur vidéo » : 7 tuiles (icône, sigle, nom) qui claquent
// au mot, chacune se coche « vidéo dispo » ; la 8e case = « 7 / 7 » ; tampon « Toutes disponibles ! ».
const TILES: {abbr: string; name: string; icon: React.ReactNode; word: string; n?: number}[] = [
	{abbr: 'FR', name: 'fréquence respiratoire', icon: <LungsPicto size={92} />, word: 'respiratoire'},
	{abbr: 'FC', name: 'fréquence cardiaque', icon: <HeartPicto size={92} />, word: 'cardiaque'},
	{abbr: 'T°', name: 'température', icon: <ThermoPicto size={92} />, word: 'température'},
	{abbr: 'TA', name: 'tension artérielle', icon: <GaugePicto size={92} />, word: 'tension'},
	{abbr: 'GLY', name: 'glycémie', icon: <GlucosePicto size={92} />, word: 'glycémie'},
	{abbr: 'SpO₂', name: 'saturation', icon: <O2Picto size={92} />, word: 'saturation'},
	{abbr: 'DIU', name: 'diurèse', icon: <JarPicto size={92} />, word: 'diurèse'},
];

const Tile: React.FC<{x: number; y: number; at: number; abbr: string; name: string; icon: React.ReactNode}> = ({x, y, at: t0, abbr, name, icon}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const check = frame >= t0 + 8;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 448, height: 178, borderRadius: 36, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, transform: `scale(${popAt(frame, t0)})`, display: 'flex', alignItems: 'center', gap: 18, padding: '0 20px', boxSizing: 'border-box'}}>
			<div style={{width: 120, height: 120, borderRadius: 30, background: alpha(LPI.sky, 0.6), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{icon}</div>
			<div style={{flex: 1}}>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N, lineHeight: 1}}>{abbr}</div>
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 24, color: alpha(N, 0.7), marginTop: 6}}>{name}</div>
				{check ? (
					<div style={{marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 999, background: LPI.blue, color: LPI.paper, fontFamily: FONT.body, fontWeight: 900, fontSize: 22, transform: `scale(${popAt(frame, t0 + 8)})`, transformOrigin: 'left center'}}>✓ vidéo dispo</div>
				) : null}
			</div>
		</div>
	);
};

export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const BONNE = at('serie', 'bonne');
	const SEPT = at('serie', 'sept');
	const VIDEO = at('serie', 'vidéo');
	const DIU = at('serie', 'diurèse');
	const ats = TILES.map((t) => at('serie', t.word));
	const all = DIU + 2;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[BONNE + 1, SEPT + 1, ...ats.map((a) => a + 1), all + 1]} shakes={[all + 2]} strength={0.03}>
				<Head kicker="Bonne nouvelle" kAt={BONNE - 2} title="Les *7* constantes ont leur *vidéo*" tAt={SEPT - 2} size={80} />
				{TILES.map((t, i) => (
					<Tile key={t.abbr} x={i % 2 ? 560 : 72} y={480 + Math.floor(i / 2) * 200} at={ats[i] - 2} abbr={t.abbr} name={t.name} icon={t.icon} />
				))}
				{/* 8e case : le compteur */}
				{frame >= VIDEO - 2 ? (
					<div style={{position: 'absolute', left: 560, top: 1080, width: 448, height: 178, borderRadius: 36, background: frame >= all ? LPI.blue : N, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${popAt(frame, VIDEO - 2) * (frame >= all ? 1 + 0.08 * Math.exp(-(frame - all) / 5) : 1)})`}}>
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: LPI.paper, fontVariantNumeric: 'tabular-nums'}}>{ats.filter((a) => frame >= a).length}</span>
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: LPI.sky}}>/ 7</span>
					</div>
				) : null}
				<Stamp at={all} x={540} y={1330} text="Toutes disponibles !" size={50} rot={-6} />
				<Burst at={all} x={784} y={1170} r={260} n={16} />
			</Camera>
			<Sfx name="ding" at={BONNE} volume={0.08} />
			{ats.map((a) => (
				<Sfx key={a} name="pop" at={a - 2} volume={0.1} />
			))}
			<Sfx name="stamp" at={all} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE VRAI TEST : LE QUIZ DU SITE ═══════════════════════════════ */
// Un téléphone : barre d'adresse « lapetiteide.fr », le quiz des paramètres vitaux, une question, le doigt touche la
// bonne réponse (bleu ✓), la barre de progression avance ; tampon GRATUIT ; « lapetiteide.fr » en grand ; « lien en
// bio » avec une flèche qui monte.
const PH = {x: 290, y: 420, w: 500, h: 900};

const Phone: React.FC<{tap: number; url: number}> = ({tap, url}) => {
	const frame = useCurrentFrame();
	const answers = ['8 – 10 / min', '12 – 20 / min', '25 – 30 / min', '35 – 40 / min'];
	const picked = frame >= tap;
	const finger = interpolate(frame, [tap - 20, tap - 4], [0, 1], ease);
	return (
		<div style={{position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: 70, background: N, boxShadow: SHADOW, padding: 18, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 54, background: LPI.paper, overflow: 'hidden'}}>
				{/* barre d'adresse */}
				<div style={{position: 'absolute', left: 24, right: 24, top: 44, height: 64, borderRadius: 32, background: alpha(LPI.sky, 0.7), border: `4px solid ${url > 0 ? LPI.blue : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT.body, fontWeight: 900, fontSize: 30, color: N, transform: `scale(${1 + 0.06 * url * Math.abs(Math.sin(frame / 5))})`}}>
					<svg width={24} height={28} viewBox="0 0 24 28">
						<rect x={2} y={12} width={20} height={14} rx={4} fill={N} />
						<path d="M6 12 V8 a6 6 0 0 1 12 0 V12" fill="none" stroke={N} strokeWidth={4} />
					</svg>
					lapetiteide.fr
				</div>
				{/* le quiz */}
				<div style={{position: 'absolute', left: 30, top: 140, fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.14em', color: LPI.blue}}>QUIZ · PARAMÈTRES VITAUX</div>
				<div style={{position: 'absolute', left: 30, right: 30, top: 186, height: 16, borderRadius: 8, background: alpha(LPI.sky, 0.8)}}>
					<div style={{width: `${interpolate(frame, [tap, tap + 12], [30, 38], clamp)}%`, height: '100%', borderRadius: 8, background: LPI.blue}} />
				</div>
				<div style={{position: 'absolute', left: 30, right: 30, top: 230, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, lineHeight: 1.12, color: N}}>Fréquence respiratoire normale chez l'adulte ?</div>
				{answers.map((a, i) => {
					const good = i === 1;
					return (
						<div key={a} style={{position: 'absolute', left: 30, right: 30, top: 380 + i * 104, height: 86, borderRadius: 26, border: `5px solid ${N}`, boxSizing: 'border-box', background: picked && good ? LPI.blue : LPI.paper, color: picked && good ? LPI.paper : N, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, transform: `scale(${picked && good ? 1 + 0.07 * Math.exp(-(frame - tap) / 4) : 1})`}}>
							<span style={{width: 40, height: 40, borderRadius: 20, background: picked && good ? LPI.paper : alpha(LPI.sky, 0.8), color: N, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>{picked && good ? '✓' : 'ABCD'[i]}</span>
							{a}
						</div>
					);
				})}
				<div style={{position: 'absolute', left: 30, right: 30, top: 812, display: 'flex', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: picked ? LPI.blue : alpha(N, 0.4)}}>{picked ? 'Bonne réponse ! +1' : 'Question 4'}</div>
				{/* le doigt qui touche la bonne réponse */}
				{finger > 0 && frame < tap + 20 ? (
					<div style={{position: 'absolute', left: 330 - 120 * finger, top: 700 - 220 * finger, opacity: interpolate(frame, [tap + 10, tap + 20], [1, 0], clamp)}}>
						<div style={{width: 70, height: 70, borderRadius: 35, background: alpha(N, 0.25), border: `5px solid ${N}`, transform: `scale(${frame >= tap ? 1 + 0.5 * Math.exp(-(frame - tap) / 3) : 1})`}} />
					</div>
				) : null}
			</div>
		</div>
	);
};

export const Quiz: React.FC = () => {
	const frame = useCurrentFrame();
	const MAINT = at('quiz', 'maintenant');
	const VRAI = at('quiz', 'vrai');
	const QUIZ = at('quiz', 'quiz');
	const GRAT = at('quiz', 'gratuit');
	const SITE = at('quiz', 'site');
	const URL = at('quiz', 'lapetiteide.fr');
	const LIEN = at('quiz', 'lien');
	const BIO = at('quiz', 'bio');
	const url = fadeIn(frame, SITE - 2, 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[VRAI + 1, QUIZ + 1, GRAT + 1, URL + 1, BIO + 1]} shakes={[GRAT + 2]} strength={0.03}>
				<Head kicker="À toi de jouer" kAt={MAINT - 4} title="Le *vrai* *test*" tAt={VRAI - 2} size={88} />
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - popAt(frame, QUIZ - 6)) * 200}px)`, opacity: fadeIn(frame, QUIZ - 6, 6)}}>
					<Phone tap={GRAT + 10} url={url} />
				</div>
				<Stamp at={GRAT} x={860} y={600} text="GRATUIT" size={64} rot={8} />
				{/* l'adresse en grand */}
				{frame >= URL - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1340, display: 'flex', justifyContent: 'center'}}>
						<div style={{padding: '18px 48px', borderRadius: 999, background: LPI.blue, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 72, color: LPI.paper, transform: `scale(${popAt(frame, URL - 2)})`}}>lapetiteide.fr</div>
					</div>
				) : null}
				{/* lien en bio : la flèche monte vers le profil */}
				{frame >= LIEN - 2 ? (
					<div style={{position: 'absolute', left: 660, top: 236, display: 'flex', alignItems: 'center', gap: 10, transform: `scale(${popAt(frame, LIEN - 2)}) translateY(${-8 * Math.abs(Math.sin(frame / 5))}px)`, transformOrigin: 'center'}}>
						<svg width={56} height={70} viewBox="0 0 56 70">
							<path d="M28 66 V10 M8 30 L28 8 L48 30" fill="none" stroke={N} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						<div style={{padding: '10px 26px', borderRadius: 999, background: LPI.pink, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N}}>lien en bio</div>
					</div>
				) : null}
			</Camera>
			<Sfx name="whoosh" at={QUIZ - 6} volume={0.08} />
			<Sfx name="stamp" at={GRAT} volume={0.12} />
			<Sfx name="tick" at={GRAT + 10} volume={0.12} />
			<Sfx name="ding" at={GRAT + 12} volume={0.1} />
			<Sfx name="pop" at={URL - 2} volume={0.1} />
			<Sfx name="pop" at={LIEN - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LE DÉFI ═══════════════════════════════ */
// « Alors, tu vas en avoir combien ? » : carte « TON SCORE » dont les chiffres défilent sans s'arrêter (« ? ») ;
// « Va vite te tester ! » : gros bouton « Je me teste → » + lapetiteide.fr · lien en bio.
export const Outro: React.FC = () => {
	const frame = useCurrentFrame();
	const ALORS = at('outro', 'alors');
	const COMB = at('outro', 'combien');
	const VA = at('outro', 'va');
	const TEST = at('outro', 'tester');
	const spin = frame < COMB + 4 ? String(Math.floor(((frame * 7) % 21) + 0)).padStart(2, ' ') : '?';
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[COMB + 1, TEST + 1]} shakes={[TEST + 2]} strength={0.03}>
				{frame >= ALORS - 2 ? (
					<div style={{position: 'absolute', left: 190, top: 330, width: 700, height: 520, borderRadius: 60, background: N, boxShadow: SHADOW, transform: `scale(${popAt(frame, ALORS - 2)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 40, letterSpacing: '0.18em', color: LPI.sky}}>TON SCORE</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 230, color: frame >= COMB + 4 ? LPI.pink : LPI.paper, lineHeight: 1, fontVariantNumeric: 'tabular-nums', transform: `scale(${frame >= COMB + 4 ? popAt(frame, COMB + 4) : 1})`}}>{spin}</div>
					</div>
				) : null}
				{frame >= VA - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 940, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
						<div style={{padding: '26px 60px', borderRadius: 999, background: LPI.pink, border: `8px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 84, color: N, transform: `scale(${popAt(frame, VA - 2) * (1 + 0.04 * Math.sin(frame / 4))})`}}>Je me teste →</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N, opacity: fadeIn(frame, TEST - 2, 6)}}>
							<span style={{color: LPI.blue}}>lapetiteide.fr</span> · lien en bio
						</div>
					</div>
				) : null}
				<Burst at={TEST} x={540} y={1000} r={380} n={18} />
			</Camera>
			<Sfx name="drumroll" at={ALORS} volume={0.25} dur={COMB - ALORS + 6} />
			<Sfx name="impact" at={COMB + 4} volume={0.09} />
			<Sfx name="pop" at={VA - 2} volume={0.1} />
			<Sfx name="ding" at={TEST} volume={0.1} />
		</AbsoluteFill>
	);
};
