import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { NavigationNode } from './navigation.node.runtime.js';

/**
 * GraphQL schema for the navigation aspect.
 * Exposes a `speak` mutation so other aspects (or remote integrations) can
 * trigger voice prompts that the browser runtime ultimately plays.
 */
export function createNavigationGqlSchema(navigation: NavigationNode): GqlSchema {
  return {
    typeDefs: gql`
      type NavInstruction {
        text: String!
        distanceM: Float!
        modifier: String!
        announceAt: Float!
      }

      input SpeakOptions {
        priority: String
      }

      type Mutation {
        speak(text: String!, options: SpeakOptions): Boolean
      }
    `,
    resolvers: {
      Mutation: {
        speak: async (
          _req: unknown,
          { text, options }: { text: string; options?: { priority?: string } }
        ) => {
          return navigation.speak(text, options);
        },
      },
    },
  };
}
