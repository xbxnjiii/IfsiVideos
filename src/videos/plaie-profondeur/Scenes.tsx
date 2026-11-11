// « Plaie superficielle ou profonde ? » — série courte « Les plaies » (≈ 35 s, voix Laura, vrais bruitages).
// Accroche « le genou râpé » (situation vécue) : image 0 = « Genou râpé… grave ? » + le garçon à vélo ; il tape un
// caillou, vole par-dessus le guidon et tombe, assis, il se tient le genou et pleure ; la caméra plonge sur son genou ;
// gros plan du genou qui se râpe au mot, ça pique (jauge DOULEUR au max)… et pourtant la jauge GRAVITÉ
// reste basse : LA MOINS GRAVE. Puis la coupe de peau : l'écorchure s'arrête à l'épiderme / au derme (les nerfs sont
// tout près : ça pique), elle cicatrise en quelques jours ; la plaie profonde passe sous le derme, touche graisse,
// muscle, tendon, nerf, vaisseau (qui saigne), points de suture ; chute : « ce n'est pas la douleur qui compte : c'est
// la profondeur ». Briques : src/brand/injury.tsx, wound.tsx, kit bold.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, Posed} from '../../brand/bold';
import {Bike, Boy, DayChip, DeepBits, DepthRuler, Knee, Meter, Stone} from '../../brand/injury';
import {Stamp, Strike} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {SKIN, SkinBlock, SkinLabels, WoundTool} from '../../brand/wound';
import {at} from './timeline';

const ON_BLUE = {color: LPI.paper, accent: LPI.navy};

