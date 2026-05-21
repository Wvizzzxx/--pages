import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const userRoutes = async (fastify: FastifyInstance) => {
  // Get all users (admin)
  fastify.get('/', { preHandler: [async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Не авторизован' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Доступ запрещен' });
      }
    } catch {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  }] }, async (request, reply) => {
    const { page = 1, limit = 10, search } = request.query as any;
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    return reply.send({
      success: true,
      data: {
        data: users.map(u => ({
          _id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        })),
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  });

  const adminGuard = async (request: any, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Не авторизован' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const admin = await User.findById(decoded.userId);
      if (!admin || admin.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Доступ запрещен' });
      }
    } catch {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  };

  // Update user role (admin)
  const updateRoleHandler = async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const body = request.body;
      
      if (!body.role || !['admin', 'user'].includes(body.role)) {
        return reply.status(400).send({ success: false, message: 'Неверная роль' });
      }

      const user = await User.findByIdAndUpdate(id, { role: body.role }, { new: true }).select('-password');
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
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка обновления пользователя' });
    }
  };

  fastify.put('/:id/role', { preHandler: [adminGuard] }, updateRoleHandler);
  fastify.patch('/:id/role', { preHandler: [adminGuard] }, updateRoleHandler);

  // Delete user (admin)
  fastify.delete('/:id', { preHandler: [adminGuard] }, async (request: any, reply: any) => {
    try {
      const { id } = request.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return reply.status(404).send({ success: false, message: 'Пользователь не найден' });
      }
      return reply.send({ success: true, message: 'Пользователь удалён' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка удаления пользователя' });
    }
  });
};
