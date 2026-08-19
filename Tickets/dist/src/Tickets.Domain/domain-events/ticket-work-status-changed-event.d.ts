import { DomainEvent } from "./domain-event";
import TicketWorkStatus from "../vo/ticket-work-status";
type TicketWorkStatusChangedInfo = {
    ticketId: string;
    newStatus: TicketWorkStatus;
    eventId?: string;
    occurredAt?: Date;
};
export declare class TicketWorkStatusChangedEvent extends DomainEvent {
    private ticketId;
    private newStatus;
    constructor(data: TicketWorkStatusChangedInfo);
}
export {};
