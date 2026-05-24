import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { SpeedCamera } from '@markec/safety.entities.speed-camera';
import { LatLng } from '@markec/maps.entities.lat-lng';

const LIST_SPEED_CAMERAS_QUERY = gql`
  query ListSpeedCameras($options: ListSpeedCamerasOptions) {
    listSpeedCameras(options: $options) {
      id
      lat
      lng
      speedLimit
      type
      country
    }
  }
`;

/**
 * The result of the nearest camera lookup.
 */
export type NearestCameraResult = {
  /** The nearest speed camera entity. */
  camera: SpeedCamera;
  /** Distance in kilometres from the given position to the camera. */
  distanceKm: number;
  /** Bearing in degrees (0–360, clockwise from north) from the given position to the camera. */
  bearingDeg: number;
};

/**
 * The full return value of the useSpeedCameras hook.
 */
export type UseSpeedCamerasResult = {
  /**
   * All speed cameras returned by the query.
   * Returns an empty array while loading or on error.
   */
  cameras: SpeedCamera[];
  /** True while the GraphQL query is in-flight. */
  loading: boolean;
  /** Error object if the query failed, otherwise undefined. */
  error: Error | undefined;
  /**
   * Returns every camera in the current list, sorted by distance from the
   * given position (closest first).
   */
  list: (from: LatLng) => SpeedCamera[];
  /**
   * Returns the nearest camera together with its distance (km) and bearing
   * (degrees clockwise from north) relative to the given position.
   * Returns undefined when the camera list is empty.
   */
  nearest: (from: LatLng) => NearestCameraResult | undefined;
};

export type UseSpeedCamerasOptions = {
  /**
   * Optional centre point and radius used to filter cameras server-side.
   * When omitted, all cameras are fetched.
   */
  queryOptions?: {
    lat: number;
    lng: number;
    radiusKm?: number;
  };
  /**
   * Provide mock camera data to bypass the GraphQL query entirely.
   * Useful for unit tests and Storybook compositions.
   */
  mockData?: SpeedCamera[];
};

/**
 * React hook that fetches speed cameras from the GraphQL API and exposes
 * spatial helpers used by DrivingModeHud for the 500 m audible alert.
 *
 * @param options - Optional query filter and mock-data override.
 * @returns cameras list, loading/error state, list() and nearest() helpers.
 *
 * @example
 * const { nearest, loading } = useSpeedCameras();
 * const hit = nearest(currentLatLng);
 * if (hit && hit.distanceKm < 0.5) playAlert();
 */
export function useSpeedCameras(options?: UseSpeedCamerasOptions): UseSpeedCamerasResult {
  const isMock = Boolean(options?.mockData);

  const { data, loading, error } = useQuery<{ listSpeedCameras: SpeedCamera[] }>(
    LIST_SPEED_CAMERAS_QUERY,
    {
      skip: isMock,
      variables: options?.queryOptions
        ? { options: options.queryOptions }
        : undefined,
    }
  );

  const cameras = useMemo<SpeedCamera[]>(() => {
    if (isMock) return options?.mockData ?? [];
    return (data?.listSpeedCameras ?? []).map((raw) => SpeedCamera.from(raw));
  }, [data, isMock, options?.mockData]);

  const list = (from: LatLng): SpeedCamera[] => {
    return [...cameras].sort((a, b) => {
      const aPos = new LatLng(a.lat, a.lng);
      const bPos = new LatLng(b.lat, b.lng);
      return LatLng.haversineKm(from, aPos) - LatLng.haversineKm(from, bPos);
    });
  };

  const nearest = (from: LatLng): NearestCameraResult | undefined => {
    if (cameras.length === 0) return undefined;

    let closestCamera: SpeedCamera = cameras[0];
    let closestDistKm = Infinity;

    for (const cam of cameras) {
      const camPos = new LatLng(cam.lat, cam.lng);
      const dist = LatLng.haversineKm(from, camPos);
      if (dist < closestDistKm) {
        closestDistKm = dist;
        closestCamera = cam;
      }
    }

    const closestPos = new LatLng(closestCamera.lat, closestCamera.lng);

    return {
      camera: closestCamera,
      distanceKm: closestDistKm,
      bearingDeg: LatLng.bearingDeg(from, closestPos),
    };
  };

  return {
    cameras,
    loading: isMock ? false : loading,
    error: isMock ? undefined : error,
    list,
    nearest,
  };
}
