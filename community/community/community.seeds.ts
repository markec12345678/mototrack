/**
 * Demo data seeded by the Community aspect on first startup.
 * Includes the demo user (markec / Markec / SI) plus a variety of
 * Balkan riders, achievements, challenges, feed activity, routes,
 * fuel reports and one upcoming group ride.
 */

const DEMO_USER_ID = 'user-markec';

const now = () => Date.now();
const days = (n: number) => n * 24 * 60 * 60 * 1000;

/**
 * ── Leaderboard (8 riders, demo user at rank 6) ──────────────────────────
 */
export const leaderboardSeed = [
  {
    id: 'lb-weekly-1',
    rank: 1,
    userId: 'user-nikola',
    displayName: 'Nikola Petrović',
    country: 'RS',
    km: 1842,
    rides: 14,
    points: 12480,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-2',
    rank: 2,
    userId: 'user-luka',
    displayName: 'Luka Horvat',
    country: 'HR',
    km: 1620,
    rides: 12,
    points: 11050,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-3',
    rank: 3,
    userId: 'user-jana',
    displayName: 'Jana Novak',
    country: 'SI',
    km: 1438,
    rides: 11,
    points: 9820,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-4',
    rank: 4,
    userId: 'user-arben',
    displayName: 'Arben Berisha',
    country: 'AL',
    km: 1280,
    rides: 9,
    points: 8640,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-5',
    rank: 5,
    userId: 'user-stefan',
    displayName: 'Stefan Đorđević',
    country: 'ME',
    km: 1112,
    rides: 8,
    points: 7560,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-6',
    rank: 6,
    userId: DEMO_USER_ID,
    displayName: 'Markec',
    country: 'SI',
    km: 968,
    rides: 7,
    points: 5430,
    period: 'weekly',
    me: true,
  },
  {
    id: 'lb-weekly-7',
    rank: 7,
    userId: 'user-andrei',
    displayName: 'Andrei Popescu',
    country: 'RO',
    km: 842,
    rides: 6,
    points: 4720,
    period: 'weekly',
    me: false,
  },
  {
    id: 'lb-weekly-8',
    rank: 8,
    userId: 'user-blagoj',
    displayName: 'Blagoj Stojanovski',
    country: 'MK',
    km: 720,
    rides: 5,
    points: 3980,
    period: 'weekly',
    me: false,
  },
];

/**
 * ── Achievements (12 entries, some unlocked for the demo user) ───────────
 */
export const achievementSeed = [
  {
    id: 'ach-vrsic',
    userId: DEMO_USER_ID,
    name: 'Vršič Conqueror',
    description: 'Prevozi vseh 50 serpentin prelaza Vršič.',
    icon: '🏔️',
    unlocked: true,
    progressPct: 100,
    unlockedAt: now() - days(14),
  },
  {
    id: 'ach-1000km',
    userId: DEMO_USER_ID,
    name: '1000 km Klub',
    description: 'Prevozi 1000 km v enem mesecu.',
    icon: '🛣️',
    unlocked: true,
    progressPct: 100,
    unlockedAt: now() - days(28),
  },
  {
    id: 'ach-early-bird',
    userId: DEMO_USER_ID,
    name: 'Zgodnja Ptica',
    description: 'Začni vožnjo pred 6. uro zjutraj.',
    icon: '🌅',
    unlocked: true,
    progressPct: 100,
    unlockedAt: now() - days(5),
  },
  {
    id: 'ach-kotor',
    userId: DEMO_USER_ID,
    name: 'Kotor Master',
    description: 'Prevozi Lovćen serpentine v Črni gori.',
    icon: '🇲🇪',
    unlocked: true,
    progressPct: 100,
    unlockedAt: now() - days(46),
  },
  {
    id: 'ach-wet',
    userId: DEMO_USER_ID,
    name: 'Mokra Vožnja',
    description: 'Dokončaj vožnjo v dežju.',
    icon: '🌧️',
    unlocked: true,
    progressPct: 100,
    unlockedAt: now() - days(9),
  },
  {
    id: 'ach-transfag',
    userId: DEMO_USER_ID,
    name: 'Transfăgărășan',
    description: 'Prevozi celotno cesto Transfăgărășan v Romuniji.',
    icon: '🇷🇴',
    unlocked: false,
    progressPct: 35,
  },
  {
    id: 'ach-balkan',
    userId: DEMO_USER_ID,
    name: 'Balkanski Popotnik',
    description: 'Obišči vse balkanske države z motorjem.',
    icon: '🗺️',
    unlocked: false,
    progressPct: 62,
  },
  {
    id: 'ach-streak',
    userId: DEMO_USER_ID,
    name: '30-dnevna Serija',
    description: 'Vozi vsak dan 30 dni zapored.',
    icon: '🔥',
    unlocked: false,
    progressPct: 47,
  },
  {
    id: 'ach-twisty',
    userId: DEMO_USER_ID,
    name: 'Twisty Rider',
    description: 'Prevozi 500 km ovinkastih cest.',
    icon: '🌀',
    unlocked: false,
    progressPct: 78,
  },
  {
    id: 'ach-bro',
    userId: DEMO_USER_ID,
    name: 'Cestni Bratec',
    description: 'Pomagaj drugemu vozniku ob cesti.',
    icon: '🤝',
    unlocked: false,
    progressPct: 0,
  },
  {
    id: 'ach-helper',
    userId: DEMO_USER_ID,
    name: 'Pomočnik Skupnosti',
    description: 'Prijavi 10 cen goriva v aplikaciji.',
    icon: '⛽',
    unlocked: false,
    progressPct: 20,
  },
  {
    id: 'ach-budget',
    userId: DEMO_USER_ID,
    name: 'Stroški pod kontrolo',
    description: 'Zabeleži stroške vožnje 3 mesece zapored.',
    icon: '💶',
    unlocked: false,
    progressPct: 50,
  },
];

