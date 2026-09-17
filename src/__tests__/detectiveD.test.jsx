import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShadedRegionDetective from '../components/simulations/ShadedRegionDetective.jsx';

describe('ShadedRegionDetective (redesigned)', () => {
  it('solves all 3 cases end-to-end and completes', () => {
    const onComplete = vi.fn();
    render(<ShadedRegionDetective onComplete={onComplete} audioEnabled={false} />);

    // Case 1
    fireEvent.click(screen.getByText('Step 2: Area of Circle Hole'));
    fireEvent.click(screen.getByText(/Use radius r = 7 cm/i));
    let nextCaseBtn = screen.queryByText(/Next Case/i);
    expect(nextCaseBtn).toBeTruthy();
    fireEvent.click(nextCaseBtn);

    // Case 2
    expect(screen.getByText(/Step 2: Subtract radii first/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Step 2: Subtract radii first/i));
    const fix2 = screen.getByText(/Calculate inner area/i);
    expect(fix2.closest('button').disabled).toBe(false);
    fireEvent.click(fix2);
    nextCaseBtn = screen.queryByText(/Next Case/i);
    expect(nextCaseBtn).toBeTruthy();
    fireEvent.click(nextCaseBtn);

    // Case 3
    expect(screen.getByText(/Step 2: Area of Semicircle Cutout/i)).toBeTruthy();
    fireEvent.click(screen.getByText(/Step 2: Area of Semicircle Cutout/i));
    fireEvent.click(screen.getByText(/Divide circle by 2 for semicircle/i));

    expect(screen.queryByText(/Next Case/i)).toBeNull();
    const completeBtn = screen.getByText(/Complete Station/i);
    expect(completeBtn.disabled).toBeFalsy();
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('picking the wrong step keeps fix options locked (no stuck-enabled bug either direction)', () => {
    render(<ShadedRegionDetective onComplete={() => {}} audioEnabled={false} />);
    fireEvent.click(screen.getByText('Step 1: Area of Square'));
    const fixBtn = screen.getByText(/Use radius r = 7 cm/i);
    expect(fixBtn.closest('button').disabled).toBe(true);
    // now pick the actually flawed step
    fireEvent.click(screen.getByText('Step 2: Area of Circle Hole'));
    expect(fixBtn.closest('button').disabled).toBe(false);
  });
});
