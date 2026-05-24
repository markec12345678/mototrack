import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TrackPage } from './track-page.js';
import type { SafetyAlert } from './safety-alert-type.js';

function renderWithProvider(ui: React.JSX.Element) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the root container', () => {
  const { container } = renderWithProvider(<TrackPage />);
  expect(container.firstElementChild).toBeTruthy();
});

it('should render the ride control at bottom-center', () => {
  const { container } = renderWithProvider(<TrackPage />);
  const button = container.querySelector(`button`);
  expect(button).toBeTruthy();
});

it('should not render the safety column when no alerts are provided', () => {
  const { container } = renderWithProvider(<TrackPage safetyAlerts={[]} />);
  const col = container.querySelector(`.dummy-alert`);
  expect(col).toBeNull();
});

it('should render the safety column when alerts are provided', () => {
  function DummyAlert() {
    return <div className="dummy-alert">Alert</div>;
  }

  const alerts: SafetyAlert[] = [
    { key: `alert-1`, order: 1, component: DummyAlert },
  ];

  const { container } = renderWithProvider(<TrackPage safetyAlerts={alerts} />);
  const alertEl = container.querySelector(`.dummy-alert`);
  expect(alertEl).toBeTruthy();
});

it('should render all safety alert widgets', () => {
  function AlertA() {
    return <div className="alert-a">Alert A</div>;
  }
  function AlertB() {
    return <div className="alert-b">Alert B</div>;
  }

  const alerts: SafetyAlert[] = [
    { key: `a`, order: 1, component: AlertA },
    { key: `b`, order: 2, component: AlertB },
  ];

  const { container } = renderWithProvider(<TrackPage safetyAlerts={alerts} />);
  const alertA = container.querySelector(`.alert-a`);
  const alertB = container.querySelector(`.alert-b`);
  expect(alertA).toBeTruthy();
  expect(alertB).toBeTruthy();
});

it('should render safety widgets sorted by order', () => {
  const renderOrder: string[] = [];

  function AlertFirst() {
    renderOrder.push(`first`);
    return <div className="alert-first">First</div>;
  }
  function AlertSecond() {
    renderOrder.push(`second`);
    return <div className="alert-second">Second</div>;
  }

  const alerts: SafetyAlert[] = [
    { key: `second`, order: 2, component: AlertSecond },
    { key: `first`, order: 1, component: AlertFirst },
  ];

  renderWithProvider(<TrackPage safetyAlerts={alerts} />);
  expect(renderOrder[0]).toBe(`first`);
  expect(renderOrder[1]).toBe(`second`);
});

it('should accept className prop', () => {
  const { container } = renderWithProvider(
    <TrackPage className="custom-class" />
  );
  const el = container.querySelector(`.custom-class`);
  expect(el).toBeTruthy();
});

it('should render without error when onRideSaved is provided', () => {
  const onRideSaved = vi.fn();
  const { container } = renderWithProvider(
    <TrackPage onRideSaved={(id) => onRideSaved(id)} />
  );
  expect(container.firstElementChild).toBeTruthy();
});

it('should render without error when onRideDiscarded is provided', () => {
  const onRideDiscarded = vi.fn();
  const { container } = renderWithProvider(
    <TrackPage onRideDiscarded={() => onRideDiscarded()} />
  );
  expect(container.firstElementChild).toBeTruthy();
});
