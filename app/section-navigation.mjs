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

  return (
    state.activeHref ||
    state.activeLinkHash ||
    (state.currentSectionId ? `#${state.currentSectionId}` : "") ||
    state.routeHash ||
    ""
  );
}
