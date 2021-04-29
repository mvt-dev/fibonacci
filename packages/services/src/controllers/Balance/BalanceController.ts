import moment from 'moment';
import BalanceModel from '../../models/Balance';
import FinanceModel from '../../models/Finance';

/**
* Balance controller
*/
export default class BalanceController {

  private model;
  private financeModel;

  constructor () {
    this.model = new BalanceModel();
    this.financeModel = new FinanceModel();
  }

  async list(): Promise<any> {
    let currency: any;
    try {
      currency = await this.financeModel.getCurrency('USDBRL');
    } catch (error) {
      currency = { closePrice: 1, previousPrice: 1 };
    }
    const result = [];
    const date = moment();
    do {
      const balances = await this.model.list(date.clone().startOf('month').format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
      result.push(balances.reduce((acc: any, cur: any) => {
        acc.balance += cur.currency === 'USD' ? cur.balance * currency.closePrice : cur.balance;
        acc.invested += cur.currency === 'USD' ? cur.invested * currency.closePrice * -1 : cur.invested * -1;
        acc.profit += cur.currency === 'USD' ? cur.profit * currency.closePrice : cur.profit;
        acc.gain += cur.gain;
        acc.cost += cur.cost * -1;
        return acc;
      }, {
        month: date.format('YYYY-MM'),
        balance: 0,
        invested: 0,
        profit: 0,
        gain: 0,
        cost: 0
      }));
      date.subtract(1, 'month').endOf('month');
    } while (moment().year() === date.year())
    return result
      .map(x => ({ ...x, result: x.balance + x.invested }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }

}
