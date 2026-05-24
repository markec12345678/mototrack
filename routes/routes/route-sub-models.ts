import { prop } from '@typegoose/typegoose';

export class LatLngSubModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}

export class WaypointSubModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ required: false, type: String })
  public name?: string;

  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}
