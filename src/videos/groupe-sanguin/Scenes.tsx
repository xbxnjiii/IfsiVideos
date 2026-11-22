// « Le groupe sanguin et les RAI » (n° 70, série « le tube violet », directives Instagram du 20/11/2026) : sujet + enjeu
// dès l'image 0 (titre, compteur 0/4, poche de sang), « une seule erreur… peut être mortelle ». 1 · ABO (antigènes à la
// surface des globules rouges, anticorps contre ceux qu'on n'a pas) ; 2 · rhésus (transfusion, grossesse) ; 3 · en France,
// 2 déterminations sur 2 prélèvements distincts + identitovigilance (vérifier l'identité, étiqueter devant le patient) ;
// 4 · RAI (anticorps irréguliers après transfusion / grossesse ; en général valables 3 jours avant une transfusion).
// Pas d'appel à l'action. Sources : arrêté du 15 mai 2018 (bonnes pratiques d'immuno-hématologie : 2 déterminations sur
// 2 prélèvements distincts ; RAI de moins de 3 jours, ou 21 jours sans antécédent transfusionnel, de grossesse ni de
// greffe dans les 6 derniers mois) ; HAS, « Transfusion de globules rouges homologues » (2014).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Flash, FlatBg, Live, Note, PointTag as PTag, popAt, RowCard, ease} from '../../brand/bold';
import {MomToBe} from '../../brand/diabetes';
import {Microbe} from '../../brand/hands';
import {Stamp} from '../../brand/kit';
import {Camera, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {BLOOD, CAP, RedCell, Tube} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;

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

const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue || tone === LPI.navy ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

const SeriesPill: React.FC = () => (
	<div style={{position: 'absolute', left: 540, top: 96, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 26px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.1em', color: N, whiteSpace: 'nowrap'}}>
		<div style={{width: 18, height: 24, borderRadius: 5, background: VIOLET, border: `3px solid ${N}`}} />
		LE TUBE VIOLET · GROUPE + RAI
	</div>
);

const Counter: React.FC<{steps: [number, number][]; done?: boolean}> = ({steps, done}) => {
	const frame = useCurrentFrame();
	let n = 0;
	let bump = -100;
	for (const [t, v] of steps) if (frame >= t) [n, bump] = [v, t];
	const s = frame >= bump && frame < bump + 20 ? 1 + 0.15 * Math.sin(((frame - bump) / 20) * Math.PI) : 1;
	return (
		<div style={{position: 'absolute', left: 900, top: 250, transform: `translate(-50%, -50%) scale(${s})`, padding: '10px 26px', borderRadius: 30, background: done ? LPI.blue : LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: done ? LPI.paper : N, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
			{n} / 4
		</div>
	);
};

/* ───────────── briques de la vidéo ───────────── */

/** Globule rouge avec ses marqueurs (antigènes) : A = triangles roses, B = carrés bleus, D (rhésus) = ronds bleu nuit. */
const TypedCell: React.FC<{group: 'A' | 'B' | 'AB' | 'O'; rh?: boolean; size?: number}> = ({group, rh = false, size = 200}) => {
	const marks: {a: number; kind: 'A' | 'B' | 'D'}[] = [];
	const n = 8;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2 + 0.2;
		const kind = group === 'A' ? 'A' : group === 'B' ? 'B' : group === 'AB' ? (i % 2 ? 'B' : 'A') : null;
		if (kind) marks.push({a, kind});
	}
	if (rh) for (let i = 0; i < 4; i++) marks.push({a: (i / 4) * Math.PI * 2 + 0.75, kind: 'D'});
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<div style={{position: 'absolute', left: size * 0.1, top: size * 0.1}}>
				<RedCell size={size * 0.8} />
			</div>
			<svg width={size} height={size} viewBox="-100 -100 200 200" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{marks.map((m, i) => {
					const r = m.kind === 'D' ? 84 : 90;
					const x = Math.cos(m.a) * r;
					const y = Math.sin(m.a) * r * 0.86;
					const rot = (m.a * 180) / Math.PI + 90;
					return (
						<g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
							{m.kind === 'A' ? <path d="M0 -14 L12 8 L-12 8 Z" fill={LPI.pink} stroke={N} strokeWidth={3.5} strokeLinejoin="round" /> : null}
							{m.kind === 'B' ? <rect x={-10} y={-10} width={20} height={20} rx={3} fill={LPI.blue} stroke={N} strokeWidth={3.5} /> : null}
							{m.kind === 'D' ? <circle r={9} fill={N} stroke={LPI.paper} strokeWidth={2.5} /> : null}
						</g>
					);
				})}
			</svg>
		</div>
	);
};

/** Anticorps en Y. */
const Antibody: React.FC<{size?: number; tone?: string; rot?: number}> = ({size = 70, tone = LPI.pink, rot = 0}) => (
	<svg width={size} height={size} viewBox="-30 -30 60 60" style={{overflow: 'visible', transform: `rotate(${rot}deg)`}}>
		<path d="M0 24 V2 M0 2 L-16 -20 M0 2 L16 -20" stroke={N} strokeWidth={11} strokeLinecap="round" fill="none" />
		<path d="M0 24 V2 M0 2 L-16 -20 M0 2 L16 -20" stroke={tone} strokeWidth={6} strokeLinecap="round" fill="none" />
	</svg>
);

/** Poche de sang (concentré de globules rouges) avec son étiquette de groupe. */
const BloodBag: React.FC<{width?: number; label?: string; bad?: number}> = ({width = 240, label = 'A+', bad = 0}) => (
	<svg width={width} height={width * 1.45} viewBox="0 0 200 290" style={{overflow: 'visible'}}>
		<path d="M100 0 V40" stroke={N} strokeWidth={8} />
		<rect x={84} y={34} width={32} height={20} rx={6} fill={LPI.paper} stroke={N} strokeWidth={5} />
		<path d="M30 60 Q30 50 40 50 H160 Q170 50 170 60 V250 Q170 280 140 280 H60 Q30 280 30 250 Z" fill={BLOOD} stroke={N} strokeWidth={7} />
		<path d="M44 70 Q44 64 50 64 H70 V262 H58 Q44 262 44 248 Z" fill="#fff" opacity={0.18} />
		<rect x={55} y={120} width={90} height={80} rx={10} fill={bad ? LPI.pink : LPI.paper} stroke={N} strokeWidth={5} />
		<text x={100} y={177} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={46} fill={N}>
			{label}
		</text>
		{bad ? <path d="M40 90 L160 250 M160 90 L40 250" stroke={N} strokeWidth={14} strokeLinecap="round" opacity={bad} /> : null}
	</svg>
);

/** Bracelet d'identification du patient. */
const Bracelet: React.FC<{check?: number}> = ({check = 0}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '18px 28px', borderRadius: 999, background: '#fff', border: `6px solid ${N}`, boxShadow: SHADOW}}>
		<div style={{width: 24, height: 24, borderRadius: 12, background: LPI.blue, border: `4px solid ${N}`}} />
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 34, color: N, lineHeight: 1.1}}>
			MARTIN Jeanne
			<div style={{fontSize: 26, color: alpha(N, 0.7)}}>née le 12/03/1961</div>
		</div>
		<div style={{width: 60, height: 60, borderRadius: 30, background: LPI.blue, border: `4px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 36, transform: `scale(${check})`}}>✓</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ERR = at('intro', 'erreur');
	const TRANS = at('intro', 'transfusion…');
	const MORT = at('intro', 'mortelle');
	const DEUX = at('intro', 'deux');
	const PRISES = at('intro', 'prises');
	const RAI = at('intro', 'rai');
	const wrong = frame >= ERR;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[]} />
			<Camera punches={[ERR + 1, MORT + 1, DEUX + 1, RAI + 1]} shakes={[MORT + 3]} strength={0.03}>
				<Big from={-60} text={'Groupe\n*sanguin*\n+ les *RAI*'} size={100} y={190} />
				<Live
					render={(f) => (
						<div style={{position: 'absolute', left: 290, top: 860, transform: `translate(-50%, -50%) rotate(${Math.sin(f / 10) * 4}deg)`, transformOrigin: '50% 0%'}}>
							<BloodBag width={250} label={wrong ? 'B+' : 'A+'} bad={f >= MORT - 4 ? interpolate(f, [MORT - 4, MORT + 6], [0, 1], clamp) : 0} />
						</div>
					)}
				/>
				{/* le patient du groupe A */}
				<Pop at={-30} x={770} y={780}>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
						<TypedCell group="A" size={220} />
						<div style={{padding: '6px 22px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>patient : A+</div>
					</div>
				</Pop>
				<Chip at={ERR} to={MORT - 4} x={290} y={1170} tone={LPI.pink} size={44}>
					une poche B+ ?!
				</Chip>
				<Stamp at={MORT} x={620} y={1120} text="MORTELLE" size={80} />
				<Flash at={MORT} />
				{[0, 1].map((i) => (
					<Pop key={i} at={(i ? PRISES : DEUX) - 2} x={330 + i * 190} y={1420}>
						<div style={{position: 'relative'}}>
							<Tube size={90} cap={VIOLET} level={0.7} />
							<div style={{position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: 30, background: LPI.blue, border: `5px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 34}}>{i + 1}</div>
						</div>
					</Pop>
				))}
				<Chip at={RAI - 4} x={800} y={1420} tone={LPI.pink} size={56}>
					RAI ?
				</Chip>
			</Camera>
			<Sfx name="buzz" at={ERR} volume={0.2} />
			<Sfx name="stamp" at={MORT} volume={0.45} />
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={PRISES} volume={0.18} />
			<Sfx name="ding" at={RAI} volume={0.2} />
			{TRANS > 0 ? null : null}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 1 · A, B, AB, O ═══════════════════════════════ */
