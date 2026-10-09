# Charte vidéo — La Petite IDE

Référence graphique de toutes les vidéos de la marque. Tout est codé dans `src/brand/` :
une nouvelle vidéo réutilise ces briques telles quelles.

## Couleurs (`src/brand/theme.ts`)

| Rôle | Couleur | Usage |
|------|---------|-------|
| Principal | `#4E7AC7` | mot important, chiffres clés, éléments actifs, progression |
| Bleu clair | `#C5D8F4` | formes de fond, bordures de cartes, pastilles, poumons, parois |
| Fond | `#F8F9FC` | fond général, surfaces des cartes |
| Rose | `#EAA7C1` | coup de pinceau sous le mot clé, émotion, cœur, sang, fièvre |
| Bleu nuit | `#2D3A5A` | textes, contours des pictogrammes |

Aucune autre couleur. Seules exceptions : la mascotte et les logos officiels (fichiers fournis).
Ombres et voiles = ces mêmes couleurs en transparence.

## Typographie

| Niveau | Police | Taille type |
|--------|--------|-------------|
| Sur-titre (« CONSTANTE 1/5 ») | Inter 700, capitales espacées, bleu | 28 px |
| Titre | Nunito Sans 900, bleu nuit, **mot clé en bleu + pinceau rose** | 92–100 px |
| Sous-titre / info | Inter 600 | 36–40 px |
| Chiffre clé | Nunito Sans 900 + unité en bleu | 128–150 px |
| Terme technique (carte) | Nunito Sans 900 + définition Inter 600 | 46 px / 29 px |

## Grille 1080 × 1920

- Marges latérales 72 px · texte aligné à gauche.
- y 170 : progression (une pastille par partie), centrée.
- y 236 : numéro de partie + sur-titre, titre (1 ligne si possible), définition courte (1 ligne).
- puis la carte d'illustration (≈ 330 px) qui réagit à chaque terme.
- puis les cartes « termes techniques » (650 px de large) avec la mascotte à droite.
- Rien d'important sous 1480 px ni contre le bord droit (interface TikTok/Reels).
- Pas de filigrane, pas de sous-titres incrustés (choix validé en phase de test).

## Hiérarchie à l'écran

1. **Ce qu'on regarde** : la carte principale (illustration ou chiffre).
2. **Ce qu'on comprend** : titre + pastilles de mots-clés.
3. **Ce qui accompagne** : mascotte, formes de fond.

## Mascotte (images `public/brand/mascotte/`, index `docs/lpi/mascotte-index.webp`)

Uniquement les illustrations officielles : jamais redessinées, **jamais retournées en miroir**
(le badge « IDE » serait inversé).

