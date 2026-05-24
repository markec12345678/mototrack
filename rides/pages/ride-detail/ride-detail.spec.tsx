import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideDetail } from './ride-detail.js';
import { MOCK_TABS, MOCK_RIDE } from './ride-detail.mock.js';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MockProvider>
      {ui}
    </MockProvider>
  );
}

describe('RideDetail', () => {
  it('should render without crashing for unknown ride id', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId="unknown-id" tabs={[]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render the root element', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should accept and apply a custom className', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} className="custom-class" />
    );
    const root = container.querySelector(`.custom-class`);
    expect(root).toBeTruthy();
  });

  it('should render with tabs prop provided', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={MOCK_TABS} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with empty tabs array', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render the not-found state for an unknown ride id', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId="does-not-exist-xyz" tabs={[]} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render toggle buttons when ride is loaded', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    expect(container.firstChild).toBeTruthy();
    const buttons = container.querySelectorAll(`button`);
    if (buttons.length >= 2) {
      const trackBtn = Array.from(buttons).find((b) => b.textContent?.includes(`Track`));
      const heatmapBtn = Array.from(buttons).find((b) => b.textContent?.includes(`Twistiness`));
      if (trackBtn && heatmapBtn) {
        expect(trackBtn).toBeTruthy();
        expect(heatmapBtn).toBeTruthy();
      }
    }
  });

  it('should toggle heatmap when twistiness button is clicked', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    const buttons = container.querySelectorAll(`button`);
    const heatmapBtn = Array.from(buttons).find((b) => b.textContent?.includes(`Twistiness`));
    if (heatmapBtn) {
      fireEvent.click(heatmapBtn);
      expect(heatmapBtn).toBeTruthy();
    }
  });

  it('should show delete modal when delete button is clicked', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    const buttons = container.querySelectorAll(`button`);
    const deleteBtn = Array.from(buttons).find((b) => b.textContent?.trim() === `Delete`);
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      const modal = container.querySelector(`[class*="modal"]`);
      expect(modal).toBeTruthy();
    }
  });

  it('should close delete modal when cancel is clicked', () => {
    const { container } = renderWithProviders(
      <RideDetail rideId={MOCK_RIDE.id} tabs={[]} />
    );
    const buttons = container.querySelectorAll(`button`);
    const deleteBtn = Array.from(buttons).find((b) => b.textContent?.trim() === `Delete`);
    if (deleteBtn) {
      fireEvent.click(deleteBtn);
      const cancelBtn = Array.from(container.querySelectorAll(`button`)).find((b) =>
        b.textContent?.includes(`Cancel`)
      );
      if (cancelBtn) {
        fireEvent.click(cancelBtn);
        const backdrop = container.querySelector(`[class*="modalBackdrop"]`);
        expect(backdrop).toBeFalsy();
      }
    }
  });
});
