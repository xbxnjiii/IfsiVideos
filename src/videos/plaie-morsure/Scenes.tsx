// « La plaie par morsure » — série courte « Les plaies » (≈ 34 s, voix Laura, vrais bruitages : miaulement, feulement).
// Accroche « le chat » (situation vécue) : image 0 = le chat, la main et « Deux petits trous… rien de méchant ? » ; le
// chat miaule puis mord (feulement, il bondit), deux petits trous au mot ; « le lendemain » (J + 1, la nuit passe) : la
// main gonfle, rose et chaude, tampon « × 2 ». Puis pourquoi (la bouche pleine de microbes, les crocs les enfoncent
// sous la peau), le risque (jauge INFECTION au max, même toute petite), le bon réflexe (laver longuement eau + savon,
// désinfecter, consulter le jour même), chute : chat, chien… ou humain : toute morsure se montre au médecin.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, Posed, RowCard} from '../../brand/bold';
import {Faucet, Swarm} from '../../brand/hands';
import {BittenHand, Cat, DayChip, Dog, Meter, Stetho} from '../../brand/injury';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {AntisepticBottle} from '../../brand/sampling';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {SKIN, SkinBlock, WoundTool} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/* ═══════════════════════════════ ACCROCHE : LE CHAT ═══════════════════════════════ */
const HAND = {x: 700, y: 1060, w: 440};
const hk = HAND.w / 300;
const mark = {x: HAND.x + (159 - 150) * hk, y: HAND.y + (266 - 200) * hk};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const CHAT = at('intro', 'chat');
	const MORDU = at('intro', 'mordu.');
	const TROUS = at('intro', 'trous,');
	const LENDEMAIN = at('intro', 'lendemain,');
	const DOUBLE = at('intro', 'doublé');
	const VOLUME = at('intro', 'volume');
	const night = interpolate(frame, [LENDEMAIN - 8, LENDEMAIN, LENDEMAIN + 10], [0, 0.55, 0], clamp);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[CHAT + 1, MORDU + 1, TROUS + 1, LENDEMAIN + 1, DOUBLE + 1, VOLUME + 1]} shakes={[MORDU + 2, VOLUME + 2]} strength={0.04}>
				<Big from={-60} to={LENDEMAIN - 6} text={'Deux petits *trous*…\nrien de *méchant* ?'} size={100} y={140} />
				<Big from={LENDEMAIN - 4} text={'Le *lendemain*…'} size={130} y={150} />
				{/* le chat : il miaule, puis il mord */}
				<Blur on={frame >= MORDU - 8 && frame <= LENDEMAIN + 4}>
					<Posed
						pose={(f) => {
							if (f > LENDEMAIN + 2) return null;
							const lunge = interpolate(f, [MORDU - 6, MORDU, MORDU + 4, MORDU + 16], [0, 1, 1, 0], {...clamp, easing: Easing.inOut(Easing.quad)});
							const away = interpolate(f, [LENDEMAIN - 10, LENDEMAIN + 2], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							const hop = f >= CHAT && f < CHAT + 10 ? -Math.sin(((f - CHAT) / 10) * Math.PI) * 40 : 0;
							return {x: 330 + 230 * lunge - 900 * away, y: 720 + 230 * lunge + hop, rot: 18 * lunge};
						}}
					>
						<Live render={(f) => <Cat size={430} open={f < MORDU - 7 ? interpolate(f, [CHAT, CHAT + 3, CHAT + 10], [0, 0.6, 0], clamp) : interpolate(f, [MORDU - 6, MORDU, MORDU + 14], [0, 1, 0.2], clamp)} angry={fadeIn(f, MORDU - 8, 6) * (1 - fadeIn(f, MORDU + 20, 8))} />} />
					</Posed>
				</Blur>
				{/* la main : deux petits trous… puis elle gonfle */}
				<Fly at={-60} x={HAND.x} y={HAND.y} from="right" move={[{at: LENDEMAIN - 4, x: 540, y: 1000, s: 1.25, dur: 12}]}>
					<Live render={(f) => <BittenHand width={HAND.w} marks={fadeIn(f, MORDU + 1, 8)} swell={interpolate(f, [LENDEMAIN + 4, DOUBLE, VOLUME + 6], [0, 0.35, 1], ease)} />} />
				</Fly>
				<PointTag at={TROUS - 4} to={LENDEMAIN - 8} x={760} y={1460} px={mark.x} py={mark.y} size={46}>
					2 petits trous
				</PointTag>
				<Fly at={LENDEMAIN - 2} x={230} y={620} from="left">
					<DayChip text="J + 1" size={210} />
				</Fly>
				<Stamp at={VOLUME} x={800} y={650} text="× 2" size={130} rot={-10} />
				<Burst at={MORDU} x={mark.x} y={mark.y} r={220} n={12} />
			</Camera>
			{night > 0 ? <AbsoluteFill style={{background: alpha(N, night)}} /> : null}
			<Flash at={MORDU} max={0.3} />
			<Flash at={VOLUME} max={0.3} />
			<Sfx name="meow" at={CHAT - 2} volume={0.45} />
			<Sfx name="hiss" at={MORDU - 8} volume={0.45} />
			<Sfx name="impact" at={MORDU} volume={0.1} />
			<Sfx name="pop" at={TROUS - 4} volume={0.07} />
			<Sfx name="whoosh" at={LENDEMAIN - 8} volume={0.08} />
			<Sfx name="tick" at={LENDEMAIN} volume={0.08} />
			<Sfx name="stamp" at={VOLUME} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI : LES MICROBES DE LA BOUCHE ═══════════════════════════════ */
const SK = {x: 40, y: 940, w: 1000};
const k = SK.w / SKIN.w;

export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const BOUCHE = at('pourquoi', 'bouche');
	const MICROBES = at('pourquoi', 'microbes.');
	const MORDANT = at('pourquoi', 'mordant,');
	const DENTS = at('pourquoi', 'dents');
	const ENFONCES = at('pourquoi', 'enfoncés');
	const PROFOND = at('pourquoi', 'profondément');
	const BITE = DENTS + 2;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.4)}} />
			<Camera punches={[BOUCHE + 1, MICROBES + 1, BITE + 1, ENFONCES + 1, PROFOND + 1]} shakes={[BITE + 2]} strength={0.03}>
				<Big from={-2} to={MORDANT - 6} text={'Pleine de\n*microbes*'} size={128} />
				<Big from={MORDANT - 4} text={'Enfoncés\n*sous* la peau'} size={124} />
				<Fly at={-4} x={SK.x + SK.w / 2} y={SK.y + (SK.w * 500) / 900 / 2} from="bottom" dist={1100}>
					<Live render={(f) => <SkinBlock width={SK.w} shape="bite" open={1.3} depth={interpolate(f, [BITE - 2, BITE + 4, ENFONCES, PROFOND + 8], [0, 1.6, 1.6, 3.3], ease)} germs={fadeIn(f, BITE, 6)} microbes={interpolate(f, [ENFONCES - 4, PROFOND + 12], [0, 1], ease)} />} />
				</Fly>
				{/* la mâchoire et ses microbes : elle mord la peau */}
				<Blur on={frame >= MORDANT - 4 && frame <= BITE + 26}>
					<Posed
						pose={(f) => {
							const down = interpolate(f, [MORDANT, BITE], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							const up = interpolate(f, [BITE + 8, BITE + 24], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							return {x: 540, y: 760 + 140 * down - 1300 * up, s: 1};
						}}
					>
						<div style={{position: 'relative', width: 600, height: 600}}>
							<Live render={(f) => <WoundTool kind="teeth" size={600} bite={interpolate(f, [BITE - 4, BITE], [0, 1], clamp)} />} />
							<div style={{position: 'absolute', left: 60, top: 230}}>
								<Live render={(f) => <Swarm w={480} h={160} n={10} size={44} appear={fadeIn(f, MICROBES - 6, 10)} />} />
							</div>
						</div>
					</Posed>
				</Blur>
				<PointTag at={PROFOND} x={330} y={1580} px={SK.x + (SKIN.cx + 120) * k} py={SK.y + 330 * k} size={44}>
					tout au fond
				</PointTag>
			</Camera>
			<Sfx name="pop" at={MICROBES - 6} volume={0.08} />
			<Sfx name="hiss" at={MORDANT - 2} volume={0.3} />
			<Sfx name="impact" at={BITE} volume={0.12} />
			<Sfx name="whoosh" at={BITE + 8} volume={0.07} />
			<Sfx name="pop" at={PROFOND} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE RISQUE ═══════════════════════════════ */
export const Risque: React.FC = () => {
	const frame = useCurrentFrame();
	const MORSURE = at('risque', 'morsure');
	const RISQUE = at('risque', 'risque');
	const INFECT = at('risque', "d'infection");
	const ELEVE = at('risque', 'élevé,');
	const MEME = at('risque', 'même');
	const PETITE = at('risque', 'petite.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[MORSURE + 1, RISQUE + 1, ELEVE + 1, MEME + 1, PETITE + 1]} shakes={[ELEVE + 2]} strength={0.03}>
				<Big from={-2} to={MEME - 6} text={'Plaie par\n*morsure*'} size={128} />
				<Big from={MEME - 4} text={'Même *toute*\n*petite* !'} size={128} />
				<Fly at={RISQUE - 4} x={540} y={560} from="left">
					<Live render={(f) => <Meter label="Infection" value={interpolate(f, [RISQUE, ELEVE + 6], [0, 1], ease)} word={f >= ELEVE ? 'ÉLEVÉ' : ''} width={980} />} />
				</Fly>
				<Fly at={-4} x={540} y={1090} from="bottom">
					<div style={{position: 'relative'}}>
						<BittenHand width={360} marks={1} />
						<div style={{position: 'absolute', left: 30, top: 230}}>
							<Live render={(f) => <Swarm w={300} h={200} n={8} size={38} appear={fadeIn(f, INFECT - 4, 10)} tone={[LPI.pink, LPI.blue]} />} />
						</div>
					</div>
				</Fly>
				<Live
					render={(f) =>
						f >= MEME - 2 ? (
							<div style={{position: 'absolute', left: 540 + 11 - 110, top: 1090 + 79 - 110, width: 220, height: 220, borderRadius: 110, border: `10px solid ${LPI.pink}`, boxShadow: SHADOW, transform: `scale(${popAt(f, MEME - 2) * (1 + 0.05 * Math.sin(f / 4))})`}} />
						) : null
					}
				/>
				<Note at={PETITE} y={1420} size={46}>
					2 petits trous… mais profonds
				</Note>
			</Camera>
			<Flash at={ELEVE} max={0.25} />
			<Sfx name="pop" at={RISQUE - 4} volume={0.08} />
			<Sfx name="buzz" at={ELEVE} volume={0.06} dur={12} />
			<Sfx name="pop" at={MEME - 2} volume={0.08} />
			<Sfx name="ding" at={PETITE} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON RÉFLEXE ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const LAVE = at('geste', 'lave');
	const LONG = at('geste', 'longuement');
	const SAVON = at('geste', 'savon,');
	const DESINF = at('geste', 'désinfecte…');
	const CONSULTE = at('geste', 'consulte');
	const JOUR = at('geste', 'jour');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[LAVE + 1, SAVON + 1, DESINF + 1, CONSULTE + 1, JOUR + 1]} strength={0.03}>
				<Big from={-2} text={'Le bon *réflexe*'} size={130} {...ON_BLUE} />
				<RowCard at={LAVE - 4} y={420} h={290} art={240} badge={1} title="On lave longuement" sub="à l'eau et au savon" subAt={SAVON - 6} size={56}>
					<Live render={(f) => <Faucet width={220} flow={fadeIn(f, LONG, 6)} soap={fadeIn(f, SAVON - 2, 6)} />} />
				</RowCard>
				<RowCard at={DESINF - 4} y={740} h={260} art={240} badge={2} title="On désinfecte" from="left" size={56}>
					<AntisepticBottle size={170} />
				</RowCard>
				<RowCard at={CONSULTE - 4} y={1030} h={300} art={240} badge={3} title="On consulte un médecin" sub="le jour même" subAt={JOUR - 4} badgeTone={LPI.sky} size={56}>
					<Stetho size={190} />
				</RowCard>
			</Camera>
			<Sfx name="tap" at={LONG - 2} volume={0.16} dur={40} />
			<Sfx name="pop" at={DESINF - 4} volume={0.08} />
			<Sfx name="puff" at={DESINF + 4} volume={0.3} />
			<Sfx name="pop" at={CONSULTE - 4} volume={0.08} />
			<Sfx name="ding" at={JOUR} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : TOUTE MORSURE ═══════════════════════════════ */
const Tile: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
	<div style={{width: 310, height: 370, borderRadius: 40, background: LPI.paper, border: `6px solid ${N}`, boxShadow: SHADOW, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, boxSizing: 'border-box'}}>
		{children}
		<div style={{fontFamily: FONT.title, fontWeight: 900, fontSize: 46, color: N}}>{label}</div>
	</div>
);

export const Fin: React.FC = () => {
	const CHAT = at('fin', 'chat,');
	const CHIEN = at('fin', 'chien,');
	const HUMAIN = at('fin', 'humain');
	const MORSURE = at('fin', 'morsure');
	const MONTREE = at('fin', 'montrée');
	const MEDECIN = at('fin', 'médecin');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[CHAT + 1, CHIEN + 1, HUMAIN + 1, MORSURE + 1, MEDECIN + 1]} shakes={[MEDECIN + 2]} strength={0.035}>
				<Big from={-2} to={MORSURE - 6} text={'Chat, chien…\nou *humain* !'} size={124} />
				<Big from={MORSURE - 4} text={'*Toute* morsure\nau *médecin*'} size={120} />
				<Fly at={CHAT - 4} x={200} y={720} from="left">
					<Tile label="chat">
						<Cat size={250} />
					</Tile>
				</Fly>
				<Fly at={CHIEN - 4} x={540} y={720} from="bottom">
					<Tile label="chien">
						<Dog size={250} />
					</Tile>
				</Fly>
				<Fly at={HUMAIN - 4} x={880} y={720} from="right">
					<Tile label="humain">
						<WoundTool kind="teeth" size={220} />
					</Tile>
				</Fly>
				<Fly at={MONTREE - 6} x={540} y={1150} from="bottom">
					<Stetho size={280} />
				</Fly>
				<Stamp at={MEDECIN} x={540} y={1340} text="AU MÉDECIN !" size={90} rot={-6} />
			</Camera>
			<Flash at={MEDECIN} max={0.25} />
			<Sfx name="meow" at={CHAT - 4} volume={0.3} dur={30} />
			<Sfx name="pop" at={CHIEN - 4} volume={0.08} />
			<Sfx name="pop" at={HUMAIN - 4} volume={0.08} />
			<Sfx name="whoosh" at={MONTREE - 6} volume={0.07} />
			<Sfx name="stamp" at={MEDECIN} volume={0.12} />
		</AbsoluteFill>
	);
};
