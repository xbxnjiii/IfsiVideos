# IFSI Vidéos — La Petite IDE

Mini-vidéos en motion design (TikTok / Instagram Reels / YouTube Shorts, 1080×1920) pour réviser
les cours d'IFSI. Tout est généré **en code** avec [Remotion](https://www.remotion.dev/) (React → MP4) :
pas de logiciel de montage, pas de banque d'images.

> La charte de la marque (couleurs, typo, mascotte, tempo, physique, transitions) est décrite dans
> [docs/lpi/charte-video.md](docs/lpi/charte-video.md) et codée dans `src/brand/`.
> Mémoire de travail pour les prochaines vidéos : [CLAUDE.md](CLAUDE.md).

## Vidéos

| # | Sujet | Composition | Script voix | Storyboard |
|---|-------|-------------|-------------|------------|
| 02 | Les 7 constantes (T°, FC, FR, PA, SpO₂, glycémie, diurèse) + normes adultes | `Constantes` | [voix/02-constantes.script.json](voix/02-constantes.script.json) | [storyboard](docs/lpi/storyboard-constantes.md) |
| 03 | Les 14 besoins fondamentaux (Virginia Henderson), en 3 étapes | `Besoins-Fondamentaux` | [voix/03-besoins-fondamentaux.script.json](voix/03-besoins-fondamentaux.script.json) | [storyboard](docs/lpi/storyboard-besoins-fondamentaux.md) |
| 04 | La fréquence cardiaque | `Frequence-Cardiaque` | [voix/04-frequence-cardiaque.script.json](voix/04-frequence-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-frequence-cardiaque.md) |
| 05 | La fréquence respiratoire | `Frequence-Respiratoire` | [voix/05-frequence-respiratoire.script.json](voix/05-frequence-respiratoire.script.json) | [storyboard](docs/lpi/storyboard-frequence-respiratoire.md) |
| 06 | La température corporelle | `Temperature` | [voix/06-temperature.script.json](voix/06-temperature.script.json) | [storyboard](docs/lpi/storyboard-temperature.md) |
| 07 | La tension artérielle | `Tension-Arterielle` | [voix/07-tension-arterielle.script.json](voix/07-tension-arterielle.script.json) | [storyboard](docs/lpi/storyboard-tension-arterielle.md) |
| 08 | La glycémie | `Glycemie` | [voix/08-glycemie.script.json](voix/08-glycemie.script.json) | [storyboard](docs/lpi/storyboard-glycemie.md) |
| 09 | La diurèse | `Diurese` | [voix/09-diurese.script.json](voix/09-diurese.script.json) | [storyboard](docs/lpi/storyboard-diurese.md) |
| 10 | C'est quoi un AVC (pathologie : accroche-choc, VITE) | `AVC` | [voix/10-avc.script.json](voix/10-avc.script.json) | [storyboard](docs/lpi/storyboard-avc.md) |
| 11 | L'arrêt cardiaque chez l'adulte (RCP, DAE) | `Arret-Cardiaque` | [voix/11-arret-cardiaque.script.json](voix/11-arret-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-arret-cardiaque.md) |
| 12 | C'est quoi la SpO₂ | `SpO2` | [voix/12-spo2.script.json](voix/12-spo2.script.json) | [storyboard](docs/lpi/storyboard-spo2.md) |
| 14 | C'est quoi une embolie pulmonaire | `Embolie-Pulmonaire` | [voix/14-embolie-pulmonaire.script.json](voix/14-embolie-pulmonaire.script.json) | [storyboard](docs/lpi/storyboard-embolie-pulmonaire.md) |
| 15 | AVC, format histoire (Michel, mystérieux) | `AVC-Histoire` | [voix/15-avc-histoire.script.json](voix/15-avc-histoire.script.json) | [storyboard](docs/lpi/storyboard-avc-histoire.md) |
| 16 | La BPCO (v2 : « Juste une toux de fumeur ? », radio couche par couche) | `BPCO` | [voix/16-bpco.script.json](voix/16-bpco.script.json) | [storyboard](docs/lpi/storyboard-bpco.md) |
| 17 | Série « Les plaies » 1/3 : les bases | `Plaies-1` | [voix/17-plaies-1.script.json](voix/17-plaies-1.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 18 | Série « Les plaies » 2/3 : les plaies aiguës | `Plaies-2` | [voix/18-plaies-2.script.json](voix/18-plaies-2.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 19 | Série « Les plaies » 3/3 : les plaies chroniques | `Plaies-3` | [voix/19-plaies-3.script.json](voix/19-plaies-3.script.json) | [storyboard](docs/lpi/storyboard-plaies-serie.md) |
| 20 | Le matériel pour une prise de sang (format inventaire, v2 look 2026 + voix Laura) | `Prise-De-Sang` | [voix/20-prise-de-sang.script.json](voix/20-prise-de-sang.script.json) | [storyboard](docs/lpi/storyboard-prise-de-sang.md) |
| 21 | Les 5 indications de l'hygiène des mains (liste à retenir) | `Hygiene-Mains` | [voix/21-hygiene-mains.script.json](voix/21-hygiene-mains.script.json) | [storyboard](docs/lpi/storyboard-hygiene-mains.md) |
| 22 | Les précautions standard (liste à retenir) | `Precautions-Standard` | [voix/22-precautions-standard.script.json](voix/22-precautions-standard.script.json) | [storyboard](docs/lpi/storyboard-precautions-standard.md) |
| 23 | L'insuffisance cardiaque (pathologie) | `Insuffisance-Cardiaque` | [voix/23-insuffisance-cardiaque.script.json](voix/23-insuffisance-cardiaque.script.json) | [storyboard](docs/lpi/storyboard-insuffisance-cardiaque.md) |
| 24 | La douleur 1/2 : l'auto-évaluation (série) (v2 : accroche « trois soignants », voix Laura) | `Douleur-1` | [voix/24-douleur-1.script.json](voix/24-douleur-1.script.json) | [storyboard](docs/lpi/storyboard-douleur-serie.md) |
| 25 | La douleur 2/2 : l'hétéro-évaluation (série) (v2 : accroche « elle ne se plaint jamais », voix Laura) | `Douleur-2` | [voix/25-douleur-2.script.json](voix/25-douleur-2.script.json) | [storyboard](docs/lpi/storyboard-douleur-serie.md) |
| 26 | Le diabète 1/2 : les 3 types (série, accroche « paradoxe ») | `Diabete-1` | [voix/26-diabete-1.script.json](voix/26-diabete-1.script.json) | [storyboard](docs/lpi/storyboard-diabete-serie.md) |
| 26 | Le diabète 2/2 : le découvrir et le soigner (série) | `Diabete-2` | [voix/26-diabete-2.script.json](voix/26-diabete-2.script.json) | [storyboard](docs/lpi/storyboard-diabete-serie.md) |
| 27 | Promo : quiz éclair + les 7 vidéos des constantes → quiz gratuit lapetiteide.fr | `Quiz-Constantes` | [voix/27-quiz-constantes.script.json](voix/27-quiz-constantes.script.json) | [storyboard](docs/lpi/storyboard-quiz-constantes.md) |
| 28 | Les constantes de l'enfant (0 – 2 · 2 – 11 · 12 – 17 ans) : seulement ce qui change | `Constantes-Enfant` | [voix/28-constantes-enfant.script.json](voix/28-constantes-enfant.script.json) | [storyboard](docs/lpi/storyboard-constantes-enfant.md) |
| 29 | Court info + humour : comment mettre un suppositoire (idée reçue « côté plat »), voix Laura | `Suppositoire` | [voix/29-suppositoire.script.json](voix/29-suppositoire.script.json) | [storyboard](docs/lpi/storyboard-suppositoire.md) |
| 30 | Court info : pourquoi ne jamais retirer un objet planté (l'éclat de verre de la vaisselle), voix Laura, bruitages réels | `Objet-Plante` | [voix/30-objet-plante.script.json](voix/30-objet-plante.script.json) | [storyboard](docs/lpi/storyboard-objet-plante.md) |
| 31 | Série courte « Les plaies » : superficielle ou profonde (genou râpé), voix Laura | `Plaie-Profondeur` | [voix/31-plaie-profondeur.script.json](voix/31-plaie-profondeur.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 32 | Série courte « Les plaies » : franche ou contuse (couteau ou portière), voix Laura | `Plaie-Contuse` | [voix/32-plaie-contuse.script.json](voix/32-plaie-contuse.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 33 | Série courte « Les plaies » : la piqûre (le clou), voix Laura | `Plaie-Piqure` | [voix/33-plaie-piqure.script.json](voix/33-plaie-piqure.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 34 | Série courte « Les plaies » : la morsure (le chat), voix Laura | `Plaie-Morsure` | [voix/34-plaie-morsure.script.json](voix/34-plaie-morsure.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 35 | Série courte « Les plaies » : aiguë ou chronique, voix Laura | `Plaie-Chronique` | [voix/35-plaie-chronique.script.json](voix/35-plaie-chronique.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 36 | Série courte « Les plaies » : l'escarre, voix Laura | `Escarre` | [voix/36-escarre.script.json](voix/36-escarre.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 37 | Série courte « Les plaies » : pied diabétique et ulcère de jambe, voix Laura | `Pied-Diabetique` | [voix/37-pied-diabetique.script.json](voix/37-pied-diabetique.script.json) | [storyboard](docs/lpi/storyboard-plaies-courtes.md) |
| 38 | Court info : que doit contenir une trousse de secours à la maison (voix gratuite, accroche animée sans texte) | `Trousse-Secours` | [voix/38-trousse-secours.script.json](voix/38-trousse-secours.script.json) | [storyboard](docs/lpi/storyboard-trousse-secours.md) |
| 39 | Court info : comment bien mettre un pansement (voix gratuite, accroche animée sans texte) | `Pansement` | [voix/39-pansement.script.json](voix/39-pansement.script.json) | [storyboard](docs/lpi/storyboard-pansement.md) |
| 40 | Court info : comment soigner une petite brûlure (voix gratuite, accroche animée sans texte) | `Brulure` | [voix/40-brulure.script.json](voix/40-brulure.script.json) | [storyboard](docs/lpi/storyboard-brulure.md) |
| 41 | Court info : comment retirer une écharde (voix gratuite, accroche animée sans texte) | `Echarde` | [voix/41-echarde.script.json](voix/41-echarde.script.json) | [storyboard](docs/lpi/storyboard-echarde.md) |
| 42 | Court info : une tique, comment bien la retirer (voix Laura, accroche animée sans texte) | `Tique` | [voix/42-tique.script.json](voix/42-tique.script.json) | [storyboard](docs/lpi/storyboard-tique.md) |
| 43 | Court info : saignement de nez, tête en avant (voix gratuite, accroche animée sans texte) | `Saignement-Nez` | [voix/43-saignement-nez.script.json](voix/43-saignement-nez.script.json) | [storyboard](docs/lpi/storyboard-saignement-nez.md) |
| 44 | Court info : piqûre d'abeille, gratter le dard avec une carte (voix gratuite, accroche animée sans texte) | `Piqure-Abeille` | [voix/44-piqure-abeille.script.json](voix/44-piqure-abeille.script.json) | [storyboard](docs/lpi/storyboard-piqure-abeille.md) |
| 45 | Court info : entorse de la cheville, glace · repos · élévation · contention (voix gratuite, accroche animée sans texte) | `Entorse` | [voix/45-entorse.script.json](voix/45-entorse.script.json) | [storyboard](docs/lpi/storyboard-entorse.md) |
| 46 | Court info : brûlure du 1er degré (voix gratuite, accroche plage réaliste) | `Brulure-1` | [voix/46-brulure-1.script.json](voix/46-brulure-1.script.json) | [storyboard](docs/lpi/storyboard-brulures-degres.md) |
| 47 | Court info : brûlure du 2e degré superficiel / profond (voix gratuite, accroche pâtes réaliste) | `Brulure-2` | [voix/47-brulure-2.script.json](voix/47-brulure-2.script.json) | [storyboard](docs/lpi/storyboard-brulures-degres.md) |
| 48 | Court info : brûlure du 3e degré (voix gratuite, accroche barbecue réaliste) | `Brulure-3` | [voix/48-brulure-3.script.json](voix/48-brulure-3.script.json) | [storyboard](docs/lpi/storyboard-brulures-degres.md) |
| 49 | Pathologie : le cancer de la prostate (voix Laura, accroche « il se lève la nuit ») | `Cancer-Prostate` | [voix/49-cancer-prostate.script.json](voix/49-cancer-prostate.script.json) | [storyboard](docs/lpi/storyboard-cancer-prostate.md) |
| 50 | Pathologie : le cancer du sein (voix Laura, accroche « la boule dans la salle de bain », schéma fourni sans annotations) | `Cancer-Sein` | [voix/50-cancer-sein.script.json](voix/50-cancer-sein.script.json) | [storyboard](docs/lpi/storyboard-cancer-sein.md) |
| 51 | Pathologie : le cancer du poumon (voix Laura, accroche « le mouchoir sur le balcon », schéma fourni sans annotations) | `Cancer-Poumon` | [voix/51-cancer-poumon.script.json](voix/51-cancer-poumon.script.json) | [storyboard](docs/lpi/storyboard-cancer-poumon.md) |
| 52 | Pathologie : le cancer colorectal (voix Laura, accroche « la lettre dans le tiroir », schéma fourni sans annotations) | `Cancer-Colorectal` | [voix/52-cancer-colorectal.script.json](voix/52-cancer-colorectal.script.json) | [storyboard](docs/lpi/storyboard-cancer-colorectal.md) |
| 53 | Pathologie : le cancer de la vessie (voix Laura, accroche « l'eau qui rougit », schéma fourni sans annotations) | `Cancer-Vessie` | [voix/53-cancer-vessie.script.json](voix/53-cancer-vessie.script.json) | [storyboard](docs/lpi/storyboard-cancer-vessie.md) |
| 54 | Pathologie : le cancer du pancréas (voix Laura, accroche « le jaune dans le miroir », schéma fourni sans annotations) | `Cancer-Pancreas` | [voix/54-cancer-pancreas.script.json](voix/54-cancer-pancreas.script.json) | [storyboard](docs/lpi/storyboard-cancer-pancreas.md) |
| 55 | Pathologie : le cancer de l'estomac (voix Laura, accroche « l'assiette repoussée », schéma fourni sans annotations) | `Cancer-Estomac` | [voix/55-cancer-estomac.script.json](voix/55-cancer-estomac.script.json) | [storyboard](docs/lpi/storyboard-cancer-estomac.md) |
| 56 | Pathologie : le cancer du rein (voix Laura, accroche « découvert par hasard », schéma fourni sans annotations) | `Cancer-Rein` | [voix/56-cancer-rein.script.json](voix/56-cancer-rein.script.json) | [storyboard](docs/lpi/storyboard-cancer-rein.md) |
| 57 | Pathologie : le cancer du foie (voix Laura, accroche « un verre… puis un deuxième », schéma fourni sans annotations) | `Cancer-Foie` | [voix/57-cancer-foie.script.json](voix/57-cancer-foie.script.json) | [storyboard](docs/lpi/storyboard-cancer-foie.md) |
| 58 | Pathologie : le cancer de l'œsophage (voix Laura, accroche « ça coince », schéma fourni sans annotations) | `Cancer-Oesophage` | [voix/58-cancer-oesophage.script.json](voix/58-cancer-oesophage.script.json) | [storyboard](docs/lpi/storyboard-cancer-oesophage.md) |
| 59 | Pathologie : le cancer de l'anus (voix Laura, accroche « le papier toilette », schéma fourni sans annotations) | `Cancer-Anus` | [voix/59-cancer-anus.script.json](voix/59-cancer-anus.script.json) | [storyboard](docs/lpi/storyboard-cancer-anus.md) |
| 60 | Pathologie : le cancer des voies biliaires (voix Laura, accroche « il se gratte la nuit », schéma fourni sans annotations) | `Cancer-Voies-Biliaires` | [voix/60-cancer-voies-biliaires.script.json](voix/60-cancer-voies-biliaires.script.json) | [storyboard](docs/lpi/storyboard-cancer-voies-biliaires.md) |
| 61 | Inventaire : l'ordre des tubes de prélèvement (voix Laura, accroche « le labo appelle : potassium à 7 », l'ordre seul) | `Tubes-Prelevement` | [voix/61-tubes-prelevement.script.json](voix/61-tubes-prelevement.script.json) | [storyboard](docs/lpi/storyboard-tubes-prelevement.md) |
| 62 | Série les tubes : le tube violet, la NFS ligne par ligne avec les normes, + HbA1c et BNP (voix Laura) | `Tube-Violet` | [voix/62-tube-violet.script.json](voix/62-tube-violet.script.json) | [storyboard](docs/lpi/storyboard-tube-violet.md) |
| 63 | Série les tubes : le tube jaune, l'ionogramme ion par ion avec les normes (voix Laura) | `Tube-Jaune` | [voix/63-tube-jaune.script.json](voix/63-tube-jaune.script.json) | [storyboard](docs/lpi/storyboard-tube-jaune.md) |
| 64 | Série les tubes : le tube jaune (2), le bilan rénal : urée, créatinine, DFG et ses stades (voix Laura) | `Tube-Jaune-Renal` | [voix/64-tube-jaune-renal.script.json](voix/64-tube-jaune-renal.script.json) | [storyboard](docs/lpi/storyboard-tube-jaune-renal.md) |
| 65 | Série les tubes : le tube de purge (bouchon blanc), pourquoi et quand (voix Laura, directives Instagram) | `Tube-Purge` | [voix/65-tube-purge.script.json](voix/65-tube-purge.script.json) | [storyboard](docs/lpi/storyboard-tube-purge.md) |
| 66 | Série les tubes : l'ordre des tubes en 42 s (5 tubes, sans le rouge ni le vert ; l'ordre seul, aiguille, retournements ; voix Laura, directives Instagram) | `Ordre-Tubes` | [voix/66-ordre-tubes.script.json](voix/66-ordre-tubes.script.json) | [storyboard](docs/lpi/storyboard-ordre-tubes.md) |
| 67 | Série le tube violet : la NFS 1/2, les globules rouges en 54 s (hématies, hémoglobine, hématocrite, VGM + normes ; voix Laura, directives Instagram) | `NFS-Globules-Rouges` | [voix/67-nfs-globules-rouges.script.json](voix/67-nfs-globules-rouges.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 68 | Série le tube violet : la NFS 2/2, globules blancs et plaquettes en 60 s (7 lignes + normes ; voix Laura, directives Instagram) | `NFS-Globules-Blancs` | [voix/68-nfs-globules-blancs.script.json](voix/68-nfs-globules-blancs.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 69 | Série le tube violet : l'HbA1c en 57 s (photo ou film, 120 jours, objectifs, en pratique ; voix Laura, directives Instagram) | `HbA1c` | [voix/69-hba1c.script.json](voix/69-hba1c.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 70 | Série le tube violet : le groupe sanguin et les RAI en 59 s (ABO, rhésus, 2 déterminations, RAI ; voix Laura, directives Instagram) | `Groupe-Sanguin` | [voix/70-groupe-sanguin.script.json](voix/70-groupe-sanguin.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 71 | Série le tube violet : la charge virale en 60 s (copies/mL, VIH et I = I, hépatites B et C ; voix Laura, directives Instagram) | `Charge-Virale` | [voix/71-charge-virale.script.json](voix/71-charge-virale.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 72 | Série le tube violet : les anti-rejet en 54 s (immunosuppresseurs, marge étroite, taux résiduel, pamplemousse ; voix Laura, directives Instagram) | `Anti-Rejet` | [voix/72-anti-rejet.script.json](voix/72-anti-rejet.script.json) | [storyboard](docs/lpi/storyboard-tube-violet-serie.md) |
| 73 | Série les tubes : le tube gris, la glycémie en 58 s (fluorure, à jeun, normes, diabète ; voix Laura, directives Instagram) | `Tube-Gris-Glycemie` | [voix/73-tube-gris-glycemie.script.json](voix/73-tube-gris-glycemie.script.json) | [storyboard](docs/lpi/storyboard-tube-gris.md) |
| 74 | Série les tubes : le tube gris, l'alcoolémie en 57 s (antiseptique sans alcool, seuils au volant, élimination ; voix Laura, directives Instagram) | `Tube-Gris-Alcoolemie` | [voix/74-tube-gris-alcoolemie.script.json](voix/74-tube-gris-alcoolemie.script.json) | [storyboard](docs/lpi/storyboard-tube-gris.md) |
| 75 | Série les tubes : le tube bleu, TP et INR en 62 s (remplissage jusqu'au trait, TP, INR / AVK ; voix Laura, directives Instagram) | `Tube-Bleu-TP-INR` | [voix/75-tube-bleu-tp-inr.script.json](voix/75-tube-bleu-tp-inr.script.json) | [storyboard](docs/lpi/storyboard-tube-bleu.md) |
| 76 | Série les tubes : le tube bleu, TCA, fibrinogène et D-dimères en 59 s (voix Laura, directives Instagram) | `Tube-Bleu-TCA` | [voix/76-tube-bleu-tca.script.json](voix/76-tube-bleu-tca.script.json) | [storyboard](docs/lpi/storyboard-tube-bleu.md) |
| 77 | Série les tubes : le tube bleu, anti-Xa, antithrombine, protéines C et S, facteurs en 64 s (voix Laura, directives Instagram) | `Tube-Bleu-Facteurs` | [voix/77-tube-bleu-facteurs.script.json](voix/77-tube-bleu-facteurs.script.json) | [storyboard](docs/lpi/storyboard-tube-bleu.md) |
| 78 | Série les tubes : le tube jaune, les reins en 56 s (urée, créatinine + DFG, acide urique ; voix Laura, directives Instagram) | `Tube-Jaune-Reins` | [voix/78-tube-jaune-reins.script.json](voix/78-tube-jaune-reins.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 79 | Série les tubes : le tube jaune, le fer en 50 s (fer, ferritine, transferrine) ; voix Laura, directives Instagram | `Tube-Jaune-Fer` | [voix/79-tube-jaune-fer.script.json](voix/79-tube-jaune-fer.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 80 | Série les tubes : le tube jaune, le foie en 54 s (ASAT / ALAT, gamma-GT, PAL) ; voix gratuite, directives Instagram | `Tube-Jaune-Foie` | [voix/80-tube-jaune-foie.script.json](voix/80-tube-jaune-foie.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 81 | Série les tubes : le tube jaune, le bilan lipidique en 58 s (total, LDL, HDL, triglycérides) ; voix gratuite, directives Instagram | `Tube-Jaune-Lipides` | [voix/81-tube-jaune-lipides.script.json](voix/81-tube-jaune-lipides.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 82 | Série les tubes : le tube jaune, les enzymes en 52 s (CPK, LDH, lipase) ; voix gratuite, directives Instagram | `Tube-Jaune-Enzymes` | [voix/82-tube-jaune-enzymes.script.json](voix/82-tube-jaune-enzymes.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 83 | Série les tubes : le tube jaune, les ions 1/2 (sodium, potassium, chlore) ; voix gratuite, directives Instagram | `Tube-Jaune-Ions` | [voix/83-tube-jaune-ions.script.json](voix/83-tube-jaune-ions.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 84 | Série les tubes : le tube jaune, les ions 2/2 (calcium, phosphore, magnésium, bicarbonates) ; voix gratuite, directives Instagram | `Tube-Jaune-Ions-2` | [voix/84-tube-jaune-ions-2.script.json](voix/84-tube-jaune-ions-2.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 85 | Série les tubes : le tube jaune, l'inflammation (CRP, procalcitonine) ; voix gratuite, directives Instagram | `Tube-Jaune-Inflammation` | [voix/85-tube-jaune-inflammation.script.json](voix/85-tube-jaune-inflammation.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 86 | Série les tubes : le tube jaune, les protéines (albumine, préalbumine, haptoglobine) ; voix gratuite, directives Instagram | `Tube-Jaune-Proteines` | [voix/86-tube-jaune-proteines.script.json](voix/86-tube-jaune-proteines.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 87 | Série les tubes : le tube jaune, l'électrophorèse et les immunoglobulines ; voix gratuite, directives Instagram | `Tube-Jaune-Electrophorese` | [voix/87-tube-jaune-electrophorese.script.json](voix/87-tube-jaune-electrophorese.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 88 | Série les tubes : le tube jaune, le cœur (troponine, NT-proBNP) ; voix gratuite, directives Instagram | `Tube-Jaune-Coeur` | [voix/88-tube-jaune-coeur.script.json](voix/88-tube-jaune-coeur.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 89 | Série les tubes : le tube jaune, les marqueurs tumoraux (AFP, CA 125, CA 15-3, CA 19-9, ACE, PSA) ; voix gratuite, directives Instagram | `Tube-Jaune-Marqueurs` | [voix/89-tube-jaune-marqueurs.script.json](voix/89-tube-jaune-marqueurs.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 90 | Série les tubes : le tube jaune, les hormones 1/2 (TSH, cortisol, prolactine) ; voix gratuite, directives Instagram | `Tube-Jaune-Hormones` | [voix/90-tube-jaune-hormones.script.json](voix/90-tube-jaune-hormones.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 91 | Série les tubes : le tube jaune, les hormones 2/2 (β-hCG, FSH, LH, progestérone, testostérone) ; voix gratuite, directives Instagram | `Tube-Jaune-Hormones-2` | [voix/91-tube-jaune-hormones-2.script.json](voix/91-tube-jaune-hormones-2.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 92 | Série les tubes : le tube jaune, les sérologies 1/3 (hépatites, VIH, syphilis) ; voix gratuite, directives Instagram | `Tube-Jaune-Serologies` | [voix/92-tube-jaune-serologies.script.json](voix/92-tube-jaune-serologies.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 93 | Série les tubes : le tube jaune, les sérologies 2/3 de la grossesse (toxoplasmose, rubéole, CMV, EBV) ; voix gratuite, directives Instagram | `Tube-Jaune-Serologies-2` | [voix/93-tube-jaune-serologies-2.script.json](voix/93-tube-jaune-serologies-2.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 94 | Série les tubes : le tube jaune, les sérologies 3/3 (ASLO / ASD, Lyme, Covid) ; voix gratuite, directives Instagram | `Tube-Jaune-Serologies-3` | [voix/94-tube-jaune-serologies-3.script.json](voix/94-tube-jaune-serologies-3.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 95 | Série les tubes : le tube jaune, l'allergologie (Phadiatop, Trophatop, IgE spécifiques) ; voix gratuite, directives Instagram | `Tube-Jaune-Allergologie` | [voix/95-tube-jaune-allergologie.script.json](voix/95-tube-jaune-allergologie.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 96 | Série les tubes : le tube jaune, les médicaments (digoxine, lithium) ; voix gratuite, directives Instagram | `Tube-Jaune-Medicaments` | [voix/96-tube-jaune-medicaments.script.json](voix/96-tube-jaune-medicaments.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 97 | Série les tubes : le tube jaune, l'auto-immunité 1/2 (AAN, anti-ADN, ENA, ANCA) ; voix gratuite, directives Instagram | `Tube-Jaune-Auto-Immunite` | [voix/97-tube-jaune-auto-immunite.script.json](voix/97-tube-jaune-auto-immunite.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 98 | Série les tubes : le tube jaune, l'auto-immunité 2/2 (anti-CCP, facteur rhumatoïde, anti-TPO, anti-Tg) ; voix gratuite, directives Instagram | `Tube-Jaune-Auto-Immunite-2` | [voix/98-tube-jaune-auto-immunite-2.script.json](voix/98-tube-jaune-auto-immunite-2.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 99 | Série les tubes : le tube jaune, les vitamines (D, B12, folates) et la CDT, fin de la série ; voix gratuite, directives Instagram | `Tube-Jaune-Vitamines` | [voix/99-tube-jaune-vitamines.script.json](voix/99-tube-jaune-vitamines.script.json) | [plan](docs/lpi/plan-tube-jaune-serie.md) |
| 100 | Série les tubes : les hémocultures v2 (matériel en 8 objets, 40 – 60 mL = 2 à 3 paires sur 24 h, ordre vert / orange, asepsie) ; voix gratuite, directives Instagram | `Hemocultures` | [voix/100-hemocultures.script.json](voix/100-hemocultures.script.json) | — |
| 101 | L'anatomie : l'organisation du corps humain (cellule, tissu, organe, appareil, organisme ; fil rouge : le cœur) ; voix gratuite, directives Instagram | `Organisation-Corps` | [voix/101-organisation-corps.script.json](voix/101-organisation-corps.script.json) | — |
| 102 | L'anatomie : l'organisation du corps humain, **version schéma annoté** (schémas de manuel dessinés, légendes au mot) ; voix gratuite, directives Instagram | `Organisation-Corps-Schema` | [voix/102-organisation-corps-schema.script.json](voix/102-organisation-corps-schema.script.json) | — |
| 103 | L'anatomie : la cellule (unité vivante, 3 parties, organites, mitose) ; voix gratuite, directives Instagram | `La-Cellule` | [voix/103-la-cellule.script.json](voix/103-la-cellule.script.json) | — |
| 104 | L'anatomie : la cellule, **schéma annoté** (15 structures légendées au mot) ; voix gratuite, directives Instagram | `La-Cellule-Schema` | [voix/104-la-cellule-schema.script.json](voix/104-la-cellule-schema.script.json) | — |

## Utilisation

```bash
npm install
npm run studio                                   # aperçu interactif dans le navigateur
npm run render:<vidéo>                           # -> out/<n>-<vidéo>.mp4 (liste : package.json)
npm run voice -- voix/<n>-<sujet>.script.json <épisode>   # voix de la marque + timing mot à mot
npm run check:voice -- <épisode> [--model medium]         # langue et transcription de chaque partie
npm run new -- <épisode> <Composition> <Composant> <n>    # squelette d'une nouvelle vidéo + déclarations
npm run cues -- <épisode>                        # frames des mots, scène par scène (= at(scène, mot))
npm run check:mascot -- <épisode>                # vérifie le jeu de la mascotte
npm run qa -- <Composition> <frame> <frame> …    # images clés + planches -> out/qa/sheet*.jpg
npm run sheet -- out/<vidéo>.mp4                 # planches 1 image/s d'une vidéo rendue
npm run splice -- out/<vidéo>.mp4 seg.mp4@<début> …       # recolle des portions recalculées
npm run sfx                                      # regénère les bruitages (public/sfx)
```

Le navigateur sans interface du conteneur de travail et 4 rendus en parallèle sont réglés dans `remotion.config.ts`.

## Organisation

Mode d'emploi complet pour fabriquer une vidéo (charte, mascotte, formats, accroches, voix, briques, contrôle) :
skill `.claude/skills/la-petite-ide/` (catalogue des briques régénéré par `python3 scripts/brand/catalog.py`).

```
src/
  Root.tsx                    liste des compositions
  brand/                      LA PETITE IDE : briques réutilisables par toutes les vidéos
    theme.ts                  couleurs, polices, grille
    ui.tsx, learn.tsx         titres mot à mot, pinceau, signes ↑ ↓ ✓
    motion3.tsx               numéro qui s'écrase, termes qui claquent, caméra, socle, compteurs, vague
    motion4.tsx               transitions : plongée, rideau tiré par la mascotte, panoramique éclair
    kit.tsx                   stickers, tampons, puces cochées, rubans, progression par étapes, bulle
    Lesson3.tsx               gabarit d'une notion (titre, définition, illustration, termes, échelle des normes)
    NormScale.tsx             échelle des normes adulte (zones hypo / normo / hyper, curseur animé)
    episode.tsx               kit « une vidéo par constante » : mise en page, récap, logo, composition Episode
    cardio.tsx                battements, cœur qui bat, tracé ECG, onde de pouls
    breath.tsx                respiration (phase), poumons, thorax, tracé respiratoire
    thermo.tsx                zones de température, thermomètre + °C, jauge froid ↔ chaud, chaleur, flocons
    pressure.tsx              normes de pression artérielle, manomètre, lecture systolique / diastolique
    glyco.tsx                 normes de glycémie, doigt + autopiqueur, lecteur de glycémie, sucres, cellule
    urine.tsx                 normes de diurèse, bocal gradué, horloge 24 h, appareil urinaire (reins → vessie)
    brain.tsx                 cerveau (artères, neurones, ischémie, hémorragie) + gros plan d'artère (caillot, traitements)
    devices.tsx               téléphone (le 15), horloge murale, écran d'imagerie
    arrest.tsx                moniteur ECG (sinus, FV, plat, choc), DAE + électrodes, mains de massage, bascule de tête
    patient.tsx               corps humain (patient de face) : expressions, cœur, artères, brassard, signes
    body.tsx, icons.tsx       poignet + doigts ; petites icônes (causes, situations)
    oxygen.tsx                saturomètre, vaisseau et globules rouges, grille de 100
    embolism.tsx              corps entier (jambes, veine profonde, caillot qui remonte), lit demi-assis, scanner
    copd.tsx                  bronche (inflammation, mucus, emphysème, air piégé), spiromètre, inhalateur
    wound.tsx                 coupe de peau (couches, plaies, brûlures, cloque, microbes, nerfs), escarre, jambe, doigt
    sampling.tsx              matériel de prise de sang (aiguille, porte-tube, ailettes, tubes, SHA, gants, garrot…), bras
    night.tsx                 format histoire : fond nuit, cadre de scanner, lueur, mots qui se mélangent
    series.tsx                vidéos en série : carte des parties, étiquette « 1/3 », « à suivre »
    pain.tsx                  échelles de douleur (EN, réglette EVA, EVS, visages), enfant, respirateur, grilles de score
    diabetes.tsx              diabète : sang chargé de sucres, cellule à porte + cadenas, clé insuline, pancréas, stylo, sites
    lungs.tsx, chest.tsx      planche « poumons » : thorax couche par couche (côtes, poumons, bronches), alvéoles, radio
    MascotActor.tsx           mascotte actrice : sauts, course, expressions au mot près, bustes libres
    pictos.tsx                pictogrammes et illustrations (thermomètre, cœur, poumons, artère…)
    timeline.ts               voix → frames : at(scène, mot)
    Sfx.tsx                   bruitages synchronisés
  videos/<vidéo>/             une vidéo = timeline + scènes + jeu de la mascotte + voice.json
public/
  brand/mascotte/             images officielles de la mascotte (manifest.json = tailles)
  brand/logo/                 logos officiels
  voix/<vidéo>/voix.wav       voix montée et normalisée
  fonts/, sfx/                polices embarquées, bruitages
assets/planches/              planches v3 de la mascotte (sources des découpes)
scripts/
  voice/                      tts_voix.py (voix + timing) · check_lang.py · cues.py · align_voice.py, prepare_voice.py (voix enregistrée)
  brand/                      découpe des planches v3 (upscale_rgba, cut_v3, export_v3)
  qa/                         contrôle : images clés (stills.mjs, qa.sh), planches (sheet.sh), check-mascot, splice.py
  new-video.py                squelette d'une nouvelle vidéo
voix/                         scripts de voix off (texte exact dit, une entrée par partie)
docs/lpi/                     charte vidéo, storyboards, index visuel de la mascotte
```

## Nouvelle vidéo

Recette complète (formats, règles de la marque, pièges de la voix) : [CLAUDE.md](CLAUDE.md).
1. `voix/<n>-<sujet>.script.json` (texte exact, une partie par scène) → `npm run voice` → `npm run check:voice`.
2. `npm run new` (dossier, composition, déclarations) → `npm run cues` → scènes et mascotte.
3. `npm run check:mascot` → `npm run qa` (relire les planches) → `npm run render:<vidéo>` → `npm run sheet`.
