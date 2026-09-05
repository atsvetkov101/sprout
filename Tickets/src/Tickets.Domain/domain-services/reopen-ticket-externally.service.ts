import { TicketRecord } from "../entities/ticket-record";
import { TicketWork } from "../entities/ticket-work";
import { TicketWorkCreateData } from "../vo/ticket-work-create-data";
import TicketRecordStatus from "../vo/ticket-record-status";

/**
 * Доменный сервис переоткрытия заявки извне (ReopeningTicketExternally).
 *
 * Координирует два коррелирующих агрегата — `TicketRecord` и новый экземпляр
 * `TicketWork` — и защищает межагрегатный инвариант «единственная активная
 * работа» (count(activeWorks) <= 1). Логика вынесена из агрегатов, чтобы каждый
 * из них оставался тонким и не знал про чужую политику создания.
 */
export class ReopenTicketExternallyService {
    /**
     * Переоткрывает заявку из финального статуса: создаёт НОВЫЙ экземпляр
     * «Работы над заявкой», связывает его с заявкой и переводит заявку в активный статус.
     *
     * @param ticket        заявка, которую переоткрывают
     * @param workCreateData данные для создания новой работы над заявкой
     * @param targetStatus  целевой активный статус заявки после переоткрытия
     * @returns созданный новый экземпляр TicketWork
     */
    reopenExternally(
        ticket: TicketRecord,
        workCreateData: TicketWorkCreateData,
        targetStatus: TicketRecordStatus = TicketRecordStatus.InProgress,
    ): TicketWork {
        // 1. Переоткрытие допустимо только из финального статуса
        if (!ticket.isFinal()) {
            throw new Error('Переоткрыть заявку можно только из финального статуса');
        }

        // 2. Создаём НОВЫЙ экземпляр работы над заявкой и связываем с заявкой по ID
        const newWork = TicketWork.fromData(workCreateData);
        newWork.setTicketRecordId(ticket.getId());

        // 3. Добавляем работу как активную; addWork() сам проверяет инвариант
        //    «единственная активная работа» (count(activeWorks) <= 1).
        ticket.addWork(newWork);

        // 4. Переводим заявку из финального статуса; агрегат порождает событие
        //    TicketExternallyReopenedEvent.
        ticket.reopen(targetStatus);

        return newWork;
    }
}