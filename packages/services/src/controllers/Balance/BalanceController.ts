import moment from 'moment';
import BalanceModel from '../../models/Balance';
import FinanceModel from '../../models/Finance';
import InvestmentController from '../Investment';

/**
* Balance controller
*/
export default class BalanceController {

  private model;
  private financeModel;
  private investmentController;

  constructor () {
    this.model = new BalanceModel();
    this.financeModel = new FinanceModel();
    this.investmentController = new InvestmentController();
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
        cost: 0,
      }));
      date.subtract(1, 'month').endOf('month');
    } while (moment().year() === date.year())
    const investments = await this.investmentController.listCurrent();
    return result
      .map(x => {
        const valorization = x.month === moment().format('YYYY-MM') ? investments.total.valorization : 0;
        return {
          ...x,
          valorization,
          result: x.balance + x.invested + valorization
        }
      })
      .sort((a, b) => b.month.localeCompare(a.month));
  }

}
