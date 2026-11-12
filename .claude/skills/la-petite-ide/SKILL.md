---
name: la-petite-ide
description: Fabriquer ou retoucher une vidéo « La Petite IDE » (mini-vidéos IFSI en motion design Remotion, 1080 × 1920, TikTok / Reels / Shorts) — charte (5 couleurs, polices, grille), mascotte officielle, accroches, voix (edge-tts ou ElevenLabs Laura), bruitages, briques `src/brand/`, timing au mot, contrôle qualité, rendu et livraison. À charger avant toute nouvelle vidéo, toute nouvelle brique ou toute retouche d'une vidéo de ce dépôt.
---

# La Petite IDE — fabriquer une vidéo

Tout est **en code** (Remotion 4 + React → MP4). Une vidéo = un dossier `src/videos/<épisode>/` + un script de voix
`voix/<n>-<sujet>.script.json` + une voix `public/voix/<épisode>/voix.wav` + son `voice.json` (timing mot à mot).
Le journal des décisions vidéo par vidéo (ce que le propriétaire a demandé ou refusé) est dans `CLAUDE.md` : le relire
pour la vidéo concernée.

## Les règles qui ne se discutent pas

1. **5 couleurs seulement** (+ transparences via `alpha()`) : `LPI.blue #4E7AC7`, `LPI.sky #C5D8F4`,
   `LPI.paper #F8F9FC`, `LPI.pink #EAA7C1`, `LPI.navy #2D3A5A` (`src/brand/theme.ts`). Pas de rouge, jaune, vert,
   violet ni noir : sang / plaie = rose, nécrose = bleu nuit. Exceptions : images de la mascotte, logos, et décors réalistes demandés par le propriétaire (bois brun de la planche,
   forêt au feuillage vert : `forest.tsx`, `splinter.tsx`). **Mise en situation = le plus réaliste possible** (demandé) :
   décor, objets, aliments, insectes et peau de la personne gardent leurs vraies couleurs (props `real`, `REAL_COLORS`
   de `bee.tsx`) ; les 5 couleurs restent pour les explications (titres, cartes, pastilles, schémas).
2. **Mascotte = images officielles uniquement** (`public/brand/mascotte/`, index `docs/lpi/mascotte-index.webp`),
   jamais redessinée, **jamais retournée en miroir**, bustes libres sans cadre, elle ne cache jamais titre, chiffres ni fiche.
3. Pas de filigrane, pas de sous-titres incrustés, pas de musique (ajoutée sur TikTok), pas de quiz ni d'appel à commenter
   dans une vidéo de cours, pas de pastille « à connaître en IFSI ».
4. **Accroche** : jamais « C'est quoi… ? » en ouverture. Pour les vidéos courtes : une **scène animée avec des personnages,
   sans texte au début**, tirée d'une situation vécue, où l'on voit clairement ce qui arrive. Varier le style d'une vidéo à
   l'autre ; proposer 2 – 3 accroches quand le propriétaire n'a pas d'idée.
5. Chaque terme technique est suivi tout de suite d'une explication simple. Rester exact et factuel.
6. Chaque mouvement part d'un **mot de la voix** (`at(scène, mot)`) ; un événement visible toutes les 0,5 – 1 s.
7. **Voix gratuite (edge-tts) d'abord** ; Laura seulement quand la vidéo est validée. Tout coût externe (ElevenLabs, Higgsfield) : **donner le prix avant** (`estimate_only`), ne jamais relancer une
   génération dans le même tour, `generations_count: 1`.
8. Livrer **le MP4 seul** dans `out/`, faire le ménage de `out/` (QA, anciens rendus), commit + push sur `main`.

## Où trouver quoi

| Besoin | Fichier |
|---|---|
| Couleurs, polices, grille, mascotte, tempo, physique, transitions | [references/charte.md](references/charte.md) (résumé) · `docs/lpi/charte-video.md` (complet) |
| Choisir un format et une accroche | [references/formats.md](references/formats.md) |
| Écrire le script et fabriquer la voix | [references/voix.md](references/voix.md) |
| De la page blanche au MP4 (commandes, QA, retouches) | [references/workflow.md](references/workflow.md) |
| Toutes les briques prêtes à l'emploi (`src/brand/`) | [references/briques.md](references/briques.md) (généré) |
| Storyboards des vidéos existantes | `docs/lpi/storyboard-*.md` |

## Réutiliser avant de créer

- Chercher dans `references/briques.md` (ou `grep -rn "export const <Nom>" src/brand`) avant de dessiner quoi que ce soit.
- Corps humain = `Patient` (`patient.tsx`, repère 400 × 560) ; profil = `Walker` / `Boy` (`injury.tsx`) ; peau en coupe =
  `SkinBlock` (`wound.tsx`) ; organes = `chest.tsx` / `lungs.tsx` / `brain.tsx` (une couche par étape).
- Mise en page et briques communes : `episode.tsx` (`Episode`, `Head`, `ZoomCam` + `CamKey`, `CauseChip`, `RecapScene`,
  `EndCard`, `StagePill`) ; look 2026 : `bold.tsx` (`Fly`, `Live`, `Posed`, `Blur`, `Big`, `Note`, `BigNumber`, `RowCard`).
- Une brique nouvelle va dans `src/brand/<thème>.tsx` avec un commentaire d'en-tête + un JSDoc d'une phrase par export,
  puis `python3 scripts/brand/catalog.py` pour mettre le catalogue à jour.

## Pièges connus

- Flou de mouvement : la position doit être calculée **dans** le calque (`Live`, `Posed`, `Fly`), sinon aucun flou.
- Dans une `ZoomCam`, le contenu doit tenir dans la fenêtre à zoom 1 ; bulles et pastilles fixes **hors** de la caméra.
- `interpolate` exige des entrées strictement croissantes : découper en morceaux plutôt que réutiliser une borne.
- `at()` ignore les accents (« là » = « la ») : viser le mot suivant si ambigu.
- JSX : `text={'…\n…'}` (pas `text="…\n…"`) ; espace insécable ` ` avant « ! » et « ? ».
- Barrer un texte : `Strike` dans un conteneur `position: relative` à la taille du texte.
- `npm run check:mascot` charge **tous** les épisodes : un mot disparu d'une autre voix fait échouer le contrôle.
- Les dessins vectoriels restent « illustrés » : pour du photoréaliste, il faut un clip IA (cher, voir `CLAUDE.md`).
