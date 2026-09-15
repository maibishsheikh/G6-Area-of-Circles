// src/data/questionBank.js
// Procedurally generated question bank for CircleQuest (100 questions across 10 worlds)
// Singapore MOE Primary 6 Mathematics — Measurement: Circles (Area)

import { WORLDS } from '../config/worlds.config.js';
import {
  pickPi,
  pickPiLabel,
  areaOfCircle,
  areaOfSemicircle,
  areaOfQuarterCircle,
  radiusFromDiameter,
} from '../utils/circleMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));


// Helper to shuffle array deterministically or pseudo-randomly
function shuffle(array, rng = Math.random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate unique 4 options given correct and candidate distractors
function buildOptions(correct, candidateDistractors, unit = '') {
  const correctStr = `${correct}${unit ? ' ' + unit : ''}`;
  const seen = new Set([correctStr]);
  const opts = [correctStr];

  for (const d of candidateDistractors) {
    const dStr = `${d}${unit ? ' ' + unit : ''}`;
    if (!seen.has(dStr) && opts.length < 4 && typeof d === 'number' && !isNaN(d) && d > 0) {
      seen.add(dStr);
      opts.push(dStr);
    }
  }

  // If we still need options, generate reasonable offsets
  let step = 1;
  while (opts.length < 4) {
    const num = typeof correct === 'number' ? correct : parseFloat(correct);
    const candidate = +(num + step * (opts.length % 2 === 0 ? 10 : -10)).toFixed(2);
    if (candidate > 0) {
      const cStr = `${candidate}${unit ? ' ' + unit : ''}`;
      if (!seen.has(cStr)) {
        seen.add(cStr);
        opts.push(cStr);
      }
    }
    step += 2;
  }

  return { options: shuffle(opts), correctAnswer: correctStr };
}

// World generators
export function generateQuestions() {
  const questions = [];
  let globalId = 1;

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 0: Circle Basics Court (Basics: Radius, Diameter, Pi)
  // ─────────────────────────────────────────────────────────────────────────────
  const w0Specs = [
    { r: 7, type: 'r_to_d', q: 'A circular coin has a radius of 7 cm. What is its diameter?' },
    { d: 24, type: 'd_to_r', q: 'A circular clock face has a diameter of 24 cm. What is its radius?' },
    { r: 15, type: 'r_to_d', q: 'A circular pizza base has a radius of 15 cm. What is its diameter?' },
    { d: 40, type: 'd_to_r', q: 'A bicycle wheel has a diameter of 40 cm. What is its radius?' },
    { r: 9, type: 'r_to_d', q: 'A round table has a radius of 9 m. What is its diameter?' },
    { d: 18, type: 'd_to_r', q: 'A round swimming pool has a diameter of 18 m. What is its radius?' },
    { r: 3.5, type: 'r_to_d', q: 'A circular badge has a radius of 3.5 cm. What is its diameter?' },
    { d: 50, type: 'd_to_r', q: 'A circular garden bed has a diameter of 50 m. What is its radius?' },
    {
      type: 'pi_definition',
      q: 'What is π (Pi) defined as in mathematics?',
      correct: 'Circumference ÷ Diameter',
      distractors: ['Area ÷ Radius', 'Diameter ÷ Radius', 'Radius × 2'],
      expl: 'Pi (π) is the fixed ratio of the circumference of any circle to its diameter: π = Circumference ÷ Diameter.',
      hint1: 'Think about what you wrap around the circle compared to what goes straight across.',
      hint2: 'Circumference divided by diameter always equals approximately 3.14.',
    },
    {
      type: 'formula_recall',
      q: 'Which is the correct formula for the area of a circle with radius r?',
      correct: 'π × r²',
      distractors: ['2 × π × r', 'π × d', '2 × r²'],
      expl: 'The area of a circle is calculated as π × r × r, which is written as π × r².',
      hint1: '2 × π × r gives the circumference (perimeter), not the area inside.',
      hint2: 'Area involves squaring the radius: π times radius squared.',
    },
  ];

  w0Specs.forEach((spec) => {
    const id = globalId++;
    if (spec.type === 'r_to_d') {
      const correct = spec.r * 2;
      const unit = spec.q.includes(' m.') ? 'm' : 'cm';
      const distractors = [spec.r, +(spec.r / 2).toFixed(1), spec.r * 4];
      const { options, correctAnswer } = buildOptions(correct, distractors, unit);
      questions.push({
        id,
        districtId: 0,
        category: 'RADIUS & DIAMETER',
        visual: 'circle-radius',
        questionText: spec.q,
        options,
        correctAnswer,
        explanation: `Diameter is twice the radius: d = 2 × r = 2 × ${spec.r} = ${correct} ${unit}.`,
        hint1: 'The diameter goes all the way across the circle through the centre.',
        hint2: `Multiply the radius by 2: 2 × ${spec.r} = ${correct} ${unit}.`,
        visualData: { radius: spec.r, unit },
      });
    } else if (spec.type === 'd_to_r') {
      const correct = spec.d / 2;
      const unit = spec.q.includes(' m.') ? 'm' : 'cm';
      const distractors = [spec.d, spec.d * 2, +(spec.d / 4).toFixed(1)];
      const { options, correctAnswer } = buildOptions(correct, distractors, unit);
      questions.push({
        id,
        districtId: 0,
        category: 'RADIUS & DIAMETER',
        visual: 'circle-diameter',
        questionText: spec.q,
        options,
        correctAnswer,
        explanation: `Radius is half of the diameter: r = d ÷ 2 = ${spec.d} ÷ 2 = ${correct} ${unit}.`,
        hint1: 'The radius only goes from the centre to the edge.',
        hint2: `Divide the diameter by 2: ${spec.d} ÷ 2 = ${correct} ${unit}.`,
        visualData: { diameter: spec.d, unit },
      });
    } else {
      questions.push({
        id,
        districtId: 0,
        category: 'CIRCLE BASICS',
        visual: 'circle-radius',
        questionText: spec.q,
        options: shuffle([spec.correct, ...spec.distractors]),
        correctAnswer: spec.correct,
        explanation: spec.expl,
        hint1: spec.hint1,
        hint2: spec.hint2,
        visualData: { radius: 10, unit: 'cm' },
      });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 1: Garden Grove (Area from Given Radius)
  // ─────────────────────────────────────────────────────────────────────────────
  const w1Radii = [7, 10, 14, 5, 21, 20, 28, 4, 35, 6];
  w1Radii.forEach((r) => {
    const id = globalId++;
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const unit = r > 10 ? 'm' : 'cm';
    const area = areaOfCircle(r, piVal);

    // Distractor misconceptions:
    // 1. Used 2*pi*r (circumference instead of area)
    const circum = Math.round(2 * piVal * r * 100) / 100;
    // 2. Forgot to square (pi * r * 2)
    const forgotSq = Math.round(piVal * r * 2 * 100) / 100;
    // 3. Multiplied diameter squared: pi * (2r)^2
    const usedDiam = Math.round(piVal * (2 * r) * (2 * r) * 100) / 100;
    // 4. Used wrong pi
    const wrongPi = Math.round((piVal === 3.14 ? (22 / 7) * r * r : 3.14 * r * r) * 100) / 100;

    const { options, correctAnswer } = buildOptions(area, [circum, forgotSq, wrongPi, usedDiam], `${unit}²`);

    questions.push({
      id,
      districtId: 1,
      category: 'AREA FROM RADIUS',
      visual: 'circle-radius',
      questionText: `A circular garden has a radius of ${r} ${unit}. Using π ≈ ${piLbl}, find its area.`,
      options,
      correctAnswer,
      explanation: `Area = π × r² = ${piLbl} × ${r} × ${r} = ${area} ${unit}².`,
      hint1: `Use the formula Area = π × r × r. Here, r = ${r} ${unit}.`,
      hint2: `Multiply: ${piLbl} × ${r} = ${+(piVal * r).toFixed(2)}, then multiply by ${r} again to get ${area} ${unit}².`,
      visualData: { radius: r, unit, piUsed: piLbl, area },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 2: Pizza Parlour (Area from Given Diameter)
  // ─────────────────────────────────────────────────────────────────────────────
  const w2Diameters = [14, 20, 28, 10, 42, 40, 56, 8, 70, 12];
  w2Diameters.forEach((d) => {
    const id = globalId++;
    const r = radiusFromDiameter(d);
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const unit = 'cm';
    const area = areaOfCircle(r, piVal);

    // Distractor misconceptions:
    // 1. Forgot to halve diameter: used pi * d^2
    const usedDDirectly = Math.round(piVal * d * d * 100) / 100;
    // 2. Circumference: pi * d
    const circum = Math.round(piVal * d * 100) / 100;
    // 3. Half area
    const halfArea = +(area / 2).toFixed(2);

    const { options, correctAnswer } = buildOptions(area, [usedDDirectly, circum, halfArea], `${unit}²`);

    questions.push({
      id,
      districtId: 2,
      category: 'AREA FROM DIAMETER',
      visual: 'circle-diameter',
      questionText: `A freshly baked pizza has a diameter of ${d} cm. Using π ≈ ${piLbl}, calculate the area of the pizza.`,
      options,
      correctAnswer,
      explanation: `First find the radius: r = ${d} ÷ 2 = ${r} cm. Then Area = π × r² = ${piLbl} × ${r} × ${r} = ${area} cm².`,
      hint1: `Always halve the diameter first to get the radius! Radius = ${d} ÷ 2 = ${r} cm.`,
      hint2: `Now use Area = π × r²: ${piLbl} × ${r} × ${r} = ${area} cm².`,
      visualData: { diameter: d, radius: r, unit, piUsed: piLbl, area },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 3: Clock Tower Plaza (Area of a Semicircle)
  // ─────────────────────────────────────────────────────────────────────────────
  const w3Specs = [
    { r: 10, d: null, u: 'cm' },
    { r: 14, d: null, u: 'm' },
    { r: 20, d: null, u: 'cm' },
    { r: 7, d: null, u: 'm' },
    { r: 6, d: null, u: 'cm' },
    { r: 28, d: null, u: 'm' },
    { r: 4, d: null, u: 'cm' },
    { r: 5, d: null, u: 'm' },
    { r: 21, d: null, u: 'm' },
    { r: 8, d: null, u: 'cm' },
  ];
  w3Specs.forEach((spec) => {
    const id = globalId++;
    const r = spec.r;
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const areaFull = areaOfCircle(r, piVal);
    const areaSemi = areaOfSemicircle(r, piVal);

    // Distractor misconceptions:
    // 1. Forgot to divide by 2 (gave full circle area)
    const fullCircle = areaFull;
    // 2. Divided by 4 (quarter circle instead)
    const quarter = +(areaFull / 4).toFixed(2);
    // 3. Circumference
    const circum = +(Math.PI * r).toFixed(2);

    const { options, correctAnswer } = buildOptions(areaSemi, [fullCircle, quarter, circum], `${spec.u}²`);

    questions.push({
      id,
      districtId: 3,
      category: 'SEMICIRCLE AREA',
      visual: 'semicircle',
      questionText: `A semicircular stained-glass clock window has a radius of ${r} ${spec.u}. Using π ≈ ${piLbl}, find its area.`,
      options,
      correctAnswer,
      explanation: `A semicircle is half a full circle. Area = ½ × π × r² = ½ × ${piLbl} × ${r} × ${r} = ½ × ${areaFull} = ${areaSemi} ${spec.u}².`,
      hint1: `Calculate the full circle area (π × r²), then divide by 2 for the semicircle.`,
      hint2: `Full circle: ${piLbl} × ${r}² = ${areaFull}. Semicircle: ${areaFull} ÷ 2 = ${areaSemi} ${spec.u}².`,
      visualData: { radius: r, unit: spec.u, piUsed: piLbl, area: areaSemi },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 4: Wheel Works Garage (Area of a Quarter Circle)
  // ─────────────────────────────────────────────────────────────────────────────
  const w4Specs = [
    { r: 14, u: 'cm' },
    { r: 10, u: 'm' },
    { r: 7, u: 'cm' },
    { r: 20, u: 'm' },
    { r: 28, u: 'cm' },
    { r: 6, u: 'cm' },
    { r: 21, u: 'm' },
    { r: 8, u: 'cm' },
    { r: 35, u: 'm' },
    { r: 4, u: 'cm' },
  ];
  w4Specs.forEach((spec) => {
    const id = globalId++;
    const r = spec.r;
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const full = areaOfCircle(r, piVal);
    const quarter = areaOfQuarterCircle(r, piVal);
    const semi = areaOfSemicircle(r, piVal);

    // Distractor misconceptions:
    // 1. Divided by 2 instead of 4 (semicircle)
    // 2. Full circle area
    // 3. Perimeter instead

    const { options, correctAnswer } = buildOptions(quarter, [semi, full, +(full / 3).toFixed(2)], `${spec.u}²`);

    questions.push({
      id,
      districtId: 4,
      category: 'QUARTER CIRCLE AREA',
      visual: 'quarter-circle',
      questionText: `A decorative quadrant plate has a radius of ${r} ${spec.u}. Using π ≈ ${piLbl}, what is the area of this quarter circle?`,
      options,
      correctAnswer,
      explanation: `A quarter circle is ¼ of a full circle. Area = ¼ × π × r² = ¼ × ${piLbl} × ${r} × ${r} = ¼ × ${full} = ${quarter} ${spec.u}².`,
      hint1: `A quarter circle is one-fourth (¼) of a full circle.`,
      hint2: `Full area = ${full}. Quarter area = ${full} ÷ 4 = ${quarter} ${spec.u}².`,
      visualData: { radius: r, unit: spec.u, piUsed: piLbl, area: quarter },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 5: Mystery Radius Lab (Working Backwards from Area)
  // ─────────────────────────────────────────────────────────────────────────────
  const w5Specs = [
    { r: 10, u: 'cm' },
    { r: 7, u: 'm' },
    { r: 5, u: 'cm' },
    { r: 14, u: 'm' },
    { r: 20, u: 'cm' },
    { r: 21, u: 'm' },
    { r: 6, u: 'cm' },
    { r: 8, u: 'cm' },
    { r: 28, u: 'm' },
    { r: 4, u: 'cm' },
  ];
  w5Specs.forEach((spec) => {
    const id = globalId++;
    const r = spec.r;
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const area = areaOfCircle(r, piVal);

    const distractors = [r * 2, +(r / 2).toFixed(1), r + 2, r * 3];
    const { options, correctAnswer } = buildOptions(r, distractors, spec.u);

    questions.push({
      id,
      districtId: 5,
      category: 'REVERSE RADIUS',
      visual: 'reverse-radius',
      questionText: `A circular target has an area of ${area} ${spec.u}². Given that π ≈ ${piLbl}, what is the radius of the target?`,
      options,
      correctAnswer,
      explanation: `Area = π × r². Since Area = ${area}, r² = ${area} ÷ ${piLbl} = ${r * r}. Since ${r} × ${r} = ${r * r}, the radius is ${r} ${spec.u}.`,
      hint1: `Divide the area by π (${piLbl}) to find r² (radius squared).`,
      hint2: `${area} ÷ ${piLbl} = ${r * r}. What number multiplied by itself gives ${r * r}? It's ${r}!`,
      visualData: { area, piUsed: piLbl, unit: spec.u },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 6: Coin & Compass Collectors (Comparing & Scaling Area)
  // ─────────────────────────────────────────────────────────────────────────────
  const w6Specs = [
    {
      q: 'Circle A has a radius of 4 cm. Circle B has a radius of 8 cm (double of A). How many times larger is the area of Circle B than Circle A?',
      correct: '4 times',
      distractors: ['2 times', '8 times', '16 times'],
      expl: 'When the radius is doubled (×2), the area increases by 2² = 4 times! Area is proportional to the square of the radius.',
      hint1: 'Remember that the area formula squares the radius: Area = π × r².',
      hint2: 'Doubling radius means (2r)² = 4r², so the area is 4 times larger!',
      visual: 'comparison',
      vData: { r1: 4, r2: 8, unit: 'cm' },
    },
    {
      q: 'Circle X has a radius of 3 cm. Circle Y has a radius of 9 cm (triple of X). How many times larger is the area of Circle Y than Circle X?',
      correct: '9 times',
      distractors: ['3 times', '6 times', '27 times'],
      expl: 'Tripling the radius (×3) multiplies the area by 3² = 9 times!',
      hint1: 'If the radius triples, square the scale factor: 3² = 9.',
      hint2: '3 × 3 = 9 times.',
      visual: 'comparison',
      vData: { r1: 3, r2: 9, unit: 'cm' },
    },
    {
      q: 'Coin A has a diameter of 2 cm. Coin B has a diameter of 4 cm. How many times bigger is the area of Coin B compared to Coin A?',
      correct: '4 times',
      distractors: ['2 times', '8 times', '16 times'],
      expl: 'Since diameter is doubled, radius is also doubled. Doubling the radius makes the area 2² = 4 times bigger.',
      hint1: 'Doubling the diameter also doubles the radius.',
      hint2: 'When radius is multiplied by 2, area is multiplied by 2 × 2 = 4.',
      visual: 'comparison',
      vData: { r1: 1, r2: 2, unit: 'cm' },
    },
    {
      q: 'Circle P has radius 5 cm. Circle Q has radius 10 cm. If Circle P has an area of 78.5 cm², what is the area of Circle Q?',
      correct: '314 cm²',
      distractors: ['157 cm²', '785 cm²', '235.5 cm²'],
      expl: 'Radius is doubled, so the area is 4 times as large: 78.5 × 4 = 314 cm².',
      hint1: 'Doubling radius quadruples the area (multiply by 4).',
      hint2: '78.5 × 4 = 314 cm².',
      visual: 'comparison',
      vData: { r1: 5, r2: 10, unit: 'cm' },
    },
    {
      q: 'Circle M has an area of 50 cm². If its radius is doubled, what will its new area be?',
      correct: '200 cm²',
      distractors: ['100 cm²', '150 cm²', '250 cm²'],
      expl: 'When radius is doubled, area becomes 4 times bigger: 50 × 4 = 200 cm².',
      hint1: 'Do not just multiply by 2! Radius is squared in the formula.',
      hint2: 'Multiply the original area by 4: 50 × 4 = 200 cm².',
      visual: 'comparison',
      vData: { r1: 4, r2: 8, unit: 'cm' },
    },
    {
      q: 'A large pizza has a radius of 14 cm, while a small pizza has a radius of 7 cm. Using π ≈ 22/7, how much greater is the area of the large pizza?',
      correct: '462 cm²',
      distractors: ['154 cm²', '616 cm²', '308 cm²'],
      expl: 'Area of large pizza = 22/7 × 14² = 616 cm². Area of small pizza = 22/7 × 7² = 154 cm². Difference = 616 − 154 = 462 cm².',
      hint1: 'Calculate both areas: Large = 616 cm², Small = 154 cm².',
      hint2: 'Subtract small from large: 616 − 154 = 462 cm².',
      visual: 'comparison',
      vData: { r1: 7, r2: 14, unit: 'cm' },
    },
    {
      q: 'If the radius of a circle is halved (divided by 2), what fraction does its area become?',
      correct: 'One quarter (1/4)',
      distractors: ['One half (1/2)', 'One eighth (1/8)', 'It stays the same'],
      expl: 'Halving the radius means the new area is (½)² = ¼ of the original area.',
      hint1: 'Square the fraction: (1/2) × (1/2).',
      hint2: '1/2 squared equals 1/4.',
      visual: 'comparison',
      vData: { r1: 10, r2: 5, unit: 'cm' },
    },
    {
      q: 'Circle 1 has radius 6 cm. Circle 2 has radius 12 cm. What is the ratio of Area 1 to Area 2 in simplest form?',
      correct: '1 : 4',
      distractors: ['1 : 2', '1 : 8', '1 : 6'],
      expl: 'Ratio of radii is 6:12 = 1:2. Ratio of areas is 1² : 2² = 1 : 4.',
      hint1: 'The ratio of areas is the ratio of radii squared.',
      hint2: '1² : 2² = 1 : 4.',
      visual: 'comparison',
      vData: { r1: 6, r2: 12, unit: 'cm' },
    },
    {
      q: 'A sprinkler sprays water in a circle of radius 3 m. If its reach is extended to 6 m, how many times more grass area does it water?',
      correct: '4 times',
      distractors: ['2 times', '3 times', '8 times'],
      expl: 'Radius is multiplied by 2, so the area watered increases by 2² = 4 times.',
      hint1: 'When the reach (radius) doubles, the circular area quadruples.',
      hint2: '2 squared is 4 times.',
      visual: 'comparison',
      vData: { r1: 3, r2: 6, unit: 'm' },
    },
    {
      q: 'Which circle has the largest area?',
      correct: 'Circle C: radius = 8 cm',
      distractors: ['Circle A: diameter = 14 cm', 'Circle B: radius = 7 cm', 'Circle D: diameter = 15 cm'],
      expl: 'Circle C has radius 8 cm (diameter 16 cm). Circle A has r=7 cm, Circle B has r=7 cm, Circle D has r=7.5 cm. 8 cm is the largest radius, giving the greatest area.',
      hint1: 'Find the radius of each option to compare them directly.',
      hint2: 'Circle C has radius 8 cm, which is greater than 7 cm and 7.5 cm.',
      visual: 'comparison',
      vData: { r1: 7, r2: 8, unit: 'cm' },
    },
  ];
  w6Specs.forEach((spec) => {
    const id = globalId++;
    questions.push({
      id,
      districtId: 6,
      category: 'COMPARE & SCALE',
      visual: spec.visual,
      questionText: spec.q,
      options: shuffle([spec.correct, ...spec.distractors]),
      correctAnswer: spec.correct,
      explanation: spec.expl,
      hint1: spec.hint1,
      hint2: spec.hint2,
      visualData: spec.vData,
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 7: Running Track Stadium (Composite Figures: Track Shapes)
  // ─────────────────────────────────────────────────────────────────────────────
  const w7Specs = [
    { L: 80, r: 10, u: 'm' },
    { L: 100, r: 14, u: 'm' },
    { L: 60, r: 7, u: 'm' },
    { L: 50, r: 10, u: 'm' },
    { L: 70, r: 14, u: 'm' },
    { L: 40, r: 5, u: 'm' },
    { L: 90, r: 20, u: 'm' },
    { L: 50, r: 7, u: 'm' },
    { L: 120, r: 10, u: 'm' },
    { L: 80, r: 14, u: 'm' },
  ];
  w7Specs.forEach((spec) => {
    const id = globalId++;
    const { L, r, u } = spec;
    const piVal = pickPi(r);
    const piLbl = pickPiLabel(r);
    const rectArea = L * (2 * r);
    const circleArea = areaOfCircle(r, piVal);
    const totalArea = +(rectArea + circleArea).toFixed(2);

    // Distractor misconceptions:
    // 1. Only 1 semicircle added instead of 2
    const oneSemi = +(rectArea + circleArea / 2).toFixed(2);
    // 2. Used L * r for rectangle
    const halfRect = +(L * r + circleArea).toFixed(2);
    // 3. Just rectangle area
    const justRect = rectArea;

    const { options, correctAnswer } = buildOptions(totalArea, [oneSemi, halfRect, justRect], `${u}²`);

    questions.push({
      id,
      districtId: 7,
      category: 'COMPOSITE FIGURE',
      visual: 'composite-track',
      questionText: `A running track is formed by a central rectangle of length ${L} ${u} and width ${2 * r} ${u}, with a semicircle of radius ${r} ${u} attached at each end. Using π ≈ ${piLbl}, what is the total area of the track?`,
      options,
      correctAnswer,
      explanation: `Rectangle area = ${L} × ${2 * r} = ${rectArea} ${u}². The two semicircles combine to form 1 full circle of radius ${r} ${u}: Area = ${piLbl} × ${r}² = ${circleArea} ${u}². Total Area = ${rectArea} + ${circleArea} = ${totalArea} ${u}².`,
      hint1: `Notice that the two semicircular ends together make one full circle of radius ${r} ${u}!`,
      hint2: `Add the rectangle area (${rectArea} ${u}²) to the full circle area (${circleArea} ${u}²) = ${totalArea} ${u}².`,
      visualData: { length: L, radius: r, width: 2 * r, unit: u, piUsed: piLbl, totalArea },
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 8: Pattern & Design Studio (Shaded / Remaining Area)
  // ─────────────────────────────────────────────────────────────────────────────
  const w8Specs = [
    { type: 'circle_in_square', side: 14, r: 7, u: 'cm' },
    { type: 'circle_in_square', side: 20, r: 10, u: 'cm' },
    { type: 'ring', rOuter: 10, rInner: 6, u: 'cm' },
    { type: 'ring', rOuter: 14, rInner: 7, u: 'm' },
    { type: 'circle_in_square', side: 28, r: 14, u: 'cm' },
    { type: 'ring', rOuter: 20, rInner: 10, u: 'cm' },
    { type: 'rect_minus_semi', length: 20, width: 10, r: 10, u: 'cm' },
    { type: 'circle_in_square', side: 10, r: 5, u: 'cm' },
    { type: 'ring', rOuter: 21, rInner: 14, u: 'm' },
    { type: 'rect_minus_semi', length: 28, width: 14, r: 14, u: 'm' },
  ];
  w8Specs.forEach((spec) => {
    const id = globalId++;
    if (spec.type === 'circle_in_square') {
      const { side, r, u } = spec;
      const piVal = pickPi(r);
      const piLbl = pickPiLabel(r);
      const sqArea = side * side;
      const cArea = areaOfCircle(r, piVal);
      const shaded = +(sqArea - cArea).toFixed(2);

      const distractors = [cArea, +(sqArea + cArea).toFixed(2), +(sqArea - cArea / 2).toFixed(2)];
      const { options, correctAnswer } = buildOptions(shaded, distractors, `${u}²`);

      questions.push({
        id,
        districtId: 8,
        category: 'SHADED AREA',
        visual: 'shaded-region',
        questionText: `A square metal plate has sides of ${side} ${u}. A circular hole of radius ${r} ${u} is cut out from its centre. Using π ≈ ${piLbl}, what is the area of the remaining plate?`,
        options,
        correctAnswer,
        explanation: `Area of square = ${side} × ${side} = ${sqArea} ${u}². Area of circle hole = ${piLbl} × ${r}² = ${cArea} ${u}². Remaining shaded area = ${sqArea} − ${cArea} = ${shaded} ${u}².`,
        hint1: `Calculate the area of the square first, then subtract the circle's area.`,
        hint2: `Square = ${sqArea} ${u}², Circle = ${cArea} ${u}². Subtract: ${sqArea} − ${cArea} = ${shaded} ${u}².`,
        visualData: { shapeType: 'circle-in-square', side, radius: r, unit: u, piUsed: piLbl },
      });
    } else if (spec.type === 'ring') {
      const { rOuter, rInner, u } = spec;
      const piVal = pickPi(rOuter);
      const piLbl = pickPiLabel(rOuter);
      const outArea = areaOfCircle(rOuter, piVal);
      const inArea = areaOfCircle(rInner, piVal);
      const shaded = +(outArea - inArea).toFixed(2);

      // Misconceptions: subtract radii first then square
      const flawedSubFirst = +(piVal * Math.pow(rOuter - rInner, 2)).toFixed(2);
      const addBoth = +(outArea + inArea).toFixed(2);

      const { options, correctAnswer } = buildOptions(shaded, [flawedSubFirst, addBoth, outArea], `${u}²`);

      questions.push({
        id,
        districtId: 8,
        category: 'SHADED AREA',
        visual: 'shaded-region',
        questionText: `A circular ring (washer) has an outer radius of ${rOuter} ${u} and an inner radius of ${rInner} ${u}. Using π ≈ ${piLbl}, find the area of the shaded ring.`,
        options,
        correctAnswer,
        explanation: `Area of outer circle = ${piLbl} × ${rOuter}² = ${outArea} ${u}². Area of inner circle = ${piLbl} × ${rInner}² = ${inArea} ${u}². Area of ring = ${outArea} − ${inArea} = ${shaded} ${u}².`,
        hint1: `Subtract the inner circle's area from the outer circle's area.`,
        hint2: `Outer (${outArea}) − Inner (${inArea}) = ${shaded} ${u}². Remember: do not subtract radii before squaring!`,
        visualData: { shapeType: 'ring', rOuter, rInner, unit: u, piUsed: piLbl },
      });
    } else {
      // rect_minus_semi
      const { length, width, r, u } = spec;
      const piVal = pickPi(r);
      const piLbl = pickPiLabel(r);
      const rectArea = length * width;
      const semiArea = areaOfSemicircle(r, piVal);
      const shaded = +(rectArea - semiArea).toFixed(2);

      const distractors = [rectArea, +(rectArea - semiArea * 2).toFixed(2), +(rectArea + semiArea).toFixed(2)];
      const { options, correctAnswer } = buildOptions(shaded, distractors, `${u}²`);

      questions.push({
        id,
        districtId: 8,
        category: 'SHADED AREA',
        visual: 'shaded-region',
        questionText: `A rectangle of ${length} ${u} by ${width} ${u} has a semicircular section of radius ${r} ${u} cut out. Using π ≈ ${piLbl}, find the remaining shaded area.`,
        options,
        correctAnswer,
        explanation: `Rectangle area = ${length} × ${width} = ${rectArea} ${u}². Semicircle area = ½ × ${piLbl} × ${r}² = ${semiArea} ${u}². Shaded area = ${rectArea} − ${semiArea} = ${shaded} ${u}².`,
        hint1: `Subtract the area of the semicircle cutout from the total rectangle area.`,
        hint2: `${rectArea} − ${semiArea} = ${shaded} ${u}².`,
        visualData: { shapeType: 'rect-minus-semi', length, width, radius: r, unit: u, piUsed: piLbl },
      });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // WORLD 9: Grand Circular Showcase (Mixed Review & Word Problems)
  // ─────────────────────────────────────────────────────────────────────────────
  const w9Specs = [
    {
      q: 'A circular lawn has a radius of 10 m. It costs $3 per square metre to turf the lawn with grass. Using π ≈ 3.14, what is the total cost of turfing?',
      correct: '$942',
      distractors: ['$314', '$628', '$1256'],
      expl: 'Area of lawn = 3.14 × 10 × 10 = 314 m². Total cost = 314 × $3 = $942.',
      hint1: 'Find the area of the circular lawn first: Area = π × r².',
      hint2: 'Area = 314 m². Multiply by $3: 314 × 3 = $942.',
      visual: 'circle-radius',
      vData: { radius: 10, unit: 'm', piUsed: '3.14' },
    },
    {
      q: 'A circular garden bed has a diameter of 14 m. Special mulch costs $5 per square metre. Using π ≈ 22/7, find the cost of mulching the garden bed.',
      correct: '$770',
      distractors: ['$154', '$3080', '$616'],
      expl: 'Radius = 14 ÷ 2 = 7 m. Area = 22/7 × 7 × 7 = 154 m². Cost = 154 × $5 = $770.',
      hint1: 'Halve the diameter to get radius: 14 ÷ 2 = 7 m.',
      hint2: 'Area = 154 m². 154 × $5 = $770.',
      visual: 'circle-diameter',
      vData: { diameter: 14, radius: 7, unit: 'm', piUsed: '22/7' },
    },
    {
      q: 'A circular swimming pool with a radius of 7 m is surrounded by a 1 m wide paved path (outer radius = 8 m). Using π ≈ 22/7 for the pool, what is the area of the pool itself?',
      correct: '154 m²',
      distractors: ['44 m²', '616 m²', '308 m²'],
      expl: 'Area of the pool = 22/7 × 7 × 7 = 154 m².',
      hint1: 'The question asks for the area of the pool itself (radius 7 m).',
      hint2: 'Area = 22/7 × 7² = 154 m².',
      visual: 'circle-radius',
      vData: { radius: 7, unit: 'm', piUsed: '22/7' },
    },
    {
      q: 'Arjun cuts a circular pizza of radius 14 cm into 8 equal slices. Using π ≈ 22/7, what is the area of one slice of pizza?',
      correct: '77 cm²',
      distractors: ['616 cm²', '154 cm²', '44 cm²'],
      expl: 'Total pizza area = 22/7 × 14 × 14 = 616 cm². Area of 1 slice = 616 ÷ 8 = 77 cm².',
      hint1: 'Find the area of the whole pizza first: 22/7 × 14² = 616 cm².',
      hint2: 'Divide the total area by 8 slices: 616 ÷ 8 = 77 cm².',
      visual: 'circle-radius',
      vData: { radius: 14, unit: 'cm', piUsed: '22/7' },
    },
    {
      q: 'A semicircular rug has a diameter of 20 cm. Using π ≈ 3.14, what is the area of the rug?',
      correct: '157 cm²',
      distractors: ['314 cm²', '628 cm²', '78.5 cm²'],
      expl: 'Radius = 20 ÷ 2 = 10 cm. Full circle area = 3.14 × 10² = 314 cm². Semicircle = 314 ÷ 2 = 157 cm².',
      hint1: 'Halve the diameter to get radius = 10 cm.',
      hint2: 'Full area = 314 cm². Semicircle area = 314 ÷ 2 = 157 cm².',
      visual: 'semicircle',
      vData: { radius: 10, diameter: 20, unit: 'cm', piUsed: '3.14' },
    },
    {
      q: 'A square tabletop has sides of 20 cm. A circular coaster with radius 5 cm is placed on it. Using π ≈ 3.14, what area of the tabletop is NOT covered by the coaster?',
      correct: '321.5 cm²',
      distractors: ['78.5 cm²', '400 cm²', '300 cm²'],
      expl: 'Square area = 20 × 20 = 400 cm². Coaster area = 3.14 × 5² = 78.5 cm². Uncovered area = 400 − 78.5 = 321.5 cm².',
      hint1: 'Subtract the coaster area from the square tabletop area.',
      hint2: '400 − 78.5 = 321.5 cm².',
      visual: 'shaded-region',
      vData: { shapeType: 'circle-in-square', side: 20, radius: 5, unit: 'cm' },
    },
    {
      q: 'Zoe has two circular plates. Plate A has a radius of 6 cm, and Plate B has a radius of 12 cm. How many times more food area does Plate B have compared to Plate A?',
      correct: '4 times',
      distractors: ['2 times', '6 times', '8 times'],
      expl: 'Plate B has twice the radius of Plate A. Area scales with the square of radius: 2² = 4 times.',
      hint1: 'When the radius is multiplied by 2, area is multiplied by 2².',
      hint2: '2 × 2 = 4 times.',
      visual: 'comparison',
      vData: { r1: 6, r2: 12, unit: 'cm' },
    },
    {
      q: 'A circular fountain has an area of 616 m². Using π ≈ 22/7, what is the diameter of the fountain?',
      correct: '28 m',
      distractors: ['14 m', '7 m', '56 m'],
      expl: 'Area = 22/7 × r² = 616. r² = 616 × 7 ÷ 22 = 196. Radius = 14 m. Therefore, diameter = 14 × 2 = 28 m.',
      hint1: 'Find the radius first: r² = 196, so r = 14 m.',
      hint2: 'Remember the question asks for DIAMETER: 14 × 2 = 28 m!',
      visual: 'reverse-radius',
      vData: { area: 616, unit: 'm', piUsed: '22/7' },
    },
    {
      q: 'A running track has straight sides of 60 m and semicircular ends with radius 7 m. Using π ≈ 22/7, find the total area inside the track boundary.',
      correct: '994 m²',
      distractors: ['840 m²', '154 m²', '917 m²'],
      expl: 'Rectangle = 60 × (2 × 7) = 60 × 14 = 840 m². Two semicircles = 1 full circle of radius 7 = 22/7 × 7² = 154 m². Total area = 840 + 154 = 994 m².',
      hint1: 'Rectangle width is 2 × radius = 14 m. Rectangle area = 60 × 14 = 840 m².',
      hint2: 'Two semicircles = 1 circle = 154 m². Total = 840 + 154 = 994 m².',
      visual: 'composite-track',
      vData: { length: 60, radius: 7, width: 14, unit: 'm', piUsed: '22/7' },
    },
    {
      q: 'A quarter-circle fan with radius 20 cm is opened. Using π ≈ 3.14, what is the surface area of the opened fan?',
      correct: '314 cm²',
      distractors: ['1256 cm²', '628 cm²', '157 cm²'],
      expl: 'Full circle area = 3.14 × 20² = 1256 cm². Quarter circle = 1256 ÷ 4 = 314 cm².',
      hint1: 'Calculate full circle area: 3.14 × 400 = 1256 cm².',
      hint2: 'Divide by 4 for a quarter circle: 1256 ÷ 4 = 314 cm².',
      visual: 'quarter-circle',
      vData: { radius: 20, unit: 'cm', piUsed: '3.14' },
    },
  ];
  w9Specs.forEach((spec) => {
    const id = globalId++;
    questions.push({
      id,
      districtId: 9,
      category: 'WORD PROBLEM',
      visual: spec.visual,
      questionText: spec.q,
      options: shuffle([spec.correct, ...spec.distractors]),
      correctAnswer: spec.correct,
      explanation: spec.expl,
      hint1: spec.hint1,
      hint2: spec.hint2,
      visualData: spec.vData,
    });
  });

  return questions;
}

export const questionBank = generateQuestions();
export default questionBank;
