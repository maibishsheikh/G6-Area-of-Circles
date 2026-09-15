// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for CircleQuest

export const BADGES = [
  { id: 'first_slice',   icon: '🏅', label: 'First Slice',    description: 'Answered your very first circle question correctly!' },
  { id: 'hot_streak',    icon: '🔥', label: 'Hot Streak',     description: 'Achieved a streak of 5 correct answers!' },
  { id: 'super_streak',  icon: '⚡', label: 'Radius Prodigy', description: 'Achieved a 10-question winning streak!' },
  { id: 'lab_champ',     icon: '🧪', label: 'Lab Champion',   description: 'Completed all 4 interactive simulation stations!' },
  { id: 'world_star',    icon: '⭐', label: 'World Star',     description: 'Scored 3 stars in any Circle World!' },
  { id: 'boss_slayer',   icon: '👑', label: 'Boss Slayer',    description: 'Defeated a World Boss in battle!' },
  { id: 'century_scorer',icon: '🎯', label: 'Centurion',      description: 'Answered 20 or more questions in Practice!' },
  { id: 'circle_master', icon: '🏆', label: 'Circle Master',  description: 'Completed the full 5-phase CircleQuest journey!' },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_slice');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.maxStreak >= 10) unlocked.push('super_streak');

  // Simulation completion
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('lab_champ');
  }

  // 3-star world check (>= 9/10)
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('world_star');
  }

  // Centurion
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('century_scorer');
  }

  // Boss slayer
  if (state.bossDefeated) {
    unlocked.push('boss_slayer');
  }

  // Full journey completed
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('circle_master');
  }

  return unlocked;
}
