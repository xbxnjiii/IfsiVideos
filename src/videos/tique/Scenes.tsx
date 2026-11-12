// Scènes de « Une tique : comment bien la retirer ? » : chaque mouvement part d'un mot, at(scène, mot) — `npm run cues -- tique`.
// La peau est un `SkinG` (repère 1000 × 1000, la tique au centre (500, 500)) posé en grand ; le zoom de l'accroche agrandit
// le tout (dessin vectoriel : reste net).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Presser} from '../../brand/bandage';
import {Big, fadeIn, Flash, Fly, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {Faucet, Microbe} from '../../brand/hands';
import {FeverIcon} from '../../brand/icons';
import {DayChip} from '../../brand/injury';
import {Burst, Camera} from '../../brand/motion3';
import {AntisepticBottle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {LabelBottle, SkinG, SkinMedallion, TickG, TickHookG, WalkIcon} from '../../brand/tick';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

/** La peau en grand, centrée sur (cx, cy) à l'écran (W px pour 1000 unités). */
const Skin: React.FC<{cx: number; cy: number; W?: number; children?: React.ReactNode; red?: number; ring?: number; tint?: number}> = ({cx, cy, W = 1600, children, ...p}) => (
	<svg width={W} height={W} viewBox="0 0 1000 1000" style={{position: 'absolute', left: cx - W / 2, top: cy - W / 2, overflow: 'visible'}}>
		<SkinG {...p}>{children}</SkinG>
	</svg>
);

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Grande croix rose qui barre une tuile. */
const Cross: React.FC<{at: number; size?: number}> = ({at: t0, size = 240}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = lin(frame, t0, t0 + 6);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, overflow: 'visible'}}>
			{[
				[18, 18, 82, 82],
				[82, 18, 18, 82],
			].map(([a, b, c, d], i) => (
				<g key={i}>
					<path d={`M${a} ${b} L${c} ${d}`} stroke={N} strokeWidth={20} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
					<path d={`M${a} ${b} L${c} ${d}`} stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
				</g>
			))}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE PETIT POINT NOIR ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const POINT = at('intro', 'point');
	const FROTTES = at('intro', 'frottes.');
	const TIQUE = at('intro', 'tique !');
	const z = 1 + 6 * lin(frame, TIQUE - 8, TIQUE + 16);
	// le doigt frotte… le point ne bouge pas
	const rubOn = frame >= FROTTES - 22 && frame < TIQUE - 4;
	const rubX = 500 + 70 * Math.sin((frame - FROTTES) / 3);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '540px 960px'}}>
				<Skin cx={540} cy={960} red={fadeIn(frame, TIQUE, 10)}>
					<TickG x={500} y={500} walk={frame > TIQUE ? 0.7 : 0} buried={1} fed={0.15} />
					{rubOn ? (
						<g opacity={fadeIn(frame, FROTTES - 22, 5) * (1 - fadeIn(frame, TIQUE - 10, 5))}>
							<Presser x={rubX} y={530} press={0.5 + 0.5 * Math.sin((frame - FROTTES) / 1.5)} rot={-14} />
						</g>
					) : null}
				</Skin>
			</AbsoluteFill>
			{/* le petit point, désigné sans texte : un anneau qui pulse */}
			{frame >= POINT - 2 && frame < FROTTES - 22 ? (
				<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
					<circle cx={540} cy={960} r={60 + 8 * Math.sin(frame / 3)} fill="none" stroke={LPI.pink} strokeWidth={7} strokeDasharray="16 12" opacity={fadeIn(frame, POINT - 2, 6)} />
				</svg>
			) : null}
			<Flash at={TIQUE} max={0.25} />
			<Sfx name="pop" at={POINT - 2} volume={0.07} />
			<Sfx name="whoosh" at={TIQUE - 8} volume={0.08} />
			<Sfx name="impact" at={TIQUE + 2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'IDÉE REÇUE : ÉTHER, ALCOOL, HUILE ═══════════════════════════════ */
const Tile: React.FC<{at: number; x: number; cross: number; label: string; tone: string}> = ({at: t0, x, cross, label, tone}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x - 140, top: 330, width: 280, height: 300, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 44, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<LabelBottle label={label} tone={tone} size={130} />
			</div>
			<Cross at={cross} size={250} />
		</div>
	);
};

