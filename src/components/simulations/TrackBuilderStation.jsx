// src/components/simulations/TrackBuilderStation.jsx
// Station C: Running Track Builder Mission — Composite Figure Construction (Rectangle + 2 Semicircles)

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';
import { areaOfCircle } from '../../utils/circleMath.js';

const TARGET_AREA = 1914; // m² (L = 80, r = 10)

export default function TrackBuilderStation({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [length, setLength] = useState(60);
  const [radius, setRadius] = useState(7);
  const [success, setSuccess] = useState(false);

  const piVal = 3.14;
  const rectArea = length * (2 * radius);
  const circleArea = areaOfCircle(radius, piVal);
  const totalArea = +(rectArea + circleArea).toFixed(2);
  const diff = +(totalArea - TARGET_AREA).toFixed(2);
  const isExact = Math.abs(diff) < 2;

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
      narrate([
        {
          text: `Incredible engineering! Length 80 metres and radius 10 metres gives a rectangle of 1600 m² and two semicircles of 314 m², totaling exactly 1914 square metres!`,
          style: 'celebration',
        },
      ]);
    } else {
      sounds.wrong();
      narrate([
        {
          text:
            diff > 0
              ? `Total area is ${totalArea} square metres. That is ${diff} m² too big! Try reducing length or radius.`
              : `Total area is ${totalArea} square metres. That is ${Math.abs(diff)} m² too small! Increase length or radius.`,
          style: 'encouragement',
        },
      ]);
    }
  }

  // Live SVG scaling calculations
  const svgWidth = 260;
  const scaleL = length * 1.1; // px
  const scaleR = radius * 3.2; // px
  const startX = (svgWidth - (scaleL + 2 * scaleR)) / 2 + scaleR;
  const midY = 70;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏟️ Station C: Track Builder Mission</h3>
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
            style={{
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', fontWeight: 800, color: '#f87171' }}>
              <span>Composite Stadium: Rectangle + 2 Semicircles</span>
              <span style={{ color: '#ffd54f' }}>Total: {totalArea} m²</span>
            </div>

            {/* Live SVG Track Graphic */}
            <svg viewBox="0 0 280 150" width="280" height="130" style={{ overflow: 'visible', margin: '4px 0' }}>
              <defs>
                <linearGradient id="stadiumRectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef5350" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="stadiumSemiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#c2410c" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Left Semicircle */}
              <path
                d={`M ${startX} ${midY - scaleR} A ${scaleR} ${scaleR} 0 0 0 ${startX} ${midY + scaleR} Z`}
                fill="url(#stadiumSemiGrad)"
                stroke="#f87171"
                strokeWidth="2"
              />

              {/* Center Rectangle */}
              <rect
                x={startX}
                y={midY - scaleR}
                width={scaleL}
                height={scaleR * 2}
                fill="url(#stadiumRectGrad)"
                stroke="#ef5350"
                strokeWidth="2"
              />

              {/* Right Semicircle */}
              <path
                d={`M ${startX + scaleL} ${midY - scaleR} A ${scaleR} ${scaleR} 0 0 1 ${startX + scaleL} ${midY + scaleR} Z`}
                fill="url(#stadiumSemiGrad)"
                stroke="#f87171"
                strokeWidth="2"
              />

              {/* Dotted seam lines */}
              <line x1={startX} y1={midY - scaleR} x2={startX} y2={midY + scaleR} stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />
              <line x1={startX + scaleL} y1={midY - scaleR} x2={startX + scaleL} y2={midY + scaleR} stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />

              {/* Straight Length dimension line */}
              <line x1={startX} y1={midY - scaleR - 12} x2={startX + scaleL} y2={midY - scaleR - 12} stroke="#fcd34d" strokeWidth="1.5" />
              <text x={startX + scaleL / 2} y={midY - scaleR - 16} fill="#fcd34d" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
                Length = {length} m
              </text>

              {/* Width / Diameter dimension line */}
              <line x1={startX + scaleL + scaleR + 8} y1={midY - scaleR} x2={startX + scaleL + scaleR + 8} y2={midY + scaleR} stroke="#38bdf8" strokeWidth="1.5" />
              <text x={startX + scaleL + scaleR + 12} y={midY + 4} fill="#38bdf8" fontSize="9.5" fontWeight="900" textAnchor="start" fontFamily="var(--font-display)">
                Width = 2r = {2 * radius} m
              </text>

              {/* In-shape Labels */}
              <text x={startX + scaleL / 2} y={midY + 4} fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">
                Rectangle ({rectArea} m²)
              </text>
            </svg>

            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Two semicircular ends = One complete circle of radius {radius} m ({circleArea} m²)
            </span>
          </div>

          {/* Slider Controls */}
          <div className="glass-card" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Length Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ef5350', minWidth: '70px' }}>
                Length (L):
              </span>
              <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '28px' }} onClick={() => adjustLength(-10)} disabled={length <= 30}>
                −
              </button>
              <input
                type="range"
                min="30"
                max="100"
                step="10"
                value={length}
                onChange={(e) => {
                  setLength(parseInt(e.target.value, 10));
                  setSuccess(false);
                }}
                style={{ flex: 1, accentColor: '#ef5350', cursor: 'pointer' }}
                aria-label="Straight length slider"
              />
              <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '28px' }} onClick={() => adjustLength(10)} disabled={length >= 100}>
                +
              </button>
              <span className="coin-count-pill" style={{ minWidth: '50px', textAlign: 'center' }}>
                {length} m
              </span>
            </div>

            {/* Semicircle Radius Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fb923c', minWidth: '70px' }}>
                Radius (r):
              </span>
              <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '28px' }} onClick={() => adjustRadius(-1)} disabled={radius <= 5}>
                −
              </button>
              <input
                type="range"
                min="5"
                max="16"
                step="1"
                value={radius}
                onChange={(e) => {
                  setRadius(parseInt(e.target.value, 10));
                  setSuccess(false);
                }}
                style={{ flex: 1, accentColor: '#fb923c', cursor: 'pointer' }}
                aria-label="Semicircle radius slider"
              />
              <button className="btn btn-outline btn-sm" style={{ padding: '2px 8px', minHeight: '28px' }} onClick={() => adjustRadius(1)} disabled={radius >= 16}>
                +
              </button>
              <span className="coin-count-pill" style={{ minWidth: '50px', textAlign: 'center' }}>
                {radius} m
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Composite Calculation & Success */}
        <div className="station-col-right">
          {/* Step-by-step calculation card */}
          <div className="glass-card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}>
              🏗️ Composite Area Breakdown:
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Step 1: Rectangle */}
              <div style={{ background: 'rgba(239,83,80,0.15)', border: '1px solid rgba(239,83,80,0.3)', borderRadius: '10px', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>1. Central Rectangle (L × 2r):</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  {length} m × {2 * radius} m = <strong style={{ color: '#fca5a5' }}>{rectArea} m²</strong>
                </div>
              </div>

              {/* Step 2: Two semicircles */}
              <div style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)', borderRadius: '10px', padding: '8px 12px' }}>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>2. Two Semicircles = 1 Full Circle (π × r²):</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff' }}>
                  3.14 × {radius}² = <strong style={{ color: '#fdba74' }}>{circleArea} m²</strong>
                </div>
              </div>

              {/* Total */}
              <div style={{ background: 'rgba(245,158,11,0.2)', border: '1.5px solid #f59e0b', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Total Track Area:</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffd54f', fontFamily: 'var(--font-display)' }}>
                  {rectArea} + {circleArea} = <strong>{totalArea} m²</strong>
                </div>
                <div style={{ fontSize: '0.84rem', color: isExact ? '#4ade80' : '#cbd5e1', marginTop: '2px', fontWeight: 800 }}>
                  {isExact ? '✅ Target Hit (1914 m²)!' : `Target: ${TARGET_AREA} m² (Diff: ${diff > 0 ? '+' : ''}${diff} m²)`}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '2px' }}
              onClick={handleCheck}
              disabled={success}
            >
              🚀 Verify Track Area ({totalArea} m²)
            </button>
          </div>

          {/* Mission Success */}
          <div className="glass-card" style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              <strong style={{ color: '#fcd34d' }}>Mission Objective:</strong> Adjust Length and Semicircle Radius until the total track area equals exactly <strong>1914 m²</strong>.
            </div>

            {success ? (
              <div className="station-success anim-bounce-in" style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🎉</span>
                  <p className="station-success-msg">
                    Target 1914 m² achieved! Length 80 m (rect = 1600 m²) and radius 10 m (circle = 314 m²) make the Olympic stadium track!
                  </p>
                </div>
                <button className="btn btn-green btn-sm" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: '#fcd34d', fontStyle: 'italic', marginTop: '6px' }}>
                💡 Tip: Think about what clean radius gives a circle area close to 314 m²!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
