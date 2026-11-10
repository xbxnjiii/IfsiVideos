// Série « La douleur : échelles d'évaluation », partie 1 / 2 : l'auto-évaluation — v2 (look 2026, voix Laura).
// Accroche « trois soignants, trois avis » (choisie par le propriétaire) : image 0 = le patient et « Il a mal à
// combien ? » ; trois avis claquent PAR-DESSUS lui et le cachent (« un peu mal », « il exagère », « ça va très bien ») ;
// « Et lui ? » : les avis s'envolent, on le retrouve ; « Personne ne lui a demandé ! » (tampon, flash) ; lui seul la
// sent ; « Comment la mesurer ? ». Puis la carte de la série, le principe (c'est lui qui évalue, on le croit : les trois
// avis sont barrés), l'échelle numérique (barres 0 → 10, la mascotte pose la question, il répond), la réglette EVA
// (côté patient / côté soignant), l'EVS (5 mots), les visages chez l'enfant, le seuil (dès 4 : on soulage, on réévalue,
// on note), récap + « à suivre ». Un aplat de couleur par scène, une idée par plan, vrai flou de mouvement
// (src/brand/bold.tsx). Briques : src/brand/pain.tsx. La v1 reste dans l'historique git (commit bcf0f1d).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, BigNumber, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, RowCard, ToneBg} from '../../brand/bold';
import {PillIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Burst, Camera, Confetti} from '../../brand/motion3';
import {Bubble, Carer, EVS_WORDS, Kid, MuteIcon, PAIN_PARTS, PainBars, PainFace, painTone, Ruler, TalkIcon} from '../../brand/pain';
import {Patient} from '../../brand/patient';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const SKY = LPI.sky;
const ROSE = alpha(LPI.pink, 0.6);
/** Titres sur l'aplat bleu : blanc cassé, accent bleu nuit. */
const ON_BLUE = {color: LPI.paper, accent: N};
const idle = (frame: number, period = 70) => 0.5 - 0.5 * Math.cos((frame / period) * Math.PI * 2);

