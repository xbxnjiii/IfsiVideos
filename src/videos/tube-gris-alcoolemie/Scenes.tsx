// « Le tube gris : l'alcoolémie » (n° 74, série « les tubes », directives Instagram du 20/11/2026) : sujet + enjeu dès
// l'image 0 (titre, compteur 0/4, tube gris, flacon d'antiseptique alcoolique, écran du résultat). L'erreur qui fausse :
// désinfecter avec de l'alcool. 1 · quand (urgences : malaise, coma, agitation ; réquisition après un accident de la
// route) ; 2 · le geste (tube gris + antiseptique SANS alcool) ; 3 · seuils au volant en France (0,5 g/L de sang ;
// 0,2 g/L en permis probatoire) ; 4 · élimination ≈ 0,10 – 0,15 g/L par heure, > 3 g/L risque de coma, hypoglycémie.
// Contenu complété par l'agent (demandé : « je te laisse compléter »). Pas d'appel à l'action.
// Sources : Code de la route, art. R234-1 (0,5 g/L de sang ou 0,25 mg/L d'air expiré ; 0,2 g/L pour le permis
// probatoire) ; Santé publique France / Alcool Info Service (élimination ≈ 0,10 – 0,15 g/L/h) ; recommandations de
// prélèvement des laboratoires (désinfection sans alcool, tube au fluorure pour l'éthanol).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard, ease, popAt} from '../../brand/bold';
import {BedIcon, FaintIcon, StressIcon} from '../../brand/icons';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Arrow, Chip, Counter, NextCard, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const GRIS = CAP.fluor;
const Pill = () => <SeriesPill cap={GRIS} label="LE TUBE GRIS · ALCOOLÉMIE" />;
const fr = (t: number) => t.toFixed(2).replace('.', ',');

