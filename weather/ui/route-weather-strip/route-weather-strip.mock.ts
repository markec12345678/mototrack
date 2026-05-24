export type MockRouteWeather = {
  location: { lat: number; lng: number };
  etaMin: number;
  snapshot: {
    tempC: number;
    feelsLikeC: number;
    windKmh: number;
    windDirDeg: number;
    gustKmh: number | null;
    humidity: number;
    visibilityKm: number;
    precipMmH: number;
    wmoCode: number;
    label: string;
    icon: string;
    ts: number;
  };
};

export type RoutePoint = {
  lat: number;
  lng: number;
};

export const mockRoute: RoutePoint[] = [
  { lat: 46.0569, lng: 14.5058 },
  { lat: 46.2396, lng: 14.3561 },
  { lat: 46.3625, lng: 14.0948 },
  { lat: 46.4983, lng: 13.8369 },
  { lat: 46.6226, lng: 13.835 },
];

export const mockRouteWeather: MockRouteWeather[] = [
  {
    location: { lat: 46.0569, lng: 14.5058 },
    etaMin: 0,
    snapshot: {
      tempC: 22,
      feelsLikeC: 21,
      windKmh: 12,
      windDirDeg: 270,
      gustKmh: 18,
      humidity: 55,
      visibilityKm: 20,
      precipMmH: 0,
      wmoCode: 0,
      label: `Clear`,
      icon: `☀️`,
      ts: 1700000000,
    },
  },
  {
    location: { lat: 46.2396, lng: 14.3561 },
    etaMin: 28,
    snapshot: {
      tempC: 20,
      feelsLikeC: 19,
      windKmh: 18,
      windDirDeg: 290,
      gustKmh: 24,
      humidity: 62,
      visibilityKm: 18,
      precipMmH: 0,
      wmoCode: 2,
      label: `Partly cloudy`,
      icon: `⛅`,
      ts: 1700001680,
    },
  },
  {
    location: { lat: 46.3625, lng: 14.0948 },
    etaMin: 57,
    snapshot: {
      tempC: 17,
      feelsLikeC: 15,
      windKmh: 28,
      windDirDeg: 310,
      gustKmh: 38,
      humidity: 74,
      visibilityKm: 12,
      precipMmH: 1.2,
      wmoCode: 61,
      label: `Light rain`,
      icon: `🌧️`,
      ts: 1700003420,
    },
  },
  {
    location: { lat: 46.4983, lng: 13.8369 },
    etaMin: 89,
    snapshot: {
      tempC: 14,
      feelsLikeC: 11,
      windKmh: 35,
      windDirDeg: 320,
      gustKmh: 52,
      humidity: 85,
      visibilityKm: 6,
      precipMmH: 3.8,
      wmoCode: 95,
      label: `Thunderstorm`,
      icon: `⛈️`,
      ts: 1700005340,
    },
  },
  {
    location: { lat: 46.6226, lng: 13.835 },
    etaMin: 124,
    snapshot: {
      tempC: 19,
      feelsLikeC: 18,
      windKmh: 14,
      windDirDeg: 260,
      gustKmh: 20,
      humidity: 60,
      visibilityKm: 22,
      precipMmH: 0,
      wmoCode: 1,
      label: `Mainly clear`,
      icon: `🌤️`,
      ts: 1700007440,
    },
  },
];
