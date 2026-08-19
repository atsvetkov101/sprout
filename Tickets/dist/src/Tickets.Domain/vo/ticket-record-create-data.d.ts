export declare class TicketRecordCreateData {
    id: string;
    external_id: string;
    consumer_id: number;
    consumer_email: string;
    assignee_id: number;
    status: string;
    service: string;
    created_by: number;
    created_time: string;
    deadline: string;
    act_type: string;
    wiki_link: string;
    is_service_change_available: boolean;
    service_object: {
        address: string;
        name: string;
        search_code: string;
        coords: {
            lat: string;
            lng: string;
        };
        phone_number: string;
    };
    constructor(data: {
        id: string;
        external_id: string;
        consumer_id: number;
        consumer_email: string;
        assignee_id: number;
        status: string;
        service: string;
        created_by: number;
        created_time: string;
        deadline: string;
        act_type: string;
        wiki_link: string;
        is_service_change_available: boolean;
        service_object: {
            address: string;
            name: string;
            search_code: string;
            coords: {
                lat: string;
                lng: string;
            };
            phone_number: string;
        };
    });
    private static isValid;
}
