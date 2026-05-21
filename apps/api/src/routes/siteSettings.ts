import { FastifyInstance } from 'fastify';
import { SiteSetting } from '../models/SiteSetting';

// Публичные маршруты
export const siteSettingsPublicRoutes = async (fastify: FastifyInstance) => {
  // Получить все настройки
  fastify.get('/', async (request, reply) => {
    try {
      const { section } = request.query as { section?: string };
      const filter: any = {};
      if (section) filter.section = section;
      const settings = await SiteSetting.find(filter).sort({ section: 1, key: 1 });
      const result: Record<string, string> = {};
      settings.forEach((s) => { result[s.key] = s.value; });
      return reply.send({ success: true, data: result });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Получить значение по ключу
  fastify.get('/:key', async (request, reply) => {
    try {
      const { key } = request.params as { key: string };
      const setting = await SiteSetting.findOne({ key });
      return reply.send({ success: true, data: setting?.value || '' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });
};

// Админские маршруты
export const siteSettingsAdminRoutes = async (fastify: FastifyInstance) => {
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
    } catch {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  };

  // Получить все настройки
  fastify.get('/', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const settings = await SiteSetting.find({}).sort({ section: 1, key: 1 });
      return reply.send({ success: true, data: settings });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Сохранить/обновить настройки (массово)
  fastify.post('/', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const body = request.body as { settings: Array<{ key: string; value: string; label: string; section: string }> };
      const results = [];
      for (const item of body.settings) {
        const updated = await SiteSetting.findOneAndUpdate(
          { key: item.key },
          { value: item.value, label: item.label, section: item.section },
          { upsert: true, new: true }
        );
        results.push(updated);
      }
      return reply.send({ success: true, data: results });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message || 'Ошибка сохранения' });
    }
  });

  // Удалить настройку
  fastify.delete('/:key', { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      const { key } = request.params as { key: string };
      await SiteSetting.findOneAndDelete({ key });
      return reply.send({ success: true, message: 'Настройка удалена' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка удаления' });
    }
  });
};