/** Élément posé (coin haut-gauche en x, y) qui « pop » à `from` et s'efface à `to`. */
const Pop: React.FC<{from: number; to?: number; x: number; y: number; children: React.ReactNode; origin?: string}> = ({from, to = 1e9, x, y, children, origin = 'left bottom'}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to + 6) return null;
	const out = interpolate(frame, [to, to + 6], [1, 0], clamp);
	return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${popAt(frame, from) * (0.7 + 0.3 * out)})`, transformOrigin: origin, opacity: out}}>{children}</div>;
};

/** Croix rose (avis barré). */
const Cross: React.FC<{at: number; size?: number}> = ({at: t0, size = 120}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = fadeIn(frame, t0, 5);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2, transform: `scale(${popAt(frame, t0)})`, overflow: 'visible'}}>
			<path d="M18 18 L82 82" stroke={N} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
			<path d="M82 18 L18 82" stroke={N} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
			<path d="M18 18 L82 82" stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
			<path d="M82 18 L18 82" stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : TROIS SOIGNANTS, TROIS AVIS ═══════════════════════════════ */
const OPINIONS = [
	{who: 'SOIGNANT 1', text: 'Il a un peu mal.', tone: LPI.sky, hair: 0 as const, side: 'left' as const, y: 640},
	{who: 'SOIGNANT 2', text: 'Il exagère !', tone: LPI.pink, hair: 1 as const, side: 'right' as const, y: 890},
	{who: 'SOIGNANT 3', text: 'Ça va très bien.', tone: LPI.blue, hair: 2 as const, side: 'left' as const, y: 1140},
];

/** Carte d'avis (760 × 196) : le soignant et ce qu'il pense. */
const OpinionCard: React.FC<{o: (typeof OPINIONS)[number]}> = ({o}) => (
	<div style={{width: 760, height: 196, boxSizing: 'border-box', borderRadius: 52, background: LPI.paper, border: `7px solid ${N}`, boxShadow: `0 16px 0 ${alpha(N, 0.16)}`, display: 'flex', flexDirection: o.side === 'left' ? 'row' : 'row-reverse', alignItems: 'center', gap: 22, padding: '0 28px'}}>
		<Carer size={132} tone={o.tone} hair={o.hair} />
		<div style={{flex: 1, textAlign: o.side === 'left' ? 'left' : 'right'}}>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.14em', color: alpha(N, 0.65)}}>{o.who}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, lineHeight: 1.05, whiteSpace: 'nowrap'}}>« {o.text} »</div>
		</div>
	</div>
);

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('intro', "l'un,");
	const AUTRE = at('intro', "l'autre,");
	const TROIS = at('intro', 'troisième,');
	const ET = at('intro', 'et');
	const PERS = at('intro', 'personne');
	const DEM = at('intro', 'demandé');
	const POURT = at('intro', 'pourtant,');
	const DOUL = at('intro', 'douleur,');
	const SEUL = at('intro', 'seul');
	const ALORS = at('intro', 'alors,');
	const MES = at('intro', 'mesurer');
	const ins = [UN - 3, AUTRE - 3, TROIS - 3];
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[...ins.map((t) => t + 4), ET + 1, DEM + 1, SEUL + 1, MES + 1]} shakes={[DEM + 2]} strength={0.04}>
				{/* sa douleur : des ondes roses que lui seul sent */}
				{frame >= DOUL - 2
					? [0, 1, 2].map((i) => {
							const t = ((frame - (DOUL - 2)) / 40 + i / 3) % 1;
							return <div key={i} style={{position: 'absolute', left: 540 - 150 - 330 * t, top: 700 - 150 - 330 * t, width: 300 + 660 * t, height: 300 + 660 * t, borderRadius: '50%', border: `${14 * (1 - t) + 4}px solid ${alpha(LPI.pink, 0.75 * (1 - t) * fadeIn(frame, DOUL - 2, 10))}`}} />;
						})
					: null}
				{/* le patient : d'abord enseveli sous les avis, puis seul au centre */}
				<Fly at={-60} x={540} y={920} move={[{at: ET - 2, s: 1.1, y: 930, dur: 14}]}>
					<Live render={(f) => <Patient size={600} breath={idle(f)} mood="mal" pain={fadeIn(f, DOUL - 2, 10)} />} />
				</Fly>
				{/* les trois avis claquent par-dessus lui */}
				{OPINIONS.map((o, i) => (
					<Fly key={o.who} at={ins[i]} out={ET - 2} x={o.side === 'left' ? 430 : 650} y={o.y} from={o.side} to={o.side} rot={o.side === 'left' ? -2 : 2}>
						<OpinionCard o={o} />
					</Fly>
				))}
				{/* lui : personne ne lui a demandé */}
				<Pop from={PERS - 2} x={700} y={470}>
					<Bubble tail="left" pad="14px 40px">
						<span style={{fontSize: 84, lineHeight: 1.1, color: frame >= SEUL ? LPI.blue : alpha(N, 0.55)}}>{frame >= SEUL ? '? / 10' : '…'}</span>
					</Bubble>
				</Pop>
				<Stamp at={DEM} x={540} y={1400} text="Personne ne lui a demandé !" size={54} rot={-5} out={ALORS - 6} />
				<Burst at={MES} x={540} y={300} r={420} n={16} />
				{/* titres */}
				<Big from={-60} to={ET - 6} text={'Il a mal\nà *combien* ?'} size={124} y={150} />
				<Big from={ET - 4} to={POURT - 6} text={'Et *lui* ?'} size={170} y={160} />
				<Big from={POURT - 4} to={ALORS - 6} text={'Lui seul\nla *sent*'} size={130} y={150} />
				<Big from={ALORS - 4} text={'Comment\nla *mesurer* ?'} size={124} y={150} />
			</Camera>
			<Flash at={DEM} max={0.3} />
			{ins.map((t) => (
				<React.Fragment key={t}>
					<Sfx name="whoosh" at={t} volume={0.08} />
					<Sfx name="impact" at={t + 9} volume={0.08} />
				</React.Fragment>
			))}
			<Sfx name="whoosh" at={ET - 2} volume={0.1} />
			<Sfx name="pop" at={PERS - 2} volume={0.08} />
			<Sfx name="stamp" at={DEM} volume={0.13} />
			<Sfx name="buzz" at={DOUL - 2} volume={0.04} dur={14} />
			<Sfx name="ding" at={SEUL} volume={0.08} />
			<Sfx name="impact" at={MES} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const Serie: React.FC = () => {
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const UN = at('serie', 'un');
	const SERIE = at('serie', 'série');
	const AUJ = at('serie', "aujourd'hui");
	const REP = at('serie', 'répondre');
	return (
		<AbsoluteFill>
			<ToneBg tone={alpha(LPI.sky, 0.45)} />
			<Camera punches={[UN + 1, SERIE + 1, REP + 1]} shakes={[UN + 2]}>
				<Note at={NOUS - 4} y={150} size={34} tone={N}>
					SÉRIE · LA DOULEUR
				</Note>
				<Big from={PART - 2} text={'Partie *1* sur 2'} size={124} y={250} center />
				<SeriesParts parts={PAIN_PARTS} current={0} at={UN - 2} y={520} />
				<Note at={AUJ - 2} y={960} size={50}>
					Aujourd&apos;hui : <span style={{color: LPI.blue}}>il peut répondre</span>
				</Note>
			</Camera>
			{[0, 1].map((i) => (
				<Sfx key={i} name="pop" at={UN - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={REP} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PRINCIPE : C'EST LUI QUI ÉVALUE ═══════════════════════════════ */
// Le patient a mal ; il le dit (« J'ai mal ! ») ; « c'est donc lui » : les trois soignants de l'accroche reviennent…
// et sont barrés ; sa note : « 6 sur 10 ! » ; « Auto-évaluation » ; tampon « On le croit, toujours ».
export const Auto: React.FC = () => {
	const frame = useCurrentFrame();
	const RESS = at('auto', 'ressent');
	const EXPR = at('auto', "s'exprimer,");
	const DONC = at('auto', 'donc');
	const EVAL = at('auto', "l'évalue.");
	const AUTO = at('auto', "l'auto-évaluation,");
	const CROIT = at('auto', 'croit,');
	const TOUJ = at('auto', 'toujours.');
	const said = frame >= EVAL - 2;
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[RESS + 1, EXPR + 1, DONC + 1, EVAL + 1, AUTO + 1, CROIT + 1]} shakes={[CROIT + 2]} strength={0.03}>
				<Big from={-2} to={DONC - 6} text={'La *douleur*,\nil la *ressent*'} size={116} />
				<Big from={DONC - 4} to={AUTO - 6} text={"C'est *lui*\nqui *évalue*"} size={124} />
				<Big from={AUTO - 4} text={"*L'auto-*\n*évaluation*"} size={124} />
				<Fly at={-4} x={610} y={920} from="bottom" dist={1100}>
					<Live render={(f) => <Patient size={560} breath={idle(f)} mood={f >= RESS - 2 ? 'mal' : 'calme'} pain={fadeIn(f, RESS - 2, 8)} />} />
				</Fly>
				<Pop from={said ? EVAL - 2 : EXPR - 2} x={700} y={520}>
					<Bubble tail="left" pad="16px 34px">
						<span style={{fontSize: 62, color: said ? LPI.blue : N}}>{said ? '6 sur 10 !' : 'J’ai mal !'}</span>
					</Bubble>
				</Pop>
				{/* les trois avis de l'accroche : barrés */}
				{OPINIONS.map((o, i) => (
					<Fly key={o.who} at={DONC - 2 + i * 3} out={AUTO - 8} x={170} y={640 + i * 200} from="left" to="left">
						<div style={{position: 'relative'}}>
							<Carer size={170} tone={o.tone} hair={o.hair} />
							<Cross at={EVAL - 4 + i * 3} size={150} />
						</div>
					</Fly>
				))}
				<Note at={AUTO + 4} y={1250} size={46}>
					le patient évalue lui-même sa douleur
				</Note>
				<Stamp at={CROIT} x={600} y={1392} text="On le croit, toujours" size={60} rot={-4} />
				<Burst at={CROIT} x={600} y={1392} r={300} n={14} />
			</Camera>
			<Flash at={CROIT} max={0.2} color={LPI.paper} />
			<Sfx name="buzz" at={RESS} volume={0.04} dur={14} />
			<Sfx name="pop" at={EXPR - 2} volume={0.1} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="tick" at={EVAL - 4 + i * 3} volume={0.07} />
			))}
			<Sfx name="pop" at={EVAL - 2} volume={0.09} />
			<Sfx name="whoosh" at={AUTO - 8} volume={0.07} />
			<Sfx name="stamp" at={CROIT} volume={0.12} />
			<Sfx name="ding" at={TOUJ} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · L'ÉCHELLE NUMÉRIQUE ═══════════════════════════════ */
// 11 barres de plus en plus hautes poussent d'abord sans chiffres, puis « de 0 à 10 » : les cases arrivent ; la question arrive au-dessus de la mascotte (c'est elle qui la pose) ;
// 0 = aucune douleur, 10 = la pire douleur imaginable ; le patient (en bas à gauche) répond « 6 ! », la barre s'allume.
const BARS = {x: 60, y: 480, w: 960, maxH: 440, minH: 90};
const barX = (v: number) => BARS.x + v * ((BARS.w - 80) / 11 + 8) + (BARS.w - 80) / 22;
const barTop = (v: number) => BARS.y + BARS.maxH - (BARS.minH + ((BARS.maxH - BARS.minH) * v) / 10);

export const En: React.FC = () => {
	const frame = useCurrentFrame();
	const NUM = at('en', 'numérique');
	const DE = at('en', 'de');
	const COMB = at('en', 'combien');
	const ZERO2 = at('en', 'zéro,', 2);
	const DIX2 = at('en', 'dix,', 2);
	const IMAG = at('en', 'imaginable.');
	const ANS = IMAG + 16;
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[NUM + 1, DE + 1, COMB + 1, ZERO2 + 1, DIX2 + 1, ANS + 1]} strength={0.03}>
				<Big from={-2} to={DE - 6} text={"L'échelle\n*numérique*"} size={120} />
				<Big from={DE - 4} text={'De *0* à *10*'} size={150} />
				<div style={{position: 'absolute', left: BARS.x, top: BARS.y}}>
					<PainBars at={6} stagger={5} numsAt={DE - 2} width={BARS.w} maxH={BARS.maxH} minH={BARS.minH} pick={6} pickAt={ANS} glow={[...(frame >= ZERO2 - 2 ? [0] : []), ...(frame >= DIX2 - 2 ? [10] : [])]} />
				</div>
				<PointTag at={ZERO2 - 2} x={290} y={600} px={barX(0)} py={barTop(0)}>
					0 = aucune douleur
				</PointTag>
				<PointTag at={DIX2 - 2} x={600} y={408} px={barX(10)} py={barTop(10)} size={40}>
					10 = la pire douleur imaginable
				</PointTag>
				{/* la question (posée par la mascotte, en bas à droite) et la réponse du patient */}
				<Pop from={COMB - 4} x={470} y={1262} origin="right bottom">
					<Bubble tail="right" tone={LPI.sky} pad="14px 30px">
						<span style={{fontSize: 42, lineHeight: 1.15, display: 'inline-block'}}>
							De 0 à 10, à combien
							<br />
							avez-vous mal ?
						</span>
					</Bubble>
				</Pop>
				<Fly at={COMB - 10} x={180} y={1350} from="left">
					<Live render={(f) => <Patient size={300} breath={idle(f)} mood="mal" pain={0.6} />} />
				</Fly>
				<Pop from={ANS} x={290} y={1092}>
					<Bubble tail="left" pad="6px 40px">
						<span style={{fontSize: 100, lineHeight: 1.15, color: LPI.blue}}>6&nbsp;!</span>
					</Bubble>
				</Pop>
			</Camera>
			{Array.from({length: 11}, (_, i) => (
				<React.Fragment key={i}>
					<Sfx name="pop" at={6 + i * 5} volume={0.03} />
					<Sfx name="tick" at={DE - 2 + i * 2} volume={0.04} />
				</React.Fragment>
			))}
			<Sfx name="pop" at={COMB - 4} volume={0.1} />
			<Sfx name="ding" at={ZERO2} volume={0.07} />
			<Sfx name="impact" at={DIX2} volume={0.07} />
			<Sfx name="pop" at={ANS} volume={0.1} />
			<Sfx name="ding" at={ANS + 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · L'EVA : LA RÉGLETTE ═══════════════════════════════ */
// La réglette arrive en plein cadre dès « l'EVA » ; côté patient : une ligne, « pas de douleur » ↔ « douleur maximale », le doigt fait
// glisser le curseur, sans chiffres ; elle se retourne : côté soignant, graduée de 0 à 10, on lit « 6,5 / 10 ».
const RUL = {x: 40, y: 670, w: 1000};
const curX = (pos: number) => RUL.x + ((90 + 700 * pos) * RUL.w) / 880;

export const Eva: React.FC = () => {
	const EVA = at('eva', "l'eva,");
	const ECH = at('eva', "l'échelle");
	const REG = at('eva', 'réglette.');
	const COTE = at('eva', 'côté');
	const LIGNE = at('eva', 'ligne,');
	const PAS = at('eva', 'pas');
	const MAXI = at('eva', 'maximale');
	const GLIS = at('eva', 'glisser');
	const CURS = at('eva', 'curseur,');
	const SANS = at('eva', 'sans');
	const COTE2 = at('eva', 'côté', 2);
	const LIS = at('eva', 'lis');
	const SCORE = at('eva', 'score,');
	const ZERO = at('eva', 'zéro');
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[EVA + 1, REG + 1, COTE + 1, GLIS + 1, COTE2 + 1, SCORE + 1]} strength={0.03}>
				<Big from={-2} to={REG - 6} text={"*L'EVA*"} size={180} y={160} />
				<Note at={ECH - 2} to={REG - 6} y={420} size={52}>
					= échelle visuelle analogique
				</Note>
				<Big from={REG - 4} to={COTE - 6} text={'Une *réglette*'} size={136} />
				<Big from={COTE - 4} to={COTE2 - 6} text={'Côté *patient*'} size={136} />
				<Big from={COTE2 - 4} text={'Côté *soignant*'} size={128} />
				<Fly at={EVA - 4} x={540} y={RUL.y + 130} from="right" move={[{at: COTE2 - 4, s: 1, dur: 14}]}>
					<Live
						render={(f) => (
							<Ruler
								width={RUL.w}
								pos={interpolate(f, [GLIS - 2, CURS + 18], [0.06, 0.65], ease)}
								flip={interpolate(f, [COTE2 - 4, COTE2 + 10], [0, 1], ease)}
								ends={[fadeIn(f, PAS - 2, 6), fadeIn(f, MAXI - 4, 6)]}
								hand={interpolate(f, [GLIS - 8, GLIS - 2, SANS + 6, SANS + 14], [0, 1, 1, 0], clamp)}
							/>
						)}
					/>
				</Fly>
				<Note at={LIGNE - 2} to={GLIS - 6} y={1000} size={52}>
					une simple ligne
				</Note>
				<Note at={SANS - 2} to={COTE2 - 6} y={1000} size={52} tone={LPI.pink}>
					il ne voit aucun chiffre
				</Note>
				<PointTag at={SCORE - 2} x={curX(0.65)} y={590} px={curX(0.65)} py={RUL.y + 44} size={58} tone={LPI.pink}>
					6,5 / 10
				</PointTag>
				<Note at={ZERO - 2} y={1000} size={52}>
					un score de 0 à 10
				</Note>
				<RowCard at={GLIS} y={1140} h={124} size={44} title="Le patient glisse le curseur" check={CURS + 14} badge={<TalkIcon size={50} />} badgeTone={LPI.sky} />
				<RowCard at={LIS} y={1284} h={124} size={44} title="Le soignant lit le score" check={SCORE + 6} from="left" badge="✓" badgeTone={LPI.blue} />
			</Camera>
			<Sfx name="whoosh" at={EVA - 4} volume={0.08} />
			<Sfx name="pop" at={REG - 2} volume={0.08} />
			<Sfx name="pop" at={LIGNE - 2} volume={0.07} />
			<Sfx name="whoosh" at={GLIS} volume={0.05} />
			<Sfx name="pop" at={SANS - 2} volume={0.07} />
			<Sfx name="whoosh" at={COTE2 - 4} volume={0.09} />
			<Sfx name="pop" at={LIS} volume={0.07} />
			<Sfx name="ding" at={SCORE} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'EVS : DES MOTS ═══════════════════════════════ */
// Le patient se perd dans les chiffres (« 3 ? 7 ? 5 ? » tournent autour de lui) ; « des mots » : les chiffres s'envolent,
// les 5 mots arrivent un par un en grandes pastilles ; il choisit « modérée ».
const WORD_Y = 470;
const WORD_STEP = 138;

const WordRow: React.FC<{at: number; i: number; on: boolean; dim: boolean}> = ({at: t0, i, on, dim}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = Math.min(1, (frame - t0) / 9);
	const v = [0, 2, 5, 7, 10][i];
	return (
		<div style={{position: 'absolute', left: 70, top: WORD_Y + i * WORD_STEP, width: 940, height: 120, boxSizing: 'border-box', borderRadius: 60, background: on ? painTone(v) : LPI.paper, border: `${on ? 8 : 6}px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px', transform: `translateX(${(i % 2 ? -1 : 1) * (1 - Easing.out(Easing.cubic)(k)) * 420}px) scale(${popAt(frame, t0) * (on ? 1.05 : 1)})`, opacity: (0.4 + 0.6 * k) * (dim ? 0.5 : 1)}}>
			<div style={{display: 'flex', gap: 7, alignItems: 'flex-end', height: 70}}>
				{[0, 1, 2, 3].map((b) => (
					<div key={b} style={{width: 20, height: 22 + b * 15, borderRadius: 6, background: b < i ? (on ? LPI.paper : painTone(v)) : alpha(N, 0.12), border: `4px solid ${b < i ? N : 'transparent'}`, boxSizing: 'border-box'}} />
				))}
			</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: on && v >= 4 && v <= 6 ? LPI.paper : N, whiteSpace: 'nowrap'}}>{EVS_WORDS[i]}</div>
		</div>
	);
};

