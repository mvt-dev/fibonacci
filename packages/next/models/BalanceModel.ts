import DbModel from './DbModel';
import { TransactionType } from '../interfaces/TransactionInterface';
import { AccountType } from '../interfaces/AccountInterface';

/**
* Balance model
*/
export default class BalanceModel extends DbModel {

  private table: string;
  private tableAccount: string;

  constructor (table = 'ledger', tableAccount = 'account') {
    super({});
    this.table = table;
    this.tableAccount = tableAccount;
  }

  async list(iniDate: string, endDate: string): Promise<any> {
    const query = this.db(this.table)
      .leftJoin(this.tableAccount, `${this.tableAccount}.id`, `${this.table}.account`)
      .select(
        `${this.tableAccount}.name`,
        `${this.tableAccount}.currency`,
        this.db.raw('SUM(ledger.value * ledger.amount) AS balance'),
        this.db.raw(`SUM(CASE WHEN ledger.type = '${TransactionType.Buy}' OR ledger.type = '${TransactionType.Sell}' THEN ledger.value * ledger.amount ELSE 0 END) AS invested`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND (ledger.type = '${TransactionType.Profit}' OR ledger.type = '${TransactionType.JCP}' OR ledger.type = '${TransactionType.Dividend}') THEN ledger.value ELSE 0 END) AS profit`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND ledger.type = '${TransactionType.Gain}' THEN ledger.value ELSE 0 END) AS gain`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND ledger.type = '${TransactionType.Cost}' THEN ledger.value ELSE 0 END) AS cost`),
      )
      .whereNot(`${this.tableAccount}.type`, AccountType.Credit)
      .where(`${this.table}.date`, '<=', endDate)
      .groupBy(`${this.tableAccount}.name`, `${this.tableAccount}.currency`);
    return query;
  }

}
