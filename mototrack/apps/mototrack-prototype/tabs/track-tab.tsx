import { useEffect, useRef, useState } from 'react';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Button } from '@markec/mototrack-design.actions.button';
import { CtaButton } from '@markec/mototrack-design.actions.cta-button';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { Speedometer } from '@markec/mototrack-design.hud.speedometer';
import { Compass } from '@markec/mototrack-design.hud.compass';
import { Gauge } from '@markec/mototrack-design.hud.gauge';
import { FuelGauge } from '@markec/mototrack-design.hud.fuel-gauge';
import { GpsQualityIndicator } from '@markec/mototrack-design.hud.gps-quality-indicator';
import { MotoMap } from '../map/moto-map.js';
import { BALKAN_TOURS } from '../data/balkan-tours.js';
import type { LatLng } from '../app-types.js';
import styles from './track-tab.module.css';

const SIM_PATH: LatLng[] = BALKAN_TOURS[0].waypoints;

function interpolate(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

/** Tracking tab: live ride recording with HUD using design HUD components. */
export function TrackTab() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [drivingMode, setDrivingMode] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [showChecklist, setShowChecklist] = useState(false);

  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [elevation, setElevation] = useState(420);
  const [climb, setClimb] = useState(0);
  const [heading, setHeading] = useState(45);
  const [accuracy, setAccuracy] = useState(8);
  const [track, setTrack] = useState<LatLng[]>([]);

  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!recording || paused) {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
      return;
    }
    tickRef.current = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(1, p + 0.004);
        const segCount = SIM_PATH.length - 1;
        const seg = Math.min(segCount - 1, Math.floor(next * segCount));
        const t = next * segCount - seg;
        const pos = interpolate(SIM_PATH[seg], SIM_PATH[seg + 1], t);
        setTrack((trk) => [...trk, pos]);
        return next;
      });
      const newSpeed = 60 + Math.random() * 50 - Math.random() * 20;
      setSpeed(Math.max(0, Math.round(newSpeed)));
      setMaxSpeed((m) => Math.max(m, Math.round(newSpeed)));
      setDistance((d) => d + newSpeed / 3600);
      setDuration((d) => d + 1);
      setElevation((e) => Math.max(0, e + (Math.random() - 0.4) * 8));
      setClimb((c) => c + Math.max(0, (Math.random() - 0.4) * 8));
      setHeading((h) => (h + (Math.random() - 0.5) * 20 + 360) % 360);
      setAccuracy(5 + Math.random() * 25);
    }, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [recording, paused]);

  const confirmStart = () => {
    setShowChecklist(false);
    setRecording(true);
    setPaused(false);
    setTrack([]);
    setProgress(0);
    setSpeed(0);
    setMaxSpeed(0);
    setDistance(0);
    setDuration(0);
    setClimb(0);
  };
  const stop = () => {
    setRecording(false);
    setPaused(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const riderPos = track[track.length - 1];
  const fuelRangeKm = Math.max(0, 320 - distance);

  if (drivingMode) {
    return (
      <div className={styles.drivingMode}>
        <div className={styles.exitDriving}>
          <IconButton
            icon={<span>✕</span>}
            variant="ghost"
            size="md"
            aria-label="Exit driving mode"
            onClick={() => setDrivingMode(false)}
          />
        </div>
        <Speedometer speed={speed} size="driving-mode" warningThreshold={120} />
        <Heading level={2} size="2xl" color="primary">↗️ Čez 200m zavijte desno · Vršič 12</Heading>
        <div className={styles.dmHud}>
          <Compass heading={heading} size={180} showSource={false} />
          <FuelGauge currentLiters={13.6} tankCapacity={20} estimatedRange={Math.round(fuelRangeKm)} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <MotoMap
        center={riderPos || { lat: 46.34, lng: 13.6 }}
        zoom={11}
        style="dark"
        rideTrack={track}
        riderPosition={riderPos}
      >
        {recording && (
          <div className={styles.hud}>
            <div className={styles.hudTop}>
              <Card variant="elevated" padding="sm" className={styles.speedoCard}>
                <Speedometer speed={speed} size="compact" warningThreshold={120} />
              </Card>
              <Card variant="elevated" padding="sm" className={styles.gpsCard}>
                <div className={styles.gpsRow}>
                  <GpsQualityIndicator accuracyMeters={accuracy} size={14} />
                  <Paragraph variant="caption" color="primary">GPS · {Math.round(accuracy)}m</Paragraph>
                  {voiceOn && <Badge label="🎧 BT" variant="info" size="sm" />}
                </div>
              </Card>
            </div>

            <Card variant="elevated" padding="sm" className={styles.statsBar}>
              <div className={styles.statBox}>
                <Paragraph variant="label" color="secondary">Razdalja</Paragraph>
                <Paragraph variant="body" color="primary">{distance.toFixed(2)} km</Paragraph>
              </div>
              <div className={styles.statBox}>
                <Paragraph variant="label" color="secondary">Čas</Paragraph>
                <Paragraph variant="mono" color="primary">{formatTime(duration)}</Paragraph>
              </div>
              <div className={styles.statBox}>
                <Paragraph variant="label" color="secondary">Max</Paragraph>
                <Paragraph variant="body" color="primary">{maxSpeed} km/h</Paragraph>
              </div>
              <div className={styles.statBox}>
                <Paragraph variant="label" color="secondary">Vzpon</Paragraph>
                <Paragraph variant="body" color="primary">+{Math.round(climb)} m</Paragraph>
              </div>
              <div className={styles.statBox}>
                <Paragraph variant="label" color="secondary">Višina</Paragraph>
                <Paragraph variant="body" color="primary">{Math.round(elevation)} m</Paragraph>
              </div>
            </Card>

            <Card variant="elevated" padding="md" className={styles.navPanel}>
              <span className={styles.navArrow}>↗️</span>
              <div className={styles.navText}>
                <Heading level={4} size="md" color="primary">Čez 200 m zavijte desno</Heading>
                <Paragraph variant="caption" color="secondary">Vršič serpentina 12 · 9% naklon</Paragraph>
              </div>
              <IconButton
                icon={<span>{voiceOn ? '🔊' : '🔇'}</span>}
                variant="ghost"
                size="md"
                aria-label="Toggle voice"
                onClick={() => setVoiceOn((v) => !v)}
              />
            </Card>

            <Card variant="default" padding="sm" className={styles.weatherPanel}>
              <span className={styles.wxIcon}>☁️</span>
              <Paragraph variant="caption" color="primary">
                14°C · občutek 11°C · veter 18 km/h ↗ · vidljivost 8 km
              </Paragraph>
              <Badge label="🌧️ Dež čez 25 min" variant="warning" size="sm" />
            </Card>
          </div>
        )}

        <div className={styles.rightStack}>
          <CtaButton variant="start-ride" onClick={() => setDrivingMode(true)} leftIcon="🚦">
            DRIVE
          </CtaButton>
          {recording && (
            <IconButton
              icon={<span style={{ fontSize: '1.3rem' }}>⚠️</span>}
              variant="filled"
              size="lg"
              aria-label="Prijavi nevarnost"
              title="Prijavi nevarnost"
            />
          )}
          <IconButton
            icon={<span style={{ fontSize: '1.3rem' }}>📷</span>}
            variant="ghost"
            size="lg"
            aria-label="Fotografiraj"
            title="Fotografiraj"
          />
        </div>

        <div className={styles.controls}>
          {!recording ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setShowChecklist(true)} leftIcon="✅">
                Pre-Ride Checklist
              </Button>
              <CtaButton variant="start-ride" onClick={() => setShowChecklist(true)} leftIcon="▶">
                ZAČNI VOŽNJO
              </CtaButton>
            </>
          ) : (
            <div className={styles.recControls}>
              {paused ? (
                <CtaButton variant="start-ride" onClick={() => setPaused(false)} leftIcon="▶">
                  Nadaljuj
                </CtaButton>
              ) : (
                <Button variant="primary" size="lg" onClick={() => setPaused(true)} leftIcon="⏸">
                  Pavza
                </Button>
              )}
              <Button variant="danger" size="lg" onClick={stop} leftIcon="⏹">
                Konec vožnje
              </Button>
            </div>
          )}
        </div>
      </MotoMap>

      <Modal
        open={showChecklist}
        onClose={() => setShowChecklist(false)}
        title="🛡️ Pre-Ride Checklist"
        size="md"
        footer={
          <CtaButton variant="start-ride" onClick={confirmStart} leftIcon="🏍️" fullWidth>
            ZAČNI VOŽNJO
          </CtaButton>
        }
      >
        <div className={styles.checklist}>
          {['Čelada ✓', 'Rokavice ✓', 'Zaščitna jakna ✓', 'Pnevmatike (tlak)', 'Olje, gorivo', 'Luči, smerniki', 'Telefon napolnjen', 'ICE stiki nastavljeni'].map((item) => (
            <label key={item} className={styles.checkRow}>
              <input type="checkbox" defaultChecked /> <span>{item}</span>
            </label>
          ))}
        </div>
        <Card variant="elevated" padding="md" className={styles.weatherCheck}>
          <Heading level={5} size="sm" color="primary">🌤️ Vreme za 3 ure</Heading>
          <Paragraph variant="body" color="secondary">
            14°C · oblačno · veter 18 km/h · brez padavin do 16:00
          </Paragraph>
          <Badge label="✓ Pogoji ugodni za vožnjo" variant="success" size="md" />
        </Card>
        <div className={styles.gaugeRow}>
          <Gauge value={maxSpeed || 142} min={0} max={250} label="Speed" unit="km/h" size={140} />
          <Gauge value={climb || 1420} min={0} max={3000} label="Climb" unit="m" size={140} />
        </div>
      </Modal>
    </div>
  );
}
