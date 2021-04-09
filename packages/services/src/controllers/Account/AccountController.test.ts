import AccountController from './AccountController';
import { AccountInterface } from '@fibonacci/interfaces';
import MOCK_ACCOUNTS from '../../../mock/accounts.json';

const mockList = jest.fn(() => Promise.resolve(MOCK_ACCOUNTS));
const mockGet = jest.fn(() => Promise.resolve(MOCK_ACCOUNTS[0]));
const mockCreate = jest.fn(() => Promise.resolve());
const mockUpdate = jest.fn(() => Promise.resolve());
const mockRemove = jest.fn(() => Promise.resolve());

jest.mock('../../models/Account', () => {
  return jest.fn().mockImplementation(() => {
    return {
      list: mockList,
      get: mockGet,
      create: mockCreate,
      update: mockUpdate,
      remove: mockRemove,
    };
  });
});

describe('AccountController', () => {

  const accountController = new AccountController();

  test('List', async () => {
    const accounts = await accountController.list();
    expect(mockList).toBeCalled();
    expect(accounts.length).toBe(4);
    expect(accounts[0]).toHaveProperty('id');
    expect(accounts[0]).toHaveProperty('name');
    expect(accounts[0]).toHaveProperty('type');
  });

  test('Get', async () => {
    const account = await accountController.get(MOCK_ACCOUNTS[0].id);
    expect(mockGet).toBeCalled();
    expect(account).toBeDefined();
    expect(account).toHaveProperty('id');
    expect(account).toHaveProperty('name');
    expect(account).toHaveProperty('type');
  });

  test('Create', async () => {
    const account = {
      id: MOCK_ACCOUNTS[0].id,
      name: MOCK_ACCOUNTS[0].name,
      type: MOCK_ACCOUNTS[0].type as AccountInterface.AccountType,
    };
    await accountController.create(account);
    expect(mockCreate).toBeCalled();
  });

  test('Update', async () => {
    const account = {
      id: MOCK_ACCOUNTS[0].id,
      name: MOCK_ACCOUNTS[0].name,
      type: MOCK_ACCOUNTS[0].type as AccountInterface.AccountType,
    };
    await accountController.update(account);
    expect(mockUpdate).toBeCalled();
  });

  test('Remove', async () => {
    await accountController.remove(MOCK_ACCOUNTS[0].id);
    expect(mockRemove).toBeCalled();
  });

});
