import { TicketServiceChangedEvent } from './ticket-service-changed-event';

describe('TicketServiceChangedEvent (шаг 4)', () => {
    it('конструктор сохраняет ticketId и newService', () => {
        const event = new TicketServiceChangedEvent({
            ticketId: 'record-1',
            newService: 'Интернет',
        });

        expect(event.getTicketId()).toBe('record-1');
        expect(event.getNewService()).toBe('Интернет');
    });

    it('наследует EventId и OccurredAt от DomainEvent', () => {
        const occurredAt = new Date('2026-08-20T00:00:00.000Z');
        const event = new TicketServiceChangedEvent({
            ticketId: 'record-1',
            newService: 'Интернет',
            eventId: 'event-1',
            occurredAt,
        });

        expect(event.EventId).toBe('event-1');
        expect(event.OccurredAt).toEqual(occurredAt);
    });
});