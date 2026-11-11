// Scènes de « Les précautions standard » (SF2H 2017) : chaque mouvement part d'un mot de la voix (`npm run cues`).
// Accroche « deux patients : lequel peut te contaminer ? les deux ! », puis « 6 réflexes pour tous les patients », un
// réflexe par scène (même gabarit : titre, socle illustré, pastille du terme, suivi des 6 en bas), récap.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Head, LAY, Pill, RecapScene, StagePill} from '../../brand/episode';
import {Bed, BedTable, Drop, IvPump, Microbe, Sparkles, Swarm} from '../../brand/hands';
import {EyeIcon} from '../../brand/icons';
import {CheckChip, Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {ApronShape, Bedpan, Bin, CoughSpray, LaundryBag, NeedleCap, REFLEXES, ReflexIcon, ReflexTracker, RingShape, ShowerHead, SprayBottle, Syringe, Tissue, WatchShape, Wear} from '../../brand/precautions';
import {AntisepticBottle, DasriBag, Hand, ShaBottle, SharpsBox} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
const breathe = (frame: number) => 0.5 - 0.5 * Math.cos(frame / 22);

/** Flash plein écran (choc) qui retombe. */
const Flash: React.FC<{at: number}> = ({at: t0}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [t0, t0 + 2, t0 + 16], [0, 0.5, 0], clamp);
	if (o <= 0) return null;
	return <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${alpha(LPI.pink, o * 0.4)} 20%, ${alpha(LPI.pink, o)} 100%)`}} />;
};

/** Pastille ronde (« ? » / « ! ») qui tangue. */
const Badge: React.FC<{at: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({at: t0, x, y, text, tone = LPI.pink, size = 120}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.72, color: N, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`}}>
			{text}
		</div>
	);
};

/** Bouclier coché (« protège »). */
const Shield: React.FC<{at: number; tone?: string; size?: number}> = ({at: t0, tone = LPI.blue, size = 90}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<svg width={size} height={size * 1.14} viewBox="0 0 84 96" style={{transform: `scale(${popAt(frame, t0)})`}}>
			<path d="M42 6 L76 18 V46 C76 70 60 84 42 92 C24 84 8 70 8 46 V18 Z" fill={tone} stroke={N} strokeWidth={6} strokeLinejoin="round" />
			<path d="M26 48 L38 60 L58 36" fill="none" stroke={tone === LPI.blue ? LPI.paper : N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};

/** Gabarit d'un réflexe : titre, socle, pastille du terme (facultative), suivi des 6. */
const Reflex: React.FC<{n: number; kAt: number; title: string; punches: number[]; bumps?: number[]; term?: React.ReactNode; termAt?: number; children: React.ReactNode}> = ({n, kAt, title, punches, bumps = [], term, termAt = 0, children}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[kAt + 1, ...punches]}>
				<Head kicker={`Réflexe ${n}`} kAt={kAt} title={title} tAt={kAt + 3} size={80} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={kAt + 4} bumps={bumps}>
					{children}
				</Stage>
				{term && frame >= termAt ? (
					<div style={{position: 'absolute', left: 72, top: 1012, transform: `scale(${popAt(frame, termAt)})`, transformOrigin: 'left center'}}>
						<Pill at={termAt} size={40} color={LPI.sky}>
							{term}
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 0, right: 0, top: 1110}}>
					<ReflexTracker current={n} at={kAt} />
				</div>
			</Camera>
		</AbsoluteFill>
	);
};

