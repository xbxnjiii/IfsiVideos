# Mémoire du projet — vidéos « La Petite IDE »

Mini-vidéos IFSI en motion design, **tout en code** (Remotion 4, React → MP4), 1080 × 1920, ≥ 1 min,
pour TikTok / Reels / Shorts. La référence de qualité (tempo, physique, mascotte) est la vidéo
**Constantes** (pilote v4, aujourd'hui v7 : 7 constantes) : composition `Constantes`, dossier `src/videos/constantes/`.
Format retenu ensuite : **une vidéo par constante** (modèles `Frequence-Cardiaque`, `Frequence-Respiratoire`, voir plus bas).
Deuxième modèle : **Besoins-Fondamentaux** (`src/videos/besoins-fondamentaux/`) pour les vidéos « liste »
numérotée en étapes (gags au mot près, puces cochées, kit `src/brand/kit.tsx`).
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
- **Repères adultes** discrets mais visibles : échelle des normes `NormScale` (zones hypo / normo /
  hyper + bornes, curseur qui suit la valeur animée) sous l'illustration (prop `scale` de `Lesson3`)
  + seuil de chaque terme (`<Seuil>`) — valeurs (liste fournie pour la v6) dans la charte. Zone normale
  de FC, FR, PA, SpO₂ = « normale » (pas de normocardie / eupnée / normotension / normoxie).
  Chaque notion a sa partie avec voix (fiche bonus sans voix seulement en dernier recours, voir charte).
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
- **Humour du script = gag visuel** : chaque blague a son sticker ou son tampon au mot près
  (« Pas de Wi-Fi », ruban « Enquête en cours », bonbon-médicament…) ; les énumérations deviennent
  des puces cochées.
- **Gabarit de notion** : `Lesson3` (numéro qui s'écrase, termes qui claquent puis se rangent dans la
  fiche ; `slotSide` alterne gauche / droite d'une partie à l'autre ; `shake` ; `scale`).
- **Nouvelles planches** : déjà détourées → `scripts/brand/upscale_rgba.py`, `cut_v3.py` (ancrages dans
  `planches-v3.json`), `export_v3.py` (remplace / supprime les anciennes, manifeste + index).

## Voix

- **Voix de la marque** (validée) : edge-tts `fr-FR-VivienneMultilingualNeural`, débit +8 %.
  **Une seule commande** : `npm run voice -- voix/<n>-<sujet>.script.json <épisode>` → `public/voix/<épisode>/voix.wav`
  + `src/videos/<épisode>/voice.json` (timing mot à mot donné par la synthèse : pas de Whisper).
  Dépendance : `pip install --break-system-packages edge-tts` (quelques secondes, à refaire par session).
- Script : une partie par scène (`id` = id de scène), `{affiché|prononcé}` pour les sigles (`{bpm|B P M}`),
  `"pause": s` pour un silence voulu. Vérifier les mots clés dans voice.json (les nombres sont découpés à part).
- Une voix enregistrée (ElevenLabs, studio) : `scripts/voice/align_voice.py` (Whisper, plus lent).

## Format « une vidéo par constante »

- ≈ 1 min – 1 min 20, une notion par scène, barre de progression des notions, **récap rapide** à la fin
  (la voix résume, une fiche se construit ligne par ligne, puces cochées), pas d'appel à commenter.
- **Pas de quiz** (ni annonce « petit test à la fin ») : retiré à la demande du propriétaire, ne plus en proposer.
- Accroche = la question du sujet (« C'est quoi, la fréquence respiratoire ? »), éventuellement + une promesse
  très courte (la FR garde la question seule : « comment la compter sans qu'il s'en rende compte » retiré).
- Récap : **pas de tampon final** (« Pro du souffle », « Pro du pouls » retirés à la demande) — confettis + mascotte suffisent.
- Rester simple et factuel : pas d'astuces « de terrain » mises en scène (retirées de la FR : compter
  discrètement, faire semblant de prendre le pouls). Expliquer chaque qualificatif entre parenthèses
  (ex. ample (profonde, beaucoup d'air), superficielle (peu profonde, peu d'air)).
- Déroulé type : accroche · définition · mesure (geste + astuce) · norme adulte · trop haut · trop bas ·
  « pas que le chiffre » (rythme, amplitude…) · récap rapide · logo.
- Modèles : `Frequence-Cardiaque`, `Frequence-Respiratoire` et `Temperature` (`src/videos/frequence-*/`, `src/videos/temperature/`,
  storyboards dans `docs/lpi/`). Paliers de valeur qui roulent : `steps()` de `temperature/Scenes.tsx`.

## Recette express (nouvelle vidéo de constante)

1. `voix/<n>-<sujet>.script.json` (texte exact, une partie par scène) → `npm run voice -- …` (2 min).
2. Copier `src/videos/frequence-respiratoire/` → `timeline.ts` (ids de scènes), `Scenes.tsx`, `mascot.ts`,
   `<Video>.tsx` (scènes + transitions), puis déclarer la composition dans `src/Root.tsx` et la vidéo dans
   `scripts/qa/check-mascot.ts`.
3. Briques prêtes (`src/brand/`) : `episode.tsx` (mise en page `LAY`, `Head`, `Unit`, `Tag`, `BigNum`,
   `CauseChip`, `Stopwatch`, `RecapScene`, `EndCard`, composition `Episode`, places `SPOT`, `runAcross`),
   `cardio.tsx` (battements, ECG, cœur qui bat, onde de pouls), `breath.tsx` (respiration, poumons, thorax,
   tracé respiratoire), `thermo.tsx` (zones de température, thermomètre + °C qui roule, jauge froid ↔ chaud,
   ondes de chaleur, flocons), `body.tsx` (poignet, doigts, pouce), `icons.tsx` (effort, fièvre, stress, douleur,
   anxiété, médicament, sommeil, sportif, œil, sueurs, visage rouge, pâleur, frissons), `NormScale`, `TermSlam`, `Stage`, kit (`Stamp`, `CheckChip`…).
4. Contrôle : `npm run check:mascot -- <épisode>` → `COMP=<Composition> OUT=out/qa SCALE=0.5 node scripts/qa/stills.mjs <frames…>`
   → `npm run sheet -- out/qa` (planches ffmpeg) → relecture → rendu → `npm run sheet -- out/<vidéo>.mp4` (1 image/s).

## Rendu et contrôle

- Navigateur : `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
  `--concurrency=4`. ≈ 3,5 s de calcul par seconde de vidéo (pas de 3D : trop lente).
- Avant tout rendu complet : `npm run check:mascot -- <vidéo>`, puis images clés
  `COMP=<Composition> OUT=out/qa SCALE=0.5 node scripts/qa/stills.mjs <frames…>` + `npm run sheet -- out/qa`,
  relues planche par planche.
- Livrer : **le MP4 seul** dans `out/` (non versionné). Plus de version web ni de couverture (demandé).
  Faire le ménage de `out/` (QA, anciens rendus) pour ne garder que les vidéos finales.
