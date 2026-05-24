import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Icon } from './icon.js';
import styles from './icon.module.scss';

function renderIcon(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it(`should render the icon container`, () => {
  const { container } = renderIcon(<Icon />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el).toBeTruthy();
});

it(`should render a string glyph`, () => {
  const { container } = renderIcon(<Icon glyph="🏍️" />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.textContent).toBe(`🏍️`);
});

it(`should render a React node glyph passed as children`, () => {
  const { container } = renderIcon(
    <Icon>
      <svg />
    </Icon>
  );
  const svg = container.querySelector(`svg`);
  expect(svg).toBeTruthy();
});

it(`should apply the md size class by default`, () => {
  const { container } = renderIcon(<Icon />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.classList.contains(styles.md)).toBe(true);
});

it(`should apply the correct size class for each size`, () => {
  const sizes = [`xs`, `sm`, `md`, `lg`, `xl`, `xxl`] as const;
  sizes.forEach((size) => {
    const { container } = renderIcon(<Icon size={size} />);
    const el = container.querySelector(`.${styles.icon}`);
    expect(el?.classList.contains(styles[size])).toBe(true);
  });
});

it(`should apply a custom className`, () => {
  const { container } = renderIcon(<Icon className="custom-class" />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.classList.contains(`custom-class`)).toBe(true);
});

it(`should set aria-label when label prop is provided`, () => {
  const { container } = renderIcon(<Icon label="Speed gauge" />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.getAttribute(`aria-label`)).toBe(`Speed gauge`);
});

it(`should set role="img" when label prop is provided`, () => {
  const { container } = renderIcon(<Icon label="Trophy" />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.getAttribute(`role`)).toBe(`img`);
});

it(`should set aria-hidden when no label is provided`, () => {
  const { container } = renderIcon(<Icon />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.getAttribute(`aria-hidden`)).toBe(`true`);
});

it(`should apply the clickable class when onClick is provided`, () => {
  const { container } = renderIcon(<Icon onClick={() => undefined} />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.classList.contains(styles.clickable)).toBe(true);
});

it(`should not apply the clickable class when onClick is not provided`, () => {
  const { container } = renderIcon(<Icon />);
  const el = container.querySelector(`.${styles.icon}`);
  expect(el?.classList.contains(styles.clickable)).toBe(false);
});

it(`should call onClick when the icon is clicked`, () => {
  let clicked = false;
  const { container } = renderIcon(<Icon onClick={() => { clicked = true; }} />);
  const el = container.querySelector(`.${styles.icon}`) as HTMLElement;
  fireEvent.click(el);
  expect(clicked).toBe(true);
});

it(`should apply inline color style when color prop is provided`, () => {
  const { container } = renderIcon(<Icon color="#f97316" />);
  const el = container.querySelector(`.${styles.icon}`) as HTMLElement;
  expect(el?.style.color).toBe(`rgb(249, 115, 22)`);
});
