// « La cellule : le schéma annoté » (n° 104, thème « l'anatomie », pendant schématique de la n° 103 ; directives Instagram).
// Une cellule animale dessinée comme dans un manuel, annotée au mot (kit `src/brand/schema.tsx`) : accroche = le schéma
// « muet » avec 12 numéros (comme à l'examen) ; 1 · l'enveloppe (membrane plasmique, cytoplasme, cytosquelette) ; 2 · le
// noyau (double enveloppe, pores, chromatine = ADN, nucléole qui fabrique les ribosomes) ; 3 · la chaîne de fabrication
// (ribosomes → protéines, réticulum endoplasmique rugueux, réticulum lisse → lipides, appareil de Golgi qui trie et
// emballe dans des vésicules) ; 4 · énergie et ménage (mitochondries, lysosomes, centrosome) ; fin = le schéma complet.
// Sources : Marieb & Hoehn, Anatomie et physiologie humaines (la cellule, organites) ; Alberts, Biologie moléculaire de la
// cellule (réticulum, Golgi, lysosomes, centrosome).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Note} from '../../brand/bold';
import {Camera, Confetti} from '../../brand/motion3';
import {ANAT_C, Ann, Defs, LevelScene, SchemaCard} from '../../brand/schema';
import {Counter, PINK_BG, Pop, SeriesPill, ShortBg} from '../../brand/short';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at} from './timeline';

const N = LPI.navy;
const C = ANAT_C;
const S = {cap: LPI.pink, label: "L'ANATOMIE · LA CELLULE ANNOTÉE", total: 4};

type Part = 'membrane' | 'cyto' | 'cytosk' | 'noyau' | 'pore' | 'chromatine' | 'nucleole' | 'ribo' | 'rer' | 'rel' | 'golgi' | 'vesicule' | 'mito' | 'lyso' | 'centro';

/** Repères des structures (anchor des légendes), dans le repère de la carte 960 × 1120. */
const P: Record<Part, [number, number]> = {
	membrane: [196, 500],
	cyto: [330, 830],
	cytosk: [700, 440],
	noyau: [310, 500],
	pore: [490, 416],
	chromatine: [462, 572],
	nucleole: [400, 500],
	ribo: [240, 612],
	rer: [600, 610],
	rel: [360, 752],
	golgi: [622, 722],
	vesicule: [706, 640],
	mito: [620, 352],
	lyso: [560, 806],
	centro: [300, 356],
};

