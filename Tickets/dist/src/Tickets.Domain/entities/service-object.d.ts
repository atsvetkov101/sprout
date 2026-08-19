import { Address } from "../vo/address";
import { Coords } from "../vo/coords";
import { PhoneNumber } from "../vo/phone-number";
import { WorkHours } from "../vo/work-hours";
import { ServiceObjectId } from "./identifiers";
export declare class ServiceObject {
    private id;
    private name;
    private search_code;
    private address;
    private coords?;
    private phone_number;
    private work_hours?;
    private constructor();
    getId(): ServiceObjectId;
    getAddress(): Address;
    getName(): string;
    getSearchCode(): string;
    getCoords(): Coords | undefined;
    getPhoneNumber(): PhoneNumber;
    getWorkHours(): WorkHours | undefined;
}
