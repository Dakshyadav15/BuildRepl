// backend/app.js
import cors from 'cors';
import express from 'express';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import searchRouter from './routes/search.js';

const app = express();

// --- CORS Configuration ---
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    exposedHeaders: ['x-auth-token'],
  })
);

// --- Middleware ---
app.use(express.json({ limit: '50mb', extended: false }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Define All Your Routes ---
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/search', searchRouter);

export default app;
