// « Le tube violet » v2 (n° 62, série « les tubes », look 2026) : on parle directement du sujet. Accroche : le tube
// violet en grand dès l'image 0, les cellules en sortent (rouges, blancs, plaquettes), « c'est la NFS », la fiche se
// déroule ligne par ligne. Puis la NFS (compter et étudier, diagnostic et suivi, l'EDTA), et chaque ligne avec sa carte
// de normes adultes (tableau fourni par le propriétaire) : hématies, hémoglobine, hématocrite, VGM, plaquettes,
// leucocytes, formule (PNN, PNE, PNB), lymphocytes et monocytes ; récap + la série des tubes.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, fadeIn, FlatBg, Fly, Live, Note, PointTag as PTag, popAt, RowCard, ease} from '../../brand/bold';
import {Microbe, Sparkles} from '../../brand/hands';
import {Camera, Confetti} from '../../brand/motion3';
import {Patient} from '../../brand/patient';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {BLOOD, CAP, HEMO_CAP, HemoFlask, Megakaryocyte, NormCard, Platelet, RedCell, Tube, WhiteCell} from '../../brand/tubes';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const VIOLET = CAP.edta;
const NORM_Y = 1390;

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

const Arrow: React.FC<{at: number; to?: number; up?: boolean; x: number; y: number; size?: number}> = ({at: t0, to, up = true, x, y, size = 110}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<Live render={(f) => <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: N, lineHeight: 1, transform: `translateY(${(up ? -1 : 1) * 10 * Math.sin(f / 3)}px)`}}>{up ? '↑' : '↓'}</div>} />
	</Pop>
);

