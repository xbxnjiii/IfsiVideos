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
| Marque (filigrane) | Fredoka 700 | 36 px |
| Sous-titres | Inter 700, mot prononcé en bleu | 40 px |

## Grille 1080 × 1920

- Marges latérales 72 px · texte aligné à gauche.
- y 150 : filigrane (logo icône + « La Petite IDE ») à gauche, progression à droite.
- y 300 : sur-titre, puis titre (1 à 2 lignes).
- y 560–1130 : carte principale (l'information).
- y 1150–1390 : chiffre clé, pastilles, mascotte.
- y 1408 : sous-titres. Rien d'important sous 1480 px ni contre le bord droit (interface TikTok/Reels).

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

## Animation (`src/brand/ui.tsx`, `src/brand/motion.tsx`)

- Apparition : fondu + glissement 20–40 px + scale 0,97 → 1 (`<Enter>`), ressort amorti.
- Micro-rebond seulement pour les éléments « vivants » (mascotte, chiffres, pastilles).
- Mot à mot pour les titres, avec le pinceau rose qui se dessine sous le mot clé.
- Pas de zoom permanent, pas de particules, pas de secousse, pas d'effet lumineux.
- Chaque animation est déclenchée par **un mot de la voix**.

## Transitions

Cercle qui dévoile la scène suivante, bordé d'un anneau bleu clair, en 0,6 s, à partir de
l'élément dont on va parler (ex. le picto T° de l'intro vers la scène Température).

## Marque

- Filigrane permanent : logo icône + « La Petite IDE ».
- Carte de fin : logo principal (≈ 3 s).

## Son

- Voix : -15 LUFS. Voix maquette = `scripts/voice/tts_maquette.py` (à remplacer par la vraie voix
  via `scripts/voice/prepare_voice.py`, même format de synchro).
- Musique douce composée en code, baissée automatiquement sous la voix (`scripts/make-music.py`).
- Bruitages très discrets (pop, souffle de transition, battement cardiaque).

## Nouvelle vidéo : recette

1. Écrire le script validé dans `voix/<n>-<sujet>.tts.json` (une entrée par scène).
2. `python3 scripts/voice/tts_maquette.py voix/<…>.tts.json <episode>` → voix + `voice.json`.
3. Copier `src/videos/lpi-constantes/` comme modèle, une scène = un composant, animations via `at(scène, mot)`.
4. `python3 scripts/make-music.py public/music/<episode>.mp3 <durée> --duck public/voix/<episode>/voix.wav`.
5. `npx remotion render <Composition> out/<fichier>.mp4`.
