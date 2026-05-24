import { prop, index } from '@typegoose/typegoose';

@index({ userId: 1 })
@index({ userId: 1, primary: 1 })
export class BikeModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public userId: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: String })
  public model: string;

  @prop({ required: true, type: Number })
  public year: number;

  @prop({ required: true, type: Number, default: 0 })
  public mileageKm: number;

  @prop({ required: true, type: Number })
  public tankL: number;

  @prop({ required: true, type: Number })
  public consumptionLPer100: number;

  @prop({ required: true, type: Number, default: 0 })
  public currentFuelL: number;

  @prop({ required: true, type: String, default: '#f97316' })
  public color: string;

  @prop({ required: true, type: Boolean, default: false })
  public primary: boolean;
}
