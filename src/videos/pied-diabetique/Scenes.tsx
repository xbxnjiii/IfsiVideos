// « Le pied diabétique (et l'ulcère de jambe) » — série courte « Les plaies » (≈ 36 s, voix Laura, vrais bruitages).
// Accroche « il ne sent rien » : image 0 = la jambe, la plaie sous le pied et « Un trou sous le pied… et il ne sent
// rien » ; la jauge DOULEUR reste à 0 ; il continue à marcher (pas, vrais bruits de pas), les jours passent (J + 1 …) et
// la plaie grandit. Puis pourquoi (le sucre en trop abîme les nerfs, le message de douleur ne remonte plus, la plaie
// grandit en silence : mal perforant plantaire), l'ulcère de jambe (veines, artères ou les deux : mixte), chute :
// regarder ses pieds tous les jours, dessus, dessous et entre les orteils.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Big, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt} from '../../brand/bold';
import {SugarCube} from '../../brand/glyco';
import {DayChip, FootTop, Meter} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {LEG_PTS, LowerLeg} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/** Carte blanche, étiquette dessous. */
const Tile: React.FC<{label: string; w?: number; h?: number; children: React.ReactNode}> = ({label, w = 320, h = 440, children}) => (
	<div style={{width: w, height: h, borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, boxSizing: 'border-box', padding: 14}}>
		<div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 40, lineHeight: 1.05, color: N, textAlign: 'center', whiteSpace: 'pre-line'}}>{label}</div>
	</div>
);

/** Pastille de couleur (cause). */
const Chip: React.FC<{text: string; tone: string}> = ({text, tone}) => (
	<div style={{padding: '14px 30px', borderRadius: 999, background: tone, border: `6px solid ${N}`, boxShadow: SHADOW, fontFamily: FONT.title, fontWeight: 900, fontSize: 50, color: tone === LPI.blue ? LPI.paper : N, whiteSpace: 'nowrap'}}>{text}</div>
);

/* ═══════════════════════════════ ACCROCHE : IL NE SENT RIEN ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const TROU = at('intro', 'trou');
	const SENT = at('intro', 'sent');
	const RIEN = at('intro', 'rien.');
	const CONTINUE = at('intro', 'continue');
	const JOURS = at('intro', 'jours.');
	const walking = frame >= CONTINUE - 4;
	const step = walking ? Math.abs(Math.sin((frame - CONTINUE) / 7)) : 0;
	const day = frame < CONTINUE ? 0 : Math.min(9, 1 + Math.floor((frame - CONTINUE) / 8));
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[TROU + 1, SENT + 1, RIEN + 1, CONTINUE + 1, JOURS + 1]} shakes={[RIEN + 2]} strength={0.035}>
				<Big from={-60} text={'Un trou sous le pied…\net il ne *sent* *rien*'} size={96} y={140} />
				{/* la jambe : elle marche, la plaie grandit */}
				<Fly at={-60} x={420} y={880} from="bottom">
					<div style={{transform: `translateY(${-50 * step}px) rotate(${-6 * step}deg)`}}>
						<Live render={(f) => <LowerLeg width={440} footSore={1} grow={interpolate(f, [CONTINUE, JOURS + 20], [0, 1], ease)} silent={fadeIn(f, CONTINUE, 30)} nerve={fadeIn(f, SENT - 6, 8)} numb={fadeIn(f, RIEN - 2, 6)} />} />
					</div>
				</Fly>
				<Fly at={CONTINUE - 4} x={850} y={700} from="right">
					<DayChip text={`J + ${day}`} size={200} />
				</Fly>
				<Fly at={SENT - 6} x={540} y={1360} from="left">
					<Live render={(f) => <Meter label="Douleur" value={0.03} word={f >= RIEN ? '0' : ''} width={980} />} />
				</Fly>
			</Camera>
			<Flash at={RIEN} max={0.2} />
			<Sfx name="pop" at={TROU} volume={0.07} />
			<Sfx name="buzz" at={RIEN} volume={0.06} dur={12} />
			<Sfx name="stairs" at={CONTINUE - 2} volume={0.3} dur={70} />
			{Array.from({length: 5}, (_, i) => (
				<Sfx key={i} name="tick" at={CONTINUE + 8 + i * 8} volume={0.05} />
			))}
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI : LES NERFS ABÎMÉS ═══════════════════════════════ */
const LEG = {x: 330, y: 960, w: 500};
const lk = LEG.w / 500;
const legPt = (p: readonly [number, number]) => ({x: LEG.x - LEG.w / 2 + p[0] * lk, y: LEG.y - (700 * lk) / 2 + p[1] * lk});

