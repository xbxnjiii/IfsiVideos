# Mémoire du projet — vidéos « La Petite IDE »

Mini-vidéos IFSI en motion design, **tout en code** (Remotion 4, React → MP4), 1080 × 1920, ≥ 1 min,
pour TikTok / Reels / Shorts. La référence de qualité (tempo, physique, mascotte) est la vidéo
**Constantes** (pilote v4, aujourd'hui v7 : 7 constantes) : composition `Constantes`, dossier `src/videos/constantes/`.
Format retenu ensuite : **une vidéo par constante** (modèles `Frequence-Cardiaque`, `Frequence-Respiratoire`, voir plus bas).
Deuxième modèle : **Besoins-Fondamentaux** (`src/videos/besoins-fondamentaux/`) pour les vidéos « liste »
numérotée en étapes (gags au mot près, puces cochées, kit `src/brand/kit.tsx`).
Les anciennes versions (v1 à v4, labo HyperFrames, anatomie SVG / 3D) ont été retirées : elles restent
dans l'historique git (dernier état complet : commit `ce2a0a2`).
Charte complète (couleurs, tempo, physique, mascotte, transitions) : `docs/lpi/charte-video.md`.
**Skill `la-petite-ide`** (`.claude/skills/la-petite-ide/`) : le mode d'emploi réutilisable (charte, mascotte, formats et
accroches, voix, catalogue des briques `references/briques.md`, recette et contrôle). Le charger avant toute vidéo ;
ce fichier garde le journal des choix du propriétaire vidéo par vidéo.

## Règles de marque (non négociables)

- Couleurs uniquement : `#4E7AC7` bleu, `#C5D8F4` bleu clair, `#F8F9FC` fond blanc cassé, `#EAA7C1` rose,
  `#2D3A5A` bleu nuit (+ transparences). Exceptions : images officielles de la mascotte et logos.
- **Mise en situation = le plus réaliste possible** (demandé, règle générale) : tout ce qui pose la situation vécue
  (décor, objets, nourriture, insectes, peau de la personne) prend ses **vraies couleurs** (nappe vichy rouge et blanc,
  panier en osier brun, pomme rouge, abeille jaune et noir, peau couleur chair…). Les 5 couleurs restent pour les
  explications (titres, cartes, pastilles, schémas). Briques : `REAL_COLORS` / `PicnicBg` de `bee.tsx`, props `real`
  (`BeeG`, `HandTopG`, `PinchTipsG`, `StingerG`, `SkinG`).
- Mascotte : **uniquement les images officielles** (`public/brand/mascotte/`, index visuel
  `docs/lpi/mascotte-index.webp`), jamais redessinée, **jamais retournée en miroir**.
  **Bustes libres, sans cadre** (`<MascotActor busts="free">` : sticker détouré, bas en fondu) —
  plus de carré autour. Poses en pied libres. Dossier `symptomes/` pour jouer les signes cliniques.
- **Repères adultes** discrets mais visibles : échelle des normes `NormScale` (zones hypo / normo /
  hyper + bornes, curseur qui suit la valeur animée) sous l'illustration (prop `scale` de `Lesson3`)
  + seuil de chaque terme (`<Seuil>`) — valeurs (liste fournie pour la v6) dans la charte. Zone normale
  de FC, FR, PA, SpO₂ = « normale » (pas de normocardie / eupnée / normotension / normoxie).
  Chaque notion a sa partie avec voix (fiche bonus sans voix seulement en dernier recours, voir charte).
- Pas de filigrane, pas de sous-titres incrustés, pas de pastille « à connaître en IFSI », pas de
  musique dans l'export (ajoutée sur TikTok). Une accroche par vidéo. Termes techniques toujours
  accompagnés d'une explication courte.

## Ce qu'on garde du pilote (à réutiliser tel quel)

- **Tempo** : chaque mouvement part d'un mot de la voix (`at(scène, mot)`, 3 frames d'avance) ;
  un événement visible toutes les 0,5–1 s ; transitions de 14 frames, jamais deux fois la même
  d'affilée (`src/brand/motion4.tsx` : `zoomInto`, `runWipe`, `whip`, + `wave`).
- **Physique** : pops à ressort (~12 % de dépassement), sauts en arc centrés sur le mot avec
  accroupie / étirement / écrasement, secousse uniquement à l'impact, sorties rapides accélérées.
- **Mascotte actrice** (`src/brand/MascotActor.tsx`, exemple `src/videos/constantes/mascot.ts`) :
  une étape par mot clé, expression qui colle au mot (lexique v5 dans la charte, symptômes compris), places qui changent
  sans cesse sur tout l'écran (`home`, `low`, `top`, `bottom`, plein écran), métaphores physiques
  (elle court sur « trop rapide », saute au ralenti sur « trop lent », grelotte, tremble de colère…),
  et elle porte les transitions. Elle ne masque jamais titre, définition, fiche ni chiffres.
- **Humour du script = gag visuel** : chaque blague a son sticker ou son tampon au mot près
  (« Pas de Wi-Fi », ruban « Enquête en cours », bonbon-médicament…) ; les énumérations deviennent
  des puces cochées.
- **Gabarit de notion** : `Lesson3` (numéro qui s'écrase, termes qui claquent puis se rangent dans la
  fiche ; `slotSide` alterne gauche / droite d'une partie à l'autre ; `shake` ; `scale`).
- **Nouvelles planches** : déjà détourées → `scripts/brand/upscale_rgba.py`, `cut_v3.py` (ancrages dans
  `planches-v3.json`), `export_v3.py` (remplace / supprime les anciennes, manifeste + index).

## Voix

- **Règle (demandée) : toute nouvelle vidéo se fait d'abord avec la voix gratuite edge-tts** ; quand le propriétaire la
  valide, on génère la voix Laura (prix annoncé avant), on réaligne et on refait le rendu.
- Voix finale des vidéos validées : ElevenLabs « Laura » (voir la section dédiée). Voix des vidéos 1 à 28 (et repli si
  ElevenLabs est indisponible) : edge-tts `fr-FR-VivienneMultilingualNeural`, débit +8 %.
  **Une seule commande** : `npm run voice -- voix/<n>-<sujet>.script.json <épisode>` → `public/voix/<épisode>/voix.wav`
  + `src/videos/<épisode>/voice.json` (timing mot à mot donné par la synthèse : pas de Whisper).
  Dépendance : `pip install --break-system-packages edge-tts` (quelques secondes, à refaire par session).
