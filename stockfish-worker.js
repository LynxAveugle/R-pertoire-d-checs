/* HighTaxi Chess — GitHub Pages friendly Stockfish 18 lite single-thread worker. */
const LOCAL_ENGINE_JS="./stockfish/stockfish-18-lite-single.js";
const LOCAL_ENGINE_WASM="./stockfish/stockfish-18-lite-single.wasm";
const REMOTE_ENGINE_JS="https://raw.githubusercontent.com/solid-apps/stockfish/gh-pages/vendor/stockfish-18-lite-single.js";
const REMOTE_ENGINE_WASM="https://raw.githubusercontent.com/solid-apps/stockfish/gh-pages/vendor/stockfish-18-lite-single.wasm";
const REMOTE_ALT_JS="https://cdn.jsdelivr.net/npm/stockfish@18.0.8/bin/stockfish-18-lite-single.js";
const REMOTE_ALT_WASM="https://cdn.jsdelivr.net/npm/stockfish@18.0.8/bin/stockfish-18-lite-single.wasm";
let highTaxiToken=0;
const nativePostMessage=self.postMessage.bind(self);
function bootEngine(script,wasm,fallback){
  self.Module={locateFile:(path,prefix)=>String(path).includes(".wasm")?wasm:prefix+path};
  try{
    importScripts(script);
    const engineMessageHandler=self.onmessage;
    self.onmessage=(event)=>{
      const data=event.data;
      if(data&&typeof data==="object"&&data.type==="token"){highTaxiToken=Number(data.token)||0;return;}
      if(typeof engineMessageHandler==="function")engineMessageHandler.call(self,event);
    };
    self.postMessage=(data)=>{
      if(typeof data==="string")nativePostMessage({__highTaxi:true,token:highTaxiToken,line:data});
      else nativePostMessage(data);
    };
    nativePostMessage({__highTaxi:true,token:highTaxiToken,line:`info string HighTaxi Stockfish ${script===LOCAL_ENGINE_JS?"local":"remote"}`});
  }catch(error){
    if(fallback){bootEngine(REMOTE_ENGINE_JS,REMOTE_ENGINE_WASM,2);return}
    if(fallback===2){bootEngine(REMOTE_ALT_JS,REMOTE_ALT_WASM,false);return}
    nativePostMessage({__highTaxi:true,token:highTaxiToken,line:`info string HighTaxi engine load error ${error?.message||error}`});
  }
}
bootEngine(LOCAL_ENGINE_JS,LOCAL_ENGINE_WASM,true);
