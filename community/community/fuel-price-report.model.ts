import { prop } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Defines the structure for a community-reported fuel price.
 */
export class FuelPriceReportModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public country!: string;

  @prop({ required: true, type: String })
  public brand!: string;

  @prop({ required: true, type: Number })
  public petrolEur!: number;

  @prop({ required: true, type: Number })
  public dieselEur!: number;

  @prop({ required: true, type: String })
  public location!: string;

  @prop({ required: true, type: Number, default: () => Date.now() })
  public reportedAt!: number;

  @prop({ required: true, type: Number, default: 0 })
  public confirms!: number; // Number of confirmations from other users
}

/**
 * Mock data for FuelPriceReportModel.
 */
export const fuelPriceReportModelMock: FuelPriceReportModel[] = [
  { id: '1', country: 'DE', brand: 'Shell', petrolEur: 1.85, dieselEur: 1.75, location: 'Berlin', reportedAt: Date.now() - 3600000 * 2, confirms: 10 },
  { id: '2', country: 'DE', brand: 'Aral', petrolEur: 1.82, dieselEur: 1.72, location: 'Munich', reportedAt: Date.now() - 3600000 * 5, confirms: 8 },
  { id: '3', country: 'FR', brand: 'TotalEnergies', petrolEur: 1.90, dieselEur: 1.80, location: 'Paris', reportedAt: Date.now() - 3600000 * 1, confirms: 12 },
  { id: '4', country: 'ES', brand: 'Repsol', petrolEur: 1.78, dieselEur: 1.68, location: 'Madrid', reportedAt: Date.now() - 3600000 * 3, confirms: 15 },
  { id: '5', country: 'IT', brand: 'Eni', petrolEur: 1.92, dieselEur: 1.82, location: 'Rome', reportedAt: Date.now() - 3600000 * 4, confirms: 7 },
  { id: '6', country: 'ES', brand: 'BP', petrolEur: 1.79, dieselEur: 1.70, location: 'Barcelona', reportedAt: Date.now() - 3600000 * 6, confirms: 9 },
];