/** Ligne « équipement → quand » (icône ronde, nom, condition). */
const GearRow: React.FC<{at: number; y: number; icon: React.ReactNode; name: string; when: string}> = ({at: t0, y, icon, name, when}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 400, top: y, width: 520, display: 'flex', alignItems: 'center', gap: 16, opacity: fadeIn(frame, t0, 6), transform: `translateX(${(1 - popAt(frame, t0)) * 60}px)`}}>
			<div style={{width: 96, height: 96, flex: 'none', borderRadius: 48, background: LPI.paper, border: `5px solid ${LPI.blue}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>{icon}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, lineHeight: 1.05}}>
				{name}
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 28, color: alpha(N, 0.65), marginTop: 4}}>{when}</div>
			</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : deux patients côte à côte + « Lequel peut te contaminer ? ». L'un tousse (gouttelettes), l'autre est en pleine
// forme ; « ? » au-dessus de chacun ; « Les deux ! » : des microbes sur les deux (flash, secousse) ; « impossible de le
// voir » : œil ; « mêmes règles » : un même bouclier sur chacun ; titre « Les précautions standard ».
const PL = {x: 60, y: 520, size: 400};
const PR = {x: 620, y: 520, size: 400};
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUSSE = at('intro', 'tousse');
	const FORME = at('intro', 'forme');
	const LEQUEL = at('intro', 'lequel');
	const MICROBE = at('intro', 'microbe');
	const DEUX = at('intro', 'deux', 2);
	const IMP = at('intro', 'impossible');
	const TOUT = at('intro', 'tout');
	const MEMES = at('intro', 'mêmes');
	const REGLES = at('intro', 'règles');
	const PREC = at('intro', 'précautions');
	const tA = interpolate(frame, [DEUX - 2, DEUX + 4], [1, 0], clamp);
	const tC = fadeIn(frame, PREC - 2, 6);
	const reveal = fadeIn(frame, DEUX, 10);
	const same = fadeIn(frame, TOUT - 2, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TOUSSE + 1, FORME + 1, LEQUEL + 1, MICROBE + 1, IMP + 1, TOUT + 1, MEMES + 1, PREC + 1]} shakes={[DEUX + 2]} strength={0.04}>
				{/* les deux patients */}
				<div style={{position: 'absolute', left: PL.x, top: PL.y}}>
					<Patient size={PL.size} mood={frame >= TOUSSE ? 'mal' : 'calme'} breath={breathe(frame)} sweat={fadeIn(frame, TOUSSE, 10) * 0.5} />
					<CoughSpray size={PL.size} at={TOUSSE} until={DEUX + 10} dir={1} />
					<div style={{position: 'absolute', left: 60, top: 180}}>
						<Swarm w={260} h={300} n={8} seed={3} size={46} tone={[LPI.pink, LPI.blue]} appear={reveal} />
					</div>
				</div>
				<div style={{position: 'absolute', left: PR.x, top: PR.y}}>
					<Patient size={PR.size} mood={frame >= FORME - 4 ? 'content' : 'calme'} breath={breathe(frame + 30)} />
					<div style={{position: 'absolute', left: 60, top: 180}}>
						<Swarm w={260} h={300} n={8} seed={8} size={46} tone={[LPI.pink, LPI.blue]} appear={reveal} />
					</div>
				</div>
				<Sparkles at={FORME - 2} x={PR.x + 200} y={PR.y + 120} r={170} />
				{frame >= FORME - 2 && frame < DEUX ? (
					<div style={{position: 'absolute', left: PR.x + 30, top: PR.y + 520, transform: `scale(${popAt(frame, FORME - 2)})`}}>
						<Pill at={FORME - 2} size={34} color={LPI.sky}>
							en pleine forme
						</Pill>
					</div>
				) : null}
				{frame >= TOUSSE && frame < DEUX ? (
					<div style={{position: 'absolute', left: PL.x + 90, top: PL.y + 520, transform: `scale(${popAt(frame, TOUSSE)})`}}>
						<Pill at={TOUSSE} size={34} color={LPI.pink}>
							il tousse
						</Pill>
					</div>
				) : null}
				{/* « ? » puis « ! » au-dessus de chacun */}
				{frame < DEUX ? (
					<>
						<Badge at={LEQUEL} x={PL.x + 280} y={PL.y - 40} text="?" />
						<Badge at={LEQUEL + 6} x={PR.x + 280} y={PR.y - 40} text="?" />
					</>
				) : (
					<>
						<Badge at={DEUX} x={PL.x + 280} y={PL.y - 40} text="!" />
						<Badge at={DEUX + 3} x={PR.x + 280} y={PR.y - 40} text="!" />
					</>
				)}
				{/* « impossible de le voir » */}
				{frame >= IMP && frame < TOUT ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: fadeIn(frame, IMP, 6)}}>
						<EyeIcon size={76} />
						<Pill at={IMP} size={46} color={LPI.sky}>
							invisible à l'œil nu
						</Pill>
					</div>
				) : null}
				{/* « tout patient, à chaque soin : les mêmes règles » */}
				{same > 0 ? (
					<>
						<div style={{position: 'absolute', left: 40, top: 470, width: 1000, height: 640, borderRadius: 50, border: `7px dashed ${alpha(LPI.blue, 0.75)}`, opacity: same}} />
						<div style={{position: 'absolute', left: PL.x + 150, top: PL.y + 330}}>
							<Shield at={MEMES} size={110} />
						</div>
						<div style={{position: 'absolute', left: PR.x + 150, top: PR.y + 330}}>
							<Shield at={MEMES + 4} size={110} />
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
							<Pill at={REGLES} size={52} color={LPI.blue}>
								mêmes règles pour tous
							</Pill>
						</div>
					</>
				) : null}
				{/* titres */}
				{tA > 0 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, opacity: tA}}>
						<Title at={-60} text="Lequel peut te *contaminer* ?" size={90} />
					</div>
				) : null}
				{frame >= DEUX && tC < 1 ? (
					<div style={{position: 'absolute', left: 72, top: 236, width: 936, opacity: 1 - tC}}>
						<Title at={DEUX} text="*Les* *deux* !" size={124} stagger={4} />
					</div>
				) : null}
				{tC > 0 ? (
					<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
						<Title at={PREC} text="Les précautions *standard*" size={96} stagger={3} />
					</div>
				) : null}
				<Burst at={DEUX} x={540} y={780} r={460} n={16} />
			</Camera>
			<Flash at={DEUX} />
			<Sfx name="buzz" at={TOUSSE} volume={0.04} dur={14} />
			<Sfx name="pop" at={LEQUEL} volume={0.1} />
			<Sfx name="pop" at={LEQUEL + 6} volume={0.1} />
			<Sfx name="impact" at={DEUX} volume={0.1} />
			<Sfx name="whoosh" at={TOUT - 2} volume={0.06} />
			<Sfx name="pop" at={MEMES} volume={0.09} />
			<Sfx name="stamp" at={PREC} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 RÉFLEXES POUR TOUS ═══════════════════════════════ */
export const Regle: React.FC = () => {
	const frame = useCurrentFrame();
	const SIX = at('regle', 'six');
	const TOUS = at('regle', 'tous');
	const MEME = at('regle', 'même');
	const PAT = at('regle', 'patient');
	const TOI = at('regle', 'toi');
	const row = interpolate(frame, [TOUS - 4, TOUS + 8], [0, 1], ease);
	const moods: ('calme' | 'content' | 'mal')[] = ['calme', 'mal', 'content', 'calme', 'content'];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[SIX + 1, TOUS + 1, MEME + 1, PAT + 1, TOI + 1]}>
				<Head kicker="Les précautions standard" kAt={SIX - 6} title="*6* réflexes, pour *tous*" tAt={SIX} size={88} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={SIX} bumps={[SIX, TOUS, TOI]}>
					{/* les 6 réflexes : en grille, puis rangés en haut */}
					{REFLEXES.map((k, i) => {
						const t0 = SIX + i * 4;
						if (frame < t0) return null;
						const gx = 90 + (i % 3) * 270;
						const gy = 50 + Math.floor(i / 3) * 230;
						const rx = 30 + i * 148;
						const x = gx + (rx - gx) * row;
						const y = gy + (24 - gy) * row;
						const s = (1 - 0.45 * row) * popAt(frame, t0);
						return (
							<div key={k} style={{position: 'absolute', left: x, top: y, width: 190, height: 190, borderRadius: 95, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, transformOrigin: 'left top'}}>
								<ReflexIcon kind={k} size={120} />
							</div>
						);
					})}
					{/* tous les patients */}
					{moods.map((m, i) =>
						frame >= TOUS + i * 3 ? (
							<div key={i} style={{position: 'absolute', left: 40 + i * 175, top: 170, transform: `scale(${popAt(frame, TOUS + i * 3)})`}}>
								<Patient size={150} mood={m} breath={breathe(frame + i * 9)} />
							</div>
						) : null,
					)}
					{frame >= MEME && frame < PAT - 4 ? (
						<div style={{position: 'absolute', left: 300, top: 400, transform: `scale(${popAt(frame, MEME)})`}}>
							<Pill at={MEME} size={38} color={LPI.sky}>
								même en pleine forme
							</Pill>
						</div>
					) : null}
					{frame >= PAT - 2 ? (
						<div style={{position: 'absolute', left: 60, top: 390, display: 'flex', alignItems: 'center', gap: 12, opacity: fadeIn(frame, PAT - 2)}}>
							<Shield at={PAT - 2} size={70} />
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: LPI.blue}}>le patient</span>
						</div>
					) : null}
					{frame >= TOI - 2 ? (
						<div style={{position: 'absolute', left: 560, top: 390, display: 'flex', alignItems: 'center', gap: 12, opacity: fadeIn(frame, TOI - 2)}}>
							<Shield at={TOI - 2} size={70} tone={LPI.pink} />
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N, background: alpha(LPI.pink, 0.45), borderRadius: 10, padding: '0 8px'}}>toi</span>
						</div>
					) : null}
				</Stage>
				<div style={{position: 'absolute', left: 0, right: 0, top: 1110}}>
					<ReflexTracker current={0} at={SIX + 24} />
				</div>
			</Camera>
			{REFLEXES.map((k, i) => (
				<Sfx key={k} name="pop" at={SIX + i * 4} volume={0.06} />
			))}
			<Sfx name="ding" at={TOI} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · HYGIÈNE DES MAINS ═══════════════════════════════ */
export const Mains: React.FC = () => {
	const frame = useCurrentFrame();
	const FRI = at('mains', 'friction');
	const DEG = at('mains', 'dégagés');
	const COURTS = at('mains', 'courts');
	const VER = at('mains', 'vernis');
	const BIJ = at('mains', 'bijou');
	const sleeve = interpolate(frame, [DEG - 4, DEG + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const nails = interpolate(frame, [COURTS - 2, COURTS + 8], [1, 0], clamp);
	const polish = interpolate(frame, [VER - 2, VER + 8], [1, 0], clamp);
	const jewel = interpolate(frame, [BIJ - 2, BIJ + 12], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const fingers = [48, 78, 108, 138];
	const tops = [34, 14, 20, 44];
	return (
		<Reflex n={1} kAt={at('mains', 'un') - 4} title="L'hygiène des *mains*" punches={[FRI + 1, DEG + 1, COURTS + 1, VER + 1, BIJ + 1]} bumps={[FRI, BIJ]}>
			{/* la main + son avant-bras ; manche, ongles longs vernis, bague, montre qui s'en vont */}
			<div style={{position: 'absolute', left: 70, top: 30}}>
				<svg width={280} height={460} viewBox="0 0 200 330" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					<rect x={58} y={230} width={94} height={110} fill={LPI.paper} stroke={N} strokeWidth={5} />
					<rect x={58} y={230} width={94} height={110} fill={alpha(LPI.pink, 0.28)} />
				</svg>
				<Hand size={280} />
				<svg width={280} height={364} viewBox="0 0 200 260" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					{nails > 0
						? fingers.map((x, i) => (
								<path key={x} d={`M${x + 4} ${tops[i] + 10} Q${x + 14} ${tops[i] - 18 * nails} ${x + 24} ${tops[i] + 10}`} fill={polish > 0.5 ? LPI.pink : LPI.paper} stroke={N} strokeWidth={4} />
							))
						: null}
					<g opacity={1 - jewel} transform={`translate(${-80 * jewel} ${-60 * jewel}) rotate(${-30 * jewel} 92 100)`}>
						<RingShape />
					</g>
					<g opacity={1 - jewel} transform={`translate(${90 * jewel} ${40 * jewel})`}>
						<WatchShape />
					</g>
				</svg>
				{/* manche de la tenue, qui se retrousse */}
				<svg width={280} height={460} viewBox="0 0 200 330" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: 1 - sleeve, transform: `translateY(${140 * sleeve}px)`}}>
					<rect x={46} y={262} width={118} height={80} rx={8} fill={LPI.blue} stroke={N} strokeWidth={5} />
					<path d="M46 276 H164" stroke={N} strokeWidth={4} />
				</svg>
			</div>
			<ShaPump at={FRI - 2} press={FRI + 4} x={20} y={300} />
			<Sparkles at={FRI + 8} x={210} y={200} r={150} />
			{frame >= BIJ ? (
				<div style={{position: 'absolute', left: 250, top: 130, transform: `scale(${popAt(frame, BIJ)}) rotate(-10deg)`}}>
					<svg width={110} height={110} viewBox="-50 -50 100 100">
						<path d="M-30 -30 L30 30 M30 -30 L-30 30" stroke={LPI.pink} strokeWidth={16} strokeLinecap="round" />
					</svg>
				</div>
			) : null}
			<div style={{position: 'absolute', left: 420, top: 40, display: 'flex', flexDirection: 'column', gap: 26}}>
				<CheckChip at={FRI} label="friction SHA" size={38} />
				<CheckChip at={DEG} label="avant-bras dégagés" size={38} />
				<CheckChip at={VER} label="ongles courts, sans vernis" size={34} />
				<CheckChip at={BIJ} label="aucun bijou" size={38} />
			</div>
			<Sfx name="whoosh" at={FRI} volume={0.05} />
			<Sfx name="whoosh" at={DEG} volume={0.05} />
			<Sfx name="pop" at={BIJ} volume={0.08} />
		</Reflex>
	);
};

/** Flacon de SHA qui surgit et pousse. */
const ShaPump: React.FC<{at: number; press: number; x: number; y: number}> = ({at: t0, press, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = interpolate(frame, [press - 2, press + 2, press + 8], [0, 1, 0], clamp);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, t0)})`, transformOrigin: '50% 100%'}}>
			<ShaBottle size={110} press={k} />
		</div>
	);
};

