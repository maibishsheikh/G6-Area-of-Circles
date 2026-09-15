// src/components/simulations/SliceDiscoveryLab.jsx
// Station A: Interactive Formula Discovery — Slicing Circle into a Rectangle

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const SLICE_STEPS = [4, 8, 16, 32, 64];

export default function SliceDiscoveryLab({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);

  const radius = 6; // cm
  const sliceCount = SLICE_STEPS[stepIdx];
  const halfCircumference = +(Math.PI * radius).toFixed(2); // ~18.85
  const area = +(Math.PI * radius * radius).toFixed(2); // ~113.10
  const isMaxSlices = stepIdx === SLICE_STEPS.length - 1;
  const isComplete = isMaxSlices && answeredCorrect;

  function handleSliderChange(e) {
    const val = parseInt(e.target.value, 10);
    setStepIdx(val);
    sounds.click();
    if (val === SLICE_STEPS.length - 1 && !answeredCorrect) {
      narrate([{ text: "Look at the rearranged wedges! Notice how the top and bottom become flat like a rectangle of length pi times radius!", style: 'encouragement' }]);
    }
  }

  function stepSlice(delta) {
    const next = Math.max(0, Math.min(SLICE_STEPS.length - 1, stepIdx + delta));
    if (next !== stepIdx) {
      setStepIdx(next);
      sounds.click();
    }
  }

  const QUESTION_OPTIONS = [
    { text: 'Base = πr (half circumference), Height = r (radius)', correct: true },
    { text: 'Base = 2πr (circumference), Height = diameter (2r)', correct: false },
    { text: 'Base = πr², Height = 2r', correct: false },
    { text: 'Base = radius, Height = radius', correct: false },
  ];

  function handleSelectOption(idx) {
    if (answeredCorrect) return;
    setSelectedOpt(idx);
    const opt = QUESTION_OPTIONS[idx];
    if (opt.correct) {
      setAnsweredCorrect(true);
      sounds.correct();
      narrate([{ text: "Spot on! The unrolled rectangle has base pi times radius and height radius. Base times height equals pi times radius squared!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "Not quite. Remember: the bottom edge is formed by half the wedges, which equals half of the circumference!", style: 'thinking' }]);
    }
  }

  // Generate SVG paths for Circle Slices
  const circleRadius = 55;
  const cx = 80;
  const cy = 70;
  const sliceAngle = (2 * Math.PI) / sliceCount;

  const circleSlices = [];
  for (let i = 0; i < sliceCount; i++) {
    const a1 = i * sliceAngle - Math.PI / 2;
    const a2 = (i + 1) * sliceAngle - Math.PI / 2;
    const x1 = cx + circleRadius * Math.cos(a1);
    const y1 = cy + circleRadius * Math.sin(a1);
    const x2 = cx + circleRadius * Math.cos(a2);
    const y2 = cy + circleRadius * Math.sin(a2);
    const color = i % 2 === 0 ? '#38bdf8' : '#fcd34d';
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${circleRadius} ${circleRadius} 0 0 1 ${x2} ${y2} Z`;
    circleSlices.push(<path key={i} d={pathD} fill={color} stroke="#0a0a2e" strokeWidth="0.8" opacity="0.9" />);
  }

  // Generate SVG for rearranged interlocking wedges into near-rectangle
  // Width of base is proportional to pi * r
  const rectSvgW = 220;
  const wedgeBaseW = rectSvgW / (sliceCount / 2);
  const wedgeHeight = 60;
  const startX = 20;
  const midY = 70;

  const rearrangedWedges = [];
  for (let i = 0; i < sliceCount; i++) {
    const isPointingUp = i % 2 === 1;
    const slotIdx = Math.floor(i / 2);
    const color = i % 2 === 0 ? '#38bdf8' : '#fcd34d';

    if (isPointingUp) {
      // Base on top, vertex on bottom
      const xLeft = startX + slotIdx * wedgeBaseW;
      const xRight = xLeft + wedgeBaseW;
      const xMid = (xLeft + xRight) / 2;
      const pathD = `M ${xLeft} ${midY - wedgeHeight / 2} L ${xRight} ${midY - wedgeHeight / 2} L ${xMid} ${midY + wedgeHeight / 2} Z`;
      rearrangedWedges.push(<path key={`up-${i}`} d={pathD} fill={color} stroke="#0a0a2e" strokeWidth="0.8" opacity="0.92" />);
    } else {
      // Base on bottom, vertex on top
      const xLeft = startX + slotIdx * wedgeBaseW;
      const xRight = xLeft + wedgeBaseW;
      const xMid = (xLeft + xRight) / 2;
      const pathD = `M ${xLeft} ${midY + wedgeHeight / 2} L ${xRight} ${midY + wedgeHeight / 2} L ${xMid} ${midY - wedgeHeight / 2} Z`;
      rearrangedWedges.push(<path key={`down-${i}`} d={pathD} fill={color} stroke="#0a0a2e" strokeWidth="0.8" opacity="0.92" />);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔪 Station A: Slice &amp; Discover Lab</h3>
        <div className="station-target-box">
          <span className="station-target-label">Slices:</span>
          <span className="station-target-num">{sliceCount}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Visualizers */}
        <div className="station-col-left">
          {/* Top: Circle sliced */}
          <div className="lab-visual-box glass-card" style={{ padding: '8px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>
              <span>1. Original Circle (r = {radius} cm)</span>
              <span style={{ color: '#fcd34d' }}>Circumference ≈ {+(2 * Math.PI * radius).toFixed(2)} cm</span>
            </div>
            <svg viewBox="0 0 160 140" width="160" height="110" style={{ overflow: 'visible' }}>
              {circleSlices}
              <circle cx={cx} cy={cy} r="3" fill="#ffffff" />
            </svg>
          </div>

          {/* Bottom: Rearranged wedges into rectangle */}
          <div className="lab-visual-box glass-card" style={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>
              <span>2. Rearranged Wedges {isMaxSlices ? '➔ Nearly a Rectangle!' : '➔ Becoming a Rectangle'}</span>
              <span style={{ color: '#38bdf8' }}>Base ≈ πr ({halfCircumference} cm)</span>
            </div>
            <svg viewBox="0 0 260 120" width="260" height="95" style={{ overflow: 'visible' }}>
              {rearrangedWedges}
              {/* Dimensions */}
              {/* Bottom base label: pi * r */}
              <line x1={startX} y1={midY + wedgeHeight / 2 + 10} x2={startX + (sliceCount / 2) * wedgeBaseW} y2={midY + wedgeHeight / 2 + 10} stroke="#fcd34d" strokeWidth="1.5" />
              <text x={startX + ((sliceCount / 2) * wedgeBaseW) / 2} y={midY + wedgeHeight / 2 + 22} fill="#fcd34d" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
                Base ≈ half circumference = πr ≈ {halfCircumference} cm
              </text>
              {/* Height label: r */}
              <line x1={startX - 8} y1={midY - wedgeHeight / 2} x2={startX - 8} y2={midY + wedgeHeight / 2} stroke="#38bdf8" strokeWidth="1.5" />
              <text x={startX - 12} y={midY + 4} fill="#38bdf8" fontSize="10" fontWeight="900" textAnchor="end" fontFamily="var(--font-display)">
                r = {radius} cm
              </text>
            </svg>
          </div>

          {/* Slider Controls with + / - buttons */}
          <div className="lab-slider-row glass-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fcd34d', whiteSpace: 'nowrap' }}>
              Slice Count:
            </span>
            <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', minHeight: '32px', minWidth: '32px' }} onClick={() => stepSlice(-1)} disabled={stepIdx === 0}>
              −
            </button>
            <input
              type="range"
              min="0"
              max={SLICE_STEPS.length - 1}
              step="1"
              value={stepIdx}
              onChange={handleSliderChange}
              style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer' }}
              aria-label="Number of slices slider"
            />
            <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', minHeight: '32px', minWidth: '32px' }} onClick={() => stepSlice(1)} disabled={stepIdx === SLICE_STEPS.length - 1}>
              +
            </button>
            <span className="coin-count-pill" style={{ minWidth: '40px', textAlign: 'center' }}>
              {sliceCount}
            </span>
          </div>
        </div>

        {/* Right Column: Mathematical Discovery & Verification Question */}
        <div className="station-col-right">
          {/* Live Discovery Readout Card */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📐 Live Formula Discovery:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Rectangle Base (half circum.):</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#fcd34d' }}>π × r ≈ {halfCircumference} cm</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 10px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Rectangle Height (radius):</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#38bdf8' }}>r = {radius} cm</div>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '10px', padding: '8px 12px', marginTop: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Rectangle Area = Base × Height:</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffd54f', fontFamily: 'var(--font-display)' }}>
                (π × r) × r = <strong>π × r² ≈ {area} cm²</strong>
              </div>
            </div>
          </div>

          {/* Discovery Confirmation Challenge */}
          <div className="glass-card" style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fcd34d' }}>
                {isMaxSlices ? '🎯 Step 2: Confirm Your Discovery!' : '👉 First: Drag the slider to 64 slices!'}
              </span>
              <p style={{ fontSize: '0.94rem', color: '#ffffff', fontWeight: 700, margin: '6px 0 10px 0' }}>
                When the circle is cut into thin slices and unrolled into a rectangle, what do the base and height represent?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {QUESTION_OPTIONS.map((opt, i) => {
                  const isSelected = selectedOpt === i;
                  let borderCol = 'rgba(255,255,255,0.15)';
                  let bgCol = 'rgba(255,255,255,0.05)';
                  if (isSelected && answeredCorrect) {
                    borderCol = '#4caf50';
                    bgCol = 'rgba(76,175,80,0.2)';
                  } else if (isSelected && !answeredCorrect) {
                    borderCol = '#ef5350';
                    bgCol = 'rgba(239,83,80,0.2)';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={!isMaxSlices || answeredCorrect}
                      style={{
                        background: bgCol,
                        border: `1.5px solid ${borderCol}`,
                        borderRadius: '10px',
                        padding: '8px 12px',
                        textAlign: 'left',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: isMaxSlices && !answeredCorrect ? 'pointer' : 'default',
                        opacity: !isMaxSlices ? 0.5 : 1,
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Success Panel or Guidance */}
            {isComplete ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Formula discovered! A circle unrolls into a rectangle of dimensions <strong>πr by r</strong>, proving <strong>Area = πr²</strong>!
                  </p>
                </div>
                <button className="btn btn-green btn-sm" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '6px' }}>
                {!isMaxSlices
                  ? 'Move the slider to 64 slices to unlock the confirmation question.'
                  : 'Select the correct dimensions above to complete Station A.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
