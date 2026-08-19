"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecord = void 0;
const uuid_1 = require("uuid");
const ticket_record_create_data_1 = require("../vo/ticket-record-create-data");
const ticket_record_status_1 = require("../vo/ticket-record-status");
const ticket_record_status_internally_changed_event_1 = require("../domain-events/ticket-record-status-internally-changed-event");
const identifiers_1 = require("./identifiers");
class TicketRecord {
    constructor(data) {
        this.events = [];
        this.id = identifiers_1.TicketRecordId.from(data.id);
        this.external_id = data.external_id;
        this.assignee_id = data.assignee_id;
        this.status = data.status;
        this.service = data.service;
        this.created_by = data.created_by;
        const createdTime = new Date(data.created_time);
        if (isNaN(createdTime.getTime())) {
            throw new Error(`Invalid created_time: ${data.created_time}`);
        }
        this.created_time = createdTime;
        const deadline = new Date(data.deadline);
        if (isNaN(deadline.getTime())) {
            throw new Error(`Invalid deadline: ${data.deadline}`);
        }
        this.deadline = deadline;
        this.act_type = data.act_type;
        this.wiki_link = data.wiki_link;
        this.is_service_change_available = data.is_service_change_available;
    }
    static fromdata(dto) {
        return new TicketRecord(dto);
    }
    static fromDb(data) {
        const dto = new ticket_record_create_data_1.TicketRecordCreateData({
            id: data.id,
            external_id: data.external_id,
            consumer_id: data.consumer_id,
            consumer_email: data.consumer_email,
            assignee_id: data.assignee_id,
            status: data.status,
            service: data.service,
            created_by: data.created_by,
            created_time: data.created_time.toISOString(),
            deadline: data.deadline.toISOString(),
            act_type: data.act_type,
            wiki_link: data.wiki_link,
            is_service_change_available: data.is_service_change_available,
            service_object: {
                address: '',
                name: '',
                search_code: '',
                coords: { lat: '', lng: '' },
                phone_number: '',
            },
        });
        return new TicketRecord(dto);
    }
    getId() {
        return this.id;
    }
    getExternalId() {
        return this.external_id;
    }
    getAssigneeId() {
        return this.assignee_id;
    }
    getStatus() {
        return this.status;
    }
    getService() {
        return this.service;
    }
    getCreatedBy() {
        return this.created_by;
    }
    getCreatedTime() {
        return this.created_time;
    }
    getDeadline() {
        return this.deadline;
    }
    getActType() {
        return this.act_type;
    }
    getWikiLink() {
        return this.wiki_link;
    }
    isServiceChangeAvailable() {
        return this.is_service_change_available;
    }
    statusChangeAllowed(newStatus) {
        if (this.status === newStatus) {
            return false;
        }
        if (this.status === ticket_record_status_1.default.Done) {
            return false;
        }
        return true;
    }
    isClosing(newStatus) {
        return (newStatus === ticket_record_status_1.default.Closed || newStatus === ticket_record_status_1.default.Canceled);
    }
    setService(newService) {
        if (this.service !== newService) {
            if (!this.is_service_change_available) {
                throw new Error('Смена сервиса не доступна');
            }
            this.service = newService;
            this.addDomainEvent(new TicketServiceChangedEvent({
                ticketId: this.id,
                newService: newService,
                eventId: (0, uuid_1.v4)(),
                occurredAt: new Date()
            }));
        }
        else {
            throw new Error('Для изменения сервиса новое значение должно отличаться от текущего');
        }
    }
    applyChangeStatusChanges(newStatus, newService) {
        if (!this.statusChangeAllowed(newStatus)) {
            throw new Error('Такое изменение статуса не поддерживается');
        }
        this.status = newStatus;
        this.addDomainEvent(new ticket_record_status_internally_changed_event_1.TicketRecordStatusInternallyChangedEvent({ ticketId: this.id,
            newStatus: newStatus,
            eventId: (0, uuid_1.v4)(),
            occurredAt: new Date() }));
        if (newService) {
            this.setService(newService);
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
exports.TicketRecord = TicketRecord;
//# sourceMappingURL=ticket-record.js.map