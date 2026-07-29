/**
 * Choose the equivalent section for a language change.
 *
 * A section that is still scrolling takes priority. After that short grace
 * period, the settled active section wins over a transient reading-line
 * change caused while a fixed header control receives focus.
 *
 * @param {{
 *   nearTop: boolean;
 *   pendingSection?: string;
 *   currentSectionId?: string;
 *   activeHref?: string;
 *   activeLinkHash?: string;
 *   routeHash?: string;
 * }} state
 */
export function resolveLanguageSection(state) {
  if (state.pendingSection) return state.pendingSection;
  if (state.nearTop) return "";

  const currentSectionHash = state.currentSectionId
    ? `#${state.currentSectionId}`
    : "";

  // A hash that agrees with either the reading line or the settled navigation
  // state is the strongest evidence of the reader's intended section. This
  // avoids carrying a briefly stale scroll-observer value across languages
  // immediately after an anchor jump.
  if (
    state.routeHash &&
    [
      currentSectionHash,
      state.activeHref,
      state.activeLinkHash,
    ].includes(state.routeHash)
  ) {
    return state.routeHash;
  }

  return (
    currentSectionHash ||
    state.activeHref ||
    state.activeLinkHash ||
    state.routeHash ||
    ""
  );
}
