import { TrackPoint } from '@markec/rides.entities.track-point';

/**
 * A realistic mountain road track around Sarajevo — Trebević ascent.
 */
export const MOCK_TRACK_TREBEVIC: TrackPoint[] = [
  TrackPoint.from({ lat: 43.8563, lng: 18.4131, ts: 1700000000000, speed: 0, elevation: 520 }),
  TrackPoint.from({ lat: 43.8548, lng: 18.4155, ts: 1700000030000, speed: 8.3, elevation: 535 }),
  TrackPoint.from({ lat: 43.8531, lng: 18.4182, ts: 1700000060000, speed: 11.1, elevation: 558 }),
  TrackPoint.from({ lat: 43.8512, lng: 18.4210, ts: 1700000090000, speed: 13.9, elevation: 582 }),
  TrackPoint.from({ lat: 43.8490, lng: 18.4238, ts: 1700000120000, speed: 16.7, elevation: 610 }),
  TrackPoint.from({ lat: 43.8468, lng: 18.4265, ts: 1700000150000, speed: 19.4, elevation: 645 }),
  TrackPoint.from({ lat: 43.8445, lng: 18.4290, ts: 1700000180000, speed: 22.2, elevation: 682 }),
  TrackPoint.from({ lat: 43.8420, lng: 18.4315, ts: 1700000210000, speed: 25.0, elevation: 720 }),
  TrackPoint.from({ lat: 43.8398, lng: 18.4340, ts: 1700000240000, speed: 27.8, elevation: 762 }),
  TrackPoint.from({ lat: 43.8375, lng: 18.4365, ts: 1700000270000, speed: 30.6, elevation: 808 }),
  TrackPoint.from({ lat: 43.8352, lng: 18.4390, ts: 1700000300000, speed: 28.0, elevation: 855 }),
  TrackPoint.from({ lat: 43.8330, lng: 18.4415, ts: 1700000330000, speed: 24.0, elevation: 898 }),
  TrackPoint.from({ lat: 43.8310, lng: 18.4440, ts: 1700000360000, speed: 19.0, elevation: 935 }),
  TrackPoint.from({ lat: 43.8292, lng: 18.4462, ts: 1700000390000, speed: 13.0, elevation: 965 }),
  TrackPoint.from({ lat: 43.8278, lng: 18.4480, ts: 1700000420000, speed: 8.0, elevation: 985 }),
  TrackPoint.from({ lat: 43.8268, lng: 18.4495, ts: 1700000450000, speed: 4.0, elevation: 998 }),
  TrackPoint.from({ lat: 43.8260, lng: 18.4505, ts: 1700000480000, speed: 0, elevation: 1006 }),
];

/**
 * A short urban track — Baščaršija loop.
 */
export const MOCK_TRACK_BASCARSIJA: TrackPoint[] = [
  TrackPoint.from({ lat: 43.8600, lng: 18.4320, ts: 1700100000000, speed: 0, elevation: 510 }),
  TrackPoint.from({ lat: 43.8612, lng: 18.4338, ts: 1700100020000, speed: 6.0, elevation: 512 }),
  TrackPoint.from({ lat: 43.8625, lng: 18.4355, ts: 1700100040000, speed: 8.5, elevation: 514 }),
  TrackPoint.from({ lat: 43.8638, lng: 18.4370, ts: 1700100060000, speed: 9.0, elevation: 515 }),
  TrackPoint.from({ lat: 43.8650, lng: 18.4385, ts: 1700100080000, speed: 8.0, elevation: 516 }),
  TrackPoint.from({ lat: 43.8640, lng: 18.4400, ts: 1700100100000, speed: 7.5, elevation: 515 }),
  TrackPoint.from({ lat: 43.8625, lng: 18.4412, ts: 1700100120000, speed: 6.0, elevation: 514 }),
  TrackPoint.from({ lat: 43.8610, lng: 18.4420, ts: 1700100140000, speed: 5.0, elevation: 513 }),
  TrackPoint.from({ lat: 43.8600, lng: 18.4410, ts: 1700100160000, speed: 4.0, elevation: 512 }),
  TrackPoint.from({ lat: 43.8592, lng: 18.4395, ts: 1700100180000, speed: 3.0, elevation: 511 }),
  TrackPoint.from({ lat: 43.8588, lng: 18.4375, ts: 1700100200000, speed: 2.5, elevation: 510 }),
  TrackPoint.from({ lat: 43.8590, lng: 18.4355, ts: 1700100220000, speed: 2.0, elevation: 510 }),
  TrackPoint.from({ lat: 43.8596, lng: 18.4338, ts: 1700100240000, speed: 1.5, elevation: 510 }),
  TrackPoint.from({ lat: 43.8600, lng: 18.4320, ts: 1700100260000, speed: 0, elevation: 510 }),
];

/**
 * An empty track for testing the empty state.
 */
export const MOCK_TRACK_EMPTY: TrackPoint[] = [];
