"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        if (!Email.isValid(value)) {
            throw new Error(`Некорректный email адрес: ${value}`);
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    static isValid(value) {
        if (!value || typeof value !== 'string') {
            return false;
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
        return emailRegex.test(value);
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map