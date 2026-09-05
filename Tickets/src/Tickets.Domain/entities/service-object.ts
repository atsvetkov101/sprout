import { v4 as uuidv4 } from 'uuid'; 
import { Address } from "../vo/address";
import { Coords } from "../vo/coords";
import { PhoneNumber } from "../vo/phone-number";
import { ServiceObjectCreateData } from "../vo/service-object-create-data";
import { WorkHours } from "../vo/work-hours";
import { ServiceObjectId } from "./identifiers";

export class ServiceObject {
    public static readonly kind: string = 'ServiceObject';

    private id: ServiceObjectId;
    private name: string;
    private search_code: string;
    private address: Address;
    private coords?: Coords;
    private phone_number: PhoneNumber;
    private work_hours?: WorkHours;

    private constructor(data: ServiceObjectCreateData & { id?: string }) {
        this.id = data.id ? ServiceObjectId.from(data.id) : ServiceObjectId.from(uuidv4());
        this.name = data.name;
        this.search_code = data.search_code;
        this.address = data.address;
        this.coords = data.coords;
        this.phone_number = data.phone_number;
        this.work_hours = data.work_hours;
    }

    /**
     * Восстанавливает ServiceObject по существующему id (например, из БД или по ссылке).
     */
    static from(data: ServiceObjectCreateData & { id: string }): ServiceObject {
        return new ServiceObject(data);
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