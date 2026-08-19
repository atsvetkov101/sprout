"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRecordCreateData = void 0;
const email_1 = require("./email");
const ticket_record_status_1 = require("./ticket-record-status");
class TicketRecordCreateData {
    constructor(data) {
        this.id = data.id;
        this.external_id = data.external_id;
        this.consumer_id = data.consumer_id;
        this.consumer_email = data.consumer_email;
        this.assignee_id = data.assignee_id;
        this.status = data.status;
        this.service = data.service;
        this.created_by = data.created_by;
        this.created_time = data.created_time;
        this.deadline = data.deadline;
        this.act_type = data.act_type;
        this.wiki_link = data.wiki_link;
        this.is_service_change_available = data.is_service_change_available;
        this.service_object = data.service_object;
    }
    static isValid(data) {
        if (!data)
            return false;
        if (!data.id || typeof data.id !== 'string')
            return false;
        if (!data.external_id || typeof data.external_id !== 'string')
            return false;
        if (typeof data.consumer_id !== 'number' || data.consumer_id <= 0 || !Number.isFinite(data.consumer_id))
            return false;
        if (!email_1.Email.isValid(data.consumer_email))
            return false;
        if (typeof data.assignee_id !== 'number' || data.assignee_id < 0 || !Number.isFinite(data.assignee_id))
            return false;
        const validStatuses = Object.values(ticket_record_status_1.default);
        if (!validStatuses.includes(data.status))
            return false;
        if (!data.service || typeof data.service !== 'string')
            return false;
        if (typeof data.created_by !== 'number' || data.created_by <= 0 || !Number.isFinite(data.created_by))
            return false;
        if (!isValidISODate(data.created_time))
            return false;
        if (!isValidISODate(data.deadline))
            return false;
        if (!data.act_type || typeof data.act_type !== 'string')
            return false;
        if (!data.wiki_link || typeof data.wiki_link !== 'string')
            return false;
        if (typeof data.is_service_change_available !== 'boolean')
            return false;
        if (!data.service_object || typeof data.service_object !== 'object')
            return false;
        const so = data.service_object;
        if (!so.address || typeof so.address !== 'string')
            return false;
        if (!so.name || typeof so.name !== 'string')
            return false;
        if (!so.search_code || typeof so.search_code !== 'string')
            return false;
        if (!so.coords || typeof so.coords !== 'object')
            return false;
        if (!so.coords.lat || typeof so.coords.lat !== 'string')
            return false;
        if (!so.coords.lng || typeof so.coords.lng !== 'string')
            return false;
        if (!so.phone_number || typeof so.phone_number !== 'string')
            return false;
        return true;
    }
}
exports.TicketRecordCreateData = TicketRecordCreateData;
function isValidISODate(value) {
    if (!value || typeof value !== 'string')
        return false;
    const date = new Date(value);
    if (isNaN(date.getTime()))
        return false;
    return date.toISOString() === value || date.toISOString().startsWith(value);
}
//# sourceMappingURL=ticket-record-create-data.js.map