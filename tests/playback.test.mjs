import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import vm from "node:vm";
import test from "node:test";

const source = await readFile(new URL("../app/YouTubeVideo.tsx", import.meta.url), "utf8");
const coordinator = stripTypeScriptTypes(source.slice(0, source.indexOf("function VideoSoundIcon"))
  .replace(/^import .* from "react";$/m, ""));

function fixture({ reduced = false, hidden = false } = {}) {
  const events = [];
  const context = vm.createContext({
    document: { visibilityState: hidden ? "hidden" : "visible" },
    window: { IntersectionObserver: true, matchMedia: () => ({ matches: reduced }), setTimeout: () => 1, clearTimeout() {}, sessionStorage: { setItem() {} } },
    navigator: {}, performance: { now: () => 1000 },
  });
  vm.runInContext(coordinator + `\nglobalThis.api = { playbackEntries, evaluatePlayback, requestManualPlayback, notifyPlaybackReady, notifyPlaybackPlaying, notifyUserPaused, notifyPlaybackEnded, notifyPlaybackUnavailable, ownsVisiblePlayback, pauseActivePlayback, owner: () => activePlaybackKey };`, context);
  const api = context.api;
  const add = (key, priority, ratio = 1) => {
    const entry = { key, priority, intersectionRatio: ratio, eligibleSince: 0, ended: false, suppressed: false, playing: false, activation: null,
      element: { getBoundingClientRect: () => ({ top: priority * 100 }) }, hasFocus: () => false,
      activate: manual => events.push([key, "activate", manual]), play: () => events.push([key, "play"]), pause: () => events.push([key, "pause"]), setSound() {} };
    api.playbackEntries.set(key, entry);
    return entry;
  };
  return { api, add, events, context };
}

test("plays visible stories in priority order and advances on completion", () => {
  const { api, add } = fixture();
  add("reading", 30); add("swimming", 40);
  api.evaluatePlayback(); assert.equal(api.owner(), "reading");
  api.notifyPlaybackPlaying("reading");
  api.notifyPlaybackEnded("reading"); api.evaluatePlayback();
  assert.equal(api.owner(), "swimming");
});

test("failed video releases the queue and a manual retry is allowed", () => {
  const { api, add } = fixture();
  const first = add("first", 10); add("second", 20);
  api.evaluatePlayback(); api.notifyPlaybackUnavailable("first"); api.evaluatePlayback();
  assert.equal(first.suppressed, true); assert.equal(api.owner(), "second");
  api.requestManualPlayback("first");
  assert.equal(first.suppressed, false); assert.equal(api.owner(), "first");
});

test("late ready, playing and paused events cannot reclaim offscreen playback", () => {
  const { api, add, events } = fixture();
  const old = add("old", 10); add("new", 20, 0);
  api.evaluatePlayback(); old.intersectionRatio = 0;
  api.playbackEntries.get("new").intersectionRatio = 1;
  api.evaluatePlayback(); assert.equal(api.owner(), "new");
  events.length = 0;
  api.notifyPlaybackReady("old");
  assert.equal(api.notifyPlaybackPlaying("old"), false);
  api.notifyUserPaused("old");
  assert.equal(api.owner(), "new");
  assert.equal(events.some(([key, action]) => key === "old" && action === "play"), false);
});

test("stale visible player cannot replace newer owner without a visitor action", () => {
  const { api, add } = fixture();
  const old = add("old", 10); add("new", 20);
  api.requestManualPlayback("new");
  api.notifyPlaybackReady("old"); api.notifyUserPaused("old");
  assert.equal(api.notifyPlaybackPlaying("old"), false); assert.equal(api.owner(), "new");
  old.hasFocus = () => true;
  assert.equal(api.notifyPlaybackPlaying("old"), true); assert.equal(api.owner(), "old");
});

test("hidden documents cannot restart from player readiness or autoplay fallback", () => {
  const { api, add, context } = fixture();
  add("first", 10); api.evaluatePlayback();
  context.document.visibilityState = "hidden";
  assert.equal(api.ownsVisiblePlayback("first"), false);
  api.notifyPlaybackReady("first");
  assert.equal(api.notifyPlaybackPlaying("first"), false);
  assert.equal(api.owner(), null);
});

test("reduced motion prevents autoplay but keeps an explicit play available", () => {
  const { api, add } = fixture({ reduced: true });
  const first = add("first", 10); api.evaluatePlayback(); assert.equal(api.owner(), null);
  api.requestManualPlayback("first"); api.evaluatePlayback();
  assert.equal(api.owner(), "first"); assert.equal(first.activation, "manual");
});

test("a visitor pause is retained until a deliberate play", () => {
  const { api, add } = fixture();
  const first = add("first", 10); api.evaluatePlayback(); api.notifyUserPaused("first"); api.evaluatePlayback();
  assert.equal(first.suppressed, true);
  first.intersectionRatio = 0; api.evaluatePlayback(); first.intersectionRatio = 1; api.evaluatePlayback();
  assert.equal(api.owner(), null);
  api.requestManualPlayback("first"); assert.equal(api.owner(), "first");
});
