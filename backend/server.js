import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ CORS CONFIGURATION ============
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000','https://frontend-c6qnvcj1q-pranavbanes-projects.vercel.app','https://frontend-c9d7m6jte-pranavbanes-projects.vercel.app',
  'https://*.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
}));

app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// ============ SECURITY MIDDLEWARE ============
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());

// ============ RATE LIMITING ============
// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour (was 15 minutes)
//   max: 500, // 500 requests per hour (was 100)
//   message: 'Too many requests, please try again later.',
//   skipSuccessfulRequests: true, // Don't count successful requests
// });
// app.use('/api', limiter);
if (process.env.NODE_ENV !== 'development') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
  });
  app.use('/api', limiter);
}
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 20, // 20 login attempts
//   message: 'Too many login attempts, please try again later.',
// });
// app.use('/api/auth', authLimiter);

// ============ BODY PARSER ============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============ LOGGING ============
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============ IMPORT ROUTES ============
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import instructorRoutes from './src/routes/instructorRoutes.js';
import lectureRoutes from './src/routes/lectureRoutes.js';
import dashboardRoutes from './src/routes/dashboardRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

// ============ REGISTER ROUTES ============
console.log('📡 Registering routes...');
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

console.log('✅ Routes registered:');
console.log('   /api/auth');
console.log('   /api/courses');
console.log('   /api/instructors');
console.log('   /api/lectures');
console.log('   /api/dashboard');
console.log('   /api/notifications');

// ============ MONGODB CONNECTION ============
console.log('🔍 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db-status', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    res.status(200).json({
      success: true,
      database: {
        state: states[state] || 'unknown',
        connected: state === 1,
        name: mongoose.connection.name || 'N/A',
        host: mongoose.connection.host || 'N/A',
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
// ============ 404 HANDLER ============
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ============ ERROR HANDLER ============
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// ============ START SERVER ============
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// ============ HANDLE PROCESS TERMINATION ============
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});