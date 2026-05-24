export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderCountry: string;
  senderAvatarUrl?: string;
  text: string;
  at: number;
};
