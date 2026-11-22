// « Le tube bleu : TP et INR » (n° 75, série « les tubes », directives Instagram du 20/11/2026) : sujet + enjeu dès
// l'image 0 (titre, compteur 0/3, le tube bleu qui se vide sous le trait, résultat FAUX, une goutte de sang).
// 1 · le remplissage (citrate = liquide qui empêche le sang de coaguler, dose prévue pour un tube plein : jusqu'au trait,
// sinon trop de citrate → temps faussement allongés) ; 2 · le TP (taux de prothrombine, 70 – 100 % ; bas : foie malade,
// anticoagulant) ; 3 · l'INR (surveille les AVK, ≈ 1 sans traitement, cible le plus souvent 2 – 3 ; trop haut : hémorragie,
// trop bas : caillot). On ne dit pas « 9 sang : 1 citrate » (retiré à la demande dans la n° 61). Pas d'appel à l'action.
// Sources : CLSI H21-A5 (remplissage du tube citraté) ; HAS « Bon usage des AVK » et ANSM (INR cible 2 – 3, 2,5 – 3,5 / 3 – 4,5
// pour certaines valves mécaniques) ; valeurs usuelles du TP 70 – 100 % (référentiels de biologie médicale français).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Live, Note, RowCard, ease} from '../../brand/bold';
import {Stamp} from '../../brand/kit';
import {PillIcon} from '../../brand/icons';
import {FattyLiverIcon} from '../../brand/liver';
import {Camera, Confetti} from '../../brand/motion3';
import {BloodDrop} from '../../brand/nose';
import {Chip, Counter, NextCard, PINK_BG, Pop, SeriesPill, ShortBg, ZoneGauge} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, RedCell, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const BLEU = CAP.citrate;
const Pill = () => <SeriesPill cap={BLEU} label="LE TUBE BLEU · TP · INR" />;
const fr = (t: number, d = 1) => t.toFixed(d).replace('.', ',');

/** Rond d'icône + légende. */
const IconDot: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N, whiteSpace: 'nowrap'}}>{label}</div>
	</div>
);

/** Goutte de sang dans son propre SVG. */
const Drop: React.FC<{r: number}> = ({r}) => (
	<svg width={r * 2.4} height={r * 2.8} viewBox={`${-r * 1.2} ${-r * 1.6} ${r * 2.4} ${r * 2.8}`} style={{overflow: 'visible'}}>
		<BloodDrop r={r} />
	</svg>
);

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

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const COAG = at('intro', 'coagulation.');
	const MAL = at('intro', 'mal');
	const FAUX = at('intro', 'faux…');
	const SAIGNER = at('intro', 'saigner.');
	const LIRE = at('intro', 'lire');
	const level = interpolate(frame, [MAL - 2, MAL + 14], [0.72, 0.4], clamp);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[]} total={3} />
			<Camera punches={[COAG + 1, MAL + 1, FAUX + 1, SAIGNER + 1]} shakes={[FAUX + 3]} strength={0.03}>
				<Big from={-60} text={'Le tube *bleu*\nla *coagulation*'} size={100} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 280, top: 930, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 9) * 3}deg)`}}>
							<Tube size={170} cap={BLEU} label="citrate" level={level} mark={1} />
						</div>
					)}
				/>
				<Chip at={MAL - 2} x={280} y={1250} tone={LPI.pink} size={38}>
					sous le trait ✕
				</Chip>
				{/* le résultat */}
				<Pop at={-12} x={720} y={800}>
					<div style={{padding: '20px 34px', borderRadius: 36, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, letterSpacing: '0.12em', color: LPI.sky}}>BILAN DE COAGULATION</div>
						<Live
							render={(f) => (
								<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 76, color: f >= FAUX - 4 ? LPI.pink : LPI.paper, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
									TP {f >= MAL + 6 ? Math.round(interpolate(f, [MAL + 6, FAUX], [92, 48], clamp)) : 92} %
								</div>
							)}
						/>
					</div>
				</Pop>
				<Stamp at={FAUX} x={720} y={960} text="FAUX !" size={70} />
				<Pop at={SAIGNER - 4} x={720} y={1180}>
					<Live
						render={(f) => (
							<div style={{transform: `translateY(${4 * Math.sin(f / 5)}px)`}}>
								<Drop r={60} />
							</div>
						)}
					/>
				</Pop>
				<Note at={LIRE - 6} y={1450} size={44}>
					tu sais le lire ?
				</Note>
			</Camera>
			<Sfx name="whoosh" at={2} volume={0.12} />
			<Sfx name="pop" at={MAL} volume={0.18} />
			<Sfx name="stamp" at={FAUX} volume={0.3} />
			<Sfx name="buzz" at={SAIGNER} volume={0.2} />
			<Sfx name="ding" at={LIRE} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · LE REMPLISSAGE ═══════════════════════════════ */
export const Remplir: React.FC = () => {
	const frame = useCurrentFrame();
	const UN = at('remplir', 'un');
	const LIQ = at('remplir', 'liquide,');
	const CITRATE = at('remplir', 'citrate,');
	const COAG = at('remplir', 'coaguler.');
	const PLEIN = at('remplir', 'plein');
	const TRAIT = at('remplir', 'trait.');
	const SINON = at('remplir', 'sinon,');
	const TROP = at('remplir', 'trop');
	const ALL = at('remplir', 'allongés.');
	const fill = interpolate(frame, [PLEIN - 4, TRAIT + 4], [0, 0.72], ease);
	const low = interpolate(frame, [SINON, SINON + 14], [0, 0.4], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[UN, 1]]} total={3} />
			<Camera punches={[CITRATE + 1, TRAIT + 1, TROP + 1, ALL + 1]} strength={0.03}>
				<Big from={UN - 2} text={"Jusqu'au *trait*"} size={110} y={330} />
				<Pop at={LIQ - 4} x={300} y={900}>
					<Live render={(f) => <Tube size={150} cap={BLEU} level={fill} mark={f >= PLEIN - 4 ? 1 : 0} additive={interpolate(f, [CITRATE - 2, CITRATE + 10], [0, 1], clamp)} />} />
				</Pop>
				<Chip at={CITRATE} x={300} y={600} tone={LPI.blue} size={36}>
					citrate
				</Chip>
				<Note at={COAG - 6} y={1420} size={36}>
					il empêche le sang de coaguler
				</Note>
				<Pop at={TRAIT} x={300} y={1290}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: LPI.blue}}>✓</div>
				</Pop>
				{/* mal rempli */}
				<Pop at={SINON - 4} x={780} y={900}>
					<Live render={() => <Tube size={150} cap={BLEU} level={low} mark={1} additive={1} bad={frame >= TROP ? 1 : 0} />} />
				</Pop>
				<Chip at={TROP - 2} x={780} y={600} tone={LPI.pink} size={36}>
					trop de citrate
				</Chip>
				<Pop at={ALL - 4} x={780} y={1290}>
					<div style={{padding: '12px 26px', borderRadius: 26, background: LPI.navy, border: `6px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.pink, whiteSpace: 'nowrap'}}>temps ↑ (faux)</div>
				</Pop>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			<Sfx name="pop" at={CITRATE} volume={0.15} />
			<Sfx name="ding" at={TRAIT} volume={0.2} />
			<Sfx name="buzz" at={TROP} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE TP ═══════════════════════════════ */
