export declare class WorkHour {
    private readonly startMinutes;
    private readonly endMinutes;
    constructor(start: string, end: string);
    static fromMinutes(start: number, end: number): WorkHour;
    getStart(): string;
    getEnd(): string;
    getStartMinutes(): number;
    getEndMinutes(): number;
    getDurationMinutes(): number;
    toString(): string;
    equals(other: WorkHour): boolean;
    overlaps(other: WorkHour): boolean;
    static isValid(start: string, end: string): boolean;
    static isValidMinutes(start: number, end: number): boolean;
    static parseTimeToMinutes(value: string): number | null;
    private static formatMinutes;
}
