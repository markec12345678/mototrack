import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { MapLayerToggle } from './map-layer-toggle.js';
import styles from './map-layer-toggle.module.scss';

const mockLayers = [
  { key: `satellite`, label: `Satellite`, defaultEnabled: false },
  { key: `traffic`, label: `Traffic`, defaultEnabled: true },
  { key: `terrain`, label: `Terrain`, defaultEnabled: false },
];

function renderComponent(props = {}) {
  return render(
    <MockProvider>
      <MapLayerToggle layers={mockLayers} {...props} />
    </MockProvider>
  );
}

it('renders the panel title', () => {
  const { container } = renderComponent({ title: `Map Layers` });
  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeTruthy();
  expect(title?.textContent).toBe(`Map Layers`);
});

it('renders all layer labels', () => {
  const { getByText } = renderComponent();
  expect(getByText(`Satellite`)).toBeTruthy();
  expect(getByText(`Traffic`)).toBeTruthy();
  expect(getByText(`Terrain`)).toBeTruthy();
});

it('renders a list item for each layer', () => {
  const { container } = renderComponent();
  const items = container.querySelectorAll(`.${styles.item}, .${styles.itemLast}`);
  expect(items.length).toBeGreaterThanOrEqual(mockLayers.length);
});

it('renders toggle inputs for each layer', () => {
  const { container } = renderComponent();
  const inputs = container.querySelectorAll(`input[type="checkbox"]`);
  expect(inputs.length).toBe(mockLayers.length);
});

it('reflects defaultEnabled=true as checked', () => {
  const { container } = renderComponent();
  const inputs = container.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]`);
  const trafficInput = Array.from(inputs).find((el) =>
    el.getAttribute('aria-label') === `Traffic`
  );
  expect(trafficInput?.checked).toBe(true);
});

it('reflects defaultEnabled=false as unchecked', () => {
  const { container } = renderComponent();
  const inputs = container.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]`);
  const satelliteInput = Array.from(inputs).find((el) =>
    el.getAttribute('aria-label') === `Satellite`
  );
  expect(satelliteInput?.checked).toBe(false);
});

it('calls onLayerChange when a toggle is clicked', () => {
  const onLayerChange = vi.fn();
  const { container } = renderComponent({ onLayerChange });
  const inputs = container.querySelectorAll<HTMLInputElement>(`input[type="checkbox"]`);
  const satelliteInput = Array.from(inputs).find((el) =>
    el.getAttribute('aria-label') === `Satellite`
  );
  expect(satelliteInput).toBeTruthy();
  fireEvent.click(satelliteInput as HTMLInputElement);
  expect(onLayerChange).toHaveBeenCalledWith(`satellite`, true);
});

it('renders nothing when layers array is empty', () => {
  const { container } = render(
    <MockProvider>
      <MapLayerToggle layers={[]} />
    </MockProvider>
  );
  const root = container.querySelector(`.${styles.root}`);
  expect(root).toBeNull();
});

it('applies a custom className to the root', () => {
  const { container } = renderComponent({ className: `my-custom-class` });
  const root = container.querySelector(`.${styles.root}`);
  expect(root?.classList.contains(`my-custom-class`)).toBe(true);
});

it('renders icons when provided', () => {
  const layers = [
    { key: `sat`, label: `Satellite`, icon: <span data-testid="sat-icon">🛰</span>, defaultEnabled: true },
  ];
  const { container } = render(
    <MockProvider>
      <MapLayerToggle layers={layers} />
    </MockProvider>
  );
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon).toBeTruthy();
});

it('renders the last item with itemLast class', () => {
  const { container } = renderComponent();
  const lastItems = container.querySelectorAll(`.${styles.itemLast}`);
  expect(lastItems.length).toBe(1);
});
