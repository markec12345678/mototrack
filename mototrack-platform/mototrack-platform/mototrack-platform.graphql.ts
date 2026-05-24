import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { MototrackPlatformNode } from './mototrack-platform.node.runtime.js';

export function mototrackPlatformGqlSchema(
  platform: MototrackPlatformNode
): GqlSchema {
  return {
    typeDefs: gql`
      type User {
        id: String!
        email: String!
        username: String!
        displayName: String!
        country: String!
        language: String!
        primaryBikeId: String
        level: Int!
        points: Int!
        role: String!
      }

      type AuthPayload {
        token: String!
        user: User!
      }

      type LogoutResponse {
        success: Boolean!
        message: String
      }

      input SignupInput {
        email: String!
        password: String!
        username: String!
        displayName: String!
        country: String!
      }

      input LoginOptions {
        email: String!
        password: String!
      }

      input GetCurrentUserOptions {
        token: String!
      }

      input LogoutOptions {
        token: String!
      }

      type Query {
        getCurrentUser(options: GetCurrentUserOptions!): User
      }

      type Mutation {
        login(options: LoginOptions!): AuthPayload!
        signup(input: SignupInput!): AuthPayload!
        logout(options: LogoutOptions!): LogoutResponse!
      }
    `,
    resolvers: {
      Query: {
        getCurrentUser: async (
          _parent: unknown,
          { options }: { options: { token: string } }
        ) => {
          const user = await platform.getUserFromToken(options.token);
          if (!user) return null;
          return user;
        },
      },
      Mutation: {
        login: async (
          _parent: unknown,
          { options }: { options: { email: string; password: string } }
        ) => {
          const result = await platform.login(options.email, options.password);
          if (!result) throw new Error('Invalid email or password');
          return result;
        },
        signup: async (
          _parent: unknown,
          {
            input,
          }: {
            input: {
              email: string;
              password: string;
              username: string;
              displayName: string;
              country: string;
            };
          }
        ) => {
          const result = await platform.signup(input);
          return result;
        },
        logout: async (
          _parent: unknown,
          { options }: { options: { token: string } }
        ) => {
          await platform.logout(options.token);
          return { success: true, message: 'Logged out' };
        },
      },
    },
  };
}