/* ═══════════════════════════════ ACCROCHE : LE GENOU RÂPÉ ═══════════════════════════════ */
const STONE = {x: 820, y: 1126};
/** Vélo et garçon dans le repère 520 × 330 agrandi à BW px ; centre posé à y CY (sol à y 1150). */
const BW = 700;
const BS = BW / 520;
const CY = 1150 - 326 * BS + (330 * BS) / 2;
const RIDE_X = STONE.x - 55 - (506 - 260) * BS; // la roue avant touche le caillou
/** Le garçon assis après la chute et son genou à l'écran. */
const SIT = {x: 520, y: CY};
const KNEE = {x: SIT.x + (330 - 260) * BS, y: SIT.y + (188 - 165) * BS};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const VELO = at('intro', 'vélo,');
	const GENOU = at('intro', 'genou');
	const RAPE = at('intro', 'râpé…');
	const PIQUE = at('intro', 'pique');
	const ENORM = at('intro', 'énormément');
	const POURTANT = at('intro', 'pourtant,');
	const MOINS = at('intro', 'moins');
	const GRAVE = at('intro', 'grave.');
	const HIT = VELO + 6;
	const LAND = HIT + 12;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[HIT + 1, RAPE + 1, PIQUE + 1, ENORM + 1, GRAVE + 1]} shakes={[HIT + 2, RAPE + 3, ENORM + 2]} strength={0.04}>
				{/* la scène : le garçon roule, tape le caillou, vole et tombe ; puis la caméra plonge sur son genou */}
				<Live
					render={(f) => {
						const zoom = interpolate(f, [GENOU - 2, RAPE - 4], [1, 3.4], {...clamp, easing: Easing.in(Easing.cubic)});
						const fade = 1 - fadeIn(f, RAPE - 8, 6);
						if (fade <= 0) return null;
						return (
							<AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${KNEE.x}px ${KNEE.y}px`, opacity: fade}}>
								<div style={{position: 'absolute', left: 0, right: 0, top: 1150, height: 10, borderRadius: 5, background: alpha(LPI.navy, 0.25)}} />
								{/* le caillou, projeté au choc */}
								<div style={{position: 'absolute', left: STONE.x - 65 + 360 * fadeIn(f, HIT, 14), top: STONE.y - 42 - 160 * Math.sin(Math.PI * fadeIn(f, HIT, 14)), opacity: 1 - fadeIn(f, HIT + 8, 6), transform: `rotate(${f >= HIT ? (f - HIT) * 30 : 0}deg)`}}>
									<Stone size={130} />
								</div>
								<Blur on={f >= HIT - 4 && f <= HIT + 24}>
									{/* le vélo : avec le garçon jusqu'au choc, puis il se renverse seul */}
									<Posed
										pose={(g) => {
											if (g < HIT) return {x: 180 + (RIDE_X - 180) * interpolate(g, [0, HIT], [0, 1], clamp), y: CY};
											const t = interpolate(g, [HIT, HIT + 22], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
											return {x: RIDE_X + 160 * t, y: CY - 140 * Math.sin(t * Math.PI), rot: -150 * t, o: 1 - fadeIn(g, HIT + 18, 6)};
										}}
									>
										<div style={{position: 'relative'}}>
											<Live render={(g) => <Bike width={BW} spin={Math.min(g, HIT) * 14} />} />
											<Live render={(g) => (g < HIT ? <div style={{position: 'absolute', left: 0, top: 0}}><Boy width={BW} pose="ride" spin={g * 14} /></div> : null)} />
										</div>
									</Posed>
									{/* le garçon vole par-dessus le guidon… */}
									<Posed
										pose={(g) => {
											if (g < HIT || g >= LAND) return null;
											const t = interpolate(g, [HIT, LAND], [0, 1], clamp);
											return {x: RIDE_X + (SIT.x - RIDE_X) * t, y: CY - 260 * Math.sin(t * Math.PI), rot: 70 * t};
										}}
									>
										<Boy width={BW} pose="fly" />
									</Posed>
								</Blur>
								{/* … et tombe, assis, il se tient le genou */}
								{f >= LAND ? (
									<div style={{position: 'absolute', left: SIT.x - BW / 2, top: SIT.y - (330 * BS) / 2, transform: `translateY(${-14 * Math.max(0, Math.sin(((f - LAND) / 8) * Math.PI)) * (f < LAND + 8 ? 1 : 0)}px)`}}>
										<Boy width={BW} pose="sit" scrape={fadeIn(f, LAND, 4)} cry={fadeIn(f, LAND + 2, 4)} pain={fadeIn(f, LAND + 4, 6)} />
									</div>
								) : null}
							</AbsoluteFill>
						);
					}}
				/>
				<Burst at={HIT} x={STONE.x - 50} y={STONE.y - 30} r={200} n={12} />
				<Burst at={LAND} x={SIT.x} y={1140} r={220} n={12} />
				{/* gros plan : le genou se râpe */}
				<Posed
					pose={(f) => {
						if (f < RAPE - 8) return null;
						const inK = interpolate(f, [RAPE - 8, RAPE - 1], [0, 1], ease);
						const mv = interpolate(f, [ENORM - 8, ENORM + 2], [0, 1], ease);
						return {x: 540, y: 900 - 160 * mv, s: (0.5 + 0.5 * inK) * (1 - 0.28 * mv), o: inK};
					}}
				>
					<Live render={(f) => <Knee width={560} scrape={interpolate(f, [RAPE - 6, RAPE + 8], [0, 1], clamp)} blood={fadeIn(f, RAPE + 6, 14)} pain={fadeIn(f, PIQUE - 2, 6)} />} />
				</Posed>
				{/* les graviers frottent */}
				<Blur on={frame >= RAPE - 10 && frame <= RAPE + 12}>
					<Posed pose={(f) => (f < RAPE - 8 || f > RAPE + 10 ? null : {x: interpolate(f, [RAPE - 8, RAPE + 10], [300, 820], clamp), y: 880, o: 1 - fadeIn(f, RAPE + 4, 6)})}>
						<WoundTool kind="gravel" size={240} />
					</Posed>
				</Blur>
				{/* jauges : la douleur au max… la gravité au plus bas */}
				<Fly at={ENORM - 4} x={540} y={1150} from="left">
					<Live render={(f) => <Meter label="Douleur" value={interpolate(f, [ENORM - 2, ENORM + 10], [0, 1], ease)} word={f >= ENORM + 8 ? 'MAX' : ''} />} />
				</Fly>
				<Fly at={POURTANT - 4} x={540} y={1290} from="right">
					<Live render={(f) => <Meter label="Gravité" tone={LPI.blue} value={interpolate(f, [POURTANT, MOINS + 4], [0.6, 0.12], ease)} word={f >= MOINS + 2 ? 'faible' : ''} />} />
				</Fly>
				<Stamp at={GRAVE} x={540} y={1440} text="LA MOINS GRAVE !" size={70} rot={-5} />
				<Big from={-60} to={POURTANT - 6} text={'Genou *râpé*…\nc’est *grave* ?'} size={124} y={150} />
				<Big from={POURTANT - 4} text={'Et *pourtant*…'} size={130} y={170} />
			</Camera>
			<Flash at={LAND} max={0.25} />
			<Flash at={ENORM} max={0.3} />
			<Sfx name="bike" at={0} volume={0.3} />
			<Sfx name="skid" at={HIT - 12} volume={0.25} />
			<Sfx name="impact" at={HIT} volume={0.1} />
			<Sfx name="fall" at={LAND - 2} volume={0.5} />
			<Sfx name="whoosh" at={GENOU - 4} volume={0.07} />
			<Sfx name="bike" at={RAPE - 8} volume={0.2} dur={16} />
			<Sfx name="buzz" at={ENORM} volume={0.06} dur={12} />
			<Sfx name="pop" at={POURTANT - 4} volume={0.08} />
			<Sfx name="stamp" at={GRAVE} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE SUPERFICIELLE ═══════════════════════════════ */
const SK = {x: 40, y: 560, w: 1000};
const k = SK.w / SKIN.w;
const sk = (x: number, y: number) => ({x: SK.x + x * k, y: SK.y + y * k});

export const Superficielle: React.FC = () => {
	const frame = useCurrentFrame();
	const PEAU = at('superficielle', 'peau.');
	const ECORCH = at('superficielle', 'écorchure,');
	const SUPERF = at('superficielle', 'superficielle');
	const EPID = at('superficielle', "l'épiderme");
	const DERME = at('superficielle', 'derme,');
	const COUCHES = at('superficielle', 'couches');
	const CICAT = at('superficielle', 'cicatrise');
	const VITE = at('superficielle', 'vite.');
	const nerve = sk(250, 97);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.35)}} />
			<Camera punches={[PEAU + 1, ECORCH + 1, SUPERF + 1, EPID + 1, DERME + 1, CICAT + 1]} strength={0.03}>
				<Big from={-2} to={SUPERF - 6} text={'Sous la *peau*'} size={136} />
				<Big from={SUPERF - 4} to={CICAT - 6} text={'Plaie\n*superficielle*'} size={128} />
				<Big from={CICAT - 4} text={'Elle *cicatrise*\n*vite*'} size={128} />
				<Fly at={-4} x={SK.x + SK.w / 2} y={SK.y + (SK.w * 500) / 900 / 2} from="bottom" dist={1100}>
					<div style={{position: 'relative', width: SK.w, height: (SK.w * 500) / 900}}>
						<Live
							render={(f) => (
								<SkinBlock
									width={SK.w}
									shape="scrape"
									depth={interpolate(f, [ECORCH - 4, ECORCH + 18], [0, 1.5], ease)}
									nerves={fadeIn(f, ECORCH + 8, 10)}
									pain={fadeIn(f, ECORCH + 12, 8) * (1 - fadeIn(f, CICAT, 10))}
									heal={interpolate(f, [CICAT - 2, VITE + 20], [0, 1], ease)}
								/>
							)}
						/>
						<Live render={(f) => <SkinLabels width={SK.w} labels={interpolate(f, [EPID - 4, EPID + 4, DERME - 4, DERME + 4], [0, 1, 1, 2], clamp)} focus={f >= COUCHES - 2 ? -1 : f >= DERME - 2 ? 1 : 0} />} />
					</div>
				</Fly>
				{/* les graviers frottent la surface */}
				<Blur on={frame >= ECORCH - 8 && frame <= ECORCH + 22}>
					<Posed pose={(f) => (f < ECORCH - 6 || f > ECORCH + 20 ? null : {x: interpolate(f, [ECORCH - 6, ECORCH + 20], [180, 900], clamp), y: sk(0, 60).y - 70, o: 1 - fadeIn(f, ECORCH + 14, 6)})}>
						<WoundTool kind="gravel" size={200} />
					</Posed>
				</Blur>
				<PointTag at={ECORCH + 18} to={EPID - 8} x={540} y={1210} px={nerve.x} py={nerve.y} size={44}>
					les nerfs sont juste là : ça pique !
				</PointTag>
				<Fly at={CICAT - 4} x={540} y={1250} from="bottom">
					<Live render={(f) => <DayChip text={f >= VITE + 6 ? 'J + 7' : f >= CICAT + 8 ? 'J + 4' : 'J + 1'} size={190} />} />
				</Fly>
			</Camera>
			<Sfx name="bike" at={ECORCH - 6} volume={0.18} dur={20} />
			<Sfx name="pop" at={EPID - 4} volume={0.07} />
			<Sfx name="pop" at={DERME - 4} volume={0.07} />
			<Sfx name="pop" at={ECORCH + 18} volume={0.06} />
			<Sfx name="tick" at={CICAT + 8} volume={0.08} />
			<Sfx name="ding" at={VITE + 6} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ PLAIE PROFONDE ═══════════════════════════════ */
export const Profonde: React.FC = () => {
	const PROF = at('profonde', 'profonde,');
	const DERME = at('profonde', 'derme.');
	const GRAISSE = at('profonde', 'graisse,');
	const MUSCLES = at('profonde', 'muscles,');
	const TENDONS = at('profonde', 'tendons,');
	const NERFS = at('profonde', 'nerfs…');
	const VAISS = at('profonde', 'vaisseaux.');
	const LA = at('profonde', 'faut') - 6; // « là » = « la » pour at() (accents ignorés)
	const POINTS = at('profonde', 'points');
	const SUTURE = at('profonde', 'suture.');
	const y = (yy: number) => SK.y + yy * k;
	const px = SK.x + 560 * k;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: alpha(LPI.pink, 0.6)}} />
			<Camera punches={[PROF + 1, DERME + 1, GRAISSE + 1, MUSCLES + 1, VAISS + 1, POINTS + 1]} shakes={[VAISS + 2]} strength={0.03}>
				<Big from={-2} to={LA - 6} text={'Plaie *profonde*'} size={136} />
				<Big from={LA - 4} text={'Des points\nde *suture*'} size={128} />
				<Fly at={-4} x={SK.x + SK.w / 2} y={SK.y + (SK.w * 500) / 900 / 2} from="right" dist={1100}>
					<div style={{position: 'relative', width: SK.w, height: (SK.w * 500) / 900}}>
						<Live
							render={(f) => {
								const sut = interpolate(f, [POINTS - 4, SUTURE + 14], [0, 1], ease);
								return (
									<>
										<SkinBlock width={SK.w} shape="cut" open={1.5} depth={interpolate(f, [PROF - 6, DERME, GRAISSE, MUSCLES], [0.3, 2.3, 3.1, 4.1], ease)} sutured={sut} />
										<DeepBits width={SK.w} vessel={fadeIn(f, VAISS - 4, 6)} nerve={fadeIn(f, NERFS - 4, 6)} tendon={fadeIn(f, TENDONS - 4, 6)} cut={1 - sut * 0.7} gush={fadeIn(f, VAISS + 4, 8) * (1 - sut)} />
										<SkinLabels width={SK.w} labels={interpolate(f, [DERME - 6, DERME + 2, GRAISSE - 2, GRAISSE + 4, MUSCLES - 2, MUSCLES + 4], [0, 2, 2, 3, 3, 4], clamp)} focus={f >= MUSCLES - 2 ? 3 : f >= GRAISSE - 2 ? 2 : 1} />
									</>
								);
							}}
						/>
					</div>
				</Fly>
				<PointTag at={TENDONS - 2} to={LA - 6} x={900} y={y(372)} px={px} py={y(360)} size={38}>
					tendon
				</PointTag>
				<PointTag at={NERFS - 2} to={LA - 6} x={900} y={y(272)} px={px} py={y(270)} size={38}>
					nerf
				</PointTag>
				<PointTag at={VAISS - 2} to={LA - 6} x={900} y={y(196)} px={px} py={y(206)} size={38}>
					vaisseau
				</PointTag>
				<Note at={DERME - 4} to={GRAISSE - 6} y={1220} size={46}>
					plus loin que le derme
				</Note>
			</Camera>
			<Flash at={VAISS + 2} max={0.3} />
			<Sfx name="chop" at={PROF - 6} volume={0.35} />
			{[DERME, GRAISSE, MUSCLES, TENDONS, NERFS].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.07} />
			))}
			<Sfx name="heart" at={VAISS} volume={0.45} dur={50} />
			<Sfx name="tick" at={POINTS} volume={0.08} />
			<Sfx name="tick" at={POINTS + 8} volume={0.08} />
			<Sfx name="tick" at={POINTS + 16} volume={0.08} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : LA PROFONDEUR ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const DOULEUR = at('fin', 'douleur');
	const COMPTE = at('fin', 'compte');
	const CEST = at('fin', "c'est");
	const PROF = at('fin', 'profondeur');
	const B = {x: 30, y: 820, w: 860};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[DOULEUR + 1, COMPTE + 1, CEST + 1, PROF + 1]} shakes={[PROF + 2]} strength={0.035}>
				<Big from={-2} to={CEST - 6} text={'Ce qui *compte*…'} size={130} {...ON_BLUE} />
				<Big from={CEST - 4} text={'La *profondeur* !'} size={130} {...ON_BLUE} />
				<Fly at={DOULEUR - 6} out={CEST - 4} x={540} y={620} from="left" to="top">
					<div style={{position: 'relative'}}>
						<Live render={(f) => <Meter label="Douleur" value={interpolate(f, [DOULEUR - 4, DOULEUR + 8], [0, 1], ease)} word="MAX" />} />
						<div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{position: 'relative', width: 860, height: 20}}>
								<Strike at={COMPTE} width={860} rot={-4} />
							</div>
						</div>
					</div>
				</Fly>
				<Fly at={CEST - 4} x={B.x + B.w / 2} y={B.y + (B.w * 500) / 900 / 2} from="bottom">
					<Live render={(f) => <SkinBlock width={B.w} shape="cut" open={1.4} depth={interpolate(f, [CEST - 2, PROF + 10], [0.4, 4], ease)} />} />
				</Fly>
				<Fly at={CEST} x={975} y={B.y + 250} from="right">
					<Live render={(f) => <DepthRuler h={360} k={interpolate(f, [CEST + 2, PROF + 10], [0.05, 0.9], ease)} />} />
				</Fly>
			</Camera>
			<Flash at={PROF} max={0.25} color={LPI.paper} />
			<Sfx name="pop" at={DOULEUR - 6} volume={0.08} />
			<Sfx name="buzz" at={COMPTE} volume={0.06} dur={12} />
			<Sfx name="whoosh" at={CEST - 4} volume={0.08} />
			<Sfx name="impact" at={PROF} volume={0.1} />
		</AbsoluteFill>
	);
};
