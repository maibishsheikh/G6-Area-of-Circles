// src/components/gamification/KingdomMap.jsx
import React from 'react';
import './KingdomMap.css';
import StarRating from './StarRating.jsx';
import { calcStars } from '../../utils/scoring.js';
import { DISTRICTS } from '../../data/questionBank.js';
import {
  Target,
  Flower2,
  Pizza,
  Clock,
  Cog,
  Search,
  Coins,
  Trophy,
  Palette,
  Crown,
} from 'lucide-react';

// Custom SVG Golden Padlock matching the reference design
function GoldenLock({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="lock-svg"
      aria-label="Locked"
    >
      {/* Curved metallic shackle */}
      <path
        d="M7 10.5V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V10.5"
        stroke="#cbd5e1"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
      {/* Golden lock body */}
      <rect
        x="4.5"
        y="9.5"
        width="15"
        height="12.5"
        rx="3"
        fill="url(#goldGrad)"
        stroke="#b45309"
        strokeWidth="1"
      />
      {/* Keyhole */}
      <circle cx="12" cy="14.5" r="1.3" fill="#5c2d04" />
      <path d="M12 15.8V18" stroke="#5c2d04" strokeWidth="1.3" strokeLinecap="round" />
      <defs>
        <linearGradient id="goldGrad" x1="4.5" y1="9.5" x2="19.5" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="0.6" stopColor="#d97706" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Sleek line-art vector icons for each of the 10 worlds
const WORLD_ICONS = [
  Target,
  Flower2,
  Pizza,
  Clock,
  Cog,
  Search,
  Coins,
  Trophy,
  Palette,
  Crown,
];

export default function KingdomMap({ districtScores, districtCorrect, currentDistrict, onSelectDistrict }) {
  return (
    <div className="kingdom-grid">
      {DISTRICTS.map((dist, idx) => {
        const isCurrent = idx === currentDistrict;
        const isCompleted = districtScores?.[idx] !== null && districtScores?.[idx] !== undefined;
        const prevCompletedAndPassed =
          idx > 0 &&
          districtScores?.[idx - 1] !== null &&
          districtScores?.[idx - 1] !== undefined &&
          ((districtCorrect?.[idx - 1] ?? 0) >= 4 || (districtScores?.[idx - 1] ?? 0) >= 4);

        const isUnlocked = idx === 0 || idx <= currentDistrict || isCompleted || prevCompletedAndPassed;
        const stars = isCompleted ? calcStars(districtScores[idx]) : 0;
        const IconComponent = WORLD_ICONS[idx % WORLD_ICONS.length];

        const qStart = idx * 10 + 1;
        const qEnd = idx * 10 + 10;

        return (
          <div
            key={dist.id}
            className={`kingdom-district-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : 'unlocked'}`}
            onClick={() => isUnlocked && onSelectDistrict && onSelectDistrict(idx)}
            role="button"
            tabIndex={isUnlocked ? 0 : -1}
            title={
              isUnlocked
                ? `Play World ${idx + 1}: ${dist.name}`
                : `World ${idx + 1} is locked. Score 4/10 in World ${idx} to unlock.`
            }
          >
            {/* Top row: W{idx+1} and Q{range} */}
            <div className="card-top-row">
              <span className={`world-badge ${isCurrent ? 'active' : ''}`}>W{idx + 1}</span>
              <span className="q-range-badge">Q{qStart}–{qEnd}</span>
            </div>

            {/* Center: Themed Icon or Golden Padlock + World Name */}
            <div className="card-center">
              <div className="district-icon-wrap">
                {isUnlocked ? (
                  IconComponent ? (
                    <IconComponent size={30} className="unlocked-world-icon" strokeWidth={1.9} />
                  ) : (
                    <span className="district-emoji">{dist.icon}</span>
                  )
                ) : (
                  <GoldenLock size={28} />
                )}
              </div>
              <div className="district-name" title={dist.name}>
                {dist.name}
              </div>
            </div>

            {/* Bottom: Play -> / Locked / Stars */}
            <div className="card-footer">
              {isUnlocked ? (
                isCompleted ? (
                  <div className="completed-action-row">
                    <span className="action-play">Play →</span>
                    <div className="card-stars-mini">
                      <StarRating stars={stars} size="sm" />
                    </div>
                  </div>
                ) : (
                  <span className="action-play">Play →</span>
                )
              ) : (
                <span className="action-locked">Locked</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
