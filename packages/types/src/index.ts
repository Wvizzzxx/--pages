export type UserRole = 'admin' | 'user';

export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  priceUnit: string;
  image: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  userId?: string;
  serviceId?: string;
  customerName: string;
  serviceName: string;
  status: OrderStatus;
  address: string;
  phone: string;
  comment: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface CreateOrderDto {
  serviceId: string;
  address: string;
  phone: string;
  comment?: string;
}

export interface CreateServiceDto {
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  price: number;
  priceUnit: string;
  features: string[];
  isActive: boolean;
}

export interface UpdateServiceDto extends Partial<CreateServiceDto> {
  image?: string;
}

export interface PublicOrderDto {
  serviceId: string;
  serviceName?: string;
  name: string;
  phone: string;
  address: string;
  comment?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

// ============================================
// Password Reset Types
// ============================================

export interface ResetPasswordRequestDto {
  email: string;
}

export interface ResetPasswordConfirmDto {
  token: string;
  newPassword: string;
}

// ============================================
// Order Status History
// ============================================

export interface OrderStatusHistory {
  _id?: string;
  status: OrderStatus;
  changedAt: string;
  changedBy?: string;
  comment?: string;
}

export interface OrderWithHistory extends Order {
  statusHistory: OrderStatusHistory[];
}

// ============================================
// User Update Types
// ============================================

export interface UpdateUserDto {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ============================================
// Enhanced ApiResponse with ValidationErrors
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponseWithErrors {
  success: boolean;
  data?: any;
  message?: string;
  errors?: ValidationError[];
}

// ============================================
// Gallery Types
// ============================================

export interface GalleryItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryDto {
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateGalleryDto extends Partial<CreateGalleryDto> {}
