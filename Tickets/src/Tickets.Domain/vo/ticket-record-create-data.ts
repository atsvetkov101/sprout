import { Email } from "./email";
import TicketRecordStatus from "./ticket-record-status";

export class TicketRecordCreateData {
   id: string;

   external_id: string;

   consumer_id: number;

   consumer_email: string;

   assignee_id: number;

   status: string;

   service: string;

   created_by: number;

   created_time: string; // datetime as ISO string

   deadline: string; // datetime as ISO string
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
      coords: { lat: string; lng: string };
      phone_number: string;
    };
  }) {
    this.id = data.id;
    this.external_id = data.external_id;
    this.consumer_id = data.consumer_id;
    this.consumer_email = data.consumer_email;
    this.assignee_id = data.assignee_id;
    this.status = data.status;
    this.service = data.service;
    this.created_by = data.created_by;
    this.created_time = data.created_time;
    this.deadline = data.deadline;
    this.act_type = data.act_type;
    this.wiki_link = data.wiki_link;
    this.is_service_change_available = data.is_service_change_available;
    this.service_object = data.service_object;
  }

  private static isValid(data: {
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
      coords: { lat: string; lng: string };
      phone_number: string;
    };
  }): boolean {
    if (!data) return false;

    // id: непустая строка
    if (!data.id || typeof data.id !== 'string') return false;

    // external_id: непустая строка
    if (!data.external_id || typeof data.external_id !== 'string') return false;

    // consumer_id: положительное число
    if (typeof data.consumer_id !== 'number' || data.consumer_id <= 0 || !Number.isFinite(data.consumer_id)) return false;

    // consumer_email: валидный email
    if (!Email.isValid(data.consumer_email)) return false;

    // assignee_id: неотрицательное число
    if (typeof data.assignee_id !== 'number' || data.assignee_id < 0 || !Number.isFinite(data.assignee_id)) return false;

    // status: один из допустимых статусов
    const validStatuses = Object.values(TicketRecordStatus) as string[];
    if (!validStatuses.includes(data.status)) return false;

    // service: непустая строка
    if (!data.service || typeof data.service !== 'string') return false;

    // created_by: положительное число
    if (typeof data.created_by !== 'number' || data.created_by <= 0 || !Number.isFinite(data.created_by)) return false;

    // created_time: валидная ISO-дата
    if (!isValidISODate(data.created_time)) return false;

    // deadline: валидная ISO-дата
    if (!isValidISODate(data.deadline)) return false;

    // act_type: непустая строка
    if (!data.act_type || typeof data.act_type !== 'string') return false;

    // wiki_link: непустая строка
    if (!data.wiki_link || typeof data.wiki_link !== 'string') return false;

    // is_service_change_available: boolean
    if (typeof data.is_service_change_available !== 'boolean') return false;

    // service_object: проверка вложенных полей
    if (!data.service_object || typeof data.service_object !== 'object') return false;
    const so = data.service_object;
    if (!so.address || typeof so.address !== 'string') return false;
    if (!so.name || typeof so.name !== 'string') return false;
    if (!so.search_code || typeof so.search_code !== 'string') return false;
    if (!so.coords || typeof so.coords !== 'object') return false;
    if (!so.coords.lat || typeof so.coords.lat !== 'string') return false;
    if (!so.coords.lng || typeof so.coords.lng !== 'string') return false;
    if (!so.phone_number || typeof so.phone_number !== 'string') return false;

    return true;
  }

}

/**
 * Проверяет, является ли строка валидной ISO 8601 датой.
 */
function isValidISODate(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const date = new Date(value);
  if (isNaN(date.getTime())) return false;
  // Убеждаемся, что строка соответствует ISO формату
  return date.toISOString() === value || date.toISOString().startsWith(value);
  
}
