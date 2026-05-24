import { useMemo, useState } from 'react';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Button } from '@markec/mototrack-design.actions.button';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { SelectList } from '@markec/mototrack-design.inputs.select-list';
import { Slider } from '@markec/mototrack-design.inputs.slider';
import { MotoMap } from '../map/moto-map.js';
import { BALKAN_TOURS } from '../data/balkan-tours.js';
import type { LatLng, RouteMode, Waypoint } from '../app-types.js';
import styles from './plan-tab.module.css';

const MODES: { key: RouteMode; label: string; icon: string }[] = [
  { key: 'paved', label: 'Asfalt', icon: '🛣️' },
  { key: 'twisty', label: 'Vijugasto', icon: '🌀' },
  { key: 'offroad', label: 'Terensko', icon: '🏔️' },
];

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** Planning tab: click map to add waypoints, choose route mode, generate twisty/round-trip. */
export function PlanTab() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [mode, setMode] = useState<RouteMode>('twisty');
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [twistiness, setTwistiness] = useState(70);
  const [distance, setDistance] = useState(80);

  const addWaypoint = (latlng: LatLng) => {
    setWaypoints((prev) => [
      ...prev,
      {
        id: `wp-${Date.now()}`,
        name: prev.length === 0 ? 'Start' : `Točka ${prev.length + 1}`,
        lat: latlng.lat,
        lng: latlng.lng,
      },
    ]);
  };

  const removeWaypoint = (id: string) => setWaypoints((p) => p.filter((w) => w.id !== id));

  const loadTour = (tourId: string) => {
    const t = BALKAN_TOURS.find((x) => x.id === tourId);
    if (!t) return;
    setWaypoints(
      t.waypoints.map((w, i) => ({
        id: `t-${tourId}-${i}`,
        name: i === 0 ? 'Start' : i === t.waypoints.length - 1 ? 'Cilj' : `Točka ${i + 1}`,
        lat: w.lat,
        lng: w.lng,
      })),
    );
  };

  const generateRoundTrip = () => {
    if (waypoints.length === 0) return;
    const center = waypoints[0];
    const radius = 0.3 + (twistiness / 100) * 0.4;
    const numPoints = 3 + Math.floor((twistiness / 100) * 3);
    const newPoints: Waypoint[] = [center];
    for (let i = 1; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 + Math.random() * 0.3;
      newPoints.push({
        id: `rt-${i}`,
        name: `Točka ${i + 1}`,
        lat: center.lat + Math.sin(angle) * radius,
        lng: center.lng + Math.cos(angle) * radius * 1.4,
      });
    }
    newPoints.push({ ...center, id: 'rt-end', name: 'Cilj (start)' });
    setWaypoints(newPoints);
  };

  const distanceKm = useMemo(() => {
    let total = 0;
    for (let i = 1; i < waypoints.length; i++) total += haversine(waypoints[i - 1], waypoints[i]);
    const multiplier = mode === 'twisty' ? 1.6 : mode === 'offroad' ? 1.3 : 1.15;
    return Math.round(total * multiplier);
  }, [waypoints, mode]);

  const estTime = useMemo(() => {
    const avgSpeed = mode === 'twisty' ? 55 : mode === 'offroad' ? 35 : 75;
    const hours = distanceKm / avgSpeed;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}min`;
  }, [distanceKm, mode]);

  const handleShare = () => {
    const code = `MT${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setShareCode(code);
  };

  const center = waypoints[0] ? { lat: waypoints[0].lat, lng: waypoints[0].lng } : { lat: 44.5, lng: 19.5 };

  return (
    <div className={styles.wrap}>
      <aside className={styles.sidebar}>
        <section className={styles.section}>
          <Paragraph variant="label" color="secondary">Tip rute</Paragraph>
          <div className={styles.modes}>
            {MODES.map((m) => (
              <Button
                key={m.key}
                variant={mode === m.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setMode(m.key)}
                leftIcon={<span>{m.icon}</span>}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <Paragraph variant="label" color="secondary">Generatorji</Paragraph>
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={waypoints.length === 0}
            onClick={generateRoundTrip}
            leftIcon={<span>🔄</span>}
          >
            Krožna tura v2
          </Button>
          <Slider
            label="Vijugavost"
            min={0}
            max={100}
            value={twistiness}
            onChange={setTwistiness}
            unit="%"
          />
          <Slider
            label="Razdalja"
            min={20}
            max={300}
            value={distance}
            onChange={setDistance}
            unit=" km"
          />
          <Button variant="secondary" size="md" fullWidth leftIcon={<span>🌀</span>}>
            Twisty Route Generator
          </Button>
        </section>

        <section className={styles.section}>
          <Paragraph variant="label" color="secondary">
            Točke ({waypoints.length})
          </Paragraph>
          {waypoints.length === 0 ? (
            <Card variant="outlined" padding="md">
              <Paragraph variant="caption" color="muted">
                👆 Klikni na zemljevid<br />za dodajanje točk
              </Paragraph>
            </Card>
          ) : (
            <div className={styles.waypoints}>
              {waypoints.map((w, i) => (
                <Card key={w.id} variant="default" padding="sm" className={styles.wp}>
                  <div className={styles.wpRow}>
                    <Badge label={`${i + 1}`} variant="accent" size="sm" />
                    <div className={styles.wpBody}>
                      <Paragraph variant="body" color="primary" className={styles.wpName}>{w.name}</Paragraph>
                      <Paragraph variant="mono" color="muted" className={styles.wpCoords}>
                        {w.lat.toFixed(3)}, {w.lng.toFixed(3)}
                      </Paragraph>
                    </div>
                    <IconButton
                      icon={<span>🗑️</span>}
                      variant="ghost"
                      size="sm"
                      aria-label="Izbriši"
                      onClick={() => removeWaypoint(w.id)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {waypoints.length >= 2 && (
          <Card variant="elevated" padding="md">
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <Heading level={3} size="2xl" color="accent">{distanceKm}</Heading>
                <Paragraph variant="label" color="secondary">km</Paragraph>
              </div>
              <div className={styles.stat}>
                <Heading level={3} size="2xl" color="accent">{estTime}</Heading>
                <Paragraph variant="label" color="secondary">čas</Paragraph>
              </div>
            </div>
          </Card>
        )}

        <section className={styles.section}>
          <Paragraph variant="label" color="secondary">Naloži ikonično turo</Paragraph>
          <SelectList
            placeholder="— Izberi turo —"
            options={BALKAN_TOURS.map((t) => ({
              value: t.id,
              label: `${t.flag} ${t.name} (${t.distanceKm} km)`,
            }))}
            onChange={(val) => val && loadTour(val)}
          />
        </section>

        <section className={styles.actions}>
          <Button variant="ghost" size="sm" leftIcon="📂">GPX uvoz</Button>
          <Button variant="ghost" size="sm" leftIcon="💾">GPX izvoz</Button>
          <Button variant="ghost" size="sm" leftIcon="📄">PDF</Button>
          <Button variant="ghost" size="sm" leftIcon="🌧️">Vreme</Button>
          <Button variant="ghost" size="sm" leftIcon="🅿️">Postanki</Button>
          <Button variant="ghost" size="sm" leftIcon="📥">Offline</Button>
        </section>

        <CtaButton variant="save-route" disabled={waypoints.length < 2} onClick={handleShare} fullWidth leftIcon="📤">
          Deli ruto (PC → Telefon)
        </CtaButton>
        {shareCode && (
          <Card variant="elevated" padding="md" className={styles.shareCard}>
            <Paragraph variant="label" color="secondary">Vnesi to kodo na drugi napravi</Paragraph>
            <Heading level={2} size="3xl" color="accent" className={styles.shareCode}>{shareCode}</Heading>
            <Paragraph variant="caption" color="muted">QR koda na voljo · velja 24h</Paragraph>
          </Card>
        )}
      </aside>

      <div className={styles.mapArea}>
        <MotoMap
          center={center}
          zoom={waypoints.length > 0 ? 9 : 6}
          style="dark"
          routeWaypoints={waypoints.map((w) => ({ lat: w.lat, lng: w.lng }))}
          onMapClick={addWaypoint}
        />
        <div className={styles.mapHint}>
          <Badge
            label={
              waypoints.length === 0
                ? '👆 Klikni na zemljevid za dodajanje točk'
                : `${waypoints.length} ${waypoints.length === 1 ? 'točka' : 'točk'} · klikni za dodajanje`
            }
            variant="neutral"
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
