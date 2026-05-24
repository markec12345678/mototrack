import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import * as L from 'leaflet';
import classNames from 'classnames';
import { useHazards, type PlainHazard } from '@markec/safety.hooks.use-hazards';
import styles from './hazard-markers-layer.module.scss';

// ── Hazard type config ────────────────────────────────────────────────────────

export type HazardConfig = {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
};

export const HAZARD_CONFIG: Record<string, HazardConfig> = {
  landslide: { label: `Zemeljski plaz`, emoji: `⛰️`, color: `#92400e`, bgColor: `#fef3c7` },
  construction: { label: `Gradnja`, emoji: `🚧`, color: `#b45309`, bgColor: `#fef9c3` },
  ice: { label: `Led`, emoji: `🧊`, color: `#1d4ed8`, bgColor: `#dbeafe` },
  flood: { label: `Poplava`, emoji: `🌊`, color: `#0369a1`, bgColor: `#e0f2fe` },
  animal: { label: `Žival`, emoji: `🦌`, color: `#166534`, bgColor: `#dcfce7` },
  oil: { label: `Olje`, emoji: `🛢️`, color: `#374151`, bgColor: `#f3f4f6` },
  pothole: { label: `Luknja`, emoji: `🕳️`, color: `#7c3aed`, bgColor: `#ede9fe` },
  camera: { label: `Kamera`, emoji: `📷`, color: `#dc2626`, bgColor: `#fee2e2` },
  default: { label: `Nevarnost`, emoji: `⚠️`, color: `#d97706`, bgColor: `#fffbeb` },
};

function getHazardConfig(type: string): HazardConfig {
  return HAZARD_CONFIG[type] ?? HAZARD_CONFIG.default;
}

// ── DivIcon factory ───────────────────────────────────────────────────────────

function createHazardIcon(type: string): L.DivIcon {
  const cfg = getHazardConfig(type);
  const { bgColor, color, emoji } = cfg;
  const html = [
    `<div class="hazard-marker-pin" style="`,
    `background-color: ${bgColor};`,
    `border: 2.5px solid ${color};`,
    `border-radius: 50% 50% 50% 0;`,
    `transform: rotate(-45deg);`,
    `width: 36px;`,
    `height: 36px;`,
    `display: flex;`,
    `align-items: center;`,
    `justify-content: center;`,
    `box-shadow: 0 4px 12px rgba(0,0,0,0.35);`,
    `">`,
    `<span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">${emoji}</span>`,
    `</div>`,
  ].join(` `);
  return L.divIcon({
    html,
    className: ``,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -38],
  });
}

// ── Time formatter ────────────────────────────────────────────────────────────

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return `Pravkar`;
  if (diffMin < 60) return `Pred ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Pred ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return `Pred ${diffD} d`;
}

// ── Popup HTML factory ────────────────────────────────────────────────────────

function buildPopupHtml(hazard: PlainHazard, cfg: HazardConfig): string {
  const time = formatRelativeTime(hazard.reportedAt);
  const parts = [
    `<div class="hazard-popup-root">`,
    `<div class="hazard-popup-header" style="border-left: 4px solid ${cfg.color};">`,
    `<span class="hazard-popup-emoji">${cfg.emoji}</span>`,
    `<div class="hazard-popup-title-group">`,
    `<span class="hazard-popup-type">${cfg.label}</span>`,
    `<span class="hazard-popup-time">${time}</span>`,
    `</div>`,
    `</div>`,
    `<div class="hazard-popup-meta">`,
    `<span class="hazard-popup-confirms">✅ ${hazard.confirmedCount} potrditev</span>`,
    `</div>`,
    `<button class="hazard-popup-confirm-btn" data-hazard-id="${hazard.id}" type="button" style="background-color: ${cfg.color};">`,
    `Potrdi ⚠️`,
    `</button>`,
    `</div>`,
  ];
  return parts.join(`\n`);
}

// ── Props ─────────────────────────────────────────────────────────────────────

export type HazardMarkersLayerProps = {
  /**
   * Latitude of the center point for fetching nearby hazards.
   */
  lat?: number;

  /**
   * Longitude of the center point for fetching nearby hazards.
   */
  lng?: number;

  /**
   * Radius in km to fetch hazards within.
   */
  radiusKm?: number;

  /**
   * Override hazards list (useful for testing / compositions).
   * When provided, bypasses the GraphQL hook entirely.
   */
  hazards?: PlainHazard[];

  /**
   * Called when the user clicks the Potrdi (confirm) button on a popup.
   */
  onConfirm?: (id: string) => void;

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

// ── Inner component (requires Leaflet map context) ────────────────────────────

type InnerProps = {
  hazards: PlainHazard[];
  onConfirm?: (id: string) => void;
};

function HazardMarkersLayerInner({ hazards, onConfirm }: InnerProps) {
  const map = useMap();
  const { confirm } = useHazards({ mockData: hazards });
  const markersRef = useRef<L.Marker[]>([]);

  const handleConfirm = useCallback(
    (id: string) => {
      confirm(id);
      onConfirm?.(id);
    },
    [confirm, onConfirm]
  );

  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    hazards.forEach((hazard) => {
      const cfg = getHazardConfig(hazard.type);
      const icon = createHazardIcon(hazard.type);
      const marker = L.marker([hazard.lat, hazard.lng], { icon });

      const popupHtml = buildPopupHtml(hazard, cfg);
      const popup = L.popup({ maxWidth: 240, className: `hazard-leaflet-popup` }).setContent(popupHtml);

      marker.bindPopup(popup);

      marker.on(`popupopen`, () => {
        const btn = document.querySelector<HTMLButtonElement>(
          `.hazard-popup-confirm-btn[data-hazard-id="${hazard.id}"]`
        );
        if (btn) {
          btn.addEventListener(`click`, () => {
            handleConfirm(hazard.id);
            marker.closePopup();
          });
        }
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [hazards, map, handleConfirm]);

  return null;
}

// ── Live-fetch wrapper ────────────────────────────────────────────────────────

type LiveFetchProps = {
  lat: number;
  lng: number;
  radiusKm: number;
  onConfirm?: (id: string) => void;
};

function HazardMarkersLayerLive({ lat, lng, radiusKm, onConfirm }: LiveFetchProps) {
  const { hazards, listNear } = useHazards();

  useEffect(() => {
    listNear({ lat, lng }, radiusKm);
  }, [lat, lng, radiusKm, listNear]);

  return <HazardMarkersLayerInner hazards={hazards} onConfirm={onConfirm} />;
}

// ── Public component ──────────────────────────────────────────────────────────

/**
 * HazardMarkersLayer — renders colored DivIcon markers for each hazard on the map.
 * Shows a popup with type, relative time, confirm count, and a Potrdi button.
 * Must be rendered inside a react-leaflet MapContainer (e.g. MotoMap children).
 */
export function HazardMarkersLayer({
  lat = 43.8563,
  lng = 18.4131,
  radiusKm = 50,
  hazards,
  onConfirm,
  className,
  style,
}: HazardMarkersLayerProps) {
  return (
    <div className={classNames(styles.root, className)} style={style}>
      {hazards ? (
        <HazardMarkersLayerInner hazards={hazards} onConfirm={onConfirm} />
      ) : (
        <HazardMarkersLayerLive lat={lat} lng={lng} radiusKm={radiusKm} onConfirm={onConfirm} />
      )}
    </div>
  );
}
