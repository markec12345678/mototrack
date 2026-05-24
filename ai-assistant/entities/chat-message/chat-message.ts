// typegoose decorators are used server-side only. They are loaded lazily via
// dynamic import in the node runtime. This file must remain browser-safe.
// We stub the decorators so the class compiles without importing mongoose.
function prop(_opts?: Record<string, unknown>) { return (_t: unknown, _k?: unknown) => {}; }
function index(_fields: unknown, _opts?: unknown) { return (_t: unknown) => {}; }
function modelOptions(_opts: unknown) { return (_t: unknown) => {}; }

/**
 * Allowed roles for a chat message.
 */
export type ChatMessageRole = 'system' | 'user' | 'assistant';

/**
 * Plain object representation of a ChatMessage.
 */
export type PlainChatMessage = {
  /**
   * Unique identifier for the message.
   */
  id: string;

  /**
   * The session this message belongs to.
   */
  sessionId: string;

  /**
   * The role of the message author.
   */
  role: ChatMessageRole;

  /**
   * The text content of the message.
   */
  content: string;

  /**
   * Timestamp when the message was created.
   */
  createdAt: Date;
};

@modelOptions({ schemaOptions: { collection: 'chat_messages', timestamps: true } })
@index({ sessionId: 1 })
export class ChatMessage {
  @prop({ required: true })
  _id!: string;

  @prop({ required: true, index: true })
  sessionId!: string;

  @prop({ required: true, enum: ['system', 'user', 'assistant'] })
  role!: ChatMessageRole;

  @prop({ required: true })
  content!: string;

  @prop({ default: () => new Date() })
  createdAt!: Date;

  /**
   * Virtual id getter returning the unique identifier of the message.
   */
  get id(): string {
    return this._id;
  }

  constructor(
    readonly _idVal: string,
    readonly sessionIdVal: string,
    readonly roleVal: ChatMessageRole,
    readonly contentVal: string,
    readonly createdAtVal: Date = new Date()
  ) {
    this._id = _idVal;
    this.sessionId = sessionIdVal;
    this.role = roleVal;
    this.content = contentVal;
    this.createdAt = createdAtVal;
  }

  /**
   * Serialize the ChatMessage into a plain object.
   */
  toObject(): PlainChatMessage {
    return {
      id: this._id,
      sessionId: this.sessionId,
      role: this.role,
      content: this.content,
      createdAt: this.createdAt,
    };
  }

  /**
   * Create a ChatMessage from a plain object.
   */
  static from(plain: PlainChatMessage): ChatMessage {
    const { id = '', sessionId = '', role = 'user', content = '', createdAt = new Date() } = plain;
    return new ChatMessage(id, sessionId, role, content, createdAt);
  }

  /**
   * Create a system-role ChatMessage.
   */
  static system(text: string, sessionId = ''): ChatMessage {
    return new ChatMessage(generateId(), sessionId, 'system', text);
  }

  /**
   * Create a user-role ChatMessage.
   */
  static user(text: string, sessionId = ''): ChatMessage {
    return new ChatMessage(generateId(), sessionId, 'user', text);
  }

  /**
   * Create an assistant-role ChatMessage.
   */
  static assistant(text: string, sessionId = ''): ChatMessage {
    return new ChatMessage(generateId(), sessionId, 'assistant', text);
  }
}

/**
 * Browser-compatible UUID generation.
 */
function generateId(): string {
  if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
