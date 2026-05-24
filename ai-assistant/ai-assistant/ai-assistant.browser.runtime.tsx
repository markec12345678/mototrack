import {
  MototrackPlatformAspect,
  type MototrackPlatformBrowser,
} from '@markec/mototrack-platform.mototrack-platform';
import { ChatHeaderTrigger } from '@markec/ai-assistant.ui.chat-header-trigger';

export class AiAssistantBrowser {
  constructor(private mototrackPlatform: MototrackPlatformBrowser) {}

  static dependencies = [MototrackPlatformAspect];

  static defaultConfig = {};

  static async provider([mototrackPlatform]: [MototrackPlatformBrowser]) {
    const aiAssistant = new AiAssistantBrowser(mototrackPlatform);

    mototrackPlatform.registerHeaderAction([
      {
        key: 'moto-chat',
        label: 'MotoChat',
        icon: '💬',
        component: ChatHeaderTrigger,
        order: 1,
      },
    ]);

    return aiAssistant;
  }
}

export default AiAssistantBrowser;
