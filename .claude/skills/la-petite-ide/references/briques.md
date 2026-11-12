# Briques réutilisables (`src/brand/`)

Généré par `python3 scripts/brand/catalog.py` : à relancer après avoir ajouté ou retiré une brique.
Les props exactes sont dans le fichier source (lire le commentaire au-dessus de l'export).

## `Lesson3.tsx`
Gabarit « fiche » v3 : numéro qui s'écrase puis file dans le coin, titre en 2 lignes, illustration vivante sur un socle, termes techniques qui « claquent » au centre puis se rangent dans la fiche, mascotte qui surgit de sa pastille. Caméra qui accuse chaque terme.

- `L3`
- `scaleY` — haut de l'échelle des normes, juste sous le socle
- `Term3`
- `Lesson3`
- `StatePill` — Pastille d'état (icône + quelques mots du script) qui change avec un petit « pop ».
- `NormRibbon` — Repère « adulte » : petit bandeau centré à cheval sur le bas du socle, discret mais lisible.
- `Seuil` — Seuil chiffré dans la définition d'un terme (ex. « > 38 °C »).

## `MascotActor.tsx`
La mascotte « actrice » : elle se déplace sur TOUT l'écran, change d'expression au mot près. Deux façons de l'afficher, sans jamais montrer une coupe disgracieuse : - les bustes (expressions, gestes, situations, accessoires) dans une CARTE-RÉACTION : tuile arrondie dont les bords coïncident avec les bords coupés du dessin d'origine ; la tête dépasse en haut ; - les poses en pied (debout, course, marche, assise…) libres, posées sur leurs pieds, avec ombre au sol. Physique (à réutiliser pour toutes les vidéos, voir docs/lpi/charte-video.md « Tempo et physique ») : - `pop`  : rétrécit sur place (6 frames, petite anticipation +8 %) puis ressort ailleurs AU MOT (ressort amorti, dépassement ~12 %) — pour rejoindre un terme qui claque ; - `hop`  : accroupie 3 frames, saut en arc (hauteur ∝ distance) centré sur le mot, étirement en l'air, écrasement amorti à l'atterrissage ; - `run`  : course (pose « course », toujours vers la droite : on ne retourne jamais l'image) ; - `cut`  : changement d'expression sur place + écrasement / étirement ; - repos  : respiration (±1,5 %) et flottement lent, jamais immobile ; - `fx`   : métaphores physiques du mot (souffle court, frisson, colère, lenteur, joie).

- `Mood`
- `Via`
- `Fx`
- `Beat` — Une étape du jeu de la mascotte (frames absolues de la composition).
- `MascotKey` — Toutes les images de la mascotte (clés du manifeste).
- `ReactionCard` — Carte-réaction : tuile arrondie + buste dont la tête dépasse.
- `planBeats` — Pré-calcule départ / atterrissage de chaque étape.
- `FreeBust` — Buste LIBRE (sans cadre) : détouré, liseré blanc « sticker », bas coupé adouci par un fondu.
- `MascotActor`
- `beatMoves` — Liste des instants où la mascotte bouge (pour les bruitages).

## `MascotCardsTest.tsx`
Planche de contrôle : toutes les expressions en cartes-réactions (vérifier qu'aucune coupe ne se voit).

- `MascotCardsTest`

## `NormScale.tsx`
Échelle des normes (adulte) : zones nommées (hypo / normo / hyper…), bornes chiffrées sous chaque zone, curseur qui suit la valeur animée de l'illustration ; la zone où se trouve le curseur s'allume. L'axe n'est pas linéaire : chaque zone a sa largeur (lisibilité), le curseur est placé dans sa zone.

- `ZoneTone`
- `Zone`
- `NormScale`

## `Sfx.tsx`

- `SfxName`
- `SfxEnabled` — Permet de couper tous les bruitages d'une vidéo (ex. version « voix seule »).
- `Sfx` — Joue un bruitage à une frame donnée (relative à la scène).

## `arrest.tsx`
Briques « arrêt cardiaque » réutilisables : moniteur ECG (rythme normal, fibrillation ventriculaire, tracé plat, choc), défibrillateur (DAE) et électrodes, mains du sauveteur qui massent + jauge de profondeur, bascule de la tête en arrière (vue de profil : main sur le front, deux doigts sous le menton).

- `Rhythm`
- `EcgMonitor` — Moniteur ECG : `rhythm(t)` donne le rythme à chaque instant ; la tête d'écriture balaie de gauche à droite.
- `Aed` — Défibrillateur automatisé externe : boîtier rose, cœur + éclair, petit écran qui parle (`msg`), bouton de choc.
- `Pad` — Électrode collée sur le torse (dans l'espace du `Patient`, viewBox 400 × 560).
- `CprHands` — Mains croisées du sauveteur, bras tendus depuis le côté droit (il est agenouillé à côté ; espace du `Patient`) : `press` 0 → 1 enfonce.
- `DepthGauge` — Jauge de profondeur « 5 – 6 cm » : le curseur descend avec `press`.
- `HeadTilt` — Bascule de la tête en arrière, vue de profil : patient allongé sur le dos (tête à gauche, visage vers le haut).

## `bandage.tsx`
« Comment bien mettre un pansement » : grand doigt vu de dessus (rendu soigné : peau opaque en dégradé, ongle, plis, ombre douce), petite coupure, goutte, eau / mousse, compresse qui tamponne ; pansement adhésif vu de dessus (bande microperforée, carré blanc = compresse, deux languettes de protection qui se décollent l'une après l'autre, enroulé autour du doigt) ; doigt de l'autre main qui lisse et appuie ; anneau-cible pointillé. Couleurs de la marque uniquement.

- `FINGER` — Repère 1000 × 400 du grand doigt : axe du doigt, bords, coupure (sur la 2e phalange).
- `fingerPt` — Point du repère du doigt → écran, pour un `BigFinger` de largeur `width` posé en (`left`, `top`).
- `BigFinger` — Grand index vu de dessus, pointé vers la droite (repère 1000 × 400, la main sort du cadre à gauche).
- `BandageG` — Pansement adhésif vu de dessus, à dessiner DANS un `BigFinger` (même repère) : grand axe vertical, centre (`x`, `y`), `rot` degrés.
- `Presser` — Doigt de l'autre main qui arrive d'en haut (dessiné dans le repère d'un `BigFinger`) : bout en (`x`, `y`), `press` 0 → 1 il appuie (il s'écrase un peu, anneau sur la peau).
- `TargetRing` — Anneau-cible pointillé qui tourne et respire (dans un repère SVG) ; `tone` rose (plaie) ou bleu (compresse).
- `WashFx` — Mousse de savon + gouttes d'eau qui tombent sur la coupure (repère d'un `BigFinger`), `on` 0 → 1.
- `DabPad` — Compresse tenue entre deux doigts qui tamponne la coupure (repère d'un `BigFinger`) : `dab` 0 → 1 (descend / remonte).

## `body.tsx`
Corps (trait bleu nuit, aplats de la palette) : poignet paume vers le haut avec artère radiale, doigts de l'examinateur qui prennent le pouls, pouce barré. Réutilisés d'une vidéo à l'autre.

- `RADIAL` — point du pouls radial dans le repère du poignet
- `Wrist` — Avant-bras + main paume vers le haut ; `artery` 0 → 1 dessine l'artère, `pulse` fait battre le point.
- `PressFingers` — Deux doigts de l'examinateur (index + majeur) qui descendent appuyer sur le pouls.
- `CrossedThumb` — Pouce de l'examinateur, barré : « il a son propre pouls ».

## `bold.tsx`
Kit « look 2026 » : gros titres plein cadre, aplats de couleur, objets qui entrent et sortent avec un VRAI flou de mouvement. Règle du flou (@remotion/motion-blur, `CameraMotionBlur`) : il rejoue ses enfants à des images légèrement passées (`Freeze`) ; seul ce qui appelle `useCurrentFrame()` À L'INTÉRIEUR du calque bouge d'un échantillon à l'autre. Une position calculée dans le composant parent est la même pour tous les échantillons : aucun flou. D'où `Live` (rendu en fonction de l'image) et `Fly` (pose en fonction de l'image), toujours évalués dans le calque `Blur`.

- `ease`
- `fadeIn`
- `popAt` — Ressort (~12 % de dépassement), comme les pops du pilote.
- `Blur` — Calque de flou de mouvement (désactivé quand rien ne bouge : `on={false}` rend la même chose, sans coût).
- `Live` — Rendu en fonction de l'image (à mettre dans `Blur` : chaque échantillon a sa propre image).
- `Pose`
- `Posed` — Objet centré sur (x, y) dont la pose vient d'une fonction de l'image (évaluée dans le calque flou).
- `flyPose` — Pose d'un objet qui entre en trombe à `at` (depuis `from`, avec un léger dépassement), reste posé, puis ressort en accélérant à `out` (vers `to`).
- `moving` — Le flou ne sert que pendant l'entrée et la sortie : on le coupe le reste du temps (rendu bien plus rapide).
- `Fly` — Objet qui entre / sort en trombe avec un vrai flou de mouvement.
- `FlatBg` — Fond en aplat (couleur de la famille) avec deux grands disques clairs qui respirent lentement.
- `Big` — Grand titre plein cadre (une idée par plan) ; fondu de sortie à `to`.
- `Note` — Pastille d'explication centrée (gros texte), qui sort en fondu à `to`.
- `BigNumber` — Carte de famille plein cadre : un chiffre géant qui claque, le nom de la famille dessous.
- `ToneBg` — Aplat d'une scène posé sur le blanc cassé (un ton transparent ne laisse jamais voir du noir).
- `Flash` — Flash plein écran (choc) qui retombe.
- `PointTag` — Étiquette reliée à un point par un trait pointillé (`dark` : trait clair, sur un aplat foncé).
- `Tick` — Coche rose qui se dessine (0 → 1).
- `RowCard` — Carte pleine largeur qui glisse à `at` : pastille (numéro ou picto), dessin optionnel (`children`), titre, sous-titre (à `subAt`), coche à `check`.
- `TopPill` — Pastille du haut de l'écran (y 54) : à gauche le chapitre en cours (pastille ronde + nom), à droite la série.

## `brain.tsx`
Briques « cerveau / AVC » réutilisables : cerveau de profil (artères où le sang circule, neurones qui scintillent, zone privée de sang où les neurones s'éteignent, caillot, hémorragie) et gros plan d'artère (globules qui circulent, caillot qui bouche, rupture de la paroi, thrombolyse qui dissout, thrombectomie qui retire).

- `BRAIN_ZONE` — zone irriguée par la branche du milieu (privée de sang si caillot)
- `BRAIN_CLOT`
- `BRAIN_BLEED`
- `BrainProps`
- `Brain`
- `ArteryZoomProps`
- `ArteryZoom`

## `breath.tsx`
Briques « respiration » réutilisables : rythme respiratoire qui change sans à-coup (phase intégrée), poumons qui respirent, particules d'air, thorax qui se soulève, tracé respiratoire qui défile.

- `BreathSegments` — Segments [frame de début, période d'un cycle en frames] → phase intégrée (nombre de cycles depuis 0).
- `breathPhase`
- `breathAt` — État de la respiration à une frame : souffle 0 → 1 (× amplitude), inspiration ou expiration, progression q.
- `cyclesSince` — Cycles complets entre `from` et la frame courante.
- `Air` — Particules d'air qui entrent (inspiration) ou sortent (expiration) par la trachée.
- `BreathingLungs` — Poumons qui respirent selon `segments` (+ air dans la trachée).
- `Chest` — Buste de patient vu de face : la cage thoracique se soulève et s'élargit à l'inspiration.
- `BreathTrace` — Tracé respiratoire qui défile : une ondulation par cycle, amplitude modulable (ample / superficielle).

## `burn.tsx`
« Comment soigner une petite brûlure ? » : casserole vue de dessus (bord en inox, fond, vapeur), eau du robinet qui coule sur le doigt (dans le repère d'un `BigFinger`), glaçon, beurre, tube de dentifrice, carte « 15 » de la règle des trois quinze, compresse posée sur la brûlure, épingle. Même rendu soigné que bandage.tsx. Couleurs de la marque.

- `HotPanG` — Casserole vue de dessus, dans le repère d'un `BigFinger` (centre (`x`, `y`), rayon `r`) : bord en inox épais, fond plus sombre, eau qui frémit et vapeur ; `hot` 0 → 1 le bord rougit légèrement, ondes de chaleur.
- `CooktopG` — Plaque de cuisson vitrocéramique vue de dessus, dans le repère d'un `BigFinger` : verre bleu nuit avec reflet, rebord, deux foyers (celui du dessous de la casserole, en (`x`, `y`), rougeoie si `on`), un foyer éteint, bandeau tactile.
- `WaterStreamG` — Eau du robinet qui coule sur la brûlure (repère d'un `BigFinger`) : bec de robinet en haut, filet, éclaboussures.
- `GauzeOnG` — Compresse (ou pansement gras) posée à plat sur la brûlure (repère d'un `BigFinger`) ; `greasy` : tulle gras.
- `PinG` — Épingle qui s'approche de la cloque (repère d'un `BigFinger`), `t` 0 → 1.
- `IceCube` — Glaçon (repère 200 × 200) : cube translucide bleu clair, reflets, petite goutte.
- `ButterPat` — Plaquette de beurre (repère 220 × 160) dans son papier.
- `ToothpasteTube` — Tube de dentifrice (repère 260 × 120) avec un petit ruban de pâte.
- `FifteenCard` — Carte « 15 » de la règle des trois quinze : gros 15 + unité, petite légende ; elle « claque » à `pop`.

## `cardio.tsx`
Briques « cœur » réutilisables : calendrier des battements (rythme qui change sans à-coup), impulsion du dernier battement, tracé ECG qui défile (chaque battement = un QRS).

- `beatSchedule` — Battements à partir de segments [frame de début, période en frames | liste de périodes (irrégulier)].
- `lastBeat` — Dernier battement passé : son index et une impulsion 0 → 1 (pour faire « battre » un cœur).
- `EcgTrace` — Tracé ECG : la ligne défile vers la gauche, chaque battement dessine un complexe QRS.
- `BeatingHeart` — Cœur qui bat au rythme des battements, avec une secousse quand il « s'emballe » (`shake` 0 → 1).
- `HeartSfx` — Battements sonores (très bas) à partir de la frame `from`.
- `PulseWave` — Onde de pouls qui défile (montée raide, descente douce) ; `amp` = force, `period` = vitesse.

## `chest.tsx`
Le thorax « couche par couche » (demandé : une image simple par étape, comme si on enlevait un calque à chaque fois). Tout est dessiné dans le repère du `Patient` (400 × 560) : chaque couche se pose exactement sur lui, à la même taille. 1. le patient (habillé : c'est le `Patient` lui-même) 2. `RibsLayer`      la cage thoracique (côtes, sternum, clavicules), les poumons devinés derrière 3. `LungsOutLayer`  les poumons vus de l'extérieur (lobes, plèvre brillante, trachée, cœur, diaphragme) 4. `LungsInLayer`   à l'intérieur : la trachée, les bronches, les bronchioles et les grappes d'alvéoles 5. `AlveoliZoom` (lungs.tsx)  au bout d'une bronchiole : les alvéoles 6. `AlveolusExchange`         une alvéole et son vaisseau : l'O₂ passe dans le sang, le CO₂ ressort `ChestPeel` empile 2 → 4 sur le patient : `peel` 0 → 3, chaque unité enlève une couche (la ligne de la « radio » descend et découvre la couche du dessous). `ChestStep` montre une étape seule, cadrée sur le thorax (planches). BPCO : `copd` sur chaque couche (poumons distendus, plus sombres, bulles à la surface ; bronches enflammées + mucus).

- `CHEST_BOX` — Cadrage du thorax (planches, gros plans).
- `RibsLayer`
- `LungsOutLayer`
- `LungsInLayer`
- `AlveolusExchange` — Une alvéole (grand sac d'air) collée à un vaisseau sanguin (viewBox 400 × 400) : l'O₂ (bleu) passe de l'air au sang et s'accroche aux globules rouges, le CO₂ (bleu nuit) fait le chemin inverse.
- `ChestPeel` — Les couches du thorax posées sur le `Patient` (même `size`, même position) : `peel` 0 → 3 enlève une couche par unité (0 : rien, le patient habillé ; 1 : la cage thoracique ; 2 : les poumons ; 3 : l'intérieur).
- `ChestStep` — Une étape seule (planches, gros plans) : 1 patient, 2 côtes, 3 poumons, 4 intérieur ; cadrée sur le thorax.

## `copd.tsx`
Briques « BPCO » réutilisables : gros plan d'une bronche (paroi qui s'enflamme, mucus, passage qui rétrécit, alvéoles au bout qui se détruisent = emphysème, air qui entre puis reste piégé, bronchodilatateur qui la rouvre), spiromètre (on souffle dans un tube : courbe du volume soufflé, repère à 1 seconde, seuil de 70 %) et inhalateur. L'arbre bronchique vu à travers le thorax est dans le `Patient` (`bronchi`, `narrow`, `trapped`, `cannula`).

- `Bronchus` — Gros plan d'une bronche, vue en long (viewBox 900 × 460, largeur `width`), alvéoles au bout à droite.
- `exhaled` — Volume soufflé (fraction de tout l'air soufflé) au temps s (secondes), sain ou BPCO (0 → 1).
- `Spirometer` — Spiromètre (viewBox 560 × 400, largeur `width`) : boîtier, écran avec la courbe du volume soufflé en 6 secondes.
- `Inhaler` — Inhalateur (aérosol doseur, viewBox 220 × 260, largeur `width`) : `press` 0 → 1 enfonce la cartouche, `puff` 0 → 1 fait sortir la bouffée de médicament par l'embout (à droite).

## `devices.tsx`
Petits appareils réutilisables : téléphone qui compose un numéro (le 15), horloge murale (heure du début des signes), écran d'imagerie (scanner / IRM) qui balaie une image.

- `Phone` — Téléphone : `digits` s'affiche au fur et à mesure, `press` enfonce le bouton d'appel, `ring` fait vibrer.
- `WallClock` — Horloge murale à l'heure `h`:`m` (les aiguilles tournent si `spin` > 0).
- `ScanMonitor` — Écran d'imagerie : cadre, étiquette (« IRM »), image (`children`) balayée par une ligne lumineuse.

## `diabetes.tsx`
Diabète : vaisseau rempli de sucres (`BloodBand`), cellule à porte cadenassée qui a faim ou qui mange (`GCell`), clé « INSULINE » qui tourne, coince ou manque (`InsulinKey`), pancréas qui fabrique des clés… ou plus du tout (`Pancreas`), stylo à insuline (`InsulinPen`), sites d'injection sur le ventre (`InjectionSites`), globule rouge « sucré » (hémoglobine glyquée, `GlycatedCell`), assiette équilibrée (`Plate`), reins (`KidneysIcon`), carte « ▶ vidéo glycémie » (`VideoLink`). Couleurs de la marque uniquement.

- `BloodBand` — Vaisseau horizontal (largeur × hauteur) : plasma rose, globules, morceaux de sucre qui défilent (`sugar` 0 → 1 = de quelques-uns à plein) ; `piles` : sucres qui attendent, entassés contre la paroi du bas (x = centre du tas).
- `GCell` — Cellule (240 × 240) avec une porte en haut : `door` 0 → 1 (fermée → ouverte), `lock` (cadenas), `energy` 0 → 1 (jauge intérieure : rose et clignotante quand elle est vide), `hungry` (visage triste), `fed` 0 → 1 (un sucre entre, elle…
- `InsulinKey` — Clé (220 × 90) : `turn` 0 → 1 (elle tourne dans la serrure), `jam` 0 → 1 (elle coince : tremble, croix), `ghost` : seulement le contour en pointillés (la clé qui manque), `label` : « INSULINE » sur l'anneau.
- `Pancreas` — Pancréas (300 × 150) avec ses îlots : `make` 0 → 1 = des petites clés en sortent ; `dead` 0 → 1 = il s'éteint (type 1 : plus de clés, îlots barrés).
- `InsulinPen` — Stylo à insuline (440 × 110) : capuchon retiré, aiguille, molette de dose ; `press` 0 → 1 = on appuie.
- `InjectionSites` — Ventre vu de face (360 × 300) avec les sites d'injection : `done` = nombre de sites déjà utilisés (petits points), `active` = le site du jour (rose, entouré).
- `GlycatedCell` — Globule rouge (180 × 140) qui se couvre de sucres (`coat` 0 → 1) : l'hémoglobine « glyquée ».
- `Plate` — Assiette équilibrée (vue de dessus, 220 × 220) : légumes ½, féculents ¼, protéines ¼.
- `KidneysIcon` — Deux reins (icône 100 × 100).
- `BrainIcon` — Cerveau (icône 100 × 100).
- `VideoLink` — Carte « ▶ vidéo » (renvoi vers une autre vidéo de la marque), qui pop à `at`.
- `DIABETE_PARTS`
- `Defender` — Une « défense » du corps (globule blanc, 100 × 100) : ronde, noyau en lobes, sourcils froncés ; `angry` 0 → 1.
- `MomToBe` — Future maman de profil (320 × 560, tournée vers la droite) : robe bleu clair, chignon, main sur le ventre.
- `WeeksBar` — Frise de la grossesse (largeur × 150) : semaines 0 → 40 SA, fenêtre 24 – 28 SA en rose ; `fill` 0 → 1 = le curseur avance ; `win` 0 → 1 = la fenêtre s'allume.
- `SweetDrink` — Verre de boisson sucrée (200 × 260) : liquide bleu clair, paille, sucres qui fondent (`melt` 0 → 1), `level` 1 → 0 = on le boit.

## `embolism.tsx`
Briques « embolie pulmonaire » réutilisables : corps entier (le `Patient` + des jambes), veine profonde de la jambe, caillot qui remonte (veine → cœur droit → artère pulmonaire) et se coince dans le poumon (zone privée de sang), mollet gonflé, bas de compression ; position demi-assise ; scanner des poumons.

- `BODY` — Espace du corps entier : 400 × 940 (le `Patient` occupe 400 × 560 en haut, les jambes dessous).
- `CLOT_T` — repères du trajet : mollet, cœur (ventricule droit), coincé
- `clotAt` — position du caillot (espace du corps) à la part t du trajet
- `FullBodyProps`
- `FullBody` — Corps entier vu de face : jambes (short, mollets, chaussures) sous le `Patient`, puis veine, artères pulmonaires et caillot.
- `SemiSitting` — Position demi-assise (vue de côté, viewBox 420 × 260) : le dossier du lit se relève à 45° (`raise` 0 → 1) ; patient allongé puis demi-assis, « 45° » affiché quand c'est fait.
- `ChestScan` — Scanner des poumons (à mettre dans un `ScanMonitor`) : poumons, artères pulmonaires, caillot qui bouche une branche.

## `episode.tsx`
Kit « une vidéo par constante » : mise en page, titres, pastilles, chronomètre, fiche récap, carte logo, progression, composition complète (transitions, voix, mascotte, bruitages) et places de la mascotte. Une nouvelle vidéo n'écrit que ses scènes + son jeu de mascotte.

- `Pill` — Pastille « mot = explication » (TA = PA, mmHg…).
- `Lead` — Petit texte capitales qui annonce une liste (« parfois : »).
- `CamKey` — Clé de caméra : à la frame `at`, elle glisse en `dur` frames (14 par défaut) vers le point (x, y) du contenu, au zoom `s` (1 = plan large).
- `camAt` — État de la caméra à une frame : zoom, point visé (jamais de vide au bord) et `view(x, y)` = position à l'écran d'un point du contenu.
- `camClamp` — Cadrage (zoom s ≥ 1, point visé x, y) ramené dans le contenu : jamais de vide au bord.
- `CamFollow` — Caméra pilotée frame par frame (ex. elle suit un caillot qui remonte) : (frame) → {s, x, y}.
- `ZoomCam` — Fenêtre (w × h) dont le contenu est filmé par la caméra `keys` (clés, ou fonction qui suit un objet) ; à poser dans un `Stage`, les pastilles par-dessus restent fixes.
- `StagePill` — Pastille posée dans le socle (bas gauche par défaut), visible de `from` à `to`.
- `LAY`
- `SLAM_Y` — centre vertical du socle : là où les termes « claquent »
- `termSlot` — i-ème place (pleine largeur) d'un terme rangé sous le socle
- `Head` — Sur-titre + titre (mot à mot, `*mot*` = mot clé).
- `Unit`
- `Tag` — Étiquette courte (« poignet », « index »…).
- `BigNum` — Gros chiffre qui s'écrase (normes : « 60 », « 100 »…).
- `CauseChip` — Pastille d'une cause (icône + libellé) qui « claque » sur son mot.
- `Stopwatch` — Chronomètre d'une minute : l'anneau se remplit, le compteur roule au centre.
- `RecapRow` — Une ligne de la fiche récap : elle s'allume sur son mot, se coche quand la suivante arrive.
- `RecapLine`
- `RecapScene` — Scène récap complète : titre, lignes (≤ 6) au mot près, confettis (+ tampon facultatif) sur `done`.
- `EndCard` — Carte de fin : logo principal qui rebondit + éclats.
- `EpisodeTransition`
- `Episode` — Vidéo complète : scènes enchaînées par leurs transitions (jamais deux fois la même d'affilée), progression des notions (toutes les scènes entre l'accroche et le récap), mascotte, voix, bruitages.
- `SPOT`
- `runAcross` — Sortie à gauche puis traversée en courant pendant le rideau `runWipe` qui ouvre la scène `start`.

## `firstaid.tsx`
Trousse de secours de la maison : la trousse (couvercle qui s'ouvre, cases qui se remplissent, vide avec un papillon de nuit et de la poussière), les objets à mettre dedans (`KitItem`), la cuisine de l'accroche (planche, tomate) et la carte des numéros d'urgence. Couleurs de la marque uniquement.

- `KitKind`
- `KitItem` — Un objet de la trousse, centré dans un carré de `size` px.
- `EmergencyCard` — Carte des numéros d'urgence.
- `KIT_SLOTS` — Les cases de la trousse (5 × 3), dans le repère de `FirstAidKit` (900 × 640).
- `FirstAidKit` — Trousse de secours (repère 900 × 640) : boîte rose à croix blanche ; `open` 0 → 1 le couvercle se lève (on voit l'intérieur) ; `items` posés dans les cases ; `empty` : vide (poussière, papillon de nuit qui s'envole) ; `shake`.
- `Padlock` — Cadenas (hors de portée), repère 200 × 200.
- `CUT_TIP` — Point de l'entaille sur l'index une fois la main reculée (`jerk` 0,5), repère 1000 × 1000 de `CuttingCloseUp`.
- `CuttingCloseUp` — Gros plan « comme si c'était tes mains » (repère 1000 × 1000, vue de haut en perspective) : plan de travail, planche en bois, tomate qui se coupe en tranches (`slices` 0 → 3 : la lame descend, la tranche tombe à plat), main gauche en…

## `glyco.tsx`
Briques « glycémie » réutilisables : normes adulte (zones), doigt + autopiqueur + goutte, lecteur de glycémie (bandelette, valeur en g/l), sucres qui pleuvent, morceaux de sucre qui circulent dans l'artère, cellule qui « brûle » le glucose (carburant).

- `GLY_ZONES` — Normes adulte à jeun (liste fournie) : hypoglycémie < 0,70 · normoglycémie 0,70 – 1,10 · hyperglycémie > 1,10 g/l.
- `Finger` — Doigt stylisé (vu de profil) : une goutte de sang perle au bout.
- `Glucometer` — Lecteur de glycémie : bandelette à gauche, écran avec la valeur en g/l.
- `SugarRain` — Morceaux de sucre qui pleuvent (hyperglycémie).
- `Lancet` — Autopiqueur vu de face, pointe vers le haut : `press` 0 → 1 le pousse contre le doigt (déclic).
- `SugarCube` — Morceau de sucre (carré blanc, reflet).
- `SugarFlow` — Morceaux de sucre qui circulent dans la lumière de l'artère (`Artery`, 300 px de haut).
- `Cell` — Cellule (membrane bleue, noyau rose) : `energy` 0 → 1 fait briller un éclair (le glucose = carburant).

## `hands.tsx`
Hygiène des mains : microbes (petits, ronds, amusants mais sérieux), essaims qui apparaissent / s'en vont, étincelles de mains propres, loupe, environnement du patient (lit, table, pompe), gouttes de liquides biologiques, robinet + savon, suivi des 5 indications (2 « avant » en bleu, 3 « après » en rose). Couleurs de la marque uniquement.

- `rnd` — Pseudo-aléatoire stable (graine → 0..1).
- `Microbe` — Un microbe : corps rond, cils, deux yeux.
- `Swarm` — Essaim de microbes dans un rectangle (w × h) : `appear` 0 → 1 les fait arriver un par un, `gone` 0 → 1 les fait disparaître (rétrécissent, s'effacent).
- `Sparkles` — Étincelles « propre » (étoiles à 4 branches) qui éclatent à `at` autour de (x, y).
- `Loupe` — Loupe : verre rond (le contenu `children` est vu à travers, déjà grossi par l'appelant) + manche.
- `Drop` — Goutte (liquide biologique) : `tone` rose = sang, bleu clair = urines, blanc cassé = salive.
- `Bed` — Lit d'hôpital vu de côté (420 × 240) ; `rail` : barrière mise en avant.
- `BedTable` — Table de chevet (160 × 200) avec un verre.
- `IvPump` — Pompe à perfusion sur son pied (160 × 300).
- `Faucet` — Robinet + savon (300 × 220) : l'eau coule si `flow` > 0, mousse si `soap` > 0.
- `StepTracker` — Suivi des 5 indications : 1 – 2 « avant » (bleu), 3 – 5 « après » (rose) ; `current` grossit, les précédentes sont cochées.

## `heartfail.tsx`
Insuffisance cardiaque : pèse-personne (écran qui roule), lit où le patient est calé par 0 → 3 oreillers (orthopnée), chevilles qui gonflent + signe du godet (le doigt laisse un creux), salière, pile du cœur fatigué, personnage assis jambes pendantes (OAP). Couleurs de la marque uniquement.

- `BathScale` — Pèse-personne vu de face (360 × 300) ; `value` en kg (une décimale), `delta` : affiche « + » devant, `alert` : écran rose.
- `PropUp` — Lit vu de côté, patient calé par `pillows` (0 → 3, continu) : plus il y a d'oreillers, plus il est assis.
- `Ankles` — Deux bas de jambes vus de face (440 × 360) : `swell` gonfle les chevilles ; `press` : un pouce appuie sur la cheville gauche ; `dent` : le creux qu'il laisse (signe du godet), qui se remplit lentement.
- `SaltShaker` — Salière « SEL » (140 × 220) ; `shake` 0 → 1 : grains qui tombent.
- `Battery` — Pile « énergie du cœur » (110 × 60) : `level` 0 → 1 ; rose quand elle est presque vide.
- `SitLegsDown` — Personnage assis au bord du lit, jambes pendantes (220 × 260) : position de l'OAP.
- `Foam` — Mousse rosée qui sort de la bouche (bulles), à poser sur la bouche du `Patient` (repère 400 × 560).

## `icons.tsx`
Petites icônes « ligne » (100 × 100, trait bleu nuit) pour les pastilles de causes / situations.

- `RunIcon` — effort : silhouette qui court
- `FeverIcon` — fièvre : thermomètre
- `StressIcon` — stress : éclair
- `PainIcon` — douleur : étincelle « aïe »
- `MedalIcon` — sportif : médaille
- `MoonIcon` — sommeil : lune
- `PillIcon` — médicament : gélule
- `AnxietyIcon` — anxiété : visage inquiet
- `EyeIcon` — œil (observer discrètement)
- `SweatIcon` — sueurs : gouttes
- `FlushIcon` — visage rouge (joues roses)
- `PaleIcon` — visage pâle (peau froide)
- `ShiverIcon` — frissons / grelotte : flocon
- `HeadacheIcon` — maux de tête : tête + éclairs aux tempes
- `EarIcon` — bourdonnements d'oreilles : oreille + ondes
- `DizzyIcon` — vertiges / tête qui tourne : spirale
- `FaintIcon` — malaise : visage, yeux fermés, gouttes
- `ThirstIcon` — soif : verre d'eau
- `UrineIcon` — urines abondantes : goutte + flèches
- `TiredIcon` — fatigue : pile presque vide
- `TremorIcon` — tremblements : main + traits qui vibrent
- `HungerIcon` — faim : assiette + couverts
- `HypertensionIcon` — hypertension : manomètre aiguille dans le rouge
- `CigaretteIcon` — tabac : cigarette qui fume
- `DiabetesIcon` — diabète : goutte + morceau de sucre
- `CholesterolIcon` — cholestérol : artère avec une plaque qui la rétrécit
- `ArrhythmiaIcon` — troubles du rythme : tracé irrégulier
- `CyanosisIcon` — cyanose : lèvres bleutées
- `BedIcon` — alité : lit
- `PlaneIcon` — en avion
- `CastIcon` — plâtré : jambe dans un plâtre
- `ScalpelIcon` — opération : bistouri
- `RibbonIcon` — cancer : ruban
- `LegIcon` — mollet gonflé
- `DustIcon` — travail : usine qui rejette des poussières
- `SmogIcon` — pollution : nuage gris de fumées au-dessus de la ville
- `CoughIcon` — toux : bouche ouverte et traits de toux
- `SputumIcon` — crachats (expectorations)
- `SunriseIcon` — le matin : soleil qui se lève
- `SyringeIcon` — vaccin : seringue

## `injury.tsx`
Série courte « Les plaies » (30 – 40 s par vidéo, une situation vécue en accroche) : objets et corps du quotidien. Vélo qui chute (`Bike`, `Stone`), genou de face qui se râpe (`Knee`), jauges qui se remplissent (`Meter`), tendon / nerf / vaisseau posés dans la coupe de peau de wound.tsx (`DeepBits`, repère SKIN 900 × 500), règle de profondeur (`DepthRuler`), pastille de jours (`DayChip`). Couleurs de la marque uniquement.

- `Bike` — Repère 520 × 330 : vélo de profil (avance vers la droite) ; `spin` en degrés fait tourner les rayons.
- `Stone` — Caillou (repère 140 × 90).
- `Knee` — Repère 400 × 560 : jambe de face (short en haut), rotule au centre.
- `Meter` — Jauge horizontale (largeur 900) : étiquette à gauche, barre qui se remplit (`value` 0 → 1), mot à droite.
- `DeepBits` — Calque sur `SkinBlock` (même repère 900 × 500) : vaisseau (dans le derme profond), nerf (hypoderme), tendon (muscle).
- `DepthRuler` — Règle verticale graduée (hauteur h) avec une flèche qui descend jusqu'à `k` (0 → 1).
- `DayChip` — Pastille ronde « J + n » (calendrier) qui saute à chaque changement.
- `WoundTop` — Repère 700 × 420 : un carré de peau vu de dessus, avec une plaie franche (`clean` : fente droite, bords nets) ou contuse (`ragged` : bords déchiquetés).
- `NailBoard` — Repère 520 × 220 : planche de bois avec un clou qui dépasse, pointe en l'air (pointe à x 260, y 30).
- `Mosquito` — Moustique (repère 200 × 160), ailes qui battent.
- `VaxBook` — Carnet de vaccination (repère 260 × 200) avec une ligne cochée à `check` (0 → 1).
- `Stetho` — Stéthoscope (consulter un médecin), repère 220 × 220.
- `Cat` — Tête de chat (repère 320 × 300) : `open` 0 → 1 la gueule s'ouvre (crocs), `angry` : yeux plissés, oreilles en arrière.
- `Dog` — Tête de chien (repère 320 × 300), oreilles tombantes, langue.
- `BittenHand` — Dos de la main (repère 300 × 400, doigts en haut).
- `WeeksBar` — Frise 0 → `max` semaines (largeur 960) : zone colorée [`zone`], curseur à `pos` semaines (rond + étiquette), cadenas sur le curseur quand `lock` > 0 (la cicatrisation bloque).
- `AirMattress` — Matelas à air (repère 360 × 160) : les boudins se gonflent l'un après l'autre (pression alternée).
- `TurnArrows` — Deux flèches qui tournent (changer de position), repère 200 × 200.
- `FootTop` — Pied droit vu de dessus (`view` 'top') ou de dessous (`view` 'sole'), repère 260 × 400, orteils en haut.
- `Boy` — Garçon (vue de profil, vers la droite) dans le repère du vélo `Bike` (520 × 330, sol à y 326).
- `walkerLegs` — Pieds du marcheur (repère 300 × 600, hanche en 150, 330) pour une phase de marche donnée (radians).
- `Walker` — Adulte de profil (vers la droite), repère 300 × 600 (pieds au sol à y ≈ 590).

## `kids.tsx`
Constantes de l'enfant : bébé assis de face (`Baby` : respiration avec le ventre, signes de lutte, nez bouché, tremblements, hypotonie, bonnet, stéthoscope, capteur au pied, fièvre), plante du pied avec les zones de la piqûre au talon (`BabyFoot`), couche et balance (`Diaper`, `KitchenScale`), brassards de trois tailles (`Cuff`), courbes « le cœur accélère d'abord, la tension baisse en dernier » (`CompChart`), thermomètre électronique (`ThermoStick`), biberon (`Bottle`), courbe de pouls du saturomètre (`Pleth`), moniteur (`KidMonitor`), cartes des 3 âges (`AgeTable`). Couleurs de la marque uniquement.

- `BabyProps` — Peau (blanc cassé + voile rose), comme le `Patient`. */ const Skin: React.FC<{children: (fill: string, o: number) => React.ReactNode}> = ({children}) => ( <> {children(LPI.paper, 1)} {children(LPI.pink, 0.3)} </> ); /* ───────────── le…
- `Baby` — Bébé assis de face (400 × 440) : grosse tête, mèche, grenouillère bleu clair, ventre qui se soulève.
- `BabyFoot` — Plante du pied d'un nouveau-né (260 × 420, orteils en haut, talon en bas) : `zones` 0 → 1 = les deux côtés du talon s'allument (là où on pique), le milieu est barré ; `prick` 0 → 1 = la lancette pique sur le côté ; `drop` 0 → 1 = une…
- `Diaper` — Couche de face (240 × 180) : `wet` 0 → 1 = la tache d'urine (bleu clair) s'étend.
- `KitchenScale` — Balance de cuisine (360 × 200) avec écran (grammes) ; `children` = ce qui est posé sur le plateau.
- `Cuff` — Brassard à tension (largeur variable) : poche bleu clair, tuyau, étiquette.
- `CompChart` — Courbes dans le temps (600 × 320) : FC (rose) qui monte dès le début, PA (bleu) qui tient puis chute à la fin.
- `ThermoStick` — Thermomètre électronique flexible (320 × 90) : écran (valeur), embout souple.
- `Bottle` — Biberon (90 × 200).
- `Pleth` — Courbe de pouls du saturomètre (largeur × 120) : régulière, ou brouillée (`noise` 0 → 1 : il bouge, il pleure).
- `KidMonitor` — Moniteur (420 × 300) : FR et FC du bébé, chiffres roses qui clignotent (`alarm`) puis bleus (`ok`).
- `AGES` — Moniteur (420 × 300) : FR et FC du bébé, chiffres roses qui clignotent (`alarm`) puis bleus (`ok`). */ export const KidMonitor: React.FC<{fr: number; fc: number; showFc?: number; alarm?: number; ok?: number; width?: number}> = ({fr, fc,…
- `AgePortrait` — Le portrait de chaque âge : bébé, enfant (`Kid`), ado (`Patient`).
- `AgeTable` — Trois cartes côte à côte (bébé · enfant · ado) : le portrait en haut, l'âge, puis la valeur qui claque au mot (`values[i]`, `at[i]`) ; `unit` sous la rangée ; `same` = une seule valeur pour les trois (elle s'étend sur toute la largeur :…

## `kit.tsx`
La Petite IDE — kit « réseaux sociaux » : stickers, tampons, puces cochées, rubans, progression par étapes. Briques réutilisables pour les vidéos « liste » (ex. 14 besoins). Toujours dans la palette ; un seul ressort de référence (POP) pour tout le kit.

- `POP` — Ressort « pop » de la charte : dépassement ≈ 12 %.
- `usePop`
- `Sticker` — Sticker : contenu posé avec un liseré blanc épais et une ombre, qui « claque » en tournant.
- `Stamp` — Tampon : texte en capitales dans un cadre, qui s'écrase (gros → taille finale) avec un petit flash.
- `CheckChip` — Puce cochée : la coche se dessine, le libellé glisse.
- `Strike` — Trait rose qui barre un élément (dessiné de gauche à droite).
- `Tape` — Ruban « scène de crime » qui traverse l'écran en diagonale.
- `GroupProgress` — Progression par étapes : un segment par élément, groupes séparés, élément courant allongé.
- `TypingBubble` — Bulle de commentaire : « … » qui s'agite puis le texte s'écrit.

## `learn.tsx`
Briques pédagogiques La Petite IDE : numéro de partie, carte « terme technique », signes.

- `SignKind`
- `Sign`

## `lungs.tsx`
Planche anatomique « La Petite IDE » n° 1 : LES POUMONS (dessin maison, palette de la marque, contours bleu nuit). Réutilisable dans toutes les vidéos (BPCO, asthme, pneumonie, embolie…). Les planches suivantes (cerveau, cœur…) suivront le même principe : un dessin `…Art` (groupe SVG dans un repère fixe), un svg autonome avec étiquettes, des gros plans dans une loupe `ZoomBubble`, et un calque calé sur le `Patient` pour les voir « à travers » le corps. - `LungsArt` (repère 600 × 640) / `Lungs` (svg autonome, étiquettes `labels`) : trachée et ses anneaux, bronches → bronchioles (arbre qui se dessine `tree`), alvéoles au bout, lobes et scissures, plèvre, diaphragme, côtes, air qui circule ; BPCO `copd` (paroi rose épaissie, passage étroit, mucus, poumons distendus et plus sombres, diaphragme aplati) + emphysème `emph` (bulles) + air piégé `trapped`. - `AlveoliZoom` : grappes d'alvéoles + vaisseaux, O₂ qui passe dans le sang ; emphysème (les parois cassent : grands sacs), air emprisonné. - `AirwayCross` : bronche en coupe (anneaux de cartilage, muscle, muqueuse) : ouverte → enflammée, muscle contracté, passage en étoile, mucus qui coule. - `ZoomBubble` : loupe ronde reliée au point qu'elle grossit (comme les planches de cours). - `ChestXRay` : radio du thorax calée sur le `Patient` (même repère 400 × 560, même taille) : film bleu nuit, côtes, colonne, clavicules, poumons sombres ; ligne de balayage `scan`, puis les poumons en couleur se découvrent `reveal`.

- `LUNG_R` — Poumon droit du patient (à gauche de l'image) : 3 lobes.
- `LUNG_L` — Poumon gauche du patient (à droite de l'image) : 2 lobes + encoche du cœur.
- `FISSURES`
- `Seg`
- `MAIN` — Bronches principales puis lobaires et segmentaires (dessinées à la main).
- `TREE`
- `segPath`
- `BULLAE` — Bulles d'emphysème (poumons vus de face).
- `PLUGS` — Bouchons de mucus (sur les bronches lobaires).
- `Tube` — Tube de bronche : contour bleu nuit, paroi claire (rose si elle s'enflamme), passage d'air (bleu clair).
- `LungsArtProps`
- `LungsArt` — Les poumons dessinés « La Petite IDE » (groupe SVG, repère 600 × 640).
- `LungLabel` — Les poumons dessinés « La Petite IDE » (groupe SVG, repère 600 × 640). */ export const LungsArt: React.FC<LungsArtProps> = ({ tree = 1, alveoli = 1, copd = 0, emph, trapped = 0, air = null, airOut = false, pleura = 0, diaphragm = 0,…
- `Lungs` — Poumons autonomes (svg).
- `AlveoliZoom` — Grappes d'alvéoles au bout d'une bronchiole (viewBox 400 × 400).
- `AirwayCross` — Bronche en coupe, vue de trois quarts (viewBox 320 × 400).
- `ZoomBubble` — Loupe ronde (HTML) reliée par deux traits au point grossi (comme les planches de cours).
- `LUNGS_IN_PATIENT` — Place les poumons dessinés (repère 600 × 640) dans le thorax du `Patient` (repère 400 × 560).
- `ChestXRay` — Radio du thorax, à poser exactement par-dessus le `Patient` (même `size`, même position).

## `motion3.tsx`
La Petite IDE — motion design « v3 » (moderne, rythmé) : briques réutilisables

- `shakeAt` — secousse d'impact : amortie en ~10 frames, direction pseudo-aléatoire stable
- `Camera`
- `LiveBackground`
- `Burst` — secousse d'impact : amortie en ~10 frames, direction pseudo-aléatoire stable */ export const shakeAt = (frame: number, shakes: number[], amp = 9) => { let x = 0; let y = 0; for (const at of shakes) { const t = frame - at; if (t < 0 || t…
- `Odometer` — Chiffres qui roulent vers la nouvelle valeur (format français : virgule).
- `ChapterSlam` — Chiffres qui roulent vers la nouvelle valeur (format français : virgule). */ export const Odometer: React.FC<{value: number; decimals?: number; places?: number; size?: number; color?: string}> = ({ value, decimals = 0, places = 2, size…
- `SLOT` — Chiffres qui roulent vers la nouvelle valeur (format français : virgule). */ export const Odometer: React.FC<{value: number; decimals?: number; places?: number; size?: number; color?: string}> = ({ value, decimals = 0, places = 2, size…
- `TermSlam`
- `wave`
- `Confetti` — centre horizontal du « claquement » */ slamX?: number; }> = ({at, index, term, meaning, sign, active = false, slamY = 840, top = SLOT.y, slot, slamX = 540}) => { const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t =…
- `Stage` — centre horizontal du « claquement » */ slamX?: number; }> = ({at, index, term, meaning, sign, active = false, slamY = 840, top = SLOT.y, slot, slamX = 540}) => { const frame = useCurrentFrame(); const {fps} = useVideoConfig(); const t =…

## `motion4.tsx`
La Petite IDE — transitions « v4 » (vidéo pilote) : on ne répète jamais deux fois la même transition d'affilée. Toutes durent TL.transition frames (14 = 0,47 s). runWipe   : la mascotte traverse l'écran en courant et « tire » la scène suivante derrière elle whip      : panoramique éclair (flou de bougé directionnel) vers le haut ou vers la gauche zoomInto  : on plonge dans un élément (picto) puis la scène suivante s'ouvre depuis lui

- `RUN_WIPE` — Bord du rideau (x au niveau des pieds de la mascotte) — partagé avec la course de la mascotte.
- `runWipeEdge`
- `runWipe`
- `whip`
- `zoomInto`

## `night.tsx`
Format « histoire » (mystérieux) : fond bleu nuit qui respire, grille et poussières, cadre de « scanner » (coins lumineux, point qui pulse, étiquette lieu · heure), lueur autour des dessins (le trait bleu nuit disparaîtrait sur le fond), flash de choc. Couleurs de la marque uniquement (le bleu nuit est le plus sombre).

- `NightBg` — Fond nuit : bleu nuit, halo bleu au centre qui respire, grille fine, poussières qui flottent.
- `Glow` — Lueur bleu clair autour d'un dessin au trait bleu nuit (lisible sur le fond nuit).
- `ScanFrame` — Cadre de « scanner » : fond un peu plus clair, grille, coins lumineux, point qui pulse en haut, étiquette en capitales espacées en bas (« 07 H 42 · SALLE DE BAINS »).
- `NightFlash` — Flash de choc (plein écran) qui retombe.
- `Scramble` — Mots qui sortent dans le désordre : chaque lettre tremble et se mélange, puis se remet (ou non) en place.

## `oxygen.tsx`
Briques « SpO₂ » réutilisables : normes, saturomètre en gros plan (pince au bout du doigt : écran, courbe de pouls, lumière qui traverse le doigt, vernis, doigt froid, ongle bleuté), vaisseau sanguin vu de près (globules rouges dont l'hémoglobine se charge en O₂ au contact du poumon) et grille de 100 hémoglobines (le pourcentage).

- `SPO_ZONES` — Zones adultes (charte) : hypoxémie < 90 · désaturation 90 – 95 · normale 95 – 100 %.
- `PulseOx` — Saturomètre (oxymètre de pouls) sur le bout du doigt, vu de côté (viewBox 900 × 600, largeur `width`).
- `Vessel` — Vaisseau sanguin vu de près (viewBox 900 × 460, largeur `width`) : globules rouges qui défilent, chacun avec 4 hémoglobines (pastilles) chargées d'O₂ (bleu) selon `sat` 0 → 1.
- `HemoGrid` — 100 hémoglobines (10 × 10) : les `filled` premières sont chargées d'O₂ (point bleu), les autres vides.

## `pain.tsx`
Série « La douleur : échelles d'évaluation » : échelle numérique 0 → 10 (EN), réglette EVA recto (côté patient, curseur) / verso (côté soignant, graduée), échelle verbale simple (EVS, 5 mots), échelle des visages (6 visages, sans sourire ni larmes, comme la FPS-R), bulles de parole, enfant (Kid), respirateur, grilles d'observation (Algoplus, EVENDOL, BPS) et barre de score avec seuil. Couleurs de la marque uniquement.

- `painTone` — Teinte d'une note de douleur 0 → 10 : blanc (aucune), bleu clair (légère), bleu (modérée), rose (intense).
- `TalkIcon` — Bulle qui parle (« il peut répondre »).
- `MuteIcon` — Bulle vide barrée (« il ne peut pas répondre »).
- `PAIN_PARTS` — Les 2 parties de la série (carte `SeriesParts`, carte « À suivre »).
- `Bubble` — Bulle de parole (queue en bas à gauche ou à droite) ; `think` = bulle de pensée (petits ronds).
- `Ruler` — Réglette EVA (880 × 230) : recto « côté patient » (une ligne, de pas de douleur à douleur maximale, curseur à `pos` 0 → 1) ; elle se retourne avec `flip` 0 → 1 : verso « côté soignant », gradué de 0 à 10, le score se lit sous le curseur.
- `EVS_WORDS` — Réglette EVA (880 × 230) : recto « côté patient » (une ligne, de pas de douleur à douleur maximale, curseur à `pos` 0 → 1) ; elle se retourne avec `flip` 0 → 1 : verso « côté soignant », gradué de 0 à 10, le score se lit sous le curseur.
- `PainFace` — Un visage de l'échelle (niveau 0 → 5) : de détendu à très douloureux, sans sourire ni larmes (comme la FPS-R).
- `Kid` — Enfant (300 × 360) : `mood`, `cry` (larmes + « ouin »), `point` 0 → 1 (le bras se lève et montre vers la droite), `curl` (recroquevillé), `shake` (agité), `turn` (se détourne).
- `Ventilator` — Respirateur (240 × 300) : écran avec la courbe de pression qui défile ; `fight` 0 → 1 : la courbe devient irrégulière (le patient « lutte » contre la machine), l'écran s'allume en rose.
- `ScoreBar` — Barre de score 0 → `max` avec le seuil (« dès 5 / 30 ») : elle se remplit jusqu'à `value`, rose au-delà du seuil.
- `Carer` — Soignant (buste dans un rond) : tunique `tone`, coiffure `hair` 0 → 2.
- `PainBars` — Échelle numérique en barres (plein cadre) : 11 barres de plus en plus hautes, de 0 à 10, la case du chiffre dessous.
- `ObsRow` — Ligne d'une grille d'observation, en plein cadre (look 2026) : picto, ce qu'on observe, puis la réponse à `answerAt` — `yesno` : oui / non (Algoplus) ; `points` : 0 → `max` points (EVENDOL).

## `patient.tsx`
Modèle de corps humain réutilisable : patient vu de face, de la tête aux hanches (bas en fondu). Style plat de la marque (trait bleu nuit, tenue bleue, peau = rose 30 % sur blanc cassé), visage simple qui cligne, et des calques à doser 0 → 1 : cœur qui bat (ou tremble), artères (sang qui s'arrête), cerveau vu à travers le crâne (privé d'oxygène), poumons, lèvres bleutées (cyanose), brassard, rougeur, pâleur, sueurs, maux de tête, vertiges. Les points du corps (PATIENT_PTS) servent à poser repères, traits et loupes.

- `PATIENT_PTS` — Points du corps (unités du viewBox 400 × 560) ; `patientPoint` les convertit en pixels.
- `PatientPoint`
- `patientPoint`
- `PatientProps`
- `TORSO`
- `LUNGS` — poumons (vus de face, espace 400 × 560)
- `Patient`

## `pictos.tsx`

- `ThermoPicto`
- `HeartPicto`
- `LungsPicto`
- `GaugePicto`
- `O2Picto`
- `GlucosePicto` — glycémie : goutte de sang + morceau de sucre
- `JarPicto` — diurèse : bocal gradué (recueil des urines sur 24 h)
- `DropPicto`
- `FlamePicto`
- `SnowPicto`
- `PictoBadge` — Badge rond : pictogramme sur pastille bleu clair.
- `tempColor` — Couleur du liquide, sans mélange de teintes : bleu clair (< 35,5 °C) · bleu · rose (≥ 37,5 °C, fièvre).
- `Thermometer`
- `Heart`
- `Lungs` — Poumons qui se gonflent (breath 0→1) + flèches d'air entrantes / sortantes.
- `Artery` — Artère en coupe : sang qui circule par à-coups, flèches de pression sur la paroi.
- `Oximeter` — Saturomètre sur un doigt (doigt au trait, palette uniquement).
- `Rbc` — Globule rouge (rose) qui porte éventuellement de l'O2 (points bleus).

## `precautions.tsx`
Précautions standard : équipements à « enfiler » sur le `Patient` (masque, lunettes, tablier ; même repère 400 × 560), gouttelettes de toux, objets du soin (seringue + capuchon, bassin, douchette, spray, sac de linge, mouchoir + poubelle, montre, bague), icônes des 6 réflexes et leur suivi. Couleurs de la marque uniquement.

- `MaskShape` — Masque chirurgical (repère du `Patient` 400 × 560) : élastiques vers les oreilles, plis.
- `GogglesShape` — Lunettes de protection (repère du `Patient`).
- `ApronShape` — Tablier à usage unique (repère du `Patient`).
- `Wear` — Ce que porte le personnage (par-dessus un `Patient` de même taille) : chaque calque 0 → 1 (il « tombe » en place).
- `CoughSpray` — Gouttelettes qui sortent de la bouche (repère du `Patient`) ; `blocked` 0 → 1 : le masque les arrête.
- `Syringe` — Seringue + aiguille, horizontale (400 × 100), pointe à droite.
- `NeedleCap` — Capuchon d'aiguille (120 × 40).
- `Bedpan` — Bassin de lit (300 × 160).
- `ShowerHead` — Douchette (tête + flexible) qui arrose vers le bas (220 × 200).
- `SprayBottle` — Flacon pulvérisateur (détergent-désinfectant) (140 × 220).
- `LaundryBag` — Sac à linge sale (180 × 220).
- `Tissue` — Mouchoir en papier (80 × 70).
- `Bin` — Poubelle à pédale (150 × 190) ; `open` 0 → 1 : le couvercle se soulève.
- `WatchShape` — Montre (bracelet + cadran) et bague, pour la main de `Hand` (repère 200 × 260).
- `RingShape`
- `ReflexKind` — Montre (bracelet + cadran) et bague, pour la main de `Hand` (repère 200 × 260). */ export const WatchShape: React.FC = () => ( <> <rect x={46} y={232} width={118} height={26} rx={8} fill={N} /> <circle cx={105} cy={245} r={22}…
- `REFLEXES`
- `ReflexIcon`
- `ReflexTracker` — Suivi des 6 réflexes : le courant grossit, les précédents sont cochés.

## `pressure.tsx`
Briques « pression artérielle » réutilisables : normes adulte (zones), manomètre du tensiomètre, lecture « systolique / diastolique » qui roule (mmHg).

- `PA_ZONES` — Normes adulte (liste fournie) : hypotension < 90/60 · normale ≈ 120/80 · hypertension (HTA) > 140/90 mmHg ; curseur = systolique.
- `Manometer` — Manomètre du tensiomètre (0 → 300 mmHg).
- `BPReadout` — Lecture du tensiomètre : « 120 / 80 mmHg », chiffre expliqué en surbrillance (`hi` = 'sys' | 'dia').

## `sampling.tsx`
Matériel de soins (prise de sang) : aiguille Vacutainer (2 pointes, manchon), corps de pompe (porte-tube), unité à ailettes (épicrânienne), tube sous vide (bouchon coloré, sang qui monte), solution hydroalcoolique, main (nue ou gantée), flacon d'antiseptique, compresse (stérile : sachet), pansement, collecteur à OPCT, sac DASRI, et le bras (veine, garrot, point de ponction, désinfection, compresse qui appuie, aiguille, pansement). Couleurs de la marque uniquement (le sang = rose, les bouchons = bleu, bleu clair, rose, bleu nuit).

- `VacuNeedle` — Aiguille Vacutainer (400 × 100) : à gauche la pointe côté tube sous son manchon, le pas de vis, à droite la pointe côté veine.
- `Holder` — Corps de pompe / porte-tube (300 × 140) : cylindre transparent, collerette à gauche, embout vissé à droite.
- `Butterfly` — Unité à ailettes / épicrânienne (420 × 200) : aiguille, deux ailettes souples (`flap` les fait battre), tubulure.
- `BloodTube` — Tube sous vide (80 × 300) : bouchon coloré, étiquette, sang (rose) jusqu'à `level`, flèches du vide (`vacuum`).
- `ShaBottle` — Flacon de solution hydroalcoolique (160 × 280).
- `Hand` — Main ouverte (200 × 260) ; `gloved` : gant à usage unique (bleu clair).
- `AntisepticBottle` — Flacon d'antiseptique cutané (140 × 260).
- `Gauze` — Compresse (160 × 160) ; `sterile` : dans son sachet.
- `Plaster` — Pansement (240 × 100).
- `SharpsBox` — Collecteur à OPCT (240 × 280) ; `drop` 0 → 1 : une aiguille tombe dans la fente.
- `DasriBag` — Sac DASRI (240 × 280) ; `fill` : déchets qui tombent dedans.
- `ARM_PT` — Repère 900 × 300 : bras tendu (épaule à gauche, main à droite), pli du coude vers x 450.
- `Arm`
- `TourniquetStrap` — Garrot seul (260 × 90) : bande élastique et boucle à clip.

## `series.tsx`
Vidéos en série (« partie 1 / 3 ») : carte de la série juste après l'accroche (les parties déjà vues sont cochées, la partie en cours brille, les suivantes attendent avec un cadenas : donne envie de regarder la suite), étiquette de la série sur la ligne du sur-titre, carte « À suivre » de la fin du récap. Couleurs de la marque uniquement.

- `SeriesPart`
- `SeriesParts` — Les parties de la série en colonne (à partir de y), la partie `current` mise en avant.
- `SeriesTag` — Étiquette de la série (« LES PLAIES · 1/3 ») sur la ligne du sur-titre, à droite ; visible de `from` à `to`.
- `NextUp` — Carte « À suivre » (fin de récap) : la prochaine partie, son titre et une phrase qui donne envie.

## `shard.tsx`
« Pourquoi ne jamais retirer un objet planté ? » : l'évier de la cuisine (robinet qui coule, mousse), le verre qui tombe et éclate (éclats qui volent), la main avec l'éclat planté (gouttes de sang roses), les doigts qui viennent le pincer, la coupe de peau (calque posé sur `SkinBlock`, repère 900 × 500) : le vaisseau coupé que l'éclat bouche, et ce qui arrive si on le retire (le sang jaillit). Couleurs de la marque uniquement (le sang = rose, le verre = bleu clair).

- `Sink` — Évier de cuisine (1000 × 640) : carrelage, plan de travail, bac plein d'eau moussante, robinet (`water` : l'eau coule).
- `DrinkGlass` — Verre à boire (120 × 170).
- `ShardBurst` — Éclats qui volent quand le verre éclate (repère du parent, centrés en 0, 0) ; `t` 0 → 1.
- `HandShard` — Main ouverte (paume) avec l'éclat planté (300 × 390) : `shard` (0 → 1 : il s'enfonce), `blood` (gouttes roses), `pain` (traits de douleur), `gauze` (compresses roulées tout autour de l'éclat, 0 → 1).
- `Pinch` — Pouce et index qui viennent pincer (260 × 200) : `close` 0 → 1 (les deux doigts se rapprochent).
- `ShardSection` — Calque de la coupe de peau (repère `SKIN` 900 × 500, à poser sur `SkinBlock` à la même largeur) : un vaisseau dans le derme (le sang circule), coupé par l'éclat qui le BOUCHE ; `out` 0 → 1 : l'éclat ressort (il monte) ; `gush` 0 → 1 :…
- `Splinter` — Petite écharde (180 × 120) : un doigt avec une minuscule écharde en surface.
- `Chair` — Chaise (160 × 200).
- `ErIcon` — Hôpital (urgences) 200 × 180.

## `splinter.tsx`
« Comment retirer une écharde ? » : vieille planche vue de dessus (veines, nœud, fente, fibres qui dépassent), écharde plantée dans le grand doigt (partie qui dépasse + partie vue par transparence sous la peau, poussée plus loin, cassée, retirée dans son axe), pince à écharde qui s'ouvre / se ferme. À dessiner dans le repère d'un `BigFinger`. Même rendu soigné que bandage.tsx. Couleurs de la marque, sauf le bois : brun naturel (demandé).

- `SPLINTER` — L'écharde dans le repère du doigt : point d'entrée, direction (vers l'intérieur : vers la main), longueurs.
- `splinterAt` — Point à `d` unités le long de l'écharde (d > 0 : sous la peau ; d < 0 : la partie qui dépasse).
- `PlankG` — Vieille planche vue de dessus, sous le doigt (repère d'un `BigFinger`) : grandes veines, un nœud, une fente, des fibres soulevées (l'une d'elles accroche le doigt en (`hookX`, ~236)).
- `SplinterG` — Écharde plantée (repère d'un `BigFinger`) : `on` apparition ; `push` 0 → 1 enfoncée plus loin (la partie qui dépasse rentre) ; `broken` 0 → 1 le bout qui dépassait casse et s'envole, le morceau reste sous la peau ; `pull` 0 → 1 elle…
- `TweezersG` — Pince à écharde vue de dessus (repère d'un `BigFinger`) : pointes en (`x`, `y`), corps orienté selon `ang` (degrés, direction pointes → charnière), `close` 0 → 1 les pointes se rejoignent ; `tint` voile d'antiseptique (désinfectée).
- `PullArrowG` — Flèche pointillée qui montre le sens de sortie (dans l'axe de l'écharde, vers l'extérieur).
- `DeepSplinterIcon` — Petite écharde sous la peau, en coupe (icône 160 × 110) : la peau, l'écharde cassée en dessous.

## `suppo.tsx`
Vidéo courte « Comment mettre un suppositoire » : le suppositoire (`Suppo` : torpille blanc cassé, pointe arrondie à droite, base plate à gauche, petit visage, mode fusée avec ailerons + flamme), la notice (`Notice`, ligne surlignée), le patient couché sur le côté gauche (`SideLying`, jambe du dessus pliée), l'anneau du sphincter (`Sphincter`), les fesses qui se serrent (`Squeeze`), un commentaire de réseau social (`Comment`). Couleurs de la marque uniquement.

- `Suppo` — Suppositoire (400 × 200, pointe à droite) : `face` (yeux + sourire), `rocket` 0 → 1 (ailerons + flamme qui vacille), `drop` 0 → 1 (goutte d'eau sur la pointe), `mood` (content / inquiet).
- `Notice` — Notice pliée (360 × 460) : lignes de texte, une ligne surlignée en rose (`highlight` 0 → 1) qui dit `line`.
- `SideLying` — Patient couché sur le côté gauche, vu de face (480 × 260) : tête à gauche, la jambe du dessus pliée en avant.
- `Sphincter` — Anneau du sphincter (vu de profil, 220 × 260) : deux arcs roses ; `open` 0 → 1 = il s'écarte quand ça passe.
- `Squeeze` — Deux fesses qui se serrent (300 × 220) : `squeeze` 0 → 1, petits traits de mouvement.
- `Comment` — Commentaire façon réseau social : pastille ronde (initiale), pseudo, texte.

## `theme.ts`
LA PETITE IDE — système visuel des vidéos Toute nouvelle vidéo de la marque part de ce fichier : couleurs, polices, grille.

- `LPI` — Palette officielle — aucune autre couleur (hors mascotte et logos fournis).
- `alpha` — Variante transparente d'une couleur de la palette (ombres, voiles) — pas une nouvelle teinte.
- `FONT`
- `SHADOW` — Ombre douce standard (profondeur légère, jamais d'effet 3D).
- `GRID` — Grille 1080 × 1920.
- `brandFontsReady`

## `thermo.tsx`
Briques « température » réutilisables : normes adulte (zones), thermomètre + lecture en °C, ondes de chaleur (fièvre) et flocons (froid) qui animent le socle.

- `TEMP_ZONES` — Normes adulte (liste fournie) : hypothermie < 35 · apyrétique 36,5 – 37,5 · fébricule 37,5 – 37,9 · hyperthermie ≥ 38 °C.
- `ThermoReadout` — Thermomètre + valeur qui roule (« 39,2 °C »).
- `HeatWaves` — Ondes de chaleur (rose) qui montent sur le socle (`on` 0 → 1).
- `Snowfall` — Flocons qui tombent sur le socle (`on` 0 → 1).
- `TempGauge` — Jauge froid ↔ chaud (3 segments de la palette, sans mélange) + curseur qui suit `value` (34 → 41 °C).

## `tick.tsx`
« Une tique : comment bien la retirer ? » : peau en très gros plan (grain, pores, fins poils, ombre douce), tique vue de dessus (rostre, écusson, 8 pattes articulées qui bougent, gorgée de sang ou non), tire-tique (crochet fendu qui se glisse dessous et tourne), plaque rouge qui s'étend (érythème migrant), petits flacons et pictos. Même rendu soigné que bandage.tsx (peau opaque en dégradé, contours fins, ombres floutées). Couleurs de la marque uniquement.

- `SkinG` — Peau en très gros plan (repère 1000 × 1000, déborde largement pour remplir l'écran) : dégradé, grain en losanges, pores, fins poils.
- `TickG` — Tique vue de dessus, centre (`x`, `y`), longueur ≈ 40 × `s` unités, tête vers `ang` (degrés, 0 = vers le haut) : rostre, écusson brillant, corps, 8 pattes articulées (`walk` : elles bougent).
- `TickHookG` — Tire-tique (crochet) vu de dessus, pointe fendue en (`x`, `y`), corps orienté selon `ang` (degrés, direction pointe → poignée), `scale`.
- `LabelBottle` — Petit flacon étiqueté (repère 120 × 200) : `label` en capitales, `tone` couleur du bouchon.
- `SkinMedallion` — Médaillon rond (peau vue à travers un hublot) : `children` = un `SkinG` déjà posé dans le repère 1000 × 1000.
- `WalkIcon` — Pictos des bons réflexes de balade (repère 160 × 120) : manches longues, pantalon, inspection à la loupe.

## `timeline.ts`
Timeline générique « voix → scènes → animations » pour les vidéos La Petite IDE. voice.json est produit par scripts/voice/tts_voix.py (voix de la marque) ou scripts/voice/align_voice.py (voix enregistrée) : remplacer la voix recale toute la vidéo.

- `VoiceData`
- `makeTimeline`
- `Timeline`
- `episodeTimeline` — Timeline d'un épisode « une vidéo par constante » : scènes = parties de la voix + carte logo.

## `ui.tsx`

- `clamp`
- `useSoft` — Spring vif mais amorti (léger micro-rebond seulement si `bounce`).
- `Enter` — Apparition progressive : fondu + léger glissement + scale subtil.
- `Box` — Bloc positionné en absolu (coordonnées de la grille 1080 × 1920).
- `Brush` — Coup de pinceau rose (surlignage de la charte), révélé de gauche à droite.
- `Kicker` — Sur-titre : « CONSTANTE 1/5 ».
- `Title` — Titre : apparition mot à mot.
- `Card` — Carte : surface blanc cassé, bord bleu clair, ombre douce.
- `Chip` — Pastille d'information.
- `Progress` — Progression : une pastille par étape, la courante s'allonge.

## `urine.tsx`
Briques « diurèse » réutilisables : normes adulte (zones), bocal gradué qui se remplit goutte à goutte, horloge « 24 h », cadence des gouttes selon le volume, appareil urinaire (reins → uretères → vessie).

- `DIU_ZONES` — Normes adulte (liste fournie) : anurie < 100 · oligurie < 400 · normodiurèse 600 – 2000 · polyurie > 2500 à 3000 ml/24 h.
- `JAR_MAX`
- `Jar` — Bocal gradué de recueil des urines (24 h) : le niveau suit la diurèse, les gouttes tombent du tuyau.
- `Clock24` — Petite horloge « 24 h » dont l'aiguille fait le tour du cadran.
- `dropTimes` — Instants des gouttes : la cadence suit le volume (beaucoup d'urine = goutte à goutte rapide).
- `UrinarySystem` — Appareil urinaire de face : vaisseau (sang) → reins qui filtrent → uretères (gouttes) → vessie qui se remplit.

## `wound.tsx`
Plaies : coupe de peau en couches (épiderme, derme, hypoderme, muscle, os) où l'on creuse une plaie de forme et de profondeur variables (éraflure, coupure, déchirure, piqûre, morsure, cratère d'escarre, incision suturée), brûlure par degrés (rougeur, phlyctène, peau carbonisée), nerfs et douleur, microbes qui entrent, doigt qui appuie ; escarre écrasée entre l'os et le matelas (`Squeeze`), patient couché et ses points d'appui (`LyingBody`), jambe de profil (varices, ulcère, plaie du pied diabétique, escarre du talon : `LowerLeg`), doigt et coupure de papier (`Finger`), objets qui blessent (`WoundTool`) et petits pictos de gravité. Couleurs de la marque uniquement.

- `SKIN` — Coupe de peau (repère 900 × 500) : surface à y 60, puis épiderme, derme, hypoderme, muscle, os.
- `depthY` — profondeur 0 → 5 (rien, épiderme, derme, hypoderme, muscle, os) → y du fond de la plaie
- `LAYERS`
- `WoundShape`
- `SkinBlockProps`
- `SkinBlock` — Coupe de peau animée.
- `SkinLabels` — Étiquettes des couches (à poser par-dessus le bloc, mêmes x / y / largeur).
- `Squeeze` — Repère 900 × 500 : os (sacrum) en haut qui appuie, tissus écrasés, matelas en bas.
- `LYING_PTS` — Repère 900 × 300 : patient couché sur le dos (de profil), tête à gauche.
- `LyingPoint`
- `LyingBody`
- `LEG_PTS` — Repère 500 × 700 : jambe droite de profil (orteils à droite).
- `LowerLeg`
- `Finger` — Repère 520 × 260 : index tendu vers la droite ; `cut` : coupure de papier ; `heal` : elle se referme.
- `ToolKind` — Repère 520 × 260 : index tendu vers la droite ; `cut` : coupure de papier ; `heal` : elle se referme. */ export const Finger: React.FC<{width?: number; cut: number; heal?: number}> = ({width = 520, cut, heal = 0}) => { const F = 'M0 64…
- `WoundTool` — Objet (repère 200 × 200, centré).
- `DepthGlyph` — Objet (repère 200 × 200, centré).
- `WideGlyph`
- `GermGlyph`
- `ZoneGlyph`
- `SkinBox` — Coupe de peau posée en (x, y), largeur w.
- `skinPt` — point de la coupe (repère 900 × 500) → coordonnées du socle
- `SkinAt`
