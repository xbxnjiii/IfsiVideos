// « Le tube jaune : le bilan rénal » (n° 64, série « les tubes », look 2026) : sur le contenu et le tableau de normes fournis
// par le propriétaire. Accroche directe : le tube jaune + le rein qui filtre le sang dès l'image 0, « plus de trente fois par
// jour », le rein fatigue et les déchets restent dans le sang sans que ça se voie, puis le tube jaune et ses trois résultats.
// Puis les reins (filtres), l'urée (protéines → acides aminés → ammoniac → foie → urée → reins), la créatinine (déchet des
// muscles, normes homme / femme, insuffisance rénale aiguë / chronique), le DFG (débit par minute, calculé à partir de la
// créatinine, créatinine ↑ = DFG ↓), les 5 stades, récap + « le tube jaune n'a pas fini de parler ».
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, Flash, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, RowCard} from '../../brand/bold';
import {KidneysIcon} from '../../brand/diabetes';
import {Stopwatch} from '../../brand/episode';
import {Battery} from '../../brand/heartfail';
import {LiverShape} from '../../brand/liver';
import {Camera, Confetti} from '../../brand/motion3';
import {DialysisMachine, InverseGauges, KidneyFilter, Molecule, MuscleArm, ProteinChain, StageLadder, TrendCurve} from '../../brand/renal';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {CAP, NormCard, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const YELLOW = CAP.gel;
const NORM_Y = 1480;

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

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number; glyph?: string}> = ({at: t0, to, up = true, x, y, size = 100, glyph}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: glyph ? `translateX(${8 * Math.sin(f / 4)}px)` : `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{glyph ?? (up ? '↑' : '↓')}</div>} />
	</Pop>
);

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 40}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const Liver: React.FC<{size?: number}> = ({size = 240}) => (
	<svg width={size} height={size * 0.75} viewBox="0 5 100 75" style={{overflow: 'visible'}}>
		<LiverShape x={50} y={42} s={1.05} fill={alpha(LPI.pink, 0.9)} />
	</svg>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const NET = at('intro', 'nettoient');
	const TRENTE = at('intro', 'trente');
	const JOUR = at('intro', 'jour');
	const FAT = at('intro', 'fatiguer');
	const VOIT = at('intro', 'voit');
	const COMM = at('intro', 'comment');
	const TUBE = at('intro', 'tube');
	const TROIS = at('intro', 'trois');
	const UREE = at('intro', "l'uree");
	const CREAT = at('intro', 'creatinine');
	const DFG = at('intro', 'dfg');
	const BILAN = at('intro', 'bilan');
	const kOut = TUBE - 6;
	const n = Math.round(interpolate(frame, [TRENTE - 8, JOUR], [0, 30], clamp));
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.sky, 0.9)} />
			<Camera punches={[TRENTE + 1, FAT + 1, COMM + 1, TUBE + 1, BILAN + 1]} strength={0.03}>
				{/* le rein qui filtre */}
				<Fly at={-14} out={kOut} x={640} y={900} from="right" to="top">
					<Live
						render={(f) => {
							const k = interpolate(f, [FAT, FAT + 30], [0, 1], ease);
							return <KidneyFilter width={700} filter={1 - k} pile={k} tired={k} glow={1 - k} />;
						}}
					/>
				</Fly>
				{/* le tube jaune, petit à gauche puis au centre */}
				<Fly at={-14} x={140} y={930} from="left" to="bottom" move={[{at: TUBE - 4, x: 540, y: 860, s: 1.5, dur: 16}]}>
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 2}deg)`}}><Tube size={150} cap={YELLOW} gel level={0.74} serum={1} label="sec" /></div>} />
				</Fly>
				<Pop at={TRENTE - 6} to={kOut} x={760} y={480}>
					<div style={{padding: '16px 34px', borderRadius: 40, background: LPI.paper, border: `7px solid ${N}`, boxShadow: SHADOW, textAlign: 'center'}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 100, color: N, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>× {n}</div>
						<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 32, color: alpha(N, 0.8)}}>par jour</div>
					</div>
				</Pop>
				<Chip at={VOIT - 2} to={kOut} x={600} y={1400} tone={LPI.pink} size={40}>
					aucun signe…
				</Chip>
				<Pop at={COMM} to={kOut} x={300} y={500}>
					<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 220, color: LPI.blue, lineHeight: 1, transform: `rotate(${6 * Math.sin(f / 5)}deg)`, textShadow: `6px 6px 0 ${N}`}}>?</div>} />
				</Pop>
				{/* les trois résultats */}
				<Chip at={UREE} x={250} y={1320} tone={LPI.sky} size={46}>
					urée
				</Chip>
				<Chip at={CREAT} x={600} y={1430} tone={LPI.pink} size={46}>
					créatinine
				</Chip>
				<Chip at={DFG} x={880} y={1320} tone={LPI.blue} size={46}>
					DFG
				</Chip>
				<Pop at={TROIS - 2} to={UREE - 2} x={540} y={1360}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N}}>3</div>
				</Pop>
				<Big from={BILAN - 2} text={'Le *bilan* *rénal*'} size={120} />
			</Camera>
			<Flash at={FAT + 20} max={0.25} />
			<Sfx name="whoosh" at={NET} volume={0.15} />
			{[0, 1, 2, 3, 4].map((i) => (
				<Sfx key={i} name="tick" at={TRENTE - 8 + i * 4} volume={0.1} />
			))}
			<Sfx name="buzz" at={FAT + 20} volume={0.2} />
			<Sfx name="whoosh" at={TUBE - 4} volume={0.2} />
			<Sfx name="pop" at={UREE} volume={0.18} />
			<Sfx name="pop" at={CREAT} volume={0.18} />
			<Sfx name="pop" at={DFG} volume={0.18} />
			<Sfx name="ding" at={BILAN} volume={0.25} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES REINS, DES FILTRES ═══════════════════════════════ */
