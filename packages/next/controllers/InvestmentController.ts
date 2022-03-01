import moment from 'moment';
import InvestmentModel from '../models/InvestmentModel';
import FinanceModel from '../models/FinanceModel';
import AssetModel from '../models/AssetModel';
import { Investment } from '../interfaces/InvestmentInterface';
import { AssetType } from '../interfaces/AssetInterface';

/**
* Investment controller
*/
export default class InvestmentController {

  private model;
  private financeModel;
  private assetModel;

  constructor () {
    this.model = new InvestmentModel();
    this.financeModel = new FinanceModel();
    this.assetModel = new AssetModel();
  }

  async list(endDate: Date = null): Promise<Investment[]> {
    let investments = [];
    let currency;
    if (endDate) {
      investments = await this.model.list(endDate);
      const _currency = await this.assetModel.getLastPrice('USD', endDate);
      currency = _currency ? { closePrice: _currency.close, previousPrice: _currency.open } : { closePrice: 1, previousPrice: 1 };
    } else {
      investments = await this.model.list(moment());
      try {
        currency = await this.financeModel.getCurrency('USDBRL');
      } catch (error) {
        currency = { closePrice: 1, previousPrice: 1 };
      }
    }
    for (const investment of investments) {
      if (investment.type === AssetType.FixedBR) {
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
            if (!endDate) {
              const finance = await this.financeModel.getClosePrice(investment.symbol);
              investment.closePrice = finance.closePrice * currency.closePrice;
              investment.previousPrice = finance.previousPrice * currency.previousPrice;
            } else {
              investment.closePrice = investment.closePrice * currency.closePrice;
              investment.previousPrice = investment.previousPrice * currency.previousPrice;
            }
            investment.value = investment.value * currency.closePrice;
            investment.average = investment.average * currency.closePrice;
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          } else if (investment.type === AssetType.Crypto) {
            if (!endDate) {
              const finance = await this.financeModel.getClosePrice(investment.symbol);
              investment.closePrice = finance.closePrice * currency.closePrice;
              investment.previousPrice = finance.previousPrice * currency.previousPrice;
            } else {
              investment.closePrice = investment.closePrice * currency.closePrice;
              investment.previousPrice = investment.previousPrice * currency.previousPrice;
            }
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          } else {
            if (!endDate) {
              const finance = await this.financeModel.getClosePrice(investment.symbol);
              investment.closePrice = finance.closePrice;
              investment.previousPrice = finance.previousPrice;
            }
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
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
      .sort((a, b) => (b.variation || 0) - (a.variation || 0));
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
