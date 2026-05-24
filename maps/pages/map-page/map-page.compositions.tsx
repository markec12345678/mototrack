import * as React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { demoUser } from '@markec/mototrack-platform.hooks.use-auth';
import { LatLng } from '@markec/maps.entities.lat-lng';
import { MapPage } from './map-page.js';

// ─── Sarajevo center ──────────────────────────────────────────────────────────

const SARAJEVO = LatLng.from({ lat: 43.8563, lng: 18.4131 });

// ─── Stelvio Pass (3D showcase) ───────────────────────────────────────────────

const STELVIO = LatLng.from({ lat: 46.5253, lng: 10.4536 });

// ─── Compositions ─────────────────────────────────────────────────────────────

/**
 * Default — full-screen MotoMap centered on Sarajevo.
 * Authenticated rider. Floating 3D toggle and offline cache indicator visible.
 */
export const DefaultMapPage = () => {
  return (
    <MockProvider>
      <MapPage
        center={SARAJEVO}
        zoom={13}
        redirectTo="/login"
        mockUser={demoUser}
      />
    </MockProvider>
  );
};

/**
 * AlpineRoute — map centered on Stelvio Pass, ideal for 3D terrain toggle demo.
 * Click the cube button in the top-right to switch to 3D terrain view.
 */
export const AlpineRoute = () => {
  return (
    <MockProvider>
      <MapPage
        center={STELVIO}
        zoom={12}
        redirectTo="/login"
        mockUser={demoUser}
      />
    </MockProvider>
  );
};

/**
 * UnauthenticatedRedirect — no mockUser provided so ProtectedRoute
 * shows the loading/redirect overlay (auth resolves to unauthenticated).
 */
export const UnauthenticatedRedirect = () => {
  return (
    <MockProvider>
      <MapPage
        center={SARAJEVO}
        zoom={13}
        redirectTo="/login"
      />
    </MockProvider>
  );
};
