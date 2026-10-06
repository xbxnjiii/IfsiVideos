// Génère cues.js : instant (s) de chaque mot de la voix, lu par index.html.
// Même source que la version Remotion : src/videos/lpi-constantes-v3/voice.json.
import {readFileSync, writeFileSync} from 'node:fs';

const OFFSET = 0.25; // la voix démarre 0,25 s après le début de la vidéo
const voice = JSON.parse(readFileSync(new URL('../../src/videos/lpi-constantes-v3/voice.json', import.meta.url)));
const norm = (s) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9']/g, '');
const WANT = [
	'les', '5', 'constantes', 'à', 'ne', 'surtout', 'pas', 'oublier', 'quand', 'étudiant', 'avec', 'techniques',
	'absolument', 'connaître', 'un', 'température', 'évalue', 'fièvre', 'fébrile',
];
const cues = {};
for (const w of WANT) {
	const hit = voice.words.find((x) => norm(x.text) === norm(w));
	if (!hit) throw new Error(`mot introuvable : ${w}`);
	cues[norm(w)] = +(hit.start + OFFSET).toFixed(3);
}
writeFileSync(
	new URL('./cues.js', import.meta.url),
	`// généré par make-cues.mjs — ne pas éditer\nwindow.CUES = ${JSON.stringify(cues, null, 1)};\nwindow.VOICE_OFFSET = ${OFFSET};\n`,
);

// bruitages : écrits en dur dans index.html (le mixeur audio lit le HTML statique)
const c = (k) => cues[norm(k)];
const L = 0.1;
const SFX = [
	['impact', c('5') - L, 0.1], ['whoosh', c('constantes'), 0.06],
	...[0, 1, 2, 3, 4].map((k) => ['pop', c('constantes') + 0.33 + k * 0.1, 0.09]),
	['pop', c('surtout') - L, 0.1], ['whoosh', c('avec') - L, 0.06],
	...[0, 0.23, 0.47, 0.7].map((d) => ['tick', c('techniques') - L + d, 0.09]),
	['ding', c('absolument') - L, 0.08], ['whoosh', c('un') - 0.5, 0.1], ['impact', c('un') - L, 0.09],
	['whoosh', c('un') + 0.4, 0.05], ['pop', c('fébrile') - L, 0.14], ['whoosh', c('fébrile') + 0.67, 0.045],
];
const LEN = {impact: 0.7, whoosh: 0.42, pop: 0.12, tick: 0.05, ding: 0.7}; // durée utile de chaque bruitage (s)
const tags = SFX.map(
	([name, t, v], i) =>
		`      <audio id="sfx${i}" src="assets/sfx/${name}.wav" data-start="${t.toFixed(3)}" data-duration="${LEN[name]}" data-volume="${v}" data-track-index="${10 + i}"></audio>`,
).join('\n');
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
writeFileSync(
	new URL('./index.html', import.meta.url),
	html.replace(/(<!-- sfx:start[^>]*-->)[\s\S]*?(\s*<!-- sfx:end -->)/, `$1\n${tags}$2`),
);
console.log(cues, `${SFX.length} bruitages`);
