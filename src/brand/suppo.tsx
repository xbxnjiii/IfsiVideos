// Vidéo courte « Comment mettre un suppositoire » : le suppositoire (`Suppo` : torpille blanc cassé, pointe arrondie à
// droite, base plate à gauche, petit visage, mode fusée avec ailerons + flamme), la notice (`Notice`, ligne surlignée),
// le patient couché sur le côté gauche (`SideLying`, jambe du dessus pliée), l'anneau du sphincter (`Sphincter`), les
// fesses qui se serrent (`Squeeze`), un commentaire de réseau social (`Comment`). Couleurs de la marque uniquement.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI, SHADOW} from './theme';

const N = LPI.navy;
const SK = {stroke: N, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const};

/** Suppositoire (400 × 200, pointe à droite) : `face` (yeux + sourire), `rocket` 0 → 1 (ailerons + flamme qui
 * vacille), `drop` 0 → 1 (goutte d'eau sur la pointe), `mood` (content / inquiet). */
export const Suppo: React.FC<{width?: number; face?: boolean; rocket?: number; drop?: number; mood?: 'content' | 'inquiet' | 'fier'}> = ({width = 400, face = true, rocket = 0, drop = 0, mood = 'content'}) => {
	const frame = useCurrentFrame();
	const blink = frame % 70 < 4 ? 0.15 : 1;
	const flick = 0.85 + 0.15 * Math.sin(frame * 1.7) + 0.08 * Math.sin(frame * 3.1);
	const BODY = 'M70 50 H250 C330 50 380 80 380 100 C380 120 330 150 250 150 H70 C58 150 50 142 50 130 V70 C50 58 58 50 70 50 Z';
	return (
		<svg width={width} height={(width * 200) / 400} viewBox="0 0 400 200" style={{overflow: 'visible'}}>
			{/* flamme et ailerons (fusée) */}
			{rocket > 0 ? (
				<g opacity={Math.min(1, rocket * 1.5)}>
					<path d={`M50 76 L${50 - 70 * rocket * flick} 100 L50 124 Z`} fill={LPI.pink} stroke={N} strokeWidth={6} strokeLinejoin="round" />
					<path d={`M50 88 L${50 - 38 * rocket * flick} 100 L50 112 Z`} fill={LPI.paper} />
					<path d="M90 50 L56 14 H40 L60 50 Z" fill={LPI.blue} {...SK} strokeWidth={6} transform={`translate(0 ${(1 - rocket) * 30})`} />
					<path d="M90 150 L56 186 H40 L60 150 Z" fill={LPI.blue} {...SK} strokeWidth={6} transform={`translate(0 ${(1 - rocket) * -30})`} />
				</g>
			) : null}
			<path d={BODY} fill={LPI.paper} {...SK} />
			{/* reflet + base plate bien visible */}
			<path d="M80 70 H240" stroke={alpha(LPI.sky, 0.9)} strokeWidth={10} strokeLinecap="round" />
			<path d="M50 70 V130" stroke={alpha(N, 0.35)} strokeWidth={10} strokeLinecap="round" />
			{face ? (
				<g>
					<g transform={`translate(0 92) scale(1 ${blink}) translate(0 -92)`}>
						<circle cx={262} cy={92} r={8} fill={N} />
						<circle cx={300} cy={92} r={8} fill={N} />
					</g>
					<ellipse cx={248} cy={112} rx={11} ry={6} fill={LPI.pink} opacity={0.7} />
					<ellipse cx={318} cy={112} rx={11} ry={6} fill={LPI.pink} opacity={0.7} />
					<path d={mood === 'inquiet' ? 'M270 122 Q281 114 292 122' : mood === 'fier' ? 'M266 112 Q281 132 296 112' : 'M270 114 Q281 124 292 114'} fill="none" stroke={N} strokeWidth={5} strokeLinecap="round" />
					{mood === 'fier' ? <path d="M250 76 L272 82 M312 76 L290 82" stroke={N} strokeWidth={5} strokeLinecap="round" /> : null}
				</g>
			) : null}
			{/* goutte d'eau sur la pointe */}
			{drop > 0 ? (
				<g transform={`translate(392 ${78 + 6 * Math.sin(frame / 6)}) scale(${drop})`}>
					<path d="M0 -22 C12 -6 16 4 16 10 A16 16 0 0 1 -16 10 C-16 4 -12 -6 0 -22 Z" fill={LPI.sky} stroke={N} strokeWidth={4} />
				</g>
			) : null}
		</svg>
	);
};

