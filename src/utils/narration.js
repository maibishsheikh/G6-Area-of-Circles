// src/utils/narration.js
// Narration script builder for CircleQuest
// Strictly matches on-screen text 1:1, spelling mathematical symbols into natural spoken language

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to CircleQuest! Let's investigate the big circular mystery!"),
    say("A round pizza has a radius of ten centimetres. A square pizza box has sides of twenty centimetres."),
    ask("Which uses more of the box — the delicious pizza, or the empty corners?"),
    cheer("By the end of today, you will be able to calculate this exactly! Let's investigate!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    // Panel 0: The Round Table Puzzle
    [
      say("Zoe and Arjun stood in the school hall preparing for the Design and Discovery Fair."),
      say("They had to build circular display tables and posters."),
      think("Wait, Arjun asked, measuring a big round tabletop, is ten centimetres the radius or the diameter?"),
      say("Zoe smiled and showed him: The diameter goes straight across through the centre. The radius is from the centre to the edge — exactly half the diameter!"),
      cheer("If the diameter is twenty centimetres, the radius is ten centimetres!"),
    ],
    // Panel 1: Tally's Pi Secret
    [
      say("Mascot Tally the Owl swooped down onto the workbench with a brass compass and a tape measure."),
      cheer("Hoo-hoo! Did you know every single circle in the universe shares the same magic secret? Tally asked."),
      say("If you wrap a tape around any circle and divide its circumference by its diameter, you always get the exact same number: Pi!"),
      say("Pi is approximately three point one four, or twenty-two over seven when working with multiples of seven."),
    ],
    // Panel 2: Unrolling the Circle
    [
      think("How do we find the flat area inside a circle? Arjun asked, scratching his head."),
      instruct("Watch this! Let's slice our circular mat into many thin wedges, like a pizza, and rearrange them side-by-side, Tally beamed."),
      say("As Arjun interlocked the slices, their eyes widened."),
      cheer("Look! It turns into a rectangle! The height is the radius, and the base is half the circumference, which is pi times radius."),
      cheer("So the area is base times height: pi times radius squared!"),
    ],
    // Panel 3: The Pizza Problem
    [
      say("At lunchtime, the team ordered a celebratory round pizza with a radius of ten centimetres in a square box of twenty centimetres by twenty centimetres."),
      ask("Remember the Wonder question? Zoe grinned."),
      say("The pizza area is pi times radius squared, which is three point one four times ten squared, equal to three hundred and fourteen square centimetres!"),
      say("The square box area is twenty times twenty, equal to four hundred square centimetres."),
      cheer("The empty corners take up only eighty-six square centimetres. The pizza takes up most of the box!"),
    ],
    // Panel 4: The Running Track
    [
      say("For their next exhibit, they had to design a model sports arena with a running track."),
      say("The track is a rectangle eighty metres long and twenty metres wide, with a semicircle on each end, Arjun noted."),
      think("Wait! Two semicircles put together make one complete circle of radius ten metres!"),
      say("The rectangle area is sixteen hundred square metres, and the full circle area is three hundred and fourteen square metres."),
      cheer("Total area is nineteen hundred and fourteen square metres!"),
    ],
    // Panel 5: Fair Day Triumph!
    [
      say("The doors opened and judges crowded around their circular design booth!"),
      say("Zoe and Arjun expertly calculated areas of circles, semicircles, quarter circles, and shaded ring borders with absolute confidence."),
      cheer("Outstanding work! the head judge announced, awarding them the Golden Compass trophy."),
      cheer("You have mastered the geometry of circles! Now it is your turn to enter the simulation labs!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station A — The Slice and Discover Lab!"),
      instruct("Drag the slider to increase the number of slices from four up to sixty-four. Watch the slices unroll into a rectangle, revealing why the area formula is pi times radius squared!"),
    ],
    [
      instruct("Welcome to Station B — The Garden Designer Mission!"),
      instruct("Design circular flowerbeds to match each target area. Adjust the radius slider to see the formula and area update live!"),
    ],
    [
      instruct("Welcome to Station C — The Running Track Builder Mission!"),
      instruct("Construct a stadium running track with straight length and semicircle radius sliders. Combine the rectangle and two semicircles to hit the target area!"),
    ],
    [
      instruct("Welcome to Station D — The Shaded Region Detective!"),
      instruct("Detective Tally has found engineering blueprints with calculation errors. Inspect the steps, identify the mistake, and choose the correct step!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [ask(questionText)];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! You are an unstoppable circle master! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's exactly right! 🎉")];
}

export function playWrongNarration() {
  return [think("Not quite — check the hint, check your radius squared calculation, and try again! 💡")];
}

export function playHint1Narration() {
  return [encourage("Here's your first hint! Look carefully at whether radius or diameter is given.")];
}

export function playHint2Narration() {
  return [encourage("Here's your final clue! Follow the formula step by step: Area equals pi times radius squared.")];
}

export function districtCompleteNarration() {
  return [cheer("World Complete! Spectacular job on this circle world! 🌟")];
}

export function bossStartNarration() {
  return [emphasize("The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!")];
}

export function bossWinNarration() {
  return [cheer("Victory! You defeated the boss and claimed the World Badge! 👑")];
}

export function reflectNarration() {
  return [say("Welcome to the Reflect Phase! Let's review the key circle concepts and check your scorecard! 📓")];
}

export function reflectCompleteNarration() {
  return [cheer("Outstanding! You have mastered area of circles, semicircles, and composite figures! You are a true Circle Master! 🏆")];
}
