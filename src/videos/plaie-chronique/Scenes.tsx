// « Plaie aiguë ou chronique ? » — série courte « Les plaies » (≈ 37 s, voix Laura).
// Accroche « papi et son petit-fils » (choisie par le propriétaire ; SANS texte au début) : ils jardinent près du rosier
// et s'écorchent la jambe au mot ; les jours défilent jusqu'à J + 42 (tic-tac), la plaie du petit s'efface (✓), celle
// de papi reste et grandit (!, cercle rose). La v1 (« deux plaies, le même jour ») reste dans l'historique git. Puis la plaie aiguë (frise des semaines : le curseur avance, la plaie guérit avant 4 semaines ;
// exemples : coupure, cicatrice d'opération), la plaie chronique (le curseur ralentit, se bloque (cadenas), dépasse
// 4 à 6 semaines), les 3 grands exemples (ulcère de jambe, escarre, pied diabétique), chute : une plaie qui traîne
// n'est jamais normale, la loupe cherche pourquoi (circulation, appui, diabète, infection).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, popAt, Posed} from '../../brand/bold';
import {DayChip, Walker, WeeksBar, WoundTop} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Finger, LowerLeg, Squeeze} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/** Carte blanche, étiquette dessous. */
const Tile: React.FC<{label: string; w?: number; h?: number; hl?: number; children: React.ReactNode}> = ({label, w = 320, h = 420, hl = 0, children}) => (
	<div style={{width: w, height: h, borderRadius: 40, background: LPI.paper, border: `${6 + 4 * hl}px solid ${hl > 0.5 ? LPI.pink : N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, boxSizing: 'border-box', padding: 14}}>
		<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: N, textAlign: 'center', whiteSpace: 'pre-line'}}>{label}</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE : PAPI ET SON PETIT-FILS ═══════════════════════════════ */
const GROUND = 1360;
/** Un personnage (repère 300 × 600) affiché à w px, centré en x, pieds au sol. */
const person = (x: number, w: number) => {
	const s = w / 300;
	const top = GROUND - 590 * s;
	return {left: x - w / 2, top, s, wound: {x: x + 6 * s, y: top + 525 * s}, head: {x: x + 22 * s, y: top + 100 * s}};
};
const PAPI = person(300, 470);
const KID = person(790, 330);

/** Rosier (repère 260 × 300) : feuillage bleuté, roses roses, épines. */
const RoseBush: React.FC<{shake?: number}> = ({shake = 0}) => (
	<svg width={260} height={300} viewBox="0 0 260 300" style={{overflow: 'visible', display: 'block', transform: `rotate(${shake * 4}deg)`, transformOrigin: '130px 300px'}}>
		<path d="M130 300 V170 M130 220 L80 150 M130 200 L190 130" stroke={N} strokeWidth={10} strokeLinecap="round" />
		{[
			[70, 140, 58],
			[180, 120, 60],
			[125, 80, 66],
			[130, 170, 54],
		].map(([x, y, r], i) => (
			<circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? LPI.sky : alpha(LPI.blue, 0.75)} stroke={N} strokeWidth={6} />
		))}
		{[
			[78, 112],
			[176, 98],
			[132, 56],
			[150, 160],
		].map(([x, y], i) => (
			<g key={i} transform={`translate(${x} ${y})`}>
				<circle r={20} fill={LPI.pink} stroke={N} strokeWidth={5} />
				<path d="M-8 0 Q0 -10 8 0 Q0 8 -8 0" fill="none" stroke={N} strokeWidth={3} />
			</g>
		))}
		{[
			[118, 250, -1],
			[142, 236, 1],
			[118, 196, -1],
			[100, 180, -1],
			[164, 166, 1],
		].map(([x, y, d], i) => (
			<path key={i} d={`M${x} ${y} l${d * 16} -6`} stroke={N} strokeWidth={5} strokeLinecap="round" />
		))}
	</svg>
);

/** Pastille ronde (✓ guéri, ! toujours là) qui saute au-dessus d'un personnage. */
const Badge: React.FC<{at: number; x: number; y: number; text: string; tone: string}> = ({at: t0, x, y, text, tone}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * (1 + 0.05 * Math.sin(frame / 4))})`}}>
			<div style={{width: 150, height: 150, borderRadius: 75, background: tone, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: N}}>{text}</div>
		</div>
	);
};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const BLESSENT = at('intro', 'blessent');
	const JAMBE = at('intro', 'jambe,');
	const SIX = at('intro', 'six');
	const TARD = at('intro', 'tard,');
	const GUERI = at('intro', 'guéri');
	const LONGTEMPS = at('intro', 'longtemps…');
	const TOUJOURS = at('intro', 'toujours');
	const day = Math.round(interpolate(frame, [SIX - 4, TARD + 12], [0, 42], clamp));
	const bob = (k: number) => 10 * Math.sin(frame / 7 + k);
	const ouch = fadeIn(frame, BLESSENT, 3) * (1 - fadeIn(frame, JAMBE + 20, 10));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[BLESSENT + 1, SIX + 1, GUERI + 1, TOUJOURS + 1]} shakes={[BLESSENT + 2, TOUJOURS + 2]} strength={0.035}>
				{/* le jardin */}
				<div style={{position: 'absolute', left: -20, right: -20, top: GROUND, height: 600, background: alpha(LPI.sky, 0.55), borderTop: `8px solid ${N}`}} />
				{Array.from({length: 14}, (_, i) => (
					<div key={i} style={{position: 'absolute', left: 30 + i * 76, top: GROUND - 18, width: 8, height: 26, borderRadius: 4, background: LPI.blue, transform: `rotate(${(i % 3) * 12 - 12}deg)`}} />
				))}
				<div style={{position: 'absolute', left: 545 - 130, top: GROUND - 300}}>
					<Live render={(f) => <RoseBush shake={Math.sin(f) * fadeIn(f, BLESSENT - 4, 2) * (1 - fadeIn(f, BLESSENT + 8, 4))} />} />
				</div>
				{/* papi et le petit jardinent… et s'écorchent la jambe sur le rosier */}
				<div style={{position: 'absolute', left: PAPI.left, top: PAPI.top + bob(0)}}>
					<Live render={(f) => <Walker width={470} pose="walk" phase={0.25 * Math.sin(f / 7)} hair="old" shirt={LPI.sky} cry={ouch} legWound={popAt(f, BLESSENT) * (1 + 0.5 * fadeIn(f, SIX, 60))} />} />
				</div>
				<div style={{position: 'absolute', left: KID.left, top: KID.top + bob(2)}}>
					<Live render={(f) => <Walker width={330} pose="walk" phase={0.25 * Math.sin(f / 7 + 2)} hair="kid" shirt={LPI.pink} cry={ouch} legWound={popAt(f, BLESSENT) * (1 - interpolate(f, [SIX, GUERI], [0, 1], clamp))} />} />
				</div>
				<Burst at={BLESSENT} x={PAPI.wound.x} y={PAPI.wound.y} r={170} n={10} />
				<Burst at={BLESSENT} x={KID.wound.x} y={KID.wound.y} r={150} n={10} />
				{/* les semaines passent */}
				<Fly at={SIX - 6} x={540} y={430} from="top">
					<DayChip text={`J + ${day}`} size={230} />
				</Fly>
				<Badge at={GUERI} x={KID.head.x + 110} y={KID.head.y - 120} text="✓" tone={LPI.sky} />
				<Badge at={TOUJOURS} x={PAPI.head.x - 120} y={PAPI.head.y - 130} text="!" tone={LPI.pink} />
				<Live
					render={(f) =>
						f >= LONGTEMPS ? (
							<div style={{position: 'absolute', left: PAPI.wound.x - 70, top: PAPI.wound.y - 70, width: 140, height: 140, borderRadius: 70, border: `9px solid ${LPI.pink}`, transform: `scale(${popAt(f, LONGTEMPS) * (1 + 0.06 * Math.sin(f / 4))})`}} />
						) : null
					}
				/>
			</Camera>
			<Flash at={TOUJOURS} max={0.25} />
			<Sfx name="impact" at={BLESSENT} volume={0.1} />
			<Sfx name="pop" at={BLESSENT + 2} volume={0.07} />
			{Array.from({length: 9}, (_, i) => (
				<Sfx key={i} name="tick" at={SIX - 2 + i * 4} volume={0.07} />
			))}
			<Sfx name="ding" at={GUERI} volume={0.08} />
			<Sfx name="buzz" at={TOUJOURS} volume={0.06} dur={12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE AIGUË ═══════════════════════════════ */
export const Aigue: React.FC = () => {
	const AIGUE = at('aigue', 'aiguë');
	const GUERIT = at('aigue', 'guérit');
	const MOINS = at('aigue', 'moins');
	const QUATRE = at('aigue', 'quatre');
	const SEMAINES = at('aigue', 'semaines.');
	const COMME = at('aigue', 'comme');
	const COUPURE = at('aigue', 'coupure,');
	const CICAT = at('aigue', 'cicatrice');
	const OPERATION = at('aigue', 'opération.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[AIGUE + 1, GUERIT + 1, QUATRE + 1, COUPURE + 1, OPERATION + 1]} strength={0.03}>
				<Big from={-2} to={COMME - 6} text={'Plaie *aiguë*'} size={140} />
				<Big from={COMME - 4} text={'Par *exemple*…'} size={140} />
				<Fly at={-4} x={540} y={520} from="right">
					<Live render={(f) => <WeeksBar pos={interpolate(f, [GUERIT - 4, SEMAINES + 8], [0, 3.3], ease)} zone={[0, 4, alpha(LPI.blue, 0.45)]} />} />
				</Fly>
				<Fly at={-4} out={COMME - 6} x={540} y={930} from="bottom" to="bottom">
					<Live render={(f) => <WoundTop width={780} kind="clean" heal={interpolate(f, [MOINS - 10, SEMAINES + 10], [0, 1], ease)} />} />
				</Fly>
				<Note at={QUATRE} to={COMME - 6} y={1250} size={50}>
					guérie en moins de 4 semaines
				</Note>
				<Fly at={COUPURE - 6} x={290} y={1010} from="left">
					<Tile label="une coupure" w={460} h={440}>
						<Live render={(f) => <Finger width={380} cut={1} heal={interpolate(f, [COUPURE + 6, CICAT], [0, 0.8], ease)} />} />
					</Tile>
				</Fly>
				<Fly at={CICAT - 6} x={790} y={1010} from="right">
					<Tile label="après une opération" w={460} h={440}>
						<WoundTop width={380} kind="clean" open={0.35} sutures={1} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={GUERIT - 4} volume={0.07} />
			<Sfx name="ding" at={SEMAINES + 6} volume={0.08} />
			<Sfx name="whoosh" at={COUPURE - 6} volume={0.07} />
			<Sfx name="whoosh" at={CICAT - 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE CHRONIQUE ═══════════════════════════════ */
export const Chronique: React.FC = () => {
	const CHRONIQUE = at('chronique', 'chronique');
	const CICAT = at('chronique', 'cicatrisation');
	const RALENTIE = at('chronique', 'ralentie,');
	const BLOQUEE = at('chronique', 'bloquée,');
	const SOUVENT = at('chronique', 'souvent');
	const AUDELA = at('chronique', 'au-delà');
	const QUATRE = at('chronique', 'quatre');
	const SIX = at('chronique', 'six');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.55)}} />
			<Camera punches={[CHRONIQUE + 1, RALENTIE + 1, BLOQUEE + 1, QUATRE + 1, SIX + 1]} shakes={[BLOQUEE + 2]} strength={0.03}>
				<Big from={-2} to={RALENTIE - 6} text={'Plaie\n*chronique*'} size={132} />
				<Big from={RALENTIE - 4} to={SOUVENT - 6} text={'Ralentie…\nou *bloquée*'} size={132} />
				<Big from={SOUVENT - 4} text={'Au-delà de\n*4* à *6* semaines'} size={116} />
				<Fly at={-4} x={540} y={600} from="left">
					<Live
						render={(f) => (
							<WeeksBar
								pos={interpolate(f, [CICAT - 4, RALENTIE - 4, RALENTIE + 16, BLOQUEE, AUDELA, SIX + 12], [0, 2.4, 3.1, 3.4, 3.4, 7], ease)}
								zone={[4, 8, alpha(LPI.pink, 0.8)]}
								lock={fadeIn(f, BLOQUEE - 2, 6) * (1 - fadeIn(f, AUDELA, 6))}
							/>
						)}
					/>
				</Fly>
				<Fly at={-4} x={540} y={1010} from="bottom">
					<Live render={(f) => <WoundTop width={780} kind="ragged" bruise={0.5} necrosis={0.3 + 0.4 * fadeIn(f, SOUVENT, 30)} />} />
				</Fly>
				<Stamp at={BLOQUEE} x={540} y={1320} text="BLOQUÉE" size={90} rot={-6} out={SOUVENT - 6} />
				<Note at={SIX + 6} y={1320} size={48}>
					elle traîne, encore et encore
				</Note>
			</Camera>
			<Sfx name="pop" at={CICAT - 4} volume={0.07} />
			<Sfx name="buzz" at={BLOQUEE} volume={0.06} dur={12} />
			<Sfx name="stamp" at={BLOQUEE} volume={0.1} />
			<Sfx name="tick" at={QUATRE} volume={0.08} />
			<Sfx name="tick" at={SIX} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 3 GRANDS EXEMPLES ═══════════════════════════════ */
export const Exemples: React.FC = () => {
	const EXEMPLES = at('exemples', 'exemples');
	const ULCERE = at('exemples', "l'ulcère");
	const ESCARRE = at('exemples', "l'escarre…");
	const PIED = at('exemples', 'pied');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[EXEMPLES + 1, ULCERE + 1, ESCARRE + 1, PIED + 1]} strength={0.035}>
				<Big from={-2} text={'*3* grands\nexemples'} size={132} />
				<Fly at={ULCERE - 4} x={200} y={880} from="bottom">
					<Tile label={'ulcère\nde jambe'} w={320} h={480}>
						<LowerLeg width={200} ulcer={1} veins={1} />
					</Tile>
				</Fly>
				<Fly at={ESCARRE - 4} x={540} y={880} from="bottom">
					<Tile label="escarre" w={320} h={480}>
						<Live render={(f) => <Squeeze width={280} press={1} dead={fadeIn(f, ESCARRE, 12)} />} />
					</Tile>
				</Fly>
				<Fly at={PIED - 4} x={880} y={880} from="bottom">
					<Tile label={'pied\ndiabétique'} w={320} h={480}>
						<LowerLeg width={200} footSore={1} grow={0.6} silent={0.6} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={ULCERE - 4} volume={0.08} />
			<Sfx name="pop" at={ESCARRE - 4} volume={0.08} />
			<Sfx name="pop" at={PIED - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CHERCHE POURQUOI ═══════════════════════════════ */
const WHY = ['circulation ?', 'appui ?', 'diabète ?', 'infection ?'];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const TRAINE = at('fin', 'traîne,');
	const NORMAL = at('fin', 'normal');
	const CHERCHE = at('fin', 'cherche');
	const POURQUOI = at('fin', 'pourquoi');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[TRAINE + 1, NORMAL + 1, CHERCHE + 1, POURQUOI + 1]} shakes={[NORMAL + 2]} strength={0.035}>
				<Big from={-2} to={CHERCHE - 6} text={'Une plaie\nqui *traîne*…'} size={128} {...ON_BLUE} />
				<Big from={CHERCHE - 4} text={'On cherche\n*pourquoi* !'} size={128} {...ON_BLUE} />
				<Fly at={-4} x={540} y={900} from="bottom">
					<WoundTop width={760} kind="ragged" bruise={0.5} necrosis={0.6} />
				</Fly>
				<Stamp at={NORMAL} x={540} y={1240} text="PAS NORMAL !" size={86} rot={-6} out={CHERCHE - 4} />
				{/* la loupe cherche la cause */}
				<Blur on={frame >= CHERCHE - 4 && frame <= POURQUOI + 40}>
					<Posed
						pose={(f) => {
							if (f < CHERCHE - 4) return null;
							const t = (f - (CHERCHE - 4)) / 14;
							return {x: 540 + 220 * Math.cos(t), y: 900 + 90 * Math.sin(t * 1.3), s: popAt(f, CHERCHE - 4)};
						}}
					>
						<svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
							<circle r={90} fill={alpha(LPI.paper, 0.3)} stroke={N} strokeWidth={16} />
							<circle r={74} fill="none" stroke={LPI.sky} strokeWidth={6} />
							<path d="M64 64 L130 130" stroke={N} strokeWidth={30} strokeLinecap="round" />
							<path d="M70 70 L126 126" stroke={LPI.pink} strokeWidth={14} strokeLinecap="round" />
						</svg>
					</Posed>
				</Blur>
				{WHY.map((w, i) => {
					const t0 = CHERCHE + 4 + i * 7;
					const pos = [
						[230, 1250],
						[760, 1250],
						[250, 1370],
						[770, 1370],
					][i];
					return frame >= t0 ? (
						<div key={w} style={{position: 'absolute', left: pos[0], top: pos[1], transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '10px 26px', borderRadius: 999, background: i % 2 ? LPI.pink : LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>
							{w}
						</div>
					) : null;
				})}
			</Camera>
			<Flash at={NORMAL} max={0.25} color={LPI.paper} />
			<Sfx name="stamp" at={NORMAL} volume={0.12} />
			<Sfx name="whoosh" at={CHERCHE - 4} volume={0.07} />
			{WHY.map((w, i) => (
				<Sfx key={w} name="pop" at={CHERCHE + 4 + i * 7} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};
