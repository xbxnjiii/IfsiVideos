// Série « La douleur : échelles d'évaluation », partie 1 / 2 : l'auto-évaluation (rythme d'apprentissage, voix +0 %).
// Accroche « question au spectateur » (de 0 à 10, tu as mal à combien ? le doigt hésite, « 4 ! », tampon ÉVALUÉE,
// puis « à l'hôpital, plusieurs échelles : laquelle choisir ? »), carte de la série, le principe (c'est lui qui évalue,
// on le croit), l'échelle numérique, la réglette EVA (recto patient / verso soignant), l'EVS (5 mots), l'échelle des
// visages chez l'enfant, le seuil (dès 4/10 on soulage, on réévalue, on note), récap + « à suivre ». Briques : pain.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CamKey, Head, Pill, RecapScene, StagePill, ZoomCam} from '../../brand/episode';
import {PillIcon} from '../../brand/icons';
import {CheckChip, Stamp} from '../../brand/kit';
import {Burst, Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NormScale, Zone} from '../../brand/NormScale';
import {Bubble, FacesScale, Kid, MuteIcon, NumScale, PAIN_PARTS, PainFace, painTone, Ruler, WordScale} from '../../brand/pain';
import {Patient} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));

/** Pastille ronde (« ? », « ! ») qui tangue. */
const Badge: React.FC<{at: number; until?: number; x: number; y: number; text: string; tone?: string; size?: number}> = ({at: t0, until = 1e9, x, y, text, tone = LPI.pink, size = 110}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame >= until) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, background: tone, border: `7px solid ${LPI.paper}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.6, color: tone === LPI.blue ? LPI.paper : N, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 6) * 8}deg)`}}>
			{text}
		</div>
	);
};

/** Titre affiché de `from` à `to` (fondu de sortie). */
const TitleAt: React.FC<{from: number; to?: number; text: string; size?: number; y?: number; stagger?: number}> = ({from, to = 1e9, text, size = 92, y = 236, stagger = 3}) => {
	const frame = useCurrentFrame();
	if (frame >= to + 6) return null;
	return (
		<div style={{position: 'absolute', left: 72, top: y, width: 936, opacity: interpolate(frame, [to, to + 6], [1, 0], clamp)}}>
			<Title at={from} text={text} size={size} stagger={stagger} />
		</div>
	);
};

/** Élément qui « pop » à `from` et s'efface à `to` (posé en x, y). */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'center'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const out = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.7 + 0.3 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

/** Petit hôpital (croix). */
const HospitalIcon: React.FC<{size?: number}> = ({size = 160}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={14} y={30} width={72} height={60} rx={8} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<rect x={34} y={12} width={32} height={30} rx={6} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<path d="M50 18 V36 M41 27 H59" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" />
		{[26, 44, 62].map((x) => (
			<rect key={x} x={x} y={52} width={12} height={12} rx={3} fill={LPI.sky} stroke={N} strokeWidth={3} />
		))}
		<rect x={42} y={70} width={16} height={20} rx={3} fill={LPI.blue} stroke={N} strokeWidth={4} />
	</svg>
);

/** Carte d'une échelle (accroche) : dessin + nom. */
const ScaleCard: React.FC<{at: number; x: number; y: number; label: string; children: React.ReactNode; wob?: number}> = ({at: t0, x, y, label, children, wob = 0}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 440, height: 250, borderRadius: 40, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, transform: `scale(${popAt(frame, t0)}) rotate(${Math.sin(frame / 5 + x) * 3 * wob}deg)`}}>
			<div style={{height: 120, display: 'flex', alignItems: 'center'}}>{children}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: N}}>{label}</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Tu as mal à combien ? » + l'échelle de 0 à 10. Le 0 puis le 10 s'allument ; le doigt hésite au-dessus des
