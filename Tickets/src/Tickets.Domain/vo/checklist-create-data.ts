import { ChecklistItem } from "./checklist-item";

/**
 * Данные для создания чек-листа (объекта с данными о выполнении заявки).
 */
export class ChecklistCreateData {
    items: ChecklistItem[];

    constructor(data: { items?: ChecklistItem[] }) {
        this.items = data.items ?? [];
    }
}