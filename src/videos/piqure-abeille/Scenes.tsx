// Scènes de « Piqûre d'abeille » (format court). Accroche sans texte : un pique-nique, une abeille se pose sur la main,
// pique ; la caméra plonge : le dard est resté planté, sa poche de venin pulse. Puis l'idée reçue (le pincer : on presse
// le venin), le bon geste (gratter avec une carte), les soins (eau + savon, froid dans un linge), ce qui est normal, quand
// appeler le 15, chute (la guêpe ne laisse pas son dard). Tout part d'un mot de la voix (`at`).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BeeG, BreathAlertIcon, CardG, HAND, HandTopG, IceCloth, MouthStingIcon, PicnicBg, PinchTipsG, StingerG, SwellFaceIcon, VenomSpread, WhealG} from '../../brand/bee';
import {Big, fadeIn, Flash, Note, PointTag, popAt, RowCard} from '../../brand/bold';
import {Phone} from '../../brand/devices';
import {Faucet} from '../../brand/hands';
import {DayChip} from '../../brand/injury';
import {Burst} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {SkinG, SkinMedallion} from '../../brand/tick';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

/** Peau en très gros plan centrée en (cx, cy), repère 1000 × 1000 affiché sur W pixels. */
const Skin: React.FC<{cx: number; cy: number; W?: number; children?: React.ReactNode; red?: number}> = ({cx, cy, W = 1600, children, red = 0}) => (
	<svg width={W} height={W} viewBox="0 0 1000 1000" style={{position: 'absolute', left: cx - W / 2, top: cy - W / 2, overflow: 'visible'}}>
		<SkinG red={red}>{children}</SkinG>
	</svg>
);
/** Point du repère de la peau → écran, pour une `Skin` en (cx, cy) de largeur W. */
const sp = (x: number, y: number, cx = 540, cy = 1000, W = 1600) => ({x: cx - W / 2 + (x * W) / 1000, y: cy - W / 2 + (y * W) / 1000});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Grande croix rose qui barre (centrée sur son parent). */
const Cross: React.FC<{at: number; size?: number}> = ({at: t0, size = 150}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	const k = lin(frame, t0, t0 + 6);
	return (
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, overflow: 'visible'}}>
			{[
				[18, 18, 82, 82],
				[82, 18, 18, 82],
			].map(([a, b, c, d], i) => (
				<line key={i} x1={a} y1={b} x2={a + (c - a) * k} y2={b + (d - b) * k} stroke={LPI.pink} strokeWidth={13} strokeLinecap="round" />
			))}
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE : LE PIQUE-NIQUE, L'ABEILLE, LA PIQÛRE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ABEILLE = at('intro', 'abeille');
	const POSE = at('intro', 'pose');
	const AIE = at('intro', 'aïe !');
	const PIQUER = at('intro', 'piquer…');
	const DARD = at('intro', 'dard');
	const PLANTE = at('intro', 'planté.');
	const HX = 40;
	const HY = 760;
	const S = {x: HX + HAND.sting.x, y: HY + HAND.sting.y};
	// l'abeille arrive en zigzag (du haut à droite) et se pose sur le dos de la main ; au « aïe » elle repart
	const arrive = interpolate(frame, [ABEILLE - 30, POSE + 4], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const leave = interpolate(frame, [AIE + 4, AIE + 26], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const bx = interpolate(arrive, [0, 1], [1180, S.x - 10]) + Math.sin(frame / 4) * 40 * (1 - arrive) + leave * 700;
	const by = interpolate(arrive, [0, 1], [380, S.y - 30]) + Math.cos(frame / 5) * 50 * (1 - arrive) - leave * 900;
	const landed = frame >= POSE + 4 && frame < AIE + 4;
	const bang = -100 + 30 * Math.sin(frame / 9) * (1 - arrive) - leave * 60;
	// la main sursaute au « aïe »
	const jerk = frame >= AIE && frame < AIE + 14 ? Math.sin((frame - AIE) * 1.8) * 16 * (1 - (frame - AIE) / 14) : 0;
	// la caméra plonge sur la piqûre, puis la peau en très gros plan
	const dive = lin(frame, PIQUER - 6, PIQUER + 18);
	const zoom = 1 + 6 * dive * dive;
	const skinIn = lin(frame, PIQUER + 8, PIQUER + 20);
	return (
		<AbsoluteFill>
			{skinIn < 1 ? (
				<AbsoluteFill style={{transform: `translate(${(540 - S.x) * dive}px, ${(1000 - S.y) * dive}px) scale(${zoom})`, transformOrigin: `${S.x}px ${S.y}px`}}>
					<PicnicBg />
					<svg width={1000} height={1000} viewBox="0 0 1000 1000" style={{position: 'absolute', left: HX + jerk, top: HY - jerk * 0.5, overflow: 'visible'}}>
						<HandTopG>
							{frame >= AIE ? <circle cx={HAND.sting.x} cy={HAND.sting.y} r={8} fill={alpha(LPI.pink, 0.95)} /> : null}
						</HandTopG>
					</svg>
					{frame >= ABEILLE - 30 && leave < 1 ? (
						<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<BeeG x={bx + (landed ? Math.sin(frame / 3) * 2 : 0)} y={by} s={1.5} ang={landed ? -70 + Math.sin(frame / 7) * 6 : bang} fly={landed ? 0.15 : 1} />
						</svg>
					) : null}
				</AbsoluteFill>
			) : null}
			{skinIn > 0 ? (
				<AbsoluteFill style={{opacity: skinIn}}>
					<Skin cx={540} cy={1000} red={0.5 + 0.3 * lin(frame, DARD, PLANTE)}>
						<StingerG x={500} y={500} s={3.2} />
						{frame >= DARD - 2 ? <circle cx={560} cy={420} r={150 + 8 * Math.sin(frame / 5)} fill="none" stroke={LPI.pink} strokeWidth={8} strokeDasharray="20 14" opacity={fadeIn(frame, DARD - 2, 6)} /> : null}
					</Skin>
				</AbsoluteFill>
			) : null}
			<Flash at={AIE} max={0.35} />
			<Sfx name="buzz" at={ABEILLE - 30} volume={0.06} dur={POSE - ABEILLE + 34} />
			<Sfx name="stamp" at={AIE} volume={0.08} />
			<Sfx name="buzz" at={AIE + 4} volume={0.05} dur={20} />
			<Sfx name="whoosh" at={PIQUER - 6} volume={0.06} />
			<Sfx name="pop" at={DARD} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ IDÉE REÇUE : LE PINCER AVEC LES DOIGTS ═══════════════════════════════ */
export const Idees: React.FC = () => {
	const frame = useCurrentFrame();
	const DOIGTS = at('idees', 'doigts ?');
	const SURTOUT = at('idees', 'surtout');
	const PRESSES = at('idees', 'presses');
	const POCHE = at('idees', 'poche');
	const INJECTES = at('idees', 'injectes');
	const PLUS = at('idees', 'plus.');
	// les doigts descendent sur la poche, se serrent, le venin se répand
	const down = lin(frame, DOIGTS - 30, DOIGTS + 4);
	const squeeze = lin(frame, PRESSES, PRESSES + 10);
	const spread = lin(frame, INJECTES - 4, PLUS + 20);
	const SAC = {x: 500 + 34 * 3.2, y: 500 - 50 * 3.2};
	const sac = sp(SAC.x, SAC.y);
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1000} red={0.6 + 0.4 * spread}>
				<VenomSpread x={500} y={500} spread={spread} r={260} />
				<StingerG x={500} y={500} s={3.2} squeeze={squeeze} />
				<g transform={`translate(0 ${-(1 - down) * 700})`}>
					<PinchTipsG x={SAC.x} y={SAC.y + 30} gap={interpolate(squeeze, [0, 1], [110, 6])} s={1.6} />
				</g>
			</Skin>
			<Big from={SURTOUT - 2} text={'Surtout *pas* !'} size={116} y={150} center />
			<PointTag at={POCHE - 2} to={INJECTES - 6} x={300} y={1560} px={sac.x} py={sac.y} size={46} tone={LPI.pink}>
				la poche de venin
			</PointTag>
			<PointTag at={INJECTES - 2} x={540} y={1600} px={sp(500, 500).x + 150} py={sp(500, 500).y + 110} size={46} tone={LPI.pink}>
				encore plus de venin
			</PointTag>
			<Flash at={SURTOUT + 4} max={0.25} />
			<Sfx name="whoosh" at={DOIGTS - 30} volume={0.05} />
			<Sfx name="stamp" at={SURTOUT + 4} volume={0.1} />
			<Sfx name="pop" at={PRESSES + 6} volume={0.08} />
			<Sfx name="buzz" at={INJECTES} volume={0.05} dur={16} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON GESTE : GRATTER AVEC UNE CARTE ═══════════════════════════════ */
export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const GRATTE = at('methode', 'gratte');
	const BORD = at('methode', 'bord');
	const BANCAIRE = at('methode', 'bancaire.');
	const SORT = at('methode', 'sort');
	const SANS = at('methode', 'sans');
	const PRESSE = at('methode', 'pressé.');
	// la carte entre par la droite, puis glisse vers la gauche, à plat, et pousse le dard dehors
	const enter = lin(frame, GRATTE - 6, GRATTE + 12);
	// le bord est à x ; la carte gratte de droite (900) à gauche (380), le dard sort en même temps (de l'autre côté)
	const scrape = lin(frame, BANCAIRE + 10, SORT + 12);
	const scrapeEdge = interpolate(enter, [0, 1], [1300, 740]) - 480 * scrape;
	// une fois le dard dehors, la carte repart à droite : on voit la peau dégagée
	const edge = scrapeEdge + 1100 * lin(frame, SORT + 18, SORT + 34);
	// le bord de la carte pousse le dard (qui sortait de la peau en 520) vers la gauche
	const push = Math.min(0, scrapeEdge - 540);
	const out = Math.min(1, -push / 240);
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1000} red={0.6}>
				{/* le dard reste planté jusqu'au passage de la carte, puis il est poussé dehors (StingerOverlay) */}
				{out <= 0 ? <StingerG x={500} y={500} s={3.2} /> : <circle cx={500} cy={500} r={22} fill={alpha(LPI.pink, 0.9)} />}
				<CardG x={edge} y={480} w={620} />
			</Skin>
			<StingerOverlay push={push} />
			<Big from={GRATTE - 4} to={SORT - 4} text={'Gratte avec une *carte*'} size={98} y={150} center />
			<Big from={SORT + 2} text={'Il *sort* tout seul'} size={98} y={150} center />
			<PointTag at={BORD - 2} to={BANCAIRE + 6} x={300} y={1560} px={sp(740, 420).x} py={sp(740, 420).y} size={46} tone={LPI.sky}>
				le bord de la carte
			</PointTag>
			{frame >= SANS - 4 ? (
				<Note at={SANS - 4} y={1560} size={46} tone={LPI.sky}>
					sans presser la poche ✓
				</Note>
			) : null}
			<Sfx name="whoosh" at={GRATTE - 6} volume={0.06} />
			<Sfx name="skid" at={BANCAIRE + 10} volume={0.12} />
			<Sfx name="pop" at={SORT + 6} volume={0.08} />
			<Sfx name="ding" at={PRESSE} volume={0.08} />
			<Burst at={SORT + 8} x={sp(500, 500).x} y={sp(500, 500).y} r={200} n={10} />
		</AbsoluteFill>
	);
};

