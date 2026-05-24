import React from 'react';
import { vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { TileStylePicker } from './tile-style-picker.js';
import { BUILT_IN_PROVIDERS } from './built-in-providers.js';
import styles from './tile-style-picker.module.scss';

function renderPicker(props = {}) {
  return render(
    <MockProvider>
      <TileStylePicker {...props} />
    </MockProvider>
  );
}

it('should render the trigger button', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button');
  expect(trigger).toBeTruthy();
});

it('should not show the panel by default', () => {
  const { container } = renderPicker();
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeNull();
});

it('should open the panel when trigger is clicked', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeTruthy();
});

it('should render all 5 built-in tile options when open', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const tiles = container.querySelectorAll(`.${styles.tile}`);
  expect(tiles.length).toBe(BUILT_IN_PROVIDERS.length);
});

it('should render slot provider tiles in addition to built-ins', () => {
  const extraProviders = [
    {
      key: `custom-a`,
      label: `Custom A`,
      urlTemplate: `https://tiles.example.com/{z}/{x}/{y}.png`,
      attribution: `Custom`,
    },
  ];
  const { container } = renderPicker({ providers: extraProviders });
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const tiles = container.querySelectorAll(`.${styles.tile}`);
  expect(tiles.length).toBe(BUILT_IN_PROVIDERS.length + extraProviders.length);
});

it('should mark the active tile with the active class', () => {
  const { container } = renderPicker({ activeKey: `satellite` });
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const activeTiles = container.querySelectorAll(`.${styles.tileActive}`);
  expect(activeTiles.length).toBe(1);
});

it('should call onSelect with the correct provider when a tile is clicked', () => {
  const onSelect = vi.fn();
  const { container } = renderPicker({ onSelect });
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const tiles = container.querySelectorAll(`.${styles.tile}`);
  fireEvent.click(tiles[1]);
  expect(onSelect).toHaveBeenCalledWith(
    expect.objectContaining({ key: BUILT_IN_PROVIDERS[1].key })
  );
});

it('should close the panel after selecting a tile', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const tiles = container.querySelectorAll(`.${styles.tile}`);
  fireEvent.click(tiles[0]);
  const panel = container.querySelector(`.${styles.panel}`);
  expect(panel).toBeNull();
});

it('should render thumbnail images for built-in providers', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const images = container.querySelectorAll(`.${styles.tileImg}`);
  expect(images.length).toBeGreaterThan(0);
});

it('should show the panel title when open', () => {
  const { container } = renderPicker();
  const trigger = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(trigger);
  const title = container.querySelector(`.${styles.panelTitle}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe('Map Style');
});
