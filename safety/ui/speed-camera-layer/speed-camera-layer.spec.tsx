import * as React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { SpeedCameraLayer } from './speed-camera-layer.js';
import { mockSpeedCameras } from './speed-camera-layer.mock.js';

vi.mock(`react-leaflet`, () => ({
  Marker: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="marker">{children}</div>
  ),
  Popup: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="popup">{children}</div>
  ),
}));

vi.mock(`leaflet`, () => ({
  divIcon: () => ({}),
}));

vi.mock(`react-dom/server`, () => ({
  renderToStaticMarkup: () => `<div>📷</div>`,
}));

vi.mock(`@markec/safety.hooks.use-speed-cameras`, () => ({
  useSpeedCameras: () => ({
    cameras: mockSpeedCameras,
    loading: false,
    error: undefined,
    list: () => mockSpeedCameras,
    nearest: () => undefined,
  }),
}));

function renderLayer(cameras = mockSpeedCameras) {
  return render(
    <MockProvider>
      <SpeedCameraLayer cameras={cameras} />
    </MockProvider>
  );
}

it(`renders a marker for each camera`, () => {
  const { container } = renderLayer();
  const markers = container.querySelectorAll(`[data-testid="marker"]`);
  expect(markers.length).toBe(mockSpeedCameras.length);
});

it(`renders popup content with speed limit`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup).toBeTruthy();
  expect(popup?.textContent).toContain(`${mockSpeedCameras[0].speedLimit}`);
});

it(`renders popup content with camera type`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup?.textContent).toContain(mockSpeedCameras[0].type);
});

it(`renders popup content with country`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup?.textContent).toContain(mockSpeedCameras[0].country);
});

it(`renders no markers when cameras list is empty`, () => {
  const { container } = renderLayer([]);
  const markers = container.querySelectorAll(`[data-testid="marker"]`);
  expect(markers.length).toBe(0);
});

it(`renders popup header with camera emoji`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup?.textContent).toContain(`📷`);
});

it(`renders speed limit with km/h unit`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup?.textContent).toContain(`km/h`);
});

it(`renders Speed Camera title in popup`, () => {
  const { container } = renderLayer([mockSpeedCameras[0]]);
  const popup = container.querySelector(`[data-testid="popup"]`);
  expect(popup?.textContent).toContain(`Speed Camera`);
});
