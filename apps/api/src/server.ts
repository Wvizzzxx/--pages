import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import path from 'path';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { authRoutes } from './routes/auth';
import { serviceRoutes } from './routes/services';
import { orderRoutes } from './routes/orders';
import { uploadRoutes } from './routes/upload';
import { userRoutes } from './routes/users';

// Load environment variables
dotenv.config();

const server = Fastify({ 
  logger: {
    level: 'info',
  } 
});

// Global error handler
server.setErrorHandler(function (error, request, reply) {
  this.log.error(error);
  
  reply.status(500).send({
    success: false,
    message: error.message || 'Внутренняя ошибка сервера',
  });
});

// CORS
server.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
});

// Static files (uploads)
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public/uploads'),
  prefix: '/uploads/',
});

// Multipart for file uploads
server.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Health check
server.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
server.register(authRoutes, { prefix: '/api/auth' });
server.register(serviceRoutes, { prefix: '/api/services' });
server.register(orderRoutes, { prefix: '/api/orders' });
server.register(uploadRoutes, { prefix: '/api/upload' });
server.register(userRoutes, { prefix: '/api/users' });

const start = async () => {
  try {
    await connectDB();
    await server.listen({ port: 4000, host: '0.0.0.0' });
    console.log('Server running on port 4000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();