import moment from 'moment';
import DbModel from './DbModel';
import { Trade } from '../interfaces/TradeInterface';
import { TransactionType } from '../interfaces/TransactionInterface';

/**
* Trade model
*/
export default class TradeModel extends DbModel {

  constructor () {
    super({});
  }

  async list(endDate: Date): Promise<Trade[]> {
    const BUY = TransactionType.Buy;
    const SELL = TransactionType.Sell;
    const query = this.db('ledger')
      .leftJoin('account', 'account.id', 'ledger.account')
      .select(
        'ledger.description AS asset',
        'account.currency',
        this.db.raw(`MIN(ledger.date) AS first`),
        this.db.raw(`MAX(ledger.date) AS last`),
        this.db.raw(`(
          SELECT SUM(value) FROM ledger ledger_profit
          WHERE ledger_profit.description = ledger.description AND ledger_profit.date <= '${moment(endDate).format('YYYY-MM-DD')}'
          AND (
            ledger_profit.type = '${TransactionType.Profit}'
            OR ledger_profit.type = '${TransactionType.JCP}'
            OR ledger_profit.type = '${TransactionType.Dividend}')
        ) AS profit`),
        this.db.raw(`SUM(CASE WHEN ledger.type = '${BUY}' THEN ledger.amount * -1 * ledger.value ELSE 0 END) AS buy`),
        this.db.raw(`SUM(CASE WHEN ledger.type = '${SELL}' THEN ledger.amount * ledger.value ELSE 0 END) AS sell`),
        this.db.raw(`SUM(ledger.value * ledger.amount) AS result`),
      )
      .where('ledger.date', '<=', moment(endDate).format('YYYY-MM-DD'))
      .where(builder => builder.where('ledger.type', BUY).orWhere('ledger.type', SELL))
      .groupBy(['ledger.description', 'account.currency'])
      .having(this.db.raw(`SUM(CASE WHEN ledger.type = '${SELL}' THEN ledger.amount * -1 ELSE ledger.amount END) = 0`))
      .orderBy('result', 'desc');
    return query;
  }

}