export const Reins: React.FC = () => {
	const FILT = at('reins', 'filtres');
	const GARD = at('reins', 'gardent');
	const UTILE = at('reins', 'utile');
	const REJ = at('reins', 'rejettent');
	const URINE = at('reins', "l'urine");
	const MAL = at('reins', 'mal');
	const ACC = at('reins', "s'accumulent");
	const MES = at('reins', 'mesure');
	const JAUNE = at('reins', 'jaune');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[FILT + 1, MAL + 1, ACC + 1, JAUNE + 1]} strength={0.03}>
				<Big from={-2} text={'Les *reins*'} size={120} />
				<Pop at={2} x={540} y={790}>
					<Live
						render={(f) => {
							const k = interpolate(f, [MAL, MAL + 24], [0, 1], ease);
							const p = interpolate(f, [MAL + 10, ACC + 16], [0, 1], ease);
							return <KidneyFilter width={900} filter={1 - k} pile={p} tired={k} glow={f >= FILT && f < MAL ? 1 : 0} />;
						}}
					/>
				</Pop>
				<Chip at={FILT} to={MAL - 4} x={540} y={380} tone={LPI.sky} size={44}>
					des filtres
				</Chip>
				<PTag at={UTILE - 2} to={MAL - 4} x={260} y={440} px={190} py={640}>
					utile : on le garde
				</PTag>
				<PTag at={URINE - 4} to={MAL - 4} x={800} y={1200} px={580} py={1150}>
					déchets → urine
				</PTag>
				<Chip at={MAL} x={540} y={380} tone={LPI.pink} size={44}>
					ils filtrent mal…
				</Chip>
				<PTag at={ACC} x={540} y={490} px={400} py={640}>
					les déchets restent dans le sang
				</PTag>
				<Pop at={MES - 6} x={170} y={1400}>
					<Tube size={110} cap={YELLOW} gel level={0.74} serum={1} />
				</Pop>
				<Note at={JAUNE - 4} y={1400} x={620} size={40} tone={LPI.paper}>
					on les mesure dans le tube jaune
				</Note>
			</Camera>
			<Sfx name="pop" at={FILT} volume={0.15} />
			<Sfx name="pop" at={UTILE} volume={0.12} />
			<Sfx name="pop" at={URINE} volume={0.12} />
			<Sfx name="buzz" at={MAL} volume={0.15} />
			<Sfx name="ding" at={JAUNE} volume={0.18} />
			<Sfx name="whoosh" at={REJ} volume={0.08} />
			<Sfx name="pop" at={GARD} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'URÉE ═══════════════════════════════ */
