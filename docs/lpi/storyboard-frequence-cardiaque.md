# Storyboard — « La fréquence cardiaque » (La Petite IDE)

≈ 1 min 09 · 1080 × 1920 · composition Remotion : `Frequence-Cardiaque` · code : `src/videos/frequence-cardiaque/`.
**Format « une vidéo par constante »** : plus court à regarder, plus de temps pour approfondir.
Même DA que Constantes (palette, typo, socle, termes qui claquent, mascotte libre, transitions variées).
Voix de la marque (`scripts/voice/tts_voix.py`, texte exact : [voix/04-frequence-cardiaque.script.json](../../voix/04-frequence-cardiaque.script.json)).

## Parti pris (accrocher sans perdre)

- **Accroche-question** dès la 1re seconde : « C'est quoi, la fréquence cardiaque ? » + promesse
  (« comment la prendre sans te tromper ? »). Pas de quiz (retiré à la demande, à ne plus proposer).
- **Une notion par scène**, un événement visible toutes les 0,5 – 1 s ; barre de progression des 6 notions.
- **Récap rapide** à la fin : la voix résume, une fiche de 6 lignes se construit (bpm, pouls radial, normale,
  tachycardie, bradycardie, rythme + force), chaque ligne se coche quand la suivante arrive.
- Nouveautés d'animation : tracé ECG qui défile (QRS à chaque battement, rythme qui change sans à-coup),
  chronomètre en accéléré (72 battements en 1 min), « bpm » décomposé lettre par lettre, poignet dessiné
  avec artère radiale qui pulse et doigts qui viennent appuyer, onde de pouls « bien frappé » / « filant ».

## Déroulé

| Temps | Partie | À l'écran | Mascotte (mot → image) |
|-------|--------|-----------|------------------------|
| 0:00 | Accroche | « C'est quoi la *fréquence cardiaque* ? », gros cœur qui bat + ECG, « ? » qui surgit · « Comment la prendre ? » · ✓ « Sans te tromper » | questionnement · deux doigts levés · pouce levé → plonge dans le cœur |
| 0:05 | Définition | cœur + « +1 » à chaque battement · chronomètre en accéléré → **72 battements en 1 min** · **B**·**P**·**M** = battements · par · minute | explique · surprise · écrit |
| 0:11 | Mesure | poignet, **pouls radial** (côté pouce, artère qui pulse) · index + majeur qui appuient · « jamais le pouce ! il a son propre pouls » · chronomètre « 1 minute entière » = 72 bpm | montre · regardez · deux doigts · ✗ · prend des notes · OK → traverse en courant |
| 0:23 | Norme adulte | ✓ adulte · ✓ au repos · **60 – 100** battements par minute (chiffres qui s'écrasent) · échelle bradycardie / normale / tachycardie | s'assoit (« repos ») · valide · OK |
| 0:28 | Tachycardie | cœur qui s'emballe, 72 → 128 bpm, socle rose · terme **Tachycardie ≥ 100 bpm** · causes : effort, fièvre, stress, douleur | douleur thoracique · traverse en courant · essoufflée · fièvre · stressée · douleur |
| 0:35 | Bradycardie | cœur lent, 72 → 48 bpm, socle bleu, « ralenti… » · **Bradycardie < 60 bpm** · un sportif · le sommeil · tampon « peut être normal ✓ » | fatiguée (saut au ralenti) · court joyeusement · dort · OK |
| 0:43 | Rythme et force | « 72 » barré d'un trait droit : pas que le chiffre · ECG irrégulier → **Arythmie** · ondes « bien frappé » / « filant » → **Pouls filant** (faible et rapide) | attention · petits sauts irréguliers · montre l'ECG · inquiète · malaise |
| 0:50 | Récap rapide | « Petit récap » : fiche qui se construit — bpm = battements par minute · pouls radial, 2 doigts, 1 minute · 60 – 100 bpm normale (adulte, repos) · tachycardie ≥ 100 · bradycardie < 60 · rythme + force (arythmie, pouls filant) · confettis (pas de tampon) | récapitule · schéma du cœur · deux doigts · valide · douleur thoracique · fatiguée · ECG · bravo + confettis → repart en courant |
| 1:07 | Fin | logo | — |

Transitions (jamais deux fois la même d'affilée) : plongée dans le cœur · panoramique gauche · rideau tiré
par la mascotte · panoramique haut · vague · panoramique gauche · rideau · plongée vers le logo.
