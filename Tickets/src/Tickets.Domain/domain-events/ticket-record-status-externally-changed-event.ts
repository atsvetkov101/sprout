import { DomainEvent } from "./domain-event";
import TicketRecordStatus from "../vo/ticket-record-status";

type TicketRecordStatusChangedInfo = {
 ticketId: string,
 newStatus: TicketRecordStatus,
 eventId?: string,
 occurredAt?: Date
};

export class TicketRecordStatusExternallyChangedEvent extends DomainEvent {
  private ticketId: string;
  private newStatus: TicketRecordStatus;

  constructor(data: TicketRecordStatusChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newStatus = data.newStatus;
  }
}
