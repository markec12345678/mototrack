import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import type { AiAssistantConfig } from './ai-assistant-config.js';
import {
  type AiProvider,
  type AiProviderMessage,
  type AiProviderSlot,
} from './ai-provider.js';
import { createOpenAiProvider } from './providers/openai-provider.js';
import { createAnthropicProvider } from './providers/anthropic-provider.js';
import { createFallbackProvider } from './providers/fallback-provider.js';
import { ChatMessageModel } from './chat-message.model.js';
import { ChatMessageRepository } from './chat-message-repository.js';
import { SLOVENIAN_SYSTEM_PROMPT, ensureSlovenian } from './slovenian.js';
import { webSearch, type WebSearchResult } from './web-search.js';
import { createAiAssistantGqlSchema } from './ai-assistant.graphql.js';

export type ChatInputMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatLocation = {
  lat?: number | null;
  lng?: number | null;
};

export type ChatContext = {
  currentLocation?: ChatLocation | null;
};

export type ChatCitation = {
  title: string;
  url: string;
};

export type ChatResult = {
  reply: string;
  citations: ChatCitation[];
};

export class AiAssistantNode {
  constructor(
    private chatMessageRepository: ChatMessageRepository,
    private aiProviderSlot: AiProviderSlot
  ) {}

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: AiAssistantConfig = {};

  /**
   * register one or more AI providers. Providers are evaluated in
   * registration order — the first one that returns a successful response
   * is used.
   */
  registerAiProvider(providers: AiProvider[]) {
    this.aiProviderSlot.register(providers);
    return this;
  }

  /**
   * list all currently registered AI providers.
   */
  listAiProviders(): AiProvider[] {
    return this.aiProviderSlot.flatValues();
  }

  /**
   * generate a chat reply. The system prompt is prepended automatically and
   * the conversation context (e.g. current location) is appended to the
   * system instructions. Each provider is tried in turn until one returns a
   * non-empty reply.
   */
  async chat(messages: ChatInputMessage[], context?: ChatContext): Promise<ChatResult> {
    const sessionId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const lastUser = [...messages].reverse().find((message) => message.role === 'user');
    if (lastUser) {
      await this.chatMessageRepository
        .createMessage({
          sessionId,
          role: 'user',
          content: lastUser.content,
        })
        .catch(() => undefined);
    }

    const conversation = this.buildConversation(messages, context);

    const providers = this.listAiProviders();
    let reply = '';
    let lastError: Error | undefined;

    for (const provider of providers) {
      try {
        const result = await provider.generate(conversation, {
          temperature: 0.7,
          maxTokens: 512,
        });
        if (result?.trim()) {
          reply = result.trim();
          break;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    if (!reply) {
      reply =
        lastError?.message ??
        'MotoChat trenutno ni na voljo. Poskusi znova čez nekaj trenutkov.';
    }

    const safeReply = ensureSlovenian(reply);

    await this.chatMessageRepository
      .createMessage({
        sessionId,
        role: 'assistant',
        content: safeReply,
      })
      .catch(() => undefined);

    return {
      reply: safeReply,
      citations: [],
    };
  }

  /**
   * perform a DuckDuckGo Instant Answer search.
   */
  webSearch(query: string): Promise<WebSearchResult> {
    return webSearch(query);
  }

  private buildConversation(
    messages: ChatInputMessage[],
    context?: ChatContext
  ): AiProviderMessage[] {
    const systemMessages: AiProviderMessage[] = [
      { role: 'system', content: SLOVENIAN_SYSTEM_PROMPT },
    ];

    if (context?.currentLocation?.lat != null && context.currentLocation.lng != null) {
      systemMessages.push({
        role: 'system',
        content: `Trenutna lokacija uporabnika: lat ${context.currentLocation.lat}, lng ${context.currentLocation.lng}.`,
      });
    }

    const filtered = messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    return [...systemMessages, ...filtered];
  }

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: AiAssistantConfig,
    [aiProviderSlot]: [AiProviderSlot]
  ) {
    const chatMessageModel = getModelForClass(ChatMessageModel);
    const chatMessageRepository = new ChatMessageRepository(chatMessageModel);

    const aiAssistant = new AiAssistantNode(chatMessageRepository, aiProviderSlot);

    aiAssistant.registerAiProvider([
      createOpenAiProvider({ apiKey: config.openaiApiKey, model: config.openaiModel }),
      createAnthropicProvider({
        apiKey: config.anthropicApiKey,
        model: config.anthropicModel,
      }),
      createFallbackProvider(),
    ]);

    const gqlSchema = createAiAssistantGqlSchema(aiAssistant);

    symphonyPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    return aiAssistant;
  }
}

export default AiAssistantNode;
