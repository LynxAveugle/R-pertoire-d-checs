import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync('./app.js','utf8');

assert.match(app,/async function fetchChessComJson\(/,'La synchronisation doit centraliser les requêtes Chess.com');
assert.match(app,/fetchChessComJson\([^\n]*archives/,'La liste des archives doit passer par le client API robuste');
assert.match(app,/\/api\/chesscom\?path=/,'La synchronisation doit passer par le proxy Cloudflare pour fournir un User-Agent accepté par Chess.com');
const proxy=fs.readFileSync('./functions/api/chesscom.js','utf8');
assert.match(proxy,/User-Agent/,'Le proxy doit identifier le client auprès de Chess.com');
assert.match(proxy,/ALLOWED_PREFIX/,'Le proxy doit limiter les chemins accessibles');
assert.match(app,/Synchronisation impossible|Synchronisation interrompue/,'La synchronisation doit exposer une erreur exploitable');
console.log('SYNC REGRESSION TESTS OK');
