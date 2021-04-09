import request from '../libs/request';
import { CategoryInterface } from '@fibonacci/interfaces';

const ENDPOINT = '/api/category';

export const list = async () => {
  const { data } = await request.get(ENDPOINT);
  return data;
}

export const get = async (id: number | string) => {
  const { data } = await request.get(`${ENDPOINT}/${id}`);
  return data;
}

export const create = async ({ name, color, tag }: CategoryInterface.Category) => {
  const { data } = await request.post(ENDPOINT, {
    name,
    color,
    tag,
  });
  return data;
}

export const update = async ({ id, name, color, tag }: CategoryInterface.Category) => {
  const { data } = await request.patch(`${ENDPOINT}/${id}`, {
    name,
    color,
    tag,
  });
  return data;
}

export const remove = async (id: number | string) => {
  const { data } = await request.delete(`${ENDPOINT}/${id}`);
  return data;
}
