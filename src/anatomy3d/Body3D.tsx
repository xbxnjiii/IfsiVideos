// Corps humain 3D (modèles anatomiques réels BodyParts3D) : peau de verre, squelette, cœur qui bat,
// artères rouges parcourues par l'onde de pouls, veines bleues, poumons qui respirent.
import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {Anatomy} from './useAnatomy';

export const COLORS3D = {
	artery: '#c0121e',
	arteryHot: '#ff4d5e',
	vein: '#2348a8',
	myocardium: '#a3141d',
	coronary: '#e3112b',
	lung: '#f3a9bd',
	bronchi: '#dfe8ff',
	bone: '#e9e3d8',
	diaphragm: '#b5485a',
	skin: '#C5D8F4',
};

export type Look3D = {
	/** visibilité de la peau de verre (0 → 1) */
	skin: number;
	/** squelette */
	bones: number;
	/** artères + veines du corps */
	vessels: number;
	/** cœur */
	heart: number;
	/** poumons (surface) */
	lungs: number;
	/** bronches + vaisseaux pulmonaires */
	bronchi: number;
	/** inspiration 0 → 1 */
	breath: number;
	/** contraction ventriculaire 0 → 1 */
	beat: number;
	/** rayons (m) des ondes de pouls en cours, depuis le cœur */
	waves: number[];
	/** −1 froid … +1 fièvre */
	thermal: number;
	/** temps (s) pour le défilement du sang */
	time: number;
};

/* ─────────── matériaux ─────────── */

const glassMaterial = (base = '#1d2a4a', rimColor: string = COLORS3D.skin, floor = 0.1, power = 2.2) =>
	new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		side: THREE.FrontSide,
		uniforms: {
			uColor: {value: new THREE.Color(base)},
			uRim: {value: new THREE.Color(rimColor)},
			uFloor: {value: floor},
			uPower: {value: power},
			uTint: {value: new THREE.Color('#ff6b81')},
			uTintAmt: {value: 0},
			uOpacity: {value: 1},
		},
		vertexShader: /* glsl */ `
			varying vec3 vN; varying vec3 vV;
			void main() {
				vec4 mv = modelViewMatrix * vec4(position, 1.0);
				vN = normalize(normalMatrix * normal);
				vV = normalize(-mv.xyz);
				gl_Position = projectionMatrix * mv;
			}`,
		fragmentShader: /* glsl */ `
			uniform vec3 uColor; uniform vec3 uRim; uniform vec3 uTint; uniform float uTintAmt; uniform float uOpacity;
			uniform float uFloor; uniform float uPower;
			varying vec3 vN; varying vec3 vV;
			void main() {
				float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
				vec3 rim = mix(uRim, uTint, uTintAmt);
				vec3 col = mix(uColor, rim, f);
				float a = uOpacity * (uFloor + 0.85 * f + 0.25 * uTintAmt);
				gl_FragColor = vec4(col, a);
			}`,
	});

/** matériau « vaisseau » : verni + onde de pouls lumineuse + sang qui défile depuis le cœur */
const vesselMaterial = (color: string, outward: boolean) => {
	const uniforms = {
		uHeart: {value: new THREE.Vector3()},
		uWaves: {value: [-1, -1, -1, -1]},
		uTime: {value: 0},
		uFlow: {value: outward ? 1 : -1},
		// les veines ne reçoivent pas l'onde de pouls
		uPulse: {value: outward ? 1 : 0},
	};
	const m = new THREE.MeshPhysicalMaterial({
		color,
		roughness: 0.38,
		metalness: 0,
		clearcoat: 0.55,
		clearcoatRoughness: 0.3,
	});
	m.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, uniforms);
		shader.vertexShader = shader.vertexShader
			.replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
			.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
		shader.fragmentShader = shader.fragmentShader
			.replace(
				'#include <common>',
				'#include <common>\nvarying vec3 vWorldPos; uniform vec3 uHeart; uniform float uWaves[4]; uniform float uTime; uniform float uFlow; uniform float uPulse;',
			)
			.replace(
				'#include <emissivemap_fragment>',
				`#include <emissivemap_fragment>
				float dh = distance(vWorldPos, uHeart);
				float g = 0.0;
				for (int i = 0; i < 4; i++) { if (uWaves[i] > 0.0) g += exp(-pow((dh - uWaves[i]) / 0.045, 2.0)); }
				float stripes = smoothstep(0.75, 1.0, fract(dh * 9.0 - uTime * 1.6 * uFlow));
				totalEmissiveRadiance += diffuseColor.rgb * (0.25 * stripes + 1.6 * g * uPulse) + vec3(1.0, 0.25, 0.25) * g * 0.35 * uPulse;`,
			);
	};
	m.customProgramCacheKey = () => `vessel-${outward}`;
	return {m, uniforms};
};

/* ─────────── environnement (reflets) ─────────── */

const Environment: React.FC = () => {
	const {gl, scene} = useThree();
	useMemo(() => {
		const pmrem = new THREE.PMREMGenerator(gl);
		scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment.mapping = THREE.EquirectangularReflectionMapping;
		scene.environmentIntensity = 0.35;
	}, [gl, scene]);
	return null;
};

/* ─────────── corps ─────────── */

