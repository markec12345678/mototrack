import { GroupRide, mockGroupRides as entityMockGroupRides } from '@markec/community.entities.group-ride';

export const mockGroupRides: GroupRide[] = entityMockGroupRides(3);

export const mockChatMessages = [
  {
    id: 'msg-001',
    senderId: 'user-001',
    senderName: 'Luka Horvat',
    text: 'Živjo! Kdo je že na poti?',
    sentAt: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'msg-002',
    senderId: 'user-002',
    senderName: 'Marco Bianchi',
    text: 'Jaz pridem čez 20 minut 🏍️',
    sentAt: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 'msg-003',
    senderId: 'user-003',
    senderName: 'Ana Kovač',
    text: 'Že na poti, vidimo se tam!',
    sentAt: Date.now() - 1000 * 60 * 5,
  },
];
