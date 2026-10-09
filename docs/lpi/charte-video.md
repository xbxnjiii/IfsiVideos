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
- Pas de zoom permanent, pas de particules, pas de secousse, pas d'effet lumineux.
- Chaque animation est déclenchée par **un mot de la voix**.

## Transitions

Cercle qui dévoile la scène suivante, bordé d'un anneau bleu clair, en 0,4 s, à partir de
l'élément dont on va parler (ex. le picto T° de l'intro vers la scène Température).
En v3 : **vague de marque** (`wave()` dans `src/brand/motion3.tsx`) — flash bleu puis bleu clair
puis dévoilement, 14 frames, depuis l'endroit où l'action de la scène suivante démarre.

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

Direction validée après les tests : **vrais modèles anatomiques** (BodyParts3D, données ouvertes)
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
3. Copier `src/videos/lpi-constantes-v3/` comme modèle (gabarit `Lesson3`), une scène = un composant,
   animations via `at(scène, mot)`. Voix IA déjà propre : `scripts/voice/align_voice.py`.
4. `npx remotion render <Composition> out/<fichier>.mp4`.
