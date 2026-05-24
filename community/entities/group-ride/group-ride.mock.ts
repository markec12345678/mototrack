import { GroupRide } from './group-ride.js';
import type { PlainGroupRide } from './group-ride.js';

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const defaultGroupRide: PlainGroupRide = {
  id: 'ride-001',
  name: 'Nedeljska jutrannja tura',
  host: {
    id: 'user-001',
    displayName: 'Marko Novak',
  },
  startAt: Date.now() + 86_400_000,
  meetingPoint: {
    lat: 46.0569,
    lng: 14.5058,
    label: 'Kongresni trg, Ljubljana',
  },
  participants: [
    {
      id: 'user-002',
      displayName: 'Ana Kovač',
      status: 'pripravljen',
    },
    {
      id: 'user-003',
      displayName: 'Jure Horvat',
      status: 'na-poti',
    },
    {
      id: 'user-004',
      displayName: 'Maja Zupan',
      status: 'odmor',
    },
    {
      id: 'user-005',
      displayName: 'Luka Krajnc',
      status: 'konec',
    },
  ],
  routeId: 'route-alpine-001',
};

export function mockGroupRide(overrides: Partial<PlainGroupRide> = {}): GroupRide {
  return GroupRide.from({ ...defaultGroupRide, id: generateId(), ...overrides });
}

export function mockGroupRides(count = 3): GroupRide[] {
  const overrides: Partial<PlainGroupRide>[] = [
    {
      name: 'Nedeljska jutrannja tura',
      startAt: Date.now() + 86_400_000,
      meetingPoint: { lat: 46.0569, lng: 14.5058, label: 'Kongresni trg, Ljubljana' },
      participants: [
        { id: 'user-002', displayName: 'Ana Kovač', status: 'pripravljen' },
        { id: 'user-003', displayName: 'Jure Horvat', status: 'na-poti' },
      ],
      routeId: 'route-alpine-001',
    },
    {
      name: 'Alpska avantura',
      host: { id: 'user-010', displayName: 'Petra Mlakar' },
      startAt: Date.now() + 3 * 86_400_000,
      meetingPoint: { lat: 46.3631, lng: 13.7266, label: 'Bovec, Trg golobarskih žrtev' },
      participants: [
        { id: 'user-011', displayName: 'Simon Bernik', status: 'odmor' },
        { id: 'user-012', displayName: 'Tina Oblak', status: 'konec' },
        { id: 'user-013', displayName: 'Rok Štefanič', status: 'pripravljen' },
      ],
    },
    {
      name: 'Primorska tura',
      host: { id: 'user-020', displayName: 'Gregor Vidmar' },
      startAt: Date.now() + 7 * 86_400_000,
      meetingPoint: { lat: 45.5469, lng: 13.7294, label: 'Koper, Titov trg' },
      participants: [
        { id: 'user-021', displayName: 'Katja Leban', status: 'na-poti' },
      ],
      routeId: 'route-primorska-002',
    },
  ];

  return overrides.slice(0, count).map((o) =>
    GroupRide.from({ ...defaultGroupRide, id: generateId(), ...o }),
  );
}
