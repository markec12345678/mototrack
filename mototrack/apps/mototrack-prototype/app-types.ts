/** Top-level navigation tabs in MotoTrack. */
export type TabKey = 'map' | 'plan' | 'track' | 'explore' | 'profile';

/** A geographic point on Earth (lat/lng in WGS84 degrees). */
export type LatLng = { lat: number; lng: number };

/** A waypoint on a planned route. */
export type Waypoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/** Type of route algorithm to use for planning. */
export type RouteMode = 'paved' | 'twisty' | 'offroad';

/** A curated Balkan touring road. */
export type BalkanTour = {
  id: string;
  country: string;
  flag: string;
  name: string;
  distanceKm: number;
  rating: number;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  waypoints: LatLng[];
};

/** A reported road hazard. */
export type Hazard = {
  id: string;
  type: 'camera' | 'landslide' | 'construction' | 'ice' | 'flood' | 'animal' | 'oil' | 'pothole';
  lat: number;
  lng: number;
  reportedAt: number;
};

/** A speed camera location. */
export type SpeedCamera = {
  id: string;
  lat: number;
  lng: number;
  speedLimit: number;
  type: 'fixed' | 'mobile' | 'average' | 'redlight';
  country: string;
};
