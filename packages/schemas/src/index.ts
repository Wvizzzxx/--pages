import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const createServiceSchema = z.object({
  title: z.string().min(2, 'Название должно содержать минимум 2 символа'),
  slug: z.string().min(2, 'URL-слаг должен содержать минимум 2 символа'),
  description: z.string().min(10, 'Описание должно содержать минимум 10 символов'),
  fullDescription: z.string().min(50, 'Полное описание должно содержать минимум 50 символов'),
  price: z.number().positive('Цена должна быть положительной'),
  priceUnit: z.string().min(1, 'Укажите единицу измерения цены'),
  features: z.array(z.string()).min(1, 'Добавьте хотя бы одну особенность'),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  image: z.string().optional(),
});

export const createOrderSchema = z.object({
  serviceId: z.string().min(1, 'Выберите услугу'),
  address: z.string().min(10, 'Укажите полный адрес'),
  phone: z.string().min(10, 'Укажите корректный номер телефона'),
  comment: z.string().optional(),
});

export const publicOrderSchema = z.object({
  serviceId: z.string().min(1, 'Выберите услугу'),
  serviceName: z.string().optional(),
  name: z.string().min(2, 'Укажите ваше имя'),
  phone: z.string().min(10, 'Укажите корректный номер телефона'),
  address: z.string().min(10, 'Укажите полный адрес'),
  comment: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['admin', 'user']),
});

// ============================================
// New Validation Schemas
// ============================================

export const updateOrderStatusWithCommentSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  comment: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  phone: z.string().min(10, 'Укажите корректный номер телефона').optional(),
  avatar: z.string().url('Укажите корректный URL аватара').optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Укажите текущий пароль'),
  newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email('Некорректный email'),
});

export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, 'Укажите токен'),
  newPassword: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

// ============================================
// Type Exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdateOrderStatusWithCommentInput = z.infer<typeof updateOrderStatusWithCommentSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
