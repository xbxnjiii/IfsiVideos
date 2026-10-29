// Petits appareils réutilisables : téléphone qui compose un numéro (le 15), horloge murale (heure du début des
// signes), écran d'imagerie (scanner / IRM) qui balaie une image.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {alpha, FONT, LPI} from './theme';

const N = LPI.navy;

/** Téléphone : `digits` s'affiche au fur et à mesure, `press` enfonce le bouton d'appel, `ring` fait vibrer. */
export const Phone: React.FC<{digits: string; press?: number; ring?: number; size?: number}> = ({digits, press = 0, ring = 0, size = 230}) => {
	const frame = useCurrentFrame();
	const k = size / 230;
	const shake = ring > 0 ? Math.sin(frame * 2.4) * 4 * ring : 0;
	return (
		<div style={{position: 'relative', width: 230 * k, height: 420 * k, transform: `rotate(${shake}deg)`}}>
			{ring > 0
				? [0, 1, 2].map((i) => {
						const t = ((frame + i * 8) % 24) / 24;
						return (
							<div
								key={i}
								style={{
									position: 'absolute',
									left: 115 * k - (130 + t * 90) * k,
									top: 200 * k - (130 + t * 90) * k,
									width: (260 + t * 180) * k,
									height: (260 + t * 180) * k,
									borderRadius: '50%',
									border: `${6 * k}px solid ${i % 2 ? LPI.pink : LPI.blue}`,
									opacity: (1 - t) * ring * 0.8,
								}}
							/>
						);
					})
				: null}
			<div style={{position: 'absolute', inset: 0, borderRadius: 44 * k, background: N, boxShadow: `0 ${20 * k}px ${50 * k}px ${alpha(N, 0.3)}`}} />
			<div style={{position: 'absolute', left: 14 * k, top: 40 * k, right: 14 * k, bottom: 40 * k, borderRadius: 26 * k, background: LPI.paper, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{marginTop: 28 * k, fontFamily: FONT.body, fontWeight: 800, fontSize: 24 * k, letterSpacing: '0.12em', color: alpha(N, 0.55)}}>APPEL</div>
				<div style={{marginTop: 8 * k, height: 130 * k, fontFamily: FONT.title, fontWeight: 900, fontSize: 124 * k, color: N, lineHeight: 1}}>
					{digits}
					<span style={{opacity: frame % 20 < 10 ? 1 : 0, color: LPI.blue}}>|</span>
				</div>
				<div
					style={{
						marginTop: 'auto',
						marginBottom: 26 * k,
						width: 96 * k,
						height: 96 * k,
						borderRadius: 48 * k,
						background: LPI.pink,
						border: `${6 * k}px solid ${N}`,
						boxSizing: 'border-box',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${1 - 0.15 * press})`,
					}}
				>
					<svg width={48 * k} height={48 * k} viewBox="0 0 100 100">
						<path d="M28 14 L42 30 L34 42 C40 56 46 62 58 68 L70 60 L86 74 L76 88 C44 86 16 58 14 26 Z" fill={N} />
					</svg>
				</div>
			</div>
		</div>
	);
};

/** Horloge murale à l'heure `h`:`m` (les aiguilles tournent si `spin` > 0). */
export const WallClock: React.FC<{h: number; m: number; size?: number; spin?: number}> = ({h, m, size = 220, spin = 0}) => {
	const mm = m + spin * 60;
	const ma = (mm / 60) * 360;
	const ha = ((h % 12) / 12) * 360 + (mm / 60) * 30;
	return (
		<svg width={size} height={size} viewBox="-110 -110 220 220">
			<circle r={100} fill={LPI.paper} stroke={N} strokeWidth={10} />
			{Array.from({length: 12}, (_, i) => (
				<path key={i} d="M0 -84 V-72" transform={`rotate(${i * 30})`} stroke={N} strokeWidth={i % 3 === 0 ? 8 : 4} strokeLinecap="round" />
			))}
			<path d="M0 10 V-52" transform={`rotate(${ha})`} stroke={N} strokeWidth={11} strokeLinecap="round" />
			<path d="M0 14 V-76" transform={`rotate(${ma})`} stroke={LPI.blue} strokeWidth={7} strokeLinecap="round" />
			<circle r={10} fill={LPI.pink} stroke={N} strokeWidth={4} />
		</svg>
	);
};

/** Écran d'imagerie : cadre, étiquette (« IRM »), image (`children`) balayée par une ligne lumineuse. */
export const ScanMonitor: React.FC<{label: string; scan: number; width?: number; height?: number; children: React.ReactNode}> = ({label, scan, width = 540, height = 380, children}) => {
	const frame = useCurrentFrame();
	const y = ((frame * 6) % (height - 60)) + 20;
	return (
		<div style={{position: 'relative', width, height, borderRadius: 36, background: N, padding: 18, boxSizing: 'border-box'}}>
			<div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 22, background: alpha(LPI.sky, 0.55), overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
				{scan > 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: y, height: 10, background: alpha(LPI.pink, 0.75 * scan), boxShadow: `0 0 30px ${alpha(LPI.pink, 0.8 * scan)}`}} /> : null}
				<div style={{position: 'absolute', left: 18, top: 14, padding: '4px 16px', borderRadius: 999, background: N, fontFamily: FONT.title, fontWeight: 900, fontSize: 30, color: LPI.paper}}>{label}</div>
			</div>
		</div>
	);
};