// cases ; bulle de pensée « ? » → « 4 ! » ; tampon ÉVALUÉE ; « à l'hôpital » ; 4 échelles ; « Laquelle choisir ? ».
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ZERO = at('intro', 'zéro');
	const DIX = at('intro', 'dix');
	const MAL = at('intro', 'mal');
	const TU2 = at('intro', 'tu', 2);
	const TETE = at('intro', 'tête');
	const BRAVO = at('intro', 'bravo');
	const DOUL = at('intro', 'douleur');
	const MAIS = at('intro', 'mais');
	const HOP = at('intro', "l'hôpital");
	const PLUS = at('intro', 'plusieurs');
	const LAQ = at('intro', 'laquelle');
	const CHOI = at('intro', 'choisir');
	const hover = frame < MAL - 2 ? null : interpolate(frame, [MAL - 2, MAL + 18, MAL + 40, MAL + 58, TU2 + 4, TETE], [5, 8, 2.6, 6.4, 3, 4], ease);
	const sOut = 1 - fadeIn(frame, MAIS - 4, 8);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ZERO + 1, DIX + 1, TETE + 1, BRAVO + 1, HOP + 1, PLUS + 1, LAQ + 1]} shakes={[BRAVO + 2]} strength={0.04}>
				{/* l'échelle de 0 à 10 et la bulle de pensée */}
				{sOut > 0 ? (
					<div style={{opacity: sOut, transform: `scale(${0.85 + 0.15 * sOut})`, transformOrigin: '540px 700px'}}>
						<div style={{position: 'absolute', left: 72, top: 500}}>
							<NumScale at={-40} stagger={0} pick={4} pickAt={TETE + 2} hover={frame < TETE + 2 ? hover : null} glow={[...(frame >= ZERO - 2 && frame < MAL ? [0] : []), ...(frame >= DIX - 2 && frame < MAL ? [10] : [])]} />
						</div>
						<Pop from={-30} x={330} y={760}>
							<div style={{transform: `scale(${frame >= TU2 - 2 && frame < TETE ? 1 + 0.06 * Math.sin(frame / 3) : 1})`}}>
								<Bubble think tail="left" pad="26px 70px">
									<span style={{fontSize: 150, lineHeight: 1, color: frame >= TETE ? LPI.blue : N}}>{frame >= TETE ? '4 !' : '?'}</span>
								</Bubble>
							</div>
						</Pop>
						<Stamp at={BRAVO} x={760} y={1150} text="Évaluée !" size={74} rot={-8} />
						{frame >= DOUL - 2 ? (
							<div style={{position: 'absolute', left: 72, top: 1270}}>
								<CheckChip at={DOUL - 2} label="ta douleur : 4 / 10" size={44} />
							</div>
						) : null}
					</div>
				) : null}
				<Burst at={BRAVO} x={760} y={1150} r={260} n={14} />
				{/* à l'hôpital : plusieurs échelles */}
				<Pop from={HOP - 2} to={PLUS - 6} x={380} y={540}>
					<HospitalIcon size={320} />
				</Pop>
				<ScaleCard at={PLUS - 2} x={72} y={520} label="des chiffres" wob={frame >= LAQ ? 1 : 0}>
					<div style={{display: 'flex', gap: 6}}>
						{[0, 3, 6, 9].map((v) => (
							<div key={v} style={{width: 64, height: 64, borderRadius: 16, background: painTone(v), border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: v >= 4 && v <= 6 ? LPI.paper : N}}>
								{v}
							</div>
						))}
					</div>
				</ScaleCard>
				<ScaleCard at={PLUS + 2} x={568} y={520} label="une réglette" wob={frame >= LAQ ? 1 : 0}>
					<Ruler pos={0.6} flip={0} width={380} ends={[1, 1]} />
				</ScaleCard>
				<ScaleCard at={PLUS + 6} x={72} y={800} label="des mots" wob={frame >= LAQ ? 1 : 0}>
					<div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center'}}>
						{['faible', 'intense'].map((w, i) => (
							<div key={w} style={{padding: '4px 22px', borderRadius: 999, background: i ? LPI.pink : LPI.sky, border: `4px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>
								{w}
							</div>
						))}
					</div>
				</ScaleCard>
				<ScaleCard at={PLUS + 10} x={568} y={800} label="des visages" wob={frame >= LAQ ? 1 : 0}>
					<div style={{display: 'flex', gap: 10}}>
						<PainFace level={0} size={96} />
						<PainFace level={3} size={96} />
						<PainFace level={5} size={96} />
					</div>
				</ScaleCard>
				<Badge at={LAQ} x={485} y={1090} text="?" size={130} />
				{/* titres */}
				<TitleAt from={-60} to={MAIS - 4} text="Tu as mal à *combien* ?" size={100} stagger={0} />
				<TitleAt from={MAIS - 2} to={LAQ - 4} text="Mais à *l'hôpital*…" size={100} />
				<TitleAt from={LAQ - 2} text="Laquelle *choisir* ?" size={100} />
			</Camera>
			<Sfx name="tick" at={ZERO} volume={0.08} />
			<Sfx name="tick" at={DIX} volume={0.08} />
			<Sfx name="pop" at={TU2 - 2} volume={0.09} />
			<Sfx name="ding" at={TETE} volume={0.1} />
			<Sfx name="stamp" at={BRAVO} volume={0.12} />
			<Sfx name="whoosh" at={MAIS - 4} volume={0.06} />
			<Sfx name="pop" at={HOP - 2} volume={0.09} />
			{[0, 4, 8, 12].map((d) => (
				<Sfx key={d} name="pop" at={PLUS - 2 + d} volume={0.08} />
			))}
			<Sfx name="impact" at={CHOI} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const Serie: React.FC = () => {
	const frame = useCurrentFrame();
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const UN = at('serie', 'un');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const REP = at('serie', 'répondre');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[UN + 1, SERIE + 1, REP + 1]} shakes={[UN + 2]}>
				<Head kicker="Série · La douleur" kAt={NOUS - 4} title="Partie *1* sur 2" tAt={PART - 2} size={92} />
				<SeriesParts parts={PAIN_PARTS} current={0} at={UN - 2} />
				{frame >= AUJ - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, AUJ - 2)})`}}>
						<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${LPI.blue}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>
							Aujourd'hui : <span style={{color: LPI.blue}}>il peut répondre</span>
						</div>
					</div>
				) : null}
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={UN - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={REP} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE PRINCIPE ═══════════════════════════════ */
// Le patient a mal (éclairs) ; on s'approche : il le dit (« J'ai mal ! »), puis donne sa note (« 6 / 10 ») ; le terme
// « Auto-évaluation » claque et se range ; tampon « On le croit, toujours ».
const AP = {x: 303, y: 30, size: 330};
const apPt = (px: number, py: number) => ({x: AP.x + (px * AP.size) / 400, y: AP.y + (py * AP.size) / 400});

export const Auto: React.FC = () => {
	const frame = useCurrentFrame();
	const RESS = at('auto', 'ressent');
	const EXPR = at('auto', "s'exprimer");
	const LUI = at('auto', 'lui');
	const EVAL = at('auto', "l'évalue");
	const AUTO = at('auto', "l'auto-évaluation");
	const CROIT = at('auto', 'croit');
	const TOUJ = at('auto', 'toujours');
	const face = apPt(200, 140);
	const keys: CamKey[] = [
		{at: EXPR - 4, s: 1.5, x: face.x + 40, y: face.y + 80, dur: 14},
		{at: AUTO - 6, s: 1, dur: 14},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[RESS + 1, EXPR + 1, EVAL + 1, AUTO + 1, CROIT + 1]} strength={0.03}>
				<Head kicker="Le principe" kAt={2} title="C'est *lui* qui *évalue*" tAt={8} />
				<Stage y={440} h={540} at={4} bumps={[RESS, EVAL, AUTO]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: AP.x, top: AP.y}}>
							<Patient size={AP.size} breath={idle(frame)} mood={frame >= RESS - 2 ? 'mal' : 'calme'} pain={fadeIn(frame, RESS - 2, 8)} />
						</div>
					</ZoomCam>
					<Pop from={EXPR - 2} x={520} y={40} origin="left bottom">
						<Bubble tail="left">
							<span style={{fontSize: 46}}>{frame >= EVAL - 2 ? 'J’ai mal : 6 / 10' : 'J’ai mal !'}</span>
						</Bubble>
					</Pop>
					<StagePill from={LUI - 2} to={AUTO - 4} color={LPI.blue}>
						c'est lui qui la ressent
					</StagePill>
				</Stage>
				<TermSlam index={0} at={AUTO} term="Auto-évaluation" meaning="le patient évalue lui-même sa douleur" sign="check" slamY={710} slot={{x: 72, y: 1012, w: 936}} active={frame >= AUTO} />
				<Stamp at={CROIT} x={540} y={1265} text="On le croit, toujours" size={62} rot={-5} />
			</Camera>
			<Sfx name="buzz" at={RESS} volume={0.04} dur={14} />
			<Sfx name="pop" at={EXPR - 2} volume={0.1} />
			<Sfx name="tick" at={EVAL - 2} volume={0.08} />
			<Sfx name="stamp" at={CROIT} volume={0.11} />
			<Sfx name="ding" at={TOUJ} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · L'ÉCHELLE NUMÉRIQUE ═══════════════════════════════ */
// Le soignant demande « À combien avez-vous mal ? » ; l'échelle 0 → 10 arrive case par case ; 0 = aucune douleur,
// 10 = la pire douleur imaginable ; le patient répond « 6 » (la case 6 s'entoure).
export const En: React.FC = () => {
	const frame = useCurrentFrame();
	const NUM = at('en', 'numérique');
	const DE = at('en', 'de');
	const COMB = at('en', 'combien');
	const ZERO2 = at('en', 'zéro', 2);
	const AUC = at('en', 'aucune');
	const DIX2 = at('en', 'dix', 2);
	const PIRE = at('en', 'pire');
	const IMAG = at('en', 'imaginable');
	const ANS = IMAG + 16;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[NUM + 1, COMB + 1, ZERO2 + 1, DIX2 + 1, ANS + 1]} strength={0.03}>
				<Head kicker="Échelle numérique · EN" kAt={2} title="De *0* à *10*" tAt={8} size={100} />
				<Stage y={440} h={520} at={4} bumps={[COMB, ANS]}>
					<div style={{position: 'absolute', left: 60, top: 40}}>
						<Patient size={300} breath={idle(frame)} mood="mal" pain={0.6} />
					</div>
					<Pop from={COMB - 4} x={400} y={60} origin="left bottom">
						<Bubble tail="left" tone={LPI.sky}>
							<span style={{fontSize: 44}}>
								De 0 à 10, à combien
								<br />
								avez-vous mal ?
							</span>
						</Bubble>
					</Pop>
					<Pop from={ANS} x={420} y={300} origin="left bottom">
						<Bubble tail="left">
							<span style={{fontSize: 90, color: LPI.blue}}>6</span>
						</Bubble>
					</Pop>
					<StagePill from={NUM - 2} to={COMB - 6} color={LPI.blue}>
						EN = échelle numérique
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 990}}>
					<NumScale at={DE - 2} stagger={2} pick={6} pickAt={ANS} ends={[AUC - 2, PIRE - 2]} glow={[...(frame >= ZERO2 - 2 ? [0] : []), ...(frame >= DIX2 - 2 ? [10] : [])]} />
				</div>
			</Camera>
			<Sfx name="pop" at={COMB - 4} volume={0.1} />
			{Array.from({length: 11}, (_, i) => (
				<Sfx key={i} name="tick" at={DE - 2 + i * 2} volume={0.04} />
			))}
			<Sfx name="ding" at={ZERO2} volume={0.07} />
			<Sfx name="impact" at={DIX2} volume={0.07} />
			<Sfx name="pop" at={ANS} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'EVA : LA RÉGLETTE ═══════════════════════════════ */
