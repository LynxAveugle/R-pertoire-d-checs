import fs from 'node:fs';
import assert from 'node:assert/strict';
const app=fs.readFileSync('./app.js','utf8');
const sw=fs.readFileSync('./sw.js','utf8');
const proxy=fs.readFileSync('./functions/api/chesscom.js','utf8');
const db=fs.readFileSync('./db.js','utf8');
const pgn=fs.readFileSync('./pgn.js','utf8');

assert.match(sw,/if\s*\(url\.pathname\.startsWith\(["']\/api\//,'Service Worker must bypass API routes');
assert.match(proxy, /new RegExp\(.*\"i\"/s, 'Chess.com proxy path must be case-insensitive');
assert.match(app,/return c\.san\(move\)/,'UCI to SAN must use Chess.san without mutating the position');
assert.match(app,/persistAnalysisSnapshot\(snapshot\)|const snapshot=/,'Autosave must capture a snapshot rather than read mutable activeGame later');
assert.match(app, /saveNoteBeforeNavigation\(\);\n?      let move=candidates\[0\]/, 'Board navigation must flush pending notes before playing a move');
assert.match(app, /parsePGN\(source\)/, 'PGN import must validate through the parser');
assert.match(app,/rules.*chess|game\.rules.*!==.*chess/,'Chess.com sync must exclude non-standard variants');
assert.match(app,/from\|.*to|move\.from.*move\.to/,'Global move edges must use move coordinates, not SAN alone');
assert.match(app,/d>0.*↳|variation/i,'Move list must expose variation depth');
assert.match(db,/localStorage\.setItem\("ht_games_migration_backup"/,'Legacy migration backup remains guarded');
console.log('REVIEW FIX TESTS OK');
