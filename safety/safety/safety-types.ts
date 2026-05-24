import type { User } from '@markec/mototrack-platform.entities.user';
import type { Hazard } from '@markec/safety.entities.hazard';
import type { SpeedCamera } from '@markec/safety.entities.speed-camera';
import type { IceContact } from '@markec/safety.entities.ice-contact';
import type { BorderCrossing } from '@markec/safety.entities.border-crossing';

/**
 * Options for triggering an SOS event.
 */
export type TriggerSosOptions = {
  /**
   * Latitude of the event location.
   */
  lat: number;
  /**
   * Longitude of the event location.
   */
  lng: number;
};

/**
 * Result of triggering an SOS event.
 */
export type TriggerSosResult = {
  /**
   * The ID of the triggered SOS event.
   */
  id: string;
  /**
   * List of contacts to whom the SOS was dispatched (e.g., phone numbers).
   */
  dispatchedTo: string[];
};

/**
 * Options for listing hazards.
 */
export type ListHazardsOptions = {
  /**
   * Latitude for proximity search.
   */
  lat?: number;
  /**
   * Longitude for proximity search.
   */
  lng?: number;
  /**
   * Radius in kilometers for proximity search.
   */
  radiusKm?: number;
};

/**
 * Input for reporting a hazard.
 */
export type ReportHazardInput = {
  /**
   * The type of hazard.
   */
  type: 'landslide' | 'construction' | 'ice' | 'flood' | 'animal' | 'oil' | 'pothole' | 'camera';
  /**
   * Latitude of the hazard location.
   */
  lat: number;
  /**
   * Longitude of the hazard location.
   */
  lng: number;
};

/**
 * Options for listing speed cameras.
 */
export type ListSpeedCamerasOptions = {
  /**
   * Latitude for proximity search.
   */
  lat?: number;
  /**
   * Longitude for proximity search.
   */
  lng?: number;
  /**
   * Radius in kilometers for proximity search.
   */
  radiusKm?: number;
};

/**
 * Input for saving (creating or updating) an ICE contact.
 */
export type IceContactInput = {
  /**
   * Optional ID for updating an existing contact.
   */
  id?: string;
  /**
   * Name of the ICE contact.
   */
  name: string;
  /**
   * Relationship to the user.
   */
  relation: string;
  /**
   * Phone number of the ICE contact.
   */
  phone: string;
  /**
   * Whether this is the primary ICE contact.
   */
  primary?: boolean;
  /**
   * Blood type of the ICE contact.
   */
  bloodType?: string;
  /**
   * Allergies of the ICE contact.
   */
  allergies?: string;
  /**
   * Additional notes for the ICE contact.
   */
  notes?: string;
};

export { Hazard, SpeedCamera, IceContact, BorderCrossing, User };