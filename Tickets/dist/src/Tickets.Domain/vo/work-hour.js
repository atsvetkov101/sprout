"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkHour = void 0;
class WorkHour {
    constructor(start, end) {
        if (!WorkHour.isValid(start, end)) {
            throw new Error(`Некорректный временной диапазон: ${start}-${end}`);
        }
        this.startMinutes = WorkHour.parseTimeToMinutes(start);
        this.endMinutes = WorkHour.parseTimeToMinutes(end);
    }
    static fromMinutes(start, end) {
        if (!WorkHour.isValidMinutes(start, end)) {
            throw new Error(`Некорректный временной диапазон: ${start}-${end}`);
        }
        return new WorkHour(WorkHour.formatMinutes(start), WorkHour.formatMinutes(end));
    }
    getStart() {
        return WorkHour.formatMinutes(this.startMinutes);
    }
    getEnd() {
        return WorkHour.formatMinutes(this.endMinutes);
    }
    getStartMinutes() {
        return this.startMinutes;
    }
    getEndMinutes() {
        return this.endMinutes;
    }
    getDurationMinutes() {
        return this.endMinutes - this.startMinutes;
    }
    toString() {
        return `${this.getStart()}-${this.getEnd()}`;
    }
    equals(other) {
        return this.startMinutes === other.startMinutes && this.endMinutes === other.endMinutes;
    }
    overlaps(other) {
        return this.startMinutes < other.endMinutes && other.startMinutes < this.endMinutes;
    }
    static isValid(start, end) {
        if (typeof start !== 'string' || typeof end !== 'string') {
            return false;
        }
        const startMinutes = WorkHour.parseTimeToMinutes(start);
        const endMinutes = WorkHour.parseTimeToMinutes(end);
        if (startMinutes === null || endMinutes === null) {
            return false;
        }
        return WorkHour.isValidMinutes(startMinutes, endMinutes);
    }
    static isValidMinutes(start, end) {
        if (!Number.isInteger(start) || !Number.isInteger(end)) {
            return false;
        }
        if (start < 0 || start > 1439) {
            return false;
        }
        if (end < 1 || end > 1440) {
            return false;
        }
        return start < end;
    }
    static parseTimeToMinutes(value) {
        const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
        if (!match) {
            return null;
        }
        const hours = Number.parseInt(match[1], 10);
        const minutes = Number.parseInt(match[2], 10);
        if (hours < 0 || hours > 24) {
            return null;
        }
        if (minutes < 0 || minutes > 59) {
            return null;
        }
        if (hours === 24 && minutes !== 0) {
            return null;
        }
        return hours * 60 + minutes;
    }
    static formatMinutes(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    }
}
exports.WorkHour = WorkHour;
//# sourceMappingURL=work-hour.js.map