/* ═══════════════════════════════ 2 · ÉQUIPEMENTS DE PROTECTION ═══════════════════════════════ */
const APRON_ICON = (
	<svg width={84} height={84} viewBox="110 180 180 260">
		<ApronShape />
	</svg>
);
const MASK_ICON = <ReflexIcon kind="toux" size={74} />;
export const Epi: React.FC = () => {
	const frame = useCurrentFrame();
	const EQ = at('epi', 'équipements');
	const GANTS = at('epi', 'gants');
	const TAB = at('epi', 'tablier');
	const MASQ = at('epi', 'masque');
	const LUN = at('epi', 'lunettes');
	const PROJ = at('epi', 'projection');
	const GIC = at('epi', 'gicler');
	const P = {x: 30, y: 40, size: 330};
	const splash = interpolate(frame, [GIC - 2, GIC + 12], [0, 1], clamp);
	return (
		<Reflex n={2} kAt={at('epi', 'deux') - 4} title="Les *équipements* de *protection*" punches={[GANTS + 1, TAB + 1, MASQ + 1, LUN + 1, GIC + 1]} bumps={[GANTS, TAB, MASQ, GIC]} term="EPI = équipements de protection individuelle" termAt={EQ}>
			{/* le soignant s'équipe au fil de la voix */}
			<div style={{position: 'absolute', left: P.x, top: P.y}}>
				<Patient size={P.size} breath={breathe(frame)} mood={frame >= GIC ? 'content' : 'calme'} />
				<Wear size={P.size} apron={fadeIn(frame, TAB - 2, 10)} mask={fadeIn(frame, MASQ - 2, 10)} goggles={fadeIn(frame, LUN - 2, 10)} />
			</div>
			{frame >= GANTS - 2 ? (
				<div style={{position: 'absolute', left: 250, top: 300, transform: `scale(${popAt(frame, GANTS - 2)}) rotate(-12deg)`}}>
					<Hand size={120} gloved={1} />
				</div>
			) : null}
			{/* projection qui rebondit sur le masque et les lunettes */}
			{splash > 0 && splash < 1
				? [0, 1, 2].map((i) => {
						const t = Math.min(1, splash * 1.3 - i * 0.12);
						if (t <= 0) return null;
						const hitX = P.x + 200 * (P.size / 400);
						const hitY = P.y + (120 + i * 18) * (P.size / 400);
						const x = t < 0.6 ? 380 - (380 - hitX) * (t / 0.6) : hitX + (t - 0.6) * 300;
						const y = t < 0.6 ? 60 + i * 30 + (hitY - 60 - i * 30) * (t / 0.6) : hitY - (t - 0.6) * 200;
						return (
							<div key={i} style={{position: 'absolute', left: x - 15, top: y - 20, transform: 'scale(0.5)', opacity: 1 - Math.max(0, t - 0.8) * 5}}>
								<Drop size={40} tone={LPI.pink} />
							</div>
						);
					})
				: null}
			<GearRow at={GANTS} y={20} icon={<Hand size={58} gloved={1} />} name="gants" when="si sang, liquide du corps" />
			<GearRow at={TAB} y={160} icon={APRON_ICON} name="tablier" when="si le soin mouille ou salit" />
			<GearRow at={MASQ} y={300} icon={MASK_ICON} name="masque + lunettes" when="si risque de projection" />
			{frame >= PROJ ? (
				<div style={{position: 'absolute', left: 390, top: 446, whiteSpace: 'nowrap', transform: `scale(${popAt(frame, PROJ)})`, transformOrigin: 'left center'}}>
					<Pill at={PROJ} size={30} color={LPI.pink}>
						projection = quand ça peut gicler
					</Pill>
				</div>
			) : null}
			<Burst at={GIC + 6} x={P.x + 165} y={P.y + 110} r={120} n={10} />
			<Sfx name="pop" at={GANTS} volume={0.08} />
			<Sfx name="pop" at={TAB} volume={0.08} />
			<Sfx name="pop" at={MASQ} volume={0.08} />
			<Sfx name="impact" at={GIC + 6} volume={0.07} />
		</Reflex>
	);
};

