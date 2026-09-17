// src/components/simulations/GardenDesignerStation.jsx
// Station B: Garden Designer Mission — spring-animated growing garden simulation
// with a progressive flower bloom, a live progress ring, and a confetti burst.

import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
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

const FLOWER_SLOTS = 12;
// Vogel / phyllotaxis model — deterministic pleasant scatter within a unit disk.
const GOLDEN_ANGLE = 137.508 * (Math.PI / 180);
const SLOT_POINTS = Array.from({ length: FLOWER_SLOTS }, (_, i) => {
  const r = Math.sqrt((i + 0.5) / FLOWER_SLOTS) * 0.82; // keep inside the ring, not on the edge
  const theta = i * GOLDEN_ANGLE;
  return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
});

function ConfettiBurst({ cx, cy }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => {
        // Deterministic pseudo-scatter (avoids impure Math.random() during render)
        const angle = (i / 16) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.4;
        const dist = 60 + ((i * 37) % 55);
        return {
          id: i,
          emoji: ['✨', '🌟', '💫', '🎉'][i % 4],
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
        };
      }),
    []
  );
  return (
    <>
      {particles.map((p) => (
        <motion.text
          key={p.id}
          x={cx}
          y={cy}
          fontSize="16"
          textAnchor="middle"
          initial={{ opacity: 1, translateX: 0, translateY: 0, scale: 0.6 }}
          animate={{ opacity: 0, translateX: p.dx, translateY: p.dy, scale: 1.4 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {p.emoji}
        </motion.text>
      ))}
    </>
  );
}

export default function GardenDesignerStation({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [challIdx, setChallIdx] = useState(0);
  const [radius, setRadius] = useState(3);
  const [completedRounds, setCompletedRounds] = useState([false, false, false]);
  const [success, setSuccess] = useState(false);
  const [burstId, setBurstId] = useState(0);
  const [showBurst, setShowBurst] = useState(false);
  const burstTimerRef = useRef(null);

  const challenge = CHALLENGES[challIdx];
  const currentArea = areaOfCircle(radius, challenge.piVal);
  const diff = +(currentArea - challenge.targetArea).toFixed(2);
  const isExact = Math.abs(diff) < 0.1;
  const isOver = diff > 0.1;
  const progressPct = Math.max(0, Math.min(1, currentArea / challenge.targetArea));

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
      setBurstId((n) => n + 1);
      setShowBurst(true);
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
      burstTimerRef.current = setTimeout(() => setShowBurst(false), 1200);

      narrate([{ text: `Spectacular! Radius ${radius} metres gives exactly ${challenge.targetArea} square metres!`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{
        text: isOver
          ? `Your garden is ${currentArea} square metres, which is too big! Reduce the radius.`
          : `Your garden is ${currentArea} square metres, which is too small! Increase the radius.`,
        style: 'encouragement',
      }]);
    }
  }

  function nextChallenge() {
    const nextIdx = (challIdx + 1) % CHALLENGES.length;
    setChallIdx(nextIdx);
    setRadius(nextIdx === 1 ? 4 : nextIdx === 2 ? 6 : 3);
    setSuccess(false);
  }

  const allDone = completedRounds.every(Boolean);

  const svgCircleR = Math.max(25, Math.min(145, radius * 12.5));
  const targetSvgR = challenge.targetRadius * 12.5;
  const GARDEN_CX = 260, GARDEN_CY = 145;

  // Ring progress gauge
  const ringR = 15;
  const ringCirc = 2 * Math.PI * ringR;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🌻 Station B: Garden Designer Simulation</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target Area:</span>
          <span className="station-target-num">{challenge.targetArea} m²</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Scaled Garden Visualizer */}
        <div className="station-col-left">
          <div className="glass-card" style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', fontWeight: 800, color: '#fcd34d', padding: '0 4px' }}>
              <span>{challenge.flowerEmoji} {challenge.title}</span>
              <span>Round {challIdx + 1} of {CHALLENGES.length}</span>
            </div>

            <svg viewBox="0 0 520 290" style={{ width: '100%', height: '100%', maxHeight: 'clamp(180px, 36vh, 290px)', overflow: 'visible', margin: '4px 0' }}>
              <defs>
                <radialGradient id="gardenGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#86efac" stopOpacity="0.45" />
                  <stop offset="85%" stopColor="#22c55e" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#15803d" stopOpacity="0.9" />
                </radialGradient>
              </defs>

              {/* Decorative garden landscape grid & guide rings */}
              <circle cx={GARDEN_CX} cy={GARDEN_CY} r="35" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <circle cx={GARDEN_CX} cy={GARDEN_CY} r="70" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <circle cx={GARDEN_CX} cy={GARDEN_CY} r="105" fill="none" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="3,3" />
              <line x1={GARDEN_CX - 135} y1={GARDEN_CY} x2={GARDEN_CX + 135} y2={GARDEN_CY} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4,4" />
              <line x1={GARDEN_CX} y1={GARDEN_CY - 135} x2={GARDEN_CX} y2={GARDEN_CY + 135} stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4,4" />

              {/* Target Ghost Ring */}
              <circle cx={GARDEN_CX} cy={GARDEN_CY} r={targetSvgR} fill="none" stroke="rgba(255, 213, 79, 0.5)" strokeWidth="2.5" strokeDasharray="5,5" />
              <text x={GARDEN_CX} y={GARDEN_CY - targetSvgR - 8} fill="#ffd54f" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
                Target: {challenge.targetRadius} m
              </text>

              {/* Spring-animated live circle */}
              <motion.circle
                cx={GARDEN_CX}
                cy={GARDEN_CY}
                fill="url(#gardenGrad)"
                stroke={isExact ? '#ffd54f' : '#4ade80'}
                initial={{ r: 25, strokeWidth: 2 }}
                animate={{ r: svgCircleR, strokeWidth: isExact ? 4 : 2.5 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              />

              {/* Progressive flower bloom — positions fixed relative to target ring */}
              {SLOT_POINTS.map((pt, i) => {
                const threshold = (challenge.targetRadius * (i + 1)) / FLOWER_SLOTS;
                const visible = radius >= threshold;
                return (
                  <motion.text
                    key={i}
                    x={GARDEN_CX + pt.x * targetSvgR}
                    y={GARDEN_CY + pt.y * targetSvgR}
                    fontSize="16"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    initial={false}
                    animate={visible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 16, delay: visible ? i * 0.025 : 0 }}
                    style={{ transformOrigin: 'center' }}
                  >
                    {challenge.flowerEmoji}
                  </motion.text>
                );
              })}

              {/* Center Marker + Radius Line */}
              <circle cx={GARDEN_CX} cy={GARDEN_CY} r="4.5" fill="#fcd34d" />
              <motion.line
                x1={GARDEN_CX} y1={GARDEN_CY} y2={GARDEN_CY}
                stroke="#fcd34d" strokeWidth="3"
                initial={{ x2: GARDEN_CX + 25 }}
                animate={{ x2: GARDEN_CX + svgCircleR }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              />
              <motion.circle cy={GARDEN_CY} r="4" fill="#fcd34d" initial={{ cx: GARDEN_CX + 25 }} animate={{ cx: GARDEN_CX + svgCircleR }} transition={{ type: 'spring', stiffness: 220, damping: 20 }} />

              {showBurst && <ConfettiBurst key={burstId} cx={GARDEN_CX} cy={GARDEN_CY} />}
            </svg>

            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              Dotted ring = Target · Watch flowerbed bloom as you approach!
            </span>
          </div>

          {/* Interactive Radius Slider & Controls */}
          <div className="glass-card" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#66bb6a', whiteSpace: 'nowrap' }}>Radius (r):</span>
            <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '26px', minWidth: '26px' }} onClick={() => adjustRadius(-1)} disabled={radius <= 1}>−</button>
            <input
              type="range" min="1" max="13" step="0.5" value={radius}
              onChange={handleSlider}
              style={{ flex: 1, accentColor: '#22c55e', cursor: 'pointer' }}
              aria-label="Garden radius slider"
            />
            <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '26px', minWidth: '26px' }} onClick={() => adjustRadius(1)} disabled={radius >= 13}>+</button>
            <span className="coin-count-pill" style={{ minWidth: '48px', textAlign: 'center' }}>{radius} m</span>
          </div>
        </div>

        {/* Right Column: Live Formula Readout & Challenge Lock-in */}
        <div className="station-col-right">
          <div className="glass-card" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>📊 Live Garden Calculation:</span>
              <svg width="30" height="30" viewBox="0 0 38 38" style={{ flexShrink: 0 }}>
                <circle cx="19" cy="19" r={ringR} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                <motion.circle
                  cx="19" cy="19" r={ringR} fill="none"
                  stroke={isExact ? '#4ade80' : isOver ? '#ef5350' : '#f59e0b'}
                  strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={ringCirc}
                  transform="rotate(-90 19 19)"
                  initial={{ strokeDashoffset: ringCirc }}
                  animate={{ strokeDashoffset: ringCirc * (1 - Math.min(1, progressPct)) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </svg>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Formula: Area = π × r²</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', margin: '2px 0' }}>
                {challenge.piLabel} × {radius}² = <span style={{ color: '#ffd54f' }}>{currentArea} m²</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Target: {challenge.targetArea} m²</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 900, padding: '2px 6px', borderRadius: '6px', background: isExact ? 'rgba(34,197,94,0.25)' : isOver ? 'rgba(239,83,80,0.25)' : 'rgba(245,158,11,0.25)', color: isExact ? '#4ade80' : isOver ? '#ef5350' : '#fcd34d' }}>
                  {isExact ? 'Exact Match! ⭐' : isOver ? `+${diff}m² (Big)` : `${diff}m² (Small)`}
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-sm" style={{ width: '100%', minHeight: '30px', padding: '4px 10px', fontSize: '0.84rem' }} onClick={handleCheck} disabled={success}>
              🔒 Lock in Radius ({radius} m)
            </button>
          </div>

          <div className="glass-card" style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d' }}>🌸 Round Progress:</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {CHALLENGES.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setChallIdx(idx); setRadius(idx === 1 ? 4 : idx === 2 ? 6 : 3); setSuccess(false); }}
                    style={{
                      flex: 1, padding: '4px 6px', borderRadius: '8px',
                      background: challIdx === idx ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                      border: challIdx === idx ? '1.5px solid #f59e0b' : '1px solid rgba(255,255,255,0.12)',
                      color: '#ffffff', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer',
                    }}
                  >
                    {completedRounds[idx] ? '✅' : ch.flowerEmoji} R{idx + 1} ({ch.targetArea}m²)
                  </button>
                ))}
              </div>
            </div>

            {success ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Target {challenge.targetArea} m² reached! Radius {radius} m fits blueprint!
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!allDone && (
                    <button className="btn btn-primary btn-sm" style={{ padding: '3px 8px', minHeight: '26px', fontSize: '0.78rem' }} onClick={nextChallenge}>Next ➔</button>
                  )}
                  <button className="btn btn-green btn-sm" style={{ padding: '3px 8px', minHeight: '26px', fontSize: '0.78rem' }} onClick={onComplete}>Complete ✓</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                {challenge.description}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
