"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Locale = "en" | "zh";

type VideoSource = {
  src: string;
  type: string;
  media?: string;
};

type CaptionTrack = {
  src: string;
  srcLang: "en-HK" | "zh-Hant-HK";
  label: string;
};

type EditorialVideoAsset = {
  id: string;
  localized: Record<
    Locale,
    {
      title: string;
      summary: string;
      durationLabel: string;
      posterAlt: string;
      transcriptHref: string;
    }
  >;
  poster: {
    src: string;
    width: number;
    height: number;
    srcSet?: string;
    sizes?: string;
  };
  sources: VideoSource[];
  captions: CaptionTrack[];
  visualDescription: "integrated" | "audio-described";
};

const STORY_VIDEO_PLAY_EVENT = "oliver-portfolio-video-play";

// Parent-approved, metadata-stripped derivatives will be mapped here later.
// Empty entries deliberately render editorial placeholders and load no media.
const storyVideoAssetDrafts: Array<EditorialVideoAsset | undefined> = [
  undefined,
  undefined,
  undefined,
  undefined,
];

function prepareStoryVideoAssets(
  assets: Array<EditorialVideoAsset | undefined>,
): Array<EditorialVideoAsset | undefined> {
  const seenIds = new Set<string>();
  const locales: Locale[] = ["en", "zh"];

  return assets.map((asset) => {
    if (!asset) return undefined;

    const requiredCaptionLanguages: CaptionTrack["srcLang"][] = ["en-HK", "zh-Hant-HK"];
    const completeLocalizedMetadata = locales.every((locale) => {
      const localized = asset.localized[locale];
      return (
        Boolean(localized?.title.trim()) &&
        Boolean(localized?.summary.trim()) &&
        Boolean(localized?.durationLabel.trim()) &&
        Boolean(localized?.posterAlt.trim()) &&
        Boolean(localized?.transcriptHref.trim())
      );
    });
    const complete =
      Boolean(asset.id.trim()) &&
      completeLocalizedMetadata &&
      Boolean(asset.poster.src.trim()) &&
      asset.poster.width > 0 &&
      asset.poster.height > 0 &&
      asset.sources.length > 0 &&
      asset.sources.every((source) => Boolean(source.src.trim()) && Boolean(source.type.trim())) &&
      asset.captions.length === requiredCaptionLanguages.length &&
      requiredCaptionLanguages.every((language) =>
        asset.captions.filter(
          (track) =>
            track.srcLang === language &&
            Boolean(track.src.trim()) &&
            Boolean(track.label.trim()),
        ).length === 1,
      ) &&
      (asset.visualDescription === "integrated" || asset.visualDescription === "audio-described");

    // Incomplete drafts stay safely in placeholder mode instead of emitting a broken player.
    if (!complete) return undefined;

    if (seenIds.has(asset.id)) {
      throw new Error(`Duplicate story video asset id: ${asset.id}`);
    }
    seenIds.add(asset.id);
    return asset;
  });
}

const storyVideoAssets = prepareStoryVideoAssets(storyVideoAssetDrafts);

type PortfolioContent = {
  lang: "en-HK" | "zh-Hant-HK";
  title: string;
  skip: string;
  wordmarkLabel: string;
  nav: { about: string; learning: string; moments: string; family: string };
  menu: string;
  languageLabel: string;
  selectedLanguage: string;
  print: string;
  printLabel: string;
  contentNeeded: string;
  optional: string;
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    primary: string;
    portrait: string;
    portraitAlt: string;
    studentLabel: string;
    context: string;
  };
  about: {
    eyebrow: string;
    title: string;
    note: string;
    traits: string;
    traitValues: string[];
    activities: string;
    activitiesValue: string;
    language: string;
    languageValue: string;
    learning: string;
    learningValue: string;
  };
  learning: {
    eyebrow: string;
    title: string;
    intro: string;
    cardTitle: string;
    observations: string[];
    tags: string[];
    photo: string;
    photoAlt: string;
    lenses: string[];
  };
  stories: {
    eyebrow: string;
    title: string;
    intro: string;
    storyLabel: string;
    storyTitle: string;
    ageLabel: string;
    ageValue: string;
    photo: string;
    photoAlt: string;
    happened: string;
    observation: string[];
    shows: string;
    tags: string[];
    reflection: string;
    reflectionValue: string;
    sequenceLabel: string;
    sequenceValue: string;
    video: {
      policy: string;
      label: string;
      placeholder: string;
      placeholderAlt: string;
      note: string;
      play: string;
      duration: string;
      captions: string;
      transcript: string;
      visualDescription: string;
      transcriptLink: string;
    };
  };
  independence: {
    eyebrow: string;
    title: string;
    intro: string;
    promptBadge: string;
    prompts: string[];
    value: string;
  };
  family: {
    eyebrow: string;
    title: string;
    introLabel: string;
    introValue: string;
    momentsLabel: string;
    momentsNote: string;
    prompts: string[];
    promptValue: string;
    photoOne: string;
    photoTwo: string;
    photoAlt: string;
  };
  timeline: {
    eyebrow: string;
    title: string;
    intro: string;
    moment: string;
    month: string;
    value: string;
    photo: string;
    photoAlt: string;
  };
  closing: {
    eyebrow: string;
    title: string;
    reflectionLabel: string;
    reflection: string;
    hopesLabel: string;
    hopes: string;
    top: string;
  };
  privacy: {
    eyebrow: string;
    title: string;
    body: string;
    link: string;
  };
  footer: {
    update: string;
    review: string;
  };
};

