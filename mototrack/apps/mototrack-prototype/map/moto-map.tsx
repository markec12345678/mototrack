import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import type { BalkanTour, Hazard, LatLng, SpeedCamera } from '../app-types.js';
import { HAZARD_INFO } from '../data/hazards.js';
import styles from './moto-map.module.css';

// Fix leaflet default icon paths for bundlers.
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

/** Available basemap layer styles. */
export type MapStyle = 'streets' | 'satellite' | 'terrain' | 'dark' | 'topo';

const TILE_LAYERS: Record<MapStyle, { url: string; attribution: string; subdomains?: string }> = {
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO © OpenStreetMap',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CARTO © OpenStreetMap',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri World Imagery',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap (CC-BY-SA)',
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap (CC-BY-SA)',
  },
};

type Props = {
  /** Map center (defaults to Balkans). */
  center?: LatLng;
  /** Initial zoom level. */
  zoom?: number;
  /** Tile style to render. */
  style?: MapStyle;
  /** Tours to display as polylines. */
  tours?: BalkanTour[];
  /** Currently highlighted tour. */
  highlightedTourId?: string;
  /** Hazards to render as colored circles. */
  hazards?: Hazard[];
  /** Speed cameras to render. */
  speedCameras?: SpeedCamera[];
  /** Planned route waypoints to display as draggable markers + polyline. */
  routeWaypoints?: LatLng[];
  /** Click handler for adding a waypoint. */
  onMapClick?: (latlng: LatLng) => void;
  /** Current rider position. */
  riderPosition?: LatLng;
  /** Recorded ride track to display as polyline. */
  rideTrack?: LatLng[];
  /** Floating children rendered above the map (e.g. layer controls). */
  children?: React.ReactNode;
};

/** Make a colored DivIcon for hazards / cameras. */
function makeDot(color: string, label: string) {
  return L.divIcon({
    className: 'mt-dot',
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);font-size:14px;">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function ClickHandler({ onMapClick }: { onMapClick?: (latlng: LatLng) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onMapClick) return;
    const handler = (e: L.LeafletMouseEvent) => {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [map, onMapClick]);
  return null;
}

function FlyToTour({ tourId, tours }: { tourId?: string; tours?: BalkanTour[] }) {
  const map = useMap();
  useEffect(() => {
    if (!tourId || !tours) return;
    const t = tours.find((x) => x.id === tourId);
    if (!t || t.waypoints.length === 0) return;
    const bounds = L.latLngBounds(t.waypoints.map((w) => [w.lat, w.lng] as [number, number]));
    map.flyToBounds(bounds, { padding: [40, 40], duration: 1.2 });
  }, [tourId, tours, map]);
  return null;
}

/** Interactive Leaflet map for MotoTrack with multiple overlays. */
export function MotoMap({
  center = { lat: 44.5, lng: 19.5 },
  zoom = 6,
  style = 'dark',
  tours = [],
  highlightedTourId,
  hazards = [],
  speedCameras = [],
  routeWaypoints = [],
  onMapClick,
  riderPosition,
  rideTrack = [],
  children,
}: Props) {
  const [tileKey, setTileKey] = useState(style);
  useEffect(() => setTileKey(style), [style]);

  const tile = TILE_LAYERS[style];
  const routeLine: LatLngExpression[] = routeWaypoints.map((w) => [w.lat, w.lng]);
  const trackLine: LatLngExpression[] = rideTrack.map((w) => [w.lat, w.lng]);

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom
        className={styles.map}
      >
        <TileLayer key={tileKey} url={tile.url} attribution={tile.attribution} />

        {tours.map((t) => {
          const isHi = t.id === highlightedTourId;
          return (
            <Polyline
              key={t.id}
              positions={t.waypoints.map((w) => [w.lat, w.lng])}
              pathOptions={{
                color: isHi ? '#f97316' : '#3b82f6',
                weight: isHi ? 6 : 3,
                opacity: isHi ? 0.95 : 0.55,
              }}
            >
              <Popup>
                <strong>
                  {t.flag} {t.name}
                </strong>
                <br />
                {t.distanceKm} km · ⭐ {t.rating}/10
                <br />
                {t.description}
              </Popup>
            </Polyline>
          );
        })}

        {hazards.map((h) => {
          const info = HAZARD_INFO[h.type];
          return (
            <Marker key={h.id} position={[h.lat, h.lng]} icon={makeDot(info.color, info.icon)}>
              <Popup>
                <strong>{info.label}</strong>
                <br />
                Prijavljeno pred {Math.round((Date.now() - h.reportedAt) / 60000)} min
              </Popup>
            </Marker>
          );
        })}

        {speedCameras.map((c) => (
          <Marker key={c.id} position={[c.lat, c.lng]} icon={makeDot('#eab308', '📷')}>
            <Popup>
              <strong>Hitrostna kamera</strong>
              <br />
              {c.country} · {c.speedLimit} km/h · {c.type}
            </Popup>
          </Marker>
        ))}

        {routeWaypoints.length > 1 && (
          <Polyline
            positions={routeLine}
            pathOptions={{ color: '#f97316', weight: 5, opacity: 0.9, dashArray: '8 6' }}
          />
        )}
        {routeWaypoints.map((w, i) => (
          <CircleMarker
            key={`wp-${i}`}
            center={[w.lat, w.lng]}
            radius={8}
            pathOptions={{ color: '#f97316', fillColor: '#fb923c', fillOpacity: 1, weight: 2 }}
          >
            <Popup>Točka {i + 1}</Popup>
          </CircleMarker>
        ))}

        {rideTrack.length > 1 && (
          <Polyline
            positions={trackLine}
            pathOptions={{ color: '#22c55e', weight: 5, opacity: 0.9 }}
          />
        )}
        {riderPosition && (
          <CircleMarker
            center={[riderPosition.lat, riderPosition.lng]}
            radius={10}
            pathOptions={{ color: '#22c55e', fillColor: '#86efac', fillOpacity: 1, weight: 3 }}
          />
        )}

        <ClickHandler onMapClick={onMapClick} />
        <FlyToTour tourId={highlightedTourId} tours={tours} />
      </MapContainer>
      {children}
    </div>
  );
}
