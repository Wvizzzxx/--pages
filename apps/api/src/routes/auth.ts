import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { loginSchema, registerSchema } from '@repo/schemas';
import { sendEmail, verificationEmailHtml, welcomeEmailHtml, isRealEmailProvider } from '../lib/email';

export const authRoutes = async (fastify: FastifyInstance) => {
  // Register
  fastify.post<{ Body: { name: string; email: string; password: string; acceptPolicy?: boolean } }>('/register', async (request, reply) => {
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
      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = await User.create({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        password: hashedPassword,
        verificationToken,
      });

      // Отправка email с подтверждением
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
      let emailPreviewUrl: string | undefined;

      try {
        const emailResult = await sendEmail({
          to: user.email,
          subject: 'Подтвердите ваш email — ГрузЭкспресс',
          html: verificationEmailHtml(user.name, verificationToken),
        });
        emailPreviewUrl = emailResult.previewUrl;
      } catch {}

      // Отправка welcome-письма
      sendEmail({
        to: user.email,
        subject: 'Добро пожаловать в ГрузЭкспресс! 🎉',
        html: welcomeEmailHtml(user.name),
      }).catch(() => {});

      const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });

      // Если нет реального email-провайдера, возвращаем ссылку на фронтенде
      const isDevMode = !isRealEmailProvider();

      return reply.status(201).send({
        success: true,
        message: 'Регистрация успешна. Проверьте почту для подтверждения email.',
        data: {
          token,
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            emailVerified: false,
            discount: 0,
            createdAt: user.createdAt,
          },
          // В dev-режиме передаём ссылку для подтверждения прямо на фронтенд
          ...(isDevMode && {
            devMode: true,
            verificationUrl,
            emailPreviewUrl,
          }),
        },
      });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Verify email
  fastify.get<{ Querystring: { token: string } }>('/verify-email', async (request, reply) => {
    try {
      const { token } = request.query;
      if (!token) {
        return reply.status(400).send({ success: false, message: 'Токен не указан' });
      }

      const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
      if (!user) {
        return reply.status(400).send({ success: false, message: 'Неверный или устаревший токен' });
      }

      user.emailVerified = true;
      user.verificationToken = null;
      await user.save();

      return reply.send({ success: true, message: 'Email успешно подтверждён!' });
    } catch (error) {
      return reply.status(500).send({ success: false, message: 'Ошибка сервера' });
    }
  });

  // Resend verification
  fastify.post<{ Body: { email: string } }>('/resend-verification', async (request, reply) => {
    try {
      const { email } = request.body;
      if (!email) {
        return reply.status(400).send({ success: false, message: 'Email не указан' });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+verificationToken');
      if (!user) {
        // Не раскрываем существование пользователя
        return reply.send({ success: true, message: 'Если аккаунт существует, письмо отправлено' });
      }

      if (user.emailVerified) {
        return reply.send({ success: true, message: 'Email уже подтверждён' });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      let emailPreviewUrl: string | undefined;
      try {
        const emailResult = await sendEmail({
          to: user.email,
          subject: 'Подтвердите ваш email — ГрузЭкспресс',
          html: verificationEmailHtml(user.name, verificationToken),
        });
        emailPreviewUrl = emailResult.previewUrl;
      } catch {}

      const isDevMode = !isRealEmailProvider();

      return reply.send({
        success: true,
        message: 'Письмо с подтверждением отправлено',
        ...(isDevMode && {
          devMode: true,
          verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`,
          emailPreviewUrl,
        }),
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
            emailVerified: user.emailVerified,
            discount: user.discount,
            totalOrders: user.totalOrders,
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
        emailVerified: user.emailVerified,
        discount: user.discount,
        totalOrders: user.totalOrders,
        createdAt: user.createdAt,
      },
    });
  });
};