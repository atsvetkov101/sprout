"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceObject = void 0;
const uuid_1 = require("uuid");
const identifiers_1 = require("./identifiers");
class ServiceObject {
    constructor(data) {
        this.id = identifiers_1.ServiceObjectId.from((0, uuid_1.v4)());
        this.name = data.name;
        this.search_code = data.search_code;
        this.address = data.address;
        this.coords = data.coords;
        this.phone_number = data.phone_number;
        this.work_hours = data.work_hours;
    }
    getId() {
        return this.id;
    }
    getAddress() {
        return this.address;
    }
    getName() {
        return this.name;
    }
    getSearchCode() {
        return this.search_code;
    }
    getCoords() {
        return this.coords;
    }
    getPhoneNumber() {
        return this.phone_number;
    }
    getWorkHours() {
        return this.work_hours;
    }
}
exports.ServiceObject = ServiceObject;
//# sourceMappingURL=service-object.js.map