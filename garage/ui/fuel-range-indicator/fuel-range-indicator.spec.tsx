import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { FuelRangeIndicator } from './fuel-range-indicator.js';
import { mockFuelOk, mockFuelWarn, mockFuelEmpty } from './fuel-range-indicator.mock.js';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

// ─── Pill rendering ───────────────────────────────────────────────────────────

it('renders the compact pill with fuel percent', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]');
  expect(pill).toBeTruthy();
  expect(pill?.textContent).toContain('75%');
});

it('renders the range km in the pill', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]');
  expect(pill?.textContent).toContain('233');
  expect(pill?.textContent).toContain('km');
});

it('does not render the pulsing dot for ok status', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]');
  const spans = pill?.querySelectorAll('span');
  // pill has: icon, percent, divider, range-wrapper, rangeValue, rangeUnit — 6 spans, no dot
  expect(spans?.length).toBeLessThanOrEqual(6);
});

it('renders the pulsing dot for warn status', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelWarn} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]');
  const spans = pill?.querySelectorAll('span');
  // warn adds an extra dot span — total > 6
  expect(spans?.length).toBeGreaterThan(6);
});

// ─── Expand / collapse ────────────────────────────────────────────────────────

it('expands the panel when the pill is clicked', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const closeBtn = container.querySelector('button[aria-label="Zapri"]');
  expect(closeBtn).toBeTruthy();
});

it('hides the pill after expanding', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const pillAfter = container.querySelector('button[aria-label*="Gorivo"]');
  expect(pillAfter).toBeFalsy();
});

it('collapses the panel when the close button is clicked', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const closeBtn = container.querySelector('button[aria-label="Zapri"]') as HTMLElement;
  fireEvent.click(closeBtn);
  const closeBtnAfter = container.querySelector('button[aria-label="Zapri"]');
  expect(closeBtnAfter).toBeFalsy();
});

// ─── Panel content ────────────────────────────────────────────────────────────

it('renders the "najdi črpalko" button in the expanded panel', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const findBtn = Array.from(buttons).find((b) =>
    b.textContent?.toLowerCase().includes('najdi')
  );
  expect(findBtn).toBeTruthy();
});

it('renders the warning banner for warn status in expanded panel', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelWarn} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const text = container.textContent?.toLowerCase();
  expect(text).toContain('nizko gorivo');
});

it('renders the warning banner for empty status in expanded panel', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelEmpty} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const text = container.textContent?.toLowerCase();
  expect(text).toContain('gorivo skoraj prazno');
});

it('does not render a warning banner for ok status in expanded panel', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const text = container.textContent?.toLowerCase();
  expect(text).not.toContain('nizko gorivo');
  expect(text).not.toContain('gorivo skoraj prazno');
});

// ─── Callbacks ────────────────────────────────────────────────────────────────

it('calls onFindStation when the button is clicked', () => {
  let called = false;
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelWarn} onFindStation={() => { called = true; }} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const findBtn = Array.from(buttons).find((b) =>
    b.textContent?.toLowerCase().includes('najdi')
  ) as HTMLElement;
  fireEvent.click(findBtn);
  expect(called).toBe(true);
});

it('collapses the panel after clicking "najdi črpalko"', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} onFindStation={() => {}} />
  );
  const pill = container.querySelector('button[aria-label*="Gorivo"]') as HTMLElement;
  fireEvent.click(pill);
  const buttons = container.querySelectorAll('button');
  const findBtn = Array.from(buttons).find((b) =>
    b.textContent?.toLowerCase().includes('najdi')
  ) as HTMLElement;
  fireEvent.click(findBtn);
  const closeBtnAfter = container.querySelector('button[aria-label="Zapri"]');
  expect(closeBtnAfter).toBeFalsy();
});

// ─── Custom className ─────────────────────────────────────────────────────────

it('applies a custom className to the root element', () => {
  const { container } = renderWithProvider(
    <FuelRangeIndicator mockData={mockFuelOk} className="custom-overlay" />
  );
  const root = container.querySelector('.custom-overlay');
  expect(root).toBeTruthy();
});
