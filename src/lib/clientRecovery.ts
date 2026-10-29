const STORAGE_KEY = "ndm-client-reload";
const WINDOW_MS = 15000;

/**
 * Relance la page une seule fois. Un deuxième plantage dans la fenêtre
 * suivante ne relance plus, pour ne pas boucler.
 */
export function recoverClientError(): boolean {
  if (typeof window === "undefined") return false;

  const now = Date.now();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stamp = JSON.parse(raw) as { path?: string; at?: number };
      if (
        stamp.path === window.location.pathname &&
        typeof stamp.at === "number" &&
        now - stamp.at < WINDOW_MS
      ) {
        return false;
      }
    }
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ path: window.location.pathname, at: now })
    );
  } catch {
    const marker = "ndm-reloaded:";
    if (window.name.startsWith(marker)) {
      const at = Number(window.name.slice(marker.length));
      if (Number.isFinite(at) && now - at < WINDOW_MS) return false;
    }
    window.name = `${marker}${now}`;
  }

  window.location.reload();
  return true;
}

/** Script exécuté avant React : un fichier JS du site manquant relance la page. */
export const CLIENT_RECOVERY_SCRIPT = `(function(){
  var KEY="ndm-client-reload";
  var WINDOW_MS=15000;
  function reloadOnce(){
    var now=Date.now();
    try{
      var raw=sessionStorage.getItem(KEY);
      if(raw){
        var stamp=JSON.parse(raw);
        if(stamp&&stamp.path===location.pathname&&now-stamp.at<WINDOW_MS)return;
      }
      sessionStorage.setItem(KEY,JSON.stringify({path:location.pathname,at:now}));
    }catch(e){
      if(window.name.indexOf("ndm-reloaded:")===0){
        var at=Number(window.name.slice(13));
        if(isFinite(at)&&now-at<WINDOW_MS)return;
      }
      window.name="ndm-reloaded:"+now;
    }
    location.reload();
  }
  function isChunkMessage(message){
    return /ChunkLoadError|Loading chunk|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(message||"");
  }
  window.addEventListener("error",function(event){
    var target=event.target;
    if(target&&target.tagName==="SCRIPT"){
      var src=target.src||"";
      if(src.indexOf("/_next/")!==-1)reloadOnce();
      return;
    }
    if(isChunkMessage(event.message))reloadOnce();
  },true);
  window.addEventListener("unhandledrejection",function(event){
    var reason=event.reason;
    var message=reason&&(reason.message||String(reason));
    if(isChunkMessage(message))reloadOnce();
  });
})();`;
