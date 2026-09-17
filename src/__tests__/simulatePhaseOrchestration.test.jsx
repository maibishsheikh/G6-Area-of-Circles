import React, { useReducer } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SimulatePhase from '../components/phases/SimulatePhase.jsx';

const initialState = {
  phase: 'simulate',
  storyPanel: 0,
  currentSimStation: 0,
  simStationsComplete: [false, false, false, false],
  audioEnabled: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADVANCE_SIM_STATION':
      return { ...state, currentSimStation: Math.min(state.currentSimStation + 1, 3) };
    case 'PREV_SIM_STATION':
      return { ...state, currentSimStation: Math.max(state.currentSimStation - 1, 0) };
    case 'COMPLETE_SIM_STATION': {
      const sc = [...state.simStationsComplete];
      sc[action.payload] = true;
      return { ...state, simStationsComplete: sc };
    }
    default:
      return state;
  }
}

function Harness() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <SimulatePhase state={state} dispatch={dispatch} />;
}

describe('SimulatePhase full orchestration (redesigned stations)', () => {
  it('drives through ALL 4 redesigned stations end-to-end with no stuck buttons', async () => {
    vi.useFakeTimers();
    render(<Harness />);

    // --- Station A: Slice & Unroll ---
    fireEvent.change(screen.getByLabelText('Unroll progress slider'), { target: { value: '100' } });
    fireEvent.click(screen.getByText(/Base = πr \(half circumference\)/i));
    fireEvent.click(screen.getByText(/Complete Station/i));
    await act(async () => { vi.advanceTimersByTime(700); });
    expect(screen.getByText(/Station B: Garden Designer Simulation/i)).toBeTruthy();

    // --- Station B: Garden Designer (3 rounds) ---
    fireEvent.change(screen.getByLabelText('Garden radius slider'), { target: { value: '5' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    fireEvent.change(screen.getByLabelText('Garden radius slider'), { target: { value: '7' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));
    fireEvent.click(screen.getByText(/Next Challenge/i));
    fireEvent.change(screen.getByLabelText('Garden radius slider'), { target: { value: '10' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));
    const completeB = screen.getByText(/Complete Station/i);
    expect(completeB.disabled).toBeFalsy();
    fireEvent.click(completeB);
    await act(async () => { vi.advanceTimersByTime(700); });
    expect(screen.getByText(/Station C: Track Builder Simulation/i)).toBeTruthy();

    // --- Station C: Track Builder ---
    fireEvent.change(screen.getByLabelText('Straight length slider'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('Semicircle radius slider'), { target: { value: '10' } });
    fireEvent.click(screen.getByText(/Verify Track Area/i));
    fireEvent.click(screen.getByText(/Complete Station/i));
    await act(async () => { vi.advanceTimersByTime(700); });
    expect(screen.getByText(/Station D: Shaded Region Detective/i)).toBeTruthy();

    // --- Station D: Shaded Region Detective (3 cases) ---
    fireEvent.click(screen.getByText('Step 2: Area of Circle Hole'));
    fireEvent.click(screen.getByText(/Use radius r = 7 cm/i));
    fireEvent.click(screen.getByText(/Next Case/i));
    fireEvent.click(screen.getByText(/Step 2: Subtract radii first/i));
    fireEvent.click(screen.getByText(/Calculate inner area/i));
    fireEvent.click(screen.getByText(/Next Case/i));
    fireEvent.click(screen.getByText(/Step 2: Area of Semicircle Cutout/i));
    fireEvent.click(screen.getByText(/Divide circle by 2 for semicircle/i));
    const completeD = screen.getByText(/Complete Station/i);
    expect(completeD.disabled).toBeFalsy();
    fireEvent.click(completeD);
    await act(async () => { vi.advanceTimersByTime(1000); });

    vi.useRealTimers();
  });

  it('Next Station footer button is disabled until the active station completes', () => {
    render(<Harness />);
    const nextStationBtn = screen.getByText(/Next Station/i);
    expect(nextStationBtn.disabled).toBe(true);
  });
});
