export class PhoneNumber {
  private readonly value: string;

  constructor(value: string) {
    if (!PhoneNumber.isValid(value)) {
      throw new Error(`Некорректный номер телефона: ${value}`);
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    // Удаляем все нецифровые символы для проверки
    const digits = value.replace(/\D/g, '');

    // Номер должен содержать от 7 до 15 цифр (международный стандарт E.164)
    if (digits.length < 7 || digits.length > 15) {
      return false;
    }

    // Проверяем, что строка содержит только допустимые символы:
    // цифры, пробелы, дефисы, круглые скобки, знак +
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(value.trim());
  }
}