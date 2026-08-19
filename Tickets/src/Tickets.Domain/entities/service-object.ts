import { v4 as uuidv4 } from 'uuid'; 
import { Address } from "../vo/address";
import { Coords } from "../vo/coords";
import { PhoneNumber } from "../vo/phone-number";
import { ServiceObjectCreateData } from "../vo/service-object-create-data";
import { WorkHours } from "../vo/work-hours";
import { ServiceObjectId } from "./identifiers";

export class ServiceObject {
    private id: ServiceObjectId;
    private name: string;
    private search_code: string;
    private address: Address;
    private coords?: Coords;
    private phone_number: PhoneNumber;
    private work_hours?: WorkHours;

    private constructor(data: ServiceObjectCreateData) {
        this.id = ServiceObjectId.from(uuidv4());
        this.name = data.name;
        this.search_code = data.search_code;
        this.address = data.address;
        this.coords = data.coords;
        this.phone_number = data.phone_number;
        this.work_hours = data.work_hours;
    }

    getId(): ServiceObjectId {
        return this.id;
    }

    getAddress(): Address {
        return this.address;
    }

    getName(): string {
        return this.name;
    }

    getSearchCode(): string {
        return this.search_code;
    }

    getCoords(): Coords | undefined {
        return this.coords;
    }

    getPhoneNumber(): PhoneNumber {
        return this.phone_number;
    }

    getWorkHours(): WorkHours | undefined {
        return this.work_hours;
    }
}