import Script from "next/script";
import { renderAlbum } from "./render.mjs";

type AlbumProps = { initialLocale: "en" | "zh"; age: string | null };

export default function Album({ initialLocale, age }: AlbumProps) {
  return (
    <>
      <div id="album" dangerouslySetInnerHTML={{ __html: renderAlbum(initialLocale, age) }} />
      <Script src="/album/interactions.js" strategy="afterInteractive" />
    </>
  );
}
