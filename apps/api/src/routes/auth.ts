import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { loginSchema, registerSchema } from '@repo/schemas';

export const authRoutes = async (fastify: FastifyInstance) => {
  // Register
  fastify.post<{ Body: { name: string; email: string; password: string } }>('/register', async (request, reply) => {
    try {
      const parsed = registerSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ success: false, message: parsed.error.errors[0]?.message });
      }

      const existingUser = await User.findOne({ email: parsed.data.email.toLowerCase() });
      if (existingUser) {
        return reply.status(400).send({ success: false, message: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

      const user = await User.create({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        password: hashedPassword,
      });

      const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      return reply.status(201).send({
        success: true,
        data: {
          token,
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Login
  fastify.post<{ Body: { email: string; password: string } }>('/login', async (request, reply) => {
    try {
      const parsed = loginSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ success: false, message: parsed.error.errors[0]?.message });
      }

      const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+password');
      if (!user) {
        return reply.status(401).send({ success: false, message: 'Неверный email или пароль' });
      }

      const isMatch = await bcrypt.compare(parsed.data.password, user.password);
      if (!isMatch) {
        return reply.status(401).send({ success: false, message: 'Неверный email или пароль' });
      }

      const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      return reply.send({
        success: true,
        data: {
          token,
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Get me
  fastify.get('/me', { preHandler: [async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Не авторизован' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const userId = decoded.userId;
      const user = await User.findById(userId);
      if (!user) {
        return reply.status(404).send({ success: false, message: 'Пользователь не найден' });
      }
      return (request as any).user = { userId: user._id.toString(), role: user.role };
    } catch {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  }]}, async (request, reply) => {
    const user = await User.findById(request.user.userId);
    if (!user) {
      return reply.status(404).send({ success: false, message: 'Пользователь не найден' });
    }
    return reply.send({
      success: true,
      data: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  });
};