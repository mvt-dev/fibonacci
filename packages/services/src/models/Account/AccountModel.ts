import DbModel from '../Db';
import { AccountInterface } from '@fibonacci/interfaces';

/**
* Account model
*/
export default class AccountModel extends DbModel {

  private table: string;

  constructor (table = 'account') {
    super({});
    this.table = table;
  }

  async list(): Promise<AccountInterface.Account[]> {
    return this.db(this.table).orderBy('name');
  }

  async get(id: number): Promise<AccountInterface.Account> {
    return this.db(this.table).where('id', id).first();
  }

  async create(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    const result = await this.db(this.table).insert({
      name: account.name,
      type: account.type,
    }).returning([
      'id',
      'name',
      'type',
    ]);
    return result[0];
  }

  async update(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    const result = await this.db(this.table).where('id', account.id).update({
      name: account.name,
      type: account.type,
    }).returning([
      'id',
      'name',
      'type',
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db(this.table).where('id', id).del();
  }

}
