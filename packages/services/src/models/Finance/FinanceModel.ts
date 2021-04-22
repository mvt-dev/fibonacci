import axios from 'axios';

/**
* Finance model
*/
export default class FinanceModel {

  async getClosePrice(symbol: string): Promise<any> {
    const { data } = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    return {
      closePrice: data.chart.result[0].meta.regularMarketPrice,
      previousPrice: data.chart.result[0].meta.previousClose,
    };
  }

  async getCurrency(symbol: string): Promise<any> {
    const { data } = await axios.get(`https://query1.finance.yahoo.com/v7/finance/spark?symbols=${symbol}%3DX`);
    return {
      closePrice: data.spark.result[0].response[0].meta.regularMarketPrice,
      previousPrice: data.spark.result[0].response[0].meta.previousClose,
    };
  }

}
