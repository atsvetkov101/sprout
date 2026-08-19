import { WorkHour } from './work-hour';
import { WorkHours, DayOfWeek } from './work-hours';

describe('Тесты для объекта-значение WorkHours', () => {
  describe('создание', () => {
    it('должен создавать экземпляр WorkHours с корректным расписанием', () => {
      const wh = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
        [DayOfWeek.Tuesday]: [new WorkHour('09:00', '18:00')],
      });
      expect(wh.getDays()).toEqual([DayOfWeek.Monday, DayOfWeek.Tuesday]);
    });

    it('должен создавать экземпляр WorkHours с несколькими диапазонами в день', () => {
      const wh = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '13:00'), new WorkHour('14:00', '18:00')],
      });
      expect(wh.getHoursForDay(DayOfWeek.Monday)).toHaveLength(2);
    });

    it('должен выбрасывать ошибку при создании с пустым расписанием', () => {
      expect(() => new WorkHours({})).toThrow('Некорректное расписание работы на неделю');
    });

    it('должен выбрасывать ошибку при создании с днем без диапазонов', () => {
      expect(() => new WorkHours({ [DayOfWeek.Monday]: [] })).toThrow(
        'Некорректное расписание работы на неделю',
      );
    });

    it('должен выбрасывать ошибку при создании с пересекающимися диапазонами в день', () => {
      expect(
        () =>
          new WorkHours({
            [DayOfWeek.Monday]: [new WorkHour('09:00', '15:00'), new WorkHour('12:00', '18:00')],
          }),
      ).toThrow('Некорректное расписание работы на неделю');
    });

    it('должен выбрасывать ошибку при создании с недопустимым днем недели', () => {
      expect(
        () =>
          new WorkHours({
            [8]: [new WorkHour('09:00', '18:00')],
          } as unknown as Record<DayOfWeek, WorkHour[]>),
      ).toThrow('Некорректное расписание работы на неделю');
    });
  });

  describe('доступ к значению', () => {
    it('должен возвращать диапазоны для указанного дня', () => {
      const wh = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      const hours = wh.getHoursForDay(DayOfWeek.Monday);
      expect(hours).toHaveLength(1);
      expect(hours[0].toString()).toBe('09:00-18:00');
    });

    it('должен возвращать пустой массив для дня без работы', () => {
      const wh = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      expect(wh.getHoursForDay(DayOfWeek.Tuesday)).toEqual([]);
    });

    it('должен возвращать дни с работой в порядке возрастания', () => {
      const wh = new WorkHours({
        [DayOfWeek.Sunday]: [new WorkHour('10:00', '16:00')],
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      expect(wh.getDays()).toEqual([DayOfWeek.Monday, DayOfWeek.Sunday]);
    });

    it('должен сортировать диапазоны в пределах дня по времени начала', () => {
      const wh = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('14:00', '18:00'), new WorkHour('09:00', '13:00')],
      });
      const hours = wh.getHoursForDay(DayOfWeek.Monday);
      expect(hours[0].toString()).toBe('09:00-13:00');
      expect(hours[1].toString()).toBe('14:00-18:00');
    });
  });

  describe('проверка работы', () => {
    const wh = new WorkHours({
      [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      [DayOfWeek.Tuesday]: [new WorkHour('09:00', '13:00'), new WorkHour('14:00', '18:00')],
    });

    it('должен возвращать true, если в день есть работа', () => {
      expect(wh.isOpenOn(DayOfWeek.Monday)).toBe(true);
    });

    it('должен возвращать false, если в день нет работы', () => {
      expect(wh.isOpenOn(DayOfWeek.Sunday)).toBe(false);
    });

    it('должен возвращать true, если время попадает в рабочий диапазон', () => {
      expect(wh.isOpenAt(DayOfWeek.Monday, '12:00')).toBe(true);
    });

    it('должен возвращать false, если время до начала работы', () => {
      expect(wh.isOpenAt(DayOfWeek.Monday, '08:00')).toBe(false);
    });

    it('должен возвращать false, если время после окончания работы', () => {
      expect(wh.isOpenAt(DayOfWeek.Monday, '18:00')).toBe(false);
    });

    it('должен возвращать true, если время попадает в перерыв между диапазонами', () => {
      expect(wh.isOpenAt(DayOfWeek.Tuesday, '13:30')).toBe(false);
    });

    it('должен возвращать true, если время попадает во второй диапазон дня', () => {
      expect(wh.isOpenAt(DayOfWeek.Tuesday, '15:00')).toBe(true);
    });

    it('должен возвращать false, если в день нет работы', () => {
      expect(wh.isOpenAt(DayOfWeek.Sunday, '12:00')).toBe(false);
    });

    it('должен возвращать false при некорректном времени', () => {
      expect(wh.isOpenAt(DayOfWeek.Monday, '25:00')).toBe(false);
    });
  });

  describe('равенство', () => {
    it('должен считать два объекта WorkHours равными, если расписания одинаковы', () => {
      const wh1 = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      const wh2 = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      expect(wh1.equals(wh2)).toBe(true);
    });

    it('не должен считать два объекта WorkHours равными, если дни различаются', () => {
      const wh1 = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      const wh2 = new WorkHours({
        [DayOfWeek.Tuesday]: [new WorkHour('09:00', '18:00')],
      });
      expect(wh1.equals(wh2)).toBe(false);
    });

    it('не должен считать два объекта WorkHours равными, если диапазоны различаются', () => {
      const wh1 = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
      });
      const wh2 = new WorkHours({
        [DayOfWeek.Monday]: [new WorkHour('10:00', '18:00')],
      });
      expect(wh1.equals(wh2)).toBe(false);
    });
  });

  describe('валидация', () => {
    it('должен считать корректным расписание с одним днем', () => {
      expect(
        WorkHours.isValid({
          [DayOfWeek.Monday]: [new WorkHour('09:00', '18:00')],
        }),
      ).toBe(true);
    });

    it('должен считать корректным расписание с несколькими диапазонами в день', () => {
      expect(
        WorkHours.isValid({
          [DayOfWeek.Monday]: [new WorkHour('09:00', '13:00'), new WorkHour('14:00', '18:00')],
        }),
      ).toBe(true);
    });

    it('должен считать некорректным пустое расписание', () => {
      expect(WorkHours.isValid({})).toBe(false);
    });

    it('должен считать некорректным расписание с днем без диапазонов', () => {
      expect(WorkHours.isValid({ [DayOfWeek.Monday]: [] })).toBe(false);
    });

    it('должен считать некорректным расписание с пересекающимися диапазонами', () => {
      expect(
        WorkHours.isValid({
          [DayOfWeek.Monday]: [new WorkHour('09:00', '15:00'), new WorkHour('12:00', '18:00')],
        }),
      ).toBe(false);
    });
  });
});