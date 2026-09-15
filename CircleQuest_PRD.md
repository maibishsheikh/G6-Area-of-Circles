# Product Requirements Document (PRD)
## CircleQuest — Area of Circles (Primary 6, Singapore MOE-Aligned)

**Prepared for:** Intellia Global
**Module type:** Gamified, narrative-driven math learning module
**Grade level:** Primary 6 (Grade 6), ages 11–12
**Topic:** Area of Circles (Circumference used only as a conceptual bridge)
**Reference module (architecture/UI/UX source of truth):** `G2-Money-Money-main` (MoneyQuest, Grade 2)
**Reference audio pipeline:** `audio_generation_pipeline.md` (ElevenLabs-only narration system)
**Status:** Draft v1.0 for build hand-off

---

## 1. Overview

CircleQuest teaches Primary 6 students how to find the **area of a circle**, and extends this into semicircles, quarter circles, and composite/shaded-region figures — the core of the Singapore MOE "Circles" topic at P6 level. It reuses the exact five-phase pedagogical architecture, UI/UX system, gamification model, and ElevenLabs narration pipeline established by the `G2-Money-Money-main` reference module, so that the module is instantly recognizable as part of the Intellia Global product family while delivering grade-appropriate rigor and a more mature visual/interaction style suited to 11–12-year-olds.

This document defines **what** to build and **why**. Companion document `CircleQuest_TRD.md` defines **how** to build it (architecture, folder structure, data schemas, component specs).

## 2. Background: Why This Reference Was Chosen

`G2-Money-Money-main` is the current gold-standard implementation of the Intellia five-phase engine:

- Wonder → Story → Simulate → Play (Practice) → Reflect
- A `worlds.config.js`-driven system of **10 themed worlds**, each holding **10 questions**, for a **100-question bank** in total
- Four practice modes: Guided, Independent, Timed, Boss Battle
- A full gamification layer: XP, streaks, stars, badges, a Kingdom/World Map, and per-world Boss Battles
- An ElevenLabs-only narration pipeline with pre-generated static audio and on-the-fly fallback generation, driven by an `audioMap.js` exact-text lookup
- A dark glass-morphism visual design system (`design-tokens.css`) with per-world accent colors

All of the above is carried over into CircleQuest **unchanged at the architectural level**. Only the topic content, story, characters, question bank, visual aids, and Simulate-phase station designs are new.

## 3. Standards Alignment

Singapore MOE Primary 6 Mathematics — **Measurement: Circles** strand:

- Radius, diameter, and their relationship (d = 2r)
- π (pi) as a fixed ratio, used as π ≈ 3.14 (with π ≈ 22/7 as an alternate, cleaner value when the radius/diameter is a multiple of 7 — a genuine MOE textbook convention students are expected to recognise)
- **Area of a circle = π × r²**
- Area of a semicircle (half of πr²) and a quarter circle (a quarter of πr²)
- Area of composite figures made up of squares, rectangles, triangles, and circles/semicircles/quarter circles (e.g., running tracks, garden borders, shaded regions/annuli)
- Real-world application and word problems involving area of circles (cost per unit area, comparisons, scaling effects of radius on area)

*Note:* Circumference (C = πd = 2πr) is **not** the target skill of this module but is introduced briefly in the Story phase as the conceptual stepping stone to the area formula (matching how MOE textbooks sequence the "Circles" chapter). No circumference questions appear in the 100-question Play bank; circumference appears only as narrative context.

## 4. Learning Objectives

By the end of CircleQuest, a student should be able to:

1. State the relationship between radius and diameter, and explain what π represents.
2. Recall and apply **Area = π × r²** to find the area of a circle given its radius or diameter.
3. Find the area of a semicircle and a quarter circle.
4. Solve for a missing radius/diameter when the area is known (working backwards, MCQ-supported — no square-rooting required).
5. Compare and order circle areas, and explain why doubling the radius **quadruples** the area (a commonly mis-understood MOE exam point).
6. Calculate the area of composite figures combining circles/semicircles/quarter circles with rectangles and squares (e.g., a running track, a garden with a rounded end).
7. Calculate shaded/remaining area problems (e.g., a circle cut out of a square).
8. Apply area-of-circle calculations to real-world word problems (cost of turfing a circular plot, comparing pizza sizes, etc.).

