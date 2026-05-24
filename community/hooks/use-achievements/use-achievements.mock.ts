import { AchievementProgress, mockAchievementProgress } from '@markec/community.entities.achievement';

/**
 * Mock achievement progress data for testing and composition previews.
 * Covers all 12 seeded achievements with realistic progress values.
 * IDs match the seeded achievement IDs for easy lookup.
 */
export const mockAchievements: AchievementProgress[] = [
  mockAchievementProgress({ id: 'vrsic-conqueror', achievementId: 'vrsic-conqueror', name: 'Vršič Conqueror', icon: '🏔️', unlocked: true, progressPct: 100, unlockedAt: 1710000000000 }),
  mockAchievementProgress({ id: '1000-km-klub', achievementId: '1000-km-klub', name: '1000 km Klub', icon: '🛣️', unlocked: true, progressPct: 100, unlockedAt: 1712000000000 }),
  mockAchievementProgress({ id: 'zgodnja-ptica', achievementId: 'zgodnja-ptica', name: 'Zgodnja Ptica', icon: '🌅', unlocked: false, progressPct: 60 }),
  mockAchievementProgress({ id: 'kotor-master', achievementId: 'kotor-master', name: 'Kotor Master', icon: '🌊', unlocked: false, progressPct: 33 }),
  mockAchievementProgress({ id: 'mokra-voznja', achievementId: 'mokra-voznja', name: 'Mokra Vožnja', icon: '🌧️', unlocked: false, progressPct: 80 }),
  mockAchievementProgress({ id: 'transfagarasan', achievementId: 'transfagarasan', name: 'Transfăgărășan', icon: '🇷🇴', unlocked: true, progressPct: 100, unlockedAt: 1714000000000 }),
  mockAchievementProgress({ id: 'balkanski-popotnik', achievementId: 'balkanski-popotnik', name: 'Balkanski Popotnik', icon: '🗺️', unlocked: false, progressPct: 40 }),
  mockAchievementProgress({ id: '30-dnevna-serija', achievementId: '30-dnevna-serija', name: '30-dnevna Serija', icon: '🔥', unlocked: false, progressPct: 17 }),
  mockAchievementProgress({ id: 'twisty-rider', achievementId: 'twisty-rider', name: 'Twisty Rider', icon: '〰️', unlocked: false, progressPct: 55 }),
  mockAchievementProgress({ id: 'cestni-bratec', achievementId: 'cestni-bratec', name: 'Cestni Bratec', icon: '🤝', unlocked: true, progressPct: 100, unlockedAt: 1716000000000 }),
  mockAchievementProgress({ id: 'pomocnik-skupnosti', achievementId: 'pomocnik-skupnosti', name: 'Pomočnik Skupnosti', icon: '⛽', unlocked: false, progressPct: 30 }),
  mockAchievementProgress({ id: 'stroski-pod-kontrolo', achievementId: 'stroski-pod-kontrolo', name: 'Stroški pod kontrolo', icon: '💰', unlocked: false, progressPct: 8 }),
];
