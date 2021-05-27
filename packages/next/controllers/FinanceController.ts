import FinanceModel from '../models/FinanceModel';
import { Finance } from '../interfaces/FinanceInterface';

/**
* Finance controller
*/
export default class FinanceController {

  private model;

  constructor () {
    this.model = new FinanceModel();
  }

  async getAssetPrice(symbol: string): Promise<Finance> {
    const asset: any = await this.model.getClosePrice(symbol);
    const variation = asset.closePrice ? (asset.closePrice / asset.previousPrice - 1) * 100 : 0;
    return {
      ...asset,
      variation
    };
  }

  async getCurrencyPrice(symbol: string): Promise<Finance> {
    const currency: any = await this.model.getCurrency(symbol);
    const variation = currency.closePrice ? (currency.closePrice / currency.previousPrice - 1) * 100 : 0;
    return {
      ...currency,
      variation
    };
  }

}
