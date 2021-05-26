import * as AssetInterface from '../interfaces/AssetInterface';
import AssetModel from '../models/AssetModel';
import FinanceModel from '../models/FinanceModel';
import moment from 'moment';

/**
* Asset price job
*/
export default class AssetPriceJob {

  private assetModel: AssetModel;
  private financeModel: FinanceModel;

  constructor () {
    this.assetModel = new AssetModel();
    this.financeModel = new FinanceModel();
    this.run();
  }

  private async run () {
    const assets = await this.assetModel.list();
    let diffDays = 0;
    if (moment().isoWeekday() === 6) diffDays = 1;
    if (moment().isoWeekday() === 7) diffDays = 2;
    if (moment().isoWeekday() === 1) diffDays = 3;
    const assetsToUpdate = assets.filter(x => x.symbol && (!x.lastPrice || (x.lastPrice && moment().diff(moment(x.lastPrice), 'days') > diffDays)));
    const asset = assetsToUpdate[0];
    if (asset?.symbol) {
      const full = asset.lastPrice ? moment().diff(asset.lastPrice, 'days') > 100 : true;
      console.log(asset.symbol, full);
      let prices = [];
      if ([AssetInterface.AssetType.StockBR, AssetInterface.AssetType.ReitBR, AssetInterface.AssetType.StockUS].includes(asset.type)) {
        prices = await this.financeModel.getHistoricalData(asset.symbol, full);
      } else if (asset.type === AssetInterface.AssetType.Crypto) {
        prices = await this.financeModel.getCryptocurrencyHistory(asset.symbol.split('-')[0], asset.symbol.split('-')[1]);
      } else if (asset.type === AssetInterface.AssetType.Currency) {
        prices = await this.financeModel.getCurrencyHistory(asset.symbol.split('-')[0], asset.symbol.split('-')[1], full);
      }
      const pricesParsed = prices
        .filter((x: any) => moment.utc(x.date) < moment.utc())
        .filter((x: any) => asset?.lastPrice ? moment.utc(x.date) > moment(asset.lastPrice) : true)
        .map((x: any) => ({
          ...x,
          asset: asset.id
        }));
      console.log('Prices to update: ', pricesParsed.length);
      if (pricesParsed.length > 0) {
        await this.assetModel.createPrices(pricesParsed);
      }
    }
    console.log('Waiting 30s for next asset...');
    setTimeout(() => this.run(), 30000);
  }

}
