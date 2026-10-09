// Les 14 besoins : chaque scène = gabarit NeedScene + illustration vivante + gags calés sur les mots.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Stamp, Sticker, Strike, Tape} from '../../brand/kit';
import {NormRibbon} from '../../brand/Lesson3';
import {Burst, Confetti} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {
	Blankets,
	BookIcon,
	BreathIcon,
	CandyPill,
	Ceiling,
	ChatIcon,
	Clock,
	CompassIcon,
	Drum,
	FoodIcon,
	GameIcon,
	HeartBeat,
	MoonIcon,
	NotePad,
	Pyjama,
	RetireSign,
	SadBubble,
	ShieldIcon,
	ShirtIcon,
	SoapIcon,
	SpineIcon,
	TargetIcon,
	TempIcon,
	ToiletIcon,
	WifiOff,
	WindowSnow,
} from './icons';
import {LAY, NeedScene} from './Scenes';
import {at} from './timeline';

const G = LAY.gag;
const ramp = (frame: number, a: number, len = 18) => interpolate(frame, [a, a + len], [0, 1], {...clamp, easing: (t) => 1 - (1 - t) ** 3});
const stampSfx = (a: number) => <Sfx name="stamp" at={a} volume={0.1} />;

/* 1 · Respirer */
export const B1: React.FC = () => {
	const N = at('b1', 'premier');
	const BAH = at('b1', 'bah');
	const T = at('b1', 'toujours');
	return (
		<NeedScene
			n={1}
			numberAt={N}
			titleAt={at('b1', 'respirer')}
			icon={<BreathIcon size={400} />}
			shiftAt={BAH}
			gags={<Stamp at={T} x={G.x} y={G.y} text="Vital !" size={76} rot={-10} />}
			shakes={[T + 1]}
			sfx={stampSfx(T)}
		/>
	);
};

/* 2 · Boire et manger */
export const B2: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b2', 'deuxième');
	const BO = at('b2', 'boire');
	const M = at('b2', 'manger');
	const W = at('b2', 'wifi');
	return (
		<NeedScene
			n={2}
			numberAt={N}
			titleAt={BO}
			icon={<FoodIcon size={400} water={0.15 + 0.65 * ramp(frame, BO, 24)} apple={ramp(frame, M - 2, 10)} />}
			shiftAt={W - 10}
			chips={[
				{at: BO + 4, label: 'boire', sub: "= s'hydrater"},
				{at: M + 2, label: 'manger', sub: "= s'alimenter"},
			]}
			gags={
				<>
					<Sticker at={W} x={G.x} y={G.y - 30} rot={-8}>
						<WifiOff />
					</Sticker>
					<Stamp at={W + 8} x={G.x} y={G.y + 170} text="Pas de Wi-Fi" size={44} rot={6} />
				</>
			}
			shakes={[W + 9]}
			sfx={
				<>
					<Sfx name="buzz" at={W} volume={0.05} />
					{stampSfx(W + 8)}
				</>
			}
		/>
	);
};

/* 3 · Éliminer */
export const B3: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b3', 'troisième');
	const E = at('b3', 'éliminer');
	const PI = at('b3', 'pipi');
	const CA = at('b3', 'caca');
	const TR = at('b3', 'transmissions');
	const AHA = at('b3', 'aha');
	const flush = interpolate(frame, [E, E + 10, E + 30], [0, 1, 0], clamp);
	return (
		<NeedScene
			n={3}
			numberAt={N}
			titleAt={E}
			icon={<ToiletIcon size={400} flush={flush} />}
			shiftAt={TR - 10}
			chips={[
				{at: PI, label: 'pipi', sub: '= urines'},
				{at: CA, label: 'caca', sub: '= selles'},
				{at: TR + 2, label: 'transmissions', sub: '✍ noté'},
			]}
			gags={
				<>
					<Sticker at={TR - 2} x={G.x} y={G.y - 20} rot={6}>
						<NotePad write={ramp(frame, TR, 22)} />
					</Sticker>
					<Stamp at={AHA} x={G.x} y={G.y + 175} text="Noté !" size={60} rot={-8} color={LPI.blue} />
				</>
			}
			sfx={stampSfx(AHA)}
		/>
	);
};

