import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write streams
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom morgan format
const customFormat = ':method :url :status :res[content-length] - :response-time ms :user-agent';

// Morgan middleware with different streams
export const logAccess = morgan(customFormat, {
  stream: accessLogStream,
  skip: (req) => req.url === '/health',
});

// Error logging middleware
export const logError = (err, req, res, next) => {
  const logEntry = `
[${new Date().toISOString()}] ERROR: ${err.message}
URL: ${req.method} ${req.url}
IP: ${req.ip}
User-Agent: ${req.get('user-agent')}
Stack: ${err.stack}
----------------------------------------
`;

  errorLogStream.write(logEntry);
  next(err);
};

// Request logging middleware
export const logRequest = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = `
[${new Date().toISOString()}] ${req.method} ${req.url}
Status: ${res.statusCode}
Duration: ${duration}ms
IP: ${req.ip}
----------------------------------------
`;
    accessLogStream.write(logEntry);
  });
  next();
};

// Development logging
export const devLogger = morgan('dev');

// Production logging
export const prodLogger = morgan('combined', {
  stream: accessLogStream,
});

export default {
  logAccess,
  logError,
  logRequest,
  devLogger,
  prodLogger,
};