const center = (b: THREE.Box3) => b.getCenter(new THREE.Vector3());

export const Body3D: React.FC<{a: Anatomy; look: Look3D}> = ({a, look}) => {
	const mats = useMemo(() => {
		const art = vesselMaterial(COLORS3D.artery, true);
		const vein = vesselMaterial(COLORS3D.vein, false);
		const coro = vesselMaterial(COLORS3D.coronary, true);
		return {
			glass: glassMaterial(),
			art,
			vein,
			coro,
			myocardium: new THREE.MeshPhysicalMaterial({
				color: COLORS3D.myocardium,
				roughness: 0.5,
				clearcoat: 0.6,
				clearcoatRoughness: 0.35,
				sheen: 0.25,
				sheenColor: new THREE.Color('#ff7a8a'),
				emissive: new THREE.Color('#ff2d4b'),
				emissiveIntensity: 0,
			}),
			lungs: glassMaterial('#5a1d33', COLORS3D.lung, 0.16, 1.6),
			pulmonary: new THREE.MeshPhysicalMaterial({color: '#7a5aa8', roughness: 0.4, clearcoat: 0.5, transparent: true, opacity: 0.6}),
			bronchi: new THREE.MeshPhysicalMaterial({color: COLORS3D.bronchi, roughness: 0.4, clearcoat: 0.4, transparent: true, emissive: new THREE.Color('#4E7AC7'), emissiveIntensity: 0.25}),
			bone: new THREE.MeshStandardMaterial({color: COLORS3D.bone, roughness: 0.7, transparent: true, opacity: 0.55, depthWrite: false}),
			diaphragm: new THREE.MeshPhysicalMaterial({color: COLORS3D.diaphragm, roughness: 0.55, sheen: 0.5, transparent: true, opacity: 0.7}),
		};
	}, []);
	const heartC = useMemo(() => center(a.box.heart), [a]);
	const lungsTop = useMemo(() => {
		const c = center(a.box.lungs);
		return new THREE.Vector3(c.x, a.box.lungs.max.y, c.z);
	}, [a]);

	// uniformes animés
	for (const v of [mats.art, mats.vein, mats.coro]) {
		v.uniforms.uHeart.value.copy(heartC);
		v.uniforms.uTime.value = look.time;
		v.uniforms.uWaves.value = [0, 1, 2, 3].map((i) => look.waves[i] ?? -1);
	}
	const fever = Math.max(0, look.thermal);
	const cold = Math.max(0, -look.thermal);
	mats.glass.uniforms.uOpacity.value = look.skin;
	mats.glass.uniforms.uTintAmt.value = Math.max(fever, cold);
	mats.glass.uniforms.uTint.value.set(fever > 0 ? '#ff5d73' : '#7fb2ff');
	mats.myocardium.emissiveIntensity = 0.35 * look.beat;
	mats.bone.opacity = 0.55 * look.bones;
	mats.lungs.uniforms.uOpacity.value = look.lungs;
	mats.bronchi.opacity = look.bronchi;
	mats.pulmonary.opacity = 0.6 * look.bronchi;
	mats.diaphragm.opacity = 0.3 * look.lungs;
	for (const v of [mats.art, mats.vein]) {
		v.m.opacity = look.vessels;
		v.m.transparent = look.vessels < 0.99;
	}

	const s = 1 - 0.07 * look.beat;
	const b = look.breath;
	return (
		<group>
			<Environment />
			{look.bones > 0.01 ? <mesh geometry={a.skeleton} material={mats.bone} renderOrder={1} /> : null}
			{look.vessels > 0.01 ? (
				<group>
					<mesh geometry={a.veins} material={mats.vein.m} />
					<mesh geometry={a.arteries} material={mats.art.m} />
				</group>
			) : null}
			{look.heart > 0.01 ? (
				<group position={heartC} scale={[s, s * 0.97, s]}>
					<group position={heartC.clone().multiplyScalar(-1)}>
						<mesh geometry={a.heart} material={mats.myocardium} />
						<mesh geometry={a.heart_arteries} material={mats.coro.m} />
						<mesh geometry={a.heart_veins} material={mats.vein.m} />
					</group>
				</group>
			) : null}
			{look.lungs > 0.01 || look.bronchi > 0.01 ? (
				<group>
					<group position={lungsTop} scale={[1 + 0.04 * b, 1 + 0.07 * b, 1 + 0.05 * b]}>
						<group position={lungsTop.clone().multiplyScalar(-1)}>
							{look.bronchi > 0.01 ? <mesh geometry={a.bronchi} material={mats.bronchi} /> : null}
							{look.bronchi > 0.01 ? <mesh geometry={a.pulmonary} material={mats.pulmonary} /> : null}
							{look.lungs > 0.01 ? <mesh geometry={a.lungs} material={mats.lungs} renderOrder={2} /> : null}
						</group>
					</group>
					{look.lungs > 0.01 ? <mesh geometry={a.diaphragm} material={mats.diaphragm} position={[0, -0.025 * b, 0]} /> : null}
				</group>
			) : null}
			{look.skin > 0.01 ? <mesh geometry={a.skin} material={mats.glass} renderOrder={3} /> : null}
		</group>
	);
};
