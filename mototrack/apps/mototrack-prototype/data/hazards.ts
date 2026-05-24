import type { Hazard, SpeedCamera } from '../app-types.js';

/** Sample road hazards across the Balkans for demo purposes. */
export const HAZARDS: Hazard[] = [
  { id: 'h1', type: 'landslide', lat: 46.4365, lng: 13.7395, reportedAt: Date.now() - 1000 * 60 * 30 },
  { id: 'h2', type: 'construction', lat: 45.7983, lng: 24.1255, reportedAt: Date.now() - 1000 * 60 * 60 * 2 },
  { id: 'h3', type: 'pothole', lat: 42.4247, lng: 18.7712, reportedAt: Date.now() - 1000 * 60 * 15 },
  { id: 'h4', type: 'animal', lat: 43.8556, lng: 19.8425, reportedAt: Date.now() - 1000 * 60 * 45 },
  { id: 'h5', type: 'ice', lat: 41.6406, lng: 24.6814, reportedAt: Date.now() - 1000 * 60 * 90 },
  { id: 'h6', type: 'flood', lat: 40.1432, lng: 19.6480, reportedAt: Date.now() - 1000 * 60 * 20 },
  { id: 'h7', type: 'oil', lat: 43.3438, lng: 17.8078, reportedAt: Date.now() - 1000 * 60 * 10 },
];

/** Known speed camera locations across the Balkans. */
export const SPEED_CAMERAS: SpeedCamera[] = [
  { id: 'sc1', lat: 46.0569, lng: 14.5058, speedLimit: 50, type: 'fixed', country: 'Slovenija' },
  { id: 'sc2', lat: 45.8150, lng: 15.9819, speedLimit: 90, type: 'average', country: 'Hrvaška' },
  { id: 'sc3', lat: 44.7866, lng: 20.4489, speedLimit: 60, type: 'fixed', country: 'Srbija' },
  { id: 'sc4', lat: 42.6629, lng: 21.1655, speedLimit: 50, type: 'redlight', country: 'Kosovo' },
  { id: 'sc5', lat: 42.4304, lng: 19.2594, speedLimit: 80, type: 'mobile', country: 'Črna Gora' },
  { id: 'sc6', lat: 41.9981, lng: 21.4254, speedLimit: 50, type: 'fixed', country: 'Severna Makedonija' },
  { id: 'sc7', lat: 41.3275, lng: 19.8187, speedLimit: 60, type: 'mobile', country: 'Albanija' },
  { id: 'sc8', lat: 42.6977, lng: 23.3219, speedLimit: 50, type: 'redlight', country: 'Bolgarija' },
  { id: 'sc9', lat: 44.4268, lng: 26.1025, speedLimit: 50, type: 'fixed', country: 'Romunija' },
  { id: 'sc10', lat: 37.9838, lng: 23.7275, speedLimit: 50, type: 'average', country: 'Grčija' },
];

/** Map of hazard type to display info. */
export const HAZARD_INFO: Record<Hazard['type'], { icon: string; label: string; color: string }> = {
  camera: { icon: '📷', label: 'Hitrostna kamera', color: '#eab308' },
  landslide: { icon: '⛰️', label: 'Plaz', color: '#ef4444' },
  construction: { icon: '🚧', label: 'Gradbišče', color: '#f97316' },
  ice: { icon: '🧊', label: 'Poledica', color: '#3b82f6' },
  flood: { icon: '🌊', label: 'Poplavljena cesta', color: '#06b6d4' },
  animal: { icon: '🦌', label: 'Živali na cesti', color: '#a855f7' },
  oil: { icon: '🛢️', label: 'Razlito olje', color: '#64748b' },
  pothole: { icon: '🕳️', label: 'Luknja', color: '#94a3b8' },
};