/** Flacon d'antiseptique avec son étiquette ; `bad` = barré. */
const Bottle: React.FC<{label: string; tone?: string; size?: number; bad?: number; ok?: number}> = ({label, tone = LPI.sky, size = 200, bad = 0, ok = 0}) => (
	<div style={{position: 'relative', width: size, height: size * 1.5}}>
		<svg width={size} height={size * 1.5} viewBox="0 0 100 150">
			<rect x={38} y={4} width={24} height={18} rx={4} fill={LPI.navy} />
			<path d="M30 22 H70 V34 Q86 40 86 58 V138 Q86 146 78 146 H22 Q14 146 14 138 V58 Q14 40 30 34 Z" fill={alpha(LPI.paper, 0.95)} stroke={N} strokeWidth={4} />
			<rect x={20} y={70} width={60} height={56} rx={8} fill={tone} stroke={N} strokeWidth={3} />
		</svg>
		<div style={{position: 'absolute', left: size * 0.2, width: size * 0.6, top: size * 0.7, height: size * 0.84, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.16, color: N, lineHeight: 1.05, whiteSpace: 'pre-line'}}>{label}</div>
		{bad > 0 ? (
			<svg width={size} height={size * 1.5} viewBox="0 0 100 150" style={{position: 'absolute', left: 0, top: 0, opacity: bad}}>
				<path d="M8 20 L92 140 M92 20 L8 140" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
			</svg>
		) : null}
		{ok > 0 ? (
			<div style={{position: 'absolute', right: -14, top: -14, width: 70, height: 70, borderRadius: 35, background: LPI.blue, border: `5px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 42, transform: `scale(${ok})`}}>✓</div>
		) : null}
	</div>
);

/** Écran du résultat d'alcoolémie. */
const Result: React.FC<{v: number; alert?: boolean}> = ({v, alert}) => (
	<div style={{padding: '18px 30px', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.12em', color: LPI.sky}}>ALCOOLÉMIE</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 88, color: alert ? LPI.pink : LPI.paper, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{fr(v)} <span style={{fontSize: 38}}>g/L</span>
		</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ERREUR = at('intro', 'erreur');
	const FAUSSER = at('intro', 'fausser');
	const DESINF = at('intro', 'désinfecter');
	const ALC = at('intro', "l'alcool");
	const PREL = at('intro', 'prélève');
	const drip = interpolate(frame, [DESINF, ALC + 4], [0, 1], clamp);
	const v = frame < ALC ? 0 : interpolate(frame, [ALC, ALC + 20], [0, 0.42], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={4} />
			<Camera punches={[ERREUR + 1, FAUSSER + 1, DESINF + 1, ALC + 1, PREL + 1]} shakes={[ALC + 3]} strength={0.03}>
				<Big from={-60} text={"*L'alcoolémie*\ndans le tube\n*gris*"} size={100} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 260, top: 960, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 9) * 3}deg)`}}>
							<Tube size={150} cap={GRIS} level={0.7} taint={f >= ALC ? interpolate(f, [ALC, ALC + 12], [0, 0.8], clamp) : 0} taintColor={LPI.sky} bad={f >= ALC + 10 ? 1 : 0} />
						</div>
					)}
				/>
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 760, top: 960, transform: `translate(-50%, -50%) rotate(${f >= DESINF - 4 ? -25 * Math.min(1, (f - DESINF + 4) / 10) : 0}deg)`}}>
							<Bottle label={'à\nl\'alcool'} tone={alpha(LPI.pink, 0.7)} size={240} />
						</div>
					)}
				/>
				{/* une goutte d'alcool file vers le tube */}
				{drip > 0 && drip < 1 ? (
					<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
						<path d={`M${700 - 440 * drip} ${830 - 60 * Math.sin(drip * Math.PI) + 40 * drip} q12 20 0 30 q-12 -10 0 -30 Z`} fill={LPI.sky} stroke={N} strokeWidth={3} />
					</svg>
				) : null}
				<Pop at={ERREUR - 2} x={540} y={1330}>
					<Live render={(f) => <Result v={v} alert={f >= ALC} />} />
				</Pop>
				<Stamp at={ALC + 6} x={540} y={1180} text="FAUSSÉ !" size={88} />
				<Note at={PREL - 6} y={1500} size={40}>
					comment on la prélève ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={ERREUR} volume={0.18} />
			<Sfx name="whoosh" at={DESINF} volume={0.15} />
			<Sfx name="stamp" at={ALC + 6} volume={0.42} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · QUAND ═══════════════════════════════ */
