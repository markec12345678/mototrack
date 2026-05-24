import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  MototrackPlatformAspect,
  type MototrackPlatformNode,
} from '@markec/mototrack-platform.mototrack-platform';
import type { BackendServerDefinition } from '@bitdev/symphony.backends.backend-server';
import { BalkanRoadModel } from './balkan-road.model.js';
import { IconicTourModel } from './iconic-tour.model.js';
import { BalkanRoadRepository } from './balkan-road-repository.js';
import { IconicTourRepository } from './iconic-tour-repository.js';
import { createBalkanRoadsGqlSchema } from './balkan-roads.graphql.js';
import type { BalkanRoadsConfig } from './balkan-roads-config.js';

/**
 * Server-side runtime for the Balkan Roads aspect.
 * Seeds 63 curated roads + 20 iconic tours from the static entity data.
 */
export class BalkanRoadsNode {
  constructor(
    private config: BalkanRoadsConfig,
    private roadRepository: BalkanRoadRepository,
    private tourRepository: IconicTourRepository
  ) {}

  async listRoads(options: { country?: string; difficulty?: string } = {}) {
    return this.roadRepository.listRoads(options);
  }

  async listTours(options: { country?: string; difficulty?: string } = {}) {
    return this.tourRepository.listTours(options);
  }

  async getTour(id: string) {
    return this.tourRepository.getTour(id);
  }

  static dependencies = [SymphonyPlatformAspect, MototrackPlatformAspect];

  static defaultConfig: BalkanRoadsConfig = {};

  static async provider(
    [symphonyPlatform, mototrackPlatform]: [SymphonyPlatformNode, MototrackPlatformNode],
    config: BalkanRoadsConfig
  ) {
    const mongoUrl = (config as any).mongoUrl ?? process.env.MONGO_URL ?? 'mongodb://localhost:27017/mototrack';

    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoUrl);
    }

    const roadModel = getModelForClass(BalkanRoadModel);
    const tourModel = getModelForClass(IconicTourModel);

    const roadRepository = new BalkanRoadRepository(roadModel);
    const tourRepository = new IconicTourRepository(tourModel);

    const balkanRoads = new BalkanRoadsNode(config, roadRepository, tourRepository);

    const gqlSchema = createBalkanRoadsGqlSchema(balkanRoads);

    mototrackPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ] as BackendServerDefinition[]);

    symphonyPlatform.registerOnStart(async () => {
      // Seed only if the repository exposes seed methods.
      if (typeof (roadRepository as any).seedRoads === 'function') {
        await (roadRepository as any).seedRoads();
      }
      if (typeof (tourRepository as any).seedTours === 'function') {
        await (tourRepository as any).seedTours();
      }
    });

    return balkanRoads;
  }
}

export default BalkanRoadsNode;
