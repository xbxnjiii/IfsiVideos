// Série « Les plaies », partie 3 : les plaies chroniques. Accroche (« Cette plaie… ne fait pas mal. Et c'est
// justement ça, le problème » : gros plan du pied, la douleur ne remonte plus), carte de la série (partie 3 / 3),
// l'escarre (patient couché, peau écrasée entre l'os et le matelas, sacrum et talons), ses 4 stades, l'ulcère de
// jambe, le pied diabétique (on regarde ses pieds tous les jours), récap + série terminée. Dessins : wound.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {WallClock} from '../../brand/devices';
import {CamKey, CauseChip, Head, RecapScene, SLAM_Y, StagePill, termSlot, ZoomCam} from '../../brand/episode';
import {DiabetesIcon, EyeIcon} from '../../brand/icons';
import {Camera, LiveBackground, Stage, TermSlam} from '../../brand/motion3';
import {NextUp, SeriesParts} from '../../brand/series';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp, Title} from '../../brand/ui';
import {LEG_PTS, LowerLeg, LYING_PTS, LyingBody, SKIN, SkinAt, SkinBox, SkinLabels, skinPt, Squeeze, WoundShape, ZoneGlyph} from '../../brand/wound';
import {LayersIcon, PARTS} from '../plaies-1/Scenes';
import {at} from './timeline';

const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
const N = LPI.navy;
const fadeIn = (frame: number, a: number, d = 8) => interpolate(frame, [a, a + d], [0, 1], clamp);
const popAt = (frame: number, t0: number) => (frame < t0 ? 0 : 1 + 0.12 * Math.exp(-(frame - t0) / 3) * Math.cos((frame - t0) * 0.9) - Math.exp(-(frame - t0) / 2));
const steps = (frame: number, marks: number[], vals: number[], d = 10, from = 0) =>
	marks.reduce((v, m, i) => v + (vals[i] - (i ? vals[i - 1] : from)) * interpolate(frame, [m, m + d], [0, 1], ease), from);

const Banner: React.FC<{at: number; y: number; children: React.ReactNode; tone?: string}> = ({at: t0, y, children, tone = LPI.blue}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${popAt(frame, t0)})`}}>
			<div style={{padding: '14px 34px', borderRadius: 999, background: LPI.paper, border: `6px solid ${tone}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>{children}</div>
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
// Image 0 : « Cette plaie ne fait pas mal. », gros plan du pied : une petite plaie dessous, le message de douleur
// s'arrête en chemin (✕). « le problème » : la plaie grandit, une ombre s'étend.
const HL = {x: 150, y: -250, w: 760};
const HK = HL.w / 500;
const hlPt = (p: keyof typeof LEG_PTS) => ({x: HL.x + LEG_PTS[p][0] * HK, y: HL.y + LEG_PTS[p][1] * HK});

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAIE = at('intro', 'plaie');
	const MAL = at('intro', 'mal');
	const JUST = at('intro', 'justement');
	const PROB = at('intro', 'problème');
	const sole = hlPt('sole');
	const keys: CamKey[] = [
		{at: -1, s: 1.45, x: sole.x - 60, y: sole.y - 120, dur: 1},
		{at: MAL + 6, s: 1.15, x: sole.x - 140, y: sole.y - 230, dur: 22},
		{at: PROB - 4, s: 1.7, x: sole.x - 20, y: sole.y - 60, dur: 16},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[PLAIE + 1, MAL + 1, JUST + 1, PROB + 1]} shakes={[PROB + 2]} strength={0.04}>
				{frame < JUST - 4 ? (
					<div style={{position: 'absolute', left: 72, top: 200, width: 936, opacity: 1 - fadeIn(frame, JUST - 8, 4)}}>
						<Title at={-20} text={'Cette *plaie*…\nne fait *pas* *mal*.'} size={100} align="center" stagger={0} brush={false} />
					</div>
				) : null}
				{frame >= JUST - 6 ? (
					<div style={{position: 'absolute', left: 72, top: 200, width: 936}}>
						<Title at={JUST - 6} text={'Et c’est *justement*\nça, le *problème*.'} size={96} align="center" stagger={3} brush={false} />
					</div>
				) : null}
				<Stage y={500} h={860} at={-30} bumps={[MAL, PROB]}>
					<ZoomCam keys={keys} w={936} h={860}>
						<div style={{position: 'absolute', left: HL.x, top: HL.y}}>
							<LowerLeg width={HL.w} footSore={1} nerve={1} numb={1} grow={interpolate(frame, [PROB - 4, PROB + 24], [0, 1], ease)} silent={fadeIn(frame, JUST, 18)} />
						</div>
					</ZoomCam>
					<StagePill from={MAL - 2} to={PROB - 4} y={770} color={LPI.sky}>
						aucune douleur
					</StagePill>
					<StagePill from={PROB - 2} y={770}>
						elle s'aggrave en silence
					</StagePill>
				</Stage>
			</Camera>
			<Sfx name="heartbeat" at={0} volume={0.07} />
			<Sfx name="buzz" at={MAL} volume={0.04} dur={14} />
			<Sfx name="whoosh" at={MAL + 6} volume={0.05} />
			<Sfx name="impact" at={PROB} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA SÉRIE ═══════════════════════════════ */
