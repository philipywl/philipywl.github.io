import { headline, bodyCopy } from "./typography.mjs";

const shortNames = {
  zh:["找一找","扶着站起來","牽着手","第一張學生相","牙牙學語","配對形狀","倒水","一起碰杯","收拾玩具","揮手道別","認出電單車"],
  en:["Hide and seek","Standing up","Holding hands","First school photo","First sounds","Shape sorting","Pouring","A family toast","Tidy-up time","Waving bye","A matching bike"],
};
const escape = value => String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

export function typedGreeting(parts) {
  const greeting=parts.join("");
  const words=parts.map((part,i)=>{
    const gap = part.endsWith(" ") ? " " : "";
    return '<span class="type-word" style="--step:'+i+'">'+escape(part.trimEnd())+'</span>'+gap;
  }).join("<wbr>");
  return '<h1 class="greeting" tabindex="-1" aria-label="'+escape(greeting)+'"><span aria-hidden="true">'+words+'</span></h1>';
}

export function welcomePage(copy) {
  return `<dialog class="welcome-sheet" aria-labelledby="welcome-title"><h2 id="welcome-title" tabindex="-1" autofocus>${headline(copy.welcome.message)}</h2></dialog>`;
}

export function milestonePath(section,locale,photo) {
  const zh=locale==="zh";
  const portrait = {
    time: zh ? "13個月大" : "13 months",
    title: zh ? "第一張學生相" : "His first school photo",
    moment: zh ? "13個月大時，昊熹穿上藍色有領上衣，拍下了他的第一張學生相。" : "At 13 months, Oliver wore a blue collared shirt for his first school photo.",
    photo: { ...section.portrait, caption: "" },
  };
  const milestones = [...section.milestones.slice(0,3), portrait, ...section.milestones.slice(3)];
  const trailName = zh ? "十一個成長片段" : "Eleven moments from Oliver’s early years";
  const svg = '<svg class="trail-line" aria-hidden="true" focusable="false"><path class="trail-base" fill="none"/><path class="trail-ink" fill="none" pathLength="1"/><path class="trail-turns" fill="none"/></svg>';
  const stops=milestones.map((m,i)=>{
    return `<button type="button" class="station" data-stop="${i}" aria-controls="moment-${i+1}" aria-label="${escape(m.time+" · "+m.title)}">
      <span class="station-dot" aria-hidden="true"></span>
      <span class="station-label"><strong>${escape(m.time)}</strong><span>${headline(shortNames[locale][i])}</span></span>
    </button>`;
  }).join("");
  const moments=milestones.map((m,i)=>`<li id="moment-${i+1}" class="moment">
    <div class="moment-copy"><span class="meta">${escape(m.time)}</span><h3>${headline(m.title)}</h3><p>${bodyCopy(m.moment)}</p></div>${m.photo?photo(m.photo):""}
  </li>`).join("");
  return `<div class="trail-layout">
    <div class="trail-map" data-interactive>
      <p class="trail-hint">${zh?"點選路線上的月份，看看昊熹當時的小發現。":"Choose a stop to see what Oliver discovered at that age."}</p>
      <div class="trail-surface" role="group" aria-label="${trailName}">${svg}${stops}<span class="trail-pointer" aria-hidden="true"></span></div>
    </div>
    <div class="moment-card">
      <div class="moment-nav" data-interactive>
        <button type="button" data-step="-1" aria-label="${zh?"上一個里程":"Previous milestone"}">←</button>
        <button type="button" data-step="1" aria-label="${zh?"下一個里程":"Next milestone"}">→</button>
      </div>
      <ol class="moments" aria-label="${trailName}" aria-live="polite" aria-atomic="false">${moments}</ol>
    </div>
  </div>`;
}
