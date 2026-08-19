export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!Email.isValid(value)) {
      throw new Error(`Некорректный email адрес: ${value}`);
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    // Simple email validation using regular expression
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(value);
  }
}