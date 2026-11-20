// « Le tube de purge » (n° 65, série « les tubes », directives Instagram du 20/11/2026) : le sujet et l'enjeu dès
// l'image 0 (« Le tube de purge », le tube blanc, « bilan faux ? »), ≈ 53 s, info clé avant 15 s. Pourquoi : avec une
// aiguille à ailettes, la tubulure est pleine d'air, le 1er tube aspire cet air et le tube bleu (coagulation) n'arrive
// pas au trait → résultat faux. La purge aspire l'air, puis le bleu se remplit jusqu'au trait. Quand : 3 conditions
// (compteur 0/3). Fin : pas besoin de le remplir, jamais analysé, jeté en DASRI ; « Enregistre-la pour tes partiels ».
// Sources : CLSI GP41 (7e éd., 2017) et H21-A5 (2008) — tube de purge avec unité à ailettes quand le citrate est le
// 1er tube ; ordre de remplissage (hémocultures en 1er) : recommandations SFBC / CLSI GP41.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, RowCard} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {DasriBag} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, HEMO_CAP, HemoFlask, Tube, WingedLine} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const WHITE = CAP.purge;
const BLUE = CAP.citrate;

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<FlatBg tone={tone} light={0.24} />
	</>
);

const Pop: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode}> = ({at: t0, to = 1e9, x, y, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0 || frame > to + 8) return null;
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * interpolate(frame, [to, to + 7], [1, 0], clamp)})`}}>{children}</div>;
};

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 40}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

/** Pastille « LES TUBES · purge » en haut : repère de série, visible dès l'image 0. */
const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N}}>
		<div style={{width: 26, height: 26, borderRadius: 8, background: WHITE, border: `4px solid ${N}`}} />
		LES TUBES · LA PURGE
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const BLANC = at('intro', 'blanc');
	const REMPLIT = at('intro', 'remplit');
	const JETTE = at('intro', 'jette');
	const POURTANT = at('intro', 'pourtant');
	const COAG = at('intro', 'coagulation');
	const FAUX = at('intro', 'faux');
	const drop = interpolate(frame, [JETTE - 2, JETTE + 14], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<SeriesPill />
			<Camera punches={[BLANC + 1, JETTE + 1, COAG + 1, FAUX + 1]} shakes={[FAUX + 3]} strength={0.03}>
				<Big from={-12} text={'Le tube\nde *purge*'} size={130} y={190} />
				{/* le tube blanc : il se remplit puis part à la poubelle */}
				<Live
					render={(f) => {
						const lvl = interpolate(f, [REMPLIT - 4, REMPLIT + 18], [0, 0.45], ease);
						const x = 540 + drop * 230;
						const y = 980 + drop * 260;
						const rot = Math.sin(f / 8) * 3 + drop * 120;
						const s = 1 - drop * 0.55;
						return (
							<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: f > JETTE + 16 ? 0 : 1}}>
								<Tube size={160} cap={WHITE} level={lvl} />
							</div>
						);
					}}
				/>
				<Chip at={BLANC - 2} to={JETTE - 4} x={800} y={760} size={38}>
					bouchon blanc
				</Chip>
				<Pop at={JETTE - 8} x={790} y={1260}>
					<DasriBag size={260} fill={0.4} />
				</Pop>
				<Stamp at={JETTE + 4} x={300} y={1150} text="JETÉ ?!" size={80} />
				<Note at={-10} to={COAG - 6} y={1430} size={40} tone={LPI.pink}>
					on le jette… et sans lui, bilan faux ?
				</Note>
				<Chip at={COAG - 2} x={540} y={1420} tone={LPI.sky} size={44}>
					bilan de coagulation
				</Chip>
				<Stamp at={FAUX} x={330} y={1250} text="FAUX !" size={90} />
			</Camera>
			<Sfx name="pop" at={BLANC} volume={0.15} />
			<Sfx name="whoosh" at={JETTE - 2} volume={0.2} />
			<Sfx name="stamp" at={JETTE + 4} volume={0.35} />
			<Sfx name="stamp" at={FAUX} volume={0.45} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI : L'AIR DU TUYAU ═══════════════════════════════ */
export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const AIL = at('pourquoi', 'ailettes');
	const TUYAU = at('pourquoi', 'tuyau');
	const AIR = at('pourquoi', "d'air");
	const PREM = at('pourquoi', 'premier');
	const ASP = at('pourquoi', 'aspire');
	const MAL = at('pourquoi', 'mal');
	const BLEU = at('pourquoi', 'bleu');
	const TRAIT = at('pourquoi', 'trait');
	const FAUX = at('pourquoi', 'faux');
	const blood = interpolate(frame, [ASP, MAL + 6], [0, 1], ease);
	const level = interpolate(frame, [ASP + 20, MAL + 18], [0, 0.5], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Camera punches={[AIL + 1, AIR + 1, MAL + 1, TRAIT + 1, FAUX + 1]} strength={0.03}>
				<Big from={-2} text={"L'aiguille\nà *ailettes*"} size={110} y={190} />
				<Pop at={AIL - 4} x={540} y={860}>
					<Live render={(f) => <WingedLine width={940} blood={blood} bubbles={f >= AIR - 4 ? 1 : 0} tubeCap={BLUE} tubeIn={interpolate(f, [PREM - 4, PREM + 10], [0, 1], ease)} tubeLevel={level} tubeMark={f >= TRAIT - 2 ? 1 : 0} tubeBad={f >= MAL ? popAt(f, MAL) : 0} />} />
				</Pop>
				<PTag at={TUYAU} to={PREM - 4} x={540} y={1210} px={560} py={1070}>
					un long tuyau
				</PTag>
				<Chip at={AIR - 2} to={PREM - 4} x={540} y={600} tone={LPI.sky} size={42}>
					plein d'air
				</Chip>
				<Chip at={ASP} to={BLEU - 4} x={540} y={600} size={38}>
					le 1er tube aspire l'air
				</Chip>
				<Pop at={PREM} x={200} y={1330}>
					<Live render={(f) => <Tube size={110} cap={BLUE} level={level} mark={f >= TRAIT - 2 ? 1 : 0} bad={f >= MAL ? 1 : 0} />} />
				</Pop>
				<Chip at={MAL} to={BLEU - 4} x={640} y={1260} tone={LPI.pink} size={42}>
					il se remplit mal
				</Chip>
				<Chip at={BLEU - 2} x={540} y={600} tone={LPI.blue} size={40}>
					tube bleu = coagulation
				</Chip>
				<Note at={TRAIT - 2} y={1230} x={650} size={32} tone={LPI.paper}>
					jusqu'au trait, sinon…
				</Note>
				<Stamp at={FAUX} x={650} y={1420} text="RÉSULTAT FAUX" size={60} />
			</Camera>
			<Sfx name="pop" at={AIL} volume={0.15} />
			<Sfx name="whoosh" at={ASP} volume={0.15} />
			<Sfx name="buzz" at={MAL} volume={0.2} />
			<Sfx name="stamp" at={FAUX} volume={0.4} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA PURGE ═══════════════════════════════ */
export const Purge: React.FC = () => {
	const frame = useCurrentFrame();
	const TUBE = at('purge', 'tube');
	const ASP = at('purge', 'aspire');
	const BOUT = at('purge', 'bout');
	const ENS = at('purge', 'ensuite');
	const BLEU = at('purge', 'bleu');
	const REMP = at('purge', 'remplit');
	const TRAIT = at('purge', 'trait');
	const blue = frame >= BLEU - 6;
	const blood = interpolate(frame, [ASP, BOUT + 4], [0, 1], ease);
	const tubeIn = blue ? interpolate(frame, [BLEU - 6, BLEU + 8], [0, 1], ease) : interpolate(frame, [TUBE - 4, TUBE + 10, ENS, ENS + 12], [0, 1, 1, 0], ease);
	const level = blue ? interpolate(frame, [REMP - 4, TRAIT + 2], [0, 0.82], ease) : interpolate(frame, [BOUT - 6, BOUT + 12], [0, 0.18], ease);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Camera punches={[TUBE + 1, BOUT + 1, BLEU + 1, TRAIT + 1]} strength={0.03}>
				<Big from={-2} text={'La *solution*'} size={120} y={190} />
				<Pop at={2} x={540} y={860}>
					<Live render={(f) => <WingedLine width={940} blood={blood} bubbles={f < BOUT ? 1 : 0} tubeCap={blue ? BLUE : WHITE} tubeIn={tubeIn} tubeLevel={level} tubeMark={blue ? 1 : 0} />} />
				</Pop>
				<Chip at={TUBE - 2} to={ENS - 4} x={540} y={600} tone={LPI.paper} size={44}>
					1 · le tube de purge
				</Chip>
				<Pop at={TUBE} x={200} y={1330}>
					<Live render={(f) => <Tube size={110} cap={f >= BLEU - 6 ? BLUE : WHITE} level={level} mark={f >= BLEU - 6 ? 1 : 0} />} />
				</Pop>
				<Note at={ASP} to={ENS - 4} y={1250} x={640} size={36}>
					il aspire l'air du tuyau
				</Note>
				<PTag at={BOUT - 2} to={ENS - 4} x={560} y={1120} px={560} py={1060}>
					le sang arrive au bout
				</PTag>
				<Chip at={BLEU - 4} x={540} y={600} tone={LPI.blue} size={44}>
					2 · le tube bleu
				</Chip>
				<Note at={TRAIT - 2} y={1250} x={640} size={44} tone={LPI.paper}>
					jusqu'au trait ✓
				</Note>
			</Camera>
			<Sfx name="pop" at={TUBE} volume={0.15} />
			<Sfx name="whoosh" at={ASP} volume={0.15} />
			<Sfx name="whoosh" at={ENS} volume={0.15} />
			<Sfx name="ding" at={TRAIT} volume={0.25} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ QUAND ? 3 CONDITIONS ═══════════════════════════════ */
export const Quand: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('quand', 'trois');
	const AIL = at('quand', 'ailettes');
	const PREM = at('quand', 'premier');
	const HEMO = at('quand', "d'hemocultures");
	const HEMO2 = at('quand', 'hemocultures');
	const FLAC = at('quand', 'flacons');
	const SIMPLE = at('quand', 'simple');
	const n = frame >= HEMO + 10 ? 3 : frame >= PREM + 10 ? 2 : frame >= AIL + 10 ? 1 : 0;
	const rows = [
		{t: AIL, title: 'Aiguille à ailettes'},
		{t: PREM, title: 'Tube bleu en 1er'},
		{t: HEMO, title: "Pas d'hémocultures"},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Camera punches={[TROIS + 1, AIL + 1, PREM + 1, HEMO + 1, FLAC + 1, SIMPLE + 1]} strength={0.03}>
				<Big from={-2} text={'Purge *si*…'} size={120} y={190} />
				<Pop at={TROIS - 2} x={880} y={250}>
					<div style={{padding: '10px 26px', borderRadius: 30, background: n === 3 ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: n === 3 ? LPI.paper : N, fontVariantNumeric: 'tabular-nums'}}>{n} / 3</div>
				</Pop>
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 2} y={400 + i * 170} h={140} badge={String(i + 1)} title={r.title} check={r.t + 10} size={46} />
				))}
				{/* exceptions */}
				<Pop at={HEMO2 - 2} x={250} y={1110}>
					<div style={{display: 'flex', gap: 14, alignItems: 'flex-end'}}>
						<HemoFlask size={110} label="" cap={HEMO_CAP.aero} />
						<HemoFlask size={110} label="" cap={HEMO_CAP.anaero} />
					</div>
				</Pop>
				<Note at={FLAC} y={1110} x={690} size={34}>
					les flacons purgent le tuyau
				</Note>
				<Chip at={SIMPLE - 2} x={540} y={1330} tone={LPI.sky} size={40}>
					aiguille simple : pas de purge
				</Chip>
			</Camera>
			<Sfx name="pop" at={AIL} volume={0.15} />
			<Sfx name="pop" at={PREM} volume={0.15} />
			<Sfx name="pop" at={HEMO} volume={0.15} />
			<Sfx name="ding" at={HEMO + 10} volume={0.2} />
			<Sfx name="pop" at={FLAC} volume={0.12} />
			<Sfx name="pop" at={SIMPLE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const REMP = at('fin', 'remplir');
	const ANAL = at('fin', 'analyse');
	const JETTE = at('fin', 'jette');
	const DECH = at('fin', 'dechets');
	const ENR = at('fin', 'enregistrela');
	const drop = interpolate(frame, [JETTE - 2, JETTE + 16], [0, 1], ease);
	const out = ENR - 6;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Camera punches={[REMP + 1, ANAL + 1, JETTE + 1, ENR + 1]} strength={0.03}>
				<Big from={-2} to={out} text={'Et *après* ?'} size={120} y={190} />
				<Live
					render={(f) => {
						if (f > JETTE + 18) return null;
						return (
							<div style={{position: 'absolute', left: 300 + drop * 240, top: 760 + drop * 420, transform: `translate(-50%, -50%) rotate(${drop * 110}deg) scale(${1 - drop * 0.5})`}}>
								<Tube size={180} cap={WHITE} level={0.2} />
							</div>
						);
					}}
				/>
				<Chip at={REMP - 2} to={out} x={700} y={620} size={38}>
					pas besoin de le remplir
				</Chip>
				<Chip at={ANAL - 2} to={out} x={700} y={760} tone={LPI.pink} size={38}>
					jamais analysé
				</Chip>
				<Pop at={JETTE - 8} to={out} x={560} y={1200}>
					<DasriBag size={280} fill={interpolate(frame, [JETTE + 10, JETTE + 20], [0.3, 0.5], clamp)} />
				</Pop>
				<Note at={DECH} to={out} y={1400} size={34}>
					déchets à risque infectieux (DASRI)
				</Note>
				{/* appel à l'action */}
				<Big from={ENR - 2} text={'Enregistre-la\npour tes *partiels* !'} size={100} y={560} />
				<Fly at={ENR} x={540} y={1050} from="bottom" to="bottom">
					<div style={{display: 'flex', gap: 30, alignItems: 'flex-end'}}>
						<Tube size={130} cap={WHITE} level={0.2} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N, marginBottom: 120}}>→</div>
						<Tube size={130} cap={BLUE} level={0.82} mark={1} />
					</div>
				</Fly>
			</Camera>
			<Confetti at={ENR + 4} />
			<Sfx name="pop" at={REMP} volume={0.15} />
			<Sfx name="pop" at={ANAL} volume={0.15} />
			<Sfx name="whoosh" at={JETTE - 2} volume={0.2} />
			<Sfx name="ding" at={ENR} volume={0.25} />
		</AbsoluteFill>
	);
};
