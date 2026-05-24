import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { ElevationProfile } from './elevation-profile.js';
import {
  mockMountainPassPoints,
  mockClimbM,
  mockDescentM,
} from './elevation-profile.mock.js';
import styles from './elevation-profile.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('renders the SVG element', () => {
  const { container } = renderWithProvider(
    <ElevationProfile points={mockMountainPassPoints} climbM={mockClimbM} descentM={mockDescentM} />
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('renders the elevation line path', () => {
  const { container } = renderWithProvider(
    <ElevationProfile points={mockMountainPassPoints} climbM={mockClimbM} descentM={mockDescentM} />
  );
  const paths = container.querySelectorAll('path');
  // area + line = at least 2 paths
  expect(paths.length).toBeGreaterThanOrEqual(2);
});

it('renders climb and descent stat labels when showStats is true', () => {
  const { getAllByText } = renderWithProvider(
    <ElevationProfile
      points={mockMountainPassPoints}
      climbM={540}
      descentM={540}
      showStats
    />
  );
  const items = getAllByText('540');
  expect(items.length).toBe(2);
});

it('does not render stats when showStats is false', () => {
  const { container } = renderWithProvider(
    <ElevationProfile
      points={mockMountainPassPoints}
      climbM={mockClimbM}
      descentM={mockDescentM}
      showStats={false}
    />
  );
  const statsEl = container.querySelector(`.${styles.stats}`);
  expect(statsEl).toBeNull();
});

it('renders the position indicator when progress > 0', () => {
  const { container } = renderWithProvider(
    <ElevationProfile
      points={mockMountainPassPoints}
      progress={0.5}
      climbM={mockClimbM}
      descentM={mockDescentM}
    />
  );
  const circles = container.querySelectorAll('circle');
  // outer ring + inner dot = 2 circles
  expect(circles.length).toBeGreaterThanOrEqual(2);
});

it('does not render the position indicator when progress is 0', () => {
  const { container } = renderWithProvider(
    <ElevationProfile
      points={mockMountainPassPoints}
      progress={0}
      climbM={mockClimbM}
      descentM={mockDescentM}
    />
  );
  const circles = container.querySelectorAll('circle');
  expect(circles.length).toBe(0);
});

it('applies custom className to the container', () => {
  const { container } = renderWithProvider(
    <ElevationProfile
      points={mockMountainPassPoints}
      climbM={mockClimbM}
      descentM={mockDescentM}
      className="custom-class"
    />
  );
  const root = container.querySelector(`.${styles.container}`);
  expect(root?.classList.contains('custom-class')).toBe(true);
});

it('renders a gradient fill definition in the SVG', () => {
  const { container } = renderWithProvider(
    <ElevationProfile points={mockMountainPassPoints} climbM={mockClimbM} descentM={mockDescentM} />
  );
  const linearGradient = container.querySelector('linearGradient');
  expect(linearGradient).toBeTruthy();
});

it('renders with default props without crashing', () => {
  const { container } = renderWithProvider(<ElevationProfile />);
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});
