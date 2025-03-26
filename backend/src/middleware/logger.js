// src/middleware/logger.js

const winston = require('winston');
const morgan = require('morgan');

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Custom token for request body
morgan.token('body', (req) => {
  // Mask sensitive data
  const body = {...req.body};
  if (body.password) body.password = '********';
  if (body.token) body.token = '********';
  if (body.refreshToken) body.refreshToken = '********';
  
  return JSON.stringify(body);
});

// Create middleware
const requestLogger = morgan(
  ':method :url :status :response-time ms - :body',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    },
    skip: (req, res) => {
      // Skip logging for certain paths
      return req.path === '/health' || req.path === '/metrics';
    }
  }
);

module.exports = { logger, requestLogger };

// Add to server.js:
// app.use(requestLogger);