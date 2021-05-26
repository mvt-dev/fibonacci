import request from '../libs/request';

const ENDPOINT = '/api/finance';

export const getAssetPrice = async (symbol: string) => {
  const { data } = await request.get(`${ENDPOINT}/asset/${symbol}`);
  return data;
}

export const getCurrencyPrice = async (symbol: string) => {
  const { data } = await request.get(`${ENDPOINT}/currency/${symbol}`);
  return data;
}

export const getHistoricalData = async (symbol: string) => {
  const { data } = await request.get(`${ENDPOINT}/history/${symbol}`);
  return data;
}
