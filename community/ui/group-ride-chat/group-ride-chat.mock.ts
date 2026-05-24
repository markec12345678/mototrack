import { ChatMessage } from './chat-message-type.js';

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: `msg-1`,
    senderId: `user-1`,
    senderName: `Luka Horvat`,
    senderCountry: `🇸🇮`,
    text: `Živijo! Sem že na zbirnem mestu. Kdo prihaja?`,
    at: Date.now() - 1000 * 60 * 12,
  },
  {
    id: `msg-2`,
    senderId: `user-2`,
    senderName: `Marco Bianchi`,
    senderCountry: `🇮🇹`,
    text: `Ciao! Na poti sem, pridem čez 10 minut.`,
    at: Date.now() - 1000 * 60 * 10,
  },
  {
    id: `msg-3`,
    senderId: `user-3`,
    senderName: `Carlos Ruiz`,
    senderCountry: `🇪🇸`,
    text: `Hola amigos! Malo zamujam, prometna gneča na avtocesti.`,
    at: Date.now() - 1000 * 60 * 8,
  },
  {
    id: `msg-4`,
    senderId: `user-4`,
    senderName: `Jan Novák`,
    senderCountry: `🇨🇿`,
    text: `Sem tu! Parkiram motor.`,
    at: Date.now() - 1000 * 60 * 5,
  },
  {
    id: `msg-5`,
    senderId: `user-5`,
    senderName: `Ana Popović`,
    senderCountry: `🇷🇸`,
    text: `Prišla sem! Gremo kmalu?`,
    at: Date.now() - 1000 * 60 * 1,
  },
];

export const MOCK_MY_SENDER_ID = `user-1`;
