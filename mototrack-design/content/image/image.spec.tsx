import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Image } from './image.js';
import styles from './image.module.scss';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(_callback: IntersectionObserverCallback) {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

const VALID_SRC = `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_scene___0_1779616015959.png`;

function renderWithProvider(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

it('renders the img element when src is provided', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race track" lazy={false} />
  );
  const img = container.querySelector('img');
  expect(img).toBeTruthy();
  expect(img?.getAttribute('src')).toBe(VALID_SRC);
});

it('renders the alt attribute on the img element', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Racing helmet" lazy={false} />
  );
  const img = container.querySelector('img');
  expect(img?.getAttribute('alt')).toBe('Racing helmet');
});

it('renders the fallback when no src is provided', () => {
  const { container } = renderWithProvider(
    <Image alt="No source" lazy={false} />
  );
  const fallback = container.querySelector(`.${styles.fallback}`);
  expect(fallback).toBeTruthy();
});

it('renders the alt text inside the fallback', () => {
  const { container } = renderWithProvider(
    <Image alt="Missing image description" lazy={false} />
  );
  const altLabel = container.querySelector(`.${styles.fallbackAlt}`);
  expect(altLabel?.textContent).toBe('Missing image description');
});

it('renders the fallback when src is a broken URL', () => {
  const { container } = renderWithProvider(
    <Image src="https://broken.url/img.jpg" alt="Broken image" lazy={false} />
  );
  const img = container.querySelector('img');
  expect(img).toBeTruthy();

  fireEvent.error(img!);

  const fallback = container.querySelector(`.${styles.fallback}`);
  expect(fallback).toBeTruthy();
});

it('renders the caption when provided', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" caption="Race track at dusk" lazy={false} />
  );
  const caption = container.querySelector(`.${styles.caption}`);
  expect(caption?.textContent).toBe('Race track at dusk');
});

it('does not render a caption when not provided', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} />
  );
  const caption = container.querySelector(`.${styles.caption}`);
  expect(caption).toBeNull();
});

it('renders a figure element as the root', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} />
  );
  const figure = container.querySelector('figure');
  expect(figure).toBeTruthy();
});

it('applies the custom className to the root figure', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" className="custom-class" lazy={false} />
  );
  const figure = container.querySelector('figure');
  expect(figure?.classList.contains('custom-class')).toBe(true);
});

it('sets loading="eager" on the img when lazy is false', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} />
  );
  const img = container.querySelector('img');
  expect(img?.getAttribute('loading')).toBe('eager');
});

it('calls onLoad callback when image loads successfully', () => {
  const onLoad = vi.fn();
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} onLoad={onLoad} />
  );
  const img = container.querySelector('img');
  fireEvent.load(img!);
  expect(onLoad).toHaveBeenCalledTimes(1);
});

it('calls onError callback when image fails to load', () => {
  const onError = vi.fn();
  const { container } = renderWithProvider(
    <Image src="https://broken.url/img.jpg" alt="Broken" lazy={false} onError={onError} />
  );
  const img = container.querySelector('img');
  fireEvent.error(img!);
  expect(onError).toHaveBeenCalledTimes(1);
});

it('renders the skeleton element before image loads', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} />
  );
  const skeleton = container.querySelector(`.${styles.skeleton}`);
  expect(skeleton).toBeTruthy();
});

it('hides the skeleton after image loads', () => {
  const { container } = renderWithProvider(
    <Image src={VALID_SRC} alt="Race" lazy={false} />
  );
  const img = container.querySelector('img');
  fireEvent.load(img!);
  const skeleton = container.querySelector(`.${styles.skeleton}`);
  expect(skeleton?.classList.contains(styles.skeletonHidden)).toBe(true);
});
