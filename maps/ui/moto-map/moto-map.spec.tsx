import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { MotoMap } from './moto-map.js';
import type { MapPolyline } from './polyline-type.js';
import type { MapMarker } from './map-marker-type.js';
import type { DraggableWaypoint } from './draggable-waypoint-type.js';

vi.mock(`react-leaflet`, () => {
  const React = require(`react`);

  function MapContainer({ children, className }: { children?: React.ReactNode; className?: string }) {
    return <div className={className} data-testid="map-container">{children}</div>;
  }

  function TileLayer({ url }: { url: string }) {
    return <div data-testid="tile-layer" data-url={url} />;
  }

  function Polyline({ pathOptions }: { positions: number[][]; pathOptions?: Record<string, unknown> }) {
    return <div data-testid="polyline" data-color={pathOptions?.color as string} />;
  }

  function Marker({ children, position }: { children?: React.ReactNode; position: number[] }) {
    return (
      <div data-testid="marker" data-lat={position[0]} data-lng={position[1]}>
        {children}
      </div>
    );
  }

  function Popup({ children }: { children?: React.ReactNode }) {
    return <div data-testid="popup">{children}</div>;
  }

  function CircleMarker({ center }: { center: number[]; pathOptions?: Record<string, unknown> }) {
    return <div data-testid="circle-marker" data-lat={center[0]} data-lng={center[1]} />;
  }

  function useMapEvents() {
    return null;
  }

  function useMap() {
    return { on: () => {}, off: () => {} };
  }

  return { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker, useMapEvents, useMap };
});

const CENTER = LatLng.from({ lat: 43.8563, lng: 18.4131 });

function renderMap(props = {}) {
  return render(
    <MockProvider>
      <MotoMap center={CENTER} zoom={13} {...props} />
    </MockProvider>
  );
}

it(`renders without crashing`, () => {
  const { container } = renderMap();
  expect(container.firstChild).toBeTruthy();
});

it(`renders the map container`, () => {
  const { container } = renderMap();
  const mapEl = container.querySelector(`[data-testid="map-container"]`);
  expect(mapEl).toBeTruthy();
});

it(`renders a tile layer`, () => {
  const { container } = renderMap();
  const tile = container.querySelector(`[data-testid="tile-layer"]`);
  expect(tile).toBeTruthy();
});

it(`renders polylines when provided`, () => {
  const polylines: MapPolyline[] = [
    {
      points: [
        LatLng.from({ lat: 43.85, lng: 18.41 }),
        LatLng.from({ lat: 43.86, lng: 18.42 }),
      ],
      color: `#3b82f6`,
      weight: 3,
    },
  ];
  const { container } = renderMap({ polylines });
  const polylineEls = container.querySelectorAll(`[data-testid="polyline"]`);
  expect(polylineEls.length).toBeGreaterThan(0);
});

it(`renders markers when provided`, () => {
  const markers: MapMarker[] = [
    { latlng: LatLng.from({ lat: 43.856, lng: 18.413 }), popup: `Start point` },
  ];
  const { container } = renderMap({ markers });
  const markerEls = container.querySelectorAll(`[data-testid="marker"]`);
  expect(markerEls.length).toBeGreaterThan(0);
});

it(`renders marker popup content`, () => {
  const markers: MapMarker[] = [
    { latlng: LatLng.from({ lat: 43.856, lng: 18.413 }), popup: `Fuel stop` },
  ];
  const { getByText } = renderMap({ markers });
  expect(getByText(`Fuel stop`)).toBeTruthy();
});

it(`renders rider position as circle marker`, () => {
  const riderPosition = LatLng.from({ lat: 43.86, lng: 18.42 });
  const { container } = renderMap({ riderPosition });
  const circleMarker = container.querySelector(`[data-testid="circle-marker"]`);
  expect(circleMarker).toBeTruthy();
});

it(`renders ride track polyline`, () => {
  const rideTrack = [
    LatLng.from({ lat: 43.85, lng: 18.41 }),
    LatLng.from({ lat: 43.86, lng: 18.42 }),
    LatLng.from({ lat: 43.87, lng: 18.43 }),
  ];
  const { container } = renderMap({ rideTrack });
  const polylineEls = container.querySelectorAll(`[data-testid="polyline"]`);
  expect(polylineEls.length).toBeGreaterThan(0);
});

it(`renders draggable waypoints as markers`, () => {
  const draggableWaypoints: DraggableWaypoint[] = [
    { id: `wp-1`, latlng: LatLng.from({ lat: 43.856, lng: 18.413 }) },
    { id: `wp-2`, latlng: LatLng.from({ lat: 43.862, lng: 18.425 }) },
  ];
  const { container } = renderMap({ draggableWaypoints });
  const markerEls = container.querySelectorAll(`[data-testid="marker"]`);
  expect(markerEls.length).toBeGreaterThanOrEqual(2);
});

it(`renders children inside the map`, () => {
  const { getByText } = renderMap({
    children: <div>Custom child</div>,
  });
  expect(getByText(`Custom child`)).toBeTruthy();
});

it(`renders slot overlay components at their positions`, () => {
  const overlays = [
    {
      key: `test-overlay`,
      component: () => <div>Overlay Content</div>,
      position: `top-left` as const,
    },
  ];
  const { getByText } = renderMap({ overlays });
  expect(getByText(`Overlay Content`)).toBeTruthy();
});

it(`renders remove waypoint button when onRemove is provided`, () => {
  const draggableWaypoints: DraggableWaypoint[] = [
    { id: `wp-1`, latlng: LatLng.from({ lat: 43.856, lng: 18.413 }) },
  ];
  const onRemove = vi.fn();
  const { getByText } = renderMap({ draggableWaypoints, onRemove });
  expect(getByText(`Remove waypoint`)).toBeTruthy();
});

it(`calls onRemove when remove waypoint button is clicked`, () => {
  const draggableWaypoints: DraggableWaypoint[] = [
    { id: `wp-1`, latlng: LatLng.from({ lat: 43.856, lng: 18.413 }) },
  ];
  const onRemove = vi.fn();
  const { getByText } = renderMap({ draggableWaypoints, onRemove });
  fireEvent.click(getByText(`Remove waypoint`));
  expect(onRemove).toHaveBeenCalledWith(`wp-1`);
});
