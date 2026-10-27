/**
 * app.js - UI layer. All scoring/validation lives in engine.js, persistence in store.js.
 * No innerHTML is used with data: everything is built with textContent / createElement.
 */
(function () {
  "use strict";

  const E = CareerEngine;
  const D = CareerData;

  let store;
  try {
    store = CareerStore.createStore(window.localStorage);
  } catch (e) {
    store = CareerStore.createStore(null); // storage blocked: keep data in memory
  }

  const TOP_N = 5;
  const TABS = ["discover", "roadmap", "saved"];

  const state = {
    profile: null, // validated profile once the user has submitted the form
    matches: [], // ranked results
    career: "", // career shown on the Roadmap tab
    showAll: false,
    tab: "discover",
  };

  /* ------------------------------------------------------------ *
   * Small DOM helpers
   * ------------------------------------------------------------ */

  const $ = (id) => document.getElementById(id);

  function el(tag, props, ...kids) {
    const node = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v === null || v === undefined || v === false) continue;
        if (k === "class") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : String(v));
      }
    }
    for (const kid of kids.flat()) {
      if (kid === null || kid === undefined || kid === false) continue;
      node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return node;
  }

  function bar(percent, label, extraClass) {
    const fill = el("span");
    fill.style.width = `${percent}%`;
    return el(
      "div",
      {
        class: `bar ${extraClass || ""}`.trim(),
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": percent,
        "aria-label": label,
      },
      fill
    );
  }

  function setBar(node, percent) {
    node.setAttribute("aria-valuenow", percent);
    node.firstElementChild.style.width = `${percent}%`;
  }

  function announce(message) {
    const s = $("status");
    s.textContent = "";
    // Re-set on next tick so repeated identical messages are still announced.
    setTimeout(() => (s.textContent = message), 30);
  }

  function showNotice(message) {
    const n = $("notice");
    n.textContent = message || "";
    n.hidden = !message;
  }

  function interestLabel(id) {
    const i = D.interests.find((x) => x.id === id);
    return i ? i.label : id;
  }

  function skillLabel(id) {
    const s = E.getSkill(id);
    return s ? s.label : id;
  }

  const STATUS_TAG = {
    direct: { cls: "good", text: "Qualification fits" },
    switch: { cls: "warn", text: "Needs upskilling" },
    bridge: { cls: "bad", text: "Qualification gap" },
  };

  /* ------------------------------------------------------------ *
   * Form
   * ------------------------------------------------------------ */

  function populateSelect(select, options, placeholder) {
    select.replaceChildren(el("option", { value: "", text: placeholder }));
    options.forEach((opt) => select.append(el("option", { value: opt, text: opt })));
  }

  function chip(name, value, label) {
    return el(
      "label",
      { class: "chip" },
      el("input", { type: "checkbox", name, value, onchange: updateSkillCounts }),
      el("span", { text: label })
    );
  }

  function buildForm() {
    populateSelect($("currentQualification"), D.qualifications, "-- Select --");
    populateSelect($("endGoal"), D.careerGoals, "-- None yet --");

    $("interestChips").replaceChildren(...D.interests.map((i) => chip("interest", i.id, i.label)));

    const categories = [...new Set(D.skills.map((s) => s.category))];
    $("skillGroups").replaceChildren(
      ...categories.map((cat, idx) => {
        const items = D.skills.filter((s) => s.category === cat);
        return el(
          "details",
          { class: "skill-group", open: idx === 0, "data-category": cat },
          el("summary", null, cat, el("span", { class: "count-pill", hidden: true, "data-count": cat })),
          el("div", { class: "chips" }, items.map((s) => chip("skill", s.id, s.label)))
        );
      })
    );
  }

  function updateSkillCounts() {
    document.querySelectorAll("details.skill-group").forEach((d) => {
      const n = d.querySelectorAll("input:checked").length;
      const pill = d.querySelector(".count-pill");
      pill.textContent = `${n} selected`;
      pill.hidden = n === 0;
    });
  }

  function readForm() {
    const checked = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);
    return {
      qualification: $("currentQualification").value,
      interests: checked("interest"),
      skills: checked("skill"),
      goal: $("endGoal").value,
    };
  }

  function fillForm(profile) {
    $("currentQualification").value = profile.qualification;
    $("endGoal").value = profile.goal;
    document.querySelectorAll('input[name="interest"]').forEach((i) => (i.checked = profile.interests.includes(i.value)));
    document.querySelectorAll('input[name="skill"]').forEach((i) => (i.checked = profile.skills.includes(i.value)));
    updateSkillCounts();
  }

  function showErrors(errors) {
    const map = {
      qualification: $("currentQualification"),
      interests: $("interestsField"),
      skills: $("skillsField"),
      goal: $("endGoal"),
    };
    for (const [field, control] of Object.entries(map)) {
      const msg = $(`err-${field}`);
      const text = errors[field];
      msg.textContent = text || "";
      msg.hidden = !text;
      if (text) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    }
    const first = ["qualification", "interests", "skills", "goal"].find((f) => errors[f]);
    if (first) {
      const target = first === "interests" || first === "skills" ? map[first].querySelector("input") : map[first];
      if (target) target.focus();
      announce(errors[first]);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    const result = E.validateProfile(readForm());
    showErrors(result.errors);
    if (!result.valid) return;

    state.profile = result.value;
    store.setProfile(state.profile);
    state.matches = E.rankCareers(state.profile);
    state.career = state.profile.goal || state.matches[0].career;
    state.showAll = false;

    renderAll();
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
    announce(`Found ${state.matches.length} matches. Top match: ${state.matches[0].career}.`);
  }

  function onReset() {
    $("profileForm").reset();
    updateSkillCounts();
    showErrors({});
    state.profile = null;
    state.matches = [];
    state.career = "";
    store.clearProfile();
    renderAll();
    announce("Form cleared.");
  }

  /* ------------------------------------------------------------ *
   * Tabs
   * ------------------------------------------------------------ */

  function switchTab(name, options) {
    if (!TABS.includes(name)) name = "discover";
    state.tab = name;
    for (const t of TABS) {
      const selected = t === name;
      const btn = $(`tab-${t}`);
      btn.setAttribute("aria-selected", String(selected));
      btn.tabIndex = selected ? 0 : -1;
      $(`panel-${t}`).hidden = !selected;
    }
    if (name === "saved") renderSaved();
    if (name === "roadmap") renderRoadmap();
    try {
      history.replaceState(null, "", `#${name}`);
    } catch (e) {
      /* file:// or sandboxed: ignore */
    }
    if (options && options.focus) $(`tab-${name}`).focus();
  }

  function onTabKey(event) {
    const i = TABS.indexOf(state.tab);
    let next = null;
    if (event.key === "ArrowRight") next = TABS[(i + 1) % TABS.length];
    else if (event.key === "ArrowLeft") next = TABS[(i - 1 + TABS.length) % TABS.length];
    else if (event.key === "Home") next = TABS[0];
    else if (event.key === "End") next = TABS[TABS.length - 1];
    if (next) {
      event.preventDefault();
      switchTab(next, { focus: true });
    }
  }

  function openCareer(name) {
    state.career = name;
    switchTab("roadmap");
    window.scrollTo({ top: 0 });
    $("roadmapCareer").focus();
  }

  /* ------------------------------------------------------------ *
   * Save / progress actions
   * ------------------------------------------------------------ */

  function saveButton(career) {
    const saved = store.isSaved(career);
    return el("button", {
      type: "button",
      class: "btn btn-small",
      "aria-pressed": String(saved),
      "data-save": career,
      text: saved ? "★ Saved" : "☆ Save",
      "aria-label": `${saved ? "Remove" : "Save"} ${career}`,
      onclick: () => {
        const nowSaved = store.toggleSaved(career);
        announce(`${career} ${nowSaved ? "saved" : "removed from saved careers"}.`);
        renderAll();
        const again = document.querySelector(`#panel-${state.tab} [data-save="${CSS.escape(career)}"]`);
        if (again) again.focus();
      },
    });
  }

  function updateSavedBadge() {
    const n = store.getSaved().length;
    const badge = $("savedCount");
    badge.textContent = String(n);
    badge.hidden = n === 0;
  }

  /* ------------------------------------------------------------ *
   * Discover: results
   * ------------------------------------------------------------ */

  function matchCard(match, rank) {
    const career = D.careerProfiles[match.career];
    const tag = STATUS_TAG[match.qualification.status];
    const isGoal = state.profile && state.profile.goal === match.career;

    const rows = [
      ["Skills", match.breakdown.skills],
      ["Interests", match.breakdown.interests],
      ["Qualification", match.breakdown.qualification],
    ].map(([label, value]) =>
      el(
        "div",
        { class: "breakdown-row" },
        el("span", { text: label }),
        value === null ? el("span", { class: "meta", text: "not provided" }) : bar(value, `${label} match`),
        el("span", { text: value === null ? "–" : `${value}%` })
      )
    );

    return el(
      "article",
      { class: `match${isGoal ? " is-goal" : ""}`, "aria-label": `${match.career}, ${match.score}% match` },
      el(
        "div",
        { class: "match-top" },
        el("div", { class: "rank", "aria-hidden": "true", text: rank }),
        el(
          "div",
          null,
          el("h3", { class: "match-title" }, match.career, isGoal ? el("span", { class: "tag", text: "Your goal" }) : null),
          el("p", { class: "meta", text: career.summary }),
        ),
        el("div", { class: "score" }, el("strong", { text: `${match.score}%` }), el("small", { text: "match" }))
      ),
      el(
        "p",
        null,
        el("span", { class: `tag ${tag.cls}`, text: tag.text }),
        match.missingSkills.length === 0
          ? el("span", { class: "tag good", text: "All key skills" })
          : null
      ),
      el("ul", { class: "reasons" }, match.reasons.map((r) => el("li", { text: r }))),
      el("div", { class: "breakdown" }, rows),
      el(
        "div",
        { class: "match-actions" },
        el("button", {
          type: "button",
          class: "btn btn-primary btn-small",
          text: "View roadmap & skill gap",
          onclick: () => openCareer(match.career),
        }),
        saveButton(match.career)
      )
    );
  }

  function renderResults() {
    const section = $("results");
    if (!state.matches.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    const goal = state.profile.goal;
    const visible = state.matches
      .map((m, i) => ({ m, rank: i + 1 }))
      .filter(({ m, rank }) => state.showAll || rank <= TOP_N || m.career === goal);

    $("resultsHint").textContent = `Based on ${E.WEIGHTS.skills * 100}% skills, ${E.WEIGHTS.interests * 100}% interests and ${E.WEIGHTS.qualification * 100}% qualification fit. Matches are guidance, not guarantees.`;
    $("matchList").replaceChildren(...visible.map(({ m, rank }) => matchCard(m, rank)));

    const toggle = $("toggleAll");
    toggle.hidden = state.matches.length <= TOP_N;
    toggle.textContent = state.showAll ? "Show top matches only" : `Show all ${state.matches.length} careers`;

    const steps = E.nextSteps(state.profile.qualification);
    $("nextSteps").replaceChildren(
      el("h3", { text: `Common next steps from "${state.profile.qualification}"` }),
      steps.length
        ? el("ul", { class: "pill-list" }, steps.map((s) => el("li", { text: s })))
        : el("p", { class: "meta", text: "No general next steps listed for this qualification." })
    );
  }

  /* ------------------------------------------------------------ *
   * Roadmap tab
   * ------------------------------------------------------------ */

  function currentSkills() {
    return state.profile ? state.profile.skills : [];
  }

  function currentQualification() {
    return state.profile ? state.profile.qualification : "";
  }

  function skillItem(entry, have) {
    return el(
      "li",
      { class: `skill-item${have ? " have" : ""}` },
      el("strong", { text: entry.label }),
      have ? null : el("span", { class: `tag ${entry.weight === 3 ? "bad" : entry.weight === 2 ? "warn" : ""}`, text: entry.priority }),
      have ? null : el("small", { text: entry.learn })
    );
  }

  function renderSkillGap(career) {
    const gap = E.analyzeSkillGap(career, currentSkills());
    const noProfile = !state.profile;
    return el(
      "div",
      { class: "card" },
      el("h3", { text: "Skill-gap analysis" }),
      noProfile
        ? el("p", { class: "notice", text: "Select your skills on the Discover tab to see which of these you already have." })
        : el("div", { class: "progress-line" }, bar(gap.coverage, "Skill coverage", "good"), el("strong", { text: `${gap.coverage}%` })),
      el("p", { class: "meta", text: noProfile ? "Skills this career asks for:" : "Share of the skills this career asks for (weighted by importance)." }),
      el(
        "div",
        { class: "gap-grid" },
        el("div", null, el("h4", { text: `You have (${gap.have.length})` }),
          gap.have.length
            ? el("ul", { class: "skill-list" }, gap.have.map((e) => skillItem(e, true)))
            : el("p", { class: "meta", text: "None of the key skills yet; that is a fine place to start." })),
        el("div", null, el("h4", { text: `To learn (${gap.missing.length})` }),
          gap.missing.length
            ? el("ul", { class: "skill-list" }, gap.missing.map((e) => skillItem(e, false)))
            : el("p", { class: "meta", text: "You have every key skill listed for this career." }))
      )
    );
  }

  function taskRow(career, task) {
    const done = store.getCompleted(career).includes(task.id);
    return el(
      "li",
      null,
      el(
        "label",
        { class: `task${done ? " done" : ""}` },
        el("input", {
          type: "checkbox",
          checked: done,
          "data-task": task.id,
          onchange: (ev) => {
            store.setTaskDone(career, task.id, ev.target.checked);
            ev.target.closest(".task").classList.toggle("done", ev.target.checked);
            refreshProgress(career);
            renderSaved();
          },
        }),
        el("span", { text: task.text })
      )
    );
  }

  function refreshProgress(career) {
    const roadmap = E.buildRoadmap(career, currentQualification());
    const p = E.computeProgress(roadmap, store.getCompleted(career));
    const overall = document.querySelector("#roadmapBody [data-overall]");
    if (overall) {
      setBar(overall.querySelector(".bar"), p.percent);
      overall.querySelector("strong").textContent = `${p.percent}%`;
      overall.querySelector(".meta").textContent = `${p.done} of ${p.total} steps done`;
    }
    p.stages.forEach((s) => {
      const node = document.querySelector(`#roadmapBody [data-stage="${CSS.escape(s.id)}"]`);
      if (!node) return;
      node.classList.toggle("is-complete", s.total > 0 && s.done === s.total);
      node.querySelector("[data-stage-count]").textContent = `${s.done}/${s.total} done`;
    });
    if (p.percent === 100) announce(`Roadmap for ${career} complete. Well done!`);
  }

  function renderRoadmap() {
    const select = $("roadmapCareer");
    if (!select.options.length) populateSelect(select, D.careerGoals, "-- Choose a career --");
    select.value = state.career;

    const body = $("roadmapBody");
    if (!state.career) {
      body.replaceChildren(
        el("div", { class: "card empty" },
          el("p", { text: "Choose a career above to see its roadmap, or find your matches first." }),
          el("button", { type: "button", class: "btn btn-primary", text: "Go to Discover", onclick: () => switchTab("discover", { focus: true }) }))
      );
      return;
    }

    const career = state.career;
    const info = D.careerProfiles[career];
    const roadmap = E.buildRoadmap(career, currentQualification());
    const progress = E.computeProgress(roadmap, store.getCompleted(career));
    const weeks = roadmap.reduce((n, s) => n + s.weeks, 0);
    const match = state.matches.find((m) => m.career === career);

    const head = el(
      "div",
      { class: "card" },
      el(
        "div",
        { class: "career-head" },
        el("div", null,
          el("h2", null, career, match ? el("span", { class: "tag", text: `${match.score}% match` }) : null),
          el("p", { text: info.summary }),
          el("p", { class: "meta", text: weeks ? `Indicative timeline: about ${weeks} weeks of focused effort (${Math.round(weeks / 4.3)} months). Your pace will vary.` : "" })),
        el("div", { class: "match-actions" }, saveButton(career),
          el("button", { type: "button", class: "btn btn-small", text: "Export PDF", onclick: exportPdf }))
      ),
      el("div", { "data-overall": "" },
        el("div", { class: "progress-line" }, bar(progress.percent, "Roadmap progress", "good"), el("strong", { text: `${progress.percent}%` })),
        el("p", { class: "meta", text: `${progress.done} of ${progress.total} steps done` }))
    );

    const qualInfo = currentQualification() ? E.qualificationFit(currentQualification(), career) : null;
    const qualNote = qualInfo && qualInfo.status !== "direct"
      ? el("p", { class: `notice`, text: qualInfo.note })
      : null;

    const stages = el(
      "ol",
      { class: "stages" },
      roadmap.map((stage, i) => {
        const sp = progress.stages[i];
        return el(
          "li",
          { class: `stage${sp.total && sp.done === sp.total ? " is-complete" : ""}`, "data-stage": stage.id },
          el("div", { class: "stage-head" },
            el("h4", { text: stage.title }),
            el("span", { class: "meta" },
              stage.weeks ? `~${stage.weeks} weeks · ` : "",
              el("span", { "data-stage-count": "", text: `${sp.done}/${sp.total} done` }))),
          el("ul", { class: "tasks" }, stage.tasks.map((t) => taskRow(career, t)))
        );
      })
    );

    const extras = [];
    if (info.exams.length) {
      extras.push(el("div", { class: "card" }, el("h3", { text: "Exams & certifications to look at" }),
        el("ul", { class: "pill-list" }, info.exams.map((x) => el("li", { text: x })))));
    }
    if (info.backup && D.backupPlans[info.backup]) {
      extras.push(el("div", { class: "card" }, el("h3", { text: `Plan B: ${info.backup}` }),
        el("ul", { class: "reasons" }, D.backupPlans[info.backup].map((x) => el("li", { text: x })))));
    }

    body.replaceChildren(
      head,
      qualNote,
      renderSkillGap(career),
      el("h3", { text: "Your roadmap" }),
      stages,
      el("div", { class: "center" },
        el("button", {
          type: "button",
          class: "btn btn-small",
          text: "Reset progress for this career",
          onclick: () => {
            if (!window.confirm(`Reset your progress for ${career}?`)) return;
            store.resetProgress(career);
            renderRoadmap();
            renderSaved();
            announce("Progress reset.");
          },
        })),
      ...extras
    );
  }

  /* ------------------------------------------------------------ *
   * Saved careers tab
   * ------------------------------------------------------------ */

  function renderSaved() {
    updateSavedBadge();
    const body = $("savedBody");
    const saved = store.getSaved().filter((c) => D.careerProfiles[c]);

    if (!saved.length) {
      body.replaceChildren(
        el("div", { class: "card empty" },
          el("h2", { text: "No saved careers yet" }),
          el("p", { text: "Save careers you like from your matches and track your progress on each roadmap here." }),
          el("button", { type: "button", class: "btn btn-primary", text: "Find careers", onclick: () => switchTab("discover", { focus: true }) }))
      );
      return;
    }

    const cards = saved.map((career) => {
      const roadmap = E.buildRoadmap(career, currentQualification());
      const p = E.computeProgress(roadmap, store.getCompleted(career));
      const done = new Set(store.getCompleted(career));
      const next = roadmap.flatMap((s) => s.tasks).find((t) => !done.has(t.id));
      const match = state.matches.find((m) => m.career === career);

      return el(
        "article",
        { class: "saved-card" },
        el("h3", null, career, match ? el("span", { class: "tag", text: `${match.score}% match` }) : null),
        el("p", { class: "meta", text: D.careerProfiles[career].summary }),
        el("div", { class: "progress-line" }, bar(p.percent, `${career} progress`, "good"), el("strong", { text: `${p.percent}%` })),
        el("p", { class: "meta", text: next ? `Next step: ${next.text}` : "All steps complete – well done!" }),
        el("div", { class: "match-actions" },
          el("button", { type: "button", class: "btn btn-primary btn-small", text: "Open roadmap", onclick: () => openCareer(career) }),
          saveButton(career))
      );
    });

    const totals = saved.reduce(
      (acc, career) => {
        const p = E.computeProgress(E.buildRoadmap(career, currentQualification()), store.getCompleted(career));
        acc.done += p.done;
        acc.total += p.total;
        return acc;
      },
      { done: 0, total: 0 }
    );

    body.replaceChildren(
      el("div", { class: "section-head" },
        el("h2", { text: "My careers" }),
        el("p", { class: "hint", text: `${saved.length} saved · ${totals.done} of ${totals.total} roadmap steps done overall` })),
      el("div", { class: "saved-grid" }, cards)
    );
  }

  /* ------------------------------------------------------------ *
   * PDF export (browser print dialog -> "Save as PDF")
   * ------------------------------------------------------------ */

  function buildReport() {
    const report = el("div");
    const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    report.append(el("h1", { text: "Career Path Explorer – Personal career report" }), el("p", { class: "muted", text: `Generated ${today}` }));

    if (state.profile) {
      const p = state.profile;
      report.append(
        el("h2", { text: "Your profile" }),
        el("ul", null,
          el("li", { text: `Qualification: ${p.qualification}` }),
          el("li", { text: `Interests: ${p.interests.length ? p.interests.map(interestLabel).join(", ") : "none selected"}` }),
          el("li", { text: `Skills: ${p.skills.length ? p.skills.map(skillLabel).join(", ") : "none selected"}` }))
      );
    }

    if (state.matches.length) {
      report.append(
        el("h2", { text: `Top ${TOP_N} matches` }),
        el("table", null,
          el("thead", null, el("tr", null, ["#", "Career", "Match", "Qualification fit"].map((h) => el("th", { text: h })))),
          el("tbody", null, state.matches.slice(0, TOP_N).map((m, i) =>
            el("tr", null,
              el("td", { text: i + 1 }), el("td", { text: m.career }),
              el("td", { text: `${m.score}%` }), el("td", { text: STATUS_TAG[m.qualification.status].text })))))
      );
    }

    if (state.career) {
      const career = state.career;
      const info = D.careerProfiles[career];
      const roadmap = E.buildRoadmap(career, currentQualification());
      const done = new Set(store.getCompleted(career));
      const p = E.computeProgress(roadmap, done);
      const gap = E.analyzeSkillGap(career, currentSkills());

      report.append(
        el("h2", { text: `Focus career: ${career}` }),
        el("p", { text: info.summary }),
        el("p", null, el("strong", { text: `Roadmap progress: ${p.percent}% ` }), `(${p.done} of ${p.total} steps)`),
        el("h3", { text: `Skill gap (you cover ${gap.coverage}%)` })
      );
      if (state.profile) {
        report.append(
          el("p", { text: `Have: ${gap.have.length ? gap.have.map((s) => s.label).join(", ") : "none yet"}` }),
          gap.missing.length
            ? el("ul", null, gap.missing.map((s) => el("li", { text: `${s.label} (${s.priority}) – ${s.learn}` })))
            : el("p", { text: "You have every key skill listed for this career." })
        );
      } else {
        report.append(el("ul", null, gap.missing.map((s) => el("li", { text: `${s.label} (${s.priority})` }))));
      }

      report.append(el("h3", { text: "Roadmap" }));
      roadmap.forEach((stage, i) => {
        report.append(
          el("div", { class: "stage-block" },
            el("strong", { text: `Stage ${i + 1}: ${stage.title}${stage.weeks ? ` (~${stage.weeks} weeks)` : ""}` }),
            el("ul", { class: "check" }, stage.tasks.map((t) => el("li", { text: `${done.has(t.id) ? "☑" : "☐"} ${t.text}` }))))
        );
      });
      if (info.exams.length) report.append(el("h3", { text: "Exams & certifications" }), el("ul", null, info.exams.map((x) => el("li", { text: x }))));
    }

    report.append(el("p", { class: "small", text: "Guidance only. Requirements, exams and timelines change; verify with official sources." }));
    return report;
  }

  function exportPdf() {
    if (!state.profile && !state.career) {
      showNotice("Find your matches or choose a career first, then export your report.");
      switchTab("discover");
      return;
    }
    showNotice("");
    $("printReport").replaceChildren(buildReport());

    const originalTitle = document.title;
    const label = state.career ? `Career-report-${E.slugify(state.career)}` : "Career-report";
    document.title = label; // becomes the suggested PDF file name
    const restore = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  /* ------------------------------------------------------------ *
   * Misc
   * ------------------------------------------------------------ */

  function renderAll() {
    renderResults();
    renderRoadmap();
    renderSaved();
  }

  function onClearData() {
    if (!window.confirm("Delete your saved profile, saved careers and progress from this browser?")) return;
    store.clearAll();
    state.profile = null;
    state.matches = [];
    state.career = "";
    $("profileForm").reset();
    updateSkillCounts();
    showErrors({});
    renderAll();
    announce("All saved data cleared.");
  }

  function restore() {
    const saved = store.getProfile();
    if (!saved) return;
    // Re-validate: the data set may have changed since it was stored.
    const result = E.validateProfile(saved);
    if (!result.valid) return;
    fillForm(result.value);
    state.profile = result.value;
    state.matches = E.rankCareers(state.profile);
    state.career = state.profile.goal || state.matches[0].career;
  }

  function init() {
    buildForm();
    restore();

    $("profileForm").addEventListener("submit", onSubmit);
    $("resetForm").addEventListener("click", onReset);
    $("exportBtn").addEventListener("click", exportPdf);
    $("clearData").addEventListener("click", onClearData);
    $("toggleAll").addEventListener("click", () => {
      state.showAll = !state.showAll;
      renderResults();
    });
    $("roadmapCareer").addEventListener("change", (ev) => {
      state.career = ev.target.value;
      renderRoadmap();
    });
    TABS.forEach((t) => {
      $(`tab-${t}`).addEventListener("click", () => switchTab(t));
      $(`tab-${t}`).addEventListener("keydown", onTabKey);
    });

    if (!store.persistent) {
      showNotice("Your browser is blocking local storage, so saved careers and progress will be lost when you close this page.");
    }

    renderAll();
    const fromHash = location.hash.replace("#", "");
    switchTab(TABS.includes(fromHash) ? fromHash : "discover");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
