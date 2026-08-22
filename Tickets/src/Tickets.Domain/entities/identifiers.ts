
// Базовый тип для всех брендированных идентификаторов
export type Brand<K, T> = K & { __brand: T };

// Объявление уникальных типов идентификаторов
export type ServiceObjectId = Brand<string, 'ServiceObjectId'>;

// Фабрика (Value Object / Утилита) для создания и валидации ID
export const ServiceObjectId = {
  /**
   * Создает ServiceObjectId из сырой строки (например, из UUID базы данных).
   * Выполняет роль явного приведения типов (Type Assertion).
   */
  from: (id: string): ServiceObjectId => {
    if (!id) throw new Error('ServiceObjectId cannot be empty');
    return id as ServiceObjectId;
  },

  /**
   * Type Guard для проверки, является ли строка валидным ServiceObjectId
   */
  isValid: (id: string): id is ServiceObjectId => {
    // Здесь может быть проверка регулярным выражением (например, на UUID)
    return typeof id === 'string' && id.length > 0;
  }
};

// Объявление уникальных типов идентификаторов
export type ChecklistId = Brand<string, 'ChecklistId'>;

// Фабрика (Value Object / Утилита) для создания и валидации ID
export const ChecklistId = {
  /**
   * Создает ChecklistId из сырой строки (например, из UUID базы данных).
   * Выполняет роль явного приведения типов (Type Assertion).
   */
  from: (id: string): ChecklistId => {
    if (!id) throw new Error('ChecklistId cannot be empty');
    return id as ChecklistId;
  },

  /**
   * Type Guard для проверки, является ли строка валидным ChecklistId
   */
  isValid: (id: string): id is ChecklistId => {
    // Здесь может быть проверка регулярным выражением (например, на UUID)
    return typeof id === 'string' && id.length > 0;
  }
};

// Объявление уникальных типов идентификаторов
export type TicketWorkId = Brand<string, 'TicketWorkId'>;

// Фабрика (Value Object / Утилита) для создания и валидации ID
export const TicketWorkId = {
  /**
   * Создает TicketWorkId из сырой строки (например, из UUID базы данных).
   * Выполняет роль явного приведения типов (Type Assertion).
   */
  from: (id: string): TicketWorkId => {
    if (!id) throw new Error('TicketWorkId cannot be empty');
    return id as TicketWorkId;
  },

  /**
   * Type Guard для проверки, является ли строка валидным TicketWorkId
   */
  isValid: (id: string): id is TicketWorkId => {
    // Здесь может быть проверка регулярным выражением (например, на UUID)
    return typeof id === 'string' && id.length > 0;
  }
};

// Объявление уникальных типов идентификаторов
export type TicketRecordId = Brand<string, 'TicketRecordId'>;

// Фабрика (Value Object / Утилита) для создания и валидации ID
export const TicketRecordId = {
  /**
   * Создает TicketRecordId из сырой строки (например, из UUID базы данных).
   * Выполняет роль явного приведения типов (Type Assertion).
   */
  from: (id: string): TicketRecordId => {
    if (!id) throw new Error('TicketRecordId cannot be empty');
    return id as TicketRecordId;
  },

  /**
   * Type Guard для проверки, является ли строка валидным TicketRecordId
   */
  isValid: (id: string): id is TicketRecordId => {
    // Здесь может быть проверка регулярным выражением (например, на UUID)
    return typeof id === 'string' && id.length > 0;
  }
};