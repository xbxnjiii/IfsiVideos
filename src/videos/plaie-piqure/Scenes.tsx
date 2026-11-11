// « La plaie par piqûre » — série courte « Les plaies » (≈ 37 s, voix Laura, vrais bruitages).
// Accroche « le clou » (situation vécue, SANS texte au début : on regarde l'animation) : un monsieur marche, son pied
// se pose sur le clou d'une planche au mot (impact, flash), il sautille en se tenant le pied ; la caméra s'approche,
// loupe sur la plante du pied : un point minuscule, « ? ». Puis la coupe
// de peau : le clou entre (entrée minuscule) et va très loin, il ressort et laisse les microbes au fond, là où l'air
// (bulles) n'arrive pas ; les 3 causes (objet pointu, insecte, aiguille pendant un soin = iatrogène) ; le bon réflexe
// (laver, désinfecter, vaccin antitétanique à jour, consulter si c'est profond).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, Posed, RowCard} from '../../brand/bold';
import {AntisepticBottle} from '../../brand/sampling';
import {Faucet} from '../../brand/hands';
import {Mosquito, NailBoard, Stetho, VaxBook, Walker} from '../../brand/injury';
import {Burst, Camera} from '../../brand/motion3';
import {Syringe} from '../../brand/precautions';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {depthY, SKIN, SkinBlock, WoundTool} from '../../brand/wound';
import {at} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};

/* ═══════════════════════════════ ACCROCHE : LE CLOU ═══════════════════════════════ */
/** Le marcheur (repère 300 × 600) affiché à WW px : sol à y GROUND. */
const WW = 460;
const WS = WW / 300;
const GROUND = 1320;
const WY = GROUND - (590 - 300) * WS;
const HITX = 360;
const NAILPOS = {x: HITX + (288 - 150) * WS, y: GROUND + 23};
const HOPX = HITX + (288 - 196) * WS; // après le clou : le pied levé reste au-dessus du clou
const SOLE = {x: HOPX + (190 - 150) * WS, y: WY + (516 - 300) * WS};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const CLOU = at('intro', 'clou.');
	const JUSTE = at('intro', 'juste');
	const PETIT = at('intro', 'petit');
	const TROU = at('intro', 'trou…');
	const GRAVE = at('intro', 'grave');
	const HIT = CLOU + 2;
	const zoom = interpolate(frame, [JUSTE, PETIT - 4], [1, 1.6], ease);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[HIT + 1, TROU + 1, GRAVE + 1]} shakes={[HIT + 2]} strength={0.045}>
				{/* la scène : il marche… et pose le pied sur le clou */}
				<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${SOLE.x}px ${SOLE.y}px`}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: GROUND, height: 12, borderRadius: 6, background: alpha(N, 0.22)}} />
					<div style={{position: 'absolute', left: NAILPOS.x - 150, top: NAILPOS.y - 64}}>
						<NailBoard width={300} />
					</div>
					<Live
						render={(f) => {
							if (f < HIT) {
								const ph = Math.PI / 2 + ((f - HIT) * 2 * Math.PI) / 30;
								return (
									<div style={{position: 'absolute', left: HITX - 7 * (HIT - f) - WW / 2, top: WY - WW}}>
										<Walker width={WW} pose="walk" phase={ph} />
									</div>
								);
							}
							const hop = f < HIT + 30 ? Math.abs(Math.sin(((f - HIT) / 10) * Math.PI)) : 0;
							return (
								<div style={{position: 'absolute', left: HOPX - WW / 2, top: WY - WW - 50 * hop}}>
									<Walker width={WW} pose="hop" cry={fadeIn(f, HIT + 1, 3)} pain={fadeIn(f, HIT + 2, 6)} />
								</div>
							);
						}}
					/>
				</AbsoluteFill>
				<Burst at={HIT} x={NAILPOS.x} y={NAILPOS.y - 40} r={240} n={14} />
				{/* la loupe : un point minuscule sous le pied */}
				<Live
					render={(f) =>
						f >= PETIT - 4 ? (
							<div style={{position: 'absolute', left: 830 - 180, top: 640 - 180, transform: `scale(${popAt(f, PETIT - 4) * (1 + 0.04 * Math.sin(f / 5))})`}}>
								<div style={{position: 'relative', width: 360, height: 360, borderRadius: 180, overflow: 'hidden', background: LPI.paper, border: `14px solid ${N}`, boxSizing: 'border-box', boxShadow: SHADOW}}>
									<div style={{position: 'absolute', inset: 0, background: alpha(LPI.pink, 0.32)}} />
									{Array.from({length: 7}, (_, i) => (
										<div key={i} style={{position: 'absolute', left: 40 + ((i * 53) % 250), top: 50 + ((i * 71) % 240), width: 30, height: 7, borderRadius: 3, background: alpha(N, 0.15)}} />
									))}
									<div style={{position: 'absolute', left: 166 - 10, top: 166 - 10, width: 20, height: 20, borderRadius: 10, background: LPI.pink, border: `4px solid ${N}`, transform: `scale(${popAt(f, TROU)})`}} />
								</div>
								<div style={{position: 'absolute', left: 300, top: 300, width: 150, height: 40, borderRadius: 20, background: LPI.blue, border: `6px solid ${N}`, transform: 'rotate(45deg)', transformOrigin: 'left center'}} />
							</div>
						) : null
					}
				/>
				{/* « ? » : rien de grave ? */}
				<Live
					render={(f) =>
						f >= GRAVE - 4 ? (
							<div style={{position: 'absolute', left: 960, top: 380, transform: `translate(-50%, -50%) scale(${popAt(f, GRAVE - 4) * (1 + 0.06 * Math.sin(f / 4))})`}}>
								<div style={{width: 170, height: 170, borderRadius: 85, background: LPI.pink, border: `7px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 120, color: N}}>?</div>
							</div>
						) : null
					}
				/>
			</Camera>
			<Flash at={HIT} max={0.35} />
			<Sfx name="stairs" at={0} volume={0.25} dur={HIT} />
			<Sfx name="impact" at={HIT} volume={0.16} />
			<Sfx name="buzz" at={HIT + 1} volume={0.06} dur={12} />
			<Sfx name="whoosh" at={JUSTE} volume={0.06} />
			<Sfx name="pop" at={PETIT - 4} volume={0.08} />
			<Sfx name="ding" at={TROU} volume={0.06} />
			<Sfx name="pop" at={GRAVE - 4} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ SOUS LA PEAU ═══════════════════════════════ */
