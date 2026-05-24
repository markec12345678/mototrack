import { BalkanRoad } from './balkan-road.js';
import type { PlainBalkanRoad } from './balkan-road.js';

/**
 * Seeded data for 63 iconic Balkan roads across 10 countries.
 */
const SEEDED_ROADS: PlainBalkanRoad[] = [
  // -- Slovenia (9) -----------------------------------------------------------
  {
    id: 'si-001',
    name: 'Vrsic Pass',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 25,
    rating: 9.4,
    difficulty: 'Hard',
    type: 'Pass',
    description:
      'The highest mountain pass in Slovenia with 50 hairpin bends, offering breathtaking views of the Julian Alps.',
  },
  {
    id: 'si-002',
    name: 'Soca Valley Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 48,
    rating: 9.1,
    difficulty: 'Moderate',
    type: 'Valley',
    description:
      'A stunning drive alongside the emerald-green Soca River through a dramatic alpine valley.',
  },
  {
    id: 'si-003',
    name: 'Slovenian Coastal Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 47,
    rating: 8.2,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      'A scenic coastal route connecting Koper, Izola, Piran and Portoroz along the Adriatic.',
  },
  {
    id: 'si-004',
    name: 'Pohorje Mountain Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 38,
    rating: 7.8,
    difficulty: 'Moderate',
    type: 'Forest',
    description:
      'A winding forest road through the Pohorje massif, popular with cyclists and nature lovers.',
  },
  {
    id: 'si-005',
    name: 'Jezersko Valley Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 22,
    rating: 8.5,
    difficulty: 'Moderate',
    type: 'Valley',
    description:
      'A peaceful alpine valley road leading to the remote Jezersko village beneath the Kamnik Alps.',
  },
  {
    id: 'si-006',
    name: 'Pokljuka Plateau Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 30,
    rating: 8.0,
    difficulty: 'Moderate',
    type: 'Plateau',
    description:
      'A serene drive across the Pokljuka plateau in Triglav National Park, surrounded by dense spruce forests.',
  },
  {
    id: 'si-007',
    name: 'Mangart Saddle Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 12,
    rating: 9.2,
    difficulty: 'Expert',
    type: 'Pass',
    description:
      'The highest road in Slovenia, a narrow toll road climbing to 2,072 m with vertiginous views of the Julian Alps.',
  },
  {
    id: 'si-008',
    name: 'Logar Valley Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 10,
    rating: 8.8,
    difficulty: 'Easy',
    type: 'Valley',
    description:
      'A glacial valley road in the Kamnik-Savinja Alps, often called one of the most beautiful valleys in Europe.',
  },
  {
    id: 'si-009',
    name: 'Kranjska Gora Valley Road',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 20,
    rating: 8.6,
    difficulty: 'Easy',
    type: 'Valley',
    description:
      'A picturesque valley road in the heart of the Julian Alps, leading to the popular ski resort of Kranjska Gora.',
  },

  // -- Croatia (8) ------------------------------------------------------------
  {
    id: 'hr-001',
    name: 'Adriatic Coastal Road (Jadranska magistrala)',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 650,
    rating: 9.6,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      "One of Europe's most celebrated coastal drives, hugging the Dalmatian coast with island panoramas at every turn.",
  },
  {
    id: 'hr-002',
    name: 'Gorski Kotar Mountain Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 90,
    rating: 8.3,
    difficulty: 'Moderate',
    type: 'Forest',
    description:
      "A lush mountain route through Croatia's Green Highland, passing dense beech and fir forests.",
  },
  {
    id: 'hr-003',
    name: 'Lika Scenic Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 120,
    rating: 8.0,
    difficulty: 'Easy',
    type: 'Scenic',
    description:
      'A tranquil drive through the karst Lika region, passing near Plitvice Lakes and traditional villages.',
  },
  {
    id: 'hr-004',
    name: 'Peljesac Peninsula Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 92,
    rating: 8.7,
    difficulty: 'Moderate',
    type: 'Coastal',
    description:
      'A dramatic coastal road along the Peljesac peninsula, flanked by vineyards and the Adriatic Sea.',
  },
  {
    id: 'hr-005',
    name: 'Velebit Mountain Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 110,
    rating: 8.9,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      "A dramatic road traversing the Velebit massif, Croatia's largest mountain range, with views of the Adriatic.",
  },
  {
    id: 'hr-006',
    name: 'Ucka Tunnel Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 28,
    rating: 7.6,
    difficulty: 'Easy',
    type: 'Mountain',
    description:
      'The scenic approach road over Ucka mountain in Istria, offering panoramic views of the Kvarner Gulf.',
  },
  {
    id: 'hr-007',
    name: 'Biokovo Skywalk Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 23,
    rating: 9.0,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A thrilling ascent up the Biokovo massif above Makarska, ending at a glass skywalk 1,228 m above the sea.',
  },
  {
    id: 'hr-008',
    name: 'Plitvice Lakes Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 35,
    rating: 8.5,
    difficulty: 'Easy',
    type: 'Forest',
    description:
      "A forested road through the UNESCO-listed Plitvice Lakes National Park, Croatia's most visited natural wonder.",
  },

  // -- Bosnia & Herzegovina (6) -----------------------------------------------
  {
    id: 'ba-001',
    name: 'Cabulja Mountain Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 35,
    rating: 8.1,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A rugged mountain road climbing Cabulja near Mostar, rewarding drivers with sweeping Herzegovinian views.',
  },
  {
    id: 'ba-002',
    name: 'Prenj Mountain Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 55,
    rating: 8.9,
    difficulty: 'Expert',
    type: 'Mountain',
    description:
      'One of the wildest roads in the Balkans, traversing the Herzegovinian Alps with sheer cliffs and raw scenery.',
  },
  {
    id: 'ba-003',
    name: 'Vlasic Plateau Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 42,
    rating: 8.4,
    difficulty: 'Moderate',
    type: 'Plateau',
    description:
      'A high-altitude plateau road above Travnik offering panoramic views across central Bosnia.',
  },
  {
    id: 'ba-004',
    name: 'Bjelasnica Mountain Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 30,
    rating: 8.2,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      'A scenic road to the 1984 Winter Olympics mountain above Sarajevo, with sweeping views over the city.',
  },
  {
    id: 'ba-005',
    name: 'Neretva Canyon Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 75,
    rating: 8.7,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      'A spectacular road following the emerald Neretva River through a deep limestone canyon in Herzegovina.',
  },
  {
    id: 'ba-006',
    name: 'Una River Canyon Road',
    country: 'BA',
    flag: '🇧🇦',
    lengthKm: 65,
    rating: 8.6,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      'A scenic road along the crystal-clear Una River through Una National Park in northwestern Bosnia.',
  },

  // -- Montenegro (7) ---------------------------------------------------------
  {
    id: 'me-001',
    name: 'Lovcen Serpentine Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 18,
    rating: 9.0,
    difficulty: 'Hard',
    type: 'Serpentine',
    description:
      'A legendary serpentine road with 25 tight hairpin bends climbing Mount Lovcen above Kotor Bay.',
  },
  {
    id: 'me-002',
    name: 'Durmitor Ring Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 65,
    rating: 9.3,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A spectacular loop around Durmitor National Park, passing glacial lakes and towering peaks.',
  },
  {
    id: 'me-003',
    name: 'Piva Canyon Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 57,
    rating: 9.5,
    difficulty: 'Hard',
    type: 'Canyon',
    description:
      'A breathtaking road carved through the Piva Canyon, one of the deepest canyons in Europe.',
  },
  {
    id: 'me-004',
    name: 'Kotor Bay Coastal Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 30,
    rating: 9.2,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      'A picturesque drive encircling the UNESCO-listed Bay of Kotor with medieval towns at every stop.',
  },
  {
    id: 'me-005',
    name: 'Tara River Canyon Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 82,
    rating: 9.1,
    difficulty: 'Hard',
    type: 'Canyon',
    description:
      "A road alongside Europe's deepest canyon, the Tara River Canyon, a UNESCO World Heritage Site.",
  },
  {
    id: 'me-006',
    name: 'Prokletije Alpine Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 45,
    rating: 8.6,
    difficulty: 'Expert',
    type: 'Mountain',
    description:
      "A remote road into the Prokletije (Accursed Mountains), Montenegro's wildest and most untouched alpine region.",
  },
  {
    id: 'me-007',
    name: 'Skadar Lake Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 50,
    rating: 8.3,
    difficulty: 'Easy',
    type: 'Lakeside',
    description:
      "A scenic road along the shores of Lake Skadar, the Balkans' largest lake, shared with Albania.",
  },

  // -- Serbia (6) -------------------------------------------------------------
  {
    id: 'rs-001',
    name: 'Zlatibor Mountain Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 55,
    rating: 7.9,
    difficulty: 'Easy',
    type: 'Plateau',
    description:
      'A gentle mountain road across the rolling Zlatibor plateau, famous for its fresh air and traditional ethno villages.',
  },
  {
    id: 'rs-002',
    name: 'Tara Canyon Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 70,
    rating: 8.8,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      'A winding road through Tara National Park alongside the deep Drina River canyon and dense pine forests.',
  },
  {
    id: 'rs-003',
    name: 'Kopaonik Summit Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 45,
    rating: 8.2,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      "A scenic ascent to Serbia's highest ski resort, crossing alpine meadows and spruce forests.",
  },
  {
    id: 'rs-004',
    name: 'Derdap Gorge Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 100,
    rating: 8.5,
    difficulty: 'Easy',
    type: 'Canyon',
    description:
      "A road through the Iron Gates gorge along the Danube, one of Europe's largest river gorges, bordering Romania.",
  },
  {
    id: 'rs-005',
    name: 'Stara Planina Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 60,
    rating: 7.8,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      'A scenic road through the Old Mountain range in eastern Serbia, known for its waterfalls and meadows.',
  },
  {
    id: 'rs-006',
    name: 'Uvac Canyon Road',
    country: 'RS',
    flag: '🇷🇸',
    lengthKm: 40,
    rating: 8.4,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      'A winding road to the Uvac Canyon in southwestern Serbia, home to the last colony of griffon vultures.',
  },

  // -- North Macedonia (5) ----------------------------------------------------
  {
    id: 'mk-001',
    name: 'Ohrid Lake Road',
    country: 'MK',
    flag: '🇲🇰',
    lengthKm: 88,
    rating: 8.6,
    difficulty: 'Easy',
    type: 'Lakeside',
    description:
      "A beautiful lakeside drive around one of Europe's oldest and deepest lakes, a UNESCO World Heritage Site.",
  },
  {
    id: 'mk-002',
    name: 'Mavrovo National Park Road',
    country: 'MK',
    flag: '🇲🇰',
    lengthKm: 60,
    rating: 8.4,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      'A dramatic mountain road through Mavrovo National Park, passing the iconic submerged church of St. Nicholas.',
  },
  {
    id: 'mk-003',
    name: 'Galicica Mountain Road',
    country: 'MK',
    flag: '🇲🇰',
    lengthKm: 40,
    rating: 8.7,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A high mountain road through Galicica National Park between Lake Ohrid and Lake Prespa.',
  },
  {
    id: 'mk-004',
    name: 'Matka Canyon Road',
    country: 'MK',
    flag: '🇲🇰',
    lengthKm: 15,
    rating: 8.0,
    difficulty: 'Easy',
    type: 'Canyon',
    description:
      "A short but beautiful road into the Matka Canyon near Skopje, one of North Macedonia's oldest artificial lakes.",
  },
  {
    id: 'mk-005',
    name: 'Pelister National Park Road',
    country: 'MK',
    flag: '🇲🇰',
    lengthKm: 28,
    rating: 8.1,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      'A mountain road through Pelister National Park near Bitola, home to the rare Macedonian pine.',
  },

  // -- Albania (5) ------------------------------------------------------------
  {
    id: 'al-001',
    name: 'SH8 Coastal Highway',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 180,
    rating: 8.7,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      "Albania's stunning Riviera highway connecting Vlore to Sarande, with turquoise waters and dramatic cliffs.",
  },
  {
    id: 'al-002',
    name: 'Valbona Valley Road',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 32,
    rating: 9.0,
    difficulty: 'Hard',
    type: 'Valley',
    description:
      'A remote and spectacular road into the Valbona Valley in the Albanian Alps, known as the Accursed Mountains.',
  },
  {
    id: 'al-003',
    name: 'Theth Mountain Road',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 28,
    rating: 8.8,
    difficulty: 'Expert',
    type: 'Mountain',
    description:
      "One of Albania's most adventurous roads, a rough track through the Theth National Park with epic alpine scenery.",
  },
  {
    id: 'al-004',
    name: 'Llogara Pass Road',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 20,
    rating: 9.2,
    difficulty: 'Hard',
    type: 'Pass',
    description:
      'A dramatic serpentine road over the Llogara Pass at 1,027 m, with stunning views of the Albanian Riviera.',
  },
  {
    id: 'al-005',
    name: 'Komani Lake Road',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 55,
    rating: 8.5,
    difficulty: 'Hard',
    type: 'Lakeside',
    description:
      'A remote mountain road to the Komani Lake ferry, winding through dramatic gorges in northern Albania.',
  },

  // -- Bulgaria (5) -----------------------------------------------------------
  {
    id: 'bg-001',
    name: 'Thracian Cliffs Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 70,
    rating: 8.0,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      'A scenic Black Sea coastal road along the dramatic Thracian Cliffs, passing vineyards and ancient ruins.',
  },
  {
    id: 'bg-002',
    name: 'Rila Mountain Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 80,
    rating: 8.9,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      "A challenging mountain road through the Rila range, home to Bulgaria's highest peak and the famous Rila Monastery.",
  },
  {
    id: 'bg-003',
    name: 'Rhodope Mountain Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 150,
    rating: 8.3,
    difficulty: 'Moderate',
    type: 'Forest',
    description:
      'A mystical forest road winding through the Rhodope Mountains, steeped in Thracian legend and folklore.',
  },
  {
    id: 'bg-004',
    name: 'Shipka Pass Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 30,
    rating: 8.4,
    difficulty: 'Moderate',
    type: 'Pass',
    description:
      'A historic mountain pass road through the Balkan Mountains, site of a decisive battle in the Russo-Turkish War.',
  },
  {
    id: 'bg-005',
    name: 'Belogradchik Rocks Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 45,
    rating: 7.9,
    difficulty: 'Easy',
    type: 'Scenic',
    description:
      'A scenic road through the bizarre sandstone rock formations of Belogradchik in northwest Bulgaria.',
  },

  // -- Romania (6) ------------------------------------------------------------
  {
    id: 'ro-001',
    name: 'Transfagarasan Highway',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 90,
    rating: 9.8,
    difficulty: 'Hard',
    type: 'Pass',
    description:
      "Voted the world's greatest driving road by Top Gear, crossing the Carpathians at 2,042 m with 830 curves.",
  },
  {
    id: 'ro-002',
    name: 'Transalpina Highway',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 148,
    rating: 9.5,
    difficulty: 'Hard',
    type: 'Pass',
    description:
      "Romania's highest road, reaching 2,145 m at Urdele Pass, offering dramatic views across the Southern Carpathians.",
  },
  {
    id: 'ro-003',
    name: 'Transbucegi Road',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 35,
    rating: 8.7,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A thrilling road climbing the Bucegi Plateau above Sinaia, passing the iconic Sphinx rock formation.',
  },
  {
    id: 'ro-004',
    name: 'Bicaz Gorges Road',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 26,
    rating: 9.0,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      "A spectacular road through the Bicaz Gorges, one of Romania's most dramatic natural passages with 300 m cliffs.",
  },
  {
    id: 'ro-005',
    name: 'Apuseni Mountains Road',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 120,
    rating: 8.3,
    difficulty: 'Moderate',
    type: 'Mountain',
    description:
      'A winding road through the Apuseni Mountains in Transylvania, passing caves, gorges and traditional villages.',
  },
  {
    id: 'ro-006',
    name: 'Danube Delta Road',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 85,
    rating: 7.7,
    difficulty: 'Easy',
    type: 'Scenic',
    description:
      'A flat scenic road through the Danube Delta biosphere reserve, a UNESCO World Heritage Site.',
  },

  // -- Greece (6) -------------------------------------------------------------
  {
    id: 'gr-001',
    name: 'Meteora Monastery Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 25,
    rating: 9.1,
    difficulty: 'Moderate',
    type: 'Scenic',
    description:
      'A winding road among the towering sandstone pillars of Meteora, connecting the UNESCO World Heritage monasteries.',
  },
  {
    id: 'gr-002',
    name: 'Pindos Mountain Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 160,
    rating: 8.8,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'A remote and rugged road through the Pindos range, the spine of Greece, passing traditional stone villages.',
  },
  {
    id: 'gr-003',
    name: 'Vikos Gorge Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 45,
    rating: 8.9,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      "A road skirting the world's deepest gorge by wall height, passing traditional Zagori stone villages.",
  },
  {
    id: 'gr-004',
    name: 'Mani Peninsula Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 70,
    rating: 8.5,
    difficulty: 'Moderate',
    type: 'Coastal',
    description:
      'A rugged coastal road through the wild Mani Peninsula in the Peloponnese, dotted with tower houses.',
  },
  {
    id: 'gr-005',
    name: 'Mount Olympus Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 22,
    rating: 8.6,
    difficulty: 'Hard',
    type: 'Mountain',
    description:
      'The access road to the home of the Greek gods, climbing through dense forests to the Prionia trailhead.',
  },
  {
    id: 'gr-006',
    name: 'Samaria Gorge Road',
    country: 'GR',
    flag: '🇬🇷',
    lengthKm: 18,
    rating: 8.3,
    difficulty: 'Moderate',
    type: 'Canyon',
    description:
      "The approach road to the Samaria Gorge in Crete, one of Europe's longest gorges and a national park.",
  },
];

/**
 * Returns all 63 seeded BalkanRoad instances.
 * Optionally override properties on the first road for testing purposes.
 */
export function mockBalkanRoads(override: Partial<PlainBalkanRoad> = {}): BalkanRoad[] {
  return SEEDED_ROADS.map((plain, index) =>
    BalkanRoad.from(index === 0 ? { ...plain, ...override } : plain),
  );
}

/**
 * Returns a single mock BalkanRoad with optional property overrides.
 */
export function mockBalkanRoad(override: Partial<PlainBalkanRoad> = {}): BalkanRoad {
  return BalkanRoad.from({ ...SEEDED_ROADS[0], ...override });
}

export { SEEDED_ROADS };
