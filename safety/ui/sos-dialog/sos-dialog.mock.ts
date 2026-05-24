import type { IceContact } from './ice-contact-type.js';
import type { EmergencyNumbers } from './emergency-numbers-type.js';

export const mockIceContacts: IceContact[] = [
  {
    id: `ice-1`,
    userId: `user-1`,
    name: `Ana Horvat`,
    relation: `Partner`,
    phone: `+38641123456`,
    primary: true,
    bloodType: `A+`,
    allergies: `Penicillin`,
    notes: `Speaks English and Slovenian`,
  },
  {
    id: `ice-2`,
    userId: `user-1`,
    name: `Marko Horvat`,
    relation: `Brother`,
    phone: `+38631987654`,
    primary: false,
    bloodType: `O+`,
  },
  {
    id: `ice-3`,
    userId: `user-1`,
    name: `Dr. Petra Novak`,
    relation: `Family Doctor`,
    phone: `+38641555000`,
    primary: false,
    notes: `Available Mon–Fri 8–16`,
  },
];

export const mockEmergencyNumbersSlovenia: EmergencyNumbers = {
  police: `113`,
  ambulance: `112`,
  fire: `112`,
  general: `112`,
};

export const mockEmergencyNumbersCroatia: EmergencyNumbers = {
  police: `192`,
  ambulance: `194`,
  fire: `193`,
  general: `112`,
};

export const mockEmergencyNumbersGeneric: EmergencyNumbers = {
  police: `112`,
  ambulance: `112`,
  fire: `112`,
  general: `112`,
};

export const mockLocationSlovenia = {
  lat: 46.0569,
  lng: 14.5058,
  countryName: `Slovenia`,
  countryFlag: `🇸🇮`,
};

export const mockLocationCroatia = {
  lat: 45.8150,
  lng: 15.9819,
  countryName: `Croatia`,
  countryFlag: `🇭🇷`,
};
