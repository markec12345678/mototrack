import { prop } from '@typegoose/typegoose';

export class TourWaypointModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;

  @prop({ required: false, type: String })
  public name?: string;
}

export class IconicTourModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public country!: string;

  @prop({ required: true, type: String })
  public flag!: string;

  @prop({ required: true, type: Number })
  public distanceKm!: number;

  @prop({ required: true, type: Number })
  public rating!: number;

  @prop({ required: true, type: String })
  public difficulty!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({ required: true, type: () => [TourWaypointModel], _id: false })
  public waypoints!: TourWaypointModel[];
}
