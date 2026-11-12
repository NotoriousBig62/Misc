# Rapport — sélection du quiz par tranches d’âge

Dépôt `NotoriousBig62/Misc`, branche `Elec` (dernier commit consulté : `03c6260863b088385410b73d052cbd19ba61a7de`). Fichiers préparés localement, non poussés.

## Résumé des règles appliquées
- Tranches fixes : 4-6, 7-8, 9-10, 11-12, 13-15, 16-19, 20-34, 35-50, 51-99. Question attribuée selon son champ `age`.
- Repli : tranche exacte, puis tranches strictement inférieures, jamais supérieures. Priorité d’ordre : d’abord tranche, puis difficulté choisie et difficultés inférieures (difficile → moyen → facile). « Toutes » n’impose pas de difficulté.
- Adultes (20+) : questions `generation:false` offertes sans restriction de tranche, après les questions des tranches respectives ; pour les moins de 20 ans elles restent soumises à leur tranche. Champ absent traité comme `true` (condition runtime `q.generation !== false`).
- Pénurie : la sélection s’arrête aux questions disponibles, affiche un avertissement à l’accueil, et bloque le lancement si un joueur a zéro question. Anti-doublons inter-joueurs strict : les questions déjà utilisées ne sont pas reprises. Historique/révision existants restent intégrés.

## Nombre de questions par tranche
- 4-6 ans : 41
- 7-8 ans : 41
- 9-10 ans : 68
- 11-12 ans : 45
- 13-15 ans : 26
- 16-19 ans : 16
- 20-34 ans : 28
- 35-50 ans : 34
- 51-99 ans : 29

Questions au total : 328. `generation:true` : 25 ; `generation:false` : 303.

