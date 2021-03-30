import request from '../libs/request';

const ENDPOINT = '/api/account';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async ({ name, type }: { name: string, type: string }) => {
  const { data } = await request.post(ENDPOINT, {
    name,
    type,
  });
  return data;
}

export const update = async ({ id, name, type }: { id: number | string, name: string, type: string }) => {
  const { data } = await request.patch(`${ENDPOINT}/${id}`, {
    name,
    type,
  });
  return data;
}

export const remove = async (id: number | string) => {
  const { data } = await request.delete(`${ENDPOINT}/${id}`);
  return data;
}