const content: Record<Locale, PortfolioContent> = {
  en: {
    lang: "en-HK",
    title: "Oliver YEUNG | A little learner's portfolio",
    skip: "Skip to main content",
    wordmarkLabel: "Oliver YEUNG — return to the top",
    nav: {
      about: "About",
      learning: "Learning",
      moments: "Moments",
      family: "Family",
    },
    menu: "Menu",
    languageLabel: "Choose language",
    selectedLanguage: "Selected",
    print: "Print portfolio",
    printLabel: "Open print options for Oliver's portfolio",
    contentNeeded: "Content needed",
    optional: "Optional",
    hero: {
      eyebrow: "A little learner's portfolio",
      title: "Hello, I'm Oliver.",
      intro: "[PARENT-PROVIDED INTRODUCTION]",
      primary: "View Oliver's learning stories",
      portrait: "Hero portrait to be added.",
      portraitAlt:
        "Placeholder for a parent-provided 4 by 5 hero portrait of Oliver. Alternative text will be written after the photograph is supplied.",
      studentLabel: "Student",
      context: "A bilingual collection of everyday discoveries and family moments",
    },
    about: {
      eyebrow: "A little about Oliver",
      title: "A calm introduction, in his parents' own words.",
      note: "Every personal detail below remains an editorial placeholder until it is provided and confirmed by Oliver's parents.",
      traits: "Personality traits",
      traitValues: [
        "[PARENT-PROVIDED TRAIT 1]",
        "[PARENT-PROVIDED TRAIT 2]",
        "[PARENT-PROVIDED TRAIT 3]",
        "[PARENT-PROVIDED TRAIT 4]",
      ],
      activities: "Favourite activities",
      activitiesValue: "[PARENT-PROVIDED FAVOURITE ACTIVITIES]",
      language: "Language exposure",
      languageValue: "[PARENT-PROVIDED LANGUAGE EXPOSURE]",
      learning: "Preferred ways of exploring and learning",
      learningValue: "[PARENT-PROVIDED WAYS OF EXPLORING AND LEARNING]",
    },
    learning: {
      eyebrow: "How Oliver learns",
      title: "Six lenses for noticing how a moment unfolds.",
      intro:
        "These themes organise parent-provided observations. They are presentation lenses, not formal assessments.",
      cardTitle: "[PARENT-PROVIDED SHORT TITLE]",
      observations: [
        "[OBSERVATION 1: DESCRIBE WHAT OLIVER DID, NOTICED OR TRIED.]",
        "[OBSERVATION 2: DESCRIBE HOW OLIVER RESPONDED OR WHAT HAPPENED NEXT.]",
      ],
      tags: ["[CAPABILITY TAG 1]", "[CAPABILITY TAG 2]", "[CAPABILITY TAG 3]"],
      photo: "Photo to be added",
      photoAlt:
        "Parent-provided photograph placeholder. Alternative text will describe only the visible people, action and setting once the image is supplied.",
      lenses: [
        "Movement & Growth",
        "Language & Connection",
        "Patterns & Problem-Solving",
        "Exploring the World",
        "Relationships & Independence",
        "Creating & Imagining",
      ],
    },
    stories: {
      eyebrow: "Featured learning stories",
      title: "Small moments, observed with care.",
      intro:
        "Four story spaces are ready for authentic parent observations. The structure keeps what happened separate from any interpretation.",
      storyLabel: "Learning story",
      storyTitle: "[STORY TITLE]",
      ageLabel: "Oliver's age at the time",
      ageValue: "[AGE IN MONTHS] months",
      photo: "Primary story photograph to be added",
      photoAlt:
        "Placeholder for a parent-provided learning-story photograph. Alternative text will be added after the photograph is reviewed.",
      happened: "What happened",
      observation: [
        "[OBSERVATION: DESCRIBE THE SETTING AND WHAT OLIVER DID.]",
        "[OBSERVATION: DESCRIBE THE VISIBLE ACTION OR RESPONSE.]",
        "[OBSERVATION: DESCRIBE HOW THE MOMENT ENDED OR CONTINUED.]",
      ],
      shows: "What this moment shows",
      tags: ["[STRENGTH-BASED TAG 1]", "[STRENGTH-BASED TAG 2]", "[STRENGTH-BASED TAG 3]"],
      reflection: "Parent reflection",
      reflectionValue: "[PARENT-PROVIDED ONE-SENTENCE REFLECTION]",
      sequenceLabel: "Optional sequence photograph",
      sequenceValue:
        "[ADD ONLY IF A SECOND PARENT-PROVIDED PHOTO SHOWS A MEANINGFUL SEQUENCE.]",
      video: {
        policy:
          "Videos use a static poster and load only after Play is selected. Only one clip plays at a time; reviewed bilingual captions and a descriptive transcript are required.",
        label: "Optional story film",
        placeholder: "Story video and poster to be added",
        placeholderAlt:
          "Placeholder for a parent-provided story video poster. No video file is attached or downloaded in this review build.",
        note:
          "[ADD A SHORT VIDEO ONLY WHEN IT MAKES THE OBSERVED SEQUENCE CLEARER.]",
        play: "Play story video",
        duration: "[DURATION]",
        captions: "[REVIEWED ENGLISH + TRADITIONAL CHINESE CAPTIONS]",
        transcript: "[BILINGUAL DESCRIPTIVE TRANSCRIPT]",
        visualDescription: "[INTEGRATED OR AUDIO-DESCRIBED NARRATION]",
        transcriptLink: "Read video transcript",
      },
    },
    independence: {
      eyebrow: "Everyday independence",
      title: "Everyday routines, described without assumptions.",
      intro:
        "The prompts below are editing cues only. Keep a prompt only when Oliver's parents provide a direct observation from that routine.",
      promptBadge: "Editorial prompt — retain only if observed",
      prompts: [
        "Eating or drinking",
        "Washing hands",
        "Helping with dressing",
        "Tidying",
        "Participating in a routine",
      ],
      value: "[PARENT-PROVIDED DIRECT OBSERVATION OF THIS ROUTINE]",
    },
    family: {
      eyebrow: "Relationships and family values",
      title: "The environment around Oliver.",
      introLabel: "Family values",
      introValue: "[PARENT-PROVIDED PARAGRAPH ABOUT THE FAMILY'S EDUCATIONAL VALUES]",
      momentsLabel: "Shared moments",
      momentsNote:
        "Possible prompts only — include an item only when Oliver's parents confirm a real example.",
      prompts: ["Shared reading", "Outdoor exploration", "Kindness", "A family routine"],
      promptValue: "[PARENT-PROVIDED SHARED MOMENT, IF APPLICABLE]",
      photoOne: "Family photograph 1 to be added",
      photoTwo: "Optional family photograph 2 to be added",
      photoAlt:
        "Placeholder for a parent-provided family photograph. Alternative text will be written after the image is supplied.",
    },
    timeline: {
      eyebrow: "Recent moments of growth",
      title: "A simple timeline of observed moments.",
      intro:
        "Timeline ages are not calculated automatically. Each label and observation will be supplied and checked by Oliver's parents.",
      moment: "Moment",
      month: "[AGE IN MONTHS OR GENERAL MONTH LABEL]",
      value: "[PARENT-PROVIDED OBSERVED MOMENT]",
      photo: "Optional small photograph to be added",
      photoAlt:
        "Optional parent-provided timeline photograph placeholder. Alternative text will be added once supplied.",
    },
    closing: {
      eyebrow: "A note from Oliver's parents",
      title: "Looking ahead, gently.",
      reflectionLabel: "Parent reflection",
      reflection: "[PARENT-PROVIDED CLOSING REFLECTION]",
      hopesLabel: "Hopes for Oliver's kindergarten journey",
      hopes: "[PARENT-PROVIDED HOPE FOR OLIVER'S KINDERGARTEN JOURNEY]",
      top: "Back to top",
    },
    privacy: {
      eyebrow: "Privacy",
      title: "A brief privacy notice",
      body:
        "This private portfolio is shared by Oliver's parents with invited viewers. Please do not copy or redistribute the photographs or videos.",
      link: "Privacy notice",
    },
    footer: {
      update: "Portfolio updated: July 2026",
      review: "Unpublished review build",
    },
  },
  zh: {
    lang: "zh-Hant-HK",
    title: "Oliver YEUNG｜昊熹的成長故事",
    skip: "跳至主要內容",
    wordmarkLabel: "Oliver YEUNG——返回頁首",
    nav: {
      about: "關於昊熹",
      learning: "學習與探索",
      moments: "成長點滴",
      family: "家庭與價值觀",
    },
    menu: "選單",
    languageLabel: "選擇語言",
    selectedLanguage: "已選取",
    print: "列印本頁",
    printLabel: "開啟本頁的列印選項",
    contentNeeded: "待補內容",
    optional: "可選",
    hero: {
      eyebrow: "昊熹的成長故事",
      title: "你好，我是昊熹。",
      intro: "[爸爸媽媽提供的簡介]",
      primary: "閱讀昊熹的成長故事",
      portrait: "待加入主視覺人像相片。",
      portraitAlt:
        "昊熹的 4:5 主視覺人像相片預留位置。相片由爸爸媽媽提供後，才會撰寫替代文字。",
      studentLabel: "學生",
      context: "記錄日常探索與家庭時光的成長故事",
    },
    about: {
      eyebrow: "關於昊熹",
      title: "透過爸爸媽媽的文字，慢慢認識昊熹。",
      note: "以下所有個人內容均為待補內容，會在昊熹的爸爸媽媽提供並確認後才加入。",
      traits: "性格特質",
      traitValues: [
        "[爸爸媽媽提供的特質 1]",
        "[爸爸媽媽提供的特質 2]",
        "[爸爸媽媽提供的特質 3]",
        "[爸爸媽媽提供的特質 4]",
      ],
      activities: "喜愛的活動",
      activitiesValue: "[爸爸媽媽提供的喜愛活動]",
      language: "語言接觸",
      languageValue: "[爸爸媽媽提供的語言接觸情況]",
      learning: "喜愛的探索及學習方式",
      learningValue: "[爸爸媽媽提供的探索及學習方式]",
    },
    learning: {
      eyebrow: "昊熹的學習方式",
      title: "從六個角度，細看每個片段如何發展。",
      intro: "以下六個角度用作整理爸爸媽媽提供的觀察，並非正式評估。",
      cardTitle: "[爸爸媽媽提供的簡短標題]",
      observations: [
        "[觀察 1：描述昊熹做了甚麼、留意到甚麼或作出了甚麼嘗試。]",
        "[觀察 2：描述昊熹如何回應，或之後發生了甚麼。]",
      ],
      tags: ["[能力標籤 1]", "[能力標籤 2]", "[能力標籤 3]"],
      photo: "待加入相片",
      photoAlt:
        "爸爸媽媽提供相片的預留位置。收到相片後，替代文字只會描述可見的人物、動作及環境。",
      lenses: [
        "活動與成長",
        "語言與溝通",
        "規律與解難",
        "探索世界",
        "相處與自理",
        "創作與想像",
      ],
    },
    stories: {
      eyebrow: "精選成長故事",
      title: "細心記下每個小小片段。",
      intro: "首版預留四個真實成長故事的位置，並清楚分開「發生了甚麼」與任何詮釋。",
      storyLabel: "成長故事",
      storyTitle: "[成長故事標題]",
      ageLabel: "昊熹當時的年齡",
      ageValue: "[當時月齡] 個月大",
      photo: "待加入主要故事相片",
      photoAlt: "爸爸媽媽提供成長故事相片的預留位置。收到並檢視相片後，才會加入替代文字。",
      happened: "當時發生了甚麼",
      observation: [
        "[觀察：描述當時環境，以及昊熹做了甚麼。]",
        "[觀察：描述可直接看見的動作或回應。]",
        "[觀察：描述片段如何結束或延續。]",
      ],
      shows: "這一刻呈現了甚麼",
      tags: ["[正向特質標籤 1]", "[正向特質標籤 2]", "[正向特質標籤 3]"],
      reflection: "爸爸媽媽感想",
      reflectionValue: "[爸爸媽媽提供的一句感想]",
      sequenceLabel: "可選的連續片段相片",
      sequenceValue: "[只在第二張爸爸媽媽提供的相片能呈現有意義的連續片段時加入。]",
      video: {
        policy:
          "影片以靜態封面顯示，只有在使用者選擇播放後才載入；同一時間只會播放一段影片，並須備有經覆核的雙語字幕及描述性文字稿。",
        label: "可選的故事影片",
        placeholder: "待加入故事影片及封面",
        placeholderAlt:
          "爸爸媽媽提供的故事影片封面預留位置。本審閱版本沒有連接或下載任何影片檔案。",
        note: "[只在短片能更清楚呈現觀察片段的發展時加入。]",
        play: "播放故事影片",
        duration: "[影片長度]",
        captions: "[經覆核的 English 及繁體中文字幕]",
        transcript: "[雙語描述性文字稿]",
        visualDescription: "[整合式旁述或口述影像版本]",
        transcriptLink: "閱讀影片文字稿",
      },
    },
    independence: {
      eyebrow: "日常自理",
      title: "以實際觀察描述日常生活片段，不作假設。",
      intro: "以下只是編輯提示；只有在昊熹的爸爸媽媽提供相關日常片段的實際觀察後，才會保留該項目。",
      promptBadge: "編輯提示——只在有實際觀察時保留",
      prompts: ["進食或飲水", "洗手", "穿衣時幫忙", "收拾物件", "參與日常生活"],
      value: "[爸爸媽媽提供的日常自理觀察]",
    },
    family: {
      eyebrow: "相處與家庭價值觀",
      title: "昊熹身邊的成長環境。",
      introLabel: "家庭價值觀",
      introValue: "[爸爸媽媽提供的家庭教育價值觀簡介]",
      momentsLabel: "一起經歷的時光",
      momentsNote: "以下只是編輯提示；只有在昊熹的爸爸媽媽確認有真實例子後才會保留。",
      prompts: ["親子閱讀", "戶外探索", "關愛別人", "家庭日常"],
      promptValue: "[爸爸媽媽提供的共處片段，如適用]",
      photoOne: "待加入家庭相片 1",
      photoTwo: "可選：待加入家庭相片 2",
      photoAlt: "爸爸媽媽提供家庭相片的預留位置。收到相片後，才會撰寫替代文字。",
    },
    timeline: {
      eyebrow: "近期成長點滴",
      title: "以簡單時間線，記下直接觀察到的片段。",
      intro: "時間線內的年齡不會自動計算。每項標示及觀察均由昊熹的爸爸媽媽提供並確認。",
      moment: "點滴",
      month: "[月齡或月份標示]",
      value: "[爸爸媽媽提供的成長觀察]",
      photo: "可選：待加入小相片",
      photoAlt: "爸爸媽媽提供時間線小相片的預留位置。收到相片後，才會加入替代文字。",
    },
    closing: {
      eyebrow: "爸爸媽媽的話",
      title: "溫柔地展望未來。",
      reflectionLabel: "爸爸媽媽感想",
      reflection: "[爸爸媽媽提供的結語]",
      hopesLabel: "對昊熹幼稚園生活的期望",
      hopes: "[爸爸媽媽對昊熹幼稚園生活的期望]",
      top: "返回頁首",
    },
    privacy: {
      eyebrow: "私隱",
      title: "簡短私隱聲明",
      body:
        "本私人作品集由昊熹的爸爸媽媽與獲邀人士分享。請勿複製或轉載網站內的相片或影片。",
      link: "私隱聲明",
    },
    footer: {
      update: "作品集更新日期：2026年7月",
      review: "未發佈審閱版本",
    },
  },
};

