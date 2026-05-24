import { prop } from '@typegoose/typegoose';

export class BorderCrossingModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: String })
  public countryFrom: string;

  @prop({ required: true, type: String })
  public countryTo: string;

  @prop({ required: true, type: () => [String], default: [] })
  public documents: string[];

  @prop({ required: true, type: Boolean, default: false })
  public vignetteRequired: boolean;

  @prop({ required: true, type: Number, default: 0 })
  public avgWaitMin: number;

  @prop({ required: true, type: String, default: '' })
  public tips: string;
}
