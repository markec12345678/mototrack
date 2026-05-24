import type { SafetyAlert } from './safety-alert-type.js';

export const mockSafetyAlerts: SafetyAlert[] = [
  {
    key: `speed-warning`,
    order: 1,
    component: function SpeedWarning() {
      return null;
    },
  },
  {
    key: `weather-alert`,
    order: 2,
    component: function WeatherAlert() {
      return null;
    },
  },
];
