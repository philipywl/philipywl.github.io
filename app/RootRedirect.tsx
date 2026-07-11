const languageRedirect = `(() => {
  let language = "";
  try {
    language = window.localStorage.getItem("oliver-portfolio-language") || "";
  } catch {}

  if (language !== "en" && language !== "zh") {
    language = (window.navigator.language || "").toLowerCase().startsWith("zh")
      ? "zh"
      : "en";
  }

  const destination = language === "zh" ? "/zh-hant/" : "/en/";
  window.location.replace(destination + (window.location.hash || ""));
})();`;

export default function RootRedirect() {
  return (
    <main className="route-redirect route-redirect-immediate">
      <script dangerouslySetInnerHTML={{ __html: languageRedirect }} />
      <noscript>
        <nav className="route-language-fallback" aria-label="中文 | English">
          <a href="/zh-hant/" lang="zh-Hant-HK">中文</a>
          <span aria-hidden="true">|</span>
          <a href="/en/" lang="en-HK">English</a>
        </nav>
      </noscript>
    </main>
  );
}
