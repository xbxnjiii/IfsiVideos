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
| 02 | Les 7 constantes (T°, FC, FR, PA, SpO₂, glycémie, diurèse) + normes adultes | `Constantes` | [voix/02-constantes.script.json](voix/02-constantes.script.json) | [storyboard](docs/lpi/storyboard-constantes.md) |
| 03 | Les 14 besoins fondamentaux (Virginia Henderson), en 3 étapes | `Besoins-Fondamentaux` | [voix/03-besoins-fondamentaux.script.json](voix/03-besoins-fondamentaux.script.json) | [storyboard](docs/lpi/storyboard-besoins-fondamentaux.md) |
| 04 | La fréquence cardiaque | `Frequence-Cardiaque` | [voix/04-frequence-cardiaque.script.json](voix/04-frequence-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-frequence-cardiaque.md) |
| 05 | La fréquence respiratoire | `Frequence-Respiratoire` | [voix/05-frequence-respiratoire.script.json](voix/05-frequence-respiratoire.script.json) | [storyboard](docs/lpi/storyboard-frequence-respiratoire.md) |
| 06 | La température corporelle | `Temperature` | [voix/06-temperature.script.json](voix/06-temperature.script.json) | [storyboard](docs/lpi/storyboard-temperature.md) |
| 07 | La tension artérielle | `Tension-Arterielle` | [voix/07-tension-arterielle.script.json](voix/07-tension-arterielle.script.json) | [storyboard](docs/lpi/storyboard-tension-arterielle.md) |
| 08 | La glycémie | `Glycemie` | [voix/08-glycemie.script.json](voix/08-glycemie.script.json) | [storyboard](docs/lpi/storyboard-glycemie.md) |
| 09 | La diurèse | `Diurese` | [voix/09-diurese.script.json](voix/09-diurese.script.json) | [storyboard](docs/lpi/storyboard-diurese.md) |
| 10 | C'est quoi un AVC (pathologie : accroche-choc, VITE) | `AVC` | [voix/10-avc.script.json](voix/10-avc.script.json) | [storyboard](docs/lpi/storyboard-avc.md) |
| 11 | L'arrêt cardiaque chez l'adulte (RCP, DAE) | `Arret-Cardiaque` | [voix/11-arret-cardiaque.script.json](voix/11-arret-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-arret-cardiaque.md) |
| 12 | C'est quoi la SpO₂ | `SpO2` | [voix/12-spo2.script.json](voix/12-spo2.script.json) | [storyboard](docs/lpi/storyboard-spo2.md) |
| 14 | C'est quoi une embolie pulmonaire | `Embolie-Pulmonaire` | [voix/14-embolie-pulmonaire.script.json](voix/14-embolie-pulmonaire.script.json) | [storyboard](docs/lpi/storyboard-embolie-pulmonaire.md) |
| 15 | AVC, format histoire (Michel, mystérieux) | `AVC-Histoire` | [voix/15-avc-histoire.script.json](voix/15-avc-histoire.script.json) | [storyboard](docs/lpi/storyboard-avc-histoire.md) |
| 16 | C'est quoi la BPCO | `BPCO` | [voix/16-bpco.script.json](voix/16-bpco.script.json) | [storyboard](docs/lpi/storyboard-bpco.md) |
| 17 | Série « Les plaies » 1/3 : les bases | `Plaies-1` | [voix/17-plaies-1.script.json](voix/17-plaies-1.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 18 | Série « Les plaies » 2/3 : les plaies aiguës | `Plaies-2` | [voix/18-plaies-2.script.json](voix/18-plaies-2.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 19 | Série « Les plaies » 3/3 : les plaies chroniques | `Plaies-3` | [voix/19-plaies-3.script.json](voix/19-plaies-3.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 20 | Le matériel pour une prise de sang (format inventaire) | `Prise-De-Sang` | [voix/20-prise-de-sang.script.json](voix/20-prise-de-sang.script.json) | [storyboard](docs/lpi/storyboard-prise-de-sang.md) |

## Utilisation

```bash
npm install
npm run studio                                   # aperçu interactif dans le navigateur
npm run render:<vidéo>                           # -> out/<n>-<vidéo>.mp4 (liste : package.json)
npm run voice -- voix/<n>-<sujet>.script.json <épisode>   # voix de la marque + timing mot à mot
npm run check:voice -- <épisode> [--model medium]         # langue et transcription de chaque partie
npm run new -- <épisode> <Composition> <Composant> <n>    # squelette d'une nouvelle vidéo + déclarations
npm run cues -- <épisode>                        # frames des mots, scène par scène (= at(scène, mot))
npm run check:mascot -- <épisode>                # vérifie le jeu de la mascotte
npm run qa -- <Composition> <frame> <frame> …    # images clés + planches -> out/qa/sheet*.jpg
npm run sheet -- out/<vidéo>.mp4                 # planches 1 image/s d'une vidéo rendue
npm run splice -- out/<vidéo>.mp4 seg.mp4@<début> …       # recolle des portions recalculées
npm run sfx                                      # regénère les bruitages (public/sfx)
```

Le navigateur sans interface du conteneur de travail et 4 rendus en parallèle sont réglés dans `remotion.config.ts`.

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
    pressure.tsx              normes de pression artérielle, manomètre, lecture systolique / diastolique
    glyco.tsx                 normes de glycémie, doigt + autopiqueur, lecteur de glycémie, sucres, cellule
    urine.tsx                 normes de diurèse, bocal gradué, horloge 24 h, appareil urinaire (reins → vessie)
    brain.tsx                 cerveau (artères, neurones, ischémie, hémorragie) + gros plan d'artère (caillot, traitements)
    devices.tsx               téléphone (le 15), horloge murale, écran d'imagerie
    arrest.tsx                moniteur ECG (sinus, FV, plat, choc), DAE + électrodes, mains de massage, bascule de tête
    patient.tsx               corps humain (patient de face) : expressions, cœur, artères, brassard, signes
    body.tsx, icons.tsx       poignet + doigts ; petites icônes (causes, situations)
    oxygen.tsx                saturomètre, vaisseau et globules rouges, grille de 100
    embolism.tsx              corps entier (jambes, veine profonde, caillot qui remonte), lit demi-assis, scanner
    copd.tsx                  bronche (inflammation, mucus, emphysème, air piégé), spiromètre, inhalateur
    wound.tsx                 coupe de peau (couches, plaies, brûlures, cloque, microbes, nerfs), escarre, jambe, doigt
    sampling.tsx              matériel de prise de sang (aiguille, porte-tube, ailettes, tubes, SHA, gants, garrot…), bras
    night.tsx                 format histoire : fond nuit, cadre de scanner, lueur, mots qui se mélangent
    series.tsx                vidéos en série : carte des parties, étiquette « 1/3 », « à suivre »
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
assets/planches/              planches v3 de la mascotte (sources des découpes)
scripts/
  voice/                      tts_voix.py (voix + timing) · check_lang.py · cues.py · align_voice.py, prepare_voice.py (voix enregistrée)
  brand/                      découpe des planches v3 (upscale_rgba, cut_v3, export_v3)
  qa/                         contrôle : images clés (stills.mjs, qa.sh), planches (sheet.sh), check-mascot, splice.py
  new-video.py                squelette d'une nouvelle vidéo
voix/                         scripts de voix off (texte exact dit, une entrée par partie)
docs/lpi/                     charte vidéo, storyboards, index visuel de la mascotte
```

## Nouvelle vidéo

Recette complète (formats, règles de la marque, pièges de la voix) : [CLAUDE.md](CLAUDE.md).
1. `voix/<n>-<sujet>.script.json` (texte exact, une partie par scène) → `npm run voice` → `npm run check:voice`.
2. `npm run new` (dossier, composition, déclarations) → `npm run cues` → scènes et mascotte.
3. `npm run check:mascot` → `npm run qa` (relire les planches) → `npm run render:<vidéo>` → `npm run sheet`.
