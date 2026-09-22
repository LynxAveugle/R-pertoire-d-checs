/* HighTaxi Chess — Stockfish worker bootstrap.
 * The actual Stockfish build is loaded with its UCI worker hash so its WASM
 * locator works correctly. The engine URL is supplied through ?engine=... .
 */
const params=new URLSearchParams(self.location.search);
const engine=decodeURIComponent(params.get("engine")||"");
if(!engine) throw new Error("Stockfish engine URL missing");
try{ importScripts(engine); }
catch(error){ self.postMessage({__highTaxi:true,line:`info string HighTaxi engine load error ${error?.message||error}`}); throw error; }
