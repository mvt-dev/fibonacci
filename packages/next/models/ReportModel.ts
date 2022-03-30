import DbModel from './DbModel';
import { TransactionType } from '../interfaces/TransactionInterface';
import { AccountType } from '../interfaces/AccountInterface';

/**
* Report model
*/
export default class ReportModel extends DbModel {

  private tableAsset: string;
  private tableLedger: string;
  private tableAccount: string;

  constructor (tableAsset = 'asset', tableLedger = 'ledger', tableAccount = 'account') {
    super({});
    this.tableAsset = tableAsset;
    this.tableLedger = tableLedger;
    this.tableAccount = tableAccount;
  }

  async list(iniDate: string, endDate: string): Promise<any> {
    const query = this.db(this.tableAsset)
      .leftJoin(this.tableLedger, `${this.tableLedger}.description`, `${this.tableAsset}.name`)
      .leftJoin(this.tableAccount, `${this.tableAccount}.id`, `${this.tableLedger}.account`)
      .select(
        `${this.tableAsset}.name AS asset`,
        `${this.tableAccount}.name AS account`,
        `${this.tableAccount}.currency`,
        this.db(this.tableLedger).sum(`${this.tableLedger}.amount`).where(`${this.tableLedger}.date`, '<=', iniDate).as('ini_amount'),
        this.db(this.tableLedger).sum(`${this.tableLedger}.amount`).where(`${this.tableLedger}.date`, '<=', endDate).as('end_amount'),
        this.db.raw(`SUM(${this.tableLedger}.value * ${this.tableLedger}.amount) AS balance`),
        this.db.raw(`SUM(CASE WHEN ledger.type = '${TransactionType.Buy}' OR ledger.type = '${TransactionType.Sell}' THEN ledger.value * ledger.amount ELSE 0 END) AS invested`),
        this.db.raw(`SUM(CASE WHEN ${this.tableLedger}.date >= '${iniDate}' AND ledger.type = '${TransactionType.Profit}' THEN ledger.value ELSE 0 END) AS profit`),
        this.db.raw(`SUM(CASE WHEN ${this.tableLedger}.date >= '${iniDate}' AND ledger.type = '${TransactionType.JCP}' THEN ledger.value ELSE 0 END) AS jcp`),
        this.db.raw(`SUM(CASE WHEN ${this.tableLedger}.date >= '${iniDate}' AND ledger.type = '${TransactionType.Dividend}' THEN ledger.value ELSE 0 END) AS dividend`),
      )
      .where(`${this.tableAccount}.type`, AccountType.Investment)
      .where(`${this.tableLedger}.date`, '<=', endDate)
      .groupBy(`${this.tableAsset}.name`, `${this.tableAccount}.name`, `${this.tableAccount}.currency`);
    return query;
  }

}
