"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(value) {
        if (!Address.isValid(value)) {
            throw new Error(`Некорректный адрес: ${value}`);
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
        return value.trim().length > 0;
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map