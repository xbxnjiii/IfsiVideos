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
| 02 | Les 7 constantes (T°, FC, FR, PA, SpO₂, glycémie, diurèse) + normes adultes (échelles animées) | `Constantes` | [voix/02-constantes.script.json](voix/02-constantes.script.json) | [storyboard](docs/lpi/storyboard-constantes.md) |
| 03 | Les 14 besoins fondamentaux (Virginia Henderson), en 3 étapes | `Besoins-Fondamentaux` | [voix/03-besoins-fondamentaux.script.json](voix/03-besoins-fondamentaux.script.json) | [storyboard](docs/lpi/storyboard-besoins-fondamentaux.md) |
| 04 | La fréquence cardiaque (une vidéo par constante, récap rapide) | `Frequence-Cardiaque` | [voix/04-frequence-cardiaque.script.json](voix/04-frequence-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-frequence-cardiaque.md) |
| 05 | La fréquence respiratoire (une vidéo par constante, récap rapide) | `Frequence-Respiratoire` | [voix/05-frequence-respiratoire.script.json](voix/05-frequence-respiratoire.script.json) | [storyboard](docs/lpi/storyboard-frequence-respiratoire.md) |
| 06 | La température corporelle (une vidéo par constante, récap rapide) | `Temperature` | [voix/06-temperature.script.json](voix/06-temperature.script.json) | [storyboard](docs/lpi/storyboard-temperature.md) |

## Utilisation

```bash
npm install
npm run studio                  # aperçu interactif dans le navigateur
npm run render:constantes       # -> out/02-constantes.mp4
npm run render:besoins          # -> out/03-besoins-fondamentaux.mp4
npm run render:fc               # -> out/04-frequence-cardiaque.mp4
npm run render:fr               # -> out/05-frequence-respiratoire.mp4
npm run render:temp             # -> out/06-temperature.mp4
npm run voice -- voix/<script>.json <épisode>   # voix + timing mot à mot
npm run sheet -- out/qa          # planches contact (ffmpeg)
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
    kit.tsx                   stickers, tampons, puces cochées, rubans, progression par étapes, bulle
    Lesson3.tsx               gabarit d'une notion (titre, définition, illustration, termes, échelle des normes)
    NormScale.tsx             échelle des normes adulte (zones hypo / normo / hyper, curseur animé)
    episode.tsx               kit « une vidéo par constante » : mise en page, récap, logo, composition Episode
    cardio.tsx                battements, cœur qui bat, tracé ECG, onde de pouls
    breath.tsx                respiration (phase), poumons, thorax, tracé respiratoire
    thermo.tsx                zones de température, thermomètre + °C, jauge froid ↔ chaud, chaleur, flocons
    body.tsx, icons.tsx       poignet + doigts ; petites icônes (causes, situations)
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
  voice/                      tts_voix.py (voix de la marque + timing) · align_voice.py (voix enregistrée) · prepare_voice.py
  brand/                      découpe des planches (upscale_rgba, cut_v3, export_v3 ; v2 : cutout, upscale)
  qa/                         contrôle : images clés (stills.mjs), planches (sheet.sh), check-mascot
voix/                         scripts de voix off (texte exact dit, une entrée par partie)
docs/lpi/                     charte vidéo, storyboards, index visuel de la mascotte
```

## Nouvelle vidéo

1. Texte exact dit par la voix dans `voix/<n>-<sujet>.script.json` (une entrée par partie).
2. Voix : `npm run voice -- voix/<n>-<sujet>.script.json <dossier>` (voix de la marque + timing mot à mot ;
   dépendances : `ffmpeg`, `pip install --break-system-packages edge-tts`). Recette complète : CLAUDE.md.
3. Scènes dans `src/videos/<dossier>/`, chaque animation déclenchée par un mot : `at('b3', 'transmissions')`.
4. Contrôle (charte, « Contrôle qualité ») puis rendu.
