"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../engine.js");
const data = require("../data.js");

const valid = (input) => {
  const r = E.validateProfile(input);
  assert.ok(r.valid, JSON.stringify(r.errors));
  return r.value;
};

/* ---------------- validation ---------------- */

test("validateProfile: accepts a good profile and normalises it", () => {
  const r = E.validateProfile({
    qualification: "  Graduation - Science ",
    interests: ["tech", "tech", " data "],
    skills: ["python", "python"],
    goal: "",
  });
  assert.equal(r.valid, true);
  assert.deepEqual(r.value, {
    qualification: "Graduation - Science",
    interests: ["tech", "data"],
    skills: ["python"],
    goal: "",
  });
});

test("validateProfile: qualification is required", () => {
  const r = E.validateProfile({ interests: ["tech"] });
  assert.equal(r.valid, false);
  assert.match(r.errors.qualification, /choose/i);
});

test("validateProfile: rejects unknown qualification, interest, skill and goal", () => {
  const r = E.validateProfile({
    qualification: "Wizard School",
    interests: ["nonsense"],
    skills: ["telepathy"],
    goal: "Dragon Tamer",
  });
  assert.equal(r.valid, false);
  assert.ok(r.errors.qualification);
  assert.ok(r.errors.interests);
  assert.ok(r.errors.skills);
  assert.ok(r.errors.goal);
});

test("validateProfile: needs at least one interest or skill", () => {
  const r = E.validateProfile({ qualification: "10th Pass", interests: [], skills: [] });
  assert.equal(r.valid, false);
  assert.ok(r.errors.interests);
  // One of either is enough.
  assert.equal(E.validateProfile({ qualification: "10th Pass", skills: ["fitness"] }).valid, true);
});

test("validateProfile: survives junk input without throwing", () => {
  for (const junk of [null, undefined, 42, "str", [], { qualification: 5, interests: "tech", skills: {} }]) {
    const r = E.validateProfile(junk);
    assert.equal(r.valid, false);
  }
});

test("validateProfile: does not treat Object.prototype keys as careers", () => {
  const r = E.validateProfile({ qualification: "PhD", interests: ["tech"], goal: "constructor" });
  assert.ok(r.errors.goal);
  const q = E.validateProfile({ qualification: "toString", interests: ["tech"] });
  assert.ok(q.errors.qualification);
});

/* ---------------- qualification fit ---------------- */

test("qualificationFit: direct, switch and bridge", () => {
  assert.equal(E.qualificationFit("Graduation - Science", "Data Scientist").status, "direct");
  assert.equal(E.qualificationFit("Graduation - Arts", "Data Scientist").status, "switch");
  assert.equal(E.qualificationFit("10th Pass", "Data Scientist").status, "bridge");
});

test("qualificationFit: higher level never scores lower within the same stream", () => {
  const ug = E.qualificationFit("Graduation - Science", "Researcher").score;
  const pg = E.qualificationFit("Post Graduation - Science", "Researcher").score;
  assert.ok(pg > ug);
});

test("qualificationFit: unknown inputs are handled", () => {
  assert.equal(E.qualificationFit("nope", "Artist").score, 0);
});

/* ---------------- ranking ---------------- */

test("rankCareers: returns every career sorted by score, descending", () => {
  const p = valid({ qualification: "Graduation - Science", interests: ["tech"], skills: ["python"] });
  const ranked = E.rankCareers(p);
  assert.equal(ranked.length, data.careerGoals.length);
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1].score >= ranked[i].score);
  }
  ranked.forEach((r) => assert.ok(r.score >= 0 && r.score <= 100));
});

test("rankCareers: a tech profile ranks tech careers above unrelated ones", () => {
  const p = valid({
    qualification: "Graduation - Science",
    interests: ["tech", "data"],
    skills: ["programming", "dsa", "problem_solving", "web", "git", "databases"],
  });
  const ranked = E.rankCareers(p).map((r) => r.career);
  assert.equal(ranked[0], "Software Developer");
  assert.ok(ranked.indexOf("Software Developer") < ranked.indexOf("Artist"));
  assert.ok(ranked.indexOf("Software Developer") < ranked.indexOf("Sports Professional"));
});

