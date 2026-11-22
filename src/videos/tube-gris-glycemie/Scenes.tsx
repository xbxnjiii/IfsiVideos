// « Le tube gris : la glycémie » (n° 73, série « les tubes », directives Instagram du 20/11/2026) : sujet + enjeu dès
// l'image 0 (titre, compteur 0/4, le tube gris, la jauge normal / prédiabète / diabète). 1 · pourquoi le gris (le fluorure
// empêche les globules rouges de consommer le sucre dans le tube) ; 2 · à jeun depuis au moins 8 h, l'eau est permise ;
// 3 · normes à jeun 0,70 – 1,10 g/L (tableau du propriétaire), prédiabète 1,10 – 1,25 ; 4 · diabète ≥ 1,26 g/L à jeun sur
// 2 dosages, ou ≥ 2 g/L à tout moment avec des signes (soif, urines abondantes, perte de poids). Pas d'appel à l'action.
// Sources : texte et tableau du propriétaire ; HAS / OMS (critères du diabète, jeûne de 8 h) ; la glycolyse in vitro
// fait baisser la glycémie d'environ 5 à 7 % par heure dans un tube sans fluorure (recommandations de biologie).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard, ease, popAt} from '../../brand/bold';
import {Plate} from '../../brand/diabetes';
import {ThirstIcon, UrineIcon} from '../../brand/icons';
import {WeightLossIcon} from '../../brand/lungcancer';
import {Camera, Confetti} from '../../brand/motion3';
import {Chip, Counter, NextCard, PINK_BG, Pop, SeriesPill, ShortBg, ZoneGauge} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, RedCell, SugarCube, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const GRIS = CAP.fluor;
const Pill = () => <SeriesPill cap={GRIS} label="LE TUBE GRIS · GLYCÉMIE" />;
const fr = (t: number) => t.toFixed(2).replace('.', ',');

