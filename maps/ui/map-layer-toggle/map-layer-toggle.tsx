import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Toggle } from '@markec/mototrack-design.inputs.toggle';
import { MapLayer } from './map-layer-type.js';
import styles from './map-layer-toggle.module.scss';

const STORAGE_PREFIX = `map-layer-toggle:`;

function readStorage(key: string, fallback: boolean): boolean {
  if (typeof window === `undefined`) return fallback;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw === null) return fallback;
    return raw === `true`;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: boolean): void {
  if (typeof window === `undefined`) return;
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(value));
  } catch {
    // ignore
  }
}

export type MapLayerToggleProps = {
  /**
   * List of map layer slot entries to render.
   */
  layers?: MapLayer[];

  /**
   * Called when a layer toggle changes.
   */
  onLayerChange?: (key: string, enabled: boolean) => void;

  /**
   * Title shown at the top of the panel.
   */
  title?: string;

  /**
   * Additional class name applied to the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

const DEFAULT_LAYERS: MapLayer[] = [
  {
    key: `satellite`,
    label: `Satellite`,
    defaultEnabled: false,
  },
  {
    key: `traffic`,
    label: `Traffic`,
    defaultEnabled: true,
  },
  {
    key: `terrain`,
    label: `Terrain`,
    defaultEnabled: false,
  },
];

export function MapLayerToggle({
  layers = DEFAULT_LAYERS,
  onLayerChange,
  title = `Map Layers`,
  className,
  style,
}: MapLayerToggleProps) {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const layer of layers) {
      initial[layer.key] = readStorage(layer.key, layer.defaultEnabled ?? true);
    }
    return initial;
  });

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const layer of layers) {
      next[layer.key] = readStorage(layer.key, layer.defaultEnabled ?? true);
    }
    setEnabledMap(next);
  }, [layers]);

  const handleChange = useCallback(
    (key: string, value: boolean) => {
      setEnabledMap((prev) => ({ ...prev, [key]: value }));
      writeStorage(key, value);
      onLayerChange?.(key, value);
    },
    [onLayerChange]
  );

  if (layers.length === 0) return null;

  return (
    <div className={classNames(styles.root, className)} style={style}>
      <div className={styles.header}>
        <span className={styles.layersIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </span>
        <span className={styles.title}>{title}</span>
      </div>

      <ul className={styles.list}>
        {layers.map((layer, index) => (
          <li
            key={layer.key}
            className={classNames(styles.item, index === layers.length - 1 && styles.itemLast)}
          >
            {layer.icon && (
              <span className={classNames(styles.icon, enabledMap[layer.key] && styles.iconActive)}>
                {layer.icon}
              </span>
            )}
            <span className={classNames(styles.label, enabledMap[layer.key] && styles.labelActive)}>
              {layer.label}
            </span>
            <span className={styles.toggleWrapper}>
              <Toggle
                checked={enabledMap[layer.key] ?? (layer.defaultEnabled ?? true)}
                onChange={(v) => handleChange(layer.key, v)}
                size="sm"
                variant="default"
                aria-label={layer.label}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