/* 4 · Se mouvoir, posture */
export const B4: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b4', 'quatrième');
	const MV = at('b4', 'mouvoir');
	const P = at('b4', 'posture');
	const F = at('b4', 'formateur');
	const DOS = at('b4', 'dos');
	const RET = at('b4', 'retraite');
	return (
		<NeedScene
			n={4}
			numberAt={N}
			titleAt={MV}
			icon={<SpineIcon size={400} straight={ramp(frame, P - 4, 16)} glow={interpolate(frame, [DOS, DOS + 6, RET + 20, RET + 34], [0, 1, 1, 0], clamp)} />}
			shiftAt={RET - 12}
			chips={[
				{at: F, label: 'les bons gestes', sub: 'appris en formation'},
				{at: DOS, label: 'ton dos', sub: 'protégé'},
			]}
			gags={
				<Sticker at={RET - 2} x={G.x} y={G.y} rot={-6}>
					<RetireSign />
				</Sticker>
			}
			punches={[P + 2]}
			shakes={[RET]}
			sfx={<Sfx name="pop" at={RET - 2} volume={0.1} />}
		/>
	);
};

/* 5 · Dormir, se reposer */
export const B5: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b5', 'cinquième');
	const D = at('b5', 'dormir');
	const PAT = at('b5', 'patient');
	const DZ = at('b5', 'douze');
	const TOI = at('b5', 'toi');
	return (
		<NeedScene
			n={5}
			numberAt={N}
			titleAt={D}
			icon={<MoonIcon size={400} />}
			shiftAt={DZ - 14}
			chips={[
				{at: PAT, label: 'pour le patient'},
				{at: TOI, label: 'pour toi aussi !'},
			]}
			gags={
				<>
					<Sticker at={DZ - 6} x={G.x} y={G.y - 30} rot={8}>
						<Clock spin={ramp(frame, DZ - 6, 26)} />
					</Sticker>
					<Stamp at={DZ + 6} x={G.x} y={G.y + 160} text="Série de 12 h" size={42} rot={-6} color={LPI.blue} />
				</>
			}
			sfx={stampSfx(DZ + 6)}
		/>
	);
};

/* 6 · Se vêtir, se dévêtir */
export const B6: React.FC = () => {
	const N = at('b6', 'sixième');
	const V = at('b6', 'vêtir');
	const PY = at('b6', 'pyjama');
	const OF = at('b6', 'officielle');
	return (
		<NeedScene
			n={6}
			numberAt={N}
			titleAt={V}
			icon={<ShirtIcon size={400} />}
			shiftAt={PY - 10}
			chips={[
				{at: at('b6', 'confort'), label: 'confort'},
				{at: at('b6', 'hygiène'), label: 'hygiène'},
				{at: at('b6', 'changer'), label: 'changer si besoin'},
			]}
			gags={
				<>
					<Sticker at={PY - 2} x={G.x} y={G.y - 40} rot={-8}>
						<Pyjama />
					</Sticker>
					<Stamp at={OF} x={G.x} y={G.y + 160} text="Tenue officielle" size={40} rot={5} />
				</>
			}
			shakes={[OF + 1]}
			sfx={stampSfx(OF)}
		/>
	);
};

