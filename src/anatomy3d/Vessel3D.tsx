// Gros plan 3D « dans le vaisseau » : paroi d'artère (ou capillaire) en coupe, globules rouges
// biconcaves qui circulent, molécules d'O2 accrochées à l'hémoglobine.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {rng} from '../anatomy/geometry';

/** globule rouge : disque biconcave (équation d'Evans-Fung), rayon 1 */
const rbcGeometry = () => {
	const pts: THREE.Vector2[] = [];
	const N = 28;
	const thick = (r: number) => 0.5 * Math.sqrt(Math.max(0, 1 - r * r)) * (0.21 + 2 * r * r - 1.12 * r ** 4);
	for (let i = 0; i <= N; i++) {
		const r = Math.min(0.9999, i / N);
		pts.push(new THREE.Vector2(r, thick(r)));
	}
	for (let i = N; i >= 0; i--) {
		const r = Math.min(0.9999, i / N);
		pts.push(new THREE.Vector2(r, -thick(r)));
	}
	const g = new THREE.LatheGeometry(pts, 48);
	g.computeVertexNormals();
	return g;
};

export type VesselShot = {
	/** temps (s) */
	time: number;
	/** distance parcourue par le sang (s'accélère à chaque systole) */
	travel: number;
	/** gonflement de la paroi 0 → 1 (onde de pression) */
	push: number;
	/** force sur la paroi : 1 normal, > 1 hypertension, < 1 hypotension */
	strength: number;
	/** part des globules qui portent leur O2 (0 → 1) */
	sat: number;
	/** rayon du vaisseau (unités scène) */
	radius?: number;
	/** compression du brassard 0 → 1 */
	cuff?: number;
};

export const Vessel3D: React.FC<{shot: VesselShot}> = ({shot}) => {
	const {time, travel, push, strength, sat, radius = 1, cuff = 0} = shot;
	const geo = useMemo(() => rbcGeometry(), []);
	const cells = useMemo(() => {
		const r = rng(42);
		return Array.from({length: 90}, () => ({
			x0: r() * 24 - 12,
			a: r() * Math.PI * 2,
			d: Math.sqrt(r()) * 0.62,
			rot: [r() * Math.PI, r() * Math.PI, r() * Math.PI] as [number, number, number],
			spin: (r() - 0.5) * 1.5,
			k: r(),
			speed: 0.85 + r() * 0.3,
		}));
	}, []);
	const mats = useMemo(
		() => ({
			rbc: new THREE.MeshPhysicalMaterial({color: '#c3131f', roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.25, sheen: 0.6, sheenColor: new THREE.Color('#ff8a96')}),
			rbcLow: new THREE.MeshPhysicalMaterial({color: '#5b2a6e', roughness: 0.4, clearcoat: 0.6, sheen: 0.4, sheenColor: new THREE.Color('#b9a3ff')}),
			o2: new THREE.MeshPhysicalMaterial({color: '#7fb2ff', emissive: new THREE.Color('#4E7AC7'), emissiveIntensity: 0.9, roughness: 0.2, clearcoat: 1}),
			wall: new THREE.MeshPhysicalMaterial({
				color: '#8f1a2a',
				roughness: 0.55,
				sheen: 0.8,
				sheenColor: new THREE.Color('#ffb3c0'),
				side: THREE.BackSide,
			}),
			wallOut: new THREE.MeshPhysicalMaterial({color: '#d98b9b', roughness: 0.6, transparent: true, opacity: 0.22, side: THREE.FrontSide, depthWrite: false}),
			cuff: new THREE.MeshPhysicalMaterial({color: '#4E7AC7', roughness: 0.8, sheen: 0.4}),
		}),
		[],
	);
	const wallR = radius * (1 + 0.12 * push * strength) * (1 - 0.45 * cuff);
	const o2 = useMemo(() => new THREE.SphereGeometry(0.075, 16, 12), []);
	return (
		<group>
			{/* paroi : on voit l'intérieur du tube (face arrière) + une coque translucide */}
			<mesh rotation={[0, 0, Math.PI / 2]} material={mats.wall}>
				<cylinderGeometry args={[wallR, wallR, 30, 64, 1, true]} />
			</mesh>
			<mesh rotation={[0, 0, Math.PI / 2]} material={mats.wallOut}>
				<cylinderGeometry args={[wallR * 1.08, wallR * 1.08, 30, 64, 1, true]} />
			</mesh>
			{cuff > 0 ? (
				<mesh rotation={[0, 0, Math.PI / 2]} position={[2, 0, 0]} material={mats.cuff}>
					<cylinderGeometry args={[wallR * 1.35, wallR * 1.35, 4, 64, 1, true]} />
				</mesh>
			) : null}
			{cells.map((c, i) => {
				const x = ((((c.x0 + travel * c.speed) % 24) + 24) % 24) - 12;
				const rr = c.d * wallR;
				const loaded = c.k < sat;
				return (
					<group key={i} position={[x, Math.cos(c.a + time * 0.3) * rr, Math.sin(c.a + time * 0.3) * rr]}>
						<mesh
							geometry={geo}
							material={loaded ? mats.rbc : mats.rbcLow}
							scale={0.32 * radius}
							rotation={[c.rot[0] + time * c.spin, c.rot[1], c.rot[2] + time * c.spin * 0.5]}
						/>
						{loaded
							? [0, 1, 2, 3].map((j) => {
									const ang = (j / 4) * Math.PI * 2 + time * 1.5 + i;
									return <mesh key={j} geometry={o2} material={mats.o2} position={[Math.cos(ang) * 0.38 * radius, Math.sin(ang) * 0.38 * radius, 0.12 * radius]} />;
								})
							: null}
					</group>
				);
			})}
		</group>
	);
};