export const Pied: React.FC = () => {
	const DIAB = at('pied', 'diabétique,');
	const SUCRE = at('pied', 'sucre');
	const ABIME = at('pied', 'abîme');
	const DOULEUR = at('pied', 'douleur');
	const REMONTE = at('pied', 'remonte');
	const PETITE = at('pied', 'petite');
	const GRANDIT = at('pied', 'grandit');
	const SILENCE = at('pied', 'silence.');
	const MAL = at('pied', 'mal');
	const sole = legPt(LEG_PTS.sole);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[DIAB + 1, ABIME + 1, REMONTE + 1, GRANDIT + 1, MAL + 1]} strength={0.03}>
				<Big from={-2} to={DOULEUR - 6} text={'Le sucre *abîme*\nles nerfs'} size={118} />
				<Big from={DOULEUR - 4} to={PETITE - 6} text={'La douleur ne\n*remonte* plus'} size={118} />
				<Big from={PETITE - 4} to={MAL - 6} text={'Elle grandit\nen *silence*'} size={124} />
				<Big from={MAL - 4} text={'Mal *perforant*\n*plantaire*'} size={124} />
				<Fly at={-4} x={LEG.x} y={LEG.y} from="left">
					<Live render={(f) => <LowerLeg width={LEG.w} nerve={1} numb={fadeIn(f, ABIME + 4, 8)} footSore={fadeIn(f, PETITE - 4, 6)} grow={interpolate(f, [GRANDIT - 2, SILENCE + 12], [0, 1], ease)} silent={fadeIn(f, GRANDIT, 20)} />} />
				</Fly>
				{/* le sucre en trop attaque le nerf */}
				<Live
					render={(f) =>
						f >= SUCRE - 4
							? Array.from({length: 6}, (_, i) => {
									const t0 = SUCRE - 4 + i * 3;
									if (f < t0) return null;
									const target = legPt([252, 120 + i * 70]);
									const k = interpolate(f, [t0, t0 + 12], [0, 1], ease);
									const out = fadeIn(f, DOULEUR, 10);
									return (
										<div key={i} style={{position: 'absolute', left: 860 + (target.x + 30 - 860) * k - 22, top: 500 + i * 60 + (target.y - 500 - i * 60) * k - 22, transform: `scale(${popAt(f, t0)})`, opacity: 1 - out}}>
											<SugarCube size={44} rot={i * 20 + f * 2} />
										</div>
									);
								})
							: null
					}
				/>
				<Fly at={DOULEUR - 4} out={PETITE - 6} x={800} y={760} from="right" to="right">
					<Live render={(f) => <Meter label="Douleur" value={0.03} word="0" width={460} />} />
				</Fly>
				<PointTag at={MAL - 2} x={780} y={1300} px={sole.x} py={sole.y} size={42}>
					sous le pied
				</PointTag>
				<Note at={SILENCE} to={MAL - 6} x={560} y={1160} size={40}>
					pas mal = pas vue
				</Note>
			</Camera>
			<Flash at={ABIME} max={0.2} />
			<Sfx name="pop" at={SUCRE - 4} volume={0.07} />
			<Sfx name="buzz" at={ABIME + 4} volume={0.06} dur={12} />
			<Sfx name="pop" at={PETITE - 4} volume={0.07} />
			<Sfx name="stamp" at={MAL} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ L'ULCÈRE DE JAMBE ═══════════════════════════════ */