/* 7 · Température */
export const B7: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b7', 'septième');
	const T = at('b7', 'maintenir');
	const TROIS = at('b7', 'trois');
	const FEN = at('b7', 'fenêtre');
	const JAN = at('b7', 'janvier');
	const PR = at('b7', 'prend');
	const value = interpolate(frame, [T + 10, T + 30, TROIS, TROIS + 20, FEN, FEN + 22, PR, PR + 18], [36.2, 37, 37, 39.3, 39.3, 35.3, 35.3, 37], {
		...clamp,
		easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
	});
	const hot = interpolate(frame, [TROIS + 2, TROIS + 18, FEN, FEN + 10], [0, 1, 1, 0], clamp);
	const cold = interpolate(frame, [FEN + 4, FEN + 20, PR, PR + 14], [0, 1, 1, 0], clamp);
	return (
		<NeedScene
			n={7}
			numberAt={N}
			titleAt={T}
			icon={
				<div style={{position: 'absolute', left: 110, top: 10}}>
					<TempIcon size={360} value={value} />
				</div>
			}
			shiftAt={TROIS - 10}
			layers={[
				{color: alpha(LPI.pink, 0.45), level: hot},
				{color: alpha(LPI.sky, 0.95), level: cold},
			]}
			gags={
				<>
					<Sticker at={TROIS - 2} x={G.x} y={G.y} rot={-6} out={FEN - 4}>
						<Blankets />
					</Sticker>
					<Sticker at={FEN - 2} x={G.x} y={G.y} rot={6} out={PR - 4}>
						<WindowSnow />
					</Sticker>
					<Stamp at={JAN + 2} x={G.x} y={G.y + 170} text="En janvier ?!" size={44} rot={-6} color={LPI.blue} out={PR - 4} />
					<Stamp at={PR + 4} x={G.x} y={G.y} text="On mesure !" size={54} rot={-8} color={LPI.blue} />
					<NormRibbon at={PR + 10} y={LAY.tileY + LAY.tileH - 6}>
						normale 36,5 – 37,5 °C
					</NormRibbon>
				</>
			}
			shakes={[PR + 5]}
			sfx={
				<>
					<Sfx name="pop" at={TROIS - 2} volume={0.1} />
					<Sfx name="pop" at={FEN - 2} volume={0.1} />
					{stampSfx(PR + 4)}
				</>
			}
		/>
	);
};

/* 8 · Être propre, soigné, protéger sa peau */
export const B8: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b8', 'huitième');
	const P = at('b8', 'propre');
	const ES = at('b8', 'essentiel');
	return (
		<NeedScene
			n={8}
			numberAt={N}
			titleAt={at('b8', 'être')}
			icon={<SoapIcon size={400} shine={ramp(frame, ES, 10)} />}
			shiftAt={ES - 12}
			chips={[
				{at: P, label: 'propre'},
				{at: at('b8', 'soigné'), label: 'soigné'},
				{at: at('b8', 'peau'), label: 'peau protégée'},
			]}
			gags={
				<>
					<Stamp at={ES} x={G.x} y={G.y} text="Essentiel" size={66} rot={-9} />
					<Burst at={ES + 1} x={G.x} y={G.y} r={220} n={12} />
				</>
			}
			shakes={[ES + 1]}
			sfx={stampSfx(ES)}
		/>
	);
};

/* 9 · Éviter les dangers */
export const B9: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b9', 'neuvième');
	const D = at('b9', 'éviter');
	const SEC = at('b9', 'sécurise');
	const ENQ = at('b9', 'enquête');
	return (
		<NeedScene
			n={9}
			numberAt={N}
			titleAt={D}
			icon={<ShieldIcon size={400} check={ramp(frame, SEC, 14)} />}
			chips={[
				{at: at('b9', "l'environnement"), label: 'environnement sûr'},
				{at: at('b9', 'freins'), label: 'freins du lit'},
				{at: at('b9', 'obstacles'), label: 'obstacles'},
			]}
			gags={
				<>
					<Tape at={ENQ - 4} y={690} text="ENQUÊTE EN COURS" rot={-10} />
					<Tape at={ENQ + 2} y={860} text="NE PAS FRANCHIR" rot={8} />
				</>
			}
			shakes={[ENQ - 2, ENQ + 4]}
			sfx={
				<>
					<Sfx name="whoosh" at={ENQ - 4} volume={0.09} />
					<Sfx name="whoosh" at={ENQ + 2} volume={0.09} />
					<Sfx name="buzz" at={ENQ + 6} volume={0.05} />
				</>
			}
		/>
	);
};

