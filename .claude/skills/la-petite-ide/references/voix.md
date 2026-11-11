# Voix

## Script `voix/<n>-<sujet>.script.json`

- Une partie par scène (`id` = id de scène). `{affiché|prononcé}` pour les sigles et chiffres
  (`{bpm|B P M}`, `{98 %|quatre-vingt-dix-huit pour cent}`, `{100|cent} à {120|cent vingt}`).
- `"pause": s` = silence voulu après la partie ; « [pause 2.5] » dans le texte = silence au milieu (le temps de répondre).
- `"rate"` : `+8%` par défaut (edge-tts), `+0%` pour le rythme d'apprentissage (séries), `-2%` / `-3%` pour une partie dense.
- **Chiffres et symboles toujours en lettres.** Lettre isolée : « la lettre E ».

## Deux voix

| Voix | Quand | Commande |
|---|---|---|
| edge-tts `fr-FR-VivienneMultilingualNeural`, +8 % | gratuite ; vidéos 1 à 28 et quand le propriétaire demande « la voix gratuite » | `npm run voice -- voix/<n>-x.script.json <épisode>` → `public/voix/<épisode>/voix.wav` + `src/videos/<épisode>/voice.json` |
| ElevenLabs **Laura** (`MmafIMKg28Wr0yMh8CEB`, modèle `eleven_v4`, flow `6O4tHaBowSG52722wkdC`) | voix des nouvelles vidéos | voir ci-dessous |

Dépendances par conteneur : `pip install --break-system-packages edge-tts faster-whisper soundfile`.

### Laura (ElevenLabs, payant ≈ 1 crédit par caractère et par prise)

1. `creative_generate_speech` avec **tout le texte en une fois**, `generations_count: 1`. Balises de jeu `[amused]`,
   `[sarcastic]`, `[confident]`, `[warmly]`, `[excited]` ; `[pause]` entre les parties ; nombres en lettres ; sigle
   épelé collé en majuscules (« SHA », « SPO2 »), sigle qui se dit comme un mot en minuscules (« sac Dasri »).
2. `creative_get_flow_run_status` jusqu'à la fin, puis `curl` de `content_url`. **Ne jamais relancer dans le même tour.**
   « Free generations are busy » = rien n'a démarré, rien n'a coûté.
3. Aligner : `python3 scripts/voice/align_voice.py laura.mp3 voix/<n>.script.json <épisode> --model medium`
   (affiche le taux de mots reconnus, alerte sous 80 %).
4. Allonger les blancs entre parties à 0,8 s : `python3 scripts/voice/pad_parts.py voix48.wav
   src/videos/<épisode>/voice.json voix-allongee.wav 0.8`, puis réaligner `voix-allongee.wav`.

## Contrôle

- `npm run check:voice -- <épisode>` (`--model medium --parts intro` pour un passage douteux) : langue de **chaque
  phrase** (doit être `fr`) + transcription.
- `npm run cues -- <épisode>` : l'image de chaque mot (= `at(scène, mot)`).

## Mots piégeux déjà rencontrés

| Écrit | Entendu | Écrire plutôt |
|---|---|---|
| « 98 %. » en début de partie | anglais | `{98 %|quatre-vingt-dix-huit pour cent}` |
| « Verdict : hypoglycémie ! » | anglais | « Le verdict ? Une hypoglycémie ! » |
| phrase courte en morceaux | accent italien | l'allonger avec des mots bien français |
| « à jeun » | « à jeune » | `{jeun|jun}` |
| « Eh non ! » | « Anon » | « Pas besoin ! » |
| « Piège ! » | « Peach » | « Eh non, c'est un piège : … » |
| « On zoome » | « On boom » | « On regarde de plus près » |
| « E V A » | « le VA » | `l'{EVA|É V A}` |
| « Dès cinq » | « dessin » | « À partir de cinq » |
| « Cette plaie ne fait pas mal » | « plaine » | « Cette plaie… ne fait pas mal » |
| « ciseaux à bouts ronds » | « bourrons » | « ciseaux aux bouts arrondis » |
| « et le centre antipoison » | « 130 poisons » | « et le numéro du centre antipoison » |
| « B P C O : … » en début | accent étranger | « La {BPCO|B P C O}, c'est la… » |

## Corriger une voix déjà rendue

- Une phrase : `npm run voice -- voix/<n>-x.script.json <épisode> --swap <partie> "ancienne" "nouvelle"` (même créneau,
  même niveau, durée inchangée), puis recalculer les images concernées et `npm run splice`.
- Une partie entière (nouvelle accroche) : `--only intro` (le reste du son est gardé et décalé d'un nombre entier d'images).