export const Uree: React.FC = () => {
	const UREE = at('uree', "l'uree");
	const DECH = at('uree', 'dechet');
	const PROT = at('uree', 'proteines');
	const FAITES = at('uree', 'faites');
	const AMIN = at('uree', 'amines');
	const AMMO = at('uree', "l'ammoniac");
	const FOIE = at('uree', 'foie');
	const TRANS = at('uree', 'transforme');
	const EN = at('uree', 'uree', 1);
	const REINS = at('uree', 'reins');
	const URINE = at('uree', "l'urine");
	const HAUTE = at('uree', 'haute');
	const DESH = at('uree', 'deshydratation');
	const IR = at('uree', 'insuffisance');
	const HEMO = at('uree', 'hemorragie');
	const SAIGN = at('uree', 'saignement');
	const pathOut = HAUTE - 6;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[UREE + 1, PROT + 1, AMMO + 1, FOIE + 1, REINS + 1, HAUTE + 1]} strength={0.03}>
				<Big from={-2} text={"*L'urée*"} size={130} />
				<Note at={DECH} to={pathOut} y={330} size={42} tone={LPI.pink}>
					le déchet final des protéines
				</Note>
				{/* protéines → acides aminés */}
				<Pop at={PROT - 4} to={pathOut} x={540} y={520}>
					<Live render={(f) => <ProteinChain width={620} split={interpolate(f, [AMIN - 4, AMIN + 14], [0, 1], ease)} />} />
				</Pop>
				<Chip at={FAITES} to={pathOut} x={540} y={650} size={34}>
					acides aminés = les briques des protéines
				</Chip>
				{/* ammoniac → foie → urée */}
				<Pop at={AMMO - 2} to={pathOut} x={190} y={860}>
					<Molecule label="NH₃" tone={LPI.sky} size={150} />
				</Pop>
				<PTag at={AMMO + 6} to={pathOut} x={190} y={1000} px={190} py={940} size={30}>
					ammoniac
				</PTag>
				<Arrow at={FOIE - 2} to={pathOut} glyph="→" x={330} y={860} size={80} />
				<Pop at={FOIE} to={pathOut} x={540} y={860}>
					<Liver size={260} />
				</Pop>
				<PTag at={TRANS} to={pathOut} x={540} y={1000} px={540} py={930} size={30}>
					le foie
				</PTag>
				<Arrow at={EN - 2} to={pathOut} glyph="→" x={740} y={860} size={80} />
				<Pop at={EN} to={pathOut} x={890} y={860}>
					<Molecule label="urée" tone={LPI.pink} size={150} />
				</Pop>
				{/* reins → urine */}
				<Arrow at={REINS - 4} to={pathOut} up={false} x={890} y={1010} size={80} />
				<Pop at={REINS} to={pathOut} x={880} y={1160}>
					<KidneysIcon size={220} />
				</Pop>
				<Chip at={URINE} to={pathOut} x={560} y={1150} size={36}>
					éliminée dans l'urine
				</Chip>
				{/* trop haute */}
				<Arrow at={HAUTE} x={150} y={520} size={130} />
				<Chip at={HAUTE + 2} x={540} y={520} tone={LPI.pink} size={46}>
					urée trop haute ?
				</Chip>
				<Chip at={DESH} x={540} y={700} size={40}>
					déshydratation
				</Chip>
				<Chip at={IR} x={540} y={830} size={40}>
					insuffisance rénale
				</Chip>
				<Chip at={HEMO} x={540} y={960} size={40}>
					hémorragie digestive
				</Chip>
				<Note at={SAIGN} y={1050} size={32} tone={LPI.sky}>
					un saignement dans le tube digestif
				</Note>
				<Pop at={URINE + 12} x={540} y={NORM_Y}>
					<NormCard rows={[['', '2,5 – 7,5 mmol/L']]} />
				</Pop>
			</Camera>
			<Sfx name="pop" at={PROT} volume={0.15} />
			<Sfx name="whoosh" at={AMIN} volume={0.12} />
			<Sfx name="pop" at={AMMO} volume={0.15} />
			<Sfx name="pop" at={FOIE} volume={0.15} />
			<Sfx name="pop" at={EN} volume={0.15} />
			<Sfx name="pop" at={REINS} volume={0.15} />
			<Sfx name="buzz" at={HAUTE} volume={0.15} />
			<Sfx name="pop" at={DESH} volume={0.12} />
			<Sfx name="pop" at={IR} volume={0.12} />
			<Sfx name="pop" at={HEMO} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA CRÉATININE ═══════════════════════════════ */
