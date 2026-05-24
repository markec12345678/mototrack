import { ReturnModelType } from '@typegoose/typegoose';
import { FuelPriceReportModel } from './fuel-price-report.model.js';
import { FuelPriceReport } from '@markec/community.entities.fuel-price-report';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { User } from './user.js';

/**
 * Options for listing fuel prices.
 */
export type ListFuelPricesOptions = {
  country?: string;
};

/**
 * Input type for reporting a fuel price.
 */
export type FuelPriceInput = {
  country: string;
  brand: string;
  petrolEur: number;
  dieselEur: number;
  location: string;
};

/**
 * Repository for managing community-reported fuel prices.
 */
export class FuelPriceReportRepository {
  constructor(private fuelPriceReportModel: ReturnModelType<typeof FuelPriceReportModel>) {}

  /**
   * Retrieves a list of community-reported fuel prices, optionally filtered by country.
   * @param country - Optional filter for the country.
   * @returns A promise that resolves to an array of FuelPriceReport entities.
   */
  async listFuelPrices(country?: string): Promise<FuelPriceReport[]> {
    const query: any = {};
    if (country) {
      query.country = country;
    }

    const reports = await this.fuelPriceReportModel.find(query).sort({ reportedAt: -1 }).exec();

    return reports.map((reportDoc) => {
      const reportObject = reportDoc.toObject();
      return new FuelPriceReport(
        reportObject.id,
        reportObject.country,
        reportObject.brand,
        reportObject.petrolEur,
        reportObject.dieselEur,
        reportObject.location,
        reportObject.reportedAt,
        reportObject.confirms
      );
    });
  }

  /**
   * Submits a new fuel price report to the community.
   * @param input - The fuel price details.
   * @param user - The user submitting the report.
   * @returns A promise that resolves to the created FuelPriceReport entity.
   * @throws {Unauthorized} if no user is provided.
   */
  async reportFuelPrice(input: FuelPriceInput, user: User): Promise<FuelPriceReport> {
    if (!user) throw new Unauthorized();

    const newReport = await this.fuelPriceReportModel.create({
      country: input.country,
      brand: input.brand,
      petrolEur: input.petrolEur,
      dieselEur: input.dieselEur,
      location: input.location,
      reportedAt: Date.now(),
      confirms: 1, // First report implicitly confirmed by reporting user
    });

    const reportObject = newReport.toObject();
    return new FuelPriceReport(
      reportObject.id,
      reportObject.country,
      reportObject.brand,
      reportObject.petrolEur,
      reportObject.dieselEur,
      reportObject.location,
      reportObject.reportedAt,
      reportObject.confirms
    );
  }
}