/** Pastille de mot (synonyme, terme, chiffre). */
const Chip: React.FC<{at: number; to?: number; x: number; y: number; children: React.ReactNode; tone?: string; size?: number}> = ({at: t0, to, x, y, children, tone = LPI.paper, size = 42}) => (
	<Pop at={t0} to={to} x={x} y={y}>
		<div style={{padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
	</Pop>
);

/** Carte des normes adultes, centrée en bas (au-dessus de la mascotte). */
const Norms: React.FC<{at: number; to?: number; rows: string[][]; note?: string; y?: number}> = ({at: t0, to, rows, note, y = NORM_Y}) => (
	<Pop at={t0} to={to} x={540} y={y}>
		<NormCard rows={rows} note={note} />
	</Pop>
);

/** Fiche de NFS : les 11 lignes ; `shown` = nombre de lignes déroulées, `hl` = ligne surlignée. */
const NFS_ROWS = ['Hématies', 'Hémoglobine', 'Hématocrite', 'VGM', 'Plaquettes', 'Leucocytes', 'PNN', 'PNE', 'PNB', 'Lymphocytes', 'Monocytes'];
const NfsSheet: React.FC<{shown: number; hl?: number; width?: number}> = ({shown, hl = -1, width = 470}) => (
	<div style={{width, boxSizing: 'border-box', borderRadius: 30, background: '#fff', border: `6px solid ${N}`, boxShadow: SHADOW, padding: '18px 20px'}}>
		<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 24, letterSpacing: '0.12em', color: alpha(N, 0.7)}}>NFS · RÉSULTATS</div>
		{NFS_ROWS.map((r, i) => {
			const k = Math.max(0, Math.min(1, shown - i));
			if (k <= 0) return null;
			return (
				<div key={r} style={{marginTop: 8, height: 46, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', borderRadius: 12, background: i === hl ? alpha(LPI.pink, 0.8) : alpha(LPI.sky, i % 2 ? 0.25 : 0.5), opacity: k, transform: `translateY(${(1 - k) * -14}px)`}}>
					<div style={{flex: 1, fontFamily: FONT.body, fontWeight: 900, fontSize: 28, color: N}}>{r}</div>
					<div style={{width: 90, height: 12, borderRadius: 6, background: alpha(N, 0.25)}} />
				</div>
			);
		})}
	</div>
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const CRIB = at('intro', 'passées');
	const ROUGES = at('intro', 'rouges,');
	const BLANCS = at('intro', 'blancs,');
	const PLAQ = at('intro', 'plaquettes.');
	const TOUT = at('intro', 'tout');
	const NFS = at('intro', 'nfs…');
	const LIRE = at('intro', 'lire');
	const LIGNE = at('intro', 'ligne');
	const cells = [
		{t: ROUGES, x: 230, y: 560, node: <RedCell size={200} />},
		{t: BLANCS, x: 850, y: 560, node: <WhiteCell size={200} />},
		{t: PLAQ, x: 540, y: 1390, node: <Platelet size={150} />},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[CRIB + 1, ROUGES + 1, BLANCS + 1, PLAQ + 1, NFS + 1, LIGNE + 1]} strength={0.03}>
				<Fly at={-14} x={540} y={900} from="bottom" to="bottom" move={[{at: TOUT - 2, x: 250, y: 930, s: 0.85, dur: 14}]}>
					<Live
						render={(f) => {
							const shake = f >= CRIB && f < CRIB + 22 ? Math.sin(f * 2.2) * 8 : Math.sin(f / 9) * 2;
							return (
								<div style={{transform: `rotate(${shake}deg)`}}>
									<Tube size={190} cap={VIOLET} label="EDTA" level={0.74} />
								</div>
							);
						}}
					/>
				</Fly>
				{cells.map((c, i) => (
					<Live
						key={i}
						render={(f) => {
							if (f < c.t - 4 || f > TOUT + 8) return null;
							const k = interpolate(f, [c.t - 4, c.t + 8], [0, 1], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
							const o = interpolate(f, [TOUT, TOUT + 7], [1, 0], clamp);
							return <div style={{position: 'absolute', left: 540 + (c.x - 540) * k, top: 760 + (c.y - 760) * k, transform: `translate(-50%, -50%) scale(${0.3 + 0.7 * k})`, opacity: o}}>{c.node}</div>;
						}}
					/>
				))}
				<Sparkles at={8} x={540} y={760} r={230} />
				<Big from={NFS - 2} text={'La *NFS*'} size={130} />
				<Fly at={TOUT} x={780} y={930} from="right" to="right">
					<Live render={(f) => <NfsSheet shown={interpolate(f, [TOUT + 4, LIRE + 10], [0, 11], clamp)} hl={f >= LIRE ? Math.floor(interpolate(f, [LIRE, LIGNE + 30], [0, 10.99], clamp)) : -1} />} />
				</Fly>
			</Camera>
			<Sfx name="whoosh" at={CRIB} volume={0.15} />
			<Sfx name="ding" at={8} volume={0.18} />
			{cells.map((c, i) => (
				<Sfx key={i} name="pop" at={c.t} volume={0.25} />
			))}
			<Sfx name="ding" at={NFS} volume={0.25} />
			{frame >= 0 ? <Sfx name="whoosh" at={TOUT} volume={0.15} /> : null}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA NFS ═══════════════════════════════ */
export const Nfs: React.FC = () => {
	const frame = useCurrentFrame();
	const NUM = at('nfs', 'numération');
	const FORM = at('nfs', 'formule');
	const SANG = at('nfs', 'sanguine.');
	const COMPTE = at('nfs', 'compte');
	const ROUGES = at('nfs', 'rouges,');
	const BLANCS = at('nfs', 'blancs,');
	const PLAQ = at('nfs', 'plaquettes.');
	const DIAG = at('nfs', 'diagnostic…');
	const SUIVRE = at('nfs', 'suivre');
	const DANS = at('nfs', 'dans');
	const EDTA = at('nfs', "l'edta");
	const COAG = at('nfs', 'coaguler');
	const INTACT = at('nfs', 'intactes.');
	const out = DANS - 4;
	const rows = [
		{l: 'N', w: 'Numération', t: NUM},
		{l: 'F', w: 'Formule', t: FORM},
		{l: 'S', w: 'Sanguine', t: SANG},
	];
	const count = Math.floor(interpolate(frame, [COMPTE, ROUGES - 4], [0, 12], clamp));
	const kinds = [0, 1, 0, 2, 0, 0, 1, 0, 2, 0, 0, 1];
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[NUM + 1, COMPTE + 1, ROUGES + 1, DIAG + 1, EDTA + 1]} strength={0.03}>
				<Big from={-2} to={out} text={'La *NFS*'} size={120} />
				{rows.map((r, i) => (
					<Pop key={r.l} at={2 + i * 4} to={out} x={540} y={430 + i * 125}>
						<div style={{width: 820, display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{width: 104, height: 104, borderRadius: 52, background: LPI.pink, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 62, color: N}}>{r.l}</div>
							<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 60, color: N, opacity: fadeIn(frame, r.t, 6)}}>{r.w}</div>
						</div>
					</Pop>
				))}
				{/* elle compte les cellules */}
				<Pop at={COMPTE - 4} to={ROUGES - 6} x={540} y={1040}>
					<div style={{width: 900, height: 300, boxSizing: 'border-box', borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, position: 'relative'}}>
						{[...Array(12)].map((_, i) =>
							i < count ? (
								<div key={i} style={{position: 'absolute', left: 30 + (i % 6) * 100, top: 36 + Math.floor(i / 6) * 124}}>
									{kinds[i] === 0 ? <RedCell size={90} /> : kinds[i] === 1 ? <WhiteCell size={90} /> : <Platelet size={70} />}
								</div>
							) : null,
						)}
						<div style={{position: 'absolute', right: 30, top: 74, width: 190, height: 150, borderRadius: 30, background: LPI.pink, border: `6px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 90, color: N}}>{count}</div>
					</div>
				</Pop>
				{/* les trois familles */}
				{[
					{t: ROUGES, x: 230, node: <RedCell size={170} />, w: 'globules rouges'},
					{t: BLANCS, x: 540, node: <WhiteCell size={170} />, w: 'globules blancs'},
					{t: PLAQ, x: 850, node: <Platelet size={130} />, w: 'plaquettes'},
				].map((c) => (
					<Pop key={c.w} at={c.t} to={out} x={c.x} y={1040}>
						<div style={{width: 290, height: 300, boxSizing: 'border-box', borderRadius: 36, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12}}>
							{c.node}
							<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 32, color: N}}>{c.w}</div>
						</div>
					</Pop>
				))}
				<Chip at={DIAG} to={out} x={330} y={1320} tone={LPI.sky}>
					diagnostic
				</Chip>
				<Chip at={SUIVRE} to={out} x={750} y={1320} tone={LPI.sky}>
					suivi
				</Chip>
				{/* l'EDTA du tube violet */}
				<Big from={DANS} text={'Dans le tube :\n*l\'EDTA*'} size={110} />
				<Fly at={DANS - 2} x={270} y={950} from="left" to="left">
					<Tube size={160} cap={VIOLET} label="EDTA" level={0.74} />
				</Fly>
				<Note at={COAG - 6} y={720} size={44} x={500}>
					le sang ne coagule pas
				</Note>
				<Pop at={INTACT} x={760} y={980}>
					<div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
						<RedCell size={130} />
						<WhiteCell size={130} />
						<Platelet size={90} />
					</div>
				</Pop>
				<Note at={INTACT + 4} y={1170} size={44} x={520}>
					des cellules intactes
				</Note>
			</Camera>
			{rows.map((r, i) => (
				<Sfx key={r.l} name="pop" at={2 + i * 4} volume={0.15} />
			))}
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} name="tick" at={COMPTE + i * 7} volume={0.1} />
			))}
			<Sfx name="pop" at={ROUGES} volume={0.18} />
			<Sfx name="pop" at={BLANCS} volume={0.18} />
			<Sfx name="pop" at={PLAQ} volume={0.18} />
			<Sfx name="whoosh" at={DANS} volume={0.15} />
			<Sfx name="ding" at={INTACT} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ HÉMATIES ═══════════════════════════════ */
export const Hematies: React.FC = () => {
	const HEM = at('hematies', 'hématies');
	const GR = at('hematies', 'globules');
	const ERY = at('hematies', 'érythrocytes.');
	const TRANS = at('hematies', 'transportent');
	const POUM = at('hematies', 'poumons');
	const CORPS = at('hematies', 'corps.');
	const VIVENT = at('hematies', 'vivent');
	const JOURS = at('hematies', 'jours.');
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[HEM + 1, ERY + 1, TRANS + 1, VIVENT + 1]} strength={0.03}>
				<Big from={HEM - 2} text={'Les *hématies*'} size={120} />
				<Chip at={GR} x={300} y={470} tone={LPI.pink}>
					globules rouges
				</Chip>
				<Chip at={ERY} x={790} y={470}>
					érythrocytes
				</Chip>
				{/* elles transportent l'oxygène des poumons vers le corps */}
				<Live
					render={(f) => {
						if (f < TRANS - 4) return null;
						const o = fadeIn(f, TRANS - 4, 8);
						return (
							<div style={{position: 'absolute', left: 0, top: 600, width: 1080, height: 300, opacity: o}}>
								<div style={{position: 'absolute', left: 120, right: 120, top: 70, height: 160, background: alpha('#F3C3C8', 0.9), borderTop: `7px solid ${N}`, borderBottom: `7px solid ${N}`}} />
								{[0, 1, 2, 3].map((k) => {
									const t = ((f / 70 + k / 4) % 1) as number;
									return (
										<div key={k} style={{position: 'absolute', left: 150 + t * 680, top: 90}}>
											<RedCell size={110} />
											<div style={{position: 'absolute', right: -22, top: -18, width: 54, height: 54, borderRadius: 27, background: '#fff', border: `4px solid ${LPI.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 22, color: LPI.blue, opacity: 1 - t * 0.85}}>O₂</div>
										</div>
									);
								})}
							</div>
						);
					}}
				/>
				<Chip at={POUM} x={170} y={950} size={38}>
					poumons
				</Chip>
				<Chip at={CORPS - 4} x={880} y={950} size={38}>
					tout le corps
				</Chip>
				<Chip at={VIVENT} x={540} y={1130} tone={LPI.pink} size={56}>
					≈ 120 jours de vie
				</Chip>
				<Norms at={JOURS - 30} rows={[['Homme', '4,2 – 5,7 millions / mm³'], ['Femme', '4,0 – 5,3 millions / mm³']]} />
			</Camera>
			<Sfx name="pop" at={GR} volume={0.15} />
			<Sfx name="pop" at={ERY} volume={0.15} />
			<Sfx name="whoosh" at={TRANS} volume={0.12} />
			<Sfx name="ding" at={VIVENT} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ HÉMOGLOBINE ═══════════════════════════════ */
