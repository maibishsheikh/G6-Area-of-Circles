// src/components/simulations/ShadedRegionDetective.jsx
// Station D: Shaded Region Detective — Error Spotting Challenge in Blueprints

import React, { useState } from 'react';
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
    side: 14,
    radius: 7,
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
    rOuter: 10,
    rInner: 6,
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
    length: 20,
    width: 10,
    radius: 10,
  },
];

export default function ShadedRegionDetective({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [solvedCases, setSolvedCases] = useState([false, false, false]);

  const activeCase = CASES[caseIdx];
  const isSolved = solvedCases[caseIdx];
  const allSolved = solvedCases.every(Boolean);

  function handleStepClick(step) {
    if (isSolved) return;
    setSelectedStep(step.id);
    setSelectedFix(null);

    if (step.isFlawed) {
      sounds.click();
      narrate([
        {
          text: `Aha! You spotted the flaw in Step 2! Now select the correct mathematical repair from the options below.`,
          style: 'encouragement',
        },
      ]);
    } else {
      sounds.wrong();
      narrate([
        {
          text: `Step ${step.id} is actually mathematically correct! Look closely at the circle calculation in Step 2.`,
          style: 'thinking',
        },
      ]);
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

      narrate([
        {
          text: `Case cracked! The blueprint error is corrected! Result is ${activeCase.correctedResult}.`,
          style: 'celebration',
        },
      ]);
    } else {
      sounds.wrong();
      narrate([
        {
          text: `That repair isn't correct. Remember the golden rule of finding remaining shaded areas: total shape minus cutout!`,
          style: 'encouragement',
        },
      ]);
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
          <div
            className="glass-card"
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              background: 'radial-gradient(ellipse at center, rgba(14, 116, 144, 0.25) 0%, rgba(10, 10, 46, 0.95) 100%)',
              border: isSolved ? '2px solid #4ade80' : '1.5px solid rgba(56, 189, 248, 0.4)',
              boxShadow: isSolved ? '0 0 24px rgba(74, 222, 128, 0.35)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
              <span>📐 Blueprint: {activeCase.badge}</span>
              <span style={{ color: isSolved ? '#4ade80' : '#fcd34d' }}>
                {isSolved ? '✅ Error Corrected!' : '⚠️ Seeded Error Detected'}
              </span>
            </div>

            {/* Blueprint SVG Graphic */}
            <svg viewBox="0 0 200 150" width="200" height="130" style={{ overflow: 'visible', margin: '4px 0' }}>
              {activeCase.shapeType === 'circle-in-square' && (
                <>
                  <rect x="45" y="20" width="110" height="110" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="100" cy="75" r="45" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2" />
                  <line x1="100" y1="75" x2="145" y2="75" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />
                  <circle cx="100" cy="75" r="3" fill="#fcd34d" />
                  <text x="122" y="70" fill="#fcd34d" fontSize="9" fontWeight="900" textAnchor="middle">r = 7 cm</text>
                  <text x="100" y="14" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">Side = 14 cm</text>
                </>
              )}

              {activeCase.shapeType === 'ring' && (
                <>
                  <circle cx="100" cy="75" r="58" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="100" cy="75" r="32" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2" />
                  <circle cx="100" cy="75" r="3" fill="#fcd34d" />
                  <line x1="100" y1="75" x2="132" y2="75" stroke="#fcd34d" strokeWidth="1.5" />
                  <text x="116" y="71" fill="#fcd34d" fontSize="9" fontWeight="900" textAnchor="middle">r = 6 cm</text>
                  <line x1="100" y1="75" x2="100" y2="17" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="100" y="12" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">R = 10 cm</text>
                </>
              )}

              {activeCase.shapeType === 'rect-minus-semi' && (
                <>
                  <rect x="35" y="25" width="130" height="95" fill="rgba(56, 189, 248, 0.35)" stroke="#38bdf8" strokeWidth="2" />
                  <path d="M 60 120 A 40 40 0 0 1 140 120 Z" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2" />
                  <circle cx="100" cy="120" r="3" fill="#fcd34d" />
                  <line x1="100" y1="120" x2="100" y2="80" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />
                  <text x="100" y="74" fill="#fcd34d" fontSize="9" fontWeight="900" textAnchor="middle">r = 10 cm</text>
                  <text x="100" y="18" fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="middle">20 cm × 10 cm</text>
                </>
              )}
            </svg>

            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', textAlign: 'center' }}>
              {activeCase.dimensions}
            </span>
          </div>

          {/* Case Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {CASES.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setCaseIdx(i);
                  setSelectedStep(null);
                  setSelectedFix(null);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: '10px',
                  background: caseIdx === i ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.06)',
                  border: caseIdx === i ? '1.5px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
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
          <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.84rem', color: '#fcd34d', fontWeight: 800 }}>
              🕵️ Step 1: Tap the step that contains the error:
            </span>

            {activeCase.steps.map((st) => {
              const isSelected = selectedStep === st.id;
              let border = 'rgba(255,255,255,0.15)';
              let bg = 'rgba(255,255,255,0.05)';
              if (isSelected && st.isFlawed) {
                border = '#f59e0b';
                bg = 'rgba(245,158,11,0.2)';
              } else if (isSelected && !st.isFlawed) {
                border = '#ef5350';
                bg = 'rgba(239,83,80,0.2)';
              }

              return (
                <button
                  key={st.id}
                  onClick={() => handleStepClick(st)}
                  disabled={isSolved}
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: '10px',
                    padding: '8px 12px',
                    textAlign: 'left',
                    color: '#ffffff',
                    cursor: isSolved ? 'default' : 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 800 }}>
                    <span>{st.label}</span>
                    {isSelected && st.isFlawed && <span style={{ color: '#fcd34d' }}>⚠️ Error Found!</span>}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{st.text}</div>
                </button>
              );
            })}
          </div>

          {/* Correction options */}
          <div className="glass-card" style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.84rem', color: '#38bdf8', fontWeight: 800 }}>
                🔧 Step 2: Choose the Correct Math Repair:
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {activeCase.fixes.map((fix, idx) => {
                  const isSelected = selectedFix === idx;
                  let border = 'rgba(255,255,255,0.15)';
                  let bg = 'rgba(255,255,255,0.05)';
                  if (isSelected && fix.correct) {
                    border = '#4caf50';
                    bg = 'rgba(76,175,80,0.25)';
                  } else if (isSelected && !fix.correct) {
                    border = '#ef5350';
                    bg = 'rgba(239,83,80,0.25)';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleFixSelect(idx)}
                      disabled={selectedStep !== 2 || isSolved}
                      style={{
                        background: bg,
                        border: `1.5px solid ${border}`,
                        borderRadius: '10px',
                        padding: '8px 10px',
                        textAlign: 'left',
                        color: '#ffffff',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: selectedStep === 2 && !isSolved ? 'pointer' : 'default',
                        opacity: selectedStep !== 2 ? 0.45 : 1,
                      }}
                    >
                      {fix.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Success Box */}
            {isSolved ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Case #{caseIdx + 1} solved! Corrected formula: <strong>{activeCase.correctedResult}</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {!allSolved && (
                    <button className="btn btn-primary btn-sm" onClick={nextCase}>
                      Next Case ➔
                    </button>
                  )}
                  <button className="btn btn-green btn-sm" onClick={onComplete}>
                    Complete Station ✓
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
                {selectedStep !== 2
                  ? 'First tap Step 2 above to inspect the calculation error.'
                  : 'Now select the correct repair to fix the blueprint calculation.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
