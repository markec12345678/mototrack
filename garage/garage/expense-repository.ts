import type { ReturnModelType } from '@typegoose/typegoose';
import { ExpenseModel } from './expense.model.js';

export type SaveExpenseOptions = {
  id?: string;
  userId: string;
  bikeId?: string;
  category: string;
  amountEur: number;
  label: string;
  at: number;
  notes?: string;
};

export type ListExpensesFilter = {
  userId: string;
  bikeId?: string;
  from?: number;
  to?: number;
};

export class ExpenseRepository {
  constructor(private expenseModel: ReturnModelType<typeof ExpenseModel>) {}

  async list(filter: ListExpensesFilter): Promise<ExpenseModel[]> {
    const query: Record<string, unknown> = { userId: filter.userId };
    if (filter.bikeId) query.bikeId = filter.bikeId;
    if (filter.from !== undefined || filter.to !== undefined) {
      const range: Record<string, number> = {};
      if (filter.from !== undefined) range.$gte = filter.from;
      if (filter.to !== undefined) range.$lte = filter.to;
      query.at = range;
    }
    const docs = await this.expenseModel.find(query).sort({ at: -1 });
    return docs.map((doc) => doc.toObject());
  }

  async saveExpense(options: SaveExpenseOptions): Promise<ExpenseModel> {
    const { id, ...rest } = options;
    if (id) {
      const updated = await this.expenseModel.findOneAndUpdate(
        { id },
        { $set: rest },
        { new: true }
      );
      if (updated) return updated.toObject();
    }
    const newId = id ?? crypto.randomUUID();
    const created = await this.expenseModel.create({ id: newId, ...rest });
    return created.toObject();
  }

  async insertMany(expenses: Partial<ExpenseModel>[]): Promise<void> {
    await this.expenseModel.insertMany(expenses);
  }

  async countAll(): Promise<number> {
    return this.expenseModel.estimatedDocumentCount();
  }
}