/** La cellule animale (centre 480, 560) ; `focus` : structures nettes, les autres s'estompent ; `pulse` : celle qui pulse. */
const BigCell: React.FC<{f: number; focus?: Part[] | null; scale?: number}> = ({f, focus = null, scale = 1}) => {
	const o = (k: Part) => (!focus || focus.includes(k) ? 1 : 0.28);
	const cx = 480;
	const cy = 560;
	const w = 1 + 0.01 * Math.sin(f / 12);
	return (
		<g transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
			<ellipse cx={cx + 10} cy={cy + 24} rx={292} ry={312} fill={alpha(N, 0.1)} filter="url(#ocsSoft)" />
			{/* membrane plasmique (bicouche) + cytoplasme */}
			<g opacity={o('membrane')}>
				<ellipse cx={cx} cy={cy} rx={290 * w} ry={310 / w} fill={LPI.pink} stroke={N} strokeWidth={5} />
			</g>
			<ellipse cx={cx} cy={cy} rx={276 * w} ry={296 / w} fill="url(#ocsCyto)" stroke={alpha(N, 0.55)} strokeWidth={3} opacity={Math.max(o('cyto'), 0.7)} />
			{/* cytosquelette : réseau de fibres */}
			<g opacity={o('cytosk') * 0.9}>
				{[
					'M230 420 Q400 380 560 300',
					'M640 290 Q700 430 740 600',
					'M260 700 Q420 820 650 820',
					'M560 300 Q640 380 740 450',
					'M220 560 Q240 700 330 860',
				].map((d) => (
					<path key={d} d={d} fill="none" stroke={alpha(LPI.blue, 0.75)} strokeWidth={3} strokeDasharray="14 6" />
				))}
			</g>
			{/* réticulum endoplasmique rugueux : feuillets autour du noyau, avec ribosomes */}
			<g opacity={o('rer')}>
				{[0, 1, 2].map((k) => {
					const r = 150 + k * 26;
					const a0 = -0.2;
					const a1 = 1.45;
					const pts = Array.from({length: 14}, (_, i) => {
						const a = a0 + ((a1 - a0) * i) / 13;
						return [430 + Math.cos(a) * r, 520 + Math.sin(a) * r];
					});
					return (
						<g key={k}>
							<path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={LPI.blue} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
							<path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={LPI.sky} strokeWidth={4} strokeLinecap="round" />
							{pts.map(([x, y], i) => (i % 2 ? <circle key={i} cx={x + 8} cy={y - 2} r={4.5} fill={N} /> : null))}
						</g>
					);
				})}
			</g>
			{/* réticulum lisse : tubes sans ribosomes */}
			<g opacity={o('rel')}>
				{[0, 1].map((k) => (
					<path key={k} d={`M${290 + k * 10} ${730 + k * 26} q30 -24 60 0 t60 0 t50 -6`} fill="none" stroke={LPI.blue} strokeWidth={11} strokeLinecap="round" />
				))}
				{[0, 1].map((k) => (
					<path key={`i${k}`} d={`M${290 + k * 10} ${730 + k * 26} q30 -24 60 0 t60 0 t50 -6`} fill="none" stroke={LPI.sky} strokeWidth={4} strokeLinecap="round" />
				))}
			</g>
			{/* appareil de Golgi + vésicules */}
			<g opacity={o('golgi')}>
				{[0, 1, 2, 3, 4].map((k) => (
					<path key={k} d={`M${570 + k * 4} ${690 + k * 14} Q${625} ${666 + k * 14} ${680 - k * 2} ${700 + k * 14}`} fill="none" stroke={LPI.pink} strokeWidth={10} strokeLinecap="round" />
				))}
				{[0, 1, 2, 3, 4].map((k) => (
					<path key={`o${k}`} d={`M${570 + k * 4} ${690 + k * 14} Q${625} ${666 + k * 14} ${680 - k * 2} ${700 + k * 14}`} fill="none" stroke={N} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
				))}
			</g>
			<g opacity={o('vesicule')}>
				{[0, 1, 2].map((i) => {
					const t = ((f / 50 + i / 3) % 1);
					const x = 690 + 60 * t;
					const y = 650 - 60 * t + i * 20;
					return <circle key={i} cx={x} cy={y} r={13} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={3} />;
				})}
				<circle cx={706} cy={640} r={14} fill={alpha(LPI.pink, 0.85)} stroke={N} strokeWidth={3} />
			</g>
			{/* ribosomes libres */}
			<g opacity={o('ribo')}>
				{Array.from({length: 22}).map((_, i) => {
					const a = i * 2.39;
					const r = 200 + ((i * 37) % 60);
					return <circle key={i} cx={cx + Math.cos(a) * r * 0.85} cy={cy + Math.sin(a) * r} r={5} fill={N} opacity={0.75} />;
				})}
				<circle cx={240} cy={612} r={6} fill={N} />
			</g>
			{/* mitochondries */}
			<g opacity={o('mito')}>
				{[
					[620, 352, -20, 1],
					[700, 520, 80, 0.8],
					[250, 640, 100, 0.7],
				].map(([x, y, r, s], i) => (
					<g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
						<ellipse rx={58} ry={28} fill={C.mito} stroke={C.mitoDark} strokeWidth={4} />
						<path d="M-44 0 L-35 -16 L-26 13 L-17 -16 L-8 13 L1 -16 L10 13 L19 -16 L28 13 L37 -16 L44 0" fill="none" stroke={C.mitoDark} strokeWidth={3.5} strokeLinejoin="round" />
					</g>
				))}
			</g>
			{/* lysosomes */}
			<g opacity={o('lyso')}>
				{[
					[560, 806, 1],
					[420, 860, 0.7],
				].map(([x, y, s], i) => (
					<g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
						<circle r={28} fill="#B79BD8" stroke={N} strokeWidth={4} />
						{[[-8, -6], [8, 4], [-2, 10], [10, -10]].map(([a, b], j) => (
							<circle key={j} cx={a} cy={b} r={4} fill={C.nucleusDark} />
						))}
					</g>
				))}
			</g>
			{/* centrosome : deux centrioles perpendiculaires */}
			<g opacity={o('centro')}>
				<rect x={282} y={344} width={40} height={18} rx={4} fill={C.fat} stroke={N} strokeWidth={3} />
				<rect x={296} y={332} width={18} height={40} rx={4} fill={C.fat} stroke={N} strokeWidth={3} transform="translate(26 6)" />
			</g>
			{/* noyau : double enveloppe percée de pores, chromatine, nucléole */}
			<g opacity={o('noyau')}>
				<circle cx={430} cy={520} r={122} fill="url(#ocsNuc)" stroke={C.nucleusDark} strokeWidth={5} strokeDasharray="70 12" />
				<circle cx={430} cy={520} r={110} fill="none" stroke={C.nucleusDark} strokeWidth={4} strokeDasharray="70 12" strokeDashoffset={-2} />
			</g>
			<g opacity={o('pore')}>
				{Array.from({length: 7}).map((_, i) => {
					const a = -Math.PI / 2 + 0.65 + i * 0.9;
					return <circle key={i} cx={430 + Math.cos(a) * 116} cy={520 + Math.sin(a) * 116} r={7} fill={LPI.paper} stroke={N} strokeWidth={2.5} />;
				})}
			</g>
			<g opacity={o('chromatine')}>
				<path
					d={Array.from({length: 30}, (_, i) => {
						const a = i * 0.83 + f / 50;
						const r = 26 + ((i * 23) % 64);
						return `${i ? 'L' : 'M'}${438 + Math.cos(a) * r} ${528 + Math.sin(a) * r}`;
					}).join(' ')}
					fill="none"
					stroke={C.nucleusDark}
					strokeWidth={4}
					strokeLinejoin="round"
					opacity={0.85}
				/>
			</g>
			<g opacity={o('nucleole')}>
				<circle cx={400} cy={500} r={34} fill={C.nucleusDark} stroke={N} strokeWidth={3} />
			</g>
		</g>
	);
};

