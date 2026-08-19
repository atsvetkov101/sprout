export class Address {
  private readonly value: string;

  constructor(value: string) {
    if (!Address.isValid(value)) {
      throw new Error(`Некорректный адрес: ${value}`);
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }

  equals(other: Address): boolean {
    return this.value === other.value;
  }

  static isValid(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    return value.trim().length > 0;
  }
}