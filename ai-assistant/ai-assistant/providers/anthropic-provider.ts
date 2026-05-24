import type { AiProvider, AiProviderMessage, AiProviderGenerateOptions } from '../ai-provider.js';

export type AnthropicProviderOptions = {
  apiKey?: string;
  model?: string;
};

type AnthropicResponse = {
  content?: Array<{ type: string; text?: string }>;
};

/**
 * Anthropic Messages provider. Uses the configured API key when set,
 * otherwise falls back to process.env.ANTHROPIC_API_KEY. The generate()
 * call throws when no key is configured.
 */
export function createAnthropicProvider(
  options: AnthropicProviderOptions = {}
): AiProvider {
  const model = options.model ?? 'claude-3-5-haiku-latest';

  return {
    name: 'anthropic',
    async generate(messages: AiProviderMessage[], opts?: AiProviderGenerateOptions) {
      const apiKey = options.apiKey ?? process.env.ANTHROPIC_API_KEY;
      if (!apiKey) throw new Error('Anthropic API key is not configured.');

      const systemMessages = messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content)
        .join('\n');

      const conversation = messages
        .filter((message) => message.role !== 'system')
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: systemMessages || undefined,
          messages: conversation,
          temperature: opts?.temperature ?? 0.7,
          max_tokens: opts?.maxTokens ?? 512,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Anthropic request failed (${response.status}): ${text}`);
      }

      const payload = (await response.json()) as AnthropicResponse;
      const reply = payload.content
        ?.filter((block) => block.type === 'text')
        .map((block) => block.text ?? '')
        .join('\n')
        .trim();
      if (!reply) throw new Error('Anthropic returned an empty response.');
      return reply;
    },
  };
}