/* 10 · Communiquer */
export const B10: React.FC = () => {
	const N = at('b10', 'dixième');
	const C = at('b10', 'communiquer');
	const CA = at('b10', 'ça');
	const SUF = at('b10', 'suffisante');
	return (
		<NeedScene
			n={10}
			numberAt={N}
			titleAt={C}
			icon={<ChatIcon size={400} />}
			shiftAt={CA - 12}
			chips={[
				{at: at('b10', 'écouter'), label: 'écouter'},
				{at: at('b10', 'comprendre'), label: 'comprendre'},
				{at: at('b10', 'transmettre'), label: 'transmettre'},
			]}
			gags={
				<>
					<Sticker at={CA - 4} x={G.x - 20} y={G.y - 40} rot={-5}>
						<div style={{position: 'relative'}}>
							<SadBubble />
							<Strike at={SUF + 2} width={430} rot={-6} />
						</div>
					</Sticker>
					<Stamp at={SUF} x={G.x} y={G.y + 140} text="Insuffisant" size={52} rot={7} />
				</>
			}
			shakes={[SUF + 1]}
			sfx={
				<>
					<Sfx name="pop" at={CA - 4} volume={0.1} />
					{stampSfx(SUF)}
				</>
			}
		/>
	);
};

/* 11 · Croyances et valeurs */
export const B11: React.FC = () => {
	const N = at('b11', 'onzième');
	const A = at('b11', 'agir');
	const H = at('b11', 'habitudes');
	return (
		<NeedScene
			n={11}
			numberAt={N}
			titleAt={A}
			icon={<CompassIcon size={400} settleAt={at('b11', 'valeurs')} />}
			shiftAt={H - 10}
			chips={[
				{at: at('b11', 'écoute'), label: 'on écoute'},
				{at: at('b11', 'respecte'), label: 'on respecte'},
				{at: at('b11', 'adapte'), label: 'on adapte les soins'},
			]}
			gags={
				<>
					<Sticker at={H - 2} x={G.x} y={G.y - 60} rot={6}>
						<HeartBeat />
					</Sticker>
					<Stamp at={H + 6} x={G.x} y={G.y + 120} text={<>À chacun<br />ses habitudes</>} size={38} rot={-6} color={LPI.blue} />
				</>
			}
			sfx={stampSfx(H + 6)}
		/>
	);
};

/* 12 · S'occuper en vue de se réaliser */
export const B12: React.FC = () => {
	const frame = useCurrentFrame();
	const N = at('b12', 'douzième');
	const O = at('b12', 'objectifs');
	const PL = at('b12', 'plafond');
	const PR = at('b12', 'projet');
	return (
		<NeedScene
			n={12}
			numberAt={N}
			titleAt={at('b12', "s'occuper")}
			icon={<TargetIcon size={400} hit={ramp(frame, O - 4, 10)} />}
			shiftAt={PL - 12}
			chips={[
				{at: at('b12', 'activités'), label: 'ses activités'},
				{at: O, label: 'ses objectifs'},
				{at: at('b12', 'sens'), label: 'du sens à sa journée'},
			]}
			gags={
				<>
					<Sticker at={PL - 2} x={G.x} y={G.y - 50} rot={-4}>
						<Ceiling />
					</Sticker>
					<Stamp at={PR} x={G.x - 20} y={G.y + 150} text={<>Pas un<br />projet de vie</>} size={34} rot={5} />
				</>
			}
			punches={[O + 6]}
			shakes={[PR + 1]}
			sfx={
				<>
					<Sfx name="tick" at={O + 4} volume={0.12} />
					{stampSfx(PR)}
				</>
			}
		/>
	);
};

