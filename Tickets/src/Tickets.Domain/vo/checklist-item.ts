/**
 * Пункт чек-листа — неделимый атрибут данных о выполнении заявки.
 * Неизменяемый объект-значение: имя не может быть пустым.
 */
export class ChecklistItem {
    private readonly name: string;
    private readonly isCompleted: boolean;
    private readonly comment?: string;

    constructor(data: { name: string; isCompleted?: boolean; comment?: string }) {
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
            throw new Error('Название пункта чек-листа не может быть пустым');
        }
        this.name = data.name;
        this.isCompleted = data.isCompleted ?? false;
        this.comment = data.comment;
    }

    getName(): string {
        return this.name;
    }

    isCompletedItem(): boolean {
        return this.isCompleted;
    }

    getComment(): string | undefined {
        return this.comment;
    }

    /**
     * Возвращает новый экземпляр пункта с признаком выполнения true
     * (без мутации текущего объекта).
     */
    complete(comment?: string): ChecklistItem {
        return new ChecklistItem({ name: this.name, isCompleted: true, comment: comment ?? this.comment });
    }

    equals(other: ChecklistItem): boolean {
        return this.name === other.name
            && this.isCompleted === other.isCompleted
            && this.comment === other.comment;
    }
}