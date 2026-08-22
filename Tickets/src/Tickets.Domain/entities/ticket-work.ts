import { v4 as uuidv4 } from 'uuid';

import { TicketWorkCreateData, UserEvent } from "../vo/ticket-work-create-data";
import { TicketWorkUpdateData } from "../vo/ticket-work-update-data";
import TicketWorkStatus from "../vo/ticket-work-status";
import { Coords } from "../vo/coords";
import { DomainEvent } from "../domain-events/domain-event";
import { TicketWorkStatusChangedEvent } from "../domain-events/ticket-work-status-changed-event";
import { TicketWorkId, TicketRecordId, ChecklistId } from './identifiers';

export class TicketWork {
    private id!: TicketWorkId;
    private status!: TicketWorkStatus;
    private plannedOrder!: number;
    private start_date!: Date;
    private service!: string;
    private user_events: UserEvent[] = [];
    private coords_list: Coords[] = [];
    private act_id?: string;
    private act_type?: string;
    private deadline?: Date;
    private wiki_link?: string;
    private ticket_record_id?: TicketRecordId;
    private checklist_id?: ChecklistId;
    private events: DomainEvent[] = [];

    constructor(data: TicketWorkCreateData) {
        this.id = TicketWorkId.from(data.id);
        this.status = data.status;
        this.plannedOrder = data.plannedOrder;

        const startDate = new Date(data.start_date);
        if (isNaN(startDate.getTime())) {
            throw new Error(`Invalid start_date: ${data.start_date}`);
        }
        this.start_date = startDate;

        this.service = data.service;
        this.user_events = [...data.user_events];
        this.coords_list = [...data.coords_list];
        this.act_id = data.act_id;
        this.act_type = data.act_type;

        if (data.deadline) {
            const deadline = new Date(data.deadline);
            if (isNaN(deadline.getTime())) {
                throw new Error(`Invalid deadline: ${data.deadline}`);
            }
            this.deadline = deadline;
        }
        this.wiki_link = data.wiki_link;
        this.ticket_record_id = data.ticketRecordId ? TicketRecordId.from(data.ticketRecordId) : undefined;
        this.checklist_id = data.checklistId ? ChecklistId.from(data.checklistId) : undefined;
    }

    public static fromData(data: TicketWorkCreateData): TicketWork {
        return new TicketWork(data);
    }

    getId(): TicketWorkId {
        return this.id;
    }

    getTicketRecordId(): TicketRecordId | undefined {
        return this.ticket_record_id;
    }

    setTicketRecordId(id: TicketRecordId): void {
        this.ticket_record_id = id;
    }

    getChecklistId(): ChecklistId | undefined {
        return this.checklist_id;
    }

    setChecklistId(id: ChecklistId): void {
        this.checklist_id = id;
    }

    getStatus(): TicketWorkStatus {
        return this.status;
    }

    getPlannedOrder(): number {
        return this.plannedOrder;
    }

    getStartDate(): Date {
        return this.start_date;
    }

    getService(): string {
        return this.service;
    }

    getUserEvents(): ReadonlyArray<UserEvent> {
        return [...this.user_events];
    }

    getCoordsList(): ReadonlyArray<Coords> {
        return [...this.coords_list];
    }

    getActId(): string | undefined {
        return this.act_id;
    }

    getActType(): string | undefined {
        return this.act_type;
    }

    getDeadline(): Date | undefined {
        return this.deadline;
    }

    getWikiLink(): string | undefined {
        return this.wiki_link;
    }

    statusChangeAllowed(newStatus: TicketWorkStatus): boolean {
        if (this.status === newStatus) {
            // Нельзя перевести работу в тот же статус
            return false;
        }
        if (this.status === TicketWorkStatus.Done) {
            // Из статуса Выполнена работа не может быть переведена в другой статус
            return false;
        }
        return true;
    }

    // Выполняется ли закрытие работы при переводе в новый статус
    isClosing(newStatus: TicketWorkStatus): boolean {
        return (newStatus === TicketWorkStatus.Closed || newStatus === TicketWorkStatus.Canceled);
    }

    /**
     * Смена сервиса у работы над заявкой.
     */
    setService(newService: string) {
        if (this.service === newService) {
            throw new Error('Для изменения сервиса новое значение должно отличаться от текущего');
        }
        this.service = newService;
    }

    applyChangeStatusChanges(newData: TicketWorkUpdateData) {
        if (!this.statusChangeAllowed(newData.status)) {
            throw new Error('Такое изменение статуса не поддерживается');
        }

        this.status = newData.status;
        this.addDomainEvent(
            new TicketWorkStatusChangedEvent({
                ticketId: this.id,
                newStatus: newData.status,
                eventId: uuidv4(),
                occurredAt: new Date(),
            })
        );

        // если передано изменение сервиса, то меняем сервис
        if (newData.service) {
            this.setService(newData.service);
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
