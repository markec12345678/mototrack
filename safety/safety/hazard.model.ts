import { prop } from '@typegoose/typegoose';

export class HazardModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public type: string;

  @prop({ required: true, type: Number })
  public lat: number;

  @prop({ required: true, type: Number })
  public lng: number;

  @prop({ required: true, type: Number })
  public reportedAt: number;

  @prop({ type: String })
  public reportedBy?: string;

  @prop({ required: true, type: Number, default: 0 })
  public confirmedCount: number;
}