function LanguageSwitch({
  locale,
  onChange,
  label,
  selectedLabel,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
  selectedLabel: string;
}) {
  return (
    <div className="language-switch" role="group" aria-label={label}>
      <button
        type="button"
        className={locale === "zh" ? "is-selected" : ""}
        aria-pressed={locale === "zh"}
        onClick={() => onChange("zh")}
      >
        {locale === "zh" && <span className="selected-dot" aria-hidden="true" />}
        中文
        {locale === "zh" && <span className="sr-only"> — {selectedLabel}</span>}
      </button>
      <button
        type="button"
        className={locale === "en" ? "is-selected" : ""}
        aria-pressed={locale === "en"}
        onClick={() => onChange("en")}
      >
        {locale === "en" && <span className="selected-dot" aria-hidden="true" />}
        English
        {locale === "en" && <span className="sr-only"> — {selectedLabel}</span>}
      </button>
    </div>
  );
}

function PhotoPlaceholder({
  label,
  alt,
  aspect = "landscape",
  optional,
}: {
  label: string;
  alt: string;
  aspect?: "portrait" | "landscape" | "compact";
  optional?: string;
}) {
  return (
    <div className={`photo-placeholder photo-${aspect}`} role="img" aria-label={alt}>
      <span className="photo-corner" aria-hidden="true" />
      <span className="photo-plus" aria-hidden="true">+</span>
      {optional && <span className="optional-label">{optional}</span>}
      <strong>{label}</strong>
      <span className="sr-only">{alt}</span>
    </div>
  );
}