**Planches v3 (octobre 2026)** : `assets/planches/v3-{expressions,symptomes,situations,poses}.webp`, déjà
détourées. Découpe reproductible : `scripts/brand/upscale_rgba.py` (×4), puis `scripts/brand/cut_v3.py`
(points d'ancrage par personnage dans `scripts/brand/planches-v3.json`), puis `scripts/brand/export_v3.py`
(remplace les anciennes images, supprime celles qui sont remplacées, régénère manifeste + index).
Nouveau dossier `symptomes/` (40 : fièvre, froid, grelotte, essoufflée, vertige, malaise, nausée…).

Planches v2 : `assets/planches/v2-*.webp` (originaux), découpe reproductible avec
`scripts/brand/export_all.py` (crops dans `scripts/brand/planche-v2-*.crops.json`). Index visuel
de tous les fichiers : `docs/lpi/mascotte-index.webp`.

| Dossier | Clés |
|---------|------|
| `maitre/` | dos, face, profil, trois-quarts-1, trois-quarts-2, trois-quarts-3 |
| `poses/` | accroupie, assise-sol, assise, bras-croises, bras-ouverts, course-joie, course, debout, lit-assise, main-levee, mains-hanches, marche, montre, presente, sac-a-dos |
| `expressions/` | alerte, cache-visage, clin-doeil, coeur-mains, ecrit, en-colere, eureka, fatiguee, genee, inquiete, joyeuse, loupe, neutre, ok, pouce, questionnement, reflechit, stressee, surprise, triste, youpi |
| `symptomes/` | baille, cernes, coup-de-chaud, crampes, dort-oreiller, dort, douleur-poitrine, douleur, epuisee, essoufflee, eternue, etourdie, fievre-couverture, fievre-glace, fievre, froid, frotte-yeux, grelotte, lasse, mal-de-tete-2, mal-de-tete, mal-dents, mal-dos, mal-gorge, mal-nuque, mal-oreille, mal-ventre, malaise, masque, migraine, mouche, nausee-vertige, nausee, oppression, souffle, toilettes, toux-main, toux, vertige, vomit |
| `gestes/` | astuce, attention, au-revoir, baisse, bonjour, bonne-reponse, bras-ouverts, bravo, chut, erreur, facepalm, facile, hausse, important, montre-haut, motivee, ok, presente, probleme, question, regardez |
| `situations/` | a-retenir, checklist, cherche-info, corrige-erreur, donne-conseil, encourage, etudie, explique, idee, lit-cours, lit-document, medicament, montre-digestif, montre-document, montre-ecg, montre-poumons, montre-schema, pensive, pose-question, pouce, prend-notes, question-tablette, recapitule, reflexion, revise, schema, stylo, tablette, travaille, valide |
| `accessoires/` | baskets, clipboard, fiches, livres, seringue, stethoscope-seul, stethoscope, tablette-stylo, tablette, telephone, tensiometre |
| `elements/` | bulle, coeur-bleu, coeur-rose, etincelle, exclamation, question, sticker-lpi |

## Animation (`src/brand/ui.tsx`, `src/brand/motion3.tsx`)

- Apparition : fondu + glissement 20–40 px + scale 0,97 → 1 (`<Enter>`), ressort amorti.
- Micro-rebond seulement pour les éléments « vivants » (mascotte, chiffres, pastilles).
- Mot à mot pour les titres, avec le pinceau rose qui se dessine sous le mot clé.
- Pas de zoom permanent, pas d'effet lumineux. Secousse **uniquement à l'impact** (numéro de partie,
  terme qui claque) depuis la v4 — voir « Tempo et physique ».
- Chaque animation est déclenchée par **un mot de la voix**.

## Transitions

**Vague de marque** (`wave()` dans `src/brand/motion3.tsx`) — flash bleu puis bleu clair
puis dévoilement, 14 frames, depuis l'endroit où l'action de la scène suivante démarre.

**v4 (pilote) — jamais deux fois la même transition d'affilée** (`src/brand/motion4.tsx`), toujours
14 frames, et **la mascotte participe** (elle est au-dessus des scènes) :

| Transition | Effet | La mascotte… |
|------------|-------|--------------|
| `zoomInto({x, y})` | on plonge dans un élément (×8), puis la scène suivante s'ouvre depuis lui | saute DANS le picto juste avant |
| `runWipe()` | rideau incliné (bandes bleu + bleu clair) qui traverse de gauche à droite | court devant le rideau et « tire » la scène suivante |
| `whip('up' \| 'left')` | panoramique éclair avec flou de bougé directionnel | s'envole / file avec le mouvement |
| `wave({x, y})` | vague de marque (v3) | saute vers sa place de la scène suivante par-dessus la vague |

## Briques de motion (`src/brand/motion3.tsx`, `src/brand/Lesson3.tsx`)

Toujours dans la palette, sans effet lumineux :

| Brique | Rôle |
|--------|------|
| `Lesson3` | gabarit complet d'une notion : numéro, titre 2 lignes, définition, socle, termes, repère adulte, caméra |
| `ChapterSlam` | gros numéro qui s'écrase au centre (éclats) puis file dans le coin du titre |
| `TermSlam` | le terme « claque » en grand au centre (lettre par lettre), sa définition glisse, puis la carte file à sa place dans la fiche |
| `Camera` | dérive très lente + petit coup de zoom (≈ 5 %) sur chaque mot clé |
| `Stage` | socle bleu clair qui ondule ; `layers` = remplissage rose / bleu clair qui monte comme un liquide (jamais de mélange de teintes) |
| `Odometer` | chiffres qui roulent (format français, virgule) |
| `StatePill` | pastille d'état avec les mots du script (« trop rapide », « pas de fièvre »…) |
| `Burst`, `Confetti`, `TapRipple` | éclats, confettis (1 fois, au récap), « tap » sur le bouton Enregistrer |
| `LiveBackground` | blanc cassé + grille de points qui défile + 4 éléments de la planche en bordure |

## Tempo et physique — RÉFÉRENCE (vidéo pilote v4)

Validé sur la vidéo pilote (v4, regénérée en v5 : composition `Constantes`) : ce sont les réglages à reprendre tels quels pour
toutes les prochaines vidéos (30 fps, voix d'abord : **chaque mouvement est déclenché par un mot**).

### Tempo

| Règle | Valeur |
|-------|--------|
| Avance des animations sur le mot | 3 frames (0,1 s) — `at(scène, mot)` |
| Densité | **un événement visible toutes les 0,5 à 1 s** ; jamais plus de ~2 s sans changement (hors respiration de la mascotte) |
| Transition entre parties | 14 frames (0,47 s), démarre 0,25 s avant que la voix attaque la partie |
| Terme qui claque | pop au mot, reste 24 frames (0,8 s) au centre, file dans la fiche en 14 frames |
| Mascotte | change de place ou d'expression ~1 fois par seconde (68 étapes pour 88 s) ; tient une pose ≥ 10 frames |
| Numéro de partie | s'écrase au mot (« Un : »), file dans le coin en 15 frames |

### Physique

| Mouvement | Réglage (code) |
|-----------|----------------|
| Pop (apparition) | ressort `damping 9–10, stiffness 200–230, mass 0,6–0,7` → dépassement ≈ 12 % ; rotation −14° → 0 |
| Disparition | anticipation +8 % (2 frames) puis rétrécit en 4 frames |
| Saut | 12–20 frames (10 + distance/60), **centré sur le mot** ; accroupie 3 frames avant (−10 %) ; arc 60 + 0,35 × distance (max 240 px) ; étirement en l'air +12 % / −7 % ; rotation ±12° dans le sens du saut |
| Atterrissage, changement d'expression | écrasement amorti `0,11 · e^(−t/4,5) · cos(0,85 t)` |
| Course | pose « course », vitesse constante, petits rebonds 18 px ; ombre au sol qui rétrécit en l'air |
| Repos (jamais immobile) | respiration ±1,5 % (≈ 3 s), flottement ±5 px, oscillation ±1,5° |
| Coup de caméra | +5 % de zoom, montée 4 frames, retombée `e^(−t/8)` |
| Secousse d'impact | 9 px, amortie `e^(−t/3,5)` sur 14 frames (numéro + chaque terme) |
| Sorties / transitions | rapides, accélérées (cubique), jamais de fondu lent |

### Métaphores physiques (la mascotte « joue » le mot)

| Mot | Elle… | `fx` / déplacement |
|-----|-------|--------------------|
| trop rapide (tachy-) | traverse l'écran en courant, puis souffle court | `run` + `fx: 'pant'` |
| trop lent (brady-) | saut au ralenti, à ras du sol | `dur: 34, arc: 50` + `fx: 'slow'` |
| rythme irrégulier | 3 petits sauts de durées différentes | `dur: 8 / 10 / 7` |
| froid, hypothermie | grelotte | `fx: 'shiver'` |
| trop haute (pression), colère | tremble de colère | `fx: 'shake'` |
| hypotension, « basse » | s'affaisse lentement vers le bas | `dur: 22, arc: 12` |
| bravo, apyrétique (✓) | sautille de joie | `fx: 'bounce'` |

## Mascotte actrice (`src/brand/MascotActor.tsx`)

Une seule mascotte **globale** (au-dessus des scènes, frames absolues) pilotée par une liste
d'étapes `Beat` : `{at: abs('fc', 'tachycardie'), key: 'expressions/surprise', via: 'pop', fx: 'pant', x, y, size}`.
Exemple complet : `src/videos/constantes/mascot.ts`. Contrôle : `npm run check:mascot -- <vidéo>`.

- **Bustes LIBRES, sans cadre** (`<MascotActor busts="free">`, composant `FreeBust`) : détourés,
  liseré blanc « sticker », le bas coupé du buste s'estompe en fondu. Jamais de carré autour.
  (`ReactionCard`, la carte-réaction de la v4, reste disponible mais n'est plus utilisée.)
- **Poses en pied** libres (pieds au sol, ombre) : course, bras ouverts, main levée… Elles regardent
  toutes vers la droite : **on ne retourne jamais l'image**, donc elle court toujours de gauche à droite.
- **Jamais au même endroit** : elle utilise tout l'écran. Places d'une leçon (côté opposé à la fiche,
  qui alterne gauche / droite d'une partie à l'autre) :

| Place | Où | Quand |
|-------|----|-------|
| `home` | à côté de la fiche (290 px) | définition, transitions entre termes |
| `low` | en grand sous la fiche (410 px) | moments forts, métaphores lentes |
| `top` | sur le coin haut-droit du terme qui claque (205 px) | au mot technique — **seulement si la définition est courte** |
| `bottom` | accrochée sous le coin du terme, côté libre (215 px) | au mot technique |
| plein écran | poses en pied 700 px (accroche, fin) | arrivée en courant, « étudiant » (main levée) |

- Elle **ne masque jamais** : titre, définition, fiche, chiffres / lectures du socle (ex. l'écran de
  l'oxymètre), boutons d'appel. Passer par-dessus pendant un saut (< 0,5 s) est accepté.
- `via` : `pop` pour rejoindre un terme qui claque (synchro parfaite avec le pop du terme), `hop` pour
  se déplacer, `run` pour traverser, `cut` pour changer d'expression sur place.

### Lexique « mot → expression » (à réutiliser)

| Le script dit… | Clé mascotte (v5) |
|----------------|-------------------|
| accueil, « Les 5… » | `poses/course` → `poses/presente` (arrivée en courant) |
| « surtout », alerte | `expressions/alerte` |
| « étudiant » | `poses/sac-a-dos` (monte du bas de l'écran) |
| « mots techniques », réviser | `situations/revise` |
| « absolument », « à retenir » | `situations/a-retenir` |
| définition, « évalue », « transporte » | `situations/explique` |
| cœur, battements | `situations/montre-schema` ; rythme → `situations/montre-ecg` |
| respiration, poumons | `situations/montre-poumons` |
| fièvre | `symptomes/fievre` ; fébrile → `symptomes/fievre-couverture` |
| pas de fièvre, normal, ✓ | `expressions/neutre` puis `situations/valide` |
| froid, « trop basse » (T°), hypothermie | `symptomes/froid`, `symptomes/grelotte` |
| « trop rapide » (cœur) | elle traverse en courant, puis `symptomes/douleur-poitrine` |
| « trop rapide » (respiration) | `symptomes/essoufflee`, `symptomes/souffle` |
| « trop lent » | `expressions/fatiguee` ; respiration lente → `symptomes/dort` |
| rythme irrégulier | `expressions/questionnement` (3 petits sauts) |
| « du mal à respirer » | `symptomes/oppression` |
| pression, tension | `accessoires/tensiometre` ; « paroi » → `gestes/regardez` |
| 1er chiffre / 2e chiffre | `gestes/hausse` (↑) / `gestes/baisse` (↓) |
| se relâche | `expressions/ok` |
| « trop haute », hypertension | `expressions/en-colere`, `symptomes/mal-de-tete-2` |
| « trop basse » (PA), hypotension | `symptomes/etourdie`, `symptomes/vertige` (s'affaisse) |
| dernier point, astuce | `gestes/astuce` |
| un appareil, mesurer | `expressions/loupe` |
| pourcentage, données | `accessoires/tablette` |
| « chute » | `gestes/baisse` ; désaturation → `expressions/inquiete` |
| manque (d'oxygène) | `symptomes/malaise` |
| terme « danger » (dyspnée, hypoxémie) | `gestes/attention` |
| « Récapitulons » | `situations/recapitule` ; puis la pose de chaque constante ; fin → `gestes/bravo` |
| « Enregistre » | `situations/lit-cours` ; « commentaire » → `situations/pose-question` ; fin → `poses/main-levee` |

Mêmes familles de mots = mêmes expressions d'une partie à l'autre (« tachy- » = surprise,
« brady- » = fatiguée) : la répétition aide à mémoriser.

## Repères adultes (v5)

Les valeurs de référence de l'adulte sont **visibles mais discrètes** :

- un petit bandeau `NormRibbon` (« ADULTE · normale 36,5 – 37,5 °C ») à cheval sur le bas de
  l'illustration : prop `norm` de `Lesson3` ; il apparaît avec la définition ;
- le **seuil** de chaque terme dans sa carte, en bleu gras (`<Seuil>&gt; 38 °C</Seuil>`).

Valeurs utilisées (adulte, repères usuels en IFSI ; les protocoles locaux peuvent différer) :

| Constante | Normale | Seuils des termes |
|-----------|---------|-------------------|
| Température | 36,5 – 37,5 °C | fébrile > 38 °C · apyrétique < 38 °C · hypothermie < 35 °C |
| Fréquence cardiaque | 60 – 100 bpm | tachycardie > 100 · bradycardie < 60 |
| Fréquence respiratoire | 12 – 20 / min | tachypnée > 20 · bradypnée < 12 |
| Pression artérielle | ≈ 120/80 mmHg | HTA ≥ 140/90 · hypotension PAS < 90 |
| SpO₂ | 95 – 100 % | désaturation < 95 % |

Les chiffres animés à l'écran (39,2 °C, 128 bpm…) restent des exemples et doivent être cohérents
avec ces seuils (ex. l'hypothermie s'affiche sous 35 °C).

## Contrôle qualité (à chaque vidéo)

1. `npm run check:mascot` : aucun chevauchement d'étapes, temps de pose suffisants.
2. Images clés : `COMP=<Composition> OUT=out/stills node scripts/qa/stills.mjs 10 30 60 …` (un instant par mot clé),
   puis `python3 scripts/qa/contact_sheet.py out/stills` et relecture planche par planche :
   rien de masqué, pas de coupe visible, expressions justes.
3. Rendu complet, puis version web (`ffmpeg -crf 26`) et couverture.

## Accroche

Chaque vidéo commence par une promesse claire en 1 phrase (« Les 5 constantes à ne surtout pas
oublier… ») + un aperçu de ce qu'on va apprendre (ex. « + 16 termes techniques »).

## Marque

- Carte de fin : logo principal (≈ 2,5 s). Pas de filigrane pendant la vidéo.

## Son

- Voix : -15 LUFS. Voix IA déjà propre (ElevenLabs…) : `scripts/voice/align_voice.py` ; vraie voix
  enregistrée (blancs à couper, bruit) : `scripts/voice/prepare_voice.py`. Même format de synchro.
- Pas de musique dans le fichier exporté : elle est ajoutée sur TikTok / Instagram.
- Bruitages très discrets calés sur l'action (pop à chaque terme, souffle de transition, battements).

## Nouvelle vidéo : recette

1. Écrire le texte EXACT dit par la voix dans `voix/<n>-<sujet>.script.json` (une entrée par partie,
   sans les balises d'émotion [excited]…).
2. `python3 scripts/voice/align_voice.py VOIX.mp3 voix/<n>-<sujet>.script.json <dossier>` →
   `public/voix/<dossier>/voix.wav` + `src/videos/<dossier>/voice.json`.
3. Copier la vidéo la plus proche comme modèle : `src/videos/constantes/` (notions + termes techniques,
   gabarit `Lesson3`) ; une scène = un composant, animations via `at(scène, mot)`.
4. Écrire `mascot.ts` (une étape par mot clé, lexique ci-dessus) et choisir les transitions
   (jamais deux fois la même d'affilée).
5. Contrôle qualité (ci-dessus), puis `npx remotion render <Composition> out/<fichier>.mp4`.
