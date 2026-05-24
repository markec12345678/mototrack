import { useCallback, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMessage = {
  /** Unique message identifier. */
  id: string;
  /** ID of the sender. */
  senderId: string;
  /** Display name of the sender. */
  senderName: string;
  /** Text content of the message. */
  text: string;
  /** Unix timestamp (ms) when the message was sent. */
  sentAt: number;
};

export type SendMessageInput = {
  text: string;
};

export type GroupRideChatConnection = {
  /**
   * Send a chat message to the ride channel.
   * @param input - Message payload containing the text.
   */
  sendMessage: (input: SendMessageInput) => void;

  /**
   * Register a listener that fires whenever a new message arrives.
   * Returns an unsubscribe function.
   * @param handler - Callback invoked with each incoming ChatMessage.
   */
  onMessage: (handler: (message: ChatMessage) => void) => () => void;

  /**
   * Whether the Socket.io connection is currently open.
   */
  readonly connected: boolean;

  /**
   * Disconnect and clean up the socket connection.
   */
  disconnect: () => void;
};

// ─── Minimal Socket.io-client shim types ─────────────────────────────────────

type SocketLike = {
  connected: boolean;
  emit: (event: string, data: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler: (...args: unknown[]) => void) => void;
  disconnect: () => void;
};

type IoFactory = (url: string, opts: { path: string; transports: string[] }) => SocketLike;

// ─── REST fallback polling ────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 5_000;

async function fetchMessages(rideId: string, since: number): Promise<ChatMessage[]> {
  const res = await fetch(`/api/group-rides/${rideId}/messages?since=${since}`);
  if (!res.ok) return [];
  return res.json() as Promise<ChatMessage[]>;
}

// ─── Imperative factory (used by useGroupRide) ────────────────────────────────

/**
 * createGroupRideChatConnection — opens a Socket.io connection to the
 * group-ride chat service imperatively (no React lifecycle).
 *
 * WebSocket path: /group-rides/:id
 *
 * Falls back to REST polling (`GET /api/group-rides/:id/messages`) when
 * Socket.io is unavailable.
 *
 * @param rideId - The ID of the group ride to connect to.
 * @returns A GroupRideChatConnection with sendMessage, onMessage, connected, and disconnect.
 */
export function createGroupRideChatConnection(rideId: string): GroupRideChatConnection {
  let socket: SocketLike | null = null;
  let isConnected = false;
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let lastPollAt = Date.now();
  let destroyed = false;
  const listeners = new Set<(msg: ChatMessage) => void>();

  const notifyListeners = (msg: ChatMessage) => {
    listeners.forEach((fn) => fn(msg));
  };

  const stopPolling = () => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  };

  const startPolling = () => {
    if (pollTimer) return;
    pollTimer = setInterval(async () => {
      if (destroyed) return;
      const since = lastPollAt;
      const messages = await fetchMessages(rideId, since);
      if (destroyed) return;
      if (messages.length > 0) {
        lastPollAt = Date.now();
        messages.forEach(notifyListeners);
      }
    }, POLL_INTERVAL_MS);
  };

  // Attempt Socket.io connection asynchronously
  import('socket.io-client')
    .then((ioModule) => {
      if (destroyed) return;
      const io: IoFactory =
        (ioModule as { default?: IoFactory }).default ??
        (ioModule as { io?: IoFactory }).io ??
        (ioModule as unknown as IoFactory);

      socket = io(
        typeof window !== 'undefined' ? window.location.origin : '',
        { path: `/group-rides/${rideId}`, transports: ['websocket'] }
      );

      socket.on('connect', () => {
        if (destroyed) return;
        isConnected = true;
        stopPolling();
      });

      socket.on('disconnect', () => {
        isConnected = false;
        if (!destroyed) startPolling();
      });

      socket.on('message', (...args: unknown[]) => {
        notifyListeners(args[0] as ChatMessage);
      });
    })
    .catch(() => {
      // socket.io-client not available — fall back to REST polling
      startPolling();
    });

  const sendMessage = (input: SendMessageInput) => {
    if (socket?.connected) {
      socket.emit('message', { text: input.text });
      return;
    }
    fetch(`/api/group-rides/${rideId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.text }),
    });
  };

  const onMessage = (handler: (message: ChatMessage) => void) => {
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  };

  const disconnect = () => {
    destroyed = true;
    stopPolling();
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    isConnected = false;
    listeners.clear();
  };

  return {
    sendMessage,
    onMessage,
    get connected() {
      return isConnected;
    },
    disconnect,
  };
}

// ─── React hook wrapper ───────────────────────────────────────────────────────

/**
 * useGroupRideChat — React hook that manages the lifecycle of a
 * GroupRideChatConnection, automatically disconnecting on unmount.
 *
 * @param rideId - The ID of the group ride to connect to.
 * @returns A stable GroupRideChatConnection reference.
 */
export function useGroupRideChat(rideId: string): GroupRideChatConnection {
  const connectionRef = useRef<GroupRideChatConnection | null>(null);

  if (!connectionRef.current) {
    connectionRef.current = createGroupRideChatConnection(rideId);
  }

  useEffect(() => {
    const prev = connectionRef.current;
    // Reconnect when rideId changes
    if (prev) prev.disconnect();
    connectionRef.current = createGroupRideChatConnection(rideId);

    return () => {
      connectionRef.current?.disconnect();
    };
  }, [rideId]);

  const sendMessage = useCallback(
    (input: SendMessageInput) => connectionRef.current?.sendMessage(input),
    []
  );

  const onMessage = useCallback(
    (handler: (message: ChatMessage) => void) =>
      connectionRef.current?.onMessage(handler) ?? (() => undefined),
    []
  );

  const disconnect = useCallback(() => connectionRef.current?.disconnect(), []);

  return {
    sendMessage,
    onMessage,
    get connected() {
      return connectionRef.current?.connected ?? false;
    },
    disconnect,
  };
}
