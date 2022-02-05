import axios from 'axios';
import moment from 'moment';

/**
* Finance model
*/
export default class FinanceModel {

  private ALPHA_VANTAGE_KEY = '4UVLCVWWTJ90JLO4';

  async getHistoricalData(symbol: string, full: boolean = false): Promise<any> {
    const TIME_PROPERTY = 'Time Series (Daily)';
    const outputsize = full ? 'full' : 'compact';
    const { data } = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.ALPHA_VANTAGE_KEY}`);
    return data[TIME_PROPERTY] ? Object.keys(data[TIME_PROPERTY]).map(key => ({
      date: key,
      open: data[TIME_PROPERTY][key]['1. open'] ? Number(data[TIME_PROPERTY][key]['1. open']) : null,
      high: data[TIME_PROPERTY][key]['2. high'] ? Number(data[TIME_PROPERTY][key]['2. high']) : null,
      low: data[TIME_PROPERTY][key]['3. low'] ? Number(data[TIME_PROPERTY][key]['3. low']) : null,
      close: data[TIME_PROPERTY][key]['4. close'] ? Number(data[TIME_PROPERTY][key]['4. close']) : null,
      closeAdjusted: data[TIME_PROPERTY][key]['4. close'] ? Number(data[TIME_PROPERTY][key]['4. close']) : null,
      volume: data[TIME_PROPERTY][key]['5. volume'] ? Number(data[TIME_PROPERTY][key]['5. volume']) : null,
    })) : [];
  }

  async getCurrencyHistory(symbolFrom: string, symbolTo: string, full: boolean = false): Promise<any> {
    const TIME_PROPERTY = 'Time Series FX (Daily)';
    const outputsize = full ? 'full' : 'compact';
    const { data } = await axios.get(`https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${symbolFrom}&to_symbol=${symbolTo}&outputsize=${outputsize}&apikey=${this.ALPHA_VANTAGE_KEY}`);
    return data[TIME_PROPERTY] ? Object.keys(data[TIME_PROPERTY]).map(key => ({
      date: key,
      open: data[TIME_PROPERTY][key]['1. open'] ? Number(data[TIME_PROPERTY][key]['1. open']) : null,
      high: data[TIME_PROPERTY][key]['2. high'] ? Number(data[TIME_PROPERTY][key]['2. high']) : null,
      low: data[TIME_PROPERTY][key]['3. low'] ? Number(data[TIME_PROPERTY][key]['3. low']) : null,
      close: data[TIME_PROPERTY][key]['4. close'] ? Number(data[TIME_PROPERTY][key]['4. close']) : null,
    })) : [];
  }

  async getCryptocurrencyHistory(symbol: string, market: string): Promise<any> {
    const TIME_PROPERTY = 'Time Series (Digital Currency Daily)';
    const { data } = await axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=${market}&apikey=${this.ALPHA_VANTAGE_KEY}`);
    return data[TIME_PROPERTY] ? Object.keys(data[TIME_PROPERTY]).map(key => ({
      date: key,
      open: data[TIME_PROPERTY][key][`1a. open (${market})`] ? Number(data[TIME_PROPERTY][key][`1a. open (${market})`]) : null,
      high: data[TIME_PROPERTY][key][`2a. high (${market})`] ? Number(data[TIME_PROPERTY][key][`2a. high (${market})`]) : null,
      low: data[TIME_PROPERTY][key][`3a. low (${market})`] ? Number(data[TIME_PROPERTY][key][`3a. low (${market})`]) : null,
      close: data[TIME_PROPERTY][key][`4a. close (${market})`] ? Number(data[TIME_PROPERTY][key][`4a. close (${market})`]) : null,
      volume: data[TIME_PROPERTY][key]['5. volume'] ? Number(data[TIME_PROPERTY][key]['5. volume']) : null,
    })) : [];
  }

  async getCryptocurrencyHistory2(symbol: string, from: moment.Moment, to: moment.Moment): Promise<any> {
    const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    url.searchParams.append('period1', moment(from).format('X'));
    url.searchParams.append('period2', moment(to).format('X'));
    url.searchParams.append('interval', '1d');
    url.searchParams.append('events', 'history');
    const { data } = await axios.get(url.href);
    return data.chart.result[0].timestamp.map((x: number, i: number) => ({
      date: moment.unix(x),
      open: data.chart.result[0].indicators.quote[0].open[i],
      high: data.chart.result[0].indicators.quote[0].high[i],
      low: data.chart.result[0].indicators.quote[0].low[i],
      close: data.chart.result[0].indicators.quote[0].close[i],
      volume: data.chart.result[0].indicators.quote[0].volume[i],
    }));
  }

}
