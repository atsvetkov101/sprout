import TicketWorkStatus from "./ticket-work-status";
import { Coords } from "./coords";

/**
 * Пользовательское событие работы над заявкой.
 */
export interface UserEvent {
    type: string;
    timestamp: string; // datetime as ISO string
    payload?: Record<string, unknown>;
}

/*
 * Класс для хранения данных для создания работы над заявкой (TicketWork).
 */
export class TicketWorkCreateData {
    id: string;
    status: TicketWorkStatus;
    plannedOrder: number;
    start_date: string; // datetime as ISO string
    service: string;
    user_events: UserEvent[];
    coords_list: Coords[];
    act_id?: string;
    act_type?: string;
    deadline?: string; // datetime as ISO string
    wiki_link?: string;
    ticketRecordId?: string;
    checklistId?: string;

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
        ticketRecordId?: string;
        checklistId?: string;
    }) {
        this.id = data.id;
        this.status = data.status;
        this.plannedOrder = data.plannedOrder;
        this.start_date = data.start_date;
        this.service = data.service;
        this.user_events = data.user_events ?? [];
        this.coords_list = data.coords_list ?? [];
        this.act_id = data.act_id;
        this.act_type = data.act_type;
        this.deadline = data.deadline;
        this.wiki_link = data.wiki_link;
        this.ticketRecordId = data.ticketRecordId;
        this.checklistId = data.checklistId;
    }
}
