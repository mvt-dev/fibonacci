import moment from 'moment';
import FinanceModel from './FinanceModel';

describe('FinanceModel', () => {

  const model = new FinanceModel();

  test('getCryptocurrencyHistory2', async () => {
    const prices = await model.getCryptocurrencyHistory2('AXS-USD', moment.utc().subtract(6, 'day'), moment.utc().subtract(2, 'day'));
    expect(prices.length).toBe(5);
    expect(prices[0].date).not.toBeNull();
    expect(prices[0].open).not.toBeNull();
    expect(prices[0].high).not.toBeNull();
    expect(prices[0].low).not.toBeNull();
    expect(prices[0].close).not.toBeNull();
    expect(prices[0].volume).not.toBeNull();
  });

});
