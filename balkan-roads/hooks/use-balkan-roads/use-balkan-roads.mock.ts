import { BalkanRoad } from '@markec/balkan-roads.entities.balkan-road';

export const mockRoads: BalkanRoad[] = [
  BalkanRoad.from({
    id: 'si-vrsic-pass',
    name: 'Vršič Pass',
    country: 'SI',
    flag: '🇸🇮',
    lengthKm: 25,
    rating: 9.4,
    difficulty: 'Hard',
    type: 'Pass',
    description:
      'The highest mountain pass in Slovenia, with 50 hairpin bends carved through the Julian Alps. A legendary ride offering breathtaking views of Triglav.',
  }),
  BalkanRoad.from({
    id: 'hr-adriatic-coast',
    name: 'Adriatic Coastal Road',
    country: 'HR',
    flag: '🇭🇷',
    lengthKm: 178,
    rating: 9.1,
    difficulty: 'Easy',
    type: 'Coastal',
    description:
      'The iconic Croatian coastal highway hugging the Dalmatian coast, with turquoise Adriatic waters on one side and rugged limestone cliffs on the other.',
  }),
  BalkanRoad.from({
    id: 'ro-transfagarasan',
    name: 'Transfăgărășan',
    country: 'RO',
    flag: '🇷🇴',
    lengthKm: 90,
    rating: 9.8,
    difficulty: 'Expert',
    type: 'Pass',
    description:
      'Romania\'s most dramatic road, cutting through the Carpathian Mountains at 2,042 m. Immortalised by Top Gear as the world\'s best driving road.',
  }),
  BalkanRoad.from({
    id: 'me-lovcen',
    name: 'Lovćen Mountain Road',
    country: 'ME',
    flag: '🇲🇪',
    lengthKm: 18,
    rating: 8.9,
    difficulty: 'Moderate',
    type: 'Serpentine',
    description:
      'A serpentine road climbing to the Lovćen National Park mausoleum, with panoramic views over Kotor Bay and the Adriatic.',
  }),
  BalkanRoad.from({
    id: 'al-sh8',
    name: 'SH8 Albanian Riviera',
    country: 'AL',
    flag: '🇦🇱',
    lengthKm: 106,
    rating: 8.7,
    difficulty: 'Moderate',
    type: 'Coastal',
    description:
      'A spectacular coastal road along the Albanian Riviera, passing through pristine beaches, olive groves, and ancient hilltop villages.',
  }),
  BalkanRoad.from({
    id: 'bg-rila',
    name: 'Rila Mountain Road',
    country: 'BG',
    flag: '🇧🇬',
    lengthKm: 55,
    rating: 8.5,
    difficulty: 'Hard',
    type: 'Forest',
    description:
      'A winding mountain road through the Rila massif, home to Bulgaria\'s highest peaks and the famous Rila Monastery.',
  }),
];

export const mockRoadsEasy: BalkanRoad[] = mockRoads.filter((r) => r.difficulty === 'Easy');
export const mockRoadsHard: BalkanRoad[] = mockRoads.filter((r) => r.difficulty === 'Hard');
export const mockRoadsSlovenia: BalkanRoad[] = mockRoads.filter((r) => r.country === 'SI');
export const mockRoadsCroatia: BalkanRoad[] = mockRoads.filter((r) => r.country === 'HR');
