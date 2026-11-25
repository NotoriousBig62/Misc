# Règles pour les questions de QUIZZ/

1. **Fichiers** : `questions/<theme>/<theme>-NNN.json`, **50 questions maximum** par fichier. Compléter le fichier en cours avant d'en créer un nouveau.
2. **Id** : chaque thème a sa plage (cuisine 5001-5999, etc.). Le fichier NNN contient les id consécutifs de `(NNN-1)*50+1` à `NNN*50` dans la plage du thème (ex. cuisine-002 : 5051-5100). Pas de doublon dans tout le catalogue.
3. **Format** : `[` en première ligne, `]` en dernière, **une question par ligne** en JSON compact, avec les clés dans l'ordre `id, theme, age, difficulte, question, reponses, bonne, generation`. Un fichier de 50 questions fait 52 lignes.
4. **Contenu** : 4 réponses, une seule correcte, indice `bonne` de 0 à 3 varié. Pas de question douteuse ni de doublon.
5. **Catalogue** : mettre à jour `catalogue.json` à partir de la version distante, sans le réécrire entièrement.
6. **Contrôle** : valider le JSON et relire le fichier distant après le push. Ne jamais pousser un fichier tronqué.
