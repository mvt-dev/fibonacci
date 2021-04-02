import { AccountInterface } from '@fibonacci/interfaces';
import AccountModel from '../../models/Account';

/**
* Account controller
*/
export default class AccountController {

  private accountModel;

  constructor () {
    this.accountModel = new AccountModel();
  }

  async list(): Promise<AccountInterface.Account[]> {
    return this.accountModel.list();
  }

  async get(id: number): Promise<AccountInterface.Account> {
    return this.accountModel.get(id);
  }

  async create(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    return this.accountModel.create(account);
  }

  async update(account: AccountInterface.Account): Promise<AccountInterface.Account> {
    return this.accountModel.update(account);
  }

  async remove(id: number): Promise<void> {
    await this.accountModel.remove(id);
  }

}
