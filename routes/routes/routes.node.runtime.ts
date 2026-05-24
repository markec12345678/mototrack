import { getModelForClass } from '@typegoose/typegoose';
import { SymphonyPlatformAspect } from '@bitdev/symphony.symphony-platform';
import type { SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import {
  MototrackPlatformAspect,
  type MototrackPlatformNode,
} from '@markec/mototrack-platform.mototrack-platform';
import { SavedRouteModel } from './saved-route.model.js';
import { SharedRouteModel } from './shared-route.model.js';
import { RoutesRepository } from './routes-repository.js';
import { OsrmClient, type OsrmLatLng } from './osrm-client.js';
import { generateRoundTrip, generateTwistyRoute } from './route-generators.js';
import { createRoutesGqlSchema } from './routes.graphql.js';
import type { RoutesConfig } from './routes-config.js';

const DEMO_USER_ID = 'demo-markec';
const DEFAULT_TTL_SEC = 24 * 60 * 60;

export type ComputeRouteOptions = {
  waypoints: OsrmLatLng[];
  mode: string;
};

export type GenerateTwistyOptions = {
  start: OsrmLatLng;
  end: OsrmLatLng;
  twistiness: number;
};

export type GenerateRoundTripOptions = {
  start: OsrmLatLng;
  distanceKm: number;
  twistiness: number;
  direction?: string;
};

export type SaveRouteOptions = {
  userId?: string;
  name: string;
  waypoints: { id: string; name?: string; lat: number; lng: number }[];
  mode: string;
  geometry: OsrmLatLng[];
  distanceKm: number;
  durationSec: number;
  notes?: string;
};

export class RoutesNode {
  constructor(
    private config: RoutesConfig,
    private repository: RoutesRepository,
    private osrm: OsrmClient
  ) {}

  /**
   * compute a route through the supplied waypoints using OSRM.
   */
  async computeRoute(options: ComputeRouteOptions) {
    return this.osrm.route(options.waypoints);
  }

  /**
   * generate a twisty route between two points using detour sampling.
   */
  async generateTwistyRoute(options: GenerateTwistyOptions) {
    return generateTwistyRoute(this.osrm, options);
  }

  /**
   * generate a circular round-trip starting and ending at the given point.
   */
  async generateRoundTrip(options: GenerateRoundTripOptions) {
    const direction = options.direction === 'counterclockwise' ? 'counterclockwise' : 'clockwise';
    return generateRoundTrip(this.osrm, {
      start: options.start,
      distanceKm: options.distanceKm,
      twistiness: options.twistiness,
      direction,
    });
  }

  /**
   * list saved routes for the given user.
   */
  async listSavedRoutes(userId?: string) {
    const docs = await this.repository.listByUser(userId ?? DEMO_USER_ID);
    return docs.map(serializeSavedRoute);
  }

  /**
   * save a route into the library.
   */
  async saveRoute(options: SaveRouteOptions) {
    const doc = await this.repository.createSavedRoute({
      userId: options.userId ?? DEMO_USER_ID,
      name: options.name,
      waypoints: options.waypoints,
      mode: options.mode,
      geometry: options.geometry,
      distanceKm: options.distanceKm,
      durationSec: options.durationSec,
      notes: options.notes,
    });
    return serializeSavedRoute(doc);
  }

  /**
   * persist a SharedRoute with a TTL index and return its share code.
   */
  async shareRoute(options: SaveRouteOptions) {
    const ttl = this.config.sharedRouteTtlSec ?? DEFAULT_TTL_SEC;
    const doc = await this.repository.createSharedRoute({
      ttlSeconds: ttl,
      userId: options.userId,
      name: options.name,
      waypoints: options.waypoints,
      mode: options.mode,
      geometry: options.geometry,
      distanceKm: options.distanceKm,
      durationSec: options.durationSec,
      notes: options.notes,
    });
    const expiresAtSec = Math.floor(doc.expiresAt.getTime() / 1000);
    return {
      code: doc.code,
      qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        `mototrack://share/${doc.code}`
      )}`,
      expiresAt: expiresAtSec,
    };
  }

  /**
   * look up a shared route by its 6-digit code.
   */
  async loadSharedRoute(code: string) {
    const doc = await this.repository.findSharedRouteByCode(code);
    if (!doc) return null;
    return {
      id: doc.id,
      name: doc.name,
      waypoints: doc.waypoints,
      mode: doc.mode,
      geometry: doc.geometry,
      distanceKm: doc.distanceKm,
      durationSec: doc.durationSec,
      notes: doc.notes,
      createdAt: doc.createdAt,
    };
  }

  static dependencies = [SymphonyPlatformAspect, MototrackPlatformAspect];

  static defaultConfig: RoutesConfig = {};

  static async provider(
    [symphonyPlatform, mototrackPlatform]: [SymphonyPlatformNode, MototrackPlatformNode],
    config: RoutesConfig
  ) {
    const savedRouteModel = getModelForClass(SavedRouteModel);
    const sharedRouteModel = getModelForClass(SharedRouteModel);
    const repository = new RoutesRepository(savedRouteModel, sharedRouteModel);
    const osrm = new OsrmClient({ baseUrl: config.osrmBaseUrl });
    const routes = new RoutesNode(config, repository, osrm);

    const gqlSchema = createRoutesGqlSchema(routes);
    symphonyPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    symphonyPlatform.registerOnStart(async () => {
      const existing = await repository.countSavedRoutes();
      if (existing > 0) return;
      await repository.seedSavedRoutes(seedRoutes());
    });

    return routes;
  }
}

function serializeSavedRoute(doc: SavedRouteModel) {
  return {
    id: doc.id,
    userId: doc.userId,
    name: doc.name,
    waypoints: doc.waypoints.map((wp) => ({
      id: wp.id,
      name: wp.name,
      lat: wp.lat,
      lng: wp.lng,
    })),
    mode: doc.mode,
    geometry: doc.geometry.map((p) => ({ lat: p.lat, lng: p.lng })),
    distanceKm: doc.distanceKm,
    durationSec: doc.durationSec,
    notes: doc.notes,
    createdAt: doc.createdAt,
  };
}

function seedRoutes() {
  return [
    {
      userId: DEMO_USER_ID,
      name: 'Ljubljana → Bled klasika',
      mode: 'paved',
      waypoints: [
        { id: 'lj', name: 'Ljubljana', lat: 46.0569, lng: 14.5058 },
        { id: 'kr', name: 'Kranj', lat: 46.2389, lng: 14.3556 },
        { id: 'bl', name: 'Bled', lat: 46.3683, lng: 14.1146 },
      ],
      geometry: [
        { lat: 46.0569, lng: 14.5058 },
        { lat: 46.15, lng: 14.43 },
        { lat: 46.2389, lng: 14.3556 },
        { lat: 46.3, lng: 14.24 },
        { lat: 46.3683, lng: 14.1146 },
      ],
      distanceKm: 55,
      durationSec: 3600,
      notes: 'Lahka popoldanska vožnja preko Gorenjske.',
    },
    {
      userId: DEMO_USER_ID,
      name: 'Soška dolina serpentine',
      mode: 'twisty',
      waypoints: [
        { id: 'kr', name: 'Kranjska Gora', lat: 46.4845, lng: 13.7867 },
        { id: 'vp', name: 'Vršič', lat: 46.4339, lng: 13.7464 },
        { id: 'bv', name: 'Bovec', lat: 46.3387, lng: 13.5524 },
        { id: 'kb', name: 'Kobarid', lat: 46.2479, lng: 13.5786 },
      ],
      geometry: [
        { lat: 46.4845, lng: 13.7867 },
        { lat: 46.46, lng: 13.77 },
        { lat: 46.4339, lng: 13.7464 },
        { lat: 46.39, lng: 13.65 },
        { lat: 46.3387, lng: 13.5524 },
        { lat: 46.29, lng: 13.57 },
        { lat: 46.2479, lng: 13.5786 },
      ],
      distanceKm: 78,
      durationSec: 7200,
      notes: 'Legendarni Vršič — 50 ovinkov, ki bodo nasmejali vsakega voznika.',
    },
    {
      userId: DEMO_USER_ID,
      name: 'Pohorje terenska zanka',
      mode: 'offroad',
      waypoints: [
        { id: 'mb', name: 'Maribor', lat: 46.5547, lng: 15.6459 },
        { id: 'po', name: 'Pohorje', lat: 46.5167, lng: 15.55 },
        { id: 'ru', name: 'Ruše', lat: 46.5394, lng: 15.5142 },
      ],
      geometry: [
        { lat: 46.5547, lng: 15.6459 },
        { lat: 46.535, lng: 15.6 },
        { lat: 46.5167, lng: 15.55 },
        { lat: 46.528, lng: 15.53 },
        { lat: 46.5394, lng: 15.5142 },
      ],
      distanceKm: 42,
      durationSec: 5400,
      notes: 'Makadam in gozdne ceste — primerno za enduro.',
    },
    {
      userId: DEMO_USER_ID,
      name: 'Kras & Istra obvoz',
      mode: 'twisty',
      waypoints: [
        { id: 'po', name: 'Postojna', lat: 45.7747, lng: 14.2147 },
        { id: 'di', name: 'Divača', lat: 45.6839, lng: 13.9706 },
        { id: 'hr', name: 'Hrastovlje', lat: 45.5306, lng: 13.9061 },
        { id: 'ko', name: 'Koper', lat: 45.5481, lng: 13.7301 },
      ],
      geometry: [
        { lat: 45.7747, lng: 14.2147 },
        { lat: 45.72, lng: 14.08 },
        { lat: 45.6839, lng: 13.9706 },
        { lat: 45.6, lng: 13.93 },
        { lat: 45.5306, lng: 13.9061 },
        { lat: 45.54, lng: 13.82 },
        { lat: 45.5481, lng: 13.7301 },
      ],
      distanceKm: 96,
      durationSec: 6300,
      notes: 'Mešanica kraške planote in istrskih vasi.',
    },
    {
      userId: DEMO_USER_ID,
      name: 'Logarska dolina krožna',
      mode: 'paved',
      waypoints: [
        { id: 'ce', name: 'Celje', lat: 46.231, lng: 15.2614 },
        { id: 'ms', name: 'Mozirje', lat: 46.3389, lng: 14.9636 },
        { id: 'lo', name: 'Logarska dolina', lat: 46.3956, lng: 14.6422 },
        { id: 'ce2', name: 'Celje', lat: 46.231, lng: 15.2614 },
      ],
      geometry: [
        { lat: 46.231, lng: 15.2614 },
        { lat: 46.29, lng: 15.12 },
        { lat: 46.3389, lng: 14.9636 },
        { lat: 46.37, lng: 14.8 },
        { lat: 46.3956, lng: 14.6422 },
        { lat: 46.34, lng: 14.85 },
        { lat: 46.29, lng: 15.05 },
        { lat: 46.231, lng: 15.2614 },
      ],
      distanceKm: 145,
      durationSec: 10800,
      notes: 'Dnevni izlet skozi Savinjsko dolino in nazaj.',
    },
  ];
}

export default RoutesNode;
