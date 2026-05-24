import type { IconicTour } from '@markec/balkan-roads.entities.iconic-tour';

export const mockVrsicTour: IconicTour = {
  id: `vrsic-full-loop`,
  name: `Vršič Polni Krog`,
  country: `SI`,
  flag: `🇸🇮`,
  distanceKm: 187,
  rating: 9.4,
  difficulty: `Hard`,
  description: `Epska tura čez prelaz Vršič (1611 m), ki velja za enega najlepših gorskih prelazov v Alpah. Pot vodi skozi dolino Soče z njenimi smaragdnimi vodami, mimo zgodovinskih ruskih kapelic in čez 50 serpentin. Razgled na Triglav in Julijske Alpe je nepozaben. Tura je primerna za izkušene motocikliste, ki iščejo pravo gorsko avanturo.`,
  waypoints: [
    { lat: 46.3667, lng: 13.7167, name: `Kranjska Gora — Start` },
    { lat: 46.4333, lng: 13.7500, name: `Prelaz Vršič (1611 m)` },
    { lat: 46.3500, lng: 13.6833, name: `Trenta — Dolina Soče` },
    { lat: 46.2500, lng: 13.5833, name: `Bovec` },
    { lat: 46.1833, lng: 13.5667, name: `Kobarid` },
    { lat: 46.2333, lng: 13.6500, name: `Tolmin` },
    { lat: 46.3667, lng: 13.7167, name: `Kranjska Gora — Cilj` },
  ],
};

export const mockKotorTour: IconicTour = {
  id: `kotor-lovcen-skadar`,
  name: `Kotor — Lovćen — Skadar`,
  country: `ME`,
  flag: `🇲🇪`,
  distanceKm: 142,
  rating: 9.1,
  difficulty: `Moderate`,
  description: `Spektakularna tura vzdolž Kotorskega zaliva, nato pa strmo navzgor na goro Lovćen z razgledom na cel Jadran. Pot nadaljuje skozi Cetinje, zgodovinsko prestolnico Črne gore, do Skadarskega jezera — največjega jezera na Balkanu. Kombinacija morja, gora in jezera naredi to turo eno najpestrejših v regiji.`,
  waypoints: [
    { lat: 42.4247, lng: 18.7712, name: `Kotor — Staro Mesto` },
    { lat: 42.4000, lng: 18.7500, name: `Serpentine nad Kotorjem` },
    { lat: 42.3833, lng: 18.8333, name: `Lovćen — Vrh (1749 m)` },
    { lat: 42.3833, lng: 18.9167, name: `Cetinje` },
    { lat: 42.2833, lng: 19.2167, name: `Virpazar — Skadarsko Jezero` },
  ],
};

export const mockTransfagarasanTour: IconicTour = {
  id: `transfagarasan`,
  name: `Transfăgărășan — Legenda Romunije`,
  country: `RO`,
  flag: `🇷🇴`,
  distanceKm: 151,
  rating: 9.7,
  difficulty: `Expert`,
  description: `Transfăgărășan je ena najdramatičnejših cest na svetu — zgrajena med letoma 1970 in 1974 po ukazu Ceaușescuja. Cesta se vzpenja na 2042 m nadmorske višine čez Karpate, mimo jezera Bâlea in skozi tunel pod vrhom. Top Gear jo je razglasil za najboljšo cesto na svetu. Tura zahteva izkušenega voznika in dober motocikel.`,
  waypoints: [
    { lat: 45.3500, lng: 24.6167, name: `Curtea de Argeș — Start` },
    { lat: 45.5000, lng: 24.6167, name: `Rezervoar Vidraru` },
    { lat: 45.5833, lng: 24.6167, name: `Jezero Bâlea` },
    { lat: 45.6167, lng: 24.6167, name: `Vrh (2042 m)` },
    { lat: 45.7000, lng: 24.5833, name: `Sibiu — Cilj` },
  ],
};
