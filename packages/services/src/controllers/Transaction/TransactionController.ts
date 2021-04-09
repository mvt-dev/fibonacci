import { TransactionInterface } from '@fibonacci/interfaces';
import TransactionModel from '../../models/Transaction';

/**
* Transaction controller
*/
export default class TransactionController {

  private model;

  constructor () {
    this.model = new TransactionModel();
  }

  async list(from: string, to: string): Promise<TransactionInterface.Transaction[]> {
    return this.model.list(from, to);
  }

  async get(id: number): Promise<TransactionInterface.Transaction> {
    return this.model.get(id);
  }

  async create(transaction: TransactionInterface.Transaction): Promise<TransactionInterface.Transaction> {
    return this.model.create(transaction);
  }

  async update(transaction: TransactionInterface.Transaction): Promise<TransactionInterface.Transaction> {
    return this.model.update(transaction);
  }

  async remove(id: number): Promise<void> {
    await this.model.remove(id);
  }

}
