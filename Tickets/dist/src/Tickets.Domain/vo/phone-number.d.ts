export declare class PhoneNumber {
    private readonly value;
    constructor(value: string);
    getValue(): string;
    toString(): string;
    equals(other: PhoneNumber): boolean;
    static isValid(value: string): boolean;
}
