// Scènes de « Brûlure du 1er degré ». Accroche sans texte, réaliste : la plage vue de dessus, le dos rougit au fil de la
// journée, le soir un doigt touche l'épaule et ça fait mal. Puis la couche touchée (l'épiderme), l'aspect (rouge, sèche,
// douloureuse, sans cloque, comme un coup de soleil), l'évolution (3 à 5 jours, sans trace), chute.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Note, PointTag, popAt} from '../../brand/bold';
import {BeachTop, BurnPatch, CUT_Y, CutView, SkinClose, skinClosePt} from '../../brand/burnstage';
import {DayChip} from '../../brand/injury';
import {Burst} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/** Pastille qui claque (✓ ou ✕). */
export const Chip: React.FC<{at: number; x: number; y: number; ok?: boolean; children: React.ReactNode}> = ({at: t0, x, y, ok = true, children}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '14px 30px', borderRadius: 999, background: ok ? LPI.sky : LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: N, whiteSpace: 'nowrap'}}>
			{children} {ok ? '✓' : '✕'}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE : LA PLAGE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAGE = at('intro', 'plage…');
	const SOIR = at('intro', 'soir,');
	const ROUGES = at('intro', 'rouges,');
	const CONTACT = at('intro', 'contact');
	const MAL = at('intro', 'mal.');
	const red = interpolate(frame, [PLAGE, SOIR, ROUGES + 10], [0.05, 0.45, 1], clamp);
	const eve = lin(frame, SOIR - 6, SOIR + 16);
	const touch = interpolate(frame, [CONTACT - 6, CONTACT + 26], [0, 1], clamp);
	const zoom = 1 + 0.35 * lin(frame, SOIR, ROUGES + 20);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '540px 720px'}}>
				<BeachTop red={red} eve={eve} touch={touch} />
				{frame >= MAL - 6 && frame < MAL + 24 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
						{[0, 1, 2, 3].map((i) => {
							const a = -1.6 + i * 0.5;
							const k = (frame - MAL + 6) / 30;
							return <line key={i} x1={690 + Math.cos(a) * (60 + k * 40)} y1={700 + Math.sin(a) * (60 + k * 40)} x2={690 + Math.cos(a) * (110 + k * 60)} y2={700 + Math.sin(a) * (110 + k * 60)} stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" opacity={1 - k} />;
						})}
					</svg>
				) : null}
			</AbsoluteFill>
			<Sfx name="tap" at={CONTACT + 4} volume={0.06} />
			<Sfx name="stamp" at={MAL - 2} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA COUCHE TOUCHÉE : L'ÉPIDERME ═══════════════════════════════ */
export const Couche: React.FC = () => {
	const frame = useCurrentFrame();
	const PREMIER = at('couche', 'premier');
	const EPIDERME = at('couche', "l'épiderme");
	const SURFACE = at('couche', 'surface');
	return (
		<AbsoluteFill>
			<Bg />
			<Big from={PREMIER - 6} text={'*1er* degré'} size={120} y={190} center />
			<CutView y0={CUT_Y.top} y1={CUT_Y.epi} k={lin(frame, EPIDERME - 4, EPIDERME + 10)} labels={3 * fadeIn(frame, EPIDERME - 8, 12)} focus={0} />
			{frame >= SURFACE - 4 ? (
				<Note at={SURFACE - 4} y={1400} size={50} tone={LPI.pink}>
					seulement la surface
				</Note>
			) : null}
			<Sfx name="whoosh" at={PREMIER - 6} volume={0.05} />
			<Sfx name="pop" at={EPIDERME} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ASPECT : ROUGE, SÈCHE, DOULOUREUSE, SANS CLOQUE ═══════════════════════════════ */
export const Aspect: React.FC = () => {
	const frame = useCurrentFrame();
	const ROUGE = at('aspect', 'rouge,');
	const SECHE = at('aspect', 'sèche');
	const DOULOUREUSE = at('aspect', 'douloureuse…');
	const CLOQUE = at('aspect', 'cloque.');
	const SOLEIL = at('aspect', 'soleil.');
	const c = skinClosePt(500, 500);
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={1} k={lin(frame, 0, ROUGE + 6)} />
			</SkinClose>
			<PointTag at={ROUGE - 2} x={260} y={520} px={c.x - 120} py={c.y - 120} size={48} tone={LPI.paper}>
				rouge
			</PointTag>
			<PointTag at={SECHE - 2} x={820} y={620} px={c.x + 120} py={c.y - 60} size={48} tone={LPI.paper}>
				sèche
			</PointTag>
			<PointTag at={DOULOUREUSE - 2} x={300} y={1500} px={c.x - 60} py={c.y + 120} size={48} tone={LPI.paper}>
				douloureuse
			</PointTag>
			<Chip at={CLOQUE - 4} x={760} y={1420} ok={false}>
				cloque
			</Chip>
			<Big from={SOLEIL - 14} text={'Comme un *coup* de *soleil*'} size={92} y={170} center />
			{[ROUGE - 2, SECHE - 2, DOULOUREUSE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="stamp" at={CLOQUE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ÉVOLUTION : 3 À 5 JOURS, SANS TRACE ═══════════════════════════════ */
export const Evolution: React.FC = () => {
	const frame = useCurrentFrame();
	const CICATRISE = at('evolution', 'cicatrise');
	const TROIS = at('evolution', 'trois');
	const JOURS = at('evolution', 'jours,');
	const TRACE = at('evolution', 'trace.');
	const heal = lin(frame, CICATRISE, TRACE + 10);
	const day = Math.max(1, Math.round(interpolate(frame, [TROIS - 6, JOURS + 16], [1, 5], clamp)));
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={1} heal={heal} />
			</SkinClose>
			<Big from={0} text={'Toute *seule*'} size={110} y={170} center />
			{frame >= TROIS - 6 ? (
				<div style={{position: 'absolute', left: 540 - 110, top: 1360, transform: `scale(${popAt(frame, TROIS - 6)})`}}>
					<DayChip text={`J+${day}`} size={220} />
				</div>
			) : null}
			<Chip at={TRACE - 2} x={540} y={1690}>
				sans trace
			</Chip>
			<Sfx name="tick" at={TROIS} volume={0.08} />
			<Sfx name="ding" at={TRACE} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const ROUGE = at('fin', 'rouge,');
	const MAL = at('fin', 'mal…');
	const CLOQUE = at('fin', 'cloque !');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} text={'*1er* degré'} size={130} y={260} center />
			<Chip at={ROUGE - 4} x={540} y={720}>
				rouge
			</Chip>
			<Chip at={MAL - 4} x={540} y={900}>
				ça fait mal
			</Chip>
			<Chip at={CLOQUE - 4} x={540} y={1080} ok={false}>
				pas de cloque
			</Chip>
			<Burst at={CLOQUE + 4} x={540} y={1080} r={260} n={12} />
			{[ROUGE - 4, MAL - 4].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.08} />
			))}
			<Sfx name="ding" at={CLOQUE} volume={0.08} />
		</AbsoluteFill>
	);
};