/** Notice pliée (360 × 460) : lignes de texte, une ligne surlignée en rose (`highlight` 0 → 1) qui dit `line`. */
export const Notice: React.FC<{width?: number; highlight?: number; line?: string}> = ({width = 360, highlight = 0, line = 'par la pointe'}) => {
	const k = width / 360;
	return (
		<div style={{position: 'relative', width, height: 460 * k}}>
			<svg width={width} height={460 * k} viewBox="0 0 360 460" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path d="M20 20 H300 L340 60 V440 H20 Z" fill={LPI.paper} {...SK} />
				<path d="M300 20 V60 H340" fill={alpha(LPI.sky, 0.7)} {...SK} strokeWidth={5} />
				<rect x={50} y={52} width={180} height={34} rx={8} fill={N} />
				<text x={140} y={78} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={26} fill={LPI.paper}>
					NOTICE
				</text>
				{[120, 156, 192, 300, 336, 372, 408].map((y, i) => (
					<rect key={y} x={50} y={y} width={i % 3 === 2 ? 170 : 260} height={14} rx={7} fill={alpha(N, 0.18)} />
				))}
			</svg>
			<div style={{position: 'absolute', left: 40 * k, top: 222 * k, padding: `${6 * k}px ${14 * k}px`, borderRadius: 10 * k, fontFamily: FONT.title, fontWeight: 900, fontSize: 34 * k, color: N, whiteSpace: 'nowrap', background: `linear-gradient(90deg, ${alpha(LPI.pink, 0.85)} ${highlight * 100}%, transparent ${highlight * 100}%)`}}>{line}</div>
		</div>
	);
};

/** Patient couché sur le côté gauche, vu de face (480 × 260) : tête à gauche, la jambe du dessus pliée en avant. */
export const SideLying: React.FC<{width?: number; bend?: number}> = ({width = 480, bend = 1}) => {
	const kneeX = 330 + 30 * (1 - bend);
	const kneeY = 150 + 60 * (1 - bend);
	return (
		<svg width={width} height={(width * 260) / 480} viewBox="0 0 480 260" style={{overflow: 'visible'}}>
			{/* matelas */}
			<rect x={10} y={200} width={460} height={40} rx={20} fill={alpha(LPI.sky, 0.8)} {...SK} strokeWidth={6} />
			<rect x={20} y={168} width={110} height={34} rx={17} fill={LPI.paper} {...SK} strokeWidth={5} />
			{/* jambe du dessous, tendue */}
			<path d="M250 186 L440 192" stroke={N} strokeWidth={46} strokeLinecap="round" />
			<path d="M250 186 L440 192" stroke={LPI.blue} strokeWidth={32} strokeLinecap="round" />
			{/* corps (blouse) */}
			<path d="M120 196 C120 150 150 128 190 128 H250 C280 128 292 150 292 176 V196 Z" fill={LPI.blue} {...SK} />
			{/* jambe du dessus, pliée */}
			<path d={`M270 160 L${kneeX} ${kneeY} L420 ${kneeY + 34 * bend}`} fill="none" stroke={N} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
			<path d={`M270 160 L${kneeX} ${kneeY} L420 ${kneeY + 34 * bend}`} fill="none" stroke={LPI.sky} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" />
			{/* tête */}
			<circle cx={84} cy={142} r={40} fill={LPI.paper} {...SK} />
			<circle cx={84} cy={142} r={36} fill={alpha(LPI.pink, 0.3)} />
			<path d="M50 126 C56 98 104 96 118 122 C100 116 74 116 50 126 Z" fill={N} />
			<path d="M72 150 q6 4 12 0" fill="none" stroke={N} strokeWidth={4} strokeLinecap="round" />
			<circle cx={70} cy={140} r={4} fill={N} />
			<circle cx={94} cy={140} r={4} fill={N} />
		</svg>
	);
};