export const Hemoglobine: React.FC = () => {
	const HB = at('hemoglobine', "l'hémoglobine");
	const PROT = at('hemoglobine', 'protéine');
	const OXY = at('hemoglobine', "l'oxygène.");
	const BASSE = at('hemoglobine', 'basse,');
	const ANEM = at('hemoglobine', "d'anémie.");
	const dots: number[][] = [];
	for (let i = 0; i < 18; i++) dots.push([60 + ((i * 37) % 280), 70 + ((i * 53) % 260)]);
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[HB + 1, OXY + 1, BASSE + 1, ANEM + 1]} strength={0.03}>
				<Big from={-2} text={'*L\'hémoglobine*'} size={116} />
				<Live
					render={(f) => {
						const low = interpolate(f, [BASSE, BASSE + 20], [0, 1], ease);
						return (
							<div style={{position: 'absolute', left: 540 - 220, top: 470, width: 440, height: 440}}>
								<div style={{filter: `saturate(${1 - 0.6 * low}) brightness(${1 + 0.25 * low})`}}>
									<RedCell size={440} />
								</div>
								<svg width={440} height={440} viewBox="0 0 400 400" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
									{dots.map(([x, y], i) => {
										const show = f >= HB + i && i < 18 - 12 * low;
										if (!show) return null;
										return (
											<g key={i} transform={`translate(${x} ${y})`}>
												<circle r={13} fill="#7A1426" stroke={N} strokeWidth={2.5} />
												{f >= OXY + (i % 6) * 2 ? <circle cx={13} cy={-12} r={8} fill="#fff" stroke={LPI.blue} strokeWidth={3} /> : null}
											</g>
										);
									})}
								</svg>
							</div>
						);
					}}
				/>
				<PTag at={PROT} to={BASSE - 4} x={830} y={1010} px={600} py={760}>
					une protéine
				</PTag>
				<Chip at={OXY} to={BASSE - 4} x={300} y={1010} size={40}>
					transporte l'O₂
				</Chip>
				<Arrow at={BASSE} up={false} x={860} y={720} />
				<Chip at={ANEM} x={540} y={1080} tone={LPI.pink} size={64}>
					= une anémie
				</Chip>
				<Fly at={ANEM + 4} x={170} y={1180} from="left" to="left">
					<Patient size={220} mood="mal" pale={1} />
				</Fly>
				<Norms at={BASSE + 6} rows={[['Homme', '14 – 18 g/dL'], ['Femme', '12 – 15 g/dL']]} />
			</Camera>
			<Sfx name="pop" at={HB} volume={0.15} />
			<Sfx name="pop" at={OXY} volume={0.15} />
			<Sfx name="buzz" at={BASSE + 8} volume={0.18} />
			<Sfx name="impact" at={ANEM} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ HÉMATOCRITE ═══════════════════════════════ */
