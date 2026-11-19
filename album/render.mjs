import {portfolioCopy as originalCopy} from "../app/portfolio-copy";
import {headline, bodyCopy} from "./typography.mjs";
import {applyAlbumMediaCopy} from "./media-copy.mjs";
import {milestonePath, typedGreeting, welcomePage} from "./album-components.mjs";
const portfolioCopy = structuredClone(originalCopy);
const escape = (s) => String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const attr = escape;
const spans = (classNames) => classNames.map(c=>'<span class="'+c+'"></span>').join("");
const balloons = '<div class="meadow-decor-balloons" data-meadow-state="settled" aria-hidden="true">'+spans(["meadow-balloon meadow-balloon-blue","meadow-balloon meadow-balloon-peach","meadow-balloon meadow-balloon-honey"])+'</div>';
const rainbow = '<span class="rainbow" aria-hidden="true"><i></i><b></b></span>';
const texts = {
  zh:{all:"看全部 7 個故事",less:"收起其他故事",notes:"爸爸媽媽的觀察",choose:"選一個故事",nav:"主要導覽",play:"播放影片",watch:"在 YouTube 觀看",short:["幫姐姐遞衣架","認識身體和家人","自己翻書","推好椅子，準備開飯","走近小動物","再次走近音樂","勇敢走進水中"],year:"昊熹的成長旅程",greet:["你好，","我是昊熹。"]},
  en:{all:"See all 7 stories",less:"Show featured stories",notes:"Mum and Dad's observations",choose:"Choose a story",nav:"Main navigation",play:"Play video",watch:"Watch on YouTube",short:["Helping with the laundry","Body and family","Turning the pages","Ready for lunch","Meeting the animals","Back to the piano","Into the water"],year:"Oliver’s learning journey",greet:["Hello, ","I'm Oliver."]}
};
const order=["helping-laundry","body-and-family","reading-pages","ready-for-lunch","feeding-rabbits","piano-keys","swimming-september"];
const originalOrder=["helping-laundry","ready-for-lunch","reading-pages","swimming-september","piano-keys","feeding-rabbits","body-and-family"];
const photoHeights = {
  "hero-portrait":1600, portrait:1600, "about-world":1500, "about-reading":1200, "about-car":1200,
  "about-observing":900, "story-swimming":800, "story-animals":800, "growth-supported":1500,
  "growth-rescue-motorcycle":1500, "family-main":800, "family-origin":1500, "family-care":1500, "family-playful":1500,
};
const posterHeights = {"helping-laundry":480, "problem-solving":270, "swimming-september":270};
function img(name,alt,poster=false) {
  if (poster) {
    const h=posterHeights[name] ?? 720, wide=h!==720;
    const small=wide?320:240, large=wide?480:405, base='/media/video/'+name+'-';
    return '<img class="youtube-video-poster" src="'+base+large+'.webp" srcset="'+base+small+'.webp '+small+'w, '+base+large+'.webp '+large+'w" sizes="(max-width:650px) 90vw, 480px" width="'+large+'" height="'+h+'" data-image="'+name+'" alt="" loading="lazy" decoding="async">';
  }
  const base='/media/oliver/'+name+'-', hero=name==="hero-portrait";
  const sizes=hero ? '(max-width:650px) 78vw, 352px' : '(max-width:650px) 94vw, (max-width:1200px) 46vw, 560px';
  const candidates=ext=>[480,800,1200].map(w=>base+w+'.'+ext+' '+w+'w').join(', ');
  return '<picture><source type="image/avif" srcset="'+candidates("avif")+'" sizes="'+sizes+'"><img src="'+base+'800.webp" srcset="'+candidates("webp")+'" sizes="'+sizes+'" width="1200" height="'+photoHeights[name]+'" data-image="'+name+'" alt="'+attr(alt)+'" loading="'+(hero?"eager":"lazy")+'" decoding="async"'+(hero?' fetchpriority="high"':'')+'></picture>';
}
const photo=(m,cl="")=>'<figure class="photo '+cl+'">'+img(m.name,m.alt)+(m.caption?'<figcaption>'+bodyCopy(m.caption)+'</figcaption>':'')+'</figure>';
const video=(m,t,withCaption=false)=>'<figure class="video '+attr(m.ratio)+'"><div class="screen"><a class="play" href="https://www.youtube.com/watch?v='+attr(m.videoId)+'" target="_blank" rel="noopener" data-video="'+attr(m.videoId)+'" data-title="'+attr(m.title)+'" aria-label="'+attr(t.play+" · "+m.title)+'">'+img(m.poster,"",true)+'<span class="play-label"><i aria-hidden="true"></i>'+t.play+'</span></a></div>'+(withCaption?'<figcaption>'+bodyCopy(m.caption)+'</figcaption>':'')+'<a class="external-video" href="https://www.youtube.com/watch?v='+attr(m.videoId)+'" target="_blank" rel="noopener" hidden>'+t.watch+' ↗</a></figure>';
function interestCard(field, index, t) {
  const medium = field.media;
  const visual = medium.kind === "video" ? video(medium, t) : img(medium.name, medium.alt);
  return `<article class="interest-card" id="interest-${index+1}">
    <div class="field-media">
      ${visual}
      <div class="field-text"><h3>${headline(field.title)}</h3><p>${bodyCopy(field.body)}</p></div>
    </div>
    <p class="field-caption">${bodyCopy(medium.caption)}</p>
  </article>`;
}
// Apply the approved captions to the family stories.
portfolioCopy.zh.growth.intro = "從扶着站起來、配對形狀，到幫忙收拾、揮手道別，爸爸媽媽記下了昊熹的每一步。";
applyAlbumMediaCopy(portfolioCopy);
portfolioCopy.en.growth.milestones.find(m => m.title === "Waving Bye bye").title = "Waving goodbye";
const sectionHeading=(s,id)=>'<header class="chapter-title"><p class="kicker">'+escape(s.eyebrow)+'</p><h2 id="'+id+'-heading" tabindex="-1">'+headline(s.title)+'</h2><p>'+bodyCopy(s.intro)+'</p></header>';
export function renderAlbum(locale, formattedAge){
  const c=portfolioCopy[locale], t=texts[locale], zh=locale==="zh";
  const age=zh ? formattedAge : formattedAge?.replace(/(years?) (\d)/,"$1 and $2");
  const nav=Object.entries(c.nav).map(([id,label])=>'<a href="#'+id+'">'+escape(label)+'</a>').join("");
  const list=order.map(key=>c.stories.items.find(s=>s.media.some(m=>m.poster===key)));
  const idAt=i=>"story-"+(originalOrder.indexOf(order[i])+1)+"-title";
  const selectors=list.map((s,i)=>{
    const medium=s.media.find(m=>m.poster===order[i]);
    return '<a class="pick" data-story="'+idAt(i)+'" href="#'+idAt(i)+'">'+img(medium.poster,"",true)+'<span>'+headline(t.short[i]??s.title)+'</span><b aria-hidden="true">›</b></a>';
  });
  const stories=list.map((s,i)=>{
    const title=idAt(i);
    return '<article class="story" aria-labelledby="'+title+'"><div class="story-heading"><p class="meta">'+escape(s.age)+'</p><h3 id="'+title+'" tabindex="-1">'+headline(t.short[i])+'</h3><p>'+bodyCopy(s.observation)+'</p></div><div class="story-media'+(s.media.length>1?" pair":"")+'">'+s.media.map(m=>m.kind==="photo"?photo(m):video(m,t,s.media.length>1)).join("")+'</div><details class="notes"><summary>'+t.notes+'<span class="plus" aria-hidden="true"></span></summary><div class="notes-body">'+[[c.stories.noticed,s.noticed],[c.stories.support,s.support],[c.stories.reflection,s.reflection]].filter(([,v])=>v).map(([k,v])=>'<h4>'+headline(k)+'</h4><p>'+bodyCopy(v)+'</p>').join("")+'<div class="clues"><strong>'+escape(c.stories.learningClues)+'</strong> '+s.tags.map(tag=>'<span class="phrase">'+escape(tag)+'</span>').join(" · ")+'</div></div></details></article>';
  }).join("");
  return welcomePage(c)+'<a class="skip" href="#main">'+escape(c.skip)+'</a><header class="bar"><div class="wrap bar-inner"><a class="wordmark" href="#top" aria-label="'+(zh?"Oliver YEUNG，返回頁首":"Oliver YEUNG, back to top")+'"><span class="wordmark-name" lang="en-HK"><span>Oliver</span> YEUNG</span></a><nav class="desktop-nav" aria-label="'+t.nav+'">'+nav+'</nav><div class="bar-tools"><div class="languages" aria-label="'+escape(c.controls.languages)+'">'+["zh","en"].map(l=>'<a href="'+(l==="zh"?"/zh-hant/":"/en/")+'" lang="'+(l==="zh"?"zh-Hant":"en")+'" data-lang="'+l+'" aria-current="'+(l===locale?"page":"false")+'">'+(l==="zh"?"中文":"English")+'</a>').join("")+'</div><details class="menu"><summary aria-label="'+escape(c.controls.menu)+'"><i aria-hidden="true"></i></summary><nav aria-label="'+t.nav+'">'+nav+'</nav></details></div></div></header>'+
  '<main id="main" tabindex="-1"><section id="top" class="hero"><div class="wrap hero-grid"><div class="hero-title"><p class="kicker">'+t.year+'</p>'+typedGreeting(t.greet)+rainbow+'</div><div class="hero-person">'+photo(c.hero.portrait,"cover")+'</div><div class="hero-message"><p class="identity">'+(zh?'<span class="identity-name">楊昊熹 <span lang="en">Oliver Yeung</span></span>':'<span class="identity-name">Oliver Yeung <span lang="zh-Hant">楊昊熹</span></span>')+(age?' <span class="identity-age"><span aria-hidden="true">·</span> '+age+'</span>':'')+'</p><p class="intro">'+bodyCopy(c.hero.intro)+'</p></div></div></section>'+
  '<section id="about" class="chapter"><div class="wrap"><div class="about-intro">'+sectionHeading(c.about,"about")+photo(c.about.mainPhoto,"about-main")+'</div><div class="about-fields">'+c.about.fields.map((field,i)=>interestCard(field,i,t)).join("")+'</div></div></section>'+
  '<section id="stories" class="chapter"><div class="wrap">'+sectionHeading(c.stories,"stories")+'<div class="story-layout"><aside class="story-index"><p class="index-label">'+t.choose+'</p><nav aria-label="'+t.choose+'">'+selectors.slice(0,3).join("")+'<details class="all-stories"><summary><span class="closed">'+t.all+'</span><span class="opened">'+t.less+'</span><i class="plus" aria-hidden="true"></i></summary>'+selectors.slice(3).join("")+'</details></nav></aside><div class="reader">'+stories+'</div></div></div></section>'+
  '<section id="growth" class="chapter"><div class="wrap">'+sectionHeading(c.growth,"growth")+milestonePath(c.growth,locale,photo)+'</div></section>'+
  '<section id="family" class="chapter"><div class="wrap"><div class="family-photos">'+sectionHeading(c.family,"family")+c.family.photos.map((f,i)=>photo(f,"family-"+i)).join("")+'</div></div></section>'+
  '<section class="closing"><div class="wrap letter"><header><p class="kicker">'+escape(c.closing.eyebrow)+'</p><h2>'+headline(c.closing.title)+'</h2></header><div><p>'+bodyCopy(c.closing.reflection)+'</p><p>'+bodyCopy(c.closing.hope)+'</p></div>'+balloons+'</div></section></main>'+
  '<footer><div class="wrap footer-inner"><div><strong>Oliver Yeung 楊昊熹</strong><small>'+escape(c.footer.updated)+'</small></div><p>'+bodyCopy(c.privacy.body)+'</p><div class="footer-links"><a href="#top">'+escape(c.footer.top)+' ↑</a></div></div></footer>';
}
