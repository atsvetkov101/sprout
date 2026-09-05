import { TicketWork } from './ticket-work';
import { TicketWorkCreateData } from '../vo/ticket-work-create-data';
import { TicketWorkUpdateData } from '../vo/ticket-work-update-data';
import TicketWorkStatus from '../vo/ticket-work-status';
import { TicketRecordId, ChecklistId } from './identifiers';
import { CheckList } from './check-list';
import { ChecklistCreateData } from '../vo/checklist-create-data';
import { ChecklistItem } from '../vo/checklist-item';

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

    it('setChecklistId/getChecklistId сохраняют ссылку на чек-лист', () => {
        const work = makeWork('work-1');

        expect(work.getChecklistId()).toBeUndefined();

        work.setChecklistId(ChecklistId.from('checklist-42'));

        expect(work.getChecklistId()).toEqual(ChecklistId.from('checklist-42'));
    });

    describe('changeStatus (смена статуса с чек-листом)', () => {
        // Полностью заполненный чек-лист из двух выполненных пунктов.
        function completedChecklist(): CheckList {
            return CheckList.create(
                new ChecklistCreateData({
                    items: [
                        new ChecklistItem({ name: 'Проверено', isCompleted: true }),
                        new ChecklistItem({ name: 'Подтверждено', isCompleted: true }),
                    ],
                })
            );
        }

        // Чек-лист с одним невыполненным пунктом.
        function incompleteChecklist(): CheckList {
            return CheckList.create(
                new ChecklistCreateData({
                    items: [
                        new ChecklistItem({ name: 'Проверено', isCompleted: true }),
                        new ChecklistItem({ name: 'Не подтверждено', isCompleted: false }),
                    ],
                })
            );
        }

        it('успешно меняет статус и сохраняет переданный чек-лист в работе', () => {
            const work = makeWork('work-1');
            const checklist = completedChecklist();

            work.changeStatus(new TicketWorkUpdateData(TicketWorkStatus.Done).setChecklist(checklist));

            expect(work.getStatus()).toEqual(TicketWorkStatus.Done);
            expect(work.getChecklist()).toBe(checklist);
            expect(work.getDomainEvents().length).toBe(1);
        });

        it('не переводит работу в статус Выполнена при неполном чек-листе', () => {
            const work = makeWork('work-1');

            expect(() =>
                work.changeStatus(
                    new TicketWorkUpdateData(TicketWorkStatus.Done).setChecklist(incompleteChecklist())
                )
            ).toThrow('Чек-лист не заполнен полностью');

            expect(work.getStatus()).toEqual(TicketWorkStatus.Pending);
            expect(work.getDomainEvents().length).toBe(0);
        });

        it('не переводит работу в статус Выполнена, если сохранённый ранее чек-лист неполный', () => {
            const work = makeWork('work-1');

            // сначала сохраняем неполный чек-лист через смену статуса в InProgress
            work.changeStatus(
                new TicketWorkUpdateData(TicketWorkStatus.InProgress).setChecklist(incompleteChecklist())
            );

            expect(() =>
                work.changeStatus(new TicketWorkUpdateData(TicketWorkStatus.Done))
            ).toThrow('Чек-лист не заполнен полностью');

            expect(work.getStatus()).toEqual(TicketWorkStatus.InProgress);
        });

        it('позволяет перейти в статус Выполнена без чек-листа', () => {
            const work = makeWork('work-1');

            work.changeStatus(new TicketWorkUpdateData(TicketWorkStatus.Done));

            expect(work.getStatus()).toEqual(TicketWorkStatus.Done);
            expect(work.getChecklist()).toBeUndefined();
            expect(work.getDomainEvents().length).toBe(1);
        });

        it('бросает ошибку при недопустимом переходе (в тот же статус)', () => {
            const work = makeWork('work-1');

            expect(() =>
                work.changeStatus(new TicketWorkUpdateData(TicketWorkStatus.Pending))
            ).toThrow('Такое изменение статуса не поддерживается');
        });

        it('меняет сервис при передаче нового значения вместе со статусом', () => {
            const work = makeWork('work-1');

            work.changeStatus(new TicketWorkUpdateData(TicketWorkStatus.InProgress, 'Сети'));

            expect(work.getStatus()).toEqual(TicketWorkStatus.InProgress);
            expect(work.getService()).toEqual('Сети');
        });
    });
});