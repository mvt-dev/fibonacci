import { AssetInterface } from '@fibonacci/interfaces';
import AssetModel from '../../models/Asset';
import FinanceModel from '../../models/Finance';
import moment from 'moment';

/**
* Asset controller
*/
export default class AssetController {

  private assetModel;
  private financeModel;

  constructor () {
    this.assetModel = new AssetModel();
    this.financeModel = new FinanceModel();
  }

  async list(): Promise<AssetInterface.Asset[]> {
    return this.assetModel.list();
  }

  async get(id: number): Promise<AssetInterface.Asset> {
    return this.assetModel.get(id);
  }

  async create(asset: AssetInterface.Asset): Promise<AssetInterface.Asset> {
    return this.assetModel.create(asset);
  }

  async update(asset: AssetInterface.Asset): Promise<AssetInterface.Asset> {
    return this.assetModel.update(asset);
  }

  async remove(id: number): Promise<void> {
    await this.assetModel.remove(id);
  }

  async updatePrices(assets: string[] = [], clean = false): Promise<AssetInterface.Asset[]> {
    const result = [];
    const allAssets = await this.assetModel.list();
    const selectedAssets = allAssets.filter((x: any) => assets.length > 0 ? assets.includes(x.symbol) : true);
    for (const asset of selectedAssets) {
      const hasUpdate = !asset.lastPrice || moment().diff(moment(asset.lastPrice), 'days') > 0;
      if (hasUpdate && [AssetInterface.AssetType.StockBR, AssetInterface.AssetType.ReitBR, AssetInterface.AssetType.StockUS].includes(asset.type)) {
        const full = asset.lastPrice ? moment().diff(asset.lastPrice, 'days') > 100 : true;
        const prices = await this.financeModel.getHistoricalData(asset.symbol, full);
        const pricesParsed = prices
          .filter((x: any) => moment.utc(x.date) > moment(asset.lastPrice))
          .map((x: any) => ({
            ...x,
            asset: asset.id
          }));
        if (pricesParsed.length > 0) {
          await this.assetModel.createPrices(pricesParsed);
          result.push({
            ...asset,
            lastPrice: prices[0].date
          });
        }
      }
    }
    return result;
  }

}