export const Evs: React.FC = () => {
	const frame = useCurrentFrame();
	const CHIF = at('evs', 'chiffres');
	const MOTS = at('evs', 'mots');
	const ECH = at('evs', "l'échelle");
	const W = ['pas', 'faible,', 'modérée,', 'intense,', 'extrêmement'].map((w) => at('evs', w));
	const END = at('evs', 'intense', 2);
	const PICK = END + 14;
	const picked = frame >= PICK;
	const DIGITS = [
		{t: '3 ?', x: 230, y: 640, to: 'left' as const},
		{t: '7 ?', x: 860, y: 600, to: 'right' as const},
		{t: '5 ?', x: 820, y: 960, to: 'right' as const},
	];
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[CHIF + 1, MOTS + 1, ...W.map((w) => w + 1), PICK + 1]} strength={0.03}>
				<Big from={-2} to={MOTS - 6} text={'Les chiffres…\n*difficiles* ?'} size={112} />
				<Big from={MOTS - 4} text={'Des *mots*'} size={160} />
				<Note at={ECH - 2} y={356} size={44} x={62}>
					EVS = échelle verbale simple
				</Note>
				<Fly at={-4} x={540} y={880} from="bottom" dist={1100} move={[{at: W[0] - 14, x: 190, y: 1330, s: 0.62, dur: 12}]}>
					<Live render={(f) => <Patient size={440} breath={idle(f)} mood="mal" pain={0.4} />} />
				</Fly>
				{DIGITS.map((d, i) => (
					<Fly key={d.t} at={CHIF - 2 + i * 4} out={MOTS - 4} x={d.x} y={d.y} from="top" to={d.to} dist={900}>
						<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N, WebkitTextStroke: `10px ${LPI.paper}`, paintOrder: 'stroke', transform: `rotate(${Math.sin(f / 5 + i * 2) * 12}deg)`, whiteSpace: 'nowrap'}}>{d.t}</div>} />
					</Fly>
				))}
				{W.map((w, i) => (
					<WordRow key={i} at={w - 2} i={i} on={picked && i === 2} dim={picked && i !== 2} />
				))}
				<Pop from={PICK} x={300} y={1196}>
					<Bubble tail="left" pad="12px 34px">
						<span style={{fontSize: 56, color: LPI.blue}}>« modérée »</span>
					</Bubble>
				</Pop>
			</Camera>
			{DIGITS.map((d, i) => (
				<Sfx key={d.t} name="pop" at={CHIF - 2 + i * 4} volume={0.06} />
			))}
			<Sfx name="whoosh" at={MOTS - 4} volume={0.09} />
			{W.map((w) => (
				<Sfx key={w} name="pop" at={w - 2} volume={0.08} />
			))}
			<Sfx name="ding" at={PICK} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · L'ÉCHELLE DES VISAGES ═══════════════════════════════ */
