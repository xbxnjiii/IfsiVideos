// Scènes de « Comment bien mettre un pansement ? » : chaque mouvement part d'un mot, at(scène, mot) — `npm run cues -- pansement`.
// Le grand doigt (`BigFinger`, repère 1000 × 400) est toujours à la même taille (1300 px de large) ; pansement, eau,
// compresse et doigt qui appuie sont dessinés dans son repère.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BandageG, BigFinger, DabPad, FINGER, fingerPt, Presser, TargetRing, WashFx} from '../../brand/bandage';
import {Big, ease, fadeIn, Flash, Fly, PointTag, popAt, RowCard} from '../../brand/bold';
import {DayChip} from '../../brand/injury';
import {KitItem} from '../../brand/firstaid';
import {Faucet} from '../../brand/hands';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const FW = 1300;
const K = FW / 1000;
const C = FINGER.cut;
/** Gauche du doigt : la coupure tombe au milieu de l'écran. */
const FL = 540 - C.x * K;
/** Haut du doigt pour que son axe soit à l'ordonnée `axisY` de l'écran. */
const topFor = (axisY: number) => axisY - FINGER.axis * K;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Le pansement déjà bien posé (fin de la démonstration). */
const DONE = {x: C.x, y: FINGER.axis, wrapTop: 1, wrapBottom: 1, tab1: 1, tab2: 1};

