// « Le tube jaune : les reins » (n° 78, série courte du tube jaune, vidéo 1 ; directives Instagram du 20/11/2026) : sujet +
// enjeu dès l'image 0 (titre, compteur 0/3, le tube jaune et le rein qui filtre). 1 · l'urée (déchet des protéines,
// fabriqué par le foie ; 2,5 – 7,5 mmol/L ; trop haute : reins qui filtrent mal ou déshydratation) ; 2 · la créatinine
// (déchet des muscles, norme plus haute chez l'homme ; elle monte quand les reins filtrent moins bien ; DFG ≥ 90) ;
// 3 · l'acide urique (déchet des purines : viande rouge, abats, bière ; trop haut : cristaux → goutte, calculs).
// Sources : tableau du propriétaire (urée 2,5 – 7,5 mmol/L ; créatinine H 88 – 150 / F 53 – 115 µmol/L, comme la n° 64) ;
// KDIGO 2012 (DFG ≥ 90 mL/min/1,73 m²) ; valeurs usuelles de l'acide urique (H 210 – 420 / F 150 – 360 µmol/L).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard} from '../../brand/bold';
import {MeatIcon} from '../../brand/colorectal';
import {ThirstIcon} from '../../brand/icons';
import {FattyLiverIcon} from '../../brand/liver';
import {Camera, Confetti} from '../../brand/motion3';
import {InverseGauges, KidneyFilter, Molecule, MuscleArm, ProteinChain} from '../../brand/renal';
import {Chip, Counter, NextCard, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const JAUNE = CAP.gel;
const Pill = () => <SeriesPill cap={JAUNE} label="LE TUBE JAUNE · LES REINS" />;
const SKIN = '#F1C9A5';

const IconDot: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div style={{width: 150, height: 150, borderRadius: 75, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, whiteSpace: 'nowrap'}}>{label}</div>
	</div>
);

