// Scènes de « Les 5 indications de l'hygiène des mains » : chaque mouvement part d'un mot de la voix (`npm run cues`).
// Accroche-choc (des microbes invisibles → la loupe les montre → ils passent au patient), la règle « 2 avant · 3 après »,
// une scène par indication (même gabarit : socle illustré, AVANT / APRÈS + qui on protège, suivi des 5 indications),
// le bon geste (friction SHA 20 – 30 s, mains sèches ; eau + savon si mains sales), récap.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Head, LAY, Pill, RecapScene, StagePill, Stopwatch} from '../../brand/episode';
import {Bed, BedTable, Drop, Faucet, IvPump, Loupe, Microbe, rnd, Sparkles, StepTracker, Swarm} from '../../brand/hands';
import {EyeIcon, SyringeIcon} from '../../brand/icons';
import {CheckChip} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Arm, ARM_PT, Hand, Plaster, ShaBottle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
/** microbes : rose = les tiens (mains), bleu clair = ceux du patient / de son environnement */
const MINE = [LPI.pink, LPI.blue];
const HIS = [LPI.sky, LPI.blue];

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, 0.5, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Flacon de SHA qui surgit (`at`), pousse (`press`) et lâche une goutte vers la main. */
const ShaPump: React.FC<{at: number; press: number; x: number; y: number; size?: number}> = ({at: t0, press, x, y, size = 130}) => {
	const frame = useCurrentFrame();
	const p = popAt(frame, t0);
	if (frame < t0) return null;
	const k = interpolate(frame, [press - 2, press + 2, press + 8], [0, 1, 0], clamp);
	const dropT = interpolate(frame, [press + 2, press + 12], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${p})`, transformOrigin: '50% 100%'}}>
			<ShaBottle size={size} press={k} />
			{dropT > 0 && dropT < 1 ? (
				<div style={{position: 'absolute', left: size * 0.95 + dropT * 40, top: size * 0.15 + dropT * dropT * 90, transform: 'scale(0.5)'}}>
					<Drop size={40} tone={LPI.sky} />
				</div>
			) : null}
		</div>
	);
};

/** Mains « en miroir » : la droite est la gauche retournée (ce n'est pas la mascotte). */
const HandR: React.FC<{size: number; gloved?: number}> = ({size, gloved = 0}) => (
	<div style={{transform: 'scaleX(-1)'}}>
		<Hand size={size} gloved={gloved} />
	</div>
);

/** Gabarit d'une indication : titre, socle, AVANT / APRÈS + qui on protège, suivi des 5 indications. */
const Indication: React.FC<{
	n: number;
	when: 'AVANT' | 'APRÈS';
	kAt: number;
	title: string;
	whenAt: number;
	protects: string;
	pAt: number;
	punches: number[];
	bumps?: number[];
	children: React.ReactNode;
	extra?: React.ReactNode;
}> = ({n, when, kAt, title, whenAt, protects, pAt, punches, bumps = [], children, extra}) => {
	const frame = useCurrentFrame();
	const before = when === 'AVANT';
	const tone = before ? LPI.blue : LPI.pink;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[kAt + 1, whenAt + 1, pAt + 1, ...punches]}>
				<Head kicker={`Indication ${n}`} kAt={kAt} title={title} tAt={kAt + 3} size={78} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={kAt + 4} bumps={bumps}>
					{children}
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010, display: 'flex', alignItems: 'center', gap: 22}}>
					{frame >= whenAt ? (
						<div style={{padding: '10px 30px', borderRadius: 999, background: tone, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 52, letterSpacing: '0.06em', color: before ? LPI.paper : N, transform: `scale(${popAt(frame, whenAt)}) rotate(${-4 * (1 - Math.min(1, (frame - whenAt) / 8))}deg)`}}>
							{when}
						</div>
					) : null}
					{frame >= pAt ? (
						<div style={{opacity: fadeIn(frame, pAt), transform: `translateX(${(1 - fadeIn(frame, pAt)) * -30}px)`, fontFamily: FONT.title, fontWeight: 800, fontSize: 38, color: N}}>
							protège : <span style={{color: before ? LPI.blue : N, background: before ? 'transparent' : alpha(LPI.pink, 0.45), borderRadius: 12, padding: '0 8px'}}>{protects}</span>
						</div>
					) : null}
				</div>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1140}}>
					<StepTracker current={n} at={kAt} />
				</div>
				{extra}
			</Camera>
			<Sfx name="pop" at={whenAt} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : deux mains qui ont l'air propres + « Tes mains sont propres ? ». « des milliers de microbes… tu ne vois
// absolument rien » : rien à l'œil nu. « On regarde de plus près » : une loupe glisse sur la main, les microbes grouillent
// dedans ; « les voilà ! » : la caméra plonge dans la loupe (flash, secousse). « À chaque soin » : une main touche le bras
// du patient, les microbes sautent. « Pour les arrêter » : STOP ; « cinq moments » : 1 · 2 · 3 · 4 · 5 ; titre.
const LENS = {x: 742, y: 760, r: 170};
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const MIL = at('intro', 'milliers');
	const RIEN = at('intro', 'rien');
	const REG = at('intro', 'regarde');
	const PRES = at('intro', 'près');
	const VOILA = at('intro', 'voilà');
	const CHAQUE = at('intro', 'chaque');
	const PASSER = at('intro', 'passer');
	const PAT = at('intro', 'patient');
	const ARR = at('intro', 'arrêter');
	const CINQ = at('intro', 'cinq');
	const CINQ2 = at('intro', 'cinq', 2);
	const IND = at('intro', 'indications');
	// la loupe arrive, puis la caméra plonge dedans et ressort
	const lensIn = interpolate(frame, [REG - 6, PRES + 4], [0, 1], ease);
	const lensOut = interpolate(frame, [CHAQUE - 4, CHAQUE + 8], [0, 1], ease);
	const dive = interpolate(frame, [VOILA - 4, VOILA + 8, CHAQUE - 8, CHAQUE + 4], [0, 1, 1, 0], ease);
	const z = 1 + 1.9 * dive;
	// après la plongée : la main gauche s'en va, la droite glisse vers le patient qui arrive
	const shift = interpolate(frame, [CHAQUE, CHAQUE + 14], [0, 1], ease);
	const touch = interpolate(frame, [PASSER - 6, PASSER + 4, PAT + 6, PAT + 16], [0, 1, 1, 0.6], ease);
	const handX = 580 - 430 * shift + 270 * touch;
	const handY = 560 + 110 * shift;
	const handK = 1 - 0.3 * shift;
	const jump = interpolate(frame, [PASSER, PASSER + 16], [0, 1], clamp);
	const tA = interpolate(frame, [VOILA - 2, VOILA + 4], [1, 0], clamp);
	const tC = fadeIn(frame, CINQ2 - 2, 6);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[MIL + 1, RIEN + 1, PRES + 1, CHAQUE + 1, PASSER + 1, ARR + 1, CINQ + 1, CINQ2 + 1, IND + 1]} shakes={[VOILA + 2]} strength={0.04}>
				{/* la scène qui « plonge » : mains + loupe */}
				<div style={{position: 'absolute', inset: 0, transformOrigin: `${LENS.x}px ${LENS.y}px`, transform: `scale(${z})`}}>
					{/* main gauche */}
					<div style={{position: 'absolute', left: 160, top: 560, opacity: 1 - shift, transform: `translateX(${-200 * shift}px)`}}>
						<Hand size={300} />
						{frame >= CHAQUE ? (
							<div style={{position: 'absolute', left: 40, top: 60}}>
								<Swarm w={230} h={300} n={7} seed={5} size={46} tone={MINE} appear={fadeIn(frame, CHAQUE, 8)} />
							</div>
						) : null}
					</div>
					{/* main droite (celle qui touche le patient) */}
					<div style={{position: 'absolute', left: handX, top: handY, transform: `scale(${handK})`, transformOrigin: 'left top'}}>
						<HandR size={300} />
						{frame >= CHAQUE ? (
							<div style={{position: 'absolute', left: 40, top: 60}}>
								<Swarm w={230} h={300} n={9} seed={9} size={46} tone={MINE} appear={fadeIn(frame, CHAQUE, 8)} gone={0.55 * jump} />
							</div>
						) : null}
					</div>
					{/* la loupe : sous le verre, la peau grossie et les microbes */}
					{lensIn > 0 && lensOut < 1 ? (
						<div style={{position: 'absolute', left: LENS.x - LENS.r + 420 * (1 - lensIn) + 500 * lensOut, top: LENS.y - LENS.r + 120 * (1 - lensIn)}}>
							<Loupe r={LENS.r}>
								<div style={{position: 'absolute', inset: 0, background: alpha(LPI.pink, 0.3)}} />
								<div style={{position: 'absolute', left: 14, top: 14}}>
									<Swarm w={LENS.r * 2 - 28} h={LENS.r * 2 - 28} n={14} seed={2} size={58} tone={MINE} appear={interpolate(frame, [PRES - 8, VOILA], [0, 1], clamp)} />
								</div>
							</Loupe>
						</div>
					) : null}
				</div>
				{/* titres : « Tes mains sont propres ? » (image 0) → « Pas si propres ! » → « Les 5 indications » */}
				{tA > 0 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, opacity: tA}}>
						<Title at={-60} text="Tes mains sont *propres* ?" size={92} />
					</div>
				) : null}
				{frame >= VOILA && tC < 1 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, opacity: 1 - tC}}>
						<Title at={VOILA} text="Pas si *propres* !" size={100} />
					</div>
				) : null}
				{tC > 0 ? (
					<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
						<Title at={CINQ2} text="Les *5* *indications*" size={100} stagger={3} />
						<div style={{marginTop: 6}}>
							<Title at={IND + 6} text="de l'hygiène des mains" size={64} brush={false} />
						</div>
					</div>
				) : null}
				{/* « tu ne vois absolument rien » */}
				{frame >= RIEN && frame < VOILA ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: fadeIn(frame, RIEN, 6)}}>
						<EyeIcon size={70} />
						<Pill at={RIEN} size={46} color={LPI.sky}>
							à l'œil nu : rien
						</Pill>
					</div>
				) : null}
				{frame >= MIL && frame < RIEN ? (
					<div style={{position: 'absolute', left: 72, top: 1040, width: 936, display: 'flex', justifyContent: 'center'}}>
						<Title at={MIL} text="des *milliers* de microbes…" size={60} />
					</div>
				) : null}
				{/* le patient arrive ; les microbes sautent de la main à son bras */}
				{shift > 0 ? (
					<div style={{position: 'absolute', left: 580, top: 560, opacity: shift, transform: `translateX(${120 * (1 - shift)}px)`}}>
						<Patient size={360} breath={0.5 - 0.5 * Math.cos(frame / 22)} />
						<div style={{position: 'absolute', left: 20, top: 250}}>
							<Swarm w={130} h={190} n={6} seed={21} size={40} tone={MINE} appear={jump} />
						</div>
					</div>
				) : null}
				{jump > 0 && jump < 1
					? [0, 1, 2, 3].map((i) => {
							const t = Math.min(1, Math.max(0, jump * 1.4 - i * 0.12));
							if (t <= 0 || t >= 1) return null;
							return (
								<div key={i} style={{position: 'absolute', left: handX + 120 + t * 90 + i * 10, top: handY + 120 + t * 130 - Math.sin(t * Math.PI) * 140 + i * 16}}>
									<Microbe size={44} tone={MINE[i % 2]} seed={i} />
								</div>
							);
						})
					: null}
				{/* STOP, puis les 5 moments */}
				{frame >= ARR ? (
					<div style={{position: 'absolute', left: 430, top: 560, transform: `scale(${popAt(frame, ARR)}) rotate(-8deg)`}}>
						<svg width={200} height={200} viewBox="-100 -100 200 200">
							<polygon points={Array.from({length: 8}, (_, i) => `${Math.cos(((i + 0.5) / 8) * Math.PI * 2) * 92},${Math.sin(((i + 0.5) / 8) * Math.PI * 2) * 92}`).join(' ')} fill={LPI.pink} stroke={N} strokeWidth={9} strokeLinejoin="round" />
							<text y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={52} fill={N}>
								STOP
							</text>
						</svg>
					</div>
				) : null}
				{frame >= CINQ ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', gap: 22}}>
						{[1, 2, 3, 4, 5].map((n, i) => (
							<div key={n} style={{width: 112, height: 112, borderRadius: 56, background: n <= 2 ? LPI.blue : LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: n <= 2 ? LPI.paper : N, transform: `scale(${popAt(frame, CINQ + i * 4)})`}}>
								{n}
							</div>
						))}
					</div>
				) : null}
				<Burst at={VOILA} x={540} y={760} r={420} n={16} />
				<Burst at={ARR} x={530} y={660} r={220} n={12} />
			</Camera>
			<Flash at={VOILA} />
			<Sfx name="whoosh" at={REG - 6} volume={0.06} />
			<Sfx name="impact" at={VOILA} volume={0.1} />
			<Sfx name="buzz" at={VOILA + 2} volume={0.04} dur={18} />
			<Sfx name="whoosh" at={CHAQUE - 4} volume={0.06} />
			<Sfx name="pop" at={PASSER + 4} volume={0.08} />
			<Sfx name="stamp" at={ARR} volume={0.1} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} name="pop" at={CINQ + i * 4} volume={0.07} />
			))}
			<Sfx name="whoosh" at={CINQ2} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA RÈGLE : 2 AVANT · 3 APRÈS ═══════════════════════════════ */
const RuleCard: React.FC<{x: number; at: number; tone: string; label: string; nums: number[]; numAt: number; children: React.ReactNode}> = ({x, at: t0, tone, label, nums, numAt, children}) => {
	const frame = useCurrentFrame();
	const p = popAt(frame, t0);
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 24, width: 430, height: 490, borderRadius: 40, background: LPI.paper, border: `7px solid ${tone}`, boxShadow: SHADOW, transform: `scale(${p})`}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 22, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, letterSpacing: '0.06em', color: tone === LPI.pink ? N : LPI.blue}}>{label}</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center', gap: 16}}>
				{nums.map((n, i) => (
					<div key={n} style={{width: 84, height: 84, borderRadius: 42, background: tone, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: tone === LPI.blue ? LPI.paper : N, transform: `translateY(${-200 * (1 - Math.min(1, popAt(frame, numAt + i * 4)))}px) scale(${popAt(frame, numAt + i * 4)})`}}>
						{n}
					</div>
				))}
			</div>
			{children}
		</div>
	);
};

export const Regle: React.FC = () => {
	const frame = useCurrentFrame();
	const RET = at('regle', 'retenir');
	const DEUX = at('regle', 'deux');
	const PROT = at('regle', 'protéger');
	const PAT = at('regle', 'patient');
	const TROIS = at('regle', 'trois');
	const PROT2 = at('regle', 'protéger', 2);
	const TOI = at('regle', 'toi');
	const ENV = at('regle', "l'environnement");
	const shield = (t: number, tone: string) =>
		frame >= t ? (
			<svg width={84} height={96} viewBox="0 0 84 96" style={{transform: `scale(${popAt(frame, t)})`}}>
				<path d="M42 6 L76 18 V46 C76 70 60 84 42 92 C24 84 8 70 8 46 V18 Z" fill={tone} stroke={N} strokeWidth={6} strokeLinejoin="round" />
				<path d="M26 48 L38 60 L58 36" fill="none" stroke={tone === LPI.blue ? LPI.paper : N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		) : null;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DEUX + 1, PROT + 1, TROIS + 1, PROT2 + 1, TOI + 1, ENV + 1]}>
				<Head kicker="Pour retenir" kAt={RET - 4} title="*2* avant · *3* après" tAt={RET} size={96} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={RET + 2} bumps={[DEUX, TROIS]}>
					<RuleCard x={20} at={DEUX - 2} tone={LPI.blue} label="AVANT" nums={[1, 2]} numAt={DEUX + 2}>
						<div style={{position: 'absolute', left: 30, top: 220}}>{frame >= PAT - 6 ? <div style={{opacity: fadeIn(frame, PAT - 6)}}><Patient size={150} mood="content" /></div> : null}</div>
						<div style={{position: 'absolute', left: 210, top: 250}}>{shield(PROT, LPI.blue)}</div>
						{frame >= PAT ? (
							<div style={{position: 'absolute', left: 190, top: 360, width: 220, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: N, opacity: fadeIn(frame, PAT)}}>
								protège le <span style={{color: LPI.blue}}>patient</span>
							</div>
						) : null}
					</RuleCard>
					<RuleCard x={486} at={TROIS - 2} tone={LPI.pink} label="APRÈS" nums={[3, 4, 5]} numAt={TROIS + 2}>
						<div style={{position: 'absolute', left: 30, top: 230}}>{shield(PROT2, LPI.pink)}</div>
						{frame >= TOI ? (
							<div style={{position: 'absolute', left: 130, top: 230, transform: `scale(${popAt(frame, TOI)})`}}>
								<Hand size={90} />
							</div>
						) : null}
						{frame >= ENV ? (
							<div style={{position: 'absolute', left: 230, top: 250, transform: `scale(${popAt(frame, ENV)})`}}>
								<Bed width={170} />
							</div>
						) : null}
						{frame >= TOI ? (
							<div style={{position: 'absolute', left: 30, top: 370, width: 380, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, lineHeight: 1.1, color: N, opacity: fadeIn(frame, TOI)}}>
								protège <span style={{background: alpha(LPI.pink, 0.45), borderRadius: 10, padding: '0 6px'}}>toi</span>
								{frame >= ENV ? <span style={{opacity: fadeIn(frame, ENV)}}> + l'environnement</span> : null}
							</div>
						) : null}
					</RuleCard>
				</Stage>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1140}}>
					<StepTracker current={0} at={DEUX} />
				</div>
			</Camera>
			<Sfx name="pop" at={DEUX - 2} volume={0.1} />
			<Sfx name="pop" at={TROIS - 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · AVANT DE TOUCHER LE PATIENT ═══════════════════════════════ */
const SourceIcon: React.FC<{kind: 'porte' | 'poignee' | 'tel'}> = ({kind}) => (
	<svg width={70} height={70} viewBox="0 0 100 100">
		{kind === 'porte' ? (
			<>
				<rect x={26} y={10} width={48} height={82} rx={6} fill={LPI.blue} stroke={N} strokeWidth={6} />
				<circle cx={62} cy={54} r={6} fill={LPI.paper} stroke={N} strokeWidth={3} />
			</>
		) : kind === 'poignee' ? (
			<>
				<rect x={24} y={26} width={22} height={50} rx={8} fill={LPI.sky} stroke={N} strokeWidth={6} />
				<path d="M36 40 H84" stroke={N} strokeWidth={14} strokeLinecap="round" />
				<path d="M36 40 H84" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" />
			</>
		) : (
			<>
				<rect x={28} y={8} width={44} height={84} rx={10} fill={N} />
				<rect x={34} y={18} width={32} height={58} rx={4} fill={LPI.sky} />
				<circle cx={50} cy={84} r={4} fill={LPI.paper} />
			</>
		)}
	</svg>
);

export const Un: React.FC = () => {
	const frame = useCurrentFrame();
	const AV = at('un', 'avant');
	const TOU = at('un', 'toucher');
	const PAT = at('un', 'patient');
	const COU = at('un', 'couloir');
	const POI = at('un', 'poignées');
	const TEL = at('un', 'téléphone');
	const ELL = at('un', 'elles');
	const DOI = at('un', 'doivent');
	const RIEN = at('un', 'rien');
	const APP = at('un', 'apporter');
	const hx = interpolate(frame, [AV - 2, TOU + 2, PAT + 4, PAT + 14, APP - 4, APP + 10], [130, 330, 330, 130, 130, 440], ease);
	const sources: [number, 'porte' | 'poignee' | 'tel', string][] = [
		[COU, 'porte', 'couloir'],
		[POI, 'poignee', 'poignée'],
		[TEL, 'tel', 'téléphone'],
	];
	const dirt = interpolate(frame, [COU + 4, COU + 12, POI + 4, POI + 12, TEL + 4, TEL + 12], [0, 0.34, 0.34, 0.67, 0.67, 1], clamp);
	const gone = interpolate(frame, [RIEN - 2, RIEN + 12], [0, 1], clamp);
	return (
		<Indication n={1} when="AVANT" kAt={at('un', 'un') - 4} title="Avant de toucher le *patient*" whenAt={AV} protects="le patient" pAt={PAT} punches={[COU + 1, POI + 1, TEL + 1, RIEN + 1, APP + 1]} bumps={[TOU, RIEN]}>
			<div style={{position: 'absolute', left: 600, top: 60}}>
				<Patient size={280} breath={0.5 - 0.5 * Math.cos(frame / 22)} mood={frame >= APP + 8 ? 'content' : 'calme'} />
			</div>
			{/* d'où viennent les microbes */}
			{sources.map(([t, kind, label], i) =>
				frame >= t - 2 ? (
					<div key={kind} style={{position: 'absolute', left: 30 + i * 140, top: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, t - 2)})`, opacity: 1 - gone}}>
						<div style={{width: 104, height: 104, borderRadius: 52, background: LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>
							<SourceIcon kind={kind} />
						</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N, marginTop: 4}}>{label}</div>
					</div>
				) : null,
			)}
			{sources.map(([t], i) =>
				[0, 1].map((j) => {
					const k = interpolate(frame, [t + 2 + j * 3, t + 14 + j * 3], [0, 1], clamp);
					if (k <= 0 || k >= 1) return null;
					return (
						<div key={`${i}${j}`} style={{position: 'absolute', left: 80 + i * 140 + (hx + 60 - 80 - i * 140) * k, top: 120 + (300 - 120) * k - Math.sin(k * Math.PI) * 80}}>
							<Microbe size={38} tone={MINE[j]} seed={i + j} />
						</div>
					);
				}),
			)}
			{/* la main */}
			<div style={{position: 'absolute', left: hx, top: 230}}>
				<HandR size={180} />
				<div style={{position: 'absolute', left: 20, top: 30}}>
					<Swarm w={140} h={180} n={9} seed={11} size={38} tone={MINE} appear={dirt} gone={gone} />
				</div>
			</div>
			<Sparkles at={RIEN + 4} x={hx + 90} y={340} r={130} />
			<ShaPump at={ELL} press={DOI} x={10} y={300} size={110} />
			<StagePill from={RIEN + 6} x={30} y={470} color={LPI.sky}>
				mains désinfectées ✓
			</StagePill>
			<Sfx name="pop" at={COU} volume={0.07} />
			<Sfx name="pop" at={POI} volume={0.07} />
			<Sfx name="pop" at={TEL} volume={0.07} />
			<Sfx name="whoosh" at={DOI} volume={0.06} />
			<Sfx name="ding" at={RIEN + 4} volume={0.06} />
		</Indication>
	);
};

