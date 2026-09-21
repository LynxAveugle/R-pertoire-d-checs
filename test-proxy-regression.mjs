import assert from 'node:assert/strict';
import {onRequestGet} from './functions/api/chesscom.js';
let seen='';
globalThis.fetch=async (url,opts)=>{seen=String(url); return new Response(JSON.stringify({archives:[]} ),{status:200,headers:{'Content-Type':'application/json'}})};
const r=await onRequestGet({request:new Request('https://example.com/api/chesscom?path='+encodeURIComponent('/pub/player/hightaxi/games/2026/09'))});
assert.equal(r.status,200);
assert.equal(seen,'https://api.chess.com/pub/player/hightaxi/games/2026/09');
assert.equal(r.headers.get('cache-control'),'no-store');
console.log('PROXY REGRESSION OK');
