# Storyboard — « Les 5 constantes » v4 PILOTE (La Petite IDE)

**Vidéo pilote** · 1 min 28 · 1080 × 1920 · même voix IA que la v3 (ElevenLabs, alignée mot à mot).
Composition Remotion : `LPI-Constantes-V4` · code : `src/videos/lpi-constantes-v4/`.
Les réglages de tempo et de physique de cette vidéo sont la **référence** pour les suivantes
(voir [charte-video.md](charte-video.md), « Tempo et physique » et « Mascotte actrice »).

## Retours intégrés (v3 → v4)

- On abandonne la 3D (rendu ≈ 2 h) et on repart du motion design 2D de la v3.
- **Crops de la mascotte** : les bustes sont présentés dans des **cartes-réaction** (tuile arrondie dont
  les bords tombent exactement sur les bords coupés du dessin, la tête dépasse) ; les petits fragments
  laissés par la découpe des planches ont été nettoyés.
- **Mascotte qui bouge sur tout l'écran** : une seule mascotte « actrice » au-dessus des scènes,
  68 étapes calées sur les mots ; elle saute, court, se téléporte sur les termes qui claquent,
  traverse les transitions. Elle alterne de côté avec la fiche (la fiche passe à gauche / à droite).
- **Expressions qui collent aux mots** + métaphores physiques (course sur « trop rapide », saut au
  ralenti sur « trop lente », sauts irréguliers sur « rythme irrégulier », frisson, colère…).
- **Plus de dynamisme** : secousse à l'impact des numéros et des termes, 4 transitions différentes.

## Déroulé

| Timecode | Scène | Mascotte (mot → expression, place) | Transition d'entrée |
|----------|-------|-------------------------------------|---------------------|
| 0:00 – 0:07 | **Accroche** | arrive en courant → *bras ouverts* (plein écran) · « surtout » *important* · « étudiant » *main levée* (en pied) · « mots techniques » *livres* · « absolument » *à retenir* (grande) → saute dans le picto T° | — |
| 0:07 – 0:19 | **1 · Température** (fiche à gauche) | « évalue » *explique* (bas) · « fièvre » *surprise* · **Fébrile** *stressée, souffle court* (sur le terme) · « n'en a pas » *sourire* · **Apyrétique** *bonne réponse, sautille* · « basse » *triste, grelotte* · **Hypothermie** *attention, grelotte* | plongée dans le picto T° (`zoomInto`) |
| 0:19 – 0:31 | **2 · Fréquence cardiaque** (fiche à droite) | « nombre » *stéthoscope* · « trop rapide » **elle traverse l'écran en courant** · **Tachycardie** *surprise* · « trop lente » *fatiguée*, saut au ralenti · « rythme irrégulier » 3 petits sauts irréguliers *questionnement* · **Arythmie** *schéma ECG* | la mascotte court et tire la scène (`runWipe`) |
| 0:31 – 0:43 | **3 · Fréquence respiratoire** (fiche à gauche) | « nombre » *prend des notes* · « trop rapide » *surprise, souffle court* · **Tachypnée** · « trop lente » *fatiguée*, ralenti · « du mal à respirer » *stressée* · **Dyspnée** *attention* | panoramique éclair vers le haut (`whip`), elle s'envole avec |
| 0:43 – 0:59 | **4 · Pression artérielle** (fiche à droite) | « pression » *tensiomètre* (grande) · « paroi » *regardez* · « premier » *1 doigt* · **Systolique** · « cœur » *schéma du cœur* · « deuxième » *2 doigts* · **Diastolique** · « relâche » *grand sourire* · « trop haute » *en colère, tremble* · **Hypertension** · « trop basse » *triste* · **Hypotension** *déçue, s'affaisse* | la mascotte court et tire la scène (`runWipe`) |
| 0:59 – 1:13 | **5 · SpO₂** (fiche à gauche) | « saturation » *astuce* · « SpO2 » *regardez* · **Oxymètre** · « pourcentage » *tablette* · « transporte » *explique* · « chute » *surprise* · **Désaturation** *stressée* · « manque » *problème* · **Hypoxémie** *attention* | panoramique éclair vers la gauche (`whip`) |
| 1:13 – 1:26 | **Récap + appel** | saute par-dessus la vague → *récapitule* · reprend la pose de chaque constante en sautant de place en place · *bravo* + confettis · « Enregistre » *téléphone* · « commentaire » *pose une question* · *au revoir* → repart en courant | vague de marque (`wave`) |
| 1:26 – 1:28 | **Carte de fin** | (elle sort en courant pendant la transition) | plongée (`zoomInto`) |

Les chiffres (39,2 °C, 128 bpm, 165/100…) restent des **exemples** pour illustrer le terme, pas des seuils.

## Fichiers

- `timeline.ts` : timeline voix (même `voice.json` que la v3) ; `abs(scène, mot)` = frame absolue d'un mot.
- `mascot.ts` : tout le jeu de la mascotte (places par leçon, étapes).
- `LpiConstantesV4.tsx` : scènes, transitions, mascotte globale, bruitages.
- `Lessons4.tsx`, `Bookends4.tsx` : scènes v3 sans mascotte intégrée, fiche qui alterne de côté, secousses.