const draw = (focus: Part[] | null) => (f: number) => (
	<>
		<Defs />
		<BigCell f={f} focus={focus} />
	</>
);

export const Hook: React.FC = () => {
	const DOUZE = at('intro', 'douze');
	const SCHEMA = at('intro', 'schéma');
	const ENS = at('intro', 'ensemble ?');
	const nums: Part[] = ['membrane', 'cyto', 'noyau', 'nucleole', 'chromatine', 'pore', 'ribo', 'rer', 'rel', 'golgi', 'mito', 'lyso'];
	return (
		<AbsoluteFill>
			<ShortBg />
			<SeriesPill cap={S.cap} label={S.label} />
			<Counter steps={[[0, 0]]} total={S.total} />
			<Camera punches={[DOUZE + 1, SCHEMA + 1, ENS + 1]} strength={0.02}>
				<Big from={-60} text={'La *cellule*\nà annoter'} size={88} y={236} />
				<Pop at={-12} x={540} y={1040}>
					<SchemaCard
						draw={(f) => (
							<>
								<Defs />
								<BigCell f={f} />
								{nums.map((k, i) => {
									const t = DOUZE - 4 + i * 3;
									const s = interpolate(f, [t, t + 6], [0, 1], clamp);
									const [x, y] = P[k];
									return (
										<g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
											<circle r={24} fill={N} stroke={LPI.paper} strokeWidth={4} />
											<text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={28} fill={LPI.paper}>
												{i + 1}
											</text>
										</g>
									);
								})}
							</>
						)}
						anns={[]}
					/>
				</Pop>
				<Note at={SCHEMA - 6} y={1510} size={40} tone={LPI.pink}>
					on l'annote ensemble ?
				</Note>
			</Camera>
			{nums.map((k, i) => (
				<Sfx key={k} name="tick" at={DOUZE - 4 + i * 3} volume={0.1} />
			))}
		</AbsoluteFill>
	);
};

