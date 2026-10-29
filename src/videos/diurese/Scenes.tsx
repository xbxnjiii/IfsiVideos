// Scènes de « La diurèse » : une notion = une scène, chaque mouvement part d'un mot de la voix.
// Appareil urinaire et bocal gradué : src/brand/urine.tsx ; le patient : src/brand/patient.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {BigNum, CauseChip, Head, LAY, Lead, Pill, RecapScene, SLAM_Y, termSlot, Unit} from '../../brand/episode';
import {PillIcon, ThirstIcon} from '../../brand/icons';
import {CheckChip, Stamp, usePop} from '../../brand/kit';
import {Seuil} from '../../brand/Lesson3';
import {Burst, Camera, LiveBackground, Odometer, Stage, TermSlam} from '../../brand/motion3';
import {NormScale} from '../../brand/NormScale';
import {Patient, PatientProps, patientPoint} from '../../brand/patient';
import {GlucosePicto} from '../../brand/pictos';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Enter, Title, useSoft} from '../../brand/ui';
import {Clock24, DIU_ZONES, dropTimes, Jar, UrinarySystem} from '../../brand/urine';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const PINK = alpha(LPI.pink, 0.42);
const COLD = alpha(LPI.sky, 0.95);
const pulseAt = (frame: number, period = 25) => Math.exp(-(frame % period) / 5);
const idle = (frame: number) => 0.5 - 0.5 * Math.cos(frame / 22);

/** Valeur qui roule d'un palier à l'autre : [[frame, valeur], …]. */
const steps = (frame: number, keys: [number, number][]) =>
	interpolate(
		frame,
		keys.flatMap(([t], i) => (i === 0 ? [t] : [t, t + Math.min(16, (keys[i + 1]?.[0] ?? t + 99) - t - 1)])),
		keys.flatMap(([, v], i) => (i === 0 ? [v] : [keys[i - 1][1], v])),
		ease,
	);

/** Petit texte d'explication sous une pastille (« (des médicaments qui font uriner) »). */
const Note: React.FC<{at: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Enter at={t0} distance={14}>
				<span style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: alpha(N, 0.75)}}>{children}</span>
			</Enter>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const Q = at('intro', 'quoi');
	const D = at('intro', 'diurèse');
	const pop = usePop(2);
	const qp = usePop(Q);
	const vAt = (f: number) => interpolate(f, [4, 70], [300, 1500], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[Q + 1, D + 1]} shakes={[Q + 2]} strength={0.04}>
				<div style={{position: 'absolute', left: 72, top: 226, width: 936}}>
					<Title at={0} text="C'est quoi la" size={74} stagger={3} brush={false} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 312, width: 936}}>
					<Title at={D} text="*diurèse* ?" size={130} stagger={4} />
				</div>
				<div style={{position: 'absolute', left: 540 - 169, top: 560, transform: `scale(${1.3 * (0.4 + 0.6 * pop)})`, transformOrigin: 'left top'}}>
					<Jar value={vAt(frame)} drops={dropTimes(frame, 2, () => 3200)} />
				</div>
				{frame >= Q ? (
					<div
						style={{
							position: 'absolute',
							left: 800,
							top: 560,
							width: 170,
							height: 170,
							borderRadius: 85,
							background: LPI.pink,
							border: `8px solid ${LPI.paper}`,
							boxShadow: SHADOW,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT.title,
							fontWeight: 900,
							fontSize: 130,
							color: N,
							transform: `scale(${qp}) rotate(${Math.sin(frame / 6) * 8}deg)`,
						}}
					>
						?
					</div>
				) : null}
				<Burst at={Q} x={885} y={645} r={200} n={12} />
			</Camera>
			<Sfx name="pop" at={Q} volume={0.12} />
			<Sfx name="whoosh" at={D} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · DÉFINITION ═══════════════════════════════ */