// La réglette arrive ; côté patient : une ligne, « pas de douleur » ↔ « douleur maximale » ; un doigt fait glisser le
// curseur (gros plan) ; « sans chiffres » ; elle se retourne : côté soignant, graduée 0 → 10 ; on lit « 6,5 ».
const RX = 38;
const RY = 150;
const RW = 860;

export const Eva: React.FC = () => {
	const frame = useCurrentFrame();
	const EVA = at('eva', "l'eva");
	const ECH = at('eva', "l'échelle");
	const REG = at('eva', 'réglette');
	const COTE = at('eva', 'côté');
	const LIGNE = at('eva', 'ligne');
	const PAS = at('eva', 'pas');
	const MAXI = at('eva', 'maximale');
	const GLIS = at('eva', 'glisser');
	const CURS = at('eva', 'curseur');
	const SANS = at('eva', 'sans');
	const COTE2 = at('eva', 'côté', 2);
	const LIS = at('eva', 'lis');
	const SCORE = at('eva', 'score');
	const ZERO = at('eva', 'zéro');
	const pos = interpolate(frame, [GLIS - 2, CURS + 18], [0.06, 0.65], ease);
	const flip = interpolate(frame, [COTE2 - 4, COTE2 + 10], [0, 1], ease);
	const curX = RX + ((90 + 700 * pos) * RW) / 880;
	const keys: CamKey[] = [
		{at: GLIS - 4, s: 1.5, x: curX, y: RY + 130, dur: 14},
		{at: COTE2 - 8, s: 1, dur: 12},
		{at: LIS - 4, s: 1.55, x: RX + ((90 + 700 * 0.65) * RW) / 880, y: RY + 90, dur: 14},
		{at: ZERO - 4, s: 1, dur: 14},
	];
	const rul = popAt(frame, EVA - 2);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EVA + 1, REG + 1, GLIS + 1, COTE2 + 1, SCORE + 1]} strength={0.03}>
				<Head kicker="Échelle visuelle analogique" kAt={2} title="*L'EVA* : une *réglette*" tAt={EVA - 4} />
				<Stage y={440} h={540} at={4} bumps={[REG, COTE2, SCORE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						{rul > 0 ? (
							<div style={{position: 'absolute', left: RX, top: RY, transform: `scale(${rul})`}}>
								<Ruler pos={pos} flip={flip} width={RW} ends={[fadeIn(frame, PAS - 2, 6), fadeIn(frame, MAXI - 4, 6)]} hand={interpolate(frame, [GLIS - 8, GLIS - 2, SANS + 6, SANS + 14], [0, 1, 1, 0], clamp)} />
							</div>
						) : null}
						{frame >= SCORE - 2 ? (
							<div style={{position: 'absolute', left: RX + ((90 + 700 * 0.65) * RW) / 880 - 100, top: RY - 64, transform: `scale(${popAt(frame, SCORE - 2)})`}}>
								<div style={{width: 200, padding: '8px 0', borderRadius: 999, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N}}>6,5 / 10</div>
							</div>
						) : null}
					</ZoomCam>
					{/* de quel côté on regarde */}
					{frame >= COTE - 2 ? (
						<div style={{position: 'absolute', left: 30, top: 24}}>
							<Pill at={frame >= COTE2 ? COTE2 : COTE - 2} size={38} color={frame >= COTE2 ? LPI.blue : LPI.sky}>
								{frame >= COTE2 ? 'côté soignant' : 'côté patient'}
							</Pill>
						</div>
					) : null}
					<StagePill from={ECH - 2} to={COTE - 4} color={LPI.blue}>
						EVA = échelle visuelle analogique
					</StagePill>
					<StagePill from={LIGNE - 2} to={GLIS - 4} color={LPI.sky}>
						une simple ligne
					</StagePill>
					<StagePill from={SANS - 2} to={COTE2 - 4}>
						il ne voit aucun chiffre
					</StagePill>
					<StagePill from={ZERO - 2} color={LPI.sky}>
						score de 0 à 10
					</StagePill>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1030, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
					<CheckChip at={GLIS} label="le patient glisse le curseur" size={42} />
					<CheckChip at={LIS} label="le soignant lit le score" size={42} />
				</div>
			</Camera>
			<Sfx name="pop" at={REG - 2} volume={0.1} />
			<Sfx name="whoosh" at={GLIS} volume={0.05} />
			<Sfx name="whoosh" at={COTE2 - 4} volume={0.08} />
			<Sfx name="ding" at={SCORE} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · L'EVS : DES MOTS ═══════════════════════════════ */
// Le patient se perd dans les chiffres (« 3 ? 7 ? ») ; on passe aux mots : les 5 niveaux arrivent un par un ; il
// choisit « modérée ».
export const Evs: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIF = at('evs', 'chiffres');
	const MOTS = at('evs', 'mots');
	const VERB = at('evs', 'verbale');
	const W = ['pas', 'faible', 'modérée', 'intense', 'extrêmement'].map((w) => at('evs', w));
	const END = at('evs', 'intense', 2);
	const PICK = END + 16;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[MOTS + 1, ...W.map((w) => w + 1), PICK + 1]} strength={0.03}>
				<Head kicker="Échelle verbale simple · EVS" kAt={2} title="Avec des *mots*" tAt={8} size={100} />
				<Stage y={440} h={540} at={4} bumps={[MOTS, PICK]}>
					<div style={{position: 'absolute', left: 10, top: 110}}>
						<Patient size={280} breath={idle(frame)} mood="mal" pain={0.4} />
					</div>
					{/* les chiffres le perdent */}
					{frame >= CHIF - 2 && frame < MOTS + 6
						? ['3 ?', '7 ?', '5 ?'].map((t, i) => (
								<div key={t} style={{position: 'absolute', left: 30 + i * 90, top: 30 + (i % 2) * 40, fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: alpha(N, 0.55), opacity: fadeIn(frame, CHIF - 2 + i * 4, 6) * (1 - fadeIn(frame, MOTS - 2, 8)), transform: `rotate(${Math.sin(frame / 5 + i) * 10}deg)`}}>
									{t}
								</div>
							))
						: null}
					<div style={{position: 'absolute', left: 340, top: 26}}>
						<WordScale ats={W.map((w) => w - 2)} pick={2} pickAt={PICK} width={570} from={MOTS - 2} />
					</div>
					<Pop from={PICK} x={0} y={0} origin="left bottom">
						<Bubble tail="left">
							<span style={{fontSize: 40, color: LPI.blue}}>« modérée »</span>
						</Bubble>
					</Pop>
				</Stage>
				{frame >= VERB - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1012}}>
						<Pill at={VERB - 2} size={40} color={LPI.sky}>
							EVS = échelle verbale simple
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1110}}>
					<CheckChip at={MOTS} label="quand les chiffres sont difficiles" size={40} />
				</div>
			</Camera>
			{W.map((w) => (
				<Sfx key={w} name="pop" at={w - 2} volume={0.08} />
			))}
			<Sfx name="ding" at={PICK} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 5 · L'ÉCHELLE DES VISAGES ═══════════════════════════════ */