/**
 * ── Challenges (4 active missions) ───────────────────────────────────────
 */
export const challengeSeed = [
  {
    id: 'ch-balkan-tour',
    name: 'Balkanski Tour',
    description: 'Obišči 5 balkanskih držav v 30 dneh.',
    icon: '🗺️',
    points: 2500,
    status: 'active',
    endsAt: now() + days(22),
    participants: 184,
    joined: true,
    progressPct: 40,
  },
  {
    id: 'ch-vrsic-50',
    name: 'Vršič 50 Serpentin',
    description: 'Prevozi vseh 50 serpentin prelaza Vršič v enem dnevu.',
    icon: '🏔️',
    points: 800,
    status: 'active',
    endsAt: now() + days(10),
    participants: 92,
    joined: false,
    progressPct: 0,
  },
  {
    id: 'ch-march',
    name: 'Marec Na Motorju',
    description: 'Prevozi 600 km v marcu.',
    icon: '📅',
    points: 1200,
    status: 'active',
    endsAt: now() + days(31),
    participants: 421,
    joined: true,
    progressPct: 64,
  },
  {
    id: 'ch-morning-streak',
    name: 'Jutranja Serija',
    description: 'Začni vožnjo pred 7. uro 7 dni zapored.',
    icon: '🌅',
    points: 500,
    status: 'active',
    endsAt: now() + days(7),
    participants: 67,
    joined: false,
    progressPct: 0,
  },
];

/**
 * ── Feed (5 latest activities) ───────────────────────────────────────────
 */
export const feedSeed = [
  {
    id: 'feed-1',
    kind: 'ride',
    actor: { id: 'user-nikola', displayName: 'Nikola Petrović', country: 'RS' },
    payload: 'Pravkar je zaključil 142 km vožnjo skozi Tarska soteska. 🏍️',
    at: now() - 1000 * 60 * 12,
  },
  {
    id: 'feed-2',
    kind: 'achievement',
    actor: { id: 'user-jana', displayName: 'Jana Novak', country: 'SI' },
    payload: 'Odklenila dosežek: Vršič Conqueror 🏔️',
    at: now() - 1000 * 60 * 47,
  },
  {
    id: 'feed-3',
    kind: 'route',
    actor: { id: 'user-luka', displayName: 'Luka Horvat', country: 'HR' },
    payload: 'Delil novo skupnostno ruto: Plitvička Jezera Loop (88 km).',
    at: now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'feed-4',
    kind: 'comment',
    actor: { id: 'user-andrei', displayName: 'Andrei Popescu', country: 'RO' },
    payload: 'Komentiral pot Transfăgărășan: "Najlepša cesta v Evropi!"',
    at: now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'feed-5',
    kind: 'ride',
    actor: { id: 'user-stefan', displayName: 'Stefan Đorđević', country: 'ME' },
    payload: 'Zaključil dvodnevno turo Durmitor → Kotor (412 km). 🇲🇪',
    at: now() - 1000 * 60 * 60 * 9,
  },
];

/**
 * ── Community routes (4 curated Balkan rides) ────────────────────────────
 */
