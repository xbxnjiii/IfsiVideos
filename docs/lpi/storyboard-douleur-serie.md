# Storyboard — série « La douleur : échelles d'évaluation » v2 (2 parties, ≈ 1 min 37 chacune)

**v2 (demandée : accroches plus prenantes, voix Laura, nouvelles animations).** La v1 (voix edge-tts, accroches
« question au spectateur » et « patient muet ») reste dans l'historique git (commit `bcf0f1d`).

- Look 2026 (kit `src/brand/bold.tsx`) : un aplat de couleur par scène (bleu clair, rose, bleu), une idée par plan en très
  grand, vrai flou de mouvement ; en haut pendant les notions, le chapitre en cours (à gauche) et « LA DOULEUR 1/2 » (à
  droite), sans barre de progression.
- Briques : `src/brand/pain.tsx` (+ `Carer` : soignant dans un rond ; `PainBars` : échelle numérique en barres ;
  `ObsRow` : ligne d'une grille d'observation en plein cadre), `Patient` (`elder`, `woman` : dame âgée à permanente).
- Voix Laura, une seule prise par partie (≈ 1 700 – 1 800 crédits), blancs entre les parties allongés à 0,8 s.

## Accroche partie 1 — « trois soignants, trois avis » (choisie par le propriétaire)

« Pour l'un, il a un peu mal. Pour l'autre, il exagère. Pour le troisième, ça va très bien. Et lui ? Personne ne lui a
demandé ! Pourtant, sa douleur, il est le seul à la sentir. Alors, comment la mesurer ? »
Image 0 : le patient et « Il a mal à combien ? ». Les trois avis claquent par-dessus lui et le cachent ; « Et lui ? » : ils
s'envolent ; tampon « Personne ne lui a demandé ! » (flash, secousse) ; ondes de douleur roses autour de lui, sa bulle
« ? / 10 ». Rappel dans le principe : les trois soignants reviennent et sont barrés quand il donne lui-même sa note.
Ensuite : échelle numérique en barres (0 → 10, la mascotte pose la question, il répond « 6 ! »), réglette EVA plein cadre,
EVS en 5 grandes pastilles, visages en deux rangées (l'enfant montre le sien), « Dès 4 sur 10 » (chiffre géant) puis
4 cartes (soulager, réévaluer 6 → 2, même échelle, noter), récap + « à suivre ».

## Accroche partie 2 — « elle ne se plaint jamais » (choisie par le propriétaire)

« Madame Martin, quatre-vingt-sept ans, ne parle presque plus. Elle ne se plaint jamais : pas un mot, pas un cri. Donc,
elle n'a pas mal ? Faux ! Regarde mieux : son visage se crispe, sa main protège sa hanche… Sa douleur ne se dit pas : elle
se voit. »
Image 0 : Madame Martin et « Elle ne se plaint jamais » ; sa bulle reste vide puis se barre ; tampon FAUX ! ; on
s'approche, étiquettes « son visage se crispe », « elle protège sa hanche ». Elle revient dans Algoplus (grille oui / non
plein cadre : visage oui, corps oui → 2 / 5, « on la soulage ») et à la fin du récap : « Et Madame Martin ? Elle est enfin
soulagée » + carte « série terminée ». Doloplus : horloge qui tourne, 3 cartes, barre 8 / 30 ; BPS : patient intubé
endormi relié au respirateur, étiquettes visage · bras · respirateur ; EVENDOL : l'enfant joue chaque signe, grille en
points 5 / 15.

---

# v1 (pour mémoire)

# Storyboard — série « La douleur : échelles d'évaluation » (2 parties, ≈ 1 min 35 chacune)

