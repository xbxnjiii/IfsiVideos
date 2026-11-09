# Storyboard — « Comment mettre un suppositoire ? » (format court info + humour)

Composition `Suppositoire` · dossier `src/videos/suppositoire/` · briques `src/brand/suppo.tsx` · script
`voix/29-suppositoire.script.json` · ≈ 40 s · sans barre de progression · **1re vidéo avec la voix ElevenLabs « Laura »**.

## Faits (vérifiés)

- Le « côté plat d'abord » vient d'**une seule petite étude** : Abd-el-Maeboud et al., *The Lancet*, 1991. Elle n'a
  jamais été confirmée.
- Les fabricants disent **la pointe d'abord**. C'est la seule méthode approuvée et celle utilisée dans les essais
  (revue Bradshaw & Price, 2007).
- Quelques notices disent l'inverse. D'où les formulations **« on suit la notice »** et **« la plupart disent : par la
  pointe »** (et non « toujours la pointe »).
- Position : décubitus latéral gauche, jambe du dessus pliée. Pour faciliter l'introduction : un peu d'eau sur la
  pointe. On pousse doucement, juste après le sphincter, puis on serre les fesses quelques minutes.

## Déroulé

| Scène | Voix | Image |
|---|---|---|
| `intro` « le match » | Le suppositoire : côté pointu… ou côté plat ? Sur internet, c'est la guerre ! | Image 0 : écran coupé en diagonale, ÉQUIPE POINTE (bleu clair) **VS** ÉQUIPE PLAT (rose), le suppositoire au centre et « Côté pointu… ou côté plat ? ». Il se retourne au mot, avec un flou de mouvement. Sur « internet », 5 commentaires pleuvent et le match s'efface ; le dernier est « Lisez la notice, bon sang ! ». Sur « guerre » : éclat, flash et secousse. |
| `mythe` | L'équipe côté plat jure qu'il remonte tout seul. Sauf que… une seule petite étude de 1991… jamais confirmée. C'est une idée reçue ! | Bulle « Il remonte tout seul ! » ; le suppositoire part côté plat devant et remonte avec des éclats « magiques ». « 1 seule petite étude » : le document rapetisse sur « petite », puis 1991. Tampon JAMAIS CONFIRMÉE. Grand tampon IDÉE REÇUE ! et « côté plat d'abord » barré. |
| `verite` | Alors, on fait quoi ? On suit la notice. Et la plupart disent : par la pointe. Un suppositoire, c'est comme une fusée : la pointe devant ! | Le suppositoire hésite en tournant sur lui-même, avec un gros « ? ». La notice se déplie et « insérer par la pointe » se surligne. Pastilles « la plupart disent : » / « par la pointe ! ». Il se redresse, prend des ailerons et une flamme, puis décolle à droite : flou de mouvement et fumée. |
| `geste` | Mains lavées, gants. Le patient sur le côté gauche, la jambe du dessus pliée. Un peu d'eau sur la pointe, on pousse doucement, juste après le sphincter… et on serre les fesses quelques minutes. | 5 cartes numérotées qui arrivent au mot, les précédentes s'estompent : gant · patient sur le côté gauche, la jambe qui se plie · goutte d'eau sur la pointe · le suppositoire passe le sphincter (« le muscle qui ferme l'anus ») · fesses qui se serrent. |
| `fin` | Et voilà : décollage réussi ! | « Et voilà ! », la fusée traverse l'écran, tampon DÉCOLLAGE RÉUSSI ! et confettis. |

Transitions : plongée → panoramique gauche → vague → **panoramique vers le haut** (la fusée) → plongée vers le logo.

## Mascotte

- Accroche : perplexe sur le match, tablette sur « internet », choc sur « guerre ».
- Idée reçue : sceptique, loupe sur « étude », erreur sur « jamais », corrige l'erreur sur « idée reçue ».
- Notice : lit la notice, bonne réponse sur « pointe », montre la fusée. Pendant cette scène elle est à gauche, car la
  fusée décolle à droite.
- Geste : gênée sur « on pousse », clin d'œil sur « fesses ».
- Fin : youpi au décollage.

## Voix Laura (ElevenLabs)

- Voix `Laura` (`MmafIMKg28Wr0yMh8CEB`), modèle `eleven_v4`. Tout le texte part en **une seule génération**, avec des
  balises de jeu : `[amused]`, `[sarcastic]`, `[confident]`, `[warmly]`, `[excited]`. Les `[pause]` séparent les
  parties. L'année est écrite en lettres.
- Alignement mot à mot :
  `python3 scripts/voice/align_voice.py laura.mp3 voix/29-suppositoire.script.json suppositoire --model medium`.
  Le script ne sert qu'à donner l'orthographe et les parties. La mascotte et les animations se calent seules via `at()`.
- Contrôle : `npm run check:voice -- suppositoire --model medium` donne les 5 parties en « fr », mot pour mot.
