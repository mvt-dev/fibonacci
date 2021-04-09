import { Knex } from 'knex';
import LedgerModel from './LedgerModel';
import MOCK_LEDGERS from '../../../mock/ledgers.json';
import DateHelper from '../../helpers/Date';
import { Ledger, LEDGER_CREDIT, LEDGER_DEBIT } from '../../interfaces/Ledger';

describe('LedgerModel', () => {

  const ledgerModel = new LedgerModel({ database: 'fibonacci_test' });

  beforeAll(async () => {
    await ledgerModel.db.schema.dropTableIfExists('ledger');
    await ledgerModel.db.schema.createTable('ledger', (table: Knex.TableBuilder) => {
      table.increments();
      table.date('date');
      table.string('asset');
      table.string('type');
      table.float('amount');
      table.float('value', 2);
    });
    await ledgerModel.db.batchInsert('ledger', MOCK_LEDGERS.map(x => ({
      date: DateHelper.toUTCString(DateHelper.fromUTC(x.date)),
      asset: x.asset,
      type: x.type,
      amount: x.amount,
      value: x.value,
    })));
  });

  test('Select all', async () => {
    const ledgers = await ledgerModel.list();
    expect(ledgers.length).toBe(4);
    expect(ledgers[0]).toHaveProperty('id');
    expect(ledgers[0]).toHaveProperty('date');
    expect(ledgers[0]).toHaveProperty('asset');
    expect(ledgers[0]).toHaveProperty('type');
    expect(ledgers[0]).toHaveProperty('amount');
    expect(ledgers[0]).toHaveProperty('value');
  });

  test('Select one by id', async () => {
    const ledger = await ledgerModel.get(MOCK_LEDGERS[0].id);
    expect(ledger).toBeDefined();
    expect(ledger.id).toBe(MOCK_LEDGERS[0].id);
    expect(ledger.date).toStrictEqual(DateHelper.fromUTC(MOCK_LEDGERS[0].date));
    expect(ledger.asset).toBe(MOCK_LEDGERS[0].asset);
    expect(ledger.type).toBe(MOCK_LEDGERS[0].type);
    expect(ledger.amount).toBe(MOCK_LEDGERS[0].amount);
    expect(ledger.value).toBe(MOCK_LEDGERS[0].value);
  });

  test('Create', async () => {
    const ledger = {
      date: DateHelper.fromUTC('2021-01-01'),
      asset: 'ASSET',
      type: LEDGER_CREDIT,
      amount: 1,
      value: 99.99
    };
    const result = await ledgerModel.create(ledger);
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.date).toStrictEqual(ledger.date);
    expect(result.asset).toBe(ledger.asset);
    expect(result.type).toBe(ledger.type);
    expect(result.amount).toBe(ledger.amount);
    expect(result.value).toBe(ledger.value);
  });

  test('Update', async () => {
    const ledger = {
      id: 1,
      date: DateHelper.fromUTC('2021-01-01'),
      asset: 'ASSET',
      type: LEDGER_CREDIT,
      amount: 1,
      value: 99.99
    };
    const result = await ledgerModel.update(ledger);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.date).toStrictEqual(ledger.date);
    expect(result.asset).toBe(ledger.asset);
    expect(result.type).toBe(ledger.type);
    expect(result.amount).toBe(ledger.amount);
    expect(result.value).toBe(ledger.value);
  });

  test('Remove', async () => {
    const result = await ledgerModel.remove(1);
    expect(result).toBe(1);
    const toBeNull = await ledgerModel.get(1);
    expect(toBeNull).toBeUndefined();
  });

});
