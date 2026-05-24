export type NavigationConfig = {
  /**
   * BCP-47 language code used to pick the SpeechSynthesis voice.
   * Defaults to `sl-SI` (Slovenian).
   */
  voiceLanguage?: string;

  /**
   * Default speech rate (0.1 - 10). Defaults to 1.0.
   */
  voiceRate?: number;

  /**
   * Default speech volume (0 - 1). Defaults to 1.0.
   */
  voiceVolume?: number;
};
