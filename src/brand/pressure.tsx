// Briques « pression artérielle » réutilisables : normes adulte (zones), manomètre du tensiomètre,
// lecture « systolique / diastolique » qui roule (mmHg).
import React from 'react';
import {Odometer} from './motion3';
import type {Zone} from './NormScale';
import {alpha, FONT, LPI} from './theme';
import {interpolate} from 'remotion';

/** Normes adulte (liste fournie) : hypotension < 90/60 · normale ≈ 120/80 · hypertension (HTA) > 140/90 mmHg ; curseur = systolique. */
export const PA_ZONES: Zone[] = [
	{name: 'hypotension', range: '< 90/60', tone: 'low', w: 1, lo: 60, hi: 90},
	{name: 'normale', range: '≈ 120/80 mmHg', tone: 'norm', w: 1.15, lo: 90, hi: 140},
	{name: 'hypertension', range: '> 140/90', tone: 'high', w: 1, lo: 140, hi: 190},
];

/** Manomètre du tensiomètre (0 → 300 mmHg). */
export const Manometer: React.FC<{value: number; size?: number; tone?: string | null}> = ({value, size = 250, tone}) => {
	const a = interpolate(value, [0, 300], [-135, 135]);
	return (
		<svg width={size} height={size} viewBox="-100 -100 200 200" style={{overflow: 'visible'}}>
			<circle r={92} fill={LPI.paper} stroke={LPI.navy} strokeWidth={8} />
			<circle r={80} fill={tone ? alpha(tone, 0.5) : alpha(LPI.sky, 0.45)} />
			{Array.from({length: 31}, (_, i) => {
				const ang = ((-135 + i * 9) * Math.PI) / 180;
				const big = i % 5 === 0;
				const r0 = big ? 58 : 66;
				return (
					<line
						key={i}
						x1={Math.sin(ang) * r0}
						y1={-Math.cos(ang) * r0}
						x2={Math.sin(ang) * 76}
						y2={-Math.cos(ang) * 76}
						stroke={LPI.navy}
						strokeWidth={big ? 5 : 3}
						strokeLinecap="round"
						opacity={big ? 0.9 : 0.5}
					/>
				);
			})}
			<text y={44} textAnchor="middle" fontFamily={FONT.body} fontWeight={800} fontSize={17} fill={alpha(LPI.navy, 0.6)}>
				mmHg
			</text>
			<g transform={`rotate(${a})`}>
				<path d="M-6 10 L0 -70 L6 10 Z" fill={LPI.navy} />
			</g>
			<circle r={13} fill={LPI.blue} stroke={LPI.navy} strokeWidth={4} />
		</svg>
	);
};

/** Lecture du tensiomètre : « 120 / 80 mmHg », chiffre expliqué en surbrillance (`hi` = 'sys' | 'dia'). */
export const BPReadout: React.FC<{sys: number; dia: number; size?: number; hi?: 'sys' | 'dia' | null; tone?: string | null; labels?: boolean; unit?: boolean}> = ({
	sys,
	dia,
	size = 130,
	hi = null,
	tone = null,
	labels = true,
	unit = true,
}) => {
	const cell = (v: number, on: boolean, label: string, places: number) => (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
			<div style={{borderRadius: size * 0.24, padding: `0 ${size * 0.12}px`, background: tone ? alpha(tone, 0.6) : on ? LPI.sky : 'transparent', transform: `scale(${on ? 1.08 : 1})`}}>
				<Odometer value={v} places={places} size={size} color={on ? LPI.blue : LPI.navy} />
			</div>
			{labels ? <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: size * 0.26, color: on ? LPI.blue : alpha(LPI.navy, 0.55), marginTop: 4}}>{label}</div> : null}
		</div>
	);
	return (
		<div style={{display: 'flex', alignItems: 'flex-start', gap: size * 0.05}}>
			{cell(sys, hi === 'sys', 'systolique', 3)}
			<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: size * 0.92, color: LPI.navy, lineHeight: 1.1}}>/</div>
			{cell(dia, hi === 'dia', 'diastolique', 2)}
			{unit ? <div style={{fontFamily: FONT.title, fontWeight: 800, fontSize: size * 0.3, color: LPI.blue, marginTop: size * 0.62, marginLeft: 8}}>mmHg</div> : null}
		</div>
	);
};
