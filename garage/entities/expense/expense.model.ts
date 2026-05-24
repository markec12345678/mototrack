import { prop, getModelForClass, modelOptions, index } from '@typegoose/typegoose';

/**
 * Typegoose model class for the Expense entity.
 * Import this only in server-side / Node.js code.
 */
@modelOptions({ schemaOptions: { collection: 'expenses', timestamps: true } })
@index({ userId: 1 })
@index({ bikeId: 1 })
export class ExpenseModel {
  @prop({ required: true, type: String })
  userId!: string;

  @prop({ type: String })
  bikeId?: string;

  @prop({ required: true, type: String })
  category!: string;

  @prop({ required: true, type: Number })
  amountEur!: number;

  @prop({ required: true, type: String })
  label!: string;

  @prop({ required: true, type: Number })
  at!: number;

  @prop({ type: String })
  notes?: string;
}

let _expenseMongoModel: ReturnType<typeof getModelForClass<typeof ExpenseModel>> | undefined;

/**
 * Returns the Expense Mongoose model, lazily initialized.
 * Call this only inside Node.js server code (never in browser bundles).
 */
export function getExpenseModel() {
  if (!_expenseMongoModel) {
    _expenseMongoModel = getModelForClass(ExpenseModel);
  }
  return _expenseMongoModel;
}
