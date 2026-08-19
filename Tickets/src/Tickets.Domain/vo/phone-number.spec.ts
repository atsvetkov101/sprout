import { PhoneNumber } from './phone-number';

describe('Тесты для объекта-значение PhoneNumber', () => {
  describe('создание', () => {
    it('должен создавать экземпляр PhoneNumber с корректным номером телефона', () => {
      const phone = new PhoneNumber('+7 (123) 456-78-90');
      expect(phone.getValue()).toBe('+7 (123) 456-78-90');
    });

    it('должен создавать экземпляр PhoneNumber с номером без форматирования', () => {
      const phone = new PhoneNumber('1234567');
      expect(phone.getValue()).toBe('1234567');
    });

    it('должен выбрасывать ошибку при создании с пустым значением', () => {
      expect(() => new PhoneNumber('')).toThrow('Некорректный номер телефона: ');
    });

    it('должен выбрасывать ошибку при создании с некорректным номером телефона', () => {
      expect(() => new PhoneNumber('abc')).toThrow('Некорректный номер телефона: abc');
    });

    it('должен выбрасывать ошибку при создании с номером, содержащим слишком мало цифр', () => {
      expect(() => new PhoneNumber('123')).toThrow('Некорректный номер телефона: 123');
    });

    it('должен выбрасывать ошибку при создании с номером, содержащим слишком много цифр', () => {
      expect(() => new PhoneNumber('1234567890123456')).toThrow(
        'Некорректный номер телефона: 1234567890123456',
      );
    });

    it('должен выбрасывать ошибку при создании с номером, содержащим недопустимые символы', () => {
      expect(() => new PhoneNumber('+7 (123) 456-78-90!')).toThrow(
        'Некорректный номер телефона: +7 (123) 456-78-90!',
      );
    });
  });

  describe('равенство', () => {
    it('должен считать два объекта PhoneNumber равными, если значения одинаковы', () => {
      const phone1 = new PhoneNumber('+7 (123) 456-78-90');
      const phone2 = new PhoneNumber('+7 (123) 456-78-90');
      expect(phone1.equals(phone2)).toBe(true);
    });

    it('не должен считать два объекта PhoneNumber равными, если значения различаются', () => {
      const phone1 = new PhoneNumber('+7 (123) 456-78-90');
      const phone2 = new PhoneNumber('+7 (123) 456-78-91');
      expect(phone1.equals(phone2)).toBe(false);
    });
  });

  describe('доступ к значению', () => {
    it('должен возвращать значение номера телефона через метод getValue', () => {
      const phone = new PhoneNumber('+7 (123) 456-78-90');
      expect(phone.getValue()).toBe('+7 (123) 456-78-90');
    });

    it('должен возвращать значение номера телефона через метод toString', () => {
      const phone = new PhoneNumber('+7 (123) 456-78-90');
      expect(phone.toString()).toBe('+7 (123) 456-78-90');
    });
  });

  describe('валидация', () => {
    it('должен считать корректным номер с 7 цифрами', () => {
      expect(PhoneNumber.isValid('1234567')).toBe(true);
    });

    it('должен считать корректным номер с 15 цифрами', () => {
      expect(PhoneNumber.isValid('123456789012345')).toBe(true);
    });

    it('должен считать корректным номер с плюсом и форматированием', () => {
      expect(PhoneNumber.isValid('+7 (123) 456-78-90')).toBe(true);
    });

    it('должен считать некорректным пустое значение', () => {
      expect(PhoneNumber.isValid('')).toBe(false);
    });

    it('должен считать некорректным значение с менее чем 7 цифрами', () => {
      expect(PhoneNumber.isValid('123456')).toBe(false);
    });

    it('должен считать некорректным значение с более чем 15 цифрами', () => {
      expect(PhoneNumber.isValid('1234567890123456')).toBe(false);
    });

    it('должен считать некорректным значение с недопустимыми символами', () => {
      expect(PhoneNumber.isValid('+7 (123) 456-78-90!')).toBe(false);
    });

    it('должен считать некорректным значение с буквами', () => {
      expect(PhoneNumber.isValid('abc1234567')).toBe(false);
    });
  });
});