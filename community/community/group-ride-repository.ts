import { ReturnModelType } from '@typegoose/typegoose';
import { GroupRideModel, GroupRideHostModel, GroupRideMeetingPointModel, GroupRideParticipantModel } from './group-ride.model.js';
import { GroupRide, GroupRideHost, GroupRideMeetingPoint, GroupRideParticipant } from '@markec/community.entities.group-ride';
import { User } from './user.js';

class Unauthorized extends Error { constructor(msg = 'Unauthorized') { super(msg); this.name = 'Unauthorized'; } }
class NotFound extends Error { constructor(msg = 'Not found') { super(msg); this.name = 'NotFound'; } }

/**
 * Input type for creating a group ride.
 */
export type CreateGroupRideInput = {
  name: string;
  startAt: number;
  meetingPoint: { lat: number; lng: number; label: string };
  routeId?: string;
};

/**
 * Repository for managing group rides.
 */
export class GroupRideRepository {
  constructor(private groupRideModel: ReturnModelType<typeof GroupRideModel>) {}

  /**
   * Retrieves a list of active and upcoming group rides.
   * @returns A promise that resolves to an array of GroupRide entities.
   */
  async listGroupRides(): Promise<GroupRide[]> {
    const rides = await this.groupRideModel.find({ startAt: { $gte: Date.now() - 86400000 } }).sort({ startAt: 1 }).exec(); // Rides from yesterday onwards

    return rides.map((rideDoc) => {
      const rideObject = rideDoc.toObject();
      return new GroupRide(
        rideObject.id,
        rideObject.name,
        GroupRideHost.from({ id: rideObject.host.id, displayName: rideObject.host.displayName }),
        rideObject.startAt,
        GroupRideMeetingPoint.from({ lat: rideObject.meetingPoint.lat, lng: rideObject.meetingPoint.lng, label: rideObject.meetingPoint.label }),
        rideObject.participants.map((p) => GroupRideParticipant.from({ id: p.id, displayName: p.displayName, status: p.status as any })),
        rideObject.routeId
      );
    });
  }

  /**
   * Creates a new group ride session.
   * @param input - The details for the new group ride.
   * @param user - The user creating the group ride.
   * @returns A promise that resolves to the created GroupRide entity.
   * @throws {Unauthorized} if no user is provided.
   */
  async createGroupRide(input: CreateGroupRideInput, user: User): Promise<GroupRide> {
    if (!user) throw new Unauthorized();

    const newRide = await this.groupRideModel.create({
      name: input.name,
      host: { id: user.id, displayName: user.id }, // Using user.id as display name for simplicity, assume platform provides real name
      startAt: input.startAt,
      meetingPoint: input.meetingPoint,
      participants: [{ id: user.id, displayName: user.id, status: 'joined' }], // Host joins automatically
      routeId: input.routeId,
    });

    const rideObject = newRide.toObject();
    return new GroupRide(
      rideObject.id,
      rideObject.name,
      GroupRideHost.from({ id: rideObject.host.id, displayName: rideObject.host.displayName }),
      rideObject.startAt,
      GroupRideMeetingPoint.from({ lat: rideObject.meetingPoint.lat, lng: rideObject.meetingPoint.lng, label: rideObject.meetingPoint.label }),
      rideObject.participants.map((p) => GroupRideParticipant.from({ id: p.id, displayName: p.displayName, status: p.status as any })),
      rideObject.routeId
    );
  }

  /**
   * Adds a participant to a group ride.
   * @param rideId - The ID of the group ride.
   * @param userId - The ID of the user to add.
   * @param displayName - The display name of the user.
   * @param status - The status of the participant (e.g., 'joined').
   * @returns A promise that resolves when the participant is added.
   * @throws {NotFound} if the group ride is not found.
   */
  async addParticipant(rideId: string, userId: string, displayName: string, status: string): Promise<void> {
    const ride = await this.groupRideModel.findOne({ id: rideId }).exec();
    if (!ride) throw new NotFound(`Group ride with ID ${rideId} not found.`);

    const existingParticipant = ride.participants.find(p => p.id === userId);
    if (existingParticipant) {
      existingParticipant.status = status; // Update status if already exists
    } else {
      ride.participants.push({ id: userId, displayName, status });
    }
    await ride.save();
  }
}