// Les 6 visages (0 → 10) ; l'enfant lève le bras et montre le 4e ; il est entouré ; score 6 / 10.
export const Visages: React.FC = () => {
	const frame = useCurrentFrame();
	const ENF = at('visages', "l'enfant");
	const QUAT = at('visages', 'quatre');
	const VIS = at('visages', 'visages');
	const MONTRE = at('visages', 'montre');
	const AUSSI = at('visages', 'aussi');
	const LUI = at('visages', 'lui');
	const point = interpolate(frame, [MONTRE - 4, MONTRE + 8], [0, 1], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ENF + 1, QUAT + 1, VIS + 1, AUSSI + 1]} strength={0.03}>
				<Head kicker="Chez l'enfant" kAt={2} title="L'échelle des *visages*" tAt={8} />
				<Stage y={440} h={560} at={4} bumps={[VIS, AUSSI]}>
					<div style={{position: 'absolute', left: 48, top: 26}}>
						<FacesScale at={VIS - 4} pick={3} pickAt={AUSSI - 2} size={118} gap={22} />
					</div>
					{frame >= ENF - 4 ? (
						<div style={{position: 'absolute', left: 60, top: 236, transform: `scale(${popAt(frame, ENF - 4)})`, transformOrigin: '50% 100%'}}>
							<Kid size={250} mood={frame >= AUSSI - 2 ? 'mal' : 'calme'} point={point} />
						</div>
					) : null}
					{point > 0.6 ? (
						<svg width={936} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<path d={`M300 300 C380 280 430 230 ${48 + 3 * 140 + 59} 200`} fill="none" stroke={LPI.pink} strokeWidth={7} strokeLinecap="round" strokeDasharray="10 12" strokeDashoffset={-frame * 2} opacity={fadeIn(frame, MONTRE + 4, 6)} />
						</svg>
					) : null}
					{frame >= QUAT - 2 ? (
						<div style={{position: 'absolute', left: 560, top: 330}}>
							<Pill at={QUAT - 2} size={46} color={LPI.blue}>
								dès 4 ans
							</Pill>
						</div>
					) : null}
				</Stage>
				{frame >= AUSSI - 2 ? (
					<div style={{position: 'absolute', left: 72, top: 1036}}>
						<Pill at={AUSSI - 2} size={40} color={LPI.sky}>
							le visage qui a aussi mal que lui
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1130}}>
					<CheckChip at={LUI + 6} label="score : 6 / 10" size={42} />
				</div>
			</Camera>
			<Sfx name="pop" at={ENF - 4} volume={0.09} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} name="tick" at={VIS - 4 + i * 4} volume={0.05} />
			))}
			<Sfx name="ding" at={AUSSI - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 6 · LE SEUIL : ON SOULAGE, ON RÉÉVALUE ═══════════════════════════════ */
// Échelle des repères (légère 1 – 3, modérée 4 – 6, intense 7 – 10), curseur sur 6, cadre « à soulager » dès 4 ; les
// étapes : 6/10 → antalgique (ou on prévient le médecin) → on réévalue → 2/10 ; même échelle, on note tout.
const PAIN_ZONES: Zone[] = [
	{name: 'légère', range: '1 – 3', tone: 'low', w: 3, lo: 0, hi: 3.5},
	{name: 'modérée', range: '4 – 6', tone: 'mid', w: 3, lo: 3.5, hi: 6.5},
	{name: 'intense', range: '7 – 10', tone: 'high', w: 4, lo: 6.5, hi: 10.5},
];

const Step: React.FC<{at: number; x: number; children: React.ReactNode; label: string; tone?: string}> = ({at: t0, x, children, label, tone = LPI.paper}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: 660, width: 196, height: 230, borderRadius: 34, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{height: 110, display: 'flex', alignItems: 'center'}}>{children}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: N, textAlign: 'center', lineHeight: 1.05, whiteSpace: 'pre-line'}}>{label}</div>
		</div>
	);
};
const Arrow: React.FC<{at: number; x: number}> = ({at: t0, x}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<svg width={60} height={40} viewBox="0 0 60 40" style={{position: 'absolute', left: x, top: 755, opacity: fadeIn(frame, t0, 5)}}>
			<path d="M4 20 H48 M36 8 L50 20 L36 32" fill="none" stroke={N} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	);
};
const ScoreBig: React.FC<{v: number}> = ({v}) => (
	<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 70, color: N, lineHeight: 1}}>
		{v}
		<span style={{fontSize: 34, color: alpha(N, 0.6)}}>/10</span>
	</div>
);

