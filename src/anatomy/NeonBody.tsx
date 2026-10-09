// Planche de style « hologramme néon » : corps de verre sur bleu nuit, vaisseaux lumineux.
// (Exploration de direction artistique — même géométrie que Body.)
import React from 'react';
import {alpha, LPI} from '../brand/theme';
import {A_GEO, arterialTravel, heartState, V_GEO, VesselGeo} from './Body';
import {BONES, HEART, LUNGS, MUSCLES, PARTS, RIBS} from './body';
import {pointAt} from './geometry';
import {Heart, HEART_BOX} from './Heart';
import {Lungs} from './Lungs';

const Glow: React.FC<{id: string; sd: number; k?: number}> = ({id, sd, k = 1}) => (
	<filter id={id} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
		<feGaussianBlur in="SourceGraphic" stdDeviation={sd} result="b1" />
		<feGaussianBlur in="SourceGraphic" stdDeviation={sd * 3} result="b2" />
		<feComponentTransfer in="b2" result="b2k">
			<feFuncA type="linear" slope={k} />
		</feComponentTransfer>
		<feMerge>
			<feMergeNode in="b2k" />
			<feMergeNode in="b1" />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
);

const NeonVessel: React.FC<{v: VesselGeo; frame: number; travel: number; beats: number[]}> = ({v, frame, travel, beats}) => {
	const isA = v.kind === 'artery';
	const len = v.s.length;
	const n = Math.max(2, Math.floor(len / 26));
	const waves = isA
		? beats
				.filter((b) => b <= frame && frame - b < 90)
				.map((b) => (frame - b) * 16 - v.offset)
				.filter((d) => d > 0 && d < len + 80)
		: [];
	return (
		<g fill="none" strokeLinecap="round" strokeLinejoin="round">
			<path d={v.d} stroke={isA ? LPI.pink : LPI.blue} strokeWidth={v.w * 0.9} />
			<path d={v.d} stroke={isA ? alpha(LPI.paper, 0.85) : alpha(LPI.sky, 0.9)} strokeWidth={v.w * 0.28} />
			{Array.from({length: n}, (_, i) => {
				const l = (((i / n) * len + travel) % len + len) % len;
				const p = pointAt(v.s, l);
				return <circle key={i} cx={p.x} cy={p.y} r={v.w * 0.32} fill={LPI.paper} />;
			})}
			{waves.map((d, i) => (
				<path key={`w${i}`} d={v.d} stroke={LPI.paper} strokeWidth={v.w * 1.1} strokeDasharray={`80 ${len + 200}`} strokeDashoffset={80 - d} />
			))}
		</g>
	);
};

export const NeonBody: React.FC<{id: string; frame: number; beats: number[]; breath: number; px: number}> = ({id, frame, beats, breath, px}) => {
	const hs = heartState(frame, beats);
	const travel = arterialTravel(frame, beats, 1);
	const heartT = `translate(${HEART.x - HEART_BOX.cx * HEART.scale} ${HEART.y - HEART_BOX.cy * HEART.scale}) scale(${HEART.scale})`;
	const ink = (p: number) => p / px;
	return (
		<g>
			<defs>
				<Glow id={`${id}-g-vessel`} sd={ink(4)} k={0.9} />
				<Glow id={`${id}-g-line`} sd={ink(3)} k={0.7} />
				<Glow id={`${id}-g-heart`} sd={ink(10)} k={0.8} />
				<filter id={`${id}-rim`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
					<feGaussianBlur in="SourceAlpha" stdDeviation={16} result="b" />
					<feComposite in="SourceAlpha" in2="b" operator="arithmetic" k1="0" k2="1" k3="-1" k4="0" result="e" />
					<feFlood floodColor={LPI.sky} floodOpacity="0.75" />
					<feComposite in2="e" operator="in" />
				</filter>
				<filter id={`${id}-edge`} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
					<feMorphology in="SourceAlpha" operator="dilate" radius={ink(1.6)} result="d" />
					<feComposite in="d" in2="SourceAlpha" operator="out" result="ring" />
					<feFlood floodColor={LPI.sky} />
					<feComposite in2="ring" operator="in" result="r" />
					<feGaussianBlur in="r" stdDeviation={ink(5)} result="rb" />
					<feMerge>
						<feMergeNode in="rb" />
						<feMergeNode in="rb" />
						<feMergeNode in="r" />
					</feMerge>
				</filter>
				<clipPath id={`${id}-body`}>
					{PARTS.map((p) => (
						<path key={p.id} d={p.d} />
					))}
				</clipPath>
				<radialGradient id={`${id}-core`} cx={HEART.x} cy={HEART.y} r="520" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor={LPI.pink} stopOpacity={0.35 + 0.25 * hs.ventricles} />
					<stop offset="1" stopColor={LPI.pink} stopOpacity="0" />
				</radialGradient>
			</defs>
			{/* verre : volume + liseré lumineux */}
			<g fill={alpha(LPI.blue, 0.22)}>
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
			<rect width={1000} height={1800} fill={`url(#${id}-core)`} clipPath={`url(#${id}-body)`} />
			<g filter={`url(#${id}-rim)`}>
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
			<g clipPath={`url(#${id}-body)`}>
				<g filter={`url(#${id}-g-line)`} fill="none" stroke={alpha(LPI.sky, 0.35)} strokeWidth={ink(2.5)} strokeLinecap="round">
					{RIBS.map((d, i) => (
						<path key={i} d={d} />
					))}
					{BONES.map((d, i) => (
						<path key={`b${i}`} d={d} />
					))}
				</g>
				<g opacity={0.5}>
					{MUSCLES.map((m) => (
						<g key={m.id}>
							<path d={m.d} fill={alpha(LPI.pink, 0.12)} />
							{m.fibers.map((f, i) => (
								<path key={i} d={f} fill="none" stroke={alpha(LPI.sky, 0.22)} strokeWidth={ink(1.4)} />
							))}
						</g>
					))}
				</g>
				<g opacity={0.8} transform={`translate(${LUNGS.x} ${LUNGS.y}) scale(${LUNGS.scale})`}>
					<Lungs id={`${id}-lungs`} breath={breath} />
				</g>
				<g filter={`url(#${id}-g-vessel)`}>
					{V_GEO.map((v) => (
						<NeonVessel key={v.id} v={v} frame={frame} travel={frame * 1.4} beats={beats} />
					))}
					{A_GEO.map((v) => (
						<NeonVessel key={v.id} v={v} frame={frame} travel={travel} beats={beats} />
					))}
				</g>
				<g filter={`url(#${id}-g-heart)`} transform={heartT}>
					<Heart id={`${id}-heart`} contract={hs.ventricles} atria={hs.atria} />
				</g>
			</g>
			<g filter={`url(#${id}-edge)`}>
				{PARTS.map((p) => (
					<path key={p.id} d={p.d} />
				))}
			</g>
		</g>
	);
};
