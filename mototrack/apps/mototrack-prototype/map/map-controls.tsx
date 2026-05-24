import type { MapStyle } from './moto-map.js';
import styles from './map-controls.module.css';

type Props = {
  style: MapStyle;
  onStyleChange: (s: MapStyle) => void;
  layers: Record<string, boolean>;
  onLayerToggle: (key: string) => void;
  is3D: boolean;
  onToggle3D: () => void;
  nightMode: boolean;
  onToggleNight: () => void;
};

const STYLES: { key: MapStyle; label: string; icon: string }[] = [
  { key: 'streets', label: 'Ulice', icon: '🏙️' },
  { key: 'satellite', label: 'Satelit', icon: '🛰️' },
  { key: 'terrain', label: 'Teren', icon: '⛰️' },
  { key: 'dark', label: 'Temno', icon: '🌑' },
  { key: 'topo', label: 'Topo', icon: '🗺️' },
];

const LAYER_LABELS: Record<string, { icon: string; label: string }> = {
  pois: { icon: '📍', label: 'POI' },
  hazards: { icon: '⚠️', label: 'Nevarnosti' },
  fuel: { icon: '⛽', label: 'Gorivo' },
  parking: { icon: '🅿️', label: 'Parking' },
  live: { icon: '🔴', label: 'V živo' },
  quality: { icon: '🛣️', label: 'Kvaliteta' },
  traffic: { icon: '🚦', label: 'Promet' },
  cameras: { icon: '📷', label: 'Kamere' },
};

/** Floating overlay panel: layer toggles, basemap chooser, 3D / night-mode. */
export function MapControls({
  style,
  onStyleChange,
  layers,
  onLayerToggle,
  is3D,
  onToggle3D,
  nightMode,
  onToggleNight,
}: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Stil</div>
          <div className={styles.styles}>
            {STYLES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.styleBtn} ${style === s.key ? styles.styleBtnActive : ''}`}
                onClick={() => onStyleChange(s.key)}
                title={s.label}
              >
                <span className={styles.styleIcon}>{s.icon}</span>
                <span className={styles.styleLabel}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Sloji</div>
          <div className={styles.layers}>
            {Object.entries(LAYER_LABELS).map(([key, info]) => (
              <button
                key={key}
                type="button"
                className={`${styles.layerBtn} ${layers[key] ? styles.layerBtnActive : ''}`}
                onClick={() => onLayerToggle(key)}
              >
                <span>{info.icon}</span>
                {info.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.toggles}>
          <button
            type="button"
            className={`${styles.toggle} ${is3D ? styles.toggleActive : ''}`}
            onClick={onToggle3D}
          >
            {is3D ? '✓' : ''} 3D pogled
          </button>
          <button
            type="button"
            className={`${styles.toggle} ${nightMode ? styles.toggleActive : ''}`}
            onClick={onToggleNight}
          >
            {nightMode ? '✓' : ''} Nočni način
          </button>
        </div>
      </div>
    </div>
  );
}
