import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { Library } from './library.js';
import { mockRoutes } from './library.mock.js';

function renderLibrary(props: Partial<React.ComponentProps<typeof Library>> = {}) {
  return render(
    <MockProvider>
      <Library mockRoutes={mockRoutes} {...props} />
    </MockProvider>
  );
}

it('renders the page heading', () => {
  const { getByText } = renderLibrary();
  expect(getByText(`Route Library`)).toBeTruthy();
});

it('renders all route cards when no filter is active', () => {
  const { getAllByText } = renderLibrary();
  const loadBtns = getAllByText(`Load`);
  expect(loadBtns.length).toBe(mockRoutes.length);
});

it('renders route names on the cards', () => {
  const { container } = renderLibrary();
  const names = Array.from(container.querySelectorAll(`h3`)).map((el) => el.textContent);
  expect(names).toContain(`Vršič Pass Loop`);
  expect(names).toContain(`Soča Valley Cruise`);
});

it('renders distance stats on cards', () => {
  const { getAllByText } = renderLibrary();
  const distanceLabels = getAllByText(`Distance`);
  expect(distanceLabels.length).toBeGreaterThan(0);
});

it('renders filter buttons for all modes', () => {
  const { container } = renderLibrary();
  const filterBtns = Array.from(container.querySelectorAll(`button`)).filter(
    (btn) => !btn.getAttribute(`aria-label`)
  );
  const labels = filterBtns.map((btn) => btn.textContent ?? ``);
  expect(labels.some((l) => l.includes(`All`))).toBe(true);
  expect(labels.some((l) => l.includes(`Asfalt`))).toBe(true);
  expect(labels.some((l) => l.includes(`Vijugasto`))).toBe(true);
  expect(labels.some((l) => l.includes(`Terensko`))).toBe(true);
});

it('filters routes by paved mode when filter button is clicked', () => {
  const { getAllByText, container } = renderLibrary();
  const filterBtns = container.querySelectorAll(`button`);
  const pavedBtn = Array.from(filterBtns).find(
    (btn) => btn.textContent?.includes(`Asfalt`) && btn.textContent?.includes(`🛣️`) && !btn.getAttribute(`aria-label`)
  );
  expect(pavedBtn).toBeTruthy();
  fireEvent.click(pavedBtn!);
  const loadBtns = getAllByText(`Load`);
  const pavedCount = mockRoutes.filter((r) => r.mode === `paved`).length;
  expect(loadBtns.length).toBe(pavedCount);
});

it('filters routes by offroad mode when filter button is clicked', () => {
  const { getAllByText, container } = renderLibrary();
  const filterBtns = container.querySelectorAll(`button`);
  const offroadBtn = Array.from(filterBtns).find(
    (btn) => btn.textContent?.includes(`Terensko`) && btn.textContent?.includes(`🏔️`) && !btn.getAttribute(`aria-label`)
  );
  expect(offroadBtn).toBeTruthy();
  fireEvent.click(offroadBtn!);
  const loadBtns = getAllByText(`Load`);
  const offroadCount = mockRoutes.filter((r) => r.mode === `offroad`).length;
  expect(loadBtns.length).toBe(offroadCount);
});

it('shows empty state when no routes are provided', () => {
  const { getByText } = render(
    <MockProvider>
      <Library mockRoutes={[]} />
    </MockProvider>
  );
  expect(getByText(`No routes found`)).toBeTruthy();
});

it('calls onLoadRoute when Load button is clicked', () => {
  const onLoadRoute = vi.fn();
  const { getAllByText } = renderLibrary({ onLoadRoute });
  const loadBtns = getAllByText(`Load`);
  fireEvent.click(loadBtns[0]);
  expect(onLoadRoute).toHaveBeenCalledWith(mockRoutes[0]);
});

it('calls onShareRoute when Share button is clicked', () => {
  const onShareRoute = vi.fn();
  const { getAllByText } = renderLibrary({ onShareRoute });
  const shareBtns = getAllByText(`Share`);
  fireEvent.click(shareBtns[0]);
  expect(onShareRoute).toHaveBeenCalledWith(mockRoutes[0]);
});

it('calls onExportGpx when GPX button is clicked', () => {
  const onExportGpx = vi.fn();
  const { getAllByText } = renderLibrary({ onExportGpx });
  const gpxBtns = getAllByText(`GPX`);
  fireEvent.click(gpxBtns[0]);
  expect(onExportGpx).toHaveBeenCalledWith(mockRoutes[0]);
});

it('calls onDeleteRoute when delete button is clicked', () => {
  const onDeleteRoute = vi.fn();
  const { container } = renderLibrary({ onDeleteRoute });
  const deleteBtns = container.querySelectorAll(`button[aria-label^="Delete"]`);
  fireEvent.click(deleteBtns[0]);
  expect(onDeleteRoute).toHaveBeenCalledWith(mockRoutes[0]);
});

it('renders mini-map SVG for each route card', () => {
  const { container } = renderLibrary();
  const svgs = container.querySelectorAll(`svg`);
  expect(svgs.length).toBeGreaterThan(0);
});

it('renders route count in the toolbar', () => {
  const { getByText } = renderLibrary();
  expect(getByText(`${mockRoutes.length} routes`)).toBeTruthy();
});
