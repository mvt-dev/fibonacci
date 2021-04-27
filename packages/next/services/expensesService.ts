import request from '../libs/request';

const ENDPOINT = '/api/expenses';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}
