import * as React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RideTrackLine } from './ride-track-line.js';
import { MOCK_TRACK_TREBEVIC, MOCK_TRACK_EMPTY } from './ride-track-line.mock.js';
import styles from './ride-track-line.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render the root container', () => {
  const { container } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root).toBeTruthy();
});

it('should render the empty state text when track is empty', () => {
  const { getByText } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_EMPTY} />
  );
  expect(getByText(`No track data available`)).toBeTruthy();
});

it('should not render the empty state text when track has points', () => {
  const { queryByText } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} />
  );
  expect(queryByText(`No track data available`)).toBeFalsy();
});

it('should render the Start legend label when track has points', () => {
  const { getByText } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} />
  );
  expect(getByText(`Start`)).toBeTruthy();
});

it('should render the End legend label when track has points', () => {
  const { getByText } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} />
  );
  expect(getByText(`End`)).toBeTruthy();
});

it('should apply a custom className to the root element', () => {
  const { container } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} className="custom-class" />
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains(`custom-class`)).toBe(true);
});

it('should apply inline style to the root element', () => {
  const { container } = renderWithProvider(
    <RideTrackLine track={MOCK_TRACK_TREBEVIC} style={{ opacity: 0.5 }} />
  );
  const root = container.querySelector(`.${styles.root}`) as HTMLElement | null;
  expect(root?.style.opacity).toBe(`0.5`);
});
