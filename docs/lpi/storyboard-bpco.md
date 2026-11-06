# Storyboard — « La BPCO » v2 (La Petite IDE)

≈ 1 min 53 · 1080 × 1920 · composition `BPCO` · code : `src/videos/bpco/` (la v1, accroche « Et si chaque respiration
devenait un véritable effort ? » + compte à rebours, reste dans l'historique git, commit `adb22b2`).
Format « pathologie ». Voix de la marque, texte exact : [voix/16-bpco.script.json](../../voix/16-bpco.script.json).
Repères : tabac en cause dans 8 cas sur 10 ; au moins 2 malades sur 3 ne sont pas diagnostiqués (HAS : 2/3 à 90 %) ;
diagnostic VEMS / CVF < 70 % (spirométrie) ; cible SpO₂ **88 – 95 %** sous oxygène (choix du propriétaire, comme la
vidéo SpO₂).

Débit de la voix (v2.1, demandé : « ralentis les explications ») : accroche +5 %, définition et spirométrie +0 %,
radio −2 % (phrases coupées en petits morceaux), le reste +1 à +5 %.

Nouveautés de la v2 :
- **Poumons dessinés « La Petite IDE », couche par couche** (demandé : une image simple par étape, comme si on enlevait
  un calque) : `src/brand/chest.tsx` — patient → cage thoracique (`RibsLayer`) → poumons vus de l'extérieur
  (`LungsOutLayer`) → l'intérieur, trachée et bronches (`LungsInLayer`) → les alvéoles (`AlveoliZoom`) → une alvéole et
  son vaisseau (`AlveolusExchange`). `ChestPeel` les empile sur le `Patient` : la ligne de la radio descend et enlève
  une couche à chaque mot. Planches de contrôle : composition `Planche-Poumons` (pages 1 à 3).
- **Vrais bruitages** (La Sonothèque, gratuits, usage commercial) : toux (prise fournie par le propriétaire),
  essoufflement, briquet, bouffée de cigarette, inhalateur, souffle fort, soupir, escalier (`public/sfx/SOURCES.md`).

| Partie | Voix (résumé) | À l'écran | Sons |
| --- | --- | --- | --- |
| Accroche | « Tous les matins, la même toux. Il crache… et dans l'escalier, il doit s'arrêter à chaque étage. Lui, il se dit : c'est juste la cigarette. Faux ! Regarde ses poumons : ses bronches se bouchent, et l'air reste coincé. C'est la BPCO. Et au moins deux malades sur trois ne le savent même pas. » | Image 0 : « Juste une **toux** / de **fumeur** ? » + gros plan de l'homme qui tousse, le haut de son thorax déjà vu à la radio (l'aperçu se referme aussitôt) ; les jours claquent LUN → VEN ; mouchoir ; escalier : il s'arrête au palier, « ! » ; bulle « c'est juste la cigarette… » ; « Faux ! » : bulle et titre barrés au milieu de chaque ligne, tampon FAUX ! ; « Regarde ses **poumons**… » : la radio descend (côtes → poumons → bronches bouchées), « les bronches se bouchent », « l'air reste coincé » ; carton « C'est la **BPCO** » (flash, secousse) ; « **2** malades sur **3**… » : 3 patients, 2 « ? » | toux ×3, escalier, essoufflement ×2, briquet, bouffée |
| Définition | bronchopneumopathie chronique obstructive : une maladie des bronches, toute la vie, l'air passe mal | Sigle lettre par lettre (B · P · C · O), puis chaque explication ; poumons, horloge, il s'essouffle | essoufflement |
| La radio | Passons-le à la radio. Sous les côtes, il y a les poumons. À l'intérieur, l'air descend par la trachée et les bronches, jusqu'aux alvéoles : des petits sacs où l'oxygène passe dans le sang. Mais chez lui, les bronches s'enflamment, se remplissent de mucus et rétrécissent. Les alvéoles se cassent : c'est l'emphysème. Et l'air reste piégé. | Zoom lent sur le thorax ; la radio enlève les couches au mot : côtes → poumons → intérieur (l'air descend) ; plongée : médaillon des alvéoles, puis une alvéole et son vaisseau (O₂ → sang, CO₂ → air) ; retour : les bronches deviennent roses et étroites, mucus ; loupe : bronche en coupe qui s'enflamme, mucus qui coule, passage en étoile ; loupe : alvéoles qui cassent (emphysème) ; bulles d'air piégé, tampon « Air piégé ! » | soupir (l'air), toux, essoufflement |
| Cause | le tabac, 8 cas sur 10 ; poussières, produits chimiques, pollution | cigarette qui enfume les poumons ; 10 poumons, 8 s'allument ; pastilles | briquet, bouffée |
| Signes | essoufflement (effort, puis pour un rien), toux et crachats le matin, bronchites chaque hiver | « Ça s'installe **doucement** » : patient essoufflé, toux, crachats, soleil levant, flocons ; pastilles | essoufflement, toux |
| Spirométrie | souffler le plus fort possible ; < 70 % de l'air en 1 seconde = obstruées | spiromètre, courbe, repère 1 s, « lui : 56 % en 1 s », VEMS / CVF < 70 %, tampon « Obstruées ! » | souffle fort |
| Traitement | ne se guérit pas, on la freine : arrêt du tabac, inhalateurs (bronchodilatateurs), réhabilitation, vaccins | tampon « Ne se guérit pas », cigarette barrée, inhalateur qui rouvre la bronche, souffle réentraîné, seringue ; 4 puces cochées | pschitt |
| Oxygène | petit débit, cible 88 – 95 % ; exacerbation = une poussée : on consulte vite | lunettes à oxygène, SpO₂ qui remonte, échelle + cadre « cible BPCO : 88 – 95 % » ; tout s'aggrave (flash), SpO₂ 84 %, « On consulte vite ! » | toux |
| Récap rapide | bronches bouchées + air piégé ; tabac ; spirométrie ; on la freine | 4 lignes cochées, confettis | |
