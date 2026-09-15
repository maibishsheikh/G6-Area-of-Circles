# CircleQuest — Area of Circles
### Singapore MOE Primary 6 Mathematics (Measurement: Circles)

**CircleQuest** is a gamified, narrative-driven interactive mathematics learning module created for Intellia Global. It guides Primary 6 students (ages 11–12) through finding the area of circles, extending into semicircles, quarter circles, and composite/shaded-region figures.

---

## 🚀 Features

- **Five-Phase Learning Architecture:**
  1. **Wonder Phase:** The pizza vs box mystery hook with animated floating math particles.
  2. **Story Phase (6 Panels):** Step-by-step conceptual derivation following Zoe, Arjun, and mascot Tally the Owl 🦉.
  3. **Simulate Phase (4 Challenge Stations):**
     - **Station A — Slice & Discover Lab:** Manipulate 4 to 64 slices, watch them unroll into a rectangle of base $\pi r$ and height $r$, proving $\text{Area} = \pi r^2$.
     - **Station B — Garden Designer Mission:** Build circular flowerbeds to target areas with live visual feedback and tolerance checking.
     - **Station C — Track Builder Mission:** Construct stadium running tracks (rectangle + two semicircles) hitting exact target areas.
     - **Station D — Shaded Region Detective:** Inspect engineering blueprints, identify calculation misconceptions, and correct worked steps.
  4. **Practice Phase (100 Questions across 10 Worlds):**
     - World 0: Circle Basics Court (🎯)
     - World 1: Garden Grove (🌻)
     - World 2: Pizza Parlour (🍕)
     - World 3: Clock Tower Plaza (🕐)
     - World 4: Wheel Works Garage (⚙️)
     - World 5: Mystery Radius Lab (🔍)
     - World 6: Coin & Compass Collectors (🪙)
     - World 7: Running Track Stadium (🏟️)
     - World 8: Pattern & Design Studio (🎨)
     - World 9: Grand Circular Showcase (🏆)
     - 4 Modes: Guided Practice, Independent Practice, Timed Challenge, Boss Battle.
  5. **Reflect Phase:** 3-question conceptual recap quiz, learning journal with quick chips, and trophy scorecard.
- **Visual Engine:** Bespoke SVG renderer (`CircleVisual.jsx`) with high-contrast accessibility labels.
- **Audio Pipeline:** ElevenLabs Alice voice (`eleven_multilingual_v2`) with spoken natural-language math rules and Web Audio SFX fallback.

---

## 📦 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

### 4. Automated Question Bank QA Stress Test
```bash
npm run test:questions
```

---

## 🎨 Art Brief — Story Panel Illustrations

The Story Phase includes 6 widescreen 2000×800 px illustration frames (16:9 safe inner display):

1. **Panel 1 — "The Round Table Puzzle"**
   - **Characters:** Zoe (12-year-old girl, inquisitive, wearing school fair badge) and Arjun (12-year-old boy, holding measuring tape).
   - **Scene:** School exhibition hall with unfinished wooden round tables and posters.
   - **Key Visual Detail:** Arjun measures across a round tabletop while Zoe points from the centre to the edge to illustrate radius ($r = 10\text{ cm}$) vs diameter ($d = 20\text{ cm}$).
   - **Mood:** Energetic, curious, collaborative.

2. **Panel 2 — "Tally's Pi Secret"**
   - **Characters:** Tally the Owl (wise, friendly mascot with golden feathers and little spectacles).
   - **Scene:** Science lab workbench with brass calipers, ribbons, and circular gear wheels.
   - **Key Visual Detail:** Tally wraps a glowing cyan measuring ribbon around a brass wheel to demonstrate that Circumference $\div$ Diameter always equals $\pi \approx 3.14$ or $22/7$.
   - **Mood:** Magical, eureka moment, intriguing.

3. **Panel 3 — "Unrolling the Circle"**
   - **Characters:** Zoe, Arjun, and Tally.
   - **Scene:** Demonstration table with a circular rubber mat sliced into thin alternating blue and yellow wedges.
   - **Key Visual Detail:** Slices are interlocked like puzzle teeth, clearly taking the shape of a rectangle with base $\approx \pi r$ and height $r$, revealing the formula $\text{Area} = \pi r^2$.
   - **Mood:** Pedagogical centerpiece, satisfying, crystal clear.

4. **Panel 4 — "The Pizza Problem"**
   - **Characters:** Zoe and Arjun eating lunch.
   - **Scene:** School cafeteria table with a large round pepperoni pizza inside a square cardboard delivery box.
   - **Key Visual Detail:** The circular pizza ($r = 10\text{ cm} \to 314\text{ cm}^2$) fits snugly inside the square box ($20 \times 20\text{ cm} \to 400\text{ cm}^2$), showing the 4 small empty corner spaces ($86\text{ cm}^2$).
   - **Mood:** Fun, relatable real-world application.

5. **Panel 5 — "The Running Track"**
   - **Characters:** Arjun and Zoe designing an architectural model.
   - **Scene:** Modern sports design studio with miniature stadium tracks and blueprints.
   - **Key Visual Detail:** A glowing stadium shape showing the central rectangle ($80 \times 20 = 1600\text{ m}^2$) joined by two semicircular ends ($r = 10\text{ m}$) that combine into one full circle ($314\text{ m}^2$).
   - **Mood:** Architectural, high-tech, ambitious.

6. **Panel 6 — "Fair Day Triumph!"**
   - **Characters:** Zoe, Arjun, and Tally celebrating on stage.
   - **Scene:** School Design & Discovery Fair awards ceremony with banners, confetti, and crowded stands.
   - **Key Visual Detail:** Head judge presents Zoe and Arjun with the Golden Compass trophy while their circular exhibit posters glow behind them.
   - **Mood:** Triumphant, celebratory, empowering.

---

## 📜 Audio Configuration

To generate static audio with ElevenLabs:
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Add your ElevenLabs API key:
   ```env
   VITE_ELEVENLABS_API_KEY=your_key_here
   ```
3. Run the generation script:
   ```bash
   npm run generate-audio
   ```
