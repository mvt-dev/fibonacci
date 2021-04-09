import request from '../libs/request';
import { TransactionInterface } from '@fibonacci/interfaces';

const ENDPOINT = '/api/transaction';

export const list = async (from: string, to: string) => {
  const { data } = await request.get(`${ENDPOINT}?from=${from}&to=${to}`);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async ({
  date,
  account,
  category,
  description,
  amount,
  value,
}: TransactionInterface.Transaction) => {
  const { data } = await request.post(ENDPOINT, {
    date,
    account,
    category,
    description,
    amount,
    value,
  });
  return data;
}

export const update = async ({
  id,
  date,
  account,
  category,
  description,
  amount,
  value,
}: TransactionInterface.Transaction) => {
  const { data } = await request.patch(`${ENDPOINT}/${id}`, {
    date,
    account,
    category,
    description,
    amount,
    value,
  });
  return data;
}

export const remove = async (id: number | string) => {
  const { data } = await request.delete(`${ENDPOINT}/${id}`);
  return data;
}
