// « Le tube bleu : anti-Xa, antithrombine, protéines C et S, facteurs » (n° 77, série « les tubes », directives Instagram du
// 20/11/2026). Demandé : « il manque anti-Xa, les protéines C et S, antithrombine et facteurs de coagulation ». Sujet + enjeu
// dès l'image 0 (phlébite à 25 ans, un frein de la coagulation qui manque, compteur 0/4).
// 1 · anti-Xa (surveille l'héparine, surtout les HBPM, chez l'insuffisant rénal ou la femme enceinte ; prélèvement au pic,
// 3 – 4 h après l'injection ; cible selon la molécule) ; 2 · antithrombine (frein principal, 80 – 120 %, l'héparine agit grâce
// à elle) ; 3 · protéines C et S (deux autres freins ; déficit → thromboses même jeune ; dosées à distance d'une thrombose et
// pas sous AVK ; C ≈ 70 – 140 %, S ≈ 60 – 140 % à l'écran) ; 4 · facteurs (≈ 50 – 150 % ; VIII bas = hémophilie A, IX = B).
// Sources : ANSM / RCP des HBPM (anti-Xa au pic, 3 – 4 h après l'injection, si insuffisance rénale, poids extrême, grossesse) ;
// GFHT (bilan de thrombophilie : à distance de l'épisode, pas sous AVK) ; valeurs usuelles des laboratoires français.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard, ease} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {LegIcon, SyringeIcon} from '../../brand/icons';
import {Camera, Confetti} from '../../brand/motion3';
import {Chip, Counter, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, RedCell, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const BLEU = CAP.citrate;
const Pill = () => <SeriesPill cap={BLEU} label="LE TUBE BLEU · LES FREINS" />;

/** Petit caillot : globules rouges pris dans des fils de fibrine. */
const MiniClot: React.FC<{size?: number}> = ({size = 120}) => (
	<div style={{position: 'relative', width: size, height: size}}>
		{[
			[0.05, 0.2],
			[0.45, 0.05],
			[0.25, 0.5],
		].map(([x, y], i) => (
			<div key={i} style={{position: 'absolute', left: x * size, top: y * size}}>
				<RedCell size={size * 0.5} />
			</div>
		))}
		<svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}>
			{['M5 30 L95 70', 'M10 80 L90 20', 'M50 0 L45 100', 'M0 55 L100 50'].map((d) => (
				<path key={d} d={d} stroke={LPI.paper} strokeWidth={3} strokeLinecap="round" opacity={0.9} />
			))}
		</svg>
	</div>
);

