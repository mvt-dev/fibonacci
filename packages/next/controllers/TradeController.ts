import moment from 'moment';
import TradeModel from '../models/TradeModel';
import { Trade } from '../interfaces/TradeInterface';

/**
* Trade controller
*/
export default class TradeController {

  private model;

  constructor () {
    this.model = new TradeModel();
  }

  async list(endDate: Date = null): Promise<Trade[]> {
    const results = await this.model.list(endDate || moment());
    return results.map(x => ({
      ...x,
      duration: moment(x.last).diff(moment(x.first)),
      result: x.result + x.profit,
      valorizationPercent: ((x.sell + x.profit) / x.buy - 1) * 100,
    })).sort((a: any, b: any) => (b.result || 0) - (a.result || 0));
  }

}
