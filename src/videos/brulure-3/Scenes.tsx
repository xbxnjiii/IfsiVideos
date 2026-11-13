// Scènes de « Brûlure du 3e degré ». Accroche sans texte, réaliste : un barbecue rallumé à l'alcool, retour de flamme
// sur le bras. Puis la couche (toute la peau détruite, parfois jusqu'à la graisse, les muscles, les os), l'aspect
// (cartonnée, sèche, blanche / brune / noire, sans cloque), le piège (indolore, douleur autour), la gravité (urgence, le
// 15, greffe), chute (jamais d'alcool).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, Flash, PointTag, popAt} from '../../brand/bold';
import {Barbecue, BurnPatch, CUT_Y, CutView, SkinClose, skinClosePt} from '../../brand/burnstage';
import {Phone} from '../../brand/devices';
import {Stamp} from '../../brand/kit';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Chip} from '../brulure-1/Scenes';
import {at} from './timeline';

const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Bg: React.FC<{tone?: string}> = ({tone = LPI.sky}) => (
	<>
		<AbsoluteFill style={{background: LPI.paper}} />
		<AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, ${alpha(tone, 0.25)} 0%, ${alpha(tone, 0.75)} 75%)`}} />
	</>
);

/* ═══════════════════════════════ ACCROCHE : LE BARBECUE ET L'ALCOOL ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const VERSE = at('intro', 'verse');
	const FLAMME = at('intro', 'flamme');
	const BRAS = at('intro', 'bras.');
	const pour = lin(frame, VERSE - 8, VERSE + 14) * (1 - lin(frame, FLAMME - 2, FLAMME + 6));
	const fire = interpolate(frame, [FLAMME - 4, BRAS + 30], [0, 1], clamp);
	const back = lin(frame, FLAMME + 2, FLAMME + 14);
	const shake = frame >= FLAMME && frame < FLAMME + 16 ? Math.sin((frame - FLAMME) * 2.3) * 16 * (1 - (frame - FLAMME) / 16) : 0;
	return (
		<AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
			<Barbecue pour={pour} fire={fire} back={back} />
			<Flash at={FLAMME} max={0.4} />
			<Sfx name="smoke" at={VERSE} volume={0.1} />
			<Sfx name="lighter" at={FLAMME - 4} volume={0.12} />
			<Sfx name="blow" at={FLAMME} volume={0.35} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA COUCHE : TOUTE LA PEAU DÉTRUITE ═══════════════════════════════ */
export const Couche: React.FC = () => {
	const frame = useCurrentFrame();
	const TROISIEME = at('couche', 'troisième');
	const TOUTE = at('couche', 'toute');
	const DERME = at('couche', 'derme.');
	const GRAISSE = at('couche', 'graisse');
	const MUSCLES = at('couche', 'muscles,');
	const OS = at('couche', 'os.');
	// la zone détruite descend : épiderme + derme, puis graisse, muscles, os (en pointillés : « peut même »)
	const y1 = interpolate(frame, [TOUTE - 4, DERME + 8, GRAISSE, GRAISSE + 12, MUSCLES, MUSCLES + 12, OS, OS + 12], [CUT_Y.top, CUT_Y.derm, CUT_Y.derm, CUT_Y.hypo, CUT_Y.hypo, CUT_Y.musc, CUT_Y.musc, CUT_Y.bone - 10], clamp);
	const focus = frame >= OS - 2 ? 4 : frame >= MUSCLES - 2 ? 3 : frame >= GRAISSE - 2 ? 2 : 1;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={TROISIEME - 6} text={'*3e* degré'} size={120} y={190} center />
			<CutView y0={CUT_Y.top} y1={y1} k={1} destroyed labels={5 * fadeIn(frame, TOUTE - 6, 14)} focus={focus} nerves={1} nervesBurnt={fadeIn(frame, DERME, 10)} />
			<Chip at={DERME - 2} x={540} y={1360} ok={false}>
				toute la peau détruite
			</Chip>
			<Sfx name="whoosh" at={TROISIEME - 6} volume={0.05} />
			{[DERME, GRAISSE, MUSCLES, OS].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ASPECT : CARTONNÉE, SÈCHE, BLANCHE / BRUNE / NOIRE, SANS CLOQUE ═══════════════════════════════ */
export const Aspect: React.FC = () => {
	const frame = useCurrentFrame();
	const CARTONNEE = at('aspect', 'cartonnée,');
	const SECHE = at('aspect', 'sèche,');
	const BLANCHE = at('aspect', 'blanche,');
	const BRUNE = at('aspect', 'brune');
	const NOIRE = at('aspect', 'noire,');
	const CLOQUE = at('aspect', 'cloque.');
	const p = (x: number, y: number) => skinClosePt(x, y);
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={3} k={lin(frame, 0, CARTONNEE)} />
			</SkinClose>
			<Big from={CARTONNEE - 6} text={'Une peau *cartonnée*'} size={92} y={170} center />
			<PointTag at={SECHE - 2} to={CLOQUE - 4} x={270} y={480} px={p(420, 420).x} py={p(420, 420).y} size={46} tone={LPI.paper}>
				sèche
			</PointTag>
			<PointTag at={BLANCHE - 2} to={CLOQUE - 4} x={820} y={520} px={p(380, 560).x} py={p(380, 560).y} size={46} tone={LPI.paper}>
				blanche
			</PointTag>
			<PointTag at={BRUNE - 2} to={CLOQUE - 4} x={850} y={1500} px={p(570, 470).x} py={p(570, 470).y} size={46} tone={LPI.paper}>
				brune
			</PointTag>
			<PointTag at={NOIRE - 2} to={CLOQUE - 4} x={300} y={1500} px={p(470, 560).x} py={p(470, 560).y} size={46} tone={LPI.paper}>
				noire
			</PointTag>
			<Chip at={CLOQUE - 4} x={650} y={1660} ok={false}>
				aucune cloque
			</Chip>
			{[SECHE - 2, BLANCHE - 2, BRUNE - 2, NOIRE - 2].map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.07} />
			))}
			<Sfx name="stamp" at={CLOQUE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE PIÈGE : ELLE NE FAIT PAS MAL ═══════════════════════════════ */
export const Douleur: React.FC = () => {
	const frame = useCurrentFrame();
	const PIEGE = at('douleur', 'piège :');
	const MAL = at('douleur', 'mal !');
	const NERFS = at('douleur', 'nerfs');
	const AUTOUR = at('douleur', 'autour.');
	const c = skinClosePt(500, 500);
	return (
		<AbsoluteFill>
			<SkinClose>
				<BurnPatch deg={3} k={1} />
			</SkinClose>
			<Big from={PIEGE - 6} to={NERFS - 4} text={'Elle ne fait *pas* *mal* !'} size={92} y={170} center />
			<Stamp at={MAL} x={540} y={420} text="LE PIÈGE" size={70} />
			<Chip at={NERFS - 2} x={650} y={1600} ok={false}>
				nerfs détruits
			</Chip>
			{/* la douleur, seulement en périphérie : traits roses autour de la plaie */}
			{frame >= AUTOUR - 6
				? Array.from({length: 12}, (_, i) => {
						const a = (i / 12) * Math.PI * 2;
						const k = ((frame - AUTOUR + 6) / 14 + i / 12) % 1;
						const r = 470 + k * 70;
						return (
							<svg key={i} width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
								<line x1={c.x + Math.cos(a) * r} y1={c.y + Math.sin(a) * r * 0.82} x2={c.x + Math.cos(a) * (r + 60)} y2={c.y + Math.sin(a) * (r + 60) * 0.82} stroke={LPI.pink} strokeWidth={12} strokeLinecap="round" opacity={1 - k} />
							</svg>
						);
					})
				: null}
			<Chip at={AUTOUR - 4} x={650} y={1760}>
				douleur autour
			</Chip>
			<Sfx name="stamp" at={MAL} volume={0.1} />
			<Sfx name="pop" at={NERFS - 2} volume={0.07} />
			<Sfx name="pop" at={AUTOUR - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA GRAVITÉ : URGENCE, LE 15, GREFFE ═══════════════════════════════ */
export const Gravite: React.FC = () => {
	const frame = useCurrentFrame();
	const URGENCE = at('gravite', 'urgence :');
	const APPELLE = at('gravite', 'appelle');
	const QUINZE = at('gravite', 'quinze.');
	const SEULE = at('gravite', 'seule :');
	const GREFFER = at('gravite', 'greffer');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.pink} />
			<Big from={0} to={SEULE - 4} text={'Toujours une *urgence*'} size={96} y={190} center />
			<Big from={SEULE} text={'Une *greffe* de peau'} size={96} y={190} center />
			{frame >= APPELLE - 6 ? (
				<div style={{position: 'absolute', left: 540 - 140, top: 560, transform: `scale(${popAt(frame, APPELLE - 6)})`}}>
					<Phone digits="15" press={lin(frame, APPELLE, QUINZE)} ring={fadeIn(frame, QUINZE, 4)} size={280} />
				</div>
			) : null}
			<Chip at={SEULE - 4} x={540} y={1280} ok={false}>
				pas de cicatrisation seule
			</Chip>
			<Chip at={GREFFER - 4} x={600} y={1440}>
				greffe de peau
			</Chip>
			<Sfx name="stamp" at={URGENCE} volume={0.08} />
			<Sfx name="dtmf-1" at={APPELLE + 2} volume={0.15} />
			<Sfx name="dtmf-5" at={APPELLE + 8} volume={0.15} />
			<Sfx name="ring" at={QUINZE + 4} volume={0.12} />
			<Sfx name="pop" at={GREFFER - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ EN ATTENDANT LES SECOURS : ARROSER, VÊTEMENTS, COUVRIR ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const frame = useCurrentFrame();
	const SECOURS = at('geste', 'secours :');
	const SUIS = at('geste', 'suis');
	const INDICATIONS = at('geste', 'indications');
	const QUINZE = at('geste', 'quinze.');
	const TELEPHONE = at('geste', 'téléphone,');
	const EXACTEMENT = at('geste', 'exactement');
	const swap = lin(frame, SUIS - 10, SUIS + 4);
	const ph = popAt(frame, SUIS - 6);
	return (
		<AbsoluteFill>
			{swap < 1 ? (
				<AbsoluteFill style={{opacity: 1 - swap}}>
					<SkinClose>
						<BurnPatch deg={3} k={1} />
					</SkinClose>
				</AbsoluteFill>
			) : null}
			{swap > 0 ? (
				<AbsoluteFill style={{opacity: swap}}>
					<Bg />
				</AbsoluteFill>
			) : null}
			<Big from={SECOURS - 12} to={SUIS - 6} text={'En attendant les *secours*'} size={88} y={180} center />
			<Big from={SUIS} text={'Suis les indications du *15*'} size={88} y={180} center />
			{frame >= SUIS - 6 ? (
				<div style={{position: 'absolute', left: 540 - 165, top: 470, transform: `scale(${ph})`}}>
					<Phone digits="15" ring={fadeIn(frame, QUINZE, 4) * (1 - lin(frame, TELEPHONE, TELEPHONE + 8))} size={330} />
				</div>
			) : null}
			<Chip at={INDICATIONS - 2} x={650} y={1260}>
				suis ses indications
			</Chip>
			<Chip at={EXACTEMENT - 4} x={650} y={1420}>
				il te dit quoi faire
			</Chip>
			<Sfx name="ring" at={QUINZE + 4} volume={0.12} />
			<Sfx name="pop" at={INDICATIONS - 2} volume={0.08} />
			<Sfx name="ding" at={EXACTEMENT - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : JAMAIS D'ALCOOL ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const JAMAIS = at('fin', 'jamais');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{filter: 'blur(10px)', transform: 'scale(1.1)'}}>
				<Barbecue />
			</AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.paper, 0.35)}} />
			<Big from={0} to={JAMAIS - 4} text={'Pour *rallumer* ?'} size={100} y={230} center />
			<Big from={JAMAIS - 2} text={"Jamais *d'alcool*\u00a0!"} size={110} y={230} center />
			<Stamp at={JAMAIS + 2} x={540} y={900} text="✕ ALCOOL" size={90} />
			<Sfx name="stamp" at={JAMAIS + 2} volume={0.1} />
		</AbsoluteFill>
	);
};