const TP_ZONES = [
	{to: 70, tone: alpha(LPI.pink, 0.6), label: 'trop bas'},
	{to: 100, tone: LPI.sky, label: 'normal'},
];

export const Tp: React.FC = () => {
	const frame = useCurrentFrame();
	const DEUX = at('tp', 'deux');
	const TP = at('tp', 'tp,');
	const PROTH = at('tp', 'prothrombine.');
	const VITE = at('tp', 'vite.');
	const NORME = at('tp', 'norme');
	const CENT = at('tp', 'cent.');
	const BAS = at('tp', 'bas,');
	const FOIE = at('tp', 'foie');
	const ANTI = at('tp', 'anticoagulant.');
	const v = frame < BAS - 4 ? 85 + 8 * Math.sin(frame / 8) : interpolate(frame, [BAS - 4, BAS + 10], [88, 42], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 1], [DEUX, 2]]} total={3} />
			<Camera punches={[TP + 1, NORME + 1, BAS + 1, FOIE + 1, ANTI + 1]} strength={0.03}>
				<Big from={TP - 4} text={'Le *TP*'} size={130} y={330} />
				<Chip at={PROTH - 4} x={540} y={540} tone={LPI.paper} size={40}>
					taux de prothrombine
				</Chip>
				<Note at={VITE - 8} y={650} size={36}>
					le sang coagule-t-il assez vite ?
				</Note>
				<Pop at={NORME - 6} x={540} y={830}>
					<Live render={() => <ZoneGauge zones={TP_ZONES} min={20} max={100} v={v} ticks={[70, 100]} fmt={(t) => `${t} %`} />} />
				</Pop>
				<Pop at={CENT - 4} x={540} y={1050}>
					<NormCard rows={[['', '70 – 100 %']]} />
				</Pop>
				<Pop at={FOIE - 4} x={330} y={1300}>
					<IconDot label="foie malade">
						<FattyLiverIcon size={110} />
					</IconDot>
				</Pop>
				<Pop at={ANTI - 4} x={750} y={1300}>
					<IconDot label="anticoagulant">
						<PillIcon size={110} />
					</IconDot>
				</Pop>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="ding" at={CENT} volume={0.18} />
			<Sfx name="buzz" at={BAS} volume={0.15} />
			<Sfx name="pop" at={FOIE} volume={0.15} />
			<Sfx name="pop" at={ANTI} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · L'INR ═══════════════════════════════ */
