import { DomainEvent } from "./domain-event";
type TicketRecordAssigneeChangedInfo = {
    ticketId: string;
    newAssignee: string;
    eventId?: string;
    occurredAt?: Date;
};
export declare class TicketRecordAssigneeChangedEvent extends DomainEvent {
    private ticketId;
    private newAssignee;
    constructor(data: TicketRecordAssigneeChangedInfo);
}
export {};
