import { DomainEvent } from "./domain-event";

type TicketRecordAssigneeChangedInfo = {
 ticketId: string,
 newAssignee: string,
 eventId?: string,
 occurredAt?: Date
};

export class TicketRecordAssigneeChangedEvent extends DomainEvent {
  private ticketId: string;
  private newAssignee: string;

  constructor(data: TicketRecordAssigneeChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newAssignee = data.newAssignee;
  }
}
