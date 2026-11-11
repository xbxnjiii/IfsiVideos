// « L'escarre » — série courte « Les plaies » (≈ 36 s, voix Laura).
// Accroche « quelques heures » : image 0 = le patient allongé, l'horloge et « Allongé quelques heures… » ; les heures
// défilent (aiguilles qui tournent, tic-tac), la caméra s'approche du bas du dos, les points d'appui s'allument :
// PEAU EN DANGER. Puis sous la peau (l'os et le matelas écrasent les tissus, le sang ne passe plus, les cellules
// meurent : l'escarre), où (talons, bas du dos, arrière de la tête), comment l'éviter (changer de position, matelas
// adapté, surveiller la peau), chute : une rougeur qui ne disparaît pas quand on appuie = ALERTE.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, fadeIn, Flash, Fly, Live, Note, PointTag, RowCard} from '../../brand/bold';
import {WallClock} from '../../brand/devices';
import {EyeIcon} from '../../brand/icons';
import {AirMattress, TurnArrows} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {LYING_PTS, LyingBody, LyingPoint, SKIN, SkinBlock, Squeeze} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/* ═══════════════════════════════ ACCROCHE : QUELQUES HEURES ═══════════════════════════════ */
const BODY = {x: 540, y: 1000, w: 1000};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const ALLONGE = at('intro', 'allongé');
	const QUELQUES = at('intro', 'quelques');
	const HEURES = at('intro', 'heures…');
	const POURTANT = at('intro', 'pourtant,');
	const PEAU = at('intro', 'peau');
	const MOURIR = at('intro', 'mourir.');
	const spin = interpolate(frame, [QUELQUES - 4, HEURES + 18], [0, 4], ease);
	const dusk = 0.18 * Math.sin(Math.PI * interpolate(frame, [QUELQUES - 4, HEURES + 18], [0, 2], clamp)) ** 2;
	const k = BODY.w / 900;
	const sac = {x: (LYING_PTS.sacrum[0] - 450) * k, y: (LYING_PTS.sacrum[1] - 150) * k};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<AbsoluteFill style={{background: alpha(N, dusk)}} />
			<Camera punches={[ALLONGE + 1, HEURES + 1, POURTANT + 1, PEAU + 1, MOURIR + 1]} shakes={[MOURIR + 2]} strength={0.035}>
				<Big from={-60} to={POURTANT - 6} text={'Allongé quelques\n*heures*…'} size={112} y={150} />
				<Big from={POURTANT - 4} text={'…et sa peau\n*meurt* !'} size={124} y={150} />
				<Fly at={-60} out={POURTANT - 6} x={800} y={600} from="right" to="right">
					<WallClock h={8} m={0} size={280} spin={spin} />
				</Fly>
				<Fly at={-60} x={BODY.x} y={BODY.y} from="bottom" move={[{at: POURTANT - 4, x: BODY.x - sac.x * 1.6, y: BODY.y - sac.y * 1.6, s: 1.6, dur: 18}]}>
					<Live render={(f) => <LyingBody width={BODY.w} points={fadeIn(f, PEAU - 4, 8)} focus={f >= MOURIR - 4 ? ['sacrum'] : []} />} />
				</Fly>
				<Stamp at={MOURIR} x={540} y={1330} text="PEAU EN DANGER" size={70} rot={-6} />
			</Camera>
			<Flash at={MOURIR} max={0.3} />
			{Array.from({length: 9}, (_, i) => (
				<Sfx key={i} name="tick" at={QUELQUES - 4 + i * 5} volume={0.07} />
			))}
			<Sfx name="whoosh" at={POURTANT - 4} volume={0.08} />
			<Sfx name="heart" at={PEAU - 6} volume={0.35} dur={50} />
			<Sfx name="stamp" at={MOURIR} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SOUS LA PEAU : ÉCRASÉE ═══════════════════════════════ */
export const Pression: React.FC = () => {
	const OS = at('pression', "l'os");
	const TISSUS = at('pression', 'tissus');
	const ECRASES = at('pression', 'écrasés.');
	const SANG = at('pression', 'sang');
	const PASSE = at('pression', 'passe');
	const CELLULES = at('pression', 'cellules');
	const MEURENT = at('pression', 'meurent.');
	const ESCARRE = at('pression', "l'escarre.");
	const ENTRE = at('pression', 'entre');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.4)}} />
			<Camera punches={[OS + 1, ECRASES + 1, PASSE + 1, MEURENT + 1, ESCARRE + 1]} shakes={[ECRASES + 2, ESCARRE + 2]} strength={0.03}>
				<Big from={-2} to={TISSUS - 6} text={'Sous la *peau*'} size={136} />
				<Big from={TISSUS - 4} to={SANG - 6} text={'Tissus\n*écrasés*'} size={136} />
				<Big from={SANG - 4} to={CELLULES - 6} text={'Le sang ne\n*passe* plus'} size={128} />
				<Big from={CELLULES - 4} to={ESCARRE - 6} text={'Les cellules\n*meurent*'} size={128} />
				<Big from={ESCARRE - 4} text={'*L’escarre*'} size={150} />
				<Fly at={-4} x={540} y={900} from="bottom">
					<Live render={(f) => <Squeeze width={1000} press={interpolate(f, [ENTRE - 4, ECRASES + 4], [0, 1], ease)} flow={1 - interpolate(f, [SANG, PASSE + 8], [0, 1], clamp)} dead={interpolate(f, [CELLULES - 4, MEURENT + 10], [0, 1], ease)} />} />
				</Fly>
				<Note at={OS} to={TISSUS - 6} y={1290} size={44}>
					l&apos;os appuie d&apos;un côté, le matelas de l&apos;autre
				</Note>
			</Camera>
			<Flash at={ESCARRE} max={0.3} />
			<Sfx name="pop" at={OS} volume={0.07} />
			<Sfx name="impact" at={ECRASES} volume={0.12} />
			<Sfx name="heart" at={SANG - 6} volume={0.35} dur={40} />
			<Sfx name="buzz" at={MEURENT} volume={0.06} dur={12} />
			<Sfx name="stamp" at={ESCARRE} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ OÙ ? LES POINTS D'APPUI ═══════════════════════════════ */