## Relecture des classifications
### `generation:false` — intemporelles
1 — Quel gaz les plantes absorbent-elles pour faire la photosynthèse ? — Nature
2 — Comment appelle-t-on le petit de la grenouille ? — Nature
3 — Quelle partie de la plante absorbe l'eau dans le sol ? — Nature
4 — Quel arbre produit des glands ? — Nature
5 — Quel insecte fabrique le miel ? — Nature
6 — En quelle saison les feuilles des arbres tombent-elles ? — Nature
7 — Quelle est la couleur de la chlorophylle ? — Nature
8 — Comment appelle-t-on un animal qui mange uniquement des plantes ? — Nature
9 — Quel est le plus grand arbre du monde (en hauteur) ? — Nature
10 — Comment s'appelle la transformation de la chenille en papillon ? — Nature
11 — Quel est le rôle des abeilles pour les fleurs ? — Nature
12 — Quelle est la plus grande forêt tropicale du monde ? — Nature
13 — Que fait un animal qui hiberne ? — Nature
14 — Quel fruit pousse sur un pommier ? — Nature
15 — Comment appelle-t-on l'ensemble des êtres vivants et de leur milieu ? — Nature
16 — Comment s'appelle la science qui étudie les plantes ? — Nature
17 — Quel est le seul mammifère capable de voler ? — Nature
18 — Quel âge a approximativement un arbre si l’on compte ses cernes de croissance ? — Nature
19 — Comment appelle-t-on les plantes qui ont des fleurs et produisent des graines dan… — Nature
20 — Quel animal construit des barrages dans les rivières ? — Nature
21 — Que produit un champignon pour se reproduire ? — Nature
22 — Quelle est la capitale de la France ? — Géographie
23 — Quel est le plus grand océan du monde ? — Géographie
24 — Sur quel continent se trouve l'Égypte ? — Géographie
25 — Quel est le plus long fleuve de France ? — Géographie
26 — Quelle est la capitale de l'Italie ? — Géographie
27 — Combien y a-t-il de continents (selon le modèle le plus courant) ? — Géographie
28 — Quelle est la plus haute montagne de France ? — Géographie
29 — Quelle est la capitale de l'Espagne ? — Géographie
30 — Quel est le plus grand pays du monde par sa superficie ? — Géographie
31 — Quel fleuve traverse Paris ? — Géographie
32 — Dans quel pays se trouve la tour de Pise ? — Géographie
33 — Quelle est la capitale de l'Allemagne ? — Géographie
34 — Quel est le plus grand désert chaud du monde ? — Géographie
35 — Quelle mer borde le sud de la France ? — Géographie
36 — Quel est le plus long fleuve d'Afrique ? — Géographie
37 — Quelle est la capitale du Canada ? — Géographie
38 — Quelle est la capitale de l'Australie ? — Géographie
39 — Quel est le plus haut sommet du monde ? — Géographie
40 — Quel pays a la forme d'une botte ? — Géographie
41 — Quelle est la capitale du Brésil ? — Géographie
42 — Quel détroit sépare l'Europe de l'Afrique à l'ouest de la Méditerranée ? — Géographie
43 — Quel roi de France était surnommé le Roi-Soleil ? — Histoire
44 — En quelle année a eu lieu la Révolution française ? — Histoire
45 — Quel peuple a construit les pyramides de Gizeh ? — Histoire
46 — Comment s'appelait le château construit par Louis XIV près de Paris ? — Histoire
47 — Quel personnage a été sacré empereur en 800 ? — Histoire
48 — Quelle période précède l'Antiquité ? — Histoire
49 — Quel homme préhistorique a peint les grottes de Lascaux ? — Histoire
50 — Qui était Jeanne d'Arc ? — Histoire
51 — Quel empereur français a perdu à Waterloo ? — Histoire
52 — Quelle civilisation a inventé les Jeux olympiques ? — Histoire
53 — Quel navigateur a atteint l'Amérique en 1492 ? — Histoire
54 — Comment s'appelait le chef gaulois qui a résisté à César ? — Histoire
56 — Quel est le nom de la prison prise le 14 juillet 1789 ? — Histoire
57 — Quelle guerre a duré de 1914 à 1918 ? — Histoire
58 — Qui a été le premier roi des Francs à se convertir au christianisme ? — Histoire
59 — Comment s'appelle l'écriture des anciens Égyptiens ? — Histoire
60 — Quelle guerre a duré 116 ans entre la France et l'Angleterre ? — Histoire
61 — Quel général carthaginois a traversé les Alpes avec des éléphants ? — Histoire
62 — Dans quelle ville a été érigée la première tour Eiffel (1889) ? — Histoire
63 — Quel roi a fait construire la cathédrale de la Sainte-Chapelle ? — Histoire
64 — Quel est le plus lourd animal terrestre ? — Animaux
65 — Combien de pattes a une araignée ? — Animaux
66 — Quel animal est souvent surnommé le roi des animaux ? — Animaux
67 — Quel animal fait « miaou » ? — Animaux
68 — Quel oiseau ne vole pas et vit en Antarctique ? — Animaux
69 — Quel animal a une trompe ? — Animaux
70 — Quel animal donne du lait que l'on boit couramment ? — Animaux
71 — Quel est l'animal le plus rapide sur terre ? — Animaux
72 — Quel animal change de couleur pour se camoufler ? — Animaux
73 — Comment appelle-t-on le petit de la vache ? — Animaux
74 — Quel est le plus grand animal marin ? — Animaux
75 — Combien de cœurs possède une pieuvre ? — Animaux
76 — Quel animal marsupial vit en Australie et saute ? — Animaux
77 — Quel animal est le symbole de la paix ? — Animaux
78 — Lequel de ces mammifères pond des œufs ? — Animaux
79 — Quel animal a les empreintes digitales presque identiques à celles de l'humain ? — Animaux
80 — Combien de temps vit environ une éphémère adulte ? — Animaux
81 — Quel oiseau peut voler en arrière ? — Animaux
82 — Comment appelle-t-on un animal qui mange de la viande et des plantes ? — Animaux
83 — Quel animal vit le plus longtemps parmi ceux-ci ? — Animaux
84 — Quel animal est le plus grand félin du monde ? — Animaux
85 — À quelle température l'eau gèle-t-elle (en °C) ? — Sciences
86 — Quelle planète habitons-nous ? — Sciences
87 — Comment appelle-t-on l'eau à l'état de gaz ? — Sciences
88 — Quel est l'état de l'eau dans un glaçon ? — Sciences
89 — Que faut-il pour qu'un circuit électrique fonctionne ? — Sciences
90 — Quel aimant attire le fer ? — Sciences
91 — Quel instrument mesure la température ? — Sciences
92 — Quel est le symbole chimique de l'eau ? — Sciences
93 — Comment s'appelle la force qui nous attire vers le sol ? — Sciences
94 — Quelle est la source d'énergie du Soleil ? — Sciences
95 — Quel métal est liquide à température ambiante ? — Sciences
96 — Quel gaz respirons-nous pour vivre ? — Sciences
97 — Comment appelle-t-on le passage de l'état liquide à l'état gazeux ? — Sciences
99 — Quelle est la vitesse approximative de la lumière ? — Sciences
100 — Quel scientifique a découvert le vaccin contre la rage ? — Sciences
101 — Quel est le symbole chimique de l'or ? — Sciences
102 — Comment s'appelle l'unité de mesure de la force ? — Sciences
103 — Quel est le pH de l'eau pure ? — Sciences
104 — Quel physicien a formulé la théorie de la relativité ? — Sciences
105 — Comment appelle-t-on une substance formée d'un seul type d'atome ? — Sciences
106 — Quelle est l'étoile au centre de notre système solaire ? — Espace
107 — Combien y a-t-il de planètes dans le système solaire ? — Espace
108 — Quel est le satellite naturel de la Terre ? — Espace
109 — Quelle planète est surnommée la planète rouge ? — Espace
110 — Quelle est la planète la plus proche du Soleil ? — Espace
111 — Comment s'appelle notre galaxie ? — Espace
112 — Comment appelle-t-on celui qui voyage dans l'espace ? — Espace
113 — Quelle est la plus grande planète du système solaire ? — Espace
114 — Quelle planète est célèbre pour ses anneaux ? — Espace
116 — Qui a été le premier homme dans l'espace ? — Espace
117 — Combien de temps met la Terre pour faire le tour du Soleil ? — Espace
118 — Quel est le nom de la station spatiale internationale (sigle) ? — Espace
119 — Quelle planète est la plus chaude du système solaire ? — Espace
121 — Comment appelle-t-on la trace lumineuse d'une comète ? — Espace
122 — Quelle planète tourne « couchée » sur le côté ? — Espace
123 — Combien de temps met la lumière du Soleil pour atteindre la Terre ? — Espace
124 — Comment s'appelle le plus grand volcan du système solaire, sur Mars ? — Espace
125 — Quel est le nom du télescope spatial lancé en 1990 ? — Espace
127 — Combien de sens avons-nous traditionnellement ? — Corps humain
128 — Quel organe pompe le sang ? — Corps humain
129 — Avec quel organe respire-t-on ? — Corps humain
130 — Combien de dents a un adulte (dents de sagesse comprises) ? — Corps humain
131 — Quel organe nous permet de voir ? — Corps humain
132 — Où se trouve le plus long os du corps ? — Corps humain
133 — Quel organe digère les aliments en premier après l'œsophage ? — Corps humain
134 — Quel est le plus grand organe du corps humain ? — Corps humain
135 — Combien d’os un adulte possède-t-il environ ? — Corps humain
136 — Quelle vitamine obtient-on grâce au soleil ? — Corps humain
137 — Comment s'appellent les vaisseaux qui ramènent le sang vers le cœur ? — Corps humain
138 — Quel organe contrôle tout notre corps ? — Corps humain
139 — Quel est l'os qui protège le cerveau ? — Corps humain
140 — Quel groupe d'aliments donne de l'énergie rapidement ? — Corps humain
141 — Comment s'appelle l'os de la cuisse ? — Corps humain
142 — Quelles cellules du sang transportent l'oxygène ? — Corps humain
143 — Combien de chambres possède le cœur humain ? — Corps humain
144 — Quel est le plus petit os du corps humain ? — Corps humain
145 — Quel organe produit l'insuline ? — Corps humain
146 — Combien de litres de sang a environ un adulte ? — Corps humain
147 — Comment s'appelle la partie colorée de l'œil ? — Corps humain
148 — Combien de joueurs y a-t-il dans une équipe de football sur le terrain ? — Sport
149 — Dans quel sport utilise-t-on un panier et un ballon orange ? — Sport
150 — Quel sport se joue à Roland-Garros ? — Sport
151 — Quel sport pratique-t-on dans une piscine pour se déplacer ? — Sport
152 — Quel sport utilise un ballon ovale ? — Sport
153 — Comment appelle-t-on la course à pied sur 42 km ? — Sport
154 — De quelle couleur est la médaille du vainqueur ? — Sport
155 — Tous les combien d'années ont lieu les Jeux olympiques d'été ? — Sport
157 — Quel sport se pratique sur de la glace avec un palet ? — Sport
158 — Combien de points vaut un essai au rugby à XV ? — Sport
160 — Dans quel sport peut-on faire un « strike » ? — Sport
161 — Quel est le sport national du Japon (art martial) ? — Sport
162 — Combien de joueurs composent une équipe de volley-ball sur le terrain ? — Sport
163 — Quelle est la longueur d’une piscine olympique ? — Sport
165 — Comment s'appelle le célèbre tour cycliste français ? — Sport
166 — Quelle est la distance d’un tour de piste standard en athlétisme (piste extérieur… — Sport
167 — Dans quel sport utilise-t-on un « birdie » (volant) ? — Sport
169 — Quelles sont les trois couleurs primaires en peinture ? — Arts et littérature
170 — Quel instrument a des touches noires et blanches ? — Arts et littérature
171 — Combien de notes y a-t-il dans la gamme (do, ré, mi...) ? — Arts et littérature
172 — Quel instrument se joue avec un archet ? — Arts et littérature
173 — Quel mélange donne du vert ? — Arts et littérature
174 — Dans quel musée parisien voit-on la Joconde ? — Arts et littérature
175 — Quel instrument fait « boum » dans un orchestre de rock ? — Arts et littérature
176 — Qui a peint la Joconde ? — Arts et littérature
177 — Quel peintre a peint « La Nuit étoilée » ? — Arts et littérature
178 — Quel compositeur est devenu sourd mais a continué à composer ? — Arts et littérature
179 — Quel instrument à vent est en bois avec une anche et très aigu ? — Arts et littérature
180 — Comment s'appelle une sculpture qui représente un visage ou un buste ? — Arts et littérature
181 — Quel est le nom du célèbre auteur de fables « Le Corbeau et le Renard » ? — Arts et littérature
182 — Qui a écrit « Les Trois Mousquetaires » ? — Arts et littérature
183 — Quel peintre espagnol est célèbre pour le cubisme ? — Arts et littérature
184 — Quel compositeur a écrit « Les Quatre Saisons » ? — Arts et littérature
185 — Comment s'appelle l'art de plier du papier au Japon ? — Arts et littérature
186 — Quel mouvement artistique Claude Monet a-t-il lancé avec « Impression, soleil lev… — Arts et littérature
187 — Dans quelle ville se trouve l'opéra Garnier ? — Arts et littérature
188 — Combien de cordes a une guitare classique ? — Arts et littérature
190 — Combien y a-t-il de jours dans une semaine ? — Culture générale
191 — Combien de mois y a-t-il dans une année ? — Culture générale
192 — De quelle couleur est le feu qui signifie « stop » ? — Culture générale
193 — Combien de minutes y a-t-il dans une heure ? — Culture générale
195 — Quelle langue parle-t-on principalement en Angleterre ? — Culture générale
197 — Combien de lettres compte l'alphabet français ? — Culture générale
199 — Dans quelle ville se trouve la tour Eiffel ? — Culture générale
200 — Combien de côtés a un hexagone ? — Culture générale
201 — Combien font 12 x 12 ? — Culture générale
202 — Quel animal est le symbole du coq gaulois ? — Culture générale
203 — Quel est le nom du drapeau français ? — Culture générale
204 — Quel est le nom du célèbre inventeur de l'imprimerie en Europe ? — Culture générale
206 — Quel est le plus petit nombre premier ? — Culture générale
207 — En chiffres romains, que vaut XIV ? — Culture générale
208 — Quelle est la langue la plus parlée au monde en nombre de locuteurs natifs ? — Culture générale
209 — Quel est le nom de la devise de la République française ? — Culture générale
210 — Combien de degrés compte un angle droit ? — Culture générale
211 — Quel animal pollinise souvent les fleurs la nuit ? — Nature
212 — Quel pays est célèbre pour ses tulipes et ses moulins ? — Géographie
213 — Quelle ville était la capitale de l'Empire romain ? — Histoire
214 — Quel animal est connu pour sa bosse et vit dans le désert ? — Animaux
215 — Quel est l'arc-en-ciel composé de combien de couleurs traditionnelles ? — Sciences
216 — Quelle planète est la plus éloignée du Soleil ? — Espace
217 — Quel organe musculaire bat sans s’arrêter toute la vie ? — Corps humain
218 — Quel sport associe course, saut et lancer ? — Sport
219 — Quel instrument à percussion se frappe avec des baguettes ? — Arts et littérature
220 — Combien de secondes y a-t-il dans une minute ? — Culture générale
221 — Quel phénomène permet à certaines graines d’être dispersées par le vent grâce à l… — Nature
222 — Quel nom donne-t-on à la couche de sol riche en matière organique issue de la déc… — Nature
223 — Quelle partie d’un arbre transporte principalement la sève brute des racines vers… — Nature
224 — Dans une forêt tempérée, comment appelle-t-on les plantes qui poussent sur un arb… — Nature
225 — Quel type de roche se forme par refroidissement et solidification d’un magma ? — Nature
226 — Quel est le nom du biome dominé par des graminées, avec peu d’arbres, en climat t… — Nature
227 — Comment appelle-t-on l’étude des cernes annuels du bois pour dater les arbres et … — Nature
228 — Quel détroit relie la mer Noire à la mer de Marmara en traversant Istanbul ? — Géographie
229 — Dans quel pays se trouve la région historique de Transylvanie ? — Géographie
230 — Quel pays enclavé est entièrement entouré par l’Afrique du Sud ? — Géographie
231 — Quel fleuve européen traverse Vienne, Bratislava, Budapest et Belgrade ? — Géographie
232 — Quel est le nom du point de la surface terrestre situé directement au-dessus d’un… — Géographie
233 — Quel pays possède l’enclave de Cabinda, séparée du reste de son territoire par un… — Géographie
234 — Quelle est la capitale constitutionnelle de la Bolivie, siège de la Cour suprême ? — Géographie
235 — Quel traité de 1494 partagea les zones d’expansion outre-mer entre l’Espagne et l… — Histoire
236 — Quel souverain de l’empire du Mali est célèbre pour son pèlerinage à La Mecque en… — Histoire
237 — Quel événement de 1683 marque l’échec du second siège ottoman de Vienne ? — Histoire
238 — Quel code juridique fut promulgué sous Hammurabi à Babylone ? — Histoire
239 — Comment s’appelait la route commerciale reliant la Chine à la Méditerranée par l’… — Histoire
240 — Quel congrès redessina une partie de l’Europe après la chute de Napoléon Ier ? — Histoire
241 — Quelle reine d’Égypte ancienne régna comme pharaon et fit ériger son temple funér… — Histoire
242 — Quel groupe de vertébrés comprend les grenouilles et les salamandres ? — Animaux
243 — Quel organe sensoriel les requins utilisent-ils notamment pour détecter les champ… — Animaux
244 — Comment appelle-t-on le phénomène par lequel un animal ressemble à une autre espè… — Animaux
245 — Quel ordre de mammifères comprend les lémuriens, les tarsiers et les singes ? — Animaux
246 — Quel est le seul groupe de mammifères actuels qui pond des œufs ? — Animaux
247 — Comment s’appelle la migration annuelle des papillons monarques d’Amérique du Nor… — Animaux
248 — Quelle structure permet aux araignées de produire la soie ? — Animaux
249 — Quel nombre représente le préfixe SI « micro- » ? — Sciences
250 — Quel gaz noble est le plus abondant dans l’atmosphère terrestre ? — Sciences
251 — Quel est le nom de la liaison qui unit les deux atomes d’oxygène dans une molécul… — Sciences
252 — Quel principe affirme qu’un corps plongé dans un fluide subit une poussée égale a… — Sciences
253 — Quelle particule subatomique porte une charge électrique négative ? — Sciences
254 — Quel phénomène explique la déviation apparente d’un objet lorsqu’il passe de l’ai… — Sciences
255 — Quel savant a formulé les trois lois du mouvement planétaire au début du XVIIe si… — Sciences
256 — Quel type d’objet céleste est une étoile à neutrons ? — Espace
257 — Quelle lune de Saturne possède des lacs et des mers d’hydrocarbures liquides à sa… — Espace
258 — Quel point de Lagrange se trouve à environ 1,5 million de kilomètres de la Terre,… — Espace
259 — Comment appelle-t-on la limite autour d’un trou noir au-delà de laquelle rien ne … — Espace
260 — Quel est le principal gaz de l’atmosphère de Vénus ? — Espace
262 — Quel nom désigne la région située au-delà de Neptune, peuplée de petits corps gla… — Espace
263 — Quelle hormone, sécrétée notamment par la glande pinéale, contribue à réguler le … — Corps humain
264 — Quel type de globules blancs produit les anticorps ? — Corps humain
265 — Quelle valve se trouve entre l’oreillette gauche et le ventricule gauche ? — Corps humain
266 — Quel minéral est au cœur de la molécule d’hémoglobine et permet la fixation de l’… — Corps humain
267 — Quelle partie du système nerveux autonome est généralement associée à la réponse … — Corps humain
268 — Comment s’appelle la membrane qui enveloppe les poumons ? — Corps humain
269 — Quel est le nom de la zone du cerveau principalement associée à la coordination d… — Corps humain
270 — Au tennis, quel terme désigne un score de zéro dans un jeu ? — Sport
271 — Quelle est la longueur officielle d’un marathon ? — Sport
272 — Dans quelle discipline olympique utilise-t-on un fleuret, une épée ou un sabre ? — Sport
273 — Combien de joueurs d’une équipe de handball sont présents sur le terrain, gardien… — Sport
274 — En cyclisme sur route, quelle couleur de maillot distingue le leader du classemen… — Sport
276 — Au baseball, combien de retraits une équipe en défense doit-elle obtenir pour ter… — Sport
277 — Quel écrivain a créé le détective Hercule Poirot ? — Arts et littérature
278 — Quel peintre est associé à la série des « Nymphéas » exposée notamment à l’Orange… — Arts et littérature
279 — Quel dramaturge espagnol a écrit « La Vie est un songe » ? — Arts et littérature
280 — Dans la notation musicale anglo-saxonne, quelle note correspond à la lettre B ? — Arts et littérature
281 — Quel architecte catalan a conçu la basilique de la Sagrada Família ? — Arts et littérature
282 — Quel roman de Mary Shelley met en scène le savant Victor Frankenstein ? — Arts et littérature
283 — Quel procédé poétique consiste à répéter une même consonne au début de mots voisi… — Arts et littérature
284 — Quel système d’écriture tactile est constitué de cellules de six points en relief ? — Culture générale
285 — Combien de côtés possède un dodécagone ? — Culture générale
286 — Quel instrument sert à mesurer la pression atmosphérique ? — Culture générale
287 — Quel est le nom du triangle dont les trois côtés ont la même longueur ? — Culture générale
288 — Quelle unité mesure la fréquence dans le Système international ? — Culture générale
289 — Quel alphabet utilise des lettres comme α, β et Ω ? — Culture générale
291 — Quel instrument à clavier est caractéristique du concerto brandebourgeois no 5 de… — Cinéma et musique
293 — Quel compositeur a écrit la musique du ballet « Le Sacre du printemps » ? — Cinéma et musique
294 — Dans le vocabulaire du cinéma, comment appelle-t-on un plan qui montre le point d… — Cinéma et musique
297 — Quel ingrédient donne sa texture gélifiée à une panna cotta classique ? — Cuisine et gastronomie
298 — De quelle céréale est traditionnellement fabriqué le couscous nord-africain ? — Cuisine et gastronomie
299 — Quelle sauce française classique est préparée à partir de jaunes d’œufs, de beurr… — Cuisine et gastronomie
300 — Quel fromage italien est traditionnellement utilisé dans le tiramisu ? — Cuisine et gastronomie
301 — Quel terme culinaire désigne une cuisson lente dans un récipient fermé, avec peu … — Cuisine et gastronomie
302 — Quel cépage blanc est le principal cépage de l’appellation Chablis ? — Cuisine et gastronomie
303 — Dans la cuisine japonaise, que désigne le « dashi » ? — Cuisine et gastronomie
311 — En solfège, quelle note est placée sur la deuxième ligne de la portée en clé de s… — Musique
312 — Combien de lignes horizontales compte une portée musicale classique ? — Musique
313 — Quel signe musical placé au début d’une portée indique notamment la hauteur des n… — Musique
314 — Dans une mesure à 3/4, combien de temps de noire sont comptés dans chaque mesure ? — Musique
315 — Quel effet a normalement un dièse (♯) sur une note en notation musicale ? — Musique
316 — Quel effet a normalement un bémol (♭) sur une note en notation musicale ? — Musique
317 — Combien de cordes possède un violon classique ? — Musique
318 — Quel compositeur a écrit le cycle de concertos « Les Quatre Saisons » ? — Musique
319 — Combien de concertos composent les « Concertos brandebourgeois » de J. S. Bach ? — Musique
320 — En quelle année la Symphonie no 9 de Beethoven a-t-elle été créée à Vienne ? — Musique
321 — Quel nom français désigne la durée usuelle d’une note qui vaut quatre noires ? — Musique
322 — Quel est le tempo d’un morceau indiqué à 120 BPM ? — Musique
323 — Dans la gamme tempérée occidentale courante, en combien de demi-tons égaux l’octa… — Musique
324 — Quel instrument à clavier possède généralement 88 touches dans son format acousti… — Musique
325 — Dans une fugue, comment appelle-t-on généralement le thème principal repris par l… — Musique
326 — Quelle texture caractérise traditionnellement le chant grégorien liturgique ? — Musique
327 — Quel compositeur est l’auteur de l’opéra « La Flûte enchantée », créé en 1791 ? — Musique
328 — Quel est le nom de l’intervalle séparant deux notes dont la fréquence est dans un… — Musique
329 — Combien de voix réelles distinctes au minimum un quatuor à cordes réunit-il habit… — Musique
330 — Quel terme désigne en musicologie l’étude des instruments de musique et de leur c… — Musique

### `generation:true` — dépendantes d’une époque / génération
55 — Quel mur a été détruit en 1989 ? — Histoire
98 — Quel inventeur est associé à la mise au point de l’ampoule électrique pratique ? — Sciences
115 — Qui a été le premier homme à marcher sur la Lune ? — Espace
120 — Quel astronaute français a séjourné dans l'ISS en 2016-2017 et 2021 ? — Espace
126 — Quelle est la première chienne envoyée en orbite en 1957 ? — Espace
156 — Quel pays a accueilli les Jeux olympiques d’été de 2024 ? — Sport
159 — Quel sport pratique Rafael Nadal ? — Sport
164 — Quel pays a gagné la Coupe du monde de football en 2018 ? — Sport
168 — Quel sportif jamaïcain est le plus rapide sur 100 m ? — Sport
189 — Quel écrivain a créé le personnage de Harry Potter ? — Arts et littérature
194 — Quel est le nom du célèbre petit Gaulois à la potion magique ? — Culture générale
196 — Quelle est la monnaie utilisée en France ? — Culture générale
198 — Quel est le nom du héros de la BD de Hergé avec son chien Milou ? — Culture générale
205 — Combien de pays composent l'Union européenne (2024) ? — Culture générale
290 — Quel réalisateur a signé le film japonais « Les Sept Samouraïs » ? — Cinéma et musique
292 — Quel film de Federico Fellini a donné son nom à l’adjectif « fellinien » et met e… — Cinéma et musique
295 — Quel groupe britannique a sorti l’album « The Dark Side of the Moon » ? — Cinéma et musique
296 — Quel genre musical jamaïcain a précédé le reggae et se caractérise par un tempo r… — Cinéma et musique
304 — Quelle entreprise a créé la série de jeux « The Legend of Zelda » ? — Jeux vidéo
305 — Dans « Portal », quelle arme permet au joueur de créer des portails reliés entre … — Jeux vidéo
306 — Quel studio a développé le jeu « Stardew Valley » ? — Jeux vidéo
307 — Dans l’univers de « The Witcher », comment s’appelle le sorceleur protagoniste ? — Jeux vidéo
308 — Quel est le nom du héros de la série « Metroid » ? — Jeux vidéo
309 — Quel jeu de stratégie en temps réel de Blizzard oppose notamment Terrans, Zergs e… — Jeux vidéo
310 — Dans « Tetris », combien de carrés composent chacun des tétriminos classiques ? — Jeux vidéo

## Simulation Node.js (tous thèmes, 10 questions demandées, historique vide)
- 5 ans | difficile | pool éligible 41 | obtenu 10
- 5 ans | Toutes | pool éligible 41 | obtenu 10
- 7 ans | difficile | pool éligible 82 | obtenu 10
- 7 ans | Toutes | pool éligible 82 | obtenu 10
- 11 ans | difficile | pool éligible 195 | obtenu 10
- 11 ans | Toutes | pool éligible 195 | obtenu 10
- 14 ans | difficile | pool éligible 221 | obtenu 10
- 14 ans | Toutes | pool éligible 221 | obtenu 10
- 17 ans | difficile | pool éligible 237 | obtenu 10
- 17 ans | Toutes | pool éligible 237 | obtenu 10
- 25 ans | difficile | pool éligible 321 | obtenu 10
- 25 ans | Toutes | pool éligible 321 | obtenu 10
- 40 ans | difficile | pool éligible 325 | obtenu 10
- 40 ans | Toutes | pool éligible 325 | obtenu 10
- 60 ans | difficile | pool éligible 328 | obtenu 10
- 60 ans | Toutes | pool éligible 328 | obtenu 10

## Vérifications
- `questions.json` parsé avec le module JSON ; 328 questions, un booléen `generation` par entrée.
- Syntaxe JavaScript vérifiée avec `node --check`.
- Simulation exécutée par Node.js sur `selectionPools` / `selectQuestions` extraits de la logique intégrée dans `index.html`.
- Aucune modification distante : aucun push effectué.
