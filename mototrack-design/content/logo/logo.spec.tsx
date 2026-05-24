import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';
import styles from './logo.module.scss';

function renderLogo(props: React.ComponentProps<typeof Logo> = {}) {
  return render(
    <MemoryRouter>
      <Logo {...props} />
    </MemoryRouter>
  );
}

it('should render the MotoTrack wordmark', () => {
  const { getByText } = renderLogo();
  expect(getByText('Moto')).toBeTruthy();
  expect(getByText('Track')).toBeTruthy();
});

it('should render the motorcycle icon', () => {
  const { container } = renderLogo();
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon).toBeTruthy();
  expect(icon?.textContent).toBe('🏍️');
});

it('should render the Balkan tag pill by default', () => {
  const { getByText } = renderLogo();
  expect(getByText('Balkan')).toBeTruthy();
});

it('should hide the tag pill when showTag is false', () => {
  const { container } = renderLogo({ showTag: false });
  const tag = container.querySelector(`.${styles.tag}`);
  expect(tag).toBeNull();
});

it('should render a custom tag label', () => {
  const { getByText } = renderLogo({ tag: `Pro` });
  expect(getByText('Pro')).toBeTruthy();
});

it('should apply the sm size class', () => {
  const { container } = renderLogo({ size: 'sm' });
  const root = container.querySelector(`.${styles.sm}`);
  expect(root).toBeTruthy();
});

it('should apply the md size class by default', () => {
  const { container } = renderLogo();
  const root = container.querySelector(`.${styles.md}`);
  expect(root).toBeTruthy();
});

it('should apply the lg size class', () => {
  const { container } = renderLogo({ size: 'lg' });
  const root = container.querySelector(`.${styles.lg}`);
  expect(root).toBeTruthy();
});

it('should render a link pointing to home by default', () => {
  const { container } = renderLogo();
  const anchor = container.querySelector('a');
  expect(anchor).toBeTruthy();
  expect(anchor?.getAttribute('href')?.includes('/')).toBe(true);
});

it('should render a link pointing to a custom href', () => {
  const { container } = renderLogo({ href: '/dashboard' });
  const anchor = container.querySelector('a');
  expect(anchor?.getAttribute('href')?.includes('/dashboard')).toBe(true);
});

it('should apply a custom className', () => {
  const { container } = renderLogo({ className: 'my-custom-class' });
  const root = container.querySelector('.my-custom-class');
  expect(root).toBeTruthy();
});

it('should render the wordmark Moto span with correct class', () => {
  const { container } = renderLogo();
  const moto = container.querySelector(`.${styles.wordmarkMoto}`);
  expect(moto?.textContent).toBe('Moto');
});

it('should render the wordmark Track span with correct class', () => {
  const { container } = renderLogo();
  const track = container.querySelector(`.${styles.wordmarkTrack}`);
  expect(track?.textContent).toBe('Track');
});
