// src/components/phases/StoryPhase.jsx
// 6-Panel Story Journey for CircleQuest

import React, { useEffect } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

function StoryIllustration({ panel }) {
  // Rich SVG fallback illustration for each story panel
  const p = panel.panel;

  return (
    <div
      className="story-img-fallback"
      style={{
        background: panel.imageBg || 'radial-gradient(circle, #1e1b4b 0%, #0a0a2e 100%)',
        width: '100%',
        height: '100%',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Panel 0: Radius vs Diameter */}
      {p === 0 && (
        <svg viewBox="0 0 240 160" width="240" height="150" style={{ overflow: 'visible' }}>
          <circle cx="120" cy="80" r="55" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" strokeWidth="2.5" />
          <circle cx="120" cy="80" r="4" fill="#fcd34d" />
          <line x1="65" y1="80" x2="175" y2="80" stroke="#fcd34d" strokeWidth="2" />
          <text x="120" y="68" fill="#fcd34d" fontSize="10" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            Diameter d = 20 cm
          </text>
          <line x1="120" y1="80" x2="175" y2="80" stroke="#4ade80" strokeWidth="2.5" />
          <text x="147" y="98" fill="#4ade80" fontSize="9.5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            Radius r = 10 cm
          </text>
        </svg>
      )}

      {/* Panel 1: Tally's Pi Secret */}
      {p === 1 && (
        <svg viewBox="0 0 240 160" width="240" height="150" style={{ overflow: 'visible' }}>
          <circle cx="120" cy="80" r="50" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="4,4" />
          <text x="120" y="70" fill="#fcd34d" fontSize="28" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            π
          </text>
          <text x="120" y="92" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
            ≈ 3.14 or 22/7
          </text>
          <text x="120" y="112" fill="#cbd5e1" fontSize="9.5" fontWeight="700" textAnchor="middle">
            Circumference ÷ Diameter
          </text>
        </svg>
      )}

      {/* Panel 2: Slicing into a Rectangle */}
      {p === 2 && (
        <svg viewBox="0 0 240 160" width="240" height="150" style={{ overflow: 'visible' }}>
          <rect x="30" y="50" width="180" height="60" fill="rgba(168, 85, 247, 0.25)" stroke="#c084fc" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="30" y1="120" x2="210" y2="120" stroke="#fcd34d" strokeWidth="2" />
          <text x="120" y="136" fill="#fcd34d" fontSize="10.5" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            Base = π × r
          </text>
          <line x1="20" y1="50" x2="20" y2="110" stroke="#38bdf8" strokeWidth="2" />
          <text x="16" y="84" fill="#38bdf8" fontSize="10.5" fontWeight="900" textAnchor="end" fontFamily="var(--font-display)">
            r
          </text>
          <text x="120" y="85" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            Area = π × r²
          </text>
        </svg>
      )}

      {/* Panel 3: The Pizza Problem */}
      {p === 3 && (
        <svg viewBox="0 0 240 160" width="240" height="150" style={{ overflow: 'visible' }}>
          <rect x="55" y="15" width="130" height="130" fill="rgba(251, 146, 60, 0.25)" stroke="#fb923c" strokeWidth="2" />
          <circle cx="120" cy="80" r="60" fill="rgba(239, 68, 68, 0.4)" stroke="#f87171" strokeWidth="2.5" />
          <text x="120" y="75" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
            Pizza: 314 cm²
          </text>
          <text x="120" y="95" fill="#fcd34d" fontSize="10" fontWeight="800" textAnchor="middle">
            Box: 400 cm²
          </text>
          <text x="68" y="32" fill="#cbd5e1" fontSize="8.5" fontWeight="800">
            Empty (86 cm²)
          </text>
        </svg>
      )}

      {/* Panel 4: The Running Track */}
      {p === 4 && (
        <svg viewBox="0 0 240 160" width="240" height="150" style={{ overflow: 'visible' }}>
          <rect x="70" y="45" width="100" height="70" fill="rgba(239, 83, 80, 0.35)" stroke="#ef5350" strokeWidth="2" />
          <path d="M 70 45 A 35 35 0 0 0 70 115 Z" fill="rgba(251, 146, 60, 0.35)" stroke="#fb923c" strokeWidth="2" />
          <path d="M 170 45 A 35 35 0 0 1 170 115 Z" fill="rgba(251, 146, 60, 0.35)" stroke="#fb923c" strokeWidth="2" />
          <text x="120" y="80" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">
            1600 m²
          </text>
          <text x="120" y="100" fill="#fcd34d" fontSize="9.5" fontWeight="800" textAnchor="middle">
            + 314 m² = 1914 m²
          </text>
        </svg>
      )}

      {/* Panel 5: Fair Day Triumph! */}
      {p === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '3.8rem' }} className="anim-bounce-in">🏆</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fcd34d', fontFamily: 'var(--font-display)' }}>
            Circle Champions!
          </span>
        </div>
      )}

      <span className="fallback-emoji" style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '1.6rem' }}>
        {panel.imageEmoji}
      </span>
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const totalPanels = STORY_PANELS.length;
  const currentIdx = state?.storyPanel || 0;
  const isLastPanel = currentIdx >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(currentIdx)), 300);
    return () => {
      clearTimeout(timer);
      stopAll();
    };
  }, [currentIdx, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={currentIdx}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${((currentIdx + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{currentIdx + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Illustration */}
          <div className="story-image-section">
            <StoryIllustration panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">
                <span className="character-emoji">{panel.characterEmoji || '👧'}</span>
              </div>
              <span className="character-name">{panel.character || 'Zoe'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered Dots + Action Buttons */}
        <div className="story-footer-nav">
          <div className="story-dots-center">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`story-nav-dot ${i === currentIdx ? 'active' : ''} ${i < currentIdx ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="story-nav-actions">
            {currentIdx > 0 && (
              <button
                type="button"
                id="story-prev-btn"
                className="btn btn-outline btn-sm story-prev-btn"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              id="story-next-btn"
              className="btn btn-primary btn-sm story-next-btn"
              onClick={handleNext}
              aria-label={isLastPanel ? 'Start Simulating' : 'Next story'}
            >
              {!isLastPanel ? 'Next →' : 'Simulate! 🧪'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
