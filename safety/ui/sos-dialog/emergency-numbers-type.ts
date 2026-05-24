export type EmergencyNumbers = {
  police: string;
  ambulance: string;
  fire: string;
  general: string;
};

export type CountryInfo = {
  country: string | null;
  flag: string | null;
  emergencyNumbers: EmergencyNumbers | null;
};
