# Storyboard — série « Le diabète » (2 parties, `Diabete-1` / `Diabete-2`)

Remplace la vidéo unique `Diabete` (v1, ≈ 1 min 35, voix +8 % : dans l'historique git). Demandé : « ça va un peu vite,
ralentis et prends le temps pour parler et les animations aussi ; parle des insulinodépendants et non insulinodépendants
(pour les deux cas) et du diabète gestationnel ». Avec ces ajouts, une seule vidéo aurait duré ≈ 2 min 45 : le
propriétaire a choisi une **série en 2 parties** (≈ 1 min 44 et ≈ 1 min 37).

- Voix : `voix/26-diabete-1.script.json`, `voix/26-diabete-2.script.json` — **+0 %** partout (accroches +4 % / +3 %),
  petites pauses après les notions. Animations plus posées : `popAt` au ressort plus lent dans les deux `Scenes.tsx`,
  mouvements de caméra de 16 à 20 images, moins de « coups » de caméra.
- Briques ajoutées à `src/brand/diabetes.tsx` : `DIABETE_PARTS` (tuiles de la série), `Defender` (défense du corps,
  globule blanc fâché), `MomToBe` (future maman de profil : ventre qui s'arrondit, vue de l'intérieur — utérus, bébé tête
  en bas, placenta, cordon —, hormones qui filent vers une cellule, bébé qui grossit, bébé dans les bras après
  l'accouchement), `WeeksBar` (frise 0 → 40 SA, fenêtre 24 – 28 SA), `SweetDrink` (boisson sucrée de l'HGPO).
- Repères : type 1 = DID (diabète insulinodépendant, auto-immun, insuline à vie) ; type 2 = DNID (non insulinodépendant,
  ~ 9 diabètes sur 10 ; au début : hygiène de vie et comprimés, parfois l'insuline plus tard) ; gestationnel : hormones du
  placenta, dépistage entre 24 et 28 SA par HGPO (boisson sucrée + prise de sang), risque de macrosomie (bébé > 4 kg),
  disparaît en général après l'accouchement mais risque de type 2 plus tard ; diagnostic : glycémie à jeun ≥ 1,26 g/L
  (7 mmol/L) sur deux prises de sang ; HbA1c = reflet du sucre sur 3 mois (objectif souvent ≤ 7 %).

## Partie 1 · Les 3 types (`Diabete-1`, ≈ 1 min 44)

| Scène | Voix (résumé) | À l'écran |
| --- | --- | --- |
| Accroche « paradoxe » | Son sang est rempli de sucre… et ses cellules meurent de faim. Le sucre est devant la porte… impossible d'entrer. Il manque une clé : l'insuline. C'est le diabète. | Image 0 : « Du sucre partout… et elles ont faim ? », sang plein de sucres au-dessus de 3 cellules fermées ; le sucre frappe à la porte et rebondit ; clé « INSULINE » en pointillés + « ? » ; « C'est le diabète » (flash) |
| La série | partie 1 · aujourd'hui : les trois types | Carte de la série (partie 1 « ICI », partie 2 cadenas) ; « Aujourd'hui : les 3 types » ; pastilles Type 1 · Type 2 · Gestationnel |
| Le principe | (déjà vu en vidéo) sucre = carburant ; la clé : l'insuline, fabriquée par le pancréas | Pastille « DÉJÀ VU EN VIDÉO · La glycémie » ; la clé entre, tourne, la porte s'ouvre, la cellule se recharge ; le pancréas fabrique les clés |
| Type 1 | les défenses attaquent le pancréas, plus d'insuline : la clé manque ; insulinodépendant : sans insuline, il ne peut pas vivre ; enfants et jeunes ; insuline toute sa vie | Les défenses arrivent et cognent le pancréas, qui s'éteint ; clé fantôme + « ? » ; carte **DID** (Diabète Insulino-Dépendant, « il dépend de l'insuline pour vivre ») ; le stylo pique, la clé entre, la porte s'ouvre ; pastilles « surtout enfants et jeunes », « insuline, toute sa vie » |
| Type 2 | le plus fréquent ; le pancréas fabrique encore… mais la clé marche mal ; non insulinodépendant : au début, on peut se passer d'insuline ; adultes, surpoids, peu d'activité | « 9 diabètes sur 10 » ; une clé va du pancréas à la porte et coince ; carte **DNID** (« au début : pas besoin d'insuline »), « d'abord : hygiène de vie, comprimés » ; pastilles adulte, surpoids (pèse-personne), peu d'activité (coureur barré) |
| Gestationnel | pendant la grossesse, les hormones du placenta gênent l'insuline ; dépistage 24e – 28e semaine, prise de sang après une boisson sucrée ; risque : bébé trop gros ; disparaît après l'accouchement, mais risque de type 2 plus tard | « gestationnel = pendant la grossesse » ; le ventre s'arrondit ; on voit dedans : placenta, hormones qui filent vers la cellule, la clé coince ; frise 0 → 40 SA, fenêtre 24 – 28 SA ; verre « boisson sucrée » + tube « prise de sang », « HGPO = le test au sucre » ; « bébé > 4 kg », « macrosomie = bébé trop gros » ; bébé dans les bras, la clé remarche, « en général, il disparaît » ; « risque de type 2 plus tard », « on la surveille, même après la grossesse » |
| Récap + à suivre | type 1 insulinodépendant, la clé manque ; type 2 non insulinodépendant, elle marche mal ; gestationnel, pendant la grossesse ; partie deux : le découvrir, le soigner | 3 lignes cochées ; carte « À SUIVRE · PARTIE 2 · Découvrir et soigner » |

## Partie 2 · Le découvrir et le soigner (`Diabete-2`, ≈ 1 min 37)

| Scène | Voix (résumé) | À l'écran |
| --- | --- | --- |
| Accroche « il va très bien… » | Il n'a jamais soif, jamais fatigué, en pleine forme. Et pourtant, depuis des années, le sucre en trop abîme ses yeux, ses reins et ses pieds. Son diabète ne fait aucun bruit… Comment le repérer à temps ? | Image 0 : « Il va très bien… vraiment ? », le patient sourit ; 3 pastilles cochées ; « Et pourtant » (flash) : elles pâlissent, du sucre circule dans son corps, la caméra va aux yeux puis aux reins, le pied s'abîme ; « Aucun bruit… » (sourdine) ; « Comment le repérer à temps ? » (lecteur + « ? ») |
| La série | partie 2 · aujourd'hui : le découvrir et le soigner | Carte de la série (partie 1 cochée, partie 2 « ICI ») ; « le découvrir », « le soigner » |
| Le découvrir | parfois soif, urines, fatigue ; mais le type 2 est souvent silencieux : la prise de sang le révèle ; à jeun ≥ 1,26 g/L sur deux prises de sang | Signes en pastilles qui pâlissent, « souvent aucun signe » ; 2 résultats (1,32 · 1,40 g/L), « à jeun = sans avoir mangé » ; échelle à jeun ; tampon « 2 fois = diabète » |
| Complications | vaisseaux et nerfs ; yeux, reins, cœur, cerveau, pieds : petite plaie qu'on ne sent pas, qui s'infecte → amputation | Caméra d'organe en organe, puis le pied ; « il ne sent pas la plaie », « elle s'infecte, elle grandit » ; 5 pastilles |
| Traitement | alimentation équilibrée, activité ; type 2 : comprimés, parfois insuline ; type 1 : l'insuline, toujours ; HbA1c = sucre sur 3 mois | 2 cases (assiette, course) ; lignes TYPE 2 (comprimés + parfois l'insuline) et TYPE 1 (l'insuline, toujours) ; encadré « LE SUIVI » (globule sucré, M1 · M2 · M3, objectif ≤ 7 %) |
| Ton rôle | glycémies capillaires, injections en changeant de site, pieds tous les jours ; hypo : on resucre (déjà vu) | 4 cases (lecteur, stylo + sites, pied + semaine, lecteur 0,55 + sucres) ; « DÉJÀ VU EN VIDÉO · La glycémie », « s'il est conscient : 15 g de sucre » |
| Récap + fin de série | souvent silencieux, prise de sang ; il abîme ; on le soigne ; ton rôle ; hypo ; la série est terminée | 5 lignes cochées, confettis ; carte « SÉRIE TERMINÉE · Le diabète » |
