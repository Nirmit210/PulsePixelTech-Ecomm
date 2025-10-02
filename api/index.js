// Vercel serverless function handler for backend API
const app = require('../backend/server');

// Export the Express app as a serverless function
module.exports = app;