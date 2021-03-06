import request from '../libs/request';
import { Transaction } from '../interfaces/TransactionInterface';

const ENDPOINT = '/api/transaction';

export const list = async (from: string, to: string) => {
  const { data } = await request.get(`${ENDPOINT}?from=${from}&to=${to}`);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async (transaction: Transaction) => {
  const { data } = await request.post(ENDPOINT, transaction);
  return data;
}

export const update = async ({ id, ...transaction }: Transaction) => {
  const { data } = await request.patch(`${ENDPOINT}/${id}`, transaction);
  return data;
}

export const remove = async (id: number | string) => {
  const { data } = await request.delete(`${ENDPOINT}/${id}`);
  return data;
}
