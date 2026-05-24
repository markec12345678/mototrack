import type { BalkanTour } from '../app-types.js';

/** 10 iconic Balkan motorcycle tours with real GPS waypoints. */
export const BALKAN_TOURS: BalkanTour[] = [
  {
    id: 'soca-vrsic',
    country: 'Slovenija',
    flag: '🇸🇮',
    name: 'Soška dolina & Vršič Full Loop',
    distanceKm: 120,
    rating: 9.8,
    difficulty: 'hard',
    description: '12 GPS točk, Tolmin→Kobarid→Bovec→Vršič→Kranjska Gora→Trenta→Bovec. Legendarni 50 serpentin Vršič.',
    waypoints: [
      { lat: 46.1828, lng: 13.7301 }, // Tolmin
      { lat: 46.2477, lng: 13.5784 }, // Kobarid
      { lat: 46.3380, lng: 13.5526 }, // Bovec
      { lat: 46.4365, lng: 13.7395 }, // Vršič pass
      { lat: 46.4836, lng: 13.7795 }, // Kranjska Gora
      { lat: 46.3744, lng: 13.7559 }, // Trenta
      { lat: 46.3380, lng: 13.5526 }, // Bovec
    ],
  },
  {
    id: 'kotor-lovcen',
    country: 'Črna Gora',
    flag: '🇲🇪',
    name: 'Kotor-Lovćen-Skadar Loop',
    distanceKm: 140,
    rating: 9.9,
    difficulty: 'expert',
    description: '25 ozkih serpentin nad Kotorskim zalivom. Najtežja in najlepša balkanska tura.',
    waypoints: [
      { lat: 42.4247, lng: 18.7712 }, // Kotor
      { lat: 42.4046, lng: 18.8395 }, // Lovćen
      { lat: 42.3911, lng: 18.9215 }, // Cetinje
      { lat: 42.2417, lng: 19.0890 }, // Skadar lake
      { lat: 42.2867, lng: 18.8400 }, // Budva
    ],
  },
  {
    id: 'transfagarasan',
    country: 'Romunija',
    flag: '🇷🇴',
    name: 'Transfăgărășan',
    distanceKm: 170,
    rating: 10.0,
    difficulty: 'hard',
    description: 'Top Gearjeva najljubša cesta. 2034m, Bâlea jezero, neskončne serpentine.',
    waypoints: [
      { lat: 45.2300, lng: 24.2376 }, // Băile Olănești
      { lat: 45.1395, lng: 24.6754 }, // Curtea de Argeș
      { lat: 45.6042, lng: 24.6190 }, // Bâlea Lake
      { lat: 45.7983, lng: 24.1255 }, // Sibiu
    ],
  },
  {
    id: 'albanian-riviera',
    country: 'Albanija',
    flag: '🇦🇱',
    name: 'Albanska riviera: Vlorë-Sarandë',
    distanceKm: 150,
    rating: 9.2,
    difficulty: 'medium',
    description: 'Prelaz Llogara (1027m), divja obala, Ksamil. SH8 magistrala.',
    waypoints: [
      { lat: 40.4686, lng: 19.4914 }, // Vlorë
      { lat: 40.2042, lng: 19.5783 }, // Llogara pass
      { lat: 40.1432, lng: 19.6480 }, // Dhërmi
      { lat: 40.1019, lng: 19.7459 }, // Himarë
      { lat: 39.8754, lng: 20.0050 }, // Sarandë
      { lat: 39.7757, lng: 20.0050 }, // Ksamil
    ],
  },
  {
    id: 'rodopi',
    country: 'Bolgarija',
    flag: '🇧🇬',
    name: 'Rodopske gore: Pamporovo-Dospat',
    distanceKm: 130,
    rating: 9.1,
    difficulty: 'medium',
    description: 'Pamporovo→Trigrad→Dospat. Skrivnostne soteske in jame.',
    waypoints: [
      { lat: 41.6406, lng: 24.6814 }, // Pamporovo
      { lat: 41.6772, lng: 24.4569 }, // Shiroka Laka
      { lat: 41.7437, lng: 24.4006 }, // Devin
      { lat: 41.6300, lng: 24.3700 }, // Yagodina cave
      { lat: 41.6135, lng: 24.3760 }, // Trigrad
      { lat: 41.6534, lng: 24.1639 }, // Dospat
    ],
  },
  {
    id: 'peljesac',
    country: 'Hrvaška',
    flag: '🇭🇷',
    name: 'Pelješki polotok',
    distanceKm: 130,
    rating: 8.8,
    difficulty: 'medium',
    description: 'Ston→Dingač→Orebić. Vinske ceste in pogled na Korčulo.',
    waypoints: [
      { lat: 42.8366, lng: 17.7008 }, // Ston
      { lat: 42.8389, lng: 17.6911 }, // Mali Ston
      { lat: 42.9395, lng: 17.4250 }, // Dingač
      { lat: 42.9116, lng: 17.3617 }, // Trstenik
      { lat: 42.9747, lng: 17.1808 }, // Orebić
      { lat: 42.9892, lng: 17.0428 }, // Lovište
    ],
  },
  {
    id: 'cabulja-prenj',
    country: 'Bosna in Hercegovina',
    flag: '🇧🇦',
    name: 'Čabulja-Prenj gorska zanka',
    distanceKm: 110,
    rating: 9.0,
    difficulty: 'hard',
    description: 'Mostar→Blagaj→Konjic. Divje gorske ceste BiH.',
    waypoints: [
      { lat: 43.3438, lng: 17.8078 }, // Mostar
      { lat: 43.2569, lng: 17.8869 }, // Blagaj
      { lat: 43.5500, lng: 17.7000 }, // Čabulja
      { lat: 43.6519, lng: 17.9614 }, // Konjic
      { lat: 43.6608, lng: 17.7600 }, // Jablanica
    ],
  },
  {
    id: 'mavrovo-debar',
    country: 'Severna Makedonija',
    flag: '🇲🇰',
    name: 'Mavrovo-Debar soteska',
    distanceKm: 120,
    rating: 8.9,
    difficulty: 'medium',
    description: 'Skopje→Mavrovo→Debar. Radika soteska in narodni park.',
    waypoints: [
      { lat: 41.9981, lng: 21.4254 }, // Skopje
      { lat: 42.0103, lng: 20.9712 }, // Tetovo
      { lat: 41.6885, lng: 20.7424 }, // Mavrovo lake
      { lat: 41.5189, lng: 20.5267 }, // Debar
    ],
  },
  {
    id: 'zlatibor-tara',
    country: 'Srbija',
    flag: '🇷🇸',
    name: 'Zlatibor-Tara narodni park',
    distanceKm: 140,
    rating: 9.1,
    difficulty: 'medium',
    description: 'Užice→Mokra Gora→Tara. Šargan 8 in narodni park.',
    waypoints: [
      { lat: 43.8556, lng: 19.8425 }, // Užice
      { lat: 43.7283, lng: 19.6997 }, // Zlatibor
      { lat: 43.7956, lng: 19.4972 }, // Mokra Gora
      { lat: 43.8989, lng: 19.4097 }, // Tara
      { lat: 43.9692, lng: 19.5575 }, // Bajina Bašta
    ],
  },
  {
    id: 'meteora-pind',
    country: 'Grčija',
    flag: '🇬🇷',
    name: 'Meteora-Pind gorska ruta',
    distanceKm: 150,
    rating: 9.5,
    difficulty: 'medium',
    description: 'Kalambaka→Meteora→Pind prehod→Ioannina. Skalni samostani in epirske gore.',
    waypoints: [
      { lat: 39.7066, lng: 21.6303 }, // Kalambaka
      { lat: 39.7217, lng: 21.6306 }, // Meteora
      { lat: 39.7600, lng: 21.2000 }, // Pind pass
      { lat: 39.7669, lng: 21.1814 }, // Metsovo
      { lat: 39.6650, lng: 20.8537 }, // Ioannina
    ],
  },
];
