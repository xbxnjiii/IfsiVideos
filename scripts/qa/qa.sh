#!/usr/bin/env bash
# Images clés + planches en une commande : npm run qa -- <Composition> <frame> <frame> …
#   -> out/qa/f*.png (échelle 0,5) et out/qa/sheet01.jpg… (7 × 2 par planche), à relire avant le rendu complet.
set -euo pipefail
comp="$1"
shift
rm -rf out/qa
COMP="$comp" OUT=out/qa SCALE=0.5 node scripts/qa/stills.mjs "$@" | tail -1
bash scripts/qa/sheet.sh out/qa
