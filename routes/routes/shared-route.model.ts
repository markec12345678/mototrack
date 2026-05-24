import { prop, index } from '@typegoose/typegoose';
import { LatLngSubModel, WaypointSubModel } from './route-sub-models.js';

@index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
export class SharedRouteModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ unique: true, required: true, type: String })
  public code!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: () => [WaypointSubModel], _id: false })
  public waypoints!: WaypointSubModel[];

  @prop({ required: true, type: String, default: 'paved' })
  public mode!: string;

  @prop({ required: true, type: () => [LatLngSubModel], _id: false })
  public geometry!: LatLngSubModel[];

  @prop({ required: true, type: Number, default: 0 })
  public distanceKm!: number;

  @prop({ required: true, type: Number, default: 0 })
  public durationSec!: number;

  @prop({ required: false, type: String })
  public notes?: string;

  @prop({ required: true, type: Number })
  public createdAt!: number;

  @prop({ required: true, type: Date })
  public expiresAt!: Date;
}
