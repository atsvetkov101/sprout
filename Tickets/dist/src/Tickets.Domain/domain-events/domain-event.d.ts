import { IDomainEvent } from './idomain-event';
export declare class DomainEvent implements IDomainEvent {
    private eventId;
    private occurredAt;
    get EventId(): string;
    get OccurredAt(): Date;
    constructor(eventId?: string, occurredAt?: Date);
}
