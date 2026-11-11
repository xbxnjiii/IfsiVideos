// Scènes de « Comment soigner une petite brûlure ? » : chaque mouvement part d'un mot, at(scène, mot) — `npm run cues -- brulure`.
// Même grand doigt que le pansement (`BigFinger`, 1300 px) ; la brûlure est sur le côté de la 2e phalange (`FINGER.burn`),
// là où il a touché le bord de la casserole.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigFinger, FINGER, fingerPt} from '../../brand/bandage';
import {Big, fadeIn, Flash, Fly, PointTag, popAt, RowCard} from '../../brand/bold';
import {ButterPat, CooktopG, FifteenCard, GauzeOnG, HotPanG, IceCube, PinG, ToothpasteTube, WaterStreamG} from '../../brand/burn';
import {Stopwatch} from '../../brand/episode';
import {KitItem} from '../../brand/firstaid';
import {Kid, PainFace} from '../../brand/pain';
import {Burst, Camera} from '../../brand/motion3';
import {Hand} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const FW = 1300;
const B = FINGER.burn;
/** Gauche du doigt : la brûlure tombe au milieu de l'écran. */
const FL = 540 - (B.x * FW) / 1000;
const topFor = (axisY: number) => axisY - (FINGER.axis * FW) / 1000;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

const Question: React.FC<{at: number; x: number; y: number}> = ({at: t0, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * (1 + 0.06 * Math.sin(frame / 4))})`}}>
			<div style={{width: 190, height: 190, borderRadius: 95, background: LPI.pink, border: `8px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: N}}>?</div>
		</div>
	);
};

/** Grande croix rose qui barre (au-dessus d'une tuile). */
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

/** La casserole sur le feu (repère du doigt) : son bord du haut touche le côté du doigt. */
const PAN = {x: B.x, y: FINGER.bottom + 330, r: 320};

/* ═══════════════════════════════ ACCROCHE : LE BORD DE LA CASSEROLE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const AIE = 3;
	const CHAUFFE = at('intro', 'chauffe,');
	const ROUGIT = at('intro', 'rougit…');
	const ALORS = at('intro', 'alors,');
	// plan large : on voit toute la plaque, la casserole et son manche
	const W = 900;
	const L = 540 - (B.x * W) / 1000;
	const FT = 400 - (FINGER.axis * W) / 1000;
	// le doigt descend, touche le bord (image 3), sursaute et remonte
	const dy = frame < AIE ? interpolate(frame, [0, AIE], [-30, 6], clamp) : 6 - 150 * lin(frame, AIE, AIE + 8) + 6 * Math.exp(-(frame - AIE - 8) / 5) * Math.cos((frame - AIE - 8) * 0.9) * (frame > AIE + 8 ? 1 : 0);
	const burn = interpolate(frame, [AIE, AIE + 30, ROUGIT, ROUGIT + 14], [0, 0.45, 0.55, 1], clamp);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Camera punches={[AIE + 1, CHAUFFE + 1, ROUGIT + 1, ALORS + 1]} shakes={[AIE + 1]} strength={0.04}>
				{/* la plaque de cuisson, le feu allumé, la casserole et son manche, dans le même repère que le doigt */}
				<svg width={W} height={(W * 400) / 1000} viewBox="0 0 1000 400" style={{position: 'absolute', left: L, top: FT, overflow: 'visible'}}>
					<CooktopG x={PAN.x} y={PAN.y} />
					<HotPanG x={PAN.x} y={PAN.y} r={PAN.r} handle={118} />
				</svg>
				<div style={{position: 'absolute', left: L, top: FT + (dy * W) / 1000}}>
					<BigFinger width={W} cut={0} burn={burn} heat={fadeIn(frame, CHAUFFE - 4, 8)} />
				</div>
				<Question at={ALORS} x={540} y={170} />
			</Camera>
			<Flash at={AIE} max={0.3} />
			<Sfx name="hiss" at={AIE - 1} volume={0.25} dur={18} />
			<Sfx name="impact" at={AIE} volume={0.1} />
			<Sfx name="whoosh" at={AIE + 2} volume={0.08} />
			<Sfx name="pop" at={ALORS} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES IDÉES REÇUES : SURTOUT PAS ═══════════════════════════════ */
