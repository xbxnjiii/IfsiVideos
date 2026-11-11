# Formats et accroches

Chaque format a un modèle dans `src/videos/` : copier sa structure plutôt que repartir de zéro. Détails et historique
des choix du propriétaire : `CLAUDE.md` ; storyboards : `docs/lpi/storyboard-*.md`.

## Formats

| Format | Durée | Modèle | Déroulé |
|---|---|---|---|
| Une constante | 1 min – 1 min 20 | `frequence-respiratoire`, `tension-arterielle`, `spo2` | accroche · définition · mesure · norme adulte · trop haut · trop bas · « pas que le chiffre » · récap rapide · logo ; `NormScale` sous l'illustration |
| Pathologie / urgence | ≈ 1 min 25 | `avc`, `arret-cardiaque`, `embolie-pulmonaire`, `bpco`, `insuffisance-cardiaque` | accroche-choc · définition dans le corps (`Patient`) · signes · conduite à tenir · traitement · facteurs de risque · récap |
| Série (sujet long) | 1 min 10 – 1 min 30 par partie | `plaies-1/2/3`, `diabete-1/2`, `douleur-1/2` | accroche propre · annonce de la partie (`SeriesParts`) · notions · récap + `NextUp` |
| Liste à retenir | ≈ 1 min 30 | `hygiene-mains`, `precautions-standard` | accroche · astuce pour retenir · un élément par scène (même gabarit + suivi) · récap |
| Inventaire (matériel d'un soin) | ≈ 1 min 25 | `prise-de-sang` | tout le matériel à l'écran · un objet = un gros plan + une phrase · compteur n / N · récap |
| Condensé enfant | ≈ 3 min | `constantes-enfant` | 3 tranches d'âge, seulement ce qui change |
| Court info + humour | 30 – 50 s | `suppositoire`, `objet-plante`, `plaie-*`, `escarre`, `trousse-secours` | situation vécue · 2 – 3 notions · chute drôle ; `progress={false}`, `episodeTimeline(voice, ids, {minTotal: 0})` |
| Histoire | ≈ 1 min 20 | `avc-histoire` | patient prénommé, fausse piste, révélation, fin émotionnelle ; `night.tsx` |
| Promo | ≈ 1 min 10 | `quiz-constantes` | quiz éclair puis renvoi vers lapetiteide.fr (lien en bio) |

Règles communes : pas de quiz dans une vidéo de cours, pas d'appel à commenter, pas de tampon final au récap
(confettis + mascotte suffisent). Une série ne se nomme pas « partie N » dans les vidéos courtes autonomes.

## Accroches (varier d'une vidéo à l'autre)

**Vidéos courtes : scène animée avec des personnages, sans texte au début**, situation vécue où l'on voit clairement
comment ça arrive (garçon qui tombe de vélo, homme qui marche sur un clou). Les accroches à base de cartes, jauges ou
titres sont « swipables ». Image 0 = déjà la scène en mouvement (miniature).

Styles déjà utilisés :

| Style | Exemple | Vidéo |
|---|---|---|
| Signes → révélation | « Ton patient a mal à la tête, des vertiges… Qu'est-ce qu'il a ? Une hypertension ! » | `tension-arterielle` |
| Enquête / retour en arrière | « Ton patient se lève… et s'effondre. » ◀◀ 30 MIN PLUS TÔT | `glycemie` |
| Chiffre-choc | « Vingt mille. C'est le nombre de fois où tu respires… » (compteur qui roule) | `frequence-respiratoire` |
| Accéléré + dilemme | « Huit heures, midi… toujours pas une goutte dans le bocal ! » | `diurese` |
| Chiffre dès l'image 0 | « 98 %… mais 98 % de quoi ? » | `spo2` |
| Fausse piste barrée | « Juste une toux de fumeur ? Faux ! » | `bpco` |
| 3 indices | « Trois kilos en une semaine… il dort assis… ses chevilles gonflent » | `insuffisance-cardiaque` |
| Le paradoxe | « Son sang est rempli de sucre… et ses cellules meurent de faim. » | `diabete-1` |
| Le piège | « Ce bébé respire 45 fois par minute… Tu appelles le médecin ? Pas besoin ! » | `constantes-enfant` |
| Le match | ÉQUIPE POINTE vs ÉQUIPE PLAT | `suppositoire` |
| Situation vécue animée | la vaisselle, le verre éclate, un éclat dans la main | `objet-plante`, `plaie-*` |

Après l'accroche des vidéos longues : la question (« Mais au fait… c'est quoi … ? ») et une promesse courte.

## Écriture

- Termes techniques toujours suivis d'une explication courte (« l'excoriation : c'est une éraflure »).
- Qualificatifs expliqués entre parenthèses (ample (profonde, beaucoup d'air)).
- Chaque blague a son gag visuel au mot près (sticker, tampon) ; les énumérations deviennent des puces cochées.
- Rester exact (sources : HAS, SF2H, OMS, référentiels IFSI) et simple ; pas d'astuces « de terrain » mises en scène.
- Renvoi à une vidéo déjà publiée plutôt que répéter : pastille `VideoLink`.
