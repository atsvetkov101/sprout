import { v4 as uuidv4 } from 'uuid';
import { IDomainEvent } from './idomain-event';

export class DomainEvent implements IDomainEvent {
  private eventId: string;
  private occurredAt: Date;
  get EventId() : string {
    return this.eventId;
  };
  get OccurredAt(): Date {
    return this.occurredAt;
  };
  constructor(eventId: string = uuidv4(),
    occurredAt: Date = new Date(),

  ) {
    this.eventId = eventId;
    this.occurredAt = occurredAt;
  }
};

