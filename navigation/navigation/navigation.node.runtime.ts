import { MototrackPlatformAspect } from '@markec/mototrack-platform.mototrack-platform';
import { createNavigationGqlSchema } from './navigation.graphql.js';

export type SpeakRequest = {
  text: string;
  priority?: string;
  receivedAt: number;
};

/**
 * Node runtime for the navigation aspect.
 *
 * The actual voice playback happens in the browser (SpeechSynthesis),
 * so the node runtime only persists a short rolling log of recent speak
 * requests for diagnostics, and exposes the speak mutation over GraphQL.
 */
export class NavigationNode {
  private speakLog: SpeakRequest[] = [];

  private readonly maxLogEntries = 50;

  /**
   * record a speak request and acknowledge it.
   * Returns true once the request was accepted.
   */
  async speak(text: string, options?: { priority?: string }): Promise<boolean> {
    if (!text) return false;
    const entry: SpeakRequest = {
      text,
      priority: options?.priority,
      receivedAt: Date.now(),
    };
    this.speakLog = [entry, ...this.speakLog].slice(0, this.maxLogEntries);
    return true;
  }

  /**
   * list recent speak requests for diagnostics.
   */
  listRecentSpeakRequests(): SpeakRequest[] {
    return [...this.speakLog];
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig = {};

  static async provider([mototrackPlatform]: [{ registerBackendServer: (servers: unknown[]) => void }]) {
    const navigation = new NavigationNode();
    const gqlSchema = createNavigationGqlSchema(navigation);

    mototrackPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    return navigation;
  }
}

export default NavigationNode;
