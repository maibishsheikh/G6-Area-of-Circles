// src/components/shared/CircleVisual.jsx
// Visual geometry renderer for CircleQuest questions, simulations, and previews

import React from 'react';

export default function CircleVisual({ type, data, compact = false }) {
  if (!data) return null;

  const w = compact ? 220 : 300;
  const h = compact ? 150 : 200;

  // 1. Circle with radius indicated
  if (type === 'circle-radius') {
    const { radius = 7, unit = 'cm', piUsed } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <radialGradient id="gradRadiusCircle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(79, 195, 247, 0.45)" />
              <stop offset="100%" stopColor="rgba(3, 105, 161, 0.25)" />
            </radialGradient>
          </defs>
          {/* Main Circle */}
          <circle cx="100" cy="80" r="60" fill="url(#gradRadiusCircle)" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Center Point */}
          <circle cx="100" cy="80" r="3.5" fill="#fcd34d" />
          {/* Radius line from center to right edge */}
          <line x1="100" y1="80" x2="160" y2="80" stroke="#fcd34d" strokeWidth="2.5" strokeDasharray="3,3" />
          <circle cx="160" cy="80" r="2.5" fill="#fcd34d" />
          {/* Radius label */}
          <rect x="110" y="62" width="48" height="17" rx="4" fill="rgba(10,10,46,0.85)" stroke="rgba(252,211,77,0.5)" strokeWidth="1" />
          <text x="134" y="74" fill="#fcd34d" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            r = {radius} {unit}
          </text>
        </svg>
        {piUsed && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            π ≈ {piUsed}
          </span>
        )}
      </div>
    );
  }

  // 2. Circle with diameter indicated
  if (type === 'circle-diameter') {
    const { diameter = 14, radius, unit = 'cm', piUsed } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <radialGradient id="gradDiameterCircle" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 138, 101, 0.4)" />
              <stop offset="100%" stopColor="rgba(194, 65, 12, 0.22)" />
            </radialGradient>
          </defs>
          {/* Circle */}
          <circle cx="100" cy="80" r="60" fill="url(#gradDiameterCircle)" stroke="#fb923c" strokeWidth="2.5" />
          {/* Center Point */}
          <circle cx="100" cy="80" r="3.5" fill="#fcd34d" />
          {/* Full diameter line */}
          <line x1="40" y1="80" x2="160" y2="80" stroke="#fcd34d" strokeWidth="2" />
          <circle cx="40" cy="80" r="2.5" fill="#fcd34d" />
          <circle cx="160" cy="80" r="2.5" fill="#fcd34d" />
          {/* Diameter label */}
          <rect x="74" y="62" width="52" height="17" rx="4" fill="rgba(10,10,46,0.85)" stroke="rgba(252,211,77,0.5)" strokeWidth="1" />
          <text x="100" y="74" fill="#fcd34d" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            d = {diameter} {unit}
          </text>
        </svg>
        {piUsed && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            π ≈ {piUsed} {radius ? `(r = ${radius} ${unit})` : ''}
          </span>
        )}
      </div>
    );
  }

  // 3. Semicircle
  if (type === 'semicircle') {
    const { radius = 10, unit = 'cm', piUsed } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 150" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="gradSemi" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(79, 195, 247, 0.45)" />
              <stop offset="100%" stopColor="rgba(14, 116, 144, 0.25)" />
            </linearGradient>
          </defs>
          {/* Semicircle arc: cx=100, cy=105, r=65 */}
          <path d="M 35 105 A 65 65 0 0 1 165 105 Z" fill="url(#gradSemi)" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Center point */}
          <circle cx="100" cy="105" r="3.5" fill="#fcd34d" />
          {/* Radius line to top */}
          <line x1="100" y1="105" x2="100" y2="40" stroke="#fcd34d" strokeWidth="2" strokeDasharray="3,3" />
          {/* Label */}
          <rect x="74" y="65" width="52" height="17" rx="4" fill="rgba(10,10,46,0.85)" stroke="rgba(252,211,77,0.5)" strokeWidth="1" />
          <text x="100" y="77" fill="#fcd34d" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            r = {radius} {unit}
          </text>
        </svg>
        {piUsed && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            Semicircle (½ Circle) · π ≈ {piUsed}
          </span>
        )}
      </div>
    );
  }

  // 4. Quarter Circle
  if (type === 'quarter-circle') {
    const { radius = 10, unit = 'cm', piUsed } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="gradQuarter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(176, 190, 197, 0.45)" />
              <stop offset="100%" stopColor="rgba(71, 85, 105, 0.25)" />
            </linearGradient>
          </defs>
          {/* Quarter Circle at corner (55, 125), r=75 */}
          <path d="M 55 125 L 130 125 A 75 75 0 0 0 55 50 Z" fill="url(#gradQuarter)" stroke="#cbd5e1" strokeWidth="2.5" />
          {/* Right-angle square */}
          <rect x="55" y="113" width="12" height="12" fill="none" stroke="#fcd34d" strokeWidth="1.5" />
          {/* Center vertex */}
          <circle cx="55" cy="125" r="3.5" fill="#fcd34d" />
          {/* Horizontal Radius label */}
          <rect x="80" y="128" width="48" height="16" rx="4" fill="rgba(10,10,46,0.85)" stroke="rgba(252,211,77,0.5)" strokeWidth="1" />
          <text x="104" y="139" fill="#fcd34d" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            r = {radius} {unit}
          </text>
        </svg>
        {piUsed && (
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            Quarter Circle (¼ Circle) · π ≈ {piUsed}
          </span>
        )}
      </div>
    );
  }

  // 5. Composite Track (Stadium Shape)
  if (type === 'composite-track') {
    const { length = 80, radius = 10, width = 20, unit = 'm' } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 240 140" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="gradTrackRect" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(239, 83, 80, 0.35)" />
              <stop offset="100%" stopColor="rgba(185, 28, 28, 0.2)" />
            </linearGradient>
            <linearGradient id="gradTrackSemi" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.35)" />
              <stop offset="100%" stopColor="rgba(194, 65, 12, 0.2)" />
            </linearGradient>
          </defs>
          {/* Left Semicircle: cx=70, cy=70, r=40 */}
          <path d="M 70 30 A 40 40 0 0 0 70 110 Z" fill="url(#gradTrackSemi)" stroke="#f87171" strokeWidth="2" />
          {/* Central Rectangle: x=70, y=30, width=100, height=80 */}
          <rect x="70" y="30" width="100" height="80" fill="url(#gradTrackRect)" stroke="#ef5350" strokeWidth="2" />
          {/* Right Semicircle: cx=170, cy=70, r=40 */}
          <path d="M 170 30 A 40 40 0 0 1 170 110 Z" fill="url(#gradTrackSemi)" stroke="#f87171" strokeWidth="2" />

          {/* Dotted dividers between rect and semicircles */}
          <line x1="70" y1="30" x2="70" y2="110" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="170" y1="30" x2="170" y2="110" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="3,3" />

          {/* Length label */}
          <rect x="102" y="16" width="38" height="15" rx="3" fill="rgba(10,10,46,0.85)" stroke="#fcd34d" strokeWidth="1" />
          <text x="121" y="27" fill="#fcd34d" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            L = {length} {unit}
          </text>
          {/* Width / 2r label */}
          <text x="120" y="74" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
            Rect ({length} × {width})
          </text>
          {/* Semicircle labels */}
          <text x="50" y="73" fill="#fcd34d" fontSize="8.5" fontWeight="800" textAnchor="middle">
            Semi (r={radius})
          </text>
          <text x="190" y="73" fill="#fcd34d" fontSize="8.5" fontWeight="800" textAnchor="middle">
            Semi (r={radius})
          </text>
        </svg>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
          Stadium = Rectangle + 2 Semicircles (1 full circle)
        </span>
      </div>
    );
  }

  // 6. Shaded Region
  if (type === 'shaded-region') {
    const { shapeType = 'circle-in-square', side = 14, radius = 7, rOuter = 10, rInner = 6, unit = 'cm' } = data;

    if (shapeType === 'circle-in-square') {
      return (
        <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
            {/* Shaded Square */}
            <rect x="45" y="25" width="110" height="110" fill="rgba(38, 198, 218, 0.35)" stroke="#26c6da" strokeWidth="2" />
            {/* Cutout Circle (Hole) */}
            <circle cx="100" cy="80" r="48" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2" />
            {/* Radius line of hole */}
            <line x1="100" y1="80" x2="148" y2="80" stroke="#fcd34d" strokeWidth="1.5" strokeDasharray="2,2" />
            <circle cx="100" cy="80" r="3" fill="#fcd34d" />
            {/* Labels */}
            <text x="124" y="75" fill="#fcd34d" fontSize="9.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
              r = {radius}
            </text>
            <text x="100" y="18" fill="#26c6da" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
              Square side = {side} {unit}
            </text>
            <text x="100" y="96" fill="#94a3b8" fontSize="8.5" fontWeight="700" textAnchor="middle">
              (cutout hole)
            </text>
          </svg>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            Shaded Area = Square − Circle
          </span>
        </div>
      );
    }

    if (shapeType === 'ring') {
      return (
        <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
            {/* Outer Shaded Circle */}
            <circle cx="100" cy="80" r="60" fill="rgba(38, 198, 218, 0.35)" stroke="#26c6da" strokeWidth="2" />
            {/* Inner Hollow Circle */}
            <circle cx="100" cy="80" r="34" fill="#0a0a2e" stroke="#fcd34d" strokeWidth="2" />
            <circle cx="100" cy="80" r="3" fill="#fcd34d" />
            {/* Inner radius line */}
            <line x1="100" y1="80" x2="134" y2="80" stroke="#fcd34d" strokeWidth="1.5" />
            {/* Outer radius line */}
            <line x1="100" y1="80" x2="100" y2="20" stroke="#26c6da" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Labels */}
            <text x="117" y="76" fill="#fcd34d" fontSize="9" fontWeight="800" textAnchor="middle">
              r={rInner}
            </text>
            <text x="100" y="14" fill="#26c6da" fontSize="10" fontWeight="800" textAnchor="middle">
              R = {rOuter} {unit}
            </text>
          </svg>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '-4px', fontWeight: 700 }}>
            Shaded Ring = Outer Circle − Inner Circle
          </span>
        </div>
      );
    }

    return null;
  }

  // 7. Comparison: Circle A vs Circle B
  if (type === 'comparison') {
    const { r1 = 4, r2 = 8, unit = 'cm' } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 240 140" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          {/* Circle A */}
          <circle cx="65" cy="75" r="32" fill="rgba(255, 202, 40, 0.3)" stroke="#ffca28" strokeWidth="2" />
          <circle cx="65" cy="75" r="2.5" fill="#ffffff" />
          <line x1="65" y1="75" x2="97" y2="75" stroke="#ffffff" strokeWidth="1.5" />
          <text x="65" y="36" fill="#ffca28" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            Circle A
          </text>
          <text x="65" y="120" fill="#cbd5e1" fontSize="10" fontWeight="700" textAnchor="middle">
            r = {r1} {unit}
          </text>

          {/* Circle B */}
          <circle cx="170" cy="75" r="50" fill="rgba(79, 195, 247, 0.3)" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="170" cy="75" r="2.5" fill="#ffffff" />
          <line x1="170" y1="75" x2="220" y2="75" stroke="#ffffff" strokeWidth="1.5" />
          <text x="170" y="18" fill="#38bdf8" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            Circle B
          </text>
          <text x="170" y="136" fill="#cbd5e1" fontSize="10" fontWeight="700" textAnchor="middle">
            r = {r2} {unit}
          </text>
        </svg>
        <span style={{ fontSize: '0.8rem', color: '#ffd54f', marginTop: '-4px', fontWeight: 800 }}>
          Doubling radius (2×) quadruples area (4×)!
        </span>
      </div>
    );
  }

  // 8. Reverse Radius (Area Known, r = ?)
  if (type === 'reverse-radius') {
    const { area = 314, unit = 'cm', piUsed = '3.14' } = data;
    return (
      <div className="circle-visual-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 200 160" width={w} height={h} style={{ maxHeight: '100%', overflow: 'visible' }}>
          <defs>
            <radialGradient id="gradMystery" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(186, 104, 200, 0.45)" />
              <stop offset="100%" stopColor="rgba(123, 31, 162, 0.25)" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="80" r="58" fill="url(#gradMystery)" stroke="#ba68c8" strokeWidth="2.5" />
          <circle cx="100" cy="80" r="3.5" fill="#fcd34d" />
          <line x1="100" y1="80" x2="158" y2="80" stroke="#fcd34d" strokeWidth="2.5" strokeDasharray="3,3" />
          {/* Question mark on radius */}
          <rect x="118" y="62" width="32" height="18" rx="4" fill="rgba(10,10,46,0.9)" stroke="#fcd34d" strokeWidth="1" />
          <text x="134" y="75" fill="#fcd34d" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            r = ?
          </text>
          {/* Known Area badge inside */}
          <rect x="65" y="90" width="70" height="20" rx="6" fill="rgba(10,10,46,0.85)" stroke="#ba68c8" strokeWidth="1" />
          <text x="100" y="104" fill="#ffffff" fontSize="10.5" fontWeight="800" textAnchor="middle" fontFamily="var(--font-display)">
            Area = {area} {unit}²
          </text>
        </svg>
        <span style={{ fontSize: '0.8rem', color: '#ba68c8', marginTop: '-4px', fontWeight: 800 }}>
          Area known · Work backwards to find radius (π ≈ {piUsed})
        </span>
      </div>
    );
  }

  return null;
}
