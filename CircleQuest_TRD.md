# Technical Requirements Document (TRD)
## CircleQuest — Area of Circles (Primary 6, Singapore MOE-Aligned)

**Companion document:** `CircleQuest_PRD.md`
**Reference codebase (architecture source of truth):** `G2-Money-Money-main` (MoneyQuest)
**Reference audio pipeline spec:** `audio_generation_pipeline.md`
**Suggested repo name:** `circle-area-main` (or `G6-Circle-Area-main`, matching the delivered zip's naming convention)

This document specifies exactly how to build CircleQuest by cloning the reference architecture, replacing topic-specific content, and implementing the two explicitly-requested enhancements (6-panel Story, redesigned interactive Simulate phase). Follow this TRD as the **surgical build spec** — touch only the files listed as "New" or "Modified"; every file listed as "Reused as-is" should be copied verbatim.

---

## 1. Reference Module Analysis — Findings & Build Notes

Before specifying the new module, three findings from the reference codebase must inform the build:

1. **The reference repo contains two parallel implementations.** `src/components/phases/*` + `src/components/simulations/*` + `src/hooks/useAudio.js` is the **active, wired-in architecture** (confirmed via `App.jsx` imports). A second, unused/orphaned set of files exists under `src/features/*` (`WonderPhase.jsx`, `StoryPhase.jsx`, `SimulatePhase.jsx`, `PlayPhase.jsx`, `ReflectPhase.jsx`, and duplicate simulation components) that is **not imported anywhere and is dead code**. **CircleQuest must be built from the `src/components/*` pattern only — do not replicate the `src/features/*` folder.** This keeps the delivered codebase clean and avoids shipping confusing duplicate logic.
2. **Hardcoded 4-panel assumption.** The reference's `App.jsx` reducer contains `if (state.storyPanel >= 3) { ... }` — a hardcoded assumption of exactly 4 story panels (indices 0–3). Since CircleQuest requires **6 panels**, this must be generalized to `state.storyPanel >= STORY_PANELS.length - 1` (importing `STORY_PANELS` from `data/storyContent.js` into `App.jsx`, or passing the panel count in via a constant/config so `App.jsx` doesn't need a direct data import — either approach is acceptable, but the magic number `3` must not survive into this build).
3. **`src/data/questionBank.js` in the reference is a hand-written static array**, not procedurally generated, despite the project's general standard (established in later modules) of procedural generation with QA stress-testing. **CircleQuest should follow the newer procedural-generation standard**, not the reference's static-array pattern — see §6.3.

## 2. Tech Stack & Dependencies

Identical to reference — no version changes:

```json
{
  "dependencies": {
    "framer-motion": "^12.42.0",
    "lucide-react": "^1.22.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.2",
    "dotenv": "^17.4.2",
    "node-fetch": "^3.3.2",
    "oxlint": "^1.69.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "lint": "oxlint",
    "preview": "vite preview"
  }
}
```

`vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` (with `base: '/'` + SPA rewrite, per the project's known Vercel-deploy fix) are reused as-is.

## 3. Folder Structure

```
circle-area-main/
├── public/
│   └── assets/
│       ├── audio/                    # generated .mp3s (git-ignored source, delivered pre-generated)
│       └── story/                    # story_1.png ... story_6.png (2000×800 placeholders)
├── scripts/
│   ├── generate_audio.js             # Modified: new `phrases` array (CircleQuest content)
│   └── clean_audio.js                # Reused as-is
├── src/
│   ├── assets/story/                 # story_1.png ... story_6.png (build-time imports)
│   ├── components/
│   │   ├── IntroScreen.jsx / .css    # Modified: title/copy only
│   │   ├── ProgressMap.jsx           # Reused as-is
│   │   ├── ProgressMap.css           # Reused as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx / .css     # Reused as-is
│   │   │   ├── FeedbackOverlay.jsx / .css  # Reused as-is
│   │   │   ├── FloatingNumbers.jsx / .css  # Reused as-is (or reskinned particle set)
│   │   │   └── CircleVisual.jsx      # NEW — replaces MoneyVisual.jsx (see §7.4)
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx / .css # Reused as-is
│   │   │   └── StarRating.jsx        # Reused as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx / .css  # Modified: import CircleVisual instead of MoneyVisual
│   │   │   └── BossBattleModal.jsx / .css   # Reused as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx / .css       # Modified: content only
│   │   │   ├── StoryPhase.jsx / .css        # Modified: generalize to N panels (see §5.1)
│   │   │   ├── SimulatePhase.jsx / .css     # Modified: 4 new station imports/labels
│   │   │   ├── PlayPhase.jsx / .css         # Reused as-is (logic unchanged)
│   │   │   └── ReflectPhase.jsx / .css      # Modified: new recap questions + copy
│   │   └── simulations/
│   │       ├── SliceDiscoveryLab.jsx        # NEW (Station A)
│   │       ├── GardenDesignerStation.jsx    # NEW (Station B)
│   │       ├── TrackBuilderStation.jsx      # NEW (Station C)
│   │       ├── ShadedRegionDetective.jsx    # NEW (Station D)
│   │       └── Stations.css                 # Modified: extend with new visual classes
│   ├── config/
│   │   ├── worlds.config.js          # Modified: 10 circle-themed worlds (§6.1)
│   │   ├── characters.config.js      # Modified: Zoe / Arjun / Tally the Owl (§6.2)
│   │   └── audio.config.js           # Reused as-is (voice ID/model/style presets unchanged)
│   ├── core/
│   │   └── hooks/
│   │       └── useViewport.js        # Reused as-is
│   ├── hooks/
│   │   └── useAudio.js               # Reused as-is
│   ├── data/
│   │   ├── storyContent.js           # Modified: 6 STORY_PANELS (§6.4)
│   │   └── questionBank.js           # Modified: exports procedurally-generated 100 Qs (§6.3)
│   ├── utils/
│   │   ├── audio.js                  # Reused as-is
│   │   ├── audioMap.js               # Auto-generated by generate_audio.js — do not hand-edit
│   │   ├── narration.js              # Modified: CircleQuest phase scripts (§8)
│   │   ├── badgeEngine.js            # Modified: relabelled badges, same trigger logic (§9)
│   │   ├── scoring.js                # Reused as-is
│   │   ├── shuffle.js                # Reused as-is
│   │   └── circleMath.js             # NEW — replaces moneyMath.js (§6.3)
│   ├── styles/
│   │   ├── design-tokens.css         # Modified: 10 new --world-N accent colors only
│   │   └── globals.css               # Reused as-is (fix the known `top:70px`/100vh bug proactively — use 100dvh + measured header height)
│   ├── App.jsx                       # Modified: generalize story-panel-count logic (§1.2), station count stays 4 (unchanged)
│   ├── App.css                       # Reused as-is
│   ├── main.jsx                      # Reused as-is
│   └── index.css                     # Reused as-is
├── index.html                        # Modified: <title>CircleQuest</title>, ensure NOT "Intellia SG" (must read "Intellia Global")
├── package.json                      # Modified: name field only ("circlequest")
├── vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                         # Modified: module-specific + art-brief for the 6 story images
```

**Do not create** a `src/features/*` folder or any duplicate phase/simulation implementation — see Finding 1 in §1.

## 4. State Management (`App.jsx`)

Reuse the reference's `useReducer` pattern and action set (`SET_PHASE`, `NEXT_STORY_PANEL`, `PREV_STORY_PANEL`, `ADVANCE_SIM_STATION`, `PREV_SIM_STATION`, `COMPLETE_SIM_STATION`, `LOAD_QUESTIONS`, `ANSWER_CORRECT`, `ANSWER_INCORRECT`, `USE_HINT`, `CLEAR_FEEDBACK`, `PREV_QUESTION`, `NEXT_QUESTION`, `UNLOCK_BADGE`, `COMPLETE_PHASE`, `TOGGLE_AUDIO`, `RESET_SESSION`) verbatim — the state shape and district/world math (`Math.floor(nextQ / 10)`, 10-questions-per-world) does not need to change since CircleQuest also uses 10 worlds × 10 questions.

**Required change:** replace the hardcoded panel-count checks:

```js
// Reference (hardcoded to 4 panels):
case 'NEXT_STORY_PANEL':
  if (state.storyPanel >= 3) { /* transition to simulate */ }
  return { ...state, storyPanel: state.storyPanel + 1 };

// CircleQuest (generalized to N panels):
case 'NEXT_STORY_PANEL':
  if (state.storyPanel >= STORY_PANEL_COUNT - 1) { /* transition to simulate */ }
  return { ...state, storyPanel: state.storyPanel + 1 };
```

`STORY_PANEL_COUNT` should be derived from `STORY_PANELS.length` (imported from `data/storyContent.js`) and must equal **6** for this module. `simStationsComplete` stays a 4-element array (`Array(4).fill(false)`) since the Simulate phase still has exactly 4 stations — only the Story panel count changes.

## 5. Component Specs — Modified Phase Components

### 5.1 `StoryPhase.jsx`
Already reads `totalPanels = STORY_PANELS.length` dynamically and renders dot-progress/counter off that value — **no change needed here** beyond swapping in the 6-panel `STORY_PANELS` data and the 6 story images (`story1.png`...`story6.png`). Confirm `isLastPanel = storyPanel >= totalPanels - 1` correctly shows "Simulate! 🧪" only on panel 6. The `NEXT_STORY_PANEL`/`PREV_STORY_PANEL` fix belongs in `App.jsx` (§4), not here.

### 5.2 `SimulatePhase.jsx`
Update the `STATIONS` array to the 4 new stations and swap component imports:

```js
const STATIONS = [
  { id: 0, label: 'A', name: 'Slice Discovery',   icon: '🔪', desc: 'Discover the area formula' },
  { id: 1, label: 'B', name: 'Garden Designer',   icon: '🌻', desc: 'Build a circle to a target area' },
  { id: 2, label: 'C', name: 'Track Builder',     icon: '🏟️', desc: 'Construct a running-track composite shape' },
  { id: 3, label: 'D', name: 'Shaded Detective',  icon: '🔍', desc: 'Spot the shaded-area mistake' },
];
```
Tab bar, footer navigation, progress dots, and the `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference — only the station components rendered per index change.

### 5.3 `PlayPhase.jsx`, `QuestionRenderer.jsx`, `BossBattleModal.jsx`, `KingdomMap.jsx`
Reused as-is at the logic level. The only required edit is in `QuestionRenderer.jsx`: swap the `MoneyVisual` import/usage for the new `CircleVisual` component (§7.4), since question `visual`/`visualData` fields now describe circles/semicircles/composite shapes instead of coins/notes.

### 5.4 `ReflectPhase.jsx`
Reuse layout/logic; replace the 3 hard-coded `REFLECT_QUESTIONS` with circle-concept recap questions, e.g.:
- "If you double the radius of a circle, what happens to its area?" → "It becomes 4 times as large" (correct) / "It becomes 2 times as large" / "It stays the same"
- "What is the formula for the area of a circle?" → "π × radius × radius" (correct) / "π × diameter" / "2 × π × radius"
- "A semicircle's area is what fraction of a full circle with the same radius?" → "One half" (correct) / "One quarter" / "The same"

## 6. Data Layer

### 6.1 `config/worlds.config.js`
Ten entries, each `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`, matching the reference's exact shape:

```js
export const WORLDS = [
  { id: 0, name: 'Circle Basics Court',      emoji: '🎯', accent: '#FFD54F', description: 'Radius, diameter, and pi basics', conceptFocus: 'basics',            boss: { name: 'The Definition Keeper', emoji: '📐', reward: 'Definition Badge 📐' } },
  { id: 1, name: 'Garden Grove',             emoji: '🌻', accent: '#66BB6A', description: 'Area from a given radius',      conceptFocus: 'area_from_radius',   boss: { name: 'Garden Boss',           emoji: '🌻', reward: 'Garden Badge 🌻' } },
  { id: 2, name: 'Pizza Parlour',            emoji: '🍕', accent: '#FF8A65', description: 'Area from a given diameter',    conceptFocus: 'area_from_diameter', boss: { name: 'Pizza Master',          emoji: '🍕', reward: 'Pizza Badge 🍕' } },
  { id: 3, name: 'Clock Tower Plaza',        emoji: '🕐', accent: '#4FC3F7', description: 'Area of a semicircle',          conceptFocus: 'semicircle',         boss: { name: 'Clock Keeper',          emoji: '🕐', reward: 'Clock Badge 🕐' } },
  { id: 4, name: 'Wheel Works Garage',       emoji: '⚙️', accent: '#B0BEC5', description: 'Area of a quarter circle',      conceptFocus: 'quarter_circle',     boss: { name: 'Wheel Boss',            emoji: '⚙️', reward: 'Wheel Badge ⚙️' } },
  { id: 5, name: 'Mystery Radius Lab',       emoji: '🔍', accent: '#BA68C8', description: 'Work backwards from area',      conceptFocus: 'reverse_radius',     boss: { name: 'Mystery Boss',          emoji: '🔍', reward: 'Mystery Badge 🔍' } },
  { id: 6, name: 'Coin & Compass Collectors',emoji: '🪙', accent: '#FFCA28', description: 'Compare and order circle areas',conceptFocus: 'compare',            boss: { name: 'Compass Boss',          emoji: '🧭', reward: 'Compass Badge 🧭' } },
  { id: 7, name: 'Running Track Stadium',    emoji: '🏟️', accent: '#EF5350', description: 'Composite figures: track shape',conceptFocus: 'composite_track',    boss: { name: 'Track Boss',            emoji: '🏟️', reward: 'Track Badge 🏟️' } },
  { id: 8, name: 'Pattern & Design Studio',  emoji: '🎨', accent: '#26C6DA', description: 'Shaded / remaining area',       conceptFocus: 'shaded_region',      boss: { name: 'Design Boss',           emoji: '🎨', reward: 'Design Badge 🎨' } },
  { id: 9, name: 'Grand Circular Showcase',  emoji: '🏆', accent: '#FFC107', description: 'Mixed review & word problems',  conceptFocus: 'mixed_review',       boss: { name: 'The Circle Champion',   emoji: '👑', reward: 'Circle Master Badge 👑' } },
];
```
`PLAY_MODES` block reused verbatim (Guided/Independent/Timed/Boss unchanged). `XP_REWARDS` reused verbatim.

### 6.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  zoe:   { name: 'Zoe',   role: 'P6 student designing circular exhibits for the school Design & Discovery Fair', emoji: '👧', colour: '#4FC3F7', mascotEmoji: '📐' },
  arjun: { name: 'Arjun', role: "Zoe's fair partner, curious about how the area formula actually works",         emoji: '👦', colour: '#FF8A65', mascotEmoji: '🛞' },
  tally: { name: 'Tally the Owl', role: 'Guide & narrator mascot — explains pi, radius, and the area formula',    emoji: '🦉', colour: '#FFC107', mascotEmoji: '🦉' },
};
export const MASCOT = { name: 'Tally the Owl', emoji: '🦉' };
```
(Per the project's shared-mascot convention; swap freely per PRD §15 sign-off.)

### 6.3 Question Bank — Procedural Generation (`data/questionBank.js` + `utils/circleMath.js`)

Unlike the reference's static `RAW_QUESTIONS` array, CircleQuest's question bank must be **procedurally generated from templates**, per the project's current standard (established in later modules such as the Grade 5 measurement modules), while preserving the reference's exact **output schema** so `QuestionRenderer`/`PlayPhase` need no structural changes:

```js
// output schema — one object per question, matching the reference's fields exactly
{
  id: Number,            // 1–100, sequential
  districtId: Number,    // 0–9, maps to WORLDS[id]
  category: String,      // e.g. 'AREA FROM RADIUS', 'SEMICIRCLE AREA', 'COMPOSITE FIGURE'
  visual: String,        // 'circle-radius' | 'circle-diameter' | 'semicircle' | 'quarter-circle'
                          // | 'composite-track' | 'shaded-region' | 'comparison' | 'reverse-radius'
  questionText: String,
  options: [String],     // 4 options, one correct
  correctAnswer: String,
  explanation: String,
  hint1: String,
  hint2: String,
  visualData: Object,    // shape-specific: { radius, diameter, piUsed, area, unit, ... } — see CircleVisual spec §7.4
}
```

**`utils/circleMath.js`** (new module, replaces `moneyMath.js`):
```js
export function pickPi(radius) {
  return (radius % 7 === 0) ? 22 / 7 : 3.14;
}
export function areaOfCircle(radius, piValue = pickPi(radius)) {
  return +(piValue * radius * radius).toFixed(2);
}
export function areaOfSemicircle(radius) { return +(areaOfCircle(radius) / 2).toFixed(2); }
export function areaOfQuarterCircle(radius) { return +(areaOfCircle(radius) / 4).toFixed(2); }
export function radiusFromDiameter(diameter) { return diameter / 2; }
export function formatArea(value, unit = 'cm') { return `${value} ${unit}\u00B2`; } // display only — narration must spell "square centimetres" instead, per PRD §10
```

**Generation approach:** for each of the 10 worlds, define a small set of question-template functions keyed to that world's `conceptFocus` (e.g., `genAreaFromRadius(rng)`, `genSemicircle(rng)`, `genComposite(rng)`), each of which:
1. Draws its radius/diameter value from a **curated pool of "clean" whole numbers** (e.g., `[3,4,5,6,7,8,9,10,12,14,15,20,21,25,28,30,35,40,49,50]`), never from an unconstrained random range, so results stay pedagogically clean and avoid ugly decimals.
2. Applies `pickPi()` to decide 3.14 vs 22/7 automatically based on the chosen radius.
3. Produces 3 plausible wrong-answer distractors (e.g., using the wrong π, forgetting to square the radius, using diameter instead of radius) rather than random numbers — distractors should reflect **real, predictable P6 misconceptions**.
4. Fills in `explanation`, `hint1` (points at the formula/first step), `hint2` (walks the arithmetic), and `visualData`.

Run each world's generator 10 times to fill its 10 question slots, assign sequential `id`/`districtId`, and export the concatenated 100-question array as the default export of `data/questionBank.js`, plus a named `DISTRICTS` export (same shape as reference: `{ id, name, icon, boss }`, derived from `WORLDS`) for `PlayPhase.jsx`'s existing `DISTRICTS` import to keep working unmodified.

**QA requirement:** stress-test the generator across **at least 300 randomized runs** (30,000 questions) and assert: no duplicate options, no negative/zero radii, no non-terminating decimal areas beyond 2 d.p., and no `NaN`/`undefined` fields — matching the QA rigor already established for prior modules.

### 6.4 `data/storyContent.js`
`STORY_PANELS` array of **6** objects, each matching the reference's exact shape (`panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji`), authored per the 6-panel outline in PRD §7.2 (Round Table Puzzle → Pi Secret → Unrolling the Circle → Pizza Problem → Running Track → Fair Day Triumph).

## 7. Simulate Station Technical Specs

All four stations follow the reference's per-station component contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, and a `station-success` panel with a "Complete Station ✓" CTA that calls `onComplete`. Visuals are SVG-based (inline, using CSS variables for theming per `design-tokens.css`, consistent with the Visualizer/diagram conventions already used across the product).

### 7.1 Station A — `SliceDiscoveryLab.jsx`
- **State:** `sliceCount` (4/8/16/32/64, slider-controlled), `radius` (fixed demo value, e.g. 6 cm), `confirmed` (bool).
- **Visual:** an SVG circle subdivided into `sliceCount` alternating-color wedges; a second, animated SVG panel shows the same wedges rearranged edge-to-edge into a shape that flattens toward a rectangle as `sliceCount` increases (interpolate wedge arrangement by `sliceCount`; at `sliceCount=64` the shape should read clearly as "rectangle-like," base ≈ πr, height ≈ r).
- **Live readout:** "Rectangle base ≈ [πr value] · height = radius = [r] → Area ≈ base × height = [πr²]" updating as the slider moves.
- **Completion gate:** slider reaches max (64) AND the student answers the single confirmation question correctly ("What are the two side lengths of the fully-unrolled shape?" → "πr and r").

### 7.2 Station B — `GardenDesignerStation.jsx`
- **State:** `challIdx` (rotates through 3–4 challenges of increasing difficulty: radius-given, diameter-given, closest-match), `radius` (slider/dial, live), `success`.
- **Visual:** a live SVG circle whose radius scales directly with the slider value; a target-area ring/badge shown alongside.
- **Live readout:** "Radius: [r] cm → Area = π × [r] × [r] = [area] cm² · Target: [target] cm²" with color coding (too small / too big / within tolerance).
- **Completion gate:** area within a small tolerance band (e.g. ±2%) of the target for at least one challenge round, then "Complete Station" unlocks after all challenge rounds in the rotation are attempted successfully (mirrors reference's multi-challenge-then-complete pattern from `CoinRegisterStation`).

### 7.3 Station C — `TrackBuilderStation.jsx`
- **State:** `straightLength` (slider), `semicircleRadius` (slider), `success`.
- **Visual:** a live SVG "stadium" shape (rectangle with a semicircle capping each short end) that resizes with both sliders.
- **Live readout:** "Rectangle area = [L] × [2r] = [..] · Two semicircles = one full circle of radius [r] = [πr²] · Total track area = [..]" — explicitly modelling the "two semicircles = one circle" composite-figure insight.
- **Completion gate:** total computed area within tolerance of a given target track area.

### 7.4 Station D — `ShadedRegionDetective.jsx` (and the new `CircleVisual.jsx` shared component)
- **State:** `caseIdx` (rotates through 3–4 blueprint cases: circle-in-square, ring/annulus, two-overlapping-circles), `selectedStepId`, `corrected` (bool).
- **Visual:** each "case" shows an SVG blueprint (outer shape + inner circle, clearly labelled dimensions) alongside a 3–4 step worked calculation, one step of which contains a seeded error (e.g., using the diameter instead of the radius in `πr²`, or adding instead of subtracting).
- **Interaction:** student taps the flawed step, then selects the corrected value/operation from a small option set.
- **Completion gate:** correct step identified + corrected value chosen, across all cases in rotation.

**`CircleVisual.jsx`** (shared component, used by `QuestionRenderer.jsx` in Play/Practice and reusable inside the Simulate stations): takes `{ type, data }` exactly like the reference's `MoneyVisual`, and renders an SVG circle/semicircle/quarter-circle/composite/shaded shape with labelled radius/diameter, sized responsively via the existing `compact` prop convention.

## 8. Audio & Narration Pipeline

Implemented **exactly per `audio_generation_pipeline.md`**, content only differs:

- `src/config/audio.config.js`: unchanged (Alice voice ID `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`, same 6 style presets).
- `src/utils/audio.js`, `src/hooks/useAudio.js`, `src/utils/audioMap.js`: unchanged mechanics (cache-check → dynamic ElevenLabs fetch → HTML5 `Audio` playback → i+1 preloading).
- `src/utils/narration.js`: rewrite the phase-specific functions with CircleQuest content, keeping the same exported function names/shapes so `PlayPhase.jsx`/`SimulatePhase.jsx`/etc. need no import changes: `wonderNarration()`, `storyNarration(panel)` (now returns 1 of **6** scripts), `simStationIntro(stationIdx)` (now returns 1 of **4** new station intros), `playQuestionNarration`, `playCorrectNarration`, `playWrongNarration`, `playHint1Narration`, `playHint2Narration`, `districtCompleteNarration`, `bossStartNarration`, `bossWinNarration`, `reflectNarration`, `reflectCompleteNarration`. Reuse the same `say/ask/cheer/emphasize/think/instruct/encourage` helper exports unchanged.
- `scripts/generate_audio.js`: update the `phrases` array to the full new phrase list (every Wonder line, all 6 Story scripts, all 4 Simulate intros, Reflect content, and static UI/feedback phrases) with correct `style` tags per line, matching the PRD's math-narration rule (spell out "pi," "radius squared," "square centimetres," full formula sentences — never symbols/abbreviations).
- `scripts/clean_audio.js`: unchanged.
- Run `npm run generate-audio` after `narration.js`/`phrases` are finalized, then `npm run clean-audio` to remove orphaned files, per the reference workflow (`audio_generation_pipeline.md` §3).

## 9. Gamification Logic

- `utils/scoring.js`: reused as-is (`calcXP`, `calcStars` formulas unchanged).
- `utils/badgeEngine.js`: same trigger logic (`checkBadges(state)` function body unchanged), only the `BADGES` array's `icon`/`label`/`description` strings are relabelled per PRD §9 (First Slice, Hot Streak, Radius Prodigy, Lab Champion, World Star, Boss Slayer, Centurion, Circle Master). Trigger conditions (`maxStreak >= 5`, `simStationsComplete.every(Boolean)`, `districtScores.some(score => score >= 9)`, etc.) are unchanged since the underlying mechanics (10-question worlds, 4 sim stations) are identical in shape to the reference.

## 10. Design Tokens & Styling

- `styles/design-tokens.css`: reused verbatim except the `--world-0` through `--world-9` accent color block, replaced with the 10 accent colors listed in §6.1. Core palette (`--color-bg`, `--gold`, `--purple`, `--green`, `--red`), font stack, radii, shadows, and transitions are unchanged.
- `styles/globals.css`: reused as-is, **except** proactively fix the known viewport-clipping bug already flagged in this project's history (hardcoded `top: 70px` + `100vh` instead of `100dvh` + a measured header height via `ResizeObserver`) — do not carry this bug forward into a new module when it's already a known, documented issue.
- Font sizing: apply the project's standard enlarged-fonts-in-Simulate/Play rule, calibrated per PRD §11 (comfortably larger than default body text; slightly more restrained than the Grade 2 reference's oversized touch targets, appropriate to Grade 6 fine-motor/reading ability).

## 11. Build, Scripts, Deployment

- `vite.config.js`: reuse `base: '/'` setting (avoids the Vercel path-mismatch bug documented from a prior Grade 6 module build).
- `vercel.json`: reuse the SPA rewrite-rules configuration as-is.
- `index.html`: set `<title>CircleQuest</title>` (or `<title>CircleQuest — Intellia Global</title>`); explicitly verify it does **not** say "Intellia SG" (a known leftover from some reference variants) and does **not** carry over any "Singapore MOE-aligned" wording verbatim in index.html/README if inconsistent with current copy standards — verify against the delivered README wording used in the most recent modules.
- `package.json`: `name: "circlequest"`, all other fields/scripts unchanged.

## 12. QA & Validation Plan

1. **Question bank stress test:** generate ≥300 sessions (30,000 questions) programmatically; assert schema completeness, no duplicate options, no negative/invalid geometry, and correct `pickPi()` behavior (22/7 only when radius % 7 === 0).
2. **Audio parity check:** script or manual pass confirming every string passed to `narrate()`/`say()`/etc. across all phases has a 1:1 exact-text match in `audioMap.js` (or is an intentionally-dynamic value like a generated question/number).
3. **Full user-journey walkthrough:** Wonder → Story (confirm all 6 panels navigate correctly, dots/counter accurate, "Simulate! 🧪" only appears on panel 6) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes reachable, Boss Battle winnable, badges unlock correctly) → Reflect (new recap questions render, scorecard accurate) — zero console/page errors.
4. **Production build check:** `npm install && npm run build` succeeds from a clean extract of the delivered zip.
5. **Responsive/accessibility spot-check:** verify enlarged Simulate/Play fonts and touch targets, verify SVG visuals carry text labels (not color-only), verify slider interactions have keyboard equivalents.

## 13. Delivery Checklist

- [ ] Zip excludes `node_modules/` and `dist/`
- [ ] 6 story image placeholders at 2000×800 px, matching reference's actual shipped dimensions and responsive display frame
- [ ] Art-brief README describing each of the 6 story panel images (scene, characters present, mood, key visual detail to depict)
- [ ] `README.md` updated with CircleQuest-specific setup/run instructions (mirrors reference README structure)
- [ ] `.env.local.example` documenting the required `VITE_ELEVENLABS_API_KEY` variable (no real key committed)
- [ ] All checklist items in §12 passed and noted in the hand-off notes

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Slider-based Simulate stations are harder to make keyboard/touch-accessible than tap targets | Ensure every slider has explicit numeric +/− step buttons alongside the drag handle, not drag-only |
| Procedural generation could produce ugly non-clean areas if the radius pool isn't curated carefully | Restrict all radius/diameter draws to the curated "clean" pool (§6.3); never draw from an unconstrained range |
| 6-panel Story phase increases narration/audio-generation volume vs. the reference's 4 | Budget accordingly in the `generate_audio.js` phrase list and re-run `clean-audio` after final content lock to avoid orphaned partial-generation files |
| Reusing `src/features/*`-style dead code out of habit when copying the reference | Explicit reminder in §1/§3: do not create a `features/` folder in this build |
