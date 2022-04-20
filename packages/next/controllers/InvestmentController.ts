import moment from 'moment';
import InvestmentModel from '../models/InvestmentModel';
import FinanceModel from '../models/FinanceModel';
import AssetModel from '../models/AssetModel';
import AccountModel from '../models/AccountModel';
import { Investment } from '../interfaces/InvestmentInterface';
import { AssetType } from '../interfaces/AssetInterface';
import { AccountType } from '../interfaces/AccountInterface';

/**
* Investment controller
*/
export default class InvestmentController {

  private model;
  private financeModel;
  private assetModel;
  private accountModel;

  constructor () {
    this.model = new InvestmentModel();
    this.financeModel = new FinanceModel();
    this.assetModel = new AssetModel();
    this.accountModel = new AccountModel();
  }

  async list(endDate: Date = null): Promise<Investment[]> {
    let investments = [];
    let accounts = [];
    let currencies = {
      BRL: { closePrice: 1, previousPrice: 1 },
      USD: { closePrice: 1, previousPrice: 1 },
      EUR: { closePrice: 1, previousPrice: 1 },
    };
    if (endDate) {
      investments = await this.model.list(endDate);
      const currencyUSD = await this.assetModel.getLastPrice('USD', endDate);
      if (currencyUSD) currencies.USD = { closePrice: currencyUSD.close, previousPrice: currencyUSD.open };
      const currencyEUR = await this.assetModel.getLastPrice('EUR', endDate);
      if (currencyEUR) currencies.USD = { closePrice: currencyEUR.close, previousPrice: currencyEUR.open };
    } else {
      investments = await this.model.list(moment());
      accounts = await this.accountModel.list();
      try {
        currencies.USD = await this.financeModel.getCurrency('USDBRL');
        currencies.EUR = await this.financeModel.getCurrency('EURBRL');
      } catch (error) {
        currencies.USD = { closePrice: 1, previousPrice: 1 };
        currencies.EUR = { closePrice: 1, previousPrice: 1 };
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
          if (investment.type === AssetType.Crypto) {
            if (!endDate) {
              const finance = await this.financeModel.getClosePrice(investment.symbol);
              investment.closePrice = finance.closePrice * currencies.USD.closePrice;
              investment.previousPrice = finance.previousPrice * currencies.USD.previousPrice;
            } else {
              investment.closePrice = investment.closePrice * currencies.USD.closePrice;
              investment.previousPrice = investment.previousPrice * currencies.USD.previousPrice;
            }
            investment.variation = (investment.closePrice / investment.previousPrice - 1) * 100;
            investment.valorization = (investment.closePrice - investment.average) * investment.amount;
            investment.currentValue = investment.value + investment.valorization;
            investment.valorizationPercent = (investment.currentValue / investment.value - 1) * 100;
          } else {
            if (!endDate) {
              const finance = await this.financeModel.getClosePrice(investment.symbol);
              investment.closePrice = finance.closePrice * currencies[investment.currency].closePrice;
              investment.previousPrice = finance.previousPrice * currencies[investment.currency].previousPrice;
            } else {
              investment.closePrice = investment.closePrice * currencies[investment.currency].closePrice;
              investment.previousPrice = investment.previousPrice * currencies[investment.currency].previousPrice;
            }
            investment.value = investment.value * currencies[investment.currency].closePrice;
            investment.average = investment.average * currencies[investment.currency].closePrice;
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
    // Accounts balance
    investments = investments.concat(accounts.filter(x => x.type !== AccountType.Credit).map(account => ({
      type: AssetType.Cash,
      asset: account.name,
      currentValue: account.balance * currencies[account.currency].closePrice,
      value: account.balance * currencies[account.currency].closePrice,
      closePrice: null,
      previousPrice: null,
      variation: (currencies[account.currency].closePrice / currencies[account.currency].previousPrice - 1) * 100,
      valorization: 0,
      valorizationPercent: 0,
    })));
    // Total
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
    // Group by type
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
    // Remove assets of type cash
    response.assets = response.assets.filter((asset: any) => asset.type !== AssetType.Cash);
    return response;
  }

}