const SK = {x: 40, y: 690, w: 1000};
const k = SK.w / SKIN.w;
const NAIL = 1.6; // échelle du clou (repère 200 : pointe à y 192, centre à y 100)

export const Dessous: React.FC = () => {
	const frame = useCurrentFrame();
	const PEAU = at('dessous', 'peau');
	const MINUSC = at('dessous', 'minuscule,');
	const MAIS = at('dessous', 'mais');
	const LOIN = at('dessous', 'loin.');
	const EMMENE = at('dessous', 'emmené');
	const MICROBES = at('dessous', 'microbes');
	const FOND = at('dessous', 'fond,');
	const AIR = at('dessous', "l'air");
	const depthAt = (f: number) => interpolate(f, [PEAU - 4, MINUSC, MAIS, LOIN + 4], [0, 1.1, 1.1, 4.3], ease);
	const surface = SK.y + SKIN.top * k;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.35)}} />
			<Camera punches={[PEAU + 1, MINUSC + 1, LOIN + 1, MICROBES + 1, AIR + 1]} strength={0.03}>
				<Big from={-2} to={MAIS - 6} text={'Une entrée\n*minuscule*…'} size={124} />
				<Big from={MAIS - 4} to={EMMENE - 6} text={'…mais *très*\n*profond* !'} size={124} />
				<Big from={EMMENE - 4} text={'Des *microbes*\ntout au fond'} size={124} />
				<Fly at={-4} x={SK.x + SK.w / 2} y={SK.y + (SK.w * 500) / 900 / 2} from="bottom" dist={1100}>
					<Live render={(f) => <SkinBlock width={SK.w} shape="pin" open={1.4} depth={depthAt(f)} germs={fadeIn(f, EMMENE - 8, 8)} microbes={interpolate(f, [MICROBES - 4, FOND + 4], [0, 1], ease)} />} />
				</Fly>
				{/* le clou entre, puis ressort */}
				<Blur on={frame >= PEAU - 6 && frame <= EMMENE + 10}>
					<Posed
						pose={(f) => {
							const tip = SK.y + depthY(depthAt(f)) * k;
							const out = interpolate(f, [EMMENE - 10, EMMENE + 4], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
							if (out >= 1) return null;
							return {x: SK.x + SKIN.cx * k, y: tip - 92 * NAIL - 1100 * out - 400 * (1 - fadeIn(f, PEAU - 8, 6))};
						}}
					>
						<WoundTool kind="nail" size={200 * NAIL} />
					</Posed>
				</Blur>
				{/* l'air reste en surface */}
				<Live
					render={(f) =>
						f >= AIR - 12
							? Array.from({length: 6}, (_, i) => {
									const t = (f - (AIR - 12) - i * 3) / 14;
									if (t < 0) return null;
									const y = Math.min(surface - 34, 420 + t * 220) - Math.abs(Math.sin(f / 6 + i)) * 8;
									return (
										<div key={i} style={{position: 'absolute', left: 120 + i * 150, top: y - 28, width: 56, height: 56, borderRadius: 28, background: alpha(LPI.sky, 0.95), border: `4px solid ${N}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 22, color: N}}>
											air
										</div>
									);
								})
							: null
					}
				/>
				<PointTag at={MINUSC - 4} to={MAIS - 6} x={780} y={1300} px={SK.x + SKIN.cx * k + 12} py={surface} size={44}>
					entrée minuscule
				</PointTag>
				<PointTag at={FOND - 4} to={AIR - 8} x={760} y={1300} px={SK.x + SKIN.cx * k} py={SK.y + depthY(4.1) * k} size={44}>
					les microbes, au fond
				</PointTag>
				<Note at={AIR + 4} y={1290} size={46}>
					au fond, pas d&apos;air : les microbes s&apos;y plaisent
				</Note>
			</Camera>
			<Sfx name="impact" at={PEAU} volume={0.08} />
			<Sfx name="pop" at={MINUSC - 4} volume={0.07} />
			<Sfx name="whoosh" at={MAIS} volume={0.07} />
			<Sfx name="impact" at={LOIN} volume={0.1} />
			<Sfx name="whoosh" at={EMMENE - 10} volume={0.08} />
			<Sfx name="pop" at={FOND - 4} volume={0.07} />
			<Sfx name="pop" at={AIR - 10} volume={0.06} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LES PIQÛRES ═══════════════════════════════ */
export const Piqure: React.FC = () => {
	const frame = useCurrentFrame();
	const PIQURE = at('piqure', 'piqûre');
	const OBJET = at('piqure', 'objet');
	const INSECTE = at('piqure', 'insecte…');
	const AIGUILLE = at('piqure', 'aiguille');
	const SOIN = at('piqure', 'soin.');
	const IATRO = at('piqure', 'iatrogène');
	const CAUSEE = at('piqure', 'causée');
	const dim = fadeIn(frame, IATRO - 4, 8);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.sky}} />
			<Camera punches={[PIQURE + 1, OBJET + 1, INSECTE + 1, AIGUILLE + 1, IATRO + 1]} strength={0.03}>
				<Big from={-2} to={IATRO - 6} text={'Plaie par\n*piqûre*'} size={128} />
				<Big from={IATRO - 4} text={'*Iatrogène*'} size={136} />
				<RowCard at={OBJET - 4} y={440} h={280} art={300} title="Un objet pointu" dim={dim} size={58}>
					<NailBoard width={280} />
				</RowCard>
				<RowCard at={INSECTE - 4} y={750} h={280} art={300} title="Un insecte" from="left" dim={dim} size={58}>
					<Mosquito size={220} />
				</RowCard>
				<RowCard at={AIGUILLE - 4} y={1060} h={300} art={300} title="Une aiguille pendant un soin" sub="= iatrogène : causée par un soin" subAt={CAUSEE - 4} badge={frame >= IATRO ? '!' : undefined} size={56}>
					<div style={{transform: 'rotate(-30deg)'}}>
						<Syringe width={290} />
					</div>
				</RowCard>
			</Camera>
			<Sfx name="pop" at={OBJET - 4} volume={0.08} />
			<Sfx name="pop" at={INSECTE - 4} volume={0.08} />
			<Sfx name="pop" at={AIGUILLE - 4} volume={0.08} />
			<Sfx name="ding" at={SOIN} volume={0.06} />
			<Sfx name="stamp" at={IATRO} volume={0.1} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON RÉFLEXE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const LAVE = at('fin', 'lave,');
	const DESINF = at('fin', 'désinfecte…');
	const VACCIN = at('fin', 'vaccin');
	const TETANOS = at('fin', 'tétanos');
	const JOUR = at('fin', 'jour');
	const TROU = at('fin', 'trou');
	const PROFOND = at('fin', 'profond,');
	const CONSULTE = at('fin', 'consulte.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[LAVE + 1, DESINF + 1, VACCIN + 1, JOUR + 1, CONSULTE + 1]} strength={0.03}>
				<Big from={-2} text={'Le bon *réflexe*'} size={130} {...ON_BLUE} />
				<RowCard at={LAVE - 4} y={400} h={230} art={220} badge={1} title="On lave" size={58}>
					<Live render={(f) => <Faucet width={190} flow={fadeIn(f, LAVE, 6)} />} />
				</RowCard>
				<RowCard at={DESINF - 4} y={650} h={230} art={220} badge={2} title="On désinfecte" from="left" size={58}>
					<AntisepticBottle size={150} />
				</RowCard>
				<RowCard at={VACCIN - 4} y={900} h={250} art={220} badge={3} title="Vaccin contre le tétanos" sub="bien à jour ?" subAt={JOUR - 4} size={54}>
					<Live render={(f) => <VaxBook size={200} check={fadeIn(f, JOUR, 8)} />} />
				</RowCard>
				<RowCard at={TROU - 4} y={1170} h={250} art={220} badge={4} title="Trou profond ?" sub="on consulte" subAt={CONSULTE - 4} from="left" badgeTone={LPI.sky} size={58}>
					<Stetho size={170} />
				</RowCard>
			</Camera>
			<Flash at={TETANOS} max={0.15} color={LPI.paper} />
			<Sfx name="tap" at={LAVE - 2} volume={0.15} dur={30} />
			<Sfx name="puff" at={DESINF + 2} volume={0.3} />
			<Sfx name="pop" at={VACCIN - 4} volume={0.08} />
			<Sfx name="ding" at={JOUR} volume={0.08} />
			<Sfx name="pop" at={TROU - 4} volume={0.08} />
			<Sfx name="pop" at={PROFOND} volume={0.05} />
		</AbsoluteFill>
	);
};