test("rankCareers: finance profile puts finance careers first", () => {
  const p = valid({
    qualification: "Graduation - Commerce",
    interests: ["finance", "business"],
    skills: ["finance", "excel", "quant"],
  });
  const top2 = E.rankCareers(p, { limit: 2 }).map((r) => r.career);
  assert.ok(top2.includes("Financial Analyst"));
});

test("rankCareers: limit option and deterministic ordering", () => {
  const p = valid({ qualification: "12th Arts", interests: ["creative"] });
  assert.equal(E.rankCareers(p, { limit: 3 }).length, 3);
  assert.equal(E.rankCareers(p, { limit: 0 }).length, data.careerGoals.length);
  assert.deepEqual(E.rankCareers(p), E.rankCareers(p));
});

test("scoreCareer: qualification level matters (10th pass vs graduate)", () => {
  const base = { interests: ["data", "tech", "research"], skills: ["python", "statistics"] };
  const grad = E.scoreCareer({ ...base, qualification: "Graduation - Science" }, "Data Scientist");
  const tenth = E.scoreCareer({ ...base, qualification: "10th Pass" }, "Data Scientist");
  assert.ok(grad.score > tenth.score);
  assert.equal(tenth.qualification.status, "bridge");
});

test("scoreCareer: breakdown is null for unused dimensions and weights renormalise", () => {
  const onlyInterest = E.scoreCareer(
    { qualification: "Graduation - Science", interests: ["tech", "data"], skills: [] },
    "Software Developer"
  );
  assert.equal(onlyInterest.breakdown.skills, null);
  assert.ok(onlyInterest.breakdown.interests > 0);
  assert.ok(onlyInterest.score <= 100);

  // A perfect score is reachable when every dimension is maxed out.
  const career = data.careerProfiles["Software Developer"];
  const perfect = E.scoreCareer(
    {
      qualification: "Diploma - Engineering",
      interests: career.interests,
      skills: career.skills.map((s) => s.id),
    },
    "Software Developer"
  );
  assert.equal(perfect.score, 100);
  assert.deepEqual(perfect.missingSkills, []);
});

test("scoreCareer: throws on unknown careers", () => {
  assert.throws(() => E.scoreCareer({ qualification: "PhD", interests: ["tech"], skills: [] }, "Nope"));
});

test("scoreCareer: reasons mention matched interests and skills", () => {
  const r = E.scoreCareer(
    { qualification: "Graduation - Science", interests: ["security"], skills: ["networking"] },
    "Cybersecurity Specialist"
  );
  assert.ok(r.reasons.some((x) => /security/i.test(x)));
  assert.ok(r.reasons.some((x) => /1 of \d+ key skills/.test(x)));
});

/* ---------------- skill gap ---------------- */

test("analyzeSkillGap: splits have/missing and orders missing by importance", () => {
  const gap = E.analyzeSkillGap("Software Developer", ["programming", "git"]);
  assert.deepEqual(gap.have.map((s) => s.id).sort(), ["git", "programming"]);
  const weights = gap.missing.map((s) => s.weight);
  assert.deepEqual(weights, [...weights].sort((a, b) => b - a));
  assert.equal(gap.have.length + gap.missing.length, data.careerProfiles["Software Developer"].skills.length);
  assert.ok(gap.missing.every((s) => s.learn && s.label && s.priority));
});

test("analyzeSkillGap: coverage is weighted and bounded", () => {
  assert.equal(E.analyzeSkillGap("Artist", []).coverage, 0);
  const all = data.careerProfiles["Artist"].skills.map((s) => s.id);
  assert.equal(E.analyzeSkillGap("Artist", all).coverage, 100);
  // creativity is weight 3 of total 7 for Artist.
  assert.equal(E.analyzeSkillGap("Artist", ["creativity"]).coverage, Math.round((3 / 7) * 100));
});