export const Ou: React.FC = () => {
	const APPUIE = at('ou', 'appuie');
	const TALONS = at('ou', 'talons,');
	const DOS = at('ou', 'dos,');
	const TETE = at('ou', 'tête…');
	const B = {x: 540, y: 900, w: 1000};
	const k = B.w / 900;
	const p = (n: LyingPoint) => ({x: B.x - B.w / 2 + LYING_PTS[n][0] * k, y: B.y - (300 * k) / 2 + LYING_PTS[n][1] * k});
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[APPUIE + 1, TALONS + 1, DOS + 1, TETE + 1]} strength={0.03}>
				<Big from={-2} text={'Là où le\ncorps *appuie*'} size={130} />
				<Fly at={-4} x={B.x} y={B.y} from="right">
					<Live render={(f) => {
						const focus: LyingPoint[] = [];
						if (f >= TALONS - 4) focus.push('heel');
						if (f >= DOS - 4) focus.push('sacrum');
						if (f >= TETE - 4) focus.push('occiput');
						return <LyingBody width={B.w} points={fadeIn(f, APPUIE - 4, 8)} focus={focus} />;
					}} />
				</Fly>
				<PointTag at={TALONS - 4} x={880} y={1190} px={p('heel').x} py={p('heel').y} size={44}>
					talons
				</PointTag>
				<PointTag at={DOS - 4} x={580} y={1300} px={p('sacrum').x} py={p('sacrum').y} size={44}>
					bas du dos
				</PointTag>
				<PointTag at={TETE - 4} x={250} y={1190} px={p('occiput').x} py={p('occiput').y} size={44}>
					arrière de la tête
				</PointTag>
			</Camera>
			{[TALONS, DOS, TETE].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.08} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ COMMENT L'ÉVITER ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const EVITER = at('geste', "l'éviter,");
	const CHANGE = at('geste', 'change');
	const SOUVENT = at('geste', 'souvent,');
	const MATELAS = at('geste', 'matelas');
	const SURVEILLE = at('geste', 'surveille');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[EVITER + 1, CHANGE + 1, MATELAS + 1, SURVEILLE + 1]} strength={0.03}>
				<Big from={-2} text={'Pour *l’éviter*'} size={136} {...ON_BLUE} />
				<RowCard at={CHANGE - 4} y={420} h={290} art={240} badge={1} title="On change de position" sub="souvent" subAt={SOUVENT - 4} size={56}>
					<TurnArrows size={200} />
				</RowCard>
				<RowCard at={MATELAS - 4} y={740} h={290} art={300} badge={2} title="Un matelas adapté" from="left" size={56}>
					<AirMattress width={290} />
				</RowCard>
				<RowCard at={SURVEILLE - 4} y={1060} h={290} art={240} badge={3} title="On surveille la peau" size={56}>
					<EyeIcon size={180} />
				</RowCard>
			</Camera>
			<Sfx name="pop" at={CHANGE - 4} volume={0.08} />
			<Sfx name="pop" at={MATELAS - 4} volume={0.08} />
			<Sfx name="pop" at={SURVEILLE - 4} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : LA ROUGEUR QUI RESTE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const ROUGEUR = at('fin', 'rougeur');
	const DISPARAIT = at('fin', 'disparaît');
	const APPUIE = at('fin', 'appuie');
	const ALERTE = at('fin', 'alerte');
	const DEBUT = at('fin', 'début');
	const SK = {x: 40, y: 720, w: 1000};
	const k = SK.w / SKIN.w;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[ROUGEUR + 1, APPUIE + 1, ALERTE + 1, DEBUT + 1]} shakes={[ALERTE + 2]} strength={0.035}>
				<Big from={-2} to={ALERTE - 6} text={'Une *rougeur*\nqui reste…'} size={128} />
				<Big from={ALERTE - 4} to={DEBUT - 6} text={'*Alerte* !'} size={150} />
				<Big from={DEBUT - 4} text={'Le *début* d’une\nescarre !'} size={120} />
				<Fly at={-4} x={SK.x + SK.w / 2} y={SK.y + (SK.w * 500) / 900 / 2} from="bottom">
					<Live render={(f) => <SkinBlock width={SK.w} redness={fadeIn(f, ROUGEUR - 4, 10)} press={interpolate(f, [DISPARAIT - 8, DISPARAIT, APPUIE + 6, APPUIE + 16], [0, 1, 1, 0], ease)} />} />
				</Fly>
				<PointTag at={APPUIE + 14} x={760} y={1380} px={SK.x + SKIN.cx * k} py={SK.y + (SKIN.top + 10) * k} size={44}>
					toujours rouge !
				</PointTag>
				<Stamp at={ALERTE} x={300} y={1380} text="ALERTE !" size={76} rot={-8} />
			</Camera>
			<Flash at={ALERTE} max={0.3} />
			<Sfx name="pop" at={ROUGEUR - 4} volume={0.07} />
			<Sfx name="pop" at={DISPARAIT} volume={0.06} />
			<Sfx name="buzz" at={ALERTE} volume={0.07} dur={14} />
			<Sfx name="stamp" at={ALERTE} volume={0.12} />
		</AbsoluteFill>
	);
};
