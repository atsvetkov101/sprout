"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecordAssigneeChangedEvent = void 0;
const domain_event_1 = require("./domain-event");
class TicketRecordAssigneeChangedEvent extends domain_event_1.DomainEvent {
    constructor(data) {
        super(data.eventId, data.occurredAt);
        this.ticketId = data.ticketId;
        this.newAssignee = data.newAssignee;
    }
}
exports.TicketRecordAssigneeChangedEvent = TicketRecordAssigneeChangedEvent;
//# sourceMappingURL=ticket-record-assignee-changed-event.js.map