export const Serie: React.FC = () => {
	const NOUS = at('serie', 'nous');
	const PART = at('serie', 'partie');
	const TROIS = at('serie', 'trois');
	const CHRO = at('serie', 'chroniques');
	const REF = at('serie', 'refermées');
	const SEM = at('serie', 'semaines');
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[TROIS + 1, CHRO + 1, SEM + 1]} shakes={[TROIS + 2]}>
				<Head kicker="Série · Les plaies" kAt={NOUS - 4} title="Partie *3* sur 3" tAt={PART - 2} size={92} />
				<SeriesParts parts={PARTS} current={2} at={TROIS - 2} />
				<Banner at={CHRO - 2} y={1100}>
					Aujourd'hui : <span style={{color: LPI.blue}}>les plaies chroniques</span>
				</Banner>
				<Banner at={REF - 2} y={1210} tone={LPI.pink}>
					pas refermées après <span style={{color: LPI.blue}}>4 à 6 semaines</span>
				</Banner>
			</Camera>
			{[0, 1, 2].map((i) => (
				<Sfx key={i} name="pop" at={TROIS - 2 + i * 6} volume={0.09} />
			))}
			<Sfx name="ding" at={CHRO} volume={0.08} />
			<Sfx name="pop" at={REF} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ESCARRE ═══════════════════════════════ */
// Patient couché, longtemps (horloge) ; plongée sur le sacrum : la peau écrasée entre l'os et le matelas, le sang ne
// passe plus, la peau meurt ; retour : sacrum (bas du dos) et talons.
const LB: SkinBox = {x: 18, y: 120, w: 900};
const SQ: SkinBox = {x: 18, y: 20, w: 900};
const lyPt = (p: keyof typeof LYING_PTS) => ({x: LB.x + (LYING_PTS[p][0] * LB.w) / 900, y: LB.y + (LYING_PTS[p][1] * LB.w) / 900});

