import NumberHelper from './NumberHelper';

describe('NumberHelper', () => {

  test('Parse #.###,## to number', () => {
    expect(NumberHelper.parseBRL('15,00')).toBe(15.00);
    expect(NumberHelper.parseBRL('15,15')).toBe(15.15);
    expect(NumberHelper.parseBRL('15,156')).toBe(15.16);
    expect(NumberHelper.parseBRL('teste')).toBe(NaN);
  });

});
