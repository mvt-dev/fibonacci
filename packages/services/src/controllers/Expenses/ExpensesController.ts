import { ExpensesInterface } from '@fibonacci/interfaces';
import ExpensesModel from '../../models/Expenses';

/**
* Expenses controller
*/
export default class ExpensesController {

  private model;

  constructor () {
    this.model = new ExpensesModel();
  }

  async list(): Promise<ExpensesInterface.Expenses[]> {
    return this.model.list();
  }

}