/* ═══════════════════════════════ 3 · HYGIÈNE RESPIRATOIRE ═══════════════════════════════ */
const Elbow: React.FC = () => (
	<svg width={90} height={90} viewBox="0 0 100 100">
		<path d="M14 80 L48 46 L86 60" fill="none" stroke={N} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14 80 L48 46 L86 60" fill="none" stroke={LPI.blue} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
export const Toux: React.FC = () => {
	const frame = useCurrentFrame();
	const TOUSSE = at('toux', 'tousse');
	const MASQ = at('toux', 'masque');
	const COUDE = at('toux', 'coude');
	const JETTE = at('toux', 'jette');
	const SUITE = at('toux', 'suite');
	const P = {x: 60, y: 40, size: 330};
	const mask = fadeIn(frame, MASQ - 2, 10);
	const fly = interpolate(frame, [JETTE, SUITE + 2], [0, 1], ease);
	return (
		<Reflex n={3} kAt={at('toux', 'trois') - 4} title="Le patient qui *tousse*" punches={[TOUSSE + 1, MASQ + 1, COUDE + 1, JETTE + 1, SUITE + 1]} bumps={[MASQ, SUITE]} term="hygiène respiratoire" termAt={TOUSSE}>
			<div style={{position: 'absolute', left: P.x, top: P.y}}>
				<Patient size={P.size} mood="mal" breath={breathe(frame)} />
				<CoughSpray size={P.size} at={TOUSSE - 4} until={1e9} blocked={mask} dir={1} />
				<Wear size={P.size} mask={mask} />
			</div>
			{frame >= MASQ ? (
				<div style={{position: 'absolute', left: 420, top: 40, transform: `scale(${popAt(frame, MASQ)})`, transformOrigin: 'left center'}}>
					<CheckChip at={MASQ} label="il porte un masque" size={40} />
				</div>
			) : null}
			{frame >= COUDE - 2 ? (
				<div style={{position: 'absolute', left: 420, top: 150, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${popAt(frame, COUDE - 2)})`, transformOrigin: 'left center'}}>
					<Elbow />
					<CheckChip at={COUDE - 2} label="dans son coude" size={36} />
				</div>
			) : null}
			{frame >= JETTE - 2 ? (
				<div style={{position: 'absolute', left: 420, top: 270, transform: `scale(${popAt(frame, JETTE - 2)})`, transformOrigin: 'left center'}}>
					<CheckChip at={JETTE - 2} label="mouchoir jeté tout de suite" size={34} />
				</div>
			) : null}
			{/* le mouchoir file dans la poubelle */}
			{frame >= JETTE - 4 ? (
				<div style={{position: 'absolute', left: 740, top: 360, transform: `scale(${popAt(frame, JETTE - 4) * 0.9})`}}>
					<Bin width={130} open={interpolate(frame, [JETTE, JETTE + 6, SUITE + 4, SUITE + 10], [0, 1, 1, 0], clamp)} />
				</div>
			) : null}
			{fly > 0 && fly < 1 ? (
				<div style={{position: 'absolute', left: 300 + fly * 470, top: 250 + fly * 120 - Math.sin(fly * Math.PI) * 160, transform: `rotate(${fly * 300}deg)`}}>
					<Tissue width={80} />
				</div>
			) : null}
			<Sfx name="buzz" at={TOUSSE - 4} volume={0.04} dur={12} />
			<Sfx name="pop" at={MASQ} volume={0.08} />
			<Sfx name="whoosh" at={JETTE} volume={0.05} />
			<Sfx name="tick" at={SUITE + 4} volume={0.07} />
		</Reflex>
	);
};

/* ═══════════════════════════════ 4 · PIQÛRES (AES) ═══════════════════════════════ */
export const Aes: React.FC = () => {
	const frame = useCurrentFrame();
	const PIQ = at('aes', 'piqûres');
	const RECAP = at('aes', 'recapuchonne');
	const JAM = at('aes', 'jamais');
	const DIR = at('aes', 'directement');
	const COL = at('aes', 'collecteur');
	const PORT = at('aes', 'portée');
	const PIQUES = at('aes', 'piques');
	const LAV = at('aes', 'laves');
	const DES = at('aes', 'désinfectes');
	const CONS = at('aes', 'consultes');
	// le capuchon s'approche… stoppé net ; puis l'aiguille part dans le collecteur
	const cap = interpolate(frame, [RECAP - 2, JAM], [0, 1], ease);
	const capFall = interpolate(frame, [JAM + 6, JAM + 20], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const go = interpolate(frame, [DIR, COL + 6], [0, 1], ease);
	const sx = 40 + 420 * go;
	const sy = 110 + 70 * go;
	const fadeSyr = 1 - fadeIn(frame, COL + 4, 6);
	const drop = interpolate(frame, [COL, COL + 14], [0, 1], clamp);
	const second = frame >= PIQUES - 4;
	return (
		<Reflex n={4} kAt={at('aes', 'quatre') - 4} title="Éviter les *piqûres*" punches={[RECAP + 1, JAM + 1, COL + 1, PIQUES + 1, LAV + 1, DES + 1, CONS + 1]} bumps={[JAM, COL, PIQUES]} term="AES = accident d'exposition au sang" termAt={PIQ}>
			{!second ? (
				<>
					{fadeSyr > 0 ? (
						<div style={{position: 'absolute', left: sx, top: sy, opacity: fadeSyr, transform: `rotate(${30 * go}deg) scale(${1 - 0.4 * go})`, transformOrigin: 'right center'}}>
							<Syringe width={400} />
						</div>
					) : null}
					{frame >= RECAP - 2 && capFall < 1 ? (
						<div style={{position: 'absolute', left: 620 - 140 * cap, top: 130 + 260 * capFall, opacity: 1 - capFall, transform: `rotate(${120 * capFall}deg)`}}>
							<NeedleCap width={130} />
						</div>
					) : null}
					<Stamp at={JAM} x={460} y={70} text="Jamais !" size={58} rot={-8} out={DIR - 2} />
					{frame >= DIR - 6 ? (
						<div style={{position: 'absolute', left: 600, top: 140, transform: `scale(${popAt(frame, DIR - 6)})`}}>
							<SharpsBox size={240} drop={drop} />
						</div>
					) : null}
					{frame >= PORT - 2 ? (
						<div style={{position: 'absolute', left: 40, top: 300, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${popAt(frame, PORT - 2)})`, transformOrigin: 'left center'}}>
							<Hand size={110} />
							<Pill at={PORT - 2} size={40} color={LPI.sky}>
								collecteur à portée de main
							</Pill>
						</div>
					) : null}
				</>
			) : (
				<>
					{/* « si tu te piques » : le doigt qui saigne, puis 3 étapes */}
					<div style={{position: 'absolute', left: 60, top: 60, transform: `scale(${popAt(frame, PIQUES - 4)})`}}>
						<Hand size={190} />
						{frame >= PIQUES ? (
							<div style={{position: 'absolute', left: 82, top: -10, transform: `scale(${popAt(frame, PIQUES) * 0.7})`}}>
								<Drop size={44} tone={LPI.pink} />
							</div>
						) : null}
					</div>
					{[
						[LAV, '1', 'laver', <svg key="l" width={64} height={64} viewBox="0 0 100 100"><path d="M50 10 C38 34 22 50 22 66 A28 28 0 0 0 78 66 C78 50 62 34 50 10 Z" fill={LPI.sky} stroke={N} strokeWidth={7} /></svg>],
						[DES, '2', 'désinfecter', <AntisepticBottle key="d" size={44} />],
						[CONS, '3', 'consulter vite', <svg key="c" width={64} height={64} viewBox="-50 -50 100 100"><circle r={40} fill={LPI.paper} stroke={N} strokeWidth={7} /><path d="M0 -24 V0 L16 12" stroke={N} strokeWidth={7} strokeLinecap="round" fill="none" /></svg>],
					].map(([t, n, label, icon]) =>
						frame >= (t as number) - 2 ? (
							<div key={n as string} style={{position: 'absolute', left: 320, top: 40 + (Number(n) - 1) * 130, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${popAt(frame, (t as number) - 2)})`, transformOrigin: 'left center'}}>
								<div style={{width: 70, height: 70, borderRadius: 35, background: LPI.pink, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N}}>{n as string}</div>
								<div style={{width: 96, height: 96, borderRadius: 48, background: LPI.paper, border: `5px solid ${LPI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon as React.ReactNode}</div>
								<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{label as string}</span>
							</div>
						) : null,
					)}
				</>
			)}
			<Sfx name="stamp" at={JAM} volume={0.1} />
			<Sfx name="whoosh" at={DIR} volume={0.06} />
			<Sfx name="tick" at={COL + 10} volume={0.07} />
			<Sfx name="impact" at={PIQUES} volume={0.07} />
			{[LAV, DES, CONS].map((t) => (
				<Sfx key={t} name="pop" at={t - 2} volume={0.07} />
			))}
		</Reflex>
	);
};