const INR_ZONES = [
	{to: 2, tone: alpha(LPI.pink, 0.55), label: 'caillot'},
	{to: 3, tone: LPI.sky, label: 'cible'},
	{to: 4.5, tone: LPI.pink, label: 'hémorragie'},
];

export const Inr: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('inr', 'trois');
	const INR = at('inr', "l'inr.");
	const AVK = at('inr', 'avk,');
	const WARF = at('inr', 'warfarine.');
	const SANS = at('inr', 'sans');
	const ZERO = at('inr', 'zéro.');
	const SOUS = at('inr', 'sous');
	const CIBLE = at('inr', 'cible');
	const HAUT = at('inr', 'haut');
	const BAS = at('inr', 'bas');
	const v =
		frame < SOUS - 4
			? 1
			: frame < HAUT - 4
				? interpolate(frame, [SOUS - 4, CIBLE + 6], [1, 2.5], ease)
				: frame < BAS - 4
					? interpolate(frame, [HAUT - 4, HAUT + 8], [2.5, 4.1], ease)
					: interpolate(frame, [BAS - 4, BAS + 8], [4.1, 1.5], ease);
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<Pill />
			<Counter steps={[[0, 2], [TROIS, 3]]} total={3} />
			<Camera punches={[INR + 1, AVK + 1, ZERO + 1, CIBLE + 1, HAUT + 1, BAS + 1]} strength={0.03}>
				<Big from={INR - 4} text={"*L'INR*"} size={130} y={330} />
				<Chip at={AVK - 4} x={540} y={540} tone={LPI.blue} size={40}>
					surveille les AVK
				</Chip>
				<Note at={WARF - 4} y={640} size={34}>
					anticoagulants comme la warfarine
				</Note>
				<Pop at={SANS - 6} x={540} y={830}>
					<Live render={() => <ZoneGauge zones={INR_ZONES} min={0.8} max={4.5} v={v} ticks={[1, 2, 3]} fmt={(t) => fr(t, 0)} />} />
				</Pop>
				<Pop at={ZERO - 4} x={540} y={1050}>
					<NormCard rows={[['sans AVK', '≈ 1'], ['sous AVK', '2 – 3 (le plus souvent)']]} />
				</Pop>
				<Pop at={HAUT - 2} x={760} y={1330}>
					<IconDot label="trop haut">
						<Drop r={40} />
					</IconDot>
				</Pop>
				<Pop at={BAS - 2} x={320} y={1330}>
					<IconDot label="trop bas">
						<MiniClot size={120} />
					</IconDot>
				</Pop>
				<Note at={BAS + 30} y={1530} size={28}>
					valve mécanique : cible plus haute, selon la prescription
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="pop" at={AVK} volume={0.15} />
			<Sfx name="ding" at={CIBLE} volume={0.18} />
			<Sfx name="buzz" at={HAUT} volume={0.18} />
			<Sfx name="buzz" at={BAS} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const TRAIT = at('fin', 'trait,');
	const TP = at('fin', 'tp,');
	const INR = at('fin', "l'inr");
	const BASES = at('fin', 'bases.');
	const PROCH = at('fin', 'prochaine');
	const TCA = at('fin', 'tca,');
	const rows = [
		{t: TRAIT, title: "jusqu'au trait", sub: 'sinon : temps faussement allongés'},
		{t: TP, title: 'TP', sub: '70 – 100 %'},
		{t: INR, title: 'INR', sub: '≈ 1 · sous AVK : 2 – 3'},
	];
	return (
		<AbsoluteFill>
			<ShortBg tone={LPI.sky} />
			<Pill />
			<Counter steps={[[0, 3]]} total={3} done />
			<Camera punches={[...rows.map((r) => r.t + 1), PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'Les *bases*'} size={110} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={440 + i * 190} h={170} badge={String(i + 1)} badgeTone={i ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={BASES} size={50} />
				))}
				<Confetti at={BASES} />
				<Pop at={PROCH - 2} x={540} y={1180}>
					<NextCard
						art={
							<Live
								render={(f) => (
									<div style={{transform: `scale(${f >= TCA - 4 ? 1 : 0.0001}) rotate(${Math.sin(f / 6) * 5}deg)`}}>
										<Tube size={60} cap={BLEU} level={0.72} />
									</div>
								)}
							/>
						}
					>
						le <span style={{color: LPI.pink}}>TCA</span>
					</NextCard>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={BASES} volume={0.22} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
