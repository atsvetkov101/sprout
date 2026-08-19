"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketWork = void 0;
const uuid_1 = require("uuid");
const ticket_work_status_1 = require("../vo/ticket-work-status");
const ticket_work_status_changed_event_1 = require("../domain-events/ticket-work-status-changed-event");
const identifiers_1 = require("./identifiers");
class TicketWork {
    constructor(data) {
        this.user_events = [];
        this.coords_list = [];
        this.events = [];
        this.id = identifiers_1.TicketWorkId.from(data.id);
        this.status = data.status;
        this.plannedOrder = data.plannedOrder;
        const startDate = new Date(data.start_date);
        if (isNaN(startDate.getTime())) {
            throw new Error(`Invalid start_date: ${data.start_date}`);
        }
        this.start_date = startDate;
        this.service = data.service;
        this.user_events = [...data.user_events];
        this.coords_list = [...data.coords_list];
        this.act_id = data.act_id;
        this.act_type = data.act_type;
        if (data.deadline) {
            const deadline = new Date(data.deadline);
            if (isNaN(deadline.getTime())) {
                throw new Error(`Invalid deadline: ${data.deadline}`);
            }
            this.deadline = deadline;
        }
        this.wiki_link = data.wiki_link;
    }
    static fromData(data) {
        return new TicketWork(data);
    }
    getId() {
        return this.id;
    }
    getStatus() {
        return this.status;
    }
    getPlannedOrder() {
        return this.plannedOrder;
    }
    getStartDate() {
        return this.start_date;
    }
    getService() {
        return this.service;
    }
    getUserEvents() {
        return [...this.user_events];
    }
    getCoordsList() {
        return [...this.coords_list];
    }
    getActId() {
        return this.act_id;
    }
    getActType() {
        return this.act_type;
    }
    getDeadline() {
        return this.deadline;
    }
    getWikiLink() {
        return this.wiki_link;
    }
    statusChangeAllowed(newStatus) {
        if (this.status === newStatus) {
            return false;
        }
        if (this.status === ticket_work_status_1.default.Done) {
            return false;
        }
        return true;
    }
    isClosing(newStatus) {
        return (newStatus === ticket_work_status_1.default.Closed || newStatus === ticket_work_status_1.default.Canceled);
    }
    setService(newService) {
        if (this.service === newService) {
            throw new Error('Для изменения сервиса новое значение должно отличаться от текущего');
        }
        this.service = newService;
    }
    applyChangeStatusChanges(newData) {
        if (!this.statusChangeAllowed(newData.status)) {
            throw new Error('Такое изменение статуса не поддерживается');
        }
        this.status = newData.status;
        this.addDomainEvent(new ticket_work_status_changed_event_1.TicketWorkStatusChangedEvent({
            ticketId: this.id,
            newStatus: newData.status,
            eventId: (0, uuid_1.v4)(),
            occurredAt: new Date(),
        }));
        if (newData.service) {
            this.setService(newData.service);
        }
    }
    addDomainEvent(event) {
        this.events.push(event);
    }
    getDomainEvents() {
        return [...this.events];
    }
    сlearDomainEvents() {
        this.events.length = 0;
    }
}
exports.TicketWork = TicketWork;
//# sourceMappingURL=ticket-work.js.map