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

## Mascotte (`src/brand/Mascot.tsx`, fichiers `public/brand/mascotte/`)

Uniquement les illustrations officielles (détourées et agrandies, jamais redessinées, jamais
retournées en miroir, car le badge « IDE » serait inversé).

- Expressions (bustes) : `joyeuse`, `reflechit`, `surprise`, `stressee`, `confiante`, `fatiguee`, `determinee`.
- Poses (en pied) : `explique`, `notes`, `revise`, `soins`, `conseil`, `celebre`, `face`.
- Placement : sur le côté, en bas, ou **derrière une carte** (elle dépasse du bord). Jamais au
  centre par défaut, et pas dans chaque scène.
- Elle réagit à la narration : `poses={[[at('temp','elle'), 'reflechit'], [at('temp','fièvre'), 'surprise']]}`.
- Liseré blanc cassé « sticker » + ombre douce, flottement très léger.

### Mascotte v2 (`src/brand/Mascot2.tsx`, fichiers `public/brand/mascotte-v2/`)

Planches fournies en v3 : `assets/planches/v2-*.webp` (originaux), découpe reproductible avec
`scripts/brand/export_all.py` (crops dans `scripts/brand/planche-v2-*.crops.json`). Index visuel
de tous les fichiers : `docs/lpi/mascotte-v2-index.webp`.

| Dossier | Clés |
|---------|------|
| `maitre/` (en pied, 6 vues) | face, trois-quarts-gauche, profil-gauche, dos, profil-droit, trois-quarts-droit |
| `expressions/` (bustes) | neutre, sourire-leger, grand-sourire, joyeuse, surprise, questionnement, reflechit, triste, decue, stressee, en-colere, fatiguee, eureka, clin-doeil |
| `gestes/` | bonjour, au-revoir, regardez, attention, astuce, important, erreur, bonne-reponse, ok, facile, probleme, bravo, chut, facepalm |
| `situations/` | explique, montre-schema, lit-document, prend-notes, cherche-info, idee, corrige-erreur, valide, encourage, a-retenir, pose-question, donne-conseil, recapitule, felicite |
| `poses/` (en pied) | debout, marche, course, assise, accroupie, bras-croises, main-levee, bras-ouverts |
| `accessoires/` | stethoscope, seringue, tensiometre, tablette, ordinateur, fiches, clipboard, telephone, livres, schema-ecg, stethoscope-seul, baskets |
| `elements/` | coeur-rose, coeur-bleu, etincelle, bulle, question, exclamation, sticker-lpi |

- Bustes : toujours avec `bubble` (la mascotte **surgit d'une pastille** bleu clair, le bord plat
  du buste reste caché). À chaque geste, l'ancienne pose replonge et la nouvelle ressort.
  `<Mascot2 poses={[[at('fc','nombre'), 'accessoires/stethoscope'], [at('fc','tachycardie'), 'expressions/surprise']]} x={862} y={1340} height={420} bubble={150} />`
- Poses en pied : sans `bubble`, ancrées par les pieds.
- Un geste qui illustre le mot : *tensiomètre* pour la pression, *en colère* pour « trop haute »,
  *fatiguée* pour « trop lent », *pose une question* pour l'appel au commentaire.

## Animation (`src/brand/ui.tsx`, `src/brand/motion.tsx`)

- Apparition : fondu + glissement 20–40 px + scale 0,97 → 1 (`<Enter>`), ressort amorti.
- Micro-rebond seulement pour les éléments « vivants » (mascotte, chiffres, pastilles).
- Mot à mot pour les titres, avec le pinceau rose qui se dessine sous le mot clé.
- Pas de zoom permanent, pas d'effet lumineux. Secousse **uniquement à l'impact** (numéro de partie,
  terme qui claque) depuis la v4 — voir « Tempo et physique ».
- Chaque animation est déclenchée par **un mot de la voix**.

## Transitions

Cercle qui dévoile la scène suivante, bordé d'un anneau bleu clair, en 0,4 s, à partir de
l'élément dont on va parler (ex. le picto T° de l'intro vers la scène Température).
En v3 : **vague de marque** (`wave()` dans `src/brand/motion3.tsx`) — flash bleu puis bleu clair
puis dévoilement, 14 frames, depuis l'endroit où l'action de la scène suivante démarre.

**v4 (pilote) — jamais deux fois la même transition d'affilée** (`src/brand/motion4.tsx`), toujours
14 frames, et **la mascotte participe** (elle est au-dessus des scènes) :

