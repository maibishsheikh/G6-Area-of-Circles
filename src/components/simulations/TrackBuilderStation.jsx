// src/components/simulations/TrackBuilderStation.jsx
// Station C: Running Track Builder Mission — Composite Figure Construction
// (Rectangle + 2 Semicircles), with a spring-animated build and a runner
// that laps the finished track as a success payoff.

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { areaOfCircle } from '../../utils/circleMath.js';

const TARGET_AREA = 1914; // m² (L = 80, r = 10)

// Runner position along the stadium's outer perimeter (0 = start of top straight, going clockwise)
function trackPoint(progress, startX, scaleL, scaleR, midY) {
  const topLen = scaleL;
  const arcLen = Math.PI * scaleR;
  const total = 2 * topLen + 2 * arcLen;
  let s = (((progress % 1) + 1) % 1) * total;

  if (s < topLen) {
    return { x: startX + s, y: midY - scaleR };
  }
  s -= topLen;
  if (s < arcLen) {
    const t = s / arcLen;
    const angle = -Math.PI / 2 + t * Math.PI;
    return { x: startX + scaleL + scaleR * Math.cos(angle), y: midY + scaleR * Math.sin(angle) };
  }
  s -= arcLen;
  if (s < topLen) {
    return { x: startX + scaleL - s, y: midY + scaleR };
  }
  s -= topLen;
  const t = s / arcLen;
  const angle = Math.PI / 2 + t * Math.PI;
  return { x: startX + scaleR * Math.cos(angle), y: midY + scaleR * Math.sin(angle) };
}

