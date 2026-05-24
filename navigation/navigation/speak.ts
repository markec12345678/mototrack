export type SpeakPriority = 'normal' | 'urgent';

export type SpeakOptions = {
  /**
   * Priority of the announcement. `urgent` cancels any pending speech.
   */
  priority?: SpeakPriority;

  /**
   * Override the configured language for this announcement.
   */
  language?: string;

  /**
   * Override the configured rate for this announcement.
   */
  rate?: number;

  /**
   * Override the configured volume for this announcement.
   */
  volume?: number;
};

export type SpeakFn = (text: string, options?: SpeakOptions) => boolean;
