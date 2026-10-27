/**
 * engine.js - pure recommendation logic (no DOM, no storage).
 *
 * Works in the browser (exposes `CareerEngine`) and in Node (`require`),
 * which is what makes it unit-testable.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(require("./data.js"));
  } else {
    root.CareerEngine = factory(CareerData); // CareerData is a global from data.js
  }
})(typeof self !== "undefined" ? self : this, function (data) {
  "use strict";

  /** Relative weight of each scoring dimension (renormalised if one is unused). */
  const WEIGHTS = Object.freeze({ skills: 0.45, interests: 0.3, qualification: 0.25 });

  /** Blend inside the qualification score. */
  const QUAL_LEVEL_SHARE = 0.65;

  const LEVEL_LABELS = [
    [6, "a doctorate"],
    [5, "a post-graduate degree"],
    [4, "a graduate degree"],
    [3, "12th / diploma level"],
    [2, "10th pass"],
    [1, "8th pass"],
  ];

  const skillById = new Map(data.skills.map((s) => [s.id, s]));
  const interestById = new Map(data.interests.map((i) => [i.id, i]));

  /* ---------------------------------------------------------------- *
   * Helpers
   * ---------------------------------------------------------------- */

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  function levelLabel(level) {
    for (const [min, label] of LEVEL_LABELS) {
      if (level >= min) return label;
    }
    return "no formal qualification";
  }

  function getSkill(id) {
    return skillById.get(id) || null;
  }

  function getCareer(name) {
    return Object.prototype.hasOwnProperty.call(data.careerProfiles, name)
      ? data.careerProfiles[name]
      : null;
  }

  function getQualification(name) {
    return Object.prototype.hasOwnProperty.call(data.qualificationProfiles, name)
      ? data.qualificationProfiles[name]
      : null;
  }

  function uniqueStrings(list) {
    if (!Array.isArray(list)) return [];
    return [...new Set(list.filter((x) => typeof x === "string").map((x) => x.trim()).filter(Boolean))];
  }

  /* ---------------------------------------------------------------- *
   * Validation
   * ---------------------------------------------------------------- */

  /**
   * Validate and normalise raw form input.
   *
   * @param {{qualification?:string, interests?:string[], skills?:string[], goal?:string}} input
   * @returns {{valid:boolean, errors:Object<string,string>, value:{qualification:string, interests:string[], skills:string[], goal:string}}}
   */
  function validateProfile(input) {
    const raw = input && typeof input === "object" ? input : {};
    const errors = {};

    const qualification = typeof raw.qualification === "string" ? raw.qualification.trim() : "";
    const goal = typeof raw.goal === "string" ? raw.goal.trim() : "";
    const interests = uniqueStrings(raw.interests);
    const skills = uniqueStrings(raw.skills);

    if (!qualification) {
      errors.qualification = "Please choose your current qualification.";
    } else if (!getQualification(qualification)) {
      errors.qualification = "That qualification is not recognised.";
    }

    const badInterests = interests.filter((id) => !interestById.has(id));
    if (badInterests.length) {
      errors.interests = `Unknown interest: ${badInterests.join(", ")}.`;
    }

    const badSkills = skills.filter((id) => !skillById.has(id));
    if (badSkills.length) {
      errors.skills = `Unknown skill: ${badSkills.join(", ")}.`;
    }

    if (!errors.interests && !errors.skills && interests.length === 0 && skills.length === 0) {
      errors.interests = "Pick at least one interest or one skill so we can personalise your matches.";
    }

    if (goal && !getCareer(goal)) {
      errors.goal = "That career is not recognised.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
      value: { qualification, interests, skills, goal },
    };
  }

  /* ---------------------------------------------------------------- *
   * Qualification fit
   * ---------------------------------------------------------------- */

  /**
   * How well a qualification fits a career.
   *
   * status:
   *  - "direct"  level and stream both fit
   *  - "switch"  level fits, but the stream is not the usual one (needs upskilling)
   *  - "bridge"  qualification level is below what the career usually expects
   *
   * @returns {{score:number, status:"direct"|"switch"|"bridge", note:string}}
   */
  function qualificationFit(qualification, careerName) {
    const q = getQualification(qualification);
    const career = getCareer(careerName);
    if (!q || !career) {
      return { score: 0, status: "bridge", note: "Unknown qualification or career." };
    }

    const levelScore = Math.min(1, q.level / career.minLevel);
    const streamOk = career.streams.includes("any") || career.streams.includes(q.stream);
    const streamScore = streamOk ? 1 : q.stream === "any" ? 0.7 : 0.5;
    const score = QUAL_LEVEL_SHARE * levelScore + (1 - QUAL_LEVEL_SHARE) * streamScore;

    if (q.level < career.minLevel) {
      return {
        score,
        status: "bridge",
        note: `This career usually expects ${levelLabel(career.minLevel)}; you are currently at "${qualification}".`,
      };
    }
    if (!streamOk) {
      return {
        score,
        status: "switch",
        note: `Your background is outside the usual stream, so plan for extra upskilling.`,
      };
    }
    return { score, status: "direct", note: "Your qualification fits this career well." };
  }

  /* ---------------------------------------------------------------- *
   * Scoring and ranking
   * ---------------------------------------------------------------- */

  function skillCoverage(careerName, ownedSkillIds) {
    const career = getCareer(careerName);
    const owned = new Set(ownedSkillIds);
    let total = 0;
    let have = 0;
    for (const s of career.skills) {
      total += s.weight;
      if (owned.has(s.id)) have += s.weight;
    }
    return total === 0 ? 0 : have / total;
  }

  /** Dice coefficient between the user's interests and the career's. */
  function interestOverlap(careerName, interestIds) {
    const career = getCareer(careerName);
    const mine = new Set(interestIds);
    const matched = career.interests.filter((id) => mine.has(id));
    const denom = career.interests.length + mine.size;
    return { score: denom === 0 ? 0 : (2 * matched.length) / denom, matched };
  }

  /**
   * Score one career for a (validated) profile.
   * @returns {{career:string, score:number, breakdown:{skills:number|null, interests:number|null, qualification:number}, matchedInterests:string[], matchedSkills:string[], missingSkills:string[], qualification:{status:string, note:string}, reasons:string[]}}
   */
  function scoreCareer(profile, careerName) {
    const career = getCareer(careerName);
    if (!career) throw new Error(`Unknown career: ${careerName}`);

    const hasSkills = profile.skills.length > 0;
    const hasInterests = profile.interests.length > 0;

    const skillScore = hasSkills ? skillCoverage(careerName, profile.skills) : null;
    const interest = hasInterests ? interestOverlap(careerName, profile.interests) : null;
    const qual = qualificationFit(profile.qualification, careerName);

    const parts = [{ w: WEIGHTS.qualification, v: qual.score }];
    if (skillScore !== null) parts.push({ w: WEIGHTS.skills, v: skillScore });
    if (interest) parts.push({ w: WEIGHTS.interests, v: interest.score });
    const wTotal = parts.reduce((a, p) => a + p.w, 0);
    const score = Math.round((parts.reduce((a, p) => a + p.w * p.v, 0) / wTotal) * 100);

    const owned = new Set(profile.skills);
    const matchedSkills = career.skills.filter((s) => owned.has(s.id)).map((s) => s.id);
    const missingSkills = career.skills.filter((s) => !owned.has(s.id)).map((s) => s.id);

    const reasons = [];
    if (interest && interest.matched.length) {
      reasons.push(`Matches your interest in ${interest.matched.map((id) => interestById.get(id).label.toLowerCase()).join(" and ")}.`);
    }
    if (matchedSkills.length) {
      reasons.push(`You already have ${matchedSkills.length} of ${career.skills.length} key skills.`);
    }
    reasons.push(qual.note);

    return {
      career: careerName,
      score,
      breakdown: {
        skills: skillScore === null ? null : Math.round(skillScore * 100),
        interests: interest ? Math.round(interest.score * 100) : null,
        qualification: Math.round(qual.score * 100),
      },
      matchedInterests: interest ? interest.matched : [],
      matchedSkills,
      missingSkills,
      qualification: { status: qual.status, note: qual.note },
      reasons,
    };
  }

  /**
   * Rank every career for a validated profile (best first).
   * Ties are broken alphabetically so output is deterministic.
   *
   * @param {{qualification:string, interests:string[], skills:string[]}} profile validated profile
   * @param {{limit?:number}} [options]
   */
  function rankCareers(profile, options) {
    const limit = options && Number.isInteger(options.limit) && options.limit > 0 ? options.limit : Infinity;
    return data.careerGoals
      .filter((name) => getCareer(name))
      .map((name) => scoreCareer(profile, name))
      .sort((a, b) => b.score - a.score || a.career.localeCompare(b.career))
      .slice(0, limit);
  }

  /* ---------------------------------------------------------------- *
   * Skill-gap analysis
   * ---------------------------------------------------------------- */

  const PRIORITY = { 3: "critical", 2: "important", 1: "nice-to-have" };

  /**
   * Compare the user's skills with what a career needs.
   *
   * @returns {{career:string, coverage:number, have:Array, missing:Array}}
   *   Each entry is { id, label, category, weight, priority, learn }.
   *   `missing` is sorted most important first.
   */
  function analyzeSkillGap(careerName, ownedSkillIds) {
    const career = getCareer(careerName);
    if (!career) throw new Error(`Unknown career: ${careerName}`);
    const owned = new Set(ownedSkillIds || []);

    const entries = career.skills.map((s) => {
      const meta = skillById.get(s.id);
      return {
        id: s.id,
        label: meta.label,
        category: meta.category,
        learn: meta.learn,
        weight: s.weight,
        priority: PRIORITY[s.weight] || "nice-to-have",
      };
    });

    const have = entries.filter((e) => owned.has(e.id));
    const missing = entries
      .filter((e) => !owned.has(e.id))
      .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label));

    return {
      career: careerName,
      coverage: Math.round(skillCoverage(careerName, [...owned]) * 100),
      have,
      missing,
    };
  }

  /* ---------------------------------------------------------------- *
   * Roadmap + progress
   * ---------------------------------------------------------------- */

  /**
   * Build a roadmap for a career, tailored to the user's qualification.
   * A leading "bridge" stage is added when the qualification does not yet fit.
   *
   * @returns {Array<{id:string, title:string, weeks:number, tasks:Array<{id:string, text:string}>}>}
   */
  function buildRoadmap(careerName, qualification) {
    const career = getCareer(careerName);
    if (!career) throw new Error(`Unknown career: ${careerName}`);

    const stages = [];
    const fit = qualification ? qualificationFit(qualification, careerName) : null;

    if (fit && fit.status === "bridge") {
      stages.push({
        title: "Close the qualification gap",
        weeks: 0,
        tasks: [
          `Reach ${levelLabel(career.minLevel)} (you are at "${qualification}")`,
          "Explore flexible routes such as NIOS, IGNOU or SWAYAM if you need to study alongside work",
        ],
      });
    } else if (fit && fit.status === "switch") {
      stages.push({
        title: "Bridge your background",
        weeks: 8,
        tasks: [
          "Take foundation courses in the core subjects this career relies on",
          "Complete one small project that shows you can work outside your original stream",
        ],
      });
    }

    for (const stage of career.roadmap) stages.push(stage);

    return stages.map((stage) => {
      const stageSlug = slugify(stage.title);
      return {
        id: stageSlug,
        title: stage.title,
        weeks: stage.weeks,
        tasks: stage.tasks.map((text) => ({ id: `${stageSlug}:${slugify(text)}`, text })),
      };
    });
  }

  /**
   * Compute completion for a roadmap.
   * Only ids that exist in the roadmap are counted, so stale saved ids are ignored.
   *
   * @param {ReturnType<typeof buildRoadmap>} roadmap
   * @param {Iterable<string>} completedIds
   * @returns {{done:number, total:number, percent:number, stages:Array<{id:string, done:number, total:number, percent:number}>}}
   */
  function computeProgress(roadmap, completedIds) {
    const completed = new Set(completedIds || []);
    let done = 0;
    let total = 0;
    const stages = roadmap.map((stage) => {
      const stageDone = stage.tasks.filter((t) => completed.has(t.id)).length;
      done += stageDone;
      total += stage.tasks.length;
      return {
        id: stage.id,
        done: stageDone,
        total: stage.tasks.length,
        percent: stage.tasks.length ? Math.round((stageDone / stage.tasks.length) * 100) : 0,
      };
    });
    return { done, total, percent: total ? Math.round((done / total) * 100) : 0, stages };
  }

  /** The original "paths from your qualification" list, kept for the UI. */
  function nextSteps(qualification) {
    return Object.prototype.hasOwnProperty.call(data.careerPaths, qualification)
      ? data.careerPaths[qualification].slice()
      : [];
  }

  return {
    WEIGHTS,
    slugify,
    levelLabel,
    getSkill,
    getCareer,
    validateProfile,
    qualificationFit,
    scoreCareer,
    rankCareers,
    analyzeSkillGap,
    buildRoadmap,
    computeProgress,
    nextSteps,
  };
});
