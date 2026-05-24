import { prop, modelOptions } from '@typegoose/typegoose';
import { v4 as uuid } from 'uuid';

/**
 * Represents a geographical coordinate (latitude and longitude).
 */
@modelOptions({ schemaOptions: { _id: false } })
export class LatLngModel {
  @prop({ required: true, type: Number })
  public lat!: number;

  @prop({ required: true, type: Number })
  public lng!: number;
}

/**
 * Defines the structure for a community-shared route.
 */
export class CommunityRouteModel {
  @prop({ unique: true, required: true, default: () => uuid() })
  public id!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public author!: string; // User ID or display name of the author

  @prop({ required: true, type: String })
  public country!: string;

  @prop({ required: true, type: Number })
  public distanceKm!: number;

  @prop({ required: true, type: Number })
  public durationSec!: number;

  @prop({ required: true, type: String })
  public difficulty!: string; // e.g., 'Easy', 'Medium', 'Hard'

  @prop({ required: true, type: Number })
  public rating!: number; // Average rating

  @prop({ required: true, type: Number })
  public likes!: number;

  @prop({ type: () => [LatLngModel], required: true })
  public geometry!: LatLngModel[];
}

/**
 * Mock data for CommunityRouteModel.
 */
export const communityRouteModelMock: CommunityRouteModel[] = [
  {
    id: '1',
    name: 'Coastal Cruise',
    author: 'user1',
    country: 'ES',
    distanceKm: 120,
    durationSec: 7200,
    difficulty: 'Easy',
    rating: 4.5,
    likes: 150,
    geometry: [
      { lat: 38.7223, lng: -9.1393 },
      { lat: 38.6923, lng: -9.2393 },
      { lat: 38.6723, lng: -9.3393 },
    ],
  },
  {
    id: '2',
    name: 'Mountain Pass Adventure',
    author: 'user3',
    country: 'FR',
    distanceKm: 250,
    durationSec: 14400,
    difficulty: 'Hard',
    rating: 4.8,
    likes: 200,
    geometry: [
      { lat: 45.8326, lng: 6.8652 },
      { lat: 45.9326, lng: 7.0652 },
      { lat: 46.0326, lng: 7.2652 },
    ],
  },
  {
    id: '3',
    name: 'Forest Loop',
    author: 'demoUser',
    country: 'DE',
    distanceKm: 80,
    durationSec: 5400,
    difficulty: 'Medium',
    rating: 4.0,
    likes: 80,
    geometry: [
      { lat: 52.5200, lng: 13.4050 },
      { lat: 52.5500, lng: 13.4250 },
      { lat: 52.5300, lng: 13.4500 },
    ],
  },
  {
    id: '4',
    name: 'City to Countryside',
    author: 'user5',
    country: 'GB',
    distanceKm: 180,
    durationSec: 10800,
    difficulty: 'Medium',
    rating: 4.2,
    likes: 110,
    geometry: [
      { lat: 51.5074, lng: -0.1278 },
      { lat: 51.6074, lng: -0.0278 },
      { lat: 51.7074, lng: 0.1278 },
    ],
  },
];