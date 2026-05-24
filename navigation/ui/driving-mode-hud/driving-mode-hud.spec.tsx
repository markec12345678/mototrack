import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { DrivingModeHud } from './driving-mode-hud.js';
import { mockHudDataHighway, mockHudDataLowFuel } from './driving-mode-hud.mock.js';

function renderHud(props: Partial<React.ComponentProps<typeof DrivingModeHud>> = {}) {
  return render(
    <MockProvider>
      <DrivingModeHud {...props} />
    </MockProvider>
  );
}

it('renders the street name from data', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(mockHudDataHighway.streetName)).toBeTruthy();
});

it('renders the ETA value', () => {
  const { getAllByText } = renderHud({ data: mockHudDataHighway });
  const etaEls = getAllByText(mockHudDataHighway.eta);
  expect(etaEls.length).toBeGreaterThan(0);
});

it('renders the exit button with Map label', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`Map`)).toBeTruthy();
});

it('calls onExit when exit button is clicked', () => {
  let exitCalled = false;
  const { getByText } = renderHud({
    data: mockHudDataHighway,
    onExit: () => { exitCalled = true; },
  });
  fireEvent.click(getByText(`Map`));
  expect(exitCalled).toBe(true);
});

it('renders the Live badge', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`Live`)).toBeTruthy();
});

it('renders the GPS label', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`GPS`)).toBeTruthy();
});

it('renders the ETA label', () => {
  const { getAllByText } = renderHud({ data: mockHudDataHighway });
  const etaLabels = getAllByText(`ETA`);
  expect(etaLabels.length).toBeGreaterThan(0);
});

it('renders the turn instruction text when nextInstruction is provided', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(mockHudDataHighway.nextInstruction!.text)).toBeTruthy();
});

it('does not render turn instruction when nextInstruction is null', () => {
  const dataWithoutInstruction = { ...mockHudDataHighway, nextInstruction: null };
  const { queryByText } = renderHud({ data: dataWithoutInstruction });
  expect(queryByText(`Zavijte desno`)).toBeFalsy();
});

it('renders the font scale badge value', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway, fontScale: `1.5x` });
  expect(getByText(`1.5x`)).toBeTruthy();
});

it('renders the default font scale badge as 1x', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`1x`)).toBeTruthy();
});

it('renders the distance to destination', () => {
  const { getAllByText } = renderHud({ data: mockHudDataHighway });
  const distEls = getAllByText((content) => content.includes(`38.4`));
  expect(distEls.length).toBeGreaterThan(0);
});

it('renders with low fuel data without crashing', () => {
  const { container } = renderHud({ data: mockHudDataLowFuel });
  expect(container.firstChild).toBeTruthy();
});

it('renders the Heading compass label', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`Heading`)).toBeTruthy();
});

it('renders the fuel range stat card', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`Fuel range`)).toBeTruthy();
});

it('renders the Arrives stat card', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway });
  expect(getByText(`Arrives`)).toBeTruthy();
});

it('accepts and applies a custom className', () => {
  const { container } = renderHud({ className: `my-custom-hud` });
  expect(container.querySelector(`.my-custom-hud`)).toBeTruthy();
});

it('renders with 2x font scale without crashing', () => {
  const { getByText } = renderHud({ data: mockHudDataHighway, fontScale: `2x` });
  expect(getByText(`2x`)).toBeTruthy();
});
