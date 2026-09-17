import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SliceDiscoveryLab from '../components/simulations/SliceDiscoveryLab.jsx';

describe('SliceDiscoveryLab (redesigned)', () => {
  it('reaches onComplete after dragging unroll slider to 100 and selecting correct option', () => {
    const onComplete = vi.fn();
    render(<SliceDiscoveryLab onComplete={onComplete} audioEnabled={false} />);
    const slider = screen.getByLabelText('Unroll progress slider');
    fireEvent.change(slider, { target: { value: '100' } });
    const correctBtn = screen.getByText(/Base = πr \(half circumference\)/i);
    expect(correctBtn.disabled).toBe(false);
    fireEvent.click(correctBtn);
    const completeBtn = screen.getByText(/Complete Station/i);
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('question stays locked before unrolling, and slice-count slider does not affect the lock', () => {
    const onComplete = vi.fn();
    render(<SliceDiscoveryLab onComplete={onComplete} audioEnabled={false} />);
    const correctBtn = screen.getByText(/Base = πr \(half circumference\)/i);
    expect(correctBtn.disabled).toBe(true);
    const sliceSlider = screen.getByLabelText('Number of slices slider');
    fireEvent.change(sliceSlider, { target: { value: '4' } }); // max slice count, but morph still 0
    expect(correctBtn.disabled).toBe(true); // must still be locked -- this is the exact bug class we're guarding against
  });
});