/** Le dard poussé par la carte (vers la gauche, à plat sur la peau) : il bascule, glisse et sort (dessiné au-dessus de la carte). */
const StingerOverlay: React.FC<{push: number}> = ({push}) => {
	if (push >= 0) return null;
	const k = Math.min(1, -push / 240);
	return (
		<svg width={1600} height={1600} viewBox="0 0 1000 1000" style={{position: 'absolute', left: 540 - 800, top: 1000 - 800, overflow: 'visible'}}>
			<g transform={`translate(${push} ${k * 30}) rotate(${-k * 70} 500 500)`} opacity={1 - Math.max(0, (k - 0.75) / 0.25)}>
				<StingerG x={500} y={500} s={3.2} />
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ SOINS : EAU + SAVON, PUIS DU FROID ═══════════════════════════════ */
export const Soins: React.FC = () => {
	const frame = useCurrentFrame();
	const LAVE = at('soins', 'lave');
	const SAVON = at('soins', 'savon.');
	const FROID = at('soins', 'froid :');
	const LINGE = at('soins', 'linge,');
	const DIZAINE = at('soins', 'dizaine');
	const MINUTES = at('soins', 'minutes.');
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: 540 - 210, top: 190}}>
				<SkinMedallion size={420}>
					<SkinG red={0.6 * (1 - 0.5 * fadeIn(frame, FROID + 6, 30))} tint={fadeIn(frame, LAVE + 4, 10) * (1 - fadeIn(frame, FROID, 10))}>
						<circle cx={500} cy={500} r={12} fill={alpha(LPI.pink, 0.95)} stroke={alpha(N, 0.4)} strokeWidth={2} />
					</SkinG>
				</SkinMedallion>
			</div>
			<RowCard at={LAVE - 4} y={720} h={210} art={190} badge={1} title="Eau + savon" check={SAVON + 10} size={52}>
				<Faucet width={170} flow={1} soap={fadeIn(frame, SAVON - 4, 6)} />
			</RowCard>
			<RowCard at={FROID - 4} y={950} h={210} art={190} badge={2} title="Du froid" sub="un glaçon dans un linge" subAt={LINGE - 6} check={MINUTES + 10} from="left" size={52}>
				<IceCloth width={170} />
			</RowCard>
			{frame >= DIZAINE - 4 ? (
				<div style={{position: 'absolute', left: 540 - 90, top: 1220, transform: `scale(${popAt(frame, DIZAINE - 4)})`}}>
					<DayChip text="10'" size={180} />
				</div>
			) : null}
			{[LAVE - 4, FROID - 4, DIZAINE - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="tap" at={LAVE} volume={0.12} />
			<Sfx name="ding" at={MINUTES + 10} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CE QUI EST NORMAL ═══════════════════════════════ */
export const Normal: React.FC = () => {
	const frame = useCurrentFrame();
	const ROUGEUR = at('normal', 'rougeur,');
	const GONFLEMENT = at('normal', 'gonflement,');
	const DOULEUR = at('normal', 'douleur');
	const NORMAL = at('normal', 'normal.');
	const PASSE = at('normal', 'passe');
	const JOURS = at('normal', 'jours.');
	const swell = lin(frame, GONFLEMENT - 4, GONFLEMENT + 16) * (1 - 0.7 * lin(frame, PASSE, JOURS + 20));
	const red = lin(frame, ROUGEUR - 4, ROUGEUR + 10) * (1 - 0.7 * lin(frame, PASSE, JOURS + 20));
	const c = sp(500, 500);
	return (
		<AbsoluteFill>
			<Skin cx={540} cy={1000} red={red}>
				<WhealG x={500} y={500} k={swell} r={300} />
				<circle cx={500} cy={500} r={9} fill={alpha(LPI.pink, 0.95)} />
				{frame >= DOULEUR - 2 && frame < NORMAL + 10
					? [0, 1, 2, 3, 4, 5].map((i) => {
							const a = (i / 6) * Math.PI * 2;
							const k = ((frame - DOULEUR) / 10 + i / 6) % 1;
							return <path key={i} d={`M${500 + Math.cos(a) * (110 + k * 60)} ${500 + Math.sin(a) * (110 + k * 60)} l${Math.cos(a) * 34} ${Math.sin(a) * 34}`} stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" opacity={1 - k} />;
						})
					: null}
			</Skin>
			<PointTag at={ROUGEUR - 2} x={250} y={420} px={c.x - 120} py={c.y - 90} size={46} tone={LPI.paper}>
				rougeur
			</PointTag>
			<PointTag at={GONFLEMENT - 2} x={820} y={560} px={c.x + 150} py={c.y - 60} size={46} tone={LPI.paper}>
				gonflement
			</PointTag>
			<PointTag at={DOULEUR - 2} x={280} y={1600} px={c.x - 90} py={c.y + 130} size={46} tone={LPI.paper}>
				douleur
			</PointTag>
			<Big from={NORMAL - 4} text={"C'est *normal*"} size={108} y={160} center />
			{frame >= PASSE - 4 ? (
				<div style={{position: 'absolute', left: 820 - 90, top: 1480, transform: `scale(${popAt(frame, PASSE - 4)})`}}>
					<DayChip text="J+3" size={180} />
				</div>
			) : null}
			{[ROUGEUR - 2, GONFLEMENT - 2, DOULEUR - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="ding" at={NORMAL} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ URGENCE : LE 15 ═══════════════════════════════ */
export const Urgence: React.FC = () => {
	const frame = useCurrentFrame();
	const VISAGE = at('urgence', 'visage');
	const MAL = at('urgence', 'mal');
	const PIQUE = at('urgence', 'piqué');
	const APPELLE = at('urgence', 'appelle');
	const QUINZE = at('urgence', 'quinze,');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={APPELLE - 4} text={'Mais *si*…'} size={110} y={190} center />
			<Big from={APPELLE + 2} text={'Appelle le *15* !'} size={104} y={190} center />
			<RowCard at={VISAGE - 4} y={420} h={190} art={170} badge="!" title="Le visage ou la gorge gonfle" size={46}>
				<SwellFaceIcon size={130} />
			</RowCard>
			<RowCard at={MAL - 4} y={630} h={190} art={170} badge="!" title="Du mal à respirer" from="left" size={46}>
				<BreathAlertIcon size={130} />
			</RowCard>
			<RowCard at={PIQUE - 4} y={840} h={190} art={170} badge="!" title="Piqûre dans la bouche" size={46}>
				<MouthStingIcon size={130} />
			</RowCard>
			{frame >= APPELLE - 4 ? (
				<div style={{position: 'absolute', left: 540 - 130, top: 1100, transform: `scale(${popAt(frame, APPELLE - 4)})`}}>
					<Phone digits="15" press={lin(frame, APPELLE, QUINZE)} ring={fadeIn(frame, QUINZE, 4)} size={260} />
				</div>
			) : null}
			{[VISAGE - 4, MAL - 4, PIQUE - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="dtmf-1" at={APPELLE + 2} volume={0.15} />
			<Sfx name="dtmf-5" at={APPELLE + 8} volume={0.15} />
			<Sfx name="ring" at={QUINZE + 4} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ET LA GUÊPE ? ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const GUEPE = at('fin', 'guêpe ?');
	const LAISSE = at('fin', 'laisse');
	const DARD = at('fin', 'dard…');
	const BESOIN = at('fin', 'besoin');
	const GRATTER = at('fin', 'gratter !');
	const fly = interpolate(frame, [GUEPE - 14, GUEPE + 14], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const wx = interpolate(fly, [0, 1], [1200, 760]) + Math.sin(frame / 5) * 20;
	const wy = interpolate(fly, [0, 1], [300, 560]) + Math.cos(frame / 6) * 18;
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={GUEPE - 6} to={LAISSE - 4} text={'Et la *guêpe* ?'} size={108} y={180} center />
			<Big from={LAISSE + 2} to={BESOIN - 4} text={'Pas de *dard*'} size={108} y={180} center />
			<Big from={BESOIN + 2} text={'Pas besoin de *gratter* !'} size={92} y={180} center />
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<BeeG x={wx} y={wy} s={2.2} ang={160 + Math.sin(frame / 8) * 10} wasp />
			</svg>
			{frame >= DARD - 6 ? (
				<div style={{position: 'absolute', left: 540 - 230, top: 820, transform: `scale(${popAt(frame, DARD - 6)})`}}>
					<SkinMedallion size={460}>
						<SkinG red={0.5}>
							<circle cx={500} cy={500} r={10} fill={alpha(LPI.pink, 0.95)} />
						</SkinG>
					</SkinMedallion>
				</div>
			) : null}
			{frame >= BESOIN - 4 ? (
				<div style={{position: 'absolute', left: 540 - 170, top: 1360, width: 340, height: 220, transform: `scale(${popAt(frame, BESOIN - 4)})`}}>
					<svg width={340} height={220} viewBox="0 0 340 220" style={{overflow: 'visible'}}>
						<CardG x={10} y={110} w={320} />
					</svg>
					<Cross at={GRATTER - 2} size={230} />
				</div>
			) : null}
			<Burst at={GRATTER + 2} x={540} y={1050} r={240} n={12} />
			<Sfx name="buzz" at={GUEPE - 14} volume={0.05} dur={30} />
			<Sfx name="pop" at={DARD - 6} volume={0.07} />
			<Sfx name="stamp" at={GRATTER - 2} volume={0.08} />
			<Sfx name="ding" at={GRATTER + 6} volume={0.08} />
		</AbsoluteFill>
	);
};
