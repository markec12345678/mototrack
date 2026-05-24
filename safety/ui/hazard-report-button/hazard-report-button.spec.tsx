import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { HazardReportButton } from './hazard-report-button.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the floating trigger button', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`);
  expect(btn).toBeTruthy();
});

it('should render the Report label on the trigger button', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[title="Report Hazard"]`);
  expect(btn).toBeTruthy();
  expect(btn?.textContent).toContain(`Report`);
});

it('should render the warning emoji on the trigger button', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`);
  expect(btn?.textContent).toContain(`⚠️`);
});

it('should open the modal when the trigger button is clicked', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  const grid = container.querySelector(`button[aria-label="Report Landslide"]`);
  expect(grid).toBeTruthy();
});

it('should render 8 hazard tiles by default after opening', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  const tiles = container.querySelectorAll(`button[aria-label^="Report "]`);
  const hazardTiles = Array.from(tiles).filter(
    (t) => t.getAttribute(`aria-label`) !== `Report a road hazard`
  );
  expect(hazardTiles.length).toBe(8);
});

it('should render custom hazard types when provided', () => {
  const customTypes = [
    { id: `ice`, label: `Ice`, emoji: `🧊`, color: `#0ea5e9` },
    { id: `flood`, label: `Flood`, emoji: `🌊`, color: `#2563eb` },
  ];
  const { container } = renderWithProvider(
    <HazardReportButton hazardTypes={customTypes} />
  );
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  const tiles = container.querySelectorAll(`button[aria-label^="Report "]`);
  const hazardTiles = Array.from(tiles).filter(
    (t) => t.getAttribute(`aria-label`) !== `Report a road hazard`
  );
  expect(hazardTiles.length).toBe(2);
});

it('should render tile labels for each hazard type', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  expect(container.querySelector(`button[aria-label="Report Landslide"]`)).toBeTruthy();
  expect(container.querySelector(`button[aria-label="Report Ice"]`)).toBeTruthy();
  expect(container.querySelector(`button[aria-label="Report Flood"]`)).toBeTruthy();
  expect(container.querySelector(`button[aria-label="Report Pothole"]`)).toBeTruthy();
});

it('should render tile emojis for each hazard type', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  const iceTile = container.querySelector(`button[aria-label="Report Ice"]`);
  expect(iceTile?.textContent).toContain(`🧊`);
});

it('should show the location note in the modal', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`) as HTMLButtonElement;
  fireEvent.click(btn);
  const note = container.querySelector(`[title="Report Hazard"]`);
  expect(note).toBeTruthy();
});

it('should render the overlay container', () => {
  const { container } = renderWithProvider(<HazardReportButton />);
  const btn = container.querySelector(`button[aria-label="Report a road hazard"]`);
  expect(btn).toBeTruthy();
});

it('should accept and apply a custom className', () => {
  const { container } = renderWithProvider(
    <HazardReportButton className="my-custom-class" />
  );
  const overlay = container.querySelector(`.my-custom-class`);
  expect(overlay).toBeTruthy();
});
