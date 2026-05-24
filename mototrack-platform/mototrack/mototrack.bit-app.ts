import { HarmonyPlatform } from '@bitdev/harmony.harmony-platform';
import { NodeJSRuntime } from '@bitdev/harmony.runtimes.nodejs-runtime';
import { BrowserRuntime } from '@bitdev/harmony.runtimes.browser-runtime';
import { SymphonyPlatformAspect } from '@bitdev/symphony.symphony-platform';
import { MototrackPlatformAspect } from '@markec/mototrack-platform.mototrack-platform';
import { MapsAspect } from '@markec/maps.maps';
import { RidesAspect } from '@markec/rides.rides';
import { RoutesAspect } from '@markec/routes.routes';
import { BalkanRoadsAspect } from '@markec/balkan-roads.balkan-roads';
import { NavigationAspect } from '@markec/navigation.navigation';
import { SafetyAspect } from '@markec/safety.safety';
import { WeatherAspect } from '@markec/weather.weather';
import { GarageAspect } from '@markec/garage.garage';
import { CommunityAspect } from '@markec/community.community';
import { AiAssistantAspect } from '@markec/ai-assistant.ai-assistant';

/**
 * MotoTrack Balkan — compose all feature aspects into the platform.
 */
export const Mototrack = HarmonyPlatform.from({
  name: 'mototrack',
  platform: [
    SymphonyPlatformAspect,
    {
      name: 'MotoTrack',
      slogan: 'Najboljša moto-navigacija za Balkan',
      domain: 'mototrack.app',
      logo: 'https://static.bit.dev/extensions-icons/mototrack.svg',
    },
  ],

  runtimes: [new BrowserRuntime(), new NodeJSRuntime()],

  aspects: [
    MototrackPlatformAspect,
    MapsAspect,
    RidesAspect,
    RoutesAspect,
    BalkanRoadsAspect,
    NavigationAspect,
    SafetyAspect,
    WeatherAspect,
    GarageAspect,
    CommunityAspect,
    AiAssistantAspect,
  ],
});

export default Mototrack;
