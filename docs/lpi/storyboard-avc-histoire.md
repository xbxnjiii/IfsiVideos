# Storyboard — « AVC : l'histoire de Michel » (La Petite IDE, format histoire)

≈ 1 min 20 · 1080 × 1920 · composition `AVC-Histoire` · code : `src/videos/avc-histoire/`.
Essai du format **histoire (mystérieux)** : on ne présente pas une notion, on raconte un accident vécu par un patient
(Michel), avec une fausse piste puis la révélation. Mécanique de narration inspirée des vidéos « story » de TikTok,
mais histoire originale, couleurs et mascotte de la marque. Voix de la marque, débit +2 % (plus posé), texte exact :
[voix/15-avc-histoire.script.json](../../voix/15-avc-histoire.script.json).
Habillage : fond bleu nuit qui respire, cadre de « scanner » avec étiquette lieu · heure (`src/brand/night.tsx`),
une phrase clé à la fois (blanc, mots en rose), pas de barre de progression, pas de récap, mascotte discrète.

| Partie | À l'écran | Mascotte (mot → image) |
|--------|-----------|------------------------|
| Accroche | image 0 : « La moitié de son **sourire** vient de **disparaître**. », gros plan du visage de Michel dans le miroir, un côté de la bouche tombe · flash : retour en arrière « 07 H 41 · UNE MINUTE AVANT », « Ce matin, **Michel**, 64 ans. », il se rase · « glissé » : le rasoir tombe, la main lâche, gros plan, le sourire retombe | (absente) · surprise quand le rasoir tombe → plonge |
| L'histoire | « 07 H 43 · CUISINE » · bulle « Michel ? Ça va ? » · sa réponse « Oui… je vais bien » dont les lettres se mélangent (« Les mots sortent *dans le désordre*. ») · « Juste la **fatigue**. » · il ferme les yeux et penche · « Ça va **passer**. » : l'horloge tourne (tic-tac) | inquiète · réfléchit · erreur → sort à gauche |
| La révélation | flash rose « Sauf que ce n'est **pas** la fatigue. » · plongée dans la tête : le cerveau de profil · « Une artère vient de se **boucher**. » : zoom sur le caillot, la zone privée de sang · « C'est un **AVC**. » + **A**ccident **V**asculaire **C**érébral lettre par lettre · « Chaque **minute** : − 1 900 000 » (compteur), « neurones qui s'éteignent », les neurones s'éteignent | alerte · stressée · explique · inquiète → plonge dans le cerveau |
| On regarde le corps | « Le cerveau, on ne le **voit** pas. » : le cerveau se floute, « ? » · « Alors on regarde le **corps**. » : Michel · « Tout tient en **4** lettres : » V I T E qui claquent puis s'allument | questionnement · loupe · important → s'envole (panoramique haut) |
| V · I · T | rangée VITE (lettre en cours en rose) + « EN COURS : VITE = FAST · Face · Arm · Speech · Time » (écran seulement) · **V**isage : gros plan, il sourit, un côté tombe · **I**nertie (un bras ou une jambe ne répond plus) : il lève les deux bras, l'un retombe · **T**rouble de la parole : bulle « Il fait beau aujourd'hui » dont les lettres se mélangent | regardez · inquiète · montre en haut · surprise · présente · stressée → plonge dans le E |
| E comme en urgence | **E**n urgence · téléphone : le **15** compose et sonne · « même si les signes disparaissent » · horloge : « NOTEZ L'HEURE : 07 H 42 » · « l'heure guide le traitement » | téléphone · attention · important → sort à gauche |
| Pourquoi un seul côté | « Pourquoi d'un **seul** côté ? » : gros plan du cerveau vu à travers le crâne, deux hémisphères (bleu clair / rose) · « Chaque moitié du cerveau commande **l'autre** moitié. » : flèches croisées vers les bras, « COMMANDES CROISÉES » · « Une zone s'éteint… une **moitié** du corps suit. » : un hémisphère s'éteint, la moitié opposée du corps s'assombrit, le visage tombe du même côté que dans l'histoire | question · explique · triste → plonge |
| Fin | « Michel a été **soigné** à temps. » (cadre rose « MICHEL · SOIGNÉ À TEMPS », il sourit) · « Grâce à **4** lettres. » VITE allumé, éclats | joyeuse · cœur avec les mains → repart en courant |

Transitions : plongée (bleu nuit) · panoramique gauche · plongée dans le cerveau · panoramique haut · plongée dans le
E · panoramique gauche · plongée · vague vers le logo.
