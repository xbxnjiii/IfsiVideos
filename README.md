# IFSI Vidéos — La Petite IDE

Mini-vidéos en motion design (TikTok / Instagram Reels / YouTube Shorts, 1080×1920) pour réviser
les cours d'IFSI. Tout est généré **en code** avec [Remotion](https://www.remotion.dev/) (React → MP4) :
pas de logiciel de montage, pas de banque d'images.

> La charte de la marque (couleurs, typo, mascotte, tempo, physique, transitions) est décrite dans
> [docs/lpi/charte-video.md](docs/lpi/charte-video.md) et codée dans `src/brand/`.
> Mémoire de travail pour les prochaines vidéos : [CLAUDE.md](CLAUDE.md).

## Vidéos

| # | Sujet | Composition | Script voix | Storyboard |
|---|-------|-------------|-------------|------------|
| 02 | Les 5 constantes + 16 termes techniques (repères adultes) | `Constantes` | [voix/02-constantes.script.json](voix/02-constantes.script.json) | [storyboard](docs/lpi/storyboard-constantes.md) |

## Utilisation

```bash
npm install
npm run studio                  # aperçu interactif dans le navigateur
npm run render:constantes       # -> out/02-constantes.mp4
npm run check:mascot -- constantes   # vérifie le jeu de la mascotte d'une vidéo
npm run sfx                     # regénère les bruitages (public/sfx)
```

Rendu dans le conteneur de travail : ajouter
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --concurrency=4`.

## Organisation

```
src/
  Root.tsx                    liste des compositions
  brand/                      LA PETITE IDE : briques réutilisables par toutes les vidéos
    theme.ts                  couleurs, polices, grille
    ui.tsx, learn.tsx         titres mot à mot, pinceau, cartes, signes ↑ ↓ ✓
    motion3.tsx               numéro qui s'écrase, termes qui claquent, caméra, socle, compteurs, vague
    motion4.tsx               transitions : plongée, rideau tiré par la mascotte, panoramique éclair
    Lesson3.tsx               gabarit d'une notion (titre, définition, illustration, termes, repère adulte)
    MascotActor.tsx           mascotte actrice : sauts, course, expressions au mot près, bustes libres
    pictos.tsx                pictogrammes et illustrations (thermomètre, cœur, poumons, artère…)
    timeline.ts               voix → frames : at(scène, mot)
    Sfx.tsx                   bruitages synchronisés
  videos/<vidéo>/             une vidéo = timeline + scènes + jeu de la mascotte + voice.json
public/
  brand/mascotte/             images officielles de la mascotte (manifest.json = tailles)
  brand/logo/                 logos officiels
  voix/<vidéo>/voix.wav       voix montée et normalisée
  fonts/, sfx/                polices embarquées, bruitages
assets/planches/              planches originales de la mascotte et des logos (sources des découpes)
scripts/
  voice/                      align_voice.py (voix IA déjà propre) · prepare_voice.py (vraie voix)
  brand/                      découpe des planches (upscale_rgba, cut_v3, export_v3 ; v2 : cutout, upscale)
  qa/                         contrôle : images clés, planches contact, check-mascot
voix/                         scripts de voix off (texte exact dit, une entrée par partie)
docs/lpi/                     charte vidéo, storyboards, index visuel de la mascotte
```

## Nouvelle vidéo

1. Texte exact dit par la voix dans `voix/<n>-<sujet>.script.json` (une entrée par partie).
2. `python3 scripts/voice/align_voice.py VOIX.mp3 voix/<n>-<sujet>.script.json <dossier>`
   (dépendances : `ffmpeg`, `pip install faster-whisper soundfile`).
3. Scènes dans `src/videos/<dossier>/`, chaque animation déclenchée par un mot : `at('b3', 'transmissions')`.
4. Contrôle (charte, « Contrôle qualité ») puis rendu.
