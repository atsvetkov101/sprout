import { WorkHour } from './work-hour';

/**
 * День недели по ISO-стандарту: 1 = Понедельник ... 7 = Воскресенье.
 */
export enum DayOfWeek {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

/**
 * Value object, содержащий все часы работы на неделю.
 *
 * Хранит набор временных диапазонов (WorkHour) для каждого дня недели.
 * В пределах одного дня диапазоны не должны пересекаться и хранятся
 * отсортированными по времени начала.
 */
export class WorkHours {
  private readonly hoursByDay: ReadonlyMap<DayOfWeek, readonly WorkHour[]>;

  constructor(hoursByDay: Partial<Record<DayOfWeek, WorkHour[]>>) {
    if (!WorkHours.isValid(hoursByDay)) {
      throw new Error('Некорректное расписание работы на неделю');
    }
    this.hoursByDay = WorkHours.normalize(hoursByDay);
  }

  /**
   * Возвращает диапазоны работы для указанного дня.
   * Если в этот день работы нет, возвращает пустой массив.
   */
  getHoursForDay(day: DayOfWeek): readonly WorkHour[] {
    return this.hoursByDay.get(day) ?? [];
  }

  /**
   * Возвращает дни недели, в которые есть работа (в порядке возрастания номера дня).
   */
  getDays(): DayOfWeek[] {
    return [...this.hoursByDay.keys()].sort((a, b) => a - b);
  }

  /**
   * Есть ли работа в указанный день недели.
   */
  isOpenOn(day: DayOfWeek): boolean {
    return this.hoursByDay.has(day);
  }

  /**
   * Работает ли объект в указанный день в указанное время ("HH:MM").
   */
  isOpenAt(day: DayOfWeek, time: string): boolean {
    const hours = this.hoursByDay.get(day);
    if (!hours || hours.length === 0) {
      return false;
    }
    const minutes = WorkHour.parseTimeToMinutes(time);
    if (minutes === null) {
      return false;
    }
    return hours.some((h) => minutes >= h.getStartMinutes() && minutes < h.getEndMinutes());
  }

  equals(other: WorkHours): boolean {
    const days = this.getDays();
    const otherDays = other.getDays();
    if (days.length !== otherDays.length) {
      return false;
    }
    for (let i = 0; i < days.length; i++) {
      if (days[i] !== otherDays[i]) {
        return false;
      }
      const hours = this.getHoursForDay(days[i]);
      const otherHours = other.getHoursForDay(otherDays[i]);
      if (hours.length !== otherHours.length) {
        return false;
      }
      for (let j = 0; j < hours.length; j++) {
        if (!hours[j].equals(otherHours[j])) {
          return false;
        }
      }
    }
    return true;
  }

  static isValid(hoursByDay: Partial<Record<DayOfWeek, WorkHour[]>>): boolean {
    if (!hoursByDay || typeof hoursByDay !== 'object') {
      return false;
    }
    const days = Object.keys(hoursByDay).map(Number) as DayOfWeek[];
    if (days.length === 0) {
      return false;
    }
    for (const day of days) {
      if (!WorkHours.isValidDay(day)) {
        return false;
      }
      const hours = hoursByDay[day];
      if (!Array.isArray(hours) || hours.length === 0) {
        return false;
      }
      // Проверяем отсутствие пересечений
      const sorted = [...hours].sort((a, b) => a.getStartMinutes() - b.getStartMinutes());
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].overlaps(sorted[i + 1])) {
          return false;
        }
      }
    }
    return true;
  }

  private static isValidDay(day: DayOfWeek): boolean {
    return Number.isInteger(day) && day >= DayOfWeek.Monday && day <= DayOfWeek.Sunday;
  }

  /**
   * Нормализует входные данные: сортирует диапазоны по времени начала
   * и сохраняет только дни с непустым списком диапазонов.
   */
  private static normalize(
    hoursByDay: Partial<Record<DayOfWeek, WorkHour[]>>,
  ): ReadonlyMap<DayOfWeek, readonly WorkHour[]> {
    const map = new Map<DayOfWeek, readonly WorkHour[]>();
    const days = Object.keys(hoursByDay).map(Number) as DayOfWeek[];
    for (const day of days) {
      const hours = hoursByDay[day];
      if (Array.isArray(hours) && hours.length > 0) {
        const sorted = [...hours].sort((a, b) => a.getStartMinutes() - b.getStartMinutes());
        map.set(day, sorted);
      }
    }
    return map;
  }
}