/** Pied de profil (vraie couleur de peau), gros orteil à droite ; `gout` 0 → 1 : l'articulation rougit, gonfle, cristaux en aiguilles. */
const GoutFoot: React.FC<{gout: number; width?: number}> = ({gout, width = 520}) => {
	const frame = useCurrentFrame();
	const pulse = 1 + 0.05 * gout * Math.sin(frame / 4);
	return (
		<svg width={width} height={width * 0.5} viewBox="0 0 520 260" style={{overflow: 'visible'}}>
			<path d="M30 60 C30 20 90 10 120 30 L150 150 C200 170 300 170 380 160 C440 152 500 160 505 195 C510 230 470 240 420 238 L80 240 C40 240 26 210 30 170 Z" fill={SKIN} stroke={N} strokeWidth={6} strokeLinejoin="round" />
			<path d="M440 170 C450 190 452 210 440 230" fill="none" stroke={alpha(N, 0.4)} strokeWidth={4} />
			<g transform={`translate(400 190) scale(${pulse})`}>
				<circle r={44 + 10 * gout} fill={alpha('#E0524D', 0.55 * gout)} />
				<circle r={26} fill={alpha('#E0524D', 0.45 * gout)} />
				{gout > 0.2
					? [0, 1, 2, 3, 4, 5].map((i) => {
							const a = (i / 6) * Math.PI * 2 + 0.3;
							return <line key={i} x1={Math.cos(a) * 6} y1={Math.sin(a) * 6} x2={Math.cos(a) * 30} y2={Math.sin(a) * 30} stroke={LPI.paper} strokeWidth={5} strokeLinecap="round" opacity={gout} />;
						})
					: null}
			</g>
		</svg>
	);
};

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const REINS = at('intro', 'reins.');
	const TROIS = at('intro', 'trois');
	const FILTRENT = at('intro', 'filtrent');
	const SYMPT = at('intro', 'symptôme.');
	const CONN = at('intro', 'connais');
	const chips = ['urée', 'créatinine', 'acide urique'];
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={3} />
			<Camera punches={[REINS + 1, TROIS + 1, FILTRENT + 1, SYMPT + 1]} strength={0.03}>
				<Big from={-60} text={'Le tube *jaune*\net les *reins*'} size={100} y={190} />
				<Pop at={-12} x={170} y={760}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 3}deg)`}}><Tube size={110} cap={JAUNE} gel level={0.72} serum={1} /></div>} />
				</Pop>
				<Pop at={-12} x={620} y={760}>
					<KidneyFilter width={620} />
				</Pop>
				{chips.map((c, i) => (
					<Chip key={c} at={TROIS + i * 6} x={200 + i * 340 - (i === 2 ? 20 : 0)} y={1130} tone={i === 1 ? LPI.pink : LPI.paper} size={36}>
						{c}
					</Chip>
				))}
				<Note at={SYMPT - 8} y={1260} size={34}>
					souvent avant le moindre symptôme
				</Note>
				<Note at={CONN - 6} y={1420} size={44}>
					tu les connais ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			{chips.map((c, i) => (
				<Sfx key={c} name="pop" at={TROIS + i * 6} volume={0.15} />
			))}
			<Sfx name="ding" at={CONN} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · L'URÉE ═══════════════════════════════ */
export const Uree: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('uree', 'un');
	const PROT = at('uree', 'protéines,');
	const FOIE = at('uree', 'foie.');
	const NORME = at('uree', 'norme');
	const LITRE = at('uree', 'litre.');
	const HAUTE = at('uree', 'haute');
	const MAL = at('uree', 'mal,');
	const DESHY = at('uree', 'déshydraté.');
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={3} />
			<Camera punches={[PROT + 1, FOIE + 1, LITRE + 1, HAUTE + 1]} strength={0.03}>
				<Big from={UN - 2} text={"*L'urée*"} size={130} y={330} />
				<Pop at={PROT - 6} x={540} y={600}>
					<Live render={() => <ProteinChain split={interpolate(frame, [PROT, FOIE - 4], [0, 1], clamp)} width={560} />} />
				</Pop>
				<Chip at={PROT} to={NORME - 4} x={540} y={720} tone={LPI.paper} size={34}>
					le déchet des protéines
				</Chip>
				<Pop at={FOIE - 4} x={330} y={850}>
					<IconDot label="le foie">
						<FattyLiverIcon size={100} />
					</IconDot>
				</Pop>
				<Pop at={FOIE + 6} x={720} y={840}>
					<Molecule label="urée" tone={LPI.sky} size={150} />
				</Pop>
				<Pop at={NORME - 4} x={540} y={1080}>
					<NormCard rows={[['', '2,5 – 7,5 mmol/L']]} />
				</Pop>
				<Chip at={MAL - 4} x={300} y={1240} tone={LPI.pink} size={34}>
					reins qui filtrent mal
				</Chip>
				<Pop at={DESHY - 6} x={790} y={1260}>
					<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '8px 22px', borderRadius: 999, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<ThirstIcon size={56} />
						<span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: N}}>déshydratation</span>
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={FOIE} volume={0.15} />
			<Sfx name="ding" at={LITRE} volume={0.18} />
			<Sfx name="buzz" at={HAUTE} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LA CRÉATININE ═══════════════════════════════ */
export const Creat: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('creat', 'deux');
	const MUSC = at('creat', 'muscles,');
	const CREA = at('creat', 'créatinine.');
	const PLUS = at('creat', 'plus');
	const HOMME = at('creat', "l'homme.");
	const MONTE = at('creat', 'monte,');
	const DFG = at('creat', 'dfg,');
	const NORMAL = at('creat', 'normal');
	const k = interpolate(frame, [MONTE - 4, MONTE + 20], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={3} />
			<Camera punches={[MUSC + 1, CREA + 1, HOMME + 1, MONTE + 1, DFG + 1]} strength={0.03}>
				<Big from={DEUX - 2} text={'La *créatinine*'} size={110} y={330} />
				<Pop at={MUSC - 4} x={300} y={620}>
					<Live render={(f) => <MuscleArm size={220} bulk={f >= PLUS ? 1.25 : 1} pump={Math.max(0, Math.sin(f / 5))} />} />
				</Pop>
				<Pop at={CREA - 4} x={720} y={620}>
					<div style={{padding: '30px 40px', borderRadius: 999, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: N}}>créatinine</div>
				</Pop>
				<Pop at={HOMME - 8} x={540} y={830}>
					<NormCard rows={[['homme', '88 – 150 µmol/L'], ['femme', '53 – 115 µmol/L']]} />
				</Pop>
				<Pop at={MONTE - 6} x={330} y={1180}>
					<Live render={() => <InverseGauges k={k} width={420} />} />
				</Pop>
				<Pop at={DFG - 4} x={790} y={1150}>
					<div style={{padding: '16px 26px', borderRadius: 30, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.1em', color: LPI.sky}}>DFG</div>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, color: LPI.paper}}>débit de filtration</div>
						<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 52, color: LPI.paper, opacity: f >= NORMAL - 4 ? 1 : 0, whiteSpace: 'nowrap'}}>≥ 90</div>} />
						<Live render={(f) => <div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 22, color: LPI.sky, opacity: f >= NORMAL - 4 ? 1 : 0, whiteSpace: 'nowrap'}}>mL/min/1,73 m²</div>} />
					</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={CREA} volume={0.15} />
			<Sfx name="buzz" at={MONTE} volume={0.15} />
			<Sfx name="ding" at={NORMAL} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'ACIDE URIQUE ═══════════════════════════════ */
const Beer: React.FC<{size?: number}> = ({size = 100}) => (
	<svg width={size} height={size} viewBox="0 0 100 100">
		<path d="M26 22 H70 V86 Q70 92 64 92 H32 Q26 92 26 86 Z" fill="#F2B632" stroke={N} strokeWidth={5} />
		<path d="M24 14 Q34 4 48 12 Q60 4 72 14 Q76 24 70 26 H26 Q20 24 24 14 Z" fill="#FFFDF5" stroke={N} strokeWidth={5} />
		<path d="M70 38 H82 Q90 38 90 48 V62 Q90 72 82 72 H70" fill="none" stroke={N} strokeWidth={6} />
	</svg>
);

export const Urique: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('urique', 'trois');
	const ACIDE = at('urique', "l'acide");
	const PUR = at('urique', 'purines,');
	const VIANDE = at('urique', 'viande');
	const ABATS = at('urique', 'abats');
	const BIERE = at('urique', 'bière.');
	const CRIST = at('urique', 'cristaux');
	const GOUTTE = at('urique', 'goutte,');
	const ORTEIL = at('urique', 'orteil,');
	const CALC = at('urique', 'calculs');
	const gout = interpolate(frame, [CRIST - 4, GOUTTE + 10], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={3} />
			<Camera punches={[ACIDE + 1, PUR + 1, CRIST + 1, GOUTTE + 1, CALC + 1]} strength={0.03}>
				<Big from={ACIDE - 4} text={"*L'acide* *urique*"} size={110} y={330} />
				<Chip at={PUR - 2} x={540} y={520} tone={LPI.paper} size={34}>
					le déchet des purines
				</Chip>
				<Pop at={VIANDE - 4} x={250} y={680}>
					<IconDot label="viande rouge">
						<MeatIcon size={96} />
					</IconDot>
				</Pop>
				<Chip at={ABATS - 2} x={540} y={680} tone={LPI.paper} size={36}>
					abats
				</Chip>
				<Pop at={BIERE - 4} x={830} y={680}>
					<IconDot label="bière">
						<Beer size={96} />
					</IconDot>
				</Pop>
				<Pop at={CRIST - 6} x={540} y={1000}>
					<Live render={() => <GoutFoot gout={gout} />} />
				</Pop>
				<Chip at={GOUTTE - 2} x={540} y={1190} tone={LPI.pink} size={38}>
					crise de goutte · gros orteil
				</Chip>
				<Chip at={CALC - 2} x={540} y={1300} tone={LPI.paper} size={36}>
					ou calculs dans les reins
				</Chip>
				<Pop at={CALC + 20} x={540} y={1440}>
					<NormCard rows={[['homme', '210 – 420 µmol/L'], ['femme', '150 – 360 µmol/L']]} />
				</Pop>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="pop" at={VIANDE} volume={0.15} />
			<Sfx name="pop" at={BIERE} volume={0.15} />
			<Sfx name="buzz" at={GOUTTE} volume={0.2} />
			<Sfx name="pop" at={ORTEIL} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const UREE = at('fin', 'urée,');
	const CREA = at('fin', 'créatinine,');
	const ACIDE = at('fin', 'acide');
	const RENAL = at('fin', 'rénal.');
	const PROCH = at('fin', 'prochaine');
	const FER = at('fin', 'fer');
	const rows = [
		{t: UREE, title: 'urée', sub: '2,5 – 7,5 mmol/L'},
		{t: CREA, title: 'créatinine + DFG', sub: 'DFG ≥ 90 mL/min/1,73 m²'},
		{t: ACIDE, title: 'acide urique', sub: 'trop haut : goutte, calculs'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3]]} total={3} done />
			<Camera punches={[...rows.map((r) => r.t + 1), PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'Le bilan *rénal*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={440 + i * 190} h={170} badge={String(i + 1)} badgeTone={i ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={RENAL} size={48} />
				))}
				<Confetti at={RENAL} />
				<Pop at={PROCH - 2} x={540} y={1180}>
					<NextCard
						art={
							<Live
								render={(f) => (
									<div style={{transform: `scale(${f >= FER - 4 ? 1 : 0.0001}) rotate(${Math.sin(f / 6) * 5}deg)`}}>
										<Tube size={60} cap={JAUNE} gel level={0.72} serum={1} />
									</div>
								)}
							/>
						}
					>
						le <span style={{color: LPI.pink}}>fer</span> et la ferritine
					</NextCard>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={RENAL} volume={0.22} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