export const Enveloppe: React.FC = () => {
	const UN = at('enveloppe', 'un');
	const anns: Ann[] = [
		{at: at('enveloppe', 'membrane'), text: 'membrane plasmique', sub: 'filtre les échanges', ax: P.membrane[0], ay: P.membrane[1], tx: 40, ty: 150},
		{at: at('enveloppe', 'cytoplasme,'), text: 'cytoplasme', sub: 'le liquide intérieur', ax: P.cyto[0], ay: P.cyto[1], tx: 40, ty: 990},
		{at: at('enveloppe', 'cytosquelette.'), text: 'cytosquelette', sub: 'le squelette de fibres', ax: P.cytosk[0], ay: P.cytosk[1], tx: 560, ty: 150},
	];
	return <LevelScene series={S} n={1} numAt={UN} title={"1 · *L'enveloppe*"} cardAt={at('enveloppe', "l'enveloppe.") - 4} caption="" draw={draw(['membrane', 'cyto', 'cytosk'])} anns={anns} />;
};

export const Noyau: React.FC = () => {
	const DEUX = at('noyau', 'deux');
	const anns: Ann[] = [
		{at: at('noyau', 'double'), text: 'noyau', sub: 'double enveloppe', ax: P.noyau[0], ay: P.noyau[1], tx: 40, ty: 150},
		{at: at('noyau', 'pores.'), text: 'pore nucléaire', sub: 'laisse passer', ax: P.pore[0], ay: P.pore[1], tx: 540, ty: 150},
		{at: at('noyau', 'chromatine,'), text: 'chromatine', sub: "c'est l'ADN", ax: P.chromatine[0], ay: P.chromatine[1], tx: 560, ty: 990},
		{at: at('noyau', 'nucléole,'), text: 'nucléole', sub: 'fait les ribosomes', ax: P.nucleole[0], ay: P.nucleole[1], tx: 40, ty: 990},
	];
	return <LevelScene series={S} n={2} numAt={DEUX} title={'2 · Le *noyau*'} pink cardAt={at('noyau', 'noyau.') - 4} caption="" draw={draw(['noyau', 'pore', 'chromatine', 'nucleole'])} anns={anns} />;
};

export const Fabrication: React.FC = () => {
	const TROIS = at('fabrication', 'trois');
	const anns: Ann[] = [
		{at: at('fabrication', 'ribosomes'), text: 'ribosome', sub: 'les protéines', ax: P.ribo[0], ay: P.ribo[1], tx: 40, ty: 150},
		{at: at('fabrication', 'rugueux.'), text: 'réticulum rugueux', sub: 'avec ribosomes', ax: P.rer[0], ay: P.rer[1], tx: 520, ty: 960},
		{at: at('fabrication', 'lisse'), text: 'réticulum lisse', sub: 'les lipides', ax: P.rel[0], ay: P.rel[1], tx: 40, ty: 960},
		{at: at('fabrication', 'golgi'), text: 'appareil de Golgi', sub: 'trie et emballe', ax: P.golgi[0], ay: P.golgi[1], tx: 520, ty: 1060},
		{at: at('fabrication', 'vésicules.'), text: 'vésicule', sub: 'le colis', ax: P.vesicule[0], ay: P.vesicule[1], tx: 600, ty: 150},
	];
	return (
		<LevelScene
			series={S}
			n={3}
			numAt={TROIS}
			title={'3 · La *fabrication*'}
			cardAt={at('fabrication', 'chaîne') - 4}
			caption=""
			draw={draw(['ribo', 'rer', 'rel', 'golgi', 'vesicule'])}
			anns={anns.map((a) => ({...a, size: 32}))}
		/>
	);
};

