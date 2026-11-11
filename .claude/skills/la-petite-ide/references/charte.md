# Charte « La Petite IDE » — l'essentiel

Version complète : `docs/lpi/charte-video.md` (lexique mot → expression, places de la mascotte, transitions,
repères adultes). Code : `src/brand/theme.ts`.

## Couleurs (aucune autre)

| Nom code | Hex | Usage |
|---|---|---|
| `LPI.blue` | `#4E7AC7` | mot important, chiffres clés, éléments actifs, aplats « famille 3 » |
| `LPI.sky` | `#C5D8F4` | fonds secondaires, cartes, bulles, poumons, parois |
| `LPI.paper` | `#F8F9FC` | fond principal, surfaces des cartes, texte sur fond bleu |
| `LPI.pink` | `#EAA7C1` | pinceau sous le mot clé, émotion, cœur, **sang / plaie / fièvre**, alertes |
| `LPI.navy` | `#2D3A5A` | texte, contours (trait 5 – 8 px), nécrose, fond « nuit » |

- Ombres et voiles : `alpha(LPI.navy, 0.1)` etc. ; ombre standard `SHADOW`. Jamais d'autre teinte, même en dégradé.
- Bouchons de tubes, collecteurs, objets « colorés » : aux couleurs de la marque (pas de jaune ni de violet).
- Une IA ou un clip extérieur ne respecte pas la palette : poser le clip dans un cadre sur un fond de la marque.

## Typographie (`FONT`, chargées par `theme.ts`, fichiers `public/fonts/`)

| Niveau | Police | Taille |
|---|---|---|
| Sur-titre (kicker) | Inter 700, capitales espacées, bleu | 28 px |
| Titre | Nunito Sans 900, bleu nuit, mot accentué `*mot*` en bleu + pinceau rose | 92 – 104 px |
| Grand titre « look 2026 » (`Big`) | Nunito Sans 900 | 120 – 160 px |
| Info / définition | Inter 600 | 36 – 40 px |
| Chiffre clé | Nunito Sans 900 + unité en bleu | 128 – 150 px |
| Logo, signature | Fredoka 600 / 700 | — |

Accent de titre **mot par mot** : `Sur *24* *heures*` (pas `*24 heures*`), `*l'hygiène*` (pas `l'*hygiène*`).

## Grille 1080 × 1920, 30 fps (`GRID`, `LAY` dans `episode.tsx`)

- Marges 72 px, texte aligné à gauche.
- Haut ~150 px et bas sous **y 1480** couverts par l'interface TikTok ; colonne droite (x > 950, y 900 – 1500) aussi.
- Sur-titre + titre vers y 236 – 270, socle / illustration au milieu, pastilles `CauseChip` en 2 colonnes
  (x 72 / 560, y 1240 / 1356).

## Mascotte

- Images officielles seulement : `public/brand/mascotte/<dossier>/<clé>.webp`, liste dans `manifest.json`, index visuel
  `docs/lpi/mascotte-index.webp`. Dossiers : `maitre` (6), `poses` (15, en pied, regardent à droite), `expressions` (21),
  `symptomes` (40 : fièvre, toux, vertige, malaise…), `gestes` (21), `situations` (30), `accessoires` (11),
  `elements` (7). `accessoires/baskets` n'est qu'une chaussure : pas une étape de mascotte.
- **Jamais en miroir** (le badge « IDE » serait inversé) : elle court toujours de gauche à droite.
- `<MascotActor busts="free">` + liste d'étapes `Beat` dans `src/videos/<épisode>/mascot.ts`
  (`{at, key, via: 'pop' | 'hop' | 'run' | 'cut', fx, x, y, size}`), environ une étape par seconde, une expression qui colle
  au mot, des places qui changent sans cesse ; elle ne cache jamais titre, chiffres, fiche, boutons.
- Vidéos courtes / « histoire » : mascotte discrète sous le cadre (spectatrice, ~330 px, y ≈ 1730).
- Nouvelles planches : `scripts/brand/upscale_rgba.py` → `cut_v3.py` (ancrages `planches-v3.json`) → `export_v3.py`.

## Mouvement

- Chaque mouvement part d'un mot : `at(scène, mot)` (3 images d'avance). Un événement visible toutes les 0,5 – 1 s.
- Pops à ressort (~12 % de dépassement), sauts en arc centrés sur le mot, accroupie / étirement / écrasement,
  secousse **uniquement à l'impact**, sorties rapides qui accélèrent, jamais de fondu lent.
- Transitions de 14 images, jamais deux fois la même d'affilée (`motion4.tsx` : `zoomInto`, `runWipe`, `whip`, `wave`).
- Caméra : on s'approche de ce dont parle la voix (`ZoomCam` + `CamKey {at, s, x, y, dur}`), jamais de vide au bord.
- Flash rose + secousse seulement sur les chocs. Confettis une fois, au récap.
- Look 2026 (`bold.tsx`) : une idée par plan, objets en plein cadre, aplats francs (`FlatBg`, `ToneBg`), vrai flou de
  mouvement (`Blur` + positions calculées dans `Live` / `Posed` / `Fly`).

## Son

- Voix seule + bruitages ; pas de musique. Bruits du corps et des objets = **vrais enregistrements**
  (`public/sfx/`, sources `public/sfx/SOURCES.md`, `npm run sfx:import`) ; sons synthétisés = interface seulement
  (whoosh, pop, tick, stamp…), `npm run sfx`. Composant `Sfx` (`src/brand/Sfx.tsx`).
