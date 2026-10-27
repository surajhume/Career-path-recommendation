"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../data.js");

const skillIds = new Set(data.skills.map((s) => s.id));
const interestIds = new Set(data.interests.map((i) => i.id));

test("ids are unique", () => {
  assert.equal(skillIds.size, data.skills.length, "duplicate skill id");
  assert.equal(interestIds.size, data.interests.length, "duplicate interest id");
});

test("every qualification has a level/stream profile", () => {
  for (const q of data.qualifications) {
    const p = data.qualificationProfiles[q];
    assert.ok(p, `missing profile for "${q}"`);
    assert.equal(typeof p.level, "number");
    assert.ok(typeof p.stream === "string" && p.stream.length > 0);
  }
});

test("every career goal has a complete profile", () => {
  for (const goal of data.careerGoals) {
    const c = data.careerProfiles[goal];
    assert.ok(c, `missing profile for "${goal}"`);
    assert.ok(c.summary, `${goal}: summary`);
    assert.ok(c.minLevel >= 1 && c.minLevel <= 6, `${goal}: minLevel`);
    assert.ok(c.streams.length > 0, `${goal}: streams`);
    assert.ok(c.interests.length > 0, `${goal}: interests`);
    assert.ok(c.skills.length > 0, `${goal}: skills`);
    assert.ok(c.roadmap.length >= 3, `${goal}: roadmap stages`);
  }
});

test("career profiles only reference known skills, interests and backup plans", () => {
  for (const [name, c] of Object.entries(data.careerProfiles)) {
    assert.ok(data.careerGoals.includes(name), `${name} is not in careerGoals`);
    for (const id of c.interests) assert.ok(interestIds.has(id), `${name}: unknown interest ${id}`);
    for (const s of c.skills) {
      assert.ok(skillIds.has(s.id), `${name}: unknown skill ${s.id}`);
      assert.ok([1, 2, 3].includes(s.weight), `${name}: bad weight for ${s.id}`);
    }
    if (c.backup) assert.ok(data.backupPlans[c.backup], `${name}: unknown backup ${c.backup}`);
    const seen = new Set(c.skills.map((s) => s.id));
    assert.equal(seen.size, c.skills.length, `${name}: duplicate skill`);
  }
});

test("roadmap stages and tasks are non-empty and unique", () => {
  for (const [name, c] of Object.entries(data.careerProfiles)) {
    const titles = new Set();
    for (const stage of c.roadmap) {
      assert.ok(stage.title && stage.tasks.length > 0, `${name}: empty stage`);
      assert.ok(!titles.has(stage.title), `${name}: duplicate stage title ${stage.title}`);
      titles.add(stage.title);
      assert.equal(new Set(stage.tasks).size, stage.tasks.length, `${name}/${stage.title}: duplicate task`);
    }
  }
});

test("legacy data is still present", () => {
  assert.ok(data.careerPaths["12th Science"].length > 0);
  assert.ok(data.goalPaths["Data Scientist"].length > 0);
});