/** Jauge de la glycémie à jeun (g/L). */
const ZONES = [
	{to: 0.7, tone: alpha(LPI.pink, 0.55), label: 'hypo'},
	{to: 1.1, tone: LPI.sky, label: 'normal'},
	{to: 1.26, tone: alpha(LPI.pink, 0.55), label: 'pré'},
	{to: 1.6, tone: LPI.pink, label: 'diabète'},
];
const GlyGauge: React.FC<{v?: number; width?: number}> = ({v, width = 920}) => <ZoneGauge zones={ZONES} min={0.4} max={1.6} v={v} ticks={[0.7, 1.1, 1.26]} fmt={fr} width={width} />;

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const GLY = at('intro', 'glycémie');
	const CHIFFRE = at('intro', 'chiffre');
	const NORMAL = at('intro', 'normal');
	const PRE = at('intro', 'prédiabète…');
	const DIAB = at('intro', 'diabète');
	const SEUILS = at('intro', 'seuils');
	const v = frame < NORMAL - 4 ? 0.95 + 0.25 * Math.sin(frame / 7) : frame < PRE - 4 ? 0.92 : frame < DIAB - 4 ? interpolate(frame, [PRE - 4, PRE + 6], [0.92, 1.18], ease) : interpolate(frame, [DIAB - 4, DIAB + 6], [1.18, 1.45], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={4} />
			<Camera punches={[GLY + 1, NORMAL + 1, PRE + 1, DIAB + 1]} shakes={[DIAB + 3]} strength={0.03}>
				<Big from={-60} text={'La *glycémie*\ndans le tube\n*gris*'} size={100} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 230, top: 950, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 9) * 3}deg)`}}>
							<Tube size={160} cap={GRIS} label="fluorure" level={0.72} />
						</div>
					)}
				/>
				{/* le chiffre qui décide */}
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 690, top: 830, transform: 'translate(-50%, -50%)', padding: '20px 34px', borderRadius: 36, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.12em', color: LPI.sky}}>GLYCÉMIE À JEUN</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 96, color: f >= PRE - 4 ? LPI.pink : LPI.paper, fontVariantNumeric: 'tabular-nums'}}>
								{fr(v)} <span style={{fontSize: 40}}>g/L</span>
							</div>
						</div>
					)}
				/>
				<div style={{position: 'absolute', left: 80, top: 1190}}>
					<Live render={() => <GlyGauge v={v} />} />
				</div>
				<Chip at={CHIFFRE - 2} to={NORMAL - 4} x={690} y={1040} tone={LPI.pink} size={40}>
					1 chiffre décide
				</Chip>
				<Note at={SEUILS - 4} y={1450} size={44}>
					tu connais les seuils ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={NORMAL} volume={0.18} />
			<Sfx name="pop" at={PRE} volume={0.18} />
			<Sfx name="buzz" at={DIAB} volume={0.2} />
			<Sfx name="ding" at={SEUILS} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · POURQUOI LE GRIS ═══════════════════════════════ */
const Lane: React.FC<{x: number; title: string; cap: string; value: number; eat: boolean; shield?: number}> = ({x, title, cap, value, eat, shield = 0}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{position: 'absolute', left: x, top: 0, width: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, whiteSpace: 'nowrap'}}>{title}</div>
			<div style={{position: 'relative', width: 420, height: 380, borderRadius: 40, background: alpha('#F3C3C8', 0.9), border: `6px solid ${N}`, overflow: 'hidden'}}>
				{[0, 1, 2].map((i) => (
					<div key={`c${i}`} style={{position: 'absolute', left: 40 + i * 120, top: 60 + (i % 2) * 140 + 6 * Math.sin(frame / 6 + i)}}>
						<RedCell size={110} />
					</div>
				))}
				{[0, 1, 2, 3, 4].map((i) => {
					const gone = eat ? Math.min(1, Math.max(0, (frame % 200) / 40 - i * 0.6)) : 0;
					return (
						<div key={`s${i}`} style={{position: 'absolute', left: 50 + ((i * 83) % 320), top: 200 + ((i * 47) % 120), opacity: 1 - gone, transform: `scale(${1 - 0.6 * gone})`}}>
							<SugarCube size={50} />
						</div>
					);
				})}
				{shield > 0 ? <div style={{position: 'absolute', inset: 0, border: `14px solid ${cap}`, borderRadius: 34, opacity: shield}} /> : null}
			</div>
			<div style={{padding: '8px 24px', borderRadius: 999, background: LPI.navy, color: eat ? LPI.pink : LPI.paper, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, fontVariantNumeric: 'tabular-nums'}}>{fr(value)} g/L</div>
		</div>
	);
};

export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('pourquoi', 'un');
	const ORD = at('pourquoi', 'ordinaire');
	const MANGER = at('pourquoi', 'manger');
	const BAISSE = at('pourquoi', 'baisse');
	const FLUO = at('pourquoi', 'fluorure');
	const EMP = at('pourquoi', 'empêche');
	const JUSTE = at('pourquoi', 'juste');
	const drop = interpolate(frame, [MANGER, BAISSE + 30], [1.0, 0.78], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={4} />
			<Camera punches={[ORD + 1, BAISSE + 1, FLUO + 1, JUSTE + 1]} strength={0.03}>
				<Big from={UN - 2} text={'Pourquoi le\ntube *gris* ?'} size={100} y={330} />
				<Pop at={ORD - 4} x={290} y={870}>
					<div style={{position: 'relative', width: 440, height: 560}}>
						<Live render={() => <Lane x={0} title="tube ordinaire" cap={LPI.navy} value={drop} eat={frame >= MANGER - 4} />} />
					</div>
				</Pop>
				<Pop at={FLUO - 4} x={790} y={870}>
					<div style={{position: 'relative', width: 440, height: 560}}>
						<Live render={(f) => <Lane x={0} title="tube gris" cap={GRIS} value={1.0} eat={false} shield={interpolate(f, [EMP - 4, EMP + 8], [0, 1], clamp)} />} />
					</div>
				</Pop>
				<Chip at={MANGER} to={FLUO - 6} x={290} y={1210} tone={LPI.pink} size={38}>
					ils mangent le sucre
				</Chip>
				<Chip at={EMP - 2} x={790} y={1210} tone={LPI.blue} size={38}>
					le fluorure les bloque
				</Chip>
				<Note at={JUSTE - 4} y={1290} size={44}>
					résultat juste ✓
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={ORD - 4} volume={0.15} />
			<Sfx name="buzz" at={BAISSE} volume={0.15} />
			<Sfx name="pop" at={FLUO - 4} volume={0.15} />
			<Sfx name="ding" at={JUSTE} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · À JEUN ═══════════════════════════════ */
const WaterGlass: React.FC<{size?: number}> = ({size = 170}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M24 12 H76 L68 90 H32 Z" fill={alpha(LPI.sky, 0.6)} stroke={N} strokeWidth={5} strokeLinejoin="round" />
		<path d="M28 40 H72 L68 88 H32 Z" fill={LPI.blue} opacity={0.6} />
	</svg>
);

export const Jeun: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('jeun', 'deux');
	const JEUN = at('jeun', 'jeun');
	const MANGER = at('jeun', 'manger');
	const HUIT = at('jeun', 'huit');
	const EAU = at('jeun', "d'eau");
	const PERMIS = at('jeun', 'permis');
	const h = Math.round(interpolate(frame, [MANGER, HUIT + 6], [0, 8], clamp));
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={4} />
			<Camera punches={[JEUN + 1, HUIT + 1, EAU + 1]} strength={0.03}>
				<Big from={JEUN - 4} text={'À *jeun*'} size={130} y={330} />
				<Pop at={MANGER - 4} x={540} y={720}>
					<div style={{display: 'flex', alignItems: 'baseline', gap: 16, padding: '20px 44px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 140, color: LPI.pink, fontVariantNumeric: 'tabular-nums', lineHeight: 1, whiteSpace: 'nowrap'}}>{h} h</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: LPI.paper, whiteSpace: 'nowrap'}}>sans manger</div>
					</div>
				</Pop>
				<Pop at={MANGER} x={300} y={1080}>
					<div style={{position: 'relative'}}>
						<Plate size={220} />
						<svg width={220} height={220} viewBox="0 0 100 100" style={{position: 'absolute', left: 0, top: 0}}>
							<path d="M14 14 L86 86" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
						</svg>
					</div>
				</Pop>
				<Chip at={HUIT} x={300} y={1260} tone={LPI.pink} size={38}>
					au moins 8 h
				</Chip>
				<Pop at={EAU - 4} x={780} y={1080}>
					<WaterGlass size={220} />
				</Pop>
				<Chip at={PERMIS - 4} x={780} y={1260} tone={LPI.blue} size={38}>
					l'eau : permise ✓
				</Chip>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="tick" at={MANGER + 6} volume={0.12} />
			<Sfx name="ding" at={HUIT} volume={0.18} />
			<Sfx name="pop" at={EAU} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · LES NORMES ═══════════════════════════════ */
export const Normes: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('normes', 'trois');
	const NORMALE = at('normes', 'normale');
	const DIX = at('normes', 'dix');
	const ENTRE = at('normes', 'entre');
	const PRE = at('normes', 'prédiabète');
	const v = frame < ENTRE - 4 ? 0.9 + 0.12 * Math.sin(frame / 8) : interpolate(frame, [ENTRE - 4, ENTRE + 10], [0.95, 1.18], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={4} />
			<Camera punches={[NORMALE + 1, DIX + 1, ENTRE + 1, PRE + 1]} strength={0.03}>
				<Big from={TROIS - 2} text={'Les *normes*\nà jeun'} size={106} y={330} />
				<Pop at={NORMALE - 6} x={540} y={720}>
					<Live render={() => <GlyGauge v={v} />} />
				</Pop>
				<Pop at={DIX - 2} x={540} y={980}>
					<NormCard rows={[['', '0,70 – 1,10 g/L'], ['', '3,9 – 6,1 mmol/L']]} />
				</Pop>
				<Chip at={PRE - 4} x={540} y={1180} tone={LPI.pink} size={44}>
					1,10 – 1,25 g/L = prédiabète
				</Chip>
				<Note at={PRE + 14} y={1260} size={32}>
					(hyperglycémie modérée à jeun)
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="ding" at={DIX} volume={0.18} />
			<Sfx name="pop" at={PRE} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LE DIABÈTE ═══════════════════════════════ */
export const Diabete: React.FC = () => {
	const QUATRE = at('diabete', 'quatre');
	const DIAB = at('diabete', 'diabète');
	const VINGT6 = at('diabete', 'vingt-six');
	const PRISES = at('diabete', 'prises');
	const DEUXG = at('diabete', 'grammes');
	const MOMENT = at('diabete', 'moment');
	const SOIF = at('diabete', 'soif');
	const URINES = at('diabete', "d'urines");
	const POIDS = at('diabete', 'perte');
	const signs = [
		{t: SOIF, node: <ThirstIcon size={90} />, label: 'soif'},
		{t: URINES, node: <UrineIcon size={90} />, label: 'urines ++'},
		{t: POIDS, node: <WeightLossIcon size={90} />, label: 'poids ↓'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} total={4} />
			<Camera punches={[DIAB + 1, VINGT6 + 1, PRISES + 1, DEUXG + 1, SOIF + 1]} strength={0.03}>
				<Big from={DIAB - 4} text={'Le *diabète*'} size={116} y={330} />
				<RowCard at={VINGT6 - 6} y={520} h={220} badge="1" badgeTone={LPI.sky} title="≥ 1,26 g/L à jeun" sub="sur 2 prises de sang" subAt={PRISES - 4} size={52}>
					<div style={{display: 'flex', gap: 8}}>
						<Tube size={50} cap={GRIS} level={0.7} />
						<Tube size={50} cap={GRIS} level={0.7} />
					</div>
				</RowCard>
				<div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 54, color: N}}>
					<Live render={(f) => <span style={{opacity: f >= DEUXG - 8 ? 1 : 0}}>ou</span>} />
				</div>
				<RowCard at={DEUXG - 4} y={840} h={220} badge="2" badgeTone={LPI.sky} title="≥ 2 g/L à tout moment" sub="+ des signes" subAt={MOMENT + 6} size={52} />
				{signs.map((s, i) => (
					<Pop key={s.label} at={s.t - 4} x={220 + i * 320} y={1250}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
							<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{s.node}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>{s.label}</div>
						</div>
					</Pop>
				))}
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={VINGT6 - 6} volume={0.15} />
			<Sfx name="whoosh" at={DEUXG - 4} volume={0.15} />
			{signs.map((s) => (
				<Sfx key={s.label} name="pop" at={s.t - 4} volume={0.15} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const NORMAL = at('fin', 'normal');
	const PRE = at('fin', 'prédiabète');
	const DIAB = at('fin', 'diabète');
	const SEUILS = at('fin', 'seuils');
	const PROCH = at('fin', 'prochaine');
	const ALC = at('fin', "l'alcoolémie");
	const rows = [
		{t: NORMAL, title: 'normal', sub: '0,70 – 1,10 g/L'},
		{t: PRE, title: 'prédiabète', sub: '1,10 – 1,25 g/L'},
		{t: DIAB, title: 'diabète', sub: '≥ 1,26 g/L (× 2) · ≥ 2 g/L + signes'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 4]]} total={4} done />
			<Camera punches={[...rows.map((r) => r.t + 1), PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'Les *3* *seuils*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={440 + i * 190} h={170} badge={String(i + 1)} badgeTone={i ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={SEUILS} size={50} />
				))}
				<Confetti at={SEUILS} />
				<Pop at={PROCH - 2} x={540} y={1180}>
					<NextCard
						art={
							<Live render={(f) => <div style={{transform: `scale(${f >= ALC - 4 ? popAt(f, ALC - 4) : 0.0001}) rotate(${Math.sin(f / 6) * 5}deg)`}}><Tube size={60} cap={GRIS} level={0.7} /></div>} />
						}
					>
						l'<span style={{color: LPI.pink}}>alcoolémie</span>
					</NextCard>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={SEUILS} volume={0.22} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
