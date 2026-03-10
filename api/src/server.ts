import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import prisma from './config/database';
import { verifyAccessToken } from './utils/jwt';

const httpServer = createServer(app);

// ─── Socket.io ────────────────────────────────────────────────
const io = new SocketServer(httpServer, {
    cors: {
        origin: env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST'],
    },
});

// JWT auth on WebSocket connection
io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Authentication required'));

    try {
        const payload = verifyAccessToken(token);
        socket.data.user = { id: payload.sub, name: payload.name, role: payload.role };
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

// ─── Chat Socket Events ───────────────────────────────────────
io.on('connection', (socket) => {
    const { id: userId, name } = socket.data.user as { id: string; name: string };
    logger.info('Socket connected', { userId, socketId: socket.id });

    // Join a conversation room
    socket.on('thread:join', (threadId: string) => {
        socket.join(`thread:${threadId}`);
        logger.debug('Socket joined thread', { userId, threadId });
    });

    // Leave a conversation room
    socket.on('thread:leave', (threadId: string) => {
        socket.leave(`thread:${threadId}`);
    });

    // Typing indicator (not persisted)
    socket.on('user:typing', ({ threadId }: { threadId: string }) => {
        socket.to(`thread:${threadId}`).emit('user:typing', { userId, name });
    });

    socket.on('disconnect', () => {
        logger.info('Socket disconnected', { userId, socketId: socket.id });
    });
});

export { io }; // Exported so services can emit events

// ─── Graceful Shutdown ────────────────────────────────────────
const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    await prisma.$disconnect();
    httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Start Server ─────────────────────────────────────────────
const start = async () => {
    try {
        // Verify DB connection
        await prisma.$connect();
        logger.info('✔ Database connected');

        httpServer.listen(env.PORT, () => {
            logger.info(`🚀 AwaasDirect API running on http://localhost:${env.PORT}`);
            logger.info(`   Environment : ${env.NODE_ENV}`);
            logger.info(`   Frontend URL: ${env.FRONTEND_URL}`);
        });
    } catch (err) {
        logger.error('Failed to start server', { error: err });
        process.exit(1);
    }
};

start();