/** Un frein : barrière qui arrête les caillots ; `on` 1 → 0 le frein disparaît (pointillés). */
const Brake: React.FC<{label: string; on: number; tone?: string}> = ({label, on, tone = LPI.blue}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
		<div style={{width: 70, height: 300, borderRadius: 22, background: on > 0.5 ? tone : 'transparent', border: `6px ${on > 0.5 ? 'solid' : 'dashed'} ${on > 0.5 ? N : alpha(N, 0.45)}`, opacity: 0.35 + 0.65 * on, boxShadow: on > 0.5 ? SHADOW : 'none'}} />
		<div style={{padding: '6px 18px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, whiteSpace: 'nowrap', opacity: 0.4 + 0.6 * on}}>{label}</div>
	</div>
);

/** Caillots qui avancent de gauche à droite ; arrêtés à `stopX` tant que `stop` = 1. */
const ClotFlow: React.FC<{stopX: number; stop: number; width?: number; count?: number}> = ({stopX, stop, width = 900, count = 4}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width, height: 300}}>
			{Array.from({length: count}).map((_, i) => {
				const raw = ((frame * 4 + i * (width / count)) % (width + 120)) - 120;
				const x = stop > 0.5 ? Math.min(raw, stopX - 130 - i * 10) : raw;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: 40 + (i % 2) * 110}}>
						<MiniClot size={100} />
					</div>
				);
			})}
		</div>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const PHLEB = at('intro', 'phlébite');
	const ANS = at('intro', 'ans,');
	const RAISON = at('intro', 'raison');
	const CAUSE = at('intro', 'cause');
	const FREIN = at('intro', 'frein');
	const MANQUE = at('intro', 'manque.');
	const CONN = at('intro', 'connais');
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={4} />
			<Camera punches={[PHLEB + 1, ANS + 1, CAUSE + 1, MANQUE + 1]} shakes={[MANQUE + 3]} strength={0.03}>
				<Big from={-60} text={'Le tube *bleu*\net ses *freins*'} size={100} y={190} />
				<Pop at={-12} x={300} y={720}>
					<div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '18px 28px', borderRadius: 34, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<LegIcon size={110} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, lineHeight: 1.05}}>
							phlébite
							<Live render={(f) => <div style={{color: LPI.pink, opacity: f >= ANS - 4 ? 1 : 0}}>à 25 ans</div>} />
						</div>
					</div>
				</Pop>
				<Pop at={-12} x={800} y={720}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 4}deg)`}}><Tube size={110} cap={BLEU} level={0.72} /></div>} />
				</Pop>
				<Chip at={RAISON - 2} to={CAUSE - 4} x={300} y={900} tone={LPI.pink} size={38}>
					sans raison ?
				</Chip>
				{/* le frein qui manque */}
				<div style={{position: 'absolute', left: 90, top: 1000, width: 900, height: 360}}>
					<Live render={(f) => (f >= CAUSE - 4 ? <ClotFlow stopX={560} stop={f < MANQUE - 2 ? 1 : 0} /> : null)} />
					<div style={{position: 'absolute', left: 520, top: 0}}>
						<Live render={(f) => (f >= FREIN - 4 ? <Brake label="frein" on={interpolate(f, [MANQUE - 4, MANQUE + 6], [1, 0], clamp)} /> : null)} />
					</div>
				</div>
				<Note at={CONN - 6} y={1470} size={44}>
					tu les connais ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={ANS} volume={0.18} />
			<Sfx name="pop" at={FREIN} volume={0.15} />
			<Sfx name="buzz" at={MANQUE} volume={0.2} />
			<Sfx name="ding" at={CONN} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · ANTI-XA ═══════════════════════════════ */
/** Courbe de l'héparine dans le sang après l'injection (0 → 8 h), pic à 3 – 4 h ; tracée jusqu'à `t` heures. */
const PeakCurve: React.FC<{t: number; mark: number}> = ({t, mark}) => {
	const W = 820;
	const H = 300;
	const X = (h: number) => 40 + (h / 8) * (W - 60);
	const Y = (h: number) => H - 40 - (H - 80) * Math.min(1, (h / 3.5) * Math.exp(1 - h / 3.5));
	const pts = Array.from({length: 81}, (_, i) => (i / 10)).filter((h) => h <= t);
	const d = pts.map((h, i) => `${i ? 'L' : 'M'}${X(h)} ${Y(h)}`).join(' ');
	return (
		<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
			<rect x={X(3)} y={20} width={X(4) - X(3)} height={H - 60} rx={12} fill={alpha(LPI.pink, 0.35 * mark)} />
			<line x1={40} y1={H - 40} x2={W - 10} y2={H - 40} stroke={N} strokeWidth={5} strokeLinecap="round" />
			{[0, 2, 4, 6, 8].map((h) => (
				<text key={h} x={X(h)} y={H} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={N}>
					{h} h
				</text>
			))}
			<path d={d} fill="none" stroke={LPI.blue} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
			{mark > 0 ? <circle cx={X(3.5)} cy={Y(3.5)} r={18 * mark} fill={LPI.pink} stroke={N} strokeWidth={5} /> : null}
		</svg>
	);
};

export const Antixa: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('antixa', 'un');
	const AXA = at('antixa', "l'anti-xa.");
	const HEP = at('antixa', "l'héparine,");
	const HBPM = at('antixa', 'hbpm,');
	const REIN = at('antixa', 'rénal');
	const ENCEINTE = at('antixa', 'enceinte.');
	const PIC = at('antixa', 'pic,');
	const APRES = at('antixa', 'après');
	const CIBLE = at('antixa', 'cible');
	const t = interpolate(frame, [PIC - 30, APRES + 14], [0, 8], clamp);
	const mark = interpolate(frame, [APRES - 4, APRES + 6], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={4} />
			<Camera punches={[AXA + 1, HBPM + 1, PIC + 1, CIBLE + 1]} strength={0.03}>
				<Big from={UN - 2} text={"*L'anti-Xa*"} size={124} y={330} />
				<Pop at={HEP - 4} x={240} y={620}>
					<Live render={(f) => <div style={{transform: `rotate(${-20 + Math.sin(f / 8) * 4}deg)`}}><SyringeIcon size={170} /></div>} />
				</Pop>
				<Chip at={HBPM - 2} x={240} y={760} tone={LPI.blue} size={38}>
					HBPM
				</Chip>
				<Pop at={REIN - 4} x={620} y={600}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 26, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW}}>
						<KidneysIcon size={70} />
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N, whiteSpace: 'nowrap'}}>insuffisance rénale</span>
					</div>
				</Pop>
				<Chip at={ENCEINTE - 4} x={620} y={740} tone={LPI.paper} size={34}>
					grossesse
				</Chip>
				<Pop at={PIC - 30} x={540} y={1060}>
					<Live render={() => <PeakCurve t={t} mark={mark} />} />
				</Pop>
				<Chip at={APRES - 2} x={540} y={1280} tone={LPI.pink} size={40}>
					au pic : 3 – 4 h après l'injection
				</Chip>
				<Note at={CIBLE - 4} y={1420} size={34}>
					la cible dépend de la molécule et du protocole
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={HBPM} volume={0.15} />
			<Sfx name="pop" at={REIN} volume={0.15} />
			<Sfx name="ding" at={APRES} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · ANTITHROMBINE ═══════════════════════════════ */
export const Antithrombine: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('antithrombine', 'deux');
	const AT = at('antithrombine', "l'antithrombine,");
	const FREIN = at('antithrombine', 'frein');
	const CENT = at('antithrombine', 'cent.');
	const HEP = at('antithrombine', "l'héparine");
	const GRACE = at('antithrombine', 'grâce');
	const MANQUE = at('antithrombine', 'manque,');
	const MOINS = at('antithrombine', 'moins');
	const on = interpolate(frame, [MANQUE - 4, MANQUE + 6], [1, 0.15], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={4} />
			<Camera punches={[AT + 1, FREIN + 1, CENT + 1, GRACE + 1, MANQUE + 1]} strength={0.03}>
				<Big from={AT - 4} text={"*L'antithrombine*"} size={100} y={330} />
				<div style={{position: 'absolute', left: 90, top: 540, width: 900, height: 360}}>
					<Live render={(f) => (f >= FREIN - 4 ? <ClotFlow stopX={560} stop={f < MANQUE - 2 ? 1 : 0} /> : null)} />
					<div style={{position: 'absolute', left: 520, top: 0}}>
						<Live render={(f) => (f >= FREIN - 4 ? <Brake label="antithrombine" on={on} /> : null)} />
					</div>
					{/* l'héparine renforce le frein */}
					<Pop at={HEP - 4} x={760} y={40}>
						<Live render={(f) => <div style={{transform: `rotate(${-30 + Math.sin(f / 8) * 4}deg)`}}><SyringeIcon size={120} /></div>} />
					</Pop>
				</div>
				<Chip at={FREIN} x={540} y={960} tone={LPI.paper} size={38}>
					le frein principal
				</Chip>
				<Pop at={CENT - 6} x={540} y={1090}>
					<NormCard rows={[['', '80 – 120 %']]} />
				</Pop>
				<Chip at={GRACE - 2} x={540} y={1240} tone={LPI.blue} size={38}>
					l'héparine agit grâce à elle
				</Chip>
				<Chip at={MOINS - 4} x={540} y={1370} tone={LPI.pink} size={38}>
					si elle manque : héparine moins efficace
				</Chip>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="ding" at={CENT} volume={0.18} />
			<Sfx name="pop" at={HEP} volume={0.15} />
			<Sfx name="buzz" at={MANQUE} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · PROTÉINES C ET S ═══════════════════════════════ */
export const Proteines: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('proteines', 'trois');
	const PROT = at('proteines', 'protéines');
	const C = at('proteines', 'c');
	const S = at('proteines', 's,');
	const MANQUE = at('proteines', 'manque,');
	const JEUNE = at('proteines', 'jeune.');
	const DIST = at('proteines', 'distance');
	const AVK = at('proteines', 'avk,');
	const BAISSE = at('proteines', 'baisser.');
	const on = interpolate(frame, [MANQUE - 4, MANQUE + 6], [1, 0.15], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={4} />
			<Camera punches={[PROT + 1, MANQUE + 1, JEUNE + 1, DIST + 1, AVK + 1]} strength={0.03}>
				<Big from={PROT - 4} text={'Protéines *C* et *S*'} size={104} y={330} />
				<div style={{position: 'absolute', left: 60, top: 540, width: 960, height: 360}}>
					<Live render={(f) => (f >= C - 4 ? <ClotFlow stopX={480} stop={f < MANQUE - 2 ? 1 : 0} width={960} count={5} /> : null)} />
					<div style={{position: 'absolute', left: 440, top: 0}}>
						<Live render={(f) => (f >= C - 4 ? <Brake label="C" on={on} /> : null)} />
					</div>
					<div style={{position: 'absolute', left: 580, top: 0}}>
						<Live render={(f) => (f >= S - 4 ? <Brake label="S" on={on} tone={LPI.pink} /> : null)} />
					</div>
				</div>
				<Chip at={JEUNE - 4} x={540} y={960} tone={LPI.pink} size={38}>
					caillots, même chez un jeune
				</Chip>
				<Pop at={DIST - 6} x={540} y={1100}>
					<NormCard rows={[['C', '≈ 70 – 140 %'], ['S', '≈ 60 – 140 %']]} />
				</Pop>
				<Note at={DIST} y={1270} size={34}>
					dosées à distance d'une thrombose
				</Note>
				<Chip at={AVK - 2} x={540} y={1380} tone={LPI.navy} size={38}>
					pas sous AVK : ils les font baisser
				</Chip>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="pop" at={C} volume={0.15} />
			<Sfx name="pop" at={S} volume={0.15} />
			<Sfx name="buzz" at={MANQUE} volume={0.18} />
			<Sfx name="ding" at={BAISSE} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LES FACTEURS ═══════════════════════════════ */
const ROMAN = ['II', 'V', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const Facteurs: React.FC = () => {
	const QUATRE = at('facteurs', 'quatre');
	const FACT = at('facteurs', 'facteurs');
	const COAG = at('facteurs', 'coagulation.');
	const CENT = at('facteurs', 'cent.');
	const HUIT = at('facteurs', 'huit');
	const TYPEA = at('facteurs', 'a.');
	const NEUF = at('facteurs', 'neuf,');
	const TYPEB = at('facteurs', 'b.');
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} total={4} />
			<Camera punches={[FACT + 1, CENT + 1, HUIT + 1, NEUF + 1]} strength={0.03}>
				<Big from={FACT - 4} text={'Les *facteurs*'} size={116} y={330} />
				<div style={{position: 'absolute', left: 60, top: 560, width: 960, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 18}}>
					{ROMAN.map((r, i) => (
						<Live
							key={r}
							render={(f) => {
								const t0 = FACT + 2 + i * 3;
								if (f < t0) return <div style={{width: 200, height: 120}} />;
								const hot = (r === 'VIII' && f >= HUIT - 2) || (r === 'IX' && f >= NEUF - 2);
								const s = Math.min(1, (f - t0) / 6);
								return (
									<div style={{width: 200, height: 120, borderRadius: 30, background: hot ? LPI.pink : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N, transform: `scale(${0.6 + 0.4 * s})`, opacity: s}}>
										{r}
									</div>
								);
							}}
						/>
					))}
				</div>
				<Note at={COAG - 4} y={890} size={30}>
					les facteurs qui font coaguler, en chiffres romains
				</Note>
				<Pop at={CENT - 6} x={540} y={1020}>
					<NormCard rows={[['', '≈ 50 – 150 %']]} />
				</Pop>
				<Chip at={TYPEA - 6} x={540} y={1200} tone={LPI.pink} size={42}>
					VIII trop bas = hémophilie A
				</Chip>
				<Chip at={TYPEB - 6} x={540} y={1320} tone={LPI.pink} size={42}>
					IX trop bas = hémophilie B
				</Chip>
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={FACT} volume={0.15} />
			<Sfx name="ding" at={CENT} volume={0.18} />
			<Sfx name="pop" at={HUIT} volume={0.18} />
			<Sfx name="pop" at={NEUF} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const AXA = at('fin', 'anti-xa,');
	const AT = at('fin', 'antithrombine,');
	const PROT = at('fin', 'protéines');
	const FACT = at('fin', 'facteurs');
	const SECRET = at('fin', 'secret');
	const rows = [
		{t: AXA, title: 'anti-Xa', sub: 'au pic, 3 – 4 h après l’injection'},
		{t: AT, title: 'antithrombine', sub: '80 – 120 %'},
		{t: PROT, title: 'protéines C et S', sub: 'à distance, pas sous AVK'},
		{t: FACT, title: 'facteurs', sub: '≈ 50 – 150 %'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 4]]} total={4} done />
			<Camera punches={[...rows.map((r) => r.t + 1), SECRET + 1]} strength={0.025}>
				<Big from={-2} text={'Le tube *bleu*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={420 + i * 170} h={150} badge={String(i + 1)} badgeTone={i % 2 ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={SECRET} size={46} />
				))}
				<Pop at={SECRET - 6} x={540} y={1250}>
					<div style={{display: 'flex', alignItems: 'center', gap: 24, padding: '20px 36px', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<Tube size={60} cap={BLEU} level={0.72} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, whiteSpace: 'nowrap'}}>
							tube bleu : <span style={{color: LPI.pink}}>✓</span>
						</div>
					</div>
				</Pop>
				<Confetti at={SECRET} />
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={SECRET} volume={0.22} />
		</AbsoluteFill>
	);
};
