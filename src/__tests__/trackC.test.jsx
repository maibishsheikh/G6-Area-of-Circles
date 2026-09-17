import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TrackBuilderStation from '../components/simulations/TrackBuilderStation.jsx';

describe('TrackBuilderStation (redesigned)', () => {
  it('reaches target 1914 m^2 and completes', () => {
    const onComplete = vi.fn();
    render(<TrackBuilderStation onComplete={onComplete} audioEnabled={false} />);
    fireEvent.change(screen.getByLabelText('Straight length slider'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('Semicircle radius slider'), { target: { value: '10' } });
    const verifyBtn = screen.getByText(/Verify Track Area/i);
    fireEvent.click(verifyBtn);
    const completeBtn = screen.getByText(/Complete Station/i);
    expect(completeBtn.disabled).toBeFalsy();
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('wrong values keep Verify button retryable, not stuck', () => {
    render(<TrackBuilderStation onComplete={() => {}} audioEnabled={false} />);
    fireEvent.change(screen.getByLabelText('Straight length slider'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Semicircle radius slider'), { target: { value: '5' } });
    const verifyBtn = screen.getByText(/Verify Track Area/i);
    fireEvent.click(verifyBtn);
    expect(screen.queryByText(/Complete Station/i)).toBeNull();
    expect(verifyBtn.disabled).toBe(false);
    // now correct it
    fireEvent.change(screen.getByLabelText('Straight length slider'), { target: { value: '80' } });
    fireEvent.change(screen.getByLabelText('Semicircle radius slider'), { target: { value: '10' } });
    fireEvent.click(verifyBtn);
    expect(screen.getByText(/Complete Station/i)).toBeTruthy();
  });
});
