import { gql } from 'graphql-tag';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { GarageNode } from './garage.node.runtime.js';

type GqlContext = {
  session?: {
    user?: { id: string };
  };
};

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

function requireUser(context: GqlContext): { id: string } {
  const user = context.session?.user;
  if (!user) throw new Unauthorized();
  return user;
}

export function createGarageGqlSchema(garage: GarageNode): GqlSchema {
  return {
    typeDefs: gql`
      input BikeInput {
        id: ID
        name: String!
        model: String!
        year: Int!
        mileageKm: Float!
        tankL: Float!
        consumptionLPer100: Float!
        currentFuelL: Float!
        color: String!
        primary: Boolean
      }

      input MaintenanceHistoryItemInput {
        atKm: Float!
        atDate: Float!
        note: String
      }

      input MaintenanceInput {
        id: ID
        bikeId: ID!
        name: String!
        intervalKm: Float!
        intervalDays: Int!
        lastServiceKm: Float!
        lastServiceAt: Float!
        history: [MaintenanceHistoryItemInput]
      }

      input ExpenseInput {
        id: ID
        bikeId: ID
        category: String!
        amountEur: Float!
        label: String!
        at: Float!
        notes: String
      }

      input ListExpensesOptions {
        bikeId: ID
        from: Float
        to: Float
      }

      type Bike {
        id: ID!
        userId: ID!
        name: String!
        model: String!
        year: Int!
        mileageKm: Float!
        tankL: Float!
        consumptionLPer100: Float!
        currentFuelL: Float!
        color: String!
        primary: Boolean!
      }

      type MaintenanceHistoryItem {
        atKm: Float!
        atDate: Float!
        note: String
      }

      type MaintenanceItem {
        id: ID!
        bikeId: ID!
        name: String!
        intervalKm: Float!
        intervalDays: Int!
        lastServiceKm: Float!
        lastServiceAt: Float!
        history: [MaintenanceHistoryItem]
      }

      type Expense {
        id: ID!
        userId: ID!
        bikeId: ID
        category: String!
        amountEur: Float!
        label: String!
        at: Float!
        notes: String
      }

      type Query {
        listBikes: [Bike]
        listMaintenance(bikeId: ID!): [MaintenanceItem]
        listExpenses(filter: ListExpensesOptions): [Expense]
      }

      type Mutation {
        saveBike(input: BikeInput!): Bike!
        deleteBike(id: ID!): Boolean!
        saveMaintenance(input: MaintenanceInput!): MaintenanceItem!
        saveExpense(input: ExpenseInput!): Expense!
      }
    `,
    resolvers: {
      Query: {
        listBikes: async (_req: unknown, _args: unknown, context: GqlContext) => {
          const user = requireUser(context);
          return garage.listBikes(user.id);
        },
        listMaintenance: async (
          _req: unknown,
          { bikeId }: { bikeId: string },
          context: GqlContext
        ) => {
          requireUser(context);
          return garage.listMaintenance(bikeId);
        },
        listExpenses: async (
          _req: unknown,
          { filter }: { filter?: ListExpensesOptions },
          context: GqlContext
        ) => {
          const user = requireUser(context);
          return garage.listExpenses(user.id, filter ?? {});
        },
      },
      Mutation: {
        saveBike: async (
          _req: unknown,
          { input }: { input: BikeInput },
          context: GqlContext
        ) => {
          const user = requireUser(context);
          return garage.saveBike(user.id, input);
        },
        deleteBike: async (
          _req: unknown,
          { id }: { id: string },
          context: GqlContext
        ) => {
          const user = requireUser(context);
          return garage.deleteBike(user.id, id);
        },
        saveMaintenance: async (
          _req: unknown,
          { input }: { input: MaintenanceInput },
          context: GqlContext
        ) => {
          requireUser(context);
          return garage.saveMaintenance(input);
        },
        saveExpense: async (
          _req: unknown,
          { input }: { input: ExpenseInput },
          context: GqlContext
        ) => {
          const user = requireUser(context);
          return garage.saveExpense(user.id, input);
        },
      },
    },
  };
}
