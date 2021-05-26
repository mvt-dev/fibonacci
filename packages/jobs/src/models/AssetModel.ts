import DbModel from './DbModel';
import * as AssetInterface from '../interfaces/AssetInterface';

/**
* Asset model
*/
export default class AssetModel extends DbModel {

  private table: string;
  private tablePrice: string;

  constructor (table = 'asset', tablePrice = 'asset_price') {
    super({});
    this.table = table;
    this.tablePrice = tablePrice;
  }

  async list(): Promise<AssetInterface.Asset[]> {
    return this.db(this.table)
      .select(
        '*',
        this.db(this.tablePrice).max(`${this.tablePrice}.date`).where(`${this.tablePrice}.asset`, this.db.ref(`${this.table}.id`)).as('last_price')
      )
      .orderBy('name');
  }

  async createPrices(prices: AssetInterface.AssetPrice[]): Promise<void> {
    return this.db.batchInsert(this.tablePrice, prices);
  }

}
