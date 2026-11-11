# De la page blanche au MP4

## Nouveau conteneur

`npm ci` puis `pip install --break-system-packages edge-tts faster-whisper soundfile`. Le navigateur sans interface est
trouvé tout seul dans `/opt/pw-browsers` (`remotion.config.ts`, `npm run qa`). ≈ 3,5 s de calcul par seconde de vidéo.

## Recette

1. **Storyboard** `docs/lpi/storyboard-<épisode>.md` : tableau partie · voix · image. Proposer 2 – 3 accroches si besoin.
2. **Voix** : script `voix/<n>-<sujet>.script.json` → voix (voir `voix.md`) → `npm run check:voice -- <épisode>`.
3. **Squelette** : `npm run new -- <épisode> <Composition> <Composant> <n>` crée `src/videos/<épisode>/` (timeline,
   composition avec transitions en alternance, `Scenes.tsx`, `mascot.ts`) et les déclarations (`src/Root.tsx`,
   `scripts/qa/check-mascot.ts`, script `render:<épisode>` dans `package.json`).
4. **Scènes** : `npm run cues -- <épisode>` donne l'image de chaque mot ; chaque mouvement = `at(scène, mot)`.
   Réutiliser les briques (`references/briques.md`) ; nouvelle brique → `src/brand/<thème>.tsx` + JSDoc +
   `python3 scripts/brand/catalog.py`.
5. **Mascotte** : étapes dans `mascot.ts`, puis `npm run check:mascot -- <épisode>` (0 chevauchement).
6. **Contrôle** : `npx tsc --noEmit`, puis `npm run qa -- <Composition> <images…>` → `out/qa/f*.png` + planches
   `out/qa/sheet*.jpg`, relues **une par une** (texte coupé, mascotte qui cache, vide au bord de la caméra, couleur hors
   charte, objet qui passe par-dessus un autre).
7. **Rendu** : `npm run render:<épisode>` → `out/<n>-<épisode>.mp4`, puis `npm run sheet -- out/<n>-<épisode>.mp4`
   (1 image / s) et relecture.
8. **Livraison** : `rm -rf out/qa out/qa-video out/check-mascot.cjs`, garder seulement les MP4 finaux, mettre à jour
   `README.md` (ligne de la vidéo), le storyboard et `CLAUDE.md` (décisions du propriétaire), commit + push sur `main`,
   envoyer le MP4.

## Retoucher une vidéo déjà livrée (sans tout recalculer)

- `npx remotion render <Comp> seg.mp4 --frames=<début>-<fin>` pour chaque portion qui change (un élément affiché jusqu'à
  la fin de sa scène compte jusqu'à la fin de la transition suivante), puis
  `npm run splice -- out/<vidéo>.mp4 seg.mp4@<début> …` (image + son, durée inchangée).
- Nouvelle accroche : voix `--only intro`, rendre `--frames=0-<début scène 2 + 15>`, puis
  `npm run splice -- out/<vidéo>.mp4 tete.mp4@0:<ancien début2+16>` ; vérifier le raccord (PSNR ≈ 50 dB) ; si la mascotte
  est visible au raccord, couper plus loin quand elle est hors écran.

## Outils

| Commande | Rôle |
|---|---|
| `npm run studio` | prévisualiser dans Remotion Studio |
| `npm run voice` / `check:voice` / `cues` | voix edge-tts, contrôle de langue, images des mots |
| `npm run new` | squelette d'une nouvelle vidéo |
| `npm run check:mascot` | étapes de la mascotte (charge tous les épisodes) |
| `npm run qa` / `sheet` | images clés + planches ; planche 1 image / s d'un MP4 |
| `npm run splice` | recoller des segments recalculés |
| `npm run sfx` / `sfx:import` | sons d'interface synthétisés / vrais bruitages (La Sonothèque) |
| `python3 scripts/brand/catalog.py` | régénérer le catalogue des briques du skill |
| Compositions `Mascotte-Planche`, `Planche-Poumons`, `Planche-Enfant`, `Besoins-Illustrations` | planches de contrôle |

## Médias externes (payants)

- **Toujours `estimate_only` d'abord** et annoncer le prix ; jamais deux générations dans le même tour.
- Vidéo IA (ElevenLabs `creative_generate_video`) : Seedance 2.5 ≈ 14 000 crédits / 5 s (jugé trop cher),
  Kling 2.5 Turbo ≈ 2 100, LTX v2 Fast ≈ 1 450. Le format 9:16 demandé dans le texte n'est pas garanti.
- Higgsfield : compte gratuit, 0 crédit.
- Bruitages : Freesound renvoie 403 depuis le conteneur (ne pas contourner) → La Sonothèque.
