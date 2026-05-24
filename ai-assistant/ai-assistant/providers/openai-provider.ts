import type { AiProvider, AiProviderMessage, AiProviderGenerateOptions } from '../ai-provider.js';

export type OpenAiProviderOptions = {
  apiKey?: string;
  model?: string;
};

type OpenAiChatResponse = {
  choices?: Array<{
    message?: { content?: string | null };
  }>;
};

/**
 * OpenAI Chat Completions provider. Uses the configured API key when
 * available, otherwise falls back to process.env.OPENAI_API_KEY. The
 * generate() call throws when no key is configured so the runtime can try
 * the next provider in the chain.
 */
export function createOpenAiProvider(options: OpenAiProviderOptions = {}): AiProvider {
  const model = options.model ?? 'gpt-4o-mini';

  return {
    name: 'openai',
    async generate(messages: AiProviderMessage[], opts?: AiProviderGenerateOptions) {
      const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
      if (!apiKey) throw new Error('OpenAI API key is not configured.');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: opts?.temperature ?? 0.7,
          max_tokens: opts?.maxTokens ?? 512,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`OpenAI request failed (${response.status}): ${text}`);
      }

      const payload = (await response.json()) as OpenAiChatResponse;
      const reply = payload.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('OpenAI returned an empty response.');
      return reply;
    },
  };
}
