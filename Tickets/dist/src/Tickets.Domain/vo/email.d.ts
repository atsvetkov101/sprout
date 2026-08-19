export declare class Email {
    private readonly value;
    constructor(value: string);
    getValue(): string;
    toString(): string;
    equals(other: Email): boolean;
    static isValid(value: string): boolean;
}
