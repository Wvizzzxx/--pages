import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';
import { Service } from '../models/Service';
import { User } from '../models/User';
import { publicOrderSchema, updateOrderStatusSchema } from '@repo/schemas';

export const orderRoutes = async (fastify: FastifyInstance) => {
  // Создание публичного заказа (без авторизации)
  fastify.post('/public', async (request, reply) => {
    try {
      const parsed = publicOrderSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ success: false, message: parsed.error.errors[0]?.message });
      }

      let service: any = null;
      let total = 0;
      let serviceName = parsed.data.serviceName || 'Не указана';
      let userId: string | null = null;

      // Проверяем авторизацию пользователя (если есть токен)
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
          const user = await User.findById(decoded.userId);
          if (user) {
            userId = decoded.userId;
          }
        } catch {
          // Игнорируем ошибку авторизации, заказ всё равно будет создан
        }
      }

      if (parsed.data.serviceId) {
        service = await Service.findById(parsed.data.serviceId);
        if (service) {
          total = service.price;
          serviceName = service.title;
        }
      }

      const order = await Order.create({
        userId,
        serviceId: parsed.data.serviceId || null,
        serviceName,
        customerName: parsed.data.name,
        status: 'pending',
        address: parsed.data.address,
        phone: parsed.data.phone,
        comment: parsed.data.comment || '',
        total,
      });

      return reply.status(201).send({
        success: true,
        data: order,
        message: 'Заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.',
      });
    } catch (error) {
      console.error('Error creating public order:', error);
      return reply.status(500).send({ success: false, message: 'Ошибка отправки заявки' });
    }
  });

  // Создание заказа (авторизованный пользователь)
  fastify.post('/', async (request, reply) => {
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
        return reply.status(401).send({ success: false, message: 'Пользователь не найден' });
      }

      const body = request.body as any;

      let service: any = null;
      let total = 0;
      let serviceName = 'Не указана';

      if (body.serviceId) {
        service = await Service.findById(body.serviceId);
        if (service) {
          total = service.price;
          serviceName = service.title;
        }
      }

      const order = await Order.create({
        userId,
        serviceId: body.serviceId || null,
        serviceName: body.serviceName || serviceName,
        customerName: user.name,
        status: 'pending',
        address: body.address,
        phone: body.phone,
        comment: body.comment || '',
        total,
      });

      return reply.status(201).send({
        success: true,
        data: order,
        message: 'Заявка успешно отправлена!',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return reply.status(500).send({ success: false, message: 'Ошибка создания заказа' });
    }
  });

  // Получение заказов пользователя (авторизованный)
  fastify.get('/my', async (request, reply) => {
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
        return reply.status(401).send({ success: false, message: 'Пользователь не найден' });
      }

      // Ищем заказы привязанные к пользователю ИЛИ с его номером телефона
      const orders = await Order.find({
        $or: [
          { userId },
          { phone: user.phone }
        ]
      }).populate('serviceId').sort({ createdAt: -1 });

      return reply.send({ success: true, data: orders });
    } catch (error) {
      return reply.status(401).send({ success: false, message: 'Неверный токен' });
    }
  });

  // Получение всех заказов (админ)
  fastify.get('/all', async (request, reply) => {
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

    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('serviceId')
      .sort({ createdAt: -1 });
    return reply.send({ success: true, data: orders });
  });

  // Обновление статуса заказа (админ)
  const adminGuard = async (request: any, reply: any) => {
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
  };

  fastify.put('/:id/status', { preHandler: [adminGuard] }, async (request, reply) => {
    try {
      const parsed = updateOrderStatusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ success: false, message: parsed.error.errors[0]?.message });
      }
      const { id } = (request.params as any);
      const order = await Order.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true });
      if (!order) {
        return reply.status(404).send({ success: false, message: 'Заказ не найден' });
      }
      return reply.send({ success: true, data: order });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка обновления заказа' });
    }
  });

  // PATCH alias для обновления статуса (админ)
  fastify.patch('/:id/status', { preHandler: [adminGuard] }, async (request, reply) => {
    try {
      const parsed = updateOrderStatusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ success: false, message: parsed.error.errors[0]?.message });
      }
      const { id } = (request.params as any);
      const order = await Order.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true });
      if (!order) {
        return reply.status(404).send({ success: false, message: 'Заказ не найден' });
      }
      return reply.send({ success: true, data: order });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка обновления заказа' });
    }
  });

  // Удаление заказа (админ)
  fastify.delete('/:id', { preHandler: [adminGuard] }, async (request, reply) => {
    try {
      const { id } = (request.params as any);
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return reply.status(404).send({ success: false, message: 'Заказ не найден' });
      }
      return reply.send({ success: true, message: 'Заказ удалён' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка удаления заказа' });
    }
  });
};