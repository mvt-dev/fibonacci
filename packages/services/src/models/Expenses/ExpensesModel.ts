import moment from 'moment';
import DbModel from '../Db';
import { ExpensesInterface, TransactionInterface } from '@fibonacci/interfaces';

/**
* Expenses model
*/
export default class ExpensesModel extends DbModel {

  private table: string;
  private tableCategory: string;

  constructor (table = 'ledger', tableCategory = 'category') {
    super({});
    this.table = table;
    this.tableCategory = tableCategory;
  }

  async list(): Promise<ExpensesInterface.Expenses[]> {
    return this.db(this.table)
      .leftJoin(this.tableCategory, `${this.tableCategory}.id`, `${this.table}.category`)
      .select(
        `${this.tableCategory}.name`,
        this.db.raw(`SUM(${this.table}.value) AS value`)
      )
      .where(`${this.table}.type`, TransactionInterface.TransactionType.Cost)
      .where(`${this.table}.date`, '>=', moment().startOf('month').format('YYYY-MM-DD'))
      .groupBy(`${this.tableCategory}.name`)
      .orderBy('value');
  }

}