export const Hematocrite: React.FC = () => {
	const PLACE = at('hematocrite', 'place');
	const GR = at('hematocrite', 'globules');
	const VOL = at('hematocrite', 'volume');
	const HAUT = at('hematocrite', 'haut,');
	const POLY = at('hematocrite', 'polyglobulie');
	const TROP2 = at('hematocrite', 'trop', 2);
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[PLACE + 1, VOL + 1, HAUT + 1, POLY + 1]} strength={0.03}>
				<Big from={-2} text={'*L\'hématocrite*'} size={116} />
				{/* tube tassé : globules en bas, plasma au-dessus */}
				<Fly at={PLACE - 6} x={260} y={900} from="left" to="left">
					<Live render={(f) => <Tube size={150} cap={VIOLET} level={0.86} serum={interpolate(f, [PLACE, PLACE + 24], [0, 1], ease)} split={0.55} />} />
				</Fly>
				<PTag at={GR} to={HAUT - 4} x={680} y={1080} px={280} py={1060}>
					globules rouges ≈ 45 %
				</PTag>
				<PTag at={VOL} to={HAUT - 4} x={680} y={680} px={280} py={720}>
					le reste du sang
				</PTag>
				{/* trop haut : polyglobulie */}
				<Fly at={HAUT - 4} x={800} y={900} from="right" to="right">
					<Live render={(f) => <Tube size={130} cap={VIOLET} level={0.86} serum={1} split={interpolate(f, [HAUT, HAUT + 20], [0.55, 0.32], ease)} />} />
				</Fly>
				<Arrow at={HAUT + 4} x={950} y={760} />
				<Chip at={POLY} x={540} y={1230} tone={LPI.pink} size={46}>
					polyglobulie
				</Chip>
				<Note at={TROP2} y={1290} size={34}>
					trop de globules rouges
				</Note>
				<Norms at={HAUT - 10} rows={[['Homme', '40 – 52 %'], ['Femme', '37 – 46 %']]} y={NORM_Y + 90} />
			</Camera>
			<Sfx name="whoosh" at={PLACE} volume={0.12} />
			<Sfx name="pop" at={GR} volume={0.15} />
			<Sfx name="pop" at={HAUT} volume={0.15} />
			<Sfx name="ding" at={POLY} volume={0.18} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ VGM ═══════════════════════════════ */