// L'enfant arrive en grand (« dès 4 ans ») ; il se range en bas à gauche, les 6 visages (0 → 10) arrivent en deux rangées ;
// il lève le bras et montre le visage qui a aussi mal que lui : score 6 / 10.
const FACE_X = [210, 540, 870];
const FACE_Y = [610, 900];

export const Visages: React.FC = () => {
	const frame = useCurrentFrame();
	const ENF = at('visages', "l'enfant,");
	const QUAT = at('visages', 'quatre');
	const ECH = at('visages', "l'échelle");
	const VIS = at('visages', 'visages');
	const MONTRE = at('visages', 'montre');
	const AUSSI = at('visages', 'aussi');
	const LUI = at('visages', 'lui.');
	const picked = frame >= AUSSI - 2;
	return (
		<AbsoluteFill>
			<ToneBg tone={SKY} />
			<Camera punches={[ENF + 1, QUAT + 1, VIS + 1, MONTRE + 1, AUSSI + 1]} strength={0.03}>
				<Big from={-2} to={ECH - 8} text={"Chez\n*l'enfant*"} size={136} />
				<Big from={ECH - 6} text={"L'échelle\ndes *visages*"} size={120} />
				<Note at={QUAT - 2} to={ECH - 8} y={1200} size={88} tone={LPI.pink}>
					dès 4 ans
				</Note>
				{/* les 6 visages */}
				{[0, 1, 2, 3, 4, 5].map((i) => {
					const t = ECH - 2 + i * 3;
					if (frame < t) return null;
					const on = picked && i === 3;
					const x = FACE_X[i % 3];
					const y = FACE_Y[Math.floor(i / 3)];
					return (
						<div key={i} style={{position: 'absolute', left: x - 115, top: y - 115, width: 230, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, transform: `scale(${popAt(frame, t) * (on ? 1.14 : 1)})`, opacity: picked && !on ? 0.5 : 1}}>
							<div style={{borderRadius: '50%', boxShadow: on ? `0 0 0 12px ${LPI.paper}, 0 0 0 20px ${LPI.pink}` : 'none', lineHeight: 0}}>
								<PainFace level={i} size={230} />
							</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: on ? LPI.blue : alpha(N, 0.7), marginTop: on ? 14 : 0}}>{i * 2}</div>
						</div>
					);
				})}
				{/* il montre son visage */}
				{frame >= MONTRE + 2 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<path d="M300 1210 C330 1150 300 1110 250 1070" fill="none" stroke={N} strokeWidth={8} strokeLinecap="round" strokeDasharray="12 14" strokeDashoffset={-frame * 2} opacity={fadeIn(frame, MONTRE + 2, 6)} />
					</svg>
				) : null}
				<Fly at={ENF - 8} x={540} y={870} from="bottom" dist={1100} move={[{at: ECH - 8, x: 190, y: 1300, s: 0.6, dur: 12}]}>
					<Live render={(f) => <Kid size={440} mood={f >= AUSSI - 2 ? 'mal' : 'calme'} point={interpolate(f, [MONTRE - 4, MONTRE + 8], [0, 1], ease)} />} />
				</Fly>
				<Note at={ECH - 4} y={1340} x={380} size={48} tone={LPI.pink}>
					dès 4 ans
				</Note>
				<Note at={LUI} y={1210} x={380} size={56}>
					score : 6 / 10
				</Note>
			</Camera>
			<Sfx name="whoosh" at={ENF - 8} volume={0.08} />
			<Sfx name="pop" at={QUAT - 2} volume={0.09} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} name="tick" at={ECH - 2 + i * 3} volume={0.05} />
			))}
			<Sfx name="ding" at={AUSSI - 2} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ ET ENSUITE ? DÈS 4, ON SOULAGE ═══════════════════════════════ */
