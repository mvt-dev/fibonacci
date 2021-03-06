import request from '../libs/request';
import { Asset } from '../interfaces/AssetInterface';

const ENDPOINT = '/api/asset';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async ({ name, symbol, type }: Asset) => {
  const { data } = await request.post(ENDPOINT, {
    name,
    symbol,
    type,
  });
  return data;
}

export const update = async ({ id, name, symbol, type }: Asset) => {
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

export const getPrices = async (id: number | string, from: string, to: string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}/price`, { params: {
    from,
    to,
  }});
  return data;
}
