export type Brand<K, T> = K & {
    __brand: T;
};
export type ServiceObjectId = Brand<string, 'ServiceObjectId'>;
export declare const ServiceObjectId: {
    from: (id: string) => ServiceObjectId;
    isValid: (id: string) => id is ServiceObjectId;
};
export type TicketWorkId = Brand<string, 'TicketWorkId'>;
export declare const TicketWorkId: {
    from: (id: string) => TicketWorkId;
    isValid: (id: string) => id is TicketWorkId;
};
export type TicketRecordId = Brand<string, 'TicketRecordId'>;
export declare const TicketRecordId: {
    from: (id: string) => TicketRecordId;
    isValid: (id: string) => id is TicketRecordId;
};