// Un 4 géant claque (« Dès 4 sur 10 », la douleur doit être soulagée), puis quatre cartes au mot : on applique la
// prescription (ou on prévient le médecin), on réévalue après l'antalgique (la note redescend de 6 à 2), avec la même
// échelle, et on note tout.
const Loop: React.FC<{size?: number}> = ({size = 96}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M80 50 A30 30 0 1 1 64 23" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" />
		<path d="M58 9 L69 24 L51 30" fill="none" stroke={N} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
const Chart: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<rect x={18} y={14} width={64} height={78} rx={10} fill={LPI.paper} stroke={N} strokeWidth={6} />
		<rect x={36} y={6} width={28} height={18} rx={6} fill={LPI.blue} stroke={N} strokeWidth={5} />
		<path d="M30 42 H70 M30 58 H70 M30 74 H54" stroke={alpha(N, 0.5)} strokeWidth={6} strokeLinecap="round" />
		<path d="M58 70 L66 80 L84 56" fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

export const Seuil: React.FC = () => {
	const frame = useCurrentFrame();
	const QUAT = at('seuil', 'quatre');
	const SOUL = at('seuil', 'soulagée');
	const APPL = at('seuil', 'applique');
	const PREV = at('seuil', 'prévient');
	const PUIS = at('seuil', 'puis');
	const REEV = at('seuil', 'réévalue');
	const ANTA = at('seuil', "l'antalgique,");
	const MEME = at('seuil', 'même');
	const NOTE = at('seuil', 'note');
	const score = Math.round(interpolate(frame, [ANTA + 2, ANTA + 22], [6, 2], ease));
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.blue} light={0.1} />
			<Camera punches={[QUAT + 1, SOUL + 1, APPL + 1, REEV + 1, MEME + 1, NOTE + 1]} shakes={[QUAT + 2]} strength={0.03}>
				<BigNumber at={2} out={APPL - 10} n={4} title={'Dès *4* sur *10*…'} {...ON_BLUE} />
				<Note at={SOUL - 2} to={APPL - 10} y={1240} size={52} tone={LPI.pink}>
					la douleur doit être soulagée
				</Note>
				<Big from={APPL - 8} to={PUIS - 6} text={'On *soulage*'} size={140} {...ON_BLUE} />
				<Big from={PUIS - 4} text={'On *réévalue*'} size={140} {...ON_BLUE} />
				<RowCard at={APPL - 4} y={470} h={196} title="On applique la prescription" sub="ou on prévient le médecin" subAt={PREV - 2} art={150} dim={frame >= PUIS ? 1 : 0}>
					<PillIcon size={120} />
				</RowCard>
				<RowCard at={REEV - 4} y={690} h={196} title="On réévalue" sub="après l'antalgique" subAt={ANTA - 2} art={230} from="left">
					<div style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<Loop size={86} />
						<div style={{width: 120, padding: '6px 0', borderRadius: 26, background: score >= 4 ? LPI.pink : LPI.sky, border: `5px solid ${N}`, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: N, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums'}}>
							{score}
							<span style={{fontSize: 28, color: alpha(N, 0.7)}}>/10</span>
						</div>
					</div>
				</RowCard>
				<RowCard at={MEME - 4} y={910} h={196} title="Avec la même échelle" art={230}>
					<Ruler pos={0.2} flip={0} width={230} ends={[0, 0]} />
				</RowCard>
				<RowCard at={NOTE - 4} y={1130} h={196} title="Et on note tout" sub="dans le dossier de soins" art={150} from="left">
					<Chart size={120} />
				</RowCard>
			</Camera>
			<Flash at={QUAT} max={0.25} />
			<Sfx name="whoosh" at={2} volume={0.08} />
			<Sfx name="impact" at={QUAT} volume={0.1} />
			<Sfx name="pop" at={SOUL - 2} volume={0.08} />
			<Sfx name="whoosh" at={APPL - 10} volume={0.08} />
			{[APPL, REEV, MEME, NOTE].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.09} />
			))}
			<Sfx name="pop" at={PREV - 2} volume={0.06} />
			<Sfx name="ding" at={ANTA + 22} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + À SUIVRE ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const REP = at('outro', 'répondre,');
	const CHIF = at('outro', 'chiffres,');
	const REG = at('outro', 'réglette,');
	const MOTS = at('outro', 'mots,');
	const VIS = at('outro', 'visages');
	const QUAT = at('outro', 'quatre,');
	const REEV = at('outro', 'réévalue.');
	const DANS = at('outro', 'dans');
	const rows: [number, React.ReactNode, string, string][] = [
		[REP - 2, <TalkIcon key="t" size={50} />, "C'est lui qui évalue", "s'il peut répondre"],
		[CHIF - 2, '1', 'Des chiffres', 'échelle numérique · 0 à 10'],
		[REG - 2, '2', 'Une réglette', 'EVA'],
		[MOTS - 2, '3', 'Des mots', 'EVS'],
		[VIS - 2, '4', 'Des visages', "chez l'enfant, dès 4 ans"],
		[QUAT - 2, '!', 'Dès 4 sur 10', 'on soulage, puis on réévalue'],
	];
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.paper} />
			<Camera punches={[...rows.map((r) => r[0] + 3), DANS + 1]} strength={0.03}>
				<Big from={-2} text={"*L'auto-évaluation*"} size={104} y={170} center />
				{rows.map(([t, badge, title, sub], i) => (
					<RowCard key={title} at={t} y={360 + i * 144} h={128} size={46} badge={badge} badgeTone={i === 0 ? LPI.sky : i === 5 ? LPI.blue : LPI.pink} title={title} sub={sub} check={t + 12} from={i % 2 ? 'left' : 'right'} />
				))}
				<Confetti at={REEV + 8} x={540} y={800} n={70} />
				<NextUp at={DANS - 2} part={2} title="Il ne répond pas" teaser="… comment savoir qu'il a mal ?" icon={<MuteIcon size={96} />} y={1236} />
			</Camera>
			{rows.map(([t]) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={REEV + 8} volume={0.08} />
			<Sfx name="whoosh" at={DANS - 2} volume={0.07} />
		</AbsoluteFill>
	);
};
