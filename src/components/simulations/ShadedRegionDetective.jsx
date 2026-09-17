// src/components/simulations/ShadedRegionDetective.jsx
// Station D: Shaded Region Detective — Error Spotting Challenge in Blueprints.
// Enhanced with a glowing shaded-region reveal on success, a pulsing "found it"
// highlight, and a shake cue on incorrect picks.

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const CASES = [
  {
    id: 0,
    title: 'Case #1: Square Plate with Circular Cutout',
    shapeType: 'circle-in-square',
    badge: 'Plate Blueprint',
    unit: 'cm',
    dimensions: 'Square side = 14 cm, Cutout radius = 7 cm (π ≈ 22/7)',
    steps: [
      { id: 1, label: 'Step 1: Area of Square', text: '14 cm × 14 cm = 196 cm²', isFlawed: false },
      { id: 2, label: 'Step 2: Area of Circle Hole', text: '22/7 × 14 × 14 = 616 cm²', isFlawed: true, reason: 'Used diameter 14 cm instead of radius 7 cm!' },
      { id: 3, label: 'Step 3: Shaded Remaining Area', text: '196 cm² − 616 cm² = −420 cm²', isFlawed: false },
    ],
    fixes: [
      { text: 'Use radius r = 7 cm: 22/7 × 7 × 7 = 154 cm². Then 196 − 154 = 42 cm²', correct: true },
      { text: 'Multiply square by 2: 196 × 2 = 392 cm²', correct: false },
      { text: 'Add both areas together: 196 + 616 = 812 cm²', correct: false },
    ],
    correctedResult: '196 cm² − 154 cm² = 42 cm²',
    shadedPath: 'M175,45 H365 V235 H175 Z M270,140 m-82,0 a82,82 0 1,0 164,0 a82,82 0 1,0 -164,0',
  },
  {
    id: 1,
    title: 'Case #2: Metallic Washer Ring (Annulus)',
    shapeType: 'ring',
    badge: 'Ring Blueprint',
    unit: 'cm',
    dimensions: 'Outer radius R = 10 cm, Inner radius r = 6 cm (π ≈ 3.14)',
    steps: [
      { id: 1, label: 'Step 1: Outer Circle Area', text: '3.14 × 10 × 10 = 314 cm²', isFlawed: false },
      { id: 2, label: 'Step 2: Subtract radii first', text: '10 − 6 = 4 cm, then Area = 3.14 × 4² = 50.24 cm²', isFlawed: true, reason: 'Subtracted radii before squaring! You must subtract the areas, not the radii!' },
      { id: 3, label: 'Step 3: Shaded Ring Area', text: 'Calculated as 50.24 cm²', isFlawed: false },
    ],
    fixes: [
      { text: 'Calculate inner area (3.14 × 6² = 113.04 cm²), then subtract: 314 − 113.04 = 200.96 cm²', correct: true },
      { text: 'Add both radii first: 10 + 6 = 16 cm', correct: false },
      { text: 'Divide the outer area by 4: 314 ÷ 4 = 78.5 cm²', correct: false },
    ],
    correctedResult: '314 cm² − 113.04 cm² = 200.96 cm²',
    shadedPath: 'M270,140 m-105,0 a105,105 0 1,0 210,0 a105,105 0 1,0 -210,0 M270,140 m-60,0 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0',
  },
  {
    id: 2,
    title: 'Case #3: Rectangle with Semicircular Cutout',
    shapeType: 'rect-minus-semi',
    badge: 'Archway Blueprint',
    unit: 'cm',
    dimensions: 'Rectangle: 20 cm × 10 cm, Semicircle cutout radius = 10 cm (π ≈ 3.14)',
    steps: [
      { id: 1, label: 'Step 1: Area of Rectangle', text: '20 cm × 10 cm = 200 cm²', isFlawed: false },
      { id: 2, label: 'Step 2: Area of Semicircle Cutout', text: '3.14 × 10² = 314 cm²', isFlawed: true, reason: 'Calculated a full circle instead of dividing by 2 for a semicircle!' },
      { id: 3, label: 'Step 3: Shaded Wall Area', text: '200 cm² − 314 cm² = −114 cm²', isFlawed: false },
    ],
    fixes: [
      { text: 'Divide circle by 2 for semicircle: 314 ÷ 2 = 157 cm². Then 200 − 157 = 43 cm²', correct: true },
      { text: 'Multiply rectangle by 2: 200 × 2 = 400 cm²', correct: false },
      { text: 'Divide rectangle by 4: 200 ÷ 4 = 50 cm²', correct: false },
    ],
    correctedResult: '200 cm² − 157 cm² = 43 cm²',
    shadedPath: 'M120,50 H420 V210 H120 Z M192,210 A78,78 0 0 1 348,210 Z',
  },
];

