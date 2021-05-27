import AccountModel from '../models/AccountModel';
import { Account } from '../interfaces/AccountInterface';

/**
* Account controller
*/
export default class AccountController {

  private accountModel;

  constructor () {
    this.accountModel = new AccountModel();
  }

  async list(): Promise<Account[]> {
    return this.accountModel.list();
  }

  async get(id: number): Promise<Account> {
    return this.accountModel.get(id);
  }

  async create(account: Account): Promise<Account> {
    return this.accountModel.create(account);
  }

  async update(account: Account): Promise<Account> {
    return this.accountModel.update(account);
  }

  async remove(id: number): Promise<void> {
    await this.accountModel.remove(id);
  }

}
