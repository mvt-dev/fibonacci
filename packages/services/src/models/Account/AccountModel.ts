import DbModel from '../Db';
import { AccountInterface } from '@fibonacci/interfaces';

/**
* Account model
*/
export default class AccountModel extends DbModel {

  private table: string;
  private tableLedger: string;

  constructor (table = 'account', tableLedger = 'ledger') {
    super({});
    this.table = table;
    this.tableLedger = tableLedger;
  }

  async list(): Promise<AccountInterface.Account[]> {
    return this.db(this.table)
      .select(
        '*',
        this.db(this.tableLedger).sum(this.db.raw(`${this.tableLedger}.amount * ${this.tableLedger}.value`)).where(`${this.tableLedger}.account`, this.db.ref(`${this.table}.id`)).as('balance')
      )
      .orderBy('name');
  }

  async get(id: number): Promise<AccountInterface.Account> {
    return this.db(this.table).where('id', id).first();
  }

  async create(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    const result = await this.db(this.table).insert({
      name: account.name,
      type: account.type,
      currency: account.currency,
    }).returning([
      'id',
      'name',
      'type',
      'currency',
    ]);
    return result[0];
  }

  async update(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    const result = await this.db(this.table).where('id', account.id).update({
      name: account.name,
      type: account.type,
      currency: account.currency,
    }).returning([
      'id',
      'name',
      'type',
      'currency',
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db(this.table).where('id', id).del();
  }

}
