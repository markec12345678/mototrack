import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MapLibre3D } from './map-libre-3d.js';
import { mockCenter, mockRoute } from './map-libre-3d.mock.js';
import styles from './map-libre-3d.module.scss';

// In JSDom, HTMLCanvasElement.getContext() returns null (no WebGL),
// so detectWebGL() returns false. After useEffect runs, the component
// renders the FallbackNotice branch. The root container is always present.

function renderMap(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe(`MapLibre3D`, () => {
  it(`renders the root container`, () => {
    const { container } = renderMap(<MapLibre3D center={mockCenter} />);
    const root = container.querySelector(`.${styles.root}`);
    expect(root).toBeTruthy();
  });

  it(`applies a custom className to the root`, () => {
    const { container } = renderMap(
      <MapLibre3D center={mockCenter} className="custom-map" />
    );
    const root = container.querySelector(`.custom-map`);
    expect(root).toBeTruthy();
  });

  it(`applies a custom height via the style prop`, () => {
    const { container } = renderMap(
      <MapLibre3D center={mockCenter} height="400px" />
    );
    const root = container.querySelector(`.${styles.root}`) as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.style.height).toBe(`400px`);
  });

  it(`renders the root element regardless of WebGL support`, () => {
    const { container } = renderMap(<MapLibre3D center={mockCenter} />);
    // JSDom has no WebGL — fallback branch renders, but root is always present
    const root = container.querySelector(`.${styles.root}`);
    expect(root).toBeTruthy();
  });

  it(`renders with default props without crashing`, () => {
    const { container } = renderMap(<MapLibre3D />);
    expect(container.firstChild).toBeTruthy();
  });

  it(`renders with a route prop without crashing`, () => {
    const { container } = renderMap(
      <MapLibre3D center={mockCenter} route={mockRoute} />
    );
    const root = container.querySelector(`.${styles.root}`);
    expect(root).toBeTruthy();
  });

  it(`renders with all props provided`, () => {
    const { container } = renderMap(
      <MapLibre3D
        center={mockCenter}
        zoom={14}
        pitch={45}
        bearing={30}
        route={mockRoute}
        height="600px"
        className="full-props"
      />
    );
    const root = container.querySelector(`.full-props`);
    expect(root).toBeTruthy();
  });

  it(`passes inline style to the root element`, () => {
    const { container } = renderMap(
      <MapLibre3D center={mockCenter} style={{ border: `1px solid red` }} />
    );
    const root = container.querySelector(`.${styles.root}`) as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.style.border).toBe(`1px solid red`);
  });
});
