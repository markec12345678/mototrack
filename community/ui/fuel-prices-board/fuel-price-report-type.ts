export type FuelPriceReport = {
  id: string;
  country: string;
  brand: string;
  petrolEur: number;
  dieselEur: number;
  location: string;
  reportedAt: number;
  confirms: number;
};

export type CountryAverage = {
  country: string;
  avgPetrolEur: number;
  avgDieselEur: number;
  reportCount: number;
  lastReportedAt: number;
};

export type ReportFormData = {
  country: string;
  brand: string;
  petrolEur: string;
  dieselEur: string;
  location: string;
};
