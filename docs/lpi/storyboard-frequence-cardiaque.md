# Storyboard — « La fréquence cardiaque » (La Petite IDE)

≈ 1 min 11 · 1080 × 1920 · composition Remotion : `Frequence-Cardiaque` · code : `src/videos/frequence-cardiaque/`.
**Format « une vidéo par constante »** : plus court à regarder, plus de temps pour approfondir.
Même DA que Constantes (palette, typo, socle, termes qui claquent, mascotte libre, transitions variées).
Voix de la marque (`scripts/voice/tts_voix.py`, texte exact : [voix/04-frequence-cardiaque.script.json](../../voix/04-frequence-cardiaque.script.json)).

## Parti pris (accrocher sans perdre)

- **Accroche-question** dès la 1re seconde : « C'est quoi, la fréquence cardiaque ? » + promesse
  (« comment la prendre sans te tromper ») + **boucle ouverte** : « petit test à la fin ! ».
- **Une notion par scène**, un événement visible toutes les 0,5 – 1 s ; barre de progression des 7 notions.
- **Quiz final** avec 3 réponses, compte à rebours 3-2-1 (pause de 2,2 s dans la voix), réponse + confettis.
- Nouveautés d'animation : tracé ECG qui défile (QRS à chaque battement, rythme qui change sans à-coup),
  chronomètre en accéléré (72 battements en 1 min), « bpm » décomposé lettre par lettre, poignet dessiné
  avec artère radiale qui pulse et doigts qui viennent appuyer, onde de pouls « bien frappé » / « filant ».

## Déroulé

| Temps | Partie | À l'écran | Mascotte (mot → image) |
|-------|--------|-----------|------------------------|
| 0:00 | Accroche | « C'est quoi la *fréquence cardiaque* ? », gros cœur qui bat + ECG, « ? » qui surgit · « Comment la prendre ? » · ✓ « Sans te tromper » · ruban « Petit test à la fin ! » | questionnement · deux doigts levés · ✗ · clin d'œil → plonge dans le cœur |
| 0:07 | Définition | cœur + « +1 » à chaque battement · chronomètre en accéléré → **72 battements en 1 min** · **B**·**P**·**M** = battements · par · minute | explique · surprise · écrit |
| 0:14 | Mesure | poignet, **pouls radial** (côté pouce, artère qui pulse) · index + majeur qui appuient · « jamais le pouce ! il a son propre pouls » · chronomètre « 1 minute entière » = 72 bpm | montre · regardez · deux doigts · ✗ · prend des notes · OK → traverse en courant |
| 0:25 | Norme adulte | ✓ adulte · ✓ au repos · **60 – 100** battements par minute (chiffres qui s'écrasent) · échelle bradycardie / normale / tachycardie | s'assoit (« repos ») · valide · OK |
| 0:30 | Tachycardie | cœur qui s'emballe, 72 → 128 bpm, socle rose · terme **Tachycardie ≥ 100 bpm** · causes : effort, fièvre, stress, douleur | douleur thoracique · traverse en courant · essoufflée · fièvre · stressée · douleur |
| 0:38 | Bradycardie | cœur lent, 72 → 48 bpm, socle bleu, « ralenti… » · **Bradycardie < 60 bpm** · un sportif · le sommeil · tampon « peut être normal ✓ » | fatiguée (saut au ralenti) · court joyeusement · dort · OK |
| 0:45 | Rythme et force | « 72 » barré : pas que le chiffre · ECG irrégulier → **Arythmie** · ondes « bien frappé » / « filant » → **Pouls filant** (faible et rapide) | attention · petits sauts irréguliers · montre l'ECG · inquiète · malaise |
| 0:53 | Quiz | tampon « Petit test ! » · patient au repos + moniteur 120 bpm · A Bradycardie / B Normale / C Tachycardie · 3-2-1 · **C** + confettis · « > 100 bpm au repos » | question · réfléchit · pensive · bonne réponse |
| 1:03 | Récap | ✓ Fréquence 60 – 100 bpm · ✓ Rythme régulier ? · ✓ Force bien frappé ou filant · tampon « Pro du pouls ! » | checklist · bravo + confettis → repart en courant |
| 1:08 | Fin | logo | — |

Transitions (jamais deux fois la même d'affilée) : plongée dans le cœur · panoramique gauche · rideau tiré
par la mascotte · panoramique haut · vague · panoramique gauche · rideau · vague · plongée vers le logo.
