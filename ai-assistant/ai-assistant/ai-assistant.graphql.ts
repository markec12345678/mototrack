import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { AiAssistantNode, ChatInputMessage, ChatContext } from './ai-assistant.node.runtime.js';

export function createAiAssistantGqlSchema(aiAssistantNode: AiAssistantNode): GqlSchema {
  return {
    typeDefs: gql`
      input ChatMessageInput {
        role: String!
        content: String!
      }

      input ChatLocationInput {
        lat: Float
        lng: Float
      }

      input ChatContextInput {
        currentLocation: ChatLocationInput
      }

      type ChatCitation {
        title: String!
        url: String!
      }

      type ChatResult {
        reply: String!
        citations: [ChatCitation!]
      }

      type WebSearchSnippet {
        title: String!
        url: String!
        text: String!
      }

      type WebSearchResult {
        snippets: [WebSearchSnippet!]!
      }

      type Query {
        webSearch(query: String!): WebSearchResult!
      }

      type Mutation {
        chat(messages: [ChatMessageInput!]!, context: ChatContextInput): ChatResult!
      }
    `,
    resolvers: {
      Query: {
        webSearch: (_root: unknown, { query }: { query: string }) => {
          return aiAssistantNode.webSearch(query);
        },
      },
      Mutation: {
        chat: (
          _root: unknown,
          {
            messages,
            context: chatContext,
          }: { messages: ChatInputMessage[]; context?: ChatContext }
        ) => {
          return aiAssistantNode.chat(messages, chatContext);
        },
      },
    },
  };
}
