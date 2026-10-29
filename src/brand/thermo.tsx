// Briques « température » réutilisables : normes adulte (zones), thermomètre + lecture en °C,
// ondes de chaleur (fièvre) et flocons (froid) qui animent le socle.
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {Odometer} from './motion3';
import type {Zone} from './NormScale';
import {SnowPicto, Thermometer} from './pictos';
import {FONT, LPI} from './theme';

/** Normes adulte (liste fournie) : hypothermie < 35 · apyrétique 36,5 – 37,5 · fébricule 37,5 – 37,9 · hyperthermie ≥ 38 °C. */
export const TEMP_ZONES: Zone[] = [
	{name: 'hypothermie', range: '< 35 °C', tone: 'low', w: 1.15, lo: 33, hi: 35},
	{name: '', tone: 'gap', w: 0.42, lo: 35, hi: 36.5},
	{name: 'apyrétique', range: '36,5 – 37,5', tone: 'norm', w: 1.1, lo: 36.5, hi: 37.5},
	{name: 'fébricule', range: '37,5 – 37,9', tone: 'mid', w: 1.0, lo: 37.5, hi: 37.95},
	{name: 'hyperthermie', range: '≥ 38 °C', tone: 'high', w: 1.25, lo: 37.95, hi: 40.5},
];

/** Thermomètre + valeur qui roule (« 39,2 °C »). */
export const ThermoReadout: React.FC<{value: number; height?: number; numSize?: number; color?: string}> = ({value, height = 400, numSize = 150, color = LPI.navy}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
		<Thermometer value={value} height={height} />
		<div style={{display: 'flex', alignItems: 'baseline'}}>
			<Odometer value={value} decimals={1} places={2} size={numSize} color={color} />
			<span style={{fontFamily: FONT.title, fontWeight: 800, fontSize: numSize * 0.38, color: LPI.blue, marginLeft: 12}}>°C</span>
		</div>
	</div>
);

/** Ondes de chaleur (rose) qui montent sur le socle (`on` 0 → 1). */
export const HeatWaves: React.FC<{on: number; width?: number; height?: number; xs?: number[]}> = ({on, width = 936, height = 480, xs = [70, 330, 360, 820]}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<svg width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{xs.map((x0, k) => {
				const pts = Array.from({length: 32}, (_, i) => {
					const y = height - 30 - i * 12;
					const x = x0 + 12 * Math.sin((y + frame * 7 + k * 40) / 26);
					return `${x},${y}`;
				}).join(' ');
				return <polyline key={k} points={pts} fill="none" stroke={LPI.pink} strokeWidth={9} strokeLinecap="round" strokeDasharray="60 40" strokeDashoffset={-frame * 6} opacity={on * 0.9} />;
			})}
		</svg>
	);
};

/** Flocons qui tombent sur le socle (`on` 0 → 1). */
export const Snowfall: React.FC<{on: number; width?: number; height?: number}> = ({on, width = 936, height = 480}) => {
	const frame = useCurrentFrame();
	if (on <= 0) return null;
	return (
		<>
			{Array.from({length: 10}, (_, i) => {
				const x = 40 + random(`sx${i}`) * (width - 90);
				const y = ((frame * (2.4 + random(`sv${i}`) * 1.6) + random(`sy${i}`) * height) % (height + 30)) - 40;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: y, opacity: on * 0.85, transform: `rotate(${frame * 2 + i * 30}deg) scale(${0.6 + random(`ss${i}`) * 0.5})`}}>
						<SnowPicto size={48} />
					</div>
				);
			})}
		</>
	);
};

/** Jauge froid ↔ chaud (3 segments de la palette, sans mélange) + curseur qui suit `value` (34 → 41 °C). */
export const TempGauge: React.FC<{value: number; on: number; width?: number}> = ({value, on, width = 936}) => {
	if (on <= 0) return null;
	const bar = width - 260;
	const x = ((Math.min(41, Math.max(34, value)) - 34) / 7) * bar;
	const seg = (lo: number, hi: number, color: string, r: string) => (
		<div style={{position: 'absolute', left: ((lo - 34) / 7) * bar, width: ((hi - lo) / 7) * bar, top: 0, height: 44, background: color, borderRadius: r}} />
	);
	const label = (text: string, color: string) => <span style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, color, width: 130, textAlign: 'center'}}>{text}</span>;
	return (
		<div style={{display: 'flex', alignItems: 'center', width, opacity: Math.min(1, on * 1.5), transform: `scaleX(${0.6 + 0.4 * on})`}}>
			{label('froid', LPI.blue)}
			<div style={{position: 'relative', width: bar, height: 44}}>
				{seg(34, 36.5, LPI.sky, '22px 0 0 22px')}
				{seg(36.5, 37.5, LPI.blue, '0')}
				{seg(37.5, 41, LPI.pink, '0 22px 22px 0')}
				<div style={{position: 'absolute', left: x - 30, top: -8, width: 60, height: 60, borderRadius: 30, background: LPI.paper, border: `8px solid ${LPI.navy}`, boxSizing: 'border-box'}} />
			</div>
			{label('chaud', LPI.navy)}
		</div>
	);
};
