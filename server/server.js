const path = require('path');
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./src/routes/auth');
const dataRoutes = require('./src/routes/data');

const app = express();

/* =========================
   CORS CONFIGURATION
========================= */

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://food-ai-gilt-seven.vercel.app'
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without origin (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json({ limit: '1mb' }));

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'FoodLink AI API',
        database:
            mongoose.connection.readyState === 1
                ? 'connected'
                : 'disconnected'
    });
});

/* =========================
   ROUTES
========================= */

app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);

/* =========================
   ERROR HANDLER
========================= */

app.use((err, _req, res, _next) => {
    console.error('Server Error:', err.message);

    res.status(err.status || 500).json({
        message: err.status
            ? err.message
            : 'Something went wrong.'
    });
});

/* =========================
   SERVER CONFIG
========================= */

const port = process.env.PORT || 5000;

/* =========================
   START SERVER
========================= */

async function start() {
    try {
        // Check MongoDB configuration
        if (
            !process.env.MONGODB_URI ||
            process.env.MONGODB_URI.includes('<cluster-url>')
        ) {
            console.error(
                'MongoDB URI is not configured. Please add MONGODB_URI.'
            );
            process.exit(1);
        }

        // Check JWT configuration
        if (
            !process.env.JWT_SECRET ||
            process.env.JWT_SECRET.startsWith('replace-with-')
        ) {
            console.error(
                'JWT_SECRET is not configured. Please add JWT_SECRET.'
            );
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('MongoDB connected');

        // Start Express server
        app.listen(port, '0.0.0.0', () => {
            console.log(`FoodLink API listening on port ${port}`);
        });

    } catch (err) {
        console.error(
            'Could not connect to MongoDB:',
            err.message
        );

        process.exit(1);
    }
}

start();
