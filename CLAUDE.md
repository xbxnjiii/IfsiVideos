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
  `"pause": s` pour un silence voulu, `"rate": "-3%"` pour ralentir une partie dense (≈ 10 % plus lent que +8 %,
  ex. la partie VITE de l'AVC). Lettre isolée : écrire « la lettre E » (un « E » seul est lu « è », entendu « H ») ;
  **chiffres et symboles toujours en lettres** (`{98 %|quatre-vingt-dix-huit pour cent}`) : un « 98 %. » seul en début de
  partie a été lu **en anglais** (« ninety-eight percent ») par la voix multilingue ; contrôler la langue de chaque début
  de partie avec faster-whisper **sans forcer la langue** (`info.language` doit être `fr`) ;
  « à jeun » est lu « à jeune » : écrire `{jeun|jun}` (entendu « AJ1 ») ;
  en cas de doute, transcrire l'extrait avec faster-whisper (`pip install --break-system-packages faster-whisper`). Vérifier les mots clés dans voice.json (les nombres sont découpés à part).
- Une voix enregistrée (ElevenLabs, studio) : `scripts/voice/align_voice.py` (Whisper, plus lent).

## Format « une vidéo par constante »

- ≈ 1 min – 1 min 20, une notion par scène, barre de progression des notions, **récap rapide** à la fin
  (la voix résume, une fiche se construit ligne par ligne, puces cochées), pas d'appel à commenter.
- **Pas de quiz** (ni annonce « petit test à la fin ») : retiré à la demande du propriétaire, ne plus en proposer.
- **Accroche : ne plus commencer par « C'est quoi… ? »** (demandé : trop de vidéos démarraient pareil). Partir d'une
  situation : le patient a des signes (au mot près, pastilles `CauseChip`), « Qu'est-ce qu'il a ? » déjà à l'écran sur
  l'image 0, révélation (flash rose + secousse), le geste qui l'aurait montré, **puis** « Mais au fait… c'est quoi … ? ».
  Modèle : accroche de `Tension-Arterielle` (« Ton patient a mal à la tête, des vertiges… et ses oreilles bourdonnent.
  Qu'est-ce qu'il a ? Une hypertension : sa tension est trop haute ! Et un simple brassard te l'aurait dit. Mais au
  fait… c'est quoi, la tension artérielle ? »). Les vidéos déjà publiées gardent leur accroche.
  Variante **mini-histoire / enquête** (`Glycemie`) : « Ton patient se lève… et s'effondre. Que s'est-il passé ? »
  (image 0), retour en arrière (bandeau « ◀◀ 30 MIN PLUS TÔT », image bleutée, horloge qui recule, la chute se
  rembobine), indices en pastilles + bulle du patient, « Verdict : hypoglycémie ! » (tampon), le geste qui l'aurait
  évité, puis la question. Rester exact (hypoglycémie = diabétique sous insuline qui n'a pas mangé).
- Récap : **pas de tampon final** (« Pro du souffle », « Pro du pouls » retirés à la demande) — confettis + mascotte suffisent.
- Rester simple et factuel : pas d'astuces « de terrain » mises en scène (retirées de la FR : compter
  discrètement, faire semblant de prendre le pouls). Expliquer chaque qualificatif entre parenthèses
  (ex. ample (profonde, beaucoup d'air), superficielle (peu profonde, peu d'air)).
- Déroulé type : accroche · définition · mesure (geste + astuce) · norme adulte · trop haut · trop bas ·
  « pas que le chiffre » (rythme, amplitude…) · récap rapide · logo.
- Modèles : `Frequence-Cardiaque`, `Frequence-Respiratoire`, `Temperature`, `Tension-Arterielle`, `Glycemie`, `Diurese` (`src/videos/<épisode>/`,
  storyboards dans `docs/lpi/`). Paliers de valeur qui roulent : `steps()` de `temperature/Scenes.tsx`.
- **Dernier modèle = `SpO2`** (`src/videos/spo2/`) : même format, mais avec la dynamique de l'arrêt cardiaque (demandé) :
  accroche-chiffre dès l'image 0 (« 98 %… mais 98 % de quoi ? » + question + promesse courte), tout dans le corps
  (poumons → plongée dans le vaisseau → globules rouges → grille de 100), gros plans par plongée + fondu, `ZoomCam`
  dans chaque scène. Briques `oxygen.tsx` : `SPO_ZONES`, `PulseOx` (pince au doigt : écran, courbe, lumière, vernis,
  doigt froid, ongle bleuté), `Vessel` (globules rouges, hémoglobine chargée d'O₂, alvéole), `HemoGrid` ;
  `Patient` : `lungs`, `cyanosis` ; icône `CyanosisIcon`.

## Format « pathologie » (modèle `AVC`, `src/videos/avc/`)

- ≈ 1 min 25. **Accroche-choc** au lieu de la simple question : un chiffre fort dès la 1re seconde (« Toutes
  les 4 minutes, en France… »), déjà à l'écran sur l'image 0 (miniature TikTok), puis 2 rebondissements visuels
  (le patient fait un AVC, le cerveau perd ses neurones avec un compteur), puis la question + une promesse
  courte (« et comment le reconnaître ? »). Flash rose + secousse uniquement sur les chocs.
- Déroulé : accroche · définition (sigle qui se déplie lettre par lettre) · types · signes (acronyme VITE joué
  par le patient, zoom sur le visage) · conduite à tenir (le 15, l'heure) · traitements · facteurs de risque ·
  récap rapide · logo.
- Briques : `brain.tsx` (cerveau de profil : artères où le sang circule, neurones qui scintillent / s'éteignent,
  zone privée de sang, caillot, hémorragie ; gros plan d'artère `ArteryZoom` : caillot qui bouche, rupture,
  thrombolyse, thrombectomie), `devices.tsx` (téléphone qui compose le 15, horloge murale, écran d'imagerie),
  `Patient` : `droop` (visage paralysé), `armL` / `armR` (bras levés, l'un retombe).
- Équivalent vu en cours, **à l'écran seulement** (pas à la voix) : « VITE = FAST » (Face · Arm · Speech · Time),
  rangée `FastRow` qui s'allume lettre par lettre avec VITE.
- 2e modèle « pathologie / urgence » : `Arret-Cardiaque` (`src/videos/arret-cardiaque/`) — accroche : le tracé ECG
  devient plat et le patient s'effondre (image 0 = moniteur qui bat), 3 minutes pour le cerveau, jauge de survie
  −10 %/minute ; puis définition (FV), reconnaître, alerter, masser, RCP 30/2, DAE. Briques `arrest.tsx` :
  `EcgMonitor` (sinus / FV / plat / choc), `Aed`, `Pad`, `CprHands` + `DepthGauge`, `HeadTilt` (gros plan de profil,
  plein cadre : main sur le front, deux doigts sous le menton) ; `Patient` : `eyesClosed`, `quiver` (cœur qui tremble),
  `brain` (cerveau vu à travers le crâne + carotides), `anoxia`, `bloodless` + `flowPhase` (le sang s'arrête).
  Une définition se montre **dans le corps** (cœur, artères, cerveau du `Patient`), jamais d'organes « dans le vide ».
  Nombres collés (« 100 à 120 ») : les écrire en lettres (`{100|cent} à {120|cent vingt}`).
- 3e modèle « pathologie / urgence » : `Embolie-Pulmonaire` (`src/videos/embolie-pulmonaire/`) — accroche : podium
  « 3e cause de mort cardiovasculaire » (image 0), puis le caillot né dans le mollet remonte jusqu'au poumon, **la caméra
  le suit** (`ZoomCam` avec une fonction `CamFollow` : (frame) → {s, x, y}) ; définition (embolie, phlébite), signes,
  conduite à tenir, traitement (anticoagulants, thrombolyse via `ArteryZoom`), facteurs de risque + prévention.
  Briques `embolism.tsx` : `FullBody` (le `Patient` + jambes, veine profonde, artères pulmonaires, caillot qui suit le
  trajet `clotAt(t)`, zone du poumon privée de sang, mollet gonflé, bas de contention, douleurs), `SemiSitting` (lit
  dont le dossier se relève à 45°), `ChestScan` ; `Patient` : `fade={false}` ; icônes lit, avion, plâtre, bistouri,
  ruban, mollet. Dans une `ZoomCam`, le contenu doit tenir dans la fenêtre à zoom 1 (sinon il n'est jamais montré).
- 4e modèle « pathologie » : `BPCO` (`src/videos/bpco/`) — accroche voulue par le propriétaire : « Et si chaque respiration
  devenait un véritable effort ? » (image 0, homme essoufflé), **compte à rebours 3 · 2 · 1** (la caméra plonge dans le
  thorax à chaque chiffre), « Que se passe-t-il ? C'est la BPCO. » ; sigle sur 4 lignes, bronche en gros plan, cause,
  signes, spirométrie (VEMS / CVF < 70 %), traitement, oxygène (cible 88 – 92 %) + exacerbation, récap.
  Briques `copd.tsx` : `Bronchus` (paroi enflammée, mucus, rétrécissement, alvéoles → emphysème, air qui entre / piégé,
  brume de bronchodilatateur), `Spirometer` + `exhaled()`, `Inhaler` ; `Patient` : `bronchi`, `narrow`, `trapped`,
  `cannula` (lunettes à oxygène) ; icônes poussières, pollution, toux, crachats, soleil levant, seringue, inhalateur.
  Sigle en début de partie : « La {BPCO|B P C O}, c'est la… » (un « B P C O : bronchopneumopathie… » seul a été lu
  avec un accent étranger : détecté par la vérification de langue).

## Format « série » (demandé : un sujet trop long = plusieurs parties, modèle `Plaies-1/2/3`)

- Un sujet riche se découpe en **parties de ≈ 1 min 10 – 1 min 30** (jamais < 1 min) : `src/videos/plaies-1/`, `-2/`,
  `-3/` (« Les plaies » : les bases · les plaies aiguës · les plaies chroniques), storyboard `docs/lpi/storyboard-plaies-serie.md`.
- **Rythme d'apprentissage** (demandé : « on apprend ou on réapprend la notion ») : voix `"rate": "+0%"` (au lieu de +8 %),
  une notion par scène, chaque terme technique suivi tout de suite d'une explication simple (« l'excoriation : c'est une
  éraflure »), le visuel montre ce que dit la phrase, peu de mots par seconde.
- Chaque partie : **accroche propre** (elle doit tenir seule : « 3 jours… ou des mois ? », « Ce petit trou… plus
  dangereux qu'une grande coupure ? », « Cette plaie… ne fait pas mal ») → **annonce de la partie** juste après
  (« Nous voilà dans la partie un de notre série sur les plaies ! ») avec la carte `SeriesParts` (`src/brand/series.tsx` :
  parties vues cochées, partie en cours « ICI », suivantes avec cadenas) → notions → récap + carte `NextUp` « À suivre ·
  partie N » avec une phrase qui donne envie (« … et la brûlure qui ne fait pas mal ») ; dernière partie : « série
  terminée ». Étiquette `SeriesTag` (« LES PLAIES 1/3 ») sur la ligne du sur-titre pendant les notions.
- Briques plaies `wound.tsx` : `SkinBlock` / `SkinAt` + `skinPt` (coupe de peau : épiderme, derme, hypoderme, muscle,
  os ; plaie `shape` éraflure / coupure / déchirure / piqûre / morsure / cratère, `depth` 0 → 5, sutures, microbes,
  saleté, nerfs + douleur, brûlure 0 → 3, cloque, rougeur + doigt qui appuie), `SkinLabels`, `WoundTool` (graviers qui
  frottent, couteau, déchirure, clou, dents, bistouri), `Squeeze` (escarre entre l'os et le matelas, étiquetée),
  `LyingBody` (points d'appui), `LowerLeg` (varices, ulcère, pied diabétique, escarre du talon), `Finger`, pictos de
  gravité ; `StagePill` (pastille dans le socle) exportée par `episode.tsx`. Plaie = rose, nécrose / peau carbonisée =
  bleu nuit (pas de rouge, jaune ni noir). Laisser de la place au-dessus de la peau pour un doigt ou un objet (la caméra
  ne montre rien au-dessus du contenu).
- Voix : « Cette plaie ne fait pas mal » est entendu « Cette **plaine** fait pas mal » → « Cette plaie… ne fait pas mal »
  (une pause casse la liaison) ; relire l'accroche au modèle `medium` de faster-whisper.

## Format « inventaire » (le matériel d'un soin, modèle `Prise-De-Sang`, `src/videos/prise-de-sang/`)

- Demandé : l'accroche pose **tout le matériel devant nos yeux** (plateau en 3 familles numérotées, les 13 objets tombent
  à leur place en 1,5 s, chacun avec son nom), « Ça, c'est le matériel qu'il te faut pour… », « 13 objets ! », « on
  reprend tout, un par un » (les familles s'allument), puis plongée dans la famille 1.
- Ensuite **un objet = un gros plan + une phrase simple** (à quoi il sert, un détail qui fait retenir : « deux pointes :
  une pour la veine, une pour le tube », « dedans, il y a du vide », « jamais recapuchonner ! »), une famille ou deux
  objets par scène, la liste `Checklist` qui se coche sous le socle, compteur « MATÉRIEL n / 13 » (`ItemCounter`) sur
  la ligne du sur-titre ; amusant mais sérieux, rythme d'apprentissage (voix +0 %), ≈ 1 min 25.
- Briques `sampling.tsx` : `VacuNeedle` (2 pointes, manchon, capuchon), `Holder` (porte-tube), `Butterfly` (ailettes qui
  battent), `BloodTube` (bouchon de couleur, sang qui monte, flèches du vide, trait de remplissage), `ShaBottle`, `Hand`
  (gantée ou non), `AntisepticBottle`, `Gauze` (stérile : sachet), `Plaster`, `TourniquetStrap`, `SharpsBox` (aiguille
  qui tombe dedans), `DasriBag`, `Arm` (veine qui gonfle, garrot au-dessus du point de ponction, désinfection, aiguille,
  compresse, pansement). Couleurs : bouchons et collecteur aux couleurs de la marque (pas de jaune ni de violet).

## Format « histoire » (mystérieux, essai `AVC-Histoire`, `src/videos/avc-histoire/`)

- Pour un accident ou une maladie racontés comme une histoire (pas un paramètre, pas un soin) : ≈ 1 min 20, un patient
  prénommé (Michel, 64 ans), **fausse piste** (« juste la fatigue, ça va passer ») puis **révélation**, un « pourquoi »
  qui intrigue (pourquoi d'un seul côté ?), fin courte et émotionnelle. Pas de récap, pas de barre de progression
  (`<Episode progress={false}>`), mascotte discrète sous le cadre (spectatrice qui réagit, `L`/`R` à y 1730, 330 px).
- Accroche = une phrase énigmatique déjà à l'écran sur l'image 0 (« La moitié de son sourire vient de disparaître. »)
  + gros plan, puis retour en arrière (« 07 H 41 · UNE MINUTE AVANT »). Voix un peu plus posée (`"rate": "+2%"`).
- Briques `night.tsx` : `NightBg` (bleu nuit, halo qui respire, grille, poussières), `ScanFrame` (cadre de scanner :
  coins, point rose qui pulse, étiquette lieu · heure), `Glow` (lueur autour des dessins au trait), `NightFlash`,
  `Scramble` (mots qui se mélangent). Une phrase clé à la fois en blanc, mots accentués en rose (`Title accent`).
  Transitions : plongées `zoomInto({…, color: LPI.navy})` en alternance avec `whip`.
- Bulles et pastilles fixes **hors** de la `ZoomCam` (sinon rognées quand la caméra s'approche).

## Recette express (toute nouvelle vidéo)

1. `voix/<n>-<sujet>.script.json` (texte exact, une partie par scène) → `npm run voice -- voix/… <épisode>` (2 min)
   → `npm run check:voice -- <épisode>` (langue + transcription de chaque partie ; `--model medium --parts intro`
   pour un passage douteux).
2. `npm run new -- <épisode> <Composition> <Composant> <n>` : dossier `src/videos/<épisode>/` (timeline, composition
   avec transitions en alternance, scènes et mascotte à remplir) + déclarations (Root.tsx, check-mascot, `render:<épisode>`).
   `npm run cues -- <épisode>` donne les frames de chaque mot (= `at(scène, mot)`) : plus besoin de les calculer.
3. **Corps humain = `Patient`** (`src/brand/patient.tsx`, validé) : patient de face, visage qui cligne (`mood` calme / content /
   mal), calques 0 → 1 (cœur qui bat, artères, brassard gonflé, rougeur, pâleur, sueurs, maux de tête, vertiges) et
   points du corps `patientPoint()` pour poser repères et loupes. Ne plus utiliser l'ancien buste `Chest`.
   Briques prêtes (`src/brand/`) : `episode.tsx` (mise en page `LAY`, `Head`, `Unit`, `Tag`, `BigNum`,
   `CauseChip`, `Stopwatch`, `RecapScene`, `EndCard`, composition `Episode`, places `SPOT`, `runAcross`),
   `cardio.tsx` (battements, ECG, cœur qui bat, onde de pouls), `breath.tsx` (respiration, poumons, thorax,
   tracé respiratoire), `pressure.tsx` (normes PA, manomètre, lecture 120/80 mmHg), `glyco.tsx` (normes glycémie, doigt + autopiqueur,
   lecteur de glycémie en g/l, sucres, cellule « carburant »), `urine.tsx` (normes diurèse, bocal gradué goutte à goutte,
   horloge 24 h, appareil urinaire reins → vessie), `thermo.tsx` (zones de température, thermomètre + °C qui roule, jauge froid ↔ chaud,
   ondes de chaleur, flocons), `body.tsx` (poignet, doigts, pouce), `icons.tsx` (effort, fièvre, stress, douleur,
   anxiété, médicament, sommeil, sportif, œil, sueurs, visage rouge, pâleur, frissons, maux de tête, oreille, vertiges, malaise,
   soif, urines, fatigue, tremblements, faim), `NormScale`, `TermSlam`, `Stage`, kit (`Stamp`, `CheckChip`…), `Pill` (mot = explication : TA = PA, mmHg, g/l) et
   `Lead` (« parfois : », « le patient peut avoir… » avant une liste de signes) dans `episode.tsx`.
   Signes cliniques : pastilles `CauseChip` en 2 colonnes (72 / 560, y 1240 / 1356) et la mascotte reste d'un côté
   (cuts, pas de saut par-dessus) ; les poses en pied (`poses/…`) sont hautes : les placer bas et plus petites.
   Titres : l'accent `*mot*` se met **mot par mot** (`Sur *24* *heures*`, pas `*24 heures*`).
   **Caméra** (demandé) : on s'approche de ce dont parle la voix (visage, cœur, mains, écran du DAE…) avec
   `ZoomCam` + clés `CamKey` (`episode.tsx` : `{at, s, x, y, dur}`, jamais de vide au bord) posé dans le `Stage` ;
   pastilles, chrono, moniteur restent fixes par-dessus ; `camAt(...).view()` fait suivre une étiquette à l'organe.
   Pour changer de point de vue (face → profil) : plonger (zoom ×3) puis fondu enchaîné sur le gros plan.
4. Contrôle : `npm run check:mascot -- <épisode>` → `npm run qa -- <Composition> <frames…>` (images clés + planches
   `out/qa/sheet*.jpg`) → relecture → `npm run render:<épisode>` → `npm run sheet -- out/<vidéo>.mp4` (1 image/s).

## Rendu et contrôle

- Navigateur sans interface et 4 rendus en parallèle réglés dans `remotion.config.ts` : `npm run render:<vidéo>` ou
  `npx remotion render <Comp> …` suffisent. ≈ 3,5 s de calcul par seconde de vidéo (pas de 3D : trop lente).
- Avant tout rendu complet : `npm run check:mascot -- <vidéo>`, puis `npm run qa -- <Composition> <frames…>`,
  planches relues une par une.
- **Retouche d'une vidéo déjà livrée** (demandé) : ne recalculer que les images qui changent puis les recoller.
  Voix : remplacer le mot dans son créneau (nouvelle prise edge-tts du passage, même niveau, sans décaler la suite ;
  garder les fins de partie de voice.json pour ne pas changer la durée) ; `npx remotion render <Comp> seg.mp4
  --frames=<début>-<fin>` pour chaque portion où le texte ou le son change (un élément qui reste affiché jusqu'à la
  fin de sa scène compte jusqu'à la fin de la transition suivante) ; puis `npm run splice -- out/<vidéo>.mp4
  seg.mp4@<début> …` (image + son, durée inchangée, vérifie le nombre d'images).
- **Nouvelle accroche sur une vidéo déjà rendue** (fait pour la TA) : `npm run voice -- voix/<n>-x.script.json <épisode>
  --only intro` refait la voix de cette seule partie (même niveau) ; le reste du son est gardé à l'échantillon près et
  décalé d'un nombre entier d'images N (affiché). Réécrire `Hook` + les étapes de mascotte de l'accroche, puis rendre la
  tête jusqu'à ~15 images après le début de la scène 2 (transition finie, mascotte cachée) : `--frames=0-<début2+15>`,
  et `npm run splice -- out/<vidéo>.mp4 tete.mp4@0:<ancien début2+16>` (la suite de l'ancienne vidéo est gardée ;
  vérifier le raccord : PSNR ≈ 50 dB entre la nouvelle image et l'ancienne). Le léger balancement de la mascotte suit
  l'horloge globale : si elle est visible au raccord (PSNR < 45 dB), couper plus loin, quand elle est hors écran (ex.
  glycémie : après sa sortie au début de « mesure », `tete.mp4@0:92 suite.mp4@92:349`).
- Livrer : **le MP4 seul** dans `out/` (non versionné). Plus de version web ni de couverture (demandé).
  Faire le ménage de `out/` (QA, anciens rendus) pour ne garder que les vidéos finales.
