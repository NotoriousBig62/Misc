# QUIZZ

Générateur de quiz à choix multiples. Ouvrir `index.html` dans un navigateur. L’interface actuelle charge encore `questions.js`; le fichier est conservé sans modification pour compatibilité. `questions.json` constitue l’export lisible des mêmes questions enrichi des identifiants et âges indicatifs.

## Fichier de données

`questions.json` est un tableau JSON UTF-8, indenté pour être éditable. Chaque entrée suit ce schéma :

```json
{
  "id": 1,
  "theme": "Nature",
  "age": 10,
  "difficulte": "facile",
  "question": "Quel gaz les plantes absorbent-elles pour faire la photosynthèse ?",
  "reponses": ["Oxygène", "Gaz carbonique", "Azote", "Hélium"],
  "bonne": 1
}
```

- `id` : identifiant numérique unique.
- `theme` : nom du thème (Nature, Géographie, Histoire, Animaux, Sciences, Espace, Corps humain, Sport, Arts et littérature ou Culture générale).
- `age` : âge minimum idéal estimé pour comprendre la question et disposer des connaissances utiles, entier de 4 à 99. C’est une indication indépendante de la difficulté : une question peut convenir à un jeune âge tout en étant difficile, ou à un âge plus élevé tout en étant facile. Ce n’est ni une restriction ni une garantie de niveau scolaire.
- `difficulte` : `facile`, `moyen` ou `difficile`, évaluée relativement à la complexité de la question et non à l’âge.
- `question` : énoncé.
- `reponses` : quatre choix présentés dans l’ordre.
- `bonne` : index, à base zéro, de la bonne réponse dans `reponses` (de 0 à 3).

## Contenu et compatibilité

L’export conserve les 220 questions sources, avec une formulation ponctuellement clarifiée et un classement d’âge estimatif question par question. `index.html` n’a pas été modifié. Il charge explicitement `questions.js`; ce fichier reste donc présent. Le JSON n’est pas encore consommé directement par cette interface.
