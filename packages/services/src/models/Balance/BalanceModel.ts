import DbModel from '../Db';
import { TransactionInterface, AccountInterface } from '@fibonacci/interfaces';

/**
* Expenses model
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
    return this.db(this.table)
      .leftJoin(this.tableAccount, `${this.tableAccount}.id`, `${this.table}.account`)
      .select(
        `${this.tableAccount}.name`,
        `${this.tableAccount}.currency`,
        this.db.raw('SUM(ledger.value * ledger.amount) AS balance'),
        this.db.raw(`SUM(CASE WHEN ledger.type = '${TransactionInterface.TransactionType.Buy}' OR ledger.type = '${TransactionInterface.TransactionType.Sell}' THEN ledger.value * ledger.amount ELSE 0 END) AS invested`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND (ledger.type = '${TransactionInterface.TransactionType.Profit}' OR ledger.type = '${TransactionInterface.TransactionType.JCP}' OR ledger.type = '${TransactionInterface.TransactionType.Dividend}') THEN ledger.value ELSE 0 END) AS profit`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND ledger.type = '${TransactionInterface.TransactionType.Gain}' THEN ledger.value ELSE 0 END) AS gain`),
        this.db.raw(`SUM(CASE WHEN ${this.table}.date >= '${iniDate}' AND ledger.type = '${TransactionInterface.TransactionType.Cost}' THEN ledger.value ELSE 0 END) AS cost`),
      )
      .whereNot(`${this.tableAccount}.type`, AccountInterface.AccountType.Credit)
      .where(`${this.table}.date`, '<=', endDate)
      .groupBy(`${this.tableAccount}.name`, `${this.tableAccount}.currency`);
  }

}
