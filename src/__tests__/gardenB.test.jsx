import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GardenDesignerStation from '../components/simulations/GardenDesignerStation.jsx';

describe('GardenDesignerStation (redesigned)', () => {
  it('completes all 3 rounds and reaches onComplete', () => {
    const onComplete = vi.fn();
    render(<GardenDesignerStation onComplete={onComplete} audioEnabled={false} />);

    // Round 1: target radius 5
    let slider = screen.getByLabelText('Garden radius slider');
    fireEvent.change(slider, { target: { value: '5' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));
    let nextBtn = screen.queryByText(/Next Challenge/i);
    expect(nextBtn).toBeTruthy();
    expect(nextBtn.disabled).toBeFalsy();
    fireEvent.click(nextBtn);

    // Round 2: target radius 7
    slider = screen.getByLabelText('Garden radius slider');
    fireEvent.change(slider, { target: { value: '7' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));
    nextBtn = screen.queryByText(/Next Challenge/i);
    expect(nextBtn).toBeTruthy();
    fireEvent.click(nextBtn);

    // Round 3: target radius 10
    slider = screen.getByLabelText('Garden radius slider');
    fireEvent.change(slider, { target: { value: '10' } });
    fireEvent.click(screen.getByText(/Lock in Radius/i));

    // All done -- Next Challenge should be gone, Complete Station present & enabled
    expect(screen.queryByText(/Next Challenge/i)).toBeNull();
    const completeBtn = screen.getByText(/Complete Station/i);
    expect(completeBtn.disabled).toBeFalsy();
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('wrong answer does not lock the Lock-in button (can retry)', () => {
    render(<GardenDesignerStation onComplete={() => {}} audioEnabled={false} />);
    const slider = screen.getByLabelText('Garden radius slider');
    fireEvent.change(slider, { target: { value: '2' } }); // far from target 5
    const lockBtn = screen.getByText(/Lock in Radius/i);
    fireEvent.click(lockBtn);
    expect(screen.queryByText(/Next Challenge/i)).toBeNull();
    expect(lockBtn.disabled).toBe(false); // must remain clickable for retry
  });
});
