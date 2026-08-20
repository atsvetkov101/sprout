import { DomainEvent } from "./domain-event";

export type TicketServiceChangedInfo = {
  ticketId: string,
  newService: string,
  eventId?: string,
  occurredAt?: Date
};

export class TicketServiceChangedEvent extends DomainEvent {
  private ticketId: string;
  private newService: string;

  constructor(data: TicketServiceChangedInfo) {
    super(data.eventId, data.occurredAt);
    this.ticketId = data.ticketId;
    this.newService = data.newService;
  }

  getTicketId(): string {
    return this.ticketId;
  }

  getNewService(): string {
    return this.newService;
  }
}