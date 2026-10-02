import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import playerRoutes from './routes/playerRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';


const app = express();


// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

export { app };