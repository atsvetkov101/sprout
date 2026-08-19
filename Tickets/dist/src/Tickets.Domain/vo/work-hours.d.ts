import { WorkHour } from './work-hour';
export declare enum DayOfWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}
export declare class WorkHours {
    private readonly hoursByDay;
    constructor(hoursByDay: Partial<Record<DayOfWeek, WorkHour[]>>);
    getHoursForDay(day: DayOfWeek): readonly WorkHour[];
    getDays(): DayOfWeek[];
    isOpenOn(day: DayOfWeek): boolean;
    isOpenAt(day: DayOfWeek, time: string): boolean;
    equals(other: WorkHours): boolean;
    static isValid(hoursByDay: Partial<Record<DayOfWeek, WorkHour[]>>): boolean;
    private static isValidDay;
    private static normalize;
}
