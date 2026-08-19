import TicketWorkStatus from "./ticket-work-status";
import { Coords } from "./coords";
export interface UserEvent {
    type: string;
    timestamp: string;
    payload?: Record<string, unknown>;
}
export declare class TicketWorkCreateData {
    id: string;
    status: TicketWorkStatus;
    plannedOrder: number;
    start_date: string;
    service: string;
    user_events: UserEvent[];
    coords_list: Coords[];
    act_id?: string;
    act_type?: string;
    deadline?: string;
    wiki_link?: string;
    constructor(data: {
        id: string;
        status: TicketWorkStatus;
        plannedOrder: number;
        start_date: string;
        service: string;
        user_events?: UserEvent[];
        coords_list?: Coords[];
        act_id?: string;
        act_type?: string;
        deadline?: string;
        wiki_link?: string;
    });
}
