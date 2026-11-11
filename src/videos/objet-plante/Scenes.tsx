// « Pourquoi ne faut-il jamais retirer un objet planté ? » — format court info (≈ 45 s), look 2026, voix Laura, VRAIS
// bruitages (La Sonothèque : vaisselle, robinet, verre qui éclate, cœur, touches du téléphone, sonnerie).
// Accroche « la vaisselle » (choisie par le propriétaire : une situation que tout le monde a vécue) : image 0 = l'évier
// et « Un éclat dans la main… tu l'enlèves ? » ; le verre glisse et éclate dans l'évier (éclats qui volent, flou de
// mouvement), un éclat se plante dans la main ; les doigts viennent le pincer… STOP ! Puis la coupe de peau : l'éclat
// bouche le vaisseau qu'il a coupé ; si on le retire, le sang jaillit (HÉMORRAGIE). La nuance (petite écharde en surface :
// ça s'enlève ; éclat bien planté : on n'y touche pas), le bon geste (caler avec des compresses sans appuyer, s'asseoir
// et ne plus bouger la main, appeler le 15), chute : « C'est aux urgences qu'on le retire. Pas dans ta cuisine ! ».
// Briques : src/brand/shard.tsx, `SkinBlock` (wound.tsx), kit src/brand/bold.tsx.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, PointTag, popAt, Posed, RowCard, ToneBg} from '../../brand/bold';
import {Phone} from '../../brand/devices';
import {Stamp} from '../../brand/kit';
import {Burst, Camera} from '../../brand/motion3';
import {Chair, DrinkGlass, ErIcon, HandShard, Pinch, ShardBurst, ShardSection, Sink, Splinter} from '../../brand/shard';
import {Sfx} from '../../brand/Sfx';
import {alpha, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {SkinBlock} from '../../brand/wound';
import {at} from './timeline';

const ROSE = alpha(LPI.pink, 0.55);
const ON_BLUE = {color: LPI.paper, accent: LPI.navy};

/* ═══════════════════════════════ ACCROCHE : LA VAISSELLE ═══════════════════════════════ */
const SINK = {x: 540, y: 1060, w: 1000};
const BASIN = {x: 480, y: 1110};
const HAND = {x: 540, y: 1000, size: 520};
/** Haut de l'éclat dans la main (pour les doigts qui viennent le pincer). */
const TIP = {x: 523, y: 835};

export const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const GLISSE = at('intro', 'glisse,');
	const ECLATE = at('intro', 'éclate');
	const ECLAT = at('intro', 'éclat');
	const PLANTE = at('intro', 'plante');
	const RETIRER = at('intro', 'retirer.');
	const STOP = at('intro', 'stop');
	const FAIRE = at('intro', 'faire.');
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.paper} />
			<Camera punches={[ECLATE + 1, PLANTE + 1, RETIRER + 1, STOP + 1]} shakes={[ECLATE + 2, PLANTE + 2, STOP + 2]} strength={0.04}>
				{/* l'évier */}
				<Fly at={-60} out={ECLAT - 4} x={SINK.x} y={SINK.y} to="bottom" dist={1200}>
					<Live render={(f) => <Sink width={SINK.w} water={1 - fadeIn(f, ECLATE, 10) * 0.6} />} />
				</Fly>
				{/* le verre glisse… et éclate dans l'évier */}
				<Blur on={frame >= GLISSE - 6 && frame <= ECLATE + 22}>
					<Posed
						pose={(f) => {
							if (f >= ECLATE) return null;
							const k = interpolate(f, [GLISSE - 4, ECLATE], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
							return {x: 300 + (BASIN.x - 300) * k, y: 520 + (BASIN.y - 520) * k, rot: -20 + 200 * k};
						}}
					>
						<DrinkGlass size={150} />
					</Posed>
					<Live render={(f) => <div style={{position: 'absolute', left: BASIN.x, top: BASIN.y - 40}}><ShardBurst t={(f - ECLATE) / 24} scale={1.2} /></div>} />
				</Blur>
				{/* gros plan : l'éclat planté dans la main */}
				<Fly at={ECLAT - 4} x={HAND.x} y={HAND.y} from="bottom" dist={1100}>
					<Live render={(f) => <HandShard size={HAND.size} shard={interpolate(f, [PLANTE - 3, PLANTE + 2], [0, 1], clamp)} blood={fadeIn(f, PLANTE + 4, 16)} pain={fadeIn(f, PLANTE, 6)} />} />
				</Fly>
				{/* les doigts viennent le pincer… */}
				<Fly at={RETIRER - 14} out={STOP + 2} x={TIP.x - 127} y={TIP.y} from="left" to="left" dist={900}>
					<Live render={(f) => <Pinch size={300} close={interpolate(f, [RETIRER - 4, RETIRER + 6], [0, 0.8], ease)} />} />
				</Fly>
				<Stamp at={STOP} x={540} y={760} text="STOP !" size={150} rot={-8} />
				<Burst at={STOP} x={540} y={760} r={420} n={18} />
				<Big from={-60} to={STOP - 6} text={'Un éclat planté…\ntu *l’enlèves*\u00a0?'} size={104} y={150} />
				<Big from={STOP - 4} text={'*Surtout* *pas* !'} size={140} y={170} />
				<Note at={FAIRE - 10} y={1420} size={40}>
					c&apos;est exactement ce qu&apos;il ne faut pas faire
				</Note>
			</Camera>
			<Flash at={PLANTE} max={0.3} />
			<Flash at={STOP} max={0.35} />
			<Sfx name="dishes" at={0} volume={0.28} />
			<Sfx name="tap" at={0} volume={0.18} />
			<Sfx name="whoosh" at={GLISSE - 4} volume={0.07} />
			<Sfx name="glass" at={ECLATE - 1} volume={0.6} />
			<Sfx name="whoosh" at={ECLAT - 4} volume={0.07} />
			<Sfx name="impact" at={PLANTE} volume={0.1} />
			<Sfx name="whoosh" at={RETIRER - 14} volume={0.06} />
			<Sfx name="buzz" at={STOP} volume={0.07} dur={14} />
			<Sfx name="stamp" at={STOP} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ POURQUOI : L'ÉCLAT FAIT BOUCHON ═══════════════════════════════ */
const SKN = {x: 40, y: 560, w: 1000};
const sk = (x: number, y: number) => ({x: SKN.x + (x * SKN.w) / 900, y: SKN.y + (y * SKN.w) / 900});

export const Pourquoi: React.FC = () => {
	const frame = useCurrentFrame();
	const COUPE = at('pourquoi', 'coupé');
	const VAIS = at('pourquoi', 'vaisseau…');
	const BOUCHE = at('pourquoi', 'bouche,');
	const BOUCHON = at('pourquoi', 'bouchon.');
	const RETIRES = at('pourquoi', 'retires,');
	const SANG = at('pourquoi', 'sang');
	const HEMO = at('pourquoi', 'hémorragie.');
	const RESS = at('pourquoi', 'ressortant,');
	const vessel = sk(620, 238);
	const plug = sk(452, 120);
	return (
		<AbsoluteFill>
			<ToneBg tone={ROSE} />
			<Camera punches={[VAIS + 1, BOUCHE + 1, RETIRES + 1, HEMO + 1]} shakes={[HEMO + 2]} strength={0.03}>
				<Big from={-2} to={BOUCHE - 6} text={'Sous la *peau*'} size={136} />
				<Big from={BOUCHE - 4} to={RETIRES - 6} text={'Il fait\n*bouchon*'} size={136} />
				<Big from={RETIRES - 4} to={HEMO - 6} text={'Si tu le\n*retires*…'} size={136} />
				<Big from={HEMO - 4} to={RESS - 6} text={'*Hémorragie* !'} size={130} />
				<Big from={RESS - 4} text={'Et il *abîme*\nencore la peau'} size={116} />
				<Fly at={-4} x={SKN.x + SKN.w / 2} y={SKN.y + 278} from="bottom" dist={1100}>
					<div style={{position: 'relative', width: SKN.w, height: (SKN.w * 500) / 900}}>
						<SkinBlock width={SKN.w} shape="pin" depth={2.9} open={1.6} />
						<Blur on={frame >= RETIRES - 2 && frame <= RETIRES + 14}>
							<Live render={(f) => <ShardSection width={SKN.w} out={interpolate(f, [RETIRES, RETIRES + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)})} gush={interpolate(f, [RETIRES + 6, HEMO + 6], [0, 1], ease)} plug={fadeIn(f, BOUCHE - 2, 6) * (1 - fadeIn(f, RETIRES - 4, 4))} />} />
						</Blur>
					</div>
				</Fly>
				<PointTag at={COUPE - 2} to={RETIRES - 6} x={790} y={1260} px={vessel.x} py={vessel.y}>
					un vaisseau coupé
				</PointTag>
				<PointTag at={BOUCHE - 2} to={RETIRES - 6} x={300} y={470} px={plug.x - 30} py={plug.y}>
					l&apos;éclat le bouche
				</PointTag>
				<Stamp at={HEMO} x={540} y={1300} text="HÉMORRAGIE" size={72} rot={-6} out={RESS - 6} />
				<Note at={RESS - 2} y={1300} size={46}>
					en ressortant, il coupe encore
				</Note>
			</Camera>
			<Flash at={HEMO} max={0.35} />
			<Sfx name="pop" at={COUPE - 2} volume={0.07} />
			<Sfx name="pop" at={BOUCHE - 2} volume={0.07} />
			<Sfx name="ding" at={BOUCHON} volume={0.07} />
			<Sfx name="whoosh" at={RETIRES} volume={0.1} />
			<Sfx name="heart" at={SANG - 6} volume={0.55} />
			<Sfx name="stamp" at={HEMO} volume={0.12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA NUANCE : ÉCHARDE OU ÉCLAT PLANTÉ ? ═══════════════════════════════ */
export const Nuance: React.FC = () => {
	const ECHARDE = at('nuance', 'écharde,');
	const ENLEVE = at('nuance', "s'enlève.");
	const ECLAT = at('nuance', 'éclat');
	const PLANTE = at('nuance', 'planté');
	const TOUCHE = at('nuance', 'touche');
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.sky} />
			<Camera punches={[ECHARDE + 1, ENLEVE + 1, PLANTE + 1, TOUCHE + 1]} strength={0.03}>
				<Big from={-2} text={'Écharde\nou éclat *planté* ?'} size={112} />
				<RowCard at={ECHARDE - 4} y={450} h={400} art={330} title="Petite écharde, en surface" sub="ça s'enlève" subAt={ENLEVE - 4} check={ENLEVE} badge="✓" badgeTone={LPI.sky} size={54}>
					<Splinter size={320} />
				</RowCard>
				<RowCard at={ECLAT - 4} y={890} h={480} art={330} title="Éclat bien planté" sub="on n'y touche pas !" subAt={TOUCHE - 4} badge="✕" badgeTone={LPI.pink} from="left" size={54}>
					<HandShard size={320} blood={0.6} />
				</RowCard>
			</Camera>
			<Sfx name="pop" at={ECHARDE - 4} volume={0.08} />
			<Sfx name="ding" at={ENLEVE} volume={0.07} />
			<Sfx name="pop" at={ECLAT - 4} volume={0.08} />
			<Sfx name="buzz" at={TOUCHE} volume={0.05} dur={12} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LE BON GESTE ═══════════════════════════════ */
export const Geste: React.FC = () => {
	const QUOI = at('geste', 'quoi');
	const CALE = at('geste', 'cale');
	const COMP = at('geste', 'compresses');
	const APP = at('geste', 'appuyer');
	const ASSOIT = at('geste', "s'assoit,");
	const BOUGE = at('geste', 'bouge');
	const APPELLE = at('geste', 'appelle');
	const QUINZE = at('geste', '15.');
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.blue} light={0.1} />
			<Camera punches={[QUOI + 1, CALE + 1, ASSOIT + 1, APPELLE + 1, QUINZE + 1]} strength={0.03}>
				<Big from={-2} to={CALE - 6} text={'Alors, on fait\n*quoi* ?'} size={124} {...ON_BLUE} />
				<Big from={CALE - 4} text={'Le bon *geste*'} size={136} {...ON_BLUE} />
				<RowCard at={CALE - 4} y={430} h={300} art={240} badge={1} title="On cale l'éclat" sub="avec des compresses tout autour, sans appuyer dessus" subAt={APP - 6} size={52}>
					<Live render={(f) => <HandShard size={200} blood={0.5} gauze={popAt(f, COMP - 2)} />} />
				</RowCard>
				<RowCard at={ASSOIT - 4} y={760} h={250} art={200} badge={2} title="On s'assoit" sub="et on ne bouge plus la main" subAt={BOUGE - 4} from="left" size={52}>
					<Chair size={140} />
				</RowCard>
				<RowCard at={APPELLE - 4} y={1040} h={300} art={200} badge={3} title="On appelle le 15" size={58}>
					<Live render={(f) => <Phone size={150} digits={f >= QUINZE ? '15' : f >= QUINZE - 6 ? '1' : ''} press={fadeIn(f, QUINZE + 6, 4)} ring={fadeIn(f, QUINZE + 10, 6)} />} />
				</RowCard>
			</Camera>
			{[CALE, ASSOIT, APPELLE].map((t) => (
				<Sfx key={t} name="pop" at={t - 4} volume={0.08} />
			))}
			<Sfx name="pop" at={COMP - 2} volume={0.06} />
			<Sfx name="dtmf-1" at={QUINZE - 6} volume={0.3} />
			<Sfx name="dtmf-5" at={QUINZE} volume={0.3} />
			<Sfx name="ring" at={QUINZE + 10} volume={0.3} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : PAS DANS TA CUISINE ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const URG = at('fin', 'urgences');
	const PAS = at('fin', 'pas');
	const CUIS = at('fin', 'cuisine');
	return (
		<AbsoluteFill>
			<ToneBg tone={LPI.paper} />
			<Camera punches={[URG + 1, PAS + 1, CUIS + 1]} shakes={[CUIS + 2]} strength={0.04}>
				<Big from={-2} to={PAS - 6} text={"C'est aux\n*urgences*…"} size={130} />
				<Big from={PAS - 4} text={'Pas dans ta\n*cuisine* !'} size={136} />
				<Fly at={URG - 6} out={PAS - 6} x={540} y={840} from="bottom" to="left">
					<ErIcon size={520} />
				</Fly>
				<Fly at={PAS - 6} x={540} y={960} from="right">
					<Sink width={820} water={0.4} />
				</Fly>
				<Stamp at={CUIS} x={540} y={980} text="PAS ICI !" size={120} rot={-8} />
			</Camera>
			<Flash at={CUIS} max={0.25} />
			<Sfx name="whoosh" at={URG - 6} volume={0.07} />
			<Sfx name="whoosh" at={PAS - 6} volume={0.07} />
			<Sfx name="stamp" at={CUIS} volume={0.12} />
		</AbsoluteFill>
	);
};