const CARD = {x: 330, y: 20, w: 586, h: 480};
export const Definition: React.FC = () => {
	const frame = useCurrentFrame();
	const DI = at('def', 'diurèse');
	const QU = at('def', 'quantité');
	const REINS = at('def', 'reins');
	const FIL = at('def', 'filtrent');
	const SANG = at('def', 'sang');
	const URI = at('def', "l'urine");
	const STO = at('def', 'stockée');
	const VES = at('def', 'vessie');
	const body = useSoft(DI + 2);
	const card = useSoft(QU - 2, true);
	const kidneys = useSoft(REINS - 2, true);
	const blood = interpolate(frame, [FIL - 4, FIL + 8], [0, 1], clamp);
	const filter = interpolate(frame, [FIL, FIL + 8], [0, 1], clamp) * (0.7 + 0.3 * Math.sin(frame / 4));
	const ureters = interpolate(frame, [URI - 4, URI + 8], [0, 1], clamp);
	const bladder = useSoft(STO - 4, true);
	const fill = interpolate(frame, [STO, VES + 30], [0.1, 0.75], ease);
	const belly = patientPoint('belly', 280);
	const bx = 20 + belly.x;
	const by = 40 + belly.y;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[QU + 1, REINS + 1, FIL + 1, URI + 1, VES + 1]} shakes={[FIL + 2]}>
				<Head kicker="Définition" kAt={DI} title="La *diurèse*" tAt={DI + 2} />
				<Stage y={LAY.stageY} h={520} at={DI + 4} bumps={[REINS, VES]}>
					<div style={{position: 'absolute', left: 20, top: 40, opacity: Math.min(1, body * 1.5), transform: `translateY(${(1 - body) * 50}px)`}}>
						<Patient size={280} breath={idle(frame)} heart={body} beat={pulseAt(frame)} />
					</div>
					{frame >= QU - 2 ? (
						<>
							<svg width={936} height={520} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: card}}>
								<path d={`M${bx} ${by} L${CARD.x} ${CARD.y + 90} M${bx} ${by} L${CARD.x} ${CARD.y + CARD.h - 90}`} stroke={LPI.blue} strokeWidth={5} strokeDasharray="12 10" />
								<circle cx={bx} cy={by} r={14} fill={LPI.pink} stroke={LPI.paper} strokeWidth={5} />
							</svg>
							<div
								style={{
									position: 'absolute',
									left: CARD.x,
									top: CARD.y,
									width: CARD.w,
									height: CARD.h,
									borderRadius: 44,
									background: LPI.paper,
									border: `9px solid ${N}`,
									boxSizing: 'border-box',
									boxShadow: SHADOW,
									transform: `scale(${card})`,
								}}
							>
								<div style={{position: 'absolute', left: 103, top: 16}}>
									<UrinarySystem size={380} kidneys={kidneys} blood={blood} filter={filter} ureters={ureters} bladder={bladder} fill={fill} />
								</div>
							</div>
						</>
					) : null}
					<div style={{position: 'absolute', left: 770, top: 110}}>
						<Pill at={REINS} size={36} color={LPI.blue}>
							reins
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 360, top: 50}}>
						<Pill at={SANG} size={36}>
							sang
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 350, top: 250}}>
						<Pill at={URI} size={36} color={LPI.sky}>
							urine
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 716, top: 400}}>
						<Pill at={VES} size={36} color={LPI.blue}>
							vessie
						</Pill>
					</div>
				</Stage>
				{/* diurèse = quantité d'urine */}
				<div style={{position: 'absolute', left: 72, top: 1010, display: 'flex', alignItems: 'center', gap: 18}}>
					<Pill at={QU} color={LPI.blue} size={50}>
						diurèse
					</Pill>
					{frame >= QU + 4 ? <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: LPI.blue}}>=</span> : null}
					{frame >= QU + 6 ? (
						<Enter at={QU + 6} from="left" distance={30}>
							<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: 40, color: N, lineHeight: 1.1, display: 'block'}}>
								quantité d'urine
								<br />
								<span style={{color: LPI.blue}}>fabriquée par les reins</span>
							</span>
						</Enter>
					) : null}
				</div>
				<Burst at={REINS} x={72 + 770} y={LAY.stageY + 150} r={160} n={10} />
			</Camera>
			<Sfx name="whoosh" at={QU - 2} volume={0.06} />
			<Sfx name="pop" at={REINS} volume={0.1} />
			<Sfx name="impact" at={FIL} volume={0.07} />
			<Sfx name="pop" at={URI} volume={0.1} />
			<Sfx name="pop" at={VES} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · MESURE ═══════════════════════════════ */
