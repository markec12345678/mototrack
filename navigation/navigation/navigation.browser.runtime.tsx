import { useState, useEffect } from 'react';
import { MototrackPlatformAspect } from '@markec/mototrack-platform.mototrack-platform';
import { DrivingModePage } from '@markec/navigation.pages.driving-mode-page';
import { TurnBanner } from '@markec/navigation.ui.turn-banner';
import { DeviationAlert } from '@markec/navigation.ui.deviation-alert';
import { NavInstruction } from '@markec/navigation.entities.nav-instruction';
import type { NavigationConfig } from './navigation-config.js';
import type { ActiveRoute } from './active-route.js';
import { ActiveRouteStore } from './active-route-store.js';
import type { SpeakOptions } from './speak.js';

const DEFAULT_CONFIG: Required<NavigationConfig> = {
  voiceLanguage: 'sl-SI',
  voiceRate: 1,
  voiceVolume: 1,
};

function pickVoice(language: string): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return undefined;
  const exact = voices.find((voice) => voice.lang === language);
  if (exact) return exact;
  const prefix = language.split('-')[0];
  return voices.find((voice) => voice.lang.startsWith(prefix));
}

type MototrackPlatformBrowserLike = {
  registerRoute: (routes: { path: string; component: () => JSX.Element; requiresAuth?: boolean }[]) => void;
  registerMapOverlay: (overlays: { key: string; position?: string; component: () => JSX.Element }[]) => void;
};

export class NavigationBrowser {
  constructor(
    private config: Required<NavigationConfig>,
    private activeRouteStore: ActiveRouteStore
  ) {}

  /**
   * set the currently active route. The TurnBanner and DeviationAlert
   * overlays will only render while a route is set.
   */
  setActiveRoute(route: ActiveRoute | null): this {
    this.activeRouteStore.set(route);
    return this;
  }

  /**
   * get the currently active route, if any.
   */
  getActiveRoute(): ActiveRoute | null {
    return this.activeRouteStore.get();
  }

  /**
   * subscribe to active route changes.
   */
  onActiveRouteChange(listener: (route: ActiveRoute | null) => void): () => void {
    return this.activeRouteStore.subscribe(listener);
  }

  /**
   * speak the given text using the browser SpeechSynthesis API.
   * Other aspects (turn-by-turn, deviation, safety alerts) can invoke
   * this to deliver voice prompts in the rider language.
   *
   * Returns `true` when the utterance was queued, `false` if the
   * environment has no SpeechSynthesis support.
   */
  speak(text: string, options: SpeakOptions = {}): boolean {
    if (!text) return false;
    if (typeof window === 'undefined' || !window.speechSynthesis) return false;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language ?? this.config.voiceLanguage;
    utterance.rate = options.rate ?? this.config.voiceRate;
    utterance.volume = options.volume ?? this.config.voiceVolume;

    const voice = pickVoice(utterance.lang);
    if (voice) utterance.voice = voice;

    if (options.priority === 'urgent') {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);
    return true;
  }

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig: NavigationConfig = {};

  static async provider(
    [mototrackPlatform]: [MototrackPlatformBrowserLike],
    config: NavigationConfig
  ) {
    const mergedConfig: Required<NavigationConfig> = {
      ...DEFAULT_CONFIG,
      ...config,
    };

    const activeRouteStore = new ActiveRouteStore();
    const navigation = new NavigationBrowser(mergedConfig, activeRouteStore);

    /**
     * register the /drive route.
     */
    mototrackPlatform.registerRoute([
      {
        path: '/drive',
        component: () => <DrivingModePage />,
        requiresAuth: true,
      },
    ]);

    /**
     * register the turn-by-turn banner (top-left) and deviation alert (bottom-left)
     * as map overlays. Both only render while an active route is set.
     */
    mototrackPlatform.registerMapOverlay([
      {
        key: 'navigation-turn-banner',
        position: 'top-left',
        component: () => (
          <ActiveRouteGuard store={activeRouteStore}>
            {(route) => (
              <TurnBanner
                instruction={NavInstruction.from({
                  id: `${route.id}-next`,
                  text: 'Nadaljujte naravnost',
                  distanceM: 500,
                  modifier: 'continue',
                  announceAt: 300,
                })}
                streetName={route.name}
                voiceEnabled
                btConnected={false}
              />
            )}
          </ActiveRouteGuard>
        ),
      },
      {
        key: 'navigation-deviation-alert',
        position: 'bottom-left',
        component: () => (
          <ActiveRouteGuard store={activeRouteStore}>
            {() => <DeviationAlert state="on-track" deviationMeters={0} />}
          </ActiveRouteGuard>
        ),
      },
    ]);

    return navigation;
  }
}

type ActiveRouteGuardProps = {
  store: ActiveRouteStore;
  children: (route: ActiveRoute) => JSX.Element | null;
};

function ActiveRouteGuard({ store, children }: ActiveRouteGuardProps) {
  const [route, setRoute] = useState<ActiveRoute | null>(() => store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe((next) => setRoute(next));
    return () => unsubscribe();
  }, [store]);

  if (!route) return null;
  return children(route);
}

export default NavigationBrowser;
