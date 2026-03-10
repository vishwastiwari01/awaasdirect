import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { sendError } from './utils/response';

// ─── Route Imports ────────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import conversationRoutes from './routes/conversation.routes';
import messageRoutes from './routes/message.routes';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';

const app = express();

// ─── Security & Parsing Middleware ────────────────────────────
app.use(helmet());
app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
    sendError(res, 'Route not found', 404, 'NOT_FOUND');
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

export default app;
