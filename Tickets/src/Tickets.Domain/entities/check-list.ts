import { v4 as uuidv4 } from 'uuid';

import { ChecklistItem } from "../vo/checklist-item";
import { ChecklistCreateData } from "../vo/checklist-create-data";
import { ChecklistId } from "./identifiers";

/**
 * Сущность «Чек-лист» — объект, в котором содержатся данные о выполнении заявки.
 * Работа над заявкой (TicketWork) связана с этой сущностью по идентификатору.
 */
export class CheckList {
    private readonly id: ChecklistId;
    private items: ChecklistItem[];

    private constructor(data: ChecklistCreateData & { id?: string }) {
        this.id = data.id ? ChecklistId.from(data.id) : ChecklistId.from(uuidv4());
        this.items = [...data.items];
    }

    /**
     * Создаёт новый чек-лист с автогенерируемым id.
     */
    static create(data: ChecklistCreateData): CheckList {
        return new CheckList(data);
    }

    /**
     * Восстанавливает чек-лист по существующему id (например, из БД или по ссылке).
     */
    static from(data: ChecklistCreateData & { id: string }): CheckList {
        return new CheckList(data);
    }

    getId(): ChecklistId {
        return this.id;
    }

    getItems(): ReadonlyArray<ChecklistItem> {
        return [...this.items];
    }

    /**
     * Добавляет пункт чек-листа.
     */
    addItem(item: ChecklistItem): void {
        this.items.push(item);
    }

    /**
     * Помечает пункт по имени выполненным; бросает ошибку, если пункт не найден.
     */
    completeItem(name: string, comment?: string): void {
        const index = this.items.findIndex((i) => i.getName() === name);
        if (index === -1) {
            throw new Error('Пункт чек-листа не найден');
        }
        this.items[index] = this.items[index].complete(comment);
    }

    /**
     * Признак полного выполнения чек-листа (все пункты выполнены).
     */
    isCompleted(): boolean {
        return this.items.length > 0 && this.items.every((i) => i.isCompletedItem());
    }
}