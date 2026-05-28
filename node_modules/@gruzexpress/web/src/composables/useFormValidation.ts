import { reactive } from 'vue';

export type ValidationRule = 
  | { type: 'required'; message?: string }
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'phone'; message?: string }
  | { type: 'pattern'; value: RegExp; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'match'; field: string; message?: string }
  | { type: 'custom'; validator: (value: any) => string | null };

export interface FormValidationResult<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  validateField: (fieldName: keyof T) => string | null;
  validate: () => boolean;
  reset: () => void;
  markTouched: (fieldName: string) => void;
  clearError: (fieldName: string) => void;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: Partial<Record<keyof T, ValidationRule[]>>
): FormValidationResult<T> {
  const values = { ...initialValues } as T;
  const errorsRef = reactive<Record<string, string>>({});
  const touchedRef = reactive<Record<string, boolean>>({});

  function validateField(fieldName: keyof T): string | null {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return null;

    const value = values[fieldName as keyof typeof values];

    for (const rule of fieldRules) {
      const error = applyRule(rule, value, values);
      if (error) {
        errorsRef[fieldName as string] = error;
        return error;
      }
    }

    delete errorsRef[fieldName as string];
    return null;
  }

  function applyRule(rule: ValidationRule, value: any, allValues: T): string | null {
    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          return rule.message || 'Это поле обязательно для заполнения';
        }
        return null;
      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          return rule.message || `Минимальная длина: ${rule.value} символов`;
        }
        return null;
      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          return rule.message || `Максимальная длина: ${rule.value} символов`;
        }
        return null;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return rule.message || 'Некорректный email';
        }
        return null;
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
          return rule.message || 'Некорректный номер телефона';
        }
        return null;
      case 'pattern':
        if (value && !rule.value.test(value)) {
          return rule.message || 'Неверный формат';
        }
        return null;
      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return rule.message || `Минимальное значение: ${rule.value}`;
        }
        return null;
      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return rule.message || `Максимальное значение: ${rule.value}`;
        }
        return null;
      case 'match':
        if (value !== allValues[rule.field as keyof T]) {
          return rule.message || 'Значения не совпадают';
        }
        return null;
      case 'custom':
        return rule.validator(value);
      default:
        return null;
    }
  }

  function validate(): boolean {
    let isValid = true;
    for (const fieldName of Object.keys(rules)) {
      const error = validateField(fieldName as keyof T);
      if (error) {
        isValid = false;
      }
    }
    return isValid;
  }

  function reset(): void {
    Object.assign(values, { ...initialValues });
    Object.keys(errorsRef).forEach((key) => delete errorsRef[key]);
    Object.keys(touchedRef).forEach((key) => delete touchedRef[key]);
  }

  function markTouched(fieldName: string): void {
    touchedRef[fieldName] = true;
  }

  function clearError(fieldName: string): void {
    delete errorsRef[fieldName];
  }

  return {
    values,
    errors: errorsRef,
    touched: touchedRef,
    validateField,
    validate,
    reset,
    markTouched,
    clearError,
  };
}