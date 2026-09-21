/* HighTaxi Chess — Stockfish 18 lite single-thread Web Worker wrapper. */
const LOCAL_ENGINE_JS="./stockfish/stockfish-18-lite-single.js";
const LOCAL_ENGINE_WASM="./stockfish/stockfish-18-lite-single.wasm";
const REMOTE_ENGINE_JS="https://unpkg.com/stockfish@18.0.8/src/stockfish-18-lite-single.js";
const REMOTE_ENGINE_WASM="https://unpkg.com/stockfish@18.0.8/src/stockfish-18-lite-single.wasm";
let highTaxiToken=0;
const nativePostMessage=self.postMessage.bind(self);
function bootEngine(script,wasm,fallback){
  self.Module={locateFile:(path,prefix)=>wasm};
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
    if(fallback){bootEngine(REMOTE_ENGINE_JS,REMOTE_ENGINE_WASM,false);return;}
    nativePostMessage({__highTaxi:true,token:highTaxiToken,line:`info string HighTaxi engine load error ${error?.message||error}`});
  }
}
bootEngine(LOCAL_ENGINE_JS,LOCAL_ENGINE_WASM,true);
