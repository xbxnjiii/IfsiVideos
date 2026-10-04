# Vidéo — Les 5 constantes à connaître

**Objectif :** à la fin, l'étudiant connaît la température, la fréquence cardiaque, la fréquence
respiratoire, la pression artérielle et la SpO₂, et sait à quoi elles servent.
Volontairement simple : **pas de valeurs « normales »** (elles dépendent de l'âge, du contexte
clinique et des recommandations utilisées). Les chiffres affichés (36,7 °C, 72 bpm, 16/min,
120/80, 98 %) sont de simples exemples.

## Texte à enregistrer

Un seul fichier suffit. Les blancs sont coupés automatiquement, inutile de les éviter.

| Partie | Texte |
|--------|-------|
| Intro | « Tu es étudiant infirmier ? Voici les 5 constantes que tu dois absolument connaître. » |
| 1 — Température | « Première constante : la température. Elle permet notamment d'évaluer l'état thermique du patient et de rechercher une éventuelle fièvre ou hypothermie. » |
| 2 — FC | « Deuxième constante : la fréquence cardiaque. Elle correspond au nombre de battements du cœur par minute. » |
| 3 — FR | « Troisième constante : la fréquence respiratoire. Elle correspond au nombre de respirations effectuées par minute. » |
| 4 — PA | « Quatrième constante : la pression artérielle. Elle mesure la pression exercée par le sang sur la paroi des artères. » |
| 5 — SpO₂ | « Et enfin, la saturation en oxygène, ou SpO₂. Elle indique le pourcentage d'hémoglobine qui transporte de l'oxygène dans le sang. » |
| Conclusion | « Alors, retiens bien : température, fréquence cardiaque, fréquence respiratoire, pression artérielle et SpO₂. » |

**Important pour la synchro :** garder les mots d'attaque de chaque partie (« Première »,
« deuxième », « troisième », « quatrième », « Et enfin », « Alors »). C'est sur eux que les
transitions se calent automatiquement. Les animations, elles, suivent les mots-clés
(« fièvre », « hypothermie », « battements », « paroi », « SpO₂ », « hémoglobine »…).

## Notes sur la voix test (homme)

- La fin de la phrase SpO₂ était coupée dans l'enregistrement (« …dans le » puis silence) :
  la phrase s'arrête donc proprement sur « …de l'oxygène. ».
- La voix test dit « Et enfin, **le plus important**, c'est la saturation… » : à éviter dans la
  version finale, aucune constante n'est « plus importante » que les autres.

## Régénérer la vidéo avec une nouvelle voix

```bash
python3 scripts/voice/prepare_voice.py ENREGISTREMENT.m4a constantes \
  --sections "Première,deuxième,troisième,quatrième,Et,Alors" \
  --prompt "Tu es étudiant infirmier ? constantes vitales, température, fièvre, hypothermie, fréquence cardiaque, fréquence respiratoire, pression artérielle, saturation en oxygène, SpO2, hémoglobine."
python3 scripts/make-music.py public/music/constantes.mp3 61 --duck public/voix/constantes/voix.wav --duck-delay 0.2667
npm run render:constantes
```

## Légende de post suggérée

> Les 5 constantes à connaître absolument en IFSI 🩺 T°, FC, FR, PA, SpO₂ : tu sais à quoi elles
> servent ? Enregistre pour tes révisions ! #ifsi #etudiantinfirmier #esi #constantes
> #soinsinfirmiers #infirmiere #fyp
