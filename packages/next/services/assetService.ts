import request from '../libs/request';
import { AssetInterface } from '@fibonacci/interfaces';

const ENDPOINT = '/api/asset';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async ({ name, symbol, type }: AssetInterface.Asset) => {
  const { data } = await request.post(ENDPOINT, {
    name,
    symbol,
    type,
  });
  return data;
}

export const update = async ({ id, name, symbol, type }: AssetInterface.Asset) => {
  const { data } = await request.patch(`${ENDPOINT}/${id}`, {
    name,
    symbol,
    type,
  });
  return data;
}

export const remove = async (id: number | string) => {
  const { data } = await request.delete(`${ENDPOINT}/${id}`);
  return data;
}

export const updatePrices = async (assets: number[] = [], clean = false) => {
  const { data } = await request.patch(`${ENDPOINT}/price`);
  return data;
}
