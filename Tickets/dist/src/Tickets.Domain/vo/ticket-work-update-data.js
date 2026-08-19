"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketWorkUpdateData = void 0;
class TicketWorkUpdateData {
    constructor(status, service) {
        this.status = status;
        this.service = service;
    }
    setStatus(status) {
        this.status = status;
        return this;
    }
    setService(service) {
        this.service = service;
        return this;
    }
}
exports.TicketWorkUpdateData = TicketWorkUpdateData;
//# sourceMappingURL=ticket-work-update-data.js.map