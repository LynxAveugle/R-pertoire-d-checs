# HighTaxi Chess PWA — v0.9.11

PWA personnelle mobile-first pour importer, synchroniser, analyser et annoter les parties de HighTaxi.

## Changements v0.9.6

- Version de données séparée de la version applicative (`schemaVersion: 2`).
- Sauvegardes JSON datées avec nombre de parties et validation du schéma.
- Restauration avec choix remplacement/fusion et confirmation destructive.
- Recherche et filtres dans la liste des parties : texte, résultat, couleur, source.
- Entraînement/revue : liste des positions annotées ouvrant directement la position concernée.
- Statistiques enrichies avec les ouvertures les plus présentes.
- Service Worker versionné et préparé pour les fichiers Stockfish locaux.
- Stockfish Worker : tentative locale en priorité, puis repli distant si les binaires locaux ne sont pas présents.
- IndexedDB : ajout de `clearAll()` pour les restaurations par remplacement.
- Conservation des tests de régression Chess / PGN / phase 0.

## Stockfish offline

Le worker cherche d'abord :

`stockfish/stockfish-18-lite-single.js`

`stockfish/stockfish-18-lite-single.wasm`

Si ces deux fichiers ne sont pas fournis dans le build, il utilise temporairement la source distante UNPKG. Pour obtenir une analyse réellement hors ligne, ajoute les deux binaires Stockfish 18 lite single-thread dans le dossier `stockfish/` avant déploiement.

## Données

Les parties sont stockées dans IndexedDB (`HighTaxiChess`, store `games`). Les sauvegardes sont portables en JSON et contiennent la version du schéma pour permettre les migrations futures.

## Tests

```bash
node test-chess.mjs
node test-pgn.mjs
node test-phase0.mjs
```

## v0.9.9 — refonte ergonomique de l’écran Analyse
- Interface Analyse restructurée selon la maquette fournie : header dédié, échiquier dominant, panneaux Coups joués / Stockfish / Meilleurs coups.
- Contrôles tactiles sous l’échiquier, dont rotation manuelle.
- Annotation présentée comme une carte d’analyse.
- Arbre global conservé mais masqué du flux principal et accessible à la demande.

## v0.9.11 — stabilisation après review
- La synchronisation passe par une Cloudflare Pages Function afin d’identifier correctement le client auprès de Chess.com.
- Le proxy est limité au compte HighTaxi et aux endpoints d’archives de parties.
- Repli direct conservé pour les environnements où l’API autorise la requête navigateur.
- Le cache Service Worker est versionné en v0.9.11 et les routes `/api/` sont exclues du cache.

### Correctifs v0.9.11
- Service Worker : les routes API ne sont plus mises en cache.
- Proxy Chess.com : validation de chemin insensible à la casse et fallback direct limité aux erreurs réseau/404/405.
- Meilleur coup UCI → SAN corrigé.
- Import PGN validé avant écriture et identifiant basé sur la partie, pas sur le texte brut.
- Export PGN des collections optimisé : les parties sans analyse réutilisent leur PGN original.
- Autosauvegarde par snapshot + flush lors des changements de partie, masquage de page et navigation.
- Annotations globales dédupliquées par arête.
- Arêtes de l’arbre basées sur from/to/promotion.
- Variantes signalées visuellement dans la liste des coups.
- En passant normalisé dans la clé de position.
- Variantes Chess.com non standard ignorées.
- État des mois synchronisés inclus dans les sauvegardes et resynchronisation possible après suppression des parties d’un mois.
- Le parseur accepte les notations `12. ...` et `e.p.`.

### Limitation connue
Les binaires Stockfish locaux `stockfish-18-lite-single.js` et `.wasm` ne sont pas inclus dans cette archive : le moteur conserve donc son fallback CDN et n’est pas encore garanti hors ligne.
