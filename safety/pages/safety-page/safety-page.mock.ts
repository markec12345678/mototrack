import type { IceContactData } from './ice-contact-data-type.js';
import type { EmergencyOverride } from './emergency-override-type.js';

export const mockIceContacts: IceContactData[] = [
  {
    id: `ice-1`,
    userId: `user-1`,
    name: `Ana Horvat`,
    relation: `Partner`,
    phone: `+38641123456`,
    primary: true,
    bloodType: `A+`,
    allergies: `Penicilin`,
    notes: `Diabetes tip 2`,
  },
  {
    id: `ice-2`,
    userId: `user-1`,
    name: `Marko Horvat`,
    relation: `Brat`,
    phone: `+38631987654`,
    primary: false,
    bloodType: `0+`,
  },
  {
    id: `ice-3`,
    userId: `user-1`,
    name: `Maja Novak`,
    relation: `Mama`,
    phone: `+38640555123`,
    primary: false,
  },
];

export const mockEmergencyOverrideSlovenia: EmergencyOverride = {
  country: `Slovenija`,
  police: `113`,
  ambulance: `112`,
  fire: `112`,
};

export const mockEmergencyOverrideCroatia: EmergencyOverride = {
  country: `Hrvaška`,
  police: `192`,
  ambulance: `194`,
  fire: `193`,
};

export const mockEmergencyOverrideAustria: EmergencyOverride = {
  country: `Avstrija`,
  police: `133`,
  ambulance: `144`,
  fire: `122`,
};
