/**
 * Choose the equivalent section for a language change.
 *
 * A section that is still scrolling takes priority. After that short grace
 * period, the section at the reading line wins over a stale URL fragment.
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
    (state.currentSectionId ? `#${state.currentSectionId}` : "") ||
    state.activeHref ||
    state.activeLinkHash ||
    state.routeHash ||
    ""
  );
}
