import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Heading } from './heading.js';
import styles from './heading.module.scss';

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('should render children text', () => {
  const { container } = renderWithProvider(
    <Heading level={1}>Race Title</Heading>
  );
  expect(container.textContent).toContain('Race Title');
});

it('should render as h1 by default', () => {
  const { container } = renderWithProvider(<Heading>Default Heading</Heading>);
  const el = container.querySelector('h1');
  expect(el).toBeTruthy();
});

it('should render the correct semantic tag for each level', () => {
  const levels = [1, 2, 3, 4, 5, 6] as const;
  levels.forEach((level) => {
    const { container } = renderWithProvider(
      <Heading level={level}>Level {level}</Heading>
    );
    const el = container.querySelector(`h${level}`);
    expect(el).toBeTruthy();
  });
});

it('should apply the heading base class', () => {
  const { container } = renderWithProvider(<Heading level={2}>Test</Heading>);
  const el = container.querySelector('h2');
  expect(el?.className).toContain(styles.heading);
});

it('should apply the correct size class for the default level mapping', () => {
  const { container } = renderWithProvider(<Heading level={1}>H1</Heading>);
  const el = container.querySelector('h1');
  expect(el?.className).toContain(styles['size-3xl']);
});

it('should apply an explicit size class when size prop is provided', () => {
  const { container } = renderWithProvider(
    <Heading level={1} size="sm">Small H1</Heading>
  );
  const el = container.querySelector('h1');
  expect(el?.className).toContain(styles['size-sm']);
});

it('should apply the primary color class by default', () => {
  const { container } = renderWithProvider(<Heading level={3}>Primary</Heading>);
  const el = container.querySelector('h3');
  expect(el?.className).toContain(styles['color-primary']);
});

it('should apply the accent color class when color="accent"', () => {
  const { container } = renderWithProvider(
    <Heading level={2} color="accent">Accent</Heading>
  );
  const el = container.querySelector('h2');
  expect(el?.className).toContain(styles['color-accent']);
});

it('should apply the danger color class when color="danger"', () => {
  const { container } = renderWithProvider(
    <Heading level={4} color="danger">Danger</Heading>
  );
  const el = container.querySelector('h4');
  expect(el?.className).toContain(styles['color-danger']);
});

it('should apply the secondary color class when color="secondary"', () => {
  const { container } = renderWithProvider(
    <Heading level={5} color="secondary">Secondary</Heading>
  );
  const el = container.querySelector('h5');
  expect(el?.className).toContain(styles['color-secondary']);
});

it('should merge a custom className', () => {
  const { container } = renderWithProvider(
    <Heading level={2} className="custom-class">Merged</Heading>
  );
  const el = container.querySelector('h2');
  expect(el?.className).toContain('custom-class');
});

it('should apply the correct default size for each level', () => {
  const expectedSizes: Record<number, string> = {
    1: 'size-3xl',
    2: 'size-2xl',
    3: 'size-xl',
    4: 'size-lg',
    5: 'size-md',
    6: 'size-sm',
  };

  [1, 2, 3, 4, 5, 6].forEach((level) => {
    const lvl = level as 1 | 2 | 3 | 4 | 5 | 6;
    const { container } = renderWithProvider(
      <Heading level={lvl}>Level {level}</Heading>
    );
    const el = container.querySelector(`h${level}`);
    const sizeKey = expectedSizes[level] as keyof typeof styles;
    expect(el?.className).toContain(styles[sizeKey]);
  });
});
