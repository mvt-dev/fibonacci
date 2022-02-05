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
    try {
      const assets = await this.assetModel.list();
      let diffDays = 1;
      if (moment().isoWeekday() === 6) diffDays = 2;
      if (moment().isoWeekday() === 7) diffDays = 3;
      if (moment().isoWeekday() === 1) diffDays = 4;
      const assetsToUpdate = assets.filter(x => x.symbol && (!x.lastPrice || (x.lastPrice && moment().diff(moment(x.lastPrice), 'days') > diffDays)));
      for (const asset of assetsToUpdate) {
        const full = asset.lastPrice ? moment().diff(asset.lastPrice, 'days') > 100 : true;
        console.log(asset.symbol);
        let prices = [];
        if ([AssetInterface.AssetType.StockBR, AssetInterface.AssetType.ReitBR, AssetInterface.AssetType.StockUS].includes(asset.type)) {
          prices = await this.financeModel.getHistoricalData(asset.symbol, full);
        } else if (asset.type === AssetInterface.AssetType.Crypto) {
          // prices = await this.financeModel.getCryptocurrencyHistory(asset.symbol.split('-')[0], asset.symbol.split('-')[1]);
          prices = await this.financeModel.getCryptocurrencyHistory2(asset.symbol, moment(asset.lastPrice || '1990-01-01'), moment.utc().subtract(2, 'day'));
        } else if (asset.type === AssetInterface.AssetType.Currency) {
          prices = await this.financeModel.getCurrencyHistory(asset.symbol.split('-')[0], asset.symbol.split('-')[1], full);
        }
        const pricesParsed = prices
          .filter((x: any) => moment.utc(x.date) < moment.utc().subtract(1, 'day'))
          .filter((x: any) => asset?.lastPrice ? moment.utc(x.date) > moment(asset.lastPrice) : true)
          .map((x: any) => ({
            ...x,
            asset: asset.id
          }));
        console.log('Prices to update: ', pricesParsed.length);
        if (pricesParsed.length > 0) {
          await this.assetModel.createPrices(pricesParsed);
        }
        console.log('Waiting 15s for next asset...');
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.log('Finished! Waiting 30s...');
      setTimeout(() => this.run(), 30000);
    }
  }

}
