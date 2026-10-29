# Storyboard — « Les 7 constantes » v7 (La Petite IDE)

≈ 1 min 40 · 1080 × 1920 · composition Remotion : `Constantes` · code : `src/videos/constantes/`.
Même tempo et même physique que la vidéo pilote v4 (retirée du dépôt, voir l'historique git).

> **Voix** : le texte exact est dans [voix/02-constantes.script.json](../../voix/02-constantes.script.json).
> Tant que la voix ElevenLabs (Chloé, mêmes réglages que la v3) n'est pas fournie, la vidéo utilise une
> voix provisoire (`scripts/voice/tts_provisoire.py`). Quand le MP3 arrive :
> `python3 scripts/voice/align_voice.py VOIX.mp3 voix/02-constantes.script.json constantes`, puis rendu.

## Ce qui change (v6 → v7)

- **7 constantes** au lieu de 5 : la glycémie et la diurèse deviennent les parties 6 et 7, avec voix,
  illustration animée, termes qui claquent et échelle des normes (la fiche bonus sans voix disparaît).
- **Accroche raccourcie** : « Les 7 constantes, avec les mots techniques ! » (plus de « à ne surtout pas
  oublier quand tu es étudiant infirmier », plus de « que tu dois absolument connaître ») ; 7 pictos,
  « + 26 termes techniques ».
- **Fébricule dite à l'oral** (« Une petite fièvre, c'est une fébricule. ») et carte de terme.
- **Zone normale = « normale »** sur les échelles FC, FR, PA, SpO₂ (normocardie, eupnée, normotension,
  normoxie retirées, du récap aussi).
- **Récap à 7 lignes** (glycémie et diurèse comprises), **sans** « Enregistre pour tes révisions » ni
  « Quel mot tu ne connaissais pas ? » ; la mascotte fête la fin (bravo + confettis) puis repart en courant.

## Déroulé (mascotte)

| Partie | Échelle adulte (zones) | Mascotte (mot → image) |
|--------|------------------------|------------------------|
| Accroche | — | court → présente · « mots techniques » révise → plonge dans le picto T° |
| 1 · Température | hypothermie < 35 · apyrétique 36,5 – 37,5 · fébricule 37,5 – 37,9 · hyperthermie ≥ 38 °C · + voies de mesure | explique · « fièvre » fièvre · **Fébrile** sous la couverture · « petite » clin d'œil · **Fébricule** coup de chaud · neutre · **Apyrétique** valide ✓ · « basse » froid · **Hypothermie** grelotte |
| 2 · Fréquence cardiaque | bradycardie < 60 · normale 60 – 100 · tachycardie ≥ 100 bpm | schéma du cœur · « trop rapide » traverse en courant · **Tachycardie** douleur thoracique · « trop lente » fatiguée (ralenti) · rythme irrégulier (3 sauts) · **Arythmie** ECG |
| 3 · Fréquence respiratoire | bradypnée < 12 · normale 12 – 20 · tachypnée > 20 cycles/min | schéma des poumons · « trop rapide » essoufflée · **Tachypnée** · « trop lente » s'endort · « du mal à respirer » oppression · **Dyspnée** attention |
| 4 · Pression artérielle | hypotension < 90/60 · normale ≈ 120/80 · hypertension > 140/90 mmHg | tensiomètre · « paroi » regardez · **Systolique** ↑ · « cœur » schéma · **Diastolique** ↓ · « relâche » OK · « trop haute » colère · **HTA** mal de tête · « trop basse » étourdie · **Hypotension** vertige |
| 5 · SpO₂ | hypoxémie < 90 · désaturation 90 – 95 · normale > 95 à 100 % · cible BPCO 88 – 92 % | astuce · regardez · **Oxymètre** loupe · « pourcentage » tablette · explique · « chute » ↓ · **Désaturation** inquiète · « manque » malaise · **Hypoxémie** attention |
| 6 · Glycémie | hypoglycémie < 0,70 · normoglycémie 0,70 – 1,10 · hyperglycémie > 1,10 g/l | explique · « sang » montre · « doigt » lancette (le doigt perle) · **Lecteur de glycémie** loupe (bandelette, 0,95 g/l) · « trop de sucre » surprise (pluie de sucres) · **Hyperglycémie** épuisée · « pas assez » étourdie · **Hypoglycémie** malaise (tremble) |
| 7 · Diurèse | anurie < 100 · oligurie < 400 · normodiurèse 600 – 2000 · polyurie > 2500 à 3000 ml/24 h | explique · « 24 heures » prend des notes (horloge 24 h) · « pas assez » inquiète · **Oligurie** ↓ · « presque plus » problème · **Anurie** attention · « beaucoup trop » file aux toilettes en courant · **Polyurie** toilettes |
| Récap | — | récapitule · une pose par constante (fièvre, cœur, poumons, tensiomètre, loupe, lancette, toilettes) · bravo + confettis → repart en courant |

Transitions (jamais deux fois la même d'affilée) : plongée dans le picto T° · rideau tiré par la mascotte
(→ FC, PA, glycémie) · panoramique éclair vers le haut (→ FR, diurèse) · panoramique vers la gauche
(→ SpO₂) · vague (→ récap) · plongée vers le logo.
