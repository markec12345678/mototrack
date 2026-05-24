import { prop, getModelForClass, modelOptions, index } from '@typegoose/typegoose';

/**
 * Typegoose model class for the Hazard entity.
 * Used for MongoDB persistence on the backend only.
 */
@modelOptions({ schemaOptions: { collection: 'hazards', timestamps: false } })
@index({ lat: 1, lng: 1 })
export class HazardModel {
  @prop({ required: true })
  type!: string;

  @prop({ required: true })
  lat!: number;

  @prop({ required: true })
  lng!: number;

  @prop({ required: true, default: () => Date.now() })
  reportedAt!: number;

  @prop()
  reportedBy?: string;

  @prop({ required: true, default: 0 })
  confirmedCount!: number;
}

/**
 * Mongoose model generated from HazardModel via Typegoose.
 */
export const HazardMongooseModel = getModelForClass(HazardModel);
