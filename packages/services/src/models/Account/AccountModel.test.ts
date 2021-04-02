import { Knex } from 'knex';
import AccountModel from './AccountModel';
import MOCK_ACCOUNTS from '../../../mock/accounts.json';
import { AccountInterface } from '@fibonacci/interfaces';

describe('AccountModel', () => {

  const TABLE = 'test_account';
  const accountModel = new AccountModel(TABLE);

  beforeAll(async () => {
    await accountModel.db.schema.dropTableIfExists(TABLE);
    await accountModel.db.schema.createTable(TABLE, (table: Knex.TableBuilder) => {
      table.increments();
      table.string('name');
      table.string('type');
    });
    await accountModel.db.batchInsert(TABLE, MOCK_ACCOUNTS.map(({ name, type }) => ({
      name,
      type,
    })));
  });

  test('Select all', async () => {
    const accounts = await accountModel.list();
    expect(accounts.length).toBe(4);
    expect(accounts[0]).toHaveProperty('id');
    expect(accounts[0]).toHaveProperty('name');
    expect(accounts[0]).toHaveProperty('type');
  });

  test('Select one by id', async () => {
    const account = await accountModel.get(MOCK_ACCOUNTS[0].id);
    expect(account).toBeDefined();
    expect(account.id).toBe(MOCK_ACCOUNTS[0].id);
    expect(account.name).toBe(MOCK_ACCOUNTS[0].name);
    expect(account.type).toBe(MOCK_ACCOUNTS[0].type);
  });

  test('Create', async () => {
    const account: AccountInterface.Account = {
      name: 'Test',
      type: AccountInterface.AccountType.Transaction,
    };
    const result = await accountModel.create(account);
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(account.name);
    expect(result.type).toBe(account.type);
  });

  test('Update', async () => {
    const account: AccountInterface.Account = {
      id: 1,
      name: 'Test',
      type: AccountInterface.AccountType.Transaction,
    };
    const result = await accountModel.update(account);
    expect(result).toBeDefined();
    expect(result.id).toBe(account.id);
    expect(result.name).toBe(account.name);
    expect(result.type).toBe(account.type);
  });

  test('Remove', async () => {
    const result = await accountModel.remove(1);
    expect(result).toBe(1);
    const toBeNull = await accountModel.get(1);
    expect(toBeNull).toBeUndefined();
  });

});
