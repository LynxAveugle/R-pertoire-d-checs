/* HighTaxi Chess — Stockfish bootstrap for a same-origin Worker.
 * The worker itself is hosted by GitHub Pages. It imports a remote or local
 * Stockfish build so Safari does not reject a cross-origin Worker URL.
 * Emscripten's locateFile hook is supplied before importScripts so the WASM
 * binary is resolved explicitly instead of relying on the wrapper URL.
 */
const params = new URLSearchParams(self.location.search);
const engine = params.get("engine") || "";
const wasm = params.get("wasm") || "";
if (!engine) throw new Error("Stockfish engine URL missing");

self.Module = {
  ...(self.Module || {}),
  locateFile(path) {
    if (wasm && /\.wasm(?:$|\?)/i.test(path)) return wasm;
    return path;
  }
};

try {
  importScripts(engine);
} catch (error) {
  self.postMessage({__highTaxi:true,line:`info string HighTaxi engine load error ${error?.message||error}`});
  throw error;
}