/* ═══════════════════════════════ 5 · EXCRETA ═══════════════════════════════ */
export const Excreta: React.FC = () => {
	const frame = useCurrentFrame();
	const URI = at('excreta', 'urines');
	const GANTS = at('excreta', 'gants');
	const TAB = at('excreta', 'tablier');
	const JAM = at('excreta', 'jamais');
	const DOU = at('excreta', 'douchette');
	const ECL = at('excreta', 'éclabousse');
	const PART = at('excreta', 'partout');
	const spray = fadeIn(frame, DOU, 6) * (1 - fadeIn(frame, PART + 10, 8));
	const burst = interpolate(frame, [ECL - 2, ECL + 20], [0, 1], clamp);
	return (
		<Reflex n={5} kAt={at('excreta', 'cinq') - 4} title="Les urines et les *selles*" punches={[GANTS + 1, TAB + 1, JAM + 1, DOU + 1, ECL + 1]} bumps={[JAM, ECL]} term="excreta = urines, selles" termAt={URI}>
			<div style={{position: 'absolute', left: 300, top: 290, transform: `scale(${popAt(frame, URI - 4)})`}}>
				<Bedpan width={330} />
			</div>
			{frame >= GANTS - 2 ? (
				<div style={{position: 'absolute', left: 40, top: 30, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${popAt(frame, GANTS - 2)})`, transformOrigin: 'left center'}}>
					<Hand size={90} gloved={1} />
					<CheckChip at={GANTS} label="gants" size={36} />
				</div>
			) : null}
			{frame >= TAB - 2 ? (
				<div style={{position: 'absolute', left: 40, top: 170, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${popAt(frame, TAB - 2)})`, transformOrigin: 'left center'}}>
					{APRON_ICON}
					<CheckChip at={TAB} label="tablier" size={36} />
				</div>
			) : null}
			{frame >= DOU - 4 ? (
				<div style={{position: 'absolute', left: 520, top: 40, transform: `scale(${popAt(frame, DOU - 4)})`}}>
					<ShowerHead width={240} spray={spray} />
				</div>
			) : null}
			{/* « ça éclabousse partout » : gouttes et microbes qui giclent */}
			{burst > 0 && burst < 1
				? Array.from({length: 10}, (_, i) => {
						const ang = -Math.PI * (0.1 + 0.8 * (i / 9));
						const d = 60 + burst * 300;
						const x = 465 + Math.cos(ang) * d;
						const y = 330 + Math.sin(ang) * d * 0.8 + burst * burst * 120;
						return (
							<div key={i} style={{position: 'absolute', left: x - 20, top: y - 20, opacity: 1 - burst, transform: `scale(${0.6 + 0.4 * (i % 2)})`}}>
								{i % 3 === 0 ? <Microbe size={40} tone={LPI.sky} seed={i} /> : <Drop size={34} tone={i % 2 ? LPI.sky : LPI.paper} />}
							</div>
						);
					})
				: null}
			<Stamp at={JAM} x={700} y={270} text="Jamais" size={54} rot={8} out={PART + 30} />
			<StagePill from={PART + 12} x={300} y={470} color={LPI.sky}>
				→ on utilise le lave-bassin
			</StagePill>
			<Sfx name="pop" at={GANTS} volume={0.07} />
			<Sfx name="pop" at={TAB} volume={0.07} />
			<Sfx name="stamp" at={JAM} volume={0.1} />
			<Sfx name="impact" at={ECL} volume={0.08} />
		</Reflex>
	);
};

