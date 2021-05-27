import { Transaction } from '../interfaces/TransactionInterface';
import TransactionModel from '../models/TransactionModel';

/**
* Transaction controller
*/
export default class TransactionController {

  private model;

  constructor () {
    this.model = new TransactionModel();
  }

  async list(from: string, to: string): Promise<Transaction[]> {
    return this.model.list(from, to);
  }

  async get(id: number): Promise<Transaction> {
    return this.model.get(id);
  }

  async create(transaction: Transaction): Promise<Transaction> {
    return this.model.create(transaction);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    return this.model.update(transaction);
  }

  async remove(id: number): Promise<void> {
    await this.model.remove(id);
  }

}
