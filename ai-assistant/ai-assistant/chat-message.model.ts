import { prop } from '@typegoose/typegoose';

export class ChatMessageModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String, index: true })
  public sessionId: string;

  @prop({ required: true, type: String })
  public role: string;

  @prop({ required: true, type: String })
  public content: string;

  @prop({ required: true, type: Date, default: () => new Date() })
  public createdAt: Date;
}
