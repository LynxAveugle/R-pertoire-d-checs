import fs from 'node:fs';
import assert from 'node:assert/strict';

assert.ok(fs.existsSync('.nojekyll'),'.nojekyll doit être présent pour un hébergement GitHub Pages prévisible');
assert.ok(!fs.existsSync('functions'),'Aucune fonction Cloudflare ne doit être requise');
assert.ok(!fs.existsSync('_headers'),'Le fichier _headers Cloudflare ne doit pas être présenté comme actif sur GitHub Pages');
for(const file of ['index.html','app.js','styles.css','chess.js','pgn.js','db.js','version.js','stockfish-worker.js','sw.js','manifest.webmanifest']) assert.ok(fs.existsSync(file),`Fichier manquant: ${file}`);
for(const key of ['wP','wN','wB','wR','wQ','wK','bP','bN','bB','bR','bQ','bK']){const file=`pieces/${key}.png`;assert.ok(fs.existsSync(file),`Pièce manquante: ${file}`);assert.ok(fs.statSync(file).size>1000,`Pièce vide: ${file}`)}
const version=fs.readFileSync('version.js','utf8');assert.match(version,/APP_VERSION="0\.9\.13"/);
const app=fs.readFileSync('app.js','utf8');assert.doesNotMatch(app,/Cloudflare|\/api\/chesscom/i);assert.match(app,/CHESSCOM_BASE.*player/);
const worker=fs.readFileSync('stockfish-worker.js','utf8');assert.match(worker,/stockfish-18-lite-single\.wasm/);
console.log('GITHUB PAGES PACKAGE TESTS OK');
