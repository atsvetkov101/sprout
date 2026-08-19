import { Address } from "./address";
import { Coords } from "./coords";
import { PhoneNumber } from "./phone-number";
import { WorkHours } from "./work-hours";
export declare class ServiceObjectCreateData {
    address: Address;
    name: string;
    search_code: string;
    coords?: Coords;
    phone_number: PhoneNumber;
    work_hours?: WorkHours;
}
