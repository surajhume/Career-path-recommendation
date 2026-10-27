# Career Path Explorer

Personalised career guidance in the browser. Tell it your qualification, interests and skills; it ranks matching careers, shows the skills you are missing, and gives you a step-by-step roadmap you can tick off, save and export as a PDF.

No build step, no dependencies, no server, and nothing leaves your browser.

## Features

| Area | What you get |
|---|---|
| **Personalised recommendations** | Careers ranked by a transparent score (skills 45%, interests 30%, qualification fit 25%) with per-dimension breakdowns and plain-English reasons. |
| **Skill-gap analysis** | For any career: skills you have, skills to learn ordered by importance (critical / important / nice-to-have), each with a "where to start" tip, plus a weighted coverage %. |
| **Learning roadmaps** | 3-5 stages per career with indicative timelines. A bridge stage is added automatically if your qualification is below what the career usually expects or from a different stream. Includes relevant exams and a Plan B. |
| **Progress tracking** | Tick off steps; per-stage and overall progress bars. |
| **Saved careers** | Save careers and see progress and your next step on the *My careers* tab. |
| **PDF export** | *Export PDF* opens the print dialog with a clean report (profile, top matches, skill gap, roadmap with checkmarks). Choose **Save as PDF**. |
| **Responsive & accessible** | Mobile-first layout, light/dark mode, keyboard-navigable tabs, labelled controls, visible focus, screen-reader announcements, reduced-motion support. |
| **Input validation** | Required/unknown values are rejected with inline, accessible error messages; corrupted stored data is ignored. |

## Run it

Open `index.html` directly, or serve the folder:

```bash
npm start            # python3 -m http.server 8080  ->  http://localhost:8080
```

## Test it

Requires Node 18+. No packages to install.

```bash
npm test
```

Covers data integrity (every career references real skills/interests), validation, scoring/ranking, skill-gap, roadmap building, progress maths and the storage layer (including blocked or corrupted storage).

## Project layout

```
index.html   page structure (3 tabs: Discover, Roadmap, My careers)
style.css    responsive styles, dark mode, print stylesheet for the PDF
data.js      all content: qualifications, interests, skills, career profiles, roadmaps
engine.js    pure logic: validation, scoring, ranking, skill gap, roadmap, progress
store.js     localStorage persistence with in-memory fallback
app.js       UI rendering and events (no innerHTML with data)
tests/       node:test suites for data, engine and store
```

`engine.js`, `store.js` and `data.js` work in both the browser and Node, which is what makes them testable without a DOM.

## How scoring works

For each career:

- **Skills** - share of the career's skills you have, weighted 3/2/1 (critical/important/nice-to-have).
- **Interests** - Dice overlap between your interests and the career's.
- **Qualification** - 65% level (your level vs. the usual minimum) + 35% stream match.

The final score is the weighted average, 0-100. If you give no skills or no interests, that dimension is left out and the remaining weights are renormalised. Ties sort alphabetically so results are deterministic. Weights live in `engine.js` (`WEIGHTS`).

## Extending the data

Add a career in `data.js`:

1. Add its name to `careerGoals`.
2. Add an entry in `careerProfiles` with `summary`, `minLevel`, `streams`, `interests`, `skills` (`{ id, weight }`), `exams`, optional `backup`, and `roadmap` stages (`{ title, weeks, tasks[] }`).
3. Reuse existing skill and interest ids, or add new ones to `skills` / `interests`.
4. Run `npm test`. The data-integrity tests fail with a clear message if anything is missing or mistyped.

Adding a qualification: add it to `qualifications` and give it a `level` and `stream` in `qualificationProfiles`.

## Privacy and storage

Your profile, saved careers and progress are kept in `localStorage` in your own browser under the `career-path-explorer:v1:` prefix. If storage is blocked (e.g. some private modes) the app still works for the session and shows a notice. *Clear all saved data* in the footer removes everything.

## Limitations

- Career data, timelines and skill lists are general guidance written for this project, not official or current requirements. Verify exams, eligibility and fees with official sources.
- Matching is rule-based, not machine-learned; it reflects the weights and data above.
- Content is India-oriented (exam names, qualifications) and English only.
