import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import {
  MototrackPlatformAspect,
  type MototrackPlatformNode,
} from '@markec/mototrack-platform.mototrack-platform';
import { Bike } from '@markec/garage.entities.bike';
import { MaintenanceItem } from '@markec/garage.entities.maintenance-item';
import { Expense } from '@markec/garage.entities.expense';
import { BikeModel } from './bike.model.js';
import { MaintenanceItemModel } from './maintenance-item.model.js';
import { ExpenseModel } from './expense.model.js';
import { BikeRepository } from './bike-repository.js';
import { MaintenanceRepository } from './maintenance-repository.js';
import { ExpenseRepository } from './expense-repository.js';
import { createGarageGqlSchema } from './garage.graphql.js';
import { createGarageSeed } from './garage.seed.js';
import type { GarageConfig } from './garage-config.js';

type BikeInput = {
  id?: string;
  name: string;
  model: string;
  year: number;
  mileageKm: number;
  tankL: number;
  consumptionLPer100: number;
  currentFuelL: number;
  color: string;
  primary?: boolean;
};

type MaintenanceHistoryItemInput = {
  atKm: number;
  atDate: number;
  note?: string;
};

type MaintenanceInput = {
  id?: string;
  bikeId: string;
  name: string;
  intervalKm: number;
  intervalDays: number;
  lastServiceKm: number;
  lastServiceAt: number;
  history?: MaintenanceHistoryItemInput[];
};

type ExpenseInput = {
  id?: string;
  bikeId?: string;
  category: string;
  amountEur: number;
  label: string;
  at: number;
  notes?: string;
};

type ListExpensesOptions = {
  bikeId?: string;
  from?: number;
  to?: number;
};

const DEMO_USER_EMAIL = 'markec@mototrack.app';

export class GarageNode {
  constructor(
    private bikeRepository: BikeRepository,
    private maintenanceRepository: MaintenanceRepository,
    private expenseRepository: ExpenseRepository
  ) {}

  /**
   * list all bikes for the given user.
   */
  async listBikes(userId: string): Promise<Bike[]> {
    const bikes = await this.bikeRepository.listByUser(userId);
    return bikes.map((b) => Bike.from(b));
  }

  /**
   * create or update a bike for the given user.
   */
  async saveBike(userId: string, input: BikeInput): Promise<Bike> {
    const saved = await this.bikeRepository.saveBike({ ...input, userId });
    return Bike.from(saved);
  }

  /**
   * delete a bike owned by the given user.
   */
  async deleteBike(userId: string, id: string): Promise<boolean> {
    return this.bikeRepository.deleteBike(id, userId);
  }

  /**
   * list maintenance items for the given bike.
   */
  async listMaintenance(bikeId: string): Promise<MaintenanceItem[]> {
    const items = await this.maintenanceRepository.listByBike(bikeId);
    return items.map((item) => MaintenanceItem.from(item));
  }

  /**
   * create or update a maintenance item.
   */
  async saveMaintenance(input: MaintenanceInput): Promise<MaintenanceItem> {
    const saved = await this.maintenanceRepository.saveItem({
      ...input,
      history: input.history ?? [],
    });
    return MaintenanceItem.from(saved);
  }

  /**
   * list expenses for the given user, optionally filtered by bike and date range.
   */
  async listExpenses(userId: string, filter: ListExpensesOptions): Promise<Expense[]> {
    const items = await this.expenseRepository.list({ userId, ...filter });
    return items.map((expense) => Expense.from(expense as any));
  }

  /**
   * create or update an expense for the given user.
   */
  async saveExpense(userId: string, input: ExpenseInput): Promise<Expense> {
    const saved = await this.expenseRepository.saveExpense({ ...input, userId });
    return Expense.from(saved as any);
  }

  static dependencies = [SymphonyPlatformAspect, MototrackPlatformAspect];

  static defaultConfig: GarageConfig = {};

  static async provider(
    [symphonyPlatform, mototrackPlatform]: [SymphonyPlatformNode, MototrackPlatformNode],
    _config: GarageConfig
  ) {
    const bikeModel = getModelForClass(BikeModel);
    const maintenanceModel = getModelForClass(MaintenanceItemModel);
    const expenseModel = getModelForClass(ExpenseModel);

    const bikeRepository = new BikeRepository(bikeModel);
    const maintenanceRepository = new MaintenanceRepository(maintenanceModel);
    const expenseRepository = new ExpenseRepository(expenseModel);

    const garage = new GarageNode(bikeRepository, maintenanceRepository, expenseRepository);

    const gqlSchema = createGarageGqlSchema(garage);

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    /**
     * seed demo data for the platform demo user once the database is empty.
     */
    symphonyPlatform.registerOnStart(async () => {
      const existing = await bikeRepository.countAll();
      if (existing > 0) return undefined;

      const demoUserId = await findDemoUserId();
      if (!demoUserId) return undefined;

      const seed = createGarageSeed(demoUserId);
      await bikeRepository.insertMany(seed.bikes);
      await maintenanceRepository.insertMany(seed.maintenanceItems);
      await expenseRepository.insertMany(seed.expenses);
      return undefined;
    });

    // reference to avoid unused-variable lint while keeping dep injected for future use.
    void mototrackPlatform;

    return garage;
  }
}

async function findDemoUserId(): Promise<string | null> {
  const db = mongoose.connection.db;
  if (!db) return null;

  const candidates = ['usermodels', 'users'];
  for (const name of candidates) {
    const collection = db.collection(name);
    // eslint-disable-next-line no-await-in-loop
    const doc = await collection.findOne({ email: DEMO_USER_EMAIL });
    if (doc?.id) return doc.id as string;
  }
  return null;
}

export default GarageNode;
