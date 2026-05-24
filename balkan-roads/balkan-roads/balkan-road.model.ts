import { prop } from '@typegoose/typegoose';

export class BalkanRoadModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public country!: string;

  @prop({ required: true, type: String })
  public flag!: string;

  @prop({ required: true, type: Number })
  public lengthKm!: number;

  @prop({ required: true, type: Number })
  public rating!: number;

  @prop({ required: true, type: String })
  public difficulty!: string;

  @prop({ required: true, type: String })
  public type!: string;

  @prop({ required: true, type: String })
  public description!: string;
}