/* 13 · Se récréer */
export const B13: React.FC = () => {
	const N = at('b13', 'treizième');
	const R = at('b13', 'récréer');
	const PL = at('b13', 'plaisir');
	return (
		<NeedScene
			n={13}
			numberAt={N}
			titleAt={R}
			icon={<GameIcon size={400} />}
			shiftAt={PL - 30}
			chips={[
				{at: at('b13', 'jeu'), label: 'un jeu'},
				{at: at('b13', 'musique'), label: 'de la musique'},
				{at: at('b13', 'visite'), label: 'une visite'},
			]}
			gags={
				<>
					<Sticker at={PL - 22} x={G.x} y={G.y - 30} rot={-6}>
						<HeartBeat />
					</Sticker>
					<Stamp at={PL} x={G.x} y={G.y + 150} text="Plaisir" size={60} rot={6} />
					{[0, 1, 2, 3].map((k) => (
						<Sticker key={k} at={PL + 2 + k * 2} x={G.x - 150 + k * 100} y={G.y - 190 + (k % 2) * 40} rot={(k - 1.5) * 12}>
							<Img src={staticFile(`brand/mascotte/elements/${k % 2 ? 'coeur-bleu' : 'coeur-rose'}.webp`)} style={{width: 70}} />
						</Sticker>
					))}
				</>
			}
			shakes={[PL + 1]}
			sfx={stampSfx(PL)}
		/>
	);
};

/* 14 · Apprendre — précédé du roulement de tambour */
export const B14: React.FC = () => {
	const frame = useCurrentFrame();
	const EN = at('b14', 'enfin');
	const RT = at('b14', 'roulement');
	const N = at('b14', 'quatorzième');
	const A = at('b14', 'apprendre');
	const BB = at('b14', 'bonbons');
	// projecteur : l'écran passe au bleu nuit pendant le roulement de tambour
	const dark = interpolate(frame, [EN - 4, EN + 6, N - 2, N + 4], [0, 1, 1, 0], clamp);
	const speed = interpolate(frame, [RT, N], [0, 1], clamp);
	const roll = interpolate(frame, [RT - 2, RT + 8], [0, 1], clamp);
	return (
		<NeedScene
			n={14}
			numberAt={N}
			titleAt={A}
			icon={<BookIcon size={400} light={ramp(frame, A, 10)} />}
			shiftAt={BB - 14}
			chips={[
				{at: at('b14', 'expliquer'), label: 'expliquer un traitement'},
				{at: at('b14', 'conseils'), label: 'donner des conseils'},
				{at: at('b14', 'vérifier'), label: 'vérifier', sub: 'que le patient a compris'},
			]}
			gags={
				<>
					<Confetti at={A + 1} x={540} y={760} n={40} />
					<Burst at={A} x={540} y={420} r={300} n={16} />
					<Sticker at={BB - 4} x={G.x} y={G.y - 30} rot={-8}>
						<CandyPill />
					</Sticker>
					<Stamp at={BB + 4} x={G.x} y={G.y + 150} text="Pas des bonbons !" size={42} rot={6} />
				</>
			}
			punches={[A + 1]}
			shakes={[A + 1, BB + 5]}
			overlay={
				dark > 0 ? (
					<AbsoluteFill style={{opacity: dark}}>
						<AbsoluteFill style={{background: `radial-gradient(circle at 50% 46%, ${alpha(LPI.blue, 0.55)} 0%, ${LPI.navy} 55%)`}} />
						<div style={{position: 'absolute', left: 540 - 150, top: 700, transform: `scale(${1 + 0.04 * Math.sin(frame * (0.8 + speed * 1.6))})`}}>
							<Drum speed={speed} />
						</div>
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 520,
								textAlign: 'center',
								fontFamily: FONT.title,
								fontWeight: 900,
								fontSize: 72,
								color: LPI.paper,
								opacity: roll,
								transform: `translateY(${(1 - roll) * 30}px) translateX(${Math.sin(frame * 2.3) * 4 * speed}px)`,
							}}
						>
							Roulement de tambour…
						</div>
					</AbsoluteFill>
				) : null
			}
			sfx={
				<>
					<Sfx name="drumroll" at={RT - 4} volume={0.22} />
					<Sfx name="ding" at={A} volume={0.12} />
					{stampSfx(BB + 4)}
				</>
			}
		/>
	);
};
