// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['⚪', '🍕', '🎯', '🛞', '📐', '✨', 'π', 'r²', '💡', '🏆'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating themed particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">🍕</div>
          <h1 className="wonder-title headline">The Big Pizza Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num" style={{ fontSize: 'clamp(1.1rem, 2.2vw + 0.3rem, 1.8rem)' }}>
              Pizza (r = 10 cm) vs Box (20 × 20 cm) ➔ Area?
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A round pizza has a <strong className="wonder-em">radius of 10 cm</strong>. A square pizza box has <strong className="wonder-em">sides of 20 cm</strong>…
            </p>
            <p className="body-text wonder-q">
              Which uses more of the box — the <strong className="wonder-em">pizza</strong>, or the <span className="wonder-highlight">empty corners</span>? By the end of today, you will be able to work this out exactly!
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Let's investigate how to calculate the exact area of a circle!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
