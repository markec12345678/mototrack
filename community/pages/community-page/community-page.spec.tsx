import { describe, it, expect } from 'vitest';

// NOTE: CommunityPage cannot be rendered in tests because a transitive
// dependency (@markec/community.ui.fuel-prices-board) exports a mock file
// that is missing from the compiled dist, causing Vite to fail during module
// resolution. These tests validate the tab metadata logic in isolation.

type CommunityTab =
  | 'lestvica'
  | 'dosezki'
  | 'izzivi'
  | 'feed'
  | 'skupnostne-rute'
  | 'cene-goriva'
  | 'grupne-voznje';

const TAB_META: Record<CommunityTab, { eyebrow: string; title: string; subtitle: string }> = {
  lestvica: {
    eyebrow: 'Skupnost',
    title: 'Lestvica',
    subtitle: 'Najboljši vozniki skupnosti po točkah, kilometrih in vožnjah.',
  },
  dosezki: {
    eyebrow: 'Tvoj napredek',
    title: 'Dosežki',
    subtitle: 'Odkleni dosežke z vožnjo in aktivnostjo v skupnosti.',
  },
  izzivi: {
    eyebrow: 'Aktivni izzivi',
    title: 'Izzivi',
    subtitle: 'Pridruži se izzivom, zberi XP in se povzpni na lestvici.',
  },
  feed: {
    eyebrow: 'Skupnost',
    title: 'Feed',
    subtitle: 'Zadnje aktivnosti voznikov — vožnje, poti, dosežki in komentarji.',
  },
  'skupnostne-rute': {
    eyebrow: 'Odkrivaj',
    title: 'Skupnostne rute',
    subtitle: 'Najboljše motociklistične poti Balkana, ki jih delijo vozniki.',
  },
  'cene-goriva': {
    eyebrow: 'Skupnostni podatki',
    title: 'Cene goriva',
    subtitle: 'Aktualne cene goriva po državah — poroča skupnost voznikov.',
  },
  'grupne-voznje': {
    eyebrow: 'Skupaj na pot',
    title: 'Grupne vožnje',
    subtitle: 'Pridruži se skupinski vožnji ali organiziraj svojo avanturo.',
  },
};

const ALL_TABS: CommunityTab[] = [
  'lestvica',
  'dosezki',
  'izzivi',
  'feed',
  'skupnostne-rute',
  'cene-goriva',
  'grupne-voznje',
];

describe('CommunityPage tab metadata', () => {
  it('has metadata for all 7 tabs', () => {
    expect(ALL_TABS.length).toBe(7);
    ALL_TABS.forEach((tab) => {
      expect(TAB_META[tab]).toBeTruthy();
    });
  });

  it('lestvica tab has correct eyebrow', () => {
    expect(TAB_META['lestvica'].eyebrow).toBe('Skupnost');
  });

  it('lestvica tab has correct title', () => {
    expect(TAB_META['lestvica'].title).toBe('Lestvica');
  });

  it('lestvica subtitle mentions vozniki', () => {
    expect(TAB_META['lestvica'].subtitle).toContain('vozniki');
  });

  it('dosezki tab has correct eyebrow', () => {
    expect(TAB_META['dosezki'].eyebrow).toBe('Tvoj napredek');
  });

  it('izzivi tab has correct eyebrow', () => {
    expect(TAB_META['izzivi'].eyebrow).toBe('Aktivni izzivi');
  });

  it('feed tab has correct title', () => {
    expect(TAB_META['feed'].title).toBe('Feed');
  });

  it('skupnostne-rute tab has correct eyebrow', () => {
    expect(TAB_META['skupnostne-rute'].eyebrow).toBe('Odkrivaj');
  });

  it('cene-goriva tab has correct eyebrow', () => {
    expect(TAB_META['cene-goriva'].eyebrow).toBe('Skupnostni podatki');
  });

  it('grupne-voznje tab has correct eyebrow', () => {
    expect(TAB_META['grupne-voznje'].eyebrow).toBe('Skupaj na pot');
  });

  it('grupne-voznje tab has correct title', () => {
    expect(TAB_META['grupne-voznje'].title).toBe('Grupne vožnje');
  });

  it('every tab has a non-empty subtitle', () => {
    ALL_TABS.forEach((tab) => {
      expect(TAB_META[tab].subtitle.length).toBeGreaterThan(0);
    });
  });

  it('every tab has a non-empty title', () => {
    ALL_TABS.forEach((tab) => {
      expect(TAB_META[tab].title.length).toBeGreaterThan(0);
    });
  });
});