test("analyzeSkillGap: ignores skills the career does not need; throws on unknown career", () => {
  assert.equal(E.analyzeSkillGap("Artist", ["blockchain"]).have.length, 0);
  assert.throws(() => E.analyzeSkillGap("Nope", []));
});

/* ---------------- roadmap and progress ---------------- */

test("buildRoadmap: adds a bridge stage when the qualification is too low", () => {
  const road = E.buildRoadmap("Data Scientist", "10th Pass");
  assert.equal(road[0].title, "Close the qualification gap");
  assert.equal(road.length, data.careerProfiles["Data Scientist"].roadmap.length + 1);
});

test("buildRoadmap: adds a different stage for cross-stream switches, none for direct fits", () => {
  assert.equal(E.buildRoadmap("Data Scientist", "Graduation - Arts")[0].title, "Bridge your background");
  const direct = E.buildRoadmap("Data Scientist", "Graduation - Science");
  assert.equal(direct.length, data.careerProfiles["Data Scientist"].roadmap.length);
});

test("buildRoadmap: ids are unique and stable across calls", () => {
  const a = E.buildRoadmap("Software Developer", "12th Science");
  const b = E.buildRoadmap("Software Developer", "12th Science");
  const ids = a.flatMap((s) => s.tasks.map((t) => t.id));
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(a, b);
});

test("buildRoadmap: works without a qualification and for every career", () => {
  for (const goal of data.careerGoals) {
    const road = E.buildRoadmap(goal);
    assert.ok(road.length >= 3);
    const ids = road.flatMap((s) => s.tasks.map((t) => t.id));
    assert.equal(new Set(ids).size, ids.length, `${goal}: task id clash`);
  }
  assert.throws(() => E.buildRoadmap("Nope", "PhD"));
});

test("computeProgress: counts completed tasks overall and per stage", () => {
  const road = E.buildRoadmap("Software Developer", "Graduation - Science");
  const total = road.reduce((n, s) => n + s.tasks.length, 0);

  const none = E.computeProgress(road, []);
  assert.deepEqual([none.done, none.total, none.percent], [0, total, 0]);

  const firstStage = road[0].tasks.map((t) => t.id);
  const some = E.computeProgress(road, firstStage);
  assert.equal(some.done, firstStage.length);
  assert.equal(some.stages[0].percent, 100);
  assert.equal(some.stages[1].percent, 0);

  const all = E.computeProgress(road, road.flatMap((s) => s.tasks.map((t) => t.id)));
  assert.equal(all.percent, 100);
});

test("computeProgress: ignores stale ids and handles empty input", () => {
  const road = E.buildRoadmap("Artist", "10th Pass");
  assert.equal(E.computeProgress(road, ["gone:forever"]).done, 0);
  assert.equal(E.computeProgress(road).percent, 0);
  assert.deepEqual(E.computeProgress([], []), { done: 0, total: 0, percent: 0, stages: [] });
});

/* ---------------- misc ---------------- */

test("nextSteps returns a copy of the legacy qualification paths", () => {
  const steps = E.nextSteps("12th Commerce");
  assert.deepEqual(steps, data.careerPaths["12th Commerce"]);
  steps.push("mutation");
  assert.ok(!data.careerPaths["12th Commerce"].includes("mutation"));
  assert.deepEqual(E.nextSteps("unknown"), []);
  assert.deepEqual(E.nextSteps("constructor"), []);
});

test("slugify and levelLabel", () => {
  assert.equal(E.slugify("  Hello, World! "), "hello-world");
  assert.equal(E.levelLabel(4), "a graduate degree");
  assert.equal(E.levelLabel(3.5), "12th / diploma level");
  assert.equal(E.levelLabel(0), "no formal qualification");
});
