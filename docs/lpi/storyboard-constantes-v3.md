# Storyboard — « Les 5 constantes » v3 (La Petite IDE)

**Version de test n°3** · 1 min 28 · 1080 × 1920 · voix **IA** (ElevenLabs « Chloé — Warm Friendly »),
alignée mot à mot avec `scripts/voice/align_voice.py`. Composition Remotion : `LPI-Constantes-V3`.

## Retours intégrés (v2 → v3)

- Nouvelles planches mascotte (expressions, gestes, situations, poses, accessoires) détourées et
  rangées dans `public/brand/mascotte-v2/` (index visuel : [mascotte-v2-index.webp](mascotte-v2-index.webp)).
- **Plus animé, plus visuel** : chaque mot technique « claque » en grand au centre puis file se
  ranger dans la fiche, la caméra accuse le coup, les chiffres roulent comme un compteur, le socle
  de l'illustration se remplit en rose (« trop haut ») ou en bleu clair (« trop bas ») comme un liquide.
- Chaque partie s'ouvre sur son **gros numéro** qui s'écrase au centre puis file dans le coin.
- Transition de marque : **vague bleue** qui part de l'endroit où l'action va commencer.
- La mascotte **surgit d'une pastille** (effet sticker pop-out) et change de geste à chaque terme.
- Toujours : fond blanc cassé, pas de musique, pas de sous-titres, pas de filigrane, pas de pastille
  « à connaître en IFSI ».

## Déroulé

| Timecode | Scène | Ce qui se passe à l'écran | Mascotte (planche v2) |
|----------|-------|---------------------------|-----------------------|
| 0:00 – 0:07 | **Accroche** | Gros « 5 » qui s'écrase (éclats, anneau qui tourne) puis file dans le titre « 5 constantes » · « à ne *surtout* pas oublier » · « quand tu es étudiant infirmier » · les 5 pictos · 2 bandeaux de termes qui défilent · compteur « + 16 termes techniques » | Bonjour → Important → À retenir |
| 0:07 – 0:19 | **1 · Température** | Thermomètre + compteur : 36,7 → 39,2 °C (ondes de chaleur, socle rose) → 36,8 °C (✓) → 35,0 °C (flocons, socle bleu clair) | Explique → Surprise → OK → Attention |
| | | **Fébrile** · **Apyrétique** · **Hypothermie** | |
| 0:19 – 0:31 | **2 · Fréquence cardiaque** | Cœur qui bat + tracé avec point lumineux, compteur 72 → 128 → 45 bpm → rythme irrégulier | Stéthoscope → Surprise → Fatiguée → Questionnement |
| | | **Tachycardie** · **Bradycardie** · **Arythmie** | |
| 0:31 – 0:43 | **3 · Fréquence respiratoire** | Poumons + particules d'air dans la trachée, 16 → 28 → 8 / min, puis « ! » qui tremble | Donne un conseil → Stressée → Fatiguée → Attention |
| | | **Tachypnée** · **Bradypnée** · **Dyspnée** | |
| 0:43 – 0:59 | **4 · Pression artérielle** | Artère en coupe, manomètre dont l'aiguille bat entre les 2 chiffres, PAS / PAD qui roulent : 120/80 → 165/100 → 85/50 | Tensiomètre → Important → Facile → En colère (« sous pression ») → Déçue |
| | | **Systolique (PAS)** · **Diastolique (PAD)** · **Hypertension** · **Hypotension** | |
| 0:59 – 1:13 | **5 · SpO₂** | Oxymètre sur le doigt 98 % → 86 %, globules rouges qui circulent et perdent leur O₂ | Cherche l'info → Regardez → Surprise → Problème |
| | | **Oxymètre de pouls** · **Désaturation** · **Hypoxémie** | |
| 1:13 – 1:26 | **Récap + appel** | Les 5 lignes arrivent une à une (balayage, ✓), confettis, bouton « Enregistre » tapé (le signet devient rose), bulle « … » puis « Quel mot tu ne connaissais pas ? » qui s'écrit | Récapitule → Bravo → Bonne réponse → Pose une question |
| 1:26 – 1:28 | **Carte de fin** | Logo principal qui rebondit + éclats | — |

Les chiffres (39,2 °C, 128 bpm, 165/100…) restent des **exemples** pour illustrer le terme, pas des seuils.

## Synchronisation

Chaque animation est déclenchée par un mot de la voix (`at('pa', 'systolique')`…).
Pour une nouvelle voix : `python3 scripts/voice/align_voice.py VOIX.mp3 voix/02-constantes-v3.script.json lpi-constantes-v3`
puis rendu ; toute la vidéo se recale.
