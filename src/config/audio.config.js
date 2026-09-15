// src/config/audio.config.js
// ElevenLabs configuration for CircleQuest

export const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
export const VOICE_MODEL = 'eleven_multilingual_v2';

export const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};
