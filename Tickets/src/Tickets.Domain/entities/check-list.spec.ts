import { CheckList } from './check-list';
import { ChecklistItem } from '../vo/checklist-item';
import { ChecklistCreateData } from '../vo/checklist-create-data';
import { ChecklistId } from './identifiers';

describe('CheckList', () => {
    it('create генерирует идентификатор и содержит элементы', () => {
        const item = new ChecklistItem({ name: 'Проверить контакты' });
        const checklist = CheckList.create(new ChecklistCreateData({ items: [item] }));

        expect(checklist.getId()).toBeDefined();
        expect(checklist.getItems()).toHaveLength(1);
        expect(checklist.getItems()[0].getName()).toBe('Проверить контакты');
    });

    it('addItem добавляет пункт в коллекцию', () => {
        const checklist = CheckList.create(new ChecklistCreateData({}));
        const item = new ChecklistItem({ name: 'Проверить контакты' });

        checklist.addItem(item);

        expect(checklist.getItems()).toHaveLength(1);
        expect(checklist.getItems()[0].equals(item)).toBe(true);
    });

    it('completeItem помечает пункт выполненным', () => {
        const checklist = CheckList.create(new ChecklistCreateData({}));
        checklist.addItem(new ChecklistItem({ name: 'Проверить контакты' }));

        checklist.completeItem('Проверить контакты', 'Контакты подтверждены');

        expect(checklist.getItems()[0].isCompletedItem()).toBe(true);
        expect(checklist.getItems()[0].getComment()).toBe('Контакты подтверждены');
    });

    it('completeItem бросает ошибку на русском для отсутствующего пункта', () => {
        const checklist = CheckList.create(new ChecklistCreateData({}));

        expect(() => checklist.completeItem('Нет такого пункта'))
            .toThrow('Пункт чек-листа не найден');
    });

    it('isCompleted возвращает true только когда все пункты выполнены', () => {
        const checklist = CheckList.create(new ChecklistCreateData({}));
        checklist.addItem(new ChecklistItem({ name: 'Первый' }));
        checklist.addItem(new ChecklistItem({ name: 'Второй' }));

        expect(checklist.isCompleted()).toBe(false);

        checklist.completeItem('Первый');
        checklist.completeItem('Второй');

        expect(checklist.isCompleted()).toBe(true);
    });

    it('from восстанавливает чек-лист по существующему id', () => {
        const restored = CheckList.from({
            id: 'checklist-42',
            items: [new ChecklistItem({ name: 'Пункт' })],
        });

        expect(restored.getId()).toEqual(ChecklistId.from('checklist-42'));
        expect(restored.getItems()).toHaveLength(1);
    });
});