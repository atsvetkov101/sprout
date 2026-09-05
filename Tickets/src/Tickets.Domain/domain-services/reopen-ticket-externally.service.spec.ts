import { ReopenTicketExternallyService } from './reopen-ticket-externally.service';
import { TicketRecord } from '../entities/ticket-record';
import { TicketWork } from '../entities/ticket-work';
import { TicketRecordCreateData } from '../vo/ticket-record-create-data';
import { TicketWorkCreateData } from '../vo/ticket-work-create-data';
import TicketRecordStatus from '../vo/ticket-record-status';
import TicketWorkStatus from '../vo/ticket-work-status';
import { TicketExternallyReopenedEvent } from '../domain-events/ticket-externally-reopened-event';
import { TicketWorkId } from '../entities/identifiers';

function makeRecordData(status: TicketRecordStatus): TicketRecordCreateData {
    return new TicketRecordCreateData({
        id: 'record-1',
        external_id: 'ext-1',
        consumer_id: 1,
        consumer_email: 'user@example.com',
        assignee_id: 10,
        status,
        service: 'Телефония',
        created_by: 5,
        created_time: new Date('2026-08-20T00:00:00.000Z').toISOString(),
        deadline: new Date('2026-08-21T00:00:00.000Z').toISOString(),
        act_type: 'act',
        wiki_link: 'https://wiki',
        is_service_change_available: true,
        service_object_id: 'so-1',
    });
}

function makeWork(id: string, status: TicketWorkStatus): TicketWork {
    return TicketWork.fromData(
        new TicketWorkCreateData({
            id,
            status,
            plannedOrder: 1,
            start_date: new Date('2026-08-20T00:00:00.000Z').toISOString(),
            service: 'Телефония',
        })
    );
}

function makeWorkCreateData(id: string, ticketRecordId: string): TicketWorkCreateData {
    return new TicketWorkCreateData({
        id,
        status: TicketWorkStatus.Pending,
        plannedOrder: 2,
        start_date: new Date('2026-08-22T00:00:00.000Z').toISOString(),
        service: 'Телефония',
        ticketRecordId,
    });
}

describe('ReopenTicketExternallyService', () => {
    let service: ReopenTicketExternallyService;

    beforeEach(() => {
        service = new ReopenTicketExternallyService();
    });

    it('переоткрывает заявку из финального статуса и создаёт новый экземпляр работы', () => {
        const record = TicketRecord.fromdata(makeRecordData(TicketRecordStatus.Done));
        // предыдущая (завершённая) работа не является активной
        record.addWork(makeWork('work-1', TicketWorkStatus.Done));

        const newWork = service.reopenExternally(record, makeWorkCreateData('work-2', 'record-1'));

        // новая работа активна и связана с заявкой
        expect(newWork.getId()).toEqual(TicketWorkId.from('work-2'));
        expect(record.getCurrentWorkId()).toEqual(newWork.getId());
        expect(record.currentWork()?.getId()).toEqual(newWork.getId());
        expect(newWork.getTicketRecordId()?.toString()).toBe('record-1');

        // заявка переведена в активный статус (по умолчанию InProgress)
        expect(record.getStatus()).toBe(TicketRecordStatus.InProgress);
    });

    it('порождает TicketExternallyReopenedEvent с новым id работы', () => {
        const record = TicketRecord.fromdata(makeRecordData(TicketRecordStatus.Closed));
        record.addWork(makeWork('work-1', TicketWorkStatus.Closed));

        service.reopenExternally(
            record,
            makeWorkCreateData('work-2', 'record-1'),
            TicketRecordStatus.Assigned
        );

        const events = record.getDomainEvents();
        const reopened = events.find((e) => e instanceof TicketExternallyReopenedEvent) as
            | TicketExternallyReopenedEvent
            | undefined;

        expect(reopened).toBeDefined();
        expect(reopened!.getTicketId()).toBe('record-1');
        expect(reopened!.getNewWorkId()).toBe('work-2');
    });

    it('использует переданный целевой активный статус', () => {
        const record = TicketRecord.fromdata(makeRecordData(TicketRecordStatus.Done));
        record.addWork(makeWork('work-1', TicketWorkStatus.Done));

        service.reopenExternally(
            record,
            makeWorkCreateData('work-2', 'record-1'),
            TicketRecordStatus.InProgress
        );

        expect(record.getStatus()).toBe(TicketRecordStatus.InProgress);
    });

    it('бросает ошибку, если заявка не в финальном статусе', () => {
        const record = TicketRecord.fromdata(makeRecordData(TicketRecordStatus.InProgress));

        expect(() =>
            service.reopenExternally(record, makeWorkCreateData('work-2', 'record-1'))
        ).toThrow('Переоткрыть заявку можно только из финального статуса');
    });

    it('бросает ошибку, если в заявке уже есть активная работа', () => {
        const record = TicketRecord.fromdata(makeRecordData(TicketRecordStatus.Done));
        record.addWork(makeWork('work-active', TicketWorkStatus.Pending));

        expect(() =>
            service.reopenExternally(record, makeWorkCreateData('work-2', 'record-1'))
        ).toThrow('В заявке не может быть более одной активной работы');
    });
});