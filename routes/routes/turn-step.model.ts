import { prop } from '@typegoose/typegoose';
import { LatLngModel } from './lat-lng.model.js';

/**
 * Represents a turn-by-turn instruction step in a computed route.
 */
export class TurnStepModel {
  @prop({ required: true, type: String })
  public instruction!: string;

  @prop({ required: true, type: Number })
  public distanceM!: number;

  @prop({ required: true, type: Number })
  public durationSec!: number;

  @prop({ required: true, _id: false })
  public location!: LatLngModel;

  @prop({ type: String })
  public modifier?: string;
}

/**
 * Mock data for TurnStepModel.
 */
export const turnStepModelMock: TurnStepModel[] = [
  {
    instruction: 'Pojdite naravnost',
    distanceM: 100,
    durationSec: 10,
    location: { lat: 46.057, lng: 14.506 },
    modifier: 'left',
  },
  {
    instruction: 'Zavijte desno',
    distanceM: 50,
    durationSec: 5,
    location: { lat: 46.0575, lng: 14.5065 },
    modifier: 'right',
  },
];