/* ═══════════════════════════════ 2 · AVANT UN GESTE ASEPTIQUE ═══════════════════════════════ */
const MiniChip: React.FC<{at: number; icon: React.ReactNode; label: string}> = ({at: t0, icon, label}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 10, height: 76, padding: '0 22px 0 8px', borderRadius: 999, background: LPI.paper, border: `4px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{width: 60, height: 60, borderRadius: 30, background: alpha(LPI.sky, 0.8), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
			{label}
		</div>
	);
};
const TubeIcon: React.FC = () => (
	<svg width={44} height={44} viewBox="0 0 100 100">
		<path d="M20 20 C70 10 80 50 50 60 C20 70 30 92 82 86" fill="none" stroke={N} strokeWidth={16} strokeLinecap="round" />
		<path d="M20 20 C70 10 80 50 50 60 C20 70 30 92 82 86" fill="none" stroke={LPI.paper} strokeWidth={6} strokeLinecap="round" />
	</svg>
);

export const Deux: React.FC = () => {
	const frame = useCurrentFrame();
	const AV = at('deux', 'avant');
	const ASE = at('deux', 'aseptique');
	const CAD = at('deux', "c'est-à-dire");
	const ENT = at('deux', 'entre');
	const INJ = at('deux', 'injection');
	const PANS = at('deux', 'pansement');
	const SON = at('deux', 'sonde');
	const AUC = at('deux', 'aucun');
	const ENTR = at('deux', 'entrer');
	const MEME = at('deux', 'même');
	const SIENS = at('deux', 'siens');
	const ARM_W = 760;
	const ax = 88;
	const ay = 150;
	const k = ARM_W / 900;
	const ex = ax + ARM_PT.point[0] * k;
	const ey = ay + ARM_PT.point[1] * k;
	const needle = interpolate(frame, [INJ, INJ + 12], [0, 1], ease);
	const attack = interpolate(frame, [AUC - 4, ENTR + 2], [0, 1], ease);
	const bounce = interpolate(frame, [ENTR + 2, ENTR + 14], [0, 1], ease);
	const swarmAt = (side: -1 | 1, i: number) => {
		const d = 210 - 120 * attack + 90 * bounce;
		const ang = (side < 0 ? Math.PI : 0) + (i - 1.5) * 0.35;
		return {x: ex + Math.cos(ang) * d - 22, y: ey - 30 + Math.sin(ang) * d * 0.5 - 22};
	};
	const shield = fadeIn(frame, ENTR - 2, 6);
	return (
		<Indication n={2} when="AVANT" kAt={at('deux', 'deux') - 4} title="Avant un geste *aseptique*" whenAt={AV} protects="le patient" pAt={ENT} punches={[ASE + 1, INJ + 1, PANS + 1, SON + 1, ENTR + 1, SIENS + 1]} bumps={[INJ, ENTR]}>
			<div style={{position: 'absolute', left: 20, top: 18, display: 'flex', gap: 16}}>
				<MiniChip at={INJ - 2} icon={<SyringeIcon size={46} />} label="injection" />
				<MiniChip at={PANS - 2} icon={<Plaster size={52} />} label="pansement" />
				<MiniChip at={SON - 2} icon={<TubeIcon />} label="sonde" />
			</div>
			<div style={{position: 'absolute', left: ax, top: ay}}>
				<Arm width={ARM_W} needle={needle} />
			</div>
			{/* les microbes veulent entrer par le point de ponction : les tiens (rose) et les siens (bleu clair) */}
			{frame >= AUC - 6
				? [-1, 1].map((side) =>
						[0, 1, 2, 3].map((i) => {
							const p = swarmAt(side as -1 | 1, i);
							return (
								<div key={`${side}${i}`} style={{position: 'absolute', left: p.x, top: p.y, opacity: fadeIn(frame, AUC - 6 + i * 2, 6)}}>
									<Microbe size={44} tone={side < 0 ? LPI.pink : LPI.sky} seed={i + (side > 0 ? 9 : 0)} />
								</div>
							);
						}),
					)
				: null}
			{shield > 0 ? (
				<svg width={200} height={200} viewBox="-100 -100 200 200" style={{position: 'absolute', left: ex - 100, top: ey - 130, opacity: shield, transform: `scale(${0.6 + 0.4 * popAt(frame, ENTR - 2)})`}}>
					<circle r={86} fill={alpha(LPI.paper, 0.35)} stroke={LPI.blue} strokeWidth={10} strokeDasharray="18 12" />
					<path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke={LPI.pink} strokeWidth={16} strokeLinecap="round" />
				</svg>
			) : null}
			<StagePill from={CAD} to={AUC - 4} x={30} y={460} color={LPI.sky}>
				= un soin qui entre dans le corps
			</StagePill>
			<StagePill from={AUC} to={MEME} x={30} y={460} color={LPI.pink}>
				aucun microbe ne doit entrer
			</StagePill>
			<StagePill from={MEME} x={420} y={460} color={LPI.sky}>
				même les siens (sa peau)
			</StagePill>
			<Sfx name="pop" at={INJ - 2} volume={0.07} />
			<Sfx name="pop" at={PANS - 2} volume={0.07} />
			<Sfx name="pop" at={SON - 2} volume={0.07} />
			<Sfx name="impact" at={ENTR} volume={0.08} />
		</Indication>
	);
};

/* ═══════════════════════════════ 3 · APRÈS UN LIQUIDE BIOLOGIQUE ═══════════════════════════════ */
export const Trois: React.FC = () => {
	const frame = useCurrentFrame();
	const AP = at('trois', 'après');
	const LIQ = at('trois', 'liquide');
	const SANG = at('trois', 'sang');
	const URI = at('trois', 'urines');
	const SAL = at('trois', 'salive');
	const GANTS = at('trois', 'gants');
	const RET = at('trois', 'retires');
	const DES = at('trois', 'désinfectes');
	const drops: [number, string, string][] = [
		[SANG, LPI.pink, 'sang'],
		[URI, LPI.sky, 'urines'],
		[SAL, LPI.paper, 'salive'],
	];
	const off = interpolate(frame, [RET, RET + 14], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const clean = interpolate(frame, [DES - 2, DES + 12], [0, 1], clamp);
	const gPulse = frame >= GANTS ? 1 + 0.06 * Math.exp(-(frame - GANTS) / 6) * Math.sin((frame - GANTS) / 1.5) : 1;
	return (
		<Indication n={3} when="APRÈS" kAt={at('trois', 'trois') - 4} title="Après un *liquide* *biologique*" whenAt={AP} protects="toi + l'environnement" pAt={GANTS} punches={[SANG + 1, URI + 1, SAL + 1, RET + 1, DES + 1]} bumps={[SANG, RET]}>
			{/* la main nue (dessous) puis le gant qui s'en va */}
			<div style={{position: 'absolute', left: 110, top: 110}}>
				<Hand size={240} />
				{frame >= RET ? (
					<div style={{position: 'absolute', left: 40, top: 50}}>
						<Swarm w={170} h={200} n={4} seed={31} size={40} tone={MINE} appear={fadeIn(frame, RET + 6, 8)} gone={clean} />
					</div>
				) : null}
				{off < 1 ? (
					<div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${off * 340}px) rotate(${off * 18}deg) scale(${gPulse})`, opacity: 1 - off}}>
						<Hand size={240} gloved={1} />
						{drops.map(([t, tone], i) =>
							frame >= t + 10 ? (
								<div key={i} style={{position: 'absolute', left: 60 + i * 44, top: 90 + (i % 2) * 50, width: 46, height: 34, borderRadius: '50%', background: tone, border: `4px solid ${N}`, transform: `scale(${popAt(frame, t + 10)})`}} />
							) : null,
						)}
					</div>
				) : null}
			</div>
			{/* les gouttes arrivent, une par liquide */}
			{drops.map(([t, tone, label], i) => {
				const k = interpolate(frame, [t - 2, t + 10], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
				return (
					<React.Fragment key={label}>
						{k > 0 && k < 1 ? (
							<div style={{position: 'absolute', left: 820 - 600 * k + i * 20, top: 60 + 120 * k + i * 30 - Math.sin(k * Math.PI) * 60}}>
								<Drop size={50} tone={tone} />
							</div>
						) : null}
						{frame >= t ? (
							<div style={{position: 'absolute', left: 560, top: 60 + i * 100, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${popAt(frame, t)})`, transformOrigin: 'left center'}}>
								<Drop size={44} tone={tone} />
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{label}</span>
							</div>
						) : null}
					</React.Fragment>
				);
			})}
			<Sparkles at={DES + 4} x={230} y={260} r={140} />
			<ShaPump at={DES - 8} press={DES} x={600} y={320} size={110} />
			<StagePill from={LIQ} to={SANG - 2} x={30} y={460} color={LPI.pink}>
				liquide biologique
			</StagePill>
			<StagePill from={GANTS} to={RET} x={30} y={460} color={LPI.sky}>
				même avec des gants
			</StagePill>
			<StagePill from={RET + 4} x={30} y={460} color={LPI.pink}>
				gants retirés → mains désinfectées
			</StagePill>
			{drops.map(([t]) => (
				<Sfx key={t} name="pop" at={t + 8} volume={0.07} />
			))}
			<Sfx name="whoosh" at={RET} volume={0.06} />
			<Sfx name="ding" at={DES + 4} volume={0.06} />
		</Indication>
	);
};

/* ═══════════════════════════════ 4 · APRÈS AVOIR TOUCHÉ LE PATIENT ═══════════════════════════════ */
export const Quatre: React.FC = () => {
	const frame = useCurrentFrame();
	const AP = at('quatre', 'après');
	const TOU = at('quatre', 'touché');
	const PAT = at('quatre', 'patient');
	const PRO = at('quatre', 'protéger');
	const TOI = at('quatre', 'toi');
	const TOUS = at('quatre', 'tous');
	const SUIV = at('quatre', 'suivants');
	const hx = interpolate(frame, [AP - 2, TOU + 2, PAT + 8, PAT + 20], [520, 270, 270, 470], ease);
	const pick = interpolate(frame, [TOU, TOU + 16], [0, 1], clamp);
	const clean = interpolate(frame, [SUIV + 6, SUIV + 18], [0, 1], clamp);
	return (
		<Indication n={4} when="APRÈS" kAt={at('quatre', 'quatre') - 4} title="Après avoir touché le *patient*" whenAt={AP} protects="toi + les autres patients" pAt={PRO} punches={[TOU + 1, TOI + 1, TOUS + 1, SUIV + 1]} bumps={[TOU, SUIV]}>
			<div style={{position: 'absolute', left: 30, top: 50}}>
				<Patient size={280} breath={0.5 - 0.5 * Math.cos(frame / 22)} />
				<div style={{position: 'absolute', left: 170, top: 150}}>
					<Swarm w={110} h={150} n={5} seed={41} size={38} tone={HIS} appear={fadeIn(frame, AP, 10)} gone={0.5 * pick} />
				</div>
			</div>
			<div style={{position: 'absolute', left: hx, top: 120}}>
				<Hand size={170} />
				<div style={{position: 'absolute', left: 16, top: 30}}>
					<Swarm w={130} h={160} n={6} seed={43} size={38} tone={HIS} appear={pick} gone={clean} />
				</div>
			</div>
			{frame >= TOI ? (
				<div style={{position: 'absolute', left: 520, top: 40, transform: `scale(${popAt(frame, TOI)})`}}>
					<Pill at={TOI} size={44} color={LPI.pink}>
						toi, le soignant
					</Pill>
				</div>
			) : null}
			{/* les patients suivants */}
			{[0, 1, 2].map((i) =>
				frame >= TOUS + i * 4 ? (
					<div key={i} style={{position: 'absolute', left: 560 + i * 125, top: 300, transform: `scale(${popAt(frame, TOUS + i * 4)})`}}>
						<Patient size={110} mood={frame >= SUIV + 10 ? 'content' : 'calme'} />
						{frame >= SUIV + 10 ? (
							<svg width={50} height={50} viewBox="0 0 40 40" style={{position: 'absolute', left: 30, top: -40, transform: `scale(${popAt(frame, SUIV + 10 + i * 3)})`}}>
								<circle cx={20} cy={20} r={19} fill={LPI.blue} />
								<path d="M11 21 L17.5 27 L29 14" fill="none" stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						) : null}
					</div>
				) : null,
			)}
			<ShaPump at={SUIV - 2} press={SUIV + 4} x={400} y={330} size={100} />
			<Sparkles at={SUIV + 10} x={hx + 85} y={230} r={120} />
			<Sfx name="pop" at={TOU + 2} volume={0.07} />
			<Sfx name="ding" at={SUIV + 10} volume={0.06} />
		</Indication>
	);
};

/* ═══════════════════════════════ 5 · APRÈS SON ENVIRONNEMENT ═══════════════════════════════ */
export const Cinq: React.FC = () => {
	const frame = useCurrentFrame();
	const AP = at('cinq', 'après');
	const ENV = at('cinq', 'environnement');
	const LIT = at('cinq', 'lit');
	const TAB = at('cinq', 'table');
	const POM = at('cinq', 'pompe');
	const MEME = at('cinq', 'même');
	const TOU2 = at('cinq', 'touché', 2);
	const LUI = at('cinq', 'lui');
	// la main touche le lit, la table, la pompe
	const hxy = (f: number) => ({
		x: interpolate(f, [LIT - 6, LIT + 4, TAB - 6, TAB + 4, POM - 6, POM + 4, MEME, MEME + 12], [460, 430, 430, 730, 730, 120, 120, 460], ease),
		y: interpolate(f, [LIT - 6, LIT + 4, TAB - 6, TAB + 4, POM - 6, POM + 4, MEME, MEME + 12], [330, 190, 190, 210, 210, 130, 130, 300], ease),
	});
	const h = hxy(frame);
	const dirt = interpolate(frame, [LIT + 4, LIT + 10, TAB + 4, TAB + 10, POM + 4, POM + 10], [0, 0.34, 0.34, 0.67, 0.67, 1], clamp);
	const clean = interpolate(frame, [LUI + 4, LUI + 16], [0, 1], clamp);
	const glow = (t: number) => (frame >= t - 2 && frame < t + 18 ? 1 + 0.06 * Math.sin((frame - t) / 2) : 1);
	const label = (t: number, text: string, x: number, y: number) =>
		frame >= t - 2 ? (
			<div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, t - 2)})`}}>
				<Pill at={t - 2} size={36} color={LPI.sky}>
					{text}
				</Pill>
			</div>
		) : null;
	return (
		<Indication n={5} when="APRÈS" kAt={at('cinq', 'cinq') - 4} title="Après son *environnement*" whenAt={AP} protects="toi + l'environnement" pAt={ENV} punches={[LIT + 1, TAB + 1, POM + 1, TOU2 + 1, LUI + 1]} bumps={[ENV, LUI]}>
			{frame >= ENV - 2 ? (
				<div style={{position: 'absolute', left: 14, top: 14, width: 906, height: 510, borderRadius: 40, border: `6px dashed ${alpha(LPI.blue, 0.7)}`, opacity: fadeIn(frame, ENV - 2)}} />
			) : null}
			<div style={{position: 'absolute', left: 40, top: 150, transform: `scale(${glow(POM)})`}}>
				<IvPump width={140} />
			</div>
			<div style={{position: 'absolute', left: 240, top: 250, transform: `scale(${glow(LIT)})`}}>
				<Bed width={420} rail={frame >= LIT ? 1 : 0} />
			</div>
			<div style={{position: 'absolute', left: 700, top: 290, transform: `scale(${glow(TAB)})`}}>
				<BedTable width={150} />
			</div>
			{label(LIT, 'son lit', 380, 470)}
			{label(TAB, 'sa table', 700, 470)}
			{label(POM, 'sa pompe', 40, 470)}
			{/* le patient, qu'on n'a pas touché */}
			{frame >= MEME - 2 ? (
				<div style={{position: 'absolute', left: 740, top: 40, transform: `scale(${popAt(frame, MEME - 2)})`}}>
					<Patient size={120} />
					{frame >= TOU2 ? (
						<div style={{position: 'absolute', left: -50, top: 172, whiteSpace: 'nowrap', transform: `scale(${popAt(frame, TOU2)})`}}>
							<Pill at={TOU2} size={32} color={LPI.pink}>
								pas touché
							</Pill>
						</div>
					) : null}
				</div>
			) : null}
			<div style={{position: 'absolute', left: h.x, top: h.y}}>
				<Hand size={120} />
				<div style={{position: 'absolute', left: 10, top: 20}}>
					<Swarm w={100} h={120} n={6} seed={51} size={32} tone={HIS} appear={dirt} gone={clean} />
				</div>
			</div>
			{frame >= ENV ? (
				<div style={{position: 'absolute', left: 40, top: 30, transform: `scale(${popAt(frame, ENV)})`, transformOrigin: 'left center'}}>
					<Pill at={ENV} size={40} color={LPI.blue}>
						son environnement
					</Pill>
				</div>
			) : null}
			<ShaPump at={LUI - 4} press={LUI + 2} x={540} y={50} size={100} />
			<Sparkles at={LUI + 8} x={h.x + 60} y={h.y + 80} r={110} />
			<Sfx name="pop" at={LIT} volume={0.07} />
			<Sfx name="pop" at={TAB} volume={0.07} />
			<Sfx name="pop" at={POM} volume={0.07} />
			<Sfx name="ding" at={LUI + 8} volume={0.06} />
		</Indication>
	);
};

/* ═══════════════════════════════ LE BON GESTE ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const frame = useCurrentFrame();
	const BON = at('geste', 'bon');
	const FRI = at('geste', 'friction');
	const SOL = at('geste', 'solution');
	const PEN = at('geste', 'pendant');
	const VIN = at('geste', 'vingt');
	const SEC = at('geste', 'secondes');
	const JUS = at('geste', "jusqu'à");
	const SECH = at('geste', 'sèches');
	const VIS = at('geste', 'visiblement');
	const SAL = at('geste', 'sales');
	const EAU = at('geste', "l'eau");
	const SAV = at('geste', 'savon');
	const rub = frame >= FRI && frame < SECH + 6 ? 1 : 0;
	const a = frame / 3;
	const timer = interpolate(frame, [VIN - 2, SEC + 14], [0, 1], ease);
	const wet = interpolate(frame, [SOL + 8, SOL + 14, JUS, SECH + 4], [0, 1, 1, 0], clamp);
	const dirty = fadeIn(frame, SAL - 2, 8);
	const watchOut = fadeIn(frame, VIS - 4, 8);
	const tap = popAt(frame, EAU - 4);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[FRI + 1, SOL + 1, VIN + 1, SECH + 1, SAL + 1, EAU + 1, SAV + 1]}>
				<Head kicker="Le bon geste" kAt={BON - 4} title="La *friction* hydro-alcoolique" tAt={BON} size={74} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={BON + 2} bumps={[SOL, SECH, SAL]}>
					<ShaPump at={FRI - 2} press={SOL} x={30} y={150} size={150} />
					{/* les deux mains qui frottent */}
					<div style={{position: 'absolute', left: 250, top: 120}}>
						<div style={{position: 'absolute', left: 0 + Math.cos(a) * 24 * rub, top: Math.sin(a) * 18 * rub}}>
							<Hand size={200} />
						</div>
						<div style={{position: 'absolute', left: 120 - Math.cos(a) * 24 * rub, top: 20 - Math.sin(a) * 18 * rub}}>
							<HandR size={200} />
						</div>
						{wet > 0
							? Array.from({length: 7}, (_, i) => (
									<div key={i} style={{position: 'absolute', left: 40 + rnd(i + 2) * 220, top: 60 + rnd(i + 7) * 180 - (1 - wet) * 30, opacity: wet, transform: 'scale(0.4)'}}>
										<Drop size={40} tone={LPI.sky} />
									</div>
								))
							: null}
						{dirty > 0
							? Array.from({length: 6}, (_, i) => (
									<div key={i} style={{position: 'absolute', left: 50 + rnd(i + 21) * 220, top: 80 + rnd(i + 27) * 180, width: 40 + rnd(i) * 26, height: 26 + rnd(i + 3) * 18, borderRadius: '50%', background: alpha(N, 0.45), opacity: dirty}} />
								))
							: null}
					</div>
					<Sparkles at={SECH} x={400} y={260} r={160} />
					{watchOut < 1 && frame >= PEN - 2 ? (
						<div style={{position: 'absolute', left: 660, top: 70, opacity: 1 - watchOut, transform: `scale(${popAt(frame, PEN - 2) * 0.8})`, transformOrigin: 'left top'}}>
							<Stopwatch progress={timer} count={Math.round(timer * 30)} size={300} label="secondes" />
						</div>
					) : null}
					{frame >= EAU - 4 ? (
						<div style={{position: 'absolute', left: 620, top: 150, transform: `scale(${tap})`}}>
							<Faucet width={290} flow={fadeIn(frame, EAU, 6)} soap={fadeIn(frame, SAV - 2, 6)} />
						</div>
					) : null}
					<StagePill from={SOL} to={PEN} x={30} y={470} color={LPI.sky}>
						SHA = solution hydro-alcoolique
					</StagePill>
					<StagePill from={SAL} x={30} y={470} color={LPI.pink}>
						mains sales → eau + savon
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1010, display: 'flex', flexDirection: 'column', gap: 18}}>
					<CheckChip at={SOL + 4} label="friction à la SHA" />
					<CheckChip at={SEC} label="20 à 30 secondes" />
					<CheckChip at={SECH} label="jusqu'à mains sèches" />
				</div>
			</Camera>
			<Sfx name="whoosh" at={SOL} volume={0.06} />
			<Sfx name="tick" at={VIN} volume={0.07} />
			<Sfx name="ding" at={SECH} volume={0.06} />
			<Sfx name="pop" at={EAU - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="*2* avant · *3* après"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'moments') + 6}
		rows={[
			[at('outro', 'avant', 2), 'check', '1 · Avant le patient', 'protège-le'],
			[at('outro', 'avant', 3), 'check', '2 · Avant un geste aseptique', null],
			[at('outro', 'après', 2), 'alert', '3 · Après un liquide biologique', null],
			[at('outro', 'après', 3), 'alert', '4 · Après le patient', 'protège-toi'],
			[at('outro', 'après', 4), 'alert', '5 · Après son environnement', null],
		]}
	/>
);
