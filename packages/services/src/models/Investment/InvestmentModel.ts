import DbModel from '../Db';
import { InvestmentInterface } from '@fibonacci/interfaces';

/**
* Investment model
*/
export default class InvestmentModel extends DbModel {

  private table: string;

  constructor (table = 'v_investment_current') {
    super({});
    this.table = table;
  }

  async listCurrent(): Promise<InvestmentInterface.Investment[]> {
    return this.db(this.table);
  }

}
