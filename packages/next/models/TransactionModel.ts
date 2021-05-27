import DbModel from './DbModel';
import { Transaction } from '../interfaces/TransactionInterface';

/**
* Transaction model
*/
export default class TransactionModel extends DbModel {

  private table: string;
  private tableAccount: string;
  private tableCategory: string;

  constructor (table = 'ledger', tableAccount = 'account', tableCategory = 'category') {
    super({});
    this.table = table;
    this.tableAccount = tableAccount;
    this.tableCategory = tableCategory;
  }

  async list(from: string, to: string): Promise<Transaction[]> {
    return this.db(this.table)
      .leftJoin(this.tableAccount, `${this.tableAccount}.id`, `${this.table}.account`)
      .leftJoin(this.tableCategory, `${this.tableCategory}.id`, `${this.table}.category`)
      .select(
        `${this.table}.*`,
        this.db.raw(`row_to_json("${this.tableAccount}".*) AS "${this.tableAccount}"`),
        this.db.raw(`row_to_json("${this.tableCategory}".*) AS "${this.tableCategory}"`),
      )
      .whereBetween(`${this.table}.date`, [from, to])
      .orderBy(`${this.table}.date`, 'desc');
  }

  async get(id: number): Promise<Transaction> {
    return this.db(this.table)
      .where(`${this.table}.id`, id)
      .first();
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.db(this.table).insert({
      date: transaction.date,
      account: transaction.account,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      value: transaction.value
    }).returning([
      'id',
      'date',
      'account',
      'type',
      'category',
      'description',
      'amount',
      'value',
    ]);
    return result[0];
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const result = await this.db(this.table).where('id', transaction.id).update({
      date: transaction.date,
      account: transaction.account,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      value: transaction.value
    }).returning([
      'id',
      'date',
      'account',
      'type',
      'category',
      'description',
      'amount',
      'value',
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db(this.table).where('id', id).del();
  }

}
