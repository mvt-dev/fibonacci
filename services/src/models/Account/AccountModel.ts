import DbModel from '../Db';
import { Account } from '../../interfaces/Account';

/**
* Account model
*/
export default class AccountModel extends DbModel {

  private table:string;

  constructor (table = 'account') {
    super({});
    this.table = table;
  }

  async list(): Promise<Account[]> {
    return this.db(this.table).orderBy('name');
  }

  async get(id: number): Promise<Account> {
    return this.db(this.table).where('id', id).first();
  }

  async create(account: Account): Promise<Account> {
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

  async update(account: Account): Promise<Account> {
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
