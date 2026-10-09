# Mémoire du projet — vidéos « La Petite IDE »

Mini-vidéos IFSI en motion design, **tout en code** (Remotion 4, React → MP4), 1080 × 1920, ≥ 1 min,
pour TikTok / Reels / Shorts. La référence de qualité (tempo, physique, mascotte) est la vidéo
**Constantes** (pilote v4 regénéré en v5) : composition `Constantes`, dossier `src/videos/constantes/`.
Les anciennes versions (v1 à v4, labo HyperFrames, anatomie SVG / 3D) ont été retirées : elles restent
dans l'historique git (dernier état complet : commit `ce2a0a2`).
Charte complète (couleurs, tempo, physique, mascotte, transitions) : `docs/lpi/charte-video.md`.

## Règles de marque (non négociables)

- Couleurs uniquement : `#4E7AC7` bleu, `#C5D8F4` bleu clair, `#F8F9FC` fond blanc cassé, `#EAA7C1` rose,
  `#2D3A5A` bleu nuit (+ transparences). Exceptions : images officielles de la mascotte et logos.
- Mascotte : **uniquement les images officielles** (`public/brand/mascotte/`, index visuel
  `docs/lpi/mascotte-index.webp`), jamais redessinée, **jamais retournée en miroir**.
  **Bustes libres, sans cadre** (`<MascotActor busts="free">` : sticker détouré, bas en fondu) —
  plus de carré autour. Poses en pied libres. Dossier `symptomes/` pour jouer les signes cliniques.
- **Repères adultes** discrets mais visibles : bandeau `norm` (« ADULTE · normale … ») sous
  l'illustration + seuil de chaque terme (`<Seuil>`) — valeurs dans la charte.
- Pas de filigrane, pas de sous-titres incrustés, pas de pastille « à connaître en IFSI », pas de
  musique dans l'export (ajoutée sur TikTok). Une accroche par vidéo. Termes techniques toujours
  accompagnés d'une explication courte.

## Ce qu'on garde du pilote (à réutiliser tel quel)

- **Tempo** : chaque mouvement part d'un mot de la voix (`at(scène, mot)`, 3 frames d'avance) ;
  un événement visible toutes les 0,5–1 s ; transitions de 14 frames, jamais deux fois la même
  d'affilée (`src/brand/motion4.tsx` : `zoomInto`, `runWipe`, `whip`, + `wave`).
- **Physique** : pops à ressort (~12 % de dépassement), sauts en arc centrés sur le mot avec
  accroupie / étirement / écrasement, secousse uniquement à l'impact, sorties rapides accélérées.
- **Mascotte actrice** (`src/brand/MascotActor.tsx`, exemple `src/videos/constantes/mascot.ts`) :
  une étape par mot clé, expression qui colle au mot (lexique v5 dans la charte, symptômes compris), places qui changent
  sans cesse sur tout l'écran (`home`, `low`, `top`, `bottom`, plein écran), métaphores physiques
  (elle court sur « trop rapide », saute au ralenti sur « trop lent », grelotte, tremble de colère…),
  et elle porte les transitions. Elle ne masque jamais titre, définition, fiche ni chiffres.
- **Gabarit de notion** : `Lesson3` (numéro qui s'écrase, termes qui claquent puis se rangent dans la
  fiche ; `slotSide` alterne gauche / droite d'une partie à l'autre ; `shake` ; `norm`).
- **Nouvelles planches** : déjà détourées → `scripts/brand/upscale_rgba.py`, `cut_v3.py` (ancrages dans
  `planches-v3.json`), `export_v3.py` (remplace / supprime les anciennes, manifeste + index).

## Rendu et contrôle

- Navigateur : `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
  `--concurrency=4`. ≈ 3,5 s de calcul par seconde de vidéo (pas de 3D : trop lente).
- Avant tout rendu complet : `npm run check:mascot -- <vidéo>`, puis images clés
  `COMP=<Composition> OUT=out/stills node scripts/qa/stills.mjs <frames…>` + `python3 scripts/qa/contact_sheet.py out/stills`,
  relues planche par planche.
- Livrer : MP4 complet + version web (`ffmpeg -crf 26`) + couverture PNG dans `out/` (non versionné).
