import { TicketRecord } from './ticket-record';
import { TicketWork } from './ticket-work';
import { TicketRecordCreateData } from '../vo/ticket-record-create-data';
import { TicketWorkCreateData } from '../vo/ticket-work-create-data';
import TicketWorkStatus from '../vo/ticket-work-status';
import TicketRecordStatus from '../vo/ticket-record-status';
import { TicketWorkId } from './identifiers';

function makeRecordData(): TicketRecordCreateData {
    return new TicketRecordCreateData({
        id: 'record-1',
        external_id: 'ext-1',
        consumer_id: 1,
        consumer_email: 'user@example.com',
        assignee_id: 10,
        status: TicketRecordStatus.New,
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

describe('TicketRecord (связь 1:n, шаг 1 и 2)', () => {
    it('addWork добавляет работу в коллекцию', () => {
        const record = TicketRecord.fromdata(makeRecordData());
        const work = makeWork('work-1', TicketWorkStatus.Pending);

        record.addWork(work);

        expect(record.currentWork()?.getId()).toEqual(work.getId());
    });

    it('currentWork() возвращает активную работу (не Done/Canceled/Closed)', () => {
        const record = TicketRecord.fromdata(makeRecordData());
        const done = makeWork('work-done', TicketWorkStatus.Done);
        const active = makeWork('work-active', TicketWorkStatus.InProgress);

        record.addWork(done);
        record.addWork(active);

        expect(record.currentWork()?.getId()).toEqual(active.getId());
    });

    it('currentWork() возвращает undefined, если активных работ нет', () => {
        const record = TicketRecord.fromdata(makeRecordData());
        record.addWork(makeWork('work-done', TicketWorkStatus.Done));
        record.addWork(makeWork('work-closed', TicketWorkStatus.Closed));

        expect(record.currentWork()).toBeUndefined();
    });

    it('добавление второй активной работы бросает ошибку на русском', () => {
        const record = TicketRecord.fromdata(makeRecordData());
        record.addWork(makeWork('work-1', TicketWorkStatus.Pending));

        expect(() => record.addWork(makeWork('work-2', TicketWorkStatus.InProgress)))
            .toThrow('В заявке не может быть более одной активной работы');
    });

    it('getCurrentWorkId() возвращает TicketWorkId активной работы', () => {
        const record = TicketRecord.fromdata(makeRecordData());
        const active = makeWork('work-active', TicketWorkStatus.Pending);

        record.addWork(active);

        expect(record.getCurrentWorkId()).toEqual(TicketWorkId.from('work-active'));
    });

    it('getCurrentWorkId() возвращает undefined без активной работы', () => {
        const record = TicketRecord.fromdata(makeRecordData());

        expect(record.getCurrentWorkId()).toBeUndefined();
    });
});