export const Abo: React.FC = () => {
	const UN = at('abo', 'un');
	const A = at('abo', 'a');
	const B = at('abo', 'b');
	const AB = at('abo', 'ab');
	const O = at('abo', 'o');
	const MARQ = at('abo', 'marqueurs');
	const ANTIG = at('abo', 'antigènes');
	const ANTIC = at('abo', 'anticorps');
	const PAS = at('abo', 'pas');
	const groups: {g: 'A' | 'B' | 'AB' | 'O'; t: number}[] = [
		{g: 'A', t: A},
		{g: 'B', t: B},
		{g: 'AB', t: AB},
		{g: 'O', t: O},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[UN, 1]]} />
			<Camera punches={[A + 1, B + 1, AB + 1, O + 1, ANTIG + 1, ANTIC + 1]} strength={0.03}>
				<Big from={UN - 2} text={'*A*, *B*, *AB* ou *O*'} size={104} y={330} />
				{groups.map((c, i) => (
					<Pop key={c.g} at={c.t - 4} x={150 + i * 260} y={700}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
							<TypedCell group={c.g} size={210} />
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 64, color: N}}>{c.g}</div>
						</div>
					</Pop>
				))}
				<PTag at={MARQ} to={ANTIC - 6} x={420} y={980} px={150} py={640}>
					marqueurs = antigènes
				</PTag>
				<Note at={ANTIG + 6} to={ANTIC - 6} y={1060} size={34}>
					à la surface des globules rouges
				</Note>
				{/* exemple : groupe A → anticorps anti-B */}
				<Pop at={ANTIC - 4} x={540} y={1170}>
					<div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '20px 34px', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N, whiteSpace: 'nowrap'}}>groupe A</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>→</div>
						<Live render={(f) => <Antibody size={80} rot={Math.sin(f / 5) * 10} />} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: LPI.blue, whiteSpace: 'nowrap'}}>anti-B</div>
					</div>
				</Pop>
				<Note at={PAS - 6} y={1290} size={36} tone={LPI.pink}>
					contre ceux qu'il n'a pas
				</Note>
			</Camera>
			<Sfx name="pop" at={UN} volume={0.18} />
			{groups.map((c) => (
				<Sfx key={c.g} name="pop" at={c.t - 2} volume={0.18} />
			))}
			<Sfx name="ding" at={ANTIG} volume={0.15} />
			<Sfx name="whoosh" at={ANTIC - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 2 · LE RHÉSUS ═══════════════════════════════ */
export const Rhesus: React.FC = () => {
	const DEUX = at('rhesus', 'deux');
	const RH = at('rhesus', 'rhésus');
	const POS = at('rhesus', 'positif');
	const NEG = at('rhesus', 'négatif');
	const TRANS = at('rhesus', 'transfusion');
	const GROSS = at('rhesus', 'grossesse');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 1], [DEUX, 2]]} />
			<Camera punches={[RH + 1, POS + 1, NEG + 1, TRANS + 1, GROSS + 1]} strength={0.03}>
				<Big from={RH - 4} text={'Le *rhésus*'} size={110} y={330} />
				{[
					{t: POS, rh: true, sign: '+', x: 300},
					{t: NEG, rh: false, sign: '−', x: 780},
				].map((c) => (
					<Pop key={c.sign} at={c.t - 4} x={c.x} y={720}>
						<div style={{position: 'relative'}}>
							<TypedCell group="O" rh={c.rh} size={260} />
							<div style={{position: 'absolute', right: -10, top: -10, width: 90, height: 90, borderRadius: 45, background: c.rh ? LPI.blue : LPI.pink, border: `6px solid ${N}`, color: c.rh ? LPI.paper : N, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 64}}>{c.sign}</div>
						</div>
					</Pop>
				))}
				<Chip at={POS + 6} x={300} y={920} size={36}>
					marqueur D présent
				</Chip>
				<Chip at={NEG + 6} x={780} y={920} size={36}>
					pas de marqueur D
				</Chip>
				<Pop at={TRANS - 4} x={300} y={1240}>
					<BloodBag width={180} label="O−" />
				</Pop>
				<Chip at={TRANS} x={300} y={1470} tone={LPI.blue} size={38}>
					transfusion
				</Chip>
				<Pop at={GROSS - 6} x={780} y={1220}>
					<MomToBe width={260} />
				</Pop>
				<Chip at={GROSS} x={780} y={1470} tone={LPI.pink} size={38}>
					grossesse
				</Chip>
			</Camera>
			<Sfx name="pop" at={DEUX} volume={0.18} />
			<Sfx name="pop" at={POS} volume={0.18} />
			<Sfx name="pop" at={NEG} volume={0.18} />
			<Sfx name="whoosh" at={TRANS - 4} volume={0.15} />
			<Sfx name="whoosh" at={GROSS - 6} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 3 · DEUX DÉTERMINATIONS ═══════════════════════════════ */
