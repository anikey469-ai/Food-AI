const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth');
const dataRoutes = require('./src/routes/data');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'FoodLink AI API', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);
app.use((err, _req, res, _next) => { console.error(err.message); res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong.' }); });
const port = process.env.PORT || 5000;
async function start() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<cluster-url>')) { console.warn('MongoDB URI is not configured. Add your Atlas URI to foodlink-ai/.env before starting the API.'); process.exit(1); }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.startsWith('replace-with-')) { console.warn('JWT_SECRET is not configured. Set a long random secret in foodlink-ai/.env before starting the API.'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(port, () => console.log(`FoodLink API listening on http://localhost:${port}`));
}
start().catch(err => { console.error('Could not connect to MongoDB:', err.message); process.exit(1); });