export const Ulcere: React.FC = () => {
	const JAMBE = at('ulcere', 'jambe');
	const ULCERE = at('ulcere', 'ulcère');
	const GUERIT = at('ulcere', 'guérit');
	const VEINES = at('ulcere', 'veines,');
	const ARTERES = at('ulcere', 'artères…');
	const DEUX = at('ulcere', 'deux.');
	const MIXTE = at('ulcere', 'mixte.');
	const ankle = legPt([214, 410]);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.5)}} />
			<Camera punches={[JAMBE + 1, ULCERE + 1, VEINES + 1, ARTERES + 1, MIXTE + 1]} strength={0.03}>
				<Big from={-2} to={GUERIT - 6} text={'Et sur la\n*jambe* ?'} size={128} />
				<Big from={GUERIT - 4} to={VEINES - 6} text={'Un *ulcère* :\nil ne guérit pas'} size={112} />
				<Big from={VEINES - 4} text={'À cause de…'} size={128} />
				<Fly at={-4} x={LEG.x} y={LEG.y} from="right">
					<Live render={(f) => <LowerLeg width={LEG.w} ulcer={interpolate(f, [ULCERE - 4, ULCERE + 6], [0, 1], ease)} veins={fadeIn(f, VEINES - 2, 8)} stasis={fadeIn(f, VEINES + 4, 20)} />} />
				</Fly>
				<PointTag at={ULCERE + 2} to={VEINES - 6} x={800} y={760} px={ankle.x} py={ankle.y} size={46}>
					ulcère
				</PointTag>
				<Fly at={VEINES - 4} x={790} y={700} from="right">
					<Chip text="les veines" tone={LPI.blue} />
				</Fly>
				<Fly at={ARTERES - 4} x={790} y={880} from="right">
					<Chip text="les artères" tone={LPI.pink} />
				</Fly>
				<Fly at={DEUX - 4} x={790} y={1060} from="right">
					<Chip text="les deux" tone={LPI.paper} />
				</Fly>
				<Stamp at={MIXTE} x={790} y={1230} text="= MIXTE" size={80} rot={-6} />
			</Camera>
			<Sfx name="pop" at={ULCERE} volume={0.07} />
			<Sfx name="pop" at={VEINES - 4} volume={0.08} />
			<Sfx name="pop" at={ARTERES - 4} volume={0.08} />
			<Sfx name="pop" at={DEUX - 4} volume={0.08} />
			<Sfx name="stamp" at={MIXTE} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : REGARDE SES PIEDS ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const DIAB = at('fin', 'diabétique');
	const REGARDES = at('fin', 'regardes');
	const JOURS = at('fin', 'jours');
	const DESSUS = at('fin', 'dessus,');
	const DESSOUS = at('fin', 'dessous…');
	const ENTRE = at('fin', 'entre');
	const ORTEILS = at('fin', 'orteils');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[DIAB + 1, REGARDES + 1, DESSUS + 1, DESSOUS + 1, ENTRE + 1]} strength={0.035}>
				<Big from={-2} to={REGARDES - 6} text={'Ton patient est\n*diabétique* ?'} size={116} {...ON_BLUE} />
				<Big from={REGARDES - 4} text={'Regarde ses *pieds*,\ntous les jours'} size={104} {...ON_BLUE} />
				<Fly at={DESSUS - 6} x={200} y={900} from="bottom">
					<Tile label="dessus">
						<FootTop width={200} view="top" />
					</Tile>
				</Fly>
				<Fly at={DESSOUS - 6} x={540} y={900} from="bottom">
					<Tile label="dessous">
						<FootTop width={200} view="sole" sore={0.8} />
					</Tile>
				</Fly>
				<Fly at={ENTRE - 6} x={880} y={900} from="bottom">
					<Tile label={'entre les\norteils'}>
						<Live render={(f) => <FootTop width={200} view="top" gaps={interpolate(f, [ORTEILS - 4, ORTEILS + 14], [0, 1], clamp)} />} />
					</Tile>
				</Fly>
				<Note at={JOURS - 2} y={1260} size={54}>
					chaque jour ✓
				</Note>
			</Camera>
			<Flash at={REGARDES} max={0.2} color={LPI.paper} />
			<Sfx name="pop" at={DESSUS - 6} volume={0.08} />
			<Sfx name="pop" at={DESSOUS - 6} volume={0.08} />
			<Sfx name="pop" at={ENTRE - 6} volume={0.08} />
			<Sfx name="ding" at={JOURS} volume={0.07} />
		</AbsoluteFill>
	);
};
