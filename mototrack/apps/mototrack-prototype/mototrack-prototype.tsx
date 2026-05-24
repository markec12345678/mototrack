import { useState } from 'react';
import { AppShell } from './app-shell.js';
import { MapTab } from './tabs/map-tab.js';
import { PlanTab } from './tabs/plan-tab.js';
import { TrackTab } from './tabs/track-tab.js';
import { ExploreTab } from './tabs/explore-tab.js';
import { ProfileTab } from './tabs/profile-tab.js';
import { MotoChat } from './chat/moto-chat.js';
import type { TabKey } from './app-types.js';
import './styles.css';

export function MototrackPrototype() {
  const [tab, setTab] = useState<TabKey>('map');
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AppShell
      activeTab={tab}
      onTabChange={setTab}
      onOpenChat={() => setChatOpen(true)}
    >
      {tab === 'map' && <MapTab />}
      {tab === 'plan' && <PlanTab />}
      {tab === 'track' && <TrackTab />}
      {tab === 'explore' && <ExploreTab />}
      {tab === 'profile' && <ProfileTab />}
      {chatOpen && <MotoChat onClose={() => setChatOpen(false)} />}
    </AppShell>
  );
}
