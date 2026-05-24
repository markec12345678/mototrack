import { prop } from '@typegoose/typegoose';

/**
 * Represents a geographical coordinate with latitude and longitude.
 */
export class LatLngModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}