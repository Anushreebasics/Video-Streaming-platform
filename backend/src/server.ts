import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';

dotenv.config();

import { initSocket } from './utils/socket';
import connectDatabase from './config/database';

const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Debug Logging
app.use((req, res, next) => {
    const log = `\n${new Date().toISOString()} - ${req.method} ${req.url}\nHeaders: ${JSON.stringify(req.headers)}\nBody: ${JSON.stringify(req.body)}\n`;
    fs.appendFileSync(path.join(__dirname, '../debug_requests.log'), log);

    const originalSend = res.send;
    res.send = function (body) {
        fs.appendFileSync(path.join(__dirname, '../debug_requests.log'), `Response ${res.statusCode}: ${body}\n`);
        return originalSend.call(this, body);
    };
    next();
});

// Routes
import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';
import userRoutes from './routes/userRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_org', (organizationId) => {
        socket.join(organizationId);
        console.log(`User ${socket.id} joined org ${organizationId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Database & Server Start
const DEFAULT_PORT = 5001;
const PORT = parseInt(process.env.PORT || '') || DEFAULT_PORT;

connectDatabase()
    .then(() => {
        const startServer = (port: number) => {
            httpServer.listen(port, () => {
                console.log(`🚀 Server running on http://localhost:${port}`);
            }).on('error', (err: any) => {
                if (err.code === 'EADDRINUSE') {
                    const fallbackPort = port + 1;
                    console.warn(`⚠️  Port ${port} in use, attempting fallback port ${fallbackPort}`);
                    startServer(fallbackPort);
                } else {
                    console.error('Server error:', err);
                }
            });
        };
        startServer(PORT);
    })
    .catch((err) => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
