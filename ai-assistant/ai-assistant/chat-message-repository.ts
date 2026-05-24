import type { ReturnModelType } from '@typegoose/typegoose';
import { ChatMessageModel } from './chat-message.model.js';

export type CreateChatMessageOptions = {
  sessionId: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class ChatMessageRepository {
  constructor(private chatMessageModel: ReturnModelType<typeof ChatMessageModel>) {}

  /**
   * persist a single chat message for the supplied session.
   */
  async createMessage(options: CreateChatMessageOptions): Promise<ChatMessageModel> {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const res = await this.chatMessageModel.create({
      id,
      sessionId: options.sessionId,
      role: options.role,
      content: options.content,
      createdAt: new Date(),
    });

    return res.toObject();
  }

  /**
   * list all chat messages for a given session, oldest first.
   */
  async listSessionMessages(sessionId: string): Promise<ChatMessageModel[]> {
    const messages = await this.chatMessageModel
      .find({ sessionId })
      .sort({ createdAt: 1 });
    return messages.map((message) => message.toObject());
  }
}
