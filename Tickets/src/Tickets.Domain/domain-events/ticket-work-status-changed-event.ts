import { DomainEvent } from "./domain-event";
import TicketWorkStatus from "../vo/ticket-work-status";

type TicketWorkStatusChangedInfo = {
 ticketId: string,
 newStatus: TicketWorkStatus,
 eventId?: string,
 occurredAt?: Date
};

export class TicketWorkStatusChangedEvent extends DomainEvent {
  private ticketId: string;
  private newStatus: TicketWorkStatus;

  constructor(data: TicketWorkStatusChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newStatus = data.newStatus;
  }
}
