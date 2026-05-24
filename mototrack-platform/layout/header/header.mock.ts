import { type HeaderAction } from './header-action-type.js';

export const MOCK_SOS_ACTION: HeaderAction = {
  key: `sos`,
  label: `SOS`,
  icon: `🚨`,
  order: 1,
  onClick: () => {
    // eslint-disable-next-line no-console
    console.log(`SOS triggered`);
  },
};

export const MOCK_MOTOCHAT_ACTION: HeaderAction = {
  key: `motochat`,
  label: `MotoChat`,
  icon: `💬`,
  order: 2,
  onClick: () => {
    // eslint-disable-next-line no-console
    console.log(`MotoChat opened`);
  },
};

export const MOCK_NOTIFICATIONS_ACTION: HeaderAction = {
  key: `notifications`,
  label: `Notifications`,
  icon: `🔔`,
  order: 3,
  onClick: () => {
    // eslint-disable-next-line no-console
    console.log(`Notifications opened`);
  },
};

export const MOCK_HEADER_ACTIONS: HeaderAction[] = [
  MOCK_SOS_ACTION,
  MOCK_MOTOCHAT_ACTION,
  MOCK_NOTIFICATIONS_ACTION,
];

export const MOCK_AVATAR_URL =
  `https://storage.googleapis.com/bit-generated-images/images/image_dark_motorcycle_racing_dashboa_0_1779615246683.png`;