Format « série » (modèle `Plaies-1/2/3`) : accroche propre à chaque partie, carte `SeriesParts` (« Il peut répondre » ·
« Il ne répond pas »), étiquette `SeriesTag` « LA DOULEUR 1/2 », récap + carte `NextUp`. Voix : accroche +4 %, notions +0 %
(rythme d'apprentissage). Briques : `src/brand/pain.tsx` + `Patient` (`elder` : personne âgée, cheveux blancs, rides).
Accroches choisies avec le propriétaire : « patient muet » (partie 2, son choix) ; « question au spectateur » (partie 1,
l'autre proposition, qui colle à l'auto-évaluation).

## Partie 1 — l'auto-évaluation (`Douleur-1`, voix `voix/24-douleur-1.script.json`)

| Scène | Voix (résumé) | À l'écran |
| --- | --- | --- |
| Accroche | « De zéro à dix… tu as mal à combien, là, maintenant ? Tu as un chiffre en tête ? Bravo : tu viens d'évaluer ta douleur ! Mais à l'hôpital, il existe plusieurs échelles. Laquelle choisir ? » | Image 0 : « Tu as mal à combien ? » + échelle 0 → 10 + bulle de pensée « ? » ; le 0 puis le 10 s'allument ; le doigt hésite au-dessus des cases ; « 4 ! » (case entourée) ; tampon ÉVALUÉE ; hôpital ; 4 cartes (chiffres, réglette, mots, visages) ; « Laquelle choisir ? » |
| Série | partie un · quand le patient peut te répondre | carte des 2 parties (partie 1 « ICI », partie 2 cadenas) |
| Principe | c'est le patient qui ressent la douleur : s'il peut s'exprimer, c'est lui qui l'évalue (auto-évaluation) ; on le croit, toujours | patient qui a mal (éclairs), gros plan, bulle « J'ai mal : 6 / 10 », terme « Auto-évaluation », tampon « On le croit, toujours » |
| Échelle numérique (EN) | de 0 à 10, à combien avez-vous mal ? 0 = aucune douleur, 10 = la pire douleur imaginable | bulle du soignant, échelle 0 → 10 case par case, étiquettes des bouts, réponse « 6 » |
| EVA | échelle visuelle analogique : une réglette ; côté patient une ligne (pas de douleur → douleur maximale), il glisse le curseur sans voir de chiffres ; côté soignant on lit le score de 0 à 10 | réglette recto (visages aux bouts, curseur, doigt, gros plan), elle se retourne : verso gradué, « 6,5 / 10 » |
| EVS | si les chiffres sont difficiles : des mots (pas de douleur, faible, modérée, intense, extrêmement intense) | « 3 ? 7 ? » qui le perdent, 5 mots qui arrivent (barres de niveau), il choisit « modérée » |
| Visages | chez l'enfant, dès 4 ans : il montre le visage qui a aussi mal que lui | 6 visages (0 → 10, sans sourire ni larmes, comme la FPS-R), l'enfant lève le bras et montre le 4e |
| Seuil | dès 4 / 10 on soulage (prescription, ou on prévient le médecin), on réévalue après l'antalgique avec la même échelle, on note tout | repères légère 1 – 3 · modérée 4 – 6 · intense 7 – 10, cadre « à soulager » ; étapes 6/10 → antalgique → réévaluer → 2/10 ; puces « même échelle », « dossier » |
| Récap | chiffres, réglette, mots, visages ; dès 4 on soulage et on réévalue ; partie 2 : et s'il ne peut pas le dire ? | 6 lignes, confettis, carte « À suivre · partie 2 : Il ne répond pas » |

## Partie 2 — l'hétéro-évaluation (`Douleur-2`, voix `voix/25-douleur-2.script.json`)

| Scène | Voix (résumé) | À l'écran |
| --- | --- | --- |
| Accroche | « Il ne peut plus parler. Il ne peut pas te dire qu'il a mal… et pourtant, il souffre. Comment le savoir ? Avec la bonne échelle ! Car la douleur, ça ne se devine pas : ça se mesure. » | Image 0 : personne âgée + bulle « … » + « Comment savoir s'il a mal ? » ; la bulle se barre ; il souffre (gros plan, éclairs, flash, secousse) ; pastilles grimace · gémit · se protège ; grille d'observation ; « ça se devine » barré ; tampon « Ça se mesure ! » |
| Série | partie deux · quand le patient ne peut pas te répondre | carte des 2 parties (partie 1 cochée, partie 2 « ICI ») |
| Principe | c'est toi qui évalues en l'observant (hétéro-évaluation) : visage, gestes, plaintes | bulle vide barrée, viseur qui suit le visage, le corps, la bouche (« aïe… »), terme « Hétéro-évaluation », 3 puces |
| Algoplus | personne âgée qui ne communique pas : 5 questions oui / non (visage, regard, plaintes, corps, comportement), 1 point par oui, dès 2 / 5 il a mal → on le soulage | le patient montre chaque signe au mot près ; la grille se remplit : 2 / 5 |
| Doloplus | douleur qui dure : 10 questions (corps, mouvements, relation aux autres), dès 5 / 30 la douleur est présente | horloge, 3 familles (5 + 2 + 3 questions, notées 0 → 3) qui s'allument au mot, barre de score 8 / 30 (seuil 5) |
| BPS | en réanimation, patient intubé et endormi : on observe le visage, les bras, l'adaptation au respirateur | tube jusqu'au respirateur, « z », gros plans visage → bras crispés → courbe irrégulière ; « BPS = échelle du comportement » |
| EVENDOL | enfant de moins de 7 ans : voix, visage, mouvements, position, relation à ce qui l'entoure ; dès 4 / 15 on le soulage | l'enfant pleure, grimace, s'agite, se recroqueville, se détourne ; grille 0 → 3 : 5 / 15 |
| Récap | Algoplus, Doloplus, BPS, EVENDOL ; et toujours : on soulage, puis on réévalue | 6 lignes, confettis, carte « Série terminée · Tu sais l'évaluer ! » |
