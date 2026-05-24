import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Dashboard } from './dashboard.js';

function renderDashboard(props: React.ComponentProps<typeof Dashboard> = {}) {
  return render(
    <MockProvider>
      <Dashboard {...props} />
    </MockProvider>
  );
}

it('renders the greeting with the provided displayName', () => {
  const { getByText } = renderDashboard({ displayName: `Markec` });
  const heading = getByText(`Pozdravljen, Markec! 🏍️`);
  expect(heading).toBeTruthy();
});

it('shows getting-started cards when no panels are provided', () => {
  const { getByText } = renderDashboard({ displayName: `Markec` });
  expect(getByText(`Start your first ride`)).toBeTruthy();
  expect(getByText(`Plan a route`)).toBeTruthy();
  expect(getByText(`Browse Balkan tours`)).toBeTruthy();
});

it('shows all three getting-started CTA buttons', () => {
  const { getAllByRole } = renderDashboard({ displayName: `Markec` });
  const buttons = getAllByRole(`button`);
  expect(buttons.length).toBe(3);
});

it('renders panel titles when panels are provided', () => {
  function FakePanel() {
    return <div>Panel content</div>;
  }

  const panels = [
    { key: `p1`, title: `Panel One`, component: FakePanel, span: 1 as const },
    { key: `p2`, title: `Panel Two`, component: FakePanel, span: 2 as const },
  ];

  const { getByText } = renderDashboard({ displayName: `Markec`, panels });
  expect(getByText(`Panel One`)).toBeTruthy();
  expect(getByText(`Panel Two`)).toBeTruthy();
});

it('renders panel component content inside the panel card', () => {
  function WeatherWidget() {
    return <span>22C Ljubljana</span>;
  }

  const panels = [{ key: `weather`, title: `Vreme`, component: WeatherWidget, span: 1 as const }];
  const { getByText } = renderDashboard({ displayName: `Markec`, panels });
  expect(getByText(`22C Ljubljana`)).toBeTruthy();
});

it('does not show getting-started cards when panels are provided', () => {
  function FakePanel() {
    return <div>Panel content</div>;
  }

  const panels = [{ key: `p1`, title: `Panel One`, component: FakePanel, span: 1 as const }];
  const { queryByText } = renderDashboard({ displayName: `Markec`, panels });
  expect(queryByText(`Start your first ride`)).toBeNull();
});

it('renders the MotoTrack badge in the hero', () => {
  const { getByText } = renderDashboard({ displayName: `Markec` });
  expect(getByText(`MotoTrack`)).toBeTruthy();
});

it('renders getting-started card descriptions', () => {
  const { getByText } = renderDashboard({ displayName: `Markec` });
  expect(getByText(/Record your route/)).toBeTruthy();
  expect(getByText(/Design your perfect journey/)).toBeTruthy();
  expect(getByText(/curated multi-day tours/)).toBeTruthy();
});

it('applies a custom className to the root element', () => {
  const { container } = renderDashboard({ displayName: `Markec`, className: `custom-class` });
  const root = container.querySelector(`.custom-class`);
  expect(root).toBeTruthy();
});

it('clicking a CTA button does not throw', () => {
  const { getAllByRole } = renderDashboard({ displayName: `Markec` });
  const buttons = getAllByRole(`button`);
  expect(() => fireEvent.click(buttons[0])).not.toThrow();
});