## 5. Inherited Product Standards (from Intellia Global conventions)

These are non-negotiable and carried over from the reference architecture and established project standards:

- Five-phase structure: **Wonder → Story → Simulate → Play (labelled "Practice" in-UI) → Reflect**
- React / Vite / Tailwind / Framer Motion stack
- ElevenLabs-only narration (Alice voice, `eleven_multilingual_v2`) — **no browser Web Speech API fallback**
- 1:1 strict parity between narrated audio and on-screen text
- 10 themed worlds × 10 questions = 100-question bank, procedurally generated (not hand-written statics) with QA stress-testing
- Four Play modes: Guided Practice, Independent Practice, Timed Challenge, Boss Battle
- Full gamification: XP, streaks, stars per world, badges, Boss Battles with 3 lives
- Pixel-faithful replication of the reference's visual design system — no creative re-theme of layout, only content/topic substitution and the deliberate, explicitly-requested enhancements below
- Enlarged fonts and touch targets in the Simulate and Play/Practice phases (calibrated to a Grade 6 hand/eye scale — slightly more compact than the Grade 2 reference's oversized targets, but still comfortably above default web body-text size)
- Delivery as a downloadable zip excluding `node_modules`/`dist`, with placeholder story images (matching reference dimensions) plus an art-brief README describing what each image should depict

## 6. Explicit Enhancements Requested for This Module

Two deviations from the reference are explicitly requested and must be treated as requirements, not optional polish:

1. **Story phase must use more than 4 panels.** The reference uses exactly 4. CircleQuest uses **6 panels** to properly build the concept in stages (see §7.2) rather than compress it. (This requires generalizing a hardcoded "4 panels" assumption in the reference's state logic — flagged in the TRD.)
2. **Simulate phase must be substantially more engaging, visually appealing, and "simulative"** than a plain click-and-reveal exercise, with genuine **challenge-style activities** (live visual feedback, target-based challenges, an interactive formula-discovery experience) so students build real conceptual understanding of *why* the formula works, not just how to plug numbers into it. See §7.3 for the full design.

## 7. The Five-Phase Learning Journey

### 7.1 Wonder Phase
A single hook screen (as in the reference) posing a concrete, intriguing question that requires the area-of-circle skill to answer, e.g.:

> "A round pizza has a radius of 10 cm. A square pizza box has sides of 20 cm. Which uses more of the box — the pizza, or the empty corners? By the end of today, you'll be able to work this out exactly!"

Floating themed particles (⚪ 🍕 🎯 🛞 📐 ✨), a mascot greeting, and a single "Let's Investigate!" CTA into Story. Fully narrated on entry, matching reference behavior.

### 7.2 Story Phase — 6 Panels

The story follows two P6 students, **Zoe** and **Arjun**, preparing exhibits for their school's Design & Discovery Fair, guided by mascot **Tally the Owl** 🦉 (the shared Intellia Global mascot). Six panels allow the concept to be built step-by-step rather than compressed:

| # | Title | Concept delivered |
|---|-------|--------------------|
| 1 | "The Round Table Puzzle" | Recap: radius vs. diameter (d = 2r); sets up the fair's circular exhibits |
| 2 | "Tally's Pi Secret" | Introduces π as the fixed ratio of circumference to diameter, π ≈ 3.14 |
| 3 | "Unrolling the Circle" | Visual/narrative derivation: cutting a circle into slices and rearranging them into a near-rectangle to reveal **Area = π × r²** |
| 4 | "The Pizza Problem" | First worked application: finding the area of a real circle (the pizza from Wonder phase) |
| 5 | "The Running Track" | Extends to a composite figure — a running track made of a rectangle plus two semicircular ends |
| 6 | "Fair Day Triumph!" | Recap and celebration: Zoe and Arjun successfully design all their circular exhibits |

Each panel follows the reference's exact layout (full-width story image left, title/body/highlight-pill/character-badge right, dot progress + Back/Next navigation, per-panel narration). Panel 3 in particular should be treated as the module's pedagogical centerpiece — its on-screen illustration is a step-through of the classic "slice and rearrange" proof, mirrored by an **interactive** version of the same idea in Simulate Station A (§7.3).

### 7.3 Simulate Phase — 4 Challenge Stations

This is the phase most explicitly called out for enhancement. All four stations must be **live, visual, and manipulable** (sliders/drag/tap with real-time SVG shape updates and instant numeric feedback) rather than static reveal-and-answer screens — matching and exceeding the interactivity bar already set by other Intellia Global modules' redesigned Simulate stations (e.g. the animated scale/route/race stations built for Grade 5 mass and speed modules).

**Station A — "Slice & Discover Lab" (Formula Discovery)**
The conceptual anchor station. Students use a slider to increase the number of "pizza slices" a circle is cut into (4 → 8 → 16 → 32...). A live animation rearranges the slices into an increasingly rectangle-like shape, and a readout shows how the rectangle's dimensions approach **half the circumference (πr) by the radius (r)** — visually revealing why Area = πr². This is a guided-discovery activity, not a quiz: students complete it by dragging the slider to the maximum and confirming they can see the shape "become a rectangle," then answering one confirmation question ("What are the two side lengths of the rectangle shape, once fully unrolled?").

**Station B — "Garden Designer Mission" (Target-Area Challenge)**
A build-to-target challenge in the spirit of the reference's Coin Register station. Students are given a target area (e.g., "Design a circular flower bed with an area as close as possible to 78.5 m²") and use a radius dial/slider to resize a live circle; a running readout shows the current radius, the formula substitution, and the resulting area. Reaching the exact (or tolerance-banded) target unlocks success feedback and the next challenge round (radius challenge, then a diameter-given challenge, then a "which radius gets closest" challenge).

**Station C — "Running Track Builder Mission" (Composite Figure Challenge)**
Students construct a stadium-shaped running track (a rectangle with a semicircle on each end) by setting the straight length and the semicircle radius with two sliders, watching the live SVG shape update. A target total track area is given; students must combine the rectangle area and the two semicircle areas (which together make one full circle) to hit the target. This station directly targets the composite-figure learning objective through hands-on construction rather than passive calculation.

**Station D — "Shaded Region Detective"**
An error-spotting challenge in the spirit of the reference's Receipt Detective. Design blueprints (a circle inside a square, a ring/annulus, two overlapping circles) are shown with a worked-but-flawed shaded-area calculation. Students must inspect the blueprint, identify which step of the calculation is wrong, and correct it — reinforcing the "total shape minus circle" reasoning needed for shaded-region problems.

All four stations retain the reference's tabbed station bar, footer navigation, progress dots, and "Complete Station" gating (all four must be completed before Practice unlocks), but each has bespoke SVG visuals, sliders/drag interactions, and challenge framing rather than the reference's simpler tap-to-add-coin interactions.

### 7.4 Play Phase (labelled "Practice" in-UI)

Unchanged mechanics from the reference:

- 10 Worlds × 10 questions = 100 total questions, presented via the World/Kingdom Map
- Per-world scoring → 0–3 stars based on correct count (reference thresholds: 9+/10 = 3★, 7–8 = 2★, 5–6 = 1★)
- Streak tracking, XP per question (attempt count, hints used, streak bonus all factored in, per the reference's `calcXP`)
- Two-tier hint system per question
- Four practice modes selectable from the map: **Guided Practice** (5 Qs, hints on), **Independent Practice** (10 Qs, no hints), **Timed Challenge** (8 Qs / 60s), **Boss Battle** (5 Qs, 3 lives, per-world boss)
- Boss Battle rewards a themed badge per world (see §9)

### 7.5 Reflect Phase

Unchanged mechanics from the reference: a short 3-question conceptual recap quiz (not from the 100-question bank — separate, concept-level questions such as "Why does doubling the radius make the area 4× bigger, not 2× bigger?"), a results/scorecard summary (total correct, XP, best streak, stars, badges earned), and an optional short reflection/journal prompt, all narrated on entry and completion.

## 8. World & Question Bank Design

10 themed worlds, 10 questions each = **100 questions total**, procedurally generated per the standard established in prior modules (see TRD §6.3 for generation logic and QA requirements — no hand-written static list; a template + curated-value generator, stress-tested across hundreds of randomized generations with zero malformed/ugly-number outputs).

| World | Theme | Concept Focus | Boss |
|---|---|---|---|
| 0 | Circle Basics Court 🎯 | Radius/diameter identification, π recap | The Definition Keeper |
| 1 | Garden Grove 🌻 | Area from a given radius (whole-number, clean π×3.14 or π×22/7 results) | Garden Boss |
| 2 | Pizza Parlour 🍕 | Area from a given diameter (halve to get radius, then apply formula) | Pizza Master |
| 3 | Clock Tower Plaza 🕐 | Area of a semicircle | Clock Keeper |
| 4 | Wheel Works Garage ⚙️ | Area of a quarter circle | Wheel Boss |
| 5 | Mystery Radius Lab 🔍 | Working backwards: given the area, identify the radius/diameter (MCQ, trial-friendly whole-number values) | Mystery Boss |
| 6 | Coin & Compass Collectors 🪙 | Comparing/ordering circle areas; the "doubling radius quadruples area" concept | Compass Boss |
| 7 | Running Track Stadium 🏟️ | Composite figures: rectangle + two semicircles (running-track style) | Track Boss |
| 8 | Pattern & Design Studio 🎨 | Shaded/remaining area: circle-in-square, rings, overlapping shapes | Design Boss |
| 9 | Grand Circular Showcase 🏆 | Mixed review + real-world word problems (cost-per-area, multi-step) | The Circle Champion |

**π convention (must be applied consistently across the bank):** default π ≈ 3.14; when the given radius (or the radius derived from a given diameter) is a multiple of 7, generate the question using π ≈ 22/7 instead, so the arithmetic resolves cleanly — this mirrors genuine MOE textbook practice and should be called out explicitly in at least one Story/Wonder moment so it doesn't appear arbitrary to students.

**Units:** all questions use cm/cm² or m/m² (no mixed units within a single question); composite/word-problem worlds may introduce simple cost-per-square-metre style extensions (e.g., "$2 per m² to turf the garden") consistent with P6 rigor.

**Sample questions (illustrative, one per representative world):**

- *World 1 (Garden Grove):* "A circular flower bed has a radius of 7 m. Using π ≈ 22/7, what is its area?" → 154 m²
- *World 3 (Clock Tower Plaza):* "A semicircular window has a radius of 10 cm. What is its area? (Use π ≈ 3.14)" → 157 cm²
- *World 6 (Coin & Compass Collectors):* "Circle A has a radius of 4 cm. Circle B has a radius of 8 cm. How many times bigger is the area of Circle B compared to Circle A?" → 4 times
- *World 7 (Running Track Stadium):* "A running track is made of a rectangle 80 m long and 20 m wide, with a semicircle attached to each short end (each semicircle has a radius of 10 m). What is the total area of the track? (Use π ≈ 3.14)" → rectangle 1600 m² + two semicircles = one full circle of r=10 → 314 m² → total 1914 m²
- *World 8 (Pattern & Design Studio):* "A square garden has sides of 14 m. A circular pond with a radius of 7 m is dug in the centre. What is the area of the garden NOT covered by the pond? (Use π ≈ 22/7)" → 196 − 154 = 42 m²

## 9. Gamification System

Carried over from the reference with circle-themed relabelling:

- **XP:** same formula as reference (`calcXP`: base XP by attempt count, minus hint penalty, plus streak bonus)
- **Stars:** 0–3 per world based on correct count out of 10 (same thresholds as reference)
- **Badges** (renamed/rethemed, same trigger logic as reference `badgeEngine.js`):
  - First Slice 🏅 — first correct answer
  - Hot Streak 🔥 — 5-answer streak
  - Radius Prodigy ⚡ — 10-answer streak
  - Lab Champion 🧪 — all 4 Simulate stations completed
  - World Star ⭐ — 3 stars in any world
  - Boss Slayer 👑 — defeated any World Boss
  - Centurion 🎯 — 20+ questions answered in Practice
  - Circle Master 🏆 — full 5-phase journey completed
- **Boss Battles:** 5 questions, 3 lives, per-world themed boss + reward badge, identical mechanic to reference

## 10. Audio & Narration Requirements

Follows `audio_generation_pipeline.md` exactly — **no deviation in the pipeline mechanics**, only in content:

- ElevenLabs-only, Alice voice (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`, same 6 emotional style presets (statement/instruction, question, encouragement, emphasis, thinking, celebration)
- Pre-generation via `scripts/generate_audio.js` for all phase paragraphs, story panels (all 6), Simulate station intros (all 4), Reflect content, and UI messages; dynamic on-the-fly generation only for numbers and procedurally-generated question text not already covered by the static map
- Strict 1:1 parity between spoken narration and on-screen text
- **Math-specific narration rule:** all mathematical notation must be spoken in full, natural language — "pi is about three point one four" (never "π" read as a symbol), "radius squared" (never "r squared" read oddly or "r two"), "square centimetres" / "square metres" (never "cm²"/"m²" read as symbols), formulas spoken as full sentences ("Area equals pi times radius squared") — this follows the established project convention of never having narration read raw unit/formula abbreviations aloud

## 11. Accessibility & UX Standards

- Enlarged fonts and touch targets in Simulate and Play/Practice phases, calibrated for Grade 6 (comfortably larger than default body text, though the interaction targets can be modestly smaller than the Grade 2 reference's since fine-motor/reading demands are lower at this age)
- All SVG circle/shape visuals must include text labels for radius/diameter values (not color/shape alone) so information isn't conveyed by color alone
- Keyboard-operable equivalents for all slider/drag interactions in the Simulate stations (arrow-key increment as a minimum)
- Same audio-toggle and Home-button placement conventions as the reference (top bar, unchanged)

## 12. Assets Required

- 6 story images (one per panel), matching the reference's actual shipped dimensions/aspect ratio (2000×800 px placeholder, `aspect-ratio: 16/9`-safe display frame) — delivered as placeholders with an art-brief README describing each panel's required scene, characters, and mood
- World icon emoji (no new icon assets needed — emoji-based, per reference convention)
- No new fonts — reuse Fredoka/Nunito + emoji fallback stack from `design-tokens.css`

## 13. Success Metrics / Acceptance Criteria

- 100-question bank passes procedural-generation QA: zero malformed questions, zero non-clean-number arithmetic, across a stress test of at least 300 randomized generations (per established project QA convention)
- All 6 story panels, all 4 Simulate station intros, and all UI/phase narration achieve 1:1 text-to-audio parity
- Full 5-phase user journey (Wonder → Story ×6 → Simulate ×4 → Practice [all 4 modes reachable] → Reflect) completes with zero console errors in a clean build
- `vite build` succeeds from a clean `npm install` on the delivered zip
- All four Simulate stations are genuinely interactive (slider/drag-driven, live-updating visuals) — not static reveal screens — and each has a clear success/challenge-completion state
- Story phase correctly supports 6 panels (progress bar, dots, and phase-transition logic all generalize beyond the reference's hardcoded 4)

## 14. Assumptions

- π is taught/used as ≈ 3.14 by default, with ≈ 22/7 used specifically when it yields a clean result (multiples of 7) — this is confirmed common MOE textbook practice but should be validated against the specific school's syllabus material if a stricter single-value convention is required.
- Circumference is treated as prerequisite/contextual knowledge only; if stakeholders want a dedicated circumference strand, that should be scoped as a separate module (e.g., "CircleQuest: Circumference") rather than folded into this one, to keep the 100-question bank focused.
- Character names (Zoe, Arjun) and mascot (Tally the Owl, per the shared Intellia Global convention) are proposed defaults and can be swapped without any architectural impact.

## 15. Open Questions for Stakeholder Sign-off

1. Should π ≈ 22/7 appear at all, or should the module standardize on π ≈ 3.14 exclusively for consistency with a specific school's exam conventions?
2. Should the Reflect-phase recap quiz explicitly test the "doubling radius quadruples area" misconception, given how central it is to the learning objectives?
3. Confirm final character names/mascot, or approve the proposed defaults.