export const Escarre: React.FC = () => {
	const frame = useCurrentFrame();
	const CONNUE = at('escarre', 'connue');
	const ESC = at('escarre', "l'escarre");
	const ALL = at('escarre', 'allongé');
	const LONG = at('escarre', 'longtemps');
	const ECR = at('escarre', 'écrasée');
	const OS = at('escarre', "l'os");
	const MAT = at('escarre', 'matelas');
	const SANG = at('escarre', 'sang');
	const PLUS = at('escarre', 'plus', 2);
	const MEURT = at('escarre', 'meurt');
	const TROUVE = at('escarre', 'trouve');
	const SACR = at('escarre', 'sacrum');
	const BAS = at('escarre', 'bas');
	const TAL = at('escarre', 'talons');
	const sacrum = lyPt('sacrum');
	const heel = lyPt('heel');
	const lying: CamKey[] = [
		{at: ECR - 10, s: 2.8, x: sacrum.x, y: sacrum.y, dur: 12},
		{at: TROUVE - 12, s: 1.9, x: sacrum.x, y: sacrum.y - 30, dur: 1},
		{at: TAL - 4, s: 1.9, x: heel.x, y: heel.y - 30, dur: 14},
	];
	const sqO = fadeIn(frame, ECR - 4, 8) * (1 - fadeIn(frame, TROUVE - 12, 8));
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ESC + 1, ECR + 1, MAT + 1, MEURT + 1, SACR + 1, TAL + 1]} shakes={[MAT + 2, MEURT + 2]}>
				<Head kicker="La plus connue" kAt={CONNUE - 6} title="*L’escarre*" tAt={ESC - 2} />
				<Stage y={440} h={540} at={CONNUE} bumps={[ALL, ECR, MAT, SACR, TAL]}>
					{sqO < 1 ? (
						<div style={{position: 'absolute', inset: 0, opacity: 1 - sqO}}>
							<ZoomCam keys={lying} w={936} h={540}>
								<div style={{position: 'absolute', left: LB.x, top: LB.y}}>
									<LyingBody width={LB.w} points={fadeIn(frame, ALL - 2, 10)} focus={frame >= TAL - 2 ? ['sacrum', 'heel'] : frame >= SACR - 2 ? ['sacrum'] : []} />
								</div>
							</ZoomCam>
						</div>
					) : null}
					{frame >= LONG - 2 && frame < ECR - 6 ? (
						<div style={{position: 'absolute', left: 700, top: 20, transform: `scale(${popAt(frame, LONG - 2)})`}}>
							<WallClock h={8} m={0} size={180} spin={interpolate(frame, [LONG, ECR], [0, 6], clamp)} />
						</div>
					) : null}
					{sqO > 0 ? (
						<div style={{position: 'absolute', left: SQ.x, top: SQ.y, opacity: sqO}}>
							<Squeeze width={SQ.w} press={interpolate(frame, [OS - 8, MAT + 10], [0, 1], ease)} dead={interpolate(frame, [PLUS - 4, MEURT + 10], [0, 1], ease)} />
						</div>
					) : null}
					<StagePill from={ALL - 2} to={ECR - 6} color={LPI.sky}>
						allongé longtemps, sans bouger
					</StagePill>
					<StagePill from={OS - 2} to={SANG - 2}>
						écrasée entre l'os et le matelas
					</StagePill>
					<StagePill from={SANG - 2} to={MEURT - 2} color={LPI.blue}>
						le sang ne passe plus…
					</StagePill>
					<StagePill from={MEURT - 2} to={TROUVE - 12}>
						… la peau meurt
					</StagePill>
				</Stage>
				<TermSlam index={0} at={ESC} term="Escarre" meaning="peau écrasée trop longtemps : elle meurt" sign="squeeze" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= ESC} />
				<div style={{position: 'absolute', left: 72, top: 1200}}>
					<CauseChip at={SACR - 2} icon={<ZoneGlyph size={56} />} label="sacrum (bas du dos)" />
				</div>
				<div style={{position: 'absolute', left: 72, top: 1310}}>
					<CauseChip at={TAL - 2} icon={<ZoneGlyph size={56} />} label="talons" />
				</div>
			</Camera>
			<Sfx name="pop" at={ALL} volume={0.07} />
			<Sfx name="tick" at={LONG} volume={0.08} />
			<Sfx name="whoosh" at={ECR - 10} volume={0.07} />
			<Sfx name="impact" at={MAT} volume={0.09} />
			<Sfx name="buzz" at={SANG} volume={0.04} dur={20} />
			<Sfx name="impact" at={MEURT} volume={0.07} />
			<Sfx name="pop" at={SACR} volume={0.08} />
			<Sfx name="pop" at={TAL} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 4 STADES ═══════════════════════════════ */
const EB: SkinBox = {x: 88, y: 118, w: 760};
const STADES = [
	['rougeur qui ne', 'blanchit pas'],
	['cloque,', 'peau abîmée'],
	['creux jusqu’à', 'la graisse'],
	['muscle,', 'voire l’os'],
];

