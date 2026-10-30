# Storyboard — « L'arrêt cardiaque chez l'adulte » (La Petite IDE)

≈ 1 min 25 · 1080 × 1920 · composition `Arret-Cardiaque` · code : `src/videos/arret-cardiaque/`.
Format « pathologie / urgence » (comme l'AVC) : accroche-choc dès l'image 0. Voix de la marque, texte exact :
[voix/11-arret-cardiaque.script.json](../../voix/11-arret-cardiaque.script.json) (massage et RCP 10 % plus lents).

| Partie | À l'écran | Mascotte (mot → image) |
|--------|-----------|------------------------|
| Accroche | image 0 : moniteur ECG qui bat « ♥ 72 » + patient debout · « Son cœur s'arrête… » : fibrillation puis tracé **plat** « 0 », bip, flash rose, le patient s'effondre · horloge « **3** minutes » + cerveau « En danger ! » · **100 % → 40 %** chances de survie, un cran « −10 % » par minute sans massage · « C'est quoi un **arrêt cardiaque** ? et quels *gestes* faire ? » + cœur qui tremble | alerte · stressée · attention · question → plonge dans le cœur |
| Définition | **dans le corps** : patient avec cœur, artères (bras, carotides) et cerveau visible · zoom sur « le cœur » qui pompe (ECG 72) puis **tremble** (FV) · **Fibrillation ventriculaire** (le cœur tremble au lieu de battre) · recul : les artères se vident, « le sang ne circule plus » · zoom sur « le cerveau » qui s'éteint, O₂ barré, « plus d'oxygène », yeux qui se ferment | explique · grelotte (trembler) · douleur poitrine · inquiète |
| Reconnaître | zoom sur le visage (yeux fermés) · ✗ ne répond pas · « Vous m'entendez ? » · recul : on le stimule (mains sur les épaules) · plongée dans la tête → **gros plan de profil** : main sur le front, deux doigts sous le menton, la tête bascule en arrière (flèche) · regarder · écouter · sentir, chrono **10 s** · retour sur le thorax : ✗ ne respire pas · **Gasps** (respirations rares et bruyantes) | question · bonjour · surprise · présente · réfléchit · essoufflée |
| Alerter | zoom sur le téléphone qui compose le **15** et sonne · « ou le 112 » · DAE (défibrillateur automatisé externe) · ✓ appeler · ✓ faire chercher un DAE | téléphone · important → traverse en courant |
| Masser | zoom sur la cible au centre de la poitrine · recul : bras tendus du sauveteur, mains qui enfoncent au rythme · jauge **5–6 cm** · **100–120/min** · ♪ notes + tampon « Staying Alive » · 4 puces cochées | regardez · motivée · OK · danse (youpi) |
| RCP | **RCP** = réanimation cardio-pulmonaire · **30** compressions (30 pastilles qui se remplissent) + **2** insufflations (poumons) · « on ne s'arrête pas » · ✓ jusqu'à l'arrivée des secours | explique · motivée · souffle · important · valide |
| DAE | le DAE arrive, zoom sur son écran « Allumé », « Collez les électrodes » · électrodes + câbles · « Analyse… » ECG en FV · « Choc conseillé » · **Choc !** flash, sursaut, le rythme repart · « Personne ne touche ! » + zone autour du patient | regardez · cherche · alerte · erreur (croix) → traverse en courant |
| Récap rapide | ne répond pas, ne respire pas · arrêt cardiaque · alerter le 15 · masser 100–120/min · défibriller · confettis | une pose par ligne · bravo → repart en courant |

Caméra : la vue s'approche de ce dont parle la voix (brique `ZoomCam`), pastilles fixes par-dessus.
Transitions : plongée dans le cœur · panoramique gauche · vague · rideau · panoramique haut · vague · rideau ·
plongée vers le logo.
