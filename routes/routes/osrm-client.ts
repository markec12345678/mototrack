export type OsrmLatLng = {
  lat: number;
  lng: number;
};

export type OsrmTurnStep = {
  instruction: string;
  distanceM: number;
  durationSec: number;
  location: OsrmLatLng;
  modifier?: string;
};

export type OsrmRoute = {
  geometry: OsrmLatLng[];
  distanceKm: number;
  durationSec: number;
  steps: OsrmTurnStep[];
};

const DEFAULT_OSRM = 'https://router.project-osrm.org';

const MANEUVER_TRANSLATIONS: Record<string, string> = {
  depart: 'Začni vožnjo',
  arrive: 'Prispel si na cilj',
  turn: 'Zavij',
  'new name': 'Nadaljuj',
  continue: 'Nadaljuj',
  merge: 'Vključi se',
  'on ramp': 'Zapelji na uvoz',
  'off ramp': 'Zapelji z izvoza',
  fork: 'Na razcepu',
  'end of road': 'Na koncu ceste',
  roundabout: 'Zapelji v krožišče',
  rotary: 'Zapelji v krožišče',
  'roundabout turn': 'V krožišču zavij',
  notification: 'Obvestilo',
};

const MODIFIER_TRANSLATIONS: Record<string, string> = {
  left: 'levo',
  right: 'desno',
  'sharp left': 'ostro levo',
  'sharp right': 'ostro desno',
  'slight left': 'rahlo levo',
  'slight right': 'rahlo desno',
  straight: 'naravnost',
  uturn: 'obrat za 180°',
};

function translateManeuver(type: string, modifier?: string, roadName?: string): string {
  const base = MANEUVER_TRANSLATIONS[type] ?? 'Nadaljuj';
  const modText = modifier ? MODIFIER_TRANSLATIONS[modifier] : undefined;
  const onRoad = roadName ? ` na ${roadName}` : '';
  if (modText) {
    return `${base} ${modText}${onRoad}`;
  }
  return `${base}${onRoad}`;
}

type OsrmManeuver = {
  type: string;
  modifier?: string;
  location: [number, number];
};

type OsrmStep = {
  distance: number;
  duration: number;
  name?: string;
  maneuver: OsrmManeuver;
};

type OsrmLeg = {
  steps: OsrmStep[];
};

type OsrmResponseRoute = {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
  legs: OsrmLeg[];
};

type OsrmResponse = {
  code: string;
  routes?: OsrmResponseRoute[];
  message?: string;
};

export type OsrmClientOptions = {
  baseUrl?: string;
  overview?: 'full' | 'simplified';
};

export class OsrmClient {
  private baseUrl: string;

  constructor(options: OsrmClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? DEFAULT_OSRM;
  }

  /**
   * call OSRM and return decoded route + Slovenian-translated turn steps.
   */
  async route(coords: OsrmLatLng[]): Promise<OsrmRoute> {
    if (coords.length < 2) {
      return this.straightLine(coords);
    }

    const coordsParam = coords.map((c) => `${c.lng},${c.lat}`).join(';');
    const url = `${this.baseUrl}/route/v1/driving/${coordsParam}?overview=full&geometries=geojson&steps=true`;

    try {
      const res = await fetch(url);
      if (!res.ok) return this.straightLine(coords);
      const body = (await res.json()) as OsrmResponse;
      if (body.code !== 'Ok' || !body.routes || body.routes.length === 0) {
        return this.straightLine(coords);
      }

      const route = body.routes[0];
      const geometry: OsrmLatLng[] = route.geometry.coordinates.map(([lng, lat]) => ({
        lat,
        lng,
      }));
      const steps: OsrmTurnStep[] = route.legs
        .flatMap((leg) => leg.steps)
        .map((step) => ({
          instruction: translateManeuver(step.maneuver.type, step.maneuver.modifier, step.name),
          distanceM: step.distance,
          durationSec: Math.round(step.duration),
          location: {
            lng: step.maneuver.location[0],
            lat: step.maneuver.location[1],
          },
          modifier: step.maneuver.modifier,
        }));

      return {
        geometry,
        distanceKm: route.distance / 1000,
        durationSec: Math.round(route.duration),
        steps,
      };
    } catch {
      return this.straightLine(coords);
    }
  }

  private straightLine(coords: OsrmLatLng[]): OsrmRoute {
    const distanceKm = this.estimateDistanceKm(coords);
    return {
      geometry: [...coords],
      distanceKm,
      durationSec: Math.round((distanceKm / 60) * 3600),
      steps: [],
    };
  }

  private estimateDistanceKm(coords: OsrmLatLng[]): number {
    let total = 0;
    for (let i = 1; i < coords.length; i += 1) {
      total += haversineKm(coords[i - 1], coords[i]);
    }
    return total;
  }
}

export function haversineKm(a: OsrmLatLng, b: OsrmLatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const hav = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.sqrt(hav));
}
