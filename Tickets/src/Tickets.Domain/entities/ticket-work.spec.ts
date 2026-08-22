import { TicketWork } from './ticket-work';
import { TicketWorkCreateData } from '../vo/ticket-work-create-data';
import TicketWorkStatus from '../vo/ticket-work-status';
import { TicketRecordId, ChecklistId } from './identifiers';

function makeWork(id: string): TicketWork {
    return TicketWork.fromData(
        new TicketWorkCreateData({
            id,
            status: TicketWorkStatus.Pending,
            plannedOrder: 1,
            start_date: new Date('2026-08-20T00:00:00.000Z').toISOString(),
            service: 'Телефония',
        })
    );
}

describe('TicketWork (перекрёстная ссылка по ID, шаг 2)', () => {
    it('инициализирует ticket_record_id из данных создания', () => {
        const work = TicketWork.fromData(
            new TicketWorkCreateData({
                id: 'work-1',
                status: TicketWorkStatus.Pending,
                plannedOrder: 1,
                start_date: new Date('2026-08-20T00:00:00.000Z').toISOString(),
                service: 'Телефония',
                ticketRecordId: 'record-1',
            })
        );

        expect(work.getTicketRecordId()).toEqual(TicketRecordId.from('record-1'));
    });

    it('setTicketRecordId/getTicketRecordId сохраняют ссылку на заявку', () => {
        const work = makeWork('work-1');

        expect(work.getTicketRecordId()).toBeUndefined();

        work.setTicketRecordId(TicketRecordId.from('record-42'));

        expect(work.getTicketRecordId()).toEqual(TicketRecordId.from('record-42'));
    });

    it('инициализирует checklist_id из данных создания', () => {
        const work = TicketWork.fromData(
            new TicketWorkCreateData({
                id: 'work-1',
                status: TicketWorkStatus.Pending,
                plannedOrder: 1,
                start_date: new Date('2026-08-20T00:00:00.000Z').toISOString(),
                service: 'Телефония',
                checklistId: 'checklist-1',
            })
        );

        expect(work.getChecklistId()).toEqual(ChecklistId.from('checklist-1'));
    });

    it('setChecklistId/getChecklistId сохраняют ссылку на чек-лист', () => {
        const work = makeWork('work-1');

        expect(work.getChecklistId()).toBeUndefined();

        work.setChecklistId(ChecklistId.from('checklist-42'));

        expect(work.getChecklistId()).toEqual(ChecklistId.from('checklist-42'));
    });
});