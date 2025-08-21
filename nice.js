(function(){
    const block=(e)=>{e.preventDefault();e.stopPropagation();return false};
    ["contextmenu","selectstart","copy","cut","dragstart"].forEach(evt=>{
        document.addEventListener(evt,block,{passive:false})
    });
    document.addEventListener("keydown",e=>{
        const k=e.key.toLowerCase();
        if(
            e.key==="F12"||
            (e.ctrlKey&&["u","s","c","a","x","p"].includes(k))||
            (e.ctrlKey&&e.shiftKey&&["i","j","c"].includes(k))
        ){block(e)}
    },true);
    const detectDevTools=()=>{if(window.outerWidth-window.innerWidth>160||window.outerHeight-window.innerHeight>160){document.body.innerHTML=''}};
    setInterval(detectDevTools,300);
    Object.defineProperty(document,"onkeydown",{set:()=>{},get:()=>null});
    Object.defineProperty(document,"oncontextmenu",{set:()=>{},get:()=>null});
    Object.defineProperty(navigator,"clipboard",{get:()=>undefined});
    document.body.style.userSelect="none";
    document.body.style.webkitUserSelect="none";
    document.body.style.msUserSelect="none";
})();
