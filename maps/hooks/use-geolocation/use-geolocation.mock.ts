import { LatLng } from '@markec/maps.entities.lat-lng';
import { GeolocationResult, BALKAN_CENTER } from './use-geolocation.js';

/** A successful high-accuracy fix over Sarajevo city centre. */
const sarajevo: GeolocationResult = {
  position: new LatLng(43.8563, 18.4131),
  accuracy: 8,
  heading: 45,
  speed: 12.5,
  error: null,
  isHighAccuracy: true,
  loading: false,
};

/** A low-accuracy fix — GPS degraded, e.g. indoors. */
const lowAccuracy: GeolocationResult = {
  position: new LatLng(43.85, 18.38),
  accuracy: 350,
  heading: null,
  speed: null,
  error: null,
  isHighAccuracy: false,
  loading: false,
};

/** Permission denied — falls back to the Balkan centre. */
const permissionDenied: GeolocationResult = {
  position: BALKAN_CENTER,
  accuracy: null,
  heading: null,
  speed: null,
  error: 'Location access denied. Showing default map centre (Sarajevo).',
  isHighAccuracy: false,
  loading: false,
};

/** Timeout — falls back to the Balkan centre. */
const timeout: GeolocationResult = {
  position: BALKAN_CENTER,
  accuracy: null,
  heading: null,
  speed: null,
  error: 'Location request timed out. Showing default map centre.',
  isHighAccuracy: false,
  loading: false,
};

/** Insecure context (HTTP). */
const insecureContext: GeolocationResult = {
  position: BALKAN_CENTER,
  accuracy: null,
  heading: null,
  speed: null,
  error:
    'Geolocation requires a secure connection (HTTPS). Showing default map centre.',
  isHighAccuracy: false,
  loading: false,
};

/** Still waiting for the first fix. */
const loading: GeolocationResult = {
  position: BALKAN_CENTER,
  accuracy: null,
  heading: null,
  speed: null,
  error: null,
  isHighAccuracy: false,
  loading: true,
};

/** A fix on the road between Sarajevo and Mostar — useful for speed/heading tests. */
const onRoute: GeolocationResult = {
  position: new LatLng(43.6542, 18.0119),
  accuracy: 5,
  heading: 192,
  speed: 27.8,
  error: null,
  isHighAccuracy: true,
  loading: false,
};

export const geolocationMock = {
  sarajevo,
  lowAccuracy,
  permissionDenied,
  timeout,
  insecureContext,
  loading,
  onRoute,
};
