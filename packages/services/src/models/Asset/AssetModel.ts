import DbModel from '../Db';
import { AssetInterface } from '@fibonacci/interfaces';
import moment from 'moment';

/**
* Asset model
*/
export default class CategoryModel extends DbModel {

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

  async get(id: number): Promise<AssetInterface.Asset> {
    return this.db(this.table).where('id', id).first();
  }

  async create(asset: AssetInterface.Asset): Promise<AssetInterface.Asset> {
    const result = await this.db(this.table).insert({
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type,
    }).returning([
      'id',
      'name',
      'symbol',
      'type',
    ]);
    return result[0];
  }

  async update(asset: AssetInterface.Asset): Promise<AssetInterface.Asset> {
    const result = await this.db(this.table).where('id', asset.id).update({
      name: asset.name,
      symbol: asset.symbol,
      type: asset.type,
    }).returning([
      'id',
      'name',
      'symbol',
      'type',
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db(this.table).where('id', id).del();
  }

  async getPrice(asset: string, date: Date): Promise<AssetInterface.AssetPrice> {
    return this.db('asset_price')
      .leftJoin('asset', 'asset.id', 'asset_price.asset')
      .where('asset.name', asset)
      .where(
        'asset_price.date',
        this.db('asset_price')
          .max('asset_price.date')
          .where('asset_price.asset', this.db.ref('asset.id'))
          .where('asset_price.date', '<=', moment(date).format('YYYY-MM-DD'))
      )
      .first();
  }

  async createPrices(prices: AssetInterface.AssetPrice[]): Promise<void> {
    return this.db.batchInsert(this.tablePrice, prices);
  }

  async removePrices({ ids, from, to }: { ids?: number[], from?: Date, to?: Date }): Promise<void> {
    const query = this.db(this.tablePrice).del();
    if (ids) query.whereIn('id', ids);
    if (from) query.where('date', '>=', from);
    if (to) query.where('date', '<=', to);
    return query;
  }

}