export const Seuil: React.FC = () => {
	const frame = useCurrentFrame();
	const QUAT = at('seuil', 'quatre');
	const SOUL = at('seuil', 'soulagée');
	const APPL = at('seuil', 'applique');
	const PREV = at('seuil', 'prévient');
	const REEV = at('seuil', 'réévalue');
	const ANTA = at('seuil', "l'antalgique");
	const MEME = at('seuil', 'même');
	const NOTE = at('seuil', 'note');
	const value = interpolate(frame, [ANTA + 4, ANTA + 26], [6, 2], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[QUAT + 1, SOUL + 1, APPL + 1, REEV + 1, MEME + 1, NOTE + 1]} strength={0.03}>
				<Head kicker="Et ensuite ?" kAt={2} title="Dès *4*, on *soulage*" tAt={8} size={96} />
				<NormScale zones={PAIN_ZONES} value={value} at={6} markerAt={QUAT} y={440} tag="EN · EVA" bracket={{lo: 3.5, hi: 10.5, label: 'à soulager', at: SOUL - 2}} />
				<Step at={QUAT} x={72} label="score" tone={alpha(LPI.pink, 0.55)}>
					<ScoreBig v={6} />
				</Step>
				<Arrow at={APPL - 4} x={274} />
				<Step at={APPL - 2} x={318} label={'antalgique\nprescrit'}>
					<PillIcon size={96} />
				</Step>
				<Arrow at={REEV - 4} x={520} />
				<Step at={REEV - 2} x={564} label="on réévalue">
					<svg width={100} height={100} viewBox="0 0 100 100">
						<path d="M80 50 A30 30 0 1 1 64 23" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" />
						<path d="M58 10 L68 24 L52 30" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</Step>
				<Arrow at={ANTA + 2} x={766} />
				<Step at={ANTA + 6} x={810} label="soulagé" tone={LPI.sky}>
					<ScoreBig v={2} />
				</Step>
				{frame >= PREV - 2 ? (
					<div style={{position: 'absolute', left: 250, top: 912}}>
						<Pill at={PREV - 2} size={34} color={LPI.blue}>
							ou on prévient le médecin
						</Pill>
					</div>
				) : null}
				<div style={{position: 'absolute', left: 72, top: 1030, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
					<CheckChip at={MEME - 2} label="avec la même échelle" size={42} />
					<CheckChip at={NOTE - 2} label="on note tout dans le dossier" size={42} />
				</div>
			</Camera>
			<Sfx name="impact" at={QUAT} volume={0.08} />
			<Sfx name="pop" at={APPL - 2} volume={0.09} />
			<Sfx name="pop" at={PREV - 2} volume={0.08} />
			<Sfx name="whoosh" at={REEV - 2} volume={0.06} />
			<Sfx name="ding" at={ANTA + 6} volume={0.09} />
			<Sfx name="pop" at={MEME - 2} volume={0.08} />
			<Sfx name="pop" at={NOTE - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const DANS = at('outro', 'dans');
	return (
		<AbsoluteFill>
			<RecapScene
				title="*L'auto-évaluation*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'réévalue') + 10}
				rows={[
					[at('outro', 'répondre'), 'check', 'Il peut répondre', "c'est lui qui évalue"],
					[at('outro', 'chiffres'), 'wave', 'Échelle numérique', '0 à 10'],
					[at('outro', 'réglette'), 'device', 'EVA', 'la réglette'],
					[at('outro', 'mots'), 'wave', 'EVS', '5 mots'],
					[at('outro', 'visages'), 'check', 'Visages', 'enfant, dès 4 ans'],
					[at('outro', 'quatre'), 'alert', 'Dès 4 / 10', 'on soulage, on réévalue'],
				]}
			/>
			<NextUp at={DANS - 2} part={2} title="Il ne répond pas" teaser="… comment savoir qu'il a mal ?" icon={<MuteIcon size={96} />} y={1210} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
		</AbsoluteFill>
	);
};