| Transition | Effet | La mascotte… |
|------------|-------|--------------|
| `zoomInto({x, y})` | on plonge dans un élément (×8), puis la scène suivante s'ouvre depuis lui | saute DANS le picto juste avant |
| `runWipe()` | rideau incliné (bandes bleu + bleu clair) qui traverse de gauche à droite | court devant le rideau et « tire » la scène suivante |
| `whip('up' \| 'left')` | panoramique éclair avec flou de bougé directionnel | s'envole / file avec le mouvement |
| `wave({x, y})` | vague de marque (v3) | saute vers sa place de la scène suivante par-dessus la vague |

## Motion v3 « moderne » (`src/brand/motion3.tsx`, `src/brand/Lesson3.tsx`)

Validé pour la v3 de test (plus animé, plus visuel) — toujours dans la palette, sans effet lumineux :

| Brique | Rôle |
|--------|------|
| `Lesson3` | gabarit complet d'une notion : numéro, titre 2 lignes, définition, socle, termes, mascotte, caméra |
| `ChapterSlam` | gros numéro qui s'écrase au centre (éclats) puis file dans le coin du titre |
| `TermSlam` | le terme « claque » en grand au centre (lettre par lettre), sa définition glisse, puis la carte file à sa place dans la fiche |
| `Camera` | dérive très lente + petit coup de zoom (≈ 5 %) sur chaque mot clé |
| `Stage` | socle bleu clair qui ondule ; `layers` = remplissage rose / bleu clair qui monte comme un liquide (jamais de mélange de teintes) |
| `Odometer` | chiffres qui roulent (format français, virgule) |
| `StatePill` | pastille d'état avec les mots du script (« trop rapide », « pas de fièvre »…) |
| `Burst`, `Confetti`, `TapRipple` | éclats, confettis (1 fois, au récap), « tap » sur le bouton Enregistrer |
| `LiveBackground` | blanc cassé + grille de points qui défile + 4 éléments de la planche en bordure |

## Tempo et physique — RÉFÉRENCE (vidéo pilote v4)

Validé sur la vidéo pilote `LPI-Constantes-V4` : ce sont les réglages à reprendre tels quels pour
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

## Mascotte actrice (v4, `src/brand/MascotActor.tsx`)

Une seule mascotte **globale** (au-dessus des scènes, frames absolues) pilotée par une liste
d'étapes `Beat` : `{at: abs('fc', 'tachycardie'), key: 'expressions/surprise', via: 'pop', fx: 'pant', x, y, size}`.
Exemple complet : `src/videos/lpi-constantes-v4/mascot.ts`. Contrôle : `npm run check:mascot`.

- **Bustes = cartes-réaction** (`ReactionCard`) : tuile arrondie dont les bords coïncident avec les
  bords coupés du dessin (fini les épaules / mains coupées net) ; la tête dépasse en haut. Fond selon
  l'humeur (déduite de la clé) : rose = alerte, bleu clair = positif, pâle = neutre.
  Les fragments parasites des découpes ont été retirés (`scripts/brand/clean_strays.py`).
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

| Le script dit… | Clé mascotte |
|----------------|--------------|
| accueil, « Les 5… » | `poses/bras-ouverts` (arrivée en courant) |
| « surtout », « important », « deuxième » | `gestes/important` (deux doigts levés) |
| « premier », un conseil | `situations/donne-conseil` (un doigt levé) |
| « étudiant » | `poses/main-levee` |
| « mots techniques », vocabulaire | `accessoires/livres` |
| « absolument », « à retenir » | `situations/a-retenir` |
| définition, « évalue », « transporte » | `situations/explique` |
| mesure au stéthoscope (pouls, battements) | `accessoires/stethoscope` |
| compter, noter | `situations/prend-notes` |
| pression, tension | `accessoires/tensiometre` |
| cœur (schéma) | `situations/montre-schema` ; rythme cardiaque → `accessoires/schema-ecg` |
| pourcentage, données | `accessoires/tablette` |
| « regarde », un appareil à l'écran | `gestes/regardez` |
| « Et cinq » (dernier point), astuce | `gestes/astuce` |
| ça monte, « trop rapide », « chute » (surprise) | `expressions/surprise` |
| fièvre, « mal à respirer », manque | `expressions/stressee` / `gestes/probleme` |
| « trop lent », bradycardie / bradypnée | `expressions/fatiguee` |
| « trop basse », froid | `expressions/triste` ; hypotension → `expressions/decue` |
| « trop haute », hypertension | `expressions/en-colere` |
| se relâche, détente | `expressions/grand-sourire` |
| normal, « pas de fièvre », ✓ | `gestes/bonne-reponse` / `expressions/sourire-leger` |
| alerte, terme « danger » (hypothermie, dyspnée, hypoxémie) | `gestes/attention` |
| « Récapitulons » | `situations/recapitule` ; fin du récap → `gestes/bravo` |
| « Enregistre » | `accessoires/telephone` ; « commentaire » → `situations/pose-question` ; fin → `gestes/au-revoir` |

