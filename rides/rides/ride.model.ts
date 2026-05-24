import { pre, prop, modelOptions, Severity } from '@typegoose/typegoose';

export class TrackPointModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;

  @prop({ required: true, type: Number })
  public ts!: number;

  @prop({ type: Number })
  public speed?: number;

  @prop({ type: Number })
  public elevation?: number;

  @prop({ type: Number })
  public accuracy?: number;

  @prop({ type: Number })
  public heading?: number;
}

@pre<RideModel>('save', async function preSave(this: RideModel) {
  const points = this.track ?? [];
  const metrics = computeMetrics(points);
  this.distanceKm = metrics.distanceKm;
  this.durationSec = metrics.durationSec;
  this.maxSpeedKmh = metrics.maxSpeedKmh;
  this.avgSpeedKmh = metrics.avgSpeedKmh;
  this.climbM = metrics.climbM;
  this.descentM = metrics.descentM;
  this.twistinessScore = metrics.twistinessScore;
})
@modelOptions({
  schemaOptions: { collection: 'rides', timestamps: true },
  options: { allowMixed: Severity.ALLOW },
})
export class RideModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String, index: true })
  public userId!: string;

  @prop({ required: true, type: Number })
  public startedAt!: number;

  @prop({ required: true, type: Number })
  public endedAt!: number;

  @prop({ required: true, type: Number, default: 0 })
  public distanceKm!: number;

  @prop({ required: true, type: Number, default: 0 })
  public durationSec!: number;

  @prop({ required: true, type: Number, default: 0 })
  public maxSpeedKmh!: number;

  @prop({ required: true, type: Number, default: 0 })
  public avgSpeedKmh!: number;

  @prop({ required: true, type: Number, default: 0 })
  public climbM!: number;

  @prop({ required: true, type: Number, default: 0 })
  public descentM!: number;

  @prop({ required: true, type: Number, default: 0 })
  public twistinessScore!: number;

  @prop({ type: () => [TrackPointModel], default: [], _id: false })
  public track!: TrackPointModel[];

  @prop({ type: String })
  public name?: string;

  @prop({ type: String })
  public notes?: string;
}

// ── Metric computation ────────────────────────────────────────────────────────

type Metrics = {
  distanceKm: number;
  durationSec: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  climbM: number;
  descentM: number;
  twistinessScore: number;
};

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
}

export function computeMetrics(points: TrackPointModel[]): Metrics {
  if (!points || points.length < 2) {
    return {
      distanceKm: 0,
      durationSec: 0,
      maxSpeedKmh: 0,
      avgSpeedKmh: 0,
      climbM: 0,
      descentM: 0,
      twistinessScore: 0,
    };
  }

  let distanceKm = 0;
  let climbM = 0;
  let descentM = 0;
  let maxSpeedKmh = 0;
  let bearingChangeSum = 0;
  let bearingSamples = 0;
  let prevBearing: number | undefined;

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const segKm = haversineKm(prev, curr);
    distanceKm += segKm;

    const dt = (curr.ts - prev.ts) / 1000;
    if (dt > 0) {
      const speedKmh = (segKm / dt) * 3600;
      if (speedKmh > maxSpeedKmh) maxSpeedKmh = speedKmh;
    }

    if (
      typeof prev.elevation === 'number' &&
      typeof curr.elevation === 'number'
    ) {
      const dE = curr.elevation - prev.elevation;
      if (dE > 0) climbM += dE;
      else descentM += -dE;
    }

    const dLng = ((curr.lng - prev.lng) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos((curr.lat * Math.PI) / 180);
    const x =
      Math.cos((prev.lat * Math.PI) / 180) *
        Math.sin((curr.lat * Math.PI) / 180) -
      Math.sin((prev.lat * Math.PI) / 180) *
        Math.cos((curr.lat * Math.PI) / 180) *
        Math.cos(dLng);
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    if (prevBearing !== undefined) {
      let diff = Math.abs(bearing - prevBearing);
      if (diff > 180) diff = 360 - diff;
      bearingChangeSum += diff;
      bearingSamples += 1;
    }
    prevBearing = bearing;
  }

  const durationSec = Math.max(
    0,
    Math.round((points[points.length - 1].ts - points[0].ts) / 1000)
  );
  const avgSpeedKmh = durationSec > 0 ? (distanceKm / durationSec) * 3600 : 0;
  const avgBearingChange =
    bearingSamples > 0 ? bearingChangeSum / bearingSamples : 0;
  const twistinessScore = Math.max(0, Math.min(10, avgBearingChange / 6));

  return {
    distanceKm,
    durationSec,
    maxSpeedKmh,
    avgSpeedKmh,
    climbM,
    descentM,
    twistinessScore,
  };
}
