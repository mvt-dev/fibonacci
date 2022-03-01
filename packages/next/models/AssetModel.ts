import DbModel from './DbModel';
import { Asset, AssetPrice } from '../interfaces/AssetInterface';
import { TransactionType } from '../interfaces/TransactionInterface';
import moment from 'moment';

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

  async list(): Promise<Asset[]> {
    return this.db(this.table)
      .select(
        '*',
        this.db(this.tablePrice).max(`${this.tablePrice}.date`).where(`${this.tablePrice}.asset`, this.db.ref(`${this.table}.id`)).as('last_price')
      )
      .orderBy('name');
  }

  async get(id: number): Promise<Asset> {
    return this.db(this.table).where('id', id).first();
  }

  async create(asset: Asset): Promise<Asset> {
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

  async update(asset: Asset): Promise<Asset> {
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

  async getLastPrice(asset: string, date: Date): Promise<AssetPrice> {
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

  async getPrices(asset: number, from: Date, to: Date): Promise<AssetPrice> {
    return this.db('asset_price')
      .leftJoin('asset', 'asset.id', 'asset_price.asset')
      .select(
        'asset_price.*',
        this.db.raw(`(
          SELECT SUM(ledger.value * ledger.amount * -1) / SUM(CASE WHEN ledger.type = '${TransactionType.Sell}' THEN ledger.amount * -1 ELSE ledger.amount END)
          FROM ledger
          WHERE ledger.description = asset.name AND (ledger.type = '${TransactionType.Buy}' OR ledger.type = '${TransactionType.Sell}')
          AND ledger.date <= asset_price.date
        ) AS position`),
      )
      .where('asset_price.asset', asset)
      .whereBetween('asset_price.date', [from, to])
      .orderBy('asset_price.date');
  }

}