function EditorialVideo({
  asset,
  copy,
  contentBadge,
  locale,
  storyNumber,
}: {
  asset?: EditorialVideoAsset;
  copy: PortfolioContent["stories"]["video"];
  contentBadge: string;
  locale: Locale;
  storyNumber: number;
}) {
  const [activated, setActivated] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoId = asset?.id ?? `story-video-${storyNumber}`;

  useEffect(() => {
    const pauseWhenAnotherStarts = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string }>).detail;
      if (detail?.id !== videoId) videoRef.current?.pause();
    };

    window.addEventListener(STORY_VIDEO_PLAY_EVENT, pauseWhenAnotherStarts);
    return () => window.removeEventListener(STORY_VIDEO_PLAY_EVENT, pauseWhenAnotherStarts);
  }, [videoId]);

  if (!asset) {
    const placeholderId = `story-video-placeholder-${storyNumber}`;
    return (
      <figure className="editorial-video video-placeholder" aria-labelledby={placeholderId}>
        <div className="video-poster-placeholder" role="img" aria-label={copy.placeholderAlt}>
          <span className="video-format" aria-hidden="true">16:9</span>
          <span className="video-play-glyph" aria-hidden="true">▶</span>
          <strong id={placeholderId}>{copy.placeholder}</strong>
          <span className="video-duration">{copy.duration}</span>
        </div>
        <figcaption>
          <div className="video-caption-topline">
            <span className="content-badge">{contentBadge}</span>
            <strong>{copy.label}</strong>
          </div>
          <p>{copy.note}</p>
          <div className="video-requirements" aria-label={locale === "en" ? "Required video accessibility assets" : "影片所需無障礙素材"}>
            <span>{copy.captions}</span>
            <span>{copy.transcript}</span>
            <span>{copy.visualDescription}</span>
          </div>
        </figcaption>
      </figure>
    );
  }

  const selectedLanguage = locale === "en" ? "en-HK" : "zh-Hant-HK";
  const localizedAsset = asset.localized[locale];
  const announcePlayback = () => {
    window.dispatchEvent(
      new CustomEvent(STORY_VIDEO_PLAY_EVENT, { detail: { id: videoId } }),
    );
  };
  const activateVideo = () => {
    // Commit the native player during the user gesture so iOS may honour play().
    flushSync(() => setActivated(true));
    videoRef.current?.focus({ preventScroll: true });
    void videoRef.current?.play().catch(() => {
      // Native controls remain focused and available when a browser requires a second tap.
    });
  };

  return (
    <figure className="editorial-video video-ready">
      <div className="video-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="video-poster-image"
          src={asset.poster.src}
          srcSet={asset.poster.srcSet}
          sizes={asset.poster.sizes}
          width={asset.poster.width}
          height={asset.poster.height}
          alt={localizedAsset.posterAlt}
          aria-hidden={activated}
          loading="lazy"
          decoding="async"
        />
        {!activated ? (
          <button
            type="button"
            className="video-poster-button"
            aria-label={`${copy.play}: ${localizedAsset.title}`}
            onClick={activateVideo}
          >
            <span className="video-play-glyph" aria-hidden="true">▶</span>
            <span className="video-duration">{localizedAsset.durationLabel}</span>
          </button>
        ) : (
          <video
            ref={videoRef}
            className="story-video-player"
            controls
            playsInline
            preload="none"
            controlsList="nodownload"
            poster={asset.poster.src}
            width={asset.poster.width}
            height={asset.poster.height}
            aria-label={localizedAsset.title}
            tabIndex={0}
            onPlay={announcePlayback}
          >
            {asset.sources.map((source) => (
              <source
                key={`${source.src}-${source.media ?? "all"}`}
                src={source.src}
                type={source.type}
                media={source.media}
              />
            ))}
            {asset.captions.map((track) => (
              <track
                key={`${track.src}-${track.srcLang}`}
                kind="captions"
                src={track.src}
                srcLang={track.srcLang}
                label={track.label}
                default={track.srcLang === selectedLanguage}
              />
            ))}
          </video>
        )}
      </div>
      <figcaption>
        <div className="video-caption-topline">
          <strong>{localizedAsset.title}</strong>
          <span>{localizedAsset.durationLabel}</span>
        </div>
        <p>{localizedAsset.summary}</p>
        <a href={localizedAsset.transcriptHref}>{copy.transcriptLink}</a>
      </figcaption>
    </figure>
  );
}

