// « Que doit contenir une trousse de secours à la maison ? » — format court (≈ 47 s, voix gratuite edge-tts, sans barre
// de progression). Accroche SANS texte (règle de la série courte) : on coupe une tomate, le couteau glisse, le doigt
// saigne (gros plan vu du dessus : la main en griffe tient la tomate, l'autre coupe ; le couteau dérape sur le bout de
// l'index, la main sursaute, le sang coule sur la planche, la caméra s'approche) ; on attrape la trousse, on l'ouvre… elle est vide (poussière, papillon de nuit) ; « ? ». Puis la trousse se
// remplit, un objet à la fois au mot (gros plan + nom, puis il file dans sa case) : soigner une plaie (sérum
// physiologique, antiseptique, compresses stériles, pansements), tenir et se protéger (bande, sparadrap, gants, ciseaux
// à bouts arrondis, pince à écharde), et aussi (thermomètre, paracétamol, couverture de survie) ; les bons réflexes (hors
// de portée des enfants, dates de péremption chaque année, numéros d'urgence 15 · 18 · 112 · antipoison) ; chute : même
// gros plan, le couteau dérape à nouveau… la trousse pleine arrive, un pansement se colle sur le doigt : tout est là.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Big, Blur, ease, fadeIn, Flash, Fly, Live, Note, popAt, Posed, RowCard} from '../../brand/bold';
import {CUT_TIP, CuttingCloseUp, EmergencyCard, FirstAidKit, KIT_SLOTS, KitItem, KitKind, Padlock} from '../../brand/firstaid';
import {DayChip} from '../../brand/injury';
import {Burst, Camera} from '../../brand/motion3';
import {Sfx} from '../../brand/Sfx';
import {alpha, FONT, LPI, SHADOW} from '../../brand/theme';
import {clamp} from '../../brand/ui';
import {at, SceneId} from './timeline';

const N = LPI.navy;
const ON_BLUE = {color: LPI.paper, accent: N};
/** La trousse, posée en bas de l'écran (repère 900 × 640). */
const KIT = {x: 540, y: 1170, w: 900};
const kitLeft = KIT.x - KIT.w / 2;
const kitTop = KIT.y - (KIT.w * 640) / 900 / 2;
const slotAt = (i: number) => ({x: kitLeft + KIT_SLOTS[i].x, y: kitTop + KIT_SLOTS[i].y});

