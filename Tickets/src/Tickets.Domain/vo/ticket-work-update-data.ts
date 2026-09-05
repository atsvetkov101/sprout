import TicketWorkStatus from "./ticket-work-status";
import { CheckList } from "../entities/check-list";
/*
 * Класс для хранения данных для обновления работы над тикетом.
 */
export class TicketWorkUpdateData{
    status!: TicketWorkStatus;
    service?: string;
    // Заполненный чек-лист, который сохраняется в работе при смене статуса.
    checklist?: CheckList;
    constructor(status: TicketWorkStatus, service?: string){
        this.status = status;
        this.service = service;
    }
    setStatus(status: TicketWorkStatus){
      this.status = status;
      return this;
    }
    setService(service: string){
        this.service = service;
        return this;
    }
    setChecklist(checklist: CheckList){
        this.checklist = checklist;
        return this;
    }
}
