# Storyboard — « Les 5 constantes » (refonte La Petite IDE)

Version de test n°1 · 63 s · 1080 × 1920 · voix **maquette** (synthèse, voix féminine « Denise »).

Même contenu, même ordre et mêmes intentions que la première version : seule la direction
artistique change. Les timecodes servent de repères pour vos retours scène par scène.

## Étapes 1 & 2 — Analyse de la vidéo existante

| # | Scène | Objectif pédagogique | Ce qui fonctionnait (conservé) |
|---|-------|---------------------|--------------------------------|
| 0 | Intro | Accrocher l'étudiant, annoncer les 5 constantes | Question d'accroche, apparition successive des 5 constantes, transition depuis la 1re |
| 1 | Température | État thermique, repérer fièvre / hypothermie | Thermomètre qui monte (39,2 °C) puis descend (35,0 °C), mots-clés |
| 2 | Fréquence cardiaque | = battements du cœur par minute | Cœur qui bat, compteur 70 → 72 bpm calé sur les battements, tracé symbolique |
| 3 | Fréquence respiratoire | = respirations par minute | Inspiration / expiration, « 16 / min » |
| 4 | Pression artérielle | = pression du sang sur la paroi des artères | Chaîne cœur → sang → artères, coupe d'artère, 120/80 systolique/diastolique |
| 5 | SpO₂ | = % d'hémoglobine qui transporte l'O₂ | Saturomètre 98 %, trajet poumons → globules rouges → cœur → corps |
| 6 | Conclusion | Mémoriser les 5 constantes | Liste récapitulative, « À retenir pour l'IFSI » |

Pas de valeurs « normales » (choix validé) : 36,7 °C, 72 bpm, 16/min, 120/80 et 98 % sont des exemples.

## Étapes 3 & 4 — Réinterprétation avec la nouvelle identité

| Timecode | Scène | Mascotte (planche officielle) | Ce qu'on regarde → ce qu'on comprend |
|----------|-------|-------------------------------|---------------------------------------|
| 0:00 – 0:07 | **Intro** | *Donne un conseil* (doigt levé) | Question « Tu es étudiant infirmier ? » → titre « Les 5 constantes » → carte des 5 pictos (T°, FC, FR, PA, SpO₂) → chip « à connaître en IFSI ». Transition : cercle qui part du picto T°. |
| 0:07 – 0:17 | **1 · Température** | *Réfléchit* → *Surprise* sur « fièvre », derrière la carte | Thermomètre + valeur 36,7 → 39,2 °C (rose, flamme) → 35,0 °C (bleu clair, flocon). Chips : État thermique · Fièvre · Hypothermie. |
| 0:17 – 0:24 | **2 · Fréquence cardiaque** | *Explique* (baguette pointée vers la carte) | Cœur qui bat à 72 bpm + tracé symbolique, compteur 70 → 72 bpm, chip « Battements / minute ». |
| 0:24 – 0:33 | **3 · Fréquence respiratoire** | *Prend des notes* (on compte la FR) | Poumons qui se gonflent, sélecteur Inspiration / Expiration, « 16 / min », chip « Respirations / minute ». |
| 0:33 – 0:41 | **4 · Pression artérielle** | *Déterminée* (réaction) | Chaîne Cœur → Sang → Artères, artère en coupe (le sang pousse sur la **paroi**), 120 / 80 mmHg, chips systolique / diastolique. |
| 0:41 – 0:50 | **5 · SpO₂** | — (scène déjà riche) | Saturomètre 98 %, titre qui devient « SpO₂ » quand la voix le dit, trajet Poumons → Globules rouges → Cœur → Corps, chip « 98 % de l'hémoglobine transporte de l'O₂ ». |
| 0:50 – 0:59 | **Conclusion** | *Vue de face* → *Célèbre* à la fin | Liste des 5 constantes, chaque ligne s'allume quand elle est nommée, puis « À retenir pour l'IFSI ». |
| 0:59 – 1:03 | **Carte de fin** | (logo) | Logo principal La Petite IDE « Les soins, simplement. » |

En permanence : filigrane (logo icône + « La Petite IDE ») en haut à gauche, progression
1 → 5 en haut à droite, sous-titres mot à mot en bas (mot prononcé en bleu).

## Synchronisation

Chaque animation est déclenchée par un mot de la voix (`at('temp', 'fièvre')`…). Le jour où la
vraie voix est enregistrée, on relance le script de préparation et **toute la vidéo se recale**.

## Points ouverts pour vos retours

- Sous-titres : à garder ? (utiles sans le son, mais ajoutent du texte à l'écran)
- Musique de fond douce : à garder, ou son tendance ajouté dans l'appli ?
- Mascotte absente de la scène SpO₂ (choix de lisibilité) : ok ?
- Durée des respirations entre les parties (0,85 s) et débit de la voix maquette.
