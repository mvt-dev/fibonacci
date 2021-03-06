import moment from 'moment';
import BalanceModel from '../models/BalanceModel';
import FinanceModel from '../models/FinanceModel';
import InvestmentController from './InvestmentController';
import AssetModel from '../models/AssetModel';

/**
* Balance controller
*/
export default class BalanceController {

  private model;
  private financeModel;
  private investmentController;
  private assetModel;

  constructor () {
    this.model = new BalanceModel();
    this.financeModel = new FinanceModel();
    this.investmentController = new InvestmentController();
    this.assetModel = new AssetModel();
  }

  async list(): Promise<any> {
    const results = [];
    const date = moment();
    do {
      const balances = await this.model.list(date.clone().startOf('month').format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
      let currency: any = { USD: null, EUR: null };
      if (date.month() === moment().month()) {
        currency.USD = await this.financeModel.getCurrency('USDBRL');
        currency.EUR = await this.financeModel.getCurrency('EURBRL');
      } else {
        const usdCurrency = await this.assetModel.getLastPrice('USD', date);
        currency.USD = { closePrice: usdCurrency?.close || 1 };
        const eurCurrency = await this.assetModel.getLastPrice('EUR', date);
        currency.EUR = { closePrice: eurCurrency?.close || 1 };
      }
      console.log(currency);
      const result = balances.reduce((acc: any, cur: any) => {
        acc.balance += cur.currency !== 'BRL' ? cur.balance * currency[cur.currency].closePrice : cur.balance;
        acc.invested += cur.currency !== 'BRL' ? cur.invested * currency[cur.currency].closePrice * -1 : cur.invested * -1;
        acc.profit += cur.currency !== 'BRL' ? cur.profit * currency[cur.currency].closePrice : cur.profit;
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
      });
      const investments = await this.investmentController.list(date.month() === moment().month() ? null : date.format('YYYY-MM-DD'));
      result.valorization = investments.total.valorization;
      result.valorizationPercent = ((result.invested + result.valorization) / result.invested - 1) * 100;
      result.result = result.balance + result.invested + investments.total.valorization;
      results.push(result);
      date.subtract(1, 'month').endOf('month');
    } while (moment().year() === date.year())
    results.forEach((x, i) => {
      x.grow = i < results.length - 1 ? (x.result / results[i + 1].result - 1) * 100 : 0
    });
    return results.sort((a, b) => b.month.localeCompare(a.month));
  }

}
