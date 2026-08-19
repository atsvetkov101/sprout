import { DomainEvent } from "./domain-event";
import TicketRecordStatus from "../vo/ticket-record-status";
type TicketRecordStatusChangedInfo = {
    ticketId: string;
    newStatus: TicketRecordStatus;
    eventId?: string;
    occurredAt?: Date;
};
export declare class TicketRecordStatusExternallyChangedEvent extends DomainEvent {
    private ticketId;
    private newStatus;
    constructor(data: TicketRecordStatusChangedInfo);
}
export {};
