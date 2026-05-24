import { type RideEntry } from './ride-calendar.js';

function daysAgo(days: number): number {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(8, 30, 0, 0);
  return d.getTime();
}

function thisMonth(day: number, hour = 8): number {
  const d = new Date();
  d.setDate(day);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}

export const mockRides: RideEntry[] = [
  { id: 'r1', startedAt: thisMonth(2), distanceKm: 42.5, name: `Morning Blast` },
  { id: 'r2', startedAt: thisMonth(5), distanceKm: 118.3, name: `Mountain Pass Loop` },
  { id: 'r3', startedAt: thisMonth(5, 15), distanceKm: 34.1, name: `Evening Cruise` },
  { id: 'r4', startedAt: thisMonth(8), distanceKm: 67.8, name: `Coastal Run` },
  { id: 'r5', startedAt: thisMonth(11), distanceKm: 210.4, name: `Epic Day Tour` },
  { id: 'r6', startedAt: thisMonth(13), distanceKm: 28.9, name: `Quick Spin` },
  { id: 'r7', startedAt: thisMonth(15), distanceKm: 95.2, name: `Forest Trail` },
  { id: 'r8', startedAt: thisMonth(15, 16), distanceKm: 55.6, name: `Sunset Ride` },
  { id: 'r9', startedAt: thisMonth(18), distanceKm: 143.7, name: `Cross-Country` },
  { id: 'r10', startedAt: thisMonth(20), distanceKm: 12.4, name: `City Loop` },
  { id: 'r11', startedAt: thisMonth(22), distanceKm: 88.0, name: `Valley Descent` },
  { id: 'r12', startedAt: thisMonth(24), distanceKm: 175.5, name: `Weekend Warrior` },
  { id: 'r13', startedAt: thisMonth(24, 14), distanceKm: 62.3, name: `Afternoon Detour` },
  { id: 'r14', startedAt: thisMonth(27), distanceKm: 49.1, name: `Lakeside Route` },
  { id: 'r15', startedAt: daysAgo(2), distanceKm: 103.8, name: `Recent Ride` },
];

export const mockRidesSparse: RideEntry[] = [
  { id: 's1', startedAt: thisMonth(3), distanceKm: 25.0, name: `Short Hop` },
  { id: 's2', startedAt: thisMonth(14), distanceKm: 190.0, name: `Long Haul` },
  { id: 's3', startedAt: thisMonth(21), distanceKm: 55.0, name: `Mid-week Escape` },
];
