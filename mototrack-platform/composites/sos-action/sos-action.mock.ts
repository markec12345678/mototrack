import type { IceContact } from './ice-contact-type.js';
import type { BalkanEmergencyEntry } from './balkan-emergency-type.js';

export const mockIceContacts: IceContact[] = [
  { name: `Ana Kovač`, phone: `+386 41 123 456`, relation: `Partner` },
  { name: `Marko Novak`, phone: `+386 31 987 654`, relation: `Brat` },
];

export const balkanEmergencyNumbers: BalkanEmergencyEntry[] = [
  {
    country: `Slovenija`,
    flag: `🇸🇮`,
    police: `113`,
    ambulance: `112`,
    fire: `112`,
  },
  {
    country: `Hrvaška`,
    flag: `🇭🇷`,
    police: `192`,
    ambulance: `194`,
    fire: `193`,
  },
  {
    country: `Bosna in Hercegovina`,
    flag: `🇧🇦`,
    police: `122`,
    ambulance: `124`,
    fire: `123`,
  },
  {
    country: `Srbija`,
    flag: `🇷🇸`,
    police: `192`,
    ambulance: `194`,
    fire: `193`,
  },
  {
    country: `Črna gora`,
    flag: `🇲🇪`,
    police: `122`,
    ambulance: `124`,
    fire: `123`,
  },
  {
    country: `Severna Makedonija`,
    flag: `🇲🇰`,
    police: `192`,
    ambulance: `194`,
    fire: `193`,
  },
  {
    country: `Albanija`,
    flag: `🇦🇱`,
    police: `129`,
    ambulance: `127`,
    fire: `128`,
  },
  {
    country: `Kosovo`,
    flag: `🇽🇰`,
    police: `192`,
    ambulance: `194`,
    fire: `193`,
  },
  {
    country: `Grčija`,
    flag: `🇬🇷`,
    police: `100`,
    ambulance: `166`,
    fire: `199`,
  },
  {
    country: `Bolgarija`,
    flag: `🇧🇬`,
    police: `166`,
    ambulance: `150`,
    fire: `160`,
  },
];