export default function TrackBuilderStation({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [length, setLength] = useState(60);
  const [radius, setRadius] = useState(7);
  const [success, setSuccess] = useState(false);
  const [lapProgress, setLapProgress] = useState(0);
  const rafRef = useRef(null);

  const piVal = 3.14;
  const rectArea = length * (2 * radius);
  const circleArea = areaOfCircle(radius, piVal);
  const totalArea = +(rectArea + circleArea).toFixed(2);
  const diff = +(totalArea - TARGET_AREA).toFixed(2);
  const isExact = Math.abs(diff) < 2;

  useEffect(() => {
    if (!success) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const start = performance.now();
    function loop(now) {
      const elapsed = (now - start) / 1000;
      setLapProgress((elapsed / 3.2) % 1);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [success]);

  function adjustLength(delta) {
    setLength((l) => Math.max(30, Math.min(100, l + delta)));
    setSuccess(false);
    sounds.click();
  }

  function adjustRadius(delta) {
    setRadius((r) => Math.max(5, Math.min(18, r + delta)));
    setSuccess(false);
    sounds.click();
  }

  function handleCheck() {
    if (isExact) {
      setSuccess(true);
      sounds.correct();
      narrate([{
        text: 'Incredible engineering! Length 80 metres and radius 10 metres gives a rectangle of 1600 m² and two semicircles of 314 m², totaling exactly 1914 square metres!',
        style: 'celebration',
      }]);
    } else {
      sounds.wrong();
      narrate([{
        text: diff > 0
          ? `Total area is ${totalArea} square metres. That is ${diff} m² too big! Try reducing length or radius.`
          : `Total area is ${totalArea} square metres. That is ${Math.abs(diff)} m² too small! Increase length or radius.`,
        style: 'encouragement',
      }]);
    }
  }

  // Live SVG scaling calculations
  // Live SVG scaling calculations
  const svgWidth = 520;
  const scaleL = length * 2.5;
  const scaleR = radius * 6.5;
  const startX = (svgWidth - (scaleL + 2 * scaleR)) / 2 + scaleR;
  const midY = 140;
  const runnerPos = success ? trackPoint(lapProgress, startX, scaleL, scaleR, midY) : null;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏟️ Station C: Track Builder Simulation</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target Stadium Area:</span>
          <span className="station-target-num">{TARGET_AREA} m²</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Stadium Graphic */}
        <div className="station-col-left">
          <div
            className="glass-card"
            style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', minHeight: 0 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', fontWeight: 800, color: '#f87171', padding: '0 4px' }}>
              <span>{success ? '🏃 Lap in progress!' : 'Composite Stadium: Rectangle + 2 Semicircles'}</span>
              <span style={{ color: '#ffd54f' }}>Total: {totalArea} m²</span>
            </div>

            {/* Live SVG Track Graphic */}
            <svg viewBox="0 0 520 280" style={{ width: '100%', height: '100%', maxHeight: 'clamp(180px, 36vh, 290px)', overflow: 'visible', margin: '4px 0' }}>
              <defs>
                <linearGradient id="stadiumRectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef5350" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="stadiumSemiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#c2410c" stopOpacity="0.35" />
                </linearGradient>
              </defs>

              {/* Outer track border outline / lane marks */}
              <line x1={startX} y1={midY - scaleR - 8} x2={startX + scaleL} y2={midY - scaleR - 8} stroke="rgba(255,255,255,0.08)" strokeDasharray="6,4" />
              <line x1={startX} y1={midY + scaleR + 8} x2={startX + scaleL} y2={midY + scaleR + 8} stroke="rgba(255,255,255,0.08)" strokeDasharray="6,4" />

              {/* Left Semicircle */}
              <motion.path
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ transformOrigin: `${startX}px ${midY}px` }}
                d={`M ${startX} ${midY - scaleR} A ${scaleR} ${scaleR} 0 0 0 ${startX} ${midY + scaleR} Z`}
                fill="url(#stadiumSemiGrad)"
                stroke={isExact ? '#ffd54f' : '#f87171'}
                strokeWidth={isExact ? 3.5 : 2}
              />

              {/* Center Rectangle — spring-animated grow/shrink */}
              <motion.rect
                y={midY - scaleR}
                height={scaleR * 2}
                fill="url(#stadiumRectGrad)"
                stroke={isExact ? '#ffd54f' : '#ef5350'}
                initial={{ x: startX, width: scaleL, strokeWidth: 2 }}
                animate={{ x: startX, width: scaleL, strokeWidth: isExact ? 3.5 : 2 }}
                transition={{ type: 'spring', stiffness: 210, damping: 22 }}
              />

              {/* Right Semicircle */}
              <motion.path
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                style={{ transformOrigin: `${startX + scaleL}px ${midY}px` }}
                d={`M ${startX + scaleL} ${midY - scaleR} A ${scaleR} ${scaleR} 0 0 1 ${startX + scaleL} ${midY + scaleR} Z`}
                fill="url(#stadiumSemiGrad)"
                stroke={isExact ? '#ffd54f' : '#f87171'}
                strokeWidth={isExact ? 3.5 : 2}
              />

              {/* Dotted seam lines */}
              <line x1={startX} y1={midY - scaleR} x2={startX} y2={midY + scaleR} stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="4,4" />
              <line x1={startX + scaleL} y1={midY - scaleR} x2={startX + scaleL} y2={midY + scaleR} stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="4,4" />

              {/* Straight Length dimension line */}
              <line x1={startX} y1={midY - scaleR - 14} x2={startX + scaleL} y2={midY - scaleR - 14} stroke="#fcd34d" strokeWidth="1.8" />
              <text x={startX + scaleL / 2} y={midY - scaleR - 18} fill="#fcd34d" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
                Length = {length} m
              </text>

              {/* Width / Diameter dimension line */}
              <line x1={startX + scaleL + scaleR + 8} y1={midY - scaleR} x2={startX + scaleL + scaleR + 8} y2={midY + scaleR} stroke="#38bdf8" strokeWidth="1.8" />
              <text x={startX + scaleL + scaleR + 14} y={midY + 4} fill="#38bdf8" fontSize="10.5" fontWeight="900" textAnchor="start" fontFamily="var(--font-display)">
                2r = {2 * radius} m
              </text>

              {/* In-shape Labels */}
              <text x={startX + scaleL / 2} y={midY + 5} fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
                Rectangle ({rectArea} m²)
              </text>

              {/* Runner lap animation on success */}
              {runnerPos && (
                <motion.text
                  x={runnerPos.x}
                  y={runnerPos.y}
                  fontSize="22"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  animate={{ y: [runnerPos.y - 2, runnerPos.y + 2, runnerPos.y - 2] }}
                  transition={{ duration: 0.35, repeat: Infinity }}
                >
                  🏃
                </motion.text>
              )}
            </svg>

            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              Two ends = 1 full circle of radius {radius} m ({circleArea} m²)
            </span>
          </div>

          {/* Slider Controls */}
          <div className="glass-card" style={{ padding: '5px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef5350', minWidth: '65px' }}>Length (L):</span>
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => adjustLength(-10)} disabled={length <= 30}>−</button>
              <input
                type="range" min="30" max="100" step="10" value={length}
                onChange={(e) => { setLength(parseInt(e.target.value, 10)); setSuccess(false); }}
                style={{ flex: 1, accentColor: '#ef5350', cursor: 'pointer' }}
                aria-label="Straight length slider"
              />
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => adjustLength(10)} disabled={length >= 100}>+</button>
              <span className="coin-count-pill" style={{ minWidth: '42px', textAlign: 'center' }}>{length} m</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fb923c', minWidth: '65px' }}>Radius (r):</span>
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => adjustRadius(-1)} disabled={radius <= 5}>−</button>
              <input
                type="range" min="5" max="18" step="1" value={radius}
                onChange={(e) => { setRadius(parseInt(e.target.value, 10)); setSuccess(false); }}
                style={{ flex: 1, accentColor: '#fb923c', cursor: 'pointer' }}
                aria-label="Semicircle radius slider"
              />
              <button className="btn btn-outline btn-sm" style={{ padding: '1px 6px', minHeight: '24px', minWidth: '24px' }} onClick={() => adjustRadius(1)} disabled={radius >= 18}>+</button>
              <span className="coin-count-pill" style={{ minWidth: '42px', textAlign: 'center' }}>{radius} m</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Formula & Verification */}
        <div className="station-col-right">
          <div className="glass-card" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>📐 Composite Area Formula:</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '5px 8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Rectangle: L × 2r</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#ef5350' }}>{length} × {2 * radius} = {rectArea} m²</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '5px 8px' }}>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>2 Ends (Full Circle): πr²</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#fb923c' }}>3.14 × {radius}² = {circleArea} m²</div>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', padding: '5px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Total Track Area:</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffd54f' }}>
                {rectArea} + {circleArea} = <strong>{totalArea} m²</strong>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 0 }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fcd34d' }}>🎯 Verification:</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Target: {TARGET_AREA} m²</span>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px',
                  background: isExact ? 'rgba(34,197,94,0.25)' : 'rgba(239,83,80,0.25)',
                  color: isExact ? '#4ade80' : '#ef5350',
                }}>
                  {isExact ? 'Exact Match! ⭐' : diff > 0 ? `+${diff} m² (Big)` : `${diff} m² (Small)`}
                </span>
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleCheck} disabled={success} style={{ marginTop: '4px', minHeight: '28px', padding: '4px 10px', fontSize: '0.84rem' }}>
              📏 Verify Track Area
            </button>

            {success && (
              <div className="station-success anim-bounce-in" style={{ marginTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '1.2rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Track built! {length}m straights + {radius}m ends = <strong>{totalArea} m²</strong>!
                  </p>
                </div>
                <button className="btn btn-green btn-sm" style={{ padding: '3px 10px', minHeight: '26px', fontSize: '0.8rem' }} onClick={onComplete}>Complete ✓</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
