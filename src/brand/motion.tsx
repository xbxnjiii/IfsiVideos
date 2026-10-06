import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {alpha, FONT, GRID, LPI} from './theme';

/* ─────────────────────── transition par forme ─────────────────────── */

type RevealProps = {x: number; y: number};

/**
 * Transition de marque : la scène suivante se dévoile dans un cercle qui s'agrandit
 * depuis un point (souvent l'élément dont on va parler), bordé d'un anneau bleu clair.
 */
const CircleRevealComponent: React.FC<TransitionPresentationComponentProps<RevealProps>> = ({
	children,
	presentationDirection,
	presentationProgress,
	passedProps,
}) => {
	const p = Easing.inOut(Easing.cubic)(presentationProgress);
	if (presentationDirection === 'exiting') {
		return <AbsoluteFill style={{transform: `scale(${1 - 0.03 * p})`}}>{children}</AbsoluteFill>;
	}
	const {x, y} = passedProps;
	const maxR = Math.hypot(Math.max(x, GRID.w - x), Math.max(y, GRID.h - y)) + 40;
	const r = p * maxR;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{clipPath: `circle(${r}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
			<svg width={GRID.w} height={GRID.h} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
				<circle cx={x} cy={y} r={r} fill="none" stroke={LPI.sky} strokeWidth={28 * (1 - p) + 2} opacity={1 - p * 0.9} />
			</svg>
		</AbsoluteFill>
	);
};

export const circleReveal = (props: RevealProps): TransitionPresentation<RevealProps> => ({
	component: CircleRevealComponent,
	props,
});

/* ─────────────────────── sous-titres ─────────────────────── */

export type CaptionWord = {text: string; start: number; end: number};
type Page = {words: CaptionWord[]; start: number; end: number};

const paginate = (words: CaptionWord[], maxWords = 4, maxChars = 24): Page[] => {
	const pages: Page[] = [];
	let cur: CaptionWord[] = [];
	const flush = () => {
		if (cur.length) pages.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	for (const w of words) {
		const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
		if (cur.length >= maxWords || (cur.length > 0 && chars > maxChars)) flush();
		cur.push(w);
		if (/[.,?!:]$/.test(w.text)) flush();
	}
	flush();
	return pages.map((p, i) => {
		const next = pages[i + 1];
		return {...p, end: next && next.start - p.end < 0.7 ? next.start : p.end + 0.35};
	});
};

const renderWord = (t: string) =>
	t.split(/(SpO2)/).map((part, i) =>
		part === 'SpO2' ? (
			<span key={i}>
				SpO<sub style={{fontSize: '0.6em', verticalAlign: '-0.15em', lineHeight: 0}}>2</sub>
			</span>
		) : (
			<span key={i}>{part}</span>
		),
	);

/** Sous-titres de marque : pilule claire, mot prononcé en bleu principal. */
export const Captions: React.FC<{words: CaptionWord[]; offsetFrames: number; hideAfter?: number}> = ({
	words,
	offsetFrames,
	hideAfter,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pages = useMemo(() => paginate(words), [words]);
	if (hideAfter !== undefined && frame >= hideAfter) return null;
	const t = (frame - offsetFrames) / fps;
	const page = pages.find((p) => t >= p.start - 0.05 && t < p.end);
	if (!page) return null;
	const since = (t - page.start + 0.05) * fps;
	const k = Math.min(1, since / 6);
	return (
		<div
			style={{position: 'absolute', top: GRID.captions, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}
		>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: 12,
					maxWidth: 860,
					padding: '12px 30px',
					borderRadius: 999,
					background: LPI.paper,
					border: `3px solid ${LPI.sky}`,
					boxShadow: `0 10px 30px ${alpha(LPI.navy, 0.08)}`,
					fontFamily: FONT.body,
					fontWeight: 700,
					fontSize: 40,
					lineHeight: 1.25,
					color: LPI.navy,
					opacity: k,
					transform: `translateY(${(1 - k) * 8}px)`,
				}}
			>
				{page.words.map((w, i) => {
					const active = t >= w.start - 0.03 && (i === page.words.length - 1 || t < page.words[i + 1].start);
					const said = t >= w.start - 0.03;
					return (
						<span key={i} style={{color: active ? LPI.blue : said ? LPI.navy : alpha(LPI.navy, 0.45)}}>
							{renderWord(w.text)}
						</span>
					);
				})}
			</div>
		</div>
	);
};

/** Fondu simple d'une valeur 0→1 entre deux frames (aide de lecture). */
export const ramp = (frame: number, a: number, b: number) =>
	interpolate(frame, [a, b], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
