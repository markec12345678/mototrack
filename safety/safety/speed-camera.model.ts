import { prop } from '@typegoose/typegoose';

export class SpeedCameraModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: Number })
  public lat: number;

  @prop({ required: true, type: Number })
  public lng: number;

  @prop({ required: true, type: Number })
  public speedLimit: number;

  @prop({ required: true, type: String })
  public type: string;

  @prop({ required: true, type: String })
  public country: string;
}
