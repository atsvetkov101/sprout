"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecordStatusInternallyChangedEvent = void 0;
const domain_event_1 = require("./domain-event");
class TicketRecordStatusInternallyChangedEvent extends domain_event_1.DomainEvent {
    constructor(data) {
        super(data.eventId, data.occurredAt);
        this.ticketId = data.ticketId;
        this.newStatus = data.newStatus;
    }
}
exports.TicketRecordStatusInternallyChangedEvent = TicketRecordStatusInternallyChangedEvent;
//# sourceMappingURL=ticket-record-status-internally-changed-event.js.map