/* ═══════════════════════════════ ACCROCHE : COLLÉ VITE FAIT… RATÉ ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const COUPURE = at('intro', 'coupure');
	const ATTRAPES = at('intro', 'attrapes');
	const COLLES = at('intro', 'colles');
	const RATE = at('intro', 'raté !');
	const CARRE = at('intro', 'carré');
	const PLAIE = at('intro', 'plaie.');
	const FT = topFor(960);
	// le pansement arrive, les deux languettes sont arrachées d'un coup, il est plaqué de travers, dans la longueur
	const inP = lin(frame, ATTRAPES - 2, ATTRAPES + 10);
	const slap = interpolate(frame, [COLLES - 2, COLLES + 9], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const x = slap > 0 ? interpolate(slap, [0, 1], [C.x, 720]) : interpolate(inP, [0, 1], [1400, C.x]);
	const y = slap > 0 ? interpolate(slap, [0, 1], [-170, FINGER.axis + 6]) : -170;
	const rot = slap > 0 ? interpolate(slap, [0, 1], [-90, 82]) : -90 + 20 * (1 - inP);
	const squash = frame >= COLLES + 9 ? 1 + 0.06 * Math.exp(-(frame - COLLES - 9) / 3) * Math.cos((frame - COLLES - 9) * 1.1) : 1;
	const pad = fingerPt({x: 720, y: FINGER.axis}, FL, FT, FW);
	const cut = fingerPt(C, FL, FT, FW);
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[COLLES + 9, RATE + 1, CARRE + 1, PLAIE + 1]} shakes={[COLLES + 9, RATE + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} bleed={interpolate(frame, [0, COUPURE + 6], [0.45, 1], clamp)}>
						{frame >= ATTRAPES - 2 ? <BandageG x={x} y={y} rot={rot} scale={squash} tab1={lin(frame, COLLES - 2, COLLES + 5)} tab2={lin(frame, COLLES, COLLES + 7)} lift={1 - slap} sloppy={fadeIn(frame, COLLES + 9, 4)} /> : null}
						{/* le sang passe à travers la partie qui colle */}
						{frame >= RATE ? <ellipse cx={C.x + 6} cy={C.y + 4} rx={34} ry={26} fill={alpha(LPI.pink, 0.75 * fadeIn(frame, RATE, 10))} /> : null}
						<TargetRing x={720} y={FINGER.axis} r={150} tone={LPI.blue} on={fadeIn(frame, CARRE, 6)} />
						<TargetRing x={C.x} y={C.y} r={70} on={fadeIn(frame, PLAIE - 4, 6)} />
					</BigFinger>
				</div>
				<PointTag at={CARRE + 2} x={800} y={640} px={pad.x} py={pad.y - 120} size={46}>
					le carré blanc
				</PointTag>
				<PointTag at={PLAIE - 2} x={330} y={1290} px={cut.x} py={cut.y + 60} size={46} tone={LPI.pink}>
					la plaie
				</PointTag>
			</Camera>
			<Flash at={RATE} max={0.3} />
			<Sfx name="whoosh" at={ATTRAPES - 2} volume={0.08} />
			<Sfx name="whoosh" at={COLLES - 2} volume={0.1} />
			<Sfx name="impact" at={COLLES + 9} volume={0.12} />
			<Sfx name="buzz" at={RATE} volume={0.06} dur={12} />
			<Sfx name="pop" at={CARRE + 2} volume={0.07} />
			<Sfx name="pop" at={PLAIE - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PRÉPARER : MAINS, NETTOYER, DÉSINFECTER, SÉCHER ═══════════════════════════════ */
export const Prep: React.FC = () => {
	const frame = useCurrentFrame();
	const REPREND = at('prep', 'reprend');
	const LAVE = at('prep', 'lave-toi');
	const NETTOIE = at('prep', 'nettoie');
	const SAVON = at('prep', 'savon,');
	const SERUM = at('prep', 'sérum');
	const DESINF = at('prep', 'désinfecte');
	const ANTI = at('prep', 'antiseptique,');
	const SECHE = at('prep', 'sèche');
	const TAMP = at('prep', 'tamponnant');
	const COMPRESSE = at('prep', 'compresse.');
	const FT = topFor(470);
	const off = lin(frame, REPREND - 4, REPREND + 10);
	// la compresse tamponne 3 fois (antiseptique), puis 3 fois (sécher)
	const dabs = (t0: number) => Math.max(0, Math.sin(((frame - t0) / 9) * Math.PI)) * (frame >= t0 && frame < t0 + 54 ? 1 : 0);
	const wet = fadeIn(frame, NETTOIE + 6, 10) * (1 - lin(frame, TAMP, TAMP + 40));
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={-2} to={NETTOIE - 6} text="On *reprend*" size={104} y={96} center />
			<div style={{position: 'absolute', left: FL, top: FT}}>
				<BigFinger width={FW} bleed={1} clean={lin(frame, SAVON, SERUM + 10)} wet={wet} tint={fadeIn(frame, ANTI, 10)}>
					{off < 1 ? <BandageG x={720 + 300 * off} y={FINGER.axis + 6 - 520 * off} rot={82 + 50 * off} sloppy={1} tab1={1} tab2={1} lift={off} opacity={1 - off * off} /> : null}
					<WashFx on={fadeIn(frame, NETTOIE, 6) * (1 - fadeIn(frame, DESINF - 10, 10))} foam={fadeIn(frame, SAVON - 4, 12) * (1 - fadeIn(frame, SERUM, 12))} />
					<DabPad on={fadeIn(frame, DESINF, 4) * (1 - fadeIn(frame, DESINF + 54, 4))} dab={dabs(DESINF + 4)} tint={1} />
					<DabPad on={fadeIn(frame, SECHE, 4) * (1 - fadeIn(frame, SECHE + 58, 4))} dab={dabs(SECHE + 6)} />
				</BigFinger>
			</div>
			<RowCard at={LAVE - 3} y={720} h={170} art={170} badge={1} title="Lave-toi les mains" check={NETTOIE - 2} size={50}>
				<Faucet width={160} flow={frame > LAVE ? 1 : 0} soap={1} />
			</RowCard>
			<RowCard at={NETTOIE - 2} y={905} h={170} art={170} badge={2} title="Nettoie la plaie" sub="eau + savon, ou sérum physiologique" subAt={SAVON - 2} check={DESINF - 2} from="left" size={50}>
				<KitItem kind="serum" size={130} />
			</RowCard>
			<RowCard at={DESINF - 2} y={1090} h={170} art={170} badge={3} title="Désinfecte" sub="avec un antiseptique" subAt={ANTI - 4} check={SECHE - 2} size={50}>
				<KitItem kind="antiseptic" size={130} />
			</RowCard>
			<RowCard at={SECHE - 2} y={1275} h={170} art={170} badge={4} title="Sèche en tamponnant" sub="avec une compresse" subAt={COMPRESSE - 4} check={COMPRESSE + 14} from="left" size={50}>
				<KitItem kind="gauze" size={130} />
			</RowCard>
			<Sfx name="whoosh" at={REPREND - 4} volume={0.08} />
			<Sfx name="tap" at={NETTOIE + 2} volume={0.18} dur={70} />
			{[LAVE - 3, NETTOIE - 2, DESINF - 2, SECHE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			{[NETTOIE - 2, DESINF - 2, SECHE - 2, COMPRESSE + 14].map((t) => (
				<Sfx key={`d${t}`} name="ding" at={t} volume={0.06} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POSER : LE BON GESTE, ÉTAPE PAR ÉTAPE ═══════════════════════════════ */
export const Pose: React.FC = () => {
	const frame = useCurrentFrame();
	const PRENDS = at('pose', 'prends');
	const GRAND = at('pose', 'grand');
	const COUVRIR = at('pose', 'couvrir');
	const TOUTE = at('pose', 'toute');
	const DECOLLE = at('pose', 'décolle');
	const TOUCHER = at('pose', 'toucher');
	const COLLE = at('pose', 'colle');
	const PLACE = at('pose', 'place');
	const PLAIE = at('pose', 'plaie.', 2);
	const RETIRE = at('pose', 'retire');
	const LISSANT = at('pose', 'lissant,');
	const APPUIE = at('pose', 'appuie');
	const BORDS = at('pose', 'bords.');
	const FT = topFor(1150);
	const HOVER = {x: C.x, y: -225};
	const down = lin(frame, COLLE - 2, PLAIE);
	const x = HOVER.x;
	const y = interpolate(down, [0, 1], [HOVER.y, FINGER.axis]);
	const rot = interpolate(down, [0, 1], [-90, 0]);
	const landed = PLAIE;
	const smooth = lin(frame, RETIRE + 18, LISSANT + 12);
	// doigt qui lisse la moitié du bas (il arrive d'en bas), puis appuie sur les deux bords
	const pressTop = Math.max(0, Math.sin(((frame - APPUIE) / 10) * Math.PI)) * (frame >= APPUIE && frame < APPUIE + 10 ? 1 : 0);
	const pressBot = Math.max(0, Math.sin(((frame - BORDS - 1) / 10) * Math.PI)) * (frame >= BORDS + 1 && frame < BORDS + 11 ? 1 : 0);
	const hover = fingerPt(HOVER, FL, FT, FW);
	const titles: [number, number, string][] = [
		[PRENDS - 2, DECOLLE - 4, 'Assez *grand*'],
		[DECOLLE - 4, COLLE - 4, 'Décolle *une* languette'],
		[COLLE - 4, RETIRE - 6, 'Le carré blanc *sur* la plaie'],
		[RETIRE - 6, APPUIE - 4, "Retire *l'autre* en lissant"],
		[APPUIE - 4, 1e9, 'Appuie sur les *bords*'],
	];
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[GRAND + 1, DECOLLE + 6, landed + 1, RETIRE + 8, APPUIE + 4, BORDS + 4]} strength={0.03}>
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} clean={1} tint={1}>
						{/* la compresse couvre toute la plaie : son contour, posé sur la coupure */}
						{frame >= COUVRIR && frame < DECOLLE ? (
							<g opacity={fadeIn(frame, COUVRIR, 6) * (1 - fadeIn(frame, DECOLLE - 6, 6))}>
								<rect x={C.x - 70} y={FINGER.axis - 104} width={140} height={208} rx={14} fill={alpha(LPI.paper, 0.35)} stroke={LPI.blue} strokeWidth={8} strokeDasharray="20 14" strokeDashoffset={-frame * 2} />
								{frame >= TOUTE + 4 ? (
									<g transform={`translate(${C.x + 92} ${FINGER.axis - 118}) scale(${popAt(frame, TOUTE + 4)})`}>
										<circle r={36} fill={LPI.pink} stroke={LPI.navy} strokeWidth={5} />
										<path d="M-15 1 L-4 13 L17 -11" fill="none" stroke={LPI.navy} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
									</g>
								) : null}
							</g>
						) : null}
						<TargetRing x={C.x} y={C.y} r={66} on={fadeIn(frame, PLACE, 6) * (1 - fadeIn(frame, landed + 6, 6))} />
						{frame >= PRENDS - 2 ? (
							<BandageG
								x={x}
								y={y}
								rot={rot}
								scale={popAt(frame, PRENDS - 2)}
								tab1={lin(frame, DECOLLE, DECOLLE + 16)}
								tab2={lin(frame, RETIRE, RETIRE + 16)}
								wrapTop={lin(frame, landed, landed + 10)}
								wrapBottom={smooth}
								lift={1 - down}
								glow={fadeIn(frame, TOUCHER - 4, 6) * (1 - fadeIn(frame, COLLE - 6, 6))}
							/>
						) : null}
						{/* le doigt qui lisse la moitié du bas (venu d'en bas)… */}
						{frame >= RETIRE + 14 && frame < APPUIE ? (
							<g opacity={fadeIn(frame, RETIRE + 14, 4) * (1 - fadeIn(frame, APPUIE - 6, 5))}>
								<Presser x={C.x - 10} y={interpolate(smooth, [0, 1], [FINGER.axis + 110, FINGER.axis + 150])} press={0.4} rot={172} />
							</g>
						) : null}
						{/* … puis appuie sur le bord du haut, et sur celui du bas */}
						{frame >= APPUIE - 4 && frame < BORDS ? (
							<g opacity={fadeIn(frame, APPUIE - 4, 4) * (1 - fadeIn(frame, BORDS - 5, 4))}>
								<Presser x={C.x + 6} y={FINGER.axis - 150} press={pressTop} />
							</g>
						) : null}
						{frame >= BORDS - 3 && frame < BORDS + 16 ? (
							<g opacity={fadeIn(frame, BORDS - 3, 4) * (1 - fadeIn(frame, BORDS + 11, 4))}>
								<Presser x={C.x - 10} y={FINGER.axis + 150} press={pressBot} rot={172} />
							</g>
						) : null}
					</BigFinger>
				</div>
				{titles.map(([a, b, t], i) => (
					<Big key={t} from={i === 0 ? a : a + 8} to={b} text={t} size={92} y={150} center />
				))}
				<PointTag at={TOUCHER - 2} to={COLLE - 6} x={540} y={850} px={hover.x} py={hover.y + 90} size={42}>
					on n'y touche pas
				</PointTag>
				<Burst at={BORDS + 10} x={540} y={1150} r={300} n={14} />
			</Camera>
			<Sfx name="pop" at={PRENDS - 2} volume={0.08} />
			<Sfx name="ding" at={TOUTE + 4} volume={0.07} />
			<Sfx name="whoosh" at={DECOLLE} volume={0.08} />
			<Sfx name="whoosh" at={COLLE - 2} volume={0.06} />
			<Sfx name="tap" at={landed} volume={0.1} dur={8} />
			<Sfx name="whoosh" at={RETIRE} volume={0.08} />
			<Sfx name="tick" at={APPUIE + 4} volume={0.1} />
			<Sfx name="tick" at={BORDS + 4} volume={0.1} />
			<Sfx name="ding" at={BORDS + 10} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE GARDER : CHAQUE JOUR, OU S'IL EST MOUILLÉ OU SALE ═══════════════════════════════ */
export const Garder: React.FC = () => {
	const frame = useCurrentFrame();
	const JOUR = at('garder', 'jour,');
	const MOUILLE = at('garder', 'mouillé');
	const SALE = at('garder', 'sale.');
	const FT = topFor(1060);
	const swap = lin(frame, SALE + 14, SALE + 24);
	const strip = fingerPt({x: C.x, y: FINGER.axis}, FL, FT, FW);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={-2} text="Change-le chaque *jour*" size={92} y={150} center />
			<Fly at={JOUR - 2} x={540} y={600}>
				<DayChip text="J+1" size={190} />
			</Fly>
			<div style={{position: 'absolute', left: FL, top: FT}}>
				<BigFinger width={FW} clean={1}>
					<WashFx on={fadeIn(frame, MOUILLE - 6, 4) * (1 - fadeIn(frame, SALE, 6))} />
					{swap < 1 ? <BandageG {...DONE} x={DONE.x + 420 * swap} y={DONE.y - 380 * swap} rot={30 * swap} wet={fadeIn(frame, MOUILLE, 10)} dirt={fadeIn(frame, SALE, 10)} opacity={1 - swap} /> : null}
					{frame >= SALE + 22 ? <BandageG {...DONE} scale={popAt(frame, SALE + 22)} /> : null}
				</BigFinger>
			</div>
			<PointTag at={MOUILLE - 2} x={250} y={1400} px={strip.x - 60} py={strip.y + 90} size={44}>
				mouillé
			</PointTag>
			<PointTag at={SALE - 2} x={820} y={1400} px={strip.x + 60} py={strip.y + 90} size={44} tone={LPI.pink}>
				sale
			</PointTag>
			<Sfx name="pop" at={JOUR - 2} volume={0.08} />
			<Sfx name="tap" at={MOUILLE - 4} volume={0.12} dur={14} />
			<Sfx name="whoosh" at={SALE + 14} volume={0.08} />
			<Sfx name="pop" at={SALE + 22} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : POSÉ… PAS JUSTE COLLÉ ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const VOILA = at('fin', 'voilà');
	const POSE = at('fin', 'posé…');
	const PAS = at('fin', 'pas');
	const FT = topFor(1060);
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[VOILA + 1, POSE + 1, PAS + 1]} shakes={[PAS + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} clean={1}>
						<BandageG {...DONE} glow={fadeIn(frame, VOILA, 6) * 0} />
					</BigFinger>
				</div>
				<Big from={POSE - 2} to={PAS - 8} text="*Posé*…" size={130} y={240} center />
				<Big from={PAS + 1} text={'Pas juste *collé* !'} size={120} y={240} center />
				<Burst at={VOILA + 2} x={540} y={1060} r={300} n={16} />
			</Camera>
			<Sfx name="ding" at={VOILA + 2} volume={0.1} />
			<Sfx name="stamp" at={PAS - 2} volume={0.1} />
		</AbsoluteFill>
	);
};
