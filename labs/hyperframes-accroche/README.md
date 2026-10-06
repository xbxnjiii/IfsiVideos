# Test HyperFrames — accroche + « 1 · Température » (15 s)

Essai de [HyperFrames](https://github.com/heygen-com/hyperframes) (HeyGen, Apache 2.0) sur un petit
morceau de la vidéo « Les 5 constantes » v3, pour le comparer à la version Remotion
(`LPI-Constantes-V3`). Même voix (ElevenLabs), même charte, mêmes repères de synchro.

- `index.html` : toute la composition (HTML + CSS + une timeline GSAP). Pas de React, pas de build.
- `cues.js` : instant de chaque mot, généré depuis `src/videos/lpi-constantes-v3/voice.json`.
- Transition entre l'accroche et la Température : shader WebGL **`ripple-waves`** du catalogue
  (`@hyperframes/shader-transitions`) — ce que Remotion n'a pas en standard.
- `assets/` : la voix coupée à 13,9 s, les images de la mascotte et les polices utilisées,
  GSAP et le paquet de transitions (copiés en local pour un rendu hors-ligne).

## Commandes

```bash
cd labs/hyperframes-accroche
node make-cues.mjs                                  # recale les repères + bruitages sur voice.json
npx hyperframes@0.8.137 lint                        # contrôle de la composition
npx hyperframes@0.8.137 snapshot --at 0,3.8,7.4,13.6 # images de contrôle
npx hyperframes@0.8.137 render --output ../../out/06-hyperframes-accroche.mp4
```

Premier rendu : `npx hyperframes browser ensure` télécharge le Chrome de rendu.

## Bilan du test

| | Remotion (v3) | HyperFrames (test) |
|---|---|---|
| Écriture | composants React + TypeScript | une page HTML + GSAP |
| Transitions | maison (vague, cercle) | catalogue de shaders WebGL prêts (ripple, iris, glitch…) |
| Synchro voix | `at('temp','fébrile')` | `C.febrile` (même voice.json) |
| Vitesse (ici) | ≈ 4,5 s de calcul par seconde de vidéo | ≈ 6 s par seconde (1 seul worker, GPU logiciel) |
| Bruitages | `<Sfx>` dans le code | balises `<audio>` écrites dans le HTML |
| Licence | gratuite jusqu'à 3 personnes, payante au-delà pour une entreprise | Apache 2.0, gratuite |

Pièges rencontrés : les `<audio>` doivent être écrits en dur dans le HTML (le mixeur ne voit pas
ceux créés en JavaScript) ; chaque bruitage a besoin d'une `data-duration` ; la timeline doit être
enregistrée explicitement sur `window.__timelines` pour le linter.
