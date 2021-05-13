import FinanceModel from '../../models/Finance';

/**
* Finance controller
*/
export default class FinanceController {

  private model;

  constructor () {
    this.model = new FinanceModel();
  }

  async getAssetPrice(symbol: string): Promise<any> {
    const asset: any = await this.model.getClosePrice(symbol);
    const variation = asset.closePrice ? (asset.closePrice / asset.previousPrice - 1) * 100 : 0;
    return {
      ...asset,
      variation
    };
  }

  async getCurrencyPrice(symbol: string): Promise<any> {
    const currency: any = await this.model.getCurrency(symbol);
    const variation = currency.closePrice ? (currency.closePrice / currency.previousPrice - 1) * 100 : 0;
    return {
      ...currency,
      variation
    };
  }

}
