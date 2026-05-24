import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Badge } from './badge.js';
import styles from './badge.module.scss';

function StarIcon() {
  return (
    <svg data-testid="star-icon" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <polygon points="5,1 6.5,4 10,4.5 7.5,7 8,10 5,8.5 2,10 2.5,7 0,4.5 3.5,4" />
    </svg>
  );
}

describe('Badge', () => {
  it('renders the label text', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Test Badge" />
      </MemoryRouter>
    );
    const label = container.querySelector(`.${styles.label}`);
    expect(label).toBeTruthy();
    expect(label?.textContent).toBe('Test Badge');
  });

  it('applies the neutral variant class by default', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Neutral" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.classList.contains(styles.neutral)).toBe(true);
  });

  it('applies the md size class by default', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Medium" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.classList.contains(styles.md)).toBe(true);
  });

  it('applies the correct variant class', () => {
    const variants = ['accent', 'success', 'warning', 'danger', 'info', 'neutral'] as const;
    variants.forEach((variant) => {
      const { container } = render(
        <MemoryRouter>
          <Badge label={variant} variant={variant} />
        </MemoryRouter>
      );
      const badge = container.querySelector(`.${styles.badge}`);
      expect(badge?.classList.contains(styles[variant])).toBe(true);
    });
  });

  it('applies the sm size class when size is sm', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Small" size="sm" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.classList.contains(styles.sm)).toBe(true);
  });

  it('applies the md size class when size is md', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Medium" size="md" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.classList.contains(styles.md)).toBe(true);
  });

  it('renders the icon when provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="With Icon" icon={<StarIcon />} />
      </MemoryRouter>
    );
    const iconWrapper = container.querySelector(`.${styles.icon}`);
    expect(iconWrapper).toBeTruthy();
  });

  it('does not render the icon wrapper when no icon is provided', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="No Icon" />
      </MemoryRouter>
    );
    const iconWrapper = container.querySelector(`.${styles.icon}`);
    expect(iconWrapper).toBeNull();
  });

  it('applies a custom className to the badge root', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Custom Class" className="my-custom-class" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.classList.contains('my-custom-class')).toBe(true);
  });

  it('renders as a span element', () => {
    const { container } = render(
      <MemoryRouter>
        <Badge label="Span Check" />
      </MemoryRouter>
    );
    const badge = container.querySelector(`.${styles.badge}`);
    expect(badge?.tagName.toLowerCase()).toBe('span');
  });

  it('renders multiple badges with different variants', () => {
    const { container } = render(
      <MemoryRouter>
        <div>
          <Badge label="Accent" variant="accent" />
          <Badge label="Success" variant="success" />
          <Badge label="Danger" variant="danger" />
        </div>
      </MemoryRouter>
    );
    const badges = container.querySelectorAll(`.${styles.badge}`);
    expect(badges.length).toBe(3);
  });
});
