import InvestmentModel from '../../models/Investment';
import FinanceModel from '../../models/Finance';

/**
* Investment controller
*/
export default class InvestmentController {

  private model;
  private financeModel;

  constructor () {
    this.model = new InvestmentModel();
    this.financeModel = new FinanceModel();
  }

  async listCurrent(): Promise<any> {
    const investments = await this.model.listCurrent();
    let currency;
    try {
      currency = await this.financeModel.getCurrency('USDBRL');
    } catch (error) {
      currency = { closePrice: 1, previousPrice: 1 };
    }
    for (const investment of investments) {
      if (investment.type === 'FIXED_BR') {
        investment.currentValue = investment.value;
        investment.value = investment.value - (investment.profit || 0);
        investment.closePrice = null;
        investment.previousPrice = null;
        investment.variation = null;
        investment.valorization = investment.profit;
        investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
      } else {
        try {
          if (investment.currency === 'USD') {
            const finance = await this.financeModel.getClosePrice(investment.asset);
            investment.value = investment.value * currency.closePrice;
            investment.average = investment.average * currency.closePrice;
            investment.closePrice = finance.closePrice * currency.closePrice;
            investment.previousPrice = finance.previousPrice * currency.previousPrice;
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          } else if (investment.asset === 'BTC') {
            const finance = await this.financeModel.getClosePrice('BTC-USD');
            investment.closePrice = finance.closePrice * currency.closePrice;
            investment.previousPrice = finance.previousPrice * currency.previousPrice;
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          } else {
            const finance = await this.financeModel.getClosePrice(`${investment.asset}.SA`);
            investment.closePrice = finance.closePrice;
            investment.previousPrice = finance.previousPrice;
            investment.variation = (finance.closePrice / finance.previousPrice - 1) * 100;
            investment.valorization = (finance.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          }
        } catch (error) {
          investment.closePrice = null;
          investment.previousPrice = null;
          investment.variation = null;
          investment.valorizationPercent = null;
          investment.valorization = null;
          investment.currentValue = investment.value;
        }
      }
    }
    const response: any = { total: {} };
    response.total.value = investments.reduce((acc, cur) => acc += cur.value || 0, 0);
    response.total.valorization = investments.reduce((acc, cur) => acc += cur.valorization || 0, 0);
    response.total.currentValue = response.total.value + response.total.valorization;
    response.total.valorizationPercent = (response.total.currentValue / response.total.value - 1) * 100;
    const totalPreviousPrice = investments.reduce((acc, cur) => acc += cur.previousPrice ? cur.previousPrice * cur.amount : cur.currentValue || 0, 0);
    response.total.variation = (response.total.currentValue / totalPreviousPrice - 1) * 100;
    response.assets = investments
      .map(x => ({
        ...x,
        walletPercent: (x.currentValue || 0) * 100 / response.total.currentValue,
      }))
      .sort((a, b) => (b.currentValue || 0) - (a.currentValue || 0));
    response.types = response.assets
      .reduce((acc: any, cur: any) => {
        const { type, value, currentValue, valorization, valorizationPercent, variation, walletPercent, amount, closePrice, previousPrice } = cur;
        const found = acc.find((x: any) => x.type === cur.type);
        if (found) {
          found.value += value;
          found.variation += variation;
          found.valorization += valorization;
          found.valorizationPercent += valorizationPercent;
          found.walletPercent += walletPercent;
          found.currentValue += currentValue;
          found.amount += amount;
          found.closePrice += closePrice;
          found.previousPrice += previousPrice;
        } else {
          acc.push({
            type,
            value,
            variation,
            valorization,
            valorizationPercent,
            walletPercent,
            currentValue,
            amount,
            closePrice,
            previousPrice,
          });
        }
        return acc;
      }, [])
      .map((x: any) => ({
        type: x.type,
        value: x.value,
        valorization: x.valorization,
        valorizationPercent: (x.currentValue / x.value - 1) * 100,
        walletPercent: x.walletPercent,
        currentValue: x.currentValue,
        variation: ((x.closePrice * x.amount) / (x.previousPrice * x.amount) - 1) * 100,
      }))
      .sort((a: any, b: any) => (b.currentValue || 0) - (a.currentValue || 0));
    return response;
  }

}
