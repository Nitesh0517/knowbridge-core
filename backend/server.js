/**
 * Main Express REST API Server for KnowBridge AI
 * Intelligent Knowledge Handover Platform
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend and cloud deployment
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-gemini-api-key']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads directory for document preview
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health & Service Information
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'KnowBridge AI Backend API',
    tagline: 'Never Lose Knowledge. Never Lose Momentum.',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[KnowBridge Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 KNOWBRIDGE AI BACKEND SERVER RUNNING ON PORT ${PORT}`);
    console.log(`   Health Check: http://localhost:${PORT}/health`);
    console.log(`   API Endpoint: http://localhost:${PORT}/api`);
    console.log(`==================================================`);
  });
}

startServer();

module.exports = app;