export const communityRouteSeed = [
  {
    id: 'route-logarska',
    name: 'Skrita Logarska',
    author: 'Jana Novak',
    country: 'SI',
    distanceKm: 96,
    durationSec: 11400,
    difficulty: 'medium',
    rating: 4.8,
    likes: 312,
    geometry: [
      { lat: 46.39, lng: 14.62 },
      { lat: 46.41, lng: 14.65 },
      { lat: 46.43, lng: 14.68 },
    ],
  },
  {
    id: 'route-durmitor',
    name: 'Durmitor Zanka',
    author: 'Stefan Đorđević',
    country: 'ME',
    distanceKm: 184,
    durationSec: 22800,
    difficulty: 'hard',
    rating: 4.9,
    likes: 487,
    geometry: [
      { lat: 43.14, lng: 19.05 },
      { lat: 43.16, lng: 19.09 },
      { lat: 43.18, lng: 19.12 },
    ],
  },
  {
    id: 'route-plitvice',
    name: 'Plitvička Jezera',
    author: 'Luka Horvat',
    country: 'HR',
    distanceKm: 132,
    durationSec: 15600,
    difficulty: 'easy',
    rating: 4.6,
    likes: 274,
    geometry: [
      { lat: 44.88, lng: 15.61 },
      { lat: 44.9, lng: 15.64 },
      { lat: 44.92, lng: 15.67 },
    ],
  },
  {
    id: 'route-pirin',
    name: 'Pirin Enduro',
    author: 'Blagoj Stojanovski',
    country: 'BG',
    distanceKm: 218,
    durationSec: 28800,
    difficulty: 'expert',
    rating: 4.7,
    likes: 156,
    geometry: [
      { lat: 41.77, lng: 23.43 },
      { lat: 41.8, lng: 23.46 },
      { lat: 41.83, lng: 23.48 },
    ],
  },
];

/**
 * ── Fuel price reports (6 Balkan reports) ────────────────────────────────
 */
export const fuelReportSeed = [
  {
    id: 'fuel-1',
    country: 'SI',
    brand: 'OMV',
    petrolEur: 1.452,
    dieselEur: 1.534,
    location: 'Ljubljana, Dunajska',
    reportedAt: now() - 1000 * 60 * 30,
    confirms: 8,
  },
  {
    id: 'fuel-2',
    country: 'HR',
    brand: 'INA',
    petrolEur: 1.501,
    dieselEur: 1.491,
    location: 'Zagreb, Slavonska',
    reportedAt: now() - 1000 * 60 * 65,
    confirms: 5,
  },
  {
    id: 'fuel-3',
    country: 'RS',
    brand: 'NIS',
    petrolEur: 1.598,
    dieselEur: 1.612,
    location: 'Beograd, Bulevar',
    reportedAt: now() - 1000 * 60 * 120,
    confirms: 12,
  },
  {
    id: 'fuel-4',
    country: 'ME',
    brand: 'Jugopetrol',
    petrolEur: 1.412,
    dieselEur: 1.451,
    location: 'Podgorica Centar',
    reportedAt: now() - 1000 * 60 * 180,
    confirms: 3,
  },
  {
    id: 'fuel-5',
    country: 'BG',
    brand: 'Lukoil',
    petrolEur: 1.342,
    dieselEur: 1.378,
    location: 'Sofija, Tsarigradsko',
    reportedAt: now() - 1000 * 60 * 240,
    confirms: 6,
  },
  {
    id: 'fuel-6',
    country: 'RO',
    brand: 'Petrom',
    petrolEur: 1.398,
    dieselEur: 1.423,
    location: 'București, Calea Victoriei',
    reportedAt: now() - 1000 * 60 * 300,
    confirms: 4,
  },
];

/**
 * ── Group rides (1 upcoming community ride) ──────────────────────────────
 */
export const groupRideSeed = [
  {
    id: 'ride-community-1',
    name: 'Vršič Adventure Ride',
    host: { id: 'user-jana', displayName: 'Jana Novak' },
    startAt: now() + days(3),
    meetingPoint: {
      lat: 46.4307,
      lng: 13.7406,
      label: 'Kranjska Gora, Bencinska črpalka OMV',
    },
    participants: [
      { id: 'user-jana', displayName: 'Jana Novak', status: 'pripravljen' },
      { id: DEMO_USER_ID, displayName: 'Markec', status: 'pripravljen' },
      { id: 'user-luka', displayName: 'Luka Horvat', status: 'pripravljen' },
    ],
    routeId: 'route-logarska',
  },
];

export const DEMO_USER = DEMO_USER_ID;
