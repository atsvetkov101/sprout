export declare class Coords {
    private readonly lat;
    private readonly lng;
    constructor(lat: string, lng: string);
    getLat(): string;
    getLng(): string;
    toString(): string;
    equals(other: Coords): boolean;
    static isValid(lat: string, lng: string): boolean;
}
