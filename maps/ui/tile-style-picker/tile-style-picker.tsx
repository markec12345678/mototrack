import React, { useState } from 'react';
import classNames from 'classnames';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { Tooltip } from '@markec/mototrack-design.overlays.tooltip';
import { TileProvider } from '@markec/maps.entities.tile-provider';
import { LayersIcon } from './icons/layers-icon.js';
import { BUILT_IN_PROVIDERS } from './built-in-providers.js';
import styles from './tile-style-picker.module.scss';

export type TileProviderWithPreview = TileProvider & {
  /** Optional preview thumbnail URL shown in the picker grid. */
  previewUrl?: string;
};

export type TileStylePickerProps = {
  /**
   * The currently active tile provider key.
   */
  activeKey?: string;

  /**
   * Callback fired when the user selects a tile style.
   */
  onSelect?: (provider: TileProvider) => void;

  /**
   * Additional slot-registered tile providers to display alongside the built-ins.
   */
  providers?: TileProviderWithPreview[];

  /**
   * Additional class name for the root element.
   */
  className?: string;

  /**
   * Inline styles for the root element.
   */
  style?: React.CSSProperties;
};

export function TileStylePicker({
  activeKey = `streets`,
  onSelect,
  providers = [],
  className,
  style,
}: TileStylePickerProps) {
  const [open, setOpen] = useState(false);

  const allProviders: TileProviderWithPreview[] = [...BUILT_IN_PROVIDERS, ...providers];

  function handleSelect(provider: TileProvider) {
    onSelect?.(provider);
    setOpen(false);
  }

  return (
    <div className={classNames(styles.root, className)} style={style}>
      {open && (
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Map Style</p>
          <div className={styles.grid}>
            {allProviders.map((provider) => {
              const isActive = provider.key === activeKey;
              return (
                <Tooltip key={provider.key} content={provider.label} position="top">
                  <button
                    type="button"
                    className={classNames(styles.tile, { [styles.tileActive]: isActive })}
                    onClick={() => handleSelect(provider)}
                    aria-label={provider.label}
                    aria-pressed={isActive}
                  >
                    <span className={styles.tileThumb}>
                      {provider.previewUrl ? (
                        <img
                          src={provider.previewUrl}
                          alt={provider.label}
                          className={styles.tileImg}
                        />
                      ) : (
                        <span className={styles.tilePlaceholder}>
                          {provider.label.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className={styles.tileLabel}>{provider.label}</span>
                    {isActive && <span className={styles.activeIndicator} />}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}

      <Tooltip content={open ? `Close style picker` : `Map style`} position="left">
        <IconButton
          icon={<LayersIcon />}
          variant={open ? `filled` : `ghost`}
          size="md"
          aria-label="Toggle map style picker"
          title="Map style"
          active={open}
          onClick={() => setOpen((prev) => !prev)}
          className={styles.trigger}
          style={{ backdropFilter: `blur(8px)`, backgroundColor: open ? undefined : `rgba(15,23,42,0.85)`, border: `1px solid rgba(148,163,184,0.2)` }}
        />
      </Tooltip>
    </div>
  );
}
