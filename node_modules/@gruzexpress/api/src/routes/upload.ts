import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';

export const uploadRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/image', { preHandler: [async (request, reply) => {
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
  }] }, async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ success: false, message: 'Файл не найден' });
      }

      // Создаем папку uploads если её нет
      const uploadDir = path.join(__dirname, '../../public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Генерируем уникальное имя файла
      const ext = data.filename.split('.').pop() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Сохраняем файл
      const buffer = await data.toBuffer();
      fs.writeFileSync(filepath, buffer);

      const url = `/uploads/${filename}`;
      return reply.status(201).send({ success: true, data: { url } });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка загрузки файла' });
    }
  });
};