export const Idees: React.FC = () => {
	const frame = useCurrentFrame();
	const ETHER = at('idees', "l'éther,");
	const ALCOOL = at('idees', "l'alcool");
	const HUILE = at('idees', "l'huile");
	const SURTOUT = at('idees', 'surtout');
	const PAS = at('idees', 'pas !');
	const RECR = at('idees', 'recracher');
	const MICROBES = at('idees', 'microbes');
	const spread = lin(frame, RECR, MICROBES + 10);
	const TX = 540;
	const TY = 1240;
	return (
		<AbsoluteFill>
			<Skin cx={TX} cy={TY} red={0.6 + 0.4 * spread}>
				<TickG x={500} y={500} s={6} buried={1} fed={0.3} walk={0.25} />
			</Skin>
			<Camera punches={[ETHER + 1, ALCOOL + 1, HUILE + 1, PAS + 1]} shakes={[PAS + 1]} strength={0.04}>
				<Big from={SURTOUT - 2} text={'Surtout *pas* !'} size={116} y={130} center />
				<Tile at={ETHER - 2} x={200} cross={PAS - 2} label="ÉTHER" tone={LPI.sky} />
				<Tile at={ALCOOL - 2} x={540} cross={PAS} label="ALCOOL" tone={LPI.blue} />
				<Tile at={HUILE - 2} x={880} cross={PAS + 2} label="HUILE" tone={LPI.pink} />
				{/* elle recrache… des microbes qui partent dans la peau */}
				{spread > 0
					? Array.from({length: 9}, (_, i) => {
							const a = (i / 9) * Math.PI * 2 + 0.3;
							const d = 60 + 250 * spread * (0.7 + 0.3 * ((i * 7) % 3) / 2);
							return (
								<div key={i} style={{position: 'absolute', left: TX + Math.cos(a) * d - 26, top: TY + Math.sin(a) * d * 0.8 - 26, opacity: cl01(spread * 3 - i * 0.08), transform: `scale(${0.6 + 0.5 * spread})`}}>
									<Microbe size={52} tone={LPI.pink} seed={i} />
								</div>
							);
						})
					: null}
				<PointTag at={MICROBES - 2} x={540} y={1640} px={TX + 200} py={TY + 60} size={44} tone={LPI.pink}>
					des microbes dans la peau
				</PointTag>
			</Camera>
			<Flash at={PAS} max={0.3} />
			{[ETHER - 2, ALCOOL - 2, HUILE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="stamp" at={PAS} volume={0.12} />
			<Sfx name="buzz" at={RECR + 4} volume={0.05} dur={14} />
		</AbsoluteFill>
	);
};
const cl01 = (v: number) => Math.min(1, Math.max(0, v));

/* ═══════════════════════════════ LE BON GESTE : LE TIRE-TIQUE ═══════════════════════════════ */
export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const TIRE = at('methode', 'tire-tique.');
	const GLISSE = at('methode', 'glisse-le');
	const PEAU = at('methode', 'peau.');
	const TOURNE = at('methode', 'tourne');
	const COUP = at('methode', 'coup…');
	const DECROCHE = at('methode', 'décroche,');
	const TETE = at('methode', 'tête.');
	const slide = lin(frame, GLISSE, PEAU);
	const spin = 360 * lin(frame, TOURNE, COUP + 14);
	const off = lin(frame, DECROCHE - 2, DECROCHE + 14);
	const hookIn = lin(frame, TIRE - 4, TIRE + 10);
	const tipX = interpolate(slide, [0, 1], [820, 530]);
	const titles: [number, number, string][] = [
		[TIRE - 4, GLISSE - 4, 'Un *tire-tique*'],
		[GLISSE - 4, TOURNE - 4, 'Glisse-le *dessous*'],
		[TOURNE - 4, DECROCHE - 4, 'Tourne *doucement*'],
		[DECROCHE - 4, 1e9, 'Avec sa *tête* !'],
	];
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1060} red={0.7} tint={0}>
				{/* le crochet passe SOUS la tique ; on tourne l'ensemble autour de la tique, puis on la soulève */}
				<g transform={`translate(${140 * off} ${-240 * off}) rotate(${spin} 500 500)`}>
					<TickHookG x={tipX} y={515} ang={0} scale={1.5} opacity={hookIn} />
					<TickG x={500} y={500} s={6} buried={1 - off} fed={0.3} walk={off > 0 ? 0.5 : 0.15} ang={0} />
				</g>
				{off > 0.3 ? <circle cx={500} cy={490} r={14} fill={alpha(LPI.pink, 0.9)} stroke={alpha(N, 0.4)} strokeWidth={2} /> : null}
			</Skin>
			{titles.map(([a, b, t], i) => (
				<Big key={t} from={i === 0 ? a : a + 6} to={b} text={t} size={100} y={150} center />
			))}
			{frame >= COUP - 26 && frame < DECROCHE ? (
				<Note at={COUP - 26} to={DECROCHE - 6} y={1500} size={44} tone={LPI.sky}>
					sans tirer d'un coup
				</Note>
			) : null}
			<PointTag at={TETE - 4} x={330} y={420} px={540 + 140 * 1.6} py={1060 - 240 * 1.6 - 150} size={44} tone={LPI.sky}>
				la tête est sortie ✓
			</PointTag>
			<Burst at={TETE} x={700} y={560} r={220} n={12} />
			<Sfx name="whoosh" at={TIRE - 4} volume={0.07} />
			<Sfx name="tick" at={PEAU} volume={0.1} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="tick" at={TOURNE + i * 12} volume={0.06} />
			))}
			<Sfx name="pop" at={DECROCHE} volume={0.1} />
			<Sfx name="ding" at={TETE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ APRÈS : DÉSINFECTER, SE LAVER LES MAINS, NOTER LA DATE ═══════════════════════════════ */
export const Apres: React.FC = () => {
	const frame = useCurrentFrame();
	const DESINF = at('apres', 'désinfecte');
	const LAVE = at('apres', 'lave-toi');
	const NOTE = at('apres', 'note');
	const DATE = at('apres', 'date');
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: 540 - 210, top: 190}}>
				<SkinMedallion size={420}>
					<SkinG red={0.7 * (1 - 0.5 * fadeIn(frame, DESINF + 6, 20))} tint={fadeIn(frame, DESINF + 4, 10)}>
						<circle cx={500} cy={492} r={12} fill={alpha(LPI.pink, 0.95)} stroke={alpha(N, 0.4)} strokeWidth={2} />
					</SkinG>
				</SkinMedallion>
			</div>
			<RowCard at={DESINF - 4} y={720} h={190} art={170} badge={1} title="Désinfecte la piqûre" check={LAVE - 2} size={50}>
				<AntisepticBottle size={110} />
			</RowCard>
			<RowCard at={LAVE - 3} y={930} h={190} art={170} badge={2} title="Lave-toi les mains" check={NOTE - 2} from="left" size={50}>
				<Faucet width={160} flow={1} soap={1} />
			</RowCard>
			<RowCard at={NOTE - 3} y={1140} h={190} art={170} badge={3} title="Note la date" sub="dans ton téléphone" subAt={DATE + 4} check={DATE + 20} size={50}>
				<DayChip text="J0" size={130} />
			</RowCard>
			{[DESINF - 4, LAVE - 3, NOTE - 3].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={DATE + 20} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SURVEILLER UN MOIS : LA PLAQUE ROUGE ═══════════════════════════════ */
export const Surveiller: React.FC = () => {
	const frame = useCurrentFrame();
	const MOIS = at('surveiller', 'mois,');
	const PLAQUE = at('surveiller', 'plaque');
	const AGRANDIT = at('surveiller', "s'agrandit");
	const FIEVRE = at('surveiller', 'fièvre,');
	const CONSULTE = at('surveiller', 'consulte');
	const LYME = at('surveiller', 'lyme.');
	const day = Math.round(interpolate(frame, [MOIS, AGRANDIT + 20], [1, 12], clamp));
	const ring = lin(frame, PLAQUE, AGRANDIT + 24);
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1080} W={1500} ring={ring}>
				<circle cx={500} cy={492} r={10} fill={alpha(LPI.pink, 0.9)} />
			</Skin>
			<Big from={-2} text="Pendant *1* mois" size={110} y={140} center />
			<Fly at={MOIS - 2} x={190} y={480}>
				<div style={{transform: `scale(${frame % 30 < 2 ? 1.06 : 1})`}}>
					<DayChip text={`J+${day}`} size={170} />
				</div>
			</Fly>
			<PointTag at={AGRANDIT - 2} to={FIEVRE - 4} x={720} y={460} px={540 + 0.75 * 300} py={1080 - 0.75 * 300} size={42} tone={LPI.pink}>
				plaque rouge qui grandit
			</PointTag>
			{frame >= FIEVRE - 4 ? (
				<Fly at={FIEVRE - 4} x={800} y={470}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '14px 28px 14px 14px', borderRadius: 999, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<FeverIcon size={84} />
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 48, color: N}}>fièvre</span>
					</div>
				</Fly>
			) : null}
			<Note at={CONSULTE - 2} to={LYME - 14} y={1520} size={48} tone={LPI.pink}>
				→ consulte un médecin
			</Note>
			<Note at={LYME - 4} y={1520} size={48} tone={LPI.sky}>
				maladie de Lyme ?
			</Note>
			<Sfx name="pop" at={MOIS - 2} volume={0.08} />
			<Sfx name="whoosh" at={PLAQUE} volume={0.07} />
			<Sfx name="pop" at={FIEVRE - 4} volume={0.08} />
			<Sfx name="ding" at={CONSULTE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : LA PROCHAINE BALADE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const MANCHES = at('fin', 'manches');
	const PANTALON = at('fin', 'pantalon…');
	const INSPECTE = at('fin', "s'inspecte");
	const RENTRANT = at('fin', 'rentrant !');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={-2} text="À la prochaine *balade*" size={100} y={160} center />
			<RowCard at={MANCHES - 3} y={520} h={220} art={190} badge="✓" badgeTone={LPI.sky} title="Manches longues" size={54}>
				<WalkIcon kind="sleeve" size={170} />
			</RowCard>
			<RowCard at={PANTALON - 3} y={770} h={220} art={190} badge="✓" badgeTone={LPI.sky} title="Pantalon" from="left" size={54}>
				<WalkIcon kind="pants" size={170} />
			</RowCard>
			<RowCard at={INSPECTE - 3} y={1020} h={220} art={190} badge="✓" badgeTone={LPI.pink} title="On s'inspecte" sub="en rentrant" subAt={RENTRANT - 4} size={54}>
				<WalkIcon kind="check" size={170} />
			</RowCard>
			<Burst at={RENTRANT + 4} x={540} y={1130} r={300} n={14} />
			{[MANCHES - 3, PANTALON - 3, INSPECTE - 3].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={RENTRANT + 4} volume={0.1} />
		</AbsoluteFill>
	);
};
