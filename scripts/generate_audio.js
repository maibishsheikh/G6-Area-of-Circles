// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files in CircleQuest.
// Strictly follows audio_generation_pipeline specifications with spoken natural language for math terms.

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error('\n❌ Error: VITE_ELEVENLABS_API_KEY is not defined in .env.local or .env.');
  console.log('Please create a .env.local file with: VITE_ELEVENLABS_API_KEY=your_key_here\n');
  process.exit(1);
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

const phrases = [
  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "Welcome to CircleQuest! Let's investigate the big circular mystery!", style: 'statement' },
  { text: "A round pizza has a radius of ten centimetres. A square pizza box has sides of twenty centimetres.", style: 'statement' },
  { text: "Which uses more of the box — the delicious pizza, or the empty corners?", style: 'question' },
  { text: "By the end of today, you will be able to calculate this exactly! Let's investigate!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "Zoe and Arjun stood in the school hall preparing for the Design and Discovery Fair.", style: 'statement' },
  { text: "They had to build circular display tables and posters.", style: 'statement' },
  { text: "Wait, Arjun asked, measuring a big round tabletop, is ten centimetres the radius or the diameter?", style: 'thinking' },
  { text: "Zoe smiled and showed him: The diameter goes straight across through the centre. The radius is from the centre to the edge — exactly half the diameter!", style: 'statement' },
  { text: "If the diameter is twenty centimetres, the radius is ten centimetres!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Mascot Tally the Owl swooped down onto the workbench with a brass compass and a tape measure.", style: 'statement' },
  { text: "Hoo-hoo! Did you know every single circle in the universe shares the same magic secret? Tally asked.", style: 'celebration' },
  { text: "If you wrap a tape around any circle and divide its circumference by its diameter, you always get the exact same number: Pi!", style: 'statement' },
  { text: "Pi is approximately three point one four, or twenty-two over seven when working with multiples of seven.", style: 'statement' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "How do we find the flat area inside a circle? Arjun asked, scratching his head.", style: 'thinking' },
  { text: "Watch this! Let's slice our circular mat into many thin wedges, like a pizza, and rearrange them side-by-side, Tally beamed.", style: 'instruction' },
  { text: "As Arjun interlocked the slices, their eyes widened.", style: 'statement' },
  { text: "Look! It turns into a rectangle! The height is the radius, and the base is half the circumference, which is pi times radius.", style: 'celebration' },
  { text: "So the area is base times height: pi times radius squared!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "At lunchtime, the team ordered a celebratory round pizza with a radius of ten centimetres in a square box of twenty centimetres by twenty centimetres.", style: 'statement' },
  { text: "Remember the Wonder question? Zoe grinned.", style: 'question' },
  { text: "The pizza area is pi times radius squared, which is three point one four times ten squared, equal to three hundred and fourteen square centimetres!", style: 'statement' },
  { text: "The square box area is twenty times twenty, equal to four hundred square centimetres.", style: 'statement' },
  { text: "The empty corners take up only eighty-six square centimetres. The pizza takes up most of the box!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 5 ────────────────────────────────────────────────
  { text: "For their next exhibit, they had to design a model sports arena with a running track.", style: 'statement' },
  { text: "The track is a rectangle eighty metres long and twenty metres wide, with a semicircle on each end, Arjun noted.", style: 'statement' },
  { text: "Wait! Two semicircles put together make one complete circle of radius ten metres!", style: 'thinking' },
  { text: "The rectangle area is sixteen hundred square metres, and the full circle area is three hundred and fourteen square metres.", style: 'statement' },
  { text: "Total area is nineteen hundred and fourteen square metres!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 6 ────────────────────────────────────────────────
  { text: "The doors opened and judges crowded around their circular design booth!", style: 'statement' },
  { text: "Zoe and Arjun expertly calculated areas of circles, semicircles, quarter circles, and shaded ring borders with absolute confidence.", style: 'statement' },
  { text: "Outstanding work! the head judge announced, awarding them the Golden Compass trophy.", style: 'celebration' },
  { text: "You have mastered the geometry of circles! Now it is your turn to enter the simulation labs!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station A — The Slice and Discover Lab!", style: 'instruction' },
  { text: "Drag the slider to increase the number of slices from four up to sixty-four. Watch the slices unroll into a rectangle, revealing why the area formula is pi times radius squared!", style: 'instruction' },
  { text: "Welcome to Station B — The Garden Designer Mission!", style: 'instruction' },
  { text: "Design circular flowerbeds to match each target area. Adjust the radius slider to see the formula and area update live!", style: 'instruction' },
  { text: "Welcome to Station C — The Running Track Builder Mission!", style: 'instruction' },
  { text: "Construct a stadium running track with straight length and semicircle radius sliders. Combine the rectangle and two semicircles to hit the target area!", style: 'instruction' },
  { text: "Welcome to Station D — The Shaded Region Detective!", style: 'instruction' },
  { text: "Detective Tally has found engineering blueprints with calculation errors. Inspect the steps, identify the mistake, and choose the correct step!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's exactly right! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! You are an unstoppable circle master! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, check your radius squared calculation, and try again! 💡", style: 'thinking' },
  { text: "Here's your first hint! Look carefully at whether radius or diameter is given.", style: 'encouragement' },
  { text: "Here's your final clue! Follow the formula step by step: Area equals pi times radius squared.", style: 'encouragement' },

  // ─── WORLDS & BOSS BATTLES ───────────────────────────────────────────────
  { text: "World Complete! Spectacular job on this circle world! 🌟", style: 'celebration' },
  { text: "The Boss Battle begins! Answer correctly to defeat the boss and claim your badge!", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the World Badge! 👑", style: 'celebration' },

  // ─── REFLECT PHASE ───────────────────────────────────────────────────────
  { text: "Welcome to the Reflect Phase! Let's review the key circle concepts and check your scorecard! 📓", style: 'statement' },
  { text: "Outstanding! You have mastered area of circles, semicircles, and composite figures! You are a true Circle Master! 🏆", style: 'celebration' },
];

const outputDir = './public/assets/audio';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function cleanString(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 45).replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function main() {
  console.log(`\n🎙️ Starting ElevenLabs Audio Generation Pipeline for CircleQuest`);
  console.log(`Voice ID: ${VOICE_ID} | Model: ${VOICE_MODEL}`);
  console.log(`Total phrases to process: ${phrases.length}\n`);

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const cleanText = cleanString(text);
    const fileName = `audio_${cleanText}_${i}.mp3`;
    const destPath = path.join(outputDir, fileName);
    const relativeWebPath = `/assets/audio/${fileName}`;
    mapping[text] = relativeWebPath;

    if (fs.existsSync(destPath)) {
      console.log(`[${i + 1}/${phrases.length}] ⏩ Skipped (already exists): ${fileName}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] 🔊 Generating: "${text.substring(0, 40)}..." -> ${fileName}`);

    const settings = VOICE_SETTINGS[style] || VOICE_SETTINGS.statement;

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: settings,
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errBody}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(destPath, buffer);
      console.log(`   ✅ Saved: ${destPath}`);
    } catch (e) {
      console.error(`   ❌ Failed to generate phrase "${text}":`, e.message);
    }
  }

  const mapContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for offline generated narration phrases in CircleQuest\n\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\n\nexport default audioMap;\n`;
  fs.writeFileSync('./src/utils/audioMap.js', mapContent);
  console.log('\n✨ Audio mapping updated in src/utils/audioMap.js!');
  console.log('🎉 Audio generation completed successfully!\n');
}

main().catch(console.error);
