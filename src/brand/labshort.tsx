// Gabarit des vidéos courtes « une analyse de labo » (série courte du tube jaune, n° 79 et suivantes, directives Instagram) :
// une accroche (titre + tube + illustration + pastilles dès l'image 0), des scènes « notion » toutes construites pareil
// (titre, explication courte, illustration, carte NORMES, ce qui fait monter / descendre, note) et une fin (lignes cochées +
// carte « prochaine vidéo »). Chaque élément apparaît au mot (`at`), comme dans les vidéos faites à la main.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Big, Live, Note, RowCard} from './bold';
import {Camera, Confetti} from './motion3';
import {Chip, Counter, NextCard, PINK_BG, Pop, SeriesPill, ShortBg} from './short';
import {Sfx, type SfxName} from './Sfx';
import {FONT, LPI, SHADOW} from './theme';
import {NormCard, Tube} from './tubes';

const N = LPI.navy;

/** Rond d'icône + légende. */
export const IconDot: React.FC<{children: React.ReactNode; label?: string; size?: number}> = ({children, label, size = 150}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
		<div style={{width: size, height: size, borderRadius: size / 2, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		{label ? <div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 32, color: N, whiteSpace: 'nowrap'}}>{label}</div> : null}
	</div>
);

/** Grande pastille de mot (le nom de l'analyse), sans cercle trop petit pour un mot long. */
export const WordPill: React.FC<{children: React.ReactNode; tone?: string; size?: number}> = ({children, tone = LPI.pink, size = 52}) => (
	<div style={{padding: `${size * 0.5}px ${size * 0.8}px`, borderRadius: 999, background: tone, border: `7px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: size, color: tone === LPI.navy || tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{children}</div>
);

export type LabSeries = {cap: string; label: string; total: number};

/** Tube de la série qui se balance doucement. */
export const SwayTube: React.FC<{cap: string; size?: number; gel?: boolean}> = ({cap, size = 110, gel = true}) => (
	<Live render={(f) => <div style={{transform: `rotate(${Math.sin(f / 9) * 3}deg)`}}><Tube size={size} cap={cap} gel={gel} level={0.72} serum={gel ? 1 : 0} /></div>} />
);

/* ═══════════════════════════════ ACCROCHE ═══════════════════════════════ */
export const LabHook: React.FC<{
	series: LabSeries;
	title: string;
	art: React.ReactNode;
	chips: {label: React.ReactNode; at: number; tone?: string}[];
	notes?: {text: React.ReactNode; at: number; size?: number}[];
	punches?: number[];
	shakes?: number[];
	extra?: React.ReactNode;
	tone?: string;
	titleSize?: number;
}> = ({series, title, art, chips, notes = [], punches = [], shakes = [], extra, tone = LPI.sky, titleSize = 100}) => (
	<AbsoluteFill>
		<ShortBg tone={tone} />
		<SeriesPill cap={series.cap} label={series.label} />
		<Counter steps={[]} total={series.total} />
		<Camera punches={punches} shakes={shakes} strength={0.03}>
			<Big from={-60} text={title} size={titleSize} y={190} />
			<Pop at={-12} x={170} y={760}>
				<SwayTube cap={series.cap} />
			</Pop>
			<Pop at={-12} x={630} y={760}>
				{art}
			</Pop>
			{chips.map((c, i) => {
				const per = chips.length > 3 ? 2 : chips.length;
				const row = Math.floor(i / per);
				const col = i % per;
				const n = Math.min(per, chips.length - row * per);
				return (
					<Chip key={i} at={c.at} x={540 + (col - (n - 1) / 2) * (n > 2 ? 330 : 420)} y={1130 + row * 110} tone={c.tone ?? (i % 2 ? LPI.pink : LPI.paper)} size={34}>
						{c.label}
					</Chip>
				);
			})}
			{notes.map((n, i) => (
				<Note key={i} at={n.at} y={chips.length > 3 ? 1390 + i * 130 : 1270 + i * 150} size={n.size ?? (i === notes.length - 1 ? 44 : 34)}>
					{n.text}
				</Note>
			))}
			{extra}
		</Camera>
		<Sfx name="whoosh" at={2} volume={0.12} />
		{chips.map((c, i) => (
			<Sfx key={i} name="pop" at={c.at} volume={0.15} />
		))}
		{notes.length ? <Sfx name="ding" at={notes[notes.length - 1].at + 6} volume={0.18} /> : null}
	</AbsoluteFill>
);

/* ═══════════════════════════════ NOTION ═══════════════════════════════ */
export type LabItem = {at: number; node: React.ReactNode};

/**
 * Une notion : titre (`titleAt`), pastille d'explication, illustration au centre (`art`), carte NORMES, rangée de pastilles
 * (`chips`), note en bas. `steps` = compteur [image, n]. `pink` alterne le fond.
 */
export const LabNotion: React.FC<{
	series: LabSeries;
	steps: [number, number][];
	title: string;
	titleAt: number;
	titleSize?: number;
	explain?: {text: React.ReactNode; at: number; to?: number};
	art?: LabItem;
	artY?: number;
	norm?: {rows: string[][]; at: number; y?: number};
	chips?: {label: React.ReactNode; at: number; tone?: string; icon?: React.ReactNode}[];
	note?: {text: React.ReactNode; at: number; size?: number};
	extra?: React.ReactNode;
	punches?: number[];
	pink?: boolean;
	sfx?: {name: SfxName; at: number; volume?: number}[];
}> = ({series, steps, title, titleAt, titleSize = 116, explain, art, artY = 760, norm, chips = [], note, extra, punches = [], pink, sfx = []}) => {
	const normY = norm?.y ?? 1050;
	return (
		<AbsoluteFill>
			<ShortBg tone={pink ? PINK_BG : LPI.sky} />
			<SeriesPill cap={series.cap} label={series.label} />
			<Counter steps={steps} total={series.total} />
			<Camera punches={punches} strength={0.03}>
				<Big from={titleAt - 2} text={title} size={titleSize} y={330} />
				{explain ? (
					<Chip at={explain.at} to={explain.to} x={540} y={540} tone={LPI.paper} size={36}>
						{explain.text}
					</Chip>
				) : null}
				{art ? (
					<Pop at={art.at} x={540} y={artY}>
						{art.node}
					</Pop>
				) : null}
				{norm ? (
					<Pop at={norm.at} x={540} y={normY}>
						<NormCard rows={norm.rows} />
					</Pop>
				) : null}
				{chips.map((c, i) => {
					const long = chips.some((x) => typeof x.label === 'string' && x.label.length > 18);
					const per = long ? 1 : chips.length > 2 ? 2 : chips.length;
					const row = Math.floor(i / per);
					const col = i % per;
					const n = Math.min(per, chips.length - row * per);
					return (
						<Pop key={i} at={c.at} x={540 + (col - (n - 1) / 2) * 470} y={normY + 190 + row * 110}>
							<div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', borderRadius: 999, background: c.tone ?? (i % 2 ? LPI.pink : LPI.paper), border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 34, color: c.tone === LPI.navy || c.tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>
								{c.icon}
								{c.label}
							</div>
						</Pop>
					);
				})}
				{note ? (
					<Note at={note.at} y={normY + 190 + (chips.some((x) => typeof x.label === 'string' && x.label.length > 18) ? chips.length : Math.ceil(chips.length / 2)) * 110 + 20} size={note.size ?? 30}>
						{note.text}
					</Note>
				) : null}
				{extra}
			</Camera>
			{steps.length ? <Sfx name="pop" at={steps[steps.length - 1][0]} volume={0.18} /> : null}
			{norm ? <Sfx name="ding" at={norm.at + 4} volume={0.18} /> : null}
			{chips.map((c, i) => (
				<Sfx key={i} name="pop" at={c.at} volume={0.14} />
			))}
			{sfx.map((s, i) => (
				<Sfx key={`s${i}`} name={s.name} at={s.at} volume={s.volume ?? 0.15} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ FIN ═══════════════════════════════ */
export const LabFin: React.FC<{
	series: LabSeries;
	title: string;
	rows: {t: number; title: string; sub: string}[];
	check: number;
	next?: {at: number; artAt: number; children: React.ReactNode};
	done?: React.ReactNode;
	pink?: boolean;
}> = ({series, title, rows, check, next, done, pink}) => {
	const h = rows.length > 3 ? 150 : 170;
	const gap = rows.length > 3 ? 170 : 190;
	return (
		<AbsoluteFill>
			<ShortBg tone={pink ? PINK_BG : LPI.sky} />
			<SeriesPill cap={series.cap} label={series.label} />
			<Counter steps={[[0, series.total]]} total={series.total} done />
			<Camera punches={[...rows.map((r) => r.t + 1), ...(next ? [next.at + 1] : [])]} strength={0.025}>
				<Big from={-2} text={title} size={92} y={190} />
				{rows.map((r, i) => (
					<RowCard key={r.title} at={r.t - 4} y={430 + i * gap} h={h} badge={String(i + 1)} badgeTone={i % 2 ? LPI.pink : LPI.sky} title={r.title} sub={r.sub} subAt={r.t + 4} check={check} size={rows.length > 3 ? 44 : 48} />
				))}
				<Confetti at={check} />
				{next ? (
					<Pop at={next.at - 2} x={540} y={430 + rows.length * gap + 160}>
						<NextCard
							art={
								<Live render={(f) => <div style={{transform: `scale(${f >= next.artAt - 4 ? 1 : 0.0001}) rotate(${Math.sin(f / 6) * 5}deg)`}}><Tube size={60} cap={series.cap} gel level={0.72} serum={1} /></div>} />
							}
						>
							{next.children}
						</NextCard>
					</Pop>
				) : null}
				{done}
			</Camera>
			{rows.map((r) => (
				<Sfx key={r.title} name="pop" at={r.t} volume={0.18} />
			))}
			<Sfx name="ding" at={check} volume={0.22} />
			{next ? <Sfx name="whoosh" at={next.at - 2} volume={0.15} /> : null}
		</AbsoluteFill>
	);
};

/** Le texte « prochaine vidéo » avec un mot en rose. */
export const NextTitle: React.FC<{pre?: string; hot: string; post?: string}> = ({pre = '', hot, post = ''}) => (
	<>
		{pre}
		<span style={{color: LPI.pink}}>{hot}</span>
		{post}
	</>
);