export const Mesure: React.FC = () => {
	const frame = useCurrentFrame();
	const ME = at('mesure', 'mesure');
	const H24 = at('mesure', '24');
	const REC = at('mesure', 'recueille');
	const TOU = at('mesure', 'toutes');
	const BOC = at('mesure', 'bocal');
	const GRA = at('mesure', 'gradué');
	const LIT = at('mesure', 'lit');
	const VOL = at('mesure', 'volume');
	const ML = at('mesure', 'millilitres');
	const jar = useSoft(BOC - 6, true);
	const vAt = (f: number) => interpolate(f, [REC, LIT + 6], [0, 1500], ease);
	const value = vAt(frame);
	const drops = dropTimes(frame, REC, () => 3200);
	const num = useSoft(VOL - 2, true);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[H24 + 1, REC + 1, BOC + 1, LIT + 1, ML + 1]} shakes={[H24 + 2]}>
				<Head kicker="Mesure" kAt={ME - 4} title="Sur *24* *heures*" tAt={H24 - 2} />
				<Stage y={LAY.stageY} h={LAY.stageH} at={ME + 2} bumps={[H24, LIT]}>
					<div style={{position: 'absolute', left: 30, top: 100, transform: 'scale(1.7)', transformOrigin: 'left top'}}>
						<Clock24 at={H24} />
					</div>
					<div style={{position: 'absolute', left: 300, top: 70, opacity: Math.min(1, jar * 1.5), transform: `translateY(${(1 - jar) * 60}px)`}}>
						<Jar value={value} drops={drops} />
					</div>
					<div style={{position: 'absolute', left: 330, top: 482}}>
						<Pill at={GRA} size={32} color={LPI.blue}>
							bocal gradué
						</Pill>
					</div>
					<div style={{position: 'absolute', left: 600, top: 180, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', opacity: Math.min(1, num * 1.5), transform: `translateY(${(1 - num) * 30}px)`}}>
						<Odometer value={value} places={4} size={110} />
						<Unit size={46}>{frame >= ML - 2 ? 'ml (millilitres)' : 'ml'}</Unit>
					</div>
				</Stage>
				<div style={{position: 'absolute', left: 72, top: 1040, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
					<CheckChip at={H24} label="sur 24 heures" size={44} />
					<CheckChip at={TOU} label="toutes les urines" size={44} />
					<CheckChip at={LIT} label="on lit le volume en ml" size={44} />
				</div>
			</Camera>
			<Sfx name="pop" at={H24} volume={0.1} />
			<Sfx name="tick" at={H24 + 6} volume={0.07} />
			<Sfx name="pop" at={TOU} volume={0.1} />
			<Sfx name="whoosh" at={BOC - 6} volume={0.06} />
			<Sfx name="pop" at={LIT} volume={0.1} />
			<Sfx name="ding" at={ML} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · NORME ═══════════════════════════════ */
export const Norme: React.FC = () => {
	const frame = useCurrentFrame();
	const CHEZ = at('norme', 'chez');
	const AD = at('norme', "l'adulte");
	const NORM = at('norme', 'normale');
	const S1 = at('norme', '600');
	const S2 = at('norme', '2000');
	const ML = at('norme', 'millilitres');
	const ND = at('norme', 'normodiurèse');
	const band = useSoft(NORM - 4);
	const value = interpolate(frame, [S2 + 4, S2 + 24], [600, 1500], ease);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AD + 1, NORM + 1, S1 + 1, S2 + 1, ND + 1]} shakes={[S1 + 2, S2 + 2]}>
				<Head kicker="Norme adulte" kAt={CHEZ} title="La *normale*" tAt={NORM - 6} />
				<div style={{position: 'absolute', left: 72, top: 420}}>
					<CheckChip at={AD} label="adulte" size={40} />
				</div>
				<div style={{position: 'absolute', left: 72, top: 550, width: 936, height: 330, borderRadius: 60, background: alpha(LPI.sky, 0.55), opacity: band, transform: `scaleX(${0.7 + 0.3 * band})`}} />
				<div style={{position: 'absolute', left: 72, top: 600, width: 936, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
					<BigNum at={S1} size={180}>
						600
					</BigNum>
					{frame >= S2 - 3 ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 130, color: LPI.blue}}>–</div> : null}
					<BigNum at={S2} size={180}>
						2000
					</BigNum>
				</div>
				{frame >= ML - 2 ? (
					<div style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
						<Enter at={ML - 2} distance={20}>
							<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.blue}}>millilitres par 24 heures</span>
						</Enter>
					</div>
				) : null}
				<Burst at={S1} x={330} y={700} r={220} n={10} />
				<Burst at={S2} x={760} y={700} r={240} n={12} />
				<NormScale zones={DIU_ZONES} value={value} at={NORM + 4} markerAt={S2 + 4} y={940} nameSize={23} rangeSize={20} />
				<TermSlam
					index={0}
					at={ND}
					term="Normodiurèse"
					meaning={
						<>
							quantité d'urine normale <Seuil>600 – 2000 ml/24 h</Seuil>
						</>
					}
					sign="check"
					slamY={SLAM_Y}
					slot={{x: 72, y: 1150, w: 936}}
					active={frame >= ND}
				/>
			</Camera>
			<Sfx name="pop" at={AD} volume={0.1} />
			<Sfx name="impact" at={S1} volume={0.1} />
			<Sfx name="impact" at={S2} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · POLYURIE / 5 · OLIGURIE / 6 · ANURIE ═══════════════════════════════ */
/** Patient + bocal + volume sur le socle ; la cadence des gouttes suit le volume. */
const DiuStage: React.FC<{vAt: (f: number) => number; from: number; patient: PatientProps; hot?: boolean}> = ({vAt, from, patient, hot = false}) => {
	const frame = useCurrentFrame();
	const value = vAt(frame);
	return (
		<>
			<div style={{position: 'absolute', left: 20, top: 34}}>
				<Patient size={290} breath={idle(frame)} {...patient} />
			</div>
			<div style={{position: 'absolute', left: 330, top: 56}}>
				<Jar value={value} drops={dropTimes(frame, from, vAt)} />
			</div>
			<div style={{position: 'absolute', left: 616, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
				<Odometer value={value} places={4} size={96} color={hot ? LPI.blue : N} />
				<Unit size={40}>ml/24 h</Unit>
			</div>
		</>
	);
};

export const Poly: React.FC = () => {
	const frame = useCurrentFrame();
	const AU = at('poly', 'au-dessus');
	const S1 = at('poly', '2500');
	const S2 = at('poly', '3000');
	const PO = at('poly', 'polyurie');
	const BEAU = at('poly', 'beaucoup');
	const EX = at('poly', 'exemple');
	const DIAB = at('poly', 'diabète');
	const DIUR = at('poly', 'diurétiques');
	const MED = at('poly', 'médicaments');
	const vAt = (f: number) => steps(f, [
		[0, 1500],
		[S1, 2600],
		[S2, 3200],
	]);
	const fill = interpolate(frame, [S1, S2 + 16], [0.3, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[AU + 1, S1 + 1, S2 + 1, PO + 1, BEAU + 1, DIAB + 1, DIUR + 1]} shakes={[PO + 2]}>
				<Head kicker="Au-dessus de 2500 à 3000" kAt={AU} title="Beaucoup *trop*" tAt={AU + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={AU + 4} layers={[{color: PINK, level: fill}]} bumps={[S1, S2]}>
					<DiuStage vAt={vAt} from={0} hot patient={{mood: frame >= BEAU ? 'mal' : 'calme', heart: 1, beat: pulseAt(frame)}} />
				</Stage>
				<TermSlam
					index={0}
					at={PO}
					term="Polyurie"
					meaning={
						<>
							urine beaucoup trop <Seuil>&gt; 2500 à 3000 ml/24 h</Seuil>
						</>
					}
					sign="up"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= PO && frame < EX}
				/>
				<Lead at={EX} text="par exemple :" />
				<div style={{position: 'absolute', left: 72, top: 1240}}>
					<CauseChip at={DIAB} icon={<GlucosePicto size={56} />} label="un diabète" />
				</div>
				<div style={{position: 'absolute', left: 560, top: 1240}}>
					<CauseChip at={DIUR} icon={<PillIcon size={56} />} label="des diurétiques" />
				</div>
				<Note at={MED - 2} x={560} y={1352}>
					(médicaments
					<br />
					qui font uriner)
				</Note>
			</Camera>
			<Sfx name="tick" at={S1} volume={0.08} />
			<Sfx name="tick" at={S2} volume={0.08} />
			<Sfx name="pop" at={DIAB} volume={0.11} />
			<Sfx name="pop" at={DIUR} volume={0.11} />
		</AbsoluteFill>
	);
};

export const Oligo: React.FC = () => {
	const frame = useCurrentFrame();
	const EN = at('oligo', 'en');
	const S = at('oligo', '400');
	const OL = at('oligo', 'oligurie');
	const PEU = at('oligo', 'peu');
	const VEN = at('oligo', 'venir');
	const DES = at('oligo', 'déshydratation');
	const MAN = at('oligo', 'manque');
	const vAt = (f: number) => steps(f, [
		[0, 1500],
		[S, 300],
	]);
	const fill = interpolate(frame, [S, S + 22], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[EN + 1, S + 1, OL + 1, PEU + 1, DES + 1]} shakes={[OL + 2]}>
				<Head kicker="En dessous de 400" kAt={EN} title="Trop *peu*" tAt={EN + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={EN + 4} layers={[{color: COLD, level: fill}]} bumps={[S, PEU]}>
					<DiuStage
						vAt={vAt}
						from={0}
						patient={{mood: frame >= OL ? 'mal' : 'calme', heart: 1, beat: pulseAt(frame), sweat: 0, pale: interpolate(frame, [DES, DES + 10], [0, 0.5], clamp)}}
					/>
				</Stage>
				<TermSlam
					index={0}
					at={OL}
					term="Oligurie"
					meaning={
						<>
							urine trop peu <Seuil>&lt; 400 ml/24 h</Seuil>
						</>
					}
					sign="down"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= OL && frame < VEN}
				/>
				<Lead at={VEN} text="ça peut venir…" />
				<div style={{position: 'absolute', left: 72, top: 1240}}>
					<CauseChip at={DES} icon={<ThirstIcon size={56} />} label="d'une déshydratation" tone={LPI.sky} />
				</div>
				<Note at={MAN - 2} x={80} y={1352}>
					(le corps manque d'eau)
				</Note>
			</Camera>
			<Sfx name="tick" at={S} volume={0.08} />
			<Sfx name="pop" at={DES} volume={0.11} />
		</AbsoluteFill>
	);
};

export const Anurie: React.FC = () => {
	const frame = useCurrentFrame();
	const DES = at('anurie', 'dessous');
	const S = at('anurie', '100');
	const AN = at('anurie', 'anurie');
	const PRE = at('anurie', 'presque');
	const URG = at('anurie', 'urgence');
	const vAt = (f: number) => steps(f, [
		[0, 300],
		[S, 60],
	]);
	const fill = interpolate(frame, [0, 10], [0.6, 1], clamp);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DES + 1, S + 1, AN + 1, PRE + 1, URG + 1]} shakes={[URG + 2]}>
				<Head kicker="En dessous de 100" kAt={DES} title="Presque *rien*" tAt={DES + 3} />
				<Stage y={LAY.stageY} h={LAY.stageH - 60} at={DES + 2} layers={[{color: COLD, level: fill}]} bumps={[S, PRE]}>
					<DiuStage vAt={vAt} from={0} patient={{mood: 'mal', heart: 1, beat: pulseAt(frame, 30), pale: 0.7}} />
				</Stage>
				<TermSlam
					index={0}
					at={AN}
					term="Anurie"
					meaning={
						<>
							presque plus d'urine <Seuil>&lt; 100 ml/24 h</Seuil>
						</>
					}
					sign="empty"
					slamY={SLAM_Y}
					slot={termSlot(0)}
					active={frame >= AN}
				/>
				<Stamp at={URG} x={790} y={LAY.stageY + 430} text="Urgence !" size={58} rot={-6} />
			</Camera>
			<Sfx name="tick" at={S} volume={0.08} />
			<Sfx name="stamp" at={URG} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP RAPIDE ═══════════════════════════════ */
export const Outro: React.FC = () => (
	<RecapScene
		title="La *diurèse*"
		kAt={at('outro', 'récap') - 4}
		done={at('outro', 'urgence') + 16}
		rows={[
			[at('outro', 'quantité'), 'device', "Quantité d'urine", 'sur 24 h · en ml'],
			[at('outro', 'normale'), 'check', 'Normodiurèse', '600 – 2000 ml/24 h'],
			[at('outro', 'polyurie'), 'up', 'Polyurie', '> 2500 à 3000 ml/24 h'],
			[at('outro', 'oligurie'), 'down', 'Oligurie', '< 400 ml/24 h'],
			[at('outro', 'anurie'), 'empty', 'Anurie', '< 100 ml/24 h · urgence'],
		]}
	/>
);
