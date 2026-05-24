import { useState } from 'react';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Card } from '@markec/mototrack-design.content.card';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { Button } from '@markec/mototrack-design.actions.button';
import { CountryFlag, type CountryCode } from '@markec/mototrack-design.hud.country-flag';
import { MotoMap, type MapStyle } from '../map/moto-map.js';
import { MapControls } from '../map/map-controls.js';
import { BALKAN_TOURS } from '../data/balkan-tours.js';
import { HAZARDS, SPEED_CAMERAS } from '../data/hazards.js';
import styles from './map-tab.module.css';

const COUNTRY_TO_CODE: Record<string, CountryCode> = {
  Slovenija: 'SI',
  'Črna Gora': 'ME',
  Romunija: 'RO',
  Albanija: 'AL',
  Bolgarija: 'BG',
  Hrvaška: 'HR',
  'Bosna in Hercegovina': 'BA',
  'Severna Makedonija': 'MK',
  Srbija: 'RS',
  Grčija: 'GR',
};

/** Map tab: full-screen interactive map with overlays, layer controls, and tour cards. */
export function MapTab() {
  const [style, setStyle] = useState<MapStyle>('dark');
  const [layers, setLayers] = useState<Record<string, boolean>>({
    pois: true,
    hazards: true,
    fuel: false,
    parking: false,
    live: false,
    quality: false,
    traffic: false,
    cameras: true,
  });
  const [is3D, setIs3D] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [highlightedTour, setHighlightedTour] = useState<string | undefined>();

  const toggleLayer = (k: string) => setLayers((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className={`${styles.wrap} ${nightMode ? styles.night : ''}`}>
      <MotoMap
        style={style}
        tours={BALKAN_TOURS}
        highlightedTourId={highlightedTour}
        hazards={layers.hazards ? HAZARDS : []}
        speedCameras={layers.cameras ? SPEED_CAMERAS : []}
      >
        <MapControls
          style={style}
          onStyleChange={setStyle}
          layers={layers}
          onLayerToggle={toggleLayer}
          is3D={is3D}
          onToggle3D={() => setIs3D((v) => !v)}
          nightMode={nightMode}
          onToggleNight={() => setNightMode((v) => !v)}
        />
        {is3D && (
          <div className={styles.badge3D}>
            <Badge label="3D · MapLibre GL" variant="accent" size="md" icon="🛰️" />
          </div>
        )}
        <div className={styles.toursStrip}>
          <Heading level={6} size="xs" color="primary">
            🌟 Ikonične balkanske ture
          </Heading>
          <div className={styles.toursScroller}>
            {BALKAN_TOURS.map((t) => {
              const isActive = highlightedTour === t.id;
              const code = COUNTRY_TO_CODE[t.country];
              return (
                <Card
                  key={t.id}
                  variant={isActive ? 'elevated' : 'default'}
                  padding="sm"
                  hoverLift
                  onClick={() => setHighlightedTour(isActive ? undefined : t.id)}
                  className={`${styles.tourCard} ${isActive ? styles.tourCardActive : ''}`}
                >
                  <div className={styles.tourCardInner}>
                    {code && <CountryFlag code={code} size="lg" showLabel={false} />}
                    <div className={styles.tourBody}>
                      <Paragraph variant="body" color="primary" className={styles.tourName}>
                        {t.name}
                      </Paragraph>
                      <div className={styles.tourMeta}>
                        <Badge label={`${t.distanceKm} km`} variant="neutral" size="sm" />
                        <Badge label={`⭐ ${t.rating}`} variant="accent" size="sm" />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </MotoMap>
    </div>
  );
}