const Tile: React.FC<{at: number; x: number; cross: number; children: React.ReactNode}> = ({at: t0, x, cross, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x - 150, top: 420, width: 300, height: 300, transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{position: 'absolute', inset: 0, borderRadius: 44, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
			<Cross at={cross} size={250} />
		</div>
	);
};

export const Idees: React.FC = () => {
	const GLACON = at('idees', 'glaçon ?');
	const BEURRE = at('idees', 'beurre ?');
	const DENT = at('idees', 'dentifrice ?');
	const SURTOUT = at('idees', 'surtout');
	const PAS = at('idees', 'pas !');
	const GLACON2 = at('idees', 'glaçon', 2);
	const PEAU = at('idees', 'peau,');
	const RESTE = at('idees', 'reste');
	const INFECTER = at('idees', 'infecter');
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[GLACON + 1, BEURRE + 1, DENT + 1, PAS + 1]} shakes={[PAS + 1]} strength={0.04}>
				<Tile at={GLACON - 2} x={200} cross={PAS - 2}>
					<IceCube size={200} />
				</Tile>
				<Tile at={BEURRE - 2} x={540} cross={PAS}>
					<ButterPat size={220} />
				</Tile>
				<Tile at={DENT - 2} x={880} cross={PAS + 2}>
					<ToothpasteTube size={240} />
				</Tile>
				<Big from={SURTOUT - 2} text="Surtout *pas* !" size={120} y={150} center />
				<RowCard at={GLACON2 - 4} y={860} h={230} art={200} badge="✕" title="Le glaçon" sub="abîme encore plus la peau" subAt={PEAU - 10} size={54}>
					<IceCube size={150} />
				</RowCard>
				<RowCard at={RESTE - 4} y={1120} h={230} art={200} badge="✕" title="Beurre, dentifrice" sub="gardent la chaleur, risque d'infection" subAt={INFECTER - 6} from="left" size={54}>
					<ButterPat size={170} />
				</RowCard>
			</Camera>
			<Flash at={PAS} max={0.3} />
			{[GLACON - 2, BEURRE - 2, DENT - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="stamp" at={PAS} volume={0.12} />
			<Sfx name="whoosh" at={GLACON2 - 4} volume={0.07} />
			<Sfx name="whoosh" at={RESTE - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON RÉFLEXE : L'EAU, 15 MINUTES ═══════════════════════════════ */
export const Eau: React.FC = () => {
	const frame = useCurrentFrame();
	const PASSE = at('eau', 'passe-la');
	const PENDANT = at('eau', 'pendant');
	const MINUTES = at('eau', 'minutes.');
	const RETIENS = at('eau', 'retiens');
	const TROIS = at('eau', 'trois');
	const DEGRES = at('eau', 'degrés,');
	const CM = at('eau', 'centimètres');
	const MIN2 = at('eau', 'minutes.', 2);
	const FT = topFor(820);
	const mins = Math.round(15 * lin(frame, PENDANT - 2, MINUTES + 6));
	const water = fadeIn(frame, PASSE - 2, 10);
	return (
		<AbsoluteFill>
			<Bg />
			<div style={{position: 'absolute', left: FL, top: FT}}>
				<BigFinger width={FW} cut={0} burn={1 - 0.35 * lin(frame, PASSE + 10, MIN2)} wet={fadeIn(frame, PASSE + 8, 8)}>
					<WaterStreamG on={water} />
				</BigFinger>
			</div>
			<Fly at={PENDANT - 4} x={230} y={330} s={0.62}>
				<Stopwatch progress={mins / 15} count={mins} label="minutes" />
			</Fly>
			<Big from={RETIENS - 2} text="La règle des *3* × *15*" size={84} y={1080} center />
			{[
				[DEGRES - 4, 190, '°C', 'eau fraîche, pas glacée', LPI.sky],
				[CM - 4, 540, 'cm', 'sous le robinet', LPI.pink],
				[MIN2 - 4, 890, 'min', "sous l'eau", LPI.sky],
			].map(([t, x, unit, label, tone]) => (
				<Fly key={unit as string} at={t as number} x={x as number} y={1430}>
					<FifteenCard unit={unit as string} label={label as string} tone={tone as string} width={310} />
				</Fly>
			))}
			<Sfx name="tap" at={PASSE - 2} volume={0.2} dur={90} />
			<Sfx name="tick" at={PENDANT} volume={0.08} />
			<Sfx name="ding" at={MINUTES + 6} volume={0.08} />
			<Sfx name="pop" at={TROIS} volume={0.07} />
			{[DEGRES - 4, CM - 4, MIN2 - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PROTÉGER : LA CLOQUE, LA COMPRESSE, LE PARACÉTAMOL ═══════════════════════════════ */
export const Proteger: React.FC = () => {
	const frame = useCurrentFrame();
	const CLOQUE = at('proteger', 'cloque ?');
	const PERCE = at('proteger', 'perce');
	const PAS = at('proteger', 'pas :');
	const PROTEGE = at('proteger', 'protège');
	const COUVRE = at('proteger', 'couvre');
	const COMPRESSE = at('proteger', 'compresse');
	const PANSEMENT = at('proteger', 'pansement');
	const PARA = at('proteger', 'paracétamol');
	const FT = topFor(700);
	const pin = frame < PAS ? lin(frame, PERCE - 14, PAS - 2) * 0.85 : 0.85 * (1 - lin(frame, PAS + 4, PAS + 14));
	const bl = fingerPt({x: B.x + 10, y: B.y}, FL, FT, FW);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Camera punches={[CLOQUE + 1, PAS + 1, COMPRESSE + 1, PANSEMENT + 1, PARA + 1]} shakes={[PAS + 1]} strength={0.035}>
				<Big from={-2} to={COUVRE - 4} text="On ne la *perce* *pas*" size={96} y={150} center />
				<Big from={COUVRE + 4} text="On *couvre*" size={96} y={150} center />
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} cut={0} burn={0.7} blister={lin(frame, CLOQUE - 4, CLOQUE + 8)}>
						<PinG t={pin} />
						<GauzeOnG on={fadeIn(frame, COMPRESSE - 2, 8) * (1 - fadeIn(frame, PANSEMENT - 4, 4))} />
						<GauzeOnG on={fadeIn(frame, PANSEMENT - 2, 8)} greasy />
					</BigFinger>
				</div>
				{frame >= PAS && frame < PAS + 26 ? (
					<div style={{position: 'absolute', left: bl.x + 170, top: bl.y - 170, width: 0, height: 0}}>
						<Cross at={PAS} size={190} />
					</div>
				) : null}
				<PointTag at={PROTEGE - 2} to={COUVRE - 6} x={540} y={1120} px={bl.x} py={bl.y + 50} size={44}>
					elle protège la peau
				</PointTag>
				<PointTag at={COMPRESSE - 2} to={PANSEMENT - 6} x={540} y={1120} px={bl.x} py={bl.y + 120} size={44}>
					compresse stérile
				</PointTag>
				<PointTag at={PANSEMENT - 2} to={PARA - 6} x={540} y={1120} px={bl.x} py={bl.y + 120} size={44} tone={LPI.sky}>
					ou pansement gras
				</PointTag>
				<RowCard at={PARA - 4} y={1060} h={220} art={200} badge="+" badgeTone={LPI.sky} title="Paracétamol" sub="si ça fait mal" subAt={PARA + 20} size={56}>
					<KitItem kind="paracetamol" size={160} />
				</RowCard>
			</Camera>
			<Flash at={PAS} max={0.25} />
			<Sfx name="pop" at={CLOQUE - 4} volume={0.08} />
			<Sfx name="buzz" at={PAS} volume={0.06} dur={10} />
			<Sfx name="whoosh" at={COMPRESSE - 2} volume={0.07} />
			<Sfx name="whoosh" at={PANSEMENT - 2} volume={0.07} />
			<Sfx name="pop" at={PARA - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ QUAND CONSULTER ═══════════════════════════════ */
const Swatches: React.FC = () => (
	<svg width={170} height={120} viewBox="0 0 170 120">
		<circle cx={52} cy={60} r={44} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<circle cx={118} cy={60} r={44} fill={N} stroke={N} strokeWidth={5} />
	</svg>
);
const HalfPalm: React.FC = () => (
	<div style={{position: 'relative', width: 150, height: 190}}>
		<Hand size={150} />
		<svg width={150} height={195} viewBox="0 0 200 260" style={{position: 'absolute', inset: 0}}>
			<ellipse cx={100} cy={185} rx={42} ry={36} fill={alpha(LPI.pink, 0.75)} />
		</svg>
	</div>
);

export const Consulter: React.FC = () => {
	const CONSULTE = at('consulter', 'consulte');
	const GRANDE = at('consulter', 'grande');
	const PAUME = at('consulter', 'paume');
	const VISAGE = at('consulter', 'visage');
	const INTIMES = at('consulter', 'intimes,');
	const ENFANT = at('consulter', 'enfant,');
	const PEAU = at('consulter', 'peau');
	const NOIRE = at('consulter', 'noire.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Big from={CONSULTE - 4} text="On *consulte* si…" size={104} y={150} center />
			<RowCard at={GRANDE - 4} y={400} h={200} art={170} badge={1} title="Plus grande que ½ paume" sub="de la main de la personne brûlée" subAt={PAUME} size={48}>
				<HalfPalm />
			</RowCard>
			<RowCard at={VISAGE - 4} y={625} h={200} art={170} badge={2} title="Visage, parties intimes" sub="zones fragiles" subAt={INTIMES} from="left" size={48}>
				<PainFace level={4} size={140} />
			</RowCard>
			<RowCard at={ENFANT - 4} y={850} h={200} art={170} badge={3} title="Chez un enfant" sub="toujours un avis médical" subAt={ENFANT + 10} size={48}>
				<Kid size={150} />
			</RowCard>
			<RowCard at={PEAU - 4} y={1075} h={200} art={170} badge={4} title="Peau blanche ou noire" sub="brûlure profonde" subAt={NOIRE} from="left" size={48}>
				<Swatches />
			</RowCard>
			{[GRANDE - 4, VISAGE - 4, ENFANT - 4, PEAU - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : TON DOIGT TE DIT MERCI ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const LEAU = at('fin', "l'eau…");
	const MERCI = at('fin', 'merci !');
	const FT = topFor(900);
	return (
		<AbsoluteFill>
			<Bg />
			<Camera punches={[LEAU + 1, MERCI + 1]} shakes={[MERCI + 1]} strength={0.04}>
				<div style={{position: 'absolute', left: FL, top: FT}}>
					<BigFinger width={FW} cut={0} burn={0.6 * (1 - lin(frame, LEAU, MERCI))} wet={1 - fadeIn(frame, MERCI, 10)}>
						<WaterStreamG on={1 - fadeIn(frame, MERCI - 8, 6)} />
					</BigFinger>
				</div>
				<Big from={MERCI - 2} text="*Merci* !" size={150} y={260} center />
				<Burst at={MERCI} x={540} y={900} r={300} n={16} />
			</Camera>
			<Sfx name="tap" at={0} volume={0.12} dur={40} />
			<Sfx name="ding" at={MERCI} volume={0.1} />
		</AbsoluteFill>
	);
};
