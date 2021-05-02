import moment from 'moment';
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

  async list(): Promise<any> {
    let data: any = [];
    for (let i = 0; i < 3 ;i++) {
      const date = moment().subtract(i, 'months');
      const result = await this.model.list(
        date.startOf('month').format('YYYY-MM-DD'),
        date.endOf('month').format('YYYY-MM-DD')
      );
      if (data.length > 0) {
        result.forEach(x => {
          const found = data.find((y: any) => y.category === x.category);
          if (found) found[`m${i}`] = x.value || 0;
        });
      } else {
        data = result.map(x => ({ category: x.category, [`m${i}`]: x.value || 0 }));
      }
    }
    return data.sort((a: any, b: any) => a.m0 - b.m0);
  }

}
