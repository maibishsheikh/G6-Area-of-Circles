// src/components/simulations/SliceDiscoveryLab.jsx
// Station A: Interactive Formula Discovery — a real slice-and-unroll SIMULATION.
// The pie wedges are a single persistent set of shapes that physically morph
// between "circle" and "rearranged rectangle" formations as the student drags
// the Unroll control (or presses Play), proving Area = πr² visually.

import React, { useState, useRef, useEffect } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const SLICE_STEPS = [4, 8, 16, 32, 64];
const RADIUS = 6; // cm

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

// Stage geometry (SVG viewBox 0 0 560 260)
const CX = 280, CY = 125, R = 92;
const RECT_W = 440, RECT_H = R, RECT_START_X = (560 - RECT_W) / 2;

function wedgePath(i, sliceCount, t) {
  const delta = (2 * Math.PI) / sliceCount;
  const a1 = i * delta - Math.PI / 2;
  const a2 = (i + 1) * delta - Math.PI / 2;
  const apexC = { x: CX, y: CY };
  const p1C = { x: CX + R * Math.cos(a1), y: CY + R * Math.sin(a1) };
  const p2C = { x: CX + R * Math.cos(a2), y: CY + R * Math.sin(a2) };

  const wedgeBaseW = RECT_W / (sliceCount / 2);
  const slotIdx = Math.floor(i / 2);
  const isUp = i % 2 === 1;
  const xLeft = RECT_START_X + slotIdx * wedgeBaseW;
  const xRight = xLeft + wedgeBaseW;
  const xMid = (xLeft + xRight) / 2;

  const apexR = isUp ? { x: xMid, y: CY + RECT_H / 2 } : { x: xMid, y: CY - RECT_H / 2 };
  const c1R = isUp ? { x: xLeft, y: CY - RECT_H / 2 } : { x: xLeft, y: CY + RECT_H / 2 };
  const c2R = isUp ? { x: xRight, y: CY - RECT_H / 2 } : { x: xRight, y: CY + RECT_H / 2 };

  const apex = lerp(apexC, apexR, t);
  const c1 = lerp(p1C, c1R, t);
  const c2 = lerp(p2C, c2R, t);

  return `M ${apex.x.toFixed(2)} ${apex.y.toFixed(2)} L ${c1.x.toFixed(2)} ${c1.y.toFixed(2)} L ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} Z`;
}

