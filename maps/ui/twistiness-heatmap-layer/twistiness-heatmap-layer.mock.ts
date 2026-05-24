import { LatLng } from '@markec/maps.entities.lat-lng';

/**
 * Generates a mock track that alternates between twisty and straight sections.
 *
 * @param startLat  Starting latitude
 * @param startLng  Starting longitude
 * @param points    Number of points to generate
 */
export function mockTrack(
  startLat = 46.0569,
  startLng = 14.5058,
  points = 120
): LatLng[] {
  const track: LatLng[] = [];
  let lat = startLat;
  let lng = startLng;
  let bearing = 0;

  for (let i = 0; i < points; i++) {
    track.push(new LatLng(lat, lng));

    // First third: twisty (large bearing changes)
    if (i < points / 3) {
      bearing += (i % 2 === 0 ? 25 : -20);
    }
    // Middle third: straight
    else if (i < (2 * points) / 3) {
      bearing += 1;
    }
    // Last third: twisty again
    else {
      bearing += (i % 2 === 0 ? -30 : 28);
    }

    const rad = (bearing * Math.PI) / 180;
    // ~50 m steps
    lat += (Math.cos(rad) * 50) / 111_320;
    lng += (Math.sin(rad) * 50) / (111_320 * Math.cos((lat * Math.PI) / 180));
  }

  return track;
}

/**
 * A short straight track for testing edge cases.
 */
export const STRAIGHT_TRACK: LatLng[] = Array.from({ length: 20 }, (_, i) =>
  new LatLng(46.0 + i * 0.001, 14.5)
);

/**
 * A minimal 2-point track.
 */
export const MINIMAL_TRACK: LatLng[] = [
  new LatLng(46.0, 14.5),
  new LatLng(46.001, 14.501),
];
