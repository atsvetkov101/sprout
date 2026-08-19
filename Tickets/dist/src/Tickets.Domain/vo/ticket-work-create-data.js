"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketWorkCreateData = void 0;
class TicketWorkCreateData {
    constructor(data) {
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
    }
}
exports.TicketWorkCreateData = TicketWorkCreateData;
//# sourceMappingURL=ticket-work-create-data.js.map