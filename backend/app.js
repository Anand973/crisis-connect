// backend/app.js
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/UserRoutes');
const UserResources=require('./routes/resourceRoute')
// Import other routes as needed

// Create Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from the React frontend
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/resources', UserResources);
// Add other routes as needed

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;