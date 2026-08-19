"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const work_hour_1 = require("./work-hour");
const work_hours_1 = require("./work-hours");
describe('Тесты для объекта-значение WorkHours', () => {
    describe('создание', () => {
        it('должен создавать экземпляр WorkHours с корректным расписанием', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
                [work_hours_1.DayOfWeek.Tuesday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            expect(wh.getDays()).toEqual([work_hours_1.DayOfWeek.Monday, work_hours_1.DayOfWeek.Tuesday]);
        });
        it('должен создавать экземпляр WorkHours с несколькими диапазонами в день', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '13:00'), new work_hour_1.WorkHour('14:00', '18:00')],
            });
            expect(wh.getHoursForDay(work_hours_1.DayOfWeek.Monday)).toHaveLength(2);
        });
        it('должен выбрасывать ошибку при создании с пустым расписанием', () => {
            expect(() => new work_hours_1.WorkHours({})).toThrow('Некорректное расписание работы на неделю');
        });
        it('должен выбрасывать ошибку при создании с днем без диапазонов', () => {
            expect(() => new work_hours_1.WorkHours({ [work_hours_1.DayOfWeek.Monday]: [] })).toThrow('Некорректное расписание работы на неделю');
        });
        it('должен выбрасывать ошибку при создании с пересекающимися диапазонами в день', () => {
            expect(() => new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '15:00'), new work_hour_1.WorkHour('12:00', '18:00')],
            })).toThrow('Некорректное расписание работы на неделю');
        });
        it('должен выбрасывать ошибку при создании с недопустимым днем недели', () => {
            expect(() => new work_hours_1.WorkHours({
                [8]: [new work_hour_1.WorkHour('09:00', '18:00')],
            })).toThrow('Некорректное расписание работы на неделю');
        });
    });
    describe('доступ к значению', () => {
        it('должен возвращать диапазоны для указанного дня', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            const hours = wh.getHoursForDay(work_hours_1.DayOfWeek.Monday);
            expect(hours).toHaveLength(1);
            expect(hours[0].toString()).toBe('09:00-18:00');
        });
        it('должен возвращать пустой массив для дня без работы', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            expect(wh.getHoursForDay(work_hours_1.DayOfWeek.Tuesday)).toEqual([]);
        });
        it('должен возвращать дни с работой в порядке возрастания', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Sunday]: [new work_hour_1.WorkHour('10:00', '16:00')],
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            expect(wh.getDays()).toEqual([work_hours_1.DayOfWeek.Monday, work_hours_1.DayOfWeek.Sunday]);
        });
        it('должен сортировать диапазоны в пределах дня по времени начала', () => {
            const wh = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('14:00', '18:00'), new work_hour_1.WorkHour('09:00', '13:00')],
            });
            const hours = wh.getHoursForDay(work_hours_1.DayOfWeek.Monday);
            expect(hours[0].toString()).toBe('09:00-13:00');
            expect(hours[1].toString()).toBe('14:00-18:00');
        });
    });
    describe('проверка работы', () => {
        const wh = new work_hours_1.WorkHours({
            [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            [work_hours_1.DayOfWeek.Tuesday]: [new work_hour_1.WorkHour('09:00', '13:00'), new work_hour_1.WorkHour('14:00', '18:00')],
        });
        it('должен возвращать true, если в день есть работа', () => {
            expect(wh.isOpenOn(work_hours_1.DayOfWeek.Monday)).toBe(true);
        });
        it('должен возвращать false, если в день нет работы', () => {
            expect(wh.isOpenOn(work_hours_1.DayOfWeek.Sunday)).toBe(false);
        });
        it('должен возвращать true, если время попадает в рабочий диапазон', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Monday, '12:00')).toBe(true);
        });
        it('должен возвращать false, если время до начала работы', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Monday, '08:00')).toBe(false);
        });
        it('должен возвращать false, если время после окончания работы', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Monday, '18:00')).toBe(false);
        });
        it('должен возвращать true, если время попадает в перерыв между диапазонами', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Tuesday, '13:30')).toBe(false);
        });
        it('должен возвращать true, если время попадает во второй диапазон дня', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Tuesday, '15:00')).toBe(true);
        });
        it('должен возвращать false, если в день нет работы', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Sunday, '12:00')).toBe(false);
        });
        it('должен возвращать false при некорректном времени', () => {
            expect(wh.isOpenAt(work_hours_1.DayOfWeek.Monday, '25:00')).toBe(false);
        });
    });
    describe('равенство', () => {
        it('должен считать два объекта WorkHours равными, если расписания одинаковы', () => {
            const wh1 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            const wh2 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            expect(wh1.equals(wh2)).toBe(true);
        });
        it('не должен считать два объекта WorkHours равными, если дни различаются', () => {
            const wh1 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            const wh2 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Tuesday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            expect(wh1.equals(wh2)).toBe(false);
        });
        it('не должен считать два объекта WorkHours равными, если диапазоны различаются', () => {
            const wh1 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            });
            const wh2 = new work_hours_1.WorkHours({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('10:00', '18:00')],
            });
            expect(wh1.equals(wh2)).toBe(false);
        });
    });
    describe('валидация', () => {
        it('должен считать корректным расписание с одним днем', () => {
            expect(work_hours_1.WorkHours.isValid({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '18:00')],
            })).toBe(true);
        });
        it('должен считать корректным расписание с несколькими диапазонами в день', () => {
            expect(work_hours_1.WorkHours.isValid({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '13:00'), new work_hour_1.WorkHour('14:00', '18:00')],
            })).toBe(true);
        });
        it('должен считать некорректным пустое расписание', () => {
            expect(work_hours_1.WorkHours.isValid({})).toBe(false);
        });
        it('должен считать некорректным расписание с днем без диапазонов', () => {
            expect(work_hours_1.WorkHours.isValid({ [work_hours_1.DayOfWeek.Monday]: [] })).toBe(false);
        });
        it('должен считать некорректным расписание с пересекающимися диапазонами', () => {
            expect(work_hours_1.WorkHours.isValid({
                [work_hours_1.DayOfWeek.Monday]: [new work_hour_1.WorkHour('09:00', '15:00'), new work_hour_1.WorkHour('12:00', '18:00')],
            })).toBe(false);
        });
    });
});
//# sourceMappingURL=work-hours.spec.js.map