import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {BODY, C} from '../../theme';
import {Sub} from './MedIcons';

export type CaptionWord = {text: string; start: number; end: number};

type Page = {words: CaptionWord[]; start: number; end: number};

const MAX_WORDS = 4;
const MAX_CHARS = 24;

/** Regroupe les mots en « pages » courtes, coupées sur la ponctuation. */
const paginate = (words: CaptionWord[]): Page[] => {
	const pages: Page[] = [];
	let cur: CaptionWord[] = [];
	const flush = () => {
		if (cur.length) pages.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
		cur = [];
	};
	for (const w of words) {
		const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
		if (cur.length >= MAX_WORDS || (cur.length > 0 && chars > MAX_CHARS)) flush();
		cur.push(w);
		if (/[.,?!]$/.test(w.text)) flush();
	}
	flush();
	// chaque page reste affichée jusqu'à la suivante (sauf vrai blanc)
	return pages.map((p, i) => {
		const next = pages[i + 1];
		const end = next && next.start - p.end < 0.6 ? next.start : p.end + 0.3;
		return {...p, end};
	});
};

/** Rend « SpO2 » avec un vrai indice. */
const renderText = (t: string) => {
	const parts = t.split(/(SpO2|O2)/);
	return parts.map((p, i) =>
		p === 'SpO2' ? (
			<span key={i}>
				SpO<Sub>2</Sub>
			</span>
		) : p === 'O2' ? (
			<span key={i}>
				O<Sub>2</Sub>
			</span>
		) : (
			<span key={i}>{p}</span>
		),
	);
};

/**
 * Sous-titres mot à mot (le mot prononcé s'allume). Lisibles sans le son,
 * placés au-dessus de la zone couverte par l'interface TikTok / Reels.
 */
export const Captions: React.FC<{
	words: CaptionWord[];
	offsetFrames: number;
	accentAt: (sec: number) => string;
	top?: number;
}> = ({words, offsetFrames, accentAt, top = 1405}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pages = useMemo(() => paginate(words), [words]);
	const t = (frame - offsetFrames) / fps;
	const page = pages.find((p) => t >= p.start - 0.05 && t < p.end);
	if (!page) return null;
	const since = (t - page.start + 0.05) * fps;
	const pop = Math.min(1, since / 5);
	const accent = accentAt(t + offsetFrames / fps);
	return (
		<div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
			<div
				style={{
					maxWidth: 880,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: 14,
					padding: '14px 30px',
					borderRadius: 26,
					background: 'rgba(5,8,22,0.62)',
					fontFamily: BODY,
					fontWeight: 800,
					fontSize: 50,
					lineHeight: 1.2,
					color: C.white,
					transform: `scale(${0.92 + 0.08 * pop}) translateY(${(1 - pop) * 10}px)`,
					opacity: 0.4 + 0.6 * pop,
				}}
			>
				{page.words.map((w, i) => {
					const active = t >= w.start - 0.03 && (i === page.words.length - 1 || t < page.words[i + 1].start);
					const spoken = t >= w.start - 0.03;
					return (
						<span
							key={i}
							style={{
								color: active ? accent : spoken ? C.white : 'rgba(245,247,255,0.55)',
								transform: `scale(${active ? 1.06 : 1})`,
								display: 'inline-block',
							}}
						>
							{renderText(w.text)}
						</span>
					);
				})}
			</div>
		</div>
	);
};
