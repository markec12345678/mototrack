export type PlainBike = {
  /**
   * unique identifier of the bike document.
   */
  id: string;

  /**
   * the owner user's ID.
   */
  userId: string;

  /**
   * display name of the bike (e.g. "KTM 890 Adventure").
   */
  name: string;

  /**
   * model designation (e.g. "890 Adventure").
   */
  model: string;

  /**
   * manufacturing year.
   */
  year: number;

  /**
   * current odometer reading in kilometres.
   */
  mileageKm: number;

  /**
   * fuel tank capacity in litres.
   */
  tankL: number;

  /**
   * average fuel consumption in litres per 100 km.
   */
  consumptionLPer100: number;

  /**
   * current fuel level in litres.
   */
  currentFuelL: number;

  /**
   * bike colour (CSS colour string or named colour).
   */
  color: string;

  /**
   * whether this is the user's primary bike.
   */
  primary: boolean;
};

export class Bike {
  constructor(
    /**
     * unique identifier of the bike document.
     */
    readonly id: string,

    /**
     * the owner user's ID.
     */
    readonly userId: string,

    /**
     * display name of the bike (e.g. "KTM 890 Adventure").
     */
    readonly name: string,

    /**
     * model designation (e.g. "890 Adventure").
     */
    readonly model: string,

    /**
     * manufacturing year.
     */
    readonly year: number,

    /**
     * current odometer reading in kilometres.
     */
    readonly mileageKm: number,

    /**
     * fuel tank capacity in litres.
     */
    readonly tankL: number,

    /**
     * average fuel consumption in litres per 100 km.
     */
    readonly consumptionLPer100: number,

    /**
     * current fuel level in litres.
     */
    readonly currentFuelL: number,

    /**
     * bike colour (CSS colour string or named colour).
     */
    readonly color: string,

    /**
     * whether this is the user's primary bike.
     */
    readonly primary: boolean,
  ) {}

  /**
   * computed estimated range in kilometres based on current fuel level
   * and average consumption: (currentFuelL * 100) / consumptionLPer100.
   */
  get rangeKm(): number {
    if (!this.consumptionLPer100 || this.consumptionLPer100 === 0) return 0;
    return (this.currentFuelL * 100) / this.consumptionLPer100;
  }

  /**
   * serialize the Bike into a plain object.
   */
  toObject(): PlainBike & { rangeKm: number } {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      model: this.model,
      year: this.year,
      mileageKm: this.mileageKm,
      tankL: this.tankL,
      consumptionLPer100: this.consumptionLPer100,
      currentFuelL: this.currentFuelL,
      color: this.color,
      primary: this.primary,
      rangeKm: this.rangeKm,
    };
  }

  /**
   * create a Bike instance from a plain object.
   */
  static from(plain: PlainBike): Bike {
    const {
      id = '',
      userId = '',
      name = '',
      model = '',
      year = 0,
      mileageKm = 0,
      tankL = 0,
      consumptionLPer100 = 0,
      currentFuelL = 0,
      color = '',
      primary = false,
    } = plain;

    return new Bike(
      id,
      userId,
      name,
      model,
      year,
      mileageKm,
      tankL,
      consumptionLPer100,
      currentFuelL,
      color,
      primary,
    );
  }
}
