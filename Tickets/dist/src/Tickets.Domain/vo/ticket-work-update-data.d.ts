import TicketWorkStatus from "./ticket-work-status";
export declare class TicketWorkUpdateData {
    status: TicketWorkStatus;
    service?: string;
    constructor(status: TicketWorkStatus, service?: string);
    setStatus(status: TicketWorkStatus): this;
    setService(service: string): this;
}
