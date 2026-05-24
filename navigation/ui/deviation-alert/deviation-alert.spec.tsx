import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DeviationAlert } from './deviation-alert.js';
import styles from './deviation-alert.module.scss';

function renderAlert(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('DeviationAlert', () => {
  it('renders the on-track label by default', () => {
    const { getByText } = renderAlert(<DeviationAlert />);
    expect(getByText(`On Track`)).toBeTruthy();
  });

  it('renders the minor deviation label', () => {
    const { getByText } = renderAlert(<DeviationAlert state="minor" />);
    expect(getByText(`Minor Deviation`)).toBeTruthy();
  });

  it('renders the moderate deviation label', () => {
    const { getByText } = renderAlert(<DeviationAlert state="moderate" />);
    expect(getByText(`Off Route`)).toBeTruthy();
  });

  it('renders the lost label', () => {
    const { getByText } = renderAlert(<DeviationAlert state="lost" />);
    expect(getByText(`Route Lost`)).toBeTruthy();
  });

  it('applies the onTrack class to the pill when state is on-track', () => {
    const { container } = renderAlert(<DeviationAlert state="on-track" />);
    const pill = container.querySelector(`.${styles.pill}`) as HTMLElement;
    expect(pill.classList.contains(styles.onTrack)).toBe(true);
  });

  it('applies the minor class to the pill when state is minor', () => {
    const { container } = renderAlert(<DeviationAlert state="minor" />);
    const pill = container.querySelector(`.${styles.pill}`) as HTMLElement;
    expect(pill.classList.contains(styles.minor)).toBe(true);
  });

  it('applies the moderate class to the pill when state is moderate', () => {
    const { container } = renderAlert(<DeviationAlert state="moderate" />);
    const pill = container.querySelector(`.${styles.pill}`) as HTMLElement;
    expect(pill.classList.contains(styles.moderate)).toBe(true);
  });

  it('applies the lost class to the pill when state is lost', () => {
    const { container } = renderAlert(<DeviationAlert state="lost" />);
    const pill = container.querySelector(`.${styles.pill}`) as HTMLElement;
    expect(pill.classList.contains(styles.lost)).toBe(true);
  });

  it('does not show the Recompute button when state is on-track', () => {
    const { container } = renderAlert(<DeviationAlert state="on-track" />);
    const btn = container.querySelector(`.${styles.recomputeBtn}`);
    expect(btn).toBeNull();
  });

  it('does not show the Recompute button when state is minor', () => {
    const { container } = renderAlert(<DeviationAlert state="minor" />);
    const btn = container.querySelector(`.${styles.recomputeBtn}`);
    expect(btn).toBeNull();
  });

  it('shows the Recompute button when state is lost', () => {
    const { container } = renderAlert(<DeviationAlert state="lost" />);
    const btn = container.querySelector(`.${styles.recomputeBtn}`) as HTMLElement;
    expect(btn).toBeTruthy();
  });

  it('calls onRecompute when the Recompute button is clicked', () => {
    let called = false;
    const { container } = renderAlert(
      <DeviationAlert state="lost" onRecompute={() => { called = true; }} />
    );
    const btn = container.querySelector(`.${styles.recomputeBtn}`) as HTMLElement;
    fireEvent.click(btn);
    expect(called).toBe(true);
  });

  it('shows distance in metres when deviationMeters is below 1000', () => {
    const { getByText } = renderAlert(<DeviationAlert state="minor" deviationMeters={320} />);
    expect(getByText(`320 m`)).toBeTruthy();
  });

  it('shows distance in kilometres when deviationMeters is 1000 or more', () => {
    const { getByText } = renderAlert(<DeviationAlert state="lost" deviationMeters={1500} />);
    expect(getByText(`1.5 km`)).toBeTruthy();
  });

  it('hides the distance badge when deviationMeters is 0', () => {
    const { container } = renderAlert(<DeviationAlert state="on-track" deviationMeters={0} />);
    const distance = container.querySelector(`.${styles.distance}`);
    expect(distance).toBeNull();
  });

  it('applies a custom className to the wrapper', () => {
    const { container } = renderAlert(<DeviationAlert className="custom-class" />);
    const wrapper = container.querySelector(`.${styles.wrapper}`) as HTMLElement;
    expect(wrapper.classList.contains(`custom-class`)).toBe(true);
  });

  it('renders the pulsing dot inside the pill', () => {
    const { container } = renderAlert(<DeviationAlert state="on-track" />);
    const dot = container.querySelector(`.${styles.dot}`) as HTMLElement;
    expect(dot).toBeTruthy();
  });

  it('renders the Recompute label text inside the button', () => {
    const { getByText } = renderAlert(<DeviationAlert state="lost" />);
    expect(getByText(`Recompute`)).toBeTruthy();
  });
});
