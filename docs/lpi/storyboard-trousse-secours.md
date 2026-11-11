# Storyboard — « Que doit contenir une trousse de secours à la maison ? » (`Trousse-Secours`, ≈ 48 s, voix gratuite edge-tts)

| Partie | Voix | Image |
|---|---|---|
| intro | Le couteau glisse… et ton doigt saigne ! Vite, la trousse de secours ! Tu l'ouvres… et elle est vide. Alors, qu'est-ce qu'il faut mettre dedans ? | Sans texte : gros plan « comme si c'étaient tes mains » (`CuttingCloseUp` v2) : la main en griffe tient la tomate, le couteau coupe des tranches (vrais bruits), au mot « glisse » la lame dérape sur la phalange de l'index, la main sursaute, une goutte perle puis tombe sur la planche, la caméra s'approche ; la trousse arrive en tremblant, s'ouvre : vide, poussière, papillon de nuit ; « ? » |
| soigner | D'abord, de quoi soigner une plaie : sérum physiologique, antiseptique, compresses stériles, pansements | Chaque objet en gros plan + son rôle, puis il file dans sa case de la trousse |
| tenir | Une bande et du sparadrap, des gants jetables, des ciseaux aux bouts arrondis, une pince à écharde | Idem, la trousse se remplit |
| plus | Un thermomètre, du paracétamol (douleur, fièvre), une couverture de survie | Idem |
| regles | Hors de portée des enfants, dates de péremption chaque année, numéros d'urgence 15 · 18 · 112 · centre antipoison | Cartes cadenas, calendrier, carte des numéros qui s'allument (touches du téléphone) |
| fin | Et la prochaine fois que le couteau glisse… tout est là ! | Même gros plan : le doigt est pansé, la trousse pleine arrive et s'ouvre, étincelles |

Voix : « des ciseaux à bouts ronds » était entendu « bourrons » → « aux bouts arrondis » ; « et le centre antipoison » était
entendu « 130 poisons » → « et le numéro du centre antipoison ». Briques : `src/brand/firstaid.tsx` (`FirstAidKit`, `KitItem`,
`EmergencyCard`, `CuttingCloseUp`, `Padlock`).
