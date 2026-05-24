import { prop } from '@typegoose/typegoose';

/**
 * Represents a single point in a ride's track, used as a sub-document in RideModel.
 */
export class TrackPointModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;

  @prop({ required: true, type: Number })
  public ts!: number; // Timestamp in milliseconds

  @prop({ type: Number })
  public speed?: number; // Speed at this point, in km/h

  @prop({ type: Number })
  public elevation?: number; // Elevation at this point, in meters

  @prop({ type: Number })
  public accuracy?: number; // GPS accuracy, in meters

  @prop({ type: Number })
  public heading?: number; // Heading at this point, in degrees
}