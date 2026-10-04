# IFSI Vidéos

Mini-vidéos en motion design (TikTok / Instagram Reels / YouTube Shorts, 1080×1920) pour réviser
les cours d'IFSI. Tout est généré **en code** avec [Remotion](https://www.remotion.dev/) (React → MP4) :
pas de logiciel de montage, pas de banque d'images.

## Épisodes

| # | Sujet | Composition | Script voix |
|---|-------|-------------|-------------|
| 01 | 8 tips pour les prises de sang | `PriseDeSang` | [voix/01-prise-de-sang.md](voix/01-prise-de-sang.md) |
| 02 | Les 5 constantes à connaître (avec voix off) | `Constantes` | [voix/02-constantes.md](voix/02-constantes.md) |

## Utilisation

```bash
npm install
npm run studio                 # aperçu interactif dans le navigateur
npm run render:prise-de-sang   # -> out/01-prise-de-sang-tips.mp4
npm run cover:prise-de-sang    # -> out/01-prise-de-sang-cover.png (miniature)
npm run render:constantes      # -> out/02-constantes.mp4
npm run cover:constantes       # -> out/02-constantes-cover.png
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
    med/                      série médicale : personnage récurrent, icônes (thermomètre, cœur,
                              poumons, tensiomètre, O₂), fond à particules, sous-titres, transition douce
  videos/prise-de-sang/
    timeline.ts               durée de chaque scène (à recaler sur la voix off)
    Hook.tsx, Tips1to4.tsx, Tips5to8.tsx, Outro.tsx
  videos/constantes/
    cues.ts                   synchro voix ↔ animations (mot → frame)
    voice.json                mots horodatés (généré)
public/
  voix/, music/               voix off montée et musique de fond
  fonts/                      Montserrat + Inter (embarquées, rendu hors-ligne)
  sfx/                        bruitages générés par scripts/make-sfx.py
scripts/voice/                pipeline voix off (blancs, nettoyage, transcription)
voix/                         scripts de voix off, scène par scène
```

## Ajouter la voix off

Les scripts Python demandent `ffmpeg` et `pip install faster-whisper soundfile numpy`.

1. **Préparer la voix** : coupe les blancs, nettoie le son (passe-haut, débruitage léger,
   compression, −15 LUFS) et transcrit chaque mot avec son horodatage (Whisper).
   ```bash
   python3 scripts/voice/prepare_voice.py ENREGISTREMENT.m4a <episode> \
     --sections "Première,deuxième,..." [--cut 59.17:61.60] [--prompt "vocabulaire"]
   ```
   → `public/voix/<episode>/voix.wav` + `src/videos/<episode>/voice.json`
2. **Musique de fond** (composée en code, baissée automatiquement sous la voix) :
   ```bash
   python3 scripts/make-music.py public/music/<episode>.mp3 <durée_s> --duck public/voix/<episode>/voix.wav
   ```
3. **Animations** : chaque animation est déclenchée par un mot (`cue('fc', 'battements')` dans
   `src/videos/constantes/cues.ts`). Une nouvelle voix recale donc toute la vidéo
   automatiquement, transitions et sous-titres compris.

## Règles de mise en page

- Format 9:16, 30 fps, ≥ 60 s.
- Rien d'important au-dessus de 200 px, sous 1 500 px, ni contre le bord droit : l'interface de
  TikTok / Reels / Shorts recouvre ces zones.
- Un changement visuel toutes les 1 à 2 s, un tip toutes les 6 à 12 s, barre de progression en haut.
