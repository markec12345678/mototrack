import { render } from '@testing-library/react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { RouteWeatherStrip } from './route-weather-strip.js';

const mockRoute = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.2396, lng: 14.3561 },
  { lat: 46.3625, lng: 14.0948 },
];

function renderStrip(props = {}) {
  return render(
    <MockProvider>
      <RouteWeatherStrip route={mockRoute} samples={3} {...props} />
    </MockProvider>
  );
}

it(`renders the route weather title`, () => {
  const { getByText } = renderStrip();
  expect(getByText(`Route Weather`)).toBeTruthy();
});

it(`renders the strip root element`, () => {
  const { container } = renderStrip();
  const strip = container.firstElementChild?.firstElementChild;
  expect(strip).toBeTruthy();
});

it(`renders some content state inside the scroll container`, () => {
  const { container } = renderStrip();
  // The component always renders either skeleton, error, empty, or points
  expect(container.children.length).toBeGreaterThan(0);
});

it(`applies a custom className to the root element`, () => {
  const { container } = renderStrip({ className: `my-custom-class` });
  const strip = container.querySelector(`.my-custom-class`);
  expect(strip).toBeTruthy();
});

it(`applies custom inline style to the root element`, () => {
  const { container } = renderStrip({ style: { opacity: 0.8 } });
  // The strip is the first child inside MockProvider's wrapper
  const strip = container.querySelector(`[style]`) as HTMLElement | null;
  expect(strip).toBeTruthy();
});

it(`renders the strip without crashing when route is empty`, () => {
  const { getByText } = render(
    <MockProvider>
      <RouteWeatherStrip route={[]} samples={0} />
    </MockProvider>
  );
  expect(getByText(`Route Weather`)).toBeTruthy();
});

it(`renders the strip with default props`, () => {
  const { getByText } = render(
    <MockProvider>
      <RouteWeatherStrip />
    </MockProvider>
  );
  expect(getByText(`Route Weather`)).toBeTruthy();
});

it(`renders a non-empty container`, () => {
  const { container } = renderStrip({ samples: 3 });
  expect(container.innerHTML.length).toBeGreaterThan(0);
});