export const Energie: React.FC = () => {
	const QUATRE = at('energie', 'quatre');
	const anns: Ann[] = [
		{at: at('energie', 'mitochondries'), text: 'mitochondrie', sub: "produit l'énergie", ax: P.mito[0], ay: P.mito[1], tx: 590, ty: 150},
		{at: at('energie', 'lysosomes'), text: 'lysosome', sub: 'digère les déchets', ax: P.lyso[0], ay: P.lyso[1], tx: 590, ty: 990},
		{at: at('energie', 'centrosome'), text: 'centrosome', sub: 'organise la division', ax: P.centro[0], ay: P.centro[1], tx: 40, ty: 150},
	];
	return <LevelScene series={S} n={4} numAt={QUATRE} title={'4 · *Énergie*'} pink cardAt={at('energie', "l'énergie") - 4} caption="" draw={draw(['mito', 'lyso', 'centro'])} anns={anns} />;
};

/** Fin : le schéma complet, la cellule réduite au centre et les 15 légendes autour. */
const SC = 0.72;
const sc = ([x, y]: [number, number]): [number, number] => [480 + (x - 480) * SC, 560 + (y - 560) * SC];
const FIN: [Part, string, number, number, boolean][] = [
	['membrane', 'membrane', 255, 380, true],
	['nucleole', 'nucléole', 255, 470, true],
	['noyau', 'noyau', 255, 560, true],
	['ribo', 'ribosome', 255, 650, true],
	['centro', 'centrosome', 255, 740, true],
	['mito', 'mitochondrie', 705, 380, false],
	['cytosk', 'cytosquelette', 705, 470, false],
	['vesicule', 'vésicule', 705, 560, false],
	['golgi', 'Golgi', 705, 650, false],
	['lyso', 'lysosome', 705, 740, false],
	['pore', 'pore nucléaire', 380, 200, false],
	['rel', 'réticulum lisse', 60, 900, false],
	['rer', 'réticulum rugueux', 500, 900, false],
	['cyto', 'cytoplasme', 60, 990, false],
	['chromatine', 'chromatine (ADN)', 500, 990, false],
];

export const Fin: React.FC = () => {
	const VOILA = at('fin', 'voilà');
	const COMPLET = at('fin', 'complet');
	const PROCH = at('fin', 'prochaine');
	const anns: Ann[] = FIN.map(([k, text, tx, ty, end], i) => {
		const [ax, ay] = sc(P[k]);
		return {at: VOILA + i * 3, text, ax, ay, tx, ty, end, size: 27};
	});
	return (
		<AbsoluteFill>
			<ShortBg tone={PINK_BG} />
			<SeriesPill cap={S.cap} label={S.label} />
			<Counter steps={[[0, S.total]]} total={S.total} done />
			<Camera punches={[VOILA + 1, COMPLET + 1, PROCH + 1]} strength={0.02}>
				<Big from={-2} text={'Le *schéma* complet'} size={84} y={300} />
				<Pop at={-4} x={540} y={1012}>
					<SchemaCard
						draw={(f) => (
							<>
								<Defs />
								<BigCell f={f} scale={SC} />
							</>
						)}
						anns={anns}
					/>
				</Pop>
				<Confetti at={COMPLET + 30} />
				<Pop at={PROCH - 2} x={540} y={1528}>
					<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color: LPI.paper, background: N, borderRadius: 40, padding: '22px 40px', whiteSpace: 'nowrap'}}>
						prochaine vidéo : <span style={{color: LPI.pink}}>les tissus</span>
					</div>
				</Pop>
			</Camera>
			{anns.map((a, i) => (
				<Sfx key={i} name="tick" at={a.at} volume={0.08} />
			))}
			<Sfx name="ding" at={COMPLET + 30} volume={0.2} />
			<Sfx name="whoosh" at={PROCH - 2} volume={0.15} />
		</AbsoluteFill>
	);
};


