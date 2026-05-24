import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import type { SafetyNode } from './safety.node.runtime.js';

export function createSafetyGqlSchema(safetyNode: SafetyNode): GqlSchema {
  return {
    typeDefs: gql`
      type Hazard {
        id: String!
        type: String!
        lat: Float!
        lng: Float!
        reportedAt: Float!
        reportedBy: String
        confirmedCount: Int!
      }

      type SpeedCamera {
        id: String!
        lat: Float!
        lng: Float!
        speedLimit: Int!
        type: String!
        country: String!
      }

      type IceContact {
        id: String!
        userId: String!
        name: String!
        relation: String!
        phone: String!
        primary: Boolean!
        bloodType: String
        allergies: String
        notes: String
      }

      type BorderCrossing {
        id: String!
        name: String!
        countryFrom: String!
        countryTo: String!
        documents: [String!]
        vignetteRequired: Boolean!
        avgWaitMin: Int!
        tips: String!
      }

      type TriggerSosResult {
        id: String!
        dispatchedTo: [String!]
      }

      input TriggerSosOptions {
        lat: Float!
        lng: Float!
      }

      input ListHazardsOptions {
        lat: Float!
        lng: Float!
        radiusKm: Float
      }

      input ReportHazardOptions {
        type: String!
        lat: Float!
        lng: Float!
      }

      input ListSpeedCamerasOptions {
        lat: Float!
        lng: Float!
        radiusKm: Float
      }

      input SaveIceContactOptions {
        id: String
        name: String!
        relation: String!
        phone: String!
        primary: Boolean
        bloodType: String
        allergies: String
        notes: String
      }

      type Query {
        listHazards(options: ListHazardsOptions): [Hazard!]
        listSpeedCameras(options: ListSpeedCamerasOptions): [SpeedCamera!]
        listIceContacts: [IceContact!]
        getBorderCrossings: [BorderCrossing!]
      }

      type Mutation {
        triggerSos(options: TriggerSosOptions!): TriggerSosResult!
        reportHazard(options: ReportHazardOptions!): Hazard!
        saveIceContact(options: SaveIceContactOptions!): IceContact!
      }
    `,
    resolvers: {
      Query: {
        listHazards: async (_root, { options }) => {
          if (!options) return [];
          return safetyNode.listHazards(options);
        },
        listSpeedCameras: async (_root, { options }) => {
          if (!options) return safetyNode.listAllSpeedCameras();
          return safetyNode.listSpeedCameras(options);
        },
        listIceContacts: async (_root, _args, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return safetyNode.listIceContacts(user.id);
        },
        getBorderCrossings: async () => {
          return safetyNode.listBorderCrossings();
        },
      },
      Mutation: {
        triggerSos: async (_root, { options }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return safetyNode.triggerSos(user.id, options);
        },
        reportHazard: async (_root, { options }, context) => {
          const user = context.session?.user;
          const reportedBy = user?.id;
          return safetyNode.reportHazard({ ...options, reportedBy });
        },
        saveIceContact: async (_root, { options }, context) => {
          const user = context.session?.user;
          if (!user) throw new Unauthorized();
          return safetyNode.saveIceContact({ ...options, userId: user.id });
        },
      },
    },
  };
}