/* ═══════════════════════════════ 6 · ENVIRONNEMENT ═══════════════════════════════ */
export const Env: React.FC = () => {
	const frame = useCurrentFrame();
	const SURF = at('env', 'surfaces');
	const MAT = at('env', 'matériel');
	const NET = at('env', 'nettoyés');
	const DES = at('env', 'désinfectés');
	const LIN = at('env', 'linge');
	const DEC = at('env', 'déchets');
	const FIL = at('env', 'filière');
	const clean = interpolate(frame, [NET - 2, DES + 12], [0, 1], clamp);
	const sprayX = interpolate(frame, [NET - 4, DES + 10], [40, 420], ease);
	const shrink = interpolate(frame, [LIN - 6, LIN + 4], [1, 0.62], ease);
	return (
		<Reflex n={6} kAt={at('env', 'six') - 4} title="*L'environnement*" punches={[SURF + 1, MAT + 1, NET + 1, DES + 1, LIN + 1, DEC + 1, FIL + 1]} bumps={[DES, FIL]}>
			{/* la chambre : surfaces + matériel, puis on les nettoie */}
			<div style={{position: 'absolute', left: 20, top: 40, transform: `scale(${shrink})`, transformOrigin: 'left top'}}>
				<div style={{position: 'absolute', left: 0, top: 120}}>
					<IvPump width={120} />
				</div>
				<div style={{position: 'absolute', left: 140, top: 220, transform: `scale(${frame >= SURF && frame < SURF + 16 ? 1.05 : 1})`}}>
					<Bed width={420} />
				</div>
				<div style={{position: 'absolute', left: 590, top: 250}}>
					<BedTable width={140} />
				</div>
				<div style={{position: 'absolute', left: 140, top: 200}}>
					<Swarm w={600} h={200} n={10} seed={61} size={40} tone={[LPI.sky, LPI.blue]} appear={fadeIn(frame, SURF - 4, 14)} gone={clean} />
				</div>
				{frame >= NET - 4 && frame < DES + 16 ? (
					<div style={{position: 'absolute', left: sprayX, top: 30, transform: 'rotate(-14deg)'}}>
						<SprayBottle width={110} />
					</div>
				) : null}
				<Sparkles at={DES + 6} x={420} y={300} r={220} n={9} />
			</div>
			{frame >= SURF ? (
				<div style={{position: 'absolute', left: 30, top: 20, display: 'flex', gap: 12, opacity: 1 - fadeIn(frame, LIN - 6, 6)}}>
					<Pill at={SURF} size={34} color={LPI.sky}>
						surfaces
					</Pill>
					{frame >= MAT ? (
						<Pill at={MAT} size={34} color={LPI.sky}>
							matériel
						</Pill>
					) : null}
					{frame >= DES ? (
						<Pill at={DES} size={34} color={LPI.blue}>
							nettoyés + désinfectés ✓
						</Pill>
					) : null}
				</div>
			) : null}
			{/* linge sale et déchets : chacun sa filière */}
			{frame >= LIN - 2 ? (
				<div style={{position: 'absolute', left: 560, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, LIN - 2)})`}}>
					<LaundryBag width={150} />
					<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>linge sale</span>
				</div>
			) : null}
			{frame >= DEC - 2 ? (
				<div style={{position: 'absolute', left: 740, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, DEC - 2)})`}}>
					<DasriBag size={150} fill={0.6} />
					<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>déchets</span>
				</div>
			) : null}
			{frame >= FIL - 2 ? (
				<div style={{position: 'absolute', left: 540, top: 360, whiteSpace: 'nowrap', transform: `scale(${popAt(frame, FIL - 2)})`, transformOrigin: 'left center'}}>
					<Pill at={FIL - 2} size={40} color={LPI.blue}>
						→ la bonne filière ✓
					</Pill>
				</div>
			) : null}
			<Sfx name="whoosh" at={NET} volume={0.05} />
			<Sfx name="ding" at={DES + 6} volume={0.06} />
			<Sfx name="pop" at={LIN - 2} volume={0.07} />
			<Sfx name="pop" at={DEC - 2} volume={0.07} />
		</Reflex>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="*6* réflexes, pour *tous*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'réflexes') + 6}
		rows={[
			[at('outro', 'mains'), 'check', '1 · Hygiène des mains', null],
			[at('outro', 'protections'), 'check', '2 · Gants, tablier, masque…', null],
			[at('outro', 'masque'), 'check', '3 · Masque si le patient tousse', null],
			[at('outro', 'aiguilles'), 'alert', '4 · Aiguilles au collecteur', null],
			[at('outro', 'urines'), 'check', '5 · Excreta sans éclaboussures', null],
			[at('outro', 'environnement'), 'check', '6 · Environnement propre', null],
		]}
	/>
);
