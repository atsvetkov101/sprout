"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const work_hour_1 = require("./work-hour");
describe('Тесты для объекта-значение WorkHour', () => {
    describe('создание', () => {
        it('должен создавать экземпляр WorkHour с корректным диапазоном', () => {
            const wh = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh.getStart()).toBe('09:00');
            expect(wh.getEnd()).toBe('18:00');
        });
        it('должен создавать экземпляр WorkHour с диапазоном до полуночи', () => {
            const wh = new work_hour_1.WorkHour('00:00', '24:00');
            expect(wh.getStart()).toBe('00:00');
            expect(wh.getEnd()).toBe('24:00');
        });
        it('должен создавать экземпляр WorkHour из минут от полуночи', () => {
            const wh = work_hour_1.WorkHour.fromMinutes(540, 1080);
            expect(wh.getStart()).toBe('09:00');
            expect(wh.getEnd()).toBe('18:00');
        });
        it('должен выбрасывать ошибку при создании с некорректным форматом времени', () => {
            expect(() => new work_hour_1.WorkHour('9:00', '18:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании с недопустимым часом', () => {
            expect(() => new work_hour_1.WorkHour('25:00', '26:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании с недопустимой минутой', () => {
            expect(() => new work_hour_1.WorkHour('09:60', '18:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании, когда начало позже конца', () => {
            expect(() => new work_hour_1.WorkHour('18:00', '09:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании, когда начало равно концу', () => {
            expect(() => new work_hour_1.WorkHour('09:00', '09:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании с 24:00 в качестве начала', () => {
            expect(() => new work_hour_1.WorkHour('24:00', '24:00')).toThrow('Некорректный временной диапазон');
        });
        it('должен выбрасывать ошибку при создании с 24:30', () => {
            expect(() => new work_hour_1.WorkHour('09:00', '24:30')).toThrow('Некорректный временной диапазон');
        });
    });
    describe('доступ к значению', () => {
        it('должен возвращать количество минут от полуночи для начала', () => {
            const wh = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh.getStartMinutes()).toBe(540);
        });
        it('должен возвращать количество минут от полуночи для конца', () => {
            const wh = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh.getEndMinutes()).toBe(1080);
        });
        it('должен возвращать продолжительность в минутах', () => {
            const wh = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh.getDurationMinutes()).toBe(540);
        });
        it('должен возвращать строковое представление диапазона', () => {
            const wh = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh.toString()).toBe('09:00-18:00');
        });
    });
    describe('равенство', () => {
        it('должен считать два объекта WorkHour равными, если диапазоны одинаковы', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '18:00');
            const wh2 = new work_hour_1.WorkHour('09:00', '18:00');
            expect(wh1.equals(wh2)).toBe(true);
        });
        it('не должен считать два объекта WorkHour равными, если диапазоны различаются', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '18:00');
            const wh2 = new work_hour_1.WorkHour('10:00', '18:00');
            expect(wh1.equals(wh2)).toBe(false);
        });
    });
    describe('пересечение', () => {
        it('должен считать диапазоны пересекающимися при частичном наложении', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '13:00');
            const wh2 = new work_hour_1.WorkHour('12:00', '18:00');
            expect(wh1.overlaps(wh2)).toBe(true);
        });
        it('должен считать диапазоны пересекающимися при полном вложении', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '18:00');
            const wh2 = new work_hour_1.WorkHour('10:00', '12:00');
            expect(wh1.overlaps(wh2)).toBe(true);
        });
        it('не должен считать диапазоны пересекающимися при соприкосновении границ', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '13:00');
            const wh2 = new work_hour_1.WorkHour('13:00', '18:00');
            expect(wh1.overlaps(wh2)).toBe(false);
        });
        it('не должен считать диапазоны пересекающимися при отсутствии наложения', () => {
            const wh1 = new work_hour_1.WorkHour('09:00', '12:00');
            const wh2 = new work_hour_1.WorkHour('13:00', '18:00');
            expect(wh1.overlaps(wh2)).toBe(false);
        });
    });
    describe('валидация', () => {
        it('должен считать корректным диапазон 09:00-18:00', () => {
            expect(work_hour_1.WorkHour.isValid('09:00', '18:00')).toBe(true);
        });
        it('должен считать корректным диапазон 00:00-24:00', () => {
            expect(work_hour_1.WorkHour.isValid('00:00', '24:00')).toBe(true);
        });
        it('должен считать некорректным диапазон с началом позже конца', () => {
            expect(work_hour_1.WorkHour.isValid('18:00', '09:00')).toBe(false);
        });
        it('должен считать некорректным диапазон с недопустимым форматом', () => {
            expect(work_hour_1.WorkHour.isValid('9:00', '18:00')).toBe(false);
        });
        it('должен считать некорректным диапазон с недопустимым часом', () => {
            expect(work_hour_1.WorkHour.isValid('25:00', '26:00')).toBe(false);
        });
        it('должен считать некорректным диапазон с недопустимой минутой', () => {
            expect(work_hour_1.WorkHour.isValid('09:60', '18:00')).toBe(false);
        });
        it('должен считать некорректным диапазон с 24:30', () => {
            expect(work_hour_1.WorkHour.isValid('09:00', '24:30')).toBe(false);
        });
    });
});
//# sourceMappingURL=work-hour.spec.js.map