export const Creat: React.FC = () => {
	const MUSC = at('creat', 'muscles');
	const CREATINE = at('creat', 'creatine');
	const ENERG = at('creat', 'energie');
	const REINS = at('creat', 'reins');
	const ELIM = at('creat', "l'eliminent");
	const PLUS = at('creat', 'plus');
	const FAB = at('creat', 'fabrique');
	const NORMES = at('creat', 'normes');
	const HOMME = at('creat', "l'homme");
	const CREAT2 = at('creat', 'creatinine', 2);
	const MONTE = at('creat', 'monte');
	const AIGUE = at('creat', 'aigue');
	const COUP = at('creat', 'coup');
	const CHRON = at('creat', 'chronique');
	const LENT = at('creat', 'lentement');
	const aOut = PLUS - 6;
	const bOut = CREAT2 - 6;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[MUSC + 1, CREATINE + 1, PLUS + 1, HOMME + 1, MONTE + 1, AIGUE + 1, CHRON + 1]} strength={0.03}>
				<Big from={-2} text={'La *créatinine*'} size={112} />
				{/* A : déchet des muscles */}
				<Pop at={MUSC - 4} to={aOut} x={280} y={640}>
					<Live render={(f) => <MuscleArm size={420} pump={Math.max(0, Math.sin(f / 5))} />} />
				</Pop>
				<Chip at={MUSC} to={aOut} x={720} y={460} tone={LPI.pink} size={40}>
					un déchet des muscles
				</Chip>
				<Pop at={CREATINE - 2} to={aOut} x={720} y={650}>
					<Live render={(f) => <Battery level={interpolate(f, [CREATINE, ENERG + 10], [0.15, 1], clamp)} width={260} />} />
				</Pop>
				<Note at={CREATINE + 4} to={aOut} y={800} x={720} size={34}>
					créatine = l'énergie du muscle
				</Note>
				<Arrow at={REINS - 6} to={aOut} up={false} x={540} y={940} size={90} />
				<Pop at={REINS} to={aOut} x={540} y={1120}>
					<KidneysIcon size={260} />
				</Pop>
				<Chip at={ELIM} to={aOut} x={540} y={1290} size={38}>
					éliminée par les reins
				</Chip>
				{/* B : plus de muscles = plus de créatinine */}
				<Pop at={PLUS} to={bOut} x={290} y={700}>
					<MuscleArm size={320} bulk={0.75} />
				</Pop>
				<Pop at={PLUS + 8} to={bOut} x={770} y={660}>
					<MuscleArm size={440} bulk={1.25} />
				</Pop>
				<Chip at={FAB} to={bOut} x={540} y={980} tone={LPI.sky} size={38}>
					+ de muscles = + de créatinine
				</Chip>
				<Chip at={HOMME - 2} to={bOut} x={540} y={1100} size={36}>
					normes plus hautes chez l'homme
				</Chip>
				{/* C : la créatinine monte */}
				<Arrow at={CREAT2} x={150} y={520} size={130} />
				<Chip at={MONTE} x={560} y={520} tone={LPI.pink} size={44}>
					insuffisance rénale
				</Chip>
				<Pop at={AIGUE - 2} x={290} y={830}>
					<Live render={(f) => <TrendCurve mode="aigue" k={interpolate(f, [AIGUE, AIGUE + 26], [0, 1], clamp)} width={440} />} />
				</Pop>
				<Chip at={AIGUE} x={290} y={1040} tone={LPI.pink} size={38}>
					aiguë
				</Chip>
				<Note at={COUP - 4} y={1120} x={290} size={28}>
					d'un coup
				</Note>
				<Pop at={CHRON - 2} x={790} y={830}>
					<Live render={(f) => <TrendCurve mode="chronique" k={interpolate(f, [CHRON, LENT + 20], [0, 1], clamp)} width={440} />} />
				</Pop>
				<Chip at={CHRON} x={790} y={1040} tone={LPI.sky} size={38}>
					chronique
				</Chip>
				<Note at={LENT - 4} y={1120} x={790} size={28}>
					lentement
				</Note>
				<Pop at={NORMES} x={540} y={NORM_Y - 30}>
					<NormCard rows={[['Homme', '88 – 150 µmol/L'], ['Femme', '53 – 115 µmol/L']]} />
				</Pop>
			</Camera>
			<Sfx name="pop" at={MUSC} volume={0.15} />
			<Sfx name="ding" at={ENERG} volume={0.12} />
			<Sfx name="pop" at={REINS} volume={0.15} />
			<Sfx name="pop" at={PLUS} volume={0.12} />
			<Sfx name="pop" at={PLUS + 8} volume={0.12} />
			<Sfx name="pop" at={NORMES} volume={0.15} />
			<Sfx name="buzz" at={MONTE} volume={0.15} />
			<Sfx name="whoosh" at={AIGUE} volume={0.12} />
			<Sfx name="whoosh" at={CHRON} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE DFG ═══════════════════════════════ */
