import request from '../libs/request';

const ENDPOINT = '/api/balance';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}
