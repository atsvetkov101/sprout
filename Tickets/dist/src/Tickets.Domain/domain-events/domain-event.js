"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const uuid_1 = require("uuid");
class DomainEvent {
    get EventId() {
        return this.eventId;
    }
    ;
    get OccurredAt() {
        return this.occurredAt;
    }
    ;
    constructor(eventId = (0, uuid_1.v4)(), occurredAt = new Date()) {
        this.eventId = eventId;
        this.occurredAt = occurredAt;
    }
}
exports.DomainEvent = DomainEvent;
;
//# sourceMappingURL=domain-event.js.map