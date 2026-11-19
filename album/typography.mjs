const headlines = [
  ["歡迎走進", "昊熹的小世界。"],
  ["昊熹的", "日常小世界"],
  ["一點點的體驗，", "看見獨一無二的你"],
  ["一步步向前，", "一點點長大"],
  ["在愛裏安心，", "在陪伴中自在探索"],
  ["陪着他，", "一起長大"],
  ["幫姐姐", "遞衣架"],
  ["認識身體", "和家人"],
  ["自己", "翻書"],
  ["推好椅子，", "準備開飯"],
  ["走近", "小動物"],
  ["再次", "走近音樂"],
  ["勇敢", "走進水中"],
  ["尋找", "躲起的物件"],
  ["在爬、坐、站", "之間"],
  ["牽着", "爸爸媽媽的手"],
  ["第一張", "學生相"],
  ["把形狀", "放對位置"],
  ["倒進", "另一隻杯"],
  ["飲管杯", "與碰杯"],
  ["一起 ", "Clean up"],
  ["揮手說 ", "Bye bye"],
  ["配對", "救護電單車"],
  ["Welcome to ", "Oliver's ", "little world."],
  ["Oliver's ", "everyday world"],
  ["Everyday ", "experiences ", "that show ", "what makes ", "Oliver unique"],
  ["Step by step, ", "growing ", "a little ", "each day"],
  ["Secure in love, ", "free to explore"],
  ["Growing ", "alongside him"],
];
const phrasesByTitle = new Map(headlines.map(parts => [parts.join(""), parts]));
const han = /\p{Script=Han}/u;
const words = new Intl.Segmenter("zh-Hant-HK", {granularity: "word"});
const protectedWords = /(楊昊熹|昊熹|爸爸媽媽|沖天遙控車|小世界|小趣事|學生相|\d+(?:至\d+)?個月大?|\d+歲(?:\d+個月)?|「[^「」]{1,12}」)/gu;
const escape = text => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const unit = text => '<span class="phrase">' + escape(text) + '</span>';

export function headline(text) {
  const parts = phrasesByTitle.get(text);
  if (!parts) return han.test(text) ? unit(text) : escape(text);
  // Prefer a phrase boundary and let the layout wrap unusually large text.
  return parts.map(part => unit(part.trimEnd()) + (part.endsWith(" ") ? " " : "")).join("<wbr>");
}

export function bodyCopy(text) {
  if (!han.test(text)) return escape(text).replace(/\bRC Car\b/g, unit("RC Car"));
  const pieces = [];
  for (const [i, part] of text.split(protectedWords).entries()) {
    if (!part) continue;
    if (i % 2) pieces.push({text: part, keep: true});
    else for (const {segment, isWordLike} of words.segment(part)) {
      pieces.push({text: segment, keep: isWordLike && segment.length > 1});
    }
  }
  // Keep a short ending together, stopping at the preceding clause boundary.
  let tail = pieces.length, letters = 0;
  while (tail > 0 && letters < 3) {
    const piece = pieces[tail - 1].text;
    if (letters && /[，。！？；、：]/u.test(piece)) break;
    tail--;
    letters += (piece.match(/[\p{L}\p{N}]/gu) || []).length;
  }
  const prefix = pieces.slice(0, tail).map(p => p.keep ? unit(p.text) : escape(p.text)).join("");
  const ending = pieces.slice(tail).map(p => p.text).join("");
  return prefix + (ending ? unit(ending) : "");
}
