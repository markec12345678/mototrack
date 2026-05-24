import { createServer, type Server as HttpServer } from 'http';
import { Server as SocketIoServer, type Socket } from 'socket.io';

export type StartChatServerOptions = {
  /**
   * TCP port to listen on. Defaults to 3050.
   */
  port?: number;
};

export type ChatServerHandle = {
  io: SocketIoServer;
  httpServer: HttpServer;
  close: () => Promise<void>;
};

/**
 * Spin up an internal Socket.io server that powers group-ride chat.
 * Each connection joins a room per ride and the server broadcasts
 * messages, status and location updates to all peers in that room.
 *
 * Clients connect to ws://localhost:<port>/group-rides and send a
 * 'join' event with the ride id to enter the room.
 */
export function startGroupRideChatServer(
  options: StartChatServerOptions = {}
): ChatServerHandle {
  const port = options.port ?? 3050;
  const httpServer = createServer();
  const io = new SocketIoServer(httpServer, {
    path: '/group-rides',
    cors: { origin: '*' },
  });

  io.on('connection', (socket: Socket) => {
    let currentRoom: string | undefined;

    socket.on('join', (payload: { rideId: string; user?: { id: string; displayName: string } }) => {
      if (!payload || !payload.rideId) return;
      if (currentRoom) socket.leave(currentRoom);
      currentRoom = `ride:${payload.rideId}`;
      socket.join(currentRoom);
      socket.to(currentRoom).emit('peer:joined', {
        rideId: payload.rideId,
        user: payload.user,
        at: Date.now(),
      });
    });

    socket.on('message', (payload: { rideId: string; from: string; text: string }) => {
      if (!payload || !payload.rideId) return;
      const room = `ride:${payload.rideId}`;
      io.to(room).emit('message', { ...payload, at: Date.now() });
    });

    socket.on('status', (payload: { rideId: string; userId: string; status: string }) => {
      if (!payload || !payload.rideId) return;
      const room = `ride:${payload.rideId}`;
      io.to(room).emit('status', { ...payload, at: Date.now() });
    });

    socket.on('location', (payload: { rideId: string; userId: string; lat: number; lng: number }) => {
      if (!payload || !payload.rideId) return;
      const room = `ride:${payload.rideId}`;
      io.to(room).emit('location', { ...payload, at: Date.now() });
    });

    socket.on('disconnect', () => {
      if (currentRoom) {
        socket.to(currentRoom).emit('peer:left', { socketId: socket.id, at: Date.now() });
      }
    });
  });

  httpServer.listen(port);

  const close = async () => {
    await new Promise<void>((resolve) => {
      io.close(() => resolve());
    });
    await new Promise<void>((resolve) => {
      httpServer.close(() => resolve());
    });
  };

  return { io, httpServer, close };
}
