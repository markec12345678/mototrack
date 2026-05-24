import { describe, it, expect } from 'vitest';
import { GroupRide, GroupRideHost, GroupRideMeetingPoint, GroupRideParticipant } from './group-ride.js';
import { mockGroupRide, mockGroupRides } from './group-ride.mock.js';
import type { PlainGroupRide, ParticipantStatus } from './group-ride.js';

const plainRide: PlainGroupRide = {
  id: 'ride-test-001',
  name: 'Test Tura',
  host: { id: 'host-001', displayName: 'Test Host' },
  startAt: 1_700_000_000_000,
  meetingPoint: { lat: 46.0569, lng: 14.5058, label: 'Ljubljana' },
  participants: [
    { id: 'p-001', displayName: 'Rider One', status: 'pripravljen' },
    { id: 'p-002', displayName: 'Rider Two', status: 'na-poti' },
    { id: 'p-003', displayName: 'Rider Three', status: 'odmor' },
    { id: 'p-004', displayName: 'Rider Four', status: 'konec' },
  ],
  routeId: 'route-001',
};

describe('GroupRide', () => {
  it('has a GroupRide.from() static method', () => {
    expect(GroupRide.from).toBeTruthy();
  });

  it('creates a GroupRide instance from a plain object', () => {
    const ride = GroupRide.from(plainRide);
    expect(ride).toBeInstanceOf(GroupRide);
    expect(ride.id).toBe('ride-test-001');
    expect(ride.name).toBe('Test Tura');
    expect(ride.startAt).toBe(1_700_000_000_000);
    expect(ride.routeId).toBe('route-001');
  });

  it('creates a GroupRide without a routeId', () => {
    const { routeId: _routeId, ...withoutRoute } = plainRide;
    const ride = GroupRide.from(withoutRoute as PlainGroupRide);
    expect(ride.routeId).toBeUndefined();
  });

  it('serializes to a plain object via toObject()', () => {
    const ride = GroupRide.from(plainRide);
    const obj = ride.toObject();
    expect(obj.id).toBe('ride-test-001');
    expect(obj.name).toBe('Test Tura');
    expect(obj.startAt).toBe(1_700_000_000_000);
    expect(obj.routeId).toBe('route-001');
  });

  it('round-trips through from() and toObject()', () => {
    const ride = GroupRide.from(plainRide);
    const obj = ride.toObject();
    expect(obj).toMatchObject({
      id: plainRide.id,
      name: plainRide.name,
      startAt: plainRide.startAt,
      routeId: plainRide.routeId,
    });
  });
});

describe('GroupRideHost', () => {
  it('creates a host from a plain object', () => {
    const host = GroupRideHost.from({ id: 'h-1', displayName: 'Marko' });
    expect(host.id).toBe('h-1');
    expect(host.displayName).toBe('Marko');
  });

  it('serializes host via toObject()', () => {
    const host = GroupRideHost.from({ id: 'h-1', displayName: 'Marko' });
    expect(host.toObject()).toEqual({ id: 'h-1', displayName: 'Marko' });
  });
});

describe('GroupRideMeetingPoint', () => {
  it('creates a meeting point from a plain object', () => {
    const mp = GroupRideMeetingPoint.from({ lat: 46.05, lng: 14.5, label: 'Ljubljana' });
    expect(mp.lat).toBe(46.05);
    expect(mp.lng).toBe(14.5);
    expect(mp.label).toBe('Ljubljana');
  });

  it('serializes meeting point via toObject()', () => {
    const mp = GroupRideMeetingPoint.from({ lat: 46.05, lng: 14.5, label: 'Ljubljana' });
    expect(mp.toObject()).toEqual({ lat: 46.05, lng: 14.5, label: 'Ljubljana' });
  });
});

describe('GroupRideParticipant', () => {
  const statuses: ParticipantStatus[] = ['pripravljen', 'na-poti', 'odmor', 'konec'];

  statuses.forEach((status) => {
    it(`accepts participant status: "${status}"`, () => {
      const p = GroupRideParticipant.from({ id: 'p-1', displayName: 'Rider', status });
      expect(p.status).toBe(status);
    });
  });

  it('serializes participant via toObject()', () => {
    const p = GroupRideParticipant.from({ id: 'p-1', displayName: 'Rider', status: 'na-poti' });
    expect(p.toObject()).toEqual({ id: 'p-1', displayName: 'Rider', status: 'na-poti' });
  });
});

describe('participants', () => {
  it('maps all participants correctly', () => {
    const ride = GroupRide.from(plainRide);
    expect(ride.participants).toHaveLength(4);
    expect(ride.participants[0]).toBeInstanceOf(GroupRideParticipant);
    expect(ride.participants[0].status).toBe('pripravljen');
    expect(ride.participants[1].status).toBe('na-poti');
    expect(ride.participants[2].status).toBe('odmor');
    expect(ride.participants[3].status).toBe('konec');
  });
});

describe('mockGroupRide', () => {
  it('returns a GroupRide instance', () => {
    const ride = mockGroupRide();
    expect(ride).toBeInstanceOf(GroupRide);
  });

  it('accepts partial overrides', () => {
    const ride = mockGroupRide({ name: 'Custom Tura' });
    expect(ride.name).toBe('Custom Tura');
  });

  it('generates a unique id each call', () => {
    const a = mockGroupRide();
    const b = mockGroupRide();
    expect(a.id).not.toBe(b.id);
  });
});

describe('mockGroupRides', () => {
  it('returns the default count of 3 rides', () => {
    const rides = mockGroupRides();
    expect(rides).toHaveLength(3);
  });

  it('returns the requested count of rides', () => {
    const rides = mockGroupRides(2);
    expect(rides).toHaveLength(2);
  });

  it('returns GroupRide instances', () => {
    const rides = mockGroupRides(1);
    expect(rides[0]).toBeInstanceOf(GroupRide);
  });
});
