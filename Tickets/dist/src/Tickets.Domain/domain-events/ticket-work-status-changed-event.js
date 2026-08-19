"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketWorkStatusChangedEvent = void 0;
const domain_event_1 = require("./domain-event");
class TicketWorkStatusChangedEvent extends domain_event_1.DomainEvent {
    constructor(data) {
        super(data.eventId, data.occurredAt);
        this.ticketId = data.ticketId;
        this.newStatus = data.newStatus;
    }
}
exports.TicketWorkStatusChangedEvent = TicketWorkStatusChangedEvent;
//# sourceMappingURL=ticket-work-status-changed-event.js.map