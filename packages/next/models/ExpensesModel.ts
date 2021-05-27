import DbModel from './DbModel';
import { Expenses } from '../interfaces/ExpensesInterface';
import { TransactionType } from '../interfaces/TransactionInterface';
import { CategoryTag } from '../interfaces/CategoryInterface';

/**
* Expenses model
*/
export default class ExpensesModel extends DbModel {

  private table: string;
  private tableLedger: string;

  constructor (table = 'category', tableLedger = 'ledger') {
    super({});
    this.table = table;
    this.tableLedger = tableLedger;
  }

  async list(dateFrom: string, dateTo: string): Promise<Expenses[]> {
    return this.db(this.table)
      .select(
        `${this.table}.name AS category`,
        this.db(this.tableLedger).sum(`${this.tableLedger}.value`)
          .where(`${this.tableLedger}.category`, this.db.ref(`${this.table}.id`))
          .where(`${this.tableLedger}.type`, TransactionType.Cost)
          .whereBetween(`${this.tableLedger}.date`, [dateFrom, dateTo])
          .as('value')
      )
      .where(`${this.table}.tag`, CategoryTag.Debit);
  }

}