export const Vgm: React.FC = () => {
	const VGM = at('vgm', 'vgm,');
	const VOL = at('vgm', 'volume');
	const TAILLE = at('vgm', 'taille');
	const REP = at('vgm', 'repère');
	const ANEM = at('vgm', 'anémie.');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[VGM + 1, TAILLE + 1, REP + 1]} strength={0.03}>
				<Big from={-2} text={'Le *VGM*'} size={130} />
				<Note at={VOL} y={430} size={46}>
					volume globulaire moyen
				</Note>
				{[0.65, 1, 1.4].map((s, i) => (
					<Pop key={i} at={TAILLE + i * 4} x={230 + i * 310} y={780}>
						<div style={{width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<RedCell size={160 * s} />
						</div>
					</Pop>
				))}
				{['petits', 'normaux', 'gros'].map((w, i) => (
					<Pop key={w} at={TAILLE + 6 + i * 4} x={230 + i * 310} y={960}>
						<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{w}</div>
					</Pop>
				))}
				<Chip at={ANEM - 6} x={540} y={1130} tone={LPI.pink} size={44}>
					pour comprendre une anémie
				</Chip>
				<Norms at={TAILLE + 16} rows={[['', '80 – 100 fL']]} note="fL (femtolitre) : un volume minuscule" />
			</Camera>
			<Sfx name="pop" at={VGM} volume={0.15} />
			<Sfx name="pop" at={TAILLE} volume={0.15} />
			<Sfx name="ding" at={ANEM - 6} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAQUETTES ═══════════════════════════════ */
export const Plaquettes: React.FC = () => {
	const THR = at('plaquettes', 'thrombocytes,');
	const MORC = at('plaquettes', 'morceaux');
	const MEGA = at('plaquettes', 'mégacaryocytes.');
	const FORMENT = at('plaquettes', 'forment');
	const NEUF = at('plaquettes', 'neuf');
	const PEU = at('plaquettes', 'peu,');
	const THROMBOP = at('plaquettes', 'thrombopénie');
	const HEMO = at('plaquettes', "d'hémorragie");
	const TROP2 = at('plaquettes', 'trop,');
	const THROMBOC = at('plaquettes', 'thrombocytose');
	const DURE = at('plaquettes', 'dure.');
	const out = FORMENT - 4;
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[THR + 1, MEGA + 1, FORMENT + 1, THROMBOP + 1, THROMBOC + 1]} strength={0.03}>
				<Big from={-2} text={'Les *plaquettes*'} size={116} />
				<Chip at={THR} to={out} x={540} y={450}>
					thrombocytes
				</Chip>
				<Fly at={MORC - 6} out={out} x={440} y={830} from="left" to="left">
					<Live render={(f) => <Megakaryocyte size={360} shed={interpolate(f, [MORC, MEGA + 30], [0, 1], clamp)} />} />
				</Fly>
				<PTag at={MEGA} to={out} x={330} y={1150} px={330} py={900}>
					mégacaryocyte
				</PTag>
				{/* le caillot qui arrête le saignement ; trop peu → ça saigne */}
				<Live
					render={(f) => {
						if (f < FORMENT - 4) return null;
						const few = f >= PEU && f < TROP2 - 4;
						const plug = few ? 0.25 : interpolate(f, [FORMENT, FORMENT + 24], [0, 1], ease);
						const leak = few ? interpolate(f, [PEU + 6, PEU + 20], [0, 1], clamp) : 1 - plug;
						return (
							<svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 420, opacity: fadeIn(f, FORMENT - 4, 8)}}>
								<rect x={0} y={60} width={1080} height={280} fill="#F3C3C8" />
								<path d="M0 340 H470 M610 340 H1080" stroke={N} strokeWidth={12} />
								<path d="M0 60 H1080" stroke={N} strokeWidth={12} />
								{[0, 1, 2, 3].map((k) => {
									const x = ((f * 3 + k * 280) % 1200) - 100;
									return <ellipse key={k} cx={x} cy={160 + (k % 2) * 70} rx={52} ry={40} fill="#D43A44" stroke={N} strokeWidth={4} />;
								})}
								{[0, 1, 2, 3, 4, 5].map((k) => {
									const kk = Math.min(1, Math.max(0, plug * 6 - k));
									if (kk <= 0) return null;
									const tx = 490 + (k % 3) * 46;
									const ty = 330 + Math.floor(k / 3) * 34;
									return <ellipse key={`p${k}`} cx={tx + (1 - kk) * (k - 2.5) * 80} cy={ty - (1 - kk) * 200} rx={26} ry={18} fill="#E9B7C9" stroke={N} strokeWidth={3} />;
								})}
								{leak > 0
									? [0, 1, 2].map((k) => {
											const t = ((f / 18 + k / 3) % 1) * leak;
											return <path key={`d${k}`} d={`M540 ${380 + t * 260} q14 22 0 32 q-14 -10 0 -32 Z`} fill={BLOOD} stroke={N} strokeWidth={3} opacity={leak} />;
										})
									: null}
							</svg>
						);
					}}
				/>
				<Chip at={NEUF} to={PEU - 4} x={540} y={1200} tone={LPI.pink} size={52}>
					≈ 9 jours de vie
				</Chip>
				<Arrow at={PEU} to={TROP2 - 4} up={false} x={930} y={600} />
				<Chip at={THROMBOP} to={TROP2 - 4} x={540} y={1150} tone={LPI.pink} size={46}>
					thrombopénie
				</Chip>
				<Note at={HEMO} to={TROP2 - 4} y={1230} size={36}>
					risque d'hémorragie
				</Note>
				<Arrow at={TROP2} x={930} y={600} />
				<Chip at={THROMBOC} x={540} y={1150} tone={LPI.pink} size={46}>
					thrombocytose
				</Chip>
				<Note at={DURE - 8} y={1230} size={36}>
					un saignement qui dure ?
				</Note>
				<Norms at={NEUF + 4} rows={[['', '150 000 – 400 000 / mm³']]} />
			</Camera>
			<Sfx name="pop" at={THR} volume={0.15} />
			<Sfx name="pop" at={MEGA} volume={0.15} />
			<Sfx name="pop" at={FORMENT} volume={0.15} />
			<Sfx name="buzz" at={THROMBOP} volume={0.18} />
			<Sfx name="ding" at={THROMBOC} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LEUCOCYTES ═══════════════════════════════ */
