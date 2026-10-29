#!/usr/bin/env bash
# Planche contact SANS dépendance (ffmpeg seul) :
#   scripts/qa/sheet.sh out/qa              -> out/qa/sheet00.jpg… (les f*.png de stills.mjs, 7 × 2 par planche)
#   scripts/qa/sheet.sh out/video.mp4 [dir] -> 1 image par seconde, 12 × 3 par planche (dir : out/qa-video)
set -euo pipefail
src="$1"
if [[ -d "$src" ]]; then
	ffmpeg -hide_banner -loglevel error -y -pattern_type glob -i "$src/f*.png" -vf "scale=270:-2,tile=7x2:padding=6:color=0x333333" "$src/sheet%02d.jpg"
	ls "$src"/sheet*.jpg
else
	out="${2:-out/qa-video}"
	mkdir -p "$out"
	rm -f "$out"/sheet*.jpg
	ffmpeg -hide_banner -loglevel error -y -i "$src" -vf "fps=1,scale=180:-2,tile=12x3:padding=4:color=0x333333" "$out/sheet%02d.jpg"
	ls "$out"/sheet*.jpg
fi
