import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Avatar } from './avatar.js';
import styles from './avatar.module.scss';

function renderAvatar(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render initials from a full name', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" />);
  const initials = container.querySelector(`.${styles.initials}`);
  expect(initials).toBeTruthy();
  expect(initials?.textContent).toBe(`MB`);
});

it('should render a single initial for a one-word name', () => {
  const { container } = renderAvatar(<Avatar name="Marco" />);
  const initials = container.querySelector(`.${styles.initials}`);
  expect(initials?.textContent).toBe(`M`);
});

it('should render an image when src is provided', () => {
  const { container } = renderAvatar(
    <Avatar name="Marco Bianchi" src="https://example.com/avatar.jpg" />
  );
  const img = container.querySelector(`.${styles.image}`) as HTMLImageElement | null;
  expect(img).toBeTruthy();
  expect(img?.src).toContain(`example.com/avatar.jpg`);
});

it('should not render initials when src is provided', () => {
  const { container } = renderAvatar(
    <Avatar name="Marco Bianchi" src="https://example.com/avatar.jpg" />
  );
  const initials = container.querySelector(`.${styles.initials}`);
  expect(initials).toBeNull();
});

it('should apply the correct size class', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" size="lg" />);
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar?.classList.contains(styles.lg)).toBe(true);
});

it('should default to md size', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" />);
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar?.classList.contains(styles.md)).toBe(true);
});

it('should render the online status dot', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" status="online" />);
  const dot = container.querySelector(`.${styles.statusDot}`);
  expect(dot).toBeTruthy();
  expect(dot?.classList.contains(styles.online)).toBe(true);
});

it('should render the offline status dot', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" status="offline" />);
  const dot = container.querySelector(`.${styles.statusDot}`);
  expect(dot).toBeTruthy();
  expect(dot?.classList.contains(styles.offline)).toBe(true);
});

it('should not render a status dot when status is not provided', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" />);
  const dot = container.querySelector(`.${styles.statusDot}`);
  expect(dot).toBeNull();
});

it('should apply a custom className', () => {
  const { container } = renderAvatar(
    <Avatar name="Marco Bianchi" className="custom-class" />
  );
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar?.classList.contains(`custom-class`)).toBe(true);
});

it('should use name as aria-label', () => {
  const { container } = renderAvatar(<Avatar name="Marco Bianchi" />);
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar?.getAttribute(`aria-label`)).toBe(`Marco Bianchi`);
});

it('should prefer alt over name for aria-label when src is provided', () => {
  const { container } = renderAvatar(
    <Avatar name="Marco Bianchi" src="https://example.com/avatar.jpg" alt="Racer photo" />
  );
  const avatar = container.querySelector(`.${styles.avatar}`);
  expect(avatar?.getAttribute(`aria-label`)).toBe(`Racer photo`);
});
