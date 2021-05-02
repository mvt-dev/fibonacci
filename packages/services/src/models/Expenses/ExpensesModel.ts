import moment from 'moment';
import DbModel from '../Db';
import { ExpensesInterface, TransactionInterface, CategoryInterface } from '@fibonacci/interfaces';

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

  async list(dateFrom: string, dateTo: string): Promise<ExpensesInterface.Expenses[]> {
    return this.db(this.table)
      .select(
        `${this.table}.name AS category`,
        this.db(this.tableLedger).sum(`${this.tableLedger}.value`)
          .where(`${this.tableLedger}.category`, this.db.ref(`${this.table}.id`))
          .where(`${this.tableLedger}.type`, TransactionInterface.TransactionType.Cost)
          .whereBetween(`${this.tableLedger}.date`, [dateFrom, dateTo])
          .as('value')
      )
      .where(`${this.table}.tag`, CategoryInterface.CategoryTag.Debit);
  }

}
