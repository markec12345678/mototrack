import { SlotRegistry } from '@bitdev/harmony.harmony';

export type AiProviderMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type AiProviderGenerateOptions = {
  temperature?: number;
  maxTokens?: number;
};

export type AiProvider = {
  /**
   * unique name of the provider (e.g. 'openai', 'anthropic', 'fallback').
   */
  name: string;

  /**
   * generate a reply for the supplied messages. Should resolve with a plain
   * text response. Throws when the provider is misconfigured so the runtime
   * can try the next provider.
   */
  generate: (
    messages: AiProviderMessage[],
    opts?: AiProviderGenerateOptions
  ) => Promise<string>;
};

export type AiProviderSlot = SlotRegistry<AiProvider[]>;
