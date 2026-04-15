import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import type { UserRole } from '@repo/types';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      userId: string;
      role: UserRole;
    };
  }
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Не авторизован' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      return reply.status(401).send({ success: false, message: 'Пользователь не найден' });
    }

    request.user = { userId: user._id.toString(), role: user.role as UserRole };
  } catch (err) {
    return reply.status(401).send({ success: false, message: 'Неверный токен' });
  }
};

export const adminGuard = async (request: FastifyRequest, reply: FastifyReply) => {
  if (request.user.role !== 'admin') {
    return reply.status(403).send({ success: false, message: 'Доступ запрещен' });
  }
};

export const optionalAuthMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
      request.user = { userId: decoded.userId, role: 'user' };
    }
  } catch {
    // Token is invalid, but that's fine for optional auth
  }
};