/** Anneau du sphincter (vu de profil, 220 × 260) : deux arcs roses ; `open` 0 → 1 = il s'écarte quand ça passe. */
export const Sphincter: React.FC<{width?: number; open?: number}> = ({width = 220, open = 0}) => (
	<svg width={width} height={(width * 260) / 220} viewBox="0 0 220 260" style={{overflow: 'visible'}}>
		<path d={`M110 ${20 - 14 * open} C150 ${20 - 14 * open} 170 ${70 - 10 * open} 170 ${100 - 10 * open}`} fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
		<path d={`M110 ${20 - 14 * open} C150 ${20 - 14 * open} 170 ${70 - 10 * open} 170 ${100 - 10 * open}`} fill="none" stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
		<path d={`M110 ${240 + 14 * open} C150 ${240 + 14 * open} 170 ${190 + 10 * open} 170 ${160 + 10 * open}`} fill="none" stroke={N} strokeWidth={30} strokeLinecap="round" />
		<path d={`M110 ${240 + 14 * open} C150 ${240 + 14 * open} 170 ${190 + 10 * open} 170 ${160 + 10 * open}`} fill="none" stroke={LPI.pink} strokeWidth={18} strokeLinecap="round" />
	</svg>
);

/** Deux fesses qui se serrent (300 × 220) : `squeeze` 0 → 1, petits traits de mouvement. */
export const Squeeze: React.FC<{width?: number; squeeze?: number}> = ({width = 300, squeeze = 0}) => {
	const frame = useCurrentFrame();
	const gap = 18 - 16 * squeeze;
	const wob = squeeze > 0.5 ? Math.sin(frame * 1.3) * 2 : 0;
	return (
		<svg width={width} height={(width * 220) / 300} viewBox="0 0 300 220" style={{overflow: 'visible'}}>
			<ellipse cx={150 - 62 - gap / 2 + wob} cy={120} rx={70} ry={86} fill={LPI.paper} {...SK} />
			<ellipse cx={150 + 62 + gap / 2 - wob} cy={120} rx={70} ry={86} fill={LPI.paper} {...SK} />
			<ellipse cx={150 - 70 - gap / 2} cy={110} rx={40} ry={50} fill={alpha(LPI.pink, 0.3)} />
			<ellipse cx={150 + 70 + gap / 2} cy={110} rx={40} ry={50} fill={alpha(LPI.pink, 0.3)} />
			{squeeze > 0.3
				? [-1, 1].map((sd) => (
						<g key={sd} opacity={squeeze} fill="none" stroke={LPI.blue} strokeWidth={7} strokeLinecap="round">
							<path d={`M${150 + sd * 160} 80 L${150 + sd * 136} 92`} />
							<path d={`M${150 + sd * 166} 122 L${150 + sd * 140} 122`} />
							<path d={`M${150 + sd * 160} 164 L${150 + sd * 136} 152`} />
						</g>
					))
				: null}
		</svg>
	);
};

/** Commentaire façon réseau social : pastille ronde (initiale), pseudo, texte. */
export const Comment: React.FC<{name: string; text: string; tone?: string; width?: number; font?: number}> = ({name, text, tone = LPI.sky, width = 620, font = 38}) => (
	<div style={{width, boxSizing: 'border-box', display: 'flex', gap: 18, alignItems: 'flex-start', padding: '18px 24px', borderRadius: 30, background: LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW}}>
		<div style={{width: 64, height: 64, flexShrink: 0, borderRadius: 32, background: tone, border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N}}>{name[0].toUpperCase()}</div>
		<div>
			<div style={{fontFamily: FONT.body, fontWeight: 900, fontSize: 26, color: alpha(N, 0.6)}}>@{name}</div>
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: font, color: N, lineHeight: 1.15}}>{text}</div>
		</div>
	</div>
);
