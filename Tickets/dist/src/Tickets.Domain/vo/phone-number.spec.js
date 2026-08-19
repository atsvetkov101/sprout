"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phone_number_1 = require("./phone-number");
describe('Тесты для объекта-значение PhoneNumber', () => {
    describe('создание', () => {
        it('должен создавать экземпляр PhoneNumber с корректным номером телефона', () => {
            const phone = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            expect(phone.getValue()).toBe('+7 (123) 456-78-90');
        });
        it('должен создавать экземпляр PhoneNumber с номером без форматирования', () => {
            const phone = new phone_number_1.PhoneNumber('1234567');
            expect(phone.getValue()).toBe('1234567');
        });
        it('должен выбрасывать ошибку при создании с пустым значением', () => {
            expect(() => new phone_number_1.PhoneNumber('')).toThrow('Некорректный номер телефона: ');
        });
        it('должен выбрасывать ошибку при создании с некорректным номером телефона', () => {
            expect(() => new phone_number_1.PhoneNumber('abc')).toThrow('Некорректный номер телефона: abc');
        });
        it('должен выбрасывать ошибку при создании с номером, содержащим слишком мало цифр', () => {
            expect(() => new phone_number_1.PhoneNumber('123')).toThrow('Некорректный номер телефона: 123');
        });
        it('должен выбрасывать ошибку при создании с номером, содержащим слишком много цифр', () => {
            expect(() => new phone_number_1.PhoneNumber('1234567890123456')).toThrow('Некорректный номер телефона: 1234567890123456');
        });
        it('должен выбрасывать ошибку при создании с номером, содержащим недопустимые символы', () => {
            expect(() => new phone_number_1.PhoneNumber('+7 (123) 456-78-90!')).toThrow('Некорректный номер телефона: +7 (123) 456-78-90!');
        });
    });
    describe('равенство', () => {
        it('должен считать два объекта PhoneNumber равными, если значения одинаковы', () => {
            const phone1 = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            const phone2 = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            expect(phone1.equals(phone2)).toBe(true);
        });
        it('не должен считать два объекта PhoneNumber равными, если значения различаются', () => {
            const phone1 = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            const phone2 = new phone_number_1.PhoneNumber('+7 (123) 456-78-91');
            expect(phone1.equals(phone2)).toBe(false);
        });
    });
    describe('доступ к значению', () => {
        it('должен возвращать значение номера телефона через метод getValue', () => {
            const phone = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            expect(phone.getValue()).toBe('+7 (123) 456-78-90');
        });
        it('должен возвращать значение номера телефона через метод toString', () => {
            const phone = new phone_number_1.PhoneNumber('+7 (123) 456-78-90');
            expect(phone.toString()).toBe('+7 (123) 456-78-90');
        });
    });
    describe('валидация', () => {
        it('должен считать корректным номер с 7 цифрами', () => {
            expect(phone_number_1.PhoneNumber.isValid('1234567')).toBe(true);
        });
        it('должен считать корректным номер с 15 цифрами', () => {
            expect(phone_number_1.PhoneNumber.isValid('123456789012345')).toBe(true);
        });
        it('должен считать корректным номер с плюсом и форматированием', () => {
            expect(phone_number_1.PhoneNumber.isValid('+7 (123) 456-78-90')).toBe(true);
        });
        it('должен считать некорректным пустое значение', () => {
            expect(phone_number_1.PhoneNumber.isValid('')).toBe(false);
        });
        it('должен считать некорректным значение с менее чем 7 цифрами', () => {
            expect(phone_number_1.PhoneNumber.isValid('123456')).toBe(false);
        });
        it('должен считать некорректным значение с более чем 15 цифрами', () => {
            expect(phone_number_1.PhoneNumber.isValid('1234567890123456')).toBe(false);
        });
        it('должен считать некорректным значение с недопустимыми символами', () => {
            expect(phone_number_1.PhoneNumber.isValid('+7 (123) 456-78-90!')).toBe(false);
        });
        it('должен считать некорректным значение с буквами', () => {
            expect(phone_number_1.PhoneNumber.isValid('abc1234567')).toBe(false);
        });
    });
});
//# sourceMappingURL=phone-number.spec.js.map