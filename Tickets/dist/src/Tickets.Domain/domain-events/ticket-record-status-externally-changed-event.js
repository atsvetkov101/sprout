"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecordStatusExternallyChangedEvent = void 0;
const domain_event_1 = require("./domain-event");
class TicketRecordStatusExternallyChangedEvent extends domain_event_1.DomainEvent {
    constructor(data) {
        super(data.eventId, data.occurredAt);
        this.ticketId = data.ticketId;
        this.newStatus = data.newStatus;
    }
}
exports.TicketRecordStatusExternallyChangedEvent = TicketRecordStatusExternallyChangedEvent;
//# sourceMappingURL=ticket-record-status-externally-changed-event.js.map