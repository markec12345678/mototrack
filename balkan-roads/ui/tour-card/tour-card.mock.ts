import type { TourCardTour } from './tour-card.js';

export const mockVrsicTour: TourCardTour = {
  id: `tour-vrsic-loop`,
  name: `Vršič Polni Krog`,
  country: `SI`,
  flag: `🇸🇮`,
  distanceKm: 187,
  rating: 9.4,
  difficulty: `Hard`,
  description: `Epska zanka čez prelaz Vršič (1611 m) in nazaj po dolini Soče. Ruske kapelice, 50 serpentin in turkizna reka — najboljša motociklistična tura v Alpah.`,
  waypoints: [
    { lat: 46.4095, lng: 13.7388, name: `Kranjska Gora` },
    { lat: 46.4378, lng: 13.7456, name: `Prelaz Vršič` },
    { lat: 46.3631, lng: 13.6592, name: `Trenta` },
    { lat: 46.2504, lng: 13.5765, name: `Bovec` },
    { lat: 46.3369, lng: 13.6488, name: `Kobarid` },
    { lat: 46.4095, lng: 13.7388, name: `Kranjska Gora` },
  ],
};

export const mockKotorTour: TourCardTour = {
  id: `tour-kotor-lovcen`,
  name: `Kotor – Lovćen – Skadar`,
  country: `ME`,
  flag: `🇲🇪`,
  distanceKm: 142,
  rating: 9.1,
  difficulty: `Moderate`,
  description: `Od Kotorskega zaliva po 25 serpentinah na Lovćen (1749 m), nato spust do jezera Skadar. Panorame, ki vzamejo dih, in ceste, ki dajejo dušo.`,
  waypoints: [
    { lat: 42.4247, lng: 18.7712, name: `Kotor` },
    { lat: 42.3947, lng: 18.8333, name: `Cetinje` },
    { lat: 42.4083, lng: 18.8333, name: `Lovćen vrh` },
    { lat: 42.1667, lng: 19.3, name: `Jezero Skadar` },
  ],
};

export const mockTransfagarasanTour: TourCardTour = {
  id: `tour-transfagarasan`,
  name: `Transfăgărășan`,
  country: `RO`,
  flag: `🇷🇴`,
  distanceKm: 151,
  rating: 9.7,
  difficulty: `Hard`,
  description: `Legendarni romunski prelaz — asfalt, ki se vzpne do 2042 m. Vijugaste ceste, slapovi Vidraru in pogled, ki ga Top Gear ni mogel pozabiti.`,
  waypoints: [
    { lat: 45.3594, lng: 24.6261, name: `Curtea de Argeș` },
    { lat: 45.5958, lng: 24.6167, name: `Jezero Vidraru` },
    { lat: 45.6036, lng: 24.6167, name: `Vrh Transfăgărășan` },
    { lat: 45.8, lng: 24.55, name: `Sibiu` },
  ],
};

export const mockEasyTour: TourCardTour = {
  id: `tour-peljesac`,
  name: `Pelješka Panorama`,
  country: `HR`,
  flag: `🇭🇷`,
  distanceKm: 98,
  rating: 8.6,
  difficulty: `Easy`,
  description: `Polotok Pelješac ob Jadranskem morju — vinogradi, ostrige in mirne ceste z razgledom na otoke Korčula in Mljet.`,
  waypoints: [
    { lat: 42.9167, lng: 17.4167, name: `Ston` },
    { lat: 42.9833, lng: 17.1, name: `Orebić` },
    { lat: 43.0, lng: 17.0, name: `Viganj` },
  ],
};

export const mockTours: TourCardTour[] = [
  mockVrsicTour,
  mockKotorTour,
  mockTransfagarasanTour,
  mockEasyTour,
];
