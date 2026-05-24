export type AiAssistantConfig = {
  /**
   * OpenAI API key. When omitted the runtime falls back to process.env.OPENAI_API_KEY.
   */
  openaiApiKey?: string;

  /**
   * Anthropic API key. When omitted the runtime falls back to process.env.ANTHROPIC_API_KEY.
   */
  anthropicApiKey?: string;

  /**
   * OpenAI model name. Defaults to gpt-4o-mini.
   */
  openaiModel?: string;

  /**
   * Anthropic model name. Defaults to claude-3-5-haiku-latest.
   */
  anthropicModel?: string;
};
