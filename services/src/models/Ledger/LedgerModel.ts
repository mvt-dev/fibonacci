import DbModel from '../Db';
import { Ledger } from '../../interfaces/Ledger';
import DateHelper from '../../helpers/Date';

/**
* Ledger model
*/
export default class LedgerModel extends DbModel {

  async list(): Promise<Ledger[]> {
    return this.db('ledger').orderBy('date');
  }

  async get(id: number): Promise<Ledger> {
    return this.db('ledger').where('id', id).first();
  }

  async create(ledger: Ledger): Promise<Ledger> {
    const result = await this.db('ledger').insert({
      date: DateHelper.toUTCString(ledger.date),
      asset: ledger.asset,
      type: ledger.type,
      amount: ledger.amount,
      value: ledger.value,
    }).returning([
      'id',
      'date',
      'asset',
      'type',
      'amount',
      'value'
    ]);
    return result[0];
  }

  async update(ledger: Ledger): Promise<Ledger> {
    const result = await this.db('ledger').where('id', ledger.id).update({
      date: DateHelper.toUTCString(ledger.date),
      asset: ledger.asset,
      type: ledger.type,
      amount: ledger.amount,
      value: ledger.value,
    }).returning([
      'id',
      'date',
      'asset',
      'type',
      'amount',
      'value'
    ]);
    return result[0];
  }

  async remove(id: number): Promise<void> {
    return this.db('ledger').where('id', id).del();
  }

}
