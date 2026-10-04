import React, {useId} from 'react';
import {interpolateColors, useCurrentFrame} from 'remotion';

/**
 * Personnage récurrent de la série (buste, style vectoriel arrondi).
 * viewBox 600 x 800 — la tête est centrée sur (300, 315), le thorax sur (300, 680).
 */
export const CHAR_W = 600;
export const CHAR_H = 800;

export const CHAR = {
	skin: '#F3C6A9',
	skinShade: '#E2A88A',
	hair: '#2A2240',
	shirt: '#1FA59A',
	shirtDark: '#147A72',
	lips: '#8A3E46',
	cheek: '#FF8A8A',
};

export type CharacterProps = {
	/** 0 → 1 : fièvre (joues rouges, goutte de sueur). */
	hot?: number;
	/** 0 → 1 : froid (teint bleuté, frissons). */
	cold?: number;
	/** 0 → 1 : amplitude respiratoire (thorax qui se soulève). */
	breath?: number;
	/** 0 → 1 : impulsion du battement cardiaque. */
	beat?: number;
	/** 0 → 1 : thorax « en transparence » pour montrer les organes. */
	xray?: number;
	showHeart?: boolean;
	showLungs?: boolean;
	heartColor?: string;
	lungColor?: string;
	width?: number;
	style?: React.CSSProperties;
};

const HEART_PATH = 'M0 22 C-34 -6 -22 -40 0 -24 C22 -40 34 -6 0 22 Z';

