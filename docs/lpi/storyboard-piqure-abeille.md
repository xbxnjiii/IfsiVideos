# Storyboard — « Piqûre d'abeille : comment retirer le dard ? » (`Piqure-Abeille`, n° 44, ≈ 49 s, voix gratuite d'abord)

Thème choisi librement (demandé : « en attendant, tu peux en faire une autre »). Idée reçue corrigée : on ne pince pas le
dard (on presse la poche de venin) ; on le gratte avec le bord d'une carte. Puis eau + savon, froid dans un linge une
dizaine de minutes ; réaction locale normale (rougeur, gonflement, douleur, quelques jours) ; appeler le 15 si le visage ou
la gorge gonfle, si on a du mal à respirer, ou si la piqûre est dans la bouche. Chute : la guêpe ne laisse pas son dard.

| Partie | Voix | Image |
|---|---|---|
| intro | Un pique-nique au soleil… et tout à coup, une abeille se pose sur ta main… et aïe ! Elle vient de te piquer… et son dard est resté planté. | Sans texte au début : nappe de pique-nique en vichy rose (assiette, verre de jus), une main posée à plat ; une abeille arrive en zigzag (bourdonnement) et se pose sur le dos de la main ; « aïe » : flash, la main sursaute, l'abeille repart ; la caméra plonge sur la piqûre : la peau en très gros plan, le dard planté en biais avec sa poche de venin qui pulse (cercle pointillé) |
| idees | Premier réflexe : l'attraper avec les doigts ? Surtout pas ! Tu presses la petite poche de venin… et tu en injectes encore plus. | Le pouce et l'index descendent sur la poche ; « Surtout pas ! » ; ils serrent : la poche s'écrase (« la poche de venin »), le venin se répand dans la peau, rougeur qui s'étend (« encore plus de venin ») |
| methode | Le bon geste : gratte le dard avec le bord d'une carte, comme une carte bancaire. Il sort tout seul, sans être pressé. | « Gratte avec une carte » : une carte bancaire entre par la droite (« le bord de la carte »), glisse à plat sur la peau, son bord pousse le dard qui bascule et sort ; « Il sort tout seul », la carte repart, il ne reste qu'un point rose ; « sans presser la poche ✓ » |
| soins | Ensuite, lave à l'eau et au savon. Puis pose du froid : un glaçon dans un linge, une dizaine de minutes. | Médaillon de peau en haut ; cartes : 1 « Eau + savon » (robinet, mousse), 2 « Du froid » (glaçon dans un linge, petits flocons) ; chip « 10' » |
| normal | Rougeur, gonflement, douleur autour de la piqûre : c'est normal. Ça passe en quelques jours. | La peau : rougeur, gonflement (papule rose surélevée), douleur (petits traits qui pulsent), étiquettes au mot ; « C'est normal » ; « J+3 », la papule dégonfle |
| urgence | Mais si ton visage ou ta gorge gonfle, si tu as du mal à respirer, ou si tu as été piqué dans la bouche : appelle le quinze, tout de suite. | « Mais si… » ; cartes « ! » : le visage ou la gorge gonfle, du mal à respirer, piqûre dans la bouche ; « Appelle le 15 ! », téléphone qui compose le 15 et sonne |
| fin | Et la guêpe ? Elle, elle ne laisse pas son dard… donc pas besoin de gratter ! | Une guêpe (taille fine, rayures bleues) arrive : « Et la guêpe ? » ; « Pas de dard » (médaillon : juste un point) ; « Pas besoin de gratter ! » (carte barrée), étincelles |

Briques : `src/brand/bee.tsx` (`BeeG` abeille / guêpe vue de dessus, `HandTopG` + `HAND`, `StingerG`, `VenomSpread`,
`WhealG`, `CardG`, `PinchTipsG`, `IceCloth`, `PicnicBg`, `SwellFaceIcon`, `BreathAlertIcon`, `MouthStingIcon`) + `SkinG`,
`SkinMedallion` de `tick.tsx`.
