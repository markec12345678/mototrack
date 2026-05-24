import { prop, index } from '@typegoose/typegoose';

export class MaintenanceHistoryEntry {
  @prop({ required: true, type: Number })
  public atKm: number;

  @prop({ required: true, type: Number })
  public atDate: number;

  @prop({ type: String })
  public note?: string;
}

@index({ bikeId: 1 })
export class MaintenanceItemModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public bikeId: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: Number })
  public intervalKm: number;

  @prop({ required: true, type: Number })
  public intervalDays: number;

  @prop({ required: true, type: Number, default: 0 })
  public lastServiceKm: number;

  @prop({ required: true, type: Number, default: () => Date.now() })
  public lastServiceAt: number;

  @prop({ type: () => [MaintenanceHistoryEntry], default: [] })
  public history: MaintenanceHistoryEntry[];
}
