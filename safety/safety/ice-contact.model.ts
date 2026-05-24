import { prop } from '@typegoose/typegoose';

export class IceContactModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String, index: true })
  public userId: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ required: true, type: String })
  public relation: string;

  @prop({ required: true, type: String })
  public phone: string;

  @prop({ required: true, type: Boolean, default: false })
  public primary: boolean;

  @prop({ type: String })
  public bloodType?: string;

  @prop({ type: String })
  public allergies?: string;

  @prop({ type: String })
  public notes?: string;
}
