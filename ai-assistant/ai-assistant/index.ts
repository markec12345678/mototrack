import { AiAssistantAspect } from './ai-assistant.aspect.js';

export type { AiAssistantBrowser } from './ai-assistant.browser.runtime.js';
export type { AiAssistantNode, ChatInputMessage, ChatContext, ChatLocation, ChatCitation, ChatResult } from './ai-assistant.node.runtime.js';
export type { AiAssistantConfig } from './ai-assistant-config.js';
export type {
  AiProvider,
  AiProviderMessage,
  AiProviderGenerateOptions,
  AiProviderSlot,
} from './ai-provider.js';
export type { WebSearchResult, WebSearchSnippet } from './web-search.js';

export default AiAssistantAspect;
export { AiAssistantAspect };
