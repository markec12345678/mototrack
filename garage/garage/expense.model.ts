import { prop, index } from '@typegoose/typegoose';

@index({ userId: 1, at: -1 })
@index({ bikeId: 1, at: -1 })
export class ExpenseModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public userId: string;

  @prop({ type: String })
  public bikeId?: string;

  @prop({ required: true, type: String })
  public category: string;

  @prop({ required: true, type: Number })
  public amountEur: number;

  @prop({ required: true, type: String })
  public label: string;

  @prop({ required: true, type: Number, default: () => Date.now() })
  public at: number;

  @prop({ type: String })
  public notes?: string;
}
