import axios from 'axios';

/**
* Finance model
*/
export default class FinanceModel {

  private ALPHA_VANTAGE_KEY = '4UVLCVWWTJ90JLO4';

  async getHistoricalData(symbol: string, full: boolean = false): Promise<any> {
    const TIME_PROPERTY = 'Time Series (Daily)';
    const outputsize = full ? 'full' : 'compact';
    const { data } = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.ALPHA_VANTAGE_KEY}`);
    return data[TIME_PROPERTY] ? Object.keys(data[TIME_PROPERTY]).map(key => ({
      date: key,
      open: data[TIME_PROPERTY][key]['1. open'] ? Number(data[TIME_PROPERTY][key]['1. open']) : null,
      high: data[TIME_PROPERTY][key]['2. high'] ? Number(data[TIME_PROPERTY][key]['2. high']) : null,
      low: data[TIME_PROPERTY][key]['3. low'] ? Number(data[TIME_PROPERTY][key]['3. low']) : null,
      close: data[TIME_PROPERTY][key]['4. close'] ? Number(data[TIME_PROPERTY][key]['4. close']) : null,
      closeAdjusted: data[TIME_PROPERTY][key]['5. adjusted close'] ? Number(data[TIME_PROPERTY][key]['5. adjusted close']) : null,
      volume: data[TIME_PROPERTY][key]['6. volume'] ? Number(data[TIME_PROPERTY][key]['6. volume']) : null,
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

}
