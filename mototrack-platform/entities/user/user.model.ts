import { prop, getModelForClass, modelOptions, index } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { collection: 'users', timestamps: true } })
@index({ email: 1 }, { unique: true })
@index({ username: 1 }, { unique: true })
export class UserModel {
  /**
   * Unique identifier — exposed as virtual `id` by Mongoose.
   */
  readonly id!: string;

  @prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @prop({ required: true, unique: true, trim: true })
  username!: string;

  @prop({ required: true, trim: true })
  displayName!: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   */
  @prop({ required: true, uppercase: true, trim: true })
  country!: string;

  @prop({ required: true, enum: ['sl', 'en', 'hr'], default: 'en' })
  language!: string;

  @prop({ default: null })
  primaryBikeId?: string;

  @prop({ required: true, default: 0, min: 0 })
  points!: number;

  @prop({ required: true, enum: ['rider', 'admin'], default: 'rider' })
  role!: string;

  /**
   * Automatically managed by Mongoose via `timestamps: true`.
   */
  createdAt!: Date;
}

export const UserMongooseModel = getModelForClass(UserModel);