function PlaceholderLine({ badge, children }: { badge: string; children: React.ReactNode }) {
  return (
    <div className="placeholder-line">
      <span className="content-badge">{badge}</span>
      <span>{children}</span>
    </div>
  );
}

function PrintButton({ label, accessibleLabel, className = "button secondary-button" }: {
  label: string;
  accessibleLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`${className} no-print`}
      aria-label={accessibleLabel}
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}

export default function OliverPortfolio({ initialLocale }: { initialLocale: Locale }) {
  const locale = initialLocale;
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const c = content[locale];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    ).filter((target) => target.getBoundingClientRect().top > window.innerHeight);
    revealTargets.forEach((target) => target.classList.add("reveal-pending"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    revealTargets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const blockPointerContextMenu = (event: MouseEvent) => {
      // Block mouse right-click and macOS control-click while preserving keyboard menus.
      if (event.button === 2 || event.ctrlKey) event.preventDefault();
    };

    document.addEventListener("contextmenu", blockPointerContextMenu, true);
    return () => document.removeEventListener("contextmenu", blockPointerContextMenu, true);
  }, []);

  const changeLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;
    try {
      window.localStorage.setItem("oliver-portfolio-language", nextLocale);
    } catch {
      // A local preference is optional and never blocks language switching.
    }
    const hash = window.location.hash;
    const nextPath = nextLocale === "zh" ? "/zh-hant/" : "/en/";
    mobileMenuRef.current?.removeAttribute("open");
    window.location.assign(`${nextPath}${hash}`);
  };

  const closeMobileMenu = () => mobileMenuRef.current?.removeAttribute("open");

  return (
    <div id="top" className="site-shell" lang={c.lang}>
      <a className="skip-link" href="#main-content">{c.skip}</a>

      <header className="site-header no-print">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label={c.wordmarkLabel}>
            <span>Oliver</span> YEUNG
          </a>

          <nav className="desktop-nav" aria-label={locale === "en" ? "Primary navigation" : "主要導覽"}>
            <a href="#about">{c.nav.about}</a>
            <a href="#learning">{c.nav.learning}</a>
            <a href="#stories">{c.nav.moments}</a>
            <a href="#family">{c.nav.family}</a>
          </nav>

          <div className="header-actions">
            <LanguageSwitch
              locale={locale}
              onChange={changeLocale}
              label={c.languageLabel}
              selectedLabel={c.selectedLanguage}
            />
            <PrintButton
              label={c.print}
              accessibleLabel={c.printLabel}
              className="header-print"
            />
            <details className="mobile-menu" ref={mobileMenuRef}>
              <summary>{c.menu}</summary>
              <nav aria-label={locale === "en" ? "Mobile navigation" : "流動版導覽"}>
                <a href="#about" onClick={closeMobileMenu}>{c.nav.about}</a>
                <a href="#learning" onClick={closeMobileMenu}>{c.nav.learning}</a>
                <a href="#stories" onClick={closeMobileMenu}>{c.nav.moments}</a>
                <a href="#family" onClick={closeMobileMenu}>{c.nav.family}</a>
                <button type="button" onClick={() => { window.print(); closeMobileMenu(); }}>
                  {c.print}
                </button>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="page-grid hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">{c.hero.eyebrow}</p>
              <h1 id="hero-title">{c.hero.title}</h1>
              <p className="identity-line">Oliver YEUNG <span aria-hidden="true">·</span> 楊昊熹</p>
              <PlaceholderLine badge={c.contentNeeded}>{c.hero.intro}</PlaceholderLine>
              <div className="hero-meta" aria-label={locale === "en" ? "Portfolio context" : "作品集資料"}>
                <span>{c.hero.studentLabel}</span>
                <span>{c.hero.context}</span>
              </div>
              <div className="button-row no-print">
                <a className="button primary-button" href="#stories">{c.hero.primary}</a>
                <PrintButton label={c.print} accessibleLabel={c.printLabel} />
              </div>
            </div>
            <div className="hero-visual">
              <PhotoPlaceholder label={c.hero.portrait} alt={c.hero.portraitAlt} aspect="portrait" />
              <span className="decorative-stroke decorative-stroke-peach" aria-hidden="true" />
              <span className="decorative-stroke decorative-stroke-blue" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section id="about" className="section-pad print-section" aria-labelledby="about-title">
          <div className="page-grid">
            <header className="section-heading section-heading-wide" data-reveal>
              <p className="eyebrow">{c.about.eyebrow}</p>
              <h2 id="about-title">{c.about.title}</h2>
              <p>{c.about.note}</p>
            </header>
            <div className="about-grid">
              <article className="editorial-card about-card about-traits" data-reveal>
                <p className="card-index" aria-hidden="true">01</p>
                <h3>{c.about.traits}</h3>
                <div className="trait-list">
                  {c.about.traitValues.map((trait) => <span key={trait}>{trait}</span>)}
                </div>
                <span className="content-badge">{c.contentNeeded}</span>
              </article>
              <article className="editorial-card about-card" data-reveal>
                <p className="card-index" aria-hidden="true">02</p>
                <h3>{c.about.activities}</h3>
                <PlaceholderLine badge={c.contentNeeded}>{c.about.activitiesValue}</PlaceholderLine>
              </article>
              <article className="editorial-card about-card" data-reveal>
                <p className="card-index" aria-hidden="true">03</p>
                <h3>{c.about.language}</h3>
                <PlaceholderLine badge={c.contentNeeded}>{c.about.languageValue}</PlaceholderLine>
              </article>
              <article className="editorial-card about-card about-wide" data-reveal>
                <p className="card-index" aria-hidden="true">04</p>
                <h3>{c.about.learning}</h3>
                <PlaceholderLine badge={c.contentNeeded}>{c.about.learningValue}</PlaceholderLine>
              </article>
            </div>
          </div>
        </section>

        <section id="learning" className="section-pad tinted-section print-section" aria-labelledby="learning-title">
          <div className="page-grid">
            <header className="section-heading" data-reveal>
              <p className="eyebrow">{c.learning.eyebrow}</p>
              <h2 id="learning-title">{c.learning.title}</h2>
              <p>{c.learning.intro}</p>
            </header>
            <div className="lens-grid">
              {c.learning.lenses.map((lens, index) => (
                <article className={`editorial-card lens-card lens-${index + 1}`} data-reveal key={lens}>
                  <div className="lens-topline">
                    <span className="lens-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span>{lens}</span>
                  </div>
                  <PhotoPlaceholder
                    label={`${lens} — ${c.learning.photo}`}
                    alt={`${lens}. ${c.learning.photoAlt}`}
                  />
                  <div className="lens-body">
                    <h3>{c.learning.cardTitle}</h3>
                    {c.learning.observations.map((observation) => (
                      <p className="placeholder-copy" key={observation}>{observation}</p>
                    ))}
                    <div className="tag-list" aria-label={locale === "en" ? "Capability tag placeholders" : "能力標籤預留位置"}>
                      {c.learning.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className="section-pad print-section" aria-labelledby="stories-title">
          <div className="page-grid">
            <header className="section-heading section-heading-wide" data-reveal>
              <p className="eyebrow">{c.stories.eyebrow}</p>
              <h2 id="stories-title">{c.stories.title}</h2>
              <p>{c.stories.intro}</p>
              <p className="media-policy">{c.stories.video.policy}</p>
            </header>
            <div className="story-stack">
              {[1, 2, 3, 4].map((storyNumber) => (
                <article className={`story-card ${storyNumber === 1 ? "story-featured" : ""}`} data-reveal key={storyNumber}>
                  <div className="story-photo-column">
                    <div className="story-number">
                      <span>{c.stories.storyLabel}</span>
                      <strong>{String(storyNumber).padStart(2, "0")}</strong>
                    </div>
                    <PhotoPlaceholder
                      label={`${c.stories.photo} — ${String(storyNumber).padStart(2, "0")}`}
                      alt={`${c.stories.storyLabel} ${storyNumber}. ${c.stories.photoAlt}`}
                    />
                    <div className="sequence-note">
                      <span className="optional-label">{c.optional}</span>
                      <strong>{c.stories.sequenceLabel}</strong>
                      <p>{c.stories.sequenceValue}</p>
                    </div>
                  </div>
                  <div className="story-content">
                    <h3>{c.stories.storyTitle} {String(storyNumber).padStart(2, "0")}</h3>
                    <div className="story-age">
                      <span>{c.stories.ageLabel}</span>
                      <strong>{c.stories.ageValue}</strong>
                    </div>
                    <EditorialVideo
                      asset={storyVideoAssets[storyNumber - 1]}
                      copy={c.stories.video}
                      contentBadge={c.contentNeeded}
                      locale={locale}
                      storyNumber={storyNumber}
                    />
                    <div className="story-block">
                      <p className="story-label">{c.stories.happened}</p>
                      {c.stories.observation.map((observation) => (
                        <p className="placeholder-copy" key={observation}>{observation}</p>
                      ))}
                    </div>
                    <div className="story-block">
                      <p className="story-label">{c.stories.shows}</p>
                      <div className="tag-list">
                        {c.stories.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </div>
                    <blockquote>
                      <p className="story-label">{c.stories.reflection}</p>
                      <p>{c.stories.reflectionValue}</p>
                    </blockquote>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="independence" className="section-pad soft-blue-section print-section" aria-labelledby="independence-title">
          <div className="page-grid independence-layout">
            <header className="section-heading" data-reveal>
              <p className="eyebrow">{c.independence.eyebrow}</p>
              <h2 id="independence-title">{c.independence.title}</h2>
              <p>{c.independence.intro}</p>
            </header>
            <div className="routine-list">
              {c.independence.prompts.map((prompt) => (
                <article className="routine-item" data-reveal key={prompt}>
                  <span className="prompt-badge">{c.independence.promptBadge}</span>
                  <h3>{prompt}</h3>
                  <p>{c.independence.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="family" className="section-pad print-section" aria-labelledby="family-title">
          <div className="page-grid">
            <header className="section-heading section-heading-wide" data-reveal>
              <p className="eyebrow">{c.family.eyebrow}</p>
              <h2 id="family-title">{c.family.title}</h2>
            </header>
            <div className="family-grid">
              <div className="family-copy">
                <article className="editorial-card family-values" data-reveal>
                  <h3>{c.family.introLabel}</h3>
                  <PlaceholderLine badge={c.contentNeeded}>{c.family.introValue}</PlaceholderLine>
                </article>
                <article className="shared-moments">
                  <h3>{c.family.momentsLabel}</h3>
                  <p>{c.family.momentsNote}</p>
                  <div className="shared-moment-list">
                    {c.family.prompts.map((prompt) => (
                      <div key={prompt}>
                        <strong>{prompt}</strong>
                        <span>{c.family.promptValue}</span>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
              <div className="family-photos" data-reveal>
                <PhotoPlaceholder label={c.family.photoOne} alt={c.family.photoAlt} />
                <PhotoPlaceholder label={c.family.photoTwo} alt={c.family.photoAlt} optional={c.optional} />
              </div>
            </div>
          </div>
        </section>

        <section id="timeline" className="section-pad warm-section print-section" aria-labelledby="timeline-title">
          <div className="page-grid">
            <header className="section-heading" data-reveal>
              <p className="eyebrow">{c.timeline.eyebrow}</p>
              <h2 id="timeline-title">{c.timeline.title}</h2>
              <p>{c.timeline.intro}</p>
            </header>
            <ol className="timeline-list">
              {[1, 2, 3, 4].map((moment) => (
                <li data-reveal key={moment}>
                  <div className="timeline-marker" aria-hidden="true" />
                  <div className="timeline-content">
                    <span className="timeline-kicker">{c.timeline.moment} {String(moment).padStart(2, "0")}</span>
                    <h3>{c.timeline.month}</h3>
                    <p>{c.timeline.value}</p>
                  </div>
                  <PhotoPlaceholder
                    label={c.timeline.photo}
                    alt={`${c.timeline.moment} ${moment}. ${c.timeline.photoAlt}`}
                    aspect="compact"
                    optional={c.optional}
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="closing" className="section-pad closing-section print-section" aria-labelledby="closing-title">
          <div className="page-grid closing-grid">
            <header data-reveal>
              <p className="eyebrow">{c.closing.eyebrow}</p>
              <h2 id="closing-title">{c.closing.title}</h2>
            </header>
            <div className="closing-notes">
              <article data-reveal>
                <h3>{c.closing.reflectionLabel}</h3>
                <PlaceholderLine badge={c.contentNeeded}>{c.closing.reflection}</PlaceholderLine>
              </article>
              <article data-reveal>
                <h3>{c.closing.hopesLabel}</h3>
                <PlaceholderLine badge={c.contentNeeded}>{c.closing.hopes}</PlaceholderLine>
              </article>
              <div className="button-row no-print">
                <a className="button secondary-button" href="#top">{c.closing.top}</a>
                <PrintButton label={c.print} accessibleLabel={c.printLabel} className="button primary-button" />
              </div>
            </div>
          </div>
        </section>

        <section id="privacy-notice" className="privacy-section print-section" aria-labelledby="privacy-title">
          <div className="page-grid privacy-inner">
            <div>
              <p className="eyebrow">{c.privacy.eyebrow}</p>
              <h2 id="privacy-title">{c.privacy.title}</h2>
            </div>
            <p>{c.privacy.body}</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-grid footer-grid">
          <div>
            <p className="footer-name">Oliver YEUNG <span aria-hidden="true">·</span> 楊昊熹</p>
            <p>{c.footer.review} <span aria-hidden="true">·</span> {c.footer.update}</p>
          </div>
          <div className="footer-actions no-print">
            <LanguageSwitch
              locale={locale}
              onChange={changeLocale}
              label={c.languageLabel}
              selectedLabel={c.selectedLanguage}
            />
            <a href="#privacy-notice">{c.privacy.link}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