export const Leucocytes: React.FC = () => {
	const frame = useCurrentFrame();
	const GB = at('leucocytes', 'globules');
	const DEF = at('leucocytes', 'défenseurs');
	const VIRUS = at('leucocytes', 'virus,');
	const BACT = at('leucocytes', 'bactéries');
	const CHAMP = at('leucocytes', 'champignons.');
	const NOMB = at('leucocytes', 'nombreux,');
	const INF = at('leucocytes', 'infection.');
	const PEU = at('leucocytes', 'peu,');
	const LEUCOP = at('leucocytes', 'leucopénie');
	const IMMU = at('leucocytes', 'immunodéprimé,');
	const many = frame >= NOMB && frame < PEU - 4;
	const few = frame >= PEU;
	const nCells = many ? 9 : few ? 1 : 3;
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[GB + 1, DEF + 1, NOMB + 1, PEU + 1, LEUCOP + 1]} strength={0.03}>
				<Big from={-2} text={'Les *leucocytes*'} size={116} />
				<Chip at={GB} x={540} y={440} tone={LPI.paper}>
					= les globules blancs
				</Chip>
				<Live
					render={(f) => {
						if (f < DEF - 4) return null;
						const microbes = few ? 7 : many ? 3 : 3;
						return (
							<div style={{position: 'absolute', left: 60, top: 520, width: 960, height: 560, borderRadius: 44, background: alpha(LPI.paper, 0.85), border: `6px solid ${N}`, opacity: fadeIn(f, DEF - 4, 8), overflow: 'hidden'}}>
								{[...Array(nCells)].map((_, i) => (
									<div key={`w${i}`} style={{position: 'absolute', left: 60 + ((i * 197) % 760), top: 50 + ((i * 131) % 380) + 10 * Math.sin(f / 6 + i)}}>
										<WhiteCell size={120} kind={(['pnn', 'lympho', 'mono'] as const)[i % 3]} />
									</div>
								))}
								{[...Array(microbes)].map((_, i) => (
									<div key={`m${i}`} style={{position: 'absolute', left: 120 + ((i * 263) % 700), top: 110 + ((i * 89) % 330) + 8 * Math.cos(f / 5 + i)}}>
										<Microbe size={76} seed={i} tone={LPI.pink} />
									</div>
								))}
							</div>
						);
					}}
				/>
				<Chip at={VIRUS} to={NOMB - 4} x={230} y={1170} size={38}>
					virus
				</Chip>
				<Chip at={BACT} to={NOMB - 4} x={530} y={1170} size={38}>
					bactéries
				</Chip>
				<Chip at={CHAMP} to={NOMB - 4} x={850} y={1170} size={38}>
					champignons
				</Chip>
				<Arrow at={NOMB} to={PEU - 4} x={960} y={1180} />
				<Chip at={INF - 4} to={PEU - 4} x={450} y={1170} tone={LPI.pink} size={46}>
					infection ?
				</Chip>
				<Arrow at={PEU} up={false} x={960} y={1180} />
				<Chip at={LEUCOP} x={450} y={1170} tone={LPI.pink} size={46}>
					leucopénie
				</Chip>
				<Note at={IMMU} y={1240} size={34}>
					immunodéprimé : il se défend mal
				</Note>
				<Norms at={INF + 6} rows={[['', '4 000 – 10 000 / mm³']]} y={NORM_Y + 20} />
			</Camera>
			<Sfx name="pop" at={DEF} volume={0.15} />
			<Sfx name="pop" at={VIRUS} volume={0.12} />
			<Sfx name="pop" at={BACT} volume={0.12} />
			<Sfx name="pop" at={CHAMP} volume={0.12} />
			<Sfx name="pop" at={NOMB} volume={0.18} />
			<Sfx name="buzz" at={LEUCOP} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FORMULE : PNN, PNE, PNB ═══════════════════════════════ */
