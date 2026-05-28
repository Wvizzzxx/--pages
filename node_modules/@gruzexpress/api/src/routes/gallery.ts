import { FastifyInstance } from 'fastify';
import { Gallery } from '../models/Gallery';

// Публичные маршруты (без авторизации)
export const galleryPublicRoutes = async (fastify: FastifyInstance) => {
  // Получить все активные фото галереи
  fastify.get('/', async (request, reply) => {
    try {
      const { category, limit } = request.query as { category?: string; limit?: string };
      const filter: any = { isActive: true };
      if (category) filter.category = category;
      const query = Gallery.find(filter).sort({ sortOrder: 1, createdAt: -1 });
      if (limit) query.limit(parseInt(limit));
      const items = await query;
      return reply.send({ success: true, data: items });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Получить фото по ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const item = await Gallery.findById(id);
      if (!item) {
        return reply.status(404).send({ success: false, message: 'Фото не найдено' });
      }
      return reply.send({ success: true, data: item });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Получить список категорий
  fastify.get('/categories/list', async (request, reply) => {
    try {
      const categories = await Gallery.distinct('category', { isActive: true });
      return reply.send({ success: true, data: categories });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });
};

// Админские маршруты (с авторизацией)
export const galleryAdminRoutes = async (fastify: FastifyInstance) => {
  // Middleware для проверки авторизации админа
  const requireAdmin = async (request: any, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ success: false, message: 'Не авторизован' });
    }
    try {
      const jwt = await import('jsonwebtoken');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const { User } = await import('../models/User');
      const user = await User.findById(decoded.userId);
      if (!user || user.role !== 'admin') {
        return reply.status(403).send({ success: false, message: 'Доступ запрещен' });
      }
      (request as any).user = user;
    } catch {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  };

  // Получить все фото (включая неактивные)
  fastify.get('/', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { page = '1', limit = '20', category, search } = request.query as any;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const filter: any = {};
      if (category) filter.category = category;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const total = await Gallery.countDocuments(filter);
      const items = await Gallery.find(filter)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);
      return reply.send({
        success: true,
        data: { data: items, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Создать фото
  fastify.post('/', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const body = request.body as any;
      const item = new Gallery({
        title: body.title,
        description: body.description || '',
        imageUrl: body.imageUrl,
        category: body.category || 'general',
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== undefined ? body.isActive : true,
      });
      await item.save();
      return reply.status(201).send({ success: true, data: item });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message || 'Ошибка создания' });
    }
  });

  // Обновить фото
  fastify.patch('/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const item = await Gallery.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!item) {
        return reply.status(404).send({ success: false, message: 'Фото не найдено' });
      }
      return reply.send({ success: true, data: item });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message || 'Ошибка обновления' });
    }
  });

  // Удалить фото
  fastify.delete('/:id', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const item = await Gallery.findByIdAndDelete(id);
      if (!item) {
        return reply.status(404).send({ success: false, message: 'Фото не найдено' });
      }
      return reply.send({ success: true, message: 'Фото удалено' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка удаления' });
    }
  });
};