Mêmes familles de mots = mêmes expressions d'une partie à l'autre (« tachy- » = surprise,
« brady- » = fatiguée) : la répétition aide à mémoriser.

## Contrôle qualité (à chaque vidéo)

1. `npm run check:mascot` : aucun chevauchement d'étapes, temps de pose suffisants.
2. Images clés : `OUT=out/stills node scripts/qa/stills.mjs 10 30 60 …` (un instant par mot clé),
   puis `python3 scripts/qa/contact_sheet.py out/stills` et relecture planche par planche :
   rien de masqué, pas de coupe visible, expressions justes.
3. Rendu complet, puis version web (`ffmpeg -crf 26`) et couverture.

## Gabarit « fiche » (`src/brand/LessonLayout.tsx`, `src/brand/learn.tsx`)

Chaque notion = numéro + titre + définition + illustration + **termes techniques** :
`<TermCard at={at('fc','tachycardie')} term="Tachycardie" meaning="le cœur bat trop vite" sign="up" />`.
Le terme apparaît quand il est prononcé, s'allume tant qu'il est courant puis reste affiché
(la fiche de révision se construit à l'écran). Signes : ↑ trop haut (rose), ↓ trop bas (bleu clair),
✓, rythme irrégulier, alerte, contraction / relâchement, appareil, manque.

## Accroche

Chaque vidéo commence par une promesse claire en 1 phrase (« Les 5 constantes à ne surtout pas
oublier… ») + un aperçu de ce qu'on va apprendre (ex. « + 16 termes techniques »).

## Marque

- Carte de fin : logo principal (≈ 2,5 s). Pas de filigrane pendant la vidéo.

## Son

- Voix : -15 LUFS. Voix maquette = `scripts/voice/tts_maquette.py` (à remplacer par la vraie voix
  via `scripts/voice/prepare_voice.py`, même format de synchro).
- Pas de musique dans le fichier exporté : elle est ajoutée sur TikTok / Instagram.
  (`scripts/make-music.py` reste disponible pour YouTube si besoin.)
- Bruitages très discrets calés sur l'action (pop à chaque terme, souffle de transition, battements).

## Anatomie 3D (`src/anatomy3d/`, modèles `public/anatomy3d/`)

> **En pause** : le rendu 3D est trop long (≈ 2 h pour 1 min de vidéo sans carte graphique). On reste
> sur le motion design 2D (v3 → v4). Le code et les modèles restent disponibles pour plus tard.

Direction testée : **vrais modèles anatomiques** (BodyParts3D, données ouvertes)
rendus en 3D avec Three.js, fond bleu nuit, et le rouge est autorisé pour le sang et les organes
(la charte reste valable pour les textes, cartes, mascotte et décors).

| Système | Rendu |
|---------|-------|
| Peau | verre bleuté, liseré lumineux (fresnel) ; teinte rose = fièvre, bleue = froid |
| Squelette | ivoire translucide, discret |
| Cœur | myocarde rouge verni, coronaires rouge vif, veines cardiaques bleues ; il bat (contraction) |
| Artères | rouge sang, onde de pouls lumineuse qui part du cœur à chaque battement, sang qui défile |
| Veines | bleu profond, sang qui remonte vers le cœur |
| Poumons | verre rose, arbre bronchique blanc bleuté visible à l'intérieur ; ils respirent |
| Gros plans | intérieur du vaisseau : globules rouges biconcaves + molécules d'O₂ |

- Un plan = un sujet isolé (les autres systèmes s'effacent) ; la caméra voyage d'un organe à l'autre.
- Rendu : `npx remotion render <Composition> --gl=angle --timeout=300000` (WebGL sans carte graphique).
- **Crédit obligatoire** dans la description : voir `public/anatomy3d/CREDITS.md`.
- Régénérer les modèles : `python3 scripts/anatomy3d/build_glb.py <dossier_bp3d> public/anatomy3d`.

## Nouvelle vidéo : recette

1. Écrire le script validé dans `voix/<n>-<sujet>.tts.json` (une entrée par scène) : accroche,
   puis pour chaque notion une définition courte et ses termes techniques, puis récap + appel.
2. `python3 scripts/voice/tts_maquette.py voix/<…>.tts.json <episode>` → voix + `voice.json`.
3. Copier `src/videos/lpi-constantes-v4/` comme modèle (pilote) : gabarit `Lesson3` avec `slotSide`
   qui alterne et `shake`, une scène = un composant, animations via `at(scène, mot)`.
   Voix IA déjà propre : `scripts/voice/align_voice.py`.
4. Écrire `mascot.ts` (une étape par mot clé, lexique ci-dessus) et choisir les transitions
   (jamais deux fois la même d'affilée).
5. Contrôle qualité (ci-dessus), puis `npx remotion render <Composition> out/<fichier>.mp4`.
