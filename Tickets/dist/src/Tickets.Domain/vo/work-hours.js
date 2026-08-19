"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkHours = exports.DayOfWeek = void 0;
const work_hour_1 = require("./work-hour");
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
    DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
    DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
    DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
    DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
    DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
    DayOfWeek[DayOfWeek["Sunday"] = 7] = "Sunday";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
class WorkHours {
    constructor(hoursByDay) {
        if (!WorkHours.isValid(hoursByDay)) {
            throw new Error('Некорректное расписание работы на неделю');
        }
        this.hoursByDay = WorkHours.normalize(hoursByDay);
    }
    getHoursForDay(day) {
        return this.hoursByDay.get(day) ?? [];
    }
    getDays() {
        return [...this.hoursByDay.keys()].sort((a, b) => a - b);
    }
    isOpenOn(day) {
        return this.hoursByDay.has(day);
    }
    isOpenAt(day, time) {
        const hours = this.hoursByDay.get(day);
        if (!hours || hours.length === 0) {
            return false;
        }
        const minutes = work_hour_1.WorkHour.parseTimeToMinutes(time);
        if (minutes === null) {
            return false;
        }
        return hours.some((h) => minutes >= h.getStartMinutes() && minutes < h.getEndMinutes());
    }
    equals(other) {
        const days = this.getDays();
        const otherDays = other.getDays();
        if (days.length !== otherDays.length) {
            return false;
        }
        for (let i = 0; i < days.length; i++) {
            if (days[i] !== otherDays[i]) {
                return false;
            }
            const hours = this.getHoursForDay(days[i]);
            const otherHours = other.getHoursForDay(otherDays[i]);
            if (hours.length !== otherHours.length) {
                return false;
            }
            for (let j = 0; j < hours.length; j++) {
                if (!hours[j].equals(otherHours[j])) {
                    return false;
                }
            }
        }
        return true;
    }
    static isValid(hoursByDay) {
        if (!hoursByDay || typeof hoursByDay !== 'object') {
            return false;
        }
        const days = Object.keys(hoursByDay).map(Number);
        if (days.length === 0) {
            return false;
        }
        for (const day of days) {
            if (!WorkHours.isValidDay(day)) {
                return false;
            }
            const hours = hoursByDay[day];
            if (!Array.isArray(hours) || hours.length === 0) {
                return false;
            }
            const sorted = [...hours].sort((a, b) => a.getStartMinutes() - b.getStartMinutes());
            for (let i = 0; i < sorted.length - 1; i++) {
                if (sorted[i].overlaps(sorted[i + 1])) {
                    return false;
                }
            }
        }
        return true;
    }
    static isValidDay(day) {
        return Number.isInteger(day) && day >= DayOfWeek.Monday && day <= DayOfWeek.Sunday;
    }
    static normalize(hoursByDay) {
        const map = new Map();
        const days = Object.keys(hoursByDay).map(Number);
        for (const day of days) {
            const hours = hoursByDay[day];
            if (Array.isArray(hours) && hours.length > 0) {
                const sorted = [...hours].sort((a, b) => a.getStartMinutes() - b.getStartMinutes());
                map.set(day, sorted);
            }
        }
        return map;
    }
}
exports.WorkHours = WorkHours;
//# sourceMappingURL=work-hours.js.map