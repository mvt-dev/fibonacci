import request from '../libs/request';

const ENDPOINT = '/api/investment';

export const listCurrent = async () => {
  const { data } = await request.get(`${ENDPOINT}/current`);
  return data;
}