export const Dfg: React.FC = () => {
	const frame = useCurrentFrame();
	const DEBIT = at('dfg', 'debit');
	const QUANT = at('dfg', 'quantite');
	const CHAQUE = at('dfg', 'chaque');
	const MINUTE = at('dfg', 'minute');
	const MEILL = at('dfg', 'meilleur');
		const CALC = at('dfg', 'calcule');
	const CREAT = at('dfg', 'creatinine');
	const RETIENS = at('dfg', 'retiens');
	const MOINS = at('dfg', 'moins');
	const MONTE = at('dfg', 'monte');
	const BAISSE = at('dfg', 'baisse');
	const fOut = CALC - 6;
	const swK = interpolate(frame, [CHAQUE, MINUTE + 30], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[DEBIT + 1, MINUTE + 1, MEILL + 1, CALC + 1, RETIENS + 1, MONTE + 1, BAISSE + 1]} strength={0.03}>
				<Big from={-2} text={'Le *DFG*'} size={140} />
				<Pop at={DEBIT} x={540} y={390}>
					<div style={{display: 'flex', gap: 14, fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>
						{['Débit', 'Filtration', 'Glomérulaire'].map((w) => (
							<span key={w} style={{padding: '8px 18px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`}}>
								<span style={{color: LPI.blue}}>{w.charAt(0)}</span>
								{w.slice(1)}
							</span>
						))}
					</div>
				</Pop>
				<Pop at={QUANT - 4} to={fOut} x={540} y={790}>
					<KidneyFilter width={760} glow={1} />
				</Pop>
				<Pop at={CHAQUE - 2} to={MEILL - 4} x={540} y={1250}>
					<Stopwatch progress={swK} count={Math.round(swK * 60)} size={230} label="1 minute" />
				</Pop>
				<Chip at={MEILL} to={fOut} x={540} y={1330} tone={LPI.pink} size={42}>
					le meilleur reflet des reins
				</Chip>
				{/* calculé à partir de la créatinine */}
				<Chip at={CALC} x={230} y={640} tone={LPI.pink} size={44}>
					créatinine
				</Chip>
				<Arrow at={CALC + 6} glyph="→" x={470} y={640} size={90} />
				<Pop at={CREAT} x={600} y={640}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: N, padding: '10px 20px', borderRadius: 22, background: LPI.paper, border: `5px solid ${N}`}}>calcul</div>
				</Pop>
				<Arrow at={CREAT + 4} glyph="→" x={730} y={640} size={90} />
				<Chip at={CREAT + 8} x={880} y={640} tone={LPI.blue} size={44}>
					DFG
				</Chip>
				{/* créatinine ↑ DFG ↓ */}
				<Chip at={MOINS - 4} x={540} y={820} size={38}>
					les reins filtrent moins bien…
				</Chip>
				<Pop at={RETIENS} x={540} y={1180}>
					<Live render={(f) => <InverseGauges width={640} k={interpolate(f, [MONTE - 6, BAISSE + 10], [0, 1], ease)} />} />
				</Pop>
				<Note at={BAISSE + 4} y={1460} size={40} tone={LPI.pink}>
					créatinine ↑ = DFG ↓
				</Note>
			</Camera>
			<Sfx name="pop" at={DEBIT} volume={0.15} />
			{[0, 1, 2, 3].map((i) => (
				<Sfx key={i} name="tick" at={CHAQUE + i * 8} volume={0.1} />
			))}
			<Sfx name="ding" at={MEILL} volume={0.15} />
			<Sfx name="pop" at={CALC} volume={0.15} />
			<Sfx name="pop" at={CREAT + 8} volume={0.15} />
			<Sfx name="whoosh" at={MONTE} volume={0.12} />
			<Sfx name="ding" at={BAISSE + 4} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 5 STADES ═══════════════════════════════ */
export const Stades: React.FC = () => {
	const frame = useCurrentFrame();
	const CLASS = at('stades', 'classer');
	const S = [1, 2, 3, 4, 5].map((k) => at('stades', 'stade', k));
	const PROT = at('stades', 'proteines');
	const DIAL = at('stades', 'dialyse');
	const MACH = at('stades', 'machine');
	const cur = interpolate(frame, [S[0], S[1], S[1] + 1, S[2], S[2] + 1, S[3], S[3] + 1, S[4], S[4] + 1], [0, 0, 1, 1, 2, 2, 3, 3, 4], clamp);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[...S.map((t) => t + 1), DIAL + 1]} strength={0.025}>
				<Big from={-2} text={'Les *5* *stades*'} size={116} />
				<Note at={CLASS} y={330} size={32}>
					maladie rénale chronique · DFG en mL/min/1,73 m²
				</Note>
				<Pop at={S[0] - 4} x={540} y={810}>
					<Live render={(f) => <StageLadder width={940} lit={S.map((t) => t - 2)} cur={f < S[0] ? -2 : cur} />} />
				</Pop>
				<Note at={PROT - 4} to={S[1] - 4} y={1290} size={32} tone={LPI.sky}>
					ex. : des protéines dans les urines
				</Note>
				<Pop at={DIAL - 4} x={790} y={1330}>
					<DialysisMachine size={300} />
				</Pop>
				<Chip at={DIAL} x={330} y={1300} tone={LPI.pink} size={44}>
					dialyse
				</Chip>
				<Note at={MACH} y={1400} x={330} size={28}>
					une machine filtre le sang
				</Note>
			</Camera>
			<Flash at={S[4] + 2} max={0.2} />
			{S.map((t) => (
				<Sfx key={t} name="pop" at={t} volume={0.15} />
			))}
			<Sfx name="buzz" at={S[4] + 2} volume={0.18} />
			<Sfx name="whoosh" at={DIAL} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const JAUNE = at('fin', 'jaune');
	const UREE = at('fin', "l'uree");
	const CREAT = at('fin', 'creatinine');
	const DFG = at('fin', 'dfg');
	const TUBE2 = at('fin', 'tube', 2);
	const PARLER = at('fin', 'parler');
	const SUITE = at('fin', 'suite');
	const out = TUBE2 - 6;
	const rows = [
		{t: JAUNE, title: 'Tube jaune → le bilan rénal'},
		{t: UREE, title: 'Urée : le déchet des protéines'},
		{t: CREAT, title: 'Créatinine : le déchet des muscles'},
		{t: DFG, title: 'DFG : les reins filtrent-ils bien ?'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[...rows.map((r) => r.t + 1), TUBE2 + 1, SUITE + 1]} strength={0.025}>
				<Big from={-2} to={out} text={'On *récapitule*'} size={116} />
				{rows.map((r, i) => (
					<Live key={r.title} render={(f) => (f > out + 10 ? null : <div style={{opacity: interpolate(f, [out, out + 8], [1, 0], clamp)}}><RowCard at={r.t - 2} y={420 + i * 170} h={140} badge={String(i + 1)} title={r.title} check={r.t + 10} size={42} /></div>)} />
				))}
				<Big from={TUBE2} text={'Le tube *jaune*'} size={120} />
				<Fly at={TUBE2} x={540} y={800} from="bottom" to="bottom">
					<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 3}deg)`}}><Tube size={170} cap={YELLOW} gel level={0.74} serum={1} label="sec" /></div>} />
				</Fly>
				<Chip at={TUBE2 + 8} x={250} y={620} tone={LPI.paper} size={40}>
					ionogramme ✓
				</Chip>
				<Chip at={TUBE2 + 14} x={830} y={620} tone={LPI.paper} size={40}>
					bilan rénal ✓
				</Chip>
				<Chip at={PARLER - 2} x={540} y={1180} tone={LPI.pink} size={48}>
					et la suite… ?
				</Chip>
				<Note at={SUITE + 2} y={1320} size={52} tone={LPI.paper}>
					la suite arrive bientôt !
				</Note>
			</Camera>
			<Confetti at={SUITE} />
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.15} />
			))}
			<Sfx name="ding" at={SUITE} volume={0.25} />
		</AbsoluteFill>
	);
};
