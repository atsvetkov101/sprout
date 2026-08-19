"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("./email");
describe('Тесты для объекта-значение Email', () => {
    describe('создание', () => {
        it('должен создавать экземпляр Email с корректным email адресом', () => {
            const email = new email_1.Email('test@example.com');
            expect(email.getValue()).toBe('test@example.com');
        });
        it('должен выбрасывать ошибку при создании с пустым значением', () => {
            expect(() => new email_1.Email('')).toThrow('Некорректный email адрес: ');
        });
        it('должен выбрасывать ошибку при создании с некорректным email адресом', () => {
            expect(() => new email_1.Email('invalid-email')).toThrow('Некорректный email адрес: invalid-email');
        });
    });
    describe('равенство', () => {
        it('должен считать два объекта Email равными, если значения одинаковы', () => {
            const email1 = new email_1.Email('test@example.com');
            const email2 = new email_1.Email('test@example.com');
            expect(email1.equals(email2)).toBe(true);
        });
        it('не должен считать два объекта Email равными, если значения различаются', () => {
            const email1 = new email_1.Email('test1@example.com');
            const email2 = new email_1.Email('test2@example.com');
            expect(email1.equals(email2)).toBe(false);
        });
    });
    describe('доступ к значению', () => {
        it('должен возвращать значение email адреса через метод getValue', () => {
            const email = new email_1.Email('test@example.com');
            expect(email.getValue()).toBe('test@example.com');
        });
        it('должен возвращать значение email адреса через метод toString', () => {
            const email = new email_1.Email('test@example.com');
            expect(email.toString()).toBe('test@example.com');
        });
    });
});
//# sourceMappingURL=email.spec.js.map