const StadeRow: React.FC<{show: number; marks: number[]}> = ({show, marks}) => {
	const frame = useCurrentFrame();
	if (frame < show) return null;
	const cur = marks.filter((m) => frame >= m - 2).length - 1;
	return (
		<div style={{position: 'absolute', left: 72, top: 1010, width: 936, display: 'flex', gap: 24}}>
			{STADES.map((lines, i) => {
				const on = i === cur;
				const done = i < cur;
				const lit = frame >= marks[i] - 2;
				return (
					<div
						key={i}
						style={{
							width: 216,
							height: 250,
							borderRadius: 34,
							boxSizing: 'border-box',
							background: on ? LPI.pink : lit ? LPI.paper : alpha(LPI.paper, 0.7),
							border: `6px solid ${on ? N : lit ? LPI.sky : alpha(N, 0.15)}`,
							boxShadow: on ? SHADOW : 'none',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							paddingTop: 18,
							gap: 10,
							transform: `scale(${popAt(frame, show + i * 3) * (on ? 1.05 : 1)})`,
						}}
					>
						<div style={{width: 92, height: 92, borderRadius: 46, background: on ? LPI.paper : done ? LPI.sky : alpha(LPI.sky, 0.5), border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N}}>{i + 1}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 27, lineHeight: 1.15, color: N, textAlign: 'center', opacity: lit ? 1 : 0.35}}>
							{lines[0]}
							<br />
							{lines[1]}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export const Stades: React.FC = () => {
	const frame = useCurrentFrame();
	const CLASSE = at('stades', 'classe');
	const QUAT = at('stades', 'quatre');
	const STAD = at('stades', 'stades');
	const S1 = at('stades', 'Stade 1');
	const ROUG = at('stades', 'rougeur');
	const APP = at('stades', 'appuie');
	const S2 = at('stades', 'Stade 2');
	const CLOQ = at('stades', 'cloque');
	const ABI = at('stades', 'abîmée');
	const S3 = at('stades', 'Stade 3');
	const CREUX = at('stades', 'creux');
	const GRAI = at('stades', 'graisse');
	const S4 = at('stades', 'Stade 4');
	const MUSC = at('stades', 'muscle');
	const OS = at('stades', "l'os");
	const cx = skinPt(EB, SKIN.cx, 0).x;
	const keys: CamKey[] = [
		{at: S1 - 4, s: 1.5, x: cx, y: skinPt(EB, 0, 40).y, dur: 16},
		{at: S3 - 6, s: 1, dur: 18},
	];
	const stage = frame < S2 - 4 ? 1 : frame < S3 - 4 ? 2 : frame < S4 - 4 ? 3 : 4;
	const redness = fadeIn(frame, ROUG - 2, 10) * (stage <= 2 ? 1 : 1 - fadeIn(frame, S3 - 4, 10));
	const press = interpolate(frame, [APP - 8, APP + 2, S2 - 14, S2 - 6], [0, 1, 1, 0], ease);
	const blister = stage === 2 ? interpolate(frame, [CLOQ - 4, CLOQ + 6, ABI - 4, ABI + 6], [0, 1, 1, 0], ease) : 0;
	const shape: WoundShape = stage <= 2 ? 'scrape' : 'crater';
	const depth = stage === 2 ? interpolate(frame, [ABI - 4, ABI + 8], [0, 1], ease) * 0.9 : stage === 3 ? interpolate(frame, [CREUX - 6, GRAI + 6], [1, 3], ease) : stage === 4 ? steps(frame, [MUSC - 4, OS - 4], [4, 4.9], 12, 3) : 0;
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[QUAT + 1, S1 + 1, APP + 1, S2 + 1, S3 + 1, S4 + 1, OS + 1]} shakes={[S4 + 2, OS + 2]}>
				<Head kicker="L'escarre" kAt={CLASSE - 4} title="*4* *stades*" tAt={QUAT - 2} />
				<Stage y={440} h={540} at={CLASSE} bumps={[S1, S2, S3, S4]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<SkinAt b={EB} shape={shape} depth={depth} redness={redness} press={press} blister={blister} />
						<div style={{position: 'absolute', left: EB.x, top: EB.y, fontFamily: FONT.title}}>
							<SkinLabels width={EB.w} labels={5 * fadeIn(frame, S3 + 4, 12)} focus={stage === 3 ? 2 : stage === 4 ? (frame >= OS - 4 ? 4 : 3) : -1} />
						</div>
					</ZoomCam>
					<StagePill from={APP - 2} to={S2 - 4}>
						on appuie : elle reste rouge
					</StagePill>
					<StagePill from={CLOQ - 2} to={ABI - 4} color={LPI.sky}>
						une cloque
					</StagePill>
					<StagePill from={ABI - 2} to={S3 - 4} color={LPI.blue}>
						la peau s'abîme
					</StagePill>
				</Stage>
				<StadeRow show={STAD - 2} marks={[S1, S2, S3, S4]} />
			</Camera>
			<Sfx name="pop" at={STAD} volume={0.08} />
			{[S1, S2, S3, S4].map((s) => (
				<Sfx key={s} name="pop" at={s} volume={0.1} />
			))}
			<Sfx name="tick" at={APP} volume={0.08} />
			<Sfx name="pop" at={CLOQ + 2} volume={0.07} />
			<Sfx name="impact" at={MUSC} volume={0.07} />
			<Sfx name="impact" at={OS} volume={0.09} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ULCÈRE DE JAMBE ═══════════════════════════════ */
const LL = {x: 268, y: 4, w: 380};
const LK = LL.w / 500;
const legPt = (p: keyof typeof LEG_PTS) => ({x: LL.x + LEG_PTS[p][0] * LK, y: LL.y + LEG_PTS[p][1] * LK});

export const Ulcere: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('ulcere', 'deuxième');
	const ULC = at('ulcere', "l'ulcère");
	const SANG = at('ulcere', 'sang');
	const CIRC = at('ulcere', 'circule');
	const PEAU = at('ulcere', 'peau');
	const NOUR = at('ulcere', 'nourrie');
	const PLAIE = at('ulcere', 'plaie', 2);
	const OUVRE = at('ulcere', "s'ouvre");
	const SOUV = at('ulcere', 'souvent');
	const CHEV = at('ulcere', 'cheville');
	const keys: CamKey[] = [
		{at: -1, s: 1.25, x: legPt('calf').x, y: legPt('calf').y + 40, dur: 1},
		{at: SANG - 4, s: 1.5, x: legPt('calf').x + 30, y: legPt('calf').y + 60, dur: 16},
		{at: OUVRE - 6, s: 2, x: legPt('ankle').x, y: legPt('ankle').y - 50, dur: 14},
		{at: CHEV + 20, s: 1.3, x: legPt('ankle').x, y: legPt('ankle').y - 120, dur: 16},
	];
	const dull = fadeIn(frame, NOUR - 4, 14);
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[ULC + 1, CIRC + 1, NOUR + 1, OUVRE + 1, CHEV + 1]} shakes={[OUVRE + 2]}>
				<Head kicker="2e plaie chronique" kAt={DEUX - 4} title="*L’ulcère* de *jambe*" tAt={ULC - 4} size={88} />
				<Stage y={440} h={540} at={DEUX} bumps={[ULC, CIRC, OUVRE]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: LL.x, top: LL.y}}>
							<LowerLeg width={LL.w} veins={fadeIn(frame, SANG - 6, 10)} stasis={fadeIn(frame, CIRC, 16)} ulcer={popAt(frame, OUVRE - 2)} />
						</div>
						{dull > 0 ? (
							<svg width={936} height={540} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<ellipse cx={legPt('ankle').x - 10} cy={legPt('ankle').y - 70} rx={70} ry={90} fill={alpha(N, 0.12 * dull)} />
							</svg>
						) : null}
					</ZoomCam>
					<StagePill from={CIRC - 2} to={PEAU - 2} color={LPI.blue}>
						le sang circule mal
					</StagePill>
					<StagePill from={PEAU - 2} to={PLAIE - 2} color={LPI.sky}>
						la peau est mal nourrie…
					</StagePill>
					<StagePill from={PLAIE - 2} to={SOUV - 2}>
						… une plaie s'ouvre
					</StagePill>
					<StagePill from={SOUV - 2} color={LPI.blue}>
						souvent près de la cheville
					</StagePill>
				</Stage>
				<TermSlam index={0} at={ULC} term="Ulcère de jambe" meaning="le sang circule mal : une plaie s'ouvre" sign="down" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= ULC} />
			</Camera>
			<Sfx name="whoosh" at={SANG - 4} volume={0.05} />
			<Sfx name="buzz" at={CIRC} volume={0.04} dur={18} />
			<Sfx name="impact" at={OUVRE} volume={0.08} />
			<Sfx name="pop" at={CHEV} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PIED DIABÉTIQUE ═══════════════════════════════ */
const PL = {x: 168, y: -250, w: 600};
const PK = PL.w / 500;
const plPt = (p: keyof typeof LEG_PTS) => ({x: PL.x + LEG_PTS[p][0] * PK, y: PL.y + LEG_PTS[p][1] * PK});

export const Pied: React.FC = () => {
	const frame = useCurrentFrame();
	const PIED = at('pied', 'pied');
	const DIAB = at('pied', 'diabétique');
	const DIABETE = at('pied', 'diabète');
	const ABIME = at('pied', 'abîme');
	const NERFS = at('pied', 'nerfs');
	const SENT = at('pied', 'sent');
	const PETITE = at('pied', 'petite');
	const INAP = at('pied', 'inaperçue');
	const AGG = at('pied', "s'aggrave");
	const SIL = at('pied', 'silence');
	const REG = at('pied', 'regarde');
	const JOURS = at('pied', 'jours');
	const sole = plPt('sole');
	const keys: CamKey[] = [
		{at: -1, s: 1.15, x: sole.x - 100, y: sole.y - 200, dur: 1},
		{at: PETITE - 6, s: 1.8, x: sole.x - 20, y: sole.y - 70, dur: 14},
		{at: REG - 6, s: 1, dur: 16},
	];
	return (
		<AbsoluteFill>
			<LiveBackground />
			<Camera punches={[DIAB + 1, NERFS + 1, SENT + 1, PETITE + 1, AGG + 1, REG + 1]} shakes={[AGG + 2]}>
				<Head kicker="3e plaie chronique" kAt={PIED - 6} title="Le pied *diabétique*" tAt={PIED - 2} size={88} />
				<Stage y={440} h={540} at={PIED} bumps={[NERFS, SENT, PETITE, AGG]}>
					<ZoomCam keys={keys} w={936} h={540}>
						<div style={{position: 'absolute', left: PL.x, top: PL.y}}>
							<LowerLeg
								width={PL.w}
								nerve={fadeIn(frame, NERFS - 6, 8)}
								numb={fadeIn(frame, SENT - 2, 6)}
								footSore={popAt(frame, PETITE - 2)}
								grow={interpolate(frame, [AGG - 2, SIL + 14], [0, 1], ease)}
								silent={fadeIn(frame, AGG - 2, 16)}
							/>
						</div>
					</ZoomCam>
					{frame >= DIABETE - 2 ? (
						<div style={{position: 'absolute', left: 740, top: 24, transform: `scale(${popAt(frame, DIABETE - 2)})`}}>
							<DiabetesIcon size={150} />
						</div>
					) : null}
					{frame >= REG - 2 ? (
						<div style={{position: 'absolute', left: 40, top: 30, transform: `scale(${popAt(frame, REG - 2)})`, width: 170, height: 170, borderRadius: 85, background: LPI.paper, border: `6px solid ${LPI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SHADOW}}>
							<EyeIcon size={130} />
						</div>
					) : null}
					<StagePill from={ABIME - 2} to={SENT - 2} color={LPI.blue}>
						le diabète abîme les nerfs
					</StagePill>
					<StagePill from={SENT - 2} to={INAP - 2} color={LPI.sky}>
						plus de douleur
					</StagePill>
					<StagePill from={INAP - 2} to={AGG - 2} color={LPI.sky}>
						la plaie passe inaperçue…
					</StagePill>
					<StagePill from={AGG - 2} to={REG - 2}>
						… et s'aggrave en silence
					</StagePill>
				</Stage>
				<TermSlam index={0} at={DIAB} term="Pied diabétique" meaning="on ne sent plus la douleur : la plaie passe inaperçue" sign="alert" slamY={SLAM_Y} slot={termSlot(0)} active={frame >= DIAB} />
				<Banner at={JOURS - 4} y={1220}>
					Chaque jour : <span style={{color: LPI.blue}}>on regarde ses pieds</span>
				</Banner>
			</Camera>
			<Sfx name="pop" at={DIABETE} volume={0.08} />
			<Sfx name="buzz" at={SENT} volume={0.04} dur={12} />
			<Sfx name="pop" at={PETITE} volume={0.07} />
			<Sfx name="heartbeat" at={AGG} volume={0.06} />
			<Sfx name="ding" at={JOURS - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + SÉRIE TERMINÉE ═══════════════════════════════ */
export const Outro: React.FC = () => {
	const VOILA = at('outro', 'voilà');
	return (
		<AbsoluteFill>
			<RecapScene
				title="Les plaies *chroniques*"
				kAt={at('outro', 'récap') - 4}
				done={at('outro', 'terminée')}
				rows={[
					[at('outro', "l'escarre"), 'squeeze', 'Escarre', 'peau écrasée · 4 stades'],
					[at('outro', "l'ulcère"), 'down', 'Ulcère de jambe', 'le sang circule mal'],
					[at('outro', 'pied'), 'alert', 'Pied diabétique', 'une plaie qu’on ne sent pas'],
				]}
			/>
			<NextUp at={VOILA - 2} part={3} done title="Les plaies · 3 / 3" teaser="les bases · les aiguës · les chroniques" icon={<LayersIcon size={100} />} y={900} />
			<Sfx name="whoosh" at={VOILA - 2} volume={0.07} />
		</AbsoluteFill>
	);
};
