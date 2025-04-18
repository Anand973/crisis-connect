// backend/server.js
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});