export const Deux: React.FC = () => {
	const frame = useCurrentFrame();
	const TROIS = at('deux', 'trois');
	const FRANCE = at('deux', 'france');
	const DET = at('deux', 'déterminations');
	const PREL = at('deux', 'prélèvements');
	const MOMENTS = at('deux', 'moments');
	const IDENT = at('deux', "l'identité");
	const ETIQ = at('deux', 'étiquettes');
	const stick = interpolate(frame, [ETIQ - 2, ETIQ + 12], [0, 1], ease);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 2], [TROIS, 3]]} />
			<Camera punches={[DET + 1, PREL + 1, MOMENTS + 1, IDENT + 1, ETIQ + 1]} strength={0.03}>
				<Big from={DET - 6} text={'*2* *déterminations*'} size={96} y={330} />
				<Chip at={FRANCE - 2} x={540} y={470} tone={LPI.blue} size={36}>
					en France
				</Chip>
				{[0, 1].map((i) => (
					<Pop key={i} at={(i ? MOMENTS : PREL) - 4} x={330 + i * 420} y={860}>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
							<div style={{position: 'relative'}}>
								<Tube size={130} cap={VIOLET} level={0.7} label={i === 0 || stick > 0.99 ? 'MARTIN J.' : undefined} />
								<div style={{position: 'absolute', left: -40, top: -30, width: 72, height: 72, borderRadius: 36, background: LPI.blue, border: `5px solid ${N}`, color: LPI.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40}}>{i + 1}</div>
							</div>
							<div style={{padding: '6px 20px', borderRadius: 999, background: LPI.paper, border: `5px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 36, color: N}}>🕗 {i ? '14 h' : '8 h'}</div>
						</div>
					</Pop>
				))}
				<Chip at={MOMENTS + 4} x={540} y={1250} tone={LPI.pink} size={40}>
					2 prélèvements · 2 moments
				</Chip>
				<Pop at={IDENT - 4} x={540} y={1390}>
					<Live render={(f) => <Bracelet check={f >= IDENT + 10 ? popAt(f, IDENT + 10) : 0} />} />
				</Pop>
				{/* l'étiquette vole sur le 2e tube, devant le patient */}
				<Live
					render={(f) => {
						if (f < ETIQ - 2 || stick >= 1) return null;
						return (
							<div style={{position: 'absolute', left: 540 + 210 * stick, top: 1390 - 520 * stick, transform: `translate(-50%, -50%) rotate(${(1 - stick) * -14}deg)`, padding: '8px 16px', borderRadius: 8, background: '#fff', border: `4px solid ${N}`, fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: N}}>
								MARTIN J.
							</div>
						);
					}}
				/>
				<Note at={ETIQ + 4} y={1500} size={34}>
					étiquette posée devant le patient
				</Note>
			</Camera>
			<Sfx name="pop" at={TROIS} volume={0.18} />
			<Sfx name="pop" at={PREL - 4} volume={0.18} />
			<Sfx name="pop" at={MOMENTS - 4} volume={0.18} />
			<Sfx name="ding" at={IDENT + 10} volume={0.18} />
			<Sfx name="whoosh" at={ETIQ - 2} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ 4 · LES RAI ═══════════════════════════════ */
export const Rai: React.FC = () => {
	const QUATRE = at('rai', 'quatre');
	const RAI = at('rai', 'rai');
	const RECH = at('rai', 'recherche');
	const CHERCH = at('rai', 'cherchent');
	const ANTIC = at('rai', 'anticorps');
	const TRANS = at('rai', 'transfusion');
	const GROSS = at('rai', 'grossesse');
	const VAL = at('rai', 'valables');
	const JOURS = at('rai', 'jours');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<SeriesPill />
			<Counter steps={[[0, 3], [QUATRE, 4]]} />
			<Camera punches={[RAI + 1, CHERCH + 1, ANTIC + 1, VAL + 1, JOURS + 1]} strength={0.03}>
				<Big from={RAI - 4} text={'Les *RAI*'} size={120} y={330} />
				<Note at={RECH - 2} y={490} size={34}>
					recherche d'agglutinines irrégulières
				</Note>
				{/* d'autres anticorps qui s'accrochent au globule rouge */}
				<Pop at={CHERCH - 4} x={540} y={790}>
					<Live
						render={(f) => (
							<div style={{position: 'relative', width: 420, height: 320}}>
								<div style={{position: 'absolute', left: 110, top: 60}}>
									<TypedCell group="A" rh size={200} />
								</div>
								{[0, 1, 2, 3].map((i) => {
									const k = interpolate(f, [ANTIC - 4 + i * 4, ANTIC + 12 + i * 4], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
									const a = (i / 4) * Math.PI * 2 + 0.5;
									const r = 220 - 100 * k;
									return (
										<div key={i} style={{position: 'absolute', left: 210 + Math.cos(a) * r - 35, top: 160 + Math.sin(a) * r * 0.75 - 35, opacity: k > 0 ? 1 : 0}}>
											<Antibody size={70} rot={(a * 180) / Math.PI - 90} />
										</div>
									);
								})}
							</div>
						)}
					/>
				</Pop>
				<Chip at={ANTIC} to={VAL - 6} x={540} y={1010} tone={LPI.pink} size={40}>
					d'autres anticorps
				</Chip>
				<Pop at={TRANS - 4} x={290} y={1170}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<BloodBag width={90} label="" />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>transfusion</div>
					</div>
				</Pop>
				<Pop at={GROSS - 4} x={780} y={1170}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<MomToBe width={110} />
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 38, color: N}}>grossesse</div>
					</div>
				</Pop>
				<Pop at={VAL - 4} x={540} y={1420}>
					<div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '20px 34px', borderRadius: 40, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW}}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 72, color: LPI.pink}}>3 j</div>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, lineHeight: 1.1}}>
							valables avant
							<br />
							une transfusion
						</div>
					</div>
				</Pop>
				<Note at={JOURS + 10} y={1550} size={28}>
					en général (72 h)
				</Note>
			</Camera>
			<Sfx name="pop" at={QUATRE} volume={0.18} />
			<Sfx name="whoosh" at={ANTIC} volume={0.15} />
			<Sfx name="pop" at={TRANS - 4} volume={0.15} />
			<Sfx name="pop" at={GROSS - 4} volume={0.15} />
			<Sfx name="ding" at={VAL} volume={0.2} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const G = at('fin', 'groupe');
	const RH = at('fin', 'rhésus');
	const DET = at('fin', 'déterminations');
	const RAI = at('fin', 'rai');
	const SEC = at('fin', 'sécurisée');
	const PROCH = at('fin', 'prochaine');
	const VIR = at('fin', 'virale');
	const rows = [
		{t: G, title: 'groupe ABO'},
		{t: RH, title: 'rhésus'},
		{t: DET, title: '2 déterminations'},
		{t: RAI, title: 'RAI récentes'},
	];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<SeriesPill />
			<Counter steps={[[0, 4]]} done />
			<Camera punches={[...rows.map((r) => r.t + 1), SEC + 1, PROCH + 1]} strength={0.025}>
				<Big from={-2} text={'Avant de\n*transfuser*'} size={104} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={470 + i * 150} h={130} badge={String(i + 1)} badgeTone={LPI.sky} title={r.title} check={r.t + 8} size={48} />
				))}
				<Stamp at={SEC} x={540} y={1110} text="SÉCURISÉE" size={80} />
				<Confetti at={SEC} />
				<Pop at={PROCH - 2} x={540} y={1300}>
					<div style={{width: 900, boxSizing: 'border-box', borderRadius: 34, background: LPI.navy, border: `6px solid ${N}`, boxShadow: SHADOW, padding: '24px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
						<div style={{flex: 1}}>
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 28, letterSpacing: '0.12em', color: LPI.sky}}>PROCHAINE VIDÉO</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 56, color: LPI.paper, lineHeight: 1.1}}>
								la charge <span style={{color: LPI.pink}}>virale</span>
							</div>
						</div>
						<Live render={(f) => <div style={{transform: `scale(${f >= VIR - 4 ? popAt(f, VIR - 4) : 0.0001})`}}><Microbe size={120} tone={LPI.pink} /></div>} />
					</div>
				</Pop>
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="stamp" at={SEC} volume={0.35} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};
