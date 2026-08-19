export declare class Address {
    private readonly value;
    constructor(value: string);
    getValue(): string;
    toString(): string;
    equals(other: Address): boolean;
    static isValid(value: string): boolean;
}
