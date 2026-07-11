"use client";

import { useEffect } from "react";

export default function RootRedirect() {
  useEffect(() => {
    let destination = "/en/";
    try {
      if (window.localStorage.getItem("oliver-portfolio-language") === "zh") {
        destination = "/zh-hant/";
      }
    } catch {
      // English is the safe fallback when local preferences are unavailable.
    }
    window.location.replace(destination);
  }, []);

  return (
    <main className="route-redirect" aria-live="polite">
      <p>Opening Oliver&apos;s portfolio…</p>
      <noscript>
        <p>
          <a href="/en/">Continue in English</a>
          {" · "}
          <a href="/zh-hant/">以中文繼續</a>
        </p>
      </noscript>
    </main>
  );
}
