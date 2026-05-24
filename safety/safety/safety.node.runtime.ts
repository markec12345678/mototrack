import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { HazardModel } from './hazard.model.js';
import { SpeedCameraModel } from './speed-camera.model.js';
import { IceContactModel } from './ice-contact.model.js';
import { BorderCrossingModel } from './border-crossing.model.js';
import { SosEventModel } from './sos-event.model.js';
import { HazardRepository, type ListHazardsOptions, type ReportHazardOptions } from './hazard-repository.js';
import { SpeedCameraRepository, type ListSpeedCamerasOptions } from './speed-camera-repository.js';
import { IceContactRepository, type SaveIceContactOptions } from './ice-contact-repository.js';
import { BorderCrossingRepository } from './border-crossing-repository.js';
import { SosEventRepository } from './sos-event-repository.js';
import { createSafetyGqlSchema } from './safety.graphql.js';
import {
  hazardSeeds,
  speedCameraSeeds,
  borderCrossingSeeds,
} from './safety.seeds.js';
import type { SafetyConfig } from './safety-config.js';

export type TriggerSosOptions = {
  lat: number;
  lng: number;
};

export type TriggerSosResult = {
  id: string;
  dispatchedTo: string[];
};

export class SafetyNode {
  constructor(
    private hazardRepository: HazardRepository,
    private speedCameraRepository: SpeedCameraRepository,
    private iceContactRepository: IceContactRepository,
    private borderCrossingRepository: BorderCrossingRepository,
    private sosEventRepository: SosEventRepository
  ) {}

  /**
   * list hazards near a location within a radius (km).
   */
  async listHazards(options: ListHazardsOptions) {
    return this.hazardRepository.listNear(options);
  }

  /**
   * persist a new hazard report at a given location.
   */
  async reportHazard(options: ReportHazardOptions) {
    return this.hazardRepository.report(options);
  }

  /**
   * increment the confirmed count for an existing hazard.
   */
  async confirmHazard(id: string) {
    return this.hazardRepository.confirm(id);
  }

  /**
   * list speed cameras near a location within a radius (km).
   */
  async listSpeedCameras(options: ListSpeedCamerasOptions) {
    return this.speedCameraRepository.listNear(options);
  }

  /**
   * list every known speed camera.
   */
  async listAllSpeedCameras() {
    return this.speedCameraRepository.listAll();
  }

  /**
   * list a user's saved ICE contacts.
   */
  async listIceContacts(userId: string) {
    return this.iceContactRepository.listByUser(userId);
  }

  /**
   * upsert an ICE contact for the current user.
   */
  async saveIceContact(options: SaveIceContactOptions) {
    return this.iceContactRepository.save(options);
  }

  /**
   * delete an ICE contact.
   */
  async deleteIceContact(id: string) {
    return this.iceContactRepository.delete(id);
  }

  /**
   * list seeded border crossings for the Balkan region.
   */
  async listBorderCrossings() {
    return this.borderCrossingRepository.listAll();
  }

  /**
   * persist an SOS event and return the list of dispatched contacts (the
   * user's ICE contacts).
   */
  async triggerSos(userId: string, options: TriggerSosOptions): Promise<TriggerSosResult> {
    const contacts = await this.iceContactRepository.listByUser(userId);
    const dispatchedTo = contacts.map((contact) => contact.phone);
    const created = await this.sosEventRepository.create({
      userId,
      lat: options.lat,
      lng: options.lng,
      dispatchedTo,
    });
    return { id: created.id, dispatchedTo };
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: SafetyConfig = {
    defaultRadiusKm: 50,
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    _config: SafetyConfig
  ) {
    const hazardModel = getModelForClass(HazardModel);
    const speedCameraModel = getModelForClass(SpeedCameraModel);
    const iceContactModel = getModelForClass(IceContactModel);
    const borderCrossingModel = getModelForClass(BorderCrossingModel);
    const sosEventModel = getModelForClass(SosEventModel);

    const hazardRepository = new HazardRepository(hazardModel);
    const speedCameraRepository = new SpeedCameraRepository(speedCameraModel);
    const iceContactRepository = new IceContactRepository(iceContactModel);
    const borderCrossingRepository = new BorderCrossingRepository(borderCrossingModel);
    const sosEventRepository = new SosEventRepository(sosEventModel);

    const safety = new SafetyNode(
      hazardRepository,
      speedCameraRepository,
      iceContactRepository,
      borderCrossingRepository,
      sosEventRepository
    );

    const gqlSchema = createSafetyGqlSchema(safety);

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    symphonyPlatform.registerOnStart(async () => {
      const [hazardCount, cameraCount, crossingCount] = await Promise.all([
        hazardRepository.countAll(),
        speedCameraRepository.countAll(),
        borderCrossingRepository.countAll(),
      ]);

      if (hazardCount === 0) {
        await hazardRepository.seedMany(hazardSeeds);
      }
      if (cameraCount === 0) {
        await speedCameraRepository.seedMany(speedCameraSeeds);
      }
      if (crossingCount === 0) {
        await borderCrossingRepository.seedMany(borderCrossingSeeds);
      }
    });

    return safety;
  }
}

export default SafetyNode;
