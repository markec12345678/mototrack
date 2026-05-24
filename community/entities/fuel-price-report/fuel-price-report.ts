export type PlainFuelPriceReport = {
  /**
   * unique identifier of the report.
   */
  id: string;

  /**
   * country where the fuel price was reported.
   */
  country: string;

  /**
   * fuel station brand.
   */
  brand: string;

  /**
   * petrol price in EUR per litre.
   */
  petrolEur: number;

  /**
   * diesel price in EUR per litre.
   */
  dieselEur: number;

  /**
   * location description of the fuel station.
   */
  location: string;

  /**
   * unix timestamp (ms) when the report was submitted.
   */
  reportedAt: number;

  /**
   * number of community confirmations for this report.
   */
  confirms: number;
};

export class FuelPriceReport {
  constructor(
    /**
     * unique identifier of the report.
     */
    readonly id: string,

    /**
     * country where the fuel price was reported.
     */
    readonly country: string,

    /**
     * fuel station brand.
     */
    readonly brand: string,

    /**
     * petrol price in EUR per litre.
     */
    readonly petrolEur: number,

    /**
     * diesel price in EUR per litre.
     */
    readonly dieselEur: number,

    /**
     * location description of the fuel station.
     */
    readonly location: string,

    /**
     * unix timestamp (ms) when the report was submitted.
     */
    readonly reportedAt: number,

    /**
     * number of community confirmations for this report.
     */
    readonly confirms: number,
  ) {}

  /**
   * serialize a FuelPriceReport into a plain object.
   */
  toObject(): PlainFuelPriceReport {
    return {
      id: this.id,
      country: this.country,
      brand: this.brand,
      petrolEur: this.petrolEur,
      dieselEur: this.dieselEur,
      location: this.location,
      reportedAt: this.reportedAt,
      confirms: this.confirms,
    };
  }

  /**
   * create a FuelPriceReport from a plain object.
   */
  static from(plain: PlainFuelPriceReport): FuelPriceReport {
    const {
      id = '',
      country = '',
      brand = '',
      petrolEur = 0,
      dieselEur = 0,
      location = '',
      reportedAt = 0,
      confirms = 0,
    } = plain;

    return new FuelPriceReport(
      id,
      country,
      brand,
      petrolEur,
      dieselEur,
      location,
      reportedAt,
      confirms,
    );
  }
}
