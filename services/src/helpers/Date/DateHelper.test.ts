import DateHelper from './DateHelper';

describe('DateHelper', () => {

  test('Parse DD/MM/YYYY to Date', () => {
    const dateBRL = '03/06/2022';
    const date = DateHelper.parseBRL(dateBRL);
    expect(date instanceof Date).toBe(true);
    expect(date?.getUTCFullYear()).toBe(2022);
    expect(date?.getUTCMonth()).toBe(5);
    expect(date?.getUTCDate()).toBe(3);
  });

  test('Get Date from UTC', () => {
    const utcDate = '2021-01-01T00:00:00.000Z';
    const date = DateHelper.fromUTC(utcDate);
    expect(date instanceof Date).toBe(true);
    expect(date?.getUTCFullYear()).toBe(2021);
    expect(date?.getUTCMonth()).toBe(0);
    expect(date?.getUTCDate()).toBe(1);
    expect(date?.getUTCHours()).toBe(0);
    expect(date?.getUTCMinutes()).toBe(0);
    expect(date?.getUTCSeconds()).toBe(0);
    expect(date?.getUTCMilliseconds()).toBe(0);
  });

  test('Get UTC String from Date', () => {
    const string = DateHelper.toUTCString(new Date(Date.UTC(2021, 0, 1, 12, 30, 0, 999)));
    expect(string).toBe('2021-01-01 12:30:00.999');
  });

});
