import { FastifyInstance } from 'fastify';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';
import { Service } from '../models/Service';
import { User } from '../models/User';
import { publicOrderSchema, updateOrderStatusSchema } from '@repo/schemas';
import { sendEmail, orderStatusEmailHtml } from '../lib/email';

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

      // Скидочная система для авторизованных пользователей
      let discountPercent = 0;
      let discountAmount = 0;
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          const allUserOrders = await Order.countDocuments({ userId });
          user.totalOrders = allUserOrders + 1;
          if (user.totalOrders >= 20) user.discount = 15;
          else if (user.totalOrders >= 10) user.discount = 10;
          else if (user.totalOrders >= 5) user.discount = 5;
          else user.discount = 0;
          await user.save();
          discountPercent = user.discount;
          if (discountPercent > 0 && total > 0) {
            discountAmount = Math.round(total * discountPercent / 100);
            total = total - discountAmount;
          }
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
        data: { ...order.toObject(), discount: discountPercent, discountAmount },
        message: discountPercent > 0
          ? `Заявка отправлена! Применена скидка ${discountPercent}% (−${discountAmount.toLocaleString('ru-RU')} ₽)`
          : 'Заявка успешно отправлена! Наш менеджер свяжется с вами в ближайшее время.',
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

      // Скидочная система: считаем количество завершённых заказов
      const completedOrders = await Order.countDocuments({ userId, status: 'completed' });
      user.totalOrders = completedOrders + 1; // +1 за текущий (ещё не completed, но считаем все созданные)
      // Actually count ALL orders for this user
      const allUserOrders = await Order.countDocuments({ userId });
      user.totalOrders = allUserOrders + 1; // +1 за текущий
      if (user.totalOrders >= 20) user.discount = 15;
      else if (user.totalOrders >= 10) user.discount = 10;
      else if (user.totalOrders >= 5) user.discount = 5;
      else user.discount = 0;
      await user.save();

      // Применяем скидку к сумме заказа
      let discountAmount = 0;
      if (user.discount > 0 && total > 0) {
        discountAmount = Math.round(total * user.discount / 100);
        total = total - discountAmount;
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
        data: { ...order.toObject(), discount: user.discount, discountAmount },
        message: user.discount > 0
          ? `Заявка отправлена! Применена скидка ${user.discount}% (−${discountAmount.toLocaleString('ru-RU')} ₽)`
          : 'Заявка успешно отправлена!',
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

    const { page = 1, limit = 10, status, search } = request.query as any;
    const query: any = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(query);
    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('serviceId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return reply.send({
      success: true,
      data: {
        docs: orders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
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

      // Пересчёт скидки при завершении заказа
      if (parsed.data.status === 'completed' && order.userId) {
        try {
          const user = await User.findById(order.userId);
          if (user) {
            const allUserOrders = await Order.countDocuments({ userId: user._id });
            user.totalOrders = allUserOrders;
            if (user.totalOrders >= 20) user.discount = 15;
            else if (user.totalOrders >= 10) user.discount = 10;
            else if (user.totalOrders >= 5) user.discount = 5;
            else user.discount = 0;
            await user.save();
          }
        } catch (discountErr) {
          console.error('[Orders] Ошибка пересчёта скидки:', discountErr);
        }
      }

      // Отправка email-уведомления пользователю
      try {
        if (order.userId) {
          const user = await User.findById(order.userId);
          if (user?.email) {
            await sendEmail({
              to: user.email,
              subject: `ГрузЭкспресс — статус заказа#${String(order._id).slice(-6).toUpperCase()} обновлён`,
              html: orderStatusEmailHtml(user.name, String(order._id), parsed.data.status, order.serviceName),
            });
          }
        }
      } catch (emailErr) {
        console.error('[Orders] Ошибка отправки email-уведомления:', emailErr);
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

      // Пересчёт скидки при завершении заказа
      if (parsed.data.status === 'completed' && order.userId) {
        try {
          const user = await User.findById(order.userId);
          if (user) {
            const allUserOrders = await Order.countDocuments({ userId: user._id });
            user.totalOrders = allUserOrders;
            if (user.totalOrders >= 20) user.discount = 15;
            else if (user.totalOrders >= 10) user.discount = 10;
            else if (user.totalOrders >= 5) user.discount = 5;
            else user.discount = 0;
            await user.save();
          }
        } catch (discountErr) {
          console.error('[Orders] Ошибка пересчёта скидки:', discountErr);
        }
      }

      // Отправка email-уведомления пользователю
      try {
        if (order.userId) {
          const user = await User.findById(order.userId);
          if (user?.email) {
            await sendEmail({
              to: user.email,
              subject: `ГрузЭкспресс — статус заказа#${String(order._id).slice(-6).toUpperCase()} обновлён`,
              html: orderStatusEmailHtml(user.name, String(order._id), parsed.data.status, order.serviceName),
            });
          }
        }
      } catch (emailErr) {
        console.error('[Orders] Ошибка отправки email-уведомления:', emailErr);
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