/** Mock achievement entries shown on the profile. */
export type Achievement = {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', icon: '🏔️', name: 'Vršič Conqueror', description: 'Premagaj 50 serpentin Vršiča', unlocked: true },
  { id: 'a2', icon: '🛣️', name: '1000 km klub', description: 'Prevozi 1000 km', unlocked: true },
  { id: 'a3', icon: '🌅', name: 'Zgodnja ptica', description: 'Začni vožnjo pred 6:00', unlocked: true },
  { id: 'a4', icon: '🇲🇪', name: 'Kotor Master', description: 'Prevozi Kotor serpentine', unlocked: true },
  { id: 'a5', icon: '🌧️', name: 'Mokra vožnja', description: 'Vozi v dežju 100km', unlocked: false, progress: 67 },
  { id: 'a6', icon: '🏆', name: 'Transfăgărășan', description: 'Prevozi celotno Transfăgărășan', unlocked: false, progress: 0 },
  { id: 'a7', icon: '🌍', name: 'Balkanski popotnik', description: 'Obišči vse balkanske države', unlocked: false, progress: 40 },
  { id: 'a8', icon: '🔥', name: '30-dnevna serija', description: '30 dni zapored', unlocked: false, progress: 80 },
];
