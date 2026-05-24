import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { IconButton } from './icon-button.js';
import styles from './icon-button.module.scss';

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" data-testid="star-icon">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}

describe('IconButton', () => {
  it('should render the icon button', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should render the icon inside the button', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const iconWrap = container.querySelector(`.${styles.iconWrap}`);
    expect(iconWrap).toBeTruthy();
  });

  it('should apply the ghost variant class by default', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.ghost)).toBe(true);
  });

  it('should apply the filled variant class', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} variant="filled" aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.filled)).toBe(true);
  });

  it('should apply the danger variant class', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<CloseIcon />} variant="danger" aria-label="Delete" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.danger)).toBe(true);
  });

  it('should apply the sm size class', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} size="sm" aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.sm)).toBe(true);
  });

  it('should apply the md size class by default', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.md)).toBe(true);
  });

  it('should apply the lg size class', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} size="lg" aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.lg)).toBe(true);
  });

  it('should call onClick when clicked', () => {
    let clicked = false;
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" onClick={() => { clicked = true; }} />
      </MockProvider>
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    fireEvent.click(button);
    expect(clicked).toBe(true);
  });

  it('should not call onClick when disabled', () => {
    let clicked = false;
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" disabled onClick={() => { clicked = true; }} />
      </MockProvider>
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should apply the active class when active is true', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" active />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.active)).toBe(true);
  });

  it('should not apply the active class when active is false', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains(styles.active)).toBe(false);
  });

  it('should set the aria-label attribute', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Favourite" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Favourite');
  });

  it('should set the title attribute', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" title="Add to favourites" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.getAttribute('title')).toBe('Add to favourites');
  });

  it('should apply a custom className', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" className="my-custom-class" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.classList.contains('my-custom-class')).toBe(true);
  });

  it('should default to type="button"', () => {
    const { container } = render(
      <MockProvider>
        <IconButton icon={<StarIcon />} aria-label="Star" />
      </MockProvider>
    );
    const button = container.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
  });
});
