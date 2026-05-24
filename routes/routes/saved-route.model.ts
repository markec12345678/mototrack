import { prop } from '@typegoose/typegoose';
import { LatLngSubModel, WaypointSubModel } from './route-sub-models.js';

export class SavedRouteModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: false, type: String })
  public userId?: string;

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
}