export const Character: React.FC<CharacterProps> = ({
	hot = 0,
	cold = 0,
	breath = 0,
	beat = 0,
	xray = 0,
	showHeart = false,
	showLungs = false,
	heartColor = '#FF2E4D',
	lungColor = '#2EE6D6',
	width = CHAR_W,
	style,
}) => {
	const frame = useCurrentFrame();
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const id = (name: string) => `${name}-${uid}`;
	// clignement toutes les ~3,2 s
	const b = frame % 97;
	const blink = b < 6 ? 1 - Math.sin((b / 6) * Math.PI) * 0.92 : 1;
	const headTilt = Math.sin(frame / 38) * 1.6;
	const shiver = cold > 0.3 ? Math.sin(frame * 2.7) * 3 * cold : 0;
	const skin = interpolateColors(cold, [0, 1], [CHAR.skin, '#C9D8F0']);
	const skinShade = interpolateColors(cold, [0, 1], [CHAR.skinShade, '#A9BCE0']);
	const cheekOpacity = 0.32 + 0.55 * hot;
	const cheekColor = interpolateColors(hot, [0, 1], [CHAR.cheek, '#FF4D4D']);
	const brow = hot * 10 - cold * 6;
	const lungScale = 1 + 0.12 * breath;
	const heartScale = 2.3 * (1 + 0.16 * beat);

	return (
		<svg
			width={width}
			height={(width * CHAR_H) / CHAR_W}
			viewBox={`0 0 ${CHAR_W} ${CHAR_H}`}
			style={{overflow: 'visible', transform: `translateX(${shiver}px)`, ...style}}
		>
			<defs>
				<linearGradient id={id('char-shirt')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={CHAR.shirt} />
					<stop offset="100%" stopColor={CHAR.shirtDark} />
				</linearGradient>
				<radialGradient id={id('char-face')} cx="45%" cy="40%" r="70%">
					<stop offset="0%" stopColor={skin} />
					<stop offset="100%" stopColor={skinShade} />
				</radialGradient>
				<radialGradient id={id('char-heart')} cx="40%" cy="35%" r="70%">
					<stop offset="0%" stopColor="#FF7A8E" />
					<stop offset="100%" stopColor={heartColor} />
				</radialGradient>
				<clipPath id={id('char-torso')}>
					<path d="M40 800 C40 640 120 540 300 540 C480 540 560 640 560 800 Z" />
				</clipPath>
			</defs>

			{/* ombre portée douce */}
			<ellipse cx="300" cy="800" rx="250" ry="26" fill="rgba(0,0,0,0.35)" />

			{/* ---- buste ---- */}
			<g
				transform={`translate(0 ${-8 * breath}) translate(300 800) scale(${1 + 0.02 * breath} ${1 + 0.03 * breath}) translate(-300 -800)`}
			>
				<path d="M40 800 C40 640 120 540 300 540 C480 540 560 640 560 800 Z" fill={`url(#${id('char-shirt')})`} />
				<path
					d="M120 640 C150 590 210 560 260 552"
					stroke="rgba(255,255,255,0.18)"
					strokeWidth="10"
					fill="none"
					strokeLinecap="round"
				/>
				<path d="M248 544 Q300 632 352 544 Z" fill={skinShade} />
				<g clipPath={`url(#${id('char-torso')})`}>
					<rect x="0" y="520" width="600" height="300" fill="#0A1028" opacity={0.62 * xray} />
					{showLungs ? (
						<g opacity={xray}>
							<path d="M300 548 V598" stroke={lungColor} strokeWidth="14" strokeLinecap="round" />
							<path
								d="M300 598 Q284 608 266 628 M300 598 Q316 608 334 628"
								stroke={lungColor}
								strokeWidth="10"
								fill="none"
								strokeLinecap="round"
							/>
							<g transform={`translate(226 690) scale(${lungScale}) translate(-226 -690)`}>
								<path
									d="M266 604 C222 592 180 632 172 692 C166 742 190 772 232 770 C260 768 272 742 272 702 Z"
									fill={lungColor}
									opacity="0.85"
								/>
								<path
									d="M240 640 C222 660 214 690 214 720"
									stroke="rgba(255,255,255,0.45)"
									strokeWidth="6"
									fill="none"
									strokeLinecap="round"
								/>
							</g>
							<g transform={`translate(374 690) scale(${lungScale}) translate(-374 -690)`}>
								<path
									d="M334 604 C378 592 420 632 428 692 C434 742 410 772 368 770 C340 768 328 742 328 702 Z"
									fill={lungColor}
									opacity="0.85"
								/>
								<path
									d="M360 640 C378 660 386 690 386 720"
									stroke="rgba(255,255,255,0.45)"
									strokeWidth="6"
									fill="none"
									strokeLinecap="round"
								/>
							</g>
						</g>
					) : null}
					{showHeart ? (
						<g opacity={Math.max(xray, 0.001)} transform={`translate(326 690) scale(${heartScale})`}>
							<circle r="34" fill={heartColor} opacity={0.25 * beat} />
							<path d={HEART_PATH} fill={`url(#${id('char-heart')})`} />
							<path
								d="M-14 -18 C-20 -16 -24 -10 -24 -4"
								stroke="rgba(255,255,255,0.6)"
								strokeWidth="3"
								fill="none"
								strokeLinecap="round"
							/>
						</g>
					) : null}
				</g>
			</g>

			{/* ---- cou ---- */}
			<path d="M262 420 H338 V552 Q300 574 262 552 Z" fill={skinShade} />

			{/* ---- tête ---- */}
			<g transform={`rotate(${headTilt} 300 470)`}>
				<circle cx="160" cy="322" r="30" fill={skinShade} />
				<circle cx="440" cy="322" r="30" fill={skinShade} />
				<ellipse cx="300" cy="315" rx="150" ry="165" fill={`url(#${id('char-face')})`} />
				{/* cheveux */}
				<path
					d="M146 300 C134 168 228 118 312 122 C404 126 470 190 456 300 C446 252 414 216 362 204 C330 236 258 246 202 224 C178 246 160 270 146 300 Z"
					fill={CHAR.hair}
				/>
				<path
					d="M250 150 C300 132 360 140 400 170"
					stroke="rgba(255,255,255,0.12)"
					strokeWidth="10"
					fill="none"
					strokeLinecap="round"
				/>
				{/* sourcils */}
				<path
					d={`M222 ${262 + brow * 0.2} Q250 ${248 - brow * 0.3} 278 ${260 - brow}`}
					stroke={CHAR.hair}
					strokeWidth="10"
					fill="none"
					strokeLinecap="round"
				/>
				<path
					d={`M322 ${260 - brow} Q350 ${248 - brow * 0.3} 378 ${262 + brow * 0.2}`}
					stroke={CHAR.hair}
					strokeWidth="10"
					fill="none"
					strokeLinecap="round"
				/>
				{/* yeux */}
				<g transform={`translate(0 312) scale(1 ${blink}) translate(0 -312)`}>
					<ellipse cx="250" cy="312" rx="15" ry="19" fill="#1B1530" />
					<ellipse cx="350" cy="312" rx="15" ry="19" fill="#1B1530" />
					<circle cx="255" cy="305" r="5" fill="white" />
					<circle cx="355" cy="305" r="5" fill="white" />
				</g>
				{/* nez */}
				<path d="M300 332 Q289 362 305 366" stroke={skinShade} strokeWidth="7" fill="none" strokeLinecap="round" />
				{/* joues */}
				<circle cx="214" cy="372" r="26" fill={cheekColor} opacity={cheekOpacity} />
				<circle cx="386" cy="372" r="26" fill={cheekColor} opacity={cheekOpacity} />
				{/* bouche */}
				{cold > 0.5 ? (
					<path
						d="M262 404 q9.5 -9 19 0 t19 0 t19 0 t19 0"
						stroke={CHAR.lips}
						strokeWidth="8"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				) : hot > 0.5 ? (
					<ellipse cx="300" cy="404" rx="22" ry="14" fill={CHAR.lips} />
				) : (
					<path d="M262 398 Q300 426 338 398" stroke={CHAR.lips} strokeWidth="9" fill="none" strokeLinecap="round" />
				)}
				{/* sueur */}
				<g opacity={hot} transform={`translate(0 ${(frame % 40) * 0.6 * hot})`}>
					<path d="M430 214 C430 214 450 240 450 252 A20 20 0 1 1 410 252 C410 240 430 214 430 214 Z" fill="#7CC8FF" />
					<circle cx="423" cy="250" r="5" fill="white" opacity="0.7" />
				</g>
			</g>
		</svg>
	);
};
