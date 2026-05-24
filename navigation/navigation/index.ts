import { NavigationAspect } from './navigation.aspect.js';

export type { NavigationBrowser } from './navigation.browser.runtime.js';
export type { NavigationNode, SpeakRequest } from './navigation.node.runtime.js';
export type { NavigationConfig } from './navigation-config.js';
export type { ActiveRoute } from './active-route.js';
export type { SpeakFn, SpeakOptions, SpeakPriority } from './speak.js';

export { NavigationAspect };
export default NavigationAspect;
