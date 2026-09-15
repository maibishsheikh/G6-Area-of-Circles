// scripts/test_question_bank.js
// Automated QA Stress Test for CircleQuest Procedural Question Bank

import { generateQuestions, DISTRICTS } from '../src/data/questionBank.js';

console.log('\n🧪 Starting CircleQuest Question Bank QA Stress Test...');

const TOTAL_RUNS = 300;
let totalQuestionsTested = 0;
let errors = [];

// Test DISTRICTS definition
if (!DISTRICTS || DISTRICTS.length !== 10) {
  errors.push(`DISTRICTS count should be 10, got: ${DISTRICTS?.length}`);
}

for (let run = 1; run <= TOTAL_RUNS; run++) {
  const bank = generateQuestions();

  if (bank.length !== 100) {
    errors.push(`Run #${run}: Bank length must be exactly 100, got ${bank.length}`);
    break;
  }

  for (let i = 0; i < bank.length; i++) {
    const q = bank[i];
    totalQuestionsTested++;

    // 1. Check ID sequence
    if (q.id !== i + 1) {
      errors.push(`Run #${run}, Q#${i + 1}: ID mismatch. Expected ${i + 1}, got ${q.id}`);
    }

    // 2. Check District ID range (0 to 9)
    const expectedDistrict = Math.floor(i / 10);
    if (q.districtId !== expectedDistrict) {
      errors.push(`Run #${run}, Q#${q.id}: District ID mismatch. Expected ${expectedDistrict}, got ${q.districtId}`);
    }

    // 3. Required string fields
    const reqStrings = ['category', 'visual', 'questionText', 'correctAnswer', 'explanation', 'hint1', 'hint2'];
    for (const field of reqStrings) {
      if (!q[field] || typeof q[field] !== 'string' || q[field].trim().length === 0) {
        errors.push(`Run #${run}, Q#${q.id}: Missing or empty string field '${field}'`);
      }
      if (String(q[field]).includes('NaN') || String(q[field]).includes('undefined')) {
        errors.push(`Run #${run}, Q#${q.id}: Field '${field}' contains NaN or undefined: ${q[field]}`);
      }
    }

    // 4. Options validation
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push(`Run #${run}, Q#${q.id}: Options must be an array of 4 items, got ${q.options?.length}`);
    } else {
      const set = new Set(q.options);
      if (set.size !== 4) {
        errors.push(`Run #${run}, Q#${q.id}: Duplicate options detected: [${q.options.join(', ')}]`);
      }
      if (!set.has(q.correctAnswer)) {
        errors.push(`Run #${run}, Q#${q.id}: Correct answer '${q.correctAnswer}' is NOT in options: [${q.options.join(', ')}]`);
      }
      for (const opt of q.options) {
        if (opt.includes('NaN') || opt.includes('undefined') || opt.trim().length === 0) {
          errors.push(`Run #${run}, Q#${q.id}: Malformed option '${opt}'`);
        }
      }
    }

    // 5. Visual data validation
    if (!q.visualData || typeof q.visualData !== 'object') {
      errors.push(`Run #${run}, Q#${q.id}: Missing visualData object`);
    }

    if (errors.length > 20) {
      console.error('\nToo many errors encountered! Aborting early.');
      break;
    }
  }

  if (errors.length > 0) break;
}

console.log(`\n📊 Test Summary:`);
console.log(`   - Sessions Tested: ${TOTAL_RUNS}`);
console.log(`   - Questions Evaluated: ${totalQuestionsTested}`);

if (errors.length === 0) {
  console.log('✅ ALL QA STRESS TESTS PASSED WITH ZERO ERRORS! 🚀\n');
  process.exit(0);
} else {
  console.error(`❌ QA FAILED with ${errors.length} error(s):`);
  errors.forEach((err, i) => console.error(`   ${i + 1}. ${err}`));
  process.exit(1);
}