- Script : une partie par scène (`id` = id de scène), `{affiché|prononcé}` pour les sigles (`{bpm|B P M}`),
  `"pause": s` pour un silence voulu après la partie, « [pause 2.5] » dans le texte pour un silence au milieu (le temps
  de répondre à une question), `"rate": "-3%"` pour ralentir une partie dense (≈ 10 % plus lent que +8 %,
  ex. la partie VITE de l'AVC). Lettre isolée : écrire « la lettre E » (un « E » seul est lu « è », entendu « H ») ;
  **chiffres et symboles toujours en lettres** (`{98 %|quatre-vingt-dix-huit pour cent}`) : un « 98 %. » seul en début de
  partie a été lu **en anglais** (« ninety-eight percent ») par la voix multilingue ; contrôler la langue de chaque début
  de partie avec faster-whisper **sans forcer la langue** (`info.language` doit être `fr`) ;
  « à jeun » est lu « à jeune » : écrire `{jeun|jun}` (entendu « AJ1 ») ; une phrase courte qui commence par un mot
  aussi anglais (« Verdict : hypoglycémie ! ») part **en anglais** → « Le verdict ? Une hypoglycémie ! » ; une phrase
  courte en morceaux (« Il se soulève, il redescend : un cycle. ») prend un **accent italien / espagnol** → l'allonger
  avec des mots bien français (« Il se soulève, puis il redescend : ça fait un cycle. ») ; `npm run check:voice` teste
  maintenant **chaque phrase** (et pas seulement chaque partie) et signale celles qui ne sont pas en « fr » ;
  en cas de doute, transcrire l'extrait avec faster-whisper (`pip install --break-system-packages faster-whisper`). Vérifier les mots clés dans voice.json (les nombres sont découpés à part).
- Une voix enregistrée (ElevenLabs, studio) : `scripts/voice/align_voice.py` (Whisper, plus lent).

## Format « une vidéo par constante »

- ≈ 1 min – 1 min 20, une notion par scène, barre de progression des notions, **récap rapide** à la fin
  (la voix résume, une fiche se construit ligne par ligne, puces cochées), pas d'appel à commenter.
- **Pas de quiz** (ni annonce « petit test à la fin ») : retiré à la demande du propriétaire, ne plus en proposer.
- **Accroche : ne plus commencer par « C'est quoi… ? »** (demandé : trop de vidéos démarraient pareil). Partir d'une
  situation : le patient a des signes (au mot près, pastilles `CauseChip`), « Qu'est-ce qu'il a ? » déjà à l'écran sur
  l'image 0, révélation (flash rose + secousse), le geste qui l'aurait montré, **puis** « Mais au fait… c'est quoi … ? ».
  Modèle : accroche de `Tension-Arterielle` (« Ton patient a mal à la tête, des vertiges… et ses oreilles bourdonnent.
  Qu'est-ce qu'il a ? Une hypertension : sa tension est trop haute ! Et un simple brassard te l'aurait dit. Mais au
  fait… c'est quoi, la tension artérielle ? »). Les vidéos déjà publiées gardent leur accroche.
  Variante **mini-histoire / enquête** (`Glycemie`) : « Ton patient se lève… et s'effondre. Que s'est-il passé ? »
  (image 0), retour en arrière (bandeau « ◀◀ 30 MIN PLUS TÔT », image bleutée, horloge qui recule, la chute se
  rembobine), indices en pastilles + bulle du patient, « Verdict : hypoglycémie ! » (tampon), le geste qui l'aurait
  évité, puis la question. Rester exact (hypoglycémie = diabétique sous insuline qui n'a pas mangé).
  Variante **chiffre-choc** (`Frequence-Respiratoire`, choisie par le propriétaire) : « Vingt mille. C'est le nombre de
  fois où tu respires… chaque jour. Sans même y penser. Et pourtant, à l'hôpital, c'est la constante qu'on oublie le plus
  souvent. » (compteur qui **roule de 0 à 20 000** pendant « Vingt mille », impact à l'arrivée ; les poumons
  n'apparaissent **que** sur « respires… chaque jour » ; « +1 » à chaque inspiration ; fiche de surveillance qui se
  coche sauf la ligne FR, tampon OUBLIÉE ; pas de soleil / lune : retirés à la demande).
  Variante **accéléré + dilemme** (`Diurese`) : « Huit heures, midi, seize heures, vingt heures… et toujours pas une goutte
  dans le bocal ! Un simple oubli du patient… ou des reins qui ne fabriquent plus d'urine ? » (image 0 : « 08:00 »,
  horloge, bocal vide « 0 mL » ; les heures défilent au mot, la lumière baisse ; une goutte se forme au bout du tuyau… et
  remonte ; deux cartes « oubli du bocal ? » / « reins à l'arrêt ? », la 2e claque « URGENCE ? ») : l'accroche annonce la
  fin de la vidéo (anurie = urgence), ce qui retient jusqu'au bout. **Varier le style d'une vidéo à l'autre** (signes →
  révélation, enquête, chiffre-choc, accéléré + dilemme…). Proposer 2 – 3 accroches au choix quand le propriétaire n'a pas d'idée.
- Récap : **pas de tampon final** (« Pro du souffle », « Pro du pouls » retirés à la demande) — confettis + mascotte suffisent.
- Rester simple et factuel : pas d'astuces « de terrain » mises en scène (retirées de la FR : compter
  discrètement, faire semblant de prendre le pouls). Expliquer chaque qualificatif entre parenthèses
  (ex. ample (profonde, beaucoup d'air), superficielle (peu profonde, peu d'air)).
- Déroulé type : accroche · définition · mesure (geste + astuce) · norme adulte · trop haut · trop bas ·
  « pas que le chiffre » (rythme, amplitude…) · récap rapide · logo.
- Modèles : `Frequence-Cardiaque`, `Frequence-Respiratoire`, `Temperature`, `Tension-Arterielle`, `Glycemie`, `Diurese` (`src/videos/<épisode>/`,
  storyboards dans `docs/lpi/`). Paliers de valeur qui roulent : `steps()` de `temperature/Scenes.tsx`.
- **Dernier modèle = `SpO2`** (`src/videos/spo2/`) : même format, mais avec la dynamique de l'arrêt cardiaque (demandé) :
  accroche-chiffre dès l'image 0 (« 98 %… mais 98 % de quoi ? » + question + promesse courte), tout dans le corps
  (poumons → plongée dans le vaisseau → globules rouges → grille de 100), gros plans par plongée + fondu, `ZoomCam`
  dans chaque scène. Briques `oxygen.tsx` : `SPO_ZONES`, `PulseOx` (pince au doigt : écran, courbe, lumière, vernis,
  doigt froid, ongle bleuté), `Vessel` (globules rouges, hémoglobine chargée d'O₂, alvéole), `HemoGrid` ;
  `Patient` : `lungs`, `cyanosis` ; icône `CyanosisIcon`.

## Format « condensé enfant » (modèle `Constantes-Enfant`, `src/videos/constantes-enfant/`)

- Demandé : les 7 constantes de la naissance à 17 ans en **3 tranches (0 – 2 · 2 – 11 · 12 – 17 ans)**, en ne parlant
  **que de ce qui change** chez l'enfant (ne pas répéter les vidéos adultes) ; ≈ 3 min, plus long que d'habitude (accepté).
  Valeurs validées par le propriétaire (PALS 2015 + référentiel des pédiatres) : FC 100–160 / 70–120 / 60–100, FR 30–50 /
  18–30 / 12–20, PAS 70–100 / 90–120 / 110–130, diurèse ≈ 2 / 1 / 0,5–1 mL/kg/h ; T° et SpO₂ = mêmes seuils que l'adulte
  (montré par une seule pastille posée sur les 3 cartes : « ça ne change pas ») ; glycémie : seuils propres au
  nouveau-né (sans chiffre : ils varient selon les maternités), piqûre au talon. Storyboard `docs/lpi/storyboard-constantes-enfant.md`.
- Accroche **« le piège »** (choisie par le propriétaire) : « Ce bébé respire quarante-cinq fois par minute… et son cœur bat
  à cent quarante. Tu appelles le médecin ? [pause 2.2] Pas besoin ! » (moniteur rose qui clignote → bleu, deux boutons,
  chrono 3 · 2 · 1, tampon NORMAL) puis « pas un adulte en miniature » (adulte rapetissé barré) et la frise 0 → 17 ans.
  Voix : « Eh non ! » était entendu « Anon » → « Pas besoin ! » ; « le geignement » → « un petit geignement, comme une
  plainte » (l'explication aide aussi à l'oreille).
- Gabarit de scène : `Head` (kicker = nom complet de la constante, titre court sur une ligne), `AgeTable` (3 cartes bébé ·
  enfant · ado, portraits, valeur qui claque au mot ; `same` pour une valeur commune), puis un `Stage` « ce qui change ».
  Briques `kids.tsx` : `Baby` (assis de face : `breath` ventre, `retract` tirage, `flare` ailes du nez, `moan`
  geignement, `snot`, `shake`, `limp`, `bonnet`, `steth`, `sensor` au pied, `fever`, `mood` pleure), `BabyFoot` (talon :
  zones, lancette, goutte), `Diaper` + `KitchenScale`, `Cuff`, `CompChart` (FC ↑ d'abord, PA ↓ en dernier), `ThermoStick`,
  `Bottle`, `Pleth` (courbe propre / brouillée), `KidMonitor`, `AgeTable`, `AGES`. Planches : composition `Planche-Enfant`.

## Format « pathologie » (modèle `AVC`, `src/videos/avc/`)

- ≈ 1 min 25. **Accroche-choc** au lieu de la simple question : un chiffre fort dès la 1re seconde (« Toutes
  les 4 minutes, en France… »), déjà à l'écran sur l'image 0 (miniature TikTok), puis 2 rebondissements visuels
  (le patient fait un AVC, le cerveau perd ses neurones avec un compteur), puis la question + une promesse
  courte (« et comment le reconnaître ? »). Flash rose + secousse uniquement sur les chocs.
- Déroulé : accroche · définition (sigle qui se déplie lettre par lettre) · types · signes (acronyme VITE joué
  par le patient, zoom sur le visage) · conduite à tenir (le 15, l'heure) · traitements · facteurs de risque ·
  récap rapide · logo.
- Briques : `brain.tsx` (cerveau de profil : artères où le sang circule, neurones qui scintillent / s'éteignent,
  zone privée de sang, caillot, hémorragie ; gros plan d'artère `ArteryZoom` : caillot qui bouche, rupture,
  thrombolyse, thrombectomie), `devices.tsx` (téléphone qui compose le 15, horloge murale, écran d'imagerie),
  `Patient` : `droop` (visage paralysé), `armL` / `armR` (bras levés, l'un retombe).
- Équivalent vu en cours, **à l'écran seulement** (pas à la voix) : « VITE = FAST » (Face · Arm · Speech · Time),
  rangée `FastRow` qui s'allume lettre par lettre avec VITE.
- 2e modèle « pathologie / urgence » : `Arret-Cardiaque` (`src/videos/arret-cardiaque/`) — accroche : le tracé ECG
  devient plat et le patient s'effondre (image 0 = moniteur qui bat), 3 minutes pour le cerveau, jauge de survie
  −10 %/minute ; puis définition (FV), reconnaître, alerter, masser, RCP 30/2, DAE. Briques `arrest.tsx` :
  `EcgMonitor` (sinus / FV / plat / choc), `Aed`, `Pad`, `CprHands` + `DepthGauge`, `HeadTilt` (gros plan de profil,
  plein cadre : main sur le front, deux doigts sous le menton) ; `Patient` : `eyesClosed`, `quiver` (cœur qui tremble),
  `brain` (cerveau vu à travers le crâne + carotides), `anoxia`, `bloodless` + `flowPhase` (le sang s'arrête).
  Une définition se montre **dans le corps** (cœur, artères, cerveau du `Patient`), jamais d'organes « dans le vide ».
  Nombres collés (« 100 à 120 ») : les écrire en lettres (`{100|cent} à {120|cent vingt}`).
- 3e modèle « pathologie / urgence » : `Embolie-Pulmonaire` (`src/videos/embolie-pulmonaire/`) — accroche : podium
  « 3e cause de mort cardiovasculaire » (image 0), puis le caillot né dans le mollet remonte jusqu'au poumon, **la caméra
  le suit** (`ZoomCam` avec une fonction `CamFollow` : (frame) → {s, x, y}) ; définition (embolie, phlébite (TVP)), signes,
  conduite à tenir, traitement (anticoagulants, thrombolyse via `ArteryZoom`), facteurs de risque + prévention.
  Briques `embolism.tsx` : `FullBody` (le `Patient` + jambes, veine profonde, artères pulmonaires, caillot qui suit le
  trajet `clotAt(t)`, zone du poumon privée de sang, mollet gonflé, bas de compression (on ne dit pas « de contention »), douleurs), `SemiSitting` (lit
  dont le dossier se relève à 45°), `ChestScan` ; `Patient` : `fade={false}` ; icônes lit, avion, plâtre, bistouri,
  ruban, mollet. Dans une `ZoomCam`, le contenu doit tenir dans la fenêtre à zoom 1 (sinon il n'est jamais montré).
- 4e modèle « pathologie » : `BPCO` (`src/videos/bpco/`, **v2** qui remplace la v1 — v1 au commit `adb22b2`) — accroche
  **« Juste une toux de fumeur ? »** (choisie par le propriétaire) : « Tous les matins, la même toux. Il crache… et dans
  l'escalier, il doit s'arrêter à chaque étage. Lui, il se dit : c'est juste la cigarette. Faux ! Regarde ses poumons :
  ses bronches se bouchent… C'est la BPCO. Et au moins deux malades sur trois ne le savent même pas. » (image 0 : gros
  plan + aperçu de la radio dans le thorax, qui se referme ; fausse piste barrée, tampon FAUX ! ; la radio passe sur
  « Regarde ses poumons » : le résultat visuel arrive dès l'accroche, demandé : « donner envie de rester dès les
  premières secondes »). **Barrer un texte** : poser `Strike` DANS un conteneur `position: relative` qui a la taille du
  texte (il se centre sur son parent), une ligne de titre à la fois ; sur une `Bubble`, le mettre dans un calque
  `zIndex: 3` (la bulle est en `zIndex: 1`). Voix plus lente sur les explications (radio −2 %, définition et
  spirométrie +0 %) ; sigle, **la radio couche par
  couche** (voir « Planches anatomiques » plus bas), cause, signes, spirométrie (VEMS / CVF < 70 %), traitement,
  oxygène (**cible 88 – 95 %**, choix du propriétaire, comme la vidéo SpO₂) + exacerbation, récap. Storyboard
  `docs/lpi/storyboard-bpco.md`.
  Briques `copd.tsx` : `Bronchus` (paroi enflammée, mucus, rétrécissement, alvéoles → emphysème, air qui entre / piégé,
  brume de bronchodilatateur), `Spirometer` + `exhaled()`, `Inhaler` ; `Patient` : `bronchi`, `narrow`, `trapped`,
  `cannula` (lunettes à oxygène) ; icônes poussières, pollution, toux, crachats, soleil levant, seringue, inhalateur.
  Sigle en début de partie : « La {BPCO|B P C O}, c'est la… » (un « B P C O : bronchopneumopathie… » seul a été lu
  avec un accent étranger : détecté par la vérification de langue).
- 5e modèle « pathologie » : `Insuffisance-Cardiaque` (`src/videos/insuffisance-cardiaque/`) — accroche **« 3 indices »** (style
  nouveau, demandé : « qui préoccupe ») : « Trois kilos en une semaine… alors qu'il mange moins. Il dort assis, avec trois
  oreillers. Et le soir, ses chevilles gonflent. Ce n'est pas l'âge : c'est son cœur qui s'épuise. C'est l'insuffisance
  cardiaque. Et si personne ne voit ces signes… ses poumons peuvent se noyer. » (image 0 : pèse-personne « +3,0 kg » + « ? » ;
  chaque indice « pop » puis file se ranger en pastille `CauseChip` ; fausse piste barrée ; les pastilles pointent vers le
  cœur ; la menace finale = plongée dans le thorax, l'eau monte). Puis définition, cœur gauche (orthopnée), cœur droit
  (œdèmes, godet, poids), la pesée quotidienne (+2 kg en 3 jours → alerte), traitement, OAP, récap. Briques `heartfail.tsx` :
  `BathScale`, `PropUp` (0 → 3 oreillers), `Ankles` (`swell`, `press`, `dent`), `SaltShaker`, `Battery`, `SitLegsDown`,
  `Foam` ; `Patient` : `flood` (œdème pulmonaire, avec `lungs`). Dans `Scenes.tsx` : `Man` (patient + calques : moitié du
  cœur qui faiblit `side` G/D, reflux vers les poumons, gouttes qui descendent, mousse, cicatrice d'infarctus, pression).
- 6e modèle « pathologie », devenu une **série en 2 parties** : `Diabete-1` / `Diabete-2` (`src/videos/diabete-1/`, `-2/`,
  storyboard `docs/lpi/storyboard-diabete-serie.md` ; la v1 `Diabete` en une vidéo reste dans l'historique git). Demandé :
  « ça va un peu vite, ralentis et prends le temps (voix et animations) », parler du type 1 **insulinodépendant (DID)**, du
  type 2 **non insulinodépendant (DNID)** et du **diabète gestationnel** ; une seule vidéo aurait duré ≈ 2 min 45 → série
  (choix du propriétaire). Voix **+0 %** (accroches +3 / +4 %), `popAt` au ressort plus lent, caméra 16 – 20 images.
  Partie 1 « les 3 types » : accroche **« le paradoxe »** (« Son sang est rempli de sucre… et pourtant, ses cellules meurent de
  faim. […] Il lui manque une clé : l'insuline. », image 0 : « Du sucre partout… et elles ont faim ? »), carte de série,
  principe (clé / porte), type 1 (les défenses attaquent le pancréas, carte sigle **DID** lettre par lettre, l'insuline le
  garde en vie), type 2 (la clé coince, carte **DNID**, « au début : pas besoin d'insuline »), gestationnel (hormones du
  placenta, 24 – 28 SA, HGPO, bébé > 4 kg, disparaît après l'accouchement, risque de type 2 plus tard), récap + `NextUp`.
  Partie 2 « découvrir et soigner » : accroche nouvelle **« il va très bien… »** (« Il n'a jamais soif, il n'est jamais
  fatigué… Et pourtant, depuis des années, le sucre en trop abîme ses yeux, ses reins et ses pieds. Son diabète ne fait
  aucun bruit… Alors, comment le repérer à temps ? »), diagnostic (≥ 1,26 g/L à jeun sur deux prises de sang),
  complications, traitement selon le type + HbA1c, ton rôle, récap + « série terminée ».
  **Renvoi à une vidéo déjà publiée** (demandé, pour ne pas répéter) : la voix dit « Comme on l'a vu dans la vidéo sur la
  glycémie… » et la pastille `VideoLink` (« DÉJÀ VU EN VIDÉO · La glycémie ») s'affiche.
  Briques `diabetes.tsx` : `BloodBand`, `GCell` (porte, cadenas, jauge, faim / rassasiée, refus), `InsulinKey` (`ghost`,
  `jam`, `turn`), `Pancreas` (`make`, `dead`), `InsulinPen`, `InjectionSites`, `GlycatedCell`, `Plate`, `KidneysIcon`,
  `BrainIcon`, `VideoLink`, `DIABETE_PARTS`, `Defender` (défense du corps), `MomToBe` (future maman de profil : `belly`,
  `inside` (utérus, bébé, placenta, cordon, découpés dans la robe), `big`, `hormones` + `to`, `born`), `WeeksBar` (0 → 40 SA,
  fenêtre 24 – 28), `SweetDrink`. Carte sigle `SigleCard` (dans `diabete-1/Scenes.tsx`) : sigle en grand, initiales roses,
  explication en dessous.
  Attention : dans un attribut JSX `text="…\n…"` le `\n` n'est pas un retour à la ligne → `text={'…\n…'}` ; un accent de
  titre sur un mot avec apostrophe s'écrit `*l'hygiène*` (pas `l'*hygiène*`) ; `accessoires/baskets` n'est qu'une chaussure
  (pas la mascotte) : ne pas l'utiliser comme étape. Voix : « se soigne par l'insuline… à vie » était entendu « à la vie » →
  « il se soigne par l'insuline, toute sa vie ».

## Format « court info + humour » (≈ 40 s, modèle `Suppositoire`, `src/videos/suppositoire/`)

- Demandé : des vidéos courtes, informatives et drôles, sur une **idée reçue** que l'on corrige. 1er essai : « Comment
  mettre un suppositoire ? » (le « côté plat d'abord » vient d'une seule étude de 1991, jamais confirmée ; on suit la
  notice, et la plupart disent : par la pointe). Storyboard `docs/lpi/storyboard-suppositoire.md`.
- Déroulé : accroche **« le match »** (image 0 : écran coupé en deux, ÉQUIPE POINTE vs ÉQUIPE PLAT, la question à
  l'écran ; commentaires d'internet qui pleuvent, « c'est la guerre ! ») → l'idée reçue (tampon IDÉE REÇUE !, la
  croyance barrée) → la vérité, avec une image qui fait retenir (« comme une fusée : la pointe devant ! ») → le bon geste
  en cartes numérotées au mot → chute drôle (« décollage réussi ! »). Pas de récap ni de barre de progression
  (`progress={false}`).
- Durée libre : `episodeTimeline(voice, ids, {minTotal: 0})`. Par défaut, une vidéo de cours dure au moins 61 s ;
  `npm run cues` affiche encore 61 s, c'est sans effet.
- Look 2026 : gros titres plein cadre (une idée par plan), fonds en aplats francs, **flou de mouvement** sur ce qui bouge
  vite. Kit **`src/brand/bold.tsx`** :
  - `Blur` (calque `CameraMotionBlur`, coupé quand rien ne bouge) ;
  - `Live` (rendu en fonction de l'image), `Posed`, `Fly` / `flyPose` (entrée en trombe avec léger dépassement, sortie
    qui accélère, déplacements `move`) ;
  - `FlatBg` (aplat + deux grands disques qui respirent), `Big` (grand titre), `Note` (pastille d'explication),
    `BigNumber` (chiffre géant + titre).
- **Règle du flou** (`CameraMotionBlur` rejoue ses enfants à des images légèrement passées) : une position doit être
  calculée **dans** le calque, avec `useCurrentFrame()` (via `Live`, `Posed` ou `Fly`). Une position calculée dans le
  composant parent est la même pour tous les échantillons, donc aucun flou : c'était le cas dans la 1re version du
  suppositoire, corrigée depuis.
- `HtmlInCanvasMotionBlur` demande Chrome 149+, notre navigateur est trop ancien.
- `@remotion/effects` (fuites de lumière, flou de zoom, lueur) est installé : ce sont des effets WebGL, à n'utiliser que
  dans les couleurs de la marque.
- Briques `suppo.tsx` : `Suppo` (torpille à visage : `mood`, `rocket` ailerons + flamme, `drop` goutte d'eau), `Notice`
  (ligne surlignée), `SideLying` (patient sur le côté gauche, `bend` jambe du dessus), `Sphincter` (`open`), `Squeeze`,
  `Comment` (commentaire de réseau social). Dans un commentaire ou un titre, mettre une espace insécable devant « ! » et
  « ? » (`\u00a0`), sinon ils se retrouvent seuls à la ligne.

- 2e court : `Objet-Plante` (`src/videos/objet-plante/`, ≈ 46 s) — « Pourquoi ne jamais retirer un objet planté ? ».
  Demandé : une **situation vécue** (« on se reconnaît = on regarde ») : la vaisselle, le verre éclate dans l'évier, un
  éclat dans la main ; « Premier réflexe : le retirer. Stop ! ». Puis sous la peau (l'éclat bouche le vaisseau coupé →
  hémorragie si on le retire), écharde vs éclat planté, le bon geste (caler avec des compresses, s'asseoir, le 15), chute
  « Pas dans ta cuisine ! ». Briques `src/brand/shard.tsx` : `Sink`, `DrinkGlass`, `ShardBurst`, `HandShard`, `Pinch`,
  `ShardSection` (calque sur `SkinBlock`), `Splinter`, `Chair`, `ErIcon` ; `bold.tsx` : `RowCard`, `PointTag`, `ToneBg`.
- Bruitages : l'API Openverse sert à chercher, mais les fichiers Freesound renvoient 403 depuis le conteneur (ne pas
  contourner) → La Sonothèque (`npm run sfx:import`) : `dishes`, `tap`, `glass`, `heart`, `dtmf-1`, `dtmf-5`, `ring`.
  « Real SFX » introuvable ; `@remotion/sfx` = sons de mèmes seulement.

- **Série courte « Les plaies »** (7 vidéos de 33 à 37 s, n° 31 à 37, storyboard `docs/lpi/storyboard-plaies-courtes.md`) :
  demandé « plusieurs vidéos prenantes, courtes et virales », chacune ouverte par une **situation vécue** (genou râpé,
  couteau ou portière, clou, chat, deux plaies le même jour, quelques heures allongé, trou sous le pied), tout animé et
  illustré. **Ne pas nommer les parties** (ni « partie 1 », ni carte de série) : chaque vidéo tient seule.
  **Accroche = une scène animée avec des personnages, SANS texte au début** (demandé : le texte attire l'œil et on ne
  regarde plus l'animation ; trop d'éléments = on perd le spectateur). Le garçon à vélo qui tombe « donne envie de rester » ;
  les accroches à base de cartes / jauges / titres étaient trop « swipables » (couteau ou portière : 3/10, et une portière
  ne fait pas de plaie en général → remplacée par la chute sur le trottoir). Même gabarit
  que `Objet-Plante` (accroche · 2 – 3 notions · chute, `progress={false}`, `{minTotal: 0}`). Briques
  `src/brand/injury.tsx` : `Walker` (adulte de profil : `walk` avec `phase`, `hop` sautille en tenant son pied, `fall` tombe en pivotant
  autour des pieds ; `hair` man / old / kid, `chin` plaie au menton, `legWound`), `Bike`, `Boy` (garçon de profil : `ride` sur le vélo, `fly` éjecté, `sit` assis qui se tient le genou écorché), `Stone`, `Knee` (genou qui se râpe, guérit), `Meter` (jauge), `DeepBits` (vaisseau,
  nerf, tendon dans `SkinBlock`), `DepthRuler`, `DayChip`, `WoundTop` (plaie vue de dessus franche / contuse,
  sutures, écrasement, nécrose, `heal`), `NailBoard`, `Mosquito`, `VaxBook`, `Stetho`, `Cat`, `Dog`, `BittenHand`
  (traces de crocs, main qui gonfle), `WeeksBar` (frise des semaines, cadenas), `AirMattress`, `TurnArrows`, `FootTop`.
  Bruitages ajoutés : `bike`, `skid`, `fall`, `car-door`, `chop`, `meow`, `hiss`. Attention : `at()` ignore les accents,
  « là » = « la » (prendre le mot suivant).

- `Trousse-Secours` (n° 38, ≈ 48 s, **voix gratuite edge-tts**, demandé) : même règle d'accroche (scène sans texte). Le
  bonhomme dans sa cuisine (« mal fait ») puis un 1er gros plan vu de dessus (« trop illustré ») ont été refaits :
  **`CuttingCloseUp` v2** « comme si c'étaient tes mains » (demandé : « refais par toi-même, sans faute visuelle ») :
  rendu soigné (peau opaque en dégradé, ombres douces floutées, contours fins `LINE`, lame métal, mur carrelé, planche),
  main gauche en griffe qui recule à chaque coupe, la main droite hors champ (le manche sort du cadre), tranches qui
  basculent à plat, au mot « glisse » la lame dérape sur la phalange de l'index, le couteau est retiré, une goutte perle
  puis tombe sur la planche ; à la fin, pansement autour du doigt. **Validé par le propriétaire (« elle est superbe »)** :
  ce rendu soigné est la référence des prochaines animations. Test non retenu : clip IA `public/clips/couteau-seedance.mp4` (Seedance 2.5 via ElevenLabs,
  ≈ 14 000 crédits, **trop cher** selon le propriétaire ; sorti en 16:9 720p malgré « vertical » ; le couteau ne touche
  pas le doigt à l'image). Toujours **annoncer le prix (`estimate_only`) avant une génération vidéo** : Kling 2.5 Turbo
  ≈ 2 100, LTX v2 Fast ≈ 1 450 crédits pour 5 s. Higgsfield : 0 crédit. Ensuite la trousse se remplit objet par objet
  (gros plan + rôle, il file dans sa case), les bons réflexes, chute « tout est là ». Briques `src/brand/firstaid.tsx` :
  `FirstAidKit` (`open`, `items`, `empty`, `shine`, cases `KIT_SLOTS`), `KitItem` (13 objets), `EmergencyCard`,
  `CuttingCloseUp` + `CUT_TIP`, `Padlock`.
- `Pansement` (n° 39, ≈ 43 s, voix gratuite edge-tts, demandé : « décoller la 1re partie, la coller, bien mettre le bout
  blanc sur la plaie, décoller la 2e, tout ça en ayant désinfecté ») : accroche sans texte au début (le pansement collé
  vite fait : carré blanc à côté, colle sur la plaie), préparer (mains, nettoyer, désinfecter, sécher en tamponnant),
  poser étape par étape, le changer chaque jour ou s'il est mouillé / sale, chute « posé… pas juste collé ! ». Même rendu
  soigné que la trousse. Briques `src/brand/bandage.tsx` : `BigFinger` (index vu de dessus, repère 1000 × 400 : `cut`,
  `bleed`, `clean`, `wet`, `tint`, calques en `children`), `BandageG` (pansement dans le repère du doigt : `tab1` / `tab2`,
  `wrapTop` / `wrapBottom`, `lift`, `sloppy`, `wet`, `dirt`, `glow`), `Presser` (doigt qui lisse / appuie), `TargetRing`,
  `WashFx`, `DabPad`, `FINGER`, `fingerPt`. Storyboard `docs/lpi/storyboard-pansement.md`.
- `Brulure` (n° 40, ≈ 47 s, voix gratuite d'abord) : accroche sans texte, **mise en situation demandée** : plan large sur
  la plaque vitrocéramique (foyer allumé qui rougeoie, bandeau tactile), la casserole avec son manche (`CooktopG`,
  `HotPanG` `handle`), le doigt touche le bord de la casserole ; idées
  reçues barrées (glaçon, beurre, dentifrice), eau du robinet 15 min + règle des 3 × 15, cloque qu'on ne perce pas,
  compresse ou pansement gras, paracétamol, quand consulter, chute « merci ! ». Briques `src/brand/burn.tsx` + `BigFinger`
  (`burn`, `heat`, `blister`). Storyboard `docs/lpi/storyboard-brulure.md`.
- `Echarde` (n° 41, ≈ 46 s, voix gratuite d'abord, **thème choisi librement** à la demande) : accroche sans texte (le doigt
  glisse sur une vieille planche, aïe), idée reçue (presser avec les ongles : elle s'enfonce, se casse), la bonne méthode
  (laver, désinfecter la pince, au ras de la peau, tirer dans le sens où elle est entrée), après, quand consulter + tétanos.
  Corrections demandées : la planche est en **vrai bois brun** (exception à la palette, demandée : « une vraie planche »),
  et l'écharde se plante côté pulpe : au « aïe » le doigt **se retourne** (`BigFinger` `palm` : vu côté pulpe, sans
  ongle, plis de flexion, empreinte) pour la montrer ; le reste de la vidéo est côté pulpe.
  Briques `src/brand/splinter.tsx`. Voix : « ça rougit, ça gonfle » → « la peau devient rouge, gonflée ». Storyboard
  `docs/lpi/storyboard-echarde.md`.
- `Tique` (n° 42, ≈ 53 s, voix Laura après validation (995 crédits + 283 pour refaire la partie `methode` seule, recollée dans la voix), thème libre) : accroche refaite à la demande : « Tu te balades en forêt…
  et quelque chose tombe sur ton bras. C'est quoi ? » (homme en t-shirt et jean sur un sentier, `ForestBg` de
  `src/brand/forest.tsx`, `Walker` `tee` + `jeans` ; la tique tombe d'une branche sur l'avant-bras, la caméra plonge sur le
  bras) puis la peau en très gros plan (plus de poils, demandé), le point noir que le doigt frotte, zoom ×7 : une tique ;
  tire-tique redessiné d'après le vrai Tick Twister (demandé : « plus réaliste ») ; le crochet arrive par le bas et passe **sous** la
  tique (comme la 1re version, demandé : pas « à côté »), son **cran** (fond du V) contre la tête, + carte « vu au ras de la
  peau » (profil : le rostre planté entre dans le cran), puis on **vérifie qu'elle est entière, avec
  sa tête** (loupe, demandé) ; forêt **réaliste : feuillage vert, buissons, herbe**, la tique tombe du feuillage d'un arbre (pas de branche isolée) (exception à la palette demandée, comme
  le bois brun) ; idées reçues barrées (alcool, la gratter, l'enlever avec
  les doigts, demandé : elle recrache des microbes), tire-tique (dessous, on tourne **dans le sens inverse des aiguilles d'une montre** (demandé, flèche ↺), elle sort avec sa tête), désinfecter / se laver les mains / noter la date,
  surveiller un mois (plaque rouge qui s'étend, fièvre → médecin, maladie de Lyme), chute (manches longues, pantalon,
  inspection). Briques `src/brand/tick.tsx` (`SkinG` peau en gros plan avec `ring` érythème migrant, `TickG`, `TickHookG`).
  Storyboard `docs/lpi/storyboard-tique.md`.
- `Saignement-Nez` (n° 43, ≈ 59 s, voix Laura après validation (1 127 crédits), thème libre) : accroche sans texte (il lit, une goutte de sang
  tombe sur la page, il bascule la tête en arrière, « ? »), idée reçue en coupe (le sang file dans la gorge : il l'avale,
  nausée, il ne voit plus si ça saigne), bon geste **corrigé à la demande** (assis, tête en avant, **pas de mouchage**,
  on **comprime** (pas « pince ») la partie molle sous l'os **avec un mouchoir ou une compresse, pas les doigts nus**,
  **5 à 15 min** sans relâcher, respirer par la bouche), **mèche** si ça saigne encore (scène `meche` : un petit tampon qui
  aide à former un caillot), après (pas de mouchage fort ni de sport), quand consulter (20 min, choc sur la tête,
  traitement qui fluidifie le sang, le 15), chute « tête en avant… et on comprime ! ». `HeadSide` : `pad`, `wick`. Brique
  `src/brand/nose.tsx` (`HeadSide`). Voix : « Ton nez saigne ! » était entendu « ton essaigne » → « C'est ton nez qui
  saigne ! » ; dans un titre, l'accent ne marche pas sur un mot à trait d'union (« Assieds-\*toi\* » s'affichait tel quel).
  Storyboard `docs/lpi/storyboard-saignement-nez.md`.
- `Piqure-Abeille` (n° 44, ≈ 49 s, voix Laura après validation (927 crédits), thème libre) : accroche sans texte, voix « Petit pique-nique du
  dimanche, en famille… et là, une abeille se pose sur ta main… et aïe ! Elle te pique… » (demandée) ; pique-nique refait
  **réaliste** à la demande (herbe, nappe vichy rouge et blanc, panier en osier brun, pomme rouge, sandwich-baguette, jus
  d'orange, fraises, ombres de feuillage ; abeille jaune et noir, main et peau couleur chair, dard brun) ; une
  abeille se pose sur la main et pique, plongée sur la peau : le dard planté avec sa poche de venin), idée reçue (le pincer
  avec les doigts : on presse le venin), gratter avec le bord d'une carte (le bord pousse le dard), eau + savon, froid dans
  un linge ≈ 10 min, ce qui est normal (rougeur, gonflement, douleur, quelques jours), le 15 (visage / gorge qui gonfle, mal
  à respirer, piqûre dans la bouche), chute « la guêpe ne laisse pas son dard ». Brique `src/brand/bee.tsx`. Voix : « Aïe ! » seul était lu « Rahé », « Ouille ! »
  « Will » → « …sur ta main… et aïe ! » (entendu « et aille », même son). Storyboard `docs/lpi/storyboard-piqure-abeille.md`.
- `Entorse` (n° 45, ≈ 42 s, voix Laura après validation (794 crédits), thème libre) : accroche sans texte réaliste (footing au parc, le pied se
  tord sur une racine, gros plan sur la cheville : basket, la cheville gonfle et bleuit), idée reçue « je bouge le pied,
  donc pas cassé » (vue radio, péroné fêlé), 4 mots glace (15 – 20 min, dans un linge) · repos · élévation (plus haut que la
  hanche, `LegRest`) · contention (bande en huit, sans trop serrer), radio si 4 pas impossibles / douleur sur l'os / cheville
  déformée, chute (il saute la racine). Brique `src/brand/ankle.tsx` (`AnkleSide`) ; `Walker` a maintenant `skin` (vraie
  couleur de peau). Storyboard `docs/lpi/storyboard-entorse.md`.
- **Série « les degrés de brûlure »** (n° 46 · 47 · 48, demandée : « une vidéo par degré », contenu fourni par le
  propriétaire ; voix Laura après validation : 779 · 1 401 · 936 crédits ; chaque vidéo tient seule) : `Brulure-1` (plage : coup de soleil ; épiderme ;
  rouge, sèche, douloureuse, sans cloque ; 3 – 5 jours sans trace), `Brulure-2` (eau des pâtes ; superficiel : haut du
  derme, rouge, suintant, très douloureux, phlyctènes, ≈ 2 semaines ; profond : derme profond, pâle, cloques molles, peu
  douloureux (nerfs abîmés), > 3 semaines, séquelles, greffe ; chute « très douloureuse = superficiel, presque plus de
  douleur = plus grave »), `Brulure-3` (barbecue rallumé à l'alcool ; toute la peau détruite, parfois graisse / muscles
  / os ; cartonnée, sèche, blanche / brune / noire, sans cloque ; indolore, douleur autour ; urgence (15), greffe —
  « gravité » complétée car laissée vide ; chute « jamais d'alcool »). **Conduites à tenir ajoutées à la demande**
  (scène `geste` dans chaque vidéo, + `consulter` au 2e degré) : 1er = douche fraîche 15 min, crème hydratante, boire,
  à l'abri du soleil, paracétamol ; 2e = eau tempérée 15 min, retirer bagues / bracelet, ne jamais percer les cloques,
  compresse stérile, médecin (urgence si > moitié de la main, visage, mains, parties intimes) ; 3e = en attendant les
  secours, **suivre simplement les indications du 15** (simplifié à la demande : plus de consignes détaillées). `TapWater` (robinet / `shower`), pictos `CreamIcon`, `GlassIcon`, `SunIcon`, `RingIcon`,
  `BlisterIcon`, `GauzeIcon`, `PalmIcon`, `ShirtIcon`, `BlanketIcon`, `NoMark`. Brique `src/brand/burnstage.tsx` (`BurnPatch`,
  `CutView`, `BeachTop`, `PastaPour`, `Barbecue`). La vidéo `Brulure` (n° 40, les bons gestes) reste à part.
  Storyboard `docs/lpi/storyboard-brulures-degres.md`.
- `Cancer-Prostate` (n° 49, ≈ 1 min 34, format « pathologie », voix gratuite d'abord, sans barre de progression) : accroche
  **« il se lève la nuit »** (choisie par le propriétaire parmi 3) : chambre la nuit en vraies couleurs, réveil en gros plan
  01:00 → 03:00 → 05:00, il se lève, la porte des toilettes s'ouvre ; « c'est l'âge… ? » puis plongée vers sa prostate
  (loupe). Puis prostate (châtaigne, sous la vessie, autour de l'urètre, une partie du sperme), adénome (sans gravité,
  serre l'urètre : levers la nuit, jet faible), cancer (cellules qui se multiplient, 1er cancer de l'homme, après 50 ans,
  souvent aucun signe au début), signes tardifs (sang dans les urines / le sperme, douleurs osseuses), examens (toucher
  rectal, PSA, IRM, biopsie), risques (âge, père ou frère, famille venue d'Afrique ou des Antilles), traitements
  (surveillance, chirurgie, radiothérapie, hormonal ; parfois fuites urinaires, troubles de l'érection), chute « dès 50
  ans, on en parle à son médecin… même quand tout va bien ». Briques `src/brand/prostate.tsx` (`Bedroom`, `AlarmClock`,
  `Pelvis` : `grow` adénome, `tumor`, `spread`, `finger` toucher rectal, `needle` biopsie, `flow`, `glow`…). Voix : « Il y
  a plus de risques » était entendu « il n'y a plus de risque » → « Le risque augmente… » ; « antillaises » → « ta famille
  vient d'Afrique ou des Antilles ». Storyboard `docs/lpi/storyboard-cancer-prostate.md`.
  Retour du propriétaire (« c'est super ») : **à l'avenir, détailler davantage l'intérieur du corps, moins cartoon, plus
  réaliste** (le bassin en schéma simple était trop plat : vraies formes d'organes, volumes, dégradés, ombres douces,
  textures, tissus autour, dans l'esprit du rendu soigné de `CuttingCloseUp`) → **`Pelvis` refait** dans ce sens (coupe :
  peau, graisse, muscle grand droit, anses d'intestin, sacrum en vertèbres, symphyse pubienne, vessie à paroi plissée +
  uretère, vésicule séminale, prostate avec capsule / zone de transition (qui grossit dans l'adénome) / zone
  périphérique (où naît la tumeur) / lobules, rectum avec plis et sphincter, verge ; dégradés et ombres douces, palette
  de la marque) ; cellules ombrées. Puis, sur un exemple fourni (schéma de manuel « L'appareil génital masculin »), **`Pelvis` refait en vrai schéma de l'appareil masculin** (coupe de profil classique : colonne + sacrum, intestin, vessie + uretère, vésicule séminale, prostate, rectum jusqu'à l'anus, pubis, verge avec corps caverneux / spongieux / gland, bourse + testicule + épididyme, canal déférent qui remonte au-dessus de la vessie jusqu'à la prostate ; l'urine coule jusqu'au bout de la verge), dessiné par nous (pas copié), une teinte de la marque par organe. Pour les prochains organes : partir de la disposition d'un schéma de manuel.
  **Règle des schémas d'anatomie (demandée, v3 de `Pelvis`)** : des schémas 2D **réalistes comme dans les cours d'IFSI /
  de médecine** (on doit identifier chaque organe et chaque os), on peut garder une touche cartoon (aplats, dégradés,
  ombres douces) et des **couleurs de manuel** (`ANAT` dans `prostate.tsx` : peau chair, graisse jaune, os blanc cassé,
  muscle et rectum rouges, vessie orange, urine jaune, prostate violette, vésicule séminale saumon, corps caverneux violet
  clair, corps spongieux / gland roses, testicule blanc ; **exception à la palette, validée** par le propriétaire). Formes
  vraies (prostate en cône inversé sous la vessie, sacrum courbe, rectum qui suit le sacrum puis canal anal, gland plus
  large que la tige avec couronne et méat…). **Cadrer sur ce dont on parle** (ici la prostate et ses voisins : pas de
  cuisse) et montrer correctement les éléments du corps autour (péritoine, diaphragme uro-génital, symphyse, canal
  déférent…). **Parler au spectateur pour la rétention** (demandé) : « tu » pour les sujets qui
  concernent tout le monde ; pour un sujet qui ne touche pas directement le public (étudiants infirmiers, jeunes), passer
  par un proche : ici **« ton père »** (« …ton père se lève pour aller aux toilettes… Et il te dit : c'est l'âge… »,
  chute « Alors, va lui en parler : à partir de cinquante ans… »). Ne jamais promettre un diagnostic faux pour faire peur
  (les levers la nuit = le plus souvent un adénome). Voix : « parles-en avec lui » était entendu « parlons avec lui » →
  « va lui en parler ».

## Voix ElevenLabs « Laura » (choisie par le propriétaire pour les nouvelles vidéos)

- Connecteur ElevenLabs : voix `Laura` (`MmafIMKg28Wr0yMh8CEB`), modèle `eleven_v4`, flow `6O4tHaBowSG52722wkdC`.
  `creative_generate_speech` avec **tout le texte en une fois**. Balises de jeu `[amused]`, `[sarcastic]`,
  `[confident]`, `[warmly]`, `[excited]`. `[pause]` entre les parties. Nombres en lettres.
- Puis `creative_get_flow_run_status` pour récupérer la prise, et `curl` de `content_url`. Alignement :
  `python3 scripts/voice/align_voice.py laura.mp3 voix/<n>.script.json <épisode> --model medium` (dépendances :
  `pip install --break-system-packages soundfile faster-whisper`). Contrôle : `npm run check:voice -- <épisode>
  --model medium`.
- Coût : ≈ 1 crédit par caractère et par prise (2 prises par défaut). « Free generations are busy » signifie qu'une
  prise n'a pas démarré et n'a rien coûté. **Ne jamais relancer dans le même tour** (chaque appel est facturé).
- Demandé : épeler **plus vite** les sigles lus lettre par lettre (« SpO2 » : trop de blanc entre les lettres).
  - Testé : **sigle collé en majuscules** (SHA 0,56 s, OPCT 0,74 s, SPO2 1,0 s). C'est le plus rapide, contre 0,6 / 0,8
    / 1,5 s avec des points (S.H.A.) et 0,9 / 1,3 / 1,3 s avec des tirets (S-H-A).
  - Un sigle qui se dit comme un mot s'écrit en minuscules dans le texte envoyé (« sac Dasri »).
- `[pause]` ne laisse que 0,3 à 0,45 s entre deux parties, alors qu'une transition dure 14 images (0,47 s). Allonger les
  blancs à 0,8 s :
  1. aligner une première fois ;
  2. `python3 scripts/voice/pad_parts.py voix48.wav src/videos/<épisode>/voice.json voix-allongee.wav 0.8` ;
  3. réaligner `voix-allongee.wav`.
- **Changer une seule partie d'une voix Laura déjà calée** (fait pour la tique) : générer la partie seule (≈ 1 crédit par
  caractère), couper ses blancs, la mettre au niveau (RMS) de l'ancienne, remplacer le créneau `sections` de la partie dans
  `public/voix/<épisode>/voix.wav` (les blancs autour restent), puis réaligner tout le wav avec `align_voice.py`.
- Plusieurs générations lancées d'un coup : ElevenLabs en met une partie en attente (« concurrency limit ») et les relance
  tout seul, sans rien facturer de plus : il suffit d'attendre.
- `align_voice.py` remplace les `{affiché|prononcé}` **avant** de découper le texte : un sigle collé à une apostrophe
  (« l'{EVA|É V A}, ») était coupé en faux mots et `at(scène, "l'eva")` plantait le rendu.
- **`align_voice.py` n'amorce plus Whisper avec le script** (`--prompt` pour le remettre). Avec l'amorce, Whisper avait
  sauté les 25 premières secondes de la voix Laura. L'outil affiche maintenant le taux de mots reconnus et prévient
  sous 80 %.
- Skills installés (`.claude/skills/`, `skills-lock.json`) : `remotion-best-practices` (règles Remotion, effets,
  flou de mouvement, transitions, voix off…) et `motion-design` (LottieFiles). Le propriétaire autorise à installer
  les skills utiles sans demander.

## Vidéo promo (modèle `Quiz-Constantes`, `src/videos/quiz-constantes/`)

- Demandé : annoncer que les vidéos d'une série sont toutes sorties et envoyer vers le **quiz gratuit du site
  lapetiteide.fr (lien en bio)**. ≈ 1 min 10, sans barre de progression (`progress={false}`). La règle « pas de quiz dans
  les vidéos » vaut pour les vidéos de cours : ici le propriétaire a demandé de faire la promo de son quiz.
- Accroche **« quiz éclair »** : 4 questions, 3 secondes chacune, le spectateur répond dans sa tête pendant un vrai
  silence de la voix (`[pause 2.6]` au milieu d'une partie : `tts_voix.py` coupe la partie, insère le silence, garde le
  timing mot à mot) ; chrono 3 · 2 · 1 (tic), bonne réponse bleue ✓ (ding), l'autre rose ✕, explication ; une question
  piège (une valeur normale). Puis les 7 vidéos (tuiles qui se cochent, « n / 7 »), un téléphone qui ouvre le quiz du site
  (le doigt touche la bonne réponse), « lapetiteide.fr » en grand + flèche « lien en bio », défi « tu vas en avoir
  combien ? ». Voix : « {lapetiteide.fr|la petite I, D, E, point F R} » ; « Piège ! » seul était entendu « Peach » →
  « Eh non, c'est un piège : … » ; « Tu as hésité ? » seul partait en anglais → « Si tu as hésité, … ».

## Planches anatomiques « La Petite IDE » (demandé : dessiner les organes à notre façon, un organe à la fois)

- **Une image simple par étape, comme si on enlevait un calque à chaque fois** (le propriétaire a refusé une première
  version qui mettait tout dans un seul dessin). Poumons (`src/brand/chest.tsx` + `lungs.tsx`) : 1 le patient →
  2 la cage thoracique `RibsLayer` → 3 les poumons vus de l'extérieur `LungsOutLayer` (lobes, plèvre brillante, trachée
  + larynx, cœur, diaphragme) → 4 l'intérieur `LungsInLayer` (trachée, bronches, bronchioles, grappes d'alvéoles, l'air
  qui descend) → 5 `AlveoliZoom` (grappes + vaisseaux, O₂) → 6 `AlveolusExchange` (une alvéole + son vaisseau : O₂ dans
  le sang, CO₂ dans l'air). Chaque couche est dans le repère du `Patient` (400 × 560) : posée sur lui, à la même taille.
  `ChestPeel` (`peel` 0 → 3) : la ligne de la « radio » descend et enlève une couche par unité, au mot près.
  BPCO : `copd` (poumons distendus et plus sombres, bulles d'emphysème, bronches roses épaissies, mucus, air piégé),
  `AirwayCross` (bronche en coupe : saine → enflammée, muscle contracté, mucus qui coule), `ZoomBubble` (loupe reliée
  au point grossi, ancrée à l'écran avec `camAt(...).view()`).
- Planches de contrôle : composition `Planche-Poumons` (`--props='{"page":1}'` étapes, `2` avec la BPCO, `3` la radio).
- Prochaines planches demandées, même principe : le cerveau, le cœur, etc.

## Bruitages réels (demandé : « tes bruitages ne sont pas réalistes »)

- Les bruits du corps et des objets sont de **vrais enregistrements** : La Sonothèque (gratuits, libres de droits, usage
  commercial, attribution non obligatoire) + la toux fournie par le propriétaire. `public/sfx/SOURCES.md`,
  `npm run sfx:import` (retélécharge, coupe, met à -1 dBFS). Noms : `cough` (quinte), `cough-1`, `cough-2`, `gasp`
  (essoufflement), `puff` (inhalateur), `lighter`, `smoke` (bouffée), `blow` (souffle fort), `sigh`, `stairs`. Les sons
  synthétisés ne servent qu'aux effets d'interface (whoosh, pop, tick, stamp…). Un bruitage plus long qu'une seconde
  n'est plus coupé par défaut (`LENGTH` dans `Sfx.tsx`). Ne pas resynthétiser un bruit du corps : en chercher un vrai.

## Format « série » (demandé : un sujet trop long = plusieurs parties, modèle `Plaies-1/2/3`)

- Un sujet riche se découpe en **parties de ≈ 1 min 10 – 1 min 30** (jamais < 1 min) : `src/videos/plaies-1/`, `-2/`,
  `-3/` (« Les plaies » : les bases · les plaies aiguës · les plaies chroniques), storyboard `docs/lpi/storyboard-plaies-serie.md`.
- **Rythme d'apprentissage** (demandé : « on apprend ou on réapprend la notion ») : voix `"rate": "+0%"` (au lieu de +8 %),
  une notion par scène, chaque terme technique suivi tout de suite d'une explication simple (« l'excoriation : c'est une
  éraflure »), le visuel montre ce que dit la phrase, peu de mots par seconde.
- Chaque partie : **accroche propre** (elle doit tenir seule : « 3 jours… ou des mois ? », « Ce petit trou… plus
  dangereux qu'une grande coupure ? », « Cette plaie… ne fait pas mal ») → **annonce de la partie** juste après
  (« Nous voilà dans la partie un de notre série sur les plaies ! ») avec la carte `SeriesParts` (`src/brand/series.tsx` :
  parties vues cochées, partie en cours « ICI », suivantes avec cadenas) → notions → récap + carte `NextUp` « À suivre ·
  partie N » avec une phrase qui donne envie (« … et la brûlure qui ne fait pas mal ») ; dernière partie : « série
  terminée ». Étiquette `SeriesTag` (« LES PLAIES 1/3 ») sur la ligne du sur-titre pendant les notions.
- Briques plaies `wound.tsx` : `SkinBlock` / `SkinAt` + `skinPt` (coupe de peau : épiderme, derme, hypoderme, muscle,
  os ; plaie `shape` éraflure / coupure / déchirure / piqûre / morsure / cratère, `depth` 0 → 5, sutures, microbes,
  saleté, nerfs + douleur, brûlure 0 → 3, cloque, rougeur + doigt qui appuie), `SkinLabels`, `WoundTool` (graviers qui
  frottent, couteau, déchirure, clou, dents, bistouri), `Squeeze` (escarre entre l'os et le matelas, étiquetée),
  `LyingBody` (points d'appui), `LowerLeg` (varices, ulcère, pied diabétique, escarre du talon), `Finger`, pictos de
  gravité ; `StagePill` (pastille dans le socle) exportée par `episode.tsx`. Plaie = rose, nécrose / peau carbonisée =
  bleu nuit (pas de rouge, jaune ni noir). Laisser de la place au-dessus de la peau pour un doigt ou un objet (la caméra
  ne montre rien au-dessus du contenu).
- Voix : « Cette plaie ne fait pas mal » est entendu « Cette **plaine** fait pas mal » → « Cette plaie… ne fait pas mal »
  (une pause casse la liaison) ; relire l'accroche au modèle `medium` de faster-whisper.
- 2e série, **v2** (accroches refaites, voix Laura, look 2026, voir le storyboard) : partie 1 accroche **« trois soignants,
  trois avis »** (« Pour l'un, il a un peu mal. Pour l'autre, il exagère… Et lui ? Personne ne lui a demandé ! »), partie 2
  accroche **« elle ne se plaint jamais »** (Madame Martin, 87 ans ; « Donc, elle n'a pas mal ? Faux ! Regarde mieux… »,
  elle revient soulagée à la fin). Ce qui suit décrit la v1.
- 2e série : « La douleur : échelles d'évaluation » (`src/videos/douleur-1/`, `-2/`, storyboard
  `docs/lpi/storyboard-douleur-serie.md`) — partie 1 l'auto-évaluation (EN, EVA recto / verso, EVS, visages dès 4 ans, seuil
  ≥ 4/10 → on soulage, on réévalue avec la même échelle, on note), partie 2 l'hétéro-évaluation (Algoplus ≥ 2/5, Doloplus
  ≥ 5/30, BPS en réanimation, EVENDOL < 7 ans ≥ 4/15). Deux accroches nouvelles : **« question au spectateur »** (« De zéro à
  dix… tu as mal à combien, là, maintenant ? », le doigt hésite sur l'échelle, « 4 ! », tampon ÉVALUÉE) et **« patient
  muet »** (choisie par le propriétaire : « Il ne peut plus parler… et pourtant, il souffre. Comment le savoir ? », bulle
  vide barrée, tampon « Ça se mesure ! »). Briques `pain.tsx` (v2) : `Ruler` (`pos`, `flip`),
  `PainFace` (sans sourire ni larmes), `Kid` (enfant : pleure, montre, s'agite, se recroqueville), `Ventilator`,
  `ScoreBar` (seuil), `Bubble`, `TalkIcon` / `MuteIcon`, `PAIN_PARTS` ;
  `Patient` : `elder` (personne âgée). Voix : « l'{EVA|É V A} » (un « E V A » était entendu « le VA »), « on utilise
  l'échelle {EVENDOL|Évendol} » (après « utilise » seul, la liaison donnait « les vandales »), « À partir de cinq sur
  trente » (« Dès cinq » était entendu « dessin »).

## Format « liste à retenir » (des règles numérotées, modèle `Hygiene-Mains`, `src/videos/hygiene-mains/`)

- « Les 5 indications de l'hygiène des mains » (OMS) : accroche-choc proposée par le propriétaire (« Tes mains transportent
  des milliers de microbes… et tu ne vois absolument rien. ») + révélation (une loupe glisse sur la main, la caméra plonge
  dedans : « les voilà ! »), transmission au patient, STOP, « 1 · 2 · 3 · 4 · 5 », titre. Puis une **astuce pour retenir**
  avant la liste (« 2 avant · 3 après » : deux cartes bleue / rose), **une scène par élément** avec le même gabarit
  (`Indication` dans `Scenes.tsx` : titre, socle illustré, pastille AVANT / APRÈS + « protège : … », suivi `StepTracker`
  des 5 en bas), le bon geste (friction SHA 20 – 30 s jusqu'à mains sèches, eau + savon si mains visiblement sales), récap.
  Voix : accroche `+6%`, notions `+0%` (rythme d'apprentissage), ≈ 1 min 32. « On zoome » était entendu « On boom » →
  « On regarde de plus près ».
- Briques `hands.tsx` : `Microbe` (rond, cils, yeux : rose = les tiens, bleu clair = ceux du patient), `Swarm` (essaim
  qui arrive / disparaît), `Sparkles` (mains propres), `Loupe`, `Drop` (sang / urines / salive), `Bed`, `BedTable`,
  `IvPump`, `Faucet` (eau + savon), `StepTracker` ; + `Hand` (gantée ou non), `ShaBottle`, `Arm` de `sampling.tsx`.

- 2e modèle « liste à retenir » : `Precautions-Standard` (`src/videos/precautions-standard/`, SF2H 2017) — accroche
  **« deux patients »** : « L'un tousse… l'autre a l'air en pleine forme. Lequel peut te transmettre un microbe ? Les
  deux ! Et impossible de le voir. » (image 0 : les deux patients + « Lequel peut te contaminer ? » ; microbes révélés sur
  les deux, flash ; même bouclier pour chacun) → « 6 réflexes, pour tous » (même ceux en pleine forme ; protège le patient
  et toi) → un réflexe par scène (gabarit `Reflex` + suivi `ReflexTracker` des 6) : mains (SHA, avant-bras dégagés,
  ongles courts sans vernis, aucun bijou), EPI (gants si sang / liquide du corps, tablier si soin mouillant ou souillant,
  masque + lunettes si risque de projection), patient qui tousse (masque, coude, mouchoir jeté), piqûres / AES (jamais
  recapuchonner, collecteur à portée de main ; si piqûre : laver, désinfecter, consulter vite), excreta (gants, tablier,
  pas de douchette : lave-bassin), environnement (surfaces + matériel nettoyés et désinfectés, linge et déchets dans la
  bonne filière) → récap. Briques `precautions.tsx` : `Wear` (masque, lunettes, tablier enfilés sur le `Patient`),
  `CoughSpray`, `Syringe` + `NeedleCap`, `Bedpan`, `ShowerHead`, `SprayBottle`, `LaundryBag`, `Tissue`, `Bin`,
  `WatchShape` / `RingShape` (sur `Hand`), `ReflexIcon`, `ReflexTracker`.

## Format « inventaire » (le matériel d'un soin, modèle `Prise-De-Sang`, `src/videos/prise-de-sang/`)

- **v2 (demandée : « refaire avec les nouveaux modules »)**, même contenu que la v1, qui reste au commit `05ef5c9`.
  - Look 2026 : une idée par plan, objets en plein cadre, aplat de couleur par famille (1 bleu clair, 2 rose, 3 bleu avec
    titres blanc cassé et accent bleu nuit).
  - Carte « chiffre géant » (`BigNumber`) au début de chaque famille ; vrai flou de mouvement sur ce qui entre, sort ou
    tombe.
  - Un 13 géant qui compte puis claque sur « Ça fait beaucoup ? ».
  - En haut : pastille de la famille en cours + compteur MATÉRIEL n / 13 (`TopBar` dans `PriseDeSang.tsx`), sans barre
    de progression.
  - Récap : le plateau revient et chaque bande se coche.
  - Voix Laura. Storyboard `docs/lpi/storyboard-prise-de-sang.md`.
  - Ce qui suit décrit la v1 (déroulé et vocabulaire toujours valables).

- Demandé : l'accroche pose **tout le matériel devant nos yeux** (plateau en 3 familles numérotées, les 13 objets tombent
  à leur place en 1,5 s, chacun avec son nom), « Ça, c'est le matériel qu'il te faut pour… », « 13 objets ! », « on
  reprend tout, un par un » (les familles s'allument), puis plongée dans la famille 1.
- Ensuite **un objet = un gros plan + une phrase simple** (à quoi il sert, un détail qui fait retenir : « deux pointes :
  une pour la veine, une pour le tube », « dedans, il y a du vide », « jamais recapuchonner ! »), une famille ou deux
  objets par scène, la liste `Checklist` qui se coche sous le socle, compteur « MATÉRIEL n / 13 » (`ItemCounter`) sur
  la ligne du sur-titre ; amusant mais sérieux, rythme d'apprentissage (voix +0 %), ≈ 1 min 25.
- Briques `sampling.tsx` : `VacuNeedle` (2 pointes, manchon, capuchon), `Holder` (porte-tube), `Butterfly` (ailettes qui
  battent), `BloodTube` (bouchon de couleur, sang qui monte, flèches du vide, trait de remplissage), `ShaBottle`, `Hand`
  (gantée ou non), `AntisepticBottle`, `Gauze` (stérile : sachet), `Plaster`, `TourniquetStrap`, `SharpsBox` (aiguille
  qui tombe dedans), `DasriBag`, `Arm` (veine qui gonfle, garrot au-dessus du point de ponction, désinfection, aiguille,
  compresse, pansement). Couleurs : bouchons et collecteur aux couleurs de la marque (pas de jaune ni de violet).
- Vocabulaire (demandé) : **corps de pompe** (= le porte-tube), jamais « corps de prélèvement ». Déchets (refaits à la
  demande : barre mal placée, sac DASRI caché par les objets) : deux colonnes collecteur à OPCT / sac DASRI, cartes P · C · T
  qui volent dans la fente, panneau d'interdiction centré sur le capuchon (pas de barre), objets dessinés **avant** le sac
  et qui tombent depuis le haut du socle (jamais par-dessus le sac ni sous une pastille).

## Format « histoire » (mystérieux, essai `AVC-Histoire`, `src/videos/avc-histoire/`)

- Pour un accident ou une maladie racontés comme une histoire (pas un paramètre, pas un soin) : ≈ 1 min 20, un patient
  prénommé (Michel, 64 ans), **fausse piste** (« juste la fatigue, ça va passer ») puis **révélation**, un « pourquoi »
  qui intrigue (pourquoi d'un seul côté ?), fin courte et émotionnelle. Pas de récap, pas de barre de progression
  (`<Episode progress={false}>`), mascotte discrète sous le cadre (spectatrice qui réagit, `L`/`R` à y 1730, 330 px).
- Accroche = une phrase énigmatique déjà à l'écran sur l'image 0 (« La moitié de son sourire vient de disparaître. »)
  + gros plan, puis retour en arrière (« 07 H 41 · UNE MINUTE AVANT »). Voix un peu plus posée (`"rate": "+2%"`).
- Briques `night.tsx` : `NightBg` (bleu nuit, halo qui respire, grille, poussières), `ScanFrame` (cadre de scanner :
  coins, point rose qui pulse, étiquette lieu · heure), `Glow` (lueur autour des dessins au trait), `NightFlash`,
  `Scramble` (mots qui se mélangent). Une phrase clé à la fois en blanc, mots accentués en rose (`Title accent`).
  Transitions : plongées `zoomInto({…, color: LPI.navy})` en alternance avec `whip`.
- Bulles et pastilles fixes **hors** de la `ZoomCam` (sinon rognées quand la caméra s'approche).

## Recette express (toute nouvelle vidéo)

1. `voix/<n>-<sujet>.script.json` (texte exact, une partie par scène) → `npm run voice -- voix/… <épisode>` (2 min)
   → `npm run check:voice -- <épisode>` (langue + transcription de chaque partie ; `--model medium --parts intro`
   pour un passage douteux).
2. `npm run new -- <épisode> <Composition> <Composant> <n>` : dossier `src/videos/<épisode>/` (timeline, composition
   avec transitions en alternance, scènes et mascotte à remplir) + déclarations (Root.tsx, check-mascot, `render:<épisode>`).
   `npm run cues -- <épisode>` donne les frames de chaque mot (= `at(scène, mot)`) : plus besoin de les calculer.
3. **Corps humain = `Patient`** (`src/brand/patient.tsx`, validé) : patient de face, visage qui cligne (`mood` calme / content /
   mal), calques 0 → 1 (cœur qui bat, artères, brassard gonflé, rougeur, pâleur, sueurs, maux de tête, vertiges) et
   points du corps `patientPoint()` pour poser repères et loupes. Ne plus utiliser l'ancien buste `Chest`.
   Briques prêtes (`src/brand/`) : `episode.tsx` (mise en page `LAY`, `Head`, `Unit`, `Tag`, `BigNum`,
   `CauseChip`, `Stopwatch`, `RecapScene`, `EndCard`, composition `Episode`, places `SPOT`, `runAcross`),
   `cardio.tsx` (battements, ECG, cœur qui bat, onde de pouls), `breath.tsx` (respiration, poumons, thorax,
   tracé respiratoire), `pressure.tsx` (normes PA, manomètre, lecture 120/80 mmHg), `glyco.tsx` (normes glycémie, doigt + autopiqueur,
   lecteur de glycémie en g/l, sucres, cellule « carburant »), `urine.tsx` (normes diurèse, bocal gradué goutte à goutte,
   horloge 24 h, appareil urinaire reins → vessie), `thermo.tsx` (zones de température, thermomètre + °C qui roule, jauge froid ↔ chaud,
   ondes de chaleur, flocons), `body.tsx` (poignet, doigts, pouce), `icons.tsx` (effort, fièvre, stress, douleur,
   anxiété, médicament, sommeil, sportif, œil, sueurs, visage rouge, pâleur, frissons, maux de tête, oreille, vertiges, malaise,
   soif, urines, fatigue, tremblements, faim), `NormScale`, `TermSlam`, `Stage`, kit (`Stamp`, `CheckChip`…), `Pill` (mot = explication : TA = PA, mmHg, g/l) et
   `Lead` (« parfois : », « le patient peut avoir… » avant une liste de signes) dans `episode.tsx`.
   Signes cliniques : pastilles `CauseChip` en 2 colonnes (72 / 560, y 1240 / 1356) et la mascotte reste d'un côté
   (cuts, pas de saut par-dessus) ; les poses en pied (`poses/…`) sont hautes : les placer bas et plus petites.
   Titres : l'accent `*mot*` se met **mot par mot** (`Sur *24* *heures*`, pas `*24 heures*`).
   **Caméra** (demandé) : on s'approche de ce dont parle la voix (visage, cœur, mains, écran du DAE…) avec
   `ZoomCam` + clés `CamKey` (`episode.tsx` : `{at, s, x, y, dur}`, jamais de vide au bord) posé dans le `Stage` ;
   pastilles, chrono, moniteur restent fixes par-dessus ; `camAt(...).view()` fait suivre une étiquette à l'organe.
   Pour changer de point de vue (face → profil) : plonger (zoom ×3) puis fondu enchaîné sur le gros plan.
4. Contrôle : `npm run check:mascot -- <épisode>` → `npm run qa -- <Composition> <frames…>` (images clés + planches
   `out/qa/sheet*.jpg`) → relecture → `npm run render:<épisode>` → `npm run sheet -- out/<vidéo>.mp4` (1 image/s).

## Rendu et contrôle

- Navigateur sans interface et 4 rendus en parallèle réglés dans `remotion.config.ts` (le navigateur est cherché dans
  `/opt/pw-browsers`, quelle que soit sa version ; idem pour `npm run qa`) : `npm run render:<vidéo>` ou
  `npx remotion render <Comp> …` suffisent. Nouveau conteneur : `npm ci` puis `pip install --break-system-packages edge-tts
  faster-whisper` avant tout. ≈ 3,5 s de calcul par seconde de vidéo (pas de 3D : trop lente).
- Avant tout rendu complet : `npm run check:mascot -- <vidéo>`, puis `npm run qa -- <Composition> <frames…>`,
  planches relues une par une.
- **Retouche d'une vidéo déjà livrée** (demandé) : ne recalculer que les images qui changent puis les recoller.
  Voix : remplacer le mot dans son créneau (nouvelle prise edge-tts du passage, même niveau, sans décaler la suite ;
  garder les fins de partie de voice.json pour ne pas changer la durée) ; `npx remotion render <Comp> seg.mp4
  --frames=<début>-<fin>` pour chaque portion où le texte ou le son change (un élément qui reste affiché jusqu'à la
  fin de sa scène compte jusqu'à la fin de la transition suivante) ; puis `npm run splice -- out/<vidéo>.mp4
  seg.mp4@<début> …` (image + son, durée inchangée, vérifie le nombre d'images).
- **Corriger une phrase de la voix** (mot mal lu, passage en anglais) : `npm run voice -- voix/<n>-x.script.json
  <épisode> --swap <partie> "ancienne phrase" "nouvelle"` (nouvelle prise dans le même créneau, même niveau, durée
  inchangée ; affiche les images dont le son change) → recalculer de la fin du mot d'avant au silence suivant, puis
  `npm run splice -- out/<vidéo>.mp4 seg.mp4@<début>`.
- **Nouvelle accroche sur une vidéo déjà rendue** (fait pour la TA) : `npm run voice -- voix/<n>-x.script.json <épisode>
  --only intro` refait la voix de cette seule partie (même niveau) ; le reste du son est gardé à l'échantillon près et
  décalé d'un nombre entier d'images N (affiché). Réécrire `Hook` + les étapes de mascotte de l'accroche, puis rendre la
  tête jusqu'à ~15 images après le début de la scène 2 (transition finie, mascotte cachée) : `--frames=0-<début2+15>`,
  et `npm run splice -- out/<vidéo>.mp4 tete.mp4@0:<ancien début2+16>` (la suite de l'ancienne vidéo est gardée ;
  vérifier le raccord : PSNR ≈ 50 dB entre la nouvelle image et l'ancienne). Le léger balancement de la mascotte suit
  l'horloge globale : si elle est visible au raccord (PSNR < 45 dB), couper plus loin, quand elle est hors écran (ex.
  glycémie : après sa sortie au début de « mesure », `tete.mp4@0:92 suite.mp4@92:349`).
- Livrer : **le MP4 seul** dans `out/` (non versionné). Plus de version web ni de couverture (demandé).
  Faire le ménage de `out/` (QA, anciens rendus) pour ne garder que les vidéos finales.
