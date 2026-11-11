// « Plaie aiguë ou chronique ? » — série courte « Les plaies » (≈ 37 s, voix Laura).
// Accroche « deux plaies, le même jour » : image 0 = deux plaies côte à côte, « Deux plaies, le même jour… » et le
// calendrier J 0 ; les jours défilent jusqu'à J + 21 (tic-tac), la plaie 1 s'efface (GUÉRIE), la plaie 2 reste
// (TOUJOURS LÀ). Puis la plaie aiguë (frise des semaines : le curseur avance, la plaie guérit avant 4 semaines ;
// exemples : coupure, cicatrice d'opération), la plaie chronique (le curseur ralentit, se bloque (cadenas), dépasse
// 4 à 6 semaines), les 3 grands exemples (ulcère de jambe, escarre, pied diabétique), chute : une plaie qui traîne
// n'est jamais normale, la loupe cherche pourquoi (circulation, appui, diabète, infection).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, popAt, Posed} from '../../brand/bold';
import {DayChip, WeeksBar, WoundTop} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {Finger, LowerLeg, Squeeze} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/** Carte blanche, étiquette dessous. */
const Tile: React.FC<{label: string; w?: number; h?: number; hl?: number; children: React.ReactNode}> = ({label, w = 320, h = 420, hl = 0, children}) => (
	<div style={{width: w, height: h, borderRadius: 40, background: LPI.paper, border: `${6 + 4 * hl}px solid ${hl > 0.5 ? LPI.pink : N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, boxSizing: 'border-box', padding: 14}}>
		<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: N, textAlign: 'center', whiteSpace: 'pre-line'}}>{label}</div>
	</div>
);

/* ═══════════════════════════════ ACCROCHE : DEUX PLAIES, LE MÊME JOUR ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const PLAIES = at('intro', 'plaies,');
	const JOUR = at('intro', 'jour.');
	const TROIS = at('intro', 'trois');
	const TARD = at('intro', 'tard,');
	const DISPARU = at('intro', 'disparu…');
	const AUTRE = at('intro', "l'autre");
	const TOUJOURS = at('intro', 'toujours');
	const day = Math.round(interpolate(frame, [TROIS - 4, TARD + 8], [0, 21], clamp));
	const heal = interpolate(frame, [TROIS, TARD + 12], [0, 1], ease);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[PLAIES + 1, JOUR + 1, TROIS + 1, DISPARU + 1, TOUJOURS + 1]} shakes={[TOUJOURS + 2]} strength={0.035}>
				<Big from={-60} to={TROIS - 6} text={'Deux plaies,\nle *même* jour…'} size={124} y={150} />
				<Big from={TROIS - 4} text={'*3* *semaines*\nplus tard…'} size={124} y={150} />
				<Fly at={-60} x={290} y={780} from="left" move={[{at: DISPARU, s: 1.06, dur: 6}, {at: DISPARU + 8, s: 1, dur: 6}]}>
					<Tile label="plaie 1" w={480} h={440} hl={fadeIn(frame, DISPARU, 4)}>
						<WoundTop width={400} kind="clean" heal={heal} />
					</Tile>
				</Fly>
				<Fly at={-60} x={790} y={780} from="right" move={[{at: TOUJOURS, s: 1.06, dur: 6}, {at: TOUJOURS + 8, s: 1, dur: 6}]}>
					<Tile label="plaie 2" w={480} h={440}>
						<Live render={(f) => <WoundTop width={400} kind="ragged" bruise={0.3 + 0.4 * fadeIn(f, AUTRE, 20)} necrosis={0.5 * fadeIn(f, TOUJOURS, 10)} />} />
					</Tile>
				</Fly>
				<Fly at={-60} x={540} y={1250} from="bottom">
					<div style={{transform: `scale(${day > 0 && day < 21 ? 1 + 0.04 * Math.sin(frame) : 1})`}}>
						<DayChip text={day === 0 ? 'J 0' : `J + ${day}`} size={230} />
					</div>
				</Fly>
				<Stamp at={DISPARU} x={290} y={940} text="GUÉRIE ✓" size={66} rot={-8} />
				<Stamp at={TOUJOURS} x={790} y={940} text="TOUJOURS LÀ" size={56} rot={6} />
			</Camera>
			<Flash at={TOUJOURS} max={0.25} />
			<Sfx name="pop" at={PLAIES - 2} volume={0.07} />
			{Array.from({length: 8}, (_, i) => (
				<Sfx key={i} name="tick" at={TROIS - 2 + i * 4} volume={0.07} />
			))}
			<Sfx name="ding" at={DISPARU} volume={0.08} />
			<Sfx name="stamp" at={TOUJOURS} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE AIGUË ═══════════════════════════════ */
export const Aigue: React.FC = () => {
	const AIGUE = at('aigue', 'aiguë');
	const GUERIT = at('aigue', 'guérit');
	const MOINS = at('aigue', 'moins');
	const QUATRE = at('aigue', 'quatre');
	const SEMAINES = at('aigue', 'semaines.');
	const COMME = at('aigue', 'comme');
	const COUPURE = at('aigue', 'coupure,');
	const CICAT = at('aigue', 'cicatrice');
	const OPERATION = at('aigue', 'opération.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[AIGUE + 1, GUERIT + 1, QUATRE + 1, COUPURE + 1, OPERATION + 1]} strength={0.03}>
				<Big from={-2} to={COMME - 6} text={'Plaie *aiguë*'} size={140} />
				<Big from={COMME - 4} text={'Par *exemple*…'} size={140} />
				<Fly at={-4} x={540} y={520} from="right">
					<Live render={(f) => <WeeksBar pos={interpolate(f, [GUERIT - 4, SEMAINES + 8], [0, 3.3], ease)} zone={[0, 4, alpha(LPI.blue, 0.45)]} />} />
				</Fly>
				<Fly at={-4} out={COMME - 6} x={540} y={930} from="bottom" to="bottom">
					<Live render={(f) => <WoundTop width={780} kind="clean" heal={interpolate(f, [MOINS - 10, SEMAINES + 10], [0, 1], ease)} />} />
				</Fly>
				<Note at={QUATRE} to={COMME - 6} y={1250} size={50}>
					guérie en moins de 4 semaines
				</Note>
				<Fly at={COUPURE - 6} x={290} y={1010} from="left">
					<Tile label="une coupure" w={460} h={440}>
						<Live render={(f) => <Finger width={380} cut={1} heal={interpolate(f, [COUPURE + 6, CICAT], [0, 0.8], ease)} />} />
					</Tile>
				</Fly>
				<Fly at={CICAT - 6} x={790} y={1010} from="right">
					<Tile label="après une opération" w={460} h={440}>
						<WoundTop width={380} kind="clean" open={0.35} sutures={1} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={GUERIT - 4} volume={0.07} />
			<Sfx name="ding" at={SEMAINES + 6} volume={0.08} />
			<Sfx name="whoosh" at={COUPURE - 6} volume={0.07} />
			<Sfx name="whoosh" at={CICAT - 6} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE CHRONIQUE ═══════════════════════════════ */
export const Chronique: React.FC = () => {
	const CHRONIQUE = at('chronique', 'chronique');
	const CICAT = at('chronique', 'cicatrisation');
	const RALENTIE = at('chronique', 'ralentie,');
	const BLOQUEE = at('chronique', 'bloquée,');
	const SOUVENT = at('chronique', 'souvent');
	const AUDELA = at('chronique', 'au-delà');
	const QUATRE = at('chronique', 'quatre');
	const SIX = at('chronique', 'six');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.55)}} />
			<Camera punches={[CHRONIQUE + 1, RALENTIE + 1, BLOQUEE + 1, QUATRE + 1, SIX + 1]} shakes={[BLOQUEE + 2]} strength={0.03}>
				<Big from={-2} to={RALENTIE - 6} text={'Plaie\n*chronique*'} size={132} />
				<Big from={RALENTIE - 4} to={SOUVENT - 6} text={'Ralentie…\nou *bloquée*'} size={132} />
				<Big from={SOUVENT - 4} text={'Au-delà de\n*4* à *6* semaines'} size={116} />
				<Fly at={-4} x={540} y={600} from="left">
					<Live
						render={(f) => (
							<WeeksBar
								pos={interpolate(f, [CICAT - 4, RALENTIE - 4, RALENTIE + 16, BLOQUEE, AUDELA, SIX + 12], [0, 2.4, 3.1, 3.4, 3.4, 7], ease)}
								zone={[4, 8, alpha(LPI.pink, 0.8)]}
								lock={fadeIn(f, BLOQUEE - 2, 6) * (1 - fadeIn(f, AUDELA, 6))}
							/>
						)}
					/>
				</Fly>
				<Fly at={-4} x={540} y={1010} from="bottom">
					<Live render={(f) => <WoundTop width={780} kind="ragged" bruise={0.5} necrosis={0.3 + 0.4 * fadeIn(f, SOUVENT, 30)} />} />
				</Fly>
				<Stamp at={BLOQUEE} x={540} y={1320} text="BLOQUÉE" size={90} rot={-6} out={SOUVENT - 6} />
				<Note at={SIX + 6} y={1320} size={48}>
					elle traîne, encore et encore
				</Note>
			</Camera>
			<Sfx name="pop" at={CICAT - 4} volume={0.07} />
			<Sfx name="buzz" at={BLOQUEE} volume={0.06} dur={12} />
			<Sfx name="stamp" at={BLOQUEE} volume={0.1} />
			<Sfx name="tick" at={QUATRE} volume={0.08} />
			<Sfx name="tick" at={SIX} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES 3 GRANDS EXEMPLES ═══════════════════════════════ */
export const Exemples: React.FC = () => {
	const EXEMPLES = at('exemples', 'exemples');
	const ULCERE = at('exemples', "l'ulcère");
	const ESCARRE = at('exemples', "l'escarre…");
	const PIED = at('exemples', 'pied');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[EXEMPLES + 1, ULCERE + 1, ESCARRE + 1, PIED + 1]} strength={0.035}>
				<Big from={-2} text={'*3* grands\nexemples'} size={132} />
				<Fly at={ULCERE - 4} x={200} y={880} from="bottom">
					<Tile label={'ulcère\nde jambe'} w={320} h={480}>
						<LowerLeg width={200} ulcer={1} veins={1} />
					</Tile>
				</Fly>
				<Fly at={ESCARRE - 4} x={540} y={880} from="bottom">
					<Tile label="escarre" w={320} h={480}>
						<Live render={(f) => <Squeeze width={280} press={1} dead={fadeIn(f, ESCARRE, 12)} />} />
					</Tile>
				</Fly>
				<Fly at={PIED - 4} x={880} y={880} from="bottom">
					<Tile label={'pied\ndiabétique'} w={320} h={480}>
						<LowerLeg width={200} footSore={1} grow={0.6} silent={0.6} />
					</Tile>
				</Fly>
			</Camera>
			<Sfx name="pop" at={ULCERE - 4} volume={0.08} />
			<Sfx name="pop" at={ESCARRE - 4} volume={0.08} />
			<Sfx name="pop" at={PIED - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : ON CHERCHE POURQUOI ═══════════════════════════════ */
const WHY = ['circulation ?', 'appui ?', 'diabète ?', 'infection ?'];

export const Fin: React.FC = () => {
	const frame = useCurrentFrame();
	const TRAINE = at('fin', 'traîne,');
	const NORMAL = at('fin', 'normal');
	const CHERCHE = at('fin', 'cherche');
	const POURQUOI = at('fin', 'pourquoi');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[TRAINE + 1, NORMAL + 1, CHERCHE + 1, POURQUOI + 1]} shakes={[NORMAL + 2]} strength={0.035}>
				<Big from={-2} to={CHERCHE - 6} text={'Une plaie\nqui *traîne*…'} size={128} {...ON_BLUE} />
				<Big from={CHERCHE - 4} text={'On cherche\n*pourquoi* !'} size={128} {...ON_BLUE} />
				<Fly at={-4} x={540} y={900} from="bottom">
					<WoundTop width={760} kind="ragged" bruise={0.5} necrosis={0.6} />
				</Fly>
				<Stamp at={NORMAL} x={540} y={1240} text="PAS NORMAL !" size={86} rot={-6} out={CHERCHE - 4} />
				{/* la loupe cherche la cause */}
				<Blur on={frame >= CHERCHE - 4 && frame <= POURQUOI + 40}>
					<Posed
						pose={(f) => {
							if (f < CHERCHE - 4) return null;
							const t = (f - (CHERCHE - 4)) / 14;
							return {x: 540 + 220 * Math.cos(t), y: 900 + 90 * Math.sin(t * 1.3), s: popAt(f, CHERCHE - 4)};
						}}
					>
						<svg width={300} height={300} viewBox="-150 -150 300 300" style={{overflow: 'visible'}}>
							<circle r={90} fill={alpha(LPI.paper, 0.3)} stroke={N} strokeWidth={16} />
							<circle r={74} fill="none" stroke={LPI.sky} strokeWidth={6} />
							<path d="M64 64 L130 130" stroke={N} strokeWidth={30} strokeLinecap="round" />
							<path d="M70 70 L126 126" stroke={LPI.pink} strokeWidth={14} strokeLinecap="round" />
						</svg>
					</Posed>
				</Blur>
				{WHY.map((w, i) => {
					const t0 = CHERCHE + 4 + i * 7;
					const pos = [
						[230, 1250],
						[760, 1250],
						[250, 1370],
						[770, 1370],
					][i];
					return frame >= t0 ? (
						<div key={w} style={{position: 'absolute', left: pos[0], top: pos[1], transform: `translate(-50%, -50%) scale(${popAt(frame, t0)})`, padding: '10px 26px', borderRadius: 999, background: i % 2 ? LPI.pink : LPI.paper, border: `5px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 44, color: N, whiteSpace: 'nowrap'}}>
							{w}
						</div>
					) : null;
				})}
			</Camera>
			<Flash at={NORMAL} max={0.25} color={LPI.paper} />
			<Sfx name="stamp" at={NORMAL} volume={0.12} />
			<Sfx name="whoosh" at={CHERCHE - 4} volume={0.07} />
			{WHY.map((w, i) => (
				<Sfx key={w} name="pop" at={CHERCHE + 4 + i * 7} volume={0.07} />
			))}
		</AbsoluteFill>
	);
};
