# IFSI Vidéos

Mini-vidéos en motion design (TikTok / Instagram Reels / YouTube Shorts, 1080×1920) pour réviser
les cours d'IFSI. Tout est généré **en code** avec [Remotion](https://www.remotion.dev/) (React → MP4) :
pas de logiciel de montage, pas de banque d'images.

## Épisodes

| # | Sujet | Composition | Script voix |
|---|-------|-------------|-------------|
| 01 | 8 tips pour les prises de sang | `PriseDeSang` | [voix/01-prise-de-sang.md](voix/01-prise-de-sang.md) |

## Utilisation

```bash
npm install
npm run studio                 # aperçu interactif dans le navigateur
npm run render:prise-de-sang   # -> out/01-prise-de-sang-tips.mp4
npm run cover:prise-de-sang    # -> out/01-prise-de-sang-cover.png (miniature)
npm run sfx                    # regénère les bruitages (public/sfx)
```

## Organisation

```
src/
  theme.ts                    couleurs, polices, zones de sécurité TikTok
  components/                 briques réutilisables pour toute la série
    motion.tsx                Words (typo cinétique), Pop, Chip, Card, Stamp, Camera, useShake
    Background.tsx            fond animé + grain
    TipHeader.tsx             en-tête « TIP 03 »
    icons.tsx                 tubes, flacon, aiguille, collecteur, check/croix…
    Sfx.tsx                   bruitages synchronisés
  videos/prise-de-sang/
    timeline.ts               durée de chaque scène (à recaler sur la voix off)
    Hook.tsx, Tips1to4.tsx, Tips5to8.tsx, Outro.tsx
public/
  fonts/                      Montserrat + Inter (embarquées, rendu hors-ligne)
  sfx/                        bruitages générés par scripts/make-sfx.py
voix/                         scripts de voix off, scène par scène
```

## Ajouter la voix off

1. Enregistrer le texte de `voix/<épisode>.md` (un fichier par scène ou un seul fichier).
2. Déposer les fichiers dans `public/voix/<épisode>/`.
3. Recaler `timeline.ts` sur la durée réelle de chaque phrase, ajouter la piste audio et
   (optionnel) des sous-titres animés mot à mot, générés à partir de l'audio.

## Règles de mise en page

- Format 9:16, 30 fps, ≥ 60 s.
- Rien d'important au-dessus de 200 px, sous 1 500 px, ni contre le bord droit : l'interface de
  TikTok / Reels / Shorts recouvre ces zones.
- Un changement visuel toutes les 1 à 2 s, un tip toutes les 6 à 12 s, barre de progression en haut.
