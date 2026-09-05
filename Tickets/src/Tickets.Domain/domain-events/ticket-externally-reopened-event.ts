import { DomainEvent } from "./domain-event";

export type TicketExternallyReopenedInfo = {
  ticketId: string,
  newWorkId?: string,
  eventId?: string,
  occurredAt?: Date
};

export class TicketExternallyReopenedEvent extends DomainEvent {
  private ticketId: string;
  private newWorkId?: string;

  constructor(data: TicketExternallyReopenedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newWorkId = data.newWorkId;
  }

  getTicketId(): string {
    return this.ticketId;
  }

  getNewWorkId(): string | undefined {
    return this.newWorkId;
  }
}