const FamCard: React.FC<{at: number; y: number; badge: React.ReactNode; title: string; sub: React.ReactNode; subAt: number; kind: 'pnn' | 'eo' | 'baso' | 'lympho' | 'mono'; norm: string; h?: number}> = ({at: t0, y, badge, title, sub, subAt, kind, norm, h = 270}) => (
	<RowCard at={t0} y={y} h={h} badge={badge} badgeTone={LPI.sky} title={title} sub={<>
		{sub}
		<div style={{marginTop: 6, display: 'inline-block', padding: '2px 14px', borderRadius: 999, background: LPI.sky, border: `3px solid ${N}`, fontFamily: FONT.title, fontWeight: 900, fontSize: 28, color: N}}>{norm}</div>
	</>} subAt={subAt} art={190} size={46}>
		<WhiteCell size={170} kind={kind} />
	</RowCard>
);

export const Formule: React.FC = () => {
	const FORM = at('formule', 'formule');
	const PNN = at('formule', 'polynucléaires');
	const PHAG = at('formule', 'phagocytose.');
	const EO = at('formule', 'éosinophiles');
	const ALL = at('formule', "d'allergie");
	const BASO = at('formule', 'basophiles');
	const INFL = at('formule', "l'inflammation.");
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[FORM + 1, PNN + 1, EO + 1, BASO + 1]} strength={0.03}>
				<Big from={-2} text={'La *formule*'} size={116} />
				<FamCard at={PNN - 4} y={420} badge={<span style={{fontSize: 26}}>PNN</span>} title="Neutrophiles" sub="avalent les microbes (phagocytose)" subAt={PHAG - 10} kind="pnn" norm="1 500 – 7 000 / mm³" />
				<FamCard at={EO - 4} y={720} badge={<span style={{fontSize: 26}}>PNE</span>} title="Éosinophiles" sub="↑ allergie, parasites" subAt={ALL} kind="eo" norm="50 – 500 / mm³" />
				<FamCard at={BASO - 4} y={1020} badge={<span style={{fontSize: 26}}>PNB</span>} title="Basophiles" sub="allergies, inflammation" subAt={INFL - 8} kind="baso" norm="0 – 200 / mm³" />
			</Camera>
			<Sfx name="whoosh" at={PNN - 4} volume={0.15} />
			<Sfx name="whoosh" at={EO - 4} volume={0.15} />
			<Sfx name="whoosh" at={BASO - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LYMPHOCYTES ET MONOCYTES ═══════════════════════════════ */
export const Lymphocytes: React.FC = () => {
	const LYM = at('lymphocytes', 'lymphocytes,');
	const MES = at('lymphocytes', 'mesure');
	const NOMB = at('lymphocytes', 'nombreux,');
	const LCYT = at('lymphocytes', 'lymphocytose');
	const VIR = at('lymphocytes', 'virale…');
	const MAL = at('lymphocytes', 'maladie');
	const MONO = at('lymphocytes', 'monocytes');
	const REGL = at('lymphocytes', 'règlent');
	return (
		<AbsoluteFill>
			<Bg tone={alpha(LPI.pink, 0.5)} />
			<Camera punches={[LYM + 1, NOMB + 1, LCYT + 1, MONO + 1]} strength={0.03}>
				<Big from={-2} text={'Lymphocytes\net *monocytes*'} size={104} />
				<FamCard at={LYM - 2} y={440} badge="L" title="Lymphocytes" sub="défenses sur mesure" subAt={MES} kind="lympho" norm="1 500 – 4 000 / mm³" />
				<Arrow at={NOMB} x={160} y={830} />
				<Chip at={LCYT} x={540} y={810} tone={LPI.pink} size={44}>
					lymphocytose
				</Chip>
				<Note at={VIR - 6} y={890} size={36}>
					infection virale ?
				</Note>
				<Note at={MAL} y={965} size={32} tone={LPI.sky}>
					parfois une maladie du sang
				</Note>
				<FamCard at={MONO - 4} y={1060} badge="M" title="Monocytes" sub="avalent les microbes · règlent les défenses" subAt={REGL - 8} kind="mono" norm="200 – 950 / mm³" />
			</Camera>
			<Sfx name="whoosh" at={LYM} volume={0.15} />
			<Sfx name="pop" at={LCYT} volume={0.18} />
			<Sfx name="whoosh" at={MONO - 4} volume={0.15} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ RÉCAP + LA SÉRIE ═══════════════════════════════ */
const SERIES_CAPS = [HEMO_CAP.aero, CAP.citrate, CAP.gel, CAP.sec, CAP.hepar, CAP.edta, CAP.fluor];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const REC = at('fin', 'récapitule');
	const GR = at('fin', 'globules');
	const OXY = at('fin', "l'oxygène,");
	const PLAQ = at('fin', 'plaquettes');
	const CAIL = at('fin', 'caillot,');
	const GB = at('fin', 'globules', 2);
	const DEF = at('fin', 'défendre.');
	const TUBE = at('fin', 'tube');
	const PROCH = at('fin', 'prochain');
	const SERIE = at('fin', 'série');
	const out = TUBE - 6;
	const rows = [
		{t: GR, title: 'Globules rouges + hémoglobine', sub: "l'oxygène", subAt: OXY, art: <RedCell size={120} />},
		{t: PLAQ, title: 'Plaquettes', sub: 'le caillot', subAt: CAIL, art: <Platelet size={100} />},
		{t: GB, title: 'Globules blancs', sub: 'les défenses', subAt: DEF, art: <WhiteCell size={120} />},
	];
	return (
		<AbsoluteFill>
			<Bg tone={LPI.sky} />
			<Camera punches={[REC + 1, ...rows.map((r) => r.t + 1), TUBE + 1, SERIE + 1]} strength={0.025}>
				<Big from={-2} to={out} text={'On *récapitule*'} size={116} />
				{rows.map((r, i) => (
					<Live key={r.title} render={(f) => (f > out + 10 ? null : <div style={{opacity: interpolate(f, [out, out + 8], [1, 0], clamp)}}><RowCard at={r.t - 2} y={420 + i * 250} h={220} title={r.title} sub={r.sub} subAt={r.subAt} check={r.subAt + 8} art={150} size={46}>{r.art}</RowCard></div>)} />
				))}
				<Big from={TUBE} text={'Dans un seul\ntube *violet* !'} size={110} />
				{SERIES_CAPS.map((c, i) => {
					const t0 = TUBE + 2 + i * 3;
					if (frame < t0) return null;
					const done = i === 5;
					const big = done ? 1 + 0.15 * interpolate(frame, [TUBE + 20, TUBE + 30], [0, 1], clamp) : 1;
					return (
						<div key={i} style={{position: 'absolute', left: 540 + (i - 3) * 138 - 60, top: 640, width: 120, height: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${popAt(frame, t0) * big})`, opacity: done ? 1 : 0.55}}>
							{i === 0 ? <HemoFlask size={100} label="" cap={c} /> : <Tube size={90} cap={c} level={done ? 0.74 : 0} />}
							{frame >= PROCH ? <div style={{marginTop: 18, width: 70, height: 70, borderRadius: 35, background: done ? LPI.blue : LPI.paper, border: `5px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: done ? LPI.paper : N}}>{done ? '✓' : '?'}</div> : null}
						</div>
					);
				})}
				<Note at={SERIE + 2} y={1280} size={52} tone={LPI.pink}>
					le prochain tube arrive bientôt !
				</Note>
			</Camera>
			<Confetti at={SERIE} />
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.15} />
			))}
			<Sfx name="whoosh" at={TUBE} volume={0.15} />
			<Sfx name="ding" at={SERIE} volume={0.25} />
		</AbsoluteFill>
	);
};