export default function ShadedRegionDetective({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [solvedCases, setSolvedCases] = useState([false, false, false]);
  const [shakeKey, setShakeKey] = useState(0);

  const activeCase = CASES[caseIdx];
  const isSolved = solvedCases[caseIdx];
  const allSolved = solvedCases.every(Boolean);
  const flawedStepId = activeCase.steps.find((s) => s.isFlawed).id;
  const flawFound = selectedStep === flawedStepId;

  function handleStepClick(step) {
    if (isSolved) return;
    setSelectedStep(step.id);
    setSelectedFix(null);

    if (step.isFlawed) {
      sounds.click();
      narrate([{ text: 'Aha! You spotted the flaw! Now select the correct mathematical repair from the options below.', style: 'encouragement' }]);
    } else {
      sounds.wrong();
      setShakeKey((k) => k + 1);
      narrate([{ text: `Step ${step.id} is actually mathematically correct! Look closely at the circle calculation instead.`, style: 'thinking' }]);
    }
  }

  function handleFixSelect(fixIdx) {
    if (isSolved) return;
    setSelectedFix(fixIdx);
    const fix = activeCase.fixes[fixIdx];

    if (fix.correct) {
      sounds.correct();
      const updated = [...solvedCases];
      updated[caseIdx] = true;
      setSolvedCases(updated);
      narrate([{ text: `Case cracked! The blueprint error is corrected! Result is ${activeCase.correctedResult}.`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setShakeKey((k) => k + 1);
      narrate([{ text: "That repair isn't correct. Remember: total shape minus cutout!", style: 'encouragement' }]);
    }
  }

  function nextCase() {
    const nextIdx = (caseIdx + 1) % CASES.length;
    setCaseIdx(nextIdx);
    setSelectedStep(null);
    setSelectedFix(null);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Shaded Region Detective</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case:</span>
          <span className="station-target-num">{caseIdx + 1} of {CASES.length}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Blueprint Visual */}
        <div className="station-col-left">
          <motion.div
            key={caseIdx}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="glass-card"
            style={{
              padding: '6px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              minHeight: 0,
              background: 'radial-gradient(ellipse at center, rgba(14, 116, 144, 0.25) 0%, rgba(10, 10, 46, 0.95) 100%)',
              border: isSolved ? '2px solid #4ade80' : '1.5px solid rgba(56, 189, 248, 0.4)',
              boxShadow: isSolved ? '0 0 16px rgba(74, 222, 128, 0.35)' : 'none',
              transition: 'border 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
              <span>
                <motion.span
                  style={{ display: 'inline-block' }}
                  animate={{ rotate: [0, -12, 12, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.4 }}
                >🔎</motion.span> {activeCase.badge}
              </span>
              <span style={{ color: isSolved ? '#4ade80' : '#fcd34d' }}>
                {isSolved ? '✅ Corrected!' : '⚠️ Error Detected'}
              </span>
            </div>

            {/* Blueprint SVG Graphic */}
            <svg viewBox="0 0 540 280" style={{ width: '100%', height: '100%', maxHeight: 'clamp(180px, 36vh, 290px)', overflow: 'visible', margin: '4px 0' }}>
              {/* Engineering blueprint background subtle grid guidelines */}
              <line x1="30" y1="140" x2="510" y2="140" stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="5,5" />
              <line x1="270" y1="20" x2="270" y2="260" stroke="rgba(56, 189, 248, 0.12)" strokeDasharray="5,5" />

              {activeCase.shapeType === 'circle-in-square' && (
                <>
                  <rect x="175" y="45" width="190" height="190" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="270" cy="140" r="82" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2.5" />
                  <line x1="270" y1="140" x2="352" y2="140" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4,4" />
                  <circle cx="270" cy="140" r="4" fill="#fcd34d" />
                  <text x="311" y="132" fill="#fcd34d" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">r = 7 cm</text>
                  <text x="270" y="34" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">Side = 14 cm</text>
                </>
              )}

              {activeCase.shapeType === 'ring' && (
                <>
                  <circle cx="270" cy="140" r="105" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx="270" cy="140" r="60" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2.5" />
                  <circle cx="270" cy="140" r="4" fill="#fcd34d" />
                  <line x1="270" y1="140" x2="330" y2="140" stroke="#fcd34d" strokeWidth="2" />
                  <text x="300" y="132" fill="#fcd34d" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">r = 6 cm</text>
                  <line x1="270" y1="140" x2="270" y2="35" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="270" y="25" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">R = 10 cm</text>
                </>
              )}

              {activeCase.shapeType === 'rect-minus-semi' && (
                <>
                  <rect x="120" y="50" width="300" height="160" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2.5" />
                  <path d="M 192 210 A 78 78 0 0 1 348 210 Z" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2.5" />
                  <circle cx="270" cy="210" r="4" fill="#fcd34d" />
                  <line x1="270" y1="210" x2="270" y2="132" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4,4" />
                  <text x="270" y="124" fill="#fcd34d" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">r = 10 cm</text>
                  <text x="270" y="38" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">20 cm × 10 cm</text>
                </>
              )}

              {/* Shaded-region reveal glow — lights up the exact answer region on success */}
              <motion.path
                d={activeCase.shadedPath}
                fillRule="evenodd"
                fill="#4ade80"
                initial={false}
                animate={{ fillOpacity: isSolved ? [0, 0.55, 0.4] : 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                stroke={isSolved ? '#4ade80' : 'transparent'}
                strokeWidth="2.5"
                style={{ filter: isSolved ? 'drop-shadow(0 0 8px rgba(74,222,128,0.85))' : 'none', pointerEvents: 'none' }}
              />
            </svg>

            <span style={{ fontSize: '0.75rem', color: '#cbd5e1', textAlign: 'center' }}>
              {isSolved ? `Shaded area = ${activeCase.correctedResult}` : activeCase.dimensions}
            </span>
          </motion.div>

          {/* Case Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => { setCaseIdx(i); setSelectedStep(null); setSelectedFix(null); }}
                style={{
                  flex: 1, padding: '4px 6px', borderRadius: '8px',
                  background: caseIdx === i ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.06)',
                  border: caseIdx === i ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                }}
              >
                {solvedCases[i] ? '✅' : '🔍'} Case #{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Worked Steps Inspection & Correction Selector */}
        <div className="station-col-right">
          {/* Step list to inspect */}
          <motion.div
            key={`steps-${shakeKey}`}
            animate={{ x: [0, 0, 0] }}
            className="glass-card"
            style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <span style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 800 }}>
              🕵️ Step 1: Tap the step that contains the error:
            </span>

            {activeCase.steps.map((st) => {
              const isSelected = selectedStep === st.id;
              let border = 'rgba(255,255,255,0.15)';
              let bg = 'rgba(255,255,255,0.05)';
              if (isSelected && st.isFlawed) { border = '#f59e0b'; bg = 'rgba(245,158,11,0.2)'; }
              else if (isSelected && !st.isFlawed) { border = '#ef5350'; bg = 'rgba(239,83,80,0.2)'; }

              return (
                <motion.button
                  key={st.id}
                  onClick={() => handleStepClick(st)}
                  disabled={isSolved}
                  animate={isSelected && !st.isFlawed ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: bg, border: `1.5px solid ${border}`, borderRadius: '8px',
                    padding: '4px 8px', textAlign: 'left', color: '#ffffff',
                    cursor: isSolved ? 'default' : 'pointer', display: 'flex', flexDirection: 'column', gap: '1px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800 }}>
                    <span>{st.label}</span>
                    {isSelected && st.isFlawed && <span style={{ color: '#fcd34d' }}>⚠️ Error Found!</span>}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{st.text}</div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Correction options */}
          <div className="glass-card" style={{ padding: '6px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>
                🔧 Step 2: Choose the Correct Math Repair:
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                {activeCase.fixes.map((fix, idx) => {
                  const isSelected = selectedFix === idx;
                  let border = 'rgba(255,255,255,0.15)';
                  let bg = 'rgba(255,255,255,0.05)';
                  if (isSelected && fix.correct) { border = '#4caf50'; bg = 'rgba(76,175,80,0.25)'; }
                  else if (isSelected && !fix.correct) { border = '#ef5350'; bg = 'rgba(239,83,80,0.25)'; }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleFixSelect(idx)}
                      disabled={!flawFound || isSolved}
                      animate={isSelected && !fix.correct ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        background: bg, border: `1.5px solid ${border}`, borderRadius: '8px',
                        padding: '4px 8px', textAlign: 'left', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700,
                        cursor: flawFound && !isSolved ? 'pointer' : 'default', opacity: !flawFound ? 0.45 : 1,
                        lineHeight: 1.25,
                      }}
                    >
                      {fix.text}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Success Box */}
            {isSolved ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Case #{caseIdx + 1} solved! Result: <strong>{activeCase.correctedResult}</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!allSolved && (
                    <button className="btn btn-primary btn-sm" style={{ padding: '3px 8px', minHeight: '26px', fontSize: '0.78rem' }} onClick={nextCase}>Next ➔</button>
                  )}
                  <button className="btn btn-green btn-sm" style={{ padding: '3px 8px', minHeight: '26px', fontSize: '0.78rem' }} onClick={onComplete}>Complete ✓</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '3px' }}>
                {!flawFound ? 'First tap the step above that has the calculation error.' : 'Now select the correct repair to fix the blueprint calculation.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
