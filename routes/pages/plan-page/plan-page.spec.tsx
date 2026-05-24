import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Waypoint } from '@markec/routes.entities.waypoint';
import { PlanPage } from './plan-page.js';

const mockWaypoints: Waypoint[] = [
  Waypoint.from({ id: `wp-1`, name: `Ljubljana`, lat: 46.0569, lng: 14.5058 }),
  Waypoint.from({ id: `wp-2`, name: `Maribor`, lat: 46.5547, lng: 15.6459 }),
];

function renderPage(props: Partial<React.ComponentProps<typeof PlanPage>> = {}) {
  return render(
    <MockProvider>
      <PlanPage {...props} />
    </MockProvider>
  );
}

it('renders the sidebar and map pane', () => {
  const { container } = renderPage();
  const sidebar = container.querySelector(`aside`);
  const mapPane = container.querySelector(`main`);
  expect(sidebar).toBeTruthy();
  expect(mapPane).toBeTruthy();
});

it('renders the route name input with default value', () => {
  const { container } = renderPage({ initialRouteName: `Testna Ruta` });
  const inputs = container.querySelectorAll(`input[type="text"]`);
  const routeInput = inputs[0] as HTMLInputElement;
  expect(routeInput).toBeTruthy();
  expect(routeInput.value).toBe(`Testna Ruta`);
});

it('allows editing the route name', () => {
  const { container } = renderPage({ initialRouteName: `Staro Ime` });
  const inputs = container.querySelectorAll(`input[type="text"]`);
  const routeInput = inputs[0] as HTMLInputElement;
  fireEvent.change(routeInput, { target: { value: `Novo Ime` } });
  expect(routeInput.value).toBe(`Novo Ime`);
});

it('renders the mode picker', () => {
  const { container } = renderPage();
  const picker = container.querySelector(`[role="group"]`);
  expect(picker).toBeTruthy();
});

it('renders the waypoint list when waypoints are provided', () => {
  const { container } = renderPage({ initialWaypoints: mockWaypoints });
  const inputs = container.querySelectorAll(`input[type="text"]`);
  // route name input + 2 waypoint name inputs
  expect(inputs.length).toBeGreaterThanOrEqual(3);
});

it('renders the map hint when no waypoints are present', () => {
  const { container } = renderPage({ initialWaypoints: [] });
  const hint = container.querySelector(`[class*="mapHint"]`);
  expect(hint).toBeTruthy();
});

it('does not render the map hint when waypoints are present', () => {
  const { container } = renderPage({ initialWaypoints: mockWaypoints });
  const hint = container.querySelector(`[class*="mapHint"]`);
  expect(hint).toBeFalsy();
});

it('renders the stats section when waypoints are provided', () => {
  const { container } = renderPage({ initialWaypoints: mockWaypoints });
  const stats = container.querySelector(`[class*="statsSection"]`);
  expect(stats).toBeTruthy();
});

it('does not render the stats section when no waypoints are present', () => {
  const { container } = renderPage({ initialWaypoints: [] });
  const stats = container.querySelector(`[class*="statsSection"]`);
  expect(stats).toBeFalsy();
});

it('renders the Save and Share buttons', () => {
  const { container } = renderPage();
  const buttons = container.querySelectorAll(`button`);
  const buttonTexts = Array.from(buttons).map((b) => b.textContent ?? ``);
  const hasSave = buttonTexts.some((t) => t.includes(`Shrani`));
  const hasShare = buttonTexts.some((t) => t.includes(`Deli`));
  expect(hasSave).toBe(true);
  expect(hasShare).toBe(true);
});

it('Save button is disabled when fewer than 2 waypoints', () => {
  const { container } = renderPage({ initialWaypoints: [] });
  const buttons = Array.from(container.querySelectorAll(`button`));
  const saveBtn = buttons.find((b) => b.textContent?.includes(`Shrani`));
  expect(saveBtn).toBeTruthy();
  expect(saveBtn?.disabled).toBe(true);
});

it('Save button is enabled when 2+ waypoints are present', () => {
  const { container } = renderPage({ initialWaypoints: mockWaypoints });
  const buttons = Array.from(container.querySelectorAll(`button`));
  const saveBtn = buttons.find((b) => b.textContent?.includes(`Shrani`));
  expect(saveBtn).toBeTruthy();
  expect(saveBtn?.disabled).toBe(false);
});

it('renders the generator toggle buttons', () => {
  const { container } = renderPage();
  const toggles = container.querySelectorAll(`[class*="generatorToggle"]`);
  expect(toggles.length).toBeGreaterThanOrEqual(2);
});

it('expands the twisty generator panel on toggle click', () => {
  const { container } = renderPage();
  const toggles = container.querySelectorAll(`[class*="generatorToggle"]`);
  const twistyToggle = toggles[0] as HTMLButtonElement;
  fireEvent.click(twistyToggle);
  const panel = container.querySelector(`[class*="generatorPanel"]`);
  expect(panel).toBeTruthy();
});

it('expands the round-trip generator panel on toggle click', () => {
  const { container } = renderPage();
  const toggles = container.querySelectorAll(`[class*="generatorToggle"]`);
  const roundTripToggle = toggles[1] as HTMLButtonElement;
  fireEvent.click(roundTripToggle);
  const panel = container.querySelector(`[class*="generatorPanel"]`);
  expect(panel).toBeTruthy();
});

it('renders the actions row with tool buttons', () => {
  const { container } = renderPage();
  const actionsRow = container.querySelector(`[class*="actionsRow"]`);
  expect(actionsRow).toBeTruthy();
  const actionBtns = actionsRow?.querySelectorAll(`[class*="actionIconBtn"]`);
  expect(actionBtns?.length).toBeGreaterThanOrEqual(2);
});

it('applies custom className to root element', () => {
  const { container } = renderPage({ className: `custom-test-class` });
  const root = container.querySelector(`.custom-test-class`);
  expect(root).toBeTruthy();
});
