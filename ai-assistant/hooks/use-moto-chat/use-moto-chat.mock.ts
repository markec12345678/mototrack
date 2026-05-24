import { ChatMessage } from '@markec/ai-assistant.entities.chat-message';

/**
 * A set of mock ChatMessage arrays for testing and compositions.
 */
export const mockMessages: ChatMessage[] = [
  ChatMessage.user('Predlagaj vijugasto pot po Soški dolini.'),
  ChatMessage.assistant(
    'Soška dolina ponuja eno izmed najlepših motorističnih poti v Evropi. Priporočam traso: Tolmin → Most na Soči → Kanal → Anhovo → Solkan. Pot vključuje čudovite razglede na turkizno Sočo, vijugaste odseke skozi soteske in mirne vasi. Skupna razdalja je približno 45 km, čas vožnje pa 1,5 ure brez postankov.'
  ),
  ChatMessage.user('Kakšno bo vreme jutri v Bovcu?'),
  ChatMessage.assistant(
    'Za jutri v Bovcu je napovedano delno oblačno vreme z možnostjo popoldanskih neviht. Temperatura bo med 18 °C in 26 °C. Priporočam, da se odpravite zjutraj, preden se razvijejo nevihte. Preverite tudi stanje ceste čez Vršič, ki je pogosto mokra po dežju.'
  ),
];

export const emptyMessages: ChatMessage[] = [];

export const singleUserMessage: ChatMessage[] = [
  ChatMessage.user('Ali je danes primerno za Kotor serpentine?'),
];

export const thinkingMessages: ChatMessage[] = [
  ChatMessage.user('Pripravi seznam pred vožnjo na Vršič.'),
];
