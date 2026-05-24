import { prop } from '@typegoose/typegoose';
import { LatLngModel } from './lat-lng.model.js';

/**
 * Represents a waypoint in a route.
 */
export class WaypointModel {
  @prop({ required: true, type: String })
  public id!: string;

  @prop({ type: String })
  public name?: string;

  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}

/**
 * Mock data for WaypointModel.
 */
export const waypointModelMock: WaypointModel[] = [
  { id: '1', name: 'Start', lat: 46.0569, lng: 14.5058 }, // Ljubljana
  { id: '2', name: 'Intermediate', lat: 46.2639, lng: 14.0747 }, // Bled
  { id: '3', name: 'End', lat: 45.8153, lng: 15.9819 }, // Zagreb
];