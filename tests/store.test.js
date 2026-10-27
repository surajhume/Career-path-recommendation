"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { createStore, PREFIX } = require("../store.js");

function fakeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    key: (i) => [...m.keys()][i] ?? null,
    get length() { return m.size; },
    _map: m,
  };
}

const throwing = () => ({
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
  key() { throw new Error("blocked"); },
  length: 0,
});

test("profile round-trips and rejects malformed shapes", () => {
  const s = createStore(fakeStorage());
  assert.equal(s.getProfile(), null);
  const p = { qualification: "PhD", interests: ["research"], skills: [], goal: "" };
  s.setProfile(p);
  assert.deepEqual(s.getProfile(), p);
  s.setProfile({ qualification: 1 }); // ignored
  assert.deepEqual(s.getProfile(), p);
  s.clearProfile();
  assert.equal(s.getProfile(), null);
});

test("toggleSaved adds, removes and reports state", () => {
  const s = createStore(fakeStorage());
  assert.equal(s.toggleSaved("Artist"), true);
  assert.equal(s.toggleSaved("Researcher"), true);
  assert.deepEqual(s.getSaved(), ["Artist", "Researcher"]);
  assert.equal(s.isSaved("Artist"), true);
  assert.equal(s.toggleSaved("Artist"), false);
  assert.deepEqual(s.getSaved(), ["Researcher"]);
});

test("task completion is stored per career and can be reset", () => {
  const s = createStore(fakeStorage());
  s.setTaskDone("Artist", "a", true);
  s.setTaskDone("Artist", "b", true);
  s.setTaskDone("Artist", "a", true); // idempotent
  s.setTaskDone("Researcher", "x", true);
  assert.deepEqual(s.getCompleted("Artist").sort(), ["a", "b"]);
  s.setTaskDone("Artist", "a", false);
  assert.deepEqual(s.getCompleted("Artist"), ["b"]);
  s.resetProgress("Artist");
  assert.deepEqual(s.getCompleted("Artist"), []);
  assert.deepEqual(s.getCompleted("Researcher"), ["x"]);
});

test("data persists across store instances sharing the same storage", () => {
  const storage = fakeStorage();
  createStore(storage).toggleSaved("Artist");
  assert.deepEqual(createStore(storage).getSaved(), ["Artist"]);
});

test("corrupted or wrongly-typed stored values fall back to defaults", () => {
  const storage = fakeStorage();
  storage.setItem(PREFIX + "saved", "{not json");
  storage.setItem(PREFIX + "profile", JSON.stringify({ qualification: 5 }));
  storage.setItem(PREFIX + "progress:Artist", JSON.stringify([1, 2]));
  const s = createStore(storage);
  assert.deepEqual(s.getSaved(), []);
  assert.equal(s.getProfile(), null);
  assert.deepEqual(s.getCompleted("Artist"), []);
});

test("falls back to memory when storage is missing or throws", () => {
  for (const backend of [null, undefined, throwing()]) {
    const s = createStore(backend);
    assert.equal(s.toggleSaved("Artist"), true);
    s.setTaskDone("Artist", "t", true);
    assert.deepEqual(s.getSaved(), ["Artist"]);
    assert.deepEqual(s.getCompleted("Artist"), ["t"]);
    assert.equal(s.persistent, false);
  }
});

test("clearAll removes only this app's keys, including unsaved careers' progress", () => {
  const storage = fakeStorage();
  storage.setItem("other-app", "keep");
  const s = createStore(storage);
  s.toggleSaved("Artist");
  s.setTaskDone("Researcher", "x", true); // not saved
  s.setProfile({ qualification: "PhD", interests: ["research"], skills: [], goal: "" });
  s.clearAll();
  assert.deepEqual(s.getSaved(), []);
  assert.deepEqual(s.getCompleted("Researcher"), []);
  assert.equal(s.getProfile(), null);
  assert.equal(storage.getItem("other-app"), "keep");
  assert.equal([...storage._map.keys()].filter((k) => k.startsWith(PREFIX)).length, 0);
});
