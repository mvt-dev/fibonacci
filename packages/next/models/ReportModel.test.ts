import { Knex } from 'knex';
import moment from 'moment';
import ReportModel from './ReportModel';
import { Account, AccountType, AccountCurrency } from '../interfaces/AccountInterface';

describe('ReportModel', () => {

  const reportModel = new ReportModel();

  test('List', async () => {
    const date = moment();
    const report = await reportModel.list(date.clone().subtract(1, 'month').format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
    console.log(report[0]);
    expect(report[0].asset).toBeDefined();
  });

});