const Question: React.FC<{at: number; x: number; y: number}> = ({at: t0, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < t0) return null;
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${popAt(frame, t0) * (1 + 0.06 * Math.sin(frame / 4))})`}}>
			<div style={{width: 200, height: 200, borderRadius: 100, background: LPI.pink, border: `8px solid ${N}`, boxShadow: SHADOW, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.title, fontWeight: 900, fontSize: 140, color: N}}>?</div>
		</div>
	);
};

/* ─── gros plan vu du dessus : on coupe une tomate… et le couteau dérape sur l'index ─── */
const CU = {w: 1700, left: 540 - 470 * 1.7, top: 255};
const CU_K = CU.w / 1000;
/** Le bout de l'index à l'écran : la caméra s'en approche. */
const HURT_HAND = {x: CU.left + CUT_TIP.x * CU_K, y: CU.top + CUT_TIP.y * CU_K};

const KitchenScene: React.FC<{slip: number; bleed: number; zoom: number; out: number; bandage?: number}> = ({slip, bleed, zoom, out, bandage = 0}) => {
	const frame = useCurrentFrame();
	const slices = interpolate(frame, [0, slip - 4], [1, 3], clamp);
	const saw = frame < slip - 4 ? Math.sin(frame / 1.6) : 0;
	return (
		<AbsoluteFill style={{transform: `translateX(${-1200 * out}px) scale(${zoom})`, transformOrigin: `${HURT_HAND.x}px ${HURT_HAND.y}px`}}>
			<AbsoluteFill style={{background: alpha(LPI.sky, 0.5)}} />
			<div style={{position: 'absolute', left: CU.left, top: CU.top}}>
				<CuttingCloseUp
					width={CU.w}
					slices={slices}
					saw={saw}
					slip={interpolate(frame, [slip - 6, slip + 1], [0, 1], {...clamp, easing: Easing.in(Easing.quad)})}
					cut={fadeIn(frame, slip + 1, 3)}
					jerk={interpolate(frame, [slip + 1, slip + 6, slip + 22], [0, 1, 0.5], clamp)}
					bleed={bleed}
					plaster={bandage}
				/>
			</div>
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ ACCROCHE : LA TROUSSE EST VIDE ═══════════════════════════════ */
export const Hook: React.FC = () => {
	const GLISSE = at('intro', 'glisse…');
	const SAIGNE = at('intro', 'saigne');
	const VITE = at('intro', 'vite,');
	const TROUSSE = at('intro', 'trousse');
	const OUVRES = at('intro', "l'ouvres…");
	const VIDE = at('intro', 'vide.');
	const ALORS = at('intro', 'alors,');
	const SLIP = GLISSE + 6;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[SLIP + 1, SAIGNE + 1, TROUSSE + 1, OUVRES + 1, VIDE + 1, ALORS + 1]} shakes={[SLIP + 2, VIDE + 2]} strength={0.04}>
				<Live
					render={(f) =>
						f < VITE + 6 ? (
							<KitchenScene slip={SLIP} bleed={fadeIn(f, SAIGNE - 2, 6)} zoom={1 + 0.5 * interpolate(f, [SLIP + 2, SAIGNE + 12], [0, 1], ease)} out={interpolate(f, [VITE - 4, VITE + 6], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)})} />
						) : null
					}
				/>
				<Fly at={VITE + 2} x={KIT.x} y={KIT.y - 120} from="right">
					<Live
						render={(f) => (
							<div style={{transform: `rotate(${f < OUVRES - 2 ? 3 * Math.sin(f / 2) : 0}deg)`}}>
								<FirstAidKit width={KIT.w} open={interpolate(f, [OUVRES - 2, OUVRES + 8], [0, 1], ease)} empty={fadeIn(f, OUVRES + 6, 8)} />
							</div>
						)}
					/>
				</Fly>
				<Question at={ALORS} x={540} y={420} />
			</Camera>
			<Flash at={SLIP} max={0.3} />
			<Flash at={VIDE} max={0.2} />
			{[0, 7, 14, 21, 28].map((t) => (t < SLIP - 8 ? <Sfx key={t} name="chop" at={t + 3} volume={0.25} /> : null))}
			<Sfx name="impact" at={SLIP} volume={0.12} />
			<Sfx name="buzz" at={SAIGNE} volume={0.06} dur={12} />
			<Sfx name="whoosh" at={VITE - 4} volume={0.08} />
			<Sfx name="whoosh" at={VITE + 2} volume={0.08} />
			<Sfx name="pop" at={OUVRES} volume={0.08} />
			<Sfx name="sigh" at={VIDE} volume={0.3} dur={40} />
			<Sfx name="ding" at={ALORS} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ LA TROUSSE SE REMPLIT ═══════════════════════════════ */
type Entry = {kind: KitKind; word: string; label: string};
const BIG = 380;
const SMALL = 120;

const KitScene: React.FC<{id: SceneId; tone: string; title: string; prior: KitKind[]; entries: Entry[]; onBlue?: boolean}> = ({id, tone, title, prior, entries, onBlue}) => {
	const frame = useCurrentFrame();
	const ts = entries.map((e) => at(id, e.word) - 4);
	const fly = ts.map((t, i) => (i < ts.length - 1 ? ts[i + 1] - 6 : t + 34));
	const landed = entries.filter((_, i) => frame >= fly[i] + 10).map((e) => e.kind);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: tone}} />
			<Camera punches={ts.map((t) => t + 5)} strength={0.03}>
				<Big from={-2} text={title} size={116} {...(onBlue ? ON_BLUE : {})} />
				<div style={{position: 'absolute', left: kitLeft, top: kitTop}}>
					<FirstAidKit width={KIT.w} open={1} items={[...prior, ...landed]} />
				</div>
				<Blur on={fly.some((t) => frame >= t - 1 && frame <= t + 11)}>
					{entries.map((e, i) => (
						<Posed
							key={e.kind}
							pose={(f) => {
								if (f < ts[i] || f > fly[i] + 10) return null;
								const k = interpolate(f, [fly[i], fly[i] + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
								const slot = slotAt(prior.length + i);
								return {x: 540 + (slot.x - 540) * k, y: 590 + (slot.y - 590) * k, s: popAt(f, ts[i]) * (1 - (1 - SMALL / BIG) * k)};
							}}
						>
							<KitItem kind={e.kind} size={BIG} />
						</Posed>
					))}
				</Blur>
				{entries.map((e, i) => (
					<Note key={e.kind} at={ts[i] + 2} to={fly[i] - 2} y={790} size={46}>
						{e.label}
					</Note>
				))}
			</Camera>
			{ts.map((t, i) => (
				<React.Fragment key={t}>
					<Sfx name="pop" at={t} volume={0.08} />
					<Sfx name="whoosh" at={fly[i]} volume={0.05} />
				</React.Fragment>
			))}
		</AbsoluteFill>
	);
};

const SOIGNER: Entry[] = [
	{kind: 'serum', word: 'sérum', label: 'sérum physiologique : laver'},
	{kind: 'antiseptic', word: 'antiseptique', label: 'antiseptique : désinfecter'},
	{kind: 'gauze', word: 'compresses', label: 'compresses stériles'},
	{kind: 'plaster', word: 'pansements', label: 'pansements de plusieurs tailles'},
];
const TENIR: Entry[] = [
	{kind: 'bandage', word: 'bande', label: 'une bande'},
	{kind: 'tape', word: 'sparadrap', label: 'du sparadrap'},
	{kind: 'gloves', word: 'gants', label: 'gants jetables'},
	{kind: 'scissors', word: 'ciseaux', label: 'ciseaux à bouts arrondis'},
	{kind: 'tweezers', word: 'pince', label: 'pince à écharde'},
];
const PLUS: Entry[] = [
	{kind: 'thermo', word: 'thermomètre,', label: 'un thermomètre'},
	{kind: 'paracetamol', word: 'paracétamol', label: 'paracétamol : douleur, fièvre'},
	{kind: 'blanket', word: 'couverture', label: 'couverture de survie'},
];
const ALL: KitKind[] = [...SOIGNER, ...TENIR, ...PLUS].map((e) => e.kind);

export const Soigner: React.FC = () => <KitScene id="soigner" tone={LPI.sky} title={'Pour *soigner*\nune plaie'} prior={[]} entries={SOIGNER} />;
export const Tenir: React.FC = () => <KitScene id="tenir" tone={alpha(LPI.pink, 0.45)} title={'Pour *tenir*\net se *protéger*'} prior={SOIGNER.map((e) => e.kind)} entries={TENIR} />;
export const Plus: React.FC = () => <KitScene id="plus" tone={LPI.paper} title={'Et *aussi*…'} prior={[...SOIGNER, ...TENIR].map((e) => e.kind)} entries={PLUS} />;

/* ═══════════════════════════════ LES BONS RÉFLEXES ═══════════════════════════════ */
export const Regles: React.FC = () => {
	const PORTEE = at('regles', 'portée');
	const VERIFIE = at('regles', 'vérifie');
	const ANNEE = at('regles', 'année,');
	const NUMEROS = at('regles', 'numéros');
	const N15 = at('regles', '15,');
	const N18 = at('regles', '18,');
	const N112 = at('regles', '112,');
	const POISON = at('regles', 'antipoison.');
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.blue}} />
			<Camera punches={[PORTEE + 1, VERIFIE + 1, NUMEROS + 1, N15 + 1, N18 + 1, N112 + 1, POISON + 1]} strength={0.03}>
				<Big from={-2} text={'Les bons *réflexes*'} size={104} {...ON_BLUE} />
				<RowCard at={PORTEE - 4} y={420} h={230} art={200} badge={1} title="Hors de portée des enfants" size={52}>
					<Padlock size={150} />
				</RowCard>
				<RowCard at={VERIFIE - 4} y={680} h={230} art={200} badge={2} title="Dates de péremption" sub="à vérifier chaque année" subAt={ANNEE - 6} from="left" size={52}>
					<DayChip text="1×/an" size={160} />
				</RowCard>
				<Fly at={NUMEROS - 6} x={540} y={1190} from="bottom">
					<Live render={(f) => <EmergencyCard width={760} on={f < N15 ? 0 : f < N18 ? 1 : f < N112 ? 2 : f < POISON ? 3 : 4} />} />
				</Fly>
			</Camera>
			<Sfx name="pop" at={PORTEE - 4} volume={0.08} />
			<Sfx name="pop" at={VERIFIE - 4} volume={0.08} />
			<Sfx name="whoosh" at={NUMEROS - 6} volume={0.07} />
			<Sfx name="dtmf-1" at={N15} volume={0.25} />
			<Sfx name="dtmf-5" at={N18} volume={0.25} />
			<Sfx name="dtmf-1" at={N112} volume={0.25} />
			<Sfx name="ding" at={POISON} volume={0.07} />
		</AbsoluteFill>
	);
};

/* ═══════════════════════════════ CHUTE : TOUT EST LÀ ═══════════════════════════════ */
export const Fin: React.FC = () => {
	const TOUT = at('fin', 'tout');
	const SLIP = at('fin', 'glisse…') + 2;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: LPI.paper}} />
			<Camera punches={[SLIP + 1, TOUT + 1]} shakes={[TOUT + 2]} strength={0.04}>
				{/* même cuisine : le couteau glisse… mais cette fois la trousse est pleine, et le doigt est pansé */}
				<Live render={(f) => <KitchenScene slip={SLIP} bleed={fadeIn(f, SLIP + 2, 6) * (1 - fadeIn(f, TOUT + 4, 6))} zoom={1} out={0} bandage={fadeIn(f, TOUT + 8, 6)} />} />
				<Fly at={TOUT - 6} x={330} y={1560} from="left">
					<Live render={(f) => <FirstAidKit width={540} open={interpolate(f, [TOUT - 2, TOUT + 6], [0, 1], ease)} items={ALL} shine={fadeIn(f, TOUT + 4, 8)} />} />
				</Fly>
				<Big from={TOUT - 4} text={'Tout est *là*\u00a0!'} size={130} y={90} />
				<Burst at={TOUT + 4} x={HURT_HAND.x} y={HURT_HAND.y} r={260} n={16} />
			</Camera>
			<Flash at={SLIP} max={0.2} />
			{[3, 10, 17, 24, 31].map((t) => (t < SLIP - 6 ? <Sfx key={t} name="chop" at={t} volume={0.22} /> : null))}
			<Sfx name="impact" at={SLIP} volume={0.1} />
			<Sfx name="whoosh" at={TOUT - 6} volume={0.08} />
			<Sfx name="ding" at={TOUT + 2} volume={0.1} />
			<Sfx name="pop" at={TOUT + 8} volume={0.08} />
		</AbsoluteFill>
	);
};
