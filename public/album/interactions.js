(() => {
  "use strict";
  const album = document.getElementById("album");
  if (!album || document.documentElement.hasAttribute("data-album-ready")) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sectionIds = ["about", "stories", "growth", "family"];
  const locale = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  try { localStorage.setItem("oliver-portfolio-language",locale); } catch {}
  let selected = "story-1-title";
  let previousPlayer = null;
  let barObserver = null;
  let scrollFrame = 0;
  let latestSection = "";
  let stopIndex = 0;
  let lastViewportWidth = window.innerWidth;
  let welcomeTimer, typingTimer;
  let tiltSurface = null, point = null, tiltFrame = null;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function typeHello() {
    clearTimeout(typingTimer);
    const heading = album.querySelector(".greeting");
    heading.classList.remove("is-typing");
    if (reduce.matches) return;
    heading.classList.add("is-typing");
    typingTimer = setTimeout(()=>heading.classList.remove("is-typing"), 700);
  }
  function showWelcome() {
    const dialog = album.querySelector(".welcome-sheet");
    if (typeof dialog.showModal !== "function") { typeHello(); return; }
    goTo("top",false);
    clearTimeout(welcomeTimer);
    dialog.removeAttribute("data-exiting");
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("#welcome-title").focus({preventScroll:true});
    welcomeTimer=setTimeout(closeWelcome,3200);
  }
  function dismissWelcome() {
    const dialog=album.querySelector(".welcome-sheet");
    if (!dialog.open || dialog.hasAttribute("data-exiting")) return;
    if (reduce.matches) { closeWelcome(); return; }
    clearTimeout(welcomeTimer);
    dialog.setAttribute("data-exiting","");
    welcomeTimer=setTimeout(closeWelcome,280);
  }
  function closeWelcome() {
    const dialog=album.querySelector(".welcome-sheet");
    if (!dialog.open) return;
    clearTimeout(welcomeTimer);
    dialog.close();
    try { sessionStorage.setItem("oliver-album-text-welcome-v3","seen"); } catch {}
    focusAt(album.querySelector(".greeting"));
    typeHello();
  }
  function showStop(index) {
    const stops=Array.from(album.querySelectorAll("[data-stop]"));
    if (!Number.isInteger(index) || index<0 || index>=stops.length) return;
    stopIndex=index;
    for (const [i,stop] of stops.entries()) {
      stop.setAttribute("aria-pressed", String(i===index));
      stop.tabIndex=i===index?0:-1;
    }
    for (const [i,panel] of Array.from(album.querySelectorAll(".moment")).entries()) panel.hidden=i!==index;
    album.querySelector('[data-step="-1"]').disabled=index===0;
    album.querySelector('[data-step="1"]').disabled=index===stops.length-1;
    updateTrailInk();
  }

  let routeSamples=[], stationDistances=[], routeObserver=null;
  function updateTrailInk() {
    const total=stationDistances.at(-1);
    if (!total) return;
    const surface=album.querySelector(".trail-surface");
    surface.style.setProperty("--remaining",1-stationDistances[stopIndex]/total);
  }

  function layoutTrail() {
    const surface=album.querySelector(".trail-surface");
    const width=surface.getBoundingClientRect().width;
    if (!width) return;
    const rem=parseFloat(getComputedStyle(document.documentElement).fontSize);
    const stops=Array.from(surface.querySelectorAll("[data-stop]"));
    const count=stops.length;
    const capacity=Math.max(1,Math.floor(width/(6*rem)));
    const rows=Math.ceil(count/capacity);
    const columns=Math.ceil(count/rows);
    const pitch=width/columns;
    surface.style.setProperty("--stop-width",Math.max(1,pitch-6)+"px");
    const tallest=Math.max(...stops.map(el=>el.offsetHeight));
    const rowStep=Math.max(6.5*rem,tallest+rem);
    const height=(rows-1)*rowStep+tallest+2.2*rem;
    const svg=surface.querySelector("svg");
    svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
    surface.style.height=height+"px";
    surface.dataset.rows=String(rows);
    surface.removeAttribute("data-pointing");
    const points=stops.map((el,i)=>{
      const row=Math.floor(i/columns), slot=i%columns;
      const col=row%2 ? columns-1-slot : slot;
      const x=(col+.5)*pitch;
      const y=1.45*rem+row*rowStep;
      el.style.setProperty("--x",x+"px");
      el.style.setProperty("--y",y+"px");
      return {x,y,row};
    });
    let length=0;
    let d=`M ${points[0].x} ${points[0].y}`, arrows="";
    stationDistances=[0];
    routeSamples=[points[0]];
    for (let i=1;i<count;i++) {
      const p=points[i-1], q=points[i], turn=p.row!==q.row;
      const bend=(p.row%2 ? -1 : 1)*Math.min(.46*pitch,.46*rowStep);
      const cx=turn ? p.x+bend*4/3 : (p.x+q.x)/2;
      if(turn) {
        const ax=p.x+bend, ay=(p.y+q.y)/2;
        arrows+=`M ${ax-3} ${ay-2} l 3 4 3 -4 `;
        d+=` C ${cx} ${p.y}, ${cx} ${q.y}, ${q.x} ${q.y}`;
      } else {
        d+=` H ${q.x}`;
      }
      for(let j=1;j<=28;j++) {
        const t=j/28,u=1-t;
        const x=u*u*u*p.x+3*u*t*cx+t*t*t*q.x;
        const y=(u*u*u+3*u*u*t)*p.y+(3*u*t*t+t*t*t)*q.y;
        const prev=routeSamples.at(-1);
        length+=Math.hypot(x-prev.x,y-prev.y);
        routeSamples.push({x,y});
      }
      stationDistances.push(length);
    }
    for(const path of surface.querySelectorAll(".trail-base,.trail-ink"))path.setAttribute("d",d);
    surface.querySelector(".trail-turns").setAttribute("d",arrows);
    updateTrailInk();
  }

  function bindTrailPointer() {
    const surface=album.querySelector(".trail-surface");
    routeObserver?.disconnect();
    layoutTrail();
    if ("ResizeObserver" in window) {
      const dot=surface.querySelector(".station-dot");
      let lastWidth=surface.clientWidth, lastDot=dot.offsetHeight, queued=false;
      routeObserver=new ResizeObserver(()=>{
        if (!queued && (surface.clientWidth!==lastWidth || dot.offsetHeight!==lastDot)) {
          queued=true;
          requestAnimationFrame(()=>{
            queued=false;
            if (!surface.isConnected) return;
            lastWidth=surface.clientWidth;
            lastDot=dot.offsetHeight;
            layoutTrail();
          });
        }
      });
      routeObserver.observe(surface);
      routeObserver.observe(dot);
    }
    let frame=null, clientX=0, clientY=0;
    function clear() {
      if (frame!==null) cancelAnimationFrame(frame);
      frame=null;
      surface.removeAttribute("data-pointing");
    }
    function draw() {
      frame=null;
      if (reduce.matches || !finePointer.matches || !routeSamples.length) { clear(); return; }
      const rect=surface.getBoundingClientRect();
      const x=clientX-rect.left, y=clientY-rect.top;
      let closest=null, distance=40;
      for (const p of routeSamples) {
        const delta=Math.hypot(x-p.x,y-p.y);
        if(delta<distance) { closest=p; distance=delta; }
      }
      if (!closest) { clear(); return; }
      surface.style.setProperty("--pointer-x",closest.x+"px");
      surface.style.setProperty("--pointer-y",closest.y+"px");
      surface.setAttribute("data-pointing","");
    }
    surface.addEventListener("pointermove",event=>{
      if (event.pointerType!=="mouse" || reduce.matches || !finePointer.matches) { clear(); return; }
      clientX=event.clientX; clientY=event.clientY;
      if (frame===null) frame=requestAnimationFrame(draw);
    },{passive:true});
    surface.addEventListener("pointerleave",clear);
    surface.addEventListener("pointercancel",clear);
  }
  function resetTilt() {
    if (tiltFrame !== null) cancelAnimationFrame(tiltFrame);
    tiltFrame=null;
    if (tiltSurface) {
      tiltSurface.style.removeProperty("--rx");
      tiltSurface.style.removeProperty("--ry");
    }
    tiltSurface=null;
    point=null;
  }
  function trackPointer(event) {
    if (reduce.matches || !finePointer.matches || event.pointerType!=="mouse") return;
    const surface=event.target.closest(".hero-person,.field-media");
    if (!surface) return;
    if (surface!==tiltSurface) resetTilt();
    tiltSurface=surface;
    point={x:event.clientX,y:event.clientY};
    if (tiltFrame!==null) return;
    tiltFrame=requestAnimationFrame(()=>{
      tiltFrame=null;
      if (!tiltSurface || !point) return;
      const rect=tiltSurface.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const axis = v=>Math.max(-1,Math.min(1,v));
      const rx=axis((point.y-rect.top)/rect.height*2-1)*-2.8;
      const ry=axis((point.x-rect.left)/rect.width*2-1)*3.4;
      tiltSurface.style.setProperty("--rx",rx.toFixed(2)+"deg");
      tiltSurface.style.setProperty("--ry",ry.toFixed(2)+"deg");
    });
  }
  function resetVideo() {
    if (!previousPlayer) return;
    const figure = previousPlayer;
    previousPlayer = null;
    figure.querySelector("iframe")?.remove();
    figure.querySelector(".play").hidden = false;
    figure.querySelector(".external-video").hidden = true;
  }
  function selectStory(id) {
    const heading = document.getElementById(id);
    const article = heading?.closest(".story");
    if (!article) return;
    if (selected !== id) resetVideo();
    selected = id;
    for (const story of album.querySelectorAll(".story")) story.hidden = story !== article;
    for (const pick of album.querySelectorAll("[data-story]")) {
      if (pick.dataset.story === id) {
        pick.setAttribute("aria-current", "true");
        const more = pick.closest(".all-stories");
        if (more) more.open = true;
      } else pick.removeAttribute("aria-current");
    }
  }
  function visibleSection() {
    const line = album.querySelector(".bar").offsetHeight + 46;
    return sectionIds.filter(id=>document.getElementById(id).getBoundingClientRect().top <= line).at(-1) || "";
  }
  function markNavigation() {
    scrollFrame = 0;
    const active = visibleSection();
    if (active === latestSection) return;
    latestSection = active;
    for (const a of album.querySelectorAll(".desktop-nav a, .menu nav a")) {
      if (a.hash === "#"+active) a.setAttribute("aria-current","location");
      else a.removeAttribute("aria-current");
    }
  }
  function hydrate() {
    const bar=album.querySelector(".bar");
    const syncBarHeight=()=>document.documentElement.style.setProperty("--bar-offset",(bar.offsetHeight+12)+"px");
    barObserver?.disconnect();
    syncBarHeight();
    if ("ResizeObserver" in window) {
      barObserver=new ResizeObserver(syncBarHeight);
      barObserver.observe(bar);
    }
    selectStory(selected);
    showStop(stopIndex);
    bindTrailPointer();
    album.querySelector(".welcome-sheet").addEventListener("cancel",event=>{event.preventDefault();dismissWelcome();});
    latestSection = null;
    markNavigation();
  }
  function focusAt(element) {
    if (!element.hasAttribute("tabindex")) element.setAttribute("tabindex","-1");
    element.focus({preventScroll:true});
  }
  function goTo(id, keyboardFocus = true) {
    const element = document.getElementById(id);
    if (!element) return;
    if (element.closest(".story")) selectStory(id);
    if (element.matches(".moment")) showStop(Number(id.slice(7))-1);
    if (id === "top") window.scrollTo({top:0,behavior:"instant"});
    else (element.closest(".story") ?? element).scrollIntoView({block:"start",behavior:"instant"});
    if (keyboardFocus) focusAt(element.querySelector("h2,h1") ?? element);
    markNavigation();
  }
  function prepareLanguage(link) {
    const position=album.querySelector(".bar").offsetHeight+40;
    const candidates=album.querySelectorAll("#top, .chapter[id], .interest-card[id], .moment:not([hidden]), .story:not([hidden]) h3[id], .closing, footer");
    const current=Array.from(candidates).filter(el=>el.getBoundingClientRect().top<=position).at(-1);
    const id=current?.id;
    const state={locale:link.dataset.lang, id, offset:current?.getBoundingClientRect().top,
      selector:id?null:current?.matches("footer")?"footer":".closing",
      nearTop:window.scrollY<40, stopIndex, selected, expanded:album.querySelector(".all-stories").open,
      notes:Array.from(album.querySelectorAll(".story")).filter(el=>el.querySelector(".notes").open).map(el=>el.getAttribute("aria-labelledby"))};
    try {sessionStorage.setItem("oliver-album-language-handoff",JSON.stringify(state));} catch {}
    if(location.hash || (!state.nearTop && id)) link.hash=id || location.hash;
  }
  function resumeLanguage() {
    let state;
    try {
      state=JSON.parse(sessionStorage.getItem("oliver-album-language-handoff"));
      sessionStorage.removeItem("oliver-album-language-handoff");
    } catch { return false; }
    if (!state || state.locale!==locale) return false;
    showStop(state.stopIndex);
    selectStory(state.selected);
    album.querySelector(".all-stories").open=state.expanded;
    for (const id of state.notes) {
      const notes=document.getElementById(id)?.closest(".story")?.querySelector(".notes");
      if(notes) notes.open=true;
    }
    const anchor=state.id ? document.getElementById(state.id) : album.querySelector(state.selector==="footer"?"footer":".closing");
    if(!state.nearTop && anchor) requestAnimationFrame(()=>window.scrollBy(0,anchor.getBoundingClientRect().top-state.offset));
    return true;
  }
  function startVideo(trigger,event) {
    // Local files have no HTTP referrer. Open the original watch page there.
    if (location.protocol === "file:" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    resetVideo();
    const frame = document.createElement("iframe");
    frame.title = trigger.dataset.title;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    frame.src = "https://www.youtube-nocookie.com/embed/" + trigger.dataset.video + "?autoplay=1&playsinline=1&rel=0";
    previousPlayer = trigger.closest(".video");
    trigger.hidden = true;
    trigger.parentElement.append(frame);
    previousPlayer.querySelector(".external-video").hidden = false;
    frame.focus({preventScroll:true});
  }
  album.addEventListener("click", event=>{
    if (event.target.closest(".welcome-sheet")) { dismissWelcome(); return; }
    const stop=event.target.closest("[data-stop]"), step=event.target.closest("[data-step]");
    if (stop || step) {
      album.querySelector(".moment-card").setAttribute("data-animated","");
      showStop(stop?Number(stop.dataset.stop):stopIndex+Number(step.dataset.step));
      const card=album.querySelector(".moment-card");
      if(stop && card.getBoundingClientRect().top>window.innerHeight-90) {
        card.scrollIntoView({block:"start",behavior:"instant"});
        focusAt(card.querySelector(".moment:not([hidden]) h3"));
      }
      return;
    }
    const trigger = event.target.closest("[data-video]");
    if (trigger) { startVideo(trigger,event); return; }
    const lang = event.target.closest("[data-lang]");
    if (lang) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (lang.dataset.lang===locale) event.preventDefault(); else prepareLanguage(lang);
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id=link.hash.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    album.querySelector(".menu").open = false;
    if (location.hash !== link.hash) {
      try { history.pushState(null,"",link.hash); }
      catch { location.hash = link.hash; }
    }
    goTo(id);
  });
  document.addEventListener("keydown", event=>{
    const stop=event.target?.closest("[data-stop]");
    if (stop && ["ArrowRight","ArrowDown","ArrowLeft","ArrowUp","Home","End"].includes(event.key)) {
      event.preventDefault();
      const last=album.querySelectorAll("[data-stop]").length-1;
      const delta=["ArrowRight","ArrowDown"].includes(event.key)?1:-1;
      const index=event.key==="Home"?0:event.key==="End"?last:Math.min(last,Math.max(0,stopIndex+delta));
      album.querySelector(".moment-card").setAttribute("data-animated","");
      showStop(index);
      album.querySelector('[data-stop="'+index+'"]').focus({preventScroll:true});
      return;
    }
    const menu = album.querySelector(".menu");
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click",event=>{
    const menu = album.querySelector(".menu");
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  function useHash() {
    const id = location.hash.slice(1);
    goTo(id || "top",false);
  }
  album.addEventListener("pointermove",trackPointer,{passive:true});
  album.addEventListener("pointerout",event=>{
    if (tiltSurface && (!event.relatedTarget || !tiltSurface.contains(event.relatedTarget))) resetTilt();
  },{passive:true});
  album.addEventListener("pointercancel",resetTilt);
  window.addEventListener("blur",resetTilt);
  finePointer.addEventListener("change",resetTilt);
  reduce.addEventListener("change",()=>{
    resetTilt();
    if (reduce.matches) { closeWelcome(); album.querySelector(".greeting").classList.remove("is-typing"); }
  });
  window.addEventListener("scroll",()=>{
    if (!scrollFrame) scrollFrame = requestAnimationFrame(markNavigation);
  },{passive:true});
  window.addEventListener("hashchange",useHash);
  window.addEventListener("resize",()=>{
    if (window.innerWidth===lastViewportWidth) return;
    lastViewportWidth=window.innerWidth;
    layoutTrail();
  });
  hydrate();
  document.fonts?.ready.then(layoutTrail);
  document.documentElement.setAttribute("data-album-ready","");
  if (resumeLanguage()) { typeHello(); }
  else if (location.hash) requestAnimationFrame(useHash);
  else {
    let first=true;
    try { first=sessionStorage.getItem("oliver-album-text-welcome-v3")!=="seen"; } catch {}
    if (first && !reduce.matches) showWelcome(); else typeHello();
  }
})();
