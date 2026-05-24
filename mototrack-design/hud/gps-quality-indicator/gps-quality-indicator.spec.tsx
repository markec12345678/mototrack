import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GpsQualityIndicator } from './gps-quality-indicator.js';
import styles from './gps-quality-indicator.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

describe('GpsQualityIndicator', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies the excellent class when accuracy is ≤10 m', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={6} />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.excellent)).toBe(true);
  });

  it('applies the good class when accuracy is between 11 m and 25 m', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={20} />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.good)).toBe(true);
  });

  it('applies the poor class when accuracy is between 26 m and 50 m', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={40} />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.poor)).toBe(true);
  });

  it('applies the lost class when accuracy is null', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={null} />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.lost)).toBe(true);
  });

  it('applies the lost class when accuracy is >50 m', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={75} />);
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.lost)).toBe(true);
  });

  it('respects the quality prop override', () => {
    const { container } = renderWithProvider(
      <GpsQualityIndicator accuracyMeters={6} quality="poor" />
    );
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.poor)).toBe(true);
    expect(dot?.classList.contains(styles.excellent)).toBe(false);
  });

  it('renders the tooltip element when showTooltip is true', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={6} showTooltip />);
    const tooltip = container.querySelector(`.${styles.tooltip}`);
    expect(tooltip).toBeTruthy();
  });

  it('does not render the tooltip when showTooltip is false', () => {
    const { container } = renderWithProvider(
      <GpsQualityIndicator accuracyMeters={6} showTooltip={false} />
    );
    const tooltip = container.querySelector(`.${styles.tooltip}`);
    expect(tooltip).toBeNull();
  });

  it('renders the accuracy value in the tooltip for non-lost states', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={18} />);
    const accuracyEl = container.querySelector(`.${styles.tooltipAccuracy}`);
    expect(accuracyEl?.textContent?.includes('18')).toBe(true);
  });

  it('does not render accuracy row in tooltip when signal is lost', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={null} />);
    const accuracyEl = container.querySelector(`.${styles.tooltipAccuracy}`);
    expect(accuracyEl).toBeNull();
  });

  it('applies a custom className to the root wrapper', () => {
    const { container } = renderWithProvider(
      <GpsQualityIndicator accuracyMeters={6} className="custom-class" />
    );
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    expect(wrapper?.classList.contains('custom-class')).toBe(true);
  });

  it('applies the pulsing class when reconnecting prop is true', () => {
    const { container } = renderWithProvider(
      <GpsQualityIndicator accuracyMeters={8} reconnecting />
    );
    const dot = container.querySelector(`.${styles.dot}`);
    expect(dot?.classList.contains(styles.pulsing)).toBe(true);
  });

  it('renders with the correct aria-label for excellent quality', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={6} />);
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    const ariaLabel = wrapper?.getAttribute('aria-label') ?? '';
    expect(ariaLabel.includes('Excellent')).toBe(true);
    expect(ariaLabel.includes('6')).toBe(true);
  });

  it('renders with the correct aria-label for lost signal', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={null} />);
    const wrapper = container.querySelector(`.${styles.wrapper}`);
    const ariaLabel = wrapper?.getAttribute('aria-label') ?? '';
    expect(ariaLabel.includes('Lost')).toBe(true);
  });

  it('applies custom size via inline style on the dot', () => {
    const { container } = renderWithProvider(<GpsQualityIndicator accuracyMeters={6} size={20} />);
    const dot = container.querySelector(`.${styles.dot}`) as HTMLElement | null;
    expect(dot?.style.width).toBe('20px');
    expect(dot?.style.height).toBe('20px');
  });
});
