// Scènes de « Comment retirer une écharde ? » : chaque mouvement part d'un mot, at(scène, mot) — `npm run cues -- echarde`.
// Même grand doigt que le pansement et la brûlure (`BigFinger`) ; l'écharde est dessinée dans son repère (`splinter.tsx`).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BandageG, BigFinger, DabPad, FINGER, fingerPt, Presser, WashFx} from '../../brand/bandage';
import {Big, fadeIn, Flash, PointTag, popAt, RowCard} from '../../brand/bold';
import {KitItem} from '../../brand/firstaid';
import {Faucet} from '../../brand/hands';
import {EyeIcon} from '../../brand/icons';
import {VaxBook} from '../../brand/injury';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {DeepSplinterIcon, PlankG, PullArrowG, SPLINTER, splinterAt, SplinterG, TweezersG} from '../../brand/splinter';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const FW = 1300;
const K = FW / 1000;
/** Gauche du doigt : l'écharde tombe au milieu de l'écran. */
const FL = 540 - SPLINTER.x * K;
const topFor = (axisY: number) => axisY - FINGER.axis * K;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Zoom doux vers un point de l'écran (gros plan) : `z` ≥ 1. */
const Zoom: React.FC<{z: number; x: number; y: number; children: React.ReactNode}> = ({z, x, y, children}) => (
	<AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${x}px ${y}px`}}>{children}</AbsoluteFill>
);

/* ═══════════════════════════════ ACCROCHE : LA VIEILLE PLANCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const AIE = at('intro', 'aïe !');
	const ECHARDE = at('intro', 'écharde,');
	const FT = topFor(820);
	// la main glisse sur la planche, puis s'arrête net : l'écharde est plantée
	const slide = frame < AIE ? interpolate(frame, [0, AIE], [-420, 0], {...clamp, easing: Easing.in(Easing.quad)}) : 0;
	const jolt = frame >= AIE ? 10 * Math.exp(-(frame - AIE) / 3) * Math.cos((frame - AIE) * 1.2) : 0;
	const spl = fingerPt(SPLINTER, FL, FT, FW);
	const z = 1 + 0.55 * lin(frame, ECHARDE - 6, ECHARDE + 20);
	// au « aïe », le doigt se retourne (rotation sur son axe) : on découvre l'écharde, plantée côté pulpe
	const turn = lin(frame, AIE + 2, AIE + 14);
	const palm = turn >= 0.5;
	const flipS = Math.max(0.04, Math.abs(Math.cos(turn * Math.PI)));
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[AIE + 1, ECHARDE + 1]} shakes={[AIE + 1]} strength={0.04}>
				<Zoom z={z} x={spl.x} y={spl.y}>
					<svg width={FW} height={(FW * 400) / 1000} viewBox="0 0 1000 400" style={{position: 'absolute', left: FL, top: FT, overflow: 'visible'}}>
						<g transform={`translate(${-slide * 0.6} 0)`}>
							<PlankG />
						</g>
					</svg>
					<div style={{position: 'absolute', left: FL + (slide + jolt) * K, top: FT, transform: `scaleY(${flipS})`, transformOrigin: `0px ${FINGER.axis * K}px`}}>
						<BigFinger width={FW} cut={0} palm={palm}>
							<SplinterG on={palm ? 1 : 0} red={fadeIn(frame, AIE + 10, 16)} />
						</BigFinger>
					</div>
				</Zoom>
			</Camera>
			<Flash at={AIE} max={0.3} />
			<Sfx name="skid" at={4} volume={0.12} dur={AIE - 6} />
			<Sfx name="impact" at={AIE} volume={0.12} />
			<Sfx name="buzz" at={AIE + 1} volume={0.05} dur={10} />
			<Sfx name="whoosh" at={ECHARDE - 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES ONGLES : MAUVAISE IDÉE ═══════════════════════════════ */
export const Ongles: React.FC = () => {
	const frame = useCurrentFrame();
	const APPUYER = at('ongles', 'appuyer');
	const MAUVAISE = at('ongles', 'mauvaise');
	const POUSSES = at('ongles', 'pousses');
	const CASSER = at('ongles', 'casser');
	const PEAU = at('ongles', 'peau.');
	const FT = topFor(1000);
	const sq = Math.max(0, Math.sin(((frame - APPUYER) / 12) * Math.PI)) * (frame >= APPUYER && frame < POUSSES + 24 ? 1 : 0);
	const spl = fingerPt(SPLINTER, FL, FT, FW);
	const inside = fingerPt(splinterAt(SPLINTER.inLen * 0.6), FL, FT, FW);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Camera punches={[APPUYER + 4, MAUVAISE + 1, POUSSES + 4, CASSER + 1]} shakes={[MAUVAISE + 1, CASSER + 1]} strength={0.04}>
				<Big from={MAUVAISE - 2} text="Mauvaise *idée* !" size={110} y={170} center />
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} cut={0} palm>
						<SplinterG red={1} push={lin(frame, POUSSES, POUSSES + 14)} broken={lin(frame, CASSER, CASSER + 10)} />
						{/* deux pouces qui pressent de chaque côté */}
						{frame >= APPUYER - 6 && frame < PEAU + 10 ? (
							<g opacity={fadeIn(frame, APPUYER - 6, 5) * (1 - fadeIn(frame, PEAU, 6))}>
								<Presser x={SPLINTER.x - 150 + 40 * sq} y={FINGER.axis + 20} press={sq} rot={-96} />
								<Presser x={SPLINTER.x + 90 - 40 * sq} y={FINGER.axis + 30} press={sq} rot={96} />
							</g>
						) : null}
					</BigFinger>
				</div>
				<PointTag at={PEAU - 2} x={330} y={1420} px={inside.x} py={inside.y + 10} size={44} tone={LPI.pink}>
					un bout reste dedans
				</PointTag>
				<PointTag at={POUSSES} to={PEAU - 6} x={760} y={1420} px={spl.x} py={spl.y + 20} size={44}>
					elle s'enfonce
				</PointTag>
			</Camera>
			<Flash at={MAUVAISE} max={0.3} />
			<Sfx name="stamp" at={MAUVAISE} volume={0.1} />
			<Sfx name="tap" at={CASSER + 2} volume={0.15} dur={6} />
			<Sfx name="pop" at={PEAU - 2} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA BONNE MÉTHODE ═══════════════════════════════ */
export const Methode: React.FC = () => {
	const frame = useCurrentFrame();
	const LAVE = at('methode', 'lave');
	const SAVON = at('methode', 'savon.');
	const DESINF = at('methode', 'désinfecte');
	const ATTRAPE = at('methode', 'attrape');
	const RAS = at('methode', 'ras');
	const TIRE = at('methode', 'tire');
	const SENS = at('methode', 'sens');
	const ENTREE = at('methode', 'entrée.');
	const FT = topFor(470);
	const grip = lin(frame, RAS - 4, RAS + 8);
	const pull = lin(frame, TIRE + 4, ENTREE + 6);
	const tw = splinterAt(-14 - 280 * pull);
	const twIn = lin(frame, ATTRAPE - 4, RAS);
	const twFrom = {x: 1180, y: -220};
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: FL, top: FT}}>
				<BigFinger width={FW} cut={0} palm wet={fadeIn(frame, LAVE + 6, 8) * (1 - fadeIn(frame, DESINF, 20))}>
					<SplinterG red={0.6} pull={pull} />
					<WashFx on={fadeIn(frame, LAVE, 6) * (1 - fadeIn(frame, SAVON + 14, 8))} foam={fadeIn(frame, SAVON - 10, 10)} />
					<PullArrowG on={fadeIn(frame, SENS - 4, 6) * (1 - fadeIn(frame, ENTREE + 16, 6))} />
					{frame >= ATTRAPE - 4 ? <TweezersG x={interpolate(twIn, [0, 1], [twFrom.x, tw.x])} y={interpolate(twIn, [0, 1], [twFrom.y, tw.y])} ang={-38} close={grip} tint={1} /> : null}
				</BigFinger>
			</div>
			<RowCard at={LAVE - 3} y={720} h={170} art={170} badge={1} title="Lave mains et peau" sub="eau + savon" subAt={SAVON - 6} check={DESINF - 2} size={50}>
				<Faucet width={160} flow={1} soap={1} />
			</RowCard>
			<RowCard at={DESINF - 2} y={905} h={170} art={170} badge={2} title="Désinfecte la pince" check={ATTRAPE - 2} from="left" size={50}>
				<KitItem kind="tweezers" size={140} />
			</RowCard>
			<RowCard at={ATTRAPE - 2} y={1090} h={170} art={170} badge={3} title="Au ras de la peau" sub="on attrape l'écharde" subAt={RAS} check={TIRE - 2} size={50}>
				<KitItem kind="tweezers" size={140} />
			</RowCard>
			<RowCard at={TIRE - 2} y={1275} h={170} art={170} badge={4} title="Tire doucement" sub="dans le sens où elle est entrée" subAt={SENS - 4} check={ENTREE + 10} from="left" size={50}>
				<svg width={150} height={100} viewBox="0 0 150 100">
					<path d="M20 50 H110" stroke={LPI.blue} strokeWidth={12} strokeLinecap="round" strokeDasharray="20 12" />
					<path d="M104 26 L140 50 L104 74 Z" fill={LPI.blue} />
				</svg>
			</RowCard>
			<Sfx name="tap" at={LAVE} volume={0.15} dur={50} />
			{[LAVE - 3, DESINF - 2, ATTRAPE - 2, TIRE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="tick" at={RAS + 6} volume={0.1} />
			<Sfx name="whoosh" at={ENTREE} volume={0.08} />
			<Sfx name="ding" at={ENTREE + 10} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ APRÈS : LAVER, DÉSINFECTER, PANSEMENT ═══════════════════════════════ */
export const Apres: React.FC = () => {
	const frame = useCurrentFrame();
	const SORTIE = at('apres', 'sortie,');
	const LAVE = at('apres', 'lave,');
	const DESINF = at('apres', 'désinfecte,');
	const PANS = at('apres', 'pansement');
	const FT = topFor(980);
	const dabs = Math.max(0, Math.sin(((frame - DESINF) / 9) * Math.PI)) * (frame >= DESINF && frame < DESINF + 27 ? 1 : 0);
	const entry = splinterAt(0);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={SORTIE - 4} text="Une fois *sortie*" size={104} y={200} center />
			<div style={{position: 'absolute', left: FL, top: FT}}>
				<BigFinger width={FW} cut={0} palm wet={fadeIn(frame, LAVE, 6) * (1 - fadeIn(frame, DESINF, 10))} tint={fadeIn(frame, DESINF + 6, 10)}>
					{frame < PANS ? <ellipse cx={entry.x} cy={entry.y} rx={12} ry={9} fill={alpha(LPI.pink, 0.8)} stroke={alpha(LPI.navy, 0.5)} strokeWidth={2} /> : null}
					<WashFx on={fadeIn(frame, LAVE, 4) * (1 - fadeIn(frame, DESINF - 4, 6))} />
					<g transform={`translate(${entry.x - FINGER.cut.x} ${entry.y - FINGER.cut.y})`}>
						<DabPad on={fadeIn(frame, DESINF - 2, 4) * (1 - fadeIn(frame, DESINF + 28, 4))} dab={dabs} tint={1} />
					</g>
					{frame >= PANS - 2 ? <BandageG x={entry.x} y={FINGER.axis} wrapTop={1} wrapBottom={1} tab1={1} tab2={1} scale={popAt(frame, PANS - 2)} /> : null}
				</BigFinger>
			</div>
			<Sfx name="tap" at={LAVE} volume={0.12} dur={16} />
			<Sfx name="pop" at={PANS - 2} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ QUAND CONSULTER ═══════════════════════════════ */
const RedFinger: React.FC = () => (
	<svg width={160} height={90} viewBox="0 0 160 90">
		<path d="M0 18 H110 Q150 18 150 45 Q150 72 110 72 H0 Z" fill={LPI.paper} stroke={LPI.navy} strokeWidth={4} />
		<ellipse cx={80} cy={45} rx={34} ry={22} fill={alpha(LPI.pink, 0.85)} />
		<circle cx={80} cy={45} r={7} fill={LPI.paper} stroke={LPI.navy} strokeWidth={2} />
	</svg>
);

export const Consulter: React.FC = () => {
	const frame = useCurrentFrame();
	const CONSULTE = at('consulter', 'consulte');
	const PROFONDE = at('consulter', 'profonde,');
	const OEIL = at('consulter', "l'œil,");
	const ROUGE = at('consulter', 'rouge,');
	const PUS = at('consulter', 'pus.');
	const VACCIN = at('consulter', 'vaccin');
	const JOUR = at('consulter', 'jour.');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={CONSULTE - 4} text="On *consulte* si…" size={104} y={150} center />
			<RowCard at={PROFONDE - 4} y={400} h={200} art={170} badge={1} title="Profonde ou cassée" sub="un bout reste sous la peau" subAt={PROFONDE + 20} size={50}>
				<DeepSplinterIcon size={150} />
			</RowCard>
			<RowCard at={OEIL - 4} y={625} h={200} art={170} badge={2} title="Près de l'œil" from="left" size={50}>
				<EyeIcon size={120} />
			</RowCard>
			<RowCard at={ROUGE - 4} y={850} h={200} art={170} badge={3} title="Rouge, gonflé, du pus" sub="les jours suivants" subAt={PUS} size={50}>
				<RedFinger />
			</RowCard>
			<RowCard at={VACCIN - 6} y={1075} h={220} art={190} badge="+" badgeTone={LPI.sky} title="Vaccin tétanos" sub="à jour ?" subAt={JOUR - 6} check={JOUR + 4} from="left" size={50}>
				<VaxBook size={180} check={fadeIn(frame, JOUR + 4, 8)} />
			</RowCard>
			{[PROFONDE - 4, OEIL - 4, ROUGE - 4, VACCIN - 6].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={JOUR + 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : DANS LE BON SENS ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const VOILA = at('fin', 'voilà :');
	const SENS = at('fin', 'sens…');
	const BOUT = at('fin', 'bout !');
	const FT = topFor(1000);
	const lift = lin(frame, VOILA, VOILA + 18);
	const tip = splinterAt(-14 - 280);
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[VOILA + 1, SENS + 1, BOUT + 1]} shakes={[BOUT + 1]} strength={0.04}>
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} cut={0} palm>
						<BandageG x={splinterAt(0).x} y={FINGER.axis} wrapTop={1} wrapBottom={1} tab1={1} tab2={1} />
						{/* la pince montre fièrement l'écharde entière */}
						<g transform={`translate(${-300 * lift} ${-330 * lift})`}>
							<SplinterG pull={1} />
							<TweezersG x={tip.x} y={tip.y} ang={-38} close={1} />
						</g>
					</BigFinger>
				</div>
				<Big from={SENS - 4} to={BOUT - 6} text="Dans le bon *sens*…" size={104} y={240} center />
				<Big from={BOUT - 2} text={'Sans laisser un *bout* !'} size={100} y={240} center />
				<Burst at={BOUT} x={700} y={800} r={260} n={14} />
			</Camera>
			<Sfx name="whoosh" at={VOILA} volume={0.07} />
			<Sfx name="ding" at={BOUT} volume={0.1} />
		</AbsoluteFill>
	);
};
