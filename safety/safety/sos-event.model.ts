import { prop } from '@typegoose/typegoose';

export class SosEventModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String, index: true })
  public userId: string;

  @prop({ required: true, type: Number })
  public lat: number;

  @prop({ required: true, type: Number })
  public lng: number;

  @prop({ required: true, type: Number })
  public triggeredAt: number;

  @prop({ required: true, type: () => [String], default: [] })
  public dispatchedTo: string[];
}
