/**
 * Value object, представляющий один временной диапазон работы в течение дня.
 *
 * Время хранится как целое число минут от полуночи (0..1439 для начала,
 * 1..1440 для конца, где 1440 соответствует 24:00). Это исключает проблемы
 * часовых поясов и Date, а также упрощает сравнение и проверку пересечений.
 *
 * Внешний интерфейс принимает и возвращает строки формата "HH:MM" (24-часовой формат).
 */
export class WorkHour {
  private readonly startMinutes: number;
  private readonly endMinutes: number;

  constructor(start: string, end: string) {
    if (!WorkHour.isValid(start, end)) {
      throw new Error(`Некорректный временной диапазон: ${start}-${end}`);
    }
    // isValid гарантирует, что parseToMinutes вернет число (не null)
    this.startMinutes = WorkHour.parseTimeToMinutes(start)!;
    this.endMinutes = WorkHour.parseTimeToMinutes(end)!;
  }

  /**
   * Создает WorkHour из количества минут от полуночи.
   * start в диапазоне 0..1439, end в диапазоне 1..1440.
   */
  static fromMinutes(start: number, end: number): WorkHour {
    if (!WorkHour.isValidMinutes(start, end)) {
      throw new Error(`Некорректный временной диапазон: ${start}-${end}`);
    }
    return new WorkHour(WorkHour.formatMinutes(start), WorkHour.formatMinutes(end));
  }

  getStart(): string {
    return WorkHour.formatMinutes(this.startMinutes);
  }

  getEnd(): string {
    return WorkHour.formatMinutes(this.endMinutes);
  }

  getStartMinutes(): number {
    return this.startMinutes;
  }

  getEndMinutes(): number {
    return this.endMinutes;
  }

  getDurationMinutes(): number {
    return this.endMinutes - this.startMinutes;
  }

  toString(): string {
    return `${this.getStart()}-${this.getEnd()}`;
  }

  equals(other: WorkHour): boolean {
    return this.startMinutes === other.startMinutes && this.endMinutes === other.endMinutes;
  }

  /**
   * Проверяет, пересекаются ли два диапазона.
   * Диапазоны, соприкасающиеся границами (например, 09:00-13:00 и 13:00-18:00),
   * не считаются пересекающимися.
   */
  overlaps(other: WorkHour): boolean {
    return this.startMinutes < other.endMinutes && other.startMinutes < this.endMinutes;
  }

  static isValid(start: string, end: string): boolean {
    if (typeof start !== 'string' || typeof end !== 'string') {
      return false;
    }
    const startMinutes = WorkHour.parseTimeToMinutes(start);
    const endMinutes = WorkHour.parseTimeToMinutes(end);
    if (startMinutes === null || endMinutes === null) {
      return false;
    }
    return WorkHour.isValidMinutes(startMinutes, endMinutes);
  }

  static isValidMinutes(start: number, end: number): boolean {
    if (!Number.isInteger(start) || !Number.isInteger(end)) {
      return false;
    }
    if (start < 0 || start > 1439) {
      return false;
    }
    if (end < 1 || end > 1440) {
      return false;
    }
    return start < end;
  }

  /**
   * Парсит строку "HH:MM" в количество минут от полуночи.
   * Возвращает null, если строка некорректна.
   */
  static parseTimeToMinutes(value: string): number | null {
    const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
    if (!match) {
      return null;
    }
    const hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);
    if (hours < 0 || hours > 24) {
      return null;
    }
    if (minutes < 0 || minutes > 59) {
      return null;
    }
    // 24:00 допустимо только как конец диапазона (1440 минут)
    if (hours === 24 && minutes !== 0) {
      return null;
    }
    return hours * 60 + minutes;
  }

  /**
   * Форматирует количество минут от полуночи в строку "HH:MM".
   * 1440 форматируется как "24:00".
   */
  private static formatMinutes(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }
}