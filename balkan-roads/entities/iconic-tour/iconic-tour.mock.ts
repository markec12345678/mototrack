import { IconicTour } from './iconic-tour.js';
import type { PlainIconicTour } from './iconic-tour.js';

/**
 * Base seed data - 20 iconic Balkan tours.
 * Tours 1-10: original curated routes.
 * Tours 11-20: real GPS coordinates from the prototype balkan-tours dataset.
 */
const SEED_TOURS: PlainIconicTour[] = [
  // Original 10
  {
    id: 'tour-001',
    name: 'Durmitor Ring',
    country: 'Montenegro',
    flag: '🇲🇪',
    distanceKm: 165,
    rating: 4.9,
    difficulty: 'hard',
    description:
      'A breathtaking loop around Durmitor National Park featuring the Tara Canyon, Black Lake, and dramatic mountain passes above 1800 m.',
    waypoints: [
      { lat: 43.1522, lng: 19.0144, name: 'Zabljak' },
      { lat: 43.2003, lng: 19.1201, name: 'Tara Canyon Viewpoint' },
      { lat: 43.0831, lng: 18.9472, name: 'Sedlo Pass (1907 m)' },
      { lat: 43.1522, lng: 19.0144, name: 'Zabljak' },
    ],
  },
  {
    id: 'tour-002',
    name: 'Via Dinarica - Bosnia Highlands',
    country: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    distanceKm: 210,
    rating: 4.7,
    difficulty: 'hard',
    description:
      'Traverse the spine of the Dinaric Alps through remote Bosnian highlands, passing Blidinje Nature Park and the legendary Prenj massif.',
    waypoints: [
      { lat: 43.6167, lng: 17.5833, name: 'Jablanica' },
      { lat: 43.6722, lng: 17.4833, name: 'Blidinje Lake' },
      { lat: 43.5500, lng: 17.7000, name: 'Prenj North Ridge' },
      { lat: 43.3431, lng: 17.8083, name: 'Mostar' },
    ],
  },
  {
    id: 'tour-003',
    name: 'Pirin - Rila Grand Tour',
    country: 'Bulgaria',
    flag: '🇧🇬',
    distanceKm: 280,
    rating: 4.8,
    difficulty: 'moderate',
    description:
      "Connect Bulgaria's two highest national parks - Rila and Pirin - through pine forests, glacial lakes, and the Seven Rila Lakes plateau.",
    waypoints: [
      { lat: 42.1333, lng: 23.5500, name: 'Borovets' },
      { lat: 42.2167, lng: 23.3833, name: 'Seven Rila Lakes' },
      { lat: 41.7667, lng: 23.4833, name: 'Bansko' },
      { lat: 41.6500, lng: 23.5167, name: 'Vihren Peak Trailhead' },
    ],
  },
  {
    id: 'tour-004',
    name: 'Dalmatian Coast Classic',
    country: 'Croatia',
    flag: '🇭🇷',
    distanceKm: 320,
    rating: 4.6,
    difficulty: 'easy',
    description:
      'The quintessential Adriatic drive from Split to Dubrovnik along the D8 Magistrala, with island ferries, walled cities, and turquoise coves.',
    waypoints: [
      { lat: 43.5081, lng: 16.4402, name: 'Split' },
      { lat: 43.0650, lng: 16.6800, name: 'Makarska' },
      { lat: 42.9083, lng: 17.4472, name: 'Ploce' },
      { lat: 42.6507, lng: 18.0944, name: 'Dubrovnik' },
    ],
  },
  {
    id: 'tour-005',
    name: 'Kosovo - Rugova Canyon Loop',
    country: 'Kosovo',
    flag: '🇽🇰',
    distanceKm: 130,
    rating: 4.5,
    difficulty: 'moderate',
    description:
      'Explore the dramatic Rugova Canyon near Peja, winding through 25 km of sheer limestone walls before climbing to alpine meadows above 2000 m.',
    waypoints: [
      { lat: 42.6597, lng: 20.2883, name: 'Peja / Pec' },
      { lat: 42.6833, lng: 20.1833, name: 'Rugova Canyon Entrance' },
      { lat: 42.7167, lng: 20.1000, name: 'Hajla Peak Viewpoint' },
      { lat: 42.6597, lng: 20.2883, name: 'Peja / Pec' },
    ],
  },
  {
    id: 'tour-006',
    name: 'North Macedonia - Ohrid to Prespa',
    country: 'North Macedonia',
    flag: '🇲🇰',
    distanceKm: 145,
    rating: 4.6,
    difficulty: 'easy',
    description:
      'A scenic lake-to-lake journey from UNESCO-listed Ohrid through the Galicica National Park ridge road to the serene Prespa basin.',
    waypoints: [
      { lat: 41.1231, lng: 20.8016, name: 'Ohrid' },
      { lat: 40.9833, lng: 20.9000, name: 'Galicica Pass (1600 m)' },
      { lat: 40.8500, lng: 21.0167, name: 'Resen' },
      { lat: 40.8667, lng: 21.0500, name: 'Prespa Lake Shore' },
    ],
  },
  {
    id: 'tour-007',
    name: 'Ionian Coast - Sarande to Vlore',
    country: 'Albania',
    flag: '🇦🇱',
    distanceKm: 175,
    rating: 4.8,
    difficulty: 'moderate',
    description:
      "Albania's most celebrated coastal drive hugging the Ionian Sea, passing Butrint ruins, Llogara Pass, and hidden beaches of the Albanian Riviera.",
    waypoints: [
      { lat: 39.8756, lng: 20.0022, name: 'Sarande' },
      { lat: 39.9833, lng: 20.0500, name: 'Butrint National Park' },
      { lat: 40.2167, lng: 19.9500, name: 'Himara' },
      { lat: 40.4667, lng: 19.6500, name: 'Llogara Pass (1027 m)' },
      { lat: 40.4500, lng: 19.4833, name: 'Vlore' },
    ],
  },
  {
    id: 'tour-008',
    name: 'Thessaly - Meteora and Pindus Foothills',
    country: 'Greece',
    flag: '🇬🇷',
    distanceKm: 190,
    rating: 4.9,
    difficulty: 'moderate',
    description:
      'Combine the otherworldly rock monasteries of Meteora with a sweeping drive into the Pindus Mountains through Zagori stone villages.',
    waypoints: [
      { lat: 39.7217, lng: 21.6306, name: 'Kalambaka / Meteora' },
      { lat: 39.7833, lng: 21.3167, name: 'Metsovo' },
      { lat: 39.8667, lng: 20.8500, name: 'Ioannina' },
      { lat: 39.9833, lng: 20.7667, name: 'Zagori - Vikos Gorge' },
    ],
  },
  {
    id: 'tour-009',
    name: 'Tara River Canyon Descent',
    country: 'Montenegro',
    flag: '🇲🇪',
    distanceKm: 110,
    rating: 4.7,
    difficulty: 'hard',
    description:
      'Navigate the deepest canyon in Europe along the Tara River, crossing the iconic Durdjevica Tara Bridge and descending through ancient forest.',
    waypoints: [
      { lat: 43.1522, lng: 19.0144, name: 'Zabljak' },
      { lat: 43.1833, lng: 19.2667, name: 'Durdjevica Tara Bridge' },
      { lat: 43.2500, lng: 19.4000, name: 'Scepan Polje' },
    ],
  },
  {
    id: 'tour-010',
    name: 'Slovenian Alpine Triangle',
    country: 'Slovenia',
    flag: '🇸🇮',
    distanceKm: 240,
    rating: 4.8,
    difficulty: 'moderate',
    description:
      'Link Lake Bled, the Soca Valley, and Triglav National Park in a classic Slovenian loop through emerald rivers and Julian Alps scenery.',
    waypoints: [
      { lat: 46.3683, lng: 14.1146, name: 'Lake Bled' },
      { lat: 46.3500, lng: 13.7167, name: 'Kranjska Gora' },
      { lat: 46.3333, lng: 13.5833, name: 'Vrsic Pass (1611 m)' },
      { lat: 46.2500, lng: 13.6500, name: 'Bovec / Soca Valley' },
      { lat: 46.3683, lng: 14.1146, name: 'Lake Bled' },
    ],
  },

  // Prototype GPS dataset - 10 tours
  {
    id: 'tour-011',
    name: 'Vrsic Full Loop',
    country: 'Slovenia',
    flag: '🇸🇮',
    distanceKm: 98,
    rating: 4.9,
    difficulty: 'hard',
    description:
      'The complete Vrsic Pass loop starting and ending in Kranjska Gora, crossing 50 hairpin bends and descending into the turquoise Soca Valley.',
    waypoints: [
      { lat: 46.4833, lng: 13.7833, name: 'Kranjska Gora' },
      { lat: 46.4333, lng: 13.7417, name: 'Hairpin 1 - Ruska Kapelica' },
      { lat: 46.4167, lng: 13.7333, name: 'Vrsic Summit (1611 m)' },
      { lat: 46.3833, lng: 13.7167, name: 'Trenta Valley' },
      { lat: 46.3333, lng: 13.5500, name: 'Bovec' },
      { lat: 46.3667, lng: 13.6500, name: 'Soca Source' },
      { lat: 46.4833, lng: 13.7833, name: 'Kranjska Gora' },
    ],
  },
  {
    id: 'tour-012',
    name: 'Kotor - Lovcen - Skadar',
    country: 'Montenegro',
    flag: '🇲🇪',
    distanceKm: 122,
    rating: 4.8,
    difficulty: 'hard',
    description:
      'Climb 25 serpentines from the UNESCO Bay of Kotor to the Lovcen mausoleum, then descend to the vast wetlands of Lake Skadar.',
    waypoints: [
      { lat: 42.4247, lng: 18.7714, name: 'Kotor Old Town' },
      { lat: 42.3833, lng: 18.8333, name: 'Serpentine Viewpoint' },
      { lat: 42.3833, lng: 18.8333, name: 'Lovcen NP Entrance' },
      { lat: 42.3917, lng: 18.8333, name: 'Jezerski Vrh - Njegos Mausoleum (1657 m)' },
      { lat: 42.2167, lng: 19.1500, name: 'Virpazar - Lake Skadar' },
      { lat: 42.4247, lng: 18.7714, name: 'Kotor Old Town' },
    ],
  },
  {
    id: 'tour-013',
    name: 'Transfagarasan Highway',
    country: 'Romania',
    flag: '🇷🇴',
    distanceKm: 151,
    rating: 5.0,
    difficulty: 'hard',
    description:
      "Romania's most dramatic road, built by Ceausescu through the Carpathians, peaking at Balea Lake (2034 m) with glacial scenery and tunnels.",
    waypoints: [
      { lat: 45.3500, lng: 24.6333, name: 'Curtea de Arges' },
      { lat: 45.5000, lng: 24.6167, name: 'Vidraru Dam and Lake' },
      { lat: 45.6000, lng: 24.6167, name: 'Capra Waterfall' },
      { lat: 45.6000, lng: 24.6167, name: 'Balea Cascada' },
      { lat: 45.6000, lng: 24.6167, name: 'Balea Lake (2034 m)' },
      { lat: 45.6167, lng: 24.5667, name: 'Sibiu Side - Cartisoara' },
    ],
  },
  {
    id: 'tour-014',
    name: 'Albanian Riviera Drive',
    country: 'Albania',
    flag: '🇦🇱',
    distanceKm: 135,
    rating: 4.7,
    difficulty: 'moderate',
    description:
      'Hug the wild Ionian coastline from Vlore to Sarande over Llogara Pass, discovering deserted beaches, blue lagoons, and ancient Butrint.',
    waypoints: [
      { lat: 40.4500, lng: 19.4833, name: 'Vlore' },
      { lat: 40.4667, lng: 19.6500, name: 'Llogara Pass (1027 m)' },
      { lat: 40.2833, lng: 19.8667, name: 'Dhermi Beach' },
      { lat: 40.1167, lng: 19.9500, name: 'Himara' },
      { lat: 39.9500, lng: 20.0167, name: 'Porto Palermo' },
      { lat: 39.8756, lng: 20.0022, name: 'Sarande' },
    ],
  },
  {
    id: 'tour-015',
    name: 'Rhodope Mountain Circuit',
    country: 'Bulgaria',
    flag: '🇧🇬',
    distanceKm: 178,
    rating: 4.6,
    difficulty: 'moderate',
    description:
      "Wind through the mystical Rhodope Mountains past the Devil's Bridge, Trigrad Gorge, and Arda River meanders in a full-day circuit.",
    waypoints: [
      { lat: 41.9333, lng: 24.7167, name: 'Plovdiv' },
      { lat: 41.6333, lng: 24.6167, name: 'Asenovgrad' },
      { lat: 41.5167, lng: 24.5333, name: "Devil's Bridge (Dyavolski Most)" },
      { lat: 41.4667, lng: 24.4667, name: 'Trigrad Gorge' },
      { lat: 41.4833, lng: 24.3333, name: 'Yagodinska Cave' },
      { lat: 41.6333, lng: 24.1833, name: 'Devin' },
      { lat: 41.9333, lng: 24.7167, name: 'Plovdiv' },
    ],
  },
  {
    id: 'tour-016',
    name: 'Peljesac Peninsula Loop',
    country: 'Croatia',
    flag: '🇭🇷',
    distanceKm: 118,
    rating: 4.7,
    difficulty: 'easy',
    description:
      "Explore Croatia's wine peninsula from the Peljesac Bridge, through Ston's medieval walls, to Orebic and the vineyards of Dingac.",
    waypoints: [
      { lat: 42.9167, lng: 17.5833, name: 'Peljesac Bridge' },
      { lat: 42.8333, lng: 17.6833, name: 'Ston - Salt Pans and Walls' },
      { lat: 42.9667, lng: 17.2167, name: 'Janjina' },
      { lat: 42.9833, lng: 17.1833, name: 'Dingac Vineyard Viewpoint' },
      { lat: 43.0167, lng: 17.1833, name: 'Orebic' },
      { lat: 42.9167, lng: 17.5833, name: 'Peljesac Bridge' },
    ],
  },
  {
    id: 'tour-017',
    name: 'Cabulja - Prenj Traverse',
    country: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    distanceKm: 142,
    rating: 4.8,
    difficulty: 'extreme',
    description:
      'One of the most demanding drives in the Balkans, crossing the Cabulja and Prenj massifs on rough mountain tracks with panoramic views of Herzegovina.',
    waypoints: [
      { lat: 43.3431, lng: 17.8083, name: 'Mostar' },
      { lat: 43.4500, lng: 17.6833, name: 'Cabulja Plateau' },
      { lat: 43.5167, lng: 17.7500, name: 'Prenj - Zelena Glava (2155 m)' },
      { lat: 43.6167, lng: 17.5833, name: 'Jablanica' },
    ],
  },
  {
    id: 'tour-018',
    name: 'Mavrovo - Debar Canyon',
    country: 'North Macedonia',
    flag: '🇲🇰',
    distanceKm: 108,
    rating: 4.6,
    difficulty: 'moderate',
    description:
      'Descend from the ski resort of Mavrovo through the Radika River canyon to the thermal springs of Debar, passing the Sveti Jovan Bigorski monastery.',
    waypoints: [
      { lat: 41.6667, lng: 20.7333, name: 'Mavrovo Lake' },
      { lat: 41.6500, lng: 20.6167, name: 'Sveti Jovan Bigorski Monastery' },
      { lat: 41.5833, lng: 20.5333, name: 'Radika Canyon Viewpoint' },
      { lat: 41.5333, lng: 20.5167, name: 'Debar' },
      { lat: 41.5167, lng: 20.4833, name: 'Kosovrasti Thermal Baths' },
    ],
  },
  {
    id: 'tour-019',
    name: 'Zlatibor - Tara Forest Drive',
    country: 'Serbia',
    flag: '🇷🇸',
    distanceKm: 156,
    rating: 4.5,
    difficulty: 'moderate',
    description:
      'Roll through the rolling meadows of Zlatibor, cross the Drina River gorge, and enter the dense spruce forests of Tara National Park.',
    waypoints: [
      { lat: 43.7333, lng: 19.7000, name: 'Zlatibor Resort' },
      { lat: 43.7000, lng: 19.5833, name: 'Sirogojno Open-Air Museum' },
      { lat: 43.9167, lng: 19.3667, name: 'Mokra Gora - Sargan 8 Railway' },
      { lat: 43.9667, lng: 19.2833, name: 'Drina Canyon Viewpoint' },
      { lat: 43.9500, lng: 19.5167, name: 'Tara NP - Zaovine Lake' },
      { lat: 43.8833, lng: 19.5667, name: 'Mitrovac' },
    ],
  },
  {
    id: 'tour-020',
    name: 'Meteora - Pindus Highlands',
    country: 'Greece',
    flag: '🇬🇷',
    distanceKm: 203,
    rating: 4.9,
    difficulty: 'moderate',
    description:
      "Start at the rock-top monasteries of Meteora, climb into the Pindus highlands through Metsovo, and end at the Vikos Gorge - the world's deepest narrow gorge.",
    waypoints: [
      { lat: 39.7217, lng: 21.6306, name: 'Kalambaka - Meteora Monasteries' },
      { lat: 39.7500, lng: 21.4833, name: 'Grevena' },
      { lat: 39.7667, lng: 21.1833, name: 'Metsovo (1156 m)' },
      { lat: 39.8667, lng: 20.8500, name: 'Ioannina' },
      { lat: 39.9167, lng: 20.7500, name: 'Monodendri - Vikos Gorge Rim' },
      { lat: 39.9833, lng: 20.7667, name: 'Papigo Village' },
    ],
  },
];

/**
 * Return all 20 seeded IconicTour instances, with optional partial overrides
 * applied to each entry that matches by index.
 */
export function mockIconicTours(
  overrides: Partial<PlainIconicTour>[] = []
): IconicTour[] {
  return SEED_TOURS.map((seed, index) =>
    IconicTour.from({ ...seed, ...(overrides[index] ?? {}) })
  );
}

/**
 * Return a single mock IconicTour with optional partial override.
 */
export function mockIconicTour(
  override: Partial<PlainIconicTour> = {}
): IconicTour {
  return IconicTour.from({ ...SEED_TOURS[0], ...override });
}
