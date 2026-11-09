# Storyboard — « Le matériel pour une prise de sang » v2 (La Petite IDE)

≈ 1 min 22 · 1080 × 1920 · composition `Prise-De-Sang` · code : `src/videos/prise-de-sang/` · dessins :
`src/brand/sampling.tsx` · kit `src/brand/bold.tsx`.

- **Format inventaire.** L'accroche pose tout le matériel, puis chaque objet est repris un par un.
- **Look 2026** (refait à la demande, avec les nouveaux modules) :
  - une idée par plan, objets en très grand ;
  - un aplat de couleur par famille : 1 bleu clair, 2 rose, 3 bleu ;
  - un vrai flou de mouvement sur ce qui entre, sort ou tombe ;
  - une carte « chiffre géant » au début de chaque famille.
- **En haut, pendant les notions** : la pastille de la famille en cours (à gauche) et le compteur MATÉRIEL n / 13 (à
  droite). Pas de barre de progression.
- **Voix** : ElevenLabs « Laura ». Texte exact :
  [voix/20-prise-de-sang.script.json](../../voix/20-prise-de-sang.script.json).
- **Contenu** : identique à la v1 validée, avec « corps de pompe » et le tri OPCT / DASRI refait. La v1 (voix edge-tts,
  socle + liste qui se coche) reste dans l'historique git, au commit `05ef5c9`.

| Partie | À l'écran | Mascotte |
|--------|-----------|----------|
| Accroche | Image 0 : « Prise de sang : le **matériel** » et le plateau en 3 bandes de couleur (① Prélèvement, ② Hygiène et antisepsie, ③ Fin du soin). Les 13 objets y tombent avec un flou de mouvement, chacun avec son nom. « Ça fait beaucoup ? » : l'écran s'assombrit, un **13 géant** compte de 1 à 13, puis claque (« objets ! », flash, secousse). « Un par un » : les bandes s'allument l'une après l'autre. | surprise · stressée · clin d'œil · checklist → plonge dans la bande 1 |
| 1 · Pour piquer | Carte « **1** Le prélèvement ». **L'aiguille Vacutainer** en plein cadre, avec la pastille « 2 pointes » et deux étiquettes : « côté veine » et « côté tube (sous le manchon) ». « Elle se visse » : le **corps de pompe** arrive de la gauche et l'aiguille s'y visse (elle tremble, déclic). Pastille « = le porte-tube, qu'on tient en main ». « Veine fine ou fragile ? » : le bras, une veine fine, un « ? ». Puis **l'unité à ailettes**, dont les ailettes battent, avec la pastille « dite épicrânienne ». | seringue · regardez · présente · inquiète · OK |
| 1 · Les tubes | Trois tubes tombent ; la **prescription** arrive et ses lignes se cochent. Puis 5 tubes en rangée : les bouchons sautent un par un, pastille « 1 couleur = 1 analyse ». « Dedans, du vide » : un tube en gros plan à droite, avec des flèches et l'étiquette « du vide ! ». L'aiguille perce le bouchon et le sang monte tout seul jusqu'au trait (étiquettes « le sang monte », « la bonne quantité »). | montre la prescription · loupe · surprise · OK |
| 2 · D'abord, les mains | Carte « **2** Hygiène et antisepsie ». La **SHA** : on appuie sur le flacon, une goutte tombe, les mains se frottent et brillent ; pastille « SHA = solution hydroalcoolique ». Les **gants** : les mains se gantent, pastilles « à usage unique » et « non stériles ». « Ils te protègent du sang » : des gouttes rebondissent sur les gants. | présente · joyeuse · important · OK |
| 2 · Préparer le bras | Le bras en plein cadre. Le **garrot** se pose puis se serre ; une flèche « au-dessus » va du point de ponction vers le garrot ; étiquette « point de ponction » ; pastille « = là où on va piquer ». La veine gonfle : « plus facile à trouver ». Puis **l'antiseptique** penche et verse une goutte sur la **compresse stérile** (dans son sachet). La compresse vole jusqu'au point, tourne en cercles (zone désinfectée) : « elle désinfecte la peau ». | stéthoscope · surprise · présente · validé |
| 3 · Pour terminer (fond bleu) | Carte « **3** Fin du soin ». L'aiguille est dans la veine. La **compresse** se pose et appuie, l'aiguille se retire avec un flou de mouvement : « on appuie en retirant l'aiguille ». Le **pansement** claque, puis le rouleau de **sparadrap** arrive (« ou du sparadrap »). | présente · « aïe » · cœur |
| 3 · Les déchets (fond bleu) | « Le plus important : » : le **collecteur à OPCT** arrive à gauche. Pastille « OPCT = piquants, coupants, tranchants ». Trois cartes P · C · T (aiguille, lame, verre cassé) claquent à droite au mot, puis volent dans la fente du collecteur (flou de mouvement, le couvercle sursaute). « Jamais recapuchonner » : le capuchon glisse vers l'aiguille, le panneau d'interdiction l'arrête. « Les autres déchets souillés » : le **sac DASRI** se pose à droite, la compresse et le gant tombent dedans. Pastille « DASRI = déchets à risque infectieux ». | important · regardez · erreur · montre en haut · présente |
| Récap | « Ton **plateau** » : les 3 bandes reviennent au mot (prélèvement, hygiène, fin du soin). Leurs objets retombent et chaque bande se coche. « Trois familles » : elles s'allument. « Prêt ! » : éclat et confettis. | récapitule · checklist · OK · bravo |

## Voix (Laura, ElevenLabs)

- Une seule génération avec des balises de jeu : `[warmly]`, `[amused]` sur « Ça fait beaucoup ? », `[confident]` sur
  les numéros de famille, `[serious]` sur les déchets, `[excited]` sur le récap.
- **Sigles collés en majuscules : SHA, OPCT** (le test le plus rapide, voir CLAUDE.md). « Dasri » est écrit en minuscules
  dans le texte envoyé pour qu'il soit lu comme un mot.
- **Blancs entre les parties** : Laura n'a laissé que 0,3 à 0,45 s. Ils ont été allongés à 0,8 s avec
  `scripts/voice/pad_parts.py`, puis la voix a été réalignée avec `align_voice.py`.
