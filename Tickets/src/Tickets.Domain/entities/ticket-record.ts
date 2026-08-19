import { v4 as uuidv4 } from 'uuid';

import { TicketRecordCreateData } from "../vo/ticket-record-create-data";
import TicketRecordStatus from "../vo/ticket-record-status";
import { DomainEvent } from "../domain-events/domain-event";
import { TicketRecordStatusInternallyChangedEvent } from "../domain-events/ticket-record-status-internally-changed-event";
import { TicketRecordId } from './identifiers';
export class TicketRecord {
    private id!: TicketRecordId;
    private external_id!: string;
    private assignee_id!: number;
    private status!: TicketRecordStatus;
    private service!: string;
    private created_by!: number;
    private created_time!: Date;
    private deadline!: Date;
    private act_type!: string;
    private wiki_link!: string;
    private is_service_change_available!: boolean;
    private events: DomainEvent[] = [];

    constructor(data: TicketRecordCreateData) {
        this.id = TicketRecordId.from(data.id);
        this.external_id = data.external_id;
        this.assignee_id = data.assignee_id;
        this.status = data.status as TicketRecordStatus;
        this.service = data.service;
        this.created_by = data.created_by;

        const createdTime = new Date(data.created_time);
        if (isNaN(createdTime.getTime())) {
            throw new Error(`Invalid created_time: ${data.created_time}`);
        }
        this.created_time = createdTime;

        const deadline = new Date(data.deadline);
        if (isNaN(deadline.getTime())) {
            throw new Error(`Invalid deadline: ${data.deadline}`);
        }
        this.deadline = deadline;

        this.act_type = data.act_type;
        this.wiki_link = data.wiki_link;
        this.is_service_change_available = data.is_service_change_available;
    }

    public static fromdata(dto: TicketRecordCreateData): TicketRecord {
        return new TicketRecord(dto);
    }

    public static fromDb(data: {
        id: string;
        external_id: string;
        consumer_id: number;
        consumer_email: string;
        assignee_id: number;
        status: string;
        service: string;
        created_by: number;
        created_time: Date;
        deadline: Date;
        act_type: string;
        wiki_link: string;
        is_service_change_available: boolean;
    }): TicketRecord {
        const dto = new TicketRecordCreateData({
            id: data.id,
            external_id: data.external_id,
            consumer_id: data.consumer_id,
            consumer_email: data.consumer_email,
            assignee_id: data.assignee_id,
            status: data.status,
            service: data.service,
            created_by: data.created_by,
            created_time: data.created_time.toISOString(),
            deadline: data.deadline.toISOString(),
            act_type: data.act_type,
            wiki_link: data.wiki_link,
            is_service_change_available: data.is_service_change_available,
            service_object: {
                address: '',
                name: '',
                search_code: '',
                coords: { lat: '', lng: '' },
                phone_number: '',
            },
        });
        return new TicketRecord(dto);
    }

    getId(): TicketRecordId {
        return this.id;
    }

    getExternalId(): string {
        return this.external_id;
    }

    getAssigneeId(): number {
        return this.assignee_id;
    }

    getStatus(): TicketRecordStatus {
        return this.status;
    }

    getService(): string {
        return this.service;
    }

    getCreatedBy(): number {
        return this.created_by;
    }

    getCreatedTime(): Date {
        return this.created_time;
    }

    getDeadline(): Date {
        return this.deadline;
    }

    getActType(): string {
        return this.act_type;
    }

    getWikiLink(): string {
        return this.wiki_link;
    }

    isServiceChangeAvailable(): boolean {
        return this.is_service_change_available;
    }

    statusChangeAllowed(newStatus: TicketRecordStatus): boolean {
        if (this.status === newStatus) {
            // Нельзя перевести тикет в тот же статус
            return false;
        }
        if (this.status === TicketRecordStatus.Done) {
          // Из статуса Завершен тикет не может быть переведен в другой статус
          return false;
        }
        return true;
    }

    // Выполняется ли закрытие тикета при переводе в новый статус
    isClosing(newStatus: TicketRecordStatus): boolean {
        return (newStatus === TicketRecordStatus.Closed || newStatus === TicketRecordStatus.Canceled);
    }

    /**
     * Смена сервиса у заявки происходит в том случае если по факту прибытия на место, исполнитель выяснил
     * , что заявка заведена не верно и требуется изменить сервис
     */
    setService(newService: string) {
      if(this.service !== newService) {
        if(!this.is_service_change_available) {
            throw new Error('Смена сервиса не доступна');
        }
        this.service = newService;
        this.addDomainEvent(new TicketServiceChangedEvent({
          ticketId: this.id,
          newService: newService,
          eventId: uuidv4(),
          occurredAt: new Date()}));
      } else {
        throw new Error('Для изменения сервиса новое значение должно отличаться от текущего');
      }
    }

    applyChangeStatusChanges(newStatus: TicketRecordStatus, newService?: string){
        if(!this.statusChangeAllowed(newStatus)) {
          throw new Error('Такое изменение статуса не поддерживается');
        }

        this.status = newStatus;
        this.addDomainEvent(
          new TicketRecordStatusInternallyChangedEvent({ticketId: this.id,
          newStatus: newStatus,
          eventId: uuidv4(),
          occurredAt: new Date()})
        );

        // если передано изменение сервиса, то меняем сервис
        if(newService){
          this.setService(newService);
        }
    }

    addDomainEvent(event: DomainEvent) {
        this.events.push(event);
    }

    getDomainEvents(): ReadonlyArray<DomainEvent> {
      return [...this.events];
    }

    clearDomainEvents() {
      this.events.length = 0;
    }
}