export const Quand: React.FC = () => {
	const UN = at('quand', 'un');
	const URG = at('quand', 'urgences');
	const MAL = at('quand', 'malaise');
	const COMA = at('quand', 'coma');
	const AGITE = at('quand', 'agité');
	const REQ = at('quand', 'réquisition');
	const ROUTE = at('quand', 'route');
	const items = [
		{t: MAL, node: <FaintIcon size={100} />, label: 'malaise'},
		{t: COMA, node: <BedIcon size={100} />, label: 'coma'},
		{t: AGITE, node: <StressIcon size={100} />, label: 'agitation'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={4} />
			<Camera punches={[URG + 1, MAL + 1, COMA + 1, AGITE + 1, REQ + 1]} strength={0.03}>
				<Big from={UN - 2} text={'*Quand* la\ndemande-t-on ?'} size={96} y={330} />
				<Chip at={URG - 2} x={540} y={600} tone={LPI.blue} size={48}>
					aux urgences
				</Chip>
				{items.map((c, i) => (
					<Pop key={c.label} at={c.t - 4} x={220 + i * 320} y={820}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
							<div style={{width: 190, height: 190, borderRadius: 95, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{c.node}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>{c.label}</div>
						</div>
					</Pop>
				))}
				<RowCard at={REQ - 4} y={1060} h={210} badge="⚖" badgeTone={LPI.sky} title="sur réquisition" sub="après un accident de la route" subAt={ROUTE - 8} size={52} />
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			{items.map((c) => (
				<Sfx key={c.label} name="pop" at={c.t - 4} volume={0.15} />
			))}
			<Sfx name="whoosh" at={REQ - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE GESTE ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('geste', 'deux');
	const GESTE = at('geste', 'geste');
	const TUBE = at('geste', 'tube');
	const DESINF = at('geste', 'désinfecte');
	const SANS = at('geste', 'sans');
	const SINON = at('geste', 'sinon');
	const PASSER = at('geste', 'passer');
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={4} />
			<Camera punches={[GESTE + 1, TUBE + 1, SANS + 1, SINON + 1]} strength={0.03}>
				<Big from={GESTE - 4} text={'Le *geste*'} size={120} y={330} />
				<Pop at={TUBE - 4} x={540} y={700}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 7) * 4}deg)`}}><Tube size={110} cap={GRIS} label="gris" level={0.72} /></div>} />
				</Pop>
				<Pop at={DESINF - 2} x={300} y={1130}>
					<Live render={(f) => <Bottle label={'avec\nalcool'} tone={alpha(LPI.pink, 0.7)} size={230} bad={f >= SANS ? interpolate(f, [SANS, SANS + 8], [0, 1], clamp) : 0} />} />
				</Pop>
				<Pop at={SANS - 4} x={780} y={1130}>
					<Live render={(f) => <Bottle label={'sans\nalcool'} tone={LPI.sky} size={230} ok={f >= SANS + 6 ? popAt(f, SANS + 6) : 0} />} />
				</Pop>
				<Note at={SINON - 2} y={1440} size={40} tone={LPI.pink}>
					sinon : l'alcool de la peau passe dans le tube
				</Note>
				{frame >= PASSER ? null : null}
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={TUBE} volume={0.15} />
			<Sfx name="buzz" at={SANS} volume={0.15} />
			<Sfx name="ding" at={SANS + 6} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LES SEUILS AU VOLANT ═══════════════════════════════ */
export const Seuils: React.FC = () => {
	const TROIS = at('seuils', 'trois');
	const FRANCE = at('seuils', 'france');
	const VOLANT = at('seuils', 'volant');
	const CINQ = at('seuils', 'cinq');
	const SANG = at('seuils', 'sang');
	const DEUX = at('seuils', 'deux');
	const PROB = at('seuils', 'probatoire');
	const Card: React.FC<{v: string; title: string; sub: string; tone: string}> = ({v, title, sub, tone}) => (
		<div style={{width: 900, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 26, padding: '22px 30px', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
			<div style={{minWidth: 300, padding: '10px 20px', borderRadius: 26, background: tone, border: `5px solid ${N}`, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 74, color: N, whiteSpace: 'nowrap'}}>{v}</div>
			<div>
				<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{title}</div>
				<div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: alpha(N, 0.75)}}>{sub}</div>
			</div>
		</div>
	);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={4} />
			<Camera punches={[VOLANT + 1, CINQ + 1, DEUX + 1, PROB + 1]} strength={0.03}>
				<Big from={TROIS - 2} text={'Au *volant*'} size={120} y={330} />
				<Chip at={FRANCE - 2} x={540} y={520} tone={LPI.blue} size={40}>
					en France
				</Chip>
				<Pop at={CINQ - 4} x={540} y={760}>
					<Card v="0,5 g/L" title="de sang" sub="= 0,25 mg/L d'air expiré" tone={LPI.sky} />
				</Pop>
				<Pop at={DEUX - 4} x={540} y={1040}>
					<Card v="0,2 g/L" title="permis probatoire" sub="jeunes conducteurs" tone={LPI.pink} />
				</Pop>
				<Note at={SANG + 4} to={DEUX - 6} y={1250} size={32}>
					le seuil général
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="ding" at={CINQ} volume={0.2} />
			<Sfx name="ding" at={DEUX} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · DANS LE CORPS ═══════════════════════════════ */
export const Corps: React.FC = () => {
	const frame = useCurrentFrame();
	const QUATRE = at('corps', 'quatre');
	const ELIM = at('corps', 'élimine');
	const HEURE = at('corps', 'heure');
	const TROISG = at('corps', 'trois');
	const COMA = at('corps', 'coma');
	const CHUTER = at('corps', 'chuter');
	const GLY = at('corps', 'glycémie');
	const W = 900;
	const H = 360;
	const draw = interpolate(frame, [ELIM - 4, HEURE + 20], [0, 1], ease);
	// 1,2 g/L qui baisse de 0,12 g/L par heure sur 10 h
	const pts: string[] = [];
	for (let i = 0; i <= 10; i++) {
		if (i / 10 > draw) break;
		const v = Math.max(0, 1.2 - 0.12 * i);
		pts.push(`${60 + (i / 10) * (W - 120)},${H - 50 - (v / 1.3) * (H - 100)}`);
	}
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} total={4} />
			<Camera punches={[ELIM + 1, HEURE + 1, TROISG + 1, COMA + 1, CHUTER + 1]} strength={0.03}>
				<Big from={QUATRE - 2} text={'Dans le\n*corps*'} size={106} y={330} />
				<Pop at={ELIM - 6} x={540} y={760}>
					<svg width={W} height={H} style={{overflow: 'visible'}}>
						<rect x={0} y={0} width={W} height={H} rx={30} fill={LPI.paper} stroke={N} strokeWidth={6} />
						<polyline points={pts.join(' ')} fill="none" stroke={LPI.blue} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
						{[0, 2, 4, 6, 8, 10].map((h) => (
							<text key={h} x={60 + (h / 10) * (W - 120)} y={H + 40} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>
								{h} h
							</text>
						))}
					</svg>
				</Pop>
				<Chip at={HEURE - 6} to={TROISG - 6} x={540} y={1040} tone={LPI.blue} size={40}>
					≈ 0,10 – 0,15 g/L par heure
				</Chip>
				<Pop at={TROISG - 4} x={540} y={1080}>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '18px 30px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: LPI.pink, whiteSpace: 'nowrap'}}>&gt; 3 g/L</div>
						<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 42, color: LPI.paper, opacity: f >= COMA - 4 ? 1 : 0.2, whiteSpace: 'nowrap'}}>risque de coma</div>} />
					</div>
				</Pop>
				<Arrow at={CHUTER} up={false} x={240} y={1290} size={100} />
				<Chip at={GLY - 4} x={560} y={1290} tone={LPI.pink} size={44}>
					+ hypoglycémie
				</Chip>
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={ELIM} volume={0.15} />
			<Sfx name="buzz" at={COMA} volume={0.2} />
			<Sfx name="pop" at={GLY} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const ANTI = at('fin', 'antiseptique');
	const TUBE = at('fin', 'tube');
	const SEUILS = at('fin', 'seuils');
	const VOILA = at('fin', 'voilà');
	const SECRET = at('fin', 'secret');
	const rows = [
		{t: ANTI, title: 'antiseptique sans alcool'},
		{t: TUBE, title: 'le tube gris'},
		{t: SEUILS, title: '0,5 g/L · 0,2 g/L (probatoire)'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 4]]} total={4} done />
			<Camera punches={[...rows.map((r) => r.t + 1), VOILA + 1]} strength={0.025}>
				<Big from={-2} text={"*L'alcoolémie*"} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={430 + i * 170} h={150} badge={String(i + 1)} badgeTone={LPI.sky} title={r.title} check={r.t + 10} size={46} />
				))}
				<Confetti at={SECRET} />
				<Pop at={VOILA - 2} x={540} y={1120}>
					<NextCard kicker="LE TUBE GRIS" art={<Tube size={60} cap={GRIS} level={0.7} />}>
						glycémie + alcoolémie <span style={{color: LPI.pink}}>✓</span>
					</NextCard>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={SECRET} volume={0.22} />
		</AbsoluteFill>
	);
};
