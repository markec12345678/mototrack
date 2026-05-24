import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { demoUser } from '@markec/mototrack-platform.hooks.use-auth';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { MapPage } from './map-page.js';

const center = LatLng.from({ lat: 43.8563, lng: 18.4131 });

function renderMapPage(props = {}) {
  return render(
    <MockProvider>
      <MapPage center={center} zoom={13} mockUser={demoUser} {...props} />
    </MockProvider>
  );
}

it('should render without crashing', () => {
  const { container } = renderMapPage();
  expect(container.firstChild).toBeTruthy();
});

it('should render the 3D terrain toggle button', () => {
  const { container } = renderMapPage();
  const toggleBtn = container.querySelector(`button[title="Switch to 3D terrain"]`);
  expect(toggleBtn).toBeTruthy();
});

it('should render the 2D map toggle button after switching to 3D', () => {
  const { container } = renderMapPage();
  const toggleBtn = container.querySelector(`button[title="Switch to 3D terrain"]`) as HTMLButtonElement;

  fireEvent.click(toggleBtn);

  const switchTo2DBtn = container.querySelector(`button[title="Switch to 2D map"]`);
  expect(switchTo2DBtn).toBeTruthy();
});

it('should toggle back to 2D when the 2D button is clicked', () => {
  const { container } = renderMapPage();
  const toggleBtn = container.querySelector(`button[title="Switch to 3D terrain"]`) as HTMLButtonElement;

  fireEvent.click(toggleBtn);

  const switchTo2DBtn = container.querySelector(`button[title="Switch to 2D map"]`) as HTMLButtonElement;
  fireEvent.click(switchTo2DBtn);

  const switchTo3DBtn = container.querySelector(`button[title="Switch to 3D terrain"]`);
  expect(switchTo3DBtn).toBeTruthy();
});

it('should accept a custom className on the root element', () => {
  const { container } = renderMapPage({ className: `custom-map-page` });
  const root = container.querySelector(`.custom-map-page`);
  expect(root).toBeTruthy();
});

it('should render without a mockUser (unauthenticated state)', () => {
  const { container } = render(
    <MockProvider>
      <MapPage center={center} zoom={13} redirectTo="/login" />
    </MockProvider>
  );
  expect(container.firstChild).toBeTruthy();
});
