export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleAsyncErrors(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      const next = args[args.length - 1];
      next(error);
    }
  };
}

export function formatErrorResponse(error: any) {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      errors: error.errors,
    };
  }

  if (error.name === 'ValidationError') {
    return {
      success: false,
      message: 'Ошибка валидации',
      errors: Object.values(error.errors || {}).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    };
  }

  if (error.name === 'CastError') {
    return {
      success: false,
      message: 'Неверный формат ID',
    };
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    return {
      success: false,
      message: `Значение поля "${field}" уже существует`,
    };
  }

  return {
    success: false,
    message: 'Внутренняя ошибка сервера',
  };
}