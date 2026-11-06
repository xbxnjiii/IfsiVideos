# Storyboard — « Quiz éclair : les constantes » (`Quiz-Constantes`, ≈ 1 min 10, vidéo promo)

Voix : `voix/27-quiz-constantes.script.json`. But : annoncer que les 7 vidéos des paramètres vitaux sont sorties
(FR, FC, T°, TA, glycémie, SpO₂, diurèse) et donner envie d'aller faire le **quiz gratuit sur lapetiteide.fr** (lien en
bio). Pas de barre de progression (`progress={false}`).

Accroche **« quiz éclair »** (nouveau style) : le spectateur joue tout de suite. 4 questions, 3 secondes chacune : la voix
laisse un vrai silence (`[pause 2.6]` dans le script, géré par `tts_voix.py`) pendant que le chrono fait 3 · 2 · 1, puis
la bonne réponse s'allume avec l'explication. Une question piège (SpO₂ 98 % = normale) pour casser le rythme. Normes
reprises de la charte (fièvre ≥ 38 °C, tachycardie > 100/min, SpO₂ normale 95 – 100 %, hypoglycémie < 0,70 g/L).

| Scène | Voix | À l'écran |
| --- | --- | --- |
| Accroche | « Quatre questions, trois secondes pour chacune : tu es prêt ? » puis 38,5 °C (fièvre ? → oui, dès 38 °C) · cœur à 120/min au repos (→ tachycardie, au-dessus de 100) · SpO₂ 98 % (→ piège : normal) · glycémie 0,55 g/L (→ hypoglycémie : on resucre) | Image 0 : bandeau « QUIZ ÉCLAIR · CONSTANTES », « **4** questions / **3** secondes », 4 cartes « ? » en éventail, chrono « 3 » ; « Tu es prêt ? » ; chaque carte glisse : thermomètre qui monte à 38,5, cœur qui bat à 120, saturomètre + « 98 % », lecteur 0,55 g/L + sucres ; deux réponses, chrono 3 · 2 · 1 (tic), bonne réponse bleue ✓ (ding), l'autre rose ✕, explication ; tampon PIÈGE ! ; 4 pastilles de score qui se remplissent |
| Les 7 vidéos | « Si tu as hésité, bonne nouvelle : les sept paramètres vitaux ont tous leur vidéo. » + les 7 noms | 7 tuiles (icône, sigle, nom, « ✓ vidéo dispo ») qui claquent au mot, compteur « n / 7 », tampon « Toutes disponibles ! » |
| Le vrai test | « Et maintenant, place au vrai test : un quiz gratuit, sur notre site, lapetiteide.fr. Le lien est dans la bio ! » | Téléphone : barre d'adresse lapetiteide.fr, « QUIZ · PARAMÈTRES VITAUX », une question (FR normale), le doigt touche 12 – 20 / min → bleu ✓ « Bonne réponse ! +1 » ; tampon GRATUIT ; « lapetiteide.fr » en grand ; flèche ↑ « lien en bio » |
| Le défi | « Alors, tu vas en avoir combien ? Va vite te tester ! » | Carte « TON SCORE » dont les chiffres défilent puis « ? » (roulement de tambour) ; bouton « Je me teste → » + « lapetiteide.fr · lien en bio » |