export default function SliceDiscoveryLab({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [stepIdx, setStepIdx] = useState(3); // start at 32 slices — already fairly convincing
  const [morphT, setMorphT] = useState(0); // 0 = circle, 100 = fully unrolled rectangle
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const rafRef = useRef(null);
  const narratedUnrollRef = useRef(false);

  const sliceCount = SLICE_STEPS[stepIdx];
  const halfCircumference = +(Math.PI * RADIUS).toFixed(2);
  const fullCircumference = +(2 * Math.PI * RADIUS).toFixed(2);
  const area = +(Math.PI * RADIUS * RADIUS).toFixed(2);
  const isUnrolled = morphT >= 95;
  const isComplete = answeredCorrect;

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  useEffect(() => {
    if (isUnrolled && !narratedUnrollRef.current) {
      narratedUnrollRef.current = true;
      narrate([{ text: 'Look! The wedges rearrange into a shape that is nearly a rectangle, with base pi times radius and height radius.', style: 'encouragement' }]);
    }
    if (!isUnrolled) narratedUnrollRef.current = false;
  }, [isUnrolled, narrate]);

  function animateTo(target) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(true);
    const from = morphT;
    const start = performance.now();
    const duration = 1400;
    function step(now) {
      const raw = Math.min(1, (now - start) / duration);
      const eased = easeInOutCubic(raw);
      setMorphT(from + (target - from) * eased);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    }
    rafRef.current = requestAnimationFrame(step);
  }

  function handlePlay() {
    sounds.click();
    animateTo(morphT >= 95 ? 0 : 100);
  }

  function handleSliderChange(e) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsPlaying(false);
    setMorphT(parseFloat(e.target.value));
    sounds.click();
  }

  function stepSliceCount(delta) {
    const next = Math.max(0, Math.min(SLICE_STEPS.length - 1, stepIdx + delta));
    if (next !== stepIdx) {
      setStepIdx(next);
      sounds.click();
    }
  }

  const QUESTION_OPTIONS = [
    { text: 'Base = πr, Height = r', correct: true },
    { text: 'Base = 2πr, Height = 2r', correct: false },
    { text: 'Base = πr², Height = 2r', correct: false },
    { text: 'Base = r, Height = r', correct: false },
  ];

  function handleSelectOption(idx) {
    if (answeredCorrect) return;
    setSelectedOpt(idx);
    const opt = QUESTION_OPTIONS[idx];
    if (opt.correct) {
      setAnsweredCorrect(true);
      sounds.correct();
      narrate([{ text: 'Spot on! The unrolled rectangle has base pi times radius and height radius. Base times height equals pi times radius squared!', style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: 'Not quite. Watch the unroll animation again: the bottom edge is formed by half the wedges, which equals half of the circumference!', style: 'thinking' }]);
    }
  }

  const wedges = [];
  for (let i = 0; i < sliceCount; i++) {
    const t = morphT / 100;
    const color = i % 2 === 0 ? '#38bdf8' : '#fcd34d';
    wedges.push(
      <path
        key={i}
        d={wedgePath(i, sliceCount, t)}
        fill={color}
        stroke="#0a0a2e"
        strokeWidth="0.8"
        opacity="0.92"
      />
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔪 Station A: Slice &amp; Unroll Simulation</h3>
        <div className="station-target-box">
          <span className="station-target-label">Slices:</span>
          <span className="station-target-num">{sliceCount}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Morphing Stage */}
        <div className="station-col-left">
          <div className="lab-visual-box glass-card" style={{ padding: '6px 8px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 4px', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>
              <span>{isUnrolled ? '✅ Nearly a Rectangle!' : morphT > 5 ? '↻ Unrolling…' : '⬤ Circle (r = 6 cm)'}</span>
              <span style={{ color: '#fcd34d' }}>Circumference ≈ {fullCircumference} cm</span>
            </div>
            <svg viewBox="0 0 560 260" style={{ width: '100%', height: '100%', maxHeight: 'clamp(180px, 34vh, 280px)', overflow: 'visible', margin: '4px 0' }}>
              {wedges}
              {morphT < 50 && <circle cx={CX} cy={CY} r="3" fill="#ffffff" opacity={1 - morphT / 50} />}
              {/* Base + height callouts fade in once unrolled */}
              <g opacity={Math.max(0, (morphT - 60) / 40)}>
                <line x1={RECT_START_X} y1={CY + RECT_H / 2 + 12} x2={RECT_START_X + RECT_W} y2={CY + RECT_H / 2 + 12} stroke="#fcd34d" strokeWidth="2" />
                <text x={RECT_START_X + RECT_W / 2} y={CY + RECT_H / 2 + 28} fill="#fcd34d" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
                  Base ≈ πr ≈ {halfCircumference} cm
                </text>
                <line x1={RECT_START_X - 10} y1={CY - RECT_H / 2} x2={RECT_START_X - 10} y2={CY + RECT_H / 2} stroke="#38bdf8" strokeWidth="2" />
                <text x={RECT_START_X - 16} y={CY + 5} fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="end" fontFamily="var(--font-display)">
                  r = {RADIUS} cm
                </text>
              </g>
            </svg>
          </div>

          {/* Unified Unroll + Slice Count Controls */}
          <div className="lab-slider-row glass-card" style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="btn btn-primary btn-sm" style={{ padding: '3px 10px', minHeight: '26px', minWidth: '76px', fontSize: '0.82rem' }} onClick={handlePlay} disabled={isPlaying}>
                {morphT >= 95 ? '↺ Re-roll' : '▶ Unroll'}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={morphT}
                onChange={handleSliderChange}
                style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer' }}
                aria-label="Unroll progress slider"
              />
              <span className="coin-count-pill" style={{ minWidth: '40px', textAlign: 'center' }}>{Math.round(morphT)}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', whiteSpace: 'nowrap' }}>Slice Count:</span>
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => stepSliceCount(-1)} disabled={stepIdx === 0}>−</button>
              <input
                type="range"
                min="0"
                max={SLICE_STEPS.length - 1}
                step="1"
                value={stepIdx}
                onChange={(e) => { setStepIdx(parseInt(e.target.value, 10)); sounds.click(); }}
                style={{ flex: 1, accentColor: '#38bdf8', cursor: 'pointer' }}
                aria-label="Number of slices slider"
              />
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => stepSliceCount(1)} disabled={stepIdx === SLICE_STEPS.length - 1}>+</button>
              <span className="coin-count-pill" style={{ minWidth: '28px', textAlign: 'center' }}>{sliceCount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Discovery & Verification Question */}
        <div className="station-col-right">
          <div className="glass-card" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📐 Live Formula Discovery:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Base (half circum.):</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#fcd34d' }}>π × r ≈ {halfCircumference} cm</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Height (radius):</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#38bdf8' }}>r = {RADIUS} cm</div>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', padding: '5px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Area = Base × Height:</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffd54f', fontFamily: 'var(--font-display)' }}>
                (π × r) × r = <strong>π × r² ≈ {area} cm²</strong>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fcd34d' }}>
                {isUnrolled ? '🎯 Confirm Your Discovery!' : '👉 First: Press ▶ Unroll (or drag the slider)!'}
              </span>
              <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700, margin: '3px 0 6px 0', lineHeight: 1.25 }}>
                When cut into thin slices and unrolled into a rectangle, what do the base and height represent?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                {QUESTION_OPTIONS.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  let borderCol = 'rgba(255,255,255,0.15)';
                  let bgCol = 'rgba(255,255,255,0.05)';
                  if (isSelected && answeredCorrect) { borderCol = '#4caf50'; bgCol = 'rgba(76,175,80,0.2)'; }
                  else if (isSelected && !answeredCorrect) { borderCol = '#ef5350'; bgCol = 'rgba(239,83,80,0.2)'; }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={!isUnrolled || answeredCorrect}
                      style={{
                        background: bgCol, border: `1.5px solid ${borderCol}`, borderRadius: '8px',
                        padding: '6px 8px', textAlign: 'center', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800,
                        cursor: isUnrolled && !answeredCorrect ? 'pointer' : 'default', opacity: !isUnrolled ? 0.5 : 1,
                        lineHeight: 1.2,
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {isComplete ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '1.1rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Formula discovered: <strong>Base (πr) × Height (r) = Area (πr²)</strong>!
                  </p>
                </div>
                <button className="btn btn-green btn-sm" style={{ padding: '3px 10px', minHeight: '26px', fontSize: '0.8rem' }} onClick={onComplete}>Complete ✓</button>
              </div>
            ) : (
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>
                {!isUnrolled ? 'Unroll the circle fully to unlock confirmation.' : 'Select the dimensions above to complete Station A.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
