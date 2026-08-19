"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumber = void 0;
class PhoneNumber {
    constructor(value) {
        if (!PhoneNumber.isValid(value)) {
            throw new Error(`Некорректный номер телефона: ${value}`);
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
        const digits = value.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
            return false;
        }
        const phoneRegex = /^\+?[\d\s\-()]+$/;
        return phoneRegex.test(value.trim());
    }
}
exports.PhoneNumber = PhoneNumber;
//# sourceMappingURL=phone-number.js.map