import moment from 'moment';
import DbModel from './DbModel';
import { Investment } from '../interfaces/InvestmentInterface';
import { TransactionType } from '../interfaces/TransactionInterface';

/**
* Investment model
*/
export default class InvestmentModel extends DbModel {

  constructor () {
    super({});
  }

  async list(endDate: Date): Promise<Investment[]> {
    const BUY = TransactionType.Buy;
    const SELL = TransactionType.Sell;
    const query = this.db('ledger')
      .leftJoin('account', 'account.id', 'ledger.account')
      .leftJoin('asset', 'asset.name', 'ledger.description')
      .select(
        'ledger.description AS asset',
        'asset.type',
        'asset.symbol',
        'account.currency',
        this.db.raw(`SUM(CASE WHEN ledger.type = '${SELL}' THEN ledger.amount * -1 ELSE ledger.amount END) AS amount`),
        this.db.raw(`SUM(ledger.value * ledger.amount * -1) AS value`),
        this.db.raw(`(
          SELECT SUM(ledger_avg.value * ledger_avg.amount * -1) / SUM(CASE WHEN ledger_avg.type = '${SELL}' THEN ledger_avg.amount * -1 ELSE ledger_avg.amount END)
          FROM ledger ledger_avg
          WHERE ledger_avg.description = ledger.description AND (ledger_avg.type = '${BUY}' OR ledger_avg.type = '${SELL}')
          AND ledger_avg.date <= '${moment(endDate).format('YYYY-MM-DD')}'
        ) AS average`),
        this.db.raw(`(
          SELECT SUM(value) FROM ledger ledger_profit
          WHERE ledger_profit.description = ledger.description AND ledger_profit.date <= '${moment(endDate).format('YYYY-MM-DD')}'
          AND (
            ledger_profit.type = '${TransactionType.Profit}'
            OR ledger_profit.type = '${TransactionType.JCP}'
            OR ledger_profit.type = '${TransactionType.Dividend}')
        ) AS profit`),
        this.db.raw(`(
          SELECT asset_price.close FROM asset_price WHERE asset_price.asset = asset.id
          AND asset_price.date = (
            SELECT MAX(asset_price_max.date) FROM asset_price asset_price_max WHERE asset_price_max.asset = asset_price.asset
            AND EXTRACT(MONTH FROM asset_price_max.date) = ${moment(endDate).month() + 1}
          ) LIMIT 1
        ) AS close_price`),
        this.db.raw(`(
          SELECT asset_price.close FROM asset_price WHERE asset_price.asset = asset.id
          AND asset_price.date = (
            SELECT asset_price_max.date FROM asset_price asset_price_max WHERE asset_price_max.asset = asset_price.asset
            AND EXTRACT(MONTH FROM asset_price_max.date) = ${moment(endDate).month() + 1}
            ORDER BY asset_price_max.date DESC LIMIT 1 OFFSET 1
          ) LIMIT 1
        ) AS previous_price`),
      )
      .where('ledger.date', '<=', moment(endDate).format('YYYY-MM-DD'))
      .where(builder => builder.where('ledger.type', BUY).orWhere('ledger.type', SELL))
      .groupBy(['ledger.description', 'account.currency', 'asset.id'])
      .having(this.db.raw(`SUM(CASE WHEN ledger.type = '${SELL}' THEN ledger.amount * -1 ELSE ledger.amount END) > 0`))
      .orderBy('value', 'desc');
    return query;
  }

}
