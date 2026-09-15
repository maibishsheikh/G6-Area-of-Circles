// src/components/simulations/GardenDesignerStation.jsx
// Station B: Garden Designer Mission — Target Area Challenge with live interactive scaling

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { areaOfCircle } from '../../utils/circleMath.js';

const CHALLENGES = [
  {
    targetArea: 78.5,
    targetRadius: 5,
    unit: 'm',
    piVal: 3.14,
    piLabel: '3.14',
    title: 'Sunny Marigold Ring',
    flowerEmoji: '🌻',
    description: 'Design a flowerbed with an area of 78.5 m² using π ≈ 3.14.',
  },
  {
    targetArea: 154,
    targetRadius: 7,
    unit: 'm',
    piVal: 22 / 7,
    piLabel: '22/7',
    title: 'Rose Garden Circle',
    flowerEmoji: '🌹',
    description: 'Design a circular rose garden with an area of 154 m² using π ≈ 22/7.',
  },
  {
    targetArea: 314,
    targetRadius: 10,
    unit: 'm',
    piVal: 3.14,
    piLabel: '3.14',
    title: 'Grand Botanical Plaza',
    flowerEmoji: '🌸',
    description: 'Design a grand fountain garden of 314 m² using π ≈ 3.14.',
  },
];

export default function GardenDesignerStation({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);
  const [radius, setRadius] = useState(3);
  const [completedRounds, setCompletedRounds] = useState([false, false, false]);
  const [success, setSuccess] = useState(false);

  const challenge = CHALLENGES[challIdx];
  const currentArea = areaOfCircle(radius, challenge.piVal);
  const diff = +(currentArea - challenge.targetArea).toFixed(2);
  const isExact = Math.abs(diff) < 0.1;
  const isOver = diff > 0.1;

  function handleSlider(e) {
    const val = parseFloat(e.target.value);
    setRadius(val);
    setSuccess(false);
  }

  function adjustRadius(delta) {
    const next = Math.max(1, Math.min(14, +(radius + delta).toFixed(1)));
    setRadius(next);
    setSuccess(false);
    sounds.click();
  }

  function handleCheck() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      const updated = [...completedRounds];
      updated[challIdx] = true;
      setCompletedRounds(updated);

      narrate([
        {
          text: `Spectacular! Radius ${radius} metres gives exactly ${challenge.targetArea} square metres!`,
          style: 'celebration',
        },
      ]);
    } else {
      sounds.wrong();
      narrate([
        {
          text: isOver
            ? `Your garden is ${currentArea} square metres, which is too big! Reduce the radius.`
            : `Your garden is ${currentArea} square metres, which is too small! Increase the radius.`,
          style: 'encouragement',
        },
      ]);
    }
  }

  function nextChallenge() {
    const nextIdx = (challIdx + 1) % CHALLENGES.length;
    setChallIdx(nextIdx);
    setRadius(nextIdx === 1 ? 4 : nextIdx === 2 ? 6 : 3);
    setSuccess(false);
  }

  const allDone = completedRounds.every(Boolean);

  // SVG dimensions for scaling flowerbed
  // Max SVG radius = 62px for r=14, scale: ~4.5px per metre
  const svgCircleR = Math.max(15, Math.min(75, radius * 5.8));
  const targetSvgR = challenge.targetRadius * 5.8;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🌻 Station B: Garden Designer Mission</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target Area:</span>
          <span className="station-target-num">{challenge.targetArea} m²</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Scaled Garden Visualizer */}
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
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.86rem', fontWeight: 800, color: '#fcd34d' }}>
              <span>{challenge.flowerEmoji} {challenge.title}</span>
              <span>Round {challIdx + 1} of {CHALLENGES.length}</span>
            </div>

            {/* Live SVG Garden Graphic */}
            <svg viewBox="0 0 200 180" width="200" height="150" style={{ overflow: 'visible', margin: '4px 0' }}>
              <defs>
                <radialGradient id="gardenGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#86efac" stopOpacity="0.4" />
                  <stop offset="85%" stopColor="#22c55e" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.85" />
                </radialGradient>
              </defs>

              {/* Target Ghost Ring */}
              <circle
                cx="100"
                cy="90"
                r={targetSvgR}
                fill="none"
                stroke="rgba(255, 213, 79, 0.45)"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <text x="100" y={90 - targetSvgR - 6} fill="#ffd54f" fontSize="9" fontWeight="800" textAnchor="middle">
                Target: {challenge.targetRadius} m
              </text>

              {/* User Adjustable Live Circle */}
              <circle
                cx="100"
                cy="90"
                r={svgCircleR}
                fill="url(#gardenGrad)"
                stroke={isExact ? '#ffd54f' : '#4ade80'}
                strokeWidth={isExact ? '3.5' : '2'}
              />

              {/* Center Marker */}
              <circle cx="100" cy="90" r="3.5" fill="#fcd34d" />

              {/* Radius Line */}
              <line
                x1="100"
                y1="90"
                x2={100 + svgCircleR}
                y2="90"
                stroke="#fcd34d"
                strokeWidth="2.5"
              />
              <circle cx={100 + svgCircleR} cy="90" r="3" fill="#fcd34d" />

              {/* Radius Label */}
              <rect
                x={100 + svgCircleR / 2 - 20}
                y="70"
                width="40"
                height="16"
                rx="4"
                fill="rgba(10,10,46,0.9)"
                stroke="#fcd34d"
                strokeWidth="1"
              />
              <text
                x={100 + svgCircleR / 2}
                y="82"
                fill="#fcd34d"
                fontSize="10"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="var(--font-display)"
              >
                {radius} m
              </text>
            </svg>

            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Dotted ring = Target size · Adjust radius to match the target!
            </span>
          </div>

          {/* Interactive Radius Slider & Controls */}
          <div className="glass-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#66bb6a', whiteSpace: 'nowrap' }}>
              Radius (r):
            </span>
            <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', minHeight: '32px', minWidth: '32px' }} onClick={() => adjustRadius(-1)} disabled={radius <= 1}>
              −
            </button>
            <input
              type="range"
              min="1"
              max="13"
              step="0.5"
              value={radius}
              onChange={handleSlider}
              style={{ flex: 1, accentColor: '#22c55e', cursor: 'pointer' }}
              aria-label="Garden radius slider"
            />
            <button className="btn btn-outline btn-sm" style={{ padding: '4px 10px', minHeight: '32px', minWidth: '32px' }} onClick={() => adjustRadius(1)} disabled={radius >= 13}>
              +
            </button>
            <span className="coin-count-pill" style={{ minWidth: '54px', textAlign: 'center' }}>
              {radius} m
            </span>
          </div>
        </div>

        {/* Right Column: Live Formula Readout & Challenge Lock-in */}
        <div className="station-col-right">
          {/* Live Calculation Display */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>
              📊 Live Garden Calculation:
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 14px' }}>
              <div style={{ fontSize: '0.88rem', color: '#94a3b8' }}>Formula: Area = π × r²</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                {challenge.piLabel} × {radius} × {radius} = <span style={{ color: '#ffd54f' }}>{currentArea} m²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Target: {challenge.targetArea} m²</span>
                <span
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: isExact ? 'rgba(34,197,94,0.25)' : isOver ? 'rgba(239,83,80,0.25)' : 'rgba(245,158,11,0.25)',
                    color: isExact ? '#4ade80' : isOver ? '#ef5350' : '#fcd34d',
                  }}
                >
                  {isExact ? 'Exact Match! ⭐' : isOver ? `+${diff} m² (Too Big)` : `${diff} m² (Too Small)`}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '4px' }}
              onClick={handleCheck}
              disabled={success}
            >
              🔒 Lock in Radius ({radius} m)
            </button>
          </div>

          {/* Success Panel or Round Progress */}
          <div className="glass-card" style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fcd34d' }}>
                🌸 Round Progress:
              </span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {CHALLENGES.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChallIdx(idx);
                      setRadius(idx === 1 ? 4 : idx === 2 ? 6 : 3);
                      setSuccess(false);
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '10px',
                      background: challIdx === idx ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                      border: challIdx === idx ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {completedRounds[idx] ? '✅' : ch.flowerEmoji} R{idx + 1} ({ch.targetArea}m²)
                  </button>
                ))}
              </div>
            </div>

            {/* Success Actions */}
            {success ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Target {challenge.targetArea} m² reached! Radius {radius} m fits the garden blueprint perfectly!
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {!allDone && (
                    <button className="btn btn-primary btn-sm" onClick={nextChallenge}>
                      Next Challenge ➔
                    </button>
                  )}
                  <button className="btn btn-green btn-sm" onClick={onComplete}>
                    Complete Station ✓
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px' }}>
                {challenge.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
