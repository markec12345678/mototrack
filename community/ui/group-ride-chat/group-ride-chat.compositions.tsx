import React from 'react';
import { MockProvider } from '@markec/mototrack-platform.testing.mock-provider';
import { GroupRideChat } from './group-ride-chat.js';
import { MOCK_MESSAGES, MOCK_MY_SENDER_ID } from './group-ride-chat.mock.js';
import { ChatMessage } from './chat-message-type.js';

const wrapperStyle: React.CSSProperties = {
  minHeight: `100vh`,
  backgroundColor: `#020617`,
  display: `flex`,
  alignItems: `center`,
  justifyContent: `center`,
  padding: `32px`,
};

const panelStyle: React.CSSProperties = {
  width: `100%`,
  maxWidth: `520px`,
};

/**
 * Default — full chat panel with mock messages and all features enabled.
 */
export const DefaultChat = () => {
  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <GroupRideChat
            rideId="ride-1"
            rideName="Vršič Adventure Ride"
            currentUserId={MOCK_MY_SENDER_ID}
            initialMessages={MOCK_MESSAGES}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * EmptyChat — chat panel with no messages yet.
 */
export const EmptyChat = () => {
  const emptyMessages: ChatMessage[] = [];

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <GroupRideChat
            rideId="ride-2"
            rideName="Durmitor Zanka"
            currentUserId="user-42"
            initialMessages={emptyMessages}
          />
        </div>
      </div>
    </MockProvider>
  );
};

/**
 * MultiRider — chat with many participants from different countries.
 */
export const MultiRiderChat = () => {
  const multiMessages: ChatMessage[] = [
    {
      id: `m1`,
      senderId: `user-a`,
      senderName: `Tomáš Kováč`,
      senderCountry: `🇸🇰`,
      text: `Ahoj! Pripravený na jazdu cez Balkán!`,
      at: Date.now() - 1000 * 60 * 20,
    },
    {
      id: `m2`,
      senderId: `user-b`,
      senderName: `Ana Popović`,
      senderCountry: `🇷🇸`,
      text: `Zdravo svima! Jedva čekam ovu turu. 🏍️`,
      at: Date.now() - 1000 * 60 * 18,
    },
    {
      id: `m3`,
      senderId: `user-c`,
      senderName: `Dimitri Papadopoulos`,
      senderCountry: `🇬🇷`,
      text: `Γεια σας! Είμαι έτοιμος για την περιπέτεια!`,
      at: Date.now() - 1000 * 60 * 15,
    },
    {
      id: `m4`,
      senderId: `user-me`,
      senderName: `Jaz`,
      senderCountry: `🇸🇮`,
      text: `Super ekipa! Gremo ob 9:00 zjutraj?`,
      at: Date.now() - 1000 * 60 * 12,
    },
    {
      id: `m5`,
      senderId: `user-a`,
      senderName: `Tomáš Kováč`,
      senderCountry: `🇸🇰`,
      text: `Áno, o 9:00 je perfektné!`,
      at: Date.now() - 1000 * 60 * 10,
    },
    {
      id: `m6`,
      senderId: `user-b`,
      senderName: `Ana Popović`,
      senderCountry: `🇷🇸`,
      text: `Odlično! Vidimo se tamo. 🤝`,
      at: Date.now() - 1000 * 60 * 8,
    },
    {
      id: `m7`,
      senderId: `user-d`,
      senderName: `Klaus Müller`,
      senderCountry: `🇩🇪`,
      text: `Hallo! Ich bin auch dabei. Bis morgen früh!`,
      at: Date.now() - 1000 * 60 * 5,
    },
    {
      id: `m8`,
      senderId: `user-me`,
      senderName: `Jaz`,
      senderCountry: `🇸🇮`,
      text: `Odlično! Vidimo se jutri. Varno vožnjo vsem! 🏁`,
      at: Date.now() - 1000 * 60 * 2,
    },
  ];

  return (
    <MockProvider>
      <div style={wrapperStyle}>
        <div style={panelStyle}>
          <GroupRideChat
            rideId="ride-3"
            rideName="Balkanski Mega Tour 2025"
            currentUserId="user-me"
            initialMessages={multiMessages}
          />
        </div>
      